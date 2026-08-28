<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { streamingTextVariants, type StreamingTextVariants } from '.'

interface Props {
  /**
   * The full text to reveal. Growing it (the usual case — appending tokens as
   * they arrive) continues the reveal from where it was; replacing it with an
   * unrelated string restarts from the beginning.
   */
  text: string
  /**
   * Whether the model is still producing tokens. Only affects the caret —
   * revealing is driven by `text` itself, so a finished response still
   * animates in.
   */
  streaming?: boolean
  /** Reveal rate. Set to `0` to render `text` immediately with no animation. */
  charsPerSecond?: number
  /** Blinking caret at the end of the revealed text while `streaming`. */
  caret?: boolean
  size?: StreamingTextVariants['size']
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  streaming: false,
  charsPerSecond: 400,
  caret: true,
  size: 'md',
})

const emit = defineEmits<{
  /** The revealed text has caught up with `text`. */
  complete: []
}>()

/**
 * Reduced motion isn't a preference to animate around — a typewriter effect is
 * exactly the nonessential motion WCAG 2.3.3 asks us to drop — so the reveal is
 * skipped entirely and `text` renders at once.
 */
const motionQuery =
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : undefined
const reduceMotion = ref(motionQuery?.matches ?? false)
const onMotionChange = (e: MediaQueryListEvent) => (reduceMotion.value = e.matches)
motionQuery?.addEventListener('change', onMotionChange)

const revealed = ref(0)
const animated = computed(() => props.charsPerSecond > 0 && !reduceMotion.value)

let frame: number | undefined
let lastTick: number | undefined

function stop() {
  if (frame !== undefined) cancelAnimationFrame(frame)
  frame = undefined
  lastTick = undefined
}

function tick(now: number) {
  frame = undefined
  const target = props.text.length
  if (revealed.value >= target) return

  // Advance by elapsed time rather than a fixed step per frame, so the rate is
  // the same on a 60Hz and a 120Hz display.
  const elapsed = lastTick === undefined ? 0 : now - lastTick
  lastTick = now
  revealed.value = Math.min(target, revealed.value + (elapsed / 1000) * props.charsPerSecond)

  if (revealed.value >= target) emit('complete')
  else frame = requestAnimationFrame(tick)
}

function schedule() {
  if (!animated.value) {
    stop()
    const wasBehind = revealed.value < props.text.length
    revealed.value = props.text.length
    if (wasBehind) emit('complete')
    return
  }
  if (frame === undefined && revealed.value < props.text.length) frame = requestAnimationFrame(tick)
}

watch(
  () => props.text,
  (text, previous) => {
    // A replacement (rather than an append) means a different message occupies
    // this slot — rewind, instead of jumping mid-way into unrelated text.
    if (previous !== undefined && !text.startsWith(previous)) revealed.value = 0
    lastTick = undefined
    schedule()
  },
  { immediate: true },
)
watch(animated, schedule)

onBeforeUnmount(() => {
  stop()
  motionQuery?.removeEventListener('change', onMotionChange)
})

const visibleText = computed(() => props.text.slice(0, Math.floor(revealed.value)))
const showCaret = computed(
  () => props.caret && (props.streaming || visibleText.value.length < props.text.length),
)
</script>

<template>
  <span :class="cn(streamingTextVariants({ size }), props.class)">
    <!-- The full text goes to assistive tech immediately: reading a partially
         revealed buffer would announce truncated words, and the reveal is
         decoration, not content. -->
    <span class="sr-only">{{ text }}</span>
    <span aria-hidden="true">{{ visibleText }}</span>
    <span
      v-if="showCaret"
      aria-hidden="true"
      class="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] animate-pulse rounded-full bg-brand-fg motion-reduce:animate-none"
    />
  </span>
</template>
