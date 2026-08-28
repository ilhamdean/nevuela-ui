import { cva, type VariantProps } from 'class-variance-authority'

export { default as PromptInput } from './PromptInput.vue'

/** A file staged alongside the prompt. */
export interface PromptAttachment {
  /** Stable id — used as the list key and emitted on removal. */
  id: string
  name: string
  /** Size in bytes. Rendered as a compact label when present. */
  size?: number
}

export const promptInputVariants = cva(
  [
    'flex flex-col gap-2 rounded-lg border bg-surface p-2',
    'transition-[border-color,box-shadow] duration-150',
    'focus-within:ring-2',
  ],
  {
    variants: {
      invalid: {
        true: 'border-status-error-fg focus-within:border-status-error-fg focus-within:ring-status-error-fg/25',
        false: 'border-border focus-within:border-brand focus-within:ring-brand/25',
      },
      disabled: {
        true: 'cursor-not-allowed bg-bg opacity-60',
        false: '',
      },
    },
    defaultVariants: { invalid: false, disabled: false },
  },
)

export type PromptInputVariants = VariantProps<typeof promptInputVariants>
