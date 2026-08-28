export { default as FormField } from './FormField.vue'

/** Props passed to the control via the default slot's `bind` object. */
export interface FormFieldControlBinding {
  id: string
  'aria-describedby': string | undefined
  invalid: boolean
}
