# Nevuela UI

**Nevuela** is an original, open-source Vue 3 component library and design system for building
cloud/admin **console** interfaces — data-dense dashboards, resource lists, detail pages, and
creation flows.

Its visual language — **Aurora/Nebula** — pairs deep indigo-violet neutrals with an emerald-green
brand accent, clear status colors, and a comfortable data-table rhythm, all original to this
project. Icons come from the open-source [Lucide](https://lucide.dev) set.

## Stack

| Concern           | Choice                                                  |
| ----------------- | ------------------------------------------------------- |
| Framework         | Vue 3 (`<script setup lang="ts">`) + Vite               |
| Language          | TypeScript (strict)                                     |
| Styling           | Tailwind CSS v4 (CSS-first) + semantic CSS variables    |
| Accessible base   | [shadcn-vue](https://shadcn-vue.com) on **Reka UI**     |
| Variants          | class-variance-authority + tailwind-merge + clsx        |
| Icons             | `@lucide/vue`                                           |
| Charts            | `vue-echarts` (Apache ECharts)                          |
| Docs              | Storybook 10 (autodocs)                                 |
| Quality           | ESLint (flat) + Prettier + `vue-tsc`                    |

## Getting started

```bash
pnpm install
pnpm storybook     # component workshop + docs at http://localhost:6006
pnpm dev           # minimal dev harness
```

Want to consume these components from a separate local project instead? See
[`LOCAL_USAGE.md`](./LOCAL_USAGE.md).

## Scripts

| Script                  | Purpose                                    |
| ----------------------- | ------------------------------------------ |
| `pnpm dev`              | Vite dev harness                           |
| `pnpm storybook`        | Run Storybook                              |
| `pnpm build-storybook`  | Static Storybook build                     |
| `pnpm build`            | Build the library                          |
| `pnpm lint`             | ESLint (with `--fix`)                      |
| `pnpm format`           | Prettier write                             |
| `pnpm typecheck`        | `vue-tsc` strict type-check                |

## Design tokens

Tokens are extracted into semantic CSS variables (e.g. `--color-status-active`, `--color-brand`,
`--radius-md`) so themes can be re-skinned without touching component code. See
[`design-reference/`](./design-reference) for the reference notes and `src/style.css` for the
implemented theme.

## Project conventions

Components live under `src/components/<Category>/<Name>/` as
`{ Name.vue, Name.stories.ts, index.ts }`. See
[`.claude/skills/component-builder/SKILL.md`](./.claude/skills/component-builder) for the authoring
convention (once established).

## License

MIT — see [`LICENSE`](./LICENSE).
