import { cva, type VariantProps } from 'class-variance-authority'

export { default as ModelSelect } from './ModelSelect.vue'

/** One selectable model, with the metadata that actually drives the choice. */
export interface ModelOption {
  /** Model id sent to the API (e.g. `claude-opus-5`). This is the `v-model` value. */
  value: string
  /** Display name (e.g. "Opus 5"). */
  label: string
  /** Vendor/family shown as the group heading and next to the name. */
  provider?: string
  /** One-line positioning — when to reach for this model. */
  description?: string
  /** Context window in tokens. Rendered as a compact "200K context". */
  contextWindow?: number
  /** Short pricing note, pre-formatted by the caller (e.g. "$3 / $15 per Mtok"). */
  price?: string
  /** Small marker on the row (e.g. "New", "Preview", "Legacy"). */
  tag?: string
  disabled?: boolean
}

export const modelSelectTriggerVariants = cva(
  [
    'inline-flex w-full items-center justify-between gap-2 rounded-sm border bg-surface text-sm text-fg',
    'cursor-pointer outline-none transition-[color,border-color,box-shadow] duration-150 focus-visible:ring-2',
    'disabled:cursor-not-allowed disabled:bg-bg disabled:opacity-60',
    'data-[placeholder]:text-fg-muted',
  ],
  {
    variants: {
      size: {
        sm: 'h-8 px-2.5',
        md: 'h-10 px-3',
        lg: 'h-12 px-3.5',
      },
      invalid: {
        true: 'border-status-error-fg focus-visible:border-status-error-fg focus-visible:ring-status-error-fg/25',
        false: 'border-border focus-visible:border-brand focus-visible:ring-brand/25',
      },
    },
    defaultVariants: { size: 'md', invalid: false },
  },
)

export type ModelSelectVariants = VariantProps<typeof modelSelectTriggerVariants>
