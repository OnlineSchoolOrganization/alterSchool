<script setup lang="ts">
import { computed, ref } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import row from './row.vue'
import layout from '../layout.vue'
import { graphql } from '@/api'

const USERS_DOCUMENT = graphql(`
  query Users($filter: String, $skip: Int!, $take: Int!) {
    users(filter: $filter, skip: $skip, take: $take) {
      id
      ...UserRow
    }
    usersCount(filter: $filter)
  }
`)

const filterInput = ref('')
const filter = ref('')
const take = 10
const page = ref(1)
const skip = computed(() => (page.value - 1) * take)

const { result, loading } = useQuery(USERS_DOCUMENT, () => ({
  filter: filter.value,
  skip: skip.value,
  take: take,
}))

const users = computed(() => result.value?.users ?? [])
const total = computed(() => result.value?.usersCount ?? 0)
</script>
<template>
  <layout>
    <div class="flex items-end justify-between border-b border-zinc-800 pb-6 mb-8">
      <div class="flex flex-col gap-1">
        <h1 class="text-3xl font-bold text-white tracking-tight">Utilizatori</h1>
        <p class="text-zinc-500 text-sm">Gestionarea autorității academice și a profilelor.</p>
      </div>
      <div class="text-right">
        <span class="block text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Total Înregistrări</span>
        <span class="text-2xl font-mono text-[#d4af37]">{{ total }}</span>
      </div>
    </div>

    <form
      class="flex gap-4 bg-zinc-900/40 p-2 rounded-lg border border-zinc-800"
      @submit.prevent="
        () => {
          filter = filterInput
          page = 1
          skip = 0
        }
      "
    >
      <div class="flex-1 flex items-center px-3 gap-3">
        <svg class="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="filterInput"
          placeholder="Caută după email (ex: nume@alterschool.ro)"
          class="w-full bg-transparent text-zinc-200 py-2 text-sm focus:outline-none placeholder:text-zinc-600"
        />
      </div>
      <button
        type="submit"
        class="px-8 py-2 bg-white text-black text-xs font-bold uppercase tracking-widest rounded hover:bg-[#d4af37] transition-colors"
      >
        Filtrează
      </button>
    </form>

    <div v-if="loading" class="space-y-4">
      <div
        v-for="i in take"
        :key="i"
        class="h-16 w-full bg-zinc-900/50 animate-pulse rounded border border-zinc-800/50"
      ></div>
    </div>

    <div v-else class="flex flex-col gap-6">
      <div class="overflow-x-auto">
        <table class="w-full min-w-6xl border-collapse">
          <thead>
            <tr class="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.15em] border-b border-zinc-800">
              <th class="p-4 text-left">Cont Utilizator</th>
              <th class="p-4 text-left">Nume</th>
              <th class="p-4 text-center">Acțiune Rol</th>
              <th class="p-4 text-center">Status</th>
              <th class="p-4 text-right">Info</th>
            </tr>
          </thead>
          <tbody>
            <row v-for="user in users" :key="user.id" :user="user" />
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-between pt-6 border-t border-zinc-800">
        <button
          @click="page--"
          :disabled="page === 1"
          class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white disabled:opacity-20"
        >
          ← Înapoi
        </button>
        <div class="text-[11px] text-zinc-400 font-medium">
          PAGINA <span class="text-white mx-1">{{ page }}</span> DIN
          <span class="text-white mx-1">{{ Math.ceil(total / take) }}</span>
        </div>
        <button
          @click="page++"
          :disabled="page >= Math.ceil(total / take)"
          class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white disabled:opacity-20"
        >
          Înainte →
        </button>
      </div>
    </div>
  </layout>
</template>
