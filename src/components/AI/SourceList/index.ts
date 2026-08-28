import { cva, type VariantProps } from 'class-variance-authority'

export { default as SourceList } from './SourceList.vue'

/** One retrieved document backing part of an answer. */
export interface Source {
  /** Stable id — used as the list key and emitted on select. Falls back to the index when omitted. */
  id?: string
  title: string
  /** Where the document lives. A `http(s)` URL renders the item as a link; anything else (or nothing) renders plain text. */
  url?: string
  /** The quoted passage the model actually used. */
  snippet?: string
  /** Origin label shown next to the citation number (e.g. "Runbooks", "docs.internal"). Derived from `url`'s host when omitted. */
  source?: string
  /** Retrieval score, 0–1. Rendered as a percentage. */
  relevance?: number
}

export const sourceListVariants = cva('', {
  variants: {
    /** `list` is a numbered reading list; `compact` is a single wrapping row of citation chips. */
    variant: {
      list: 'flex flex-col gap-2',
      compact: 'flex flex-wrap items-center gap-1.5',
    },
  },
  defaultVariants: { variant: 'list' },
})

export type SourceListVariants = VariantProps<typeof sourceListVariants>
