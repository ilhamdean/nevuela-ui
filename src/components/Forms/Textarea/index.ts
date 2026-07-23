import { cva, type VariantProps } from 'class-variance-authority'

export { default as Textarea } from './Textarea.vue'

export const textareaVariants = cva(
  [
    'flex w-full rounded-sm border bg-surface px-3 py-2 text-sm text-fg',
    'placeholder:text-fg-muted',
    'outline-none transition-[color,border-color,box-shadow] duration-150 focus-visible:ring-2',
    'disabled:cursor-not-allowed disabled:bg-bg disabled:opacity-60',
  ],
  {
    variants: {
      invalid: {
        true: 'border-status-error focus-visible:border-status-error focus-visible:ring-status-error/25',
        false: 'border-border focus-visible:border-brand focus-visible:ring-brand/25',
      },
      resize: {
        none: 'resize-none',
        vertical: 'resize-y',
        both: 'resize',
      },
    },
    defaultVariants: {
      invalid: false,
      resize: 'vertical',
    },
  },
)

export type TextareaVariants = VariantProps<typeof textareaVariants>
