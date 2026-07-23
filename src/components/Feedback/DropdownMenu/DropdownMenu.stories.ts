import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ArrowUpDown, Copy, FolderInput, Pencil, Power, Trash2 } from '@lucide/vue'
import { ref } from 'vue'
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
 * Pass a flat `items` array of entries and put the trigger in the `#trigger`
 * slot. An entry can be a selectable `item` (the default `type`), a `label`
 * heading, a `separator`, a `checkbox` (for multi-select filters), a `radio`
 * group (for single-choice options), or an `item` with `children` (rendered
 * as a nested submenu, to any depth). Selecting a plain item or a submenu
 * leaf emits `select` with the entry; checkbox and radio entries instead
 * carry their own `onCheckedChange` / `onValueChange` callbacks.
 */
const meta = {
  title: 'Feedback/DropdownMenu',
  component: DropdownMenu,
  argTypes: {
    items: {
      control: 'object',
      description:
        'Entries: `item` (default, optionally with `children` for a submenu), `{ type: "label" }`, `{ type: "separator" }`, `{ type: "checkbox" }`, `{ type: "radio" }`.',
    },
    align: {
      control: 'inline-radio',
      options: ['start', 'center', 'end'],
      description: 'Alignment of the menu content relative to the trigger.',
      table: { defaultValue: { summary: 'end' } },
    },
    side: {
      control: 'inline-radio',
      options: ['top', 'right', 'bottom', 'left'],
      description: 'Side of the trigger the menu content opens on.',
      table: { defaultValue: { summary: 'bottom' } },
    },
    sideOffset: {
      control: 'number',
      description: 'Pixel gap between the trigger and the menu content.',
      table: { defaultValue: { summary: '6' } },
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

const submenuItems: DropdownEntry[] = [
  { type: 'label', label: 'Instance' },
  { label: 'Rename', icon: Pencil, value: 'rename' },
  { label: 'Duplicate', icon: Copy, shortcut: '⌘D', value: 'duplicate' },
  {
    label: 'Move to',
    icon: FolderInput,
    children: [
      { type: 'label', label: 'Region' },
      { label: 'us-east-1', value: 'us-east-1' },
      { label: 'us-west-2', value: 'us-west-2' },
      {
        label: 'eu-west-1',
        value: 'eu-west-1',
        children: [
          { label: 'Availability zone A', value: 'eu-west-1a' },
          { label: 'Availability zone B', value: 'eu-west-1b' },
          { label: 'Availability zone C', value: 'eu-west-1c' },
        ],
      },
      { label: 'ap-southeast-2', value: 'ap-southeast-2' },
    ],
  },
  { type: 'separator' },
  { label: 'Terminate', icon: Trash2, danger: true, value: 'terminate' },
]

/**
 * An `item` entry with `children` renders as a submenu trigger — here a
 * "Move to" action opens a nested region picker, one level of which nests a
 * further availability-zone picker to show submenus can go arbitrarily deep.
 */
export const WithSubmenu: Story = {
  args: { items: submenuItems },
  render: (args) => ({
    components: { DropdownMenu, Button },
    setup: () => ({ args }),
    template: `
      <div class="flex justify-center p-12">
        <DropdownMenu v-bind="args" @select="(item) => console.log('select', item.value)">
          <template #trigger><Button variant="secondary">Instance actions</Button></template>
        </DropdownMenu>
      </div>`,
  }),
}

/**
 * `checkbox` entries back a multi-select filter menu — each option toggles
 * independently via `checked` / `onCheckedChange`, and the menu stays open
 * across toggles so several filters can be picked in one pass.
 */
export const CheckboxFilter: Story = {
  render: () => ({
    components: { DropdownMenu, Button },
    setup: () => {
      const statuses = ref({ running: true, stopped: true, error: false })
      const filterItems = (): DropdownEntry[] => [
        { type: 'label', label: 'Show' },
        {
          type: 'checkbox',
          label: 'Running',
          checked: statuses.value.running,
          onCheckedChange: (checked) => (statuses.value.running = checked),
        },
        {
          type: 'checkbox',
          label: 'Stopped',
          checked: statuses.value.stopped,
          onCheckedChange: (checked) => (statuses.value.stopped = checked),
        },
        {
          type: 'checkbox',
          label: 'Error',
          checked: statuses.value.error,
          onCheckedChange: (checked) => (statuses.value.error = checked),
        },
      ]
      return { filterItems }
    },
    template: `
      <div class="flex justify-center p-12">
        <DropdownMenu :items="filterItems()">
          <template #trigger><Button variant="secondary">Status</Button></template>
        </DropdownMenu>
      </div>`,
  }),
}

/**
 * A `radio` entry backs a single-choice group via Reka UI's
 * `DropdownMenuRadioGroup` — only one option can be selected at a time.
 */
export const RadioSort: Story = {
  render: () => ({
    components: { DropdownMenu, Button, ArrowUpDown },
    setup: () => {
      const sortBy = ref('name')
      const sortItems = (): DropdownEntry[] => [
        {
          type: 'radio',
          label: 'Sort by',
          value: sortBy.value,
          onValueChange: (value) => (sortBy.value = value),
          options: [
            { label: 'Name', value: 'name' },
            { label: 'Date created', value: 'created' },
            { label: 'Size', value: 'size' },
          ],
        },
      ]
      return { sortItems }
    },
    template: `
      <div class="flex justify-center p-12">
        <DropdownMenu :items="sortItems()">
          <template #trigger>
            <Button variant="secondary">
              <template #leading><ArrowUpDown class="size-4" /></template>
              Sort
            </Button>
          </template>
        </DropdownMenu>
      </div>`,
  }),
}
