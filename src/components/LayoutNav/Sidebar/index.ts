import type { Component } from 'vue'

export { default as Sidebar } from './Sidebar.vue'

export interface SidebarItem {
  label: string
  icon?: Component
  href?: string
  /** Identity used to match `activeValue`. */
  value?: string
  /** Small trailing count/label. */
  badge?: string | number
  /** One level of nested items (expandable group). */
  children?: SidebarItem[]
}

export interface SidebarSection {
  /** Uppercase section heading (hidden when collapsed). */
  label?: string
  items: SidebarItem[]
}
