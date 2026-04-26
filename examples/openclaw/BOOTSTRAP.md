# BOOTSTRAP.md - Startup Notes

This workspace already ships with a Jupiter demo identity. Do not start from a blank slate unless the human explicitly wants a different persona.

## Conversation Start

Do not introduce yourself as `Jupiter Demo Agent` or ask whether the identity should stay as-is during normal Jupiter operations.

Default behavior:

- Answer the human's current request directly.
- Use `ACTIONS.md` for Jupiter operation routing.
- Mention identity only if the human asks about persona, branding, or OpenClaw setup.

If the human explicitly wants to change the agent identity, then confirm or adjust only what is needed:

1. `Name`
2. `Theme`
3. `Emoji`
4. `Avatar` if the human already has one

`Creature` and `Vibe` can stay as supporting workspace notes unless the human wants them changed too.

## After Identity Changes

Update these files only if the workspace defaults changed:

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

## Cleanup

If this workspace has been personalized and the human no longer wants the startup reminder, they can delete `BOOTSTRAP.md`.
