<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useMutation, useQuery } from '@vue/apollo-composable'
import {
  ProfileCreateDocument,
  UserRole,
  DayOfWeek,
  EducationType,
} from '@/api/graphql'
import { useRouter, useRoute } from 'vue-router'

import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import ErrorMessage from '@/components/ui/ErrorMessage.vue'
import TimeSlots from '@/components/ui/availability/TimeSlots.vue'
import { graphql } from '@/api'
import { GET_MY_PROFILES } from './query'

const router = useRouter()
const route = useRoute()

const type: 'student' | 'parent' =
  route.query.type === 'student' ? 'student' : 'parent'

/* ---------------- STATE ---------------- */
type AvailabilitySlot = {
  dayOfWeek: DayOfWeek
  startTime: number
  duration: number
}

const credentials = ref({
  email: undefined as string | undefined,
  phoneNumber: undefined as string | undefined,
  username: '',
  firstName: '',
  lastName: '',
  availabilitySlots: [] as AvailabilitySlot[],
})

const birthDate = ref<string>('')

const education = ref<{
  grade?: number
  educationType?: EducationType
}>({
  grade: undefined,
  educationType: EducationType.School,
})

const selectedCurriculums = ref<string[]>([])

const error = ref('')
const loadingUserCredentials = ref(false)

/* ---------------- STEPS ---------------- */
type TSteps = 'username' | 'contacts' | 'availability'
const steps: TSteps[] = ['username', 'contacts', 'availability']
const step = ref(0)
const currentStep = computed(() => steps[step.value])
const isFirstStep = computed(() => step.value === 0)
const isLastStep = computed(() => step.value === steps.length - 1)

function nextStep() {
  if (step.value < steps.length - 1) step.value += 1
}
function prevStep() {
  if (step.value > 0) step.value -= 1
}
function goToStep(name: TSteps) {
  const index = steps.indexOf(name)
  if (index !== -1) step.value = index
}

/* ---------------- USER AUTO FILL ---------------- */
function verifyType() {
  if (type === 'parent') return
  const USER_DOCUMENT = graphql(`
    query User {
      user {
        email
        phoneNumber
        username
        firstName
        lastName
      }
    }
  `)
  const { result, loading } = useQuery(USER_DOCUMENT)
  loadingUserCredentials.value = loading.value
  const user = computed(() => result.value?.user)
  watch(user, u => {
    if (!u) return
    credentials.value.email = u.email
    credentials.value.phoneNumber = u.phoneNumber
    credentials.value.username = u.username
    credentials.value.firstName = u.firstName ?? ''
    credentials.value.lastName = u.lastName ?? ''
    loadingUserCredentials.value = false
    goToStep('availability')
  })
}
verifyType()

/* ---------------- CURRICULUMS ---------------- */
const GET_CURRICULUMS = graphql(`
  query Curriculums {
    curriculums {
      id
      name
    }
  }
`)
const { result: curriculumResult } = useQuery(GET_CURRICULUMS)
const curriculums = computed(() => curriculumResult.value?.curriculums ?? [])

function toggleCurriculum(id: string) {
  const i = selectedCurriculums.value.indexOf(id)
  if (i === -1) selectedCurriculums.value.push(id)
  else selectedCurriculums.value.splice(i, 1)
}

/* ---------------- MUTATIONS ---------------- */
const { mutate, loading } = useMutation(ProfileCreateDocument)

const STUDENT_EDUCATION_UPDATE = graphql(`
  mutation UpdateStudentEducation(
    $profileId: ID!
    $data: IStudentEducationUpdate!
  ) {
    studentEducationUpdate(profileId: $profileId, data: $data) {
      id
    }
  }
`)

const PROFILE_CURRICULUMS_UPDATE = graphql(`
  mutation UpdateCurriculums(
    $profileId: ID!
    $curriculumIds: [ID!]!
  ) {
    profileCurriculumsUpdate(
      profileId: $profileId
      curriculumIds: $curriculumIds
    ) {
      id
    }
  }
`)

const { mutate: updateEducation } = useMutation(STUDENT_EDUCATION_UPDATE)
const { mutate: updateCurriculums } = useMutation(PROFILE_CURRICULUMS_UPDATE)

/* ---------------- CREATE PROFILE ---------------- */
const createProfile = async () => {
  try {
    const res = await mutate(
      {
        email: credentials.value.email,
        phoneNumber: credentials.value.phoneNumber,
        username: credentials.value.username,
        availabilitySlots: credentials.value.availabilitySlots,
        type: UserRole.User,
        birthDate: birthDate.value ? new Date(birthDate.value).toISOString() : null,
      },
      { refetchQueries: [{ query: GET_MY_PROFILES }] },
    )

    const profileId = res?.data?.profileCreate.id as string

    await updateEducation({
      profileId,
      data: {
        grade: education.value.grade,
        educationType: education.value.educationType,
      },
    })

    await updateCurriculums({
      profileId,
      curriculumIds: selectedCurriculums.value,
    })

    localStorage.setItem('profileId', profileId)
    router.push('/student/dashboard')
  } catch (err: any) {
    error.value = err.message ?? 'Registration error'
  }
}

/* ---------------- SLOTS ---------------- */
function toggleSlot(dayOfWeek: DayOfWeek, startTime: number) {
  const index = credentials.value.availabilitySlots.findIndex(
    s => s.dayOfWeek === dayOfWeek && s.startTime === startTime,
  )

  if (index === -1) {
    credentials.value.availabilitySlots.push({
      dayOfWeek,
      startTime,
      duration: 60,
    })
  } else {
    credentials.value.availabilitySlots.splice(index, 1)
  }
}
</script>

<template>
  <div class="flex justify-center w-full">
    <form
      @submit.prevent="createProfile"
      class="flex flex-col gap-10 w-6xl m-3 bg-[color-mix(in_oklab,var(--color-slate-900)_50%,transparent)] p-10 border-slate-800 border rounded-lg h-max my-15"
    >
      <div v-if="!loadingUserCredentials" class="flex flex-col gap-10">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl">Creaza profilul studentului</h1>
          <div class="bg-slate-700 py-1 px-5 rounded-md">Pasul {{ step + 1 }} din {{ steps.length }}</div>
        </div>
        <div class="w-full bg-slate-800 h-2 rounded-xl">
          <div
            :style="`width: ${Math.floor(100 / steps.length) * (step + 1)}%`"
            :class="`w-[${Math.floor(100 / steps.length) * (step + 1)}%] from-emerald-300 bg-linear-to-r to-emerald-600 h-full rounded-xl`"
          ></div>
        </div>

        <!-- USERNAME + BIRTHDATE -->
        <div v-if="currentStep === 'username'" class="max-w-md flex flex-col gap-3">
          <h1 class="text-2xl font-medium text-zing-100">Numele studentului</h1>
          <Input v-model="credentials.username" id="username" type="text" label="Username" required />
          <Input v-model="birthDate" id="birthDate" type="date" label="Data nașterii" required />
        </div>

        <!-- CONTACT + EDUCATION -->
        <div v-if="currentStep === 'contacts'" class="max-w-md flex flex-col gap-3">
          <h1 class="text-2xl font-medium text-zing-100">Contactele studentului (optional)</h1>
          <Input v-model="credentials.email" id="email" type="email" label="Email" />
          <Input v-model="credentials.phoneNumber" id="phone" type="tel" label="Telefon" />

          <div class="mt-4 flex flex-col gap-2">
            <h2 class="text-lg">Educație</h2>
            <Input
              :model-value="education.grade?.toString()"
              @update:model-value="val => (education.grade = Number(val))"
              id="grade"
              type="number"
              label="Clasa (opțional)"
            />
            <select v-model="education.educationType" class="p-2 bg-slate-800 rounded">
              <option :value="EducationType.School">Școală</option>
              <option :value="EducationType.University">Universitate</option>
              <option :value="EducationType.Other">Altul</option>
            </select>
          </div>
        </div>

        <!-- AVAILABILITY + CURRICULUM -->
        <div v-else-if="currentStep === 'availability'" class="flex flex-col items-center">
          <div class="w-full xl:w-auto">
            <h1 class="mb-6 text-2xl font-medium text-zing-100">Timpul liber al studentului</h1>
            <TimeSlots :availabilitySlots="credentials.availabilitySlots" @toggle="toggleSlot" :loading="loading" />

            <div class="mt-6">
              <h2 class="text-lg mb-3">Curriculum-uri dorite</h2>
              <div class="grid grid-cols-2 gap-2">
                <div
                  v-for="c in curriculums"
                  :key="c.id"
                  @click="toggleCurriculum(c.id)"
                  :class="[
                    'p-2 border rounded cursor-pointer',
                    selectedCurriculums.includes(c.id) ? 'border-emerald-500' : 'border-slate-700'
                  ]"
                >
                  {{ c.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>Loading</div>

      <div class="flex flex-col gap-5">
        <ErrorMessage v-if="error">{{ error }}</ErrorMessage>
        <div class="flex justify-between">
          <div>
            <Button @click="prevStep" type="button" variant="secondary" v-if="!isFirstStep" :disabled="isFirstStep">
              Înapoi
            </Button>
            <router-link
              class="w-full h-full flex justify-center items-center py-2 px-4 rounded-md text-sm cursor-pointer transition-colors bg-[color-mix(in_oklab,var(--color-slate-800)_50%,transparent)] text-zinc-100 border-2 border-slate-700"
              v-else
              to="/student/dashboard"
            >
              Acasă
            </router-link>
          </div>
          <div>
            <Button @click="nextStep" type="button" v-if="!isLastStep" :disabled="isLastStep">
              {{ currentStep === 'contacts' && !credentials.email && !credentials.phoneNumber ? 'Sari peste' : 'Înainte' }}
            </Button>
            <Button v-else type="submit" :variant="loading ? 'block' : 'primary'">
              {{ loading ? 'Loading...' : 'Înregistrează' }}
            </Button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
