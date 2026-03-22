<script setup lang="ts">
import { RouterView } from 'vue-router'
import TopMenu from '@/components/ui/topmenu/TopMenu.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen bg-slate-950 text-white">
    <TopMenu />

    <main class="flex flex-1 p-4">
      <RouterView />
    </main>
  </div>
</template>
