import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { Button } from '../../Forms/Button'
import { CopyableField } from '../../DataDisplay/CopyableField'
import { Drawer } from '.'

/**
 * `Drawer` is an edge-anchored panel (built on Reka UI's Dialog) for details,
 * settings, or filters that shouldn't take over the whole screen. Slide it in
 * from the `right` (default) or `left`.
 */
const meta = {
  title: 'Feedback/Drawer',
  component: Drawer,
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    side: {
      control: 'inline-radio',
      options: ['right', 'left'],
      table: { defaultValue: { summary: 'right' } },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      table: { defaultValue: { summary: 'md' } },
    },
  },
  args: {
    title: 'Instance details',
    description: 'web-prod-01',
    side: 'right',
    size: 'md',
  },
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { Drawer, Button, CopyableField },
    setup() {
      const open = ref(false)
      return { args, open }
    },
    template: `
      <div>
        <Button variant="secondary" @click="open = true">Open details</Button>
        <Drawer v-bind="args" v-model:open="open">
          <div class="space-y-4">
            <CopyableField label="Public IPv4" value="203.0.113.10" />
            <CopyableField label="Private IPv4" value="10.116.0.4" />
            <p class="text-sm text-fg-subtle">Region NYC1 · 4 GB / 2 vCPUs / 120 GB</p>
          </div>
          <template #footer>
            <Button variant="ghost" @click="open = false">Close</Button>
            <Button variant="primary">Access console</Button>
          </template>
        </Drawer>
      </div>`,
  }),
}
