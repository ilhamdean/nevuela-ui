import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Card } from '.'
import { Button } from '../../Forms/Button'
import { StatusBadge } from '../StatusBadge'

/**
 * `Card` is a generic content container: an optional `#header` (title, icon,
 * trailing actions — build the row yourself), the default slot for the body,
 * and an optional `#footer` for actions. Per-section padding is overridable
 * via `headerClass` / `contentClass` / `footerClass` (e.g. `contentClass="p-0"`
 * for edge-to-edge tables or lists).
 */
const meta = {
  title: 'Data Display/Card',
  component: Card,
  argTypes: {
    class: { control: 'text' },
    headerClass: { control: 'text', description: "Extra classes for the '#header' wrapper." },
    contentClass: { control: 'text', description: 'Extra classes for the body wrapper.' },
    footerClass: { control: 'text', description: "Extra classes for the '#footer' wrapper." },
  },
  render: (args) => ({
    components: { Card },
    setup: () => ({ args }),
    template: `
      <div class="w-[420px]">
        <Card v-bind="args">
          <template #header>
            <h3 class="text-base font-semibold text-fg">Instance details</h3>
          </template>
          <p class="text-sm text-fg-subtle">
            web-01 · nyc1 · 2 vCPU / 4 GB RAM
          </p>
        </Card>
      </div>`,
  }),
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** Header with a leading title, trailing status, and a footer with actions. */
export const WithFooter: Story = {
  render: (args) => ({
    components: { Card, Button, StatusBadge },
    setup: () => ({ args }),
    template: `
      <div class="w-[420px]">
        <Card v-bind="args">
          <template #header>
            <div class="flex w-full items-center justify-between">
              <h3 class="text-base font-semibold text-fg">Booking Summary</h3>
              <StatusBadge status="active" dot>Confirmed</StatusBadge>
            </div>
          </template>
          <dl class="space-y-2 text-sm">
            <div class="flex justify-between">
              <dt class="text-fg-subtle">Guest</dt>
              <dd class="text-fg">Jordan Lee</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-fg-subtle">Room</dt>
              <dd class="text-fg">Deluxe King · 204</dd>
            </div>
          </dl>
          <template #footer>
            <Button variant="ghost" size="sm">Cancel</Button>
            <Button variant="primary" size="sm">Check In</Button>
          </template>
        </Card>
      </div>`,
  }),
}

/** No header/footer slots passed — just a plain content panel. */
export const ContentOnly: Story = {
  render: () => ({
    components: { Card },
    template: `
      <div class="w-[420px]">
        <Card>
          <p class="text-sm text-fg">A card can be just a bordered content panel.</p>
        </Card>
      </div>`,
  }),
}

/** Edge-to-edge content (e.g. a list) via \`contentClass="p-0"\`. */
export const EdgeToEdgeContent: Story = {
  render: () => ({
    components: { Card },
    template: `
      <div class="w-[420px]">
        <Card content-class="p-0">
          <template #header>
            <h3 class="text-base font-semibold text-fg">Recent Activity</h3>
          </template>
          <ul class="divide-y divide-border">
            <li class="px-5 py-3 text-sm text-fg">Snapshot created</li>
            <li class="px-5 py-3 text-sm text-fg">Backup completed</li>
            <li class="px-5 py-3 text-sm text-fg">Instance resized</li>
          </ul>
        </Card>
      </div>`,
  }),
}
