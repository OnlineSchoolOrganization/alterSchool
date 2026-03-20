<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import TimeSlots from '@/components/ui/availability/TimeSlots.vue'
import Button from '@/components/ui/Button.vue'
import ErrorMessage from '@/components/ui/ErrorMessage.vue'
import type { DayOfWeek } from '@/api/graphql'

type AvailabilitySlot = {
  dayOfWeek: DayOfWeek
  startTime: number
  duration: number
}

type TeacherView = {
  id: string
  students?: { id: string }[] | null
  profile?: {
    id: string
    username: string
    firstName?: string | null
    lastName?: string | null
    availabilitySlots?: AvailabilitySlot[] | null
  } | null
}

type StudentProfileView = {
  id: string
  username: string
  firstName?: string | null
  lastName?: string | null
  deleted: boolean
  roleProfile?: {
    __typename: string
    id?: string
    teachers?: { id: string }[] | null
  } | null
}

type TeacherPageResult = {
  teachers: TeacherView[]
  me: {
    id: string
    profiles?: StudentProfileView[] | null
  }
}

const TeacherPageDocument = gql`
  query TeacherProfilePage {
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
          dayOfWeek
          startTime
          duration
        }
      }
    }
    me {
      id
      profiles {
        id
        username
        firstName
        lastName
        deleted
        roleProfile {
          __typename
          ... on Student {
            id
            teachers {
              id
            }
          }
        }
      }
    }
  }
`

const TeacherStudentAddDocument = gql`
  mutation TeacherStudentAdd($teacherId: ID!, $studentProfileId: ID!) {
    teacherStudentAdd(teacherId: $teacherId, studentProfileId: $studentProfileId) {
      id
      students {
        id
      }
    }
  }
`

const route = useRoute()
const selectedProfileId = ref(typeof window === 'undefined' ? '' : localStorage.getItem('profileId') ?? '')
const mutationError = ref('')
const successMessage = ref('')

const { result, loading, error } = useQuery<TeacherPageResult>(TeacherPageDocument)

const teachers = computed(() => result.value?.teachers ?? [])
const teacherId = computed(() => {
  const queryId = route.query.teacherId
  return typeof queryId === 'string' && queryId.length > 0 ? queryId : teachers.value[0]?.id
})

const teacher = computed(() => teachers.value.find(item => item.id === teacherId.value) ?? null)
const studentProfiles = computed(() =>
  (result.value?.me.profiles ?? []).filter(
    profile => profile.deleted === false && profile.roleProfile?.__typename === 'Student',
  ),
)

const activeStudentProfile = computed(() => {
  const selected = studentProfiles.value.find(profile => profile.id === selectedProfileId.value)
  return selected ?? studentProfiles.value[0] ?? null
})

const isConnected = computed(() => {
  if (teacher.value == null || activeStudentProfile.value == null) return false
  const teacherIds = activeStudentProfile.value.roleProfile?.teachers?.map(item => item.id) ?? []
  return teacherIds.includes(teacher.value.id)
})

const teacherName = computed(() => {
  if (teacher.value?.profile == null) return 'Profesor'
  const firstName = teacher.value.profile.firstName?.trim()
  const lastName = teacher.value.profile.lastName?.trim()
  return [firstName, lastName].filter(Boolean).join(' ').trim() || teacher.value.profile.username
})

const teacherInitials = computed(() =>
  teacherName.value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('') || '--',
)

const studentProfileName = computed(() => {
  const profile = activeStudentProfile.value
  if (profile == null) return 'Nu există profil student'
  const firstName = profile.firstName?.trim()
  const lastName = profile.lastName?.trim()
  return [firstName, lastName].filter(Boolean).join(' ').trim() || profile.username
})

const { mutate, loading: connecting } = useMutation(TeacherStudentAddDocument, () => ({
  refetchQueries: [{ query: TeacherPageDocument }],
}))

async function connectTeacher() {
  if (teacher.value == null || activeStudentProfile.value == null) return

  mutationError.value = ''
  successMessage.value = ''

  try {
    await mutate({
      teacherId: teacher.value.id,
      studentProfileId: activeStudentProfile.value.id,
    })
    successMessage.value = 'Legătura dintre student și profesor a fost creată.'
  } catch (err: any) {
    mutationError.value = err.message ?? 'Nu am putut crea legătura.'
  }
}
</script>

<template>
  <div class="flex justify-center w-full px-3 py-10 lg:py-14">
    <div class="w-full max-w-7xl flex flex-col gap-8">
      <div v-if="loading" class="h-[32rem] rounded-2xl border border-slate-800 bg-slate-900/40 animate-pulse"></div>

      <ErrorMessage v-else-if="error">{{ error.message }}</ErrorMessage>

      <section
        v-else-if="teacher == null"
        class="rounded-2xl border border-slate-800 bg-[color-mix(in_oklab,var(--color-slate-900)_45%,transparent)] p-8 text-center text-slate-300"
      >
        Profesorul selectat nu există.
      </section>

      <template v-else>
        <section class="rounded-2xl border border-slate-800 bg-[color-mix(in_oklab,var(--color-slate-900)_55%,transparent)] p-6 md:p-8 lg:p-10">
          <div class="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div class="flex items-start gap-5">
              <div class="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.5rem] border border-slate-700 bg-slate-800/80 text-2xl font-semibold text-emerald-300">
                {{ teacherInitials }}
              </div>

              <div class="space-y-4">
                <div class="space-y-2">
                  <div class="flex flex-wrap gap-2">
                    <span class="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-emerald-300">
                      Profil profesor
                    </span>
                    <span class="rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-300">
                      {{ (teacher.students ?? []).length }} elevi conectați
                    </span>
                  </div>
                  <h1 class="text-3xl font-medium text-zinc-100 md:text-4xl">{{ teacherName }}</h1>
                  <p class="max-w-2xl text-sm leading-6 text-slate-400 md:text-base">
                    Profil public al profesorului. Poți vedea disponibilitatea lui și poți conecta profilul studentului activ direct din această pagină.
                  </p>
                </div>

                <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div class="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                    <div class="text-[11px] uppercase tracking-[0.22em] text-slate-500">Elevi actuali</div>
                    <div class="mt-2 text-2xl font-semibold text-zinc-100">{{ (teacher.students ?? []).length }}</div>
                  </div>
                  <div class="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                    <div class="text-[11px] uppercase tracking-[0.22em] text-slate-500">Availability</div>
                    <div class="mt-2 text-2xl font-semibold text-zinc-100">{{ (teacher.profile?.availabilitySlots ?? []).length }}</div>
                  </div>
                  <div class="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                    <div class="text-[11px] uppercase tracking-[0.22em] text-slate-500">Student activ</div>
                    <div class="mt-2 text-sm font-medium leading-6 text-zinc-100">{{ studentProfileName }}</div>
                  </div>
                </div>
              </div>
            </div>

            <router-link to="/teacher/list" class="shrink-0">
              <Button variant="secondary">Înapoi la listă</Button>
            </router-link>
          </div>
        </section>

        <div class="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.85fr]">
          <section class="rounded-2xl border border-slate-800 bg-[color-mix(in_oklab,var(--color-slate-900)_45%,transparent)] p-6 md:p-8">
            <div class="mb-6 flex flex-col gap-2 border-b border-slate-800 pb-5">
              <h2 class="text-2xl font-medium text-zinc-100">Program disponibil</h2>
              <p class="text-sm leading-6 text-slate-400">
                Intervalele afișate mai jos sunt cele din profilul real al profesorului și folosesc aceeași componentă de availability din restul aplicației.
              </p>
            </div>

            <TimeSlots :availabilitySlots="teacher.profile?.availabilitySlots" />
          </section>

          <section class="rounded-2xl border border-slate-800 bg-[color-mix(in_oklab,var(--color-slate-900)_45%,transparent)] p-6 md:p-8">
            <div class="space-y-5">
              <div class="space-y-2">
                <h2 class="text-2xl font-medium text-zinc-100">Conectare student-profesor</h2>
                <p class="text-sm leading-6 text-slate-400">
                  Creează legătura many-to-many dintre profesor și profilul tău de student selectat în aplicație.
                </p>
              </div>

              <div class="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                <div class="text-[11px] uppercase tracking-[0.22em] text-slate-500">Profil student selectat</div>
                <div class="mt-2 text-sm font-medium leading-6 text-zinc-100">{{ studentProfileName }}</div>
              </div>

              <div class="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                <div class="text-[11px] uppercase tracking-[0.22em] text-slate-500">Status</div>
                <div class="mt-2 text-sm leading-6 text-slate-300">
                  {{
                    activeStudentProfile == null
                      ? 'Nu există niciun profil de student pe care să-l poți conecta.'
                      : isConnected
                        ? 'Studentul selectat este deja conectat la acest profesor.'
                        : 'Profesorul poate fi conectat imediat la studentul activ.'
                  }}
                </div>
              </div>

              <ErrorMessage v-if="mutationError">{{ mutationError }}</ErrorMessage>

              <div
                v-if="successMessage"
                class="rounded-xl border border-emerald-500 bg-[color-mix(in_oklab,var(--color-emerald-500)_10%,transparent)] px-4 py-3 text-sm text-emerald-200"
              >
                {{ successMessage }}
              </div>

              <Button
                type="button"
                :variant="connecting || activeStudentProfile == null || isConnected ? 'block' : 'primary'"
                @click="connectTeacher"
              >
                {{
                  activeStudentProfile == null
                    ? 'Nu ai profil student'
                    : isConnected
                      ? 'Profesor deja conectat'
                      : connecting
                        ? 'Se conectează...'
                        : 'Conectează profesorul'
                }}
              </Button>
            </div>
          </section>
        </div>
      </template>
    </div>
  </div>
</template>
