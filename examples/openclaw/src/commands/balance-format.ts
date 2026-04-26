import type { WalletSummary } from "../usecases/wallet/usecase.ts";

export function formatWalletSummary(summary: WalletSummary): string {
  return [
    "# OpenClaw Jupiter Wallet",
    "",
    `Address: ${summary.walletAddress}`,
    ...summary.balances.map((balance) =>
      `${balance.symbol}: ${balance.amount}`
    ),
  ].join("\n");
}
