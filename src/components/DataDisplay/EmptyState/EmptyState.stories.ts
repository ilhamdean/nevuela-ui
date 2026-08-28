import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ShoppingCart } from '@lucide/vue'
import { Button } from '../../Forms/Button'
import { EmptyState } from '.'

/**
 * `EmptyState` fills the space where a list, table, or panel has no content yet —
 * with an icon, a message, and a call to action. Pair it with `DataTable`'s empty
 * slot or a freshly-created project.
 */
const meta = {
  title: 'Data Display/EmptyState',
  component: EmptyState,
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text', description: 'Supporting copy (or use the default slot).' },
    bordered: { control: 'boolean', description: 'Render inside a dashed bordered panel.' },
  },
  args: {
    title: 'No orders yet',
    description: 'Create your first order to get started — it takes less than a minute.',
    bordered: true,
  },
  render: (args) => ({
    components: { EmptyState, Button },
    setup: () => ({ args, ShoppingCart }),
    template: `
      <div class="w-[560px]">
        <EmptyState v-bind="args" :icon="ShoppingCart">
          <template #actions>
            <Button variant="primary">New order</Button>
            <Button variant="ghost">Read the docs</Button>
          </template>
        </EmptyState>
      </div>`,
  }),
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Plain: Story = {
  args: { bordered: false, title: 'No results', description: 'Try adjusting your filters.' },
}
