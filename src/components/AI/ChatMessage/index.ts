import { cva, type VariantProps } from 'class-variance-authority'

export { default as ChatMessage } from './ChatMessage.vue'

/** Who produced the turn. */
export type ChatRole = 'user' | 'assistant' | 'system'

export const chatMessageVariants = cva('flex w-full gap-3', {
  variants: {
    role: {
      /** Right-aligned, so a long thread scans as a conversation rather than a document. */
      user: 'flex-row-reverse',
      assistant: 'flex-row',
      /** Full-width, centered — an out-of-band note, not a participant. */
      system: 'flex-row justify-center',
    },
  },
  defaultVariants: { role: 'assistant' },
})

export const chatBubbleVariants = cva('min-w-0 rounded-lg text-sm', {
  variants: {
    role: {
      user: 'bg-brand-subtle px-3 py-2 text-fg',
      assistant: 'bg-transparent text-fg',
      system: 'border border-border bg-bg-subtle px-3 py-2 text-xs text-fg-muted',
    },
    /** Failed turns get an error wash so they're distinguishable before reading the text. */
    error: {
      true: 'border border-status-error-fg/40 bg-status-error-subtle px-3 py-2',
      false: '',
    },
  },
  defaultVariants: { role: 'assistant', error: false },
})

export type ChatMessageVariants = VariantProps<typeof chatMessageVariants>
