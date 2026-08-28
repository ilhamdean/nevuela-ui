import { cva, type VariantProps } from 'class-variance-authority'

export { default as DatePicker } from './DatePicker.vue'

export const datePickerTriggerVariants = cva(
  [
    'inline-flex w-full items-center gap-2 rounded-sm border bg-surface text-sm text-fg',
    'outline-none transition-[color,border-color,box-shadow] duration-150 focus-within:ring-2',
  ],
  {
    variants: {
      size: {
        sm: 'h-8 px-2.5 text-xs',
        md: 'h-10 px-3',
        lg: 'h-12 px-3.5 text-base',
      },
      invalid: {
        true: 'border-status-error-fg focus-within:border-status-error-fg focus-within:ring-status-error-fg/25',
        false: 'border-border focus-within:border-brand focus-within:ring-brand/25',
      },
      disabled: {
        true: 'cursor-not-allowed bg-bg opacity-60',
        false: '',
      },
    },
    defaultVariants: { size: 'md', invalid: false, disabled: false },
  },
)

export type DatePickerVariants = VariantProps<typeof datePickerTriggerVariants>
