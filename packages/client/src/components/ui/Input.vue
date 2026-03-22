<script setup lang="ts">
interface Props {
  id: string
  label?: string | null
  modelValue?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

function updateValue(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div>
    <label v-if="props.label" :for="props.id" class="text-slate-300">
      {{ props.label }}
    </label>
    <input
      class="w-full bg-[color-mix(in_oklab,var(--color-slate-800)_50%,transparent)] py-1.5 px-3 rounded-md border border-slate-700 focus:outline-none text-sm mt-1 placeholder-muted-foreground focus:shadow-[0_0_10px_0_rgba(59,130,246,0.5)] text-white"
      :id="props.id"
      :value="modelValue"
      v-bind="$attrs"
      @input="updateValue"
    />
  </div>
</template>
