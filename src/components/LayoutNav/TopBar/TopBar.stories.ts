import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Bell, CircleHelp, Plus } from '@lucide/vue'
import { Button } from '../../Forms/Button'
import { SearchInput } from '../../Forms/SearchInput'
import { Avatar } from '../../DataDisplay/Avatar'
import { TopBar } from '.'

/**
 * `TopBar` is the application header: a slot-driven bar with regions for a
 * leading area (logo / menu toggle / breadcrumbs), global search, quick actions
 * (notifications, help), a primary "Create" action, and the account menu.
 */
const meta = {
  title: 'Layout & Nav/TopBar',
  component: TopBar,
  argTypes: {
    sticky: { control: 'boolean', description: 'Pin to the top of the scroll container.' },
  },
  args: {
    sticky: false,
  },
  render: (args) => ({
    components: { TopBar, Button, SearchInput, Avatar, Bell, CircleHelp, Plus },
    setup: () => ({ args }),
    template: `
      <div class="w-[960px] overflow-hidden rounded-xl border border-border">
        <TopBar v-bind="args">
          <template #leading>
            <span class="text-sm font-bold text-fg">Nevuela</span>
          </template>
          <template #search>
            <SearchInput size="sm" class="max-w-md" />
          </template>
          <template #actions>
            <Button variant="ghost" size="md" icon-only aria-label="Help"><CircleHelp /></Button>
            <Button variant="ghost" size="md" icon-only aria-label="Notifications"><Bell /></Button>
          </template>
          <template #create>
            <Button variant="primary" size="md"><template #leading><Plus /></template>Create</Button>
          </template>
          <template #account>
            <Avatar name="Morgan Tran" size="sm" />
          </template>
        </TopBar>
      </div>`,
  }),
} satisfies Meta<typeof TopBar>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
