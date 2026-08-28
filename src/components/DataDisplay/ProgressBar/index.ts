import { cva, type VariantProps } from 'class-variance-authority'

export { default as ProgressBar } from './ProgressBar.vue'

export const progressTrackVariants = cva(
  'relative w-full overflow-hidden rounded-full bg-bg-subtle',
  {
    variants: {
      size: {
        sm: 'h-1.5',
        md: 'h-2',
        lg: 'h-3',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

export const progressIndicatorColors = {
  brand: 'bg-brand',
  active: 'bg-status-active',
  warning: 'bg-status-warning',
  error: 'bg-status-error',
} as const

export type ProgressColor = keyof typeof progressIndicatorColors
export type ProgressVariants = VariantProps<typeof progressTrackVariants>
