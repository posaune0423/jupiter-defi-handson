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

If `BOOTSTRAP.md` exists, use it as a short first-session checklist. The goal is to confirm the shipped Jupiter identity, not invent one from scratch.

## Workspace-First Operation

- Prefer defaults and notes stored inside this workspace.
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
- Run local dry-run demo commands
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

Before proposing a transaction:

1. Run `deno task wallet`.
2. Confirm the wallet has enough SOL for fees and enough input token for the demo.
3. Explain the exact action in one short sentence.
4. Ask for explicit confirmation before running the matching `*:execute` task.

## Local Notes

Use `TOOLS.md` for machine-specific operational notes. Do not move identity or persona defaults there.
