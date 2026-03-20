<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import Button from '@/components/ui/Button.vue'
import ErrorMessage from '@/components/ui/ErrorMessage.vue'

const TeachersListDocument = gql`
  query TeachersListPage {
    teachers {
      id
      students {
        id
      }
      profile {
        id
        username
        firstName
        lastName
        availabilitySlots {
          id
        }
      }
    }
  }
`

type TeacherCard = {
  id: string
  students?: { id: string }[] | null
  profile?: {
    id: string
    username: string
    firstName?: string | null
    lastName?: string | null
    availabilitySlots?: { id: string }[] | null
  } | null
}

type TeachersListResult = {
  teachers: TeacherCard[]
}

const { result, loading, error } = useQuery<TeachersListResult>(TeachersListDocument)
const teachers = computed(() => result.value?.teachers ?? [])

function teacherName(teacher: TeacherCard) {
  const firstName = teacher.profile?.firstName?.trim()
  const lastName = teacher.profile?.lastName?.trim()
  const fullName = [firstName, lastName].filter(Boolean).join(' ').trim()
  return fullName || teacher.profile?.username || 'Profesor fără nume'
}

function teacherInitials(teacher: TeacherCard) {
  const name = teacherName(teacher)
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('')
}
</script>

<template>
  <div class="flex justify-center w-full px-3 py-10 lg:py-14">
    <div class="w-full max-w-7xl flex flex-col gap-8">
      <section class="rounded-2xl border border-slate-800 bg-[color-mix(in_oklab,var(--color-slate-900)_55%,transparent)] p-6 md:p-8 lg:p-10">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div class="max-w-3xl space-y-3">
            <span class="inline-flex w-max rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium tracking-wide text-emerald-300">
              Profesori disponibili
            </span>
            <div class="space-y-2">
              <h1 class="text-3xl font-medium text-zinc-100 md:text-4xl">Găsește profesorul potrivit</h1>
              <p class="max-w-2xl text-sm leading-6 text-slate-400 md:text-base">
                Lista folosește doar profesorii existenți în platformă. Poți vedea rapid câți elevi are fiecare și câte intervale de disponibilitate sunt deja setate.
              </p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3 sm:min-w-72">
            <div class="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <div class="text-[11px] uppercase tracking-[0.22em] text-slate-500">Total</div>
              <div class="mt-2 text-2xl font-semibold text-zinc-100">{{ teachers.length }}</div>
              <div class="mt-1 text-xs text-slate-400">profesori listați</div>
            </div>
            <div class="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <div class="text-[11px] uppercase tracking-[0.22em] text-slate-500">Proof of concept</div>
              <div class="mt-2 text-sm font-medium text-zinc-100">Date reale</div>
              <div class="mt-1 text-xs text-slate-400">fără câmpuri inventate</div>
            </div>
          </div>
        </div>
      </section>

      <div v-if="loading" class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <div v-for="card in 6" :key="card" class="h-72 rounded-2xl border border-slate-800 bg-slate-900/40 animate-pulse"></div>
      </div>

      <ErrorMessage v-else-if="error">{{ error.message }}</ErrorMessage>

      <section
        v-else-if="teachers.length === 0"
        class="rounded-2xl border border-slate-800 bg-[color-mix(in_oklab,var(--color-slate-900)_45%,transparent)] p-8 text-center text-slate-300"
      >
        Nu există profesori încă.
      </section>

      <section v-else class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="teacher in teachers"
          :key="teacher.id"
          class="group flex h-full flex-col rounded-2xl border border-slate-800 bg-[color-mix(in_oklab,var(--color-slate-900)_45%,transparent)] p-6 transition-colors hover:border-slate-700"
        >
          <div class="flex items-start gap-4">
            <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800/80 text-lg font-semibold text-emerald-300">
              {{ teacherInitials(teacher) }}
            </div>

            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap gap-2">
                <span class="rounded-full border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-slate-300">
                  Profesor
                </span>
                <span class="rounded-full border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-slate-300">
                  {{ (teacher.profile?.availabilitySlots ?? []).length }} sloturi
                </span>
              </div>
              <h2 class="mt-4 text-xl font-medium text-zinc-100">{{ teacherName(teacher) }}</h2>
              <p class="mt-1 text-sm text-slate-400">Profil public disponibil pentru conectare.</p>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-3">
            <div class="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <div class="text-[11px] uppercase tracking-[0.22em] text-slate-500">Elevi</div>
              <div class="mt-2 text-2xl font-semibold text-zinc-100">{{ (teacher.students ?? []).length }}</div>
            </div>
            <div class="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <div class="text-[11px] uppercase tracking-[0.22em] text-slate-500">Availability</div>
              <div class="mt-2 text-2xl font-semibold text-zinc-100">{{ (teacher.profile?.availabilitySlots ?? []).length }}</div>
            </div>
          </div>

          <div class="mt-6 flex items-center justify-between gap-3 border-t border-slate-800 pt-5">
            <p class="text-sm text-slate-400">Vezi profilul și conectează studentul tău.</p>
            <router-link :to="{ path: '/teacher', query: { teacherId: teacher.id } }" class="shrink-0">
              <Button class="px-5">Vezi profilul</Button>
            </router-link>
          </div>
        </article>
      </section>
    </div>
  </div>
</template>
