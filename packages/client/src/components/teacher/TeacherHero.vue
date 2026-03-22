<template>
  <div class="flex flex-col md:flex-row justify-between">
    <div class="flex flex-col md:flex-row gap-10">
      <div class="w-32 h-32 rounded-lg bg-slate-800 flex items-center justify-center text-3xl text-emerald-400">
        {{ teacherData?.profile?.firstName ? teacherData.profile.firstName[0]?.toUpperCase() : "N" }}
        {{ teacherData?.profile?.lastName ? teacherData.profile.lastName[0]?.toUpperCase() : "N" }}
      </div>
  
      <div class="flex flex-col gap-4">
        <h2 class="text-4xl font-bold">{{ teacherData?.profile?.username }}</h2>
        <p class="text-zinc-400">{{ teacherData?.bio }}</p>
  
        <div class="flex gap-10">
          <div v-for="stat in teacherData?.stats" :key="stat.label">
            <div class="text-xs text-zinc-500 uppercase">{{ stat.label }}</div>
            <div class="text-xl font-semibold">{{ stat.value }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex h-max">
      <Button @click="emit('join')" :variant="isMember || joinLoading ? 'block' : 'primary'">{{ isMember ? "Ești înscris" : joinLoading ? "Loading..." : "Înscrie-te" }}</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GetTeacherQuery } from '@/api/graphql'
import Button from '../ui/Button.vue';

const emit = defineEmits<{
  (e: 'join'): void
}>()

defineProps<{
  teacherData: GetTeacherQuery['teacher'] | null
  joinLoading: Boolean
  isMember: Boolean
}>()
</script>
