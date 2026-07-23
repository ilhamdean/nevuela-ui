export { default as DataTable } from './DataTable.vue'

export interface DataTableColumn<T = Record<string, unknown>> {
  /** Property key on the row (also the slot suffix: `cell-<key>`). */
  key: (keyof T & string) | string
  label: string
  sortable?: boolean
  align?: 'left' | 'right' | 'center'
  /** CSS width, e.g. `'12rem'` or `'40%'`. */
  width?: string
  /** Extra classes for the header + body cells of this column. */
  class?: string
}

export interface DataTableSort {
  key: string
  direction: 'asc' | 'desc'
}
