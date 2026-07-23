export { default as MetricCard } from './MetricCard.vue'

export interface MetricDelta {
  /** Magnitude of the change, e.g. `12.4` → "12.4%". */
  value: number
  direction: 'up' | 'down'
  /** Semantic tone. Defaults: `up` → positive, `down` → negative. */
  tone?: 'positive' | 'negative' | 'neutral'
}
