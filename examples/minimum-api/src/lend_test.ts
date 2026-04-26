import { assertEquals, assertStringIncludes, assertThrows } from "@std/assert";
import {
  buildEarnPostBody,
  buildInsufficientUsdcBalanceError,
  DEFAULT_LEND_ASSET,
  formatUsdcAmount,
  getEarnEndpoint,
  isInstructionAction,
  isTransactionAction,
  parseLendCliArgs,
  selectMinimumTestLendAmount,
} from "./helpers/lend.ts";

Deno.test("selectMinimumTestLendAmount returns the minimum viable deposit in base units", () => {
  assertEquals(selectMinimumTestLendAmount(85_084n), 10n);
});

Deno.test("selectMinimumTestLendAmount throws with exact required and missing amount when wallet is below the minimum viable deposit", () => {
  const error = assertThrows(
    () => selectMinimumTestLendAmount(9n),
  ) as Error;

  assertStringIncludes(error.message, "need at least 0.000010 USDC");
  assertStringIncludes(error.message, "wallet has 0.000009 USDC");
  assertStringIncludes(error.message, "short 0.000001 USDC");
});

Deno.test("buildInsufficientUsdcBalanceError includes UI amount and decimal-based unit details", () => {
  const error = buildInsufficientUsdcBalanceError(85_084n, 100_000n);

  assertStringIncludes(error.message, "wallet has 0.085084 USDC");
  assertStringIncludes(error.message, "need at least 0.100000 USDC");
  assertStringIncludes(error.message, "short 0.014916 USDC");
  assertStringIncludes(error.message, "85084 base units");
  assertStringIncludes(error.message, "100000 base units");
  assertStringIncludes(error.message, "0.085084 USDC");
  assertStringIncludes(error.message, "0.014916 USDC");
});

Deno.test("formatUsdcAmount renders six decimal places without trimming precision", () => {
  assertEquals(formatUsdcAmount(1n), "0.000001");
  assertEquals(formatUsdcAmount(10n), "0.000010");
  assertEquals(formatUsdcAmount(85_084n), "0.085084");
});

Deno.test("parseLendCliArgs defaults to wallet summary", () => {
  const options = parseLendCliArgs([]);

  assertEquals(options.action, "summary");
  assertEquals(options.asset, DEFAULT_LEND_ASSET);
  assertEquals(options.execute, false);
});

Deno.test("parseLendCliArgs parses action flags and execute mode", () => {
  const options = parseLendCliArgs([
    "withdraw",
    "--asset",
    "asset-mint",
    "--amount",
    "123",
    "--execute",
  ]);

  assertEquals(options.action, "withdraw");
  assertEquals(options.asset, "asset-mint");
  assertEquals(options.amount, 123n);
  assertEquals(options.execute, true);
});

Deno.test("parseLendCliArgs parses comma-separated earnings positions", () => {
  const options = parseLendCliArgs([
    "earnings",
    "--user",
    "wallet",
    "--positions",
    "jlUSDC,jlSOL",
  ]);

  assertEquals(options.action, "earnings");
  assertEquals(options.user, "wallet");
  assertEquals(options.positions, ["jlUSDC", "jlSOL"]);
});

Deno.test("getEarnEndpoint covers every Jupiter Earn REST endpoint", () => {
  assertEquals(getEarnEndpoint("tokens"), "/lend/v1/earn/tokens");
  assertEquals(getEarnEndpoint("positions"), "/lend/v1/earn/positions");
  assertEquals(getEarnEndpoint("earnings"), "/lend/v1/earn/earnings");
  assertEquals(getEarnEndpoint("deposit"), "/lend/v1/earn/deposit");
  assertEquals(getEarnEndpoint("withdraw"), "/lend/v1/earn/withdraw");
  assertEquals(getEarnEndpoint("mint"), "/lend/v1/earn/mint");
  assertEquals(getEarnEndpoint("redeem"), "/lend/v1/earn/redeem");
  assertEquals(
    getEarnEndpoint("deposit-instructions"),
    "/lend/v1/earn/deposit-instructions",
  );
  assertEquals(
    getEarnEndpoint("withdraw-instructions"),
    "/lend/v1/earn/withdraw-instructions",
  );
  assertEquals(
    getEarnEndpoint("mint-instructions"),
    "/lend/v1/earn/mint-instructions",
  );
  assertEquals(
    getEarnEndpoint("redeem-instructions"),
    "/lend/v1/earn/redeem-instructions",
  );
});

Deno.test("buildEarnPostBody uses amount for deposit and withdraw variants", () => {
  const body = buildEarnPostBody(
    "deposit-instructions",
    {
      action: "deposit-instructions",
      asset: "asset-mint",
      amount: 10n,
      execute: false,
    },
    "signer",
  );

  assertEquals(body, {
    asset: "asset-mint",
    signer: "signer",
    amount: "10",
  });
});

Deno.test("buildEarnPostBody uses shares for mint and redeem variants", () => {
  const body = buildEarnPostBody(
    "redeem",
    {
      action: "redeem",
      asset: "asset-mint",
      shares: 20n,
      execute: false,
    },
    "signer",
  );

  assertEquals(body, {
    asset: "asset-mint",
    signer: "signer",
    shares: "20",
  });
});

Deno.test("action classifiers separate transactions and instruction builders", () => {
  assertEquals(isTransactionAction("deposit"), true);
  assertEquals(isTransactionAction("deposit-instructions"), false);
  assertEquals(isInstructionAction("redeem-instructions"), true);
  assertEquals(isInstructionAction("redeem"), false);
});
