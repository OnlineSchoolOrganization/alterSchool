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
  } | null
  availabilitySlots?: AvailabilitySlot[] | null
}

type TeacherDashboardResult = {
  me: {
    id: string
    profiles?: TeacherProfile[] | null
  }
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

const feedback = ref('')
const error = ref('')

const { result, loading: loadingProfile, error: queryError } = useQuery<TeacherDashboardResult>(TeacherDashboardDocument)
const teacherProfile = computed<TeacherProfile | null>(() => {
  const profiles = result.value?.me.profiles ?? []
  return profiles.find(profile => profile.deleted === false && profile.roleProfile?.__typename === 'Teacher') ?? null
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
  <div class="flex justify-center w-full">
    <div
      v-if="loadingProfile"
      class="w-6xl m-3 my-15 rounded-lg border border-slate-800 bg-[color-mix(in_oklab,var(--color-slate-900)_50%,transparent)] p-10"
    >
      Loading
    </div>

    <div
      v-else-if="teacherProfile == null"
      class="w-6xl m-3 my-15 rounded-lg border border-slate-800 bg-[color-mix(in_oklab,var(--color-slate-900)_50%,transparent)] p-10"
    >
      <div class="flex flex-col gap-4">
        <h1 class="text-2xl">Forbidden</h1>
        <p class="text-slate-300">Nu ești profesor sau nu ai un profil de teacher activ pe contul autentificat.</p>
        <ErrorMessage v-if="queryError">{{ queryError.message }}</ErrorMessage>
      </div>
    </div>

    <form
      v-else
      @submit.prevent="submit"
      class="m-3 my-15 flex w-6xl flex-col gap-10 rounded-lg border border-slate-800 bg-[color-mix(in_oklab,var(--color-slate-900)_50%,transparent)] p-10"
    >
      <div class="flex flex-col gap-3">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl">Dashboard profesor</h1>
            <p class="text-slate-300">Editează profilul tău de teacher păstrând același stil din aplicație.</p>
          </div>
          <div class="rounded-md bg-slate-700 px-5 py-1">Teacher</div>
        </div>
        <div class="h-2 w-full rounded-xl bg-slate-800">
          <div class="h-full w-full rounded-xl bg-linear-to-r from-emerald-300 to-emerald-600"></div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          v-model="form.firstName"
          id="teacher-first-name"
          label="Prenume"
          placeholder="Scrie prenumele"
          autocomplete="given-name"
        />
        <Input
          v-model="form.lastName"
          id="teacher-last-name"
          label="Nume"
          placeholder="Scrie numele"
          autocomplete="family-name"
        />
        <Input
          v-model="form.email"
          id="teacher-email"
          type="email"
          label="Email"
          placeholder="Scrie email-ul"
          autocomplete="email"
        />
        <Input
          v-model="form.phoneNumber"
          id="teacher-phone-number"
          type="tel"
          label="Numărul de telefon"
          placeholder="Scrie numărul de telefon"
          autocomplete="tel"
        />
      </div>

      <div class="flex flex-col gap-6">
        <div>
          <h2 class="text-2xl font-medium text-zing-100">Availability slots</h2>
          <p class="mt-1 text-slate-300">Selectează intervalele în care ești disponibil pentru cursuri.</p>
        </div>
        <TimeSlots :availabilitySlots="form.availabilitySlots" :loading="saving" @toggle="toggleSlot" />
      </div>

      <div class="flex flex-col gap-5">
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
      </div>
    </form>
  </div>
</template>
