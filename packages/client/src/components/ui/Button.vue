<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'transparent' | 'block' | 'secondary-green'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  class: '',
})
</script>

<template>
  <button
    :disabled="props.variant === 'block'"
    :class="[
      'w-full h-full flex justify-center items-center py-2 px-4 rounded-md text-sm cursor-pointer transition-colors',
      props.variant === 'primary' && 'bg-emerald-600 hover:bg-emerald-700 text-zinc-100',
      props.variant === 'secondary' &&
        'bg-[color-mix(in_oklab,var(--color-slate-800)_50%,transparent)] text-zinc-100 border-2 border-slate-700',
      props.variant === 'secondary-green' &&
        'bg-[color-mix(in_oklab,var(--color-emerald-500)_10%,transparent)] text-zinc-100 border-2 border-emerald-500',
      props.variant === 'transparent' && 'bg-transparent text-zinc-100',
      props.variant === 'block' && 'bg-emerald-400/50 text-emerald-200 cursor-not-allowed border border-emerald-400/50',
      props.class,
    ]"
  >
    <slot />
  </button>
</template>
