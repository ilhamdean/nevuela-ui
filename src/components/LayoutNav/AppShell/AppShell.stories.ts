import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import {
  Bell,
  Boxes,
  CircleHelp,
  CreditCard,
  FileText,
  Gauge,
  PanelLeft,
  Plus,
  Settings,
  ShoppingCart,
  Users,
} from '@lucide/vue'
import { Sidebar, type SidebarSection } from '../Sidebar'
import { TopBar } from '../TopBar'
import { PageHeader } from '../PageHeader'
import { Breadcrumbs } from '../Breadcrumbs'
import { Button } from '../../Forms/Button'
import { SearchInput } from '../../Forms/SearchInput'
import { Avatar } from '../../DataDisplay/Avatar'
import { StatusBadge } from '../../DataDisplay/StatusBadge'
import { DataTable, type DataTableColumn } from '../../DataDisplay/DataTable'
import { AppShell } from '.'

/**
 * `AppShell` is the top-level layout: a collapsible sidebar, a topbar spanning
 * the content area, and a scrollable content column. It exposes `collapsed`
 * (`v-model`) and hands `toggleSidebar` to the `#topbar` slot. The story below
 * composes it with Sidebar, TopBar, PageHeader, and DataTable into a full
 * application screen.
 */
const meta = {
  title: 'Layout & Nav/AppShell',
  component: AppShell,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    maxWidth: { control: 'text', description: 'Content column max width (or `false` to fill).' },
  },
  args: {},
} satisfies Meta<typeof AppShell>

export default meta
type Story = StoryObj<typeof meta>

type OrderRow = {
  id: number
  reference: string
  customer: string
  status: 'active' | 'warning' | 'off'
  total: string
}

const sections: SidebarSection[] = [
  {
    items: [
      { label: 'Overview', value: 'overview', icon: Gauge, href: '#' },
      { label: 'Billing', value: 'billing', icon: CreditCard, href: '#' },
    ],
  },
  {
    label: 'Sales',
    items: [
      { label: 'Orders', value: 'orders', icon: ShoppingCart, href: '#', badge: 5 },
      { label: 'Customers', value: 'customers', icon: Users, href: '#' },
      {
        label: 'Catalog',
        icon: Boxes,
        children: [
          { label: 'Products', value: 'products', href: '#' },
          { label: 'Collections', value: 'collections', href: '#' },
        ],
      },
    ],
  },
  {
    label: 'Workspace',
    items: [
      { label: 'Reports', value: 'reports', icon: FileText, href: '#' },
      { label: 'Settings', value: 'settings', icon: Settings, href: '#' },
    ],
  },
]

const columns: DataTableColumn<OrderRow>[] = [
  { key: 'reference', label: 'Order', sortable: true },
  { key: 'customer', label: 'Customer', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'total', label: 'Total', sortable: true, align: 'right' },
]

const rows: OrderRow[] = [
  { id: 1, reference: 'ORD-4821', customer: 'Halden & Co.', status: 'active', total: '$482.00' },
  { id: 2, reference: 'ORD-4822', customer: 'Marlow Studio', status: 'active', total: '$129.00' },
  {
    id: 3,
    reference: 'ORD-4823',
    customer: 'Petra Logistics',
    status: 'warning',
    total: '$960.00',
  },
  { id: 4, reference: 'ORD-4824', customer: 'Bright Harbor', status: 'off', total: '$35.00' },
]

const statusLabels = { active: 'Fulfilled', warning: 'On hold', off: 'Cancelled' } as const

/** A complete application screen assembled from Nevuela components. */
export const FullApplication: Story = {
  render: (args) => ({
    components: {
      AppShell,
      Sidebar,
      TopBar,
      PageHeader,
      Breadcrumbs,
      Button,
      SearchInput,
      Avatar,
      StatusBadge,
      DataTable,
      Bell,
      CircleHelp,
      Plus,
      PanelLeft,
    },
    setup() {
      const collapsed = ref(false)
      const selected = ref<number[]>([])
      return { args, collapsed, selected, sections, columns, rows, statusLabels }
    },
    template: `
      <AppShell v-bind="args" v-model:collapsed="collapsed">
        <template #sidebar="{ collapsed }">
          <Sidebar :sections="sections" active-value="orders" :collapsed="collapsed" />
        </template>

        <template #topbar="{ toggleSidebar }">
          <TopBar>
            <template #leading>
              <Button variant="ghost" size="md" icon-only aria-label="Toggle sidebar" @click="toggleSidebar"><PanelLeft /></Button>
              <span class="text-sm font-bold text-fg">Nevuela</span>
            </template>
            <template #search><SearchInput size="sm" class="max-w-md" /></template>
            <template #actions>
              <Button variant="ghost" size="md" icon-only aria-label="Help"><CircleHelp /></Button>
              <Button variant="ghost" size="md" icon-only aria-label="Notifications"><Bell /></Button>
            </template>
            <template #create><Button variant="primary"><template #leading><Plus /></template>Create</Button></template>
            <template #account><Avatar name="Morgan Tran" size="sm" /></template>
          </TopBar>
        </template>

        <PageHeader title="Orders" description="4 open orders · 2 awaiting payment">
          <template #breadcrumbs>
            <Breadcrumbs :items="[{ label: 'Workspaces', href: '#' }, { label: 'Halden & Co.', href: '#' }, { label: 'Orders' }]" />
          </template>
          <template #actions><Button variant="primary"><template #leading><Plus /></template>New order</Button></template>
        </PageHeader>

        <div class="mt-6">
          <DataTable :columns="columns" :rows="rows" row-key="id" selectable v-model:selected="selected">
            <template #cell-status="{ value }"><StatusBadge :status="value" :label="statusLabels[value]" /></template>
            <template #cell-reference="{ value }"><span class="font-mono text-xs text-fg-subtle">{{ value }}</span></template>
          </DataTable>
        </div>
      </AppShell>`,
  }),
}
