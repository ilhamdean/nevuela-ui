---
name: component-builder
description: >-
  Authoring convention for Nevuela UI components. Use whenever adding or editing a
  component in this repo (src/components/**) so new work matches the established
  file structure, variant pattern, design tokens, accessibility bar, and
  Storybook story shape. Triggers: "add a component", "new Nevuela component",
  "build a <X> component", editing anything under src/components.
---

# Nevuela UI — component authoring convention

Nevuela is an original Vue 3 design system ("Aurora/Nebula"). Every component follows the
same shape so the library stays consistent. Read this before adding one.

## 1. File structure

```
src/components/<Category>/<Name>/
├── <Name>.vue          # <script setup lang="ts">
├── <Name>.stories.ts   # CSF3 stories with hand-written argType descriptions
└── index.ts            # cva variants + types + component re-export
```

Categories (exact folder names): `LayoutNav`, `DataDisplay`, `Forms`, `Feedback`,
`Charts`. After creating a component, **add it to `src/index.ts`** under the right
category comment: `export * from './components/<Category>/<Name>'`.

## 2. `index.ts` — variants + exports

Put cva variant definitions and public types here; re-export the component.

```ts
import { cva, type VariantProps } from 'class-variance-authority'

export { default as Name } from './Name.vue'

export const nameVariants = cva('base classes', {
  variants: { variant: { primary: '…' }, size: { sm: '…', md: '…' } },
  defaultVariants: { variant: 'primary', size: 'md' },
})
export type NameVariants = VariantProps<typeof nameVariants>
```

Also export any option/item interfaces the component's props use
(e.g. `SelectOption`, `DropdownEntry`) from here.

## 3. `Name.vue` — the component

- Always `<script setup lang="ts">`.
- Typed props via an `interface Props` + `withDefaults(defineProps<Props>(), …)`.
  Keep a `class?: HTMLAttributes['class']` prop and merge it last.
- Merge classes with `cn(...)` from `@/lib/utils` (tailwind-merge + clsx):
  `:class="cn(nameVariants({ variant, size }), props.class)"`.
- **Tokens only** — never raw colors/hex. Use the semantic utilities in §5.
- Behavior-heavy components wrap **Reka UI** primitives (`reka-ui`) rather than
  hand-rolling a11y. Use `useForwardExpose()` for polymorphic root elements.
- `v-model` → `defineModel<T>()` (named models for open/collapsed/etc.).
- When the root is a wrapper but a native control is inside (inputs), set
  `defineOptions({ inheritAttrs: false })` and `v-bind="$attrs"` on the control so
  native attributes (`id`, `placeholder`, `aria-*`) land on the right element.
- Expose refs/methods with `defineExpose` when a parent needs them
  (e.g. `{ inputRef, focus }`).

## 4. Accessibility (this is an admin console — non-negotiable)

- Color is never the only signal — status carries a text label.
- Icon-only interactive elements require an `aria-label`; decorative icons get
  `aria-hidden="true"`.
- Form controls are label-associated (`for`/`id`, generate ids with `useId()`).
- Invalid states set `aria-invalid`; loading buttons set `aria-busy`.
- Prefer Reka UI for focus management, roving focus, and dialog/overlay semantics.
- The Storybook a11y addon runs in `error` mode — stories must pass.

## 5. Design tokens (semantic Tailwind utilities)

Defined in `src/style.css`. Use these — do not invent colors.

- **Brand:** `bg-brand` `bg-brand-hover` `bg-brand-active` `bg-brand-subtle`
  `text-brand` `text-link`, focus ring `ring-brand/25`.
- **Neutrals:** `bg-surface` (cards) · `bg-bg` (page) · `bg-bg-subtle` (wells/zebra)
  · `border-border` / `border-border-strong` · text `text-fg` `text-fg-subtle`
  `text-fg-muted` · on-solid text `text-on-accent`.
- **Status** (each has solid + `-subtle`): `status-active` (green), `status-warning`
  (amber), `status-error` (red), `status-off` (neutral), `status-info` (indigo) —
  e.g. `bg-status-active`, `text-status-error`, `bg-status-warning-subtle`.
- **Charts:** `--chart-1…6` (read in JS via `getComputedStyle`, see UsageChart).
- **Radius:** `rounded-sm` (6px, default for buttons/inputs/badges),
  `rounded-md` (8px), `rounded-lg` (10px), `rounded-xl` (12px, cards),
  `rounded-2xl` (16px, modals), `rounded-full`.
- **Type:** `text-2xs` `text-xs` `text-sm` `text-base` `text-lg` `text-xl`
  `text-2xl` `text-3xl` (1.5 rhythm). Weights: 400/500/600/700 (`font-semibold`
  for buttons/labels/headings).
- **Elevation:** `shadow-sm` (cards) · `shadow-md` (popovers/menus) · `shadow-lg`
  (modals).
- **Control sizing:** heights sm 32 / md 40 / lg 48 px; secondary/selected use a
  **2px** border; inputs use a 1px `border-border`.

## 6. `Name.stories.ts` — Storybook (CSF3)

```ts
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Name } from '.'

/** One-paragraph component doc (shows on the autodocs page). */
const meta = {
  title: '<Category label>/Name',   // e.g. 'Forms/Button', 'Data Display/Avatar'
  component: Name,
  argTypes: {
    // hand-written descriptions for EVERY prop; include defaults via table
    variant: { control: 'select', options: [...], description: '…', table: { defaultValue: { summary: 'primary' } } },
  },
  args: { /* realistic defaults */ },
} satisfies Meta<typeof Name>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}          // drives every control
// + variant showcases and ≥1 realistic-data story (console-flavored sample data)
```

- Autodocs is enabled globally (`.storybook/preview.ts`) — no per-story tag needed.
- Slot content driven by an arg → use a `render` with a template string.
- **Generic components** (like DataTable): type meta with an annotation
  `const meta: Meta<typeof X> = {…}` (not `satisfies`), cast `component` with
  `as unknown as Meta<typeof X>['component']`, and use `StoryObj<typeof X>`.

## 7. Verify before finishing

```bash
pnpm typecheck   # vue-tsc strict — must be clean
pnpm lint        # eslint --fix — must be clean
pnpm build-storybook   # compiles every story (or check the running dev server)
```

Match the existing components (Button, StatusBadge, TextInput, DataTable) for tone
and density rather than introducing a new pattern.
