import { cva, type VariantProps } from 'class-variance-authority'

export { default as InputGroup } from './InputGroup.vue'

/**
 * Sizing for the plain-text addons (`leadingText`/`trailingText`) only — mirrors
 * `inputVariants`' size scale so the addon lines up with a slotted TextInput/Select
 * of the same `size`.
 */
export const inputGroupAddonVariants = cva(
  [
    'flex items-center whitespace-nowrap rounded-sm border bg-bg-subtle text-fg-muted',
    'transition-[color,border-color] duration-150',
  ],
  {
    variants: {
      size: {
        sm: 'h-8 px-2.5 text-sm',
        md: 'h-10 px-3 text-sm',
        lg: 'h-12 px-3.5 text-base',
      },
      invalid: {
        true: 'border-status-error',
        false: 'border-border',
      },
      disabled: {
        true: 'opacity-60',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      invalid: false,
      disabled: false,
    },
  },
)

export type InputGroupAddonVariants = VariantProps<typeof inputGroupAddonVariants>
