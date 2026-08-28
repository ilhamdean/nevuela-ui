# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Nevuela UI is a Vue 3 + TypeScript component library / design system for **data-dense
applications** (dashboards, record lists, detail pages, multi-step flows): admin and back-office
tools, analytics, operations software, internal tools, with an original
visual language ("Aurora/Nebula": indigo-violet neutrals, emerald-green brand accent). It's
published to npm, built from `src/index.ts` into `dist/` for consuming projects to install.

Stack: Vue 3 `<script setup lang="ts">` + Vite, TypeScript (strict), Tailwind CSS v4 (CSS-first),
shadcn-vue conventions on Reka UI, class-variance-authority + tailwind-merge + clsx for variants,
`@lucide/vue` icons, `vue-echarts` for charts, Storybook 10 for docs/workshop.

## Commands

Package manager is pnpm (`packageManager: pnpm@10.17.1` in `package.json`). Use `pnpm`, not npm/yarn.

- `pnpm install`: install deps
- `pnpm storybook`: Storybook dev server at http://localhost:6006, the primary way to build and
  visually verify components
- `pnpm dev`: Vite dev harness (`src/App.vue`) for quick manual smoke-testing, not the component workshop
- `pnpm build-storybook`: static Storybook build to `storybook-static/`
- `pnpm build`: full library build (`rm -rf dist && build:lib && build:types`)
  - `pnpm build:lib`: Vite library build (`vite.lib.config.ts`) to `dist/index.js` + `dist/nevuela.css`
  - `pnpm build:types`: `vue-tsc -p tsconfig.build.json` to `dist/index.d.ts`
- `pnpm lint`: `eslint . --fix`
- `pnpm format`: `prettier --write` over `src/**/*.{ts,vue,css}` and root config/docs files
- `pnpm typecheck`: `vue-tsc --noEmit -p tsconfig.app.json` (strict)

### Tests

There's no `test` script. Tests run through Storybook's Vitest addon (`@storybook/addon-vitest`),
wired as a `storybook` Vitest project in `vite.config.ts`: every `*.stories.ts` file's stories run
as browser tests (Playwright/Chromium, headless), and `addon-a11y` runs in `error` mode as part of
that. A component isn't done until its stories pass accessibility checks, not just render.

- Run everything: `pnpm exec vitest run`
- Run one component's stories: `pnpm exec vitest run src/components/Forms/Button/Button.stories.ts`
- Watch/interactive: `pnpm exec vitest`, or use the test addon panel inside a running `pnpm storybook`

Before finishing a component change, run `pnpm typecheck`, `pnpm lint`, and either
`pnpm build-storybook` or a targeted `vitest run`. See
`.claude/skills/component-builder/SKILL.md` §7.

## Architecture

### Package shape

`src/index.ts` is the sole public entry point: every component, its `cva` variant helper, and its
prop/option types are re-exported from there, grouped by category (Forms, LayoutNav, DataDisplay,
Feedback, Charts). `src/App.vue` / `src/main.ts` are just a throwaway dev harness for `pnpm dev`,
not part of the shipped package.

The library build (`vite.lib.config.ts`) externalizes all runtime deps (`vue`, `reka-ui`,
`@lucide/vue`, `class-variance-authority`, `clsx`, `tailwind-merge`, `echarts`, `vue-echarts`),
so consumers install those themselves. All CSS (Tailwind + tokens) compiles down into one
`dist/nevuela.css`; consumers need no Tailwind setup of their own, just that one stylesheet import.

### Component convention

Every component lives at `src/components/<Category>/<Name>/` with exactly three files:

- `<Name>.vue`: `<script setup lang="ts">`, typed props (`interface Props` +
  `withDefaults(defineProps<Props>(), …)`), classes merged via `cn()` (`src/lib/utils.ts`,
  clsx + tailwind-merge), interactive/a11y-heavy behavior delegated to Reka UI primitives rather
  than hand-rolled.
- `<Name>.stories.ts`: CSF3 Storybook stories, hand-written `argTypes` descriptions for every
  prop, a `Playground` story, variant showcases, and at least one realistic-data story.
- `index.ts`: `cva` variant definitions, exported prop/variant types, and a re-export of the `.vue`
  component.

Categories are fixed to exactly six folder names: `LayoutNav`, `DataDisplay`, `Forms`,
`Feedback`, `Charts`, `AI`. A new component must also be added to `src/index.ts` under the matching
category comment. The full authoring convention (props patterns, accessibility bar, token usage,
story shape) lives in `.claude/skills/component-builder/SKILL.md`; read it before adding or
editing anything under `src/components/`.

### Design tokens

All visual values are semantic CSS custom properties defined in `src/style.css` (colors, radius,
spacing, type scale, shadows), exposed as Tailwind utilities (`bg-brand`, `text-status-error`,
`rounded-sm`, `shadow-md`, …). Components use these tokens exclusively, never raw hex/px values.
`design-reference/tokens.md` is the source of truth for _why_ each token has the value it does: the
rationale behind the Aurora/Nebula palette, type scale, radii, and spacing. Dark theme (`.dark`) is
a real, WCAG AA-verified palette, toggled via a `.dark` ancestor class (Storybook: the toolbar
light/dark toggle). `--brand`/`--status-error` have a second, lighter `-fg` variant
(`--brand-fg`/`--status-error-fg`) for bare text/icons, since one shade can't stay AA-compliant
both as a solid fill _and_ as text directly on the dark background. See `tokens.md` § Dark theme
before adding new brand/status-colored text.

### Path alias

`@/*` resolves to `src/*` (declared in `tsconfig.json`/`tsconfig.app.json`, mirrored in both Vite
configs).

## Other repo docs

- `AGENTS.md`: working rules for coding agents in this repo (planning mode, component workflow,
  quality-gate commands). Read alongside this file.
- `README.md`: install and usage instructions for consumers of the published package.
