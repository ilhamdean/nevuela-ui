import { cva, type VariantProps } from 'class-variance-authority'

export { default as Switch } from './Switch.vue'

export const switchTrackVariants = cva(
  [
    'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-border-strong',
    'outline-none transition-colors duration-150',
    'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'disabled:cursor-not-allowed disabled:opacity-60',
    'data-[state=checked]:bg-brand',
  ],
  {
    variants: {
      size: {
        sm: 'h-4 w-7',
        md: 'h-5 w-9',
      },
      invalid: {
        true: 'border-status-error ring-2 ring-status-error/30 ring-offset-1 ring-offset-background focus-visible:ring-status-error/40',
        false: 'focus-visible:ring-brand/25',
      },
    },
    defaultVariants: { size: 'md', invalid: false },
  },
)

export const switchThumbVariants = cva(
  [
    'pointer-events-none block rounded-full bg-surface shadow-sm ring-0 transition-transform duration-150',
    'data-[state=unchecked]:translate-x-0',
  ],
  {
    variants: {
      size: {
        sm: 'size-3 data-[state=checked]:translate-x-3',
        md: 'size-4 data-[state=checked]:translate-x-4',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

export type SwitchVariants = VariantProps<typeof switchTrackVariants>
