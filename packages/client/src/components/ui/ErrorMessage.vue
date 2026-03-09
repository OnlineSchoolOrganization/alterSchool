<script setup lang="ts">
interface Props {
  variant?: "primary",
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
})
</script>

<template>
    <div className="flex items-center gap-2 p-3 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20">
        <span className="text-sm"><slot /></span>
    </div>
</template>