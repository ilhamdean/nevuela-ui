import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Spinner } from '.'

/**
 * `Spinner` is a standalone loading indicator for anywhere that isn't a
 * `Button` (which has its own built-in spinner) — inline next to text, or as
 * a full-panel loading placeholder. Pair it with `Skeleton` when the *shape*
 * of the incoming content is known; use `Spinner` when only "something is
 * processing" is known.
 */
const meta = {
  title: 'Feedback/Spinner',
  component: Spinner,
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Icon dimensions.',
      table: { defaultValue: { summary: 'md' } },
    },
    color: {
      control: 'inline-radio',
      options: ['brand', 'muted', 'current'],
      description:
        'Icon color. `current` inherits `text-current` so it can sit inside already-colored contexts (e.g. a solid button or a colored banner).',
      table: { defaultValue: { summary: 'current' } },
    },
    label: {
      control: 'text',
      description:
        'Visually-hidden accessible label announced once via `role="status"`. Ignored when the default slot has content.',
      table: { defaultValue: { summary: 'Loading' } },
    },
  },
  args: {
    size: 'md',
    color: 'brand',
    label: 'Loading',
  },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** All four sizes side by side. */
export const Sizes: Story = {
  render: () => ({
    components: { Spinner },
    template: `
      <div class="flex items-end gap-4">
        <Spinner size="sm" color="brand" />
        <Spinner size="md" color="brand" />
        <Spinner size="lg" color="brand" />
        <Spinner size="xl" color="brand" />
      </div>`,
  }),
}

/** `brand`, `muted`, and `current` (inheriting the surrounding text color). */
export const Colors: Story = {
  render: () => ({
    components: { Spinner },
    template: `
      <div class="flex items-center gap-6">
        <Spinner size="lg" color="brand" />
        <Spinner size="lg" color="muted" />
        <span class="text-status-error-fg">
          <Spinner size="lg" color="current" />
        </span>
      </div>`,
  }),
}

/** Visible inline text via the default slot — the sr-only `label` is skipped. */
export const WithLabel: Story = {
  render: () => ({
    components: { Spinner },
    template: `<Spinner size="md" color="brand">Loading orders…</Spinner>`,
  }),
}

/** Full-panel loading placeholder, roughly matching `MetricCard`'s card shell. */
export const FullPanelLoading: Story = {
  render: () => ({
    components: { Spinner },
    template: `
      <div class="flex h-64 w-[360px] flex-col items-center justify-center gap-3 rounded-xl border border-border bg-surface p-4">
        <Spinner size="xl" color="brand" label="Loading dashboard…" />
        <p class="text-sm text-fg-subtle" aria-hidden="true">Loading dashboard…</p>
      </div>`,
  }),
}
