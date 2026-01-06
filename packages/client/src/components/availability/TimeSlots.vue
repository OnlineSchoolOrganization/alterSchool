<script setup lang="ts">
import TimeSlot from './TimeSlot.vue'

type AvailabilitySlot = {
  dayOfWeek: string
  startTime: number
  duration: number
}

const props = defineProps<{
  availabilitySlots?: AvailabilitySlot[] | null
}>()

const emit = defineEmits<{
  (e: 'toggle', dayOfWeek: string, startTime: number): void
}>()

const start = 900 // 15:00
const hours = 6
const duration = 60 // minutes
const days: string[] = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sambată', 'Duminică']
const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

function isSelected(dayOfWeek: string, startTime: number) {
  return props.availabilitySlots?.some(slot => slot.dayOfWeek === dayOfWeek && slot.startTime === startTime)
}
</script>

<template>
  <div class="flex flex-col gap-4 justify-center items-center">
    <div class="flex gap-4">
      <TimeSlot v-for="day in days" :key="day" :text="day" type="primary" />
    </div>
    <div class="flex gap-4" v-for="i in hours" :key="i">
      <TimeSlot
        v-for="value in daysOfWeek"
        :key="value + i"
        :text="`${(start + i * duration - duration) / 60}:00-${(start + i * duration) / 60}:00`"
        :type="isSelected(value, start + i * duration - duration) ? 'selected' : 'default'"
        @click="emit('toggle', value, start + i * duration - duration)"
      />
    </div>
  </div>
</template>
