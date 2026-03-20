<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const target = computed(() => ({ path: '/student/create', query: route.query }))

onMounted(() => {
  router.replace(target.value)
})
</script>

<template>
  <div class="flex min-h-dvh items-center justify-center px-3">
    <div class="rounded-2xl border border-slate-800 bg-[color-mix(in_oklab,var(--color-slate-900)_55%,transparent)] p-6 text-sm text-slate-300">
      Se redirecționează către creare profil student...
    </div>
  </div>
</template>
