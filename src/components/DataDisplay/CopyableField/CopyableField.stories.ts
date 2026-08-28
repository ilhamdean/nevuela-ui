import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { CopyableField } from '.'

/**
 * `CopyableField` shows a value with a one-click copy button — for IP addresses,
 * connection strings, API tokens, and resource IDs. The button announces
 * "Copied" via a polite live region and briefly swaps to a check.
 */
const meta = {
  title: 'Data Display/CopyableField',
  component: CopyableField,
  argTypes: {
    value: { control: 'text' },
    label: { control: 'text' },
    mono: {
      control: 'boolean',
      description: 'Monospace value (IPs, tokens, IDs).',
      table: { defaultValue: { summary: 'true' } },
    },
    truncate: { control: 'boolean' },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md'],
      table: { defaultValue: { summary: 'md' } },
    },
  },
  args: {
    value: '203.0.113.42',
    label: 'Public IPv4',
    mono: true,
    truncate: false,
    size: 'md',
  },
  render: (args) => ({
    components: { CopyableField },
    setup: () => ({ args }),
    template: `<div class="w-80"><CopyableField v-bind="args" /></div>`,
  }),
} satisfies Meta<typeof CopyableField>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** A long value truncated to fit. */
export const ConnectionString: Story = {
  args: {
    label: 'Connection string',
    value: 'postgresql://app:•••••@db-primary-01.internal:5432/app',
    truncate: true,
  },
}
