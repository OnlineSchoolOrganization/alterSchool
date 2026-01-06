<script setup lang="ts">
import { graphql, useFragment, type FragmentType } from '@/api'
import TimeSlots from '@/components/availability/TimeSlots.vue'

const PROFILE_DETAILS_FRAGMENT = graphql(`
  fragment ProfileDetails on Profile {
    firstName
    lastName
    email
    phoneNumber
    deleted
    availabilitySlots {
      id
      dayOfWeek
      startTime
      duration
    }
    roleProfile {
      __typename
    }
  }
`)

const props = defineProps<{
  profiles: FragmentType<typeof PROFILE_DETAILS_FRAGMENT>
    selectedId: string
}>()

const profile = useFragment(PROFILE_DETAILS_FRAGMENT, props.profiles)
</script>

<template>
  <div class="bg-white rounded-2xl shadow p-6 space-y-4">
    <h2 class="text-xl font-semibold">Profil selectat</h2>

    <div class="grid grid-cols-2 gap-4 text-sm">
      <div><span class="font-medium">Nume:</span> {{ profile.firstName }} {{ profile.lastName }}</div>
      <div><span class="font-medium">Email:</span> {{ profile.email ?? '-' }}</div>
      <div><span class="font-medium">Telefon:</span> {{ profile.phoneNumber ?? '-' }}</div>
      <div><span class="font-medium">Status:</span> {{ profile.deleted ? 'Șters' : 'Activ' }}</div>
      <div><span class="font-medium">Tip:</span> {{ profile.roleProfile?.__typename }}</div>
    </div>

    <TimeSlots
      v-if="profile.availabilitySlots?.length"
      :availability-slots="profile.availabilitySlots"
    />
  </div>
</template>
