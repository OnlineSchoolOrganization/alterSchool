<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from '../Button.vue'

const router = useRouter()
</script>

<template>
  <article
    class="flex h-full flex-col justify-between rounded-2xl border border-dashed border-slate-700 bg-[color-mix(in_oklab,var(--color-slate-900)_35%,transparent)] p-6 transition-colors hover:border-emerald-500/60 hover:bg-emerald-500/5"
  >
    <div>
      <div
        class="flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-slate-600 bg-slate-800/60 text-3xl text-emerald-300"
      >
        +
      </div>
      <h3 class="mt-5 text-lg font-medium text-zinc-100">Adaugă profil nou</h3>
      <p class="mt-2 text-sm leading-6 text-slate-400">
        Creează rapid un profil nou care poate fi selectat și folosit ulterior la înscrierea către profesori.
      </p>
    </div>

    <div class="mt-6">
      <Button variant="secondary" @click="router.push('/student/create')">Creează profil</Button>
    </div>
  </article>
</template>
