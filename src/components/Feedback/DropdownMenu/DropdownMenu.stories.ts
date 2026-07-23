import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Copy, Pencil, Power, Trash2 } from '@lucide/vue'
import { Button } from '../../Forms/Button'
import { DropdownMenu, type DropdownEntry } from '.'

const items: DropdownEntry[] = [
  { type: 'label', label: 'Actions' },
  { label: 'Rename', icon: Pencil, value: 'rename' },
  { label: 'Duplicate', icon: Copy, shortcut: '⌘D', value: 'duplicate' },
  { label: 'Power off', icon: Power, value: 'power' },
  { type: 'separator' },
  { label: 'Destroy', icon: Trash2, danger: true, value: 'destroy' },
]

/**
 * `DropdownMenu` wraps Reka UI's menu (roving focus, typeahead, correct ARIA).
 * Pass a flat `items` array of entries — items, `label` headings, and
 * `separator`s — and put the trigger in the `#trigger` slot. Selecting an item
 * emits `select` with the entry.
 */
const meta = {
  title: 'Feedback/DropdownMenu',
  component: DropdownMenu,
  argTypes: {
    items: {
      control: 'object',
      description: 'Entries: items, `{ type: "label" }`, `{ type: "separator" }`.',
    },
    align: {
      control: 'inline-radio',
      options: ['start', 'center', 'end'],
      table: { defaultValue: { summary: 'end' } },
    },
    side: {
      control: 'inline-radio',
      options: ['top', 'right', 'bottom', 'left'],
      table: { defaultValue: { summary: 'bottom' } },
    },
  },
  args: {
    items,
    align: 'end',
    side: 'bottom',
  },
  render: (args) => ({
    components: { DropdownMenu, Button },
    setup: () => ({ args }),
    template: `
      <div class="flex justify-center p-12">
        <DropdownMenu v-bind="args" @select="(item) => console.log('select', item.value)">
          <template #trigger><Button variant="secondary">Actions</Button></template>
        </DropdownMenu>
      </div>`,
  }),
} satisfies Meta<typeof DropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
