import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { AlertTriangle, PlusCircle, RotateCw, Settings2, XCircle } from '@lucide/vue'
import type { TimelineItem } from '.'
import { Timeline } from '.'

const basicItems: TimelineItem[] = [
  {
    id: '1',
    title: 'Instance created',
    description: 'Provisioned from the "ubuntu-22-04-x64" image.',
    timestamp: 'Jul 20, 2026 · 09:14 UTC',
    status: 'info',
  },
  {
    id: '2',
    title: 'Firewall rule added',
    description: 'Allowed inbound TCP/443 from 0.0.0.0/0.',
    timestamp: 'Jul 21, 2026 · 11:02 UTC',
    status: 'active',
  },
  {
    id: '3',
    title: 'Restarted',
    timestamp: 'Jul 23, 2026 · 03:47 UTC',
    status: 'warning',
  },
]

const actorItems: TimelineItem[] = [
  {
    id: '1',
    title: 'Config updated',
    description: 'Increased memory limit from 2GB to 4GB.',
    timestamp: 'Jul 22, 2026 · 14:30 UTC',
    status: 'info',
    actor: { name: 'Jane Cooper' },
  },
  {
    id: '2',
    title: 'Access granted',
    description: 'Added as a collaborator with read/write access.',
    timestamp: 'Jul 22, 2026 · 16:05 UTC',
    status: 'active',
    actor: { name: 'Marcus Webb', imageUrl: 'https://i.pravatar.cc/64?img=13' },
  },
  {
    id: '3',
    title: 'Snapshot deleted',
    timestamp: 'Jul 23, 2026 · 08:52 UTC',
    status: 'off',
    actor: { name: 'Priya Shah' },
  },
]

const auditLog: TimelineItem[] = [
  {
    id: '1',
    title: 'Instance created',
    description: 'Created "web-prod-03" (4 vCPU, 8GB) in region NYC1.',
    timestamp: 'Jul 18, 2026 · 09:00 UTC',
    status: 'info',
    icon: PlusCircle,
  },
  {
    id: '2',
    title: 'Config updated',
    description: 'Enabled automated backups (daily, 7-day retention).',
    timestamp: 'Jul 19, 2026 · 13:22 UTC',
    status: 'active',
    icon: Settings2,
    actor: { name: 'jane@nevuela.co' },
  },
  {
    id: '3',
    title: 'Restarted',
    description: 'Manual restart to apply kernel update.',
    timestamp: 'Jul 21, 2026 · 02:15 UTC',
    status: 'info',
    icon: RotateCw,
    actor: { name: 'jane@nevuela.co' },
  },
  {
    id: '4',
    title: 'High memory usage',
    description: 'Memory utilization crossed 90% for over 5 minutes.',
    timestamp: 'Jul 22, 2026 · 22:41 UTC',
    status: 'warning',
    icon: AlertTriangle,
  },
  {
    id: '5',
    title: 'Health check failed',
    description: 'Load balancer marked the instance unhealthy after 3 failed probes.',
    timestamp: 'Jul 23, 2026 · 05:03 UTC',
    status: 'error',
    icon: XCircle,
  },
]

/**
 * `Timeline` renders a vertical, chronologically-ordered event log — audit
 * trails and activity history on resource detail pages. Each event is a dot
 * or icon marker (colored via `StatusBadge`'s status tokens) connected by a
 * vertical line, with title/description/timestamp and an optional actor
 * (`Avatar` + name) to the right. Renders as a semantic `<ol>`/`<li>`.
 */
const meta = {
  title: 'Data Display/Timeline',
  component: Timeline,
  argTypes: {
    items: {
      control: 'object',
      description:
        'Events in chronological order. Each has `id`, `title`, `timestamp`, and optional `description`, `status` (`active`/`warning`/`error`/`off`/`info`, defaults to `info`), `icon`, and `actor` (`{ name, imageUrl? }`).',
    },
    loading: {
      control: 'boolean',
      description: 'Renders 3 skeleton rows instead of `items`.',
      table: { defaultValue: { summary: 'false' } },
    },
  },
  args: {
    items: basicItems,
    loading: false,
  },
} satisfies Meta<typeof Timeline>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { Timeline },
    setup: () => ({ args }),
    template: `<div class="w-[420px]"><Timeline v-bind="args" /></div>`,
  }),
}

export const Loading: Story = {
  args: { loading: true },
  render: (args) => ({
    components: { Timeline },
    setup: () => ({ args }),
    template: `<div class="w-[420px]"><Timeline v-bind="args" /></div>`,
  }),
}

/** Events attributed to an actor render a small `Avatar` + name near the timestamp. */
export const WithActors: Story = {
  args: { items: actorItems },
  render: (args) => ({
    components: { Timeline },
    setup: () => ({ args }),
    template: `<div class="w-[420px]"><Timeline v-bind="args" /></div>`,
  }),
}

/** A realistic instance audit log: created, config changed, restarted, a warning, and an error — spanning every status tone. */
export const InstanceAuditLog: Story = {
  args: { items: auditLog },
  render: (args) => ({
    components: { Timeline },
    setup: () => ({ args }),
    template: `
      <div class="w-[480px] rounded-xl border border-border bg-surface p-5">
        <h3 class="mb-4 text-sm font-semibold text-fg">Activity</h3>
        <Timeline v-bind="args" />
      </div>`,
  }),
}
