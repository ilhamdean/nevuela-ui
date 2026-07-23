import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { KbdShortcut } from '.'

/**
 * `KbdShortcut` renders a small, quiet keyboard-shortcut hint as one or more
 * raised "key cap" chips — for use next to menu items, tooltips, or a command
 * palette. It has no interactivity. Pass `keys` as an array (each element
 * becomes its own cap, rendered verbatim) or as a single string containing
 * `+` (split into caps automatically, e.g. `'Ctrl+Shift+P'`).
 */
const meta = {
  title: 'Data Display/KbdShortcut',
  component: KbdShortcut,
  argTypes: {
    keys: {
      control: 'object',
      description:
        "The keys to render. An array renders each element as its own cap verbatim (`['⌘', 'K']`); a single string is split on `+` into separate caps (`'Ctrl+Shift+P'`), or rendered as one cap if it has no `+` (`'Esc'`).",
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md'],
      description: 'Key-cap size — `sm` is the unobtrusive inline default.',
      table: { defaultValue: { summary: 'sm' } },
    },
  },
  args: {
    keys: ['⌘', 'K'],
    size: 'sm',
  },
} satisfies Meta<typeof KbdShortcut>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** A single key cap. */
export const SingleKey: Story = {
  args: { keys: 'Esc' },
}

/** A combo passed as an array — each element renders as its own cap, unsplit. */
export const Combo: Story = {
  args: { keys: ['⌘', 'K'] },
}

/** A combo passed as one string, split automatically on `+`. */
export const StringSyntax: Story = {
  args: { keys: 'Ctrl+Shift+P' },
}

/** Both sizes side by side. */
export const Sizes: Story = {
  render: (args) => ({
    components: { KbdShortcut },
    setup: () => ({ args }),
    template: `
      <div class="flex items-center gap-4">
        <KbdShortcut v-bind="args" size="sm" />
        <KbdShortcut v-bind="args" size="md" />
      </div>`,
  }),
}

/** In context: shortcut hints right-aligned in a compact menu-item row, the
 * intended placement next to menu items or inside a command palette. */
export const InMenuRow: Story = {
  render: (args) => ({
    components: { KbdShortcut },
    setup: () => ({ args }),
    template: `
      <ul class="w-72 divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface p-1">
        <li class="flex items-center justify-between rounded-md px-3 py-2 hover:bg-bg-subtle">
          <span class="text-sm text-fg">Open command palette</span>
          <KbdShortcut :keys="['⌘', 'K']" />
        </li>
        <li class="flex items-center justify-between rounded-md px-3 py-2 hover:bg-bg-subtle">
          <span class="text-sm text-fg">Save</span>
          <KbdShortcut :keys="['⌘', 'S']" />
        </li>
        <li class="flex items-center justify-between rounded-md px-3 py-2 hover:bg-bg-subtle">
          <span class="text-sm text-fg">Command menu</span>
          <KbdShortcut keys="Ctrl+Shift+P" />
        </li>
      </ul>`,
  }),
}
