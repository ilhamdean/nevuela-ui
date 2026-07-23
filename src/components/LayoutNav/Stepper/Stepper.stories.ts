import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Stepper } from '.'

/**
 * `Stepper` shows progress through a multi-step flow (e.g. a create wizard).
 * Completed steps show a check, the current step is highlighted and marked
 * `aria-current="step"`, and upcoming steps are muted.
 */
const meta = {
  title: 'Layout & Nav/Stepper',
  component: Stepper,
  argTypes: {
    current: {
      control: { type: 'number', min: 0, max: 3 },
      description: 'Zero-based index of the current step.',
    },
    steps: { control: 'object', description: '`{ label, description? }[]`.' },
  },
  args: {
    current: 1,
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
    template: `<div class="w-[720px]"><Stepper v-bind="args" /></div>`,
  }),
} satisfies Meta<typeof Stepper>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const FirstStep: Story = { args: { current: 0 } }
export const Completed: Story = { args: { current: 4 } }
