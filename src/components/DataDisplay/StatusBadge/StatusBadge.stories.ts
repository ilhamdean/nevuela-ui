import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { StatusBadge } from '.'

/**
 * `StatusBadge` communicates the state of a record (an order, an invoice, a
 * job run…). Color is never the only signal — a text label is always present
 * — so it remains legible to color-blind and screen-reader users.
 */
const meta = {
  title: 'Data Display/StatusBadge',
  component: StatusBadge,
  argTypes: {
    status: {
      control: 'select',
      options: ['active', 'warning', 'error', 'off', 'info'],
      description:
        'Semantic status driving the color: `active` (green, healthy), `warning` (amber), `error` (red), `off` (neutral), `info` (blue).',
      table: { defaultValue: { summary: 'active' } },
    },
    variant: {
      control: 'inline-radio',
      options: ['dot', 'subtle'],
      description: '`dot` = colored dot + neutral text; `subtle` = tinted pill with colored text.',
      table: { defaultValue: { summary: 'dot' } },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md'],
      table: { defaultValue: { summary: 'md' } },
    },
    dot: {
      control: 'boolean',
      description: 'Show the leading status dot.',
      table: { defaultValue: { summary: 'true' } },
    },
    label: { control: 'text', description: 'Text label (or use the default slot).' },
  },
  args: {
    status: 'active',
    variant: 'dot',
    size: 'md',
    dot: true,
    label: 'Active',
  },
} satisfies Meta<typeof StatusBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** Every status in the `dot` style. */
export const AllStatuses: Story = {
  render: (args) => ({
    components: { StatusBadge },
    setup: () => ({ args }),
    template: `
      <div class="flex flex-col items-start gap-2">
        <StatusBadge v-bind="args" status="active" label="Active" />
        <StatusBadge v-bind="args" status="warning" label="On hold" />
        <StatusBadge v-bind="args" status="error" label="Failed" />
        <StatusBadge v-bind="args" status="off" label="Draft" />
        <StatusBadge v-bind="args" status="info" label="Provisioning" />
      </div>`,
  }),
  args: { label: '' },
}

/** The `subtle` tinted-pill style. */
export const SubtlePills: Story = {
  render: (args) => ({
    components: { StatusBadge },
    setup: () => ({ args }),
    template: `
      <div class="flex flex-wrap items-center gap-2">
        <StatusBadge v-bind="args" status="active" label="Active" />
        <StatusBadge v-bind="args" status="warning" label="Degraded" />
        <StatusBadge v-bind="args" status="error" label="Offline" />
        <StatusBadge v-bind="args" status="off" label="Archived" />
        <StatusBadge v-bind="args" status="info" label="New" />
      </div>`,
  }),
  args: { variant: 'subtle', label: '' },
}

/** In context: a compact record list. */
export const InRecordList: Story = {
  render: (args) => ({
    components: { StatusBadge },
    setup: () => ({ args }),
    template: `
      <ul class="w-80 divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
        <li class="flex items-center justify-between px-4 py-3">
          <span class="text-sm text-fg">ORD-4821</span>
          <StatusBadge status="active" label="Fulfilled" />
        </li>
        <li class="flex items-center justify-between px-4 py-3">
          <span class="text-sm text-fg">ORD-4823</span>
          <StatusBadge status="warning" label="On hold" />
        </li>
        <li class="flex items-center justify-between px-4 py-3">
          <span class="text-sm text-fg">ORD-4824</span>
          <StatusBadge status="off" label="Draft" />
        </li>
      </ul>`,
  }),
  args: { label: '' },
}
