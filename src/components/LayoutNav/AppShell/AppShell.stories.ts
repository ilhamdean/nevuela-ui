import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import {
  Bell,
  CircleHelp,
  CreditCard,
  Database,
  Gauge,
  Globe,
  HardDrive,
  PanelLeft,
  Plus,
  Server,
  Settings,
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
 * console screen.
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

type InstanceRow = {
  id: number
  name: string
  status: 'active' | 'warning' | 'off'
  ip: string
  region: string
}

const sections: SidebarSection[] = [
  {
    items: [
      { label: 'Overview', value: 'overview', icon: Gauge, href: '#' },
      { label: 'Billing', value: 'billing', icon: CreditCard, href: '#' },
    ],
  },
  {
    label: 'Compute',
    items: [
      { label: 'Instances', value: 'instances', icon: Server, href: '#', badge: 5 },
      { label: 'Kubernetes', value: 'k8s', icon: HardDrive, href: '#' },
      {
        label: 'Databases',
        icon: Database,
        children: [
          { label: 'PostgreSQL', value: 'pg', href: '#' },
          { label: 'Redis', value: 'redis', href: '#' },
        ],
      },
    ],
  },
  {
    label: 'Networking',
    items: [
      { label: 'Domains', value: 'domains', icon: Globe, href: '#' },
      { label: 'Settings', value: 'settings', icon: Settings, href: '#' },
    ],
  },
]

const columns: DataTableColumn<InstanceRow>[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'ip', label: 'Public IP' },
  { key: 'region', label: 'Region', sortable: true },
]

const rows: InstanceRow[] = [
  { id: 1, name: 'web-prod-01', status: 'active', ip: '203.0.113.10', region: 'NYC1' },
  { id: 2, name: 'web-prod-02', status: 'active', ip: '203.0.113.11', region: 'NYC1' },
  { id: 3, name: 'db-staging', status: 'warning', ip: '198.51.100.7', region: 'AMS3' },
  { id: 4, name: 'worker-02', status: 'off', ip: '198.51.100.9', region: 'SFO3' },
]

const statusLabels = { active: 'Active', warning: 'Rebooting', off: 'Powered off' } as const

/** A complete console screen assembled from Nevuela components. */
export const FullConsole: Story = {
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
          <Sidebar :sections="sections" active-value="instances" :collapsed="collapsed" />
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

        <PageHeader title="Instances" description="5 Instances · 2 regions">
          <template #breadcrumbs>
            <Breadcrumbs :items="[{ label: 'Projects', href: '#' }, { label: 'first-project', href: '#' }, { label: 'Instances' }]" />
          </template>
          <template #actions><Button variant="primary"><template #leading><Plus /></template>Create Instance</Button></template>
        </PageHeader>

        <div class="mt-6">
          <DataTable :columns="columns" :rows="rows" row-key="id" selectable v-model:selected="selected">
            <template #cell-status="{ value }"><StatusBadge :status="value" :label="statusLabels[value]" /></template>
            <template #cell-ip="{ value }"><span class="font-mono text-xs text-fg-subtle">{{ value }}</span></template>
          </DataTable>
        </div>
      </AppShell>`,
  }),
}
