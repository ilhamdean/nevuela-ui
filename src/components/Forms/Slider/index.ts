import { cva, type VariantProps } from 'class-variance-authority'

export { default as Slider } from './Slider.vue'

/** Track (the full-width groove the thumb(s) travel along). */
export const sliderTrackVariants = cva(
  'relative w-full grow overflow-hidden rounded-full bg-bg-subtle',
  {
    variants: {
      size: {
        sm: 'h-1',
        md: 'h-1.5',
        lg: 'h-2',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

/** Draggable thumb — sized independently of the track for a comfortable hit target. */
export const sliderThumbVariants = cva(
  'block shrink-0 rounded-full border-2 border-brand bg-surface shadow-sm outline-none transition-colors focus-visible:ring-4 focus-visible:ring-brand/25',
  {
    variants: {
      size: {
        sm: 'size-3.5',
        md: 'size-4',
        lg: 'size-[18px]',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

export type SliderVariants = VariantProps<typeof sliderTrackVariants>
