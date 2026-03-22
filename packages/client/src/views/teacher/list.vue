<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { useRouter } from 'vue-router'
import { GetTeachersDocument } from '@/api/graphql'

const router = useRouter()

const { result, loading } = useQuery(GetTeachersDocument)

const teachers = computed(() => result.value?.teachers ?? [])

const goToTeacher = (id: string) => {
  router.push(`/teacher/${id}`)
}
</script>

<template>
  <div class="flex justify-center w-full">
    <div class="w-full max-w-6xl m-3 my-10 flex flex-col gap-10">

      <h1 class="text-3xl font-bold">Profesori</h1>

      <div v-if="loading">Loading...</div>

      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="teacher in teachers"
          :key="teacher.id"
          @click="goToTeacher(teacher.id)"
          class="cursor-pointer bg-[color-mix(in_oklab,var(--color-slate-900)_50%,transparent)] 
                 border border-slate-800 rounded-xl p-6 flex flex-col gap-4
                 hover:border-emerald-500 hover:scale-[1.02] transition"
        >
          <!-- Avatar -->
          <div class="w-16 h-16 rounded-lg bg-slate-800 flex items-center justify-center text-xl text-emerald-400">
            {{ teacher.profile?.firstName?.[0]?.toUpperCase() || 'N' }}
            {{ teacher.profile?.lastName?.[0]?.toUpperCase() || 'N' }}
          </div>

          <!-- Info -->
          <div class="flex flex-col gap-1">
            <h3 class="text-lg font-semibold">
              {{ teacher.profile?.username }}
            </h3>

            <p class="text-sm text-zinc-400 line-clamp-2">
              {{ teacher.bio }}
            </p>
          </div>

          <!-- Stats -->
          <div class="flex gap-6 mt-2">
            <div>
              <span class="text-xs text-zinc-500 uppercase">
                {{ teacher.pricingPlans ? teacher.pricingPlans[0]?.amount : "0" }} LEI
              </span>
            </div>
          </div>

          <!-- CTA -->
          <button
            class="mt-4 bg-slate-700 hover:bg-emerald-600 px-4 py-2 rounded-md text-sm"
          >
            Vezi profil
          </button>
        </div>
      </div>
    </div>
  </div>
</template>