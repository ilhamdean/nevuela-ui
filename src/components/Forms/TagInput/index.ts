import { cva, type VariantProps } from 'class-variance-authority'

export { default as TagInput } from './TagInput.vue'

/**
 * Field-shell variants for `TagInput`. Applied to the `TagsInputRoot`
 * wrapper, which lays out the chips and the trailing text input together —
 * mirrors `selectTriggerVariants`' multi-select sizing (`Select.vue`'s
 * `multiple` branch), since both grow to wrap chips onto additional lines.
 * The focusable element is the inner `TagsInputInput`, so focus is signalled
 * with `focus-within:` rather than `focus-visible:` (compare `NumberInput`,
 * which has the same "wrapper + native control inside" shape).
 */
export const tagInputVariants = cva(
  [
    'flex w-full flex-wrap items-center gap-1.5 rounded-sm border bg-surface text-sm text-fg',
    'outline-none transition-[color,border-color,box-shadow] duration-150 focus-within:ring-2',
    'data-[disabled]:cursor-not-allowed data-[disabled]:bg-bg data-[disabled]:opacity-60',
  ],
  {
    variants: {
      size: {
        sm: 'min-h-8 px-2 py-1',
        md: 'min-h-10 px-2.5 py-1.5',
        lg: 'min-h-12 px-3 py-2',
      },
      invalid: {
        true: 'border-status-error-fg focus-within:border-status-error-fg focus-within:ring-status-error-fg/25',
        false: 'border-border focus-within:border-brand focus-within:ring-brand/25',
      },
    },
    defaultVariants: { size: 'md', invalid: false },
  },
)

export type TagInputVariants = VariantProps<typeof tagInputVariants>
