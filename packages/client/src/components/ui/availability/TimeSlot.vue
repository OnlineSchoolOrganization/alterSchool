<script setup lang="ts">
    import Button from '../Button.vue';
    const props = defineProps({
    type: {
        type: String as () => 'default' | 'selected' | 'block',
        required: true,
    },
    loading: {
        type: Boolean,
        required: false,
        default: false,
    },
    })
</script>

<template>
    <div :class="[
        'border-l border-t border-slate-700/50 h-13 xl:w-30',
        props.type === 'default' && 'hover:bg-slate-800',
        props.type === 'selected' && 'bg-emerald-500 hover:bg-emerald-700'
    ]"
    >
        <Button type="button" variant="transparent">
            <slot />
        </Button>
    </div>
</template>