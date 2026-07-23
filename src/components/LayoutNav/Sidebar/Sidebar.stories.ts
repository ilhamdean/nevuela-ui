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

const deepSections: SidebarSection[] = [
  {
    items: [{ label: 'Overview', value: 'overview', icon: Gauge, href: '#' }],
  },
  {
    label: 'Compute',
    items: [
      { label: 'Instances', value: 'instances', icon: Server, href: '#', badge: 5 },
      {
        label: 'Databases',
        icon: Database,
        children: [
          {
            label: 'Relational',
            children: [
              { label: 'PostgreSQL', value: 'pg', href: '#' },
              { label: 'MySQL', value: 'mysql', href: '#' },
            ],
          },
          {
            label: 'Key-value',
            children: [
              { label: 'Redis', value: 'redis', href: '#' },
              { label: 'Memcached', value: 'memcached', href: '#' },
            ],
          },
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
 * arbitrarily deep expandable nested items, and a collapsed icon-only rail —
 * where items with children open a fly-out submenu on hover/focus. Set
 * `activeValue` to the current item's `value`.
 */
const meta = {
  title: 'Layout & Nav/Sidebar',
  component: Sidebar,
  argTypes: {
    sections: {
      control: 'object',
      description:
        'Grouped nav: `{ label?, items }[]`. Each item may nest `children` to any depth for a multi-level tree.',
    },
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

/**
 * `children` can nest to any depth — here "Databases" contains two subgroups
 * ("Relational", "Key-value") which each contain leaf items. Setting
 * `activeValue` to a third-level item auto-expands every ancestor group.
 */
export const DeepNesting: Story = {
  args: { sections: deepSections, activeValue: 'redis' },
}

/**
 * When `collapsed`, items with `children` render as an icon-only trigger:
 * hovering or focusing it opens a fly-out panel to the right of the rail
 * listing that item's children, itself recursing for further nesting. Story
 * playback can't simulate the hover, but the structure below (a 3-level tree
 * behind the "Databases" icon) exercises the same data the fly-out renders —
 * open Storybook and hover the icon to see it live.
 */
export const CollapsedWithFlyout: Story = {
  args: { sections: deepSections, collapsed: true, activeValue: 'redis' },
  render: (args) => ({
    components: { Sidebar },
    setup: () => ({ args }),
    template: `<div class="flex h-[560px] w-16 items-start rounded-xl border border-border bg-surface"><Sidebar v-bind="args" /></div>`,
  }),
}
