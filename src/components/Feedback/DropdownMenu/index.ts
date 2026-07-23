import type { Component } from 'vue'

export { default as DropdownMenu } from './DropdownMenu.vue'

export interface DropdownMenuItem {
  type?: 'item'
  label: string
  icon?: Component
  /** Right-aligned hint, e.g. a keyboard shortcut. */
  shortcut?: string
  /** Style as a destructive action. */
  danger?: boolean
  disabled?: boolean
  /** Arbitrary identifier passed back on `select`. */
  value?: string
  /**
   * Nested entries. When present, the item renders as a submenu trigger
   * (with a chevron-right indicator) instead of a selectable item, and no
   * longer emits `select` — only its descendants do. Submenus may nest to
   * any depth.
   */
  children?: DropdownEntry[]
}

export interface DropdownMenuSeparator {
  type: 'separator'
}

export interface DropdownMenuLabel {
  type: 'label'
  label: string
}

export interface DropdownCheckboxEntry {
  type: 'checkbox'
  label: string
  disabled?: boolean
  /** Arbitrary identifier for the consumer's own bookkeeping. */
  value?: string
  /** Whether the checkbox is currently checked. */
  checked: boolean
  /** Called with the new checked state when the item is toggled. */
  onCheckedChange?: (checked: boolean) => void
}

export interface DropdownRadioOption {
  label: string
  value: string
  disabled?: boolean
}

export interface DropdownRadioEntry {
  type: 'radio'
  /** Optional heading rendered above the group of options. */
  label?: string
  /** Currently-selected option value. */
  value: string
  options: DropdownRadioOption[]
  /** Called with the newly-selected option value. */
  onValueChange?: (value: string) => void
}

export type DropdownEntry =
  | DropdownMenuItem
  | DropdownMenuSeparator
  | DropdownMenuLabel
  | DropdownCheckboxEntry
  | DropdownRadioEntry
