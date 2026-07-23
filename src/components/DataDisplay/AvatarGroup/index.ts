import { cva, type VariantProps } from 'class-variance-authority'
import type { AvatarStatus } from '../Avatar'

export { default as AvatarGroup } from './AvatarGroup.vue'

/** A single member of an `AvatarGroup` — the same shape `Avatar` itself takes for
 * `src`/`name`/(optional `status`), so the two never drift apart. */
export interface AvatarGroupItem {
  src?: string
  /** Alt text for the image (defaults to `name`). */
  alt?: string
  /** Used to derive initials for the fallback, and shown in the overflow tooltip. */
  name?: string
  status?: AvatarStatus
}

/** Per-item wrapper: overlaps into the previous avatar (negative margin) and rings it in the
 * surface color so overlapping avatars stay visually separated. Shares `size`/`shape` with
 * `avatarVariants` so the ring radius always matches the avatar underneath. */
export const avatarGroupItemVariants = cva(
  'relative inline-flex shrink-0 ring-2 ring-surface first:ml-0',
  {
    variants: {
      size: {
        xs: '-ml-1.5',
        sm: '-ml-2',
        md: '-ml-2.5',
        lg: '-ml-3',
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

export type AvatarGroupItemVariants = VariantProps<typeof avatarGroupItemVariants>
