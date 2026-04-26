import { DEFAULT_SWAP } from "../../config/demo-defaults.ts";
import { createPriceApi, type PriceApi } from "../../lib/jupiter/price-api.ts";
import {
  createSwapApi,
  type SwapApi,
  type SwapExecuteResponse,
  type SwapOrderRequest,
  type SwapOrderResponse,
} from "../../lib/jupiter/swap-api.ts";
import { signBase64Transaction } from "../../lib/solana/transactions.ts";
import { type DemoWallet, getWallet } from "../../lib/solana/wallet.ts";
import { formatBaseUnits, parseBaseUnits } from "../../utils/amounts.ts";
import type { DemoEnv } from "../../utils/env.ts";
import {
  ExternalServiceError,
  TransactionExecutionError,
  ValidationError,
} from "../../utils/errors.ts";
import { resolveToken, type TokenMetadata } from "../../utils/tokens.ts";
import { buildSolscanTransactionUrl } from "../../utils/urls.ts";

export interface SwapCommandInput {
  input?: string;
  output?: string;
  amount?: string;
  outputAmount?: string;
  execute: boolean;
}

export interface SwapResult {
  mode: "dry-run" | "execute";
  requestId: string;
  inputToken: TokenMetadata;
  outputToken: TokenMetadata;
  displayAmount: string;
  outputDisplayAmount?: string;
  rawAmount: string;
  signature?: string;
  explorerUrl?: string;
  inputAmountResult?: string;
  outputAmountResult?: string;
}

export interface SwapUsecaseDependencies {
  resolveToken: (aliasOrMint: string) => TokenMetadata;
  parseBaseUnits: (amount: string, decimals: number) => bigint;
  getWallet: (privateKey: string) => Promise<DemoWallet>;
  signTransaction: (txBase64: string, wallet: DemoWallet) => Promise<string>;
  priceApi: PriceApi;
  swapApi: SwapApi;
}

function createDefaultDependencies(env: DemoEnv): SwapUsecaseDependencies {
  return {
    resolveToken,
    parseBaseUnits,
    getWallet,
    signTransaction: signBase64Transaction,
    priceApi: createPriceApi(),
    swapApi: createSwapApi(env),
  };
}

function validateAmount(
  amount: string,
  decimals: number,
  parseAmount: (amount: string, decimals: number) => bigint,
): bigint {
  try {
    return parseAmount(amount, decimals);
  } catch (error) {
    throw new ValidationError(
      error instanceof Error ? error.message : String(error),
    );
  }
}

function ensureOrderTransaction(order: SwapOrderResponse): string {
  if (order.error) {
    throw new ExternalServiceError(
      "Jupiter Swap API",
      `order request failed: ${order.error}`,
    );
  }
  if (!order.transaction) {
    throw new ExternalServiceError(
      "Jupiter Swap API",
      "order request failed: no transaction returned",
    );
  }
  return order.transaction;
}

function estimateInputRawAmount(
  targetOutputRaw: bigint,
  inputToken: TokenMetadata,
  outputToken: TokenMetadata,
  inputUsdPrice: number,
  outputUsdPrice: number,
): bigint {
  if (!Number.isFinite(inputUsdPrice) || inputUsdPrice <= 0) {
    throw new ValidationError(
      `Missing valid USD price for ${inputToken.symbol}`,
    );
  }
  if (!Number.isFinite(outputUsdPrice) || outputUsdPrice <= 0) {
    throw new ValidationError(
      `Missing valid USD price for ${outputToken.symbol}`,
    );
  }

  const targetOutputUnits = Number(targetOutputRaw) /
    (10 ** outputToken.decimals);
  const estimatedInputUnits = targetOutputUnits * outputUsdPrice /
    inputUsdPrice;
  const estimatedRaw = Math.ceil(
    estimatedInputUnits * (10 ** inputToken.decimals),
  );

  if (!Number.isSafeInteger(estimatedRaw) || estimatedRaw <= 0) {
    throw new ValidationError("Estimated input amount is invalid");
  }

  return BigInt(estimatedRaw);
}

async function resolveSwapAmount(
  input: SwapCommandInput,
  inputToken: TokenMetadata,
  outputToken: TokenMetadata,
  deps: SwapUsecaseDependencies,
): Promise<{
  displayAmount: string;
  outputDisplayAmount?: string;
  rawAmount: bigint;
}> {
  if (input.amount && input.outputAmount) {
    throw new ValidationError(
      "Use either --amount or --output-amount, not both",
    );
  }

  if (input.outputAmount) {
    const targetOutputRaw = validateAmount(
      input.outputAmount,
      outputToken.decimals,
      deps.parseBaseUnits,
    );
    const prices = await deps.priceApi.getPrices([
      inputToken.mint,
      outputToken.mint,
    ]);
    const rawAmount = estimateInputRawAmount(
      targetOutputRaw,
      inputToken,
      outputToken,
      prices[inputToken.mint]?.usdPrice,
      prices[outputToken.mint]?.usdPrice,
    );

    return {
      displayAmount: formatBaseUnits(rawAmount, inputToken.decimals),
      outputDisplayAmount: input.outputAmount,
      rawAmount,
    };
  }

  const displayAmount = input.amount ?? DEFAULT_SWAP.amount;
  return {
    displayAmount,
    rawAmount: validateAmount(
      displayAmount,
      inputToken.decimals,
      deps.parseBaseUnits,
    ),
  };
}

function ensureExecuteSuccess(
  result: SwapExecuteResponse,
): { signature: string } {
  if (result.status !== "Success" || !result.signature) {
    throw new TransactionExecutionError(
      `Swap execute failed: ${result.error ?? "unknown error"}`,
    );
  }
  return { signature: result.signature };
}

export async function executeSwapUsecase(
  env: DemoEnv,
  input: SwapCommandInput,
  dependencies: Partial<SwapUsecaseDependencies> = {},
): Promise<SwapResult> {
  const deps = { ...createDefaultDependencies(env), ...dependencies };
  const inputToken = deps.resolveToken(input.input ?? DEFAULT_SWAP.input);
  const outputToken = deps.resolveToken(input.output ?? DEFAULT_SWAP.output);
  const { displayAmount, outputDisplayAmount, rawAmount } =
    await resolveSwapAmount(input, inputToken, outputToken, deps);
  const wallet = await deps.getWallet(env.PRIVATE_KEY);

  let order: SwapOrderResponse;
  try {
    const request: SwapOrderRequest = {
      inputMint: inputToken.mint,
      outputMint: outputToken.mint,
      amount: rawAmount.toString(),
      taker: wallet.address,
    };
    order = await deps.swapApi.order(request);
  } catch (error) {
    if (error instanceof ExternalServiceError) throw error;
    throw new ExternalServiceError(
      "Jupiter Swap API",
      "order request failed",
      error,
    );
  }

  const transaction = ensureOrderTransaction(order);

  if (!input.execute) {
    return {
      mode: "dry-run",
      requestId: order.requestId,
      inputToken,
      outputToken,
      displayAmount,
      outputDisplayAmount,
      rawAmount: rawAmount.toString(),
    };
  }

  const signedTransaction = await deps.signTransaction(transaction, wallet);
  let result: SwapExecuteResponse;
  try {
    result = await deps.swapApi.execute({
      signedTransaction,
      requestId: order.requestId,
    });
  } catch (error) {
    throw new ExternalServiceError(
      "Jupiter Swap API",
      "execute request failed",
      error,
    );
  }

  const { signature } = ensureExecuteSuccess(result);
  return {
    mode: "execute",
    requestId: order.requestId,
    inputToken,
    outputToken,
    displayAmount,
    outputDisplayAmount,
    rawAmount: rawAmount.toString(),
    signature,
    explorerUrl: buildSolscanTransactionUrl(signature),
    inputAmountResult: result.inputAmountResult,
    outputAmountResult: result.outputAmountResult,
  };
}
