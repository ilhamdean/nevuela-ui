import type { Meta, StoryObj } from '@storybook/vue3-vite'

/**
 * The Nevuela token system — the Aurora/Nebula palette, type scale, radii, and
 * elevation, expressed as semantic CSS variables + Tailwind utilities. These
 * are the only values components are allowed to reference — see `src/style.css`.
 */
const meta: Meta = {
  title: 'Foundations/Design Tokens',
  parameters: { layout: 'fullscreen', options: { showPanel: false } },
}

export default meta
type Story = StoryObj

const brand = [
  { n: 'brand', c: 'bg-brand' },
  { n: 'brand-hover', c: 'bg-brand-hover' },
  { n: 'brand-active', c: 'bg-brand-active' },
  { n: 'brand-subtle', c: 'bg-brand-subtle' },
  { n: 'link', c: 'bg-link' },
]
const neutral = [
  { n: 'surface', c: 'bg-surface' },
  { n: 'bg', c: 'bg-bg' },
  { n: 'bg-subtle', c: 'bg-bg-subtle' },
  { n: 'border', c: 'bg-border' },
  { n: 'border-strong', c: 'bg-border-strong' },
  { n: 'fg-muted', c: 'bg-fg-muted' },
  { n: 'fg-subtle', c: 'bg-fg-subtle' },
  { n: 'fg', c: 'bg-fg' },
]
const status = [
  { n: 'status-active', c: 'bg-status-active' },
  { n: 'status-active-subtle', c: 'bg-status-active-subtle' },
  { n: 'status-warning', c: 'bg-status-warning' },
  { n: 'status-warning-subtle', c: 'bg-status-warning-subtle' },
  { n: 'status-error', c: 'bg-status-error' },
  { n: 'status-error-subtle', c: 'bg-status-error-subtle' },
  { n: 'status-off', c: 'bg-status-off' },
  { n: 'status-info', c: 'bg-status-info' },
]
const chart = [1, 2, 3, 4, 5, 6].map((i) => ({ n: `chart-${i}`, c: `bg-chart-${i}` }))

const typeScale = [
  { n: 'text-3xl', c: 'text-3xl' },
  { n: 'text-2xl', c: 'text-2xl' },
  { n: 'text-xl', c: 'text-xl' },
  { n: 'text-lg', c: 'text-lg' },
  { n: 'text-base', c: 'text-base' },
  { n: 'text-sm', c: 'text-sm' },
  { n: 'text-xs', c: 'text-xs' },
  { n: 'text-2xs', c: 'text-2xs' },
]
const spacing = [
  { n: '1 · 4px', px: 4 },
  { n: '2 · 8px', px: 8 },
  { n: '3 · 12px', px: 12 },
  { n: '4 · 16px', px: 16 },
  { n: '6 · 24px', px: 24 },
  { n: '8 · 32px', px: 32 },
  { n: '12 · 48px', px: 48 },
  { n: '16 · 64px', px: 64 },
]
const radius = [
  { n: 'sm · 3px', c: 'rounded-sm' },
  { n: 'md · 4px', c: 'rounded-md' },
  { n: 'lg · 6px', c: 'rounded-lg' },
  { n: 'xl · 8px', c: 'rounded-xl' },
  { n: '2xl · 12px', c: 'rounded-2xl' },
  { n: 'full', c: 'rounded-full' },
]
const shadows = [
  { n: 'shadow-sm', c: 'shadow-sm' },
  { n: 'shadow-md', c: 'shadow-md' },
  { n: 'shadow-lg', c: 'shadow-lg' },
]

/** Color palette — brand, neutrals, status, and chart series. */
export const Colors: Story = {
  render: () => ({
    setup: () => ({ brand, neutral, status, chart }),
    template: `
      <div class="min-h-dvh bg-bg p-8 text-fg">
        <h1 class="mb-6 text-2xl font-bold">Color</h1>
        <div class="space-y-8">
          <section v-for="group in [
            { title: 'Brand', items: brand },
            { title: 'Neutral', items: neutral },
            { title: 'Status', items: status },
            { title: 'Chart series', items: chart },
          ]" :key="group.title">
            <h2 class="mb-3 text-sm font-semibold text-fg-subtle">{{ group.title }}</h2>
            <div class="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
              <div v-for="s in group.items" :key="s.n" class="space-y-1.5">
                <div :class="['h-16 w-full rounded-md border border-border', s.c]"></div>
                <p class="font-mono text-xs text-fg">{{ s.n }}</p>
              </div>
            </div>
          </section>
        </div>
      </div>`,
  }),
}

/** Type scale — Inter, on a 1.5 line-height rhythm. */
export const Typography: Story = {
  render: () => ({
    setup: () => ({ typeScale }),
    template: `
      <div class="min-h-dvh bg-bg p-8 text-fg">
        <h1 class="mb-6 text-2xl font-bold">Typography</h1>
        <div class="space-y-5">
          <div v-for="t in typeScale" :key="t.n" class="flex items-baseline gap-6 border-b border-border pb-4">
            <span class="w-28 shrink-0 font-mono text-xs text-fg-muted">{{ t.n }}</span>
            <span :class="[t.c, 'font-semibold']">Deploy to the cloud</span>
          </div>
        </div>
        <div class="mt-8 flex gap-6">
          <span class="font-normal">Regular 400</span>
          <span class="font-medium">Medium 500</span>
          <span class="font-semibold">Semibold 600</span>
          <span class="font-bold">Bold 700</span>
        </div>
      </div>`,
  }),
}

/** Spacing (4px base), radius, and elevation scales. */
export const SpacingRadiusElevation: Story = {
  name: 'Spacing · Radius · Elevation',
  render: () => ({
    setup: () => ({ spacing, radius, shadows }),
    template: `
      <div class="min-h-dvh space-y-10 bg-bg p-8 text-fg">
        <section>
          <h1 class="mb-6 text-2xl font-bold">Spacing</h1>
          <div class="space-y-2">
            <div v-for="s in spacing" :key="s.n" class="flex items-center gap-4">
              <span class="w-24 shrink-0 font-mono text-xs text-fg-muted">{{ s.n }}</span>
              <div class="h-4 rounded-sm bg-brand" :style="{ width: s.px + 'px' }"></div>
            </div>
          </div>
        </section>

        <section>
          <h2 class="mb-4 text-lg font-semibold">Radius</h2>
          <div class="flex flex-wrap gap-6">
            <div v-for="r in radius" :key="r.n" class="space-y-1.5">
              <div :class="['size-20 border-2 border-brand bg-brand-subtle', r.c]"></div>
              <p class="font-mono text-xs text-fg-muted">{{ r.n }}</p>
            </div>
          </div>
        </section>

        <section>
          <h2 class="mb-4 text-lg font-semibold">Elevation</h2>
          <div class="flex flex-wrap gap-8">
            <div v-for="sh in shadows" :key="sh.n" class="space-y-2">
              <div :class="['size-24 rounded-lg border border-border bg-surface', sh.c]"></div>
              <p class="font-mono text-xs text-fg-muted">{{ sh.n }}</p>
            </div>
          </div>
        </section>
      </div>`,
  }),
}
