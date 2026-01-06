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
  <div class="p-8 md:p-10 bg-slate-900/50">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div class="space-y-2">
        <div class="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-[0.3em]">
          <span class="w-8 h-[1px] bg-indigo-500"></span>
          User Management
        </div>
        <h1 class="text-4xl font-black text-white tracking-tight">
          {{ user.firstName }} <span class="text-slate-500">{{ user.lastName }}</span>
        </h1>
      </div>

      <div class="flex flex-wrap gap-4 text-sm">
        <div class="flex flex-col">
          <span class="text-slate-500 text-[10px] uppercase font-bold">Email Principal</span>
          <span class="text-slate-200">{{ user.email }}</span>
        </div>
        <div class="w-[1px] h-8 bg-slate-800 hidden md:block"></div>
        <div class="flex flex-col">
          <span class="text-slate-500 text-[10px] uppercase font-bold">Rol Sistem</span>
          <span class="text-indigo-400 font-mono">{{ user.role?.join(', ') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>