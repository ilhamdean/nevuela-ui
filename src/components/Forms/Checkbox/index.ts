import { cva, type VariantProps } from 'class-variance-authority'

export { default as Checkbox } from './Checkbox.vue'

export const checkboxVariants = cva(
  [
    'peer inline-flex shrink-0 items-center justify-center rounded-sm border border-border-strong bg-surface',
    'outline-none transition-[color,background-color,border-color,box-shadow] duration-150',
    'focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/25',
    'disabled:cursor-not-allowed disabled:opacity-60',
    'data-[state=checked]:border-brand data-[state=checked]:bg-brand data-[state=checked]:text-on-accent',
    'data-[state=indeterminate]:border-brand data-[state=indeterminate]:bg-brand data-[state=indeterminate]:text-on-accent',
  ],
  {
    variants: {
      size: {
        sm: 'size-4',
        md: 'size-5',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
)

export type CheckboxVariants = VariantProps<typeof checkboxVariants>
