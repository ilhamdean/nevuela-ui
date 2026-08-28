# Nevuela UI

Nevuela is an open-source Vue 3 component library and design system for data-dense applications:
dashboards, record lists, detail pages, and multi-step flows. It suits admin and back-office
tools, analytics, operations software, and other products where people work in tables and forms
all day.

Its visual language, Aurora/Nebula, pairs deep indigo-violet neutrals with an emerald-green brand
accent, a set of status colors, and spacing tuned for data tables. Icons come from
[Lucide](https://lucide.dev).

## Contents

- [Installation](#installation)
- [Stack](#stack)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Design tokens](#design-tokens)
- [Project conventions](#project-conventions)
- [License](#license)

## Installation

```bash
npm install nevuela-ui
# or: pnpm add nevuela-ui / yarn add nevuela-ui
```

Nevuela externalizes its runtime deps, so install them alongside it:

```bash
npm install vue@^3.5.0 reka-ui @lucide/vue class-variance-authority clsx tailwind-merge echarts vue-echarts
```

`dist/nevuela.css` is a fully compiled Tailwind v4 stylesheet, so you don't need Tailwind
installed or configured to consume it. Import it once, globally, in your app's entry point:

```ts
// main.ts
import { createApp } from 'vue'
import 'nevuela-ui/style.css'
import App from './App.vue'

createApp(App).mount('#app')
```

Nevuela's type scale assumes Inter (`--font-sans` / `--font-heading` fall back to Helvetica/Arial
otherwise). Load it however your project prefers, for example:

```bash
npm install @fontsource-variable/inter
```

```ts
import '@fontsource-variable/inter'
```

Then use components:

```vue
<script setup lang="ts">
import { Button } from 'nevuela-ui'
</script>

<template>
  <Button>Primary action</Button>
</template>
```

Everything under [`src/index.ts`](./src/index.ts) is re-exported from the package root:
components, their variant helpers (e.g. `buttonVariants`), and prop types.

### Troubleshooting

- Components render unstyled: you forgot to import `nevuela-ui/style.css`, or the import runs
  after other CSS that overrides it.
- Font looks off (Helvetica/Arial, not Inter): install and load Inter yourself, it's not bundled
  with the library.
- `Cannot find module 'reka-ui'` (or similar) at runtime: install the peer/runtime deps listed
  above, they're external, not bundled.

## Stack

| Concern         | Choice                                               |
| --------------- | ----------------------------------------------------- |
| Framework       | Vue 3 (`<script setup lang="ts">`) + Vite            |
| Language        | TypeScript (strict)                                  |
| Styling         | Tailwind CSS v4 (CSS-first) + semantic CSS variables |
| Accessible base | [shadcn-vue](https://shadcn-vue.com) on Reka UI      |
| Variants        | class-variance-authority + tailwind-merge + clsx     |
| Icons           | `@lucide/vue`                                        |
| Charts          | `vue-echarts` (Apache ECharts)                       |
| Docs            | Storybook 10 (autodocs + a11y checks)                |
| Testing         | Storybook's Vitest addon (Playwright/Chromium)       |
| Quality         | ESLint (flat) + Prettier + `vue-tsc`                 |

## Getting started

Package manager is [pnpm](https://pnpm.io) (`packageManager: pnpm@10.17.1`), not npm or yarn.

```bash
pnpm install
pnpm storybook     # component workshop + docs at http://localhost:6006
pnpm dev           # minimal Vite dev harness for quick manual smoke-testing
```

Storybook is the primary way to build and visually verify components. `pnpm dev` runs a
throwaway harness (`src/App.vue`) and isn't part of the shipped package.

### Tests

There's no standalone `test` script. Tests run through Storybook's Vitest addon: every
`*.stories.ts` file's stories execute as browser tests (headless Chromium via Playwright), and
accessibility checks (`addon-a11y`, in `error` mode) run as part of that. A component isn't done
until its stories pass a11y checks, not just render.

```bash
pnpm exec vitest run                                              # run everything
pnpm exec vitest run src/components/Forms/Button/Button.stories.ts  # one component
pnpm exec vitest                                                  # watch/interactive mode
```

## Scripts

| Script                 | Purpose                                              |
| ----------------------- | ----------------------------------------------------- |
| `pnpm dev`             | Vite dev harness                                     |
| `pnpm storybook`       | Run Storybook                                        |
| `pnpm build-storybook` | Static Storybook build → `storybook-static/`         |
| `pnpm build`           | Full library build → `dist/` (`build:lib` + `build:types`) |
| `pnpm build:lib`       | Vite library build → `dist/index.js` + `dist/nevuela.css` |
| `pnpm build:types`     | `vue-tsc` type declarations → `dist/index.d.ts`      |
| `pnpm lint`            | ESLint (with `--fix`)                                |
| `pnpm format`          | Prettier write                                       |
| `pnpm typecheck`       | `vue-tsc --noEmit` (strict)                          |

## Design tokens

Every visual value (colors, radius, spacing, type scale, shadows) lives in a semantic CSS custom
property, defined in `src/style.css` and exposed as Tailwind utilities (`bg-brand`,
`text-status-error`, `rounded-sm`, `shadow-md`, …). Components use these tokens exclusively, never
raw hex/px values, so you can re-skin a theme without touching component code.

Dark theme (`.dark`) is a real, WCAG AA-verified palette, toggled via a `.dark` ancestor class
(the Storybook toolbar has a light/dark toggle). See [`design-reference/tokens.md`](./design-reference/tokens.md)
for the rationale behind the Aurora/Nebula palette, type scale, radii, and spacing.

## Project conventions

Every component lives at `src/components/<Category>/<Name>/` with exactly three files:

- `<Name>.vue`: `<script setup lang="ts">`, typed props, classes merged via `cn()`
  (`src/lib/utils.ts`), interactive/a11y-heavy behavior delegated to Reka UI primitives.
- `<Name>.stories.ts`: CSF3 Storybook stories with `argTypes` descriptions for every prop, a
  `Playground` story, variant showcases, and at least one realistic-data story.
- `index.ts`: `cva` variant definitions, exported prop/variant types, and a re-export of the
  `.vue` component.

Categories are fixed to six folder names: `LayoutNav`, `DataDisplay`, `Forms`, `Feedback`,
`Charts`, `AI`. A new component is also added to [`src/index.ts`](./src/index.ts) under the
matching category comment. The full authoring convention (props patterns, accessibility bar,
token usage, story shape) lives in
[`.claude/skills/component-builder/SKILL.md`](./.claude/skills/component-builder).

## License

MIT. See [`LICENSE`](./LICENSE).
