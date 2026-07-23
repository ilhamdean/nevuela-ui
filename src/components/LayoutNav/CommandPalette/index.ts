import type { Component } from 'vue'

export { default as CommandPalette } from './CommandPalette.vue'

/** One entry in the palette's command/page list. */
export interface CommandItem {
  id: string
  label: string
  /** Section heading this command is listed under (e.g. "Navigate", "Actions"). Omit to leave it ungrouped. */
  group?: string
  icon?: Component
  /** Right-aligned hint, e.g. `'⌘K'` or `'Ctrl+K'` — rendered via `KbdShortcut`. */
  shortcut?: string
  disabled?: boolean
}
