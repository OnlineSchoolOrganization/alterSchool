<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import { graphql, useFragment } from '@/api'
import layout from '../layout.vue'

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
  <layout>
    <div class="min-h-screen bg-[#0a0a0b] text-zinc-100 py-10 px-6 font-sans relative">
      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[#c5a47e]/[0.02] blur-[140px] pointer-events-none"
      ></div>

      <div
        v-if="loading && !user"
        class="bg-[#111113] border border-zinc-800/50 rounded-xl overflow-hidden animate-pulse relative z-10"
      >
        <div
          class="p-8 md:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-zinc-800/50"
        >
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-3">
              <div class="h-px w-8 bg-zinc-800"></div>
              <div class="h-3 w-32 bg-zinc-800 rounded"></div>
            </div>
            <div class="h-12 w-64 bg-zinc-800 rounded-lg"></div>
          </div>
          <div class="h-20 w-full lg:w-72 bg-[#0a0a0b] border border-zinc-800/50 rounded-lg"></div>
        </div>

        <div class="p-8 bg-[#0a0a0b]/40">
          <div class="flex justify-between items-center mb-8">
            <div class="h-4 w-40 bg-zinc-800 rounded"></div>
            <div class="h-8 w-32 bg-zinc-800 rounded-lg"></div>
          </div>
          <div class="flex flex-wrap gap-3">
            <div v-for="i in 4" :key="i" class="h-10 w-28 bg-zinc-800 rounded-lg"></div>
          </div>
        </div>

        <div class="p-12 space-y-12">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="i in 3" :key="i" class="h-28 bg-[#111113] border border-zinc-800/50 rounded-xl"></div>
          </div>
          <div class="h-64 w-full bg-[#111113] border border-zinc-800/50 rounded-xl"></div>
        </div>
      </div>

      <div
        v-else-if="error"
        class="bg-red-500/5 border border-red-500/20 p-12 rounded-xl text-center backdrop-blur-md relative z-10"
      >
        <div class="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-7 h-7 text-red-500/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 class="text-zinc-100 font-bold mb-2 text-xl tracking-tight">Eroare de Protocol</h3>
        <p class="text-zinc-500 text-sm font-mono">{{ error.message }}</p>
      </div>

      <div
        v-else-if="user"
        class="bg-[#111113] border border-zinc-800/50 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10"
      >
        <UserHeader :user="user" />
        <div class="h-px w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
        <ProfileSelector :user="user" :selectedId="selectedProfileId" />
      </div>

      <div v-else class="text-center py-48 relative z-10">
        <div class="text-zinc-900 font-black text-9xl mb-4 tracking-tighter select-none">NULL</div>
        <p class="text-zinc-500 tracking-[0.5em] font-bold text-xs uppercase">Entitate inexistentă în registru</p>
      </div>
    </div>
  </layout>
</template>
