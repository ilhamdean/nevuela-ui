# Contributing to Nevuela UI

Thanks for considering a contribution. This doc covers setup, workflow, and the checks your PR
needs to pass.

## Setup

Package manager is pnpm (`packageManager: pnpm@10.17.1` in `package.json`). Use `pnpm`, not
npm/yarn.

```bash
pnpm install
pnpm storybook   # dev server at http://localhost:6006, primary way to build/verify components
```

## Adding or editing a component

Read `.claude/skills/component-builder/SKILL.md` first — it's the authoring convention for this
repo (file structure, variant pattern, design tokens, accessibility bar, story shape).

Every component lives at `src/components/<Category>/<Name>/` with exactly three files:

- `<Name>.vue` — `<script setup lang="ts">`, typed props, classes merged via `cn()`
- `<Name>.stories.ts` — CSF3 stories with `argTypes`, a `Playground` story, variant showcases
- `index.ts` — `cva` variants, exported types, re-export of the component

Categories are fixed to six folders: `LayoutNav`, `DataDisplay`, `Forms`, `Feedback`, `Charts`,
`AI`. New components must be added to `src/index.ts` under the matching category comment.

Use design tokens (`bg-brand`, `text-status-error`, etc.) from `src/style.css` — never raw
hex/px values.

## Before opening a PR

Run these locally; CI runs the same checks:

```bash
pnpm typecheck
pnpm lint
pnpm exec vitest run   # every *.stories.ts runs as a browser test, incl. a11y checks
pnpm build              # library build must succeed
```

A component isn't done until its stories pass accessibility checks (`addon-a11y`, error mode),
not just render.

## Commit / PR conventions

- Keep PRs scoped to one component or one fix
- Fill out the PR template checklist
- Describe the "why" in the PR description, not just the "what"

## Reporting bugs / requesting features

Use the issue templates. Include a minimal repro (Storybook link or code snippet) for bugs.
