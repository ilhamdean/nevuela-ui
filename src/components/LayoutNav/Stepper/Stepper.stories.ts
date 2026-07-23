import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Stepper } from '.'

/**
 * `Stepper` shows progress through a multi-step flow (e.g. a create wizard).
 * Completed steps show a check, the current step is highlighted and marked
 * `aria-current="step"`, and upcoming steps are muted. A step can also be
 * flagged with `status: 'error'` to show it failed validation, and the whole
 * rail can run `vertical` for a sidebar wizard layout.
 */
const meta = {
  title: 'Layout & Nav/Stepper',
  component: Stepper,
  argTypes: {
    current: {
      control: { type: 'number', min: 0, max: 3 },
      description: 'Zero-based index of the current step.',
    },
    steps: {
      control: 'object',
      description: "`{ label, description?, status? }[]`. `status: 'error'` flags a failed step.",
    },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description: 'Lay the rail out as a row or a vertical wizard rail.',
      table: { defaultValue: { summary: 'horizontal' } },
    },
  },
  args: {
    current: 1,
    orientation: 'horizontal',
    steps: [
      { label: 'Choose image', description: 'OS & apps' },
      { label: 'Choose size', description: 'CPU & RAM' },
      { label: 'Authentication', description: 'SSH or password' },
      { label: 'Finalize', description: 'Name & tags' },
    ],
  },
  render: (args) => ({
    components: { Stepper },
    setup: () => ({ args }),
    template: `<div :class="args.orientation === 'vertical' ? 'w-64' : 'w-[720px]'"><Stepper v-bind="args" /></div>`,
  }),
} satisfies Meta<typeof Stepper>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const FirstStep: Story = { args: { current: 0 } }
export const Completed: Story = { args: { current: 4 } }

/** A vertical rail suits a sidebar wizard layout. */
export const Vertical: Story = {
  args: { orientation: 'vertical' },
}

/** A step flagged `status: 'error'` renders with the error token and icon, distinct from "upcoming". */
export const WithErrorStep: Story = {
  args: {
    current: 2,
    steps: [
      { label: 'Choose image', description: 'OS & apps' },
      {
        label: 'Choose size',
        description: 'CPU & RAM',
        status: 'error',
      },
      { label: 'Authentication', description: 'SSH or password' },
      { label: 'Finalize', description: 'Name & tags' },
    ],
  },
}
