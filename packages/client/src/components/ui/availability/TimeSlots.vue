<script setup lang="ts">
import type { DayOfWeek } from '@/api/graphql'
import TimeSlot from './TimeSlot.vue';
import { onMounted, onUnmounted, ref } from 'vue';

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

const start = 840 // 14:00
const hours = 8
const duration = 60
const daysOfWeek: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

function normalizeDays(day: DayOfWeek) {
  switch(day) {
    case "MONDAY": return "Luni"
    case "TUESDAY": return "Marți"
    case "WEDNESDAY": return "Miercuri"
    case "THURSDAY": return "Joi"
    case "FRIDAY": return "Vineri"
    case "SATURDAY": return "Sâmbătă"
    case "SUNDAY": return "Duminică"
    default: return day
  }
}

function isSelected(dayOfWeek: string, startTime: number) {
  return props.availabilitySlots?.some(slot => slot.dayOfWeek === dayOfWeek && slot.startTime === startTime)
}

const openDay = ref<string|null>("MONDAY")
const isXL = ref(false)

function updateScreen() {
  isXL.value = window.innerWidth >= 1280
}

onMounted(() => {
  updateScreen()
  window.addEventListener("resize", updateScreen)
})

onUnmounted(() => {
  window.removeEventListener("resize", updateScreen)
})
</script>

<template>
  <div class="xl:w-max w-full overflow-x-auto custom-scrollbar rounded-md border border-slate-700">
    <div class="xl:flex">
      <div class="hidden xl:block">
        <div class="w-30 p-3 flex items-center justify-center bg-slate-800/80">
          Time
        </div>
        <div v-for="i in hours" class="w-30 h-13 p-3 flex items-center justify-center bg-slate-800/80 border-t border-slate-700/50">
          {{ (i * duration + start)/duration - 1 }}-{{ (i * duration + start)/duration }}
        </div>
      </div>
      <div v-for="value in daysOfWeek" :key="`col-${value}`">
        <div 
          class="w-full p-3 flex items-center justify-between bg-slate-800/80 cursor-pointer xl:cursor-default"
          @click="() => { openDay === value ? openDay = null : openDay = value }"
        >
          <span>{{ normalizeDays(value) }}</span>
          <span class="xl:hidden">
            {{ openDay === value ? '-' : '+' }}
          </span>
        </div>

        <div 
          v-show="openDay === value || isXL"
          class="grid grid-cols-1 xl:grid-cols-1"
        >
          <TimeSlot
            v-for="i in hours"
            :key="`${value}-${i}`"
            :loading="loading"
            :type="isSelected(value, start + (i-1) * duration) ? 'selected' : 'default'"
            @click="!loading && emit('toggle', value, start + (i - 1) * duration)"
          >
            <span v-if="!isXL">
              {{ (i * duration + start)/duration - 1 }}-{{ (i * duration + start)/duration }}
            </span>
            <svg v-else-if="isSelected(value, start + (i-1) * duration)" class="text-zinc-100 size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </TimeSlot>
        </div>
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
