import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, ref } from 'vue'
import { MoreHorizontal } from '@lucide/vue'
import { StatusBadge } from '../StatusBadge'
import { Button } from '../../Forms/Button'
import { EmptyState } from '../EmptyState'
import { DataTable, type DataTableColumn, type DataTableSort } from '.'

type InvoiceRow = {
  id: number
  number: string
  customer: string
  status: 'active' | 'warning' | 'off'
  issued: string
  amount: number
}

const rows: InvoiceRow[] = [
  {
    id: 1,
    number: 'INV-2026-0148',
    customer: 'Halden & Co.',
    status: 'active',
    issued: '2026-07-02',
    amount: 4820,
  },
  {
    id: 2,
    number: 'INV-2026-0149',
    customer: 'Marlow Studio',
    status: 'active',
    issued: '2026-07-04',
    amount: 1290,
  },
  {
    id: 3,
    number: 'INV-2026-0150',
    customer: 'Petra Logistics',
    status: 'warning',
    issued: '2026-06-18',
    amount: 9600,
  },
  {
    id: 4,
    number: 'INV-2026-0151',
    customer: 'Bright Harbor',
    status: 'off',
    issued: '2026-07-09',
    amount: 350,
  },
  {
    id: 5,
    number: 'INV-2026-0152',
    customer: 'Nordvik Retail',
    status: 'active',
    issued: '2026-07-11',
    amount: 2145,
  },
]

const columns: DataTableColumn<InvoiceRow>[] = [
  { key: 'number', label: 'Invoice', sortable: true },
  { key: 'customer', label: 'Customer', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'issued', label: 'Issued', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true, align: 'right' },
]

const statusLabels = { active: 'Paid', warning: 'Overdue', off: 'Draft' } as const

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
    pageSize: {
      control: 'number',
      description:
        'Rows per page. Omit to disable pagination entirely — the table renders exactly as it does without these props.',
    },
    total: {
      control: 'number',
      description:
        'Total row count across all pages. Provide this for **server-side** pagination (`rows` is already just the current page and the table only renders controls, emitting `update:page` for you to refetch). Omit for **client-side** pagination (`rows` holds the full dataset and the table slices it internally).',
    },
    pageSizeOptions: {
      control: 'object',
      description: 'Options for the rows-per-page selector.',
      table: { defaultValue: { summary: '[10, 25, 50, 100]' } },
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

/** A realistic invoice list with status badges, selection, sorting, and row actions. */
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
          <template #cell-number="{ value }">
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

const customers = [
  'Halden & Co.',
  'Marlow Studio',
  'Petra Logistics',
  'Bright Harbor',
  'Nordvik Retail',
] as const
const statuses = ['active', 'warning', 'off'] as const

/** 200 mock rows for the client-side pagination story. */
const manyRows: InvoiceRow[] = Array.from({ length: 200 }, (_, i) => ({
  id: i + 1,
  number: `INV-2026-${String(i + 1).padStart(4, '0')}`,
  customer: customers[i % customers.length],
  status: statuses[i % statuses.length],
  issued: `2026-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
  amount: [350, 1290, 2145, 4820, 9600][i % 5],
}))

/**
 * Client-side pagination: `rows` holds the full 200-row dataset and the
 * table slices it internally based on `page`/`pageSize`. No `total` prop —
 * that's what signals client-side mode.
 */
export const Paginated: Story = {
  args: { selectable: false, hasRowActions: false },
  render: (args) => ({
    components: { DataTable, StatusBadge },
    setup() {
      const page = ref(1)
      const pageSize = ref(25)
      return { args, manyRows, columns, page, pageSize, statusLabels }
    },
    template: `
      <div class="w-[820px]">
        <DataTable
          v-bind="args"
          :columns="columns"
          :rows="manyRows"
          row-key="id"
          v-model:page="page"
          :page-size="pageSize"
          @page-size-change="pageSize = $event"
        >
          <template #cell-status="{ value }">
            <StatusBadge :status="value" :label="statusLabels[value]" />
          </template>
          <template #cell-number="{ value }">
            <span class="font-mono text-xs text-fg-subtle">{{ value }}</span>
          </template>
        </DataTable>
      </div>`,
  }),
}

/**
 * Server-side pagination: `rows` is only the current page's slice, and
 * `total` reflects the full remote dataset size. The story simulates a
 * network fetch on `update:page` / page-size change.
 */
export const ServerPaginated: Story = {
  args: { selectable: false, hasRowActions: false },
  render: (args) => ({
    components: { DataTable, StatusBadge },
    setup() {
      const page = ref(1)
      const pageSize = ref(10)
      const totalRows = 200
      const currentRows = computed(() => {
        const start = (page.value - 1) * pageSize.value
        return manyRows.slice(start, start + pageSize.value)
      })
      function onPageSizeChange(size: number) {
        pageSize.value = size
        page.value = 1
      }
      return {
        args,
        columns,
        page,
        pageSize,
        totalRows,
        currentRows,
        statusLabels,
        onPageSizeChange,
      }
    },
    template: `
      <div class="w-[820px]">
        <DataTable
          v-bind="args"
          :columns="columns"
          :rows="currentRows"
          row-key="id"
          manual-sort
          v-model:page="page"
          :page-size="pageSize"
          :total="totalRows"
          @page-size-change="onPageSizeChange"
        >
          <template #cell-status="{ value }">
            <StatusBadge :status="value" :label="statusLabels[value]" />
          </template>
          <template #cell-number="{ value }">
            <span class="font-mono text-xs text-fg-subtle">{{ value }}</span>
          </template>
        </DataTable>
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
            <EmptyState title="No invoices match your filters" description="Try clearing a filter or two." :bordered="false">
              <template #actions><Button variant="secondary" size="sm">Clear filters</Button></template>
            </EmptyState>
          </template>
        </DataTable>
      </div>`,
  }),
}
