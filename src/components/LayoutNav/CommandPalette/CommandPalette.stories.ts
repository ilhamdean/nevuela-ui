import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import {
  BookOpen,
  CreditCard,
  FileText,
  FolderKanban,
  Home,
  Plus,
  ShoppingCart,
  Settings,
  UserPlus,
  Users,
} from '@lucide/vue'
import { Button } from '../../Forms/Button'
import { CommandPalette, type CommandItem } from '.'

/**
 * `CommandPalette` is a ⌘K-style quick-nav overlay: a centered dialog with a
 * search input at top and a filtered, grouped, keyboard-navigable list of
 * commands below. It listens for `Cmd/Ctrl+K` globally and opens itself —
 * no wiring required beyond mounting the component and passing `items`.
 * Control visibility with `v-model:open` (e.g. from a trigger button too),
 * and listen for `@select` to act on the chosen `CommandItem` (the palette
 * closes itself on selection).
 */
const meta = {
  title: 'Layout & Nav/CommandPalette',
  component: CommandPalette,
  argTypes: {
    items: {
      control: false,
      description:
        'Commands/pages to list, each `{ id, label, group?, icon?, shortcut?, disabled? }`. Items sharing a `group` are rendered under one heading, in first-seen order; ungrouped items render unlabeled.',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder for the search input.',
      table: { defaultValue: { summary: "'Type a command or search…'" } },
    },
    emptyText: {
      control: 'text',
      description: 'Message shown when no item matches the current search text.',
      table: { defaultValue: { summary: "'No results found.'" } },
    },
    open: {
      control: 'boolean',
      description:
        'Open state (`v-model:open`). Also flips to `true` automatically on `Cmd/Ctrl+K`, wherever the component is mounted.',
    },
  },
  args: {
    items: [],
    placeholder: 'Type a command or search…',
    emptyText: 'No results found.',
  },
} satisfies Meta<typeof CommandPalette>

export default meta
type Story = StoryObj<typeof meta>

const basicItems: CommandItem[] = [
  { id: 'home', label: 'Go to Dashboard', group: 'Pages', icon: Home },
  { id: 'orders', label: 'Go to Orders', group: 'Pages', icon: ShoppingCart },
  { id: 'billing', label: 'Go to Billing', group: 'Pages', icon: CreditCard },
  { id: 'new-order', label: 'New order', group: 'Actions', icon: Plus },
  { id: 'invite', label: 'Invite teammate', group: 'Actions', icon: UserPlus },
  { id: 'recent-1', label: 'ORD-4821 · Halden & Co.', group: 'Recent', icon: ShoppingCart },
  { id: 'recent-2', label: 'Q3 rollout plan', group: 'Recent', icon: FolderKanban },
]

/**
 * A `Button` opens the palette here — but try **Cmd/Ctrl+K** too, from
 * anywhere on this page: the shortcut listener is wired by the component
 * itself as soon as it's mounted, independent of any trigger.
 */
export const Playground: Story = {
  render: (args) => ({
    components: { CommandPalette, Button },
    setup() {
      const open = ref(false)
      const lastSelected = ref<string | null>(null)
      return { args, open, lastSelected, items: basicItems }
    },
    template: `
      <div>
        <Button variant="secondary" @click="open = true">Open command palette…</Button>
        <p class="mt-3 text-sm text-fg-muted">
          Press <strong>Cmd/Ctrl+K</strong> to open it as well.
          <template v-if="lastSelected"> Last selected: <strong>{{ lastSelected }}</strong></template>
        </p>
        <CommandPalette
          v-bind="args"
          v-model:open="open"
          :items="items"
          @select="(item) => (lastSelected = item.label)"
        />
      </div>`,
  }),
}

/**
 * Items spread across a few named groups ("Pages" / "Actions" / "Recent") —
 * the group heading only renders for groups that still have a match as you
 * type, and disappears entirely once its items are filtered out.
 */
export const Grouped: Story = {
  render: (args) => ({
    components: { CommandPalette, Button },
    setup() {
      const open = ref(true)
      const items: CommandItem[] = [
        { id: 'home', label: 'Go to Dashboard', group: 'Pages', icon: Home },
        { id: 'orders', label: 'Go to Orders', group: 'Pages', icon: ShoppingCart },
        { id: 'billing', label: 'Go to Billing', group: 'Pages', icon: CreditCard },
        { id: 'settings', label: 'Go to Settings', group: 'Pages', icon: Settings },
        { id: 'new-order', label: 'New order', group: 'Actions', icon: Plus },
        { id: 'invite', label: 'Invite teammate', group: 'Actions', icon: UserPlus },
        { id: 'recent-1', label: 'ORD-4821 · Halden & Co.', group: 'Recent', icon: ShoppingCart },
        { id: 'recent-2', label: 'Q3 rollout plan', group: 'Recent', icon: FolderKanban },
      ]
      return { args, open, items }
    },
    template: `
      <div>
        <Button variant="secondary" @click="open = true">Reopen</Button>
        <CommandPalette v-bind="args" v-model:open="open" :items="items" />
      </div>`,
  }),
}

/**
 * `emptyText` renders once the search text matches nothing — best explored
 * live: open the palette and type something like "zzz".
 */
export const Empty: Story = {
  args: {
    emptyText: 'No matching commands. Try a different search.',
  },
  render: (args) => ({
    components: { CommandPalette, Button },
    setup() {
      const open = ref(true)
      return { args, open, items: basicItems }
    },
    template: `
      <div>
        <Button variant="secondary" @click="open = true">Reopen</Button>
        <CommandPalette v-bind="args" v-model:open="open" :items="items" />
      </div>`,
  }),
}

/**
 * A realistic application command set — page navigation, record creation, and
 * help, each carrying a keyboard shortcut hint rendered via `KbdShortcut`.
 */
export const ApplicationCommands: Story = {
  render: (args) => ({
    components: { CommandPalette, Button },
    setup() {
      const open = ref(false)
      const items: CommandItem[] = [
        {
          id: 'go-dashboard',
          label: 'Go to Dashboard',
          group: 'Navigate',
          icon: Home,
          shortcut: 'G+D',
        },
        {
          id: 'go-billing',
          label: 'Go to Billing',
          group: 'Navigate',
          icon: CreditCard,
          shortcut: 'G+B',
        },
        {
          id: 'go-settings',
          label: 'Go to Settings',
          group: 'Navigate',
          icon: Settings,
          shortcut: 'G+S',
        },
        {
          id: 'go-team',
          label: 'Go to Team',
          group: 'Navigate',
          icon: Users,
        },
        {
          id: 'create-order',
          label: 'New order',
          group: 'Create',
          icon: ShoppingCart,
          shortcut: 'Ctrl+I',
        },
        {
          id: 'invite-teammate',
          label: 'Invite teammate',
          group: 'Create',
          icon: UserPlus,
        },
        {
          id: 'view-docs',
          label: 'View documentation',
          group: 'Help',
          icon: BookOpen,
        },
        {
          id: 'view-changelog',
          label: 'View changelog',
          group: 'Help',
          icon: FileText,
          disabled: true,
        },
      ]
      return { args, open, items }
    },
    template: `
      <div>
        <Button variant="primary" @click="open = true">Open command palette…</Button>
        <CommandPalette v-bind="args" v-model:open="open" :items="items" />
      </div>`,
  }),
}
