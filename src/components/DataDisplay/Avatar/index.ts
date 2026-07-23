import { cva, type VariantProps } from 'class-variance-authority'

export { default as Avatar } from './Avatar.vue'

export const avatarVariants = cva(
  'relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-bg-subtle font-medium text-fg-subtle select-none',
  {
    variants: {
      size: {
        xs: 'size-6 text-2xs',
        sm: 'size-8 text-xs',
        md: 'size-10 text-sm',
        lg: 'size-12 text-base',
      },
      shape: {
        circle: 'rounded-full',
        square: 'rounded-md',
      },
    },
    defaultVariants: {
      size: 'md',
      shape: 'circle',
    },
  },
)

export type AvatarVariants = VariantProps<typeof avatarVariants>
