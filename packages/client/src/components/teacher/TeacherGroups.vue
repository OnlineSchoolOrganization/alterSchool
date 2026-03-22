<template>
  <div class="flex flex-col gap-6">
    <h3 class="text-xl font-semibold">Grupe Active</h3>

    <div class="grid md:grid-cols-2 gap-6">
      <div v-for="group in groups" class="bg-slate-800/50 p-6 rounded-lg border border-slate-700 flex flex-col gap-4">
        <h4 class="text-lg font-semibold">{{ group?.name }}</h4>

        <div class="text-sm text-zinc-400">{{ group.capacity - (group?.students?.length || 0) }} locuri libere</div>

        <div class="flex flex-col gap-2">
          <div v-for="s in group.sessions" :key="s.dayOfWeek" class="flex justify-between text-sm">
            <span>{{ s.dayOfWeek }}</span>
            <span>{{ s.startTime }}</span>
          </div>
        </div>

        <div class="flex justify-between items-center mt-4">
          <span class="text-emerald-400 font-bold">{{ group.price }} Lei</span>
          <button class="bg-emerald-600 px-4 py-2 rounded-md text-sm">Rezervă</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GetTeacherQuery } from '@/api/graphql'
defineProps<{ groups: GetTeacherQuery['teacher']['groups'] | null }>()
</script>
