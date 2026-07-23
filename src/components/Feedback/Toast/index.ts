import { cva, type VariantProps } from 'class-variance-authority'

export { default as Toast } from './Toast.vue'
export { default as Toaster } from './Toaster.vue'

export { useToast } from './useToast'
export type { ToastOptions, ToastItem } from './useToast'

export type ToastTone = 'info' | 'success' | 'warning' | 'error'

/** Which screen corner/edge the `Toaster` viewport docks to. */
export type ToastPosition =
  'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'

/**
 * The edge each position slides in from / swipes toward to dismiss —
 * shared by `Toast` (per-item animation) and `Toaster` (swipe direction).
 */
export const toastPositionSide: Record<ToastPosition, 'top' | 'bottom' | 'left' | 'right'> = {
  'top-left': 'left',
  'top-center': 'top',
  'top-right': 'right',
  'bottom-left': 'left',
  'bottom-center': 'bottom',
  'bottom-right': 'right',
}

export const toastViewportVariants = cva(
  'fixed z-[100] m-0 flex w-96 max-w-full list-none flex-col gap-2 p-4 outline-none',
  {
    variants: {
      position: {
        'top-left': 'top-0 left-0',
        'top-center': 'top-0 left-1/2 -translate-x-1/2',
        'top-right': 'top-0 right-0',
        'bottom-left': 'bottom-0 left-0',
        'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2',
        'bottom-right': 'right-0 bottom-0',
      },
    },
    defaultVariants: { position: 'bottom-right' },
  },
)
export type ToastViewportVariants = VariantProps<typeof toastViewportVariants>
