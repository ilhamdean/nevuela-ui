import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { Button } from '../../Forms/Button'
import { FormField } from '../../Forms/FormField'
import { TextInput } from '../../Forms/TextInput'
import { Modal } from '.'

/**
 * `Modal` is a focus-trapped dialog built on Reka UI (labelled title/description,
 * Escape + overlay dismiss, scroll-locked). Control it with `v-model:open`, or
 * provide a `#trigger`. Body is the default slot; actions go in `#footer`.
 */
const meta = {
  title: 'Feedback/Modal',
  component: Modal,
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg', 'xl'],
      table: { defaultValue: { summary: 'md' } },
    },
  },
  args: {
    title: 'Rename workspace',
    description: 'Give this workspace a new name. Its URL stays the same.',
    size: 'md',
  },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { Modal, Button, FormField, TextInput },
    setup() {
      const open = ref(false)
      const name = ref('Halden & Co.')
      return { args, open, name }
    },
    template: `
      <div>
        <Button variant="secondary" @click="open = true">Rename…</Button>
        <Modal v-bind="args" v-model:open="open">
          <FormField label="Workspace name" v-slot="{ bind }">
            <TextInput v-bind="bind" v-model="name" />
          </FormField>
          <template #footer>
            <Button variant="ghost" @click="open = false">Cancel</Button>
            <Button variant="primary" @click="open = false">Save</Button>
          </template>
        </Modal>
      </div>`,
  }),
}
