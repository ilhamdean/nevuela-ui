import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Avatar } from '.'

/**
 * `Avatar` shows a user or team image with a graceful fallback: initials derived
 * from `name`, or a user icon. Built on Reka UI's Avatar (the fallback only
 * appears after the image fails/So it never flashes).
 */
const meta = {
  title: 'Data Display/Avatar',
  component: Avatar,
  argTypes: {
    src: {
      control: 'text',
      description: 'Image URL. Falls back to initials/icon when absent or broken.',
    },
    name: { control: 'text', description: 'Used for the alt text and initials fallback.' },
    alt: { control: 'text' },
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg'],
      table: { defaultValue: { summary: 'md' } },
    },
    shape: {
      control: 'inline-radio',
      options: ['circle', 'square'],
      table: { defaultValue: { summary: 'circle' } },
    },
    status: {
      control: 'select',
      options: [undefined, 'online', 'busy', 'away', 'offline'],
      description:
        'Presence dot on the bottom-right corner. Status is also conveyed via visually-hidden text, not color alone.',
    },
    loading: {
      control: 'boolean',
      description: 'Shows a pulsing skeleton circle instead of the image/fallback.',
    },
  },
  args: {
    name: 'Morgan Tran',
    size: 'md',
    shape: 'circle',
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** Initials fallback (no image). */
export const Initials: Story = { args: { src: undefined, name: 'Ada Lovelace' } }

/** Icon fallback (no image, no name). */
export const IconFallback: Story = { args: { src: undefined, name: '' } }

export const Sizes: Story = {
  render: (args) => ({
    components: { Avatar },
    setup: () => ({ args }),
    template: `
      <div class="flex items-center gap-3">
        <Avatar v-bind="args" size="xs" />
        <Avatar v-bind="args" size="sm" />
        <Avatar v-bind="args" size="md" />
        <Avatar v-bind="args" size="lg" />
      </div>`,
  }),
}

/** A presence dot on the corner, one per status. Color is reinforced with visually-hidden text
 * ("Online", "Busy", …) for non-color-only status. */
export const StatusDots: Story = {
  render: (args) => ({
    components: { Avatar },
    setup: () => ({ args }),
    template: `
      <div class="flex items-center gap-4">
        <Avatar v-bind="args" status="online" />
        <Avatar v-bind="args" status="busy" />
        <Avatar v-bind="args" status="away" />
        <Avatar v-bind="args" status="offline" />
      </div>`,
  }),
}

/** The status dot scales with avatar size. */
export const StatusAcrossSizes: Story = {
  render: (args) => ({
    components: { Avatar },
    setup: () => ({ args }),
    template: `
      <div class="flex items-center gap-3">
        <Avatar v-bind="args" status="online" size="xs" />
        <Avatar v-bind="args" status="online" size="sm" />
        <Avatar v-bind="args" status="online" size="md" />
        <Avatar v-bind="args" status="online" size="lg" />
      </div>`,
  }),
}

/** A skeleton circle shown while avatar data (image, name) is still loading. */
export const Loading: Story = {
  args: { loading: true },
}
