export { default as Stepper } from './Stepper.vue'

export interface StepItem {
  label: string
  description?: string
  /** Flags a step that failed validation, overriding the derived complete/current/upcoming state. */
  status?: 'error'
}
