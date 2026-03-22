<template>
  <div class="flex flex-col gap-6">
    <h3 class="text-xl font-semibold">Tarife</h3>

    <div class="grid md:grid-cols-3 gap-6">
      <div
        v-for="plan in plans"
        :key="plan.type"
        class="bg-slate-800/50 p-6 rounded-lg border border-slate-700 flex flex-col gap-4"
      >
        <div class="text-sm text-emerald-400">{{ plan.label }}</div>
        <div class="text-2xl font-bold">{{ plan.amount }} LEI</div>

        <ul class="text-sm text-zinc-400">
          <li v-for="b in plan.benefits" :key="b">• {{ b }}</li>
        </ul>

        <!-- <button class="bg-slate-700 hover:bg-emerald-600 px-4 py-2 rounded-md text-sm cursor-pointer">Alege</button> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GetTeacherQuery } from '@/api/graphql'

defineProps<{ plans: GetTeacherQuery['teacher']['pricingPlans'] }>()
</script>
