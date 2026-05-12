# Repository Guidelines

## Project Structure & Module Organization

This repository manages Marp slides for a Jupiter presentation in the AUTON Program. Keep event goals and narrative requirements in `docs/PRD.md`, technical and presentation policy in `docs/TECH.md`, and placement rules in `docs/STRUCTURE.md`.

The main deck is `SLIDE.md`. Store reusable images and screenshots in `assets/`, Marp theme CSS in `theme/jupiter.css`, and generated files such as `SLIDE.pdf` in `output/`. Do not add demo application code unless the PRD is updated to require it.

## Build, Preview, and Development Commands

Use the Marp config in `.marprc-ci.yml` for consistent output.

```sh
bunx @marp-team/marp-cli@latest --config .marprc-ci.yml
```

For quick local preview, run a Marp-compatible editor preview or:

```sh
bunx @marp-team/marp-cli@latest SLIDE.md --theme-set theme --allow-local-files --preview
```

Before submitting slide changes, regenerate `output/SLIDE.pdf` and visually inspect pages that changed, especially diagrams, screenshots, and dense Japanese text.

## Writing Style & Naming Conventions

Write Markdown in GitHub Flavored Markdown plus Marp slide separators. Keep slide text concise and beginner-friendly; this deck targets DeFi learners and should explain Aggregator and Perps without assuming deep protocol knowledge. Use Japanese for audience-facing slide content unless the surrounding section intentionally uses English terminology.

Use lowercase, descriptive asset names such as `assets/jupiter-logo.svg` or `assets/pricing.jpg`. Keep custom styling in `theme/jupiter.css`; avoid inline style drift in `SLIDE.md` when a reusable class is more appropriate.

## Validation Guidelines

There is no TypeScript demo test suite for this scope. Validate changes by rendering the deck, checking that local assets resolve, and reviewing the generated PDF. For visual changes, confirm text is not clipped, images are readable, and the first viewport of each slide communicates the point quickly.

## Commit & Pull Request Guidelines

Recent history uses short imperative subjects, often with prefixes such as `docs:`, `fix:`, `refactor:`, `chore:`, and `feat:`. Keep commits focused on one deck or documentation concern.

PRs should summarize the slide/story change, mention updated assets or generated outputs, and list the render command used. Include screenshots or the regenerated `output/SLIDE.pdf` when layout, images, or theme styling changes.

## Security & Configuration

Do not commit wallet keys, `.env`, private screenshots, or unreleased partner material. Public examples should be safe for workshop attendees to view and reuse.
