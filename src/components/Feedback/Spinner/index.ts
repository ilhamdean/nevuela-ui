import { cva, type VariantProps } from 'class-variance-authority'

export { default as Spinner } from './Spinner.vue'

export const spinnerVariants = cva('shrink-0 animate-spin', {
  variants: {
    size: {
      sm: 'size-3.5',
      md: 'size-4',
      lg: 'size-6',
      xl: 'size-8',
    },
  },
  defaultVariants: { size: 'md' },
})

export const spinnerColors = {
  brand: 'text-brand',
  muted: 'text-fg-muted',
  current: 'text-current',
} as const

export type SpinnerColor = keyof typeof spinnerColors
export type SpinnerVariants = VariantProps<typeof spinnerVariants>
