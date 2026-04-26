import { assertFalse, assertStringIncludes } from "@std/assert";
import { formatSwapResult } from "./swap-command.ts";

Deno.test("formatSwapResult includes explorer and human-readable execution amounts", () => {
  const output = formatSwapResult({
    mode: "execute",
    requestId: "request-1",
    inputToken: {
      symbol: "SOL",
      mint: "So11111111111111111111111111111111111111112",
      decimals: 9,
    },
    outputToken: {
      symbol: "USDC",
      mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      decimals: 6,
    },
    displayAmount: "0.01",
    rawAmount: "10000000",
    signature: "swap-signature",
    explorerUrl: "https://solscan.io/tx/swap-signature",
    inputAmountResult: "10000000",
    outputAmountResult: "1000000",
  });

  assertStringIncludes(
    output,
    "explorer: https://solscan.io/tx/swap-signature",
  );
  assertStringIncludes(output, "actual input: 0.01 SOL");
  assertStringIncludes(output, "actual output: 1 USDC");
  assertFalse(output.includes("Wallet balances before:"));
  assertFalse(output.includes("Wallet balances after:"));
  assertFalse(output.includes("lamports"));
  assertFalse(output.includes("base units"));
  assertFalse(output.includes("inputAmountResult"));
});
