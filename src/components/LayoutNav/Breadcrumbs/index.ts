import type { Component } from 'vue'

export { default as Breadcrumbs } from './Breadcrumbs.vue'

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: Component
}
