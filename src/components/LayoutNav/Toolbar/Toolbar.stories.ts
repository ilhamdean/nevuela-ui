import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Download, MoreHorizontal, Plus, Trash2 } from '@lucide/vue'
import { Button } from '../../Forms/Button'
import { SearchInput } from '../../Forms/SearchInput'
import { Select } from '../../Forms/Select'
import { Toolbar } from '.'

const statusOptions = [
  { label: 'All statuses', value: 'all' },
  { label: 'Fulfilled', value: 'fulfilled' },
  { label: 'On hold', value: 'on-hold' },
  { label: 'Cancelled', value: 'cancelled' },
]

const channelOptions = [
  { label: 'All channels', value: 'all' },
  { label: 'Online store', value: 'online' },
  { label: 'In person', value: 'in-person' },
  { label: 'Marketplace', value: 'marketplace' },
]

/**
 * `Toolbar` is the structural search + filters + bulk-actions bar that sits directly above a
 * record `DataTable`. It's a slot-driven shell, not a data-driven component: the default slot
 * holds the left-hand search/filter cluster, the `actions` slot holds right-aligned primary
 * actions, and the `bulk-actions` slot supplies a contextual row that appears once
 * `selectedCount` is greater than zero — the toolbar itself only provides the surrounding chrome
 * and the "N selected" / clear affordance.
 */
const meta = {
  title: 'Layout & Nav/Toolbar',
  component: Toolbar,
  argTypes: {
    selectedCount: {
      control: 'number',
      description:
        'Number of currently-selected rows. When > 0 **and** a `bulk-actions` slot is supplied, a highlighted bulk-actions row appears below the main toolbar.',
      table: { defaultValue: { summary: '0' } },
    },
    sticky: {
      control: 'boolean',
      description:
        'Pin the toolbar to the top of its scroll container (`sticky top-0 z-10 bg-surface`) — a lower z-index than `Banner`/`Modal` since this is a local in-flow sticky element, not a page-level overlay.',
      table: { defaultValue: { summary: 'false' } },
    },
  },
  args: {
    selectedCount: 0,
    sticky: false,
  },
} satisfies Meta<typeof Toolbar>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground — search + a status filter on the left, a primary action + overflow menu button on the right. */
export const Playground: Story = {
  render: (args) => ({
    components: { Toolbar, Button, SearchInput, Select, Plus, MoreHorizontal },
    setup: () => ({ args, statusOptions }),
    template: `
      <div class="w-[820px]">
        <Toolbar v-bind="args">
          <SearchInput class="max-w-xs" placeholder="Search orders…" />
          <Select :options="statusOptions" placeholder="Status" class="w-40" />
          <template #actions>
            <Button variant="primary">
              <template #leading><Plus /></template>
              New order
            </Button>
            <Button variant="ghost" icon-only aria-label="More actions">
              <MoreHorizontal />
            </Button>
          </template>
        </Toolbar>
      </div>`,
  }),
}

/**
 * Once rows are selected, a `bg-brand-subtle` bulk-actions row appears below the search/filter
 * row (which stays visible so filters/search remain reachable) showing the selection count, the
 * consumer-supplied `bulk-actions`, and a "Clear" button that emits `clear-selection`.
 */
export const BulkActionsActive: Story = {
  render: (args) => ({
    components: { Toolbar, Button, SearchInput, Select, Plus, Trash2, Download },
    setup: () => ({ args, statusOptions }),
    template: `
      <div class="w-[820px]">
        <Toolbar v-bind="args">
          <SearchInput class="max-w-xs" placeholder="Search orders…" />
          <Select :options="statusOptions" placeholder="Status" class="w-40" />
          <template #actions>
            <Button variant="primary">
              <template #leading><Plus /></template>
              New order
            </Button>
          </template>
          <template #bulk-actions>
            <Button variant="secondary" size="sm">
              <template #leading><Download /></template>
              Export selected
            </Button>
            <Button variant="destructive" size="sm">
              <template #leading><Trash2 /></template>
              Delete selected
            </Button>
          </template>
        </Toolbar>
      </div>`,
  }),
  args: { selectedCount: 3 },
}

/** `sticky` pins the toolbar to the top of a scrolling ancestor as the mock record list scrolls beneath it. */
export const Sticky: Story = {
  render: (args) => ({
    components: { Toolbar, Button, SearchInput, Plus },
    setup: () => ({ args }),
    template: `
      <div class="h-72 w-[720px] overflow-y-auto rounded-lg border border-border">
        <Toolbar v-bind="args">
          <SearchInput class="max-w-xs" placeholder="Search orders…" />
          <template #actions>
            <Button variant="primary">
              <template #leading><Plus /></template>
              New order
            </Button>
          </template>
        </Toolbar>
        <div class="space-y-2 p-3">
          <div v-for="i in 20" :key="i" class="h-10 rounded-md bg-bg-subtle" />
        </div>
      </div>`,
  }),
  args: { sticky: true },
}

/** A full record-list toolbar: search, a status filter, a channel filter, "New order", and an overflow menu button. */
export const RecordListToolbar: Story = {
  render: (args) => ({
    components: { Toolbar, Button, SearchInput, Select, Plus, MoreHorizontal },
    setup: () => ({ args, statusOptions, channelOptions }),
    template: `
      <div class="w-[900px]">
        <Toolbar v-bind="args">
          <SearchInput class="max-w-xs" placeholder="Search by order number or customer…" />
          <Select :options="statusOptions" placeholder="Status" class="w-40" />
          <Select :options="channelOptions" placeholder="Channel" class="w-48" />
          <template #actions>
            <Button variant="primary">
              <template #leading><Plus /></template>
              New order
            </Button>
            <Button variant="ghost" icon-only aria-label="More actions">
              <MoreHorizontal />
            </Button>
          </template>
        </Toolbar>
      </div>`,
  }),
}
