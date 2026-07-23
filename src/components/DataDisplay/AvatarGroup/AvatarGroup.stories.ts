import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { AvatarGroup } from '.'

const team = [
  { name: 'Morgan Tran' },
  { name: 'Ada Lovelace' },
  { name: 'Grace Hopper' },
  { name: 'Alan Turing' },
  { name: 'Katherine Johnson' },
  { name: 'Radia Perlman' },
]

/**
 * `AvatarGroup` stacks a list of `Avatar`s with a slight overlap — the standard
 * "assigned to" / team-member pattern in console UIs. Excess members beyond `max`
 * collapse into a "+N" indicator with a tooltip listing who's hidden.
 */
const meta = {
  title: 'Data Display/AvatarGroup',
  component: AvatarGroup,
  argTypes: {
    avatars: {
      control: 'object',
      description: 'Members to render, most-significant first. Same shape as a single `Avatar`.',
    },
    max: {
      control: 'number',
      description:
        'Caps how many avatars render before the rest collapse into "+N". Omit to render all.',
    },
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'Passed through to every child `Avatar` (kept in sync across the group).',
      table: { defaultValue: { summary: 'md' } },
    },
    shape: {
      control: 'inline-radio',
      options: ['circle', 'square'],
      table: { defaultValue: { summary: 'circle' } },
    },
  },
  args: {
    avatars: team,
    size: 'md',
    shape: 'circle',
  },
} satisfies Meta<typeof AvatarGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = { args: { max: 4 } }

/** No `max` — every member renders. */
export const AllVisible: Story = { args: { max: undefined } }

/** Members beyond `max` collapse into a focusable "+N" badge; hover/focus it for the full list. */
export const Overflow: Story = { args: { max: 3 } }

export const Sizes: Story = {
  render: (args) => ({
    components: { AvatarGroup },
    setup: () => ({ args }),
    template: `
      <div class="flex flex-col items-start gap-4">
        <AvatarGroup v-bind="args" size="xs" />
        <AvatarGroup v-bind="args" size="sm" />
        <AvatarGroup v-bind="args" size="md" />
        <AvatarGroup v-bind="args" size="lg" />
      </div>`,
  }),
  args: { max: 4 },
}

/** Realistic usage: assignees on a resource detail page. */
export const AssignedTo: Story = {
  render: (args) => ({
    components: { AvatarGroup },
    setup: () => ({ args }),
    template: `
      <div class="flex items-center gap-3">
        <span class="text-sm text-fg-subtle">Assigned to</span>
        <AvatarGroup v-bind="args" />
      </div>`,
  }),
  args: {
    avatars: [
      { name: 'Morgan Tran', status: 'online' },
      { name: 'Ada Lovelace', status: 'busy' },
      { name: 'Grace Hopper', status: 'away' },
      { name: 'Alan Turing', status: 'offline' },
    ],
    max: 3,
    size: 'sm',
  },
}
