import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { RadioCard } from '.'

const plans = [
  {
    value: 'starter',
    title: 'Starter',
    description: 'Up to 10 members · from $4/mo',
    badge: 'Popular',
  },
  {
    value: 'team',
    title: 'Team',
    description: 'Up to 50 members, shared workspaces · from $63/mo',
  },
  { value: 'business', title: 'Business', description: 'Unlimited members, SSO · from $42/seat' },
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
    ariaLabel: 'Workspace plan',
    modelValue: 'starter',
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
      { value: 'monthly', title: 'Monthly', description: 'Billed every month' },
      { value: 'quarterly', title: 'Quarterly', description: 'Billed every 3 months' },
      {
        value: 'yearly',
        title: 'Yearly',
        description: 'Billed once a year · 2 months free',
        badge: 'Recommended',
      },
    ],
    modelValue: 'yearly',
  },
  render: (args) => ({
    components: { RadioCard },
    setup: () => ({ args }),
    template: `<div class="w-[640px]"><RadioCard v-bind="args" /></div>`,
  }),
}
