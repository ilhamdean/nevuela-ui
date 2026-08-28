import { cva, type VariantProps } from 'class-variance-authority'

export { default as ChatThread } from './ChatThread.vue'

export const chatThreadVariants = cva('relative flex min-h-0 flex-col', {
  variants: {
    /** Vertical rhythm between turns. `comfortable` for a full-page assistant, `compact` for a side panel. */
    density: {
      comfortable: '[&>[data-thread-scroll]]:gap-6 [&>[data-thread-scroll]]:p-4',
      compact: '[&>[data-thread-scroll]]:gap-4 [&>[data-thread-scroll]]:p-3',
    },
  },
  defaultVariants: { density: 'comfortable' },
})

export type ChatThreadVariants = VariantProps<typeof chatThreadVariants>
