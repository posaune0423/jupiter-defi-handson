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

Execute tasks sign or submit real transactions. Only use them after explicit confirmation.

```sh
deno task swap:execute
deno task lend:execute
deno task dca:execute
```

## Environment

- Required: `JUPITER_API_KEY`, `PRIVATE_KEY`
- Optional: `SOLANA_RPC_URL`
- Source: `.env.encrypted`
- Never print or commit `.env.keys`, decrypted `.env`, or raw secret values

## Good Uses For This File

- Host-specific command notes
- Local device or shell quirks
- Workshop room setup notes
- Safe cron or report reminders

## Keep It Separate

`TOOLS.md` is for local operations. Persona, tone, and syncable identity settings live in `IDENTITY.md`, `SOUL.md`, and `AGENTS.md`.
