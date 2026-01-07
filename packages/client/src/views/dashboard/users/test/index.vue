<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import { graphql, useFragment } from '@/api'

import UserHeader from '@/components/user/UserHeader.vue'
import ProfileSelector from '@/components/user/ProfileSelector.vue'

const route = useRoute()
const userId = route.params.id as string

const USER_VIEW_FRAGMENT = graphql(`
  fragment UserView on User {
    id
    ...UserHeader
    ...ProfileSelector
  }
`)

const GET_USER_BY_ID = graphql(`
  query GetUserById($userId: ID) {
    me(userId: $userId) {
      ...UserView
    }
  }
`)

const { result, loading, error } = useQuery(GET_USER_BY_ID, { userId: userId })

const user = computed(() => {
  const userData = result.value?.me
  return userData ? useFragment(USER_VIEW_FRAGMENT, userData) : null
})

const selectedProfileId = computed(() => route.query.profileId as string | undefined)
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-200 py-10 px-6">
    <div v-if="loading && !user" class="max-w-5xl mx-auto flex flex-col items-center justify-center py-40 space-y-4">
      <div class="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      <p class="text-slate-500 font-bold tracking-widest text-xs uppercase">Se încarcă datele utilizatorului...</p>
    </div>

    <div v-else-if="error" class="max-w-5xl mx-auto bg-red-500/10 border border-red-500/20 p-8 rounded-[2.5rem] text-center">
      <p class="text-red-400 font-medium">Eroare la încărcare: {{ error.message }}</p>
    </div>

    <div v-else-if="user" class="mx-auto bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in duration-500">
      <UserHeader :user="user" />
      
      <div class="h-px bg-slate-800 mx-8"></div>

      <ProfileSelector
        :user="user"
        :selectedId="selectedProfileId"
      />
    </div>

    <div v-else class="text-center py-20 text-slate-500 tracking-widest italic">
      UTILIZATORUL NU A FOST GĂSIT
    </div>
  </div>
</template>