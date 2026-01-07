<script setup lang="ts">
import { graphql, useFragment, type FragmentType } from '@/api'
import { computed, ref } from 'vue';
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

const profiles = computed(() =>
  useFragment(PROFILE_SELECTOR_FRAGMENT, props.user).profiles
)

const selectedId = ref<string | null>(null)

function selectProfile(id: string) {
  selectedId.value = id
}

const selectedProfile = computed(() => 
  profiles.value?.find(p => p.id === selectedId.value)
)

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
    <div class="bg-slate-800/30 p-8 border-b border-slate-800/50">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <h2 class="text-sm font-bold uppercase tracking-widest text-slate-400">Profile Disponibile</h2>
        
        <label class="relative inline-flex items-center cursor-pointer group">
          <input type="checkbox" v-model="showDeleted" class="sr-only peer">
          <div class="w-9 h-5 bg-slate-700 rounded-full peer peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full peer-checked:after:bg-white"></div>
          <span class="ml-3 text-xs font-semibold text-slate-500 group-hover:text-slate-300 transition-colors uppercase">Arată șterse</span>
        </label>
      </div>

      <div class="flex flex-wrap gap-2">
        <button
          v-for="profile in filteredProfiles"
          :key="profile.id"
          @click="selectProfile(profile.id)"
          class="px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border"
          :class="[
            profile.id === selectedId
              ? 'bg-white text-slate-900 border-white'
              : 'bg-slate-900/50 text-slate-400 border-slate-700 hover:border-slate-500',
            profile.deleted && profile.id !== selectedId ? 'opacity-40' : ''
          ]"
        >
          {{ profile.firstName }} {{ profile.lastName }}
        </button>
      </div>
    </div>

    <div class="relative">
      <div v-if="selectedProfile" class="animate-in fade-in duration-700">
        <ProfileDetails :profile="selectedProfile" />
      </div>
      <div v-else class="p-20 text-center">
        <p class="text-slate-600 font-medium italic text-sm">Selectează un profil de mai sus pentru a vizualiza detaliile tehnice</p>
      </div>
    </div>
  </div>
</template>