import { cva, type VariantProps } from 'class-variance-authority'

export { default as TextInput } from './TextInput.vue'

export const inputVariants = cva(
  [
    'flex w-full rounded-sm border bg-surface text-fg',
    'placeholder:text-fg-muted',
    'outline-none transition-[color,border-color,box-shadow] duration-150',
    'focus-visible:ring-2',
    'disabled:cursor-not-allowed disabled:bg-bg disabled:opacity-60',
  ],
  {
    variants: {
      size: {
        sm: 'h-8 px-2.5 text-sm',
        md: 'h-10 px-3 text-sm',
        lg: 'h-12 px-3.5 text-base',
      },
      invalid: {
        true: 'border-status-error-fg focus-visible:border-status-error-fg focus-visible:ring-status-error-fg/25',
        false: 'border-border focus-visible:border-brand focus-visible:ring-brand/25',
      },
    },
    defaultVariants: {
      size: 'md',
      invalid: false,
    },
  },
)

export type InputVariants = VariantProps<typeof inputVariants>
