import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { Boxes, CreditCard, FileText, Gauge, Settings, ShoppingCart, Users } from '@lucide/vue'
import { Sidebar, type SidebarSection } from '.'

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

const deepSections: SidebarSection[] = [
  {
    items: [{ label: 'Overview', value: 'overview', icon: Gauge, href: '#' }],
  },
  {
    label: 'Sales',
    items: [
      { label: 'Orders', value: 'orders', icon: ShoppingCart, href: '#', badge: 5 },
      {
        label: 'Catalog',
        icon: Boxes,
        children: [
          {
            label: 'Physical goods',
            children: [
              { label: 'Products', value: 'products', href: '#' },
              { label: 'Bundles', value: 'bundles', href: '#' },
            ],
          },
          {
            label: 'Digital goods',
            children: [
              { label: 'Downloads', value: 'downloads', href: '#' },
              { label: 'Licenses', value: 'licenses', href: '#' },
            ],
          },
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
    activeValue: 'orders',
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

/**
 * `activeValue` is a controlled prop — wire `@select` back to it, as a real
 * consumer would (e.g. on route change), rather than relying on Nevuela to
 * track selection internally. Click "Catalog" to expand it, then click a
 * child: the group stays expanded and the newly-selected child highlights.
 */
export const Interactive: Story = {
  render: (args) => ({
    components: { Sidebar },
    setup: () => {
      const active = ref(args.activeValue)
      return { args, active }
    },
    template: `<div class="h-[560px] w-60 rounded-xl border border-border bg-surface"><Sidebar v-bind="args" :active-value="active" @select="active = $event.value" /></div>`,
  }),
}

/** Same as `Interactive`, but with a 3-level tree — expand "Catalog" then a
 * subgroup, then select a leaf: both ancestor levels stay expanded. */
export const DeepInteractive: Story = {
  args: { sections: deepSections, activeValue: 'orders' },
  render: (args) => ({
    components: { Sidebar },
    setup: () => {
      const active = ref(args.activeValue)
      return { args, active }
    },
    template: `<div class="h-[560px] w-60 rounded-xl border border-border bg-surface"><Sidebar v-bind="args" :active-value="active" @select="active = $event.value" /></div>`,
  }),
}

/**
 * Simulates an external route change — `activeValue` set programmatically
 * from outside the sidebar (e.g. a router navigation), not by clicking a
 * currently-visible sidebar link — jumping straight to a 3rd-level item.
 * Click "Navigate to Licenses": every ancestor group ("Catalog", "Digital goods")
 * auto-expands to reveal it, even though neither was ever manually opened.
 */
export const ExternalNavigation: Story = {
  args: { sections: deepSections, activeValue: 'orders' },
  render: (args) => ({
    components: { Sidebar },
    setup: () => {
      const active = ref(args.activeValue)
      return { args, active }
    },
    template: `<div class="flex h-[560px] w-60 flex-col gap-2">
      <button type="button" class="rounded-sm border border-border px-2 py-1 text-sm" @click="active = 'licenses'">Navigate to Licenses</button>
      <div class="flex-1 rounded-xl border border-border bg-surface"><Sidebar v-bind="args" :active-value="active" @select="active = $event.value" /></div>
    </div>`,
  }),
}

export const Collapsed: Story = {
  args: { collapsed: true },
  render: (args) => ({
    components: { Sidebar },
    setup: () => ({ args }),
    template: `<div class="h-[560px] w-16 rounded-xl border border-border bg-surface"><Sidebar v-bind="args" /></div>`,
  }),
}

/**
 * `children` can nest to any depth — here "Catalog" contains two subgroups
 * ("Physical goods", "Digital goods") which each contain leaf items. Setting
 * `activeValue` to a third-level item auto-expands every ancestor group.
 */
export const DeepNesting: Story = {
  args: { sections: deepSections, activeValue: 'licenses' },
}

/**
 * When `collapsed`, items with `children` render as an icon-only trigger:
 * hovering or focusing it opens a fly-out panel to the right of the rail
 * listing that item's children, itself recursing for further nesting. Story
 * playback can't simulate the hover, but the structure below (a 3-level tree
 * behind the "Catalog" icon) exercises the same data the fly-out renders —
 * open Storybook and hover the icon to see it live.
 */
export const CollapsedWithFlyout: Story = {
  args: { sections: deepSections, collapsed: true, activeValue: 'licenses' },
  render: (args) => ({
    components: { Sidebar },
    setup: () => ({ args }),
    template: `<div class="flex h-[560px] w-16 items-start rounded-xl border border-border bg-surface"><Sidebar v-bind="args" /></div>`,
  }),
}

/** `Interactive`, but for the collapsed rail's hover fly-out: hover "Catalog",
 * expand "Physical goods", then click a leaf — the fly-out stays open. */
export const CollapsedInteractive: Story = {
  args: { sections: deepSections, collapsed: true, activeValue: 'orders' },
  render: (args) => ({
    components: { Sidebar },
    setup: () => {
      const active = ref(args.activeValue)
      return { args, active }
    },
    template: `<div class="flex h-[560px] w-16 items-start rounded-xl border border-border bg-surface"><Sidebar v-bind="args" :active-value="active" @select="active = $event.value" /></div>`,
  }),
}
