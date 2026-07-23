import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Skeleton } from '.'

/**
 * `Skeleton` is a pulsing placeholder block for content that hasn't loaded
 * yet. Purely decorative (`aria-hidden`) — pair with a `role="status"`
 * announcement at the page/section level if the loading state itself needs
 * to be conveyed to assistive tech. Size and shape are controlled entirely
 * via `class`.
 */
const meta = {
  title: 'Data Display/Skeleton',
  component: Skeleton,
  argTypes: {
    class: { control: 'text', description: 'Tailwind classes controlling size/shape.' },
  },
  args: {
    class: 'h-4 w-48',
  },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** Common shapes: text lines, an avatar circle, a card block. */
export const Shapes: Story = {
  render: () => ({
    components: { Skeleton },
    template: `
      <div class="flex w-[320px] flex-col gap-4">
        <div class="flex items-center gap-3">
          <Skeleton class="size-10 rounded-full" />
          <div class="flex flex-1 flex-col gap-2">
            <Skeleton class="h-3.5 w-2/3" />
            <Skeleton class="h-3 w-1/3" />
          </div>
        </div>
        <Skeleton class="h-24 w-full rounded-xl" />
      </div>`,
  }),
}

/** A row of text-line skeletons mimicking a loading table cell. */
export const TextLines: Story = {
  render: () => ({
    components: { Skeleton },
    template: `
      <div class="flex w-[320px] flex-col gap-2">
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-5/6" />
        <Skeleton class="h-4 w-3/4" />
      </div>`,
  }),
}
