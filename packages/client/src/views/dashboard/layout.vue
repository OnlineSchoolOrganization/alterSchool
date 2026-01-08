<script setup lang="ts">
import { MeDocument } from '@/api/graphql'
import { useQuery } from '@vue/apollo-composable'
import { useMenu } from './menu'
import { computed } from 'vue'

const { result, loading } = useQuery(MeDocument)
const user = computed(() => result.value?.me)
const { menu } = useMenu(user)
</script>

<template>
  <div class="flex h-screen bg-[#0a0a0b] text-zinc-300 font-sans">
    <nav class="w-64 shrink-0 h-full bg-[#111113] border-r border-zinc-800/50 flex flex-col">
      <div class="p-8 border-b border-zinc-800/40">
        <div class="flex flex-col gap-1">
          <span class="text-xl font-serif font-bold text-[#c5a47e] tracking-tight italic">Alter</span>
          <span class="text-xs uppercase tracking-[0.3em] text-zinc-500 font-light">School Admin</span>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-8">
        <div v-if="loading" class="flex flex-col gap-6 animate-pulse">
          <div v-for="i in 3" :key="i" class="flex flex-col gap-2">
            <div class="h-2 w-16 bg-zinc-800 rounded mx-3"></div>
            <div class="h-9 w-full bg-zinc-800/50 rounded-lg"></div>
          </div>
        </div>

        <div v-else v-for="category in menu" :key="category.category" class="flex flex-col gap-2">
          <h2 class="px-3 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
            {{ category.category }}
          </h2>
          <ul class="flex flex-col gap-1">
            <li v-for="item in category.items" :key="item.name">
              <router-link
                :to="item.link"
                class="flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all hover:bg-zinc-800/50 hover:text-[#c5a47e]"
                active-class="bg-[#c5a47e]/10 text-[#c5a47e] border-l-2 border-[#c5a47e]"
              >
                {{ item.name }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      <div v-if="user" class="p-4 border-t border-zinc-800/60 bg-black/20">
        <div class="flex items-center gap-3 px-2">
          <div
            class="w-8 h-8 rounded border border-[#c5a47e]/30 flex items-center justify-center text-[10px] font-bold text-[#c5a47e]"
          >
            {{ user.email?.charAt(0).toUpperCase() }}
          </div>
          <div class="min-w-0">
            <p class="text-xs font-medium text-zinc-300 truncate">{{ user.email }}</p>
            <p class="text-[9px] text-zinc-600 uppercase tracking-tighter">{{ user.role }}</p>
          </div>
        </div>
      </div>
    </nav>

    <main class="flex-1 h-full overflow-y-auto bg-[#0a0a0b]">
      <div class="p-10 mx-auto flex flex-col gap-10">
        <slot />
      </div>
    </main>
  </div>
</template>
