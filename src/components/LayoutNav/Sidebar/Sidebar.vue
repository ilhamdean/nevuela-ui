<script setup lang="ts">
import { ref, type HTMLAttributes } from 'vue'
import { HoverCardContent, HoverCardRoot, HoverCardTrigger } from 'reka-ui'
import { cn } from '@/lib/utils'
import SidebarNavItem from './SidebarNavItem.vue'
import type { SidebarItem, SidebarSection } from '.'

interface Props {
  sections: SidebarSection[]
  /** Matches `SidebarItem.value` to highlight the active item. */
  activeValue?: string
  /** Icon-only rail. */
  collapsed?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
})

const emit = defineEmits<{ select: [item: SidebarItem] }>()

const isActive = (item: SidebarItem) => item.value != null && item.value === props.activeValue
const hasActiveChild = (item: SidebarItem): boolean =>
  item.children?.some((c) => isActive(c) || hasActiveChild(c)) ?? false

// Seed expanded groups so the active item is visible on first render.
const expanded = ref(new Set<string>())
for (const section of props.sections) {
  for (const item of section.items) {
    if (item.children && hasActiveChild(item)) expanded.value.add(item.label)
  }
}
const toggle = (item: SidebarItem) => {
  if (expanded.value.has(item.label)) expanded.value.delete(item.label)
  else expanded.value.add(item.label)
}

const linkClass = (active: boolean) =>
  cn(
    'group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand/25',
    active ? 'bg-brand-subtle text-brand' : 'text-fg-subtle hover:bg-bg-subtle hover:text-fg',
    props.collapsed && 'justify-center px-0',
  )
</script>

<template>
  <nav aria-label="Sidebar" :class="cn('flex flex-col gap-6 p-3', props.class)">
    <div v-for="(section, si) in sections" :key="si" class="flex flex-col gap-1">
      <p
        v-if="section.label && !collapsed"
        class="px-3 pt-1 pb-1 text-2xs font-semibold tracking-wider text-fg-muted uppercase"
      >
        {{ section.label }}
      </p>

      <template v-for="(item, ii) in section.items" :key="ii">
        <!-- Collapsed rail + group: icon triggers a fly-out submenu on hover/focus.
             HoverCardContent is intentionally not portalled: reka-ui's Popper
             positions with `position: fixed` regardless, so it still escapes any
             clipping/scrolling ancestor, while staying in natural DOM order right
             after the trigger — keeping the submenu links reachable by Tab. -->
        <HoverCardRoot v-if="collapsed && item.children" :open-delay="150" :close-delay="150">
          <HoverCardTrigger as-child>
            <button
              type="button"
              :title="item.label"
              :aria-label="item.label"
              aria-haspopup="true"
              :class="linkClass(hasActiveChild(item))"
            >
              <component
                :is="item.icon"
                v-if="item.icon"
                class="size-4 shrink-0"
                aria-hidden="true"
              />
            </button>
          </HoverCardTrigger>

          <HoverCardContent
            side="right"
            align="start"
            :side-offset="8"
            class="z-50 w-56 rounded-md border border-border bg-surface p-2 shadow-md outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
          >
            <p class="px-3 pt-1 pb-2 text-2xs font-semibold tracking-wider text-fg-muted uppercase">
              {{ item.label }}
            </p>
            <ul class="flex flex-col gap-1" :aria-label="`${item.label} submenu`">
              <li v-for="(child, ci) in item.children" :key="ci">
                <SidebarNavItem
                  :item="child"
                  :expanded="expanded"
                  :toggle="toggle"
                  :is-active="isActive"
                  :has-active-child="hasActiveChild"
                  @select="emit('select', $event)"
                />
              </li>
            </ul>
          </HoverCardContent>
        </HoverCardRoot>

        <!-- Collapsed rail: leaf item (unchanged) -->
        <a
          v-else-if="collapsed"
          :href="item.href ?? '#'"
          :title="item.label"
          :aria-label="item.label"
          :aria-current="isActive(item) ? 'page' : undefined"
          :class="linkClass(isActive(item))"
          @click="emit('select', item)"
        >
          <component :is="item.icon" v-if="item.icon" class="size-4 shrink-0" aria-hidden="true" />
        </a>

        <!-- Expanded rail: leaf or group, recursing to any depth -->
        <SidebarNavItem
          v-else
          :item="item"
          :expanded="expanded"
          :toggle="toggle"
          :is-active="isActive"
          :has-active-child="hasActiveChild"
          @select="emit('select', $event)"
        />
      </template>
    </div>
  </nav>
</template>
