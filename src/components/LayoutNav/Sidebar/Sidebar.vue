<script setup lang="ts">
import { ref, type HTMLAttributes } from 'vue'
import { ChevronRight } from '@lucide/vue'
import { cn } from '@/lib/utils'
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
        <!-- Expandable group -->
        <div v-if="item.children && !collapsed">
          <button
            type="button"
            :aria-expanded="expanded.has(item.label)"
            :class="linkClass(hasActiveChild(item))"
            @click="toggle(item)"
          >
            <component
              :is="item.icon"
              v-if="item.icon"
              class="size-4 shrink-0"
              aria-hidden="true"
            />
            <span class="flex-1 text-left">{{ item.label }}</span>
            <ChevronRight
              class="size-4 shrink-0 text-fg-muted transition-transform"
              :class="expanded.has(item.label) && 'rotate-90'"
              aria-hidden="true"
            />
          </button>

          <ul
            v-show="expanded.has(item.label)"
            class="mt-1 ml-4 flex flex-col gap-1 border-l border-border pl-2"
          >
            <li v-for="(child, ci) in item.children" :key="ci">
              <a
                :href="child.href ?? '#'"
                :class="linkClass(isActive(child))"
                :aria-current="isActive(child) ? 'page' : undefined"
                @click="emit('select', child)"
              >
                <span class="flex-1 text-left">{{ child.label }}</span>
                <span
                  v-if="child.badge != null"
                  class="rounded-full bg-bg-subtle px-1.5 text-2xs font-semibold text-fg-subtle"
                  >{{ child.badge }}</span
                >
              </a>
            </li>
          </ul>
        </div>

        <!-- Leaf item -->
        <a
          v-else
          :href="item.href ?? '#'"
          :title="collapsed ? item.label : undefined"
          :aria-label="collapsed ? item.label : undefined"
          :aria-current="isActive(item) ? 'page' : undefined"
          :class="linkClass(isActive(item))"
          @click="emit('select', item)"
        >
          <component :is="item.icon" v-if="item.icon" class="size-4 shrink-0" aria-hidden="true" />
          <template v-if="!collapsed">
            <span class="flex-1 text-left">{{ item.label }}</span>
            <span
              v-if="item.badge != null"
              class="rounded-full bg-bg-subtle px-1.5 text-2xs font-semibold text-fg-subtle"
              >{{ item.badge }}</span
            >
          </template>
        </a>
      </template>
    </div>
  </nav>
</template>
