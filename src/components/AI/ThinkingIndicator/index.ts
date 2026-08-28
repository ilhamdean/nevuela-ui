import { cva, type VariantProps } from 'class-variance-authority'

export { default as ThinkingIndicator } from './ThinkingIndicator.vue'

export const thinkingIndicatorVariants = cva(
  'inline-flex items-center gap-2 align-middle text-fg-muted',
  {
    variants: {
      size: {
        sm: 'text-xs',
        md: 'text-sm',
      },
      /** `bare` sits inline in a message; `pill` gets a wash + border so it reads as its own block. */
      variant: {
        bare: '',
        pill: 'rounded-full border border-border bg-bg-subtle',
      },
    },
    compoundVariants: [
      { variant: 'pill', size: 'sm', class: 'px-2.5 py-1' },
      { variant: 'pill', size: 'md', class: 'px-3 py-1.5' },
    ],
    defaultVariants: { size: 'md', variant: 'bare' },
  },
)

export type ThinkingIndicatorVariants = VariantProps<typeof thinkingIndicatorVariants>
