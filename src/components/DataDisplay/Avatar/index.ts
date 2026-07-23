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

/** Presence status shown as a corner dot. */
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away'

/** Per-status dot color (Nevuela status tokens) + the text label used for the a11y-only node. */
export const avatarStatusStyles: Record<AvatarStatus, { dot: string; label: string }> = {
  online: { dot: 'bg-status-active', label: 'Online' },
  busy: { dot: 'bg-status-error', label: 'Busy' },
  away: { dot: 'bg-status-warning', label: 'Away' },
  offline: { dot: 'bg-status-off', label: 'Offline' },
}

/** Corner presence dot — sized relative to the avatar and ringed in the surface color so it
 * reads clearly against any avatar image. */
export const avatarStatusDotVariants = cva(
  'absolute -right-0.5 -bottom-0.5 shrink-0 rounded-full ring-2 ring-surface',
  {
    variants: {
      size: {
        xs: 'size-2',
        sm: 'size-2.5',
        md: 'size-3',
        lg: 'size-3.5',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
)
