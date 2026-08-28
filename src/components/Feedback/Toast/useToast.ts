import { reactive, watch } from 'vue'
import type { ToastTone } from '.'

/** Milliseconds to keep a closed toast mounted for its exit animation before removing it. */
const EXIT_ANIMATION_MS = 200

export interface ToastOptions {
  /** Body text shown under the title. */
  description?: string
  /** Auto-dismiss delay in ms. Falls back to the hosting `Toaster`'s `duration` prop (5000ms) when unset. */
  duration?: number
  /** Optional action button label (e.g. "View", "Undo"). */
  actionLabel?: string
  /** Called when the action button is clicked. */
  onAction?: () => void
}

/** A single queued toast's full reactive state, as rendered by `Toaster`. */
export interface ToastItem extends ToastOptions {
  id: string
  tone: ToastTone
  title: string
  open: boolean
}

let uid = 0
const nextId = () => `toast-${Date.now()}-${uid++}`

/**
 * Shared module-level queue — every `useToast()` call anywhere in the app
 * reads and writes this same stack, so a `Toaster` mounted once near the app
 * root renders whatever any component pushes into it.
 */
const toasts = reactive<ToastItem[]>([])

function removeToast(id: string) {
  const index = toasts.findIndex((item) => item.id === id)
  if (index !== -1) toasts.splice(index, 1)
}

/** Marks a toast closed; it's spliced out of the queue once its exit animation finishes. */
function dismiss(id: string) {
  const item = toasts.find((toast) => toast.id === id)
  if (item) item.open = false
}

function dismissAll() {
  toasts.forEach((item) => (item.open = false))
}

function show(tone: ToastTone, title: string, options: ToastOptions = {}): string {
  const id = nextId()
  const item = reactive<ToastItem>({ id, tone, title, open: true, ...options })
  toasts.push(item)

  // Whenever this toast closes — via its own auto-dismiss timer, a swipe,
  // the close button, or a programmatic `dismiss(id)` call — give the exit
  // animation time to play before removing it from the queue.
  const stopWatch = watch(
    () => item.open,
    (open) => {
      if (open) return
      stopWatch()
      window.setTimeout(() => removeToast(id), EXIT_ANIMATION_MS)
    },
  )

  return id
}

/**
 * Imperative toast queue for app notifications ("save succeeded",
 * "3 items deleted", …). Mount a `<Toaster />` once near the app root, then
 * call this from anywhere:
 *
 * ```ts
 * const toast = useToast()
 * toast.success('Order created', { description: 'ORD-4825 is queued for fulfilment.' })
 * toast.error('Deployment failed', { description: 'Health checks timed out.', actionLabel: 'View logs' })
 * ```
 */
export function useToast() {
  return {
    /** The live, reactive queue — read by `Toaster`. */
    toasts,
    /** Push a toast of an arbitrary tone. Prefer `success`/`error`/`info`/`warning`. */
    show,
    success: (title: string, options?: ToastOptions) => show('success', title, options),
    error: (title: string, options?: ToastOptions) => show('error', title, options),
    info: (title: string, options?: ToastOptions) => show('info', title, options),
    warning: (title: string, options?: ToastOptions) => show('warning', title, options),
    /** Close a toast by id (animates out, then removes from the queue). */
    dismiss,
    /** Close every currently visible toast. */
    dismissAll,
  }
}
