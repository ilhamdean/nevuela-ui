import { cva, type VariantProps } from 'class-variance-authority'

export { default as StreamingText } from './StreamingText.vue'

export const streamingTextVariants = cva('whitespace-pre-wrap text-fg', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: { size: 'md' },
})

export type StreamingTextVariants = VariantProps<typeof streamingTextVariants>
