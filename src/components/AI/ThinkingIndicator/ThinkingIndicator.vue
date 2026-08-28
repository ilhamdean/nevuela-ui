<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { thinkingIndicatorVariants, type ThinkingIndicatorVariants } from '.'

interface Props {
  /** What the agent is doing. Kept as real text, never dots alone — the dots are decorative. */
  label?: string
  /** Count up from mount, so a long turn doesn't look hung. */
  showElapsed?: boolean
  size?: ThinkingIndicatorVariants['size']
  variant?: ThinkingIndicatorVariants['variant']
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Thinking',
  showElapsed: false,
  size: 'md',
  variant: 'bare',
})

const elapsed = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

watch(
  () => props.showElapsed,
  (show) => {
    clearInterval(timer)
    timer = undefined
    elapsed.value = 0
    if (show) timer = setInterval(() => (elapsed.value += 1), 1000)
  },
  { immediate: true },
)
onBeforeUnmount(() => clearInterval(timer))

const elapsedLabel = computed(() => {
  const minutes = Math.floor(elapsed.value / 60)
  const seconds = elapsed.value % 60
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`
})

// Staggered so the three dots read as a wave rather than one blinking block.
const dotDelays = ['0ms', '160ms', '320ms']
</script>

<template>
  <span role="status" :class="cn(thinkingIndicatorVariants({ size, variant }), props.class)">
    <span aria-hidden="true" class="inline-flex items-center gap-1">
      <span
        v-for="delay in dotDelays"
        :key="delay"
        class="size-1.5 animate-bounce rounded-full bg-fg-muted motion-reduce:animate-pulse"
        :style="{ animationDelay: delay }"
      />
    </span>

    <span>{{ label }}</span>
    <span v-if="showElapsed" class="tabular-nums text-fg-subtle">{{ elapsedLabel }}</span>
  </span>
</template>
