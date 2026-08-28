<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import {
  DateRangePickerAnchor,
  DateRangePickerCalendar,
  DateRangePickerCell,
  DateRangePickerCellTrigger,
  DateRangePickerContent,
  DateRangePickerField,
  DateRangePickerGrid,
  DateRangePickerGridBody,
  DateRangePickerGridHead,
  DateRangePickerGridRow,
  DateRangePickerHeadCell,
  DateRangePickerHeader,
  DateRangePickerHeading,
  DateRangePickerInput,
  DateRangePickerNext,
  DateRangePickerPrev,
  DateRangePickerRoot,
  DateRangePickerTrigger,
} from 'reka-ui'
import { fromDate, toCalendarDate, type DateValue } from '@internationalized/date'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from '@lucide/vue'
import { cn } from '@/lib/utils'
import { dateRangePickerTriggerVariants, type DateRange, type DateRangePickerVariants } from '.'

interface Props {
  min?: Date
  max?: Date
  disabled?: boolean
  invalid?: boolean
  size?: DateRangePickerVariants['size']
  placeholder?: string
  id?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  min: undefined,
  max: undefined,
  disabled: false,
  invalid: false,
  size: 'md',
  placeholder: 'Select date range',
  id: undefined,
})

/** The selected range, exposed as plain `Date`s — see `DateRange` in `index.ts`. */
const model = defineModel<DateRange>({ default: () => ({ start: undefined, end: undefined }) })

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

/** `Date` -> `@internationalized/date` `DateValue`, the shape Reka's calendar primitives use internally. */
function toDateValue(date: Date | undefined): DateValue | undefined {
  if (!date) return undefined
  return toCalendarDate(fromDate(date, timeZone))
}

/** `DateValue` -> plain `Date`, for round-tripping back out through `v-model`. */
function toJsDate(value: DateValue | undefined | null): Date | undefined {
  return value ? value.toDate(timeZone) : undefined
}

/** Bridges the public `DateRange` (plain `Date`s) model to Reka's internal `DateValue` pair. */
const internalValue = computed({
  get: () => ({
    start: toDateValue(model.value.start),
    end: toDateValue(model.value.end),
  }),
  set: (value) => {
    model.value = {
      start: toJsDate(value?.start),
      end: toJsDate(value?.end),
    }
  },
})

const minValue = computed(() => toDateValue(props.min))
const maxValue = computed(() => toDateValue(props.max))

const navButtonClass =
  'inline-flex size-7 items-center justify-center rounded-sm text-fg-muted outline-none transition-colors hover:bg-bg-subtle hover:text-fg focus-visible:ring-2 focus-visible:ring-brand/25 disabled:pointer-events-none disabled:opacity-40'

const cellTriggerClass = cn(
  'inline-flex size-9 items-center justify-center rounded-sm text-sm text-fg outline-none transition-colors',
  'hover:bg-bg-subtle',
  'focus-visible:ring-2 focus-visible:ring-brand/25',
  'data-[today]:border data-[today]:border-brand',
  'data-[outside-view]:text-fg-muted data-[outside-view]:opacity-50',
  'data-[disabled]:pointer-events-none data-[disabled]:opacity-40',
  'data-[highlighted]:rounded-none data-[highlighted]:bg-brand-subtle',
  'data-[selected]:rounded-none data-[selected]:bg-brand-subtle',
  'data-[selection-start]:rounded-l-sm data-[selection-start]:bg-brand data-[selection-start]:text-on-accent data-[selection-start]:hover:bg-brand-hover',
  'data-[selection-end]:rounded-r-sm data-[selection-end]:bg-brand data-[selection-end]:text-on-accent data-[selection-end]:hover:bg-brand-hover',
)

const segmentClass =
  'rounded-sm px-0.5 tabular-nums outline-none focus:bg-brand-subtle focus:text-brand-fg data-[placeholder]:text-fg-muted'
</script>

<template>
  <DateRangePickerRoot
    :id="id"
    v-model="internalValue"
    :min-value="minValue"
    :max-value="maxValue"
    :disabled="disabled"
    :number-of-months="2"
  >
    <DateRangePickerAnchor
      :class="cn(dateRangePickerTriggerVariants({ size, invalid, disabled }), props.class)"
    >
      <DateRangePickerField v-slot="{ segments }" class="flex flex-1 items-center">
        <template v-for="(segment, i) in segments.start" :key="`start-${i}`">
          <DateRangePickerInput
            type="start"
            :part="segment.part"
            :class="segment.part === 'literal' ? 'text-fg-muted' : segmentClass"
            >{{ segment.value }}</DateRangePickerInput
          >
        </template>
        <span class="px-1.5 text-fg-muted" aria-hidden="true">–</span>
        <template v-for="(segment, i) in segments.end" :key="`end-${i}`">
          <DateRangePickerInput
            type="end"
            :part="segment.part"
            :class="segment.part === 'literal' ? 'text-fg-muted' : segmentClass"
            >{{ segment.value }}</DateRangePickerInput
          >
        </template>
      </DateRangePickerField>

      <DateRangePickerTrigger
        class="ml-auto inline-flex size-6 shrink-0 items-center justify-center rounded-sm text-fg-muted outline-none transition-colors hover:bg-bg-subtle hover:text-fg disabled:pointer-events-none"
        aria-label="Open calendar"
      >
        <CalendarIcon class="size-4" aria-hidden="true" />
      </DateRangePickerTrigger>
    </DateRangePickerAnchor>

    <DateRangePickerContent
      :side-offset="4"
      class="z-50 rounded-md border border-border bg-surface p-3 text-fg shadow-md outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
    >
      <DateRangePickerCalendar v-slot="{ grid, weekDays }">
        <div class="flex gap-6">
          <div v-for="(month, mi) in grid" :key="mi">
            <DateRangePickerHeader class="flex items-center justify-between px-1 py-2">
              <DateRangePickerPrev
                v-if="mi === 0"
                :class="navButtonClass"
                aria-label="Previous month"
              >
                <ChevronLeft class="size-4" aria-hidden="true" />
              </DateRangePickerPrev>
              <span v-else class="size-7" />

              <DateRangePickerHeading class="text-sm font-semibold text-fg" />

              <DateRangePickerNext
                v-if="mi === grid.length - 1"
                :class="navButtonClass"
                aria-label="Next month"
              >
                <ChevronRight class="size-4" aria-hidden="true" />
              </DateRangePickerNext>
              <span v-else class="size-7" />
            </DateRangePickerHeader>

            <DateRangePickerGrid class="w-full border-collapse">
              <DateRangePickerGridHead>
                <DateRangePickerGridRow class="flex">
                  <DateRangePickerHeadCell
                    v-for="day in weekDays"
                    :key="day"
                    class="w-9 text-2xs font-medium text-fg-muted"
                    >{{ day }}</DateRangePickerHeadCell
                  >
                </DateRangePickerGridRow>
              </DateRangePickerGridHead>
              <DateRangePickerGridBody>
                <DateRangePickerGridRow
                  v-for="(week, wi) in month.rows"
                  :key="wi"
                  class="flex w-full"
                >
                  <DateRangePickerCell
                    v-for="value in week"
                    :key="value.toString()"
                    :date="value"
                    class="relative size-9 p-0 text-center text-sm"
                  >
                    <DateRangePickerCellTrigger
                      :day="value"
                      :month="month.value"
                      :class="cellTriggerClass"
                    />
                  </DateRangePickerCell>
                </DateRangePickerGridRow>
              </DateRangePickerGridBody>
            </DateRangePickerGrid>
          </div>
        </div>
      </DateRangePickerCalendar>
    </DateRangePickerContent>
  </DateRangePickerRoot>
</template>
