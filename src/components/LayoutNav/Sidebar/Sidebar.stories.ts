import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { CreditCard, Database, Gauge, Globe, HardDrive, Server, Settings } from '@lucide/vue'
import { Sidebar, type SidebarSection } from '.'

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

/**
 * `Sidebar` renders grouped navigation with section headings, an active state,
 * one level of expandable nested items, and a collapsed icon-only rail. Set
 * `activeValue` to the current item's `value`.
 */
const meta = {
  title: 'Layout & Nav/Sidebar',
  component: Sidebar,
  argTypes: {
    sections: { control: 'object', description: 'Grouped nav: `{ label?, items }[]`.' },
    activeValue: { control: 'text', description: 'Value of the active item.' },
    collapsed: { control: 'boolean', description: 'Icon-only rail.' },
  },
  args: {
    sections,
    activeValue: 'instances',
    collapsed: false,
  },
  render: (args) => ({
    components: { Sidebar },
    setup: () => ({ args }),
    template: `<div class="h-[560px] w-60 rounded-xl border border-border bg-surface"><Sidebar v-bind="args" /></div>`,
  }),
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Collapsed: Story = {
  args: { collapsed: true },
  render: (args) => ({
    components: { Sidebar },
    setup: () => ({ args }),
    template: `<div class="h-[560px] w-16 rounded-xl border border-border bg-surface"><Sidebar v-bind="args" /></div>`,
  }),
}
