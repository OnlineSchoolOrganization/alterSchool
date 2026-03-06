<script setup lang="ts">
import { graphql, useFragment, type FragmentType } from '@/api'

const USER_HEADER_FRAGMENT = graphql(`
  fragment UserHeader on User {
    firstName
    lastName
    email
    phoneNumber
    role
  }
`)

const props = defineProps<{
  user: FragmentType<typeof USER_HEADER_FRAGMENT>
}>()

const user = useFragment(USER_HEADER_FRAGMENT, props.user)
</script>

<template>
  <div class="p-8 md:p-12 bg-gradient-to-b from-white/[0.02] to-transparent">
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-3">
          <div class="h-px w-8 bg-[#c5a47e]"></div>
          <span class="text-[#c5a47e] font-bold text-[10px] uppercase tracking-[0.4em]">Management Utilizator</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold text-zinc-100 tracking-tight">
          {{ user.firstName }} <span class="text-zinc-500 font-light">{{ user.lastName }}</span>
        </h1>
      </div>

      <div class="flex items-center gap-8 bg-[#0a0a0b] p-6 rounded-lg border border-zinc-800/50">
        <div class="flex flex-col gap-1">
          <span class="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Identificator Email</span>
          <span class="text-zinc-200 text-sm font-medium">{{ user.email }}</span>
        </div>
        <div class="w-px h-10 bg-zinc-800"></div>
        <div class="flex flex-col gap-1">
          <span class="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Nivel Acces</span>
          <span class="text-[#c5a47e] font-mono text-xs uppercase tracking-wider">{{ user.role?.join(' • ') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
