import { cva, type VariantProps } from 'class-variance-authority'

export { default as Badge } from './Badge.vue'

export const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-sm font-medium whitespace-nowrap align-middle',
  {
    variants: {
      /** Decorative color only — purely categorical, carries no lifecycle/state meaning. */
      color: {
        neutral: 'border border-border bg-bg-subtle text-fg-subtle',
        brand: 'border border-transparent bg-brand-subtle text-brand',
        green: 'border border-transparent bg-status-active-subtle text-status-active',
        amber: 'border border-transparent bg-status-warning-subtle text-status-warning',
        red: 'border border-transparent bg-status-error-subtle text-status-error',
        blue: 'border border-transparent bg-status-info-subtle text-status-info',
      },
      size: {
        sm: 'px-1.5 py-0.5 text-2xs',
        md: 'px-2 py-0.5 text-xs',
      },
    },
    defaultVariants: {
      color: 'neutral',
      size: 'md',
    },
  },
)

export type BadgeVariants = VariantProps<typeof badgeVariants>
