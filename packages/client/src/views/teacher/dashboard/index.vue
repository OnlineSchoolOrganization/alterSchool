<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import type { DayOfWeek } from '@/api/graphql'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import ErrorMessage from '@/components/ui/ErrorMessage.vue'
import TimeSlots from '@/components/ui/availability/TimeSlots.vue'

type AvailabilitySlot = {
  dayOfWeek: DayOfWeek
  startTime: number
  duration: number
}

type LinkedStudent = {
  id: string
  profile?: {
    id: string
    username: string
    firstName?: string | null
    lastName?: string | null
    availabilitySlots?: AvailabilitySlot[] | null
  } | null
}

type TeacherProfile = {
  id: string
  username: string
  firstName?: string | null
  lastName?: string | null
  email?: string | null
  phoneNumber?: string | null
  deleted: boolean
  roleProfile?: {
    __typename: string
    id?: string
    students?: LinkedStudent[] | null
  } | null
  availabilitySlots?: AvailabilitySlot[] | null
}

type TeacherDashboardResult = {
  me: {
    id: string
    profiles?: TeacherProfile[] | null
  }
}

type DashboardSection = 'overview' | 'profile' | 'group-maker' | 'group-builder'

type GroupSuggestion = {
  key: string
  dayOfWeek: DayOfWeek
  startTime: number
  duration: number
  students: LinkedStudent[]
}

type GroupDraftSession = {
  key: string
  dayOfWeek: DayOfWeek
  startTime: number
  duration: number
}

const TeacherDashboardDocument = gql`
  query TeacherDashboardData {
    me {
      id
      profiles {
        id
        username
        firstName
        lastName
        email
        phoneNumber
        deleted
        roleProfile {
          __typename
          ... on Teacher {
            id
            students {
              id
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
          }
        }
        availabilitySlots {
          id
          dayOfWeek
          startTime
          duration
        }
      }
    }
  }
`

const ProfileUpdateDocument = gql`
  mutation ProfileUpdate(
    $profileId: ID!
    $firstName: String
    $lastName: String
    $email: String
    $phoneNumber: String
    $availabilitySlots: [IAvailabilitySlot!]!
  ) {
    profileUpdate(
      profileId: $profileId
      firstName: $firstName
      lastName: $lastName
      email: $email
      phoneNumber: $phoneNumber
      availabilitySlots: $availabilitySlots
    ) {
      id
      username
      firstName
      lastName
      email
      phoneNumber
      availabilitySlots {
        id
        dayOfWeek
        startTime
        duration
      }
    }
  }
`

const dayLabels: Record<DayOfWeek, string> = {
  MONDAY: 'Luni',
  TUESDAY: 'Marți',
  WEDNESDAY: 'Miercuri',
  THURSDAY: 'Joi',
  FRIDAY: 'Vineri',
  SATURDAY: 'Sâmbătă',
  SUNDAY: 'Duminică',
}

const navigation = [
  { key: 'overview', label: 'Overview', description: 'Rezumat rapid' },
  { key: 'profile', label: 'Profil profesor', description: 'Date și contacte' },
  { key: 'group-maker', label: 'Group maker', description: 'Overlap profesori-elevi' },
  { key: 'group-builder', label: 'Group builder', description: 'Sesiuni pe săptămână' },
] as const

const activeSection = ref<DashboardSection>('overview')
const feedback = ref('')
const error = ref('')
const groupDraftSessions = ref<GroupDraftSession[]>([])

const form = ref<{
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  availabilitySlots: AvailabilitySlot[]
}>({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  availabilitySlots: [],
})

const { result, loading: loadingProfile, error: queryError } = useQuery<TeacherDashboardResult>(TeacherDashboardDocument)
const teacherProfile = computed<TeacherProfile | null>(() => {
  const profiles = result.value?.me.profiles ?? []
  return profiles.find(profile => profile.deleted === false && profile.roleProfile?.__typename === 'Teacher') ?? null
})

const linkedStudents = computed(() => teacherProfile.value?.roleProfile?.students ?? [])
const studentsWithAvailability = computed(() =>
  linkedStudents.value.filter(student => (student.profile?.availabilitySlots ?? []).length > 0),
)

const groupSuggestions = computed<GroupSuggestion[]>(() => {
  const teacherSlots = teacherProfile.value?.availabilitySlots ?? []
  if (teacherSlots.length === 0) return []

  return teacherSlots
    .map(slot => {
      const students = linkedStudents.value.filter(student => {
        const studentSlots = student.profile?.availabilitySlots ?? []
        return studentSlots.some(
          studentSlot =>
            studentSlot.dayOfWeek === slot.dayOfWeek &&
            studentSlot.startTime === slot.startTime &&
            studentSlot.duration === slot.duration,
        )
      })

      return {
        key: `${slot.dayOfWeek}-${slot.startTime}-${slot.duration}`,
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        duration: slot.duration,
        students,
      }
    })
    .filter(suggestion => suggestion.students.length > 0)
    .sort((left, right) => {
      if (right.students.length !== left.students.length) {
        return right.students.length - left.students.length
      }
      if (left.dayOfWeek !== right.dayOfWeek) {
        return left.dayOfWeek.localeCompare(right.dayOfWeek)
      }
      return left.startTime - right.startTime
    })
})

const totalMatchedStudents = computed(() => {
  const uniqueIds = new Set<string>()
  for (const suggestion of groupSuggestions.value) {
    for (const student of suggestion.students) {
      uniqueIds.add(student.id)
    }
  }
  return uniqueIds.size
})

watch(
  teacherProfile,
  profile => {
    if (profile == null) return
    form.value = {
      firstName: profile.firstName ?? '',
      lastName: profile.lastName ?? '',
      email: profile.email ?? '',
      phoneNumber: profile.phoneNumber ?? '',
      availabilitySlots:
        profile.availabilitySlots?.map(slot => ({
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          duration: slot.duration,
        })) ?? [],
    }
  },
  { immediate: true },
)

const { mutate, loading: saving } = useMutation(ProfileUpdateDocument, () => ({
  refetchQueries: [{ query: TeacherDashboardDocument }],
}))

function toggleSlot(dayOfWeek: DayOfWeek, startTime: number) {
  const index = form.value.availabilitySlots.findIndex(
    slot => slot.dayOfWeek === dayOfWeek && slot.startTime === startTime,
  )

  if (index === -1) {
    form.value.availabilitySlots.push({
      dayOfWeek,
      startTime,
      duration: 60,
    })
    return
  }

  form.value.availabilitySlots.splice(index, 1)
}

function studentName(student: LinkedStudent) {
  const firstName = student.profile?.firstName?.trim()
  const lastName = student.profile?.lastName?.trim()
  const fullName = [firstName, lastName].filter(Boolean).join(' ').trim()
  return fullName || student.profile?.username || 'Student fără nume'
}

function formatTime(startTime: number, duration = 60) {
  const startHour = Math.floor(startTime / 60)
  const startMinute = startTime % 60
  const endMinutes = startTime + duration
  const endHour = Math.floor(endMinutes / 60)
  const endMinute = endMinutes % 60
  const toLabel = (hour: number, minute: number) => `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
  return `${toLabel(startHour, startMinute)} - ${toLabel(endHour, endMinute)}`
}

function addDraftSession(suggestion: GroupSuggestion) {
  const exists = groupDraftSessions.value.some(session => session.key === suggestion.key)
  if (exists) return

  groupDraftSessions.value.push({
    key: suggestion.key,
    dayOfWeek: suggestion.dayOfWeek,
    startTime: suggestion.startTime,
    duration: suggestion.duration,
  })
}

function removeDraftSession(key: string) {
  groupDraftSessions.value = groupDraftSessions.value.filter(session => session.key !== key)
}

async function submit() {
  if (teacherProfile.value == null) return

  error.value = ''
  feedback.value = ''

  try {
    await mutate({
      profileId: teacherProfile.value.id,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email || null,
      phoneNumber: form.value.phoneNumber || null,
      availabilitySlots: form.value.availabilitySlots,
    })
    feedback.value = 'Profilul de profesor a fost actualizat.'
  } catch (err: any) {
    error.value = err.message ?? 'Nu am putut actualiza profilul.'
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0b] text-zinc-300 font-sans">
    <div class="p-4 md:p-10 w-full flex flex-col gap-6 md:gap-10">
      <div v-if="loadingProfile" class="h-96 rounded-xl border border-zinc-800/50 bg-[#111113] animate-pulse"></div>

      <ErrorMessage v-else-if="queryError">{{ queryError.message }}</ErrorMessage>

      <section v-else-if="teacherProfile == null" class="rounded-xl border border-zinc-800/50 bg-[#111113] p-8 text-zinc-400">
        Nu există un profil de teacher activ pe contul autentificat.
      </section>

      <div v-else class="grid grid-cols-1 xl:grid-cols-[260px_1fr] gap-6 items-start">
        <aside class="rounded-xl border border-zinc-800/50 bg-[#111113] overflow-hidden">
          <div class="p-6 border-b border-zinc-800/40 flex flex-col gap-2">
            <span class="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">Teacher dashboard</span>
            <h1 class="text-2xl font-semibold tracking-tight text-zinc-100">
              {{ [teacherProfile.firstName, teacherProfile.lastName].filter(Boolean).join(' ').trim() || teacherProfile.username }}
            </h1>
          </div>

          <nav class="p-3 flex flex-col gap-2">
            <button
              v-for="item in navigation"
              :key="item.key"
              type="button"
              @click="activeSection = item.key"
              class="text-left rounded-lg border px-4 py-3 transition-colors"
              :class="activeSection === item.key ? 'border-[#c5a47e]/40 bg-[#c5a47e]/10 text-[#c5a47e]' : 'border-zinc-800 bg-black/10 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/40'"
            >
              <div class="text-sm font-semibold">{{ item.label }}</div>
              <div class="mt-1 text-xs text-zinc-500">{{ item.description }}</div>
            </button>
          </nav>
        </aside>

        <div class="flex flex-col gap-6">
          <section class="grid gap-4 md:grid-cols-4">
            <div class="rounded-xl border border-zinc-800/50 bg-[#111113] p-5">
              <div class="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Elevi legați</div>
              <div class="mt-2 text-2xl font-semibold text-zinc-100">{{ linkedStudents.length }}</div>
            </div>
            <div class="rounded-xl border border-zinc-800/50 bg-[#111113] p-5">
              <div class="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Elevi cu overlap</div>
              <div class="mt-2 text-2xl font-semibold text-zinc-100">{{ totalMatchedStudents }}</div>
            </div>
            <div class="rounded-xl border border-zinc-800/50 bg-[#111113] p-5">
              <div class="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Sloturi grupă</div>
              <div class="mt-2 text-2xl font-semibold text-zinc-100">{{ groupSuggestions.length }}</div>
            </div>
            <div class="rounded-xl border border-zinc-800/50 bg-[#111113] p-5">
              <div class="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Ore pe săptămână draft</div>
              <div class="mt-2 text-2xl font-semibold text-zinc-100">{{ groupDraftSessions.length }}</div>
            </div>
          </section>

          <section v-if="activeSection === 'overview'" class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div class="rounded-xl border border-zinc-800/50 bg-[#111113] p-6 flex flex-col gap-4">
              <h2 class="text-2xl font-semibold tracking-tight text-zinc-100">Overview</h2>
              <p class="text-sm text-zinc-500">
                Dashboard-ul e pregătit pentru mai multe module. În momentul de față poți administra profilul, vedea overlap-ul cu elevii și construi un draft de grupă cu un număr flexibil de sesiuni pe săptămână.
              </p>
              <div class="rounded-lg border border-zinc-800 bg-black/20 p-4 text-sm text-zinc-300">
                Modelul actual pentru grupe poate susține un număr nedefinit de ore pe săptămână printr-o listă de sesiuni separate. În UI, acest lucru este reprezentat prin `groupDraftSessions`.
              </div>
            </div>

            <div class="rounded-xl border border-zinc-800/50 bg-[#111113] p-6 flex flex-col gap-4">
              <h2 class="text-2xl font-semibold tracking-tight text-zinc-100">Draft curent</h2>
              <div v-if="groupDraftSessions.length === 0" class="rounded-lg border border-zinc-800 bg-black/20 p-4 text-sm text-zinc-400">
                Nu ai adăugat încă sesiuni în draftul grupei.
              </div>
              <div v-else class="flex flex-col gap-3">
                <div v-for="session in groupDraftSessions" :key="session.key" class="rounded-lg border border-zinc-800 bg-black/20 p-4 flex items-center justify-between gap-4">
                  <div>
                    <div class="font-medium text-zinc-100">{{ dayLabels[session.dayOfWeek] }}</div>
                    <div class="text-sm text-zinc-500">{{ formatTime(session.startTime, session.duration) }}</div>
                  </div>
                  <Button type="button" variant="secondary" @click="removeDraftSession(session.key)">Scoate</Button>
                </div>
              </div>
            </div>
          </section>

          <form v-else-if="activeSection === 'profile'" @submit.prevent="submit" class="rounded-xl border border-zinc-800/50 bg-[#111113] p-6 md:p-8 flex flex-col gap-6">
            <div>
              <h2 class="text-2xl font-semibold tracking-tight text-zinc-100">Profil profesor</h2>
              <p class="mt-2 text-sm text-zinc-500">Interfața păstrează componentele și stilul folosite în restul aplicației.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input v-model="form.firstName" id="teacher-first-name" label="Prenume" placeholder="Scrie prenumele" autocomplete="given-name" />
              <Input v-model="form.lastName" id="teacher-last-name" label="Nume" placeholder="Scrie numele" autocomplete="family-name" />
              <Input v-model="form.email" id="teacher-email" type="email" label="Email" placeholder="Scrie email-ul" autocomplete="email" />
              <Input v-model="form.phoneNumber" id="teacher-phone-number" type="tel" label="Numărul de telefon" placeholder="Scrie numărul de telefon" autocomplete="tel" />
            </div>

            <div class="flex flex-col gap-4">
              <div>
                <h3 class="text-lg font-semibold text-zinc-100">Availability</h3>
                <p class="mt-1 text-sm text-zinc-500">Acesta este programul profesorului folosit și în group maker.</p>
              </div>
              <TimeSlots :availabilitySlots="form.availabilitySlots" :loading="saving" @toggle="toggleSlot" />
            </div>

            <ErrorMessage v-if="error">{{ error }}</ErrorMessage>
            <div
              v-if="feedback"
              class="rounded-md border border-emerald-500 bg-[color-mix(in_oklab,var(--color-emerald-500)_10%,transparent)] px-3 py-2 text-sm text-emerald-200"
            >
              {{ feedback }}
            </div>

            <div class="flex justify-end">
              <div class="w-full md:w-auto">
                <Button type="submit" :variant="saving ? 'block' : 'primary'">
                  {{ saving ? 'Se salvează...' : 'Salvează profilul' }}
                </Button>
              </div>
            </div>
          </form>

          <section v-else-if="activeSection === 'group-maker'" class="rounded-xl border border-zinc-800/50 bg-[#111113] p-6 md:p-8 flex flex-col gap-6">
            <div>
              <h2 class="text-2xl font-semibold tracking-tight text-zinc-100">Group maker</h2>
              <p class="mt-2 text-sm text-zinc-500">
                Calculul se bazează pe intersecția exactă dintre availability-ul profesorului și availability-ul elevilor deja conectați.
              </p>
            </div>

            <div v-if="groupSuggestions.length === 0" class="rounded-lg border border-zinc-800 bg-black/20 p-4 text-sm text-zinc-400">
              Nu există încă sloturi comune între profesor și elevii lui.
            </div>

            <div v-else class="grid gap-4 xl:grid-cols-2">
              <article v-for="suggestion in groupSuggestions" :key="suggestion.key" class="rounded-lg border border-zinc-800 bg-black/20 p-5 flex flex-col gap-4">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <h3 class="text-lg font-semibold text-zinc-100">{{ dayLabels[suggestion.dayOfWeek] }}</h3>
                    <p class="mt-1 text-sm text-zinc-500">{{ formatTime(suggestion.startTime, suggestion.duration) }}</p>
                  </div>
                  <div class="rounded-md border border-zinc-700 bg-zinc-900/60 px-3 py-1 text-xs uppercase tracking-widest text-zinc-300">
                    {{ suggestion.students.length }} copii
                  </div>
                </div>

                <div class="flex flex-wrap gap-2">
                  <span v-for="student in suggestion.students" :key="student.id" class="rounded-md border border-zinc-700 bg-zinc-900/60 px-2 py-1 text-xs text-zinc-200">
                    {{ studentName(student) }}
                  </span>
                </div>

                <div class="flex justify-end">
                  <Button type="button" variant="secondary" @click="addDraftSession(suggestion)">Adaugă în draft</Button>
                </div>
              </article>
            </div>

            <div class="rounded-lg border border-zinc-800 bg-black/20 p-4 text-sm text-zinc-400">
              Elevi analizați cu availability completat: {{ studentsWithAvailability.length }} din {{ linkedStudents.length }}.
            </div>
          </section>

          <section v-else class="rounded-xl border border-zinc-800/50 bg-[#111113] p-6 md:p-8 flex flex-col gap-6">
            <div>
              <h2 class="text-2xl font-semibold tracking-tight text-zinc-100">Group builder</h2>
              <p class="mt-2 text-sm text-zinc-500">
                Aici pregătim structura unei grupe care poate avea 2, 3, 4 sau mai multe sesiuni pe săptămână. Fiecare sesiune este separată în draft și poate fi adăugată sau scoasă individual.
              </p>
            </div>

            <div class="grid gap-4 md:grid-cols-3">
              <div class="rounded-lg border border-zinc-800 bg-black/20 p-4">
                <div class="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Sesiuni selectate</div>
                <div class="mt-2 text-2xl font-semibold text-zinc-100">{{ groupDraftSessions.length }}</div>
              </div>
              <div class="rounded-lg border border-zinc-800 bg-black/20 p-4">
                <div class="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Ore totale / săptămână</div>
                <div class="mt-2 text-2xl font-semibold text-zinc-100">{{ groupDraftSessions.length }}</div>
              </div>
              <div class="rounded-lg border border-zinc-800 bg-black/20 p-4">
                <div class="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Tip suportat</div>
                <div class="mt-2 text-sm font-semibold text-zinc-100">Număr flexibil de sesiuni</div>
              </div>
            </div>

            <div v-if="groupDraftSessions.length === 0" class="rounded-lg border border-zinc-800 bg-black/20 p-4 text-sm text-zinc-400">
              Mergi în `Group maker` și adaugă sloturi în draft ca să construiești o grupă cu oricâte sesiuni săptămânale ai nevoie.
            </div>

            <div v-else class="flex flex-col gap-3">
              <div v-for="session in groupDraftSessions" :key="session.key" class="rounded-lg border border-zinc-800 bg-black/20 p-4 flex items-center justify-between gap-4">
                <div>
                  <div class="font-medium text-zinc-100">{{ dayLabels[session.dayOfWeek] }}</div>
                  <div class="text-sm text-zinc-500">{{ formatTime(session.startTime, session.duration) }}</div>
                </div>
                <Button type="button" variant="secondary" @click="removeDraftSession(session.key)">Elimină</Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>
