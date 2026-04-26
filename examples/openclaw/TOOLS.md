# TOOLS.md - Local Demo Operations

This file is for machine-specific operational notes inside the demo workspace.

Identity defaults belong in `IDENTITY.md`, not here.

## Runbook

Run commands from this directory.

```sh
deno task wallet
deno task swap
deno task lend
deno task dca
deno task report
```

OpenClaw TUI note: local shell commands can also be run manually by prefixing a line with `!`, but agent-led execution should use the configured runtime command tool instead of asking the human to copy commands.

Execute tasks sign or submit real transactions. Only use them after explicit confirmation.

```sh
deno task swap:execute
deno task lend:execute
deno task dca:execute
```

For explicit swap intent, keep the dry-run and execute flags identical:

```sh
deno task swap --input SOL --output USDC --amount 0.001
deno task swap:execute --input SOL --output USDC --amount 0.001
```

For target output value wording:

```sh
deno task swap --input SOL --output USDC --output-amount 1
deno task swap:execute --input SOL --output USDC --output-amount 1
```

## Environment

- Required: `JUPITER_API_KEY`, `PRIVATE_KEY`
- Optional: `SOLANA_RPC_URL`
- Source: `.env.encrypted`
- Never print or commit `.env.keys`, decrypted `.env`, or raw secret values

## Good Uses For This File

- Host-specific command notes
- Local device or shell quirks
- OpenClaw agent runtime permission notes
- Workshop room setup notes
- Safe cron or report reminders

## Keep It Separate

`TOOLS.md` is for local operations. Persona, tone, and syncable identity settings live in `IDENTITY.md`, `SOUL.md`, and `AGENTS.md`.
