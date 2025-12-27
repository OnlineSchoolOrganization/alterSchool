<script setup lang="ts">
  const props = defineProps({
    text: {
      type: String,
      required: true
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
  });
</script>
<template>
  <div :class="['flex', (type === 'primary' && 'bg-blue-100' || type === 'selected' && 'bg-red-100' || type === 'default' && 'bg-green-100 cursor-pointer'), 'w-25 pt-1 pb-1 rounded-lg']">
    <p class="text-gray-700 text-center w-full">{{ loading ? "loading" : text }}</p>
  </div>
</template>