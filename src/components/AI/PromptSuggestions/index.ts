import { cva, type VariantProps } from 'class-variance-authority'
import type { FunctionalComponent } from 'vue'

export { default as PromptSuggestions } from './PromptSuggestions.vue'

/** A starter prompt offered before (or between) turns. */
export interface PromptSuggestion {
  /** Short label shown on the chip/card. */
  label: string
  /** Text actually sent when picked. Defaults to `label`. */
  prompt?: string
  /** Second line, `card` variant only — what the prompt will do. */
  description?: string
  /** Lucide icon component. */
  icon?: FunctionalComponent
  disabled?: boolean
}

export const promptSuggestionVariants = cva(
  [
    'group flex cursor-pointer items-start gap-2 border text-left outline-none',
    'transition-[color,background-color,border-color,box-shadow] duration-150',
    'hover:border-brand hover:bg-brand-subtle',
    'focus-visible:ring-2 focus-visible:ring-brand/25',
    'disabled:pointer-events-none disabled:opacity-60',
  ],
  {
    variants: {
      variant: {
        /** Pill in a wrapping row — for a dense toolbar or an inline follow-up row. */
        chip: 'items-center rounded-full border-border bg-surface px-3 py-1.5 text-xs text-fg-subtle',
        /** Tile in a responsive grid — for an empty conversation's landing state. */
        card: 'flex-col rounded-lg border-border bg-surface p-3 text-sm text-fg',
      },
    },
    defaultVariants: { variant: 'chip' },
  },
)

export type PromptSuggestionVariants = VariantProps<typeof promptSuggestionVariants>
