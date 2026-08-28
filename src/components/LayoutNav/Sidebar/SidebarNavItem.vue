<script setup lang="ts">
// Recursive nav-item renderer used by `Sidebar` for the expanded (non-collapsed)
// rail and reused inside the collapsed rail's fly-out submenu. An SFC can refer
// to itself by filename in its own template, which is how the recursion works —
// no explicit self-import needed.
import { ChevronRight } from '@lucide/vue'
import { cn } from '@/lib/utils'
import type { SidebarItem } from '.'

interface Props {
  item: SidebarItem
  /** Labels of currently expanded groups, shared across the whole tree. */
  expanded: Set<string>
  toggle: (item: SidebarItem) => void
  isActive: (item: SidebarItem) => boolean
  hasActiveChild: (item: SidebarItem) => boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{ select: [item: SidebarItem] }>()

const linkClass = (active: boolean) =>
  cn(
    'group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand/25',
    active ? 'bg-brand-subtle text-brand-fg' : 'text-fg-subtle hover:bg-bg-subtle hover:text-fg',
  )
</script>

<template>
  <!-- Expandable group: recurse into children, indentation compounds via the
       nested border/margin wrapper at each depth. -->
  <div v-if="item.children">
    <button
      type="button"
      :aria-expanded="expanded.has(item.label)"
      :class="linkClass(hasActiveChild(item))"
      @click="toggle(item)"
    >
      <component :is="item.icon" v-if="item.icon" class="size-4 shrink-0" aria-hidden="true" />
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
        <SidebarNavItem
          :item="child"
          :expanded="props.expanded"
          :toggle="props.toggle"
          :is-active="props.isActive"
          :has-active-child="props.hasActiveChild"
          @select="emit('select', $event)"
        />
      </li>
    </ul>
  </div>

  <!-- Leaf item -->
  <a
    v-else
    :href="item.href ?? '#'"
    :aria-current="isActive(item) ? 'page' : undefined"
    :class="linkClass(isActive(item))"
    @click="emit('select', item)"
  >
    <component :is="item.icon" v-if="item.icon" class="size-4 shrink-0" aria-hidden="true" />
    <span class="flex-1 text-left">{{ item.label }}</span>
    <span
      v-if="item.badge != null"
      class="rounded-full bg-bg-subtle px-1.5 text-2xs font-semibold text-fg-subtle"
      >{{ item.badge }}</span
    >
  </a>
</template>
