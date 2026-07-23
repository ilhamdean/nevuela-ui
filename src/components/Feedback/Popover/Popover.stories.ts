import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Button } from '../../Forms/Button'
import { Popover } from '.'

/**
 * `Popover` shows rich, interactive content anchored to a trigger (built on Reka
 * UI — focus management, dismiss on outside-click/Escape). Put the trigger in
 * `#trigger` and the panel content in the default slot.
 */
const meta = {
  title: 'Feedback/Popover',
  component: Popover,
  argTypes: {
    side: {
      control: 'inline-radio',
      options: ['top', 'right', 'bottom', 'left'],
      table: { defaultValue: { summary: 'bottom' } },
    },
    align: {
      control: 'inline-radio',
      options: ['start', 'center', 'end'],
      table: { defaultValue: { summary: 'center' } },
    },
    sideOffset: { control: 'number', table: { defaultValue: { summary: '8' } } },
  },
  args: {
    side: 'bottom',
    align: 'center',
    sideOffset: 8,
  },
  render: (args) => ({
    components: { Popover, Button },
    setup: () => ({ args }),
    template: `
      <div class="flex justify-center p-16">
        <Popover v-bind="args">
          <template #trigger><Button variant="secondary">Resize Instance</Button></template>
          <div class="space-y-2">
            <p class="font-semibold text-fg">Resize this Instance</p>
            <p class="text-fg-subtle">Choose a larger plan. CPU and RAM changes require a power cycle.</p>
            <div class="flex justify-end gap-2 pt-1">
              <Button variant="ghost" size="sm">Cancel</Button>
              <Button variant="primary" size="sm">Continue</Button>
            </div>
          </div>
        </Popover>
      </div>`,
  }),
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
