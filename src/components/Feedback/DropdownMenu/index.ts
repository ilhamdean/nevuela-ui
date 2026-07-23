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
}

export interface DropdownMenuSeparator {
  type: 'separator'
}

export interface DropdownMenuLabel {
  type: 'label'
  label: string
}

export type DropdownEntry = DropdownMenuItem | DropdownMenuSeparator | DropdownMenuLabel
