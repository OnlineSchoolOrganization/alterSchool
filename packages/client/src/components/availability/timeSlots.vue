<script setup lang="ts">
  import { gql } from '@apollo/client';
  import { useMutation, useQuery } from '@vue/apollo-composable';
  import { computed, ref } from 'vue'
  import timeSlot from './timeSlot.vue';

  const start = 900 // 15:00
  const hours = 6
  const duration = 60 // minutes
  const days: string[] = [ 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sambată', 'Duminică' ]
  const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

  const GET_AVAILABILITY_SLOTS = gql`
    query getAvailabilitySlots {
      availabilitySlots {
        id
        dayOfWeek
        startTime
      }
    }
  `;
  const TOGGLE_AVAILABILITY_SLOT = gql`
    mutation toggleAvailabilitySlot($dayOfWeek: DayOfWeek!, $startTime: Int!) {
      toggleAvailabilitySlot(dayOfWeek: $dayOfWeek, startTime: $startTime) {
        id
        dayOfWeek
        startTime
      }
    }
  `;

  const loadingSlots = ref<{[key: string]: boolean}>({})

  const { mutate: toggleMutate } = useMutation(TOGGLE_AVAILABILITY_SLOT)
  const { result, refetch } = useQuery(GET_AVAILABILITY_SLOTS)
  const availabilitySlots = computed(() => result.value?.availabilitySlots || [])

  const toggleSlot = async (dayOfWeek: string, startTime: number) => {
    const key = `${dayOfWeek}-${startTime}`
    loadingSlots.value[key] = true
    await toggleMutate({ dayOfWeek, startTime });
    await refetch();
    loadingSlots.value[key] = false
  }
</script>

<template>
  <div class="flex flex-col gap-4 justify-center items-center h-screen">
    <div class="flex gap-4">
      <timeSlot
        v-for="day in days"
        :key="day"
        :text="day"
        type="primary"
      />
    </div>
    <div class="flex gap-4" v-for="i in hours" :key="i">
      <timeSlot
        v-for="value in daysOfWeek"
        :key="value + i"
        :text="`${(start + i * duration - duration)/60}:00-${(start + i * duration)/60}:00`"
        :type="availabilitySlots && availabilitySlots.find((slot: any) => slot.dayOfWeek === value && slot.startTime === (start + i * duration - duration)) ? 'selected' : 'default'"
        :loading="loadingSlots[`${value}-${start + i * duration - duration}`]"
        @click="toggleSlot(value, start + i * duration - duration)"
        />
      </div>
  </div>
</template>