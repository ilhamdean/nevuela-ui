<script setup lang="ts">
import { computed, shallowRef, watch, type HTMLAttributes } from 'vue'
import {
  CalendarCell,
  CalendarCellTrigger,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarHeader,
  CalendarHeading,
  CalendarNext,
  CalendarPrev,
  DatePickerAnchor,
  DatePickerCalendar,
  DatePickerContent,
  DatePickerField,
  DatePickerInput,
  DatePickerRoot,
  DatePickerTrigger,
} from 'reka-ui'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from '@lucide/vue'
import {
  type CalendarDate,
  type DateValue,
  fromDate,
  getLocalTimeZone,
  toCalendarDate,
  today,
} from '@internationalized/date'
import { cn } from '@/lib/utils'
import { datePickerTriggerVariants, type DatePickerVariants } from '.'

interface Props {
  min?: Date
  max?: Date
  disabled?: boolean
  /** Marks the field invalid: red border + `aria-invalid`. Pair with a FormField error. */
  invalid?: boolean
  size?: DatePickerVariants['size']
  /** Placeholder for the whole field, shown via `aria-label` (segments render their own tokens). */
  placeholder?: string
  id?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  disabled: false,
  invalid: false,
  placeholder: 'Pick a date',
})

/** Selected date, as a plain `Date` — the component converts to/from `@internationalized/date` internally. */
const model = defineModel<Date | undefined>()

const timeZone = getLocalTimeZone()

function dateToCalendarDate(date: Date | undefined): CalendarDate | undefined {
  if (!date) return undefined
  return toCalendarDate(fromDate(date, timeZone))
}

function calendarDateToDate(date: DateValue | undefined): Date | undefined {
  if (!date) return undefined
  return date.toDate(timeZone)
}

const minValue = computed(() => dateToCalendarDate(props.min))
const maxValue = computed(() => dateToCalendarDate(props.max))

/** Bridges the public `Date` model to the `DateValue` the DatePickerRoot works with. */
const internalValue = computed<CalendarDate | undefined>({
  get: () => dateToCalendarDate(model.value),
  set: (value) => {
    model.value = calendarDateToDate(value)
  },
})

/** The focused-but-not-selected date driving which month the calendar opens to. */
const internalPlaceholder = shallowRef<DateValue>(
  minValue.value ?? dateToCalendarDate(model.value) ?? today(timeZone),
)

// Keep the calendar's focused month in sync when the selected value changes from outside.
watch(
  () => model.value,
  (value) => {
    const calendarDate = dateToCalendarDate(value)
    if (calendarDate) internalPlaceholder.value = calendarDate
  },
)

const segmentClass = (part: string) =>
  part === 'literal'
    ? 'px-0.5 text-fg-muted'
    : 'rounded-xs px-0.5 tabular-nums outline-none focus:bg-brand-subtle focus:text-brand-fg'

const navButtonClass =
  'inline-flex size-7 items-center justify-center rounded-sm text-fg-muted outline-none transition-colors hover:bg-bg-subtle hover:text-fg focus-visible:ring-2 focus-visible:ring-brand/25 disabled:pointer-events-none disabled:opacity-40'

const cellTriggerClass =
  'inline-flex size-9 items-center justify-center rounded-sm text-sm outline-none transition-colors hover:bg-bg-subtle focus-visible:ring-2 focus-visible:ring-brand/25 data-[today]:border data-[today]:border-brand data-[selected]:bg-brand data-[selected]:font-semibold data-[selected]:text-on-accent data-[selected]:hover:bg-brand-hover data-[outside-view]:text-fg-muted data-[outside-view]:opacity-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-40 data-[unavailable]:pointer-events-none data-[unavailable]:text-status-error-fg data-[unavailable]:line-through'
</script>

<template>
  <DatePickerRoot
    :id="id"
    v-model="internalValue"
    v-model:placeholder="internalPlaceholder"
    :min-value="minValue"
    :max-value="maxValue"
    :disabled="disabled"
  >
    <DatePickerAnchor
      :aria-invalid="invalid || undefined"
      :aria-label="placeholder"
      :class="cn(datePickerTriggerVariants({ size, invalid, disabled }), props.class)"
    >
      <DatePickerField v-slot="{ segments }" class="flex flex-1 items-center">
        <template v-for="segment in segments" :key="segment.part">
          <DatePickerInput :part="segment.part" :class="segmentClass(segment.part)">{{
            segment.value
          }}</DatePickerInput>
        </template>
      </DatePickerField>

      <DatePickerTrigger
        :disabled="disabled"
        aria-label="Open calendar"
        class="inline-flex size-5 shrink-0 items-center justify-center text-fg-muted outline-none transition-colors hover:text-fg disabled:pointer-events-none disabled:opacity-50"
      >
        <CalendarIcon class="size-4" aria-hidden="true" />
      </DatePickerTrigger>
    </DatePickerAnchor>

    <DatePickerContent
      :side-offset="4"
      class="z-50 rounded-md border border-border bg-surface p-3 text-fg shadow-md data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
    >
      <DatePickerCalendar v-slot="{ grid, weekDays }">
        <div v-for="month in grid" :key="month.value.toString()">
          <CalendarHeader class="flex items-center justify-between px-1 py-2">
            <CalendarPrev :class="navButtonClass" aria-label="Previous month">
              <ChevronLeft class="size-4" aria-hidden="true" />
            </CalendarPrev>
            <CalendarHeading class="text-sm font-semibold text-fg" />
            <CalendarNext :class="navButtonClass" aria-label="Next month">
              <ChevronRight class="size-4" aria-hidden="true" />
            </CalendarNext>
          </CalendarHeader>

          <CalendarGrid class="w-full border-collapse select-none">
            <CalendarGridHead>
              <CalendarGridRow class="flex">
                <CalendarHeadCell
                  v-for="day in weekDays"
                  :key="day"
                  class="w-9 text-2xs font-medium text-fg-muted"
                  >{{ day }}</CalendarHeadCell
                >
              </CalendarGridRow>
            </CalendarGridHead>
            <CalendarGridBody>
              <CalendarGridRow v-for="(week, i) in month.rows" :key="i" class="flex w-full">
                <CalendarCell
                  v-for="value in week"
                  :key="value.toString()"
                  :date="value"
                  class="relative size-9 p-0 text-center text-sm"
                >
                  <CalendarCellTrigger
                    :day="value"
                    :month="month.value"
                    :class="cellTriggerClass"
                  />
                </CalendarCell>
              </CalendarGridRow>
            </CalendarGridBody>
          </CalendarGrid>
        </div>
      </DatePickerCalendar>
    </DatePickerContent>
  </DatePickerRoot>
</template>
