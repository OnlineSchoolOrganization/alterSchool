<script setup lang="ts">
import type { DayOfWeek } from '@/api/graphql'
import TimeSlot from './TimeSlot.vue'

type AvailabilitySlot = {
  dayOfWeek: DayOfWeek
  startTime: number
  duration: number
}

const props = defineProps<{
  availabilitySlots?: AvailabilitySlot[] | null
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle', dayOfWeek: DayOfWeek, startTime: number): void
}>()

const start = 900 // 15:00
const hours = 6
const duration = 60 
const days: string[] = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică']
const daysOfWeek: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

function isSelected(dayOfWeek: string, startTime: number) {
  return props.availabilitySlots?.some(slot => slot.dayOfWeek === dayOfWeek && slot.startTime === startTime)
}

function formatTime(minutes: number) {
  const h = Math.floor(minutes / 60);
  return `${h}:00`;
}
</script>

<template>
  <div class="w-full bg-[#0a0a0b] p-4 md:p-8 rounded-xl border border-white/[0.05]">
    <div class="overflow-x-auto pb-4 custom-scrollbar">
      <div class="grid grid-cols-7 gap-3 min-w-[900px]">
        
        <TimeSlot 
          v-for="day in days" 
          :key="day" 
          :text="day" 
          type="primary" 
        />

        <template v-for="i in hours" :key="`row-${i}`">
          <TimeSlot
            v-for="value in daysOfWeek"
            :key="`${value}-${i}`"
            :loading="loading"
            :text="`${formatTime(start + (i - 1) * duration)} - ${formatTime(start + i * duration)}`"
            :type="isSelected(value, start + (i - 1) * duration) ? 'selected' : 'default'"
            @click="!loading && emit('toggle', value, start + (i - 1) * duration)"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom Scrollbar for Dark System */
.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #111113;
  border-radius: 8px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #c5a47e44;
  border-radius: 8px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #c5a47e;
}
</style>