import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { RadioCard } from '.'

const plans = [
  { value: 'basic', title: 'Basic', description: 'Shared CPU · from $4/mo', badge: 'Popular' },
  {
    value: 'general',
    title: 'General Purpose',
    description: 'Balanced CPU & memory · from $63/mo',
  },
  { value: 'cpu', title: 'CPU-Optimized', description: 'Dedicated hyper-threads · from $42/mo' },
  { value: 'legacy', title: 'Legacy', description: 'No longer available', disabled: true },
]

/**
 * `RadioCard` is a card-style single-select group (plan / size pickers), built
 * on Reka UI's RadioGroup — arrow-key navigable, one tab stop. The selected card
 * gets a brand border + subtle fill.
 */
const meta = {
  title: 'Forms/RadioCard',
  component: RadioCard,
  argTypes: {
    modelValue: { control: 'text', description: 'Selected value (`v-model`).' },
    options: {
      control: 'object',
      description: '`{ value, title, description?, badge?, disabled? }[]`.',
    },
    orientation: {
      control: 'inline-radio',
      options: ['vertical', 'horizontal'],
      table: { defaultValue: { summary: 'vertical' } },
    },
    disabled: { control: 'boolean' },
    ariaLabel: { control: 'text', description: 'Accessible label for the group.' },
  },
  args: {
    options: plans,
    orientation: 'vertical',
    disabled: false,
    ariaLabel: 'Instance plan',
    modelValue: 'basic',
  },
  render: (args) => ({
    components: { RadioCard },
    setup: () => ({ args }),
    template: `<div class="w-96"><RadioCard v-bind="args" /></div>`,
  }),
} satisfies Meta<typeof RadioCard>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    options: [
      { value: 'regular', title: 'Regular', description: 'Disk: SSD' },
      { value: 'premium-amd', title: 'Premium AMD', description: 'Disk: NVMe SSD' },
      {
        value: 'premium-intel',
        title: 'Premium Intel',
        description: 'Disk: NVMe SSD',
        badge: 'Recommended',
      },
    ],
    modelValue: 'premium-intel',
  },
  render: (args) => ({
    components: { RadioCard },
    setup: () => ({ args }),
    template: `<div class="w-[640px]"><RadioCard v-bind="args" /></div>`,
  }),
}
