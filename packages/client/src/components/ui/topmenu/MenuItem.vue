<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

interface Props {
  label: string
  to: string
  show?: boolean
  icon?: string
}

const props = defineProps<Props>()
const router = useRouter()
const route = useRoute()

const isActive = computed(() => route.path.startsWith(props.to))

const navigate = () => router.push(props.to)
</script>

<template>
  <button
    v-if="show"
    @click="navigate"
    class="flex flex-col items-center text-xs md:text-sm px-2 py-1 hover:bg-slate-700 rounded transition-colors cursor-pointer"
    :class="{ 'font-semibold border-b-2 border-b-text-white': isActive }"
  >
    <span v-if="icon" class="text-lg">{{ icon }}</span>
    <span>{{ label }}</span>
  </button>
</template>