<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String as () => 'default' | 'primary' | 'selected',
    required: true,
  },
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
})

// Design System Type Mapping
const typeMap = {
  primary: 'bg-transparent text-zinc-500 font-medium border-transparent cursor-default',
  selected: 'bg-[#c5a47e] text-[#0a0a0b] font-semibold border-[#c5a47e]',
  default: 'bg-[#111113] text-zinc-100 border-white/5 hover:bg-white/[0.03] cursor-pointer'
};

const containerClasses = computed(() => [
  'flex items-center justify-center transition-all duration-200 border',
  'h-10 px-4 rounded-lg text-sm',
  props.loading ? 'animate-pulse bg-white/5 border-transparent' : typeMap[props.type]
]);
</script>

<template>
  <div :class="containerClasses">
    <span v-if="loading" class="sr-only">Loading...</span>
    <p v-else class="truncate">
      {{ text }}
    </p>
  </div>
</template>