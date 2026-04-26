# ACTIONS.md - Jupiter Action Catalog

This file is the OpenClaw intent router for the Jupiter demo workspace.

## Intent Router

Classify the human's request before answering:

1. Read-only action: run the matching command immediately.
2. Transaction action: the OpenClaw agent is the harness. Run `deno task wallet`, run the dry-run command, summarize the exact action, ask for explicit confirmation, run the execute command yourself, then run `deno task wallet` again.
3. Unsupported or not yet implemented action: say it is not wired in this workspace yet and do not pretend to execute it.

Do not ask the human to run demo commands when runtime command tools are available.

## Result Reporting

After every successful onchain action, the OpenClaw agent must combine tool outputs into the final user-facing response:

- Use the pre-execute `deno task wallet` output as wallet balances before the action.
- Use the post-execute `deno task wallet` output as wallet balances after the action.
- Include the transaction explorer link from the execute command output.
- Use human-readable units such as `SOL` and `USDC`.
- Do not show lamports, raw token base units, or API raw amount field names unless the human explicitly asks for debugging details.

The Deno commands are intentionally single-purpose:

- `wallet` prints wallet balances.
- Dry-run commands request Jupiter transactions or orders without submitting them.
- Execute commands perform exactly one onchain action and print its transaction result.
- The agent, not the scripts, is responsible for orchestration and final response composition.

## Supported Executable Actions

| Intent | Command path | Execution policy |
| --- | --- | --- |
| wallet, balance, fee check | `deno task wallet` | Read-only. Run immediately. |
| exact input swap, quote, convert | `deno task swap --input SOL --output USDC --amount <input_amount>` | Dry-run first. Execute only after explicit confirmation with the same flags. |
| target output value swap | `deno task swap --input SOL --output USDC --output-amount <target_output_amount>` | Dry-run first. Use when the human says "1 USDC worth of SOL" or similar. |
| execute confirmed exact input swap | `deno task swap:execute --input SOL --output USDC --amount <input_amount>` | Real transaction. Run only after wallet check, dry-run, and explicit confirmation. |
| execute confirmed target output value swap | `deno task swap:execute --input SOL --output USDC --output-amount <target_output_amount>` | Real transaction. Run only after wallet check, dry-run, and explicit confirmation. |
| lend, earn deposit | `deno task lend --asset USDC --amount <amount>` | Dry-run first. Execute only after explicit confirmation with the same flags. |
| execute confirmed lend | `deno task lend:execute --asset USDC --amount <amount>` | Real transaction. Run only after wallet check, dry-run, and explicit confirmation. |
| DCA, recurring order, scheduling order | `deno task dca --input USDC --output SOL --amount <amount>` | Dry-run first. Execute only after explicit confirmation with the same flags. |
| execute confirmed DCA | `deno task dca:execute --input USDC --output SOL --amount <amount>` | Real transaction. Run only after wallet check, dry-run, and explicit confirmation. |
| position report, summary | `deno task report` | Read-only. Run immediately. |

## Amount Handling

- If the human says "1 USDC worth of SOL", use `--output-amount 1` with `--input SOL --output USDC`.
- Keep dry-run and execute flags identical.
- Never reuse an old signed transaction. Execute tasks must create a fresh Jupiter order.

## Unsupported Or Not Yet Implemented Actions

These Jupiter API families are known but not currently wired as executable commands in this workspace:

- Trigger limit orders
- Tokens search and metadata
- Price API lookups
- Portfolio API beyond the local demo report
- Prediction Markets
- Send
- Studio
- Lock
- Perps
- Borrow flows
- Routing or RFQ integration flows

For these, choose one of two paths:

1. If the human asks to use the API now, explain that this workspace needs a new command implementation first.
2. If the human asks to implement support, update the Deno scripts and tests before attempting any transaction.

Never claim an unsupported action was executed.
