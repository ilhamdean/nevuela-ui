export { default as DescriptionList } from './DescriptionList.vue'

export interface DescriptionItem {
  /**
   * The label rendered in `<dt>`. Also slugified (lowercased, spaces → hyphens)
   * to key the per-item slot: a term of "Status" looks for `#item-status`.
   */
  term: string
  /** The value rendered in `<dd>`. Ignored when a matching `item-<slug>` slot is provided. */
  value?: string | number
  /** Render the value via `CopyableField` instead of plain text (good for IDs/ARNs). */
  copyable?: boolean
  /** `2` lets this item span the full row width (e.g. a long description/JSON blob). */
  span?: 1 | 2
}
