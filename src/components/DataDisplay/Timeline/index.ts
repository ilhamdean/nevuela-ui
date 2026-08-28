import type { Component } from 'vue'
import type { StatusKind } from '../StatusBadge'

export { default as Timeline } from './Timeline.vue'

/** A single event row in a `Timeline`. */
export interface TimelineItem {
  id: string
  /** Primary line, e.g. "Order created". */
  title: string
  /** Supporting detail, e.g. a diff summary or reason. */
  description?: string
  /** Pre-formatted display timestamp, e.g. "Jul 24, 2026 · 09:14 UTC". */
  timestamp: string
  /** Semantic tone for the dot/icon (reuses `StatusBadge`'s status tokens). */
  status?: StatusKind
  /** Icon shown in the marker instead of a plain dot. */
  icon?: Component
  /** Who performed the action — rendered as a small `Avatar` + name. */
  actor?: {
    name: string
    imageUrl?: string
  }
}
