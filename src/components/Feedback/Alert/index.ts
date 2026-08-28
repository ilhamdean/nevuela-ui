import { cva, type VariantProps } from 'class-variance-authority'

export { default as Alert } from './Alert.vue'

export type AlertTone = 'info' | 'success' | 'warning' | 'error'

export const alertVariants = cva('relative flex gap-3 rounded-md border p-4 text-sm', {
  variants: {
    tone: {
      info: 'border-status-info/30 bg-status-info-subtle',
      success: 'border-status-active/30 bg-status-active-subtle',
      warning: 'border-status-warning/40 bg-status-warning-subtle',
      error: 'border-status-error-fg/30 bg-status-error-subtle',
    },
  },
  defaultVariants: { tone: 'info' },
})

export type AlertVariants = VariantProps<typeof alertVariants>
