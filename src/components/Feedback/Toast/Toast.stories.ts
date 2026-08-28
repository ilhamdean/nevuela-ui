import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, ref } from 'vue'
import { ToastProvider, ToastViewport } from 'reka-ui'
import { Button } from '../../Forms/Button'
import { Toast, Toaster, toastPositionSide, toastViewportVariants, useToast } from '.'

/**
 * `Toast` is a transient notification item built on Reka UI's Toast (swipe
 * to dismiss, timed auto-close, accessible live region, pause-on-hover). In
 * a real app you don't place `Toast` directly — mount a single `<Toaster />`
 * near the app root and push notifications into its shared queue with
 * `useToast()`, so unrelated parts of the app ("save succeeded", "3 items
 * deleted") can stack toasts back to back without coordinating a provider
 * themselves. `Toast` + a manual `ToastProvider`/`ToastViewport` (below) is
 * the lower-level building block `Toaster` is made of.
 */
const meta = {
  title: 'Feedback/Toast',
  component: Toast,
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: ['info', 'success', 'warning', 'error'],
      description: 'Status tone — drives the icon and accent color.',
      table: { defaultValue: { summary: 'info' } },
    },
    title: { control: 'text', description: 'Toast heading.' },
    description: { control: 'text', description: 'Optional body text under the title.' },
    duration: {
      control: 'number',
      description: "Auto-dismiss delay in ms. Falls back to the hosting provider's default.",
      table: { defaultValue: { summary: '5000' } },
    },
    actionLabel: {
      control: 'text',
      description: 'Optional inline action button label (e.g. "View", "Undo").',
    },
    position: {
      control: 'select',
      options: [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ],
      description: 'Which edge the toast animates in from / swipes toward to dismiss.',
      table: { defaultValue: { summary: 'bottom-right' } },
    },
  },
  args: {
    tone: 'success',
    title: 'Order created',
    description: 'ORD-4825 is queued for fulfilment.',
    duration: 5000,
    actionLabel: 'View',
    position: 'bottom-right',
  },
} satisfies Meta<typeof Toast>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A single toast, manually controlled with `v-model:open` inside a
 * `ToastProvider`/`ToastViewport` — every Storybook control above is live.
 */
export const Playground: Story = {
  render: (args) => ({
    components: { Toast, Button, ToastProvider, ToastViewport },
    setup() {
      const open = ref(false)
      const show = () => {
        open.value = false
        requestAnimationFrame(() => (open.value = true))
      }
      const swipeDirection = computed(() => {
        const side = toastPositionSide[args.position ?? 'bottom-right']
        return side === 'top' ? 'up' : side === 'bottom' ? 'down' : side
      })
      const viewportClass = computed(() => toastViewportVariants({ position: args.position }))
      return { args, open, show, swipeDirection, viewportClass }
    },
    template: `
      <ToastProvider :swipe-direction="swipeDirection">
        <div>
          <Button variant="secondary" @click="show">Show toast</Button>
          <Toast v-bind="args" v-model:open="open" />
        </div>
        <ToastViewport :class="viewportClass" />
      </ToastProvider>`,
  }),
}

/**
 * The primary pattern: mount one `<Toaster />` near the app root, then call
 * `useToast()` from anywhere to push notifications onto its shared queue.
 * Firing several in a row demonstrates the stack — a common flow
 * like a bulk delete followed by its confirmation.
 */
export const QueueStacking: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    components: { Toaster, Button },
    setup() {
      const toast = useToast()

      const created = () =>
        toast.success('Order created', {
          description: 'ORD-4825 is queued for fulfilment.',
          actionLabel: 'View',
        })
      const deleted = () =>
        toast.success('3 drafts deleted', {
          description: 'Removed from the Drafts view.',
        })
      const failed = () =>
        toast.error('Import failed', {
          description: '12 rows could not be matched to a customer.',
          actionLabel: 'View logs',
        })
      const quota = () =>
        toast.warning('Approaching quota', {
          description: "You've used 82% of your monthly export allowance.",
        })
      const maintenance = () =>
        toast.info('Maintenance scheduled', {
          description: 'Scheduled downtime Saturday 02:00–04:00 UTC.',
        })
      const bulk = () => {
        deleted()
        created()
        maintenance()
      }

      return { created, deleted, failed, quota, maintenance, bulk }
    },
    template: `
      <div class="flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" @click="created">Success</Button>
        <Button variant="destructive" size="sm" @click="failed">Error</Button>
        <Button variant="secondary" size="sm" @click="quota">Warning</Button>
        <Button variant="secondary" size="sm" @click="maintenance">Info</Button>
        <Button variant="primary" size="sm" @click="bulk">Fire 3 at once</Button>
        <Toaster position="bottom-right" />
      </div>`,
  }),
}
