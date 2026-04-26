const USDC_DECIMALS = 6n;
const USDC_BASE_UNIT_SCALE = 10n ** USDC_DECIMALS;
const MINIMUM_TEST_LEND_AMOUNT = 10n;
export const DEFAULT_LEND_ASSET =
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

export type EarnAction =
  | "summary"
  | "tokens"
  | "positions"
  | "earnings"
  | "deposit"
  | "withdraw"
  | "mint"
  | "redeem"
  | "deposit-instructions"
  | "withdraw-instructions"
  | "mint-instructions"
  | "redeem-instructions";

export interface LendCliOptions {
  action: EarnAction;
  asset: string;
  amount?: bigint;
  shares?: bigint;
  user?: string;
  positions?: string[];
  execute: boolean;
}

const VALID_ACTIONS = new Set<EarnAction>([
  "summary",
  "tokens",
  "positions",
  "earnings",
  "deposit",
  "withdraw",
  "mint",
  "redeem",
  "deposit-instructions",
  "withdraw-instructions",
  "mint-instructions",
  "redeem-instructions",
]);

export function parseLendCliArgs(args: string[]): LendCliOptions {
  const [maybeAction, ...rest] = args;
  const action = maybeAction && !maybeAction.startsWith("--")
    ? maybeAction as EarnAction
    : "summary";
  const flags = action === "summary" ? args : rest;

  if (!VALID_ACTIONS.has(action)) {
    throw new Error(
      `Unknown lend action "${action}". Expected one of: ${
        [...VALID_ACTIONS].join(", ")
      }`,
    );
  }

  const options: LendCliOptions = {
    action,
    asset: DEFAULT_LEND_ASSET,
    execute: false,
  };

  for (let i = 0; i < flags.length; i++) {
    const flag = flags[i];
    const value = flags[i + 1];

    if (flag === "--execute") {
      options.execute = true;
      continue;
    }

    if (!flag.startsWith("--")) {
      throw new Error(`Unexpected argument "${flag}"`);
    }

    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for ${flag}`);
    }

    i++;
    switch (flag) {
      case "--asset":
        options.asset = value;
        break;
      case "--amount":
        options.amount = BigInt(value);
        break;
      case "--shares":
        options.shares = BigInt(value);
        break;
      case "--user":
        options.user = value;
        break;
      case "--positions":
        options.positions = value.split(",").map((position) => position.trim())
          .filter(Boolean);
        break;
      default:
        throw new Error(`Unknown flag "${flag}"`);
    }
  }

  return options;
}

export function getEarnEndpoint(action: EarnAction): string {
  switch (action) {
    case "tokens":
      return "/lend/v1/earn/tokens";
    case "positions":
      return "/lend/v1/earn/positions";
    case "earnings":
      return "/lend/v1/earn/earnings";
    case "deposit":
      return "/lend/v1/earn/deposit";
    case "withdraw":
      return "/lend/v1/earn/withdraw";
    case "mint":
      return "/lend/v1/earn/mint";
    case "redeem":
      return "/lend/v1/earn/redeem";
    case "deposit-instructions":
      return "/lend/v1/earn/deposit-instructions";
    case "withdraw-instructions":
      return "/lend/v1/earn/withdraw-instructions";
    case "mint-instructions":
      return "/lend/v1/earn/mint-instructions";
    case "redeem-instructions":
      return "/lend/v1/earn/redeem-instructions";
    case "summary":
      throw new Error(
        "summary is a local aggregate action, not an API endpoint",
      );
  }
}

export function buildEarnPostBody(
  action: EarnAction,
  options: LendCliOptions,
  signer: string,
): Record<string, string> {
  if (
    action === "deposit" || action === "withdraw" ||
    action === "deposit-instructions" || action === "withdraw-instructions"
  ) {
    if (options.amount === undefined) {
      throw new Error(`--amount is required for ${action}`);
    }

    return {
      asset: options.asset,
      signer,
      amount: options.amount.toString(),
    };
  }

  if (
    action === "mint" || action === "redeem" ||
    action === "mint-instructions" || action === "redeem-instructions"
  ) {
    if (options.shares === undefined) {
      throw new Error(`--shares is required for ${action}`);
    }

    return {
      asset: options.asset,
      signer,
      shares: options.shares.toString(),
    };
  }

  throw new Error(`${action} does not use a POST body`);
}

export function isTransactionAction(action: EarnAction): boolean {
  return action === "deposit" || action === "withdraw" || action === "mint" ||
    action === "redeem";
}

export function isInstructionAction(action: EarnAction): boolean {
  return action.endsWith("-instructions");
}

export function formatUsdcAmount(baseUnits: bigint): string {
  const whole = baseUnits / USDC_BASE_UNIT_SCALE;
  const fractional = baseUnits % USDC_BASE_UNIT_SCALE;
  return `${whole}.${
    fractional.toString().padStart(Number(USDC_DECIMALS), "0")
  }`;
}

export function formatBaseUnits(
  baseUnits: bigint | string | number,
  decimals: number,
): string {
  const raw = BigInt(baseUnits);
  const scale = 10n ** BigInt(decimals);
  const whole = raw / scale;
  const fractional = raw % scale;
  return `${whole}.${fractional.toString().padStart(decimals, "0")}`;
}

export function buildInsufficientUsdcBalanceError(
  currentBalanceBaseUnits: bigint,
  requiredAmountBaseUnits: bigint = MINIMUM_TEST_LEND_AMOUNT,
): Error {
  const shortfall = requiredAmountBaseUnits > currentBalanceBaseUnits
    ? requiredAmountBaseUnits - currentBalanceBaseUnits
    : 0n;

  return new Error(
    `Insufficient USDC for lend test: need at least ${
      formatUsdcAmount(requiredAmountBaseUnits)
    } USDC (${requiredAmountBaseUnits} base units, 6 decimals), wallet has ${
      formatUsdcAmount(currentBalanceBaseUnits)
    } USDC (${currentBalanceBaseUnits} base units), short ${
      formatUsdcAmount(shortfall)
    } USDC (${shortfall} base units)`,
  );
}

export function selectMinimumTestLendAmount(
  balanceBaseUnits: bigint,
): bigint {
  if (balanceBaseUnits < MINIMUM_TEST_LEND_AMOUNT) {
    throw buildInsufficientUsdcBalanceError(balanceBaseUnits);
  }

  return MINIMUM_TEST_LEND_AMOUNT;
}

export function appendInsufficientFundsDetails(
  error: unknown,
  currentBalanceBaseUnits: bigint,
  requestedAmountBaseUnits: bigint,
): Error {
  const baseMessage = error instanceof Error ? error.message : String(error);
  if (!baseMessage.includes("insufficient funds")) {
    return error instanceof Error ? error : new Error(baseMessage);
  }

  const details = buildInsufficientUsdcBalanceError(
    currentBalanceBaseUnits,
    requestedAmountBaseUnits,
  ).message;

  return new Error(`${baseMessage} — ${details}`);
}
