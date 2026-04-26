# AGENTS.md - OpenClaw Demo Workspace

This directory is a Jupiter workshop demo workspace for OpenClaw. Keep it usable as a branded, safe-default example.

## Identity Source Of Truth

- `IDENTITY.md` is the source of truth for workspace identity defaults.
- The formal syncable fields are `Name`, `Theme`, `Emoji`, and `Avatar`.
- If those values change, update `IDENTITY.md` first.
- Sync into an installed OpenClaw agent only when needed:

```sh
openclaw agents set-identity --workspace ./examples/openclaw --from-identity
```

- `Creature` and `Vibe` are supporting workspace notes. Keep them aligned with `Theme`, but do not treat them as CLI-managed agent config.

## First Run

If `BOOTSTRAP.md` exists, use it as startup notes. Do not announce or reconfirm the shipped identity during normal Jupiter operations; answer the human's request directly.

## Workspace-First Operation

- Prefer defaults and notes stored inside this workspace.
- You can run local commands in this workspace when the installed OpenClaw agent config grants runtime tools.
- Use the workspace working directory for demo commands; do not tell the human to run `deno task` themselves when you have command execution available.
- Do not ask the human to run demo commands. Interpret the intent, choose the matching command, and run it yourself when the configured tools allow it.
- Do not assume the human wants permanent changes to their normal OpenClaw profile or other workspaces.
- Keep changes scoped to `examples/openclaw/` unless the human explicitly asks for something broader.
- Do not modify slide files or repo-level onboarding from this workspace flow.

## Memory

You wake up fresh each session. These files provide continuity inside the workspace:

- Daily notes: `memory/YYYY-MM-DD.md`
- Long-term notes: `MEMORY.md` when this workspace becomes a persistent personal workspace

Write down durable decisions, workshop-specific preferences, and safe operational notes. Do not record secrets.

## Red Lines

- Don't exfiltrate private data.
- Don't run destructive commands without asking.
- Never print `PRIVATE_KEY`, `.env.keys`, `.env`, or decrypted secret values.
- Run dry-run Jupiter tasks before any execute task.
- Only run `deno task swap:execute`, `deno task lend:execute`, or `deno task dca:execute` after the human explicitly confirms the exact action, token pair, and amount.

## External vs Internal

Safe to do freely:

- Read files, inspect the workspace, and keep the demo organized
- Run local dry-run demo commands, including `deno task wallet`, `deno task swap`, `deno task lend`, `deno task dca`, and `deno task report`
- Update workspace documents so the demo remains coherent

Ask first:

- Any public or outbound action
- Any real onchain transaction
- Any change outside this workspace

## Demo Commands

This workspace includes runnable Jupiter demos under `scripts/`.

- `deno task wallet`: derive the configured wallet address and check SOL and USDC balances
- `deno task swap`: request a Swap order only
- `deno task lend`: request a Jupiter Earn deposit transaction only
- `deno task dca`: request a Recurring order transaction only
- `deno task report`: print a Markdown wallet and demo position report

Treat execute tasks as real-money operations.

For transaction requests, act as the OpenClaw harness. The Deno scripts are single-purpose tools; do not expect them to orchestrate the full workflow.

Before and after a transaction:

1. Run `deno task wallet`.
2. Confirm the wallet has enough SOL for fees and enough input token for the demo.
3. Explain the exact action in one short sentence.
4. Ask for explicit confirmation before running the matching `*:execute` task.
5. After confirmation, run the execute task yourself when the OpenClaw runtime tools are available.
6. Run `deno task wallet` again after a successful execute command.
7. Compose the final response from the tool outputs: signature, explorer URL, wallet balances before, wallet balances after, and any confirmation error exactly.
8. Display token balances in human-readable units only. Do not show lamports, raw base units, or other machine units in user-facing summaries.

For a SOL to USDC swap, use:

```sh
deno task wallet
deno task swap --input SOL --output USDC --amount <sol_amount>
deno task swap:execute --input SOL --output USDC --amount <sol_amount>
```

For "1 USDC worth of SOL to USDC", use `--output-amount`:

```sh
deno task wallet
deno task swap --input SOL --output USDC --output-amount 1
deno task swap:execute --input SOL --output USDC --output-amount 1
```

For the default workshop swap amount, omit the flags. For a user-specified amount, pass flags explicitly so the dry-run and execute steps use the same intent.

## Jupiter Intent Routing

Use `ACTIONS.md` as the action catalog before answering Jupiter operation requests.

- For supported read-only actions, run the command immediately and summarize the result.
- For supported transaction actions, run wallet and dry-run checks first, ask for explicit confirmation, then run the matching execute command yourself.
- For unsupported Jupiter API families, state that this workspace does not have an executable command yet and offer to implement one with tests.
- Never fabricate a command result or onchain confirmation.

## Local Notes

Use `TOOLS.md` for machine-specific operational notes. Do not move identity or persona defaults there.
