import { cva, type VariantProps } from 'class-variance-authority'

export { default as TokenUsage } from './TokenUsage.vue'

/** One turn's (or one session's) token accounting. */
export interface TokenUsageValue {
  /** Tokens sent to the model — system prompt, history, tools, the new message. */
  prompt: number
  /** Tokens the model produced. */
  completion: number
  /** Prompt tokens served from cache, billed at a reduced rate. Omit when the provider doesn't report it. */
  cached?: number
}

export const tokenUsageVariants = cva('text-fg-muted', {
  variants: {
    /** `inline` is a single meta line under a message; `card` is a bordered block for a detail panel. */
    variant: {
      inline: 'inline-flex flex-wrap items-center gap-x-3 gap-y-1',
      card: 'flex flex-col gap-3 rounded-lg border border-border bg-surface p-4',
    },
    size: {
      sm: 'text-2xs',
      md: 'text-xs',
    },
  },
  defaultVariants: { variant: 'inline', size: 'md' },
})

export type TokenUsageVariants = VariantProps<typeof tokenUsageVariants>
