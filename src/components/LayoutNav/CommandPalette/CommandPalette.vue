<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, type HTMLAttributes } from 'vue'
import {
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxRoot,
  ComboboxViewport,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui'
import { Search } from '@lucide/vue'
import { cn } from '@/lib/utils'
import { KbdShortcut } from '../../DataDisplay/KbdShortcut'
import type { CommandItem } from '.'

interface Props {
  /** Flat list of commands/pages — grouped for display via each item's `group`. */
  items: CommandItem[]
  placeholder?: string
  /** Shown when no item matches the current search text. */
  emptyText?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Type a command or search…',
  emptyText: 'No results found.',
})

const emit = defineEmits<{ select: [item: CommandItem] }>()

/** Open state (`v-model:open`) — also toggled internally by the Cmd/Ctrl+K shortcut. */
const open = defineModel<boolean>('open')

interface RenderGroup {
  label?: string
  items: CommandItem[]
}

/** `items` bucketed by `group`, preserving first-seen order; ungrouped items form one unlabeled bucket. */
const groups = computed<RenderGroup[]>(() => {
  const order: (string | undefined)[] = []
  const byGroup = new Map<string | undefined, CommandItem[]>()
  for (const item of props.items) {
    if (!byGroup.has(item.group)) {
      order.push(item.group)
      byGroup.set(item.group, [])
    }
    byGroup.get(item.group)!.push(item)
  }
  return order.map((label) => ({ label, items: byGroup.get(label)! }))
})

function handleSelect(item: CommandItem) {
  if (item.disabled) return
  emit('select', item)
  open.value = false
}

function handleKeydown(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    open.value = true
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown))

const itemClass =
  'relative flex cursor-pointer items-center gap-2.5 rounded-sm px-3 py-2.5 text-sm text-fg outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-brand-subtle data-[highlighted]:text-brand-fg'
const groupLabelClass = 'px-3 py-1.5 text-2xs font-semibold tracking-wide text-fg-muted uppercase'
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 z-50 bg-fg/40 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
      />
      <DialogContent
        :class="
          cn(
            'fixed top-[15%] left-1/2 z-50 flex max-h-[70vh] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-lg outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            props.class,
          )
        "
      >
        <!-- No visible title bar — this is just an accessible name for the dialog. -->
        <DialogTitle class="sr-only">Command palette</DialogTitle>

        <!--
          `ComboboxRoot` here is deliberately NOT wrapped in `ComboboxAnchor`/`ComboboxPortal`:
          it isn't anchored to a trigger button, it's already positioned by the Dialog it lives
          in. `:open="true"` + a static `model-value` keep the listbox permanently "open" (this
          is Reka UI's own documented "Command Menu" recipe for Combobox) — the escape/focus/
          interact/pointer-down "outside" events are `.prevent`-ed so Combobox's own dismissal
          layer doesn't intercept them; Escape and outside clicks still close the palette via the
          Dialog's own dismiss handling, one layer up.
        -->
        <ComboboxRoot :open="true" model-value="" class="flex min-h-0 flex-1 flex-col">
          <div class="flex items-center gap-3 border-b border-border px-4">
            <Search class="size-5 shrink-0 text-fg-muted" aria-hidden="true" />
            <ComboboxInput
              :placeholder="placeholder"
              class="h-14 flex-1 bg-transparent text-base text-fg outline-none placeholder:text-fg-muted"
            />
          </div>

          <ComboboxContent
            class="flex min-h-0 flex-1 flex-col"
            @escape-key-down.prevent
            @focus-outside.prevent
            @interact-outside.prevent
            @pointer-down-outside.prevent
          >
            <ComboboxViewport class="min-h-0 flex-1 overflow-y-auto p-2">
              <ComboboxEmpty class="px-3 py-10 text-center text-sm text-fg-muted">
                {{ emptyText }}
              </ComboboxEmpty>

              <template v-for="(group, gi) in groups" :key="group.label ?? gi">
                <ComboboxGroup v-if="group.label">
                  <ComboboxLabel :class="groupLabelClass">{{ group.label }}</ComboboxLabel>
                  <ComboboxItem
                    v-for="item in group.items"
                    :key="item.id"
                    :value="item.id"
                    :text-value="item.label"
                    :disabled="item.disabled"
                    :class="itemClass"
                    @select.prevent="handleSelect(item)"
                  >
                    <component
                      :is="item.icon"
                      v-if="item.icon"
                      class="size-4 shrink-0 text-fg-muted"
                      aria-hidden="true"
                    />
                    <span class="min-w-0 flex-1 truncate">{{ item.label }}</span>
                    <KbdShortcut v-if="item.shortcut" :keys="item.shortcut" class="shrink-0" />
                  </ComboboxItem>
                </ComboboxGroup>
                <template v-else>
                  <ComboboxItem
                    v-for="item in group.items"
                    :key="item.id"
                    :value="item.id"
                    :text-value="item.label"
                    :disabled="item.disabled"
                    :class="itemClass"
                    @select.prevent="handleSelect(item)"
                  >
                    <component
                      :is="item.icon"
                      v-if="item.icon"
                      class="size-4 shrink-0 text-fg-muted"
                      aria-hidden="true"
                    />
                    <span class="min-w-0 flex-1 truncate">{{ item.label }}</span>
                    <KbdShortcut v-if="item.shortcut" :keys="item.shortcut" class="shrink-0" />
                  </ComboboxItem>
                </template>
              </template>
            </ComboboxViewport>
          </ComboboxContent>
        </ComboboxRoot>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
