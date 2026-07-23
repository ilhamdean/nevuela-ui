import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { MoreHorizontal } from '@lucide/vue'
import { StatusBadge } from '../StatusBadge'
import { Button } from '../../Forms/Button'
import { EmptyState } from '../EmptyState'
import { DataTable, type DataTableColumn, type DataTableSort } from '.'

type InstanceRow = {
  id: number
  name: string
  status: 'active' | 'warning' | 'off'
  ip: string
  region: string
  vcpus: number
}

const rows: InstanceRow[] = [
  { id: 1, name: 'web-prod-01', status: 'active', ip: '203.0.113.10', region: 'NYC1', vcpus: 4 },
  { id: 2, name: 'web-prod-02', status: 'active', ip: '203.0.113.11', region: 'NYC1', vcpus: 4 },
  { id: 3, name: 'db-staging', status: 'warning', ip: '198.51.100.7', region: 'AMS3', vcpus: 8 },
  { id: 4, name: 'worker-02', status: 'off', ip: '198.51.100.9', region: 'SFO3', vcpus: 2 },
  { id: 5, name: 'cache-01', status: 'active', ip: '192.0.2.44', region: 'SGP1', vcpus: 2 },
]

const columns: DataTableColumn<InstanceRow>[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'ip', label: 'Public IP' },
  { key: 'region', label: 'Region', sortable: true },
  { key: 'vcpus', label: 'vCPUs', sortable: true, align: 'right' },
]

const statusLabels = { active: 'Active', warning: 'Rebooting', off: 'Powered off' } as const

/**
 * `DataTable` is a generic, typed table with sortable columns (client-side by
 * default), row selection, per-column cell slots (`cell-<key>`), a `#row-actions`
 * slot, a loading skeleton, and an empty state. It renders a semantic `<table>`
 * with `scope`, `aria-sort`, and accessible select-all/row checkboxes.
 */
// DataTable is a generic component; a type annotation (rather than `satisfies`)
// is the supported way to type its Storybook meta without fighting the generic.
const meta: Meta<typeof DataTable> = {
  title: 'Data Display/DataTable',
  // Cast narrows the generic component to the concrete shape Storybook's meta
  // expects; story arg typing still flows from `typeof DataTable` below.
  component: DataTable as unknown as Meta<typeof DataTable>['component'],
  argTypes: {
    selectable: {
      control: 'boolean',
      description: 'Show selection checkboxes (`v-model:selected`).',
    },
    loading: { control: 'boolean', description: 'Show a skeleton instead of rows.' },
    loadingRows: { control: 'number' },
    hasRowActions: {
      control: 'boolean',
      description: 'Reserve a trailing column for `#row-actions`.',
    },
    emptyText: { control: 'text' },
    manualSort: {
      control: 'boolean',
      description: 'Disable built-in sorting (parent sorts `rows`).',
    },
  },
  args: {
    selectable: true,
    loading: false,
    hasRowActions: true,
  },
}

export default meta
type Story = StoryObj<typeof DataTable>

/** A realistic Instances list with status badges, selection, sorting, and row actions. */
export const Playground: Story = {
  render: (args) => ({
    components: { DataTable, StatusBadge, Button, MoreHorizontal },
    setup() {
      const sort = ref<DataTableSort | null>({ key: 'name', direction: 'asc' })
      const selected = ref<number[]>([])
      return { args, rows, columns, sort, selected, statusLabels }
    },
    template: `
      <div class="w-[820px]">
        <p class="mb-2 text-xs text-fg-subtle">{{ selected.length }} selected</p>
        <DataTable
          v-bind="args"
          :columns="columns"
          :rows="rows"
          row-key="id"
          v-model:sort="sort"
          v-model:selected="selected"
        >
          <template #cell-status="{ value }">
            <StatusBadge :status="value" :label="statusLabels[value]" />
          </template>
          <template #cell-ip="{ value }">
            <span class="font-mono text-xs text-fg-subtle">{{ value }}</span>
          </template>
          <template #row-actions>
            <Button variant="ghost" size="sm" icon-only aria-label="Row actions"><MoreHorizontal /></Button>
          </template>
        </DataTable>
      </div>`,
  }),
}

/** Loading skeleton. */
export const Loading: Story = {
  args: { loading: true, loadingRows: 4 },
  render: (args) => ({
    components: { DataTable },
    setup: () => ({ args, rows, columns }),
    template: `
      <div class="w-[820px]">
        <DataTable v-bind="args" :columns="columns" :rows="rows" row-key="id" />
      </div>`,
  }),
}

/** Empty state via the default empty slot. */
export const Empty: Story = {
  args: { selectable: false, hasRowActions: false },
  render: (args) => ({
    components: { DataTable, EmptyState, Button },
    setup: () => ({ args, columns }),
    template: `
      <div class="w-[820px]">
        <DataTable v-bind="args" :columns="columns" :rows="[]" row-key="id">
          <template #empty>
            <EmptyState title="No Instances match your filters" description="Try clearing a filter or two." :bordered="false">
              <template #actions><Button variant="secondary" size="sm">Clear filters</Button></template>
            </EmptyState>
          </template>
        </DataTable>
      </div>`,
  }),
}
