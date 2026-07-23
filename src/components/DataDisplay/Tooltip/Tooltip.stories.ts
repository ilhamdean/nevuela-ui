import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Info } from '@lucide/vue'
import { Button } from '../../Forms/Button'
import { Tooltip } from '.'

/**
 * `Tooltip` shows a short hint on hover/focus, built on Reka UI (correct
 * pointer + keyboard behavior, portalled content, arrow). Put the trigger in the
 * default slot; the tooltip text in `content` or the `#content` slot.
 */
const meta = {
  title: 'Data Display/Tooltip',
  component: Tooltip,
  argTypes: {
    content: { control: 'text', description: 'Tooltip text (or use the `#content` slot).' },
    side: {
      control: 'inline-radio',
      options: ['top', 'right', 'bottom', 'left'],
      table: { defaultValue: { summary: 'top' } },
    },
    sideOffset: { control: 'number', table: { defaultValue: { summary: '6' } } },
    delay: {
      control: 'number',
      description: 'Delay before showing, in ms.',
      table: { defaultValue: { summary: '300' } },
    },
    disabled: { control: 'boolean' },
  },
  args: {
    content: 'Bandwidth resets on the 1st of each month.',
    side: 'top',
    sideOffset: 6,
    delay: 300,
    disabled: false,
  },
  render: (args) => ({
    components: { Tooltip, Button },
    setup: () => ({ args }),
    template: `
      <div class="flex justify-center p-12">
        <Tooltip v-bind="args">
          <Button variant="secondary">Hover me</Button>
        </Tooltip>
      </div>`,
  }),
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** On an icon-only affordance — a common inline-help pattern. */
export const OnIcon: Story = {
  render: (args) => ({
    components: { Tooltip, Info },
    setup: () => ({ args }),
    template: `
      <div class="flex justify-center p-12">
        <Tooltip v-bind="args">
          <button type="button" class="text-fg-muted hover:text-fg" aria-label="More info">
            <Info class="size-4" />
          </button>
        </Tooltip>
      </div>`,
  }),
}
