<script setup lang="ts">
  import { MeDocument } from '@/api/graphql'
  import { useQuery } from '@vue/apollo-composable'
  import { useMenu } from './menu';

  const { onResult, loading } = useQuery(MeDocument)
  const { initBaseMenu, initSuMenu, menu } = useMenu()

  onResult(data => {
    if(data.data?.me?.role?.includes("SUPER_USER")) initSuMenu()
  })

  initBaseMenu()
</script>
<template>
  <div class="h-screen flex bg-gray-50 text-gray-800">
    <!-- Sidebar -->
    <nav class="w-60 shrink-0 h-full bg-gray-100 border-r overflow-y-auto overscroll-contain">
      <div v-if="loading">loading</div>
      <div class="p-4 space-y-4" v-for="category in menu" :key="category.category">
        <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500" v-if="category.items.length">{{ category.category }}</h2>

        <ul class="space-y-2">
          <li v-for="item in category.items" :key="item.name">
            <router-link :to="item.link" class="block rounded px-3 py-2 hover:bg-gray-200">
              {{ item.name }}
            </router-link>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Main content -->
    <main class="flex-1 h-full overflow-y-auto overscroll-contain p-6">
      <slot />
    </main>
  </div>
</template>
