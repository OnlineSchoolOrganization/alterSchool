<script setup lang="ts">
type MenuItem = {
  key: string
  label: string
}

const props = defineProps<{
  items: readonly MenuItem[]
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

function selectSection(key: string) {
  emit('update:modelValue', key)
}
</script>

<template>
  <div>
    <div class="hidden md:flex gap-3 rounded-2xl border border-slate-800 bg-[color-mix(in_oklab,var(--color-slate-900)_45%,transparent)] p-2">
      <button
        v-for="item in props.items"
        :key="item.key"
        type="button"
        class="flex-1 rounded-xl px-4 py-3 text-sm font-medium transition-colors"
        :class="item.key === props.modelValue ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800/70'"
        @click="selectSection(item.key)"
      >
        {{ item.label }}
      </button>
    </div>

    <div class="md:hidden fixed inset-x-0 bottom-0 z-30 border-t border-slate-800 bg-[color-mix(in_oklab,var(--color-slate-950)_90%,transparent)] px-3 py-3 backdrop-blur">
      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="item in props.items"
          :key="item.key"
          type="button"
          class="rounded-xl px-3 py-3 text-sm font-medium transition-colors"
          :class="item.key === props.modelValue ? 'bg-emerald-600 text-white' : 'bg-slate-900/80 text-slate-300 border border-slate-800'"
          @click="selectSection(item.key)"
        >
          {{ item.label }}
        </button>
      </div>
    </div>
  </div>
</template>
