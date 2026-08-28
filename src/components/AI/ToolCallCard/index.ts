import { cva, type VariantProps } from 'class-variance-authority'

export { default as ToolCallCard } from './ToolCallCard.vue'

/** Lifecycle of a single tool invocation. */
export type ToolCallStatus = 'pending' | 'running' | 'success' | 'error'

/**
 * Per-status presentation. `label` is the text that carries the state — the
 * color never carries it alone.
 */
export const toolCallStatusStyles: Record<
  ToolCallStatus,
  { label: string; text: string; dot: string; border: string }
> = {
  pending: {
    label: 'Queued',
    text: 'text-status-off-fg',
    dot: 'bg-status-off',
    border: 'border-border',
  },
  running: {
    label: 'Running',
    text: 'text-status-info-fg',
    dot: 'bg-status-info',
    border: 'border-status-info-fg/40',
  },
  success: {
    label: 'Completed',
    text: 'text-status-active-fg',
    dot: 'bg-status-active',
    border: 'border-border',
  },
  error: {
    label: 'Failed',
    text: 'text-status-error-fg',
    dot: 'bg-status-error',
    border: 'border-status-error-fg/40',
  },
}

export const toolCallCardVariants = cva('overflow-hidden rounded-lg border bg-surface', {
  variants: {
    status: {
      pending: toolCallStatusStyles.pending.border,
      running: toolCallStatusStyles.running.border,
      success: toolCallStatusStyles.success.border,
      error: toolCallStatusStyles.error.border,
    },
  },
  defaultVariants: { status: 'success' },
})

export type ToolCallCardVariants = VariantProps<typeof toolCallCardVariants>
