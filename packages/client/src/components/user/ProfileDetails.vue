<script setup lang="ts">
import { graphql, useFragment, type FragmentType } from '@/api'
import TimeSlots from '@/components/availability/TimeSlots.vue'
import { computed } from 'vue';

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
  <div class="p-8 md:p-12 space-y-12">
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <span class="text-indigo-500 font-mono text-[10px] uppercase tracking-[0.2em]">Data Insight</span>
        <h3 class="text-2xl font-bold text-white tracking-tight">Detaliile Profilului</h3>
      </div>
      <div v-if="profile?.deleted" class="bg-red-500/10 text-red-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase border border-red-500/20">
        Profil Arhivat
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-y-10 gap-x-12">
      <div class="group">
        <p class="text-slate-500 text-[10px] uppercase font-black mb-2 tracking-widest group-hover:text-indigo-400 transition-colors">Nume Complet</p>
        <p class="text-lg text-slate-200 font-medium">{{ profile?.firstName }} {{ profile?.lastName }}</p>
      </div>
      <div class="group">
        <p class="text-slate-500 text-[10px] uppercase font-black mb-2 tracking-widest group-hover:text-indigo-400 transition-colors">Identitate Digitală</p>
        <p class="text-sm font-mono text-slate-400 break-all">{{ profile?.id }}</p>
      </div>
      <div class="group">
        <p class="text-slate-500 text-[10px] uppercase font-black mb-2 tracking-widest group-hover:text-indigo-400 transition-colors">Contact Direct</p>
        <p class="text-lg text-slate-200 font-medium">{{ profile?.email || 'Fără email' }}</p>
      </div>
    </div>

    <div class="bg-slate-950/40 rounded-[2rem] p-8 border border-slate-800/50">
      <div class="flex items-center gap-4 mb-8">
        <div class="h-1 w-10 bg-indigo-600 rounded-full"></div>
        <h4 class="text-sm font-bold uppercase tracking-widest text-white">Program Disponibilitate</h4>
      </div>
      
      <TimeSlots :availabilitySlots="profile?.availabilitySlots" />
    </div>
  </div>
</template>