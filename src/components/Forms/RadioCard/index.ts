export { default as RadioCard } from './RadioCard.vue'

export interface RadioCardOption {
  value: string
  title: string
  description?: string
  /** Small uppercase pill, e.g. "RECOMMENDED". */
  badge?: string
  disabled?: boolean
}
