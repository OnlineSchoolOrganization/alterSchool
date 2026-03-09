<script setup lang="ts">
    import Input from '@/components/ui/Input.vue';
    import Button from '@/components/ui/Button.vue';
    import TimeSlots from '@/components/ui/availability/TimeSlots.vue';
import type { DayOfWeek } from '@/api/graphql';
import { ref } from 'vue';

type AvailabilitySlot = {
  dayOfWeek: DayOfWeek
  startTime: number
  duration: number
}

const credentials = ref<{
    availabilitySlots: AvailabilitySlot[]
}>({
  availabilitySlots: [],
})

function toggleSlot(dayOfWeek: DayOfWeek, startTime: number) {
  const index = credentials.value.availabilitySlots.findIndex(
    s => s.dayOfWeek === dayOfWeek && s.startTime === startTime,
  )

  if (index === -1) {
    credentials.value.availabilitySlots.push({
      dayOfWeek,
      startTime,
      duration: 60,
    })
  } else {
    credentials.value.availabilitySlots.splice(index, 1)
  }
}
</script>

<template>
    <TimeSlots
        @toggle="toggleSlot" 
        :availability-slots="credentials.availabilitySlots"
    />
</template>