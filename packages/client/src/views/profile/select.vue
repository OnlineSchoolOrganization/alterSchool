<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  router.replace('/student/dashboard')
})
</script>

<template>
  <div class="flex min-h-dvh items-center justify-center px-3">
    <div class="rounded-2xl border border-slate-800 bg-[color-mix(in_oklab,var(--color-slate-900)_55%,transparent)] p-6 text-sm text-slate-300">
      Se redirecționează către dashboard-ul studentului...
    </div>
  </div>
</template>
