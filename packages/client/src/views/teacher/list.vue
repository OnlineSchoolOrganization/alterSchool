<script setup lang="ts">
import { computed, ref } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { useRouter } from 'vue-router'
import { GetBestTeachersDocument } from '@/api/graphql'

const profileId = ref(typeof window === 'undefined' ? '' : (localStorage.getItem('profileId') ?? ''))

const router = useRouter()

const { result, loading, error } = useQuery(GetBestTeachersDocument, { profileId: profileId.value })

const teachers = computed(() => result.value?.bestTeachersForStudent ?? [])

const goToTeacher = (id: string) => {
  router.push(`/teacher/${id}`)
}
</script>

<template>
  <div class="flex justify-center w-full">
    <div class="w-full max-w-6xl m-3 my-10 flex flex-col gap-10">
      <h1 class="text-3xl font-bold">Profesori Recomandați</h1>

      <div v-if="loading" class="text-center py-10">Loading...</div>
      <div v-else-if="error" class="text-center py-10 text-red-500">
        {{ error.message }}
      </div>

      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="teacherMatch in teachers"
          :key="teacherMatch.teacher.id"
          class="cursor-pointer bg-slate-800/50 border border-slate-700 rounded-xl p-6 flex flex-col gap-4 hover:border-emerald-500 hover:scale-[1.02] transition"
          @click="goToTeacher(teacherMatch.teacher.id)"
        >
          <!-- Avatar -->
          <div
            class="w-16 h-16 rounded-lg bg-slate-700 flex items-center justify-center text-xl text-emerald-400 font-bold"
          >
            {{ teacherMatch.teacher.profile?.firstName?.[0]?.toUpperCase() || 'N' }}
            {{ teacherMatch.teacher.profile?.lastName?.[0]?.toUpperCase() || 'N' }}
          </div>

          <!-- Info -->
          <div class="flex flex-col gap-1">
            <h3 class="text-lg font-semibold text-white">
              {{ teacherMatch.teacher.profile?.username }}
            </h3>

            <p class="text-sm text-zinc-300 line-clamp-2">
              {{ teacherMatch.teacher.bio || 'Fără descriere' }}
            </p>
          </div>

          <!-- Scor & motiv -->
          <div class="mt-2 p-2 bg-slate-700 rounded-md text-xs text-zinc-300">
            <p><strong>Scor total:</strong> {{ teacherMatch.score }}</p>
            <p><strong>Intersectii cu tine:</strong> {{ teacherMatch.overlapCount }}</p>
            <p><strong>Intersectii cu alti studenti:</strong> {{ teacherMatch.overlapWithStudents }}</p>
          </div>

          <!-- Pret -->
          <div class="mt-2 text-xl font-bold text-emerald-400">
            {{ teacherMatch.teacher.pricingPlans?.[0]?.amount ?? 0 }} LEI / ora
          </div>

          <!-- CTA -->
          <button
            class="mt-4 bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-md text-sm font-semibold text-white"
          >
            Vezi profil
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
