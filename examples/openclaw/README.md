# OpenClaw Jupiter Demo Workspace

`examples/openclaw` is a Jupiter-branded demo workspace for OpenClaw. It is meant to stay self-contained, safe by default, and easy to point an isolated agent at when you want a workshop-ready setup.

## What This Workspace Is For

- Running the Jupiter demo tasks in this directory
- Shipping a default OpenClaw identity via `IDENTITY.md`
- Letting a user manually sync that identity into an installed agent when needed

This workspace does not assume it should rewrite your regular OpenClaw profile or repo-level onboarding flow.

## Key Files

- `IDENTITY.md`: source of truth for syncable agent identity defaults
- `AGENTS.md`: workspace rules and transaction-safety guardrails
- `BOOTSTRAP.md`: first-session check that confirms the shipped identity
- `SOUL.md`: demo agent personality and safety posture
- `USER.md`: minimal participant notes
- `TOOLS.md`: local operational notes

## Register This Workspace With OpenClaw

If you want OpenClaw to use this directory as an isolated agent workspace, add it explicitly:

```sh
openclaw agents add jupiter-demo \
  --workspace ./examples/openclaw \
  --non-interactive
```

Add `--model ...` or `--bind ...` only if you actually want those settings for your local agent.

## Sync Identity Manually When Needed

`IDENTITY.md` already contains Jupiter workshop defaults:

- `Name`: `Jupiter Demo Agent`
- `Theme`: `concise Jupiter workshop guide`
- `Emoji`: `🪐`
- `Avatar`: optional and unset by default

If you want an installed agent that points at this workspace to match those values, run:

```sh
openclaw agents set-identity --workspace ./examples/openclaw --from-identity
```

This is a manual sync step. It is not applied automatically, and it does not need to be run unless you want the installed agent config updated.

## Demo Tasks

All tasks run through `dotenvx` with `.env.encrypted` as the source of environment variables.

```sh
deno task wallet
deno task swap
deno task lend
deno task dca
deno task report
```

Dry-run tasks are the default. They fetch orders or reports without sending transactions.

Execute tasks are real-money operations:

```sh
deno task swap:execute
deno task lend:execute
deno task dca:execute
```

Only run execute tasks after confirming balances and getting explicit human approval.

## Environment

- Required: `JUPITER_API_KEY`, `PRIVATE_KEY`
- Optional: `SOLANA_RPC_URL`
- Source of truth: `.env.encrypted`

Do not commit `.env.keys`, decrypted `.env`, or any secret values.

## Default Demo Values

- Swap: `0.001 SOL -> USDC`
- Lend: `1 USDC` Earn deposit request
- DCA/Recurring: `104 USDC -> SOL`, `2` orders, `86400` second interval

## References

- [OpenClaw Agent Workspace](https://docs.openclaw.ai/concepts/agent-workspace)
- [OpenClaw Agents CLI](https://docs.openclaw.ai/cli/agents)
