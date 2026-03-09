<script setup lang="ts">
import Button from '../Button.vue';
const props = defineProps<{
    photo?: string,
    name: string,
    email?: string | null,
}>()
</script>

<template>
  <div class="flex flex-col group h-full bg-slate-900/50 p-8 rounded-xl border border-white/10 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 cursor-pointer items-center transition-all text-center">
    
    <div class="mb-4 w-20 h-20 rounded-full border border-white/20 bg-slate-800 flex justify-center items-center group-hover:bg-emerald-500/20 group-hover:border-emerald-500/50 transition-colors">
      <img v-if="photo" :src="photo" :alt="name" class="rounded-full object-cover">
      <span v-else class="text-2xl font-bold text-white/80">
        {{ name.split(' ').map(n => n[0]).join('').toUpperCase() }}
      </span>
    </div>

    <div class="grow flex flex-col gap-1 mb-6">
      <h3 class="font-semibold text-white text-lg">{{ name }}</h3>
      <p v-if="email" class="text-sm text-slate-400">{{ email }}</p>
    </div>

    <div class="w-full">
        <Button>folosește profil</Button>
    </div>
  </div>
</template>