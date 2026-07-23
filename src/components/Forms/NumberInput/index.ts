import { cva, type VariantProps } from 'class-variance-authority'

export { default as NumberInput } from './NumberInput.vue'

/**
 * Field-shell variants for `NumberInput`. Applied to the `NumberFieldRoot`
 * wrapper (not the native `<input>`, which sits borderless inside it) since
 * the stepper buttons share the same bordered frame. The focusable element
 * is the inner input, so focus is signalled with `focus-within:` rather than
 * `focus-visible:` (compare `TextInput`, whose native input is itself the
 * focusable + stylable element).
 */
export const numberInputVariants = cva(
  [
    'flex w-full items-stretch rounded-sm border bg-surface text-fg',
    'outline-none transition-[color,border-color,box-shadow] duration-150',
    'focus-within:ring-2',
    'data-[disabled]:cursor-not-allowed data-[disabled]:bg-bg data-[disabled]:opacity-60',
  ],
  {
    variants: {
      size: {
        sm: 'h-8 text-sm',
        md: 'h-10 text-sm',
        lg: 'h-12 text-base',
      },
      invalid: {
        true: 'border-status-error focus-within:border-status-error focus-within:ring-status-error/25',
        false: 'border-border focus-within:border-brand focus-within:ring-brand/25',
      },
    },
    defaultVariants: {
      size: 'md',
      invalid: false,
    },
  },
)

export type NumberInputVariants = VariantProps<typeof numberInputVariants>
