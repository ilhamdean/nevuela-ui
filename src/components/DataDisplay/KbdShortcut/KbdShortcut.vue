<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { kbdShortcutKeyVariants, type KbdShortcutVariants } from '.'

interface Props {
  /**
   * The keys to render. Pass an array to render each element as its own key
   * cap verbatim (e.g. `['⌘', 'K']`), or a single string — if it contains
   * `+` it's split into separate caps (e.g. `'Ctrl+Shift+P'`), otherwise it
   * renders as one cap (e.g. `'Esc'`).
   */
  keys: string | string[]
  size?: KbdShortcutVariants['size']
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  size: 'sm',
})

/** Symbols that read poorly character-by-character to a screen reader. */
const SYMBOL_NAMES: Record<string, string> = {
  '⌘': 'Command',
  '⌃': 'Control',
  '⌥': 'Option',
  '⇧': 'Shift',
  '⏎': 'Enter',
  '↵': 'Enter',
  '⌫': 'Backspace',
  '⌦': 'Delete',
  '⎋': 'Escape',
  '⇥': 'Tab',
  '␣': 'Space',
  '↑': 'Up',
  '↓': 'Down',
  '←': 'Left',
  '→': 'Right',
}

const keyList = computed(() => {
  if (Array.isArray(props.keys)) return props.keys
  return props.keys.includes('+') ? props.keys.split('+') : [props.keys]
})

/** Human-readable name for one key cap, used to build the group's aria-label. */
function readableKey(key: string) {
  return SYMBOL_NAMES[key] ?? key
}

const ariaLabel = computed(() => keyList.value.map(readableKey).join(' + '))
</script>

<template>
  <span
    role="text"
    :aria-label="ariaLabel"
    :class="cn('inline-flex items-center gap-1', props.class)"
  >
    <kbd
      v-for="(key, index) in keyList"
      :key="index"
      :class="kbdShortcutKeyVariants({ size })"
      aria-hidden="true"
      >{{ key }}</kbd
    >
  </span>
</template>
