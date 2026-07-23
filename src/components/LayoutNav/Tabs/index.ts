import type { Component } from 'vue'

export { default as Tabs } from './Tabs.vue'

export interface TabItem {
  value: string
  label: string
  disabled?: boolean
  icon?: Component
}
