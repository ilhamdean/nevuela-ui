<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from 'reka-ui'
import { Button } from '../../Forms/Button'
import { TextInput } from '../../Forms/TextInput'

interface Props {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  /** `danger` renders a destructive confirm button. */
  tone?: 'danger' | 'default'
  /**
   * Type-to-confirm: the exact string the user must type (e.g. the resource
   * name) before the confirm button enables — a safeguard for irreversible
   * actions.
   */
  requireText?: string
  /** External busy state — disables confirm and shows a spinner. */
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  confirmLabel: 'Delete',
  cancelLabel: 'Cancel',
  tone: 'danger',
})

const emit = defineEmits<{ confirm: []; cancel: [] }>()

/** Open state (`v-model:open`). */
const open = defineModel<boolean>('open')

const typed = ref('')
// Reset the type-to-confirm field whenever the dialog opens or closes.
watch(open, () => (typed.value = ''))

const canConfirm = computed(
  () => !props.loading && (!props.requireText || typed.value === props.requireText),
)

function onConfirm() {
  if (!canConfirm.value) return
  emit('confirm')
}
</script>

<template>
  <AlertDialogRoot v-model:open="open">
    <AlertDialogTrigger v-if="$slots.trigger" as-child>
      <slot name="trigger" />
    </AlertDialogTrigger>

    <AlertDialogPortal>
      <AlertDialogOverlay
        class="fixed inset-0 z-50 bg-fg/40 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
      />
      <AlertDialogContent
        class="fixed top-1/2 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-lg border border-border bg-surface p-6 shadow-lg outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
      >
        <div class="space-y-1.5">
          <AlertDialogTitle class="text-lg font-semibold text-fg">{{ title }}</AlertDialogTitle>
          <AlertDialogDescription v-if="description" class="text-sm text-fg-subtle">
            {{ description }}
          </AlertDialogDescription>
        </div>

        <slot />

        <div v-if="requireText" class="space-y-1.5">
          <label class="text-sm text-fg-subtle">
            Type <span class="font-mono font-semibold text-fg">{{ requireText }}</span> to confirm
          </label>
          <TextInput v-model="typed" :placeholder="requireText" autocomplete="off" />
        </div>

        <div class="flex items-center justify-end gap-2">
          <AlertDialogCancel as-child>
            <Button variant="ghost" @click="emit('cancel')">{{ cancelLabel }}</Button>
          </AlertDialogCancel>
          <Button
            :variant="tone === 'danger' ? 'destructive' : 'primary'"
            :disabled="!canConfirm"
            :loading="loading"
            @click="onConfirm"
          >
            {{ confirmLabel }}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>
