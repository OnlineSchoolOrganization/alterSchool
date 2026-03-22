<script setup lang="ts">
import Button from '../Button.vue'

const props = withDefaults(
  defineProps<{
    photo?: string
    name: string
    email?: string | null
    subtitle?: string
    meta?: string
    active?: boolean
    actionLabel?: string
  }>(),
  {
    photo: undefined,
    email: undefined,
    subtitle: '',
    meta: '',
    active: false,
    actionLabel: 'Folosește profilul',
  },
)

const emit = defineEmits<{
  (e: 'select'): void
}>()

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('')
}
</script>

<template>
  <article
    class="flex h-full flex-col rounded-2xl border p-6 transition-colors"
    :class="
      props.active
        ? 'border-emerald-500 bg-emerald-500/5'
        : 'border-slate-800 bg-[color-mix(in_oklab,var(--color-slate-900)_45%,transparent)] hover:border-slate-700'
    "
  >
    <div class="flex items-start gap-4">
      <div
        class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border text-lg font-semibold"
        :class="
          props.active
            ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300'
            : 'border-slate-700 bg-slate-800/80 text-zinc-100'
        "
      >
        <img v-if="props.photo" :src="props.photo" :alt="props.name" class="h-full w-full rounded-2xl object-cover" />
        <span v-else>{{ initials(props.name) }}</span>
      </div>

      <div class="min-w-0 flex-1">
        <div v-if="props.meta" class="mb-2">
          <span
            class="rounded-full border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-slate-300"
          >
            {{ props.meta }}
          </span>
        </div>
        <h3 class="text-lg font-medium text-zinc-100">{{ props.name }}</h3>
        <p v-if="props.subtitle" class="mt-1 text-sm text-slate-400">{{ props.subtitle }}</p>
        <p v-else-if="props.email" class="mt-1 text-sm text-slate-400">{{ props.email }}</p>
      </div>
    </div>

    <div class="mt-6">
      <Button :variant="props.active ? 'secondary-green' : 'secondary'" @click="emit('select')">
        {{ props.active ? 'Profil activ' : props.actionLabel }}
      </Button>
    </div>
  </article>
</template>
