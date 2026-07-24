<script setup lang="ts">
import { ref, useId, type HTMLAttributes } from 'vue'
import { File, UploadCloud, X } from '@lucide/vue'
import { cn } from '@/lib/utils'
import { ProgressBar } from '../../DataDisplay/ProgressBar'
import { Button } from '../Button'
import type { UploadFile } from '.'

interface Props {
  /** Native `accept` attribute, e.g. `.pem,.crt` or `image/*`. Also used for client-side validation. */
  accept?: string
  /** Allow selecting/dropping more than one file at a time. */
  multiple?: boolean
  /** Reject files larger than this (bytes). */
  maxSizeBytes?: number
  /** Cap the total number of files the model can hold. */
  maxFiles?: number
  disabled?: boolean
  /** Marks the dropzone invalid: status-error border + `aria-invalid` on the input. */
  invalid?: boolean
  /** Helper text under the dropzone, e.g. "PEM or CRT, up to 5MB". */
  hint?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  disabled: false,
  invalid: false,
})

const emit = defineEmits<{
  /** A file failed client-side validation (type/size/count) and was not added to the model. */
  reject: [payload: { file: File; reason: string }]
}>()

const model = defineModel<UploadFile[]>({ default: () => [] })

const inputId = useId()
const hintId = useId()

const isDragOver = ref(false)

/** Format a byte count as a human-readable size (no dependency). */
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB', 'TB']
  let value = bytes / 1024
  let unitIndex = 0
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex++
  }
  return `${value.toFixed(value < 10 ? 1 : 0)} ${units[unitIndex]}`
}

/** Check a file against a native-style `accept` string (extensions, mime types, or `type/*`). */
function matchesAccept(file: File, accept: string): boolean {
  const patterns = accept
    .split(',')
    .map((pattern) => pattern.trim())
    .filter(Boolean)
  if (patterns.length === 0) return true

  return patterns.some((pattern) => {
    if (pattern.startsWith('.')) {
      return file.name.toLowerCase().endsWith(pattern.toLowerCase())
    }
    if (pattern.endsWith('/*')) {
      return file.type.startsWith(pattern.slice(0, -1))
    }
    return file.type === pattern
  })
}

function processFiles(fileList: FileList | null) {
  if (!fileList || props.disabled) return

  const incoming = props.multiple ? Array.from(fileList) : Array.from(fileList).slice(0, 1)

  for (const file of incoming) {
    if (props.accept && !matchesAccept(file, props.accept)) {
      emit('reject', { file, reason: `"${file.name}" is not an accepted file type.` })
      continue
    }

    if (props.maxSizeBytes !== undefined && file.size > props.maxSizeBytes) {
      emit('reject', {
        file,
        reason: `"${file.name}" exceeds the ${formatSize(props.maxSizeBytes)} size limit.`,
      })
      continue
    }

    if (props.multiple && props.maxFiles !== undefined && model.value.length >= props.maxFiles) {
      emit('reject', {
        file,
        reason: `Only up to ${props.maxFiles} file${props.maxFiles === 1 ? '' : 's'} allowed.`,
      })
      continue
    }

    const entry: UploadFile = {
      id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
      file,
    }

    model.value = props.multiple ? [...model.value, entry] : [entry]
  }
}

function onInputChange(event: Event) {
  const target = event.target as HTMLInputElement
  processFiles(target.files)
  target.value = ''
}

function onDrop(event: DragEvent) {
  isDragOver.value = false
  processFiles(event.dataTransfer?.files ?? null)
}

function onDragOver() {
  if (props.disabled) return
  isDragOver.value = true
}

function onDragLeave() {
  isDragOver.value = false
}

function removeFile(id: string) {
  model.value = model.value.filter((entry) => entry.id !== id)
}
</script>

<template>
  <div :class="cn('w-full', props.class)">
    <label
      :for="inputId"
      :class="
        cn(
          'flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border px-6 py-10 text-center transition-colors',
          'cursor-pointer hover:border-brand hover:bg-brand-subtle',
          isDragOver && 'border-brand bg-brand-subtle',
          invalid && 'border-status-error',
          disabled && 'pointer-events-none cursor-not-allowed opacity-60',
        )
      "
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
    >
      <input
        :id="inputId"
        type="file"
        class="sr-only"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        :aria-invalid="invalid || undefined"
        :aria-describedby="hint ? hintId : undefined"
        @change="onInputChange"
      />

      <UploadCloud class="size-8 text-fg-muted" aria-hidden="true" />

      <div class="space-y-1">
        <p class="text-sm font-medium text-fg">Drag and drop or click to browse</p>
        <p v-if="hint" :id="hintId" class="text-xs text-fg-muted">{{ hint }}</p>
      </div>
    </label>

    <ul v-if="model.length" class="mt-3 space-y-2">
      <li
        v-for="entry in model"
        :key="entry.id"
        class="flex items-start gap-3 rounded-lg border border-border bg-surface p-3"
      >
        <File class="mt-0.5 size-5 shrink-0 text-fg-muted" aria-hidden="true" />

        <div class="min-w-0 flex-1 space-y-1.5">
          <div class="flex items-center justify-between gap-2">
            <span class="truncate text-sm font-medium text-fg">{{ entry.file.name }}</span>
            <span class="shrink-0 text-xs text-fg-muted">{{ formatSize(entry.file.size) }}</span>
          </div>

          <ProgressBar
            v-if="typeof entry.progress === 'number' && entry.progress < 100"
            :value="entry.progress"
            size="sm"
          />

          <p v-if="entry.error" class="text-xs text-status-error-fg">{{ entry.error }}</p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          icon-only
          :aria-label="`Remove ${entry.file.name}`"
          class="shrink-0"
          @click="removeFile(entry.id)"
        >
          <X />
        </Button>
      </li>
    </ul>
  </div>
</template>
