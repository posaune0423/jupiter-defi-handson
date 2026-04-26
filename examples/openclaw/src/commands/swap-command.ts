import { getBooleanArg, getStringArg, parseArgs } from "../utils/args.ts";
import { loadEnv } from "../utils/env.ts";
import {
  formatErrorMessage,
  TransactionExecutionError,
} from "../utils/errors.ts";
import { formatBaseUnits } from "../utils/amounts.ts";
import {
  executeSwapUsecase,
  type SwapResult,
} from "../usecases/swap/usecase.ts";

export function formatSwapResult(result: SwapResult): string {
  const lines = [
    `[swap] Requesting order: ${result.displayAmount} ${result.inputToken.symbol} -> ${result.outputToken.symbol}`,
    `[swap] Order received: requestId=${result.requestId}`,
  ];
  if (result.outputDisplayAmount) {
    lines.splice(
      1,
      0,
      `[swap] Target output value: ${result.outputDisplayAmount} ${result.outputToken.symbol}`,
    );
  }

  if (result.mode === "dry-run") {
    lines.push(
      "[swap] Dry run complete. Use deno task swap:execute to sign and execute a fresh order.",
    );
    return lines.join("\n");
  }

  lines.push("[swap] Success");
  lines.push(`signature: ${result.signature}`);
  lines.push(`explorer: ${result.explorerUrl}`);
  if (result.inputAmountResult) {
    lines.push(
      `actual input: ${
        formatBaseUnits(
          BigInt(result.inputAmountResult),
          result.inputToken.decimals,
        )
      } ${result.inputToken.symbol}`,
    );
  }
  if (result.outputAmountResult) {
    lines.push(
      `actual output: ${
        formatBaseUnits(
          BigInt(result.outputAmountResult),
          result.outputToken.decimals,
        )
      } ${result.outputToken.symbol}`,
    );
  }
  return lines.join("\n");
}

function printError(error: unknown): never {
  console.error(`[swap] ${formatErrorMessage(error)}`);
  if (error instanceof TransactionExecutionError && error.logs.length > 0) {
    for (const line of error.logs) console.error(line);
  }
  Deno.exit(1);
}

export async function runSwapCommand(args = Deno.args): Promise<void> {
  try {
    const parsed = parseArgs(args);
    const env = loadEnv();
    const execute = getBooleanArg(parsed, "execute");
    const result = await executeSwapUsecase(env, {
      input: getStringArg(parsed, "input"),
      output: getStringArg(parsed, "output"),
      amount: getStringArg(parsed, "amount"),
      outputAmount: getStringArg(parsed, "output-amount"),
      execute,
    });
    console.log(formatSwapResult(result));
  } catch (error) {
    printError(error);
  }
}
