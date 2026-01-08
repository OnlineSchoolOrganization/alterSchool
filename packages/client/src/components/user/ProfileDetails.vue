<script setup lang="ts">
import { graphql, useFragment, type FragmentType } from '@/api'
import TimeSlots from '@/components/availability/TimeSlots.vue'
import { computed } from 'vue'

const PROFILE_DETAILS_FRAGMENT = graphql(`
  fragment ProfileDetails on Profile {
    id
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
  profile: FragmentType<typeof PROFILE_DETAILS_FRAGMENT> | null | undefined
}>()

const profile = computed(() => useFragment(PROFILE_DETAILS_FRAGMENT, props.profile))
</script>

<template>
  <div class="p-8 md:p-12 flex flex-col gap-12">
    <div class="flex items-center justify-between">
      <div class="flex flex-col gap-1">
        <span class="text-[#c5a47e] font-mono text-[10px] uppercase tracking-[0.4em] font-bold">Sumar Analytics</span>
        <h3 class="text-2xl font-bold text-zinc-100 tracking-tight">Parametri Profil</h3>
      </div>

      <div v-if="profile?.deleted" class="bg-red-500/10 text-red-400 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase border border-red-500/20 tracking-widest">
        Înregistrare Arhivată
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="(value, label) in {
          'Nume Titular': `${profile?.firstName} ${profile?.lastName}`,
          'Token ID': profile?.id,
          'Canal Comunicare': profile?.email || 'N/A',
        }"
        :key="label"
        class="group bg-[#111113] p-6 rounded-xl border border-zinc-800/50 transition-all hover:border-[#c5a47e]/30 hover:bg-white/[0.02]"
      >
        <p class="text-zinc-500 text-[10px] uppercase font-bold mb-4 tracking-[0.2em] group-hover:text-[#c5a47e] transition-colors">
          {{ label }}
        </p>
        <p :class="[
            label === 'Token ID'
              ? 'text-[11px] font-mono text-zinc-400 break-all bg-[#0a0a0b] p-3 rounded-lg border border-zinc-800'
              : 'text-lg text-zinc-100 font-semibold',
          ]">
          {{ value }}
        </p>
      </div>
    </div>

    <div class="bg-gradient-to-b from-[#111113] to-[#0a0a0b] rounded-xl p-10 border border-zinc-800/50 shadow-xl relative overflow-hidden">
      <div class="absolute top-0 right-0 w-80 h-80 bg-[#c5a47e]/[0.03] blur-[100px] -z-10"></div>

      <div class="flex items-center gap-4 mb-10">
        <div class="h-0.5 w-10 bg-[#c5a47e]"></div>
        <h4 class="text-xs font-bold uppercase tracking-[0.4em] text-zinc-100">Disponibilitate Calendar</h4>
      </div>

      <div class="min-h-[120px]">
        <TimeSlots :availabilitySlots="profile?.availabilitySlots" />
      </div>
    </div>
  </div>
</template>