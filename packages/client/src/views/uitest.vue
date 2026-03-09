<script setup lang="ts">
    import Input from '@/components/ui/Input.vue';
    import Button from '@/components/ui/Button.vue';
    import TimeSlots from '@/components/ui/availability/TimeSlots.vue';
    import MiniProfile from '@/components/ui/profile/MiniProfile.vue';
    import AddProfile from '@/components/ui/profile/AddProfile.vue';
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
    <div class="p-10">
        <div class="mb-10">
            <h1 class="text-3xl text-center">Selecteaza un profil</h1>
            <p class="text-lg text-center">Selectează profilul pe care vrei să-l folosești</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch mx-auto max-w-7xl">
            <MiniProfile v-for="i in 2" :key="i" name="Cristi Chiu" email="test@gmail.com" />
            <AddProfile />
        </div>
    </div>
</template>