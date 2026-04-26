import { assertFalse, assertStringIncludes } from "@std/assert";
import { formatWalletSummary } from "./balance-format.ts";

const BEFORE = {
  walletAddress: "wallet-1",
  balances: [
    {
      symbol: "SOL",
      mint: "So11111111111111111111111111111111111111112",
      amount: "0.5",
      rawAmount: "500000000",
    },
    {
      symbol: "USDC",
      mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      amount: "104",
      rawAmount: "104000000",
    },
  ],
};

Deno.test("formatWalletSummary hides raw lamports and base units", () => {
  const output = formatWalletSummary(BEFORE);

  assertStringIncludes(output, "SOL: 0.5");
  assertStringIncludes(output, "USDC: 104");
  assertFalse(output.includes("lamports"));
  assertFalse(output.includes("base units"));
  assertFalse(output.includes("500000000"));
});
