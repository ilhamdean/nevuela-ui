<script setup lang="ts">
import { Check, ChevronRight, Circle } from '@lucide/vue'
import {
  DropdownMenuCheckboxItem as RekaDropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem as RekaDropdownMenuItem,
  DropdownMenuItemIndicator,
  DropdownMenuLabel as RekaDropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuRoot,
  DropdownMenuSeparator as RekaDropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from 'reka-ui'
import { defineComponent, h, type PropType, type VNode } from 'vue'
import { cn } from '@/lib/utils'
import type { DropdownCheckboxEntry, DropdownEntry, DropdownMenuItem, DropdownRadioEntry } from '.'

interface Props {
  items: DropdownEntry[]
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
}

withDefaults(defineProps<Props>(), {
  align: 'end',
  side: 'bottom',
  sideOffset: 6,
})

const emit = defineEmits<{ select: [item: DropdownMenuItem] }>()

const contentClass =
  'z-50 min-w-48 rounded-md border border-border bg-surface p-1 text-fg shadow-md data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95'

const labelClass = 'px-2 py-1.5 text-2xs font-semibold tracking-wide text-fg-muted uppercase'

function isSeparator(e: DropdownEntry): e is { type: 'separator' } {
  return e.type === 'separator'
}
function isLabel(e: DropdownEntry): e is { type: 'label'; label: string } {
  return e.type === 'label'
}
function isCheckbox(e: DropdownEntry): e is DropdownCheckboxEntry {
  return e.type === 'checkbox'
}
function isRadio(e: DropdownEntry): e is DropdownRadioEntry {
  return e.type === 'radio'
}
function hasChildren(e: DropdownEntry): e is DropdownMenuItem & { children: DropdownEntry[] } {
  return (
    (e.type === undefined || e.type === 'item') &&
    Array.isArray((e as DropdownMenuItem).children) &&
    (e as DropdownMenuItem).children!.length > 0
  )
}

function itemClass(danger?: boolean) {
  return cn(
    'flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
    danger
      ? 'text-status-error data-[highlighted]:bg-status-error-subtle'
      : 'data-[highlighted]:bg-bg-subtle data-[highlighted]:text-fg',
  )
}

/** Fixed-width slot that keeps checkbox/radio labels aligned whether or not the indicator is showing. */
function indicatorSlot(icon: VNode) {
  return h('span', { class: 'flex size-4 shrink-0 items-center justify-center' }, [
    h(DropdownMenuItemIndicator, null, () => icon),
  ])
}

/**
 * Recursively renders one level of `entries` — used for the root menu
 * content and for every nested `DropdownMenuSubContent`, so submenus can
 * nest to any depth. Kept as a local render-function component (rather than
 * a template) because Vue SFC template recursion can't target a fragment
 * that excludes its own component's Root/Trigger.
 */
const DropdownEntries = defineComponent({
  name: 'DropdownEntries',
  props: {
    entries: { type: Array as PropType<DropdownEntry[]>, required: true },
  },
  emits: ['select'],
  setup(props, { emit: emitSelect }) {
    function renderEntry(entry: DropdownEntry, key: number): VNode {
      if (isSeparator(entry)) {
        return h(RekaDropdownMenuSeparator, { key, class: 'my-1 h-px bg-border' })
      }

      if (isLabel(entry)) {
        return h(RekaDropdownMenuLabel, { key, class: labelClass }, () => entry.label)
      }

      if (isCheckbox(entry)) {
        return h(
          RekaDropdownMenuCheckboxItem,
          {
            key,
            disabled: entry.disabled,
            modelValue: entry.checked,
            'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
              entry.onCheckedChange?.(value === true),
            onSelect: (e: Event) => e.preventDefault(),
            class: itemClass(),
          },
          () => [
            indicatorSlot(h(Check, { class: 'size-3.5' })),
            h('span', { class: 'flex-1' }, entry.label),
          ],
        )
      }

      if (isRadio(entry)) {
        return h(
          DropdownMenuRadioGroup,
          {
            key,
            modelValue: entry.value,
            'onUpdate:modelValue': (value: unknown) => entry.onValueChange?.(value as string),
          },
          () => [
            entry.label ? h(RekaDropdownMenuLabel, { class: labelClass }, () => entry.label) : null,
            ...entry.options.map((option) =>
              h(
                DropdownMenuRadioItem,
                {
                  key: option.value,
                  value: option.value,
                  disabled: option.disabled,
                  class: itemClass(),
                },
                () => [
                  indicatorSlot(h(Circle, { class: 'size-2 fill-current' })),
                  h('span', { class: 'flex-1' }, option.label),
                ],
              ),
            ),
          ],
        )
      }

      if (hasChildren(entry)) {
        return h(DropdownMenuSub, { key }, () => [
          h(
            DropdownMenuSubTrigger,
            { disabled: entry.disabled, class: itemClass(entry.danger) },
            () => [
              entry.icon
                ? h(entry.icon, { class: 'size-4 shrink-0', 'aria-hidden': 'true' })
                : null,
              h('span', { class: 'flex-1' }, entry.label),
              h(ChevronRight, { class: 'size-4 shrink-0 text-fg-muted', 'aria-hidden': 'true' }),
            ],
          ),
          h(DropdownMenuPortal, null, () =>
            h(DropdownMenuSubContent, { class: contentClass }, () =>
              h(DropdownEntries, {
                entries: entry.children,
                onSelect: (item: DropdownMenuItem) => emitSelect('select', item),
              }),
            ),
          ),
        ])
      }

      const item = entry as DropdownMenuItem
      return h(
        RekaDropdownMenuItem,
        {
          key,
          disabled: item.disabled,
          class: itemClass(item.danger),
          onSelect: () => emitSelect('select', item),
        },
        () => [
          item.icon ? h(item.icon, { class: 'size-4 shrink-0', 'aria-hidden': 'true' }) : null,
          h('span', { class: 'flex-1' }, item.label),
          item.shortcut ? h('span', { class: 'text-xs text-fg-muted' }, item.shortcut) : null,
        ],
      )
    }

    return () => props.entries.map((entry, i) => renderEntry(entry, i))
  },
})
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger as-child>
      <slot name="trigger" />
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        :align="align"
        :side="side"
        :side-offset="sideOffset"
        :class="contentClass"
      >
        <DropdownEntries :entries="items" @select="(item) => emit('select', item)" />
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
