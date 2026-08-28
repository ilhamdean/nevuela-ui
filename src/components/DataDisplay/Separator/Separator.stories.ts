import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Separator } from '.'

/**
 * `Separator` is a thin visual divider between content sections. Purely
 * decorative by default (`decorative: true`, hidden from assistive tech);
 * set `decorative: false` when the line is semantically meaningful (e.g. a
 * `<Separator role="separator">` inside a menu).
 */
const meta = {
  title: 'Data Display/Separator',
  component: Separator,
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      table: { defaultValue: { summary: 'horizontal' } },
    },
    decorative: {
      control: 'boolean',
      description: 'Hide from assistive tech (no semantic meaning).',
      table: { defaultValue: { summary: 'true' } },
    },
  },
  args: {
    orientation: 'horizontal',
    decorative: true,
  },
  render: (args) => ({
    components: { Separator },
    setup: () => ({ args }),
    template: `<div class="w-[400px]"><Separator v-bind="args" /></div>`,
  }),
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** Between two blocks of text. */
export const BetweenContent: Story = {
  render: () => ({
    components: { Separator },
    template: `
      <div class="w-[400px] text-sm text-fg">
        <p>Account created on Jan 4, 2024.</p>
        <Separator class="my-4" />
        <p>Billing cycle renews on the 1st of each month.</p>
      </div>`,
  }),
}

/** Vertical, between inline items. */
export const Vertical: Story = {
  render: () => ({
    components: { Separator },
    template: `
      <div class="flex h-5 items-center gap-3 text-sm text-fg-subtle">
        <span>Blog</span>
        <Separator orientation="vertical" />
        <span>Docs</span>
        <Separator orientation="vertical" />
        <span>Support</span>
      </div>`,
  }),
}
