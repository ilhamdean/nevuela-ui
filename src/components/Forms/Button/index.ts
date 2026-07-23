import { cva, type VariantProps } from 'class-variance-authority'

export { default as Button } from './Button.vue'

/**
 * Nevuela Button variants.
 *
 * Every variant carries a 2px transparent border so height stays identical
 * whether or not the border is visible (the `secondary` variant reveals it).
 */
export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm',
    'border-2 border-transparent font-semibold',
    'cursor-pointer select-none outline-none',
    'transition-[color,background-color,border-color,box-shadow] duration-150',
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'disabled:pointer-events-none disabled:opacity-60',
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        primary: 'bg-brand text-on-accent hover:bg-brand-hover active:bg-brand-active',
        secondary:
          'bg-surface text-brand border-brand hover:bg-brand-subtle active:bg-brand-subtle',
        destructive: 'bg-status-error text-on-accent hover:opacity-90 active:opacity-80',
        ghost: 'bg-transparent text-fg hover:bg-bg-subtle active:bg-bg-subtle',
      },
      size: {
        sm: 'h-8 gap-1.5 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-5 text-base',
      },
      iconOnly: {
        true: 'px-0',
        false: '',
      },
    },
    compoundVariants: [
      { iconOnly: true, size: 'sm', class: 'w-8' },
      { iconOnly: true, size: 'md', class: 'w-10' },
      { iconOnly: true, size: 'lg', class: 'w-12' },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      iconOnly: false,
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
