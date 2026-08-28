import { cva, type VariantProps } from 'class-variance-authority'

export { default as StatusBadge } from './StatusBadge.vue'

/** Semantic status kinds, mapped onto the Nevuela status tokens. */
export type StatusKind = 'active' | 'warning' | 'error' | 'off' | 'info'

/** Per-status color classes for the dot, subtle-pill background, and text. */
export const statusStyles: Record<StatusKind, { dot: string; subtleBg: string; text: string }> = {
  active: {
    dot: 'bg-status-active',
    subtleBg: 'bg-status-active-subtle',
    text: 'text-status-active-fg',
  },
  warning: {
    dot: 'bg-status-warning',
    subtleBg: 'bg-status-warning-subtle',
    text: 'text-status-warning-fg',
  },
  error: {
    dot: 'bg-status-error',
    subtleBg: 'bg-status-error-subtle',
    text: 'text-status-error-fg',
  },
  off: { dot: 'bg-status-off', subtleBg: 'bg-status-off-subtle', text: 'text-status-off-fg' },
  info: { dot: 'bg-status-info', subtleBg: 'bg-status-info-subtle', text: 'text-status-info-fg' },
}

export const statusBadgeVariants = cva(
  'inline-flex items-center gap-1.5 whitespace-nowrap align-middle font-medium',
  {
    variants: {
      variant: {
        /** Colored dot + neutral text (inline, no background). */
        dot: 'text-fg',
        /** Tinted pill with colored text. */
        subtle: 'rounded-full',
      },
      size: {
        sm: 'text-xs',
        md: 'text-sm',
      },
    },
    compoundVariants: [
      { variant: 'subtle', size: 'sm', class: 'px-2 py-0.5' },
      { variant: 'subtle', size: 'md', class: 'px-2.5 py-1' },
    ],
    defaultVariants: {
      variant: 'dot',
      size: 'md',
    },
  },
)

export type StatusBadgeVariants = VariantProps<typeof statusBadgeVariants>
