import { cva, type VariantProps } from 'class-variance-authority'

export { default as Banner } from './Banner.vue'

// Re-exported so consumers of `Banner` don't need to reach into `Alert` directly.
export type { AlertTone as BannerTone } from '../Alert'

export const bannerVariants = cva(
  'relative flex w-full items-center gap-3 rounded-none px-4 py-2.5 text-sm md:px-6',
  {
    variants: {
      tone: {
        info: 'bg-status-info-subtle',
        success: 'bg-status-active-subtle',
        warning: 'bg-status-warning-subtle',
        error: 'bg-status-error-subtle',
      },
      sticky: {
        true: 'sticky top-0 z-40',
        false: '',
      },
    },
    defaultVariants: { tone: 'info', sticky: false },
  },
)

export type BannerVariants = VariantProps<typeof bannerVariants>
