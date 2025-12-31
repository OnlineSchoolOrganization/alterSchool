<script setup lang="ts">
const menu = [
  { name: 'Teacher', link: '/teacher' },
  { name: 'Teacher', link: '/teacher' },
  { name: 'Teacher', link: '/teacher' },
  { name: 'Teacher', link: '/teacher' },
  { name: 'Teacher', link: '/teacher' },
]
</script>
<template>
  <div class="h-screen flex bg-gray-50 text-gray-800">
    <!-- Sidebar -->
    <nav class="w-60 shrink-0 h-full bg-gray-100 border-r overflow-y-auto overscroll-contain">
      <div class="p-4 space-y-4">
        <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500">Dashboard SU</h2>

        <ul class="space-y-2">
          <li v-for="item in menu" :key="item.name">
            <a :href="'/dashboard/su' + item.link" class="block rounded px-3 py-2 hover:bg-gray-200">
              {{ item.name }}
            </a>
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
