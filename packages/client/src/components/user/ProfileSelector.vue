<script setup lang="ts">
import { graphql, useFragment, type FragmentType } from '@/api'
import { computed, ref } from 'vue'
import ProfileDetails from '@/components/user/ProfileDetails.vue'

const PROFILE_SELECTOR_FRAGMENT = graphql(`
  fragment ProfileSelector on User {
    profiles {
      id
      firstName
      lastName
      deleted
      roleProfile {
        __typename
      }
      ...ProfileDetails
    }
  }
`)

const props = defineProps<{
  user: FragmentType<typeof PROFILE_SELECTOR_FRAGMENT>
}>()

const profiles = computed(() => useFragment(PROFILE_SELECTOR_FRAGMENT, props.user).profiles)

const selectedId = ref<string | null>(null)

function selectProfile(id: string) {
  selectedId.value = id
}

const selectedProfile = computed(() => profiles.value?.find(p => p.id === selectedId.value))

const showDeleted = ref(false)

const filteredProfiles = computed(() => {
  if (showDeleted.value) {
    return profiles.value // Returnează tot (active + șterse)
  }
  return profiles.value?.filter(p => !p.deleted) // Returnează doar cele active
})
</script>

<template>
  <div class="flex flex-col">
    <div class="bg-[#0a0a0b]/40 p-8 border-b border-zinc-800/50">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <h2 class="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 flex items-center gap-3">
          <span class="w-2 h-2 rounded-full bg-[#c5a47e] shadow-[0_0_8px_#c5a47e]"></span>
          Profile Asociate
        </h2>

        <label class="relative inline-flex items-center cursor-pointer group bg-[#111113] p-1.5 pr-5 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-all">
          <input type="checkbox" v-model="showDeleted" class="sr-only peer" />
          <div class="w-9 h-5 bg-zinc-800 rounded-md peer peer-checked:bg-[#c5a47e]/20 after:content-[''] after:absolute after:top-[9px] after:left-[9px] after:bg-zinc-600 after:rounded-sm after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-full peer-checked:after:bg-[#c5a47e] shadow-inner"></div>
          <span class="ml-3 text-[10px] font-bold text-zinc-500 group-hover:text-zinc-300 transition-colors uppercase tracking-[0.2em]">Include Arhiva</span>
        </label>
      </div>

      <div class="flex flex-wrap gap-3">
        <button
          v-for="profile in filteredProfiles"
          :key="profile.id"
          @click="selectProfile(profile.id)"
          class="group relative px-6 py-3 rounded-lg text-[11px] font-bold transition-all duration-300 border"
          :class="[
            profile.id === selectedId
              ? 'bg-[#c5a47e] text-[#0a0a0b] border-[#c5a47e] shadow-lg shadow-[#c5a47e]/10'
              : 'bg-[#111113] text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:bg-white/[0.03] hover:text-zinc-200',
            profile.deleted && profile.id !== selectedId ? 'opacity-40 grayscale' : '',
          ]"
        >
          {{ profile.firstName }} {{ profile.lastName }}
        </button>
      </div>
    </div>

    <div class="relative min-h-[500px] bg-[#0a0a0b]/20">
      <transition
        mode="out-in"
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-2"
      >
        <div v-if="selectedProfile" :key="selectedId as string">
          <ProfileDetails :profile="selectedProfile" />
        </div>
        <div v-else class="p-40 text-center flex flex-col items-center justify-center gap-6">
          <div class="w-16 h-16 rounded-xl bg-[#111113] border border-zinc-800 flex items-center justify-center text-zinc-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
            </svg>
          </div>
          <p class="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px]">Așteptare selecție profil</p>
        </div>
      </transition>
    </div>
  </div>
</template>