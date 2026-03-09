<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter()
</script>

<template>
    <div class="group flex flex-col gap-6 justify-center h-full bg-slate-900/50 p-8 rounded-xl border border-dashed border-white/20 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all cursor-pointer items-center text-center" @click="() => router.push('/profile/create')">
        <div class="w-20 h-20 rounded-full border border-dashed border-white/30 bg-slate-800/50 flex justify-center items-center group-hover:bg-emerald-500/20 group-hover:border-emerald-500/50 transition-colors">
            <span class="text-4xl text-white/30 group-hover:text-emerald-500">+</span>
        </div>

        <div class="flex flex-col gap-1">
            <h3 class="text-xl font-semibold text-white/60 group-hover:text-white transition-colors">Adaugă profil nou</h3>
            <p>Adaugă un nou copil pentru tine sau pentru copilul dumnreavoastră</p>
        </div>
  </div>
</template>