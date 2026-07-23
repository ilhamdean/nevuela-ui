<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Label as RekaLabel } from 'reka-ui'
import { cn } from '@/lib/utils'

interface Props {
  /** Associates the label with a control by id. */
  for?: string
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <RekaLabel :for="props.for" :class="cn('text-sm font-medium text-fg', props.class)">
    <slot />
  </RekaLabel>
</template>
