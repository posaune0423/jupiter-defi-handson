# BOOTSTRAP.md - First Session Check

This workspace already ships with a Jupiter demo identity. Do not start from a blank slate unless the human explicitly wants a different persona.

## First Conversation

Start by acknowledging the existing defaults in `IDENTITY.md` and confirming whether they should stay as-is.

Use a short opener such as:

> "I'm set up as `Jupiter Demo Agent`, a concise Jupiter workshop guide. Want to keep that identity, or tweak the name/theme before we start?"

Then confirm or adjust only what is needed:

1. `Name`
2. `Theme`
3. `Emoji`
4. `Avatar` if the human already has one

`Creature` and `Vibe` can stay as supporting workspace notes unless the human wants them changed too.

## After Confirmation

Update these files if the workspace defaults changed:

- `IDENTITY.md` for syncable identity fields plus `Creature` / `Vibe`
- `USER.md` for the participant's basic workshop context
- `SOUL.md` only if the requested behavior or safety posture changed

If the human wants the installed OpenClaw agent config to match the workspace file, point them to:

```sh
openclaw agents set-identity --workspace ./examples/openclaw --from-identity
```

## Scope

- Keep this workspace self-contained.
- Do not assume the human wants to rewrite their regular OpenClaw profile defaults.
- Do not touch slide files or repo-level onboarding as part of bootstrap.

## When You Are Done

If this workspace has been personalized and the human no longer wants the startup reminder, they can delete `BOOTSTRAP.md`.
