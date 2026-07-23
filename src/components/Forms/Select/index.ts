import { cva, type VariantProps } from 'class-variance-authority'

export { default as Select } from './Select.vue'

export interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}

export const selectTriggerVariants = cva(
  [
    'inline-flex w-full items-center justify-between gap-2 rounded-sm border bg-surface text-sm text-fg',
    'outline-none transition-[color,border-color,box-shadow] duration-150 focus-visible:ring-2',
    'disabled:cursor-not-allowed disabled:bg-bg disabled:opacity-60',
    'data-[placeholder]:text-fg-muted',
  ],
  {
    variants: {
      size: {
        sm: 'h-8 px-2.5',
        md: 'h-10 px-3',
        lg: 'h-12 px-3.5',
      },
      invalid: {
        true: 'border-status-error focus-visible:border-status-error focus-visible:ring-status-error/25',
        false: 'border-border focus-visible:border-brand focus-visible:ring-brand/25',
      },
    },
    defaultVariants: { size: 'md', invalid: false },
  },
)

export type SelectVariants = VariantProps<typeof selectTriggerVariants>
