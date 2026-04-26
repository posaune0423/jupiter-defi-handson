/**
 * Jupiter Lend Earn CLI
 *
 * Read actions:
 *   deno task lend tokens
 *   deno task lend positions
 *   deno task lend earnings --positions <jlTokenMint[,jlTokenMint...]>
 *
 * Write actions build unsigned transactions by default. Add --execute to sign,
 * send, and confirm a real on-chain transaction.
 */
import { env } from "./env.ts";
import { getWallet, jupiterFetch, signAndSend } from "./utils/mod.ts";
import {
  appendInsufficientFundsDetails,
  buildEarnPostBody,
  type EarnAction,
  formatBaseUnits,
  formatUsdcAmount,
  getEarnEndpoint,
  isInstructionAction,
  isTransactionAction,
  type LendCliOptions,
  parseLendCliArgs,
  selectMinimumTestLendAmount,
} from "./helpers/lend.ts";

const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

interface TokenAccountsByOwnerResponse {
  value: Array<{
    account: {
      data: {
        parsed: {
          info: {
            tokenAmount: {
              amount: string;
            };
          };
        };
      };
    };
  }>;
}

interface AssetInfo {
  address: string;
  symbol: string;
  decimals: number;
  price?: string;
}

interface EarnToken {
  address: string;
  symbol: string;
  decimals: number;
  assetAddress: string;
  asset: AssetInfo;
  totalAssets: string;
  totalSupply: string;
  supplyRate: string;
  rewardsRate: string;
  totalRate: string;
  liquiditySupplyData?: {
    withdrawable?: string;
  };
}

interface UserPosition {
  token: EarnToken;
  ownerAddress: string;
  shares: string;
  underlyingAssets: string;
  underlyingBalance: string;
  allowance: string;
}

interface EarningsResponse {
  address: string;
  ownerAddress: string;
  earnings: string | number;
  slot: number;
}

interface TransactionResponse {
  transaction: string;
}

interface InstructionResponse {
  instructions: EarnInstruction[];
}

interface EarnInstruction {
  programId: string;
  accounts: Array<{
    pubkey: string;
    isSigner: boolean;
    isWritable: boolean;
  }>;
  data: string;
}

async function getUsdcBalanceRaw(owner: string): Promise<bigint> {
  const response = await fetch(env.SOLANA_RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getTokenAccountsByOwner",
      params: [
        owner,
        { mint: USDC_MINT },
        { encoding: "jsonParsed" },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(
      `RPC getTokenAccountsByOwner failed with HTTP ${response.status}`,
    );
  }

  const payload = await response.json() as {
    result?: TokenAccountsByOwnerResponse;
    error?: { code: number; message: string };
  };

  if (payload.error) {
    throw new Error(
      `RPC getTokenAccountsByOwner failed: ${payload.error.message} (code: ${payload.error.code})`,
    );
  }

  const accounts = payload.result?.value ?? [];
  return accounts.reduce(
    (sum, account) =>
      sum + BigInt(account.account.data.parsed.info.tokenAmount.amount),
    0n,
  );
}

function toQuery(params: Record<string, string>): string {
  return new URLSearchParams(params).toString();
}

async function fetchTokens(): Promise<EarnToken[]> {
  return await jupiterFetch<EarnToken[]>(getEarnEndpoint("tokens"));
}

async function fetchPositions(users: string[]): Promise<UserPosition[]> {
  const query = toQuery({ users: users.join(",") });
  return await jupiterFetch<UserPosition[]>(
    `${getEarnEndpoint("positions")}?${query}`,
  );
}

async function fetchEarnings(
  user: string,
  positions: string[],
): Promise<EarningsResponse[]> {
  const query = toQuery({ user, positions: positions.join(",") });
  return await jupiterFetch<EarningsResponse[]>(
    `${getEarnEndpoint("earnings")}?${query}`,
  );
}

function formatRate(rate: string): string {
  const numeric = Number(rate);
  if (!Number.isFinite(numeric)) return rate;
  return `${(numeric / 100).toFixed(2)}%`;
}

function formatTokenAmount(
  amount: string | number,
  decimals: number,
  symbol: string,
): string {
  const value = String(amount);
  if (value.includes(".")) return `${value} ${symbol}`;
  return `${formatBaseUnits(value, decimals)} ${symbol}`;
}

function printTokens(tokens: EarnToken[]): void {
  console.log(`[lend] Earn tokens (${tokens.length})`);
  for (const token of tokens) {
    const assetSymbol = token.asset?.symbol ?? token.symbol;
    const assetDecimals = token.asset?.decimals ?? token.decimals;
    console.log(
      `- ${token.symbol} (${token.address})`,
    );
    console.log(`  asset: ${assetSymbol} (${token.assetAddress})`);
    console.log(
      `  total assets: ${
        formatTokenAmount(token.totalAssets, assetDecimals, assetSymbol)
      }`,
    );
    console.log(`  total rate: ${formatRate(token.totalRate)}`);
    console.log(`  supply rate: ${formatRate(token.supplyRate)}`);
    console.log(`  rewards rate: ${formatRate(token.rewardsRate)}`);
    if (token.liquiditySupplyData?.withdrawable) {
      console.log(
        `  withdrawable: ${
          formatTokenAmount(
            token.liquiditySupplyData.withdrawable,
            assetDecimals,
            assetSymbol,
          )
        }`,
      );
    }
  }
}

function printPositions(positions: UserPosition[]): void {
  console.log(`[lend] Earn positions (${positions.length})`);
  if (positions.length === 0) {
    console.log("No active Earn positions found.");
    return;
  }

  for (const position of positions) {
    const asset = position.token.asset;
    console.log(`- ${position.token.symbol} (${position.token.address})`);
    console.log(`  owner: ${position.ownerAddress}`);
    console.log(
      `  deposited now: ${
        formatTokenAmount(
          position.underlyingAssets,
          asset.decimals,
          asset.symbol,
        )
      }`,
    );
    console.log(
      `  shares: ${
        formatTokenAmount(
          position.shares,
          position.token.decimals,
          position.token.symbol,
        )
      }`,
    );
    console.log(
      `  wallet balance: ${
        formatTokenAmount(
          position.underlyingBalance,
          asset.decimals,
          asset.symbol,
        )
      }`,
    );
  }
}

function printEarnings(
  earningsItems: EarningsResponse[],
  positions: UserPosition[],
): void {
  console.log(`[lend] Earnings (${earningsItems.length})`);
  for (const earnings of earningsItems) {
    const position = positions.find((item) =>
      item.token.address === earnings.address
    );
    const asset = position?.token.asset;
    const formatted = asset
      ? formatTokenAmount(earnings.earnings, asset.decimals, asset.symbol)
      : String(earnings.earnings);

    console.log(`- ${position?.token.symbol ?? earnings.address}`);
    console.log(`  address: ${earnings.address}`);
    console.log(`  owner: ${earnings.ownerAddress}`);
    console.log(`  earnings: ${formatted}`);
    console.log(`  slot: ${earnings.slot}`);
  }
}

async function runSummary(user: string): Promise<void> {
  const positions = await fetchPositions([user]);
  printPositions(positions);

  const positionAddresses = positions
    .filter((position) =>
      BigInt(position.shares) > 0n || BigInt(position.underlyingAssets) > 0n
    )
    .map((position) => position.token.address);
  if (positionAddresses.length === 0) return;

  const earnings = await fetchEarnings(user, positionAddresses);
  printEarnings(earnings, positions);
}

async function runReadAction(
  action: EarnAction,
  options: LendCliOptions,
  user: string,
): Promise<void> {
  if (action === "summary") {
    await runSummary(user);
    return;
  }

  if (action === "tokens") {
    printTokens(await fetchTokens());
    return;
  }

  if (action === "positions") {
    printPositions(await fetchPositions([options.user ?? user]));
    return;
  }

  if (action === "earnings") {
    if (!options.positions || options.positions.length === 0) {
      throw new Error("--positions is required for earnings");
    }

    const owner = options.user ?? user;
    const positions = await fetchPositions([owner]);
    printEarnings(await fetchEarnings(owner, options.positions), positions);
  }
}

async function runWriteAction(
  action: EarnAction,
  options: LendCliOptions,
  signer: string,
): Promise<void> {
  const amountOptions = { ...options };
  let usdcBalanceRaw = 0n;

  if (
    (action === "deposit" || action === "deposit-instructions") &&
    amountOptions.amount === undefined && amountOptions.asset === USDC_MINT
  ) {
    usdcBalanceRaw = await getUsdcBalanceRaw(signer);
    amountOptions.amount = selectMinimumTestLendAmount(usdcBalanceRaw);
    console.log(
      `[lend] Wallet USDC balance: ${
        formatUsdcAmount(usdcBalanceRaw)
      } USDC (${usdcBalanceRaw} base units, 6 decimals)`,
    );
  }

  const body = buildEarnPostBody(action, amountOptions, signer);
  const endpoint = getEarnEndpoint(action);
  console.log(`[lend] Requesting ${action}: ${endpoint}`);
  console.log(`  body: ${JSON.stringify(body)}`);

  if (isInstructionAction(action)) {
    const instruction = await jupiterFetch<InstructionResponse>(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    console.log(
      `[lend] Instructions received (${instruction.instructions.length})`,
    );
    for (const [index, item] of instruction.instructions.entries()) {
      console.log(`- instruction #${index + 1}`);
      console.log(`  programId: ${item.programId}`);
      console.log(`  accounts: ${item.accounts.length}`);
      console.log(`  data: ${item.data}`);
    }
    return;
  }

  const data = await jupiterFetch<TransactionResponse>(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!data.transaction) {
    throw new Error("No transaction returned from Lend API");
  }

  if (!options.execute) {
    console.log(`[lend] Unsigned transaction received`);
    console.log(`  transaction: ${data.transaction}`);
    console.log("  add --execute to sign, send, and confirm it");
    return;
  }

  console.log("[lend] Transaction received, signing and sending...");
  const signature = await signAndSend(data.transaction, await getWallet())
    .catch(
      (error) => {
        if (usdcBalanceRaw === 0n || amountOptions.amount === undefined) {
          throw error;
        }
        throw appendInsufficientFundsDetails(
          error,
          usdcBalanceRaw,
          amountOptions.amount,
        );
      },
    );

  console.log(`[lend] Success!`);
  console.log(`  signature: ${signature}`);
  console.log(`  explorer:  https://solscan.io/tx/${signature}`);
}

async function main() {
  const options = parseLendCliArgs(Deno.args);
  const wallet = await getWallet();
  const signer = options.user ?? wallet.address;

  if (
    isTransactionAction(options.action) || isInstructionAction(options.action)
  ) {
    await runWriteAction(options.action, options, signer);
    return;
  }

  await runReadAction(options.action, options, wallet.address);
}

if (import.meta.main) {
  main().catch((err) => {
    console.error("[lend] Error:", err);
    Deno.exit(1);
  });
}
