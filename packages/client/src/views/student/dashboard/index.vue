<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import type { DayOfWeek } from '@/api/graphql'
import MiniProfile from '@/components/ui/profile/MiniProfile.vue'
import AddProfile from '@/components/ui/profile/AddProfile.vue'
import ProfileDashboardMenu from '@/components/ui/profile/ProfileDashboardMenu.vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import ErrorMessage from '@/components/ui/ErrorMessage.vue'
import TimeSlots from '@/components/ui/availability/TimeSlots.vue'
import { GET_MY_PROFILES } from '../query'

type AvailabilitySlot = {
  dayOfWeek: DayOfWeek
  startTime: number
  duration: number
}

type ProfileView = {
  id: string
  email?: string | null
  username: string
  firstName?: string | null
  lastName?: string | null
  phoneNumber?: string | null
  deleted: boolean
  availabilitySlots?: AvailabilitySlot[] | null
  roleProfile?: {
    __typename: string
  } | null
}

type UserProfilesResult = {
  user?: {
    id: string
    profiles?: ProfileView[] | null
  } | null
}

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

const sections = [
  { key: 'profiles', label: 'Profiluri' },
  { key: 'edit', label: 'Editează' },
] as const

type SectionKey = (typeof sections)[number]['key']

const activeSection = ref<SectionKey>('profiles')
const selectedProfileId = ref(typeof window === 'undefined' ? '' : localStorage.getItem('profileId') ?? '')
const feedback = ref('')
const saveError = ref('')

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  availabilitySlots: [] as AvailabilitySlot[],
})

const { result, loading, error } = useQuery<UserProfilesResult>(GET_MY_PROFILES)
const profiles = computed(() => (result.value?.user?.profiles ?? []).filter(profile => profile.deleted === false))

const selectedProfile = computed(() =>
  profiles.value.find(profile => profile.id === selectedProfileId.value) ?? profiles.value[0] ?? null,
)

const studentProfilesCount = computed(
  () => profiles.value.filter(profile => profile.roleProfile?.__typename === 'Student').length,
)

watch(
  profiles,
  currentProfiles => {
    if (currentProfiles.length === 0) return
    const exists = currentProfiles.some(profile => profile.id === selectedProfileId.value)
    if (!exists) {
      const firstProfile = currentProfiles[0]
      if (!firstProfile) return
      selectedProfileId.value = firstProfile.id
    }
  },
  { immediate: true },
)

watch(
  selectedProfileId,
  value => {
    if (typeof window === 'undefined' || !value) return
    localStorage.setItem('profileId', value)
  },
  { immediate: true },
)

watch(
  selectedProfile,
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
  refetchQueries: [{ query: GET_MY_PROFILES }],
}))

function profileName(profile: ProfileView) {
  const firstName = profile.firstName?.trim()
  const lastName = profile.lastName?.trim()
  return [firstName, lastName].filter(Boolean).join(' ').trim() || profile.username
}

function roleLabel(profile: ProfileView) {
  switch (profile.roleProfile?.__typename) {
    case 'Student':
      return 'Elev'
    case 'Teacher':
      return 'Profesor'
    case 'Parent':
      return 'Părinte'
    default:
      return 'Profil'
  }
}

function profileSubtitle(profile: ProfileView) {
  if (profile.roleProfile?.__typename === 'Student') {
    return 'Poate fi folosit imediat la înscrierea către profesori.'
  }
  return 'Profil activ disponibil în contul autentificat.'
}

function selectProfile(id: string) {
  selectedProfileId.value = id
  feedback.value = 'Profilul activ a fost actualizat.'
  saveError.value = ''
}

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
  if (selectedProfile.value == null) return

  saveError.value = ''
  feedback.value = ''

  try {
    await mutate({
      profileId: selectedProfile.value.id,
      firstName: form.value.firstName || null,
      lastName: form.value.lastName || null,
      email: form.value.email || null,
      phoneNumber: form.value.phoneNumber || null,
      availabilitySlots: form.value.availabilitySlots,
    })
    feedback.value = 'Profilul a fost salvat.'
    activeSection.value = 'profiles'
  } catch (err: any) {
    saveError.value = err.message ?? 'Nu am putut salva profilul.'
  }
}
</script>

<template>
  <div class="flex justify-center w-full px-3 py-8 lg:py-12">
    <div class="w-full max-w-7xl flex flex-col gap-6 pb-24 md:pb-0">
      <section class="rounded-2xl border border-slate-800 bg-[color-mix(in_oklab,var(--color-slate-900)_55%,transparent)] p-6 md:p-8 lg:p-10">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div class="max-w-3xl space-y-3">
            <span class="inline-flex w-max rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium tracking-wide text-emerald-300">
              Dashboard profil
            </span>
            <div class="space-y-2">
              <h1 class="text-3xl font-medium text-zinc-100 md:text-4xl">Alege și administrează rapid profilul activ</h1>
              <p class="max-w-2xl text-sm leading-6 text-slate-400 md:text-base">
                Profilul selectat aici este cel folosit mai departe în fluxurile de înscriere către profesori. Poți schimba profilul activ și îi poți edita datele din aceeași pagină.
              </p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3 sm:min-w-80">
            <div class="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <div class="text-[11px] uppercase tracking-[0.22em] text-slate-500">Profiluri active</div>
              <div class="mt-2 text-2xl font-semibold text-zinc-100">{{ profiles.length }}</div>
            </div>
            <div class="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <div class="text-[11px] uppercase tracking-[0.22em] text-slate-500">Profiluri elev</div>
              <div class="mt-2 text-2xl font-semibold text-zinc-100">{{ studentProfilesCount }}</div>
            </div>
          </div>
        </div>
      </section>

      <ProfileDashboardMenu v-model="activeSection" :items="sections" />

      <div v-if="loading" class="h-96 rounded-2xl border border-slate-800 bg-slate-900/40 animate-pulse"></div>
      <ErrorMessage v-else-if="error">{{ error.message }}</ErrorMessage>

      <template v-else>
        <section
          v-if="activeSection === 'profiles'"
          class="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_0.8fr]"
        >
          <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
            <MiniProfile
              v-for="profile in profiles"
              :key="profile.id"
              :name="profileName(profile)"
              :email="profile.email"
              :subtitle="profileSubtitle(profile)"
              :meta="roleLabel(profile)"
              :active="selectedProfile?.id === profile.id"
              @select="selectProfile(profile.id)"
            />
            <AddProfile />
          </div>

          <div class="rounded-2xl border border-slate-800 bg-[color-mix(in_oklab,var(--color-slate-900)_45%,transparent)] p-6 md:p-8">
            <template v-if="selectedProfile">
              <div class="space-y-5">
                <div>
                  <h2 class="text-2xl font-medium text-zinc-100">Profil activ</h2>
                  <p class="mt-2 text-sm leading-6 text-slate-400">
                    Acesta este profilul folosit implicit în restul aplicației. Dacă vrei să modifici datele, mergi în tab-ul de editare.
                  </p>
                </div>

                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div class="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                    <div class="text-[11px] uppercase tracking-[0.22em] text-slate-500">Nume</div>
                    <div class="mt-2 text-sm font-medium leading-6 text-zinc-100">{{ profileName(selectedProfile) }}</div>
                  </div>
                  <div class="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                    <div class="text-[11px] uppercase tracking-[0.22em] text-slate-500">Rol</div>
                    <div class="mt-2 text-sm font-medium leading-6 text-zinc-100">{{ roleLabel(selectedProfile) }}</div>
                  </div>
                  <div class="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                    <div class="text-[11px] uppercase tracking-[0.22em] text-slate-500">Email</div>
                    <div class="mt-2 text-sm font-medium leading-6 text-zinc-100">{{ selectedProfile.email || 'Nu este setat' }}</div>
                  </div>
                  <div class="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                    <div class="text-[11px] uppercase tracking-[0.22em] text-slate-500">Telefon</div>
                    <div class="mt-2 text-sm font-medium leading-6 text-zinc-100">{{ selectedProfile.phoneNumber || 'Nu este setat' }}</div>
                  </div>
                </div>

                <div class="rounded-xl border border-emerald-500/50 bg-emerald-500/10 p-4 text-sm leading-6 text-emerald-200">
                  {{ selectedProfile.roleProfile?.__typename === 'Student'
                    ? 'Acest profil poate fi folosit direct când conectezi un profesor.'
                    : 'Pentru conectarea la profesori, selectează un profil de tip elev.' }}
                </div>

                <div class="flex gap-3">
                  <Button @click="activeSection = 'edit'">Editează profilul</Button>
                </div>
              </div>
            </template>

            <div v-else class="text-sm text-slate-400">
              Nu există încă profiluri active. Creează unul nou pentru a continua.
            </div>
          </div>
        </section>

        <section
          v-else
          class="rounded-2xl border border-slate-800 bg-[color-mix(in_oklab,var(--color-slate-900)_45%,transparent)] p-6 md:p-8"
        >
          <template v-if="selectedProfile">
            <form class="flex flex-col gap-8" @submit.prevent="submit">
              <div class="flex flex-col gap-2 border-b border-slate-800 pb-5">
                <h2 class="text-2xl font-medium text-zinc-100">Editează profilul selectat</h2>
                <p class="text-sm leading-6 text-slate-400">
                  Modifici rapid datele profilului activ, iar schimbările sunt folosite imediat în fluxurile unde profilul este selectat.
                </p>
              </div>

              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input v-model="form.firstName" id="profile-first-name" label="Prenume" placeholder="Scrie prenumele" />
                <Input v-model="form.lastName" id="profile-last-name" label="Nume" placeholder="Scrie numele" />
                <Input v-model="form.email" id="profile-email" type="email" label="Email" placeholder="email@exemplu.com" />
                <Input v-model="form.phoneNumber" id="profile-phone" type="tel" label="Telefon" placeholder="07xx xxx xxx" />
              </div>

              <div class="space-y-4">
                <div>
                  <h3 class="text-xl font-medium text-zinc-100">Disponibilitate</h3>
                  <p class="mt-1 text-sm leading-6 text-slate-400">
                    Pentru profilurile de elev, această disponibilitate este folosită mai departe la alegerea profesorului și la formarea grupelor.
                  </p>
                </div>
                <TimeSlots :availabilitySlots="form.availabilitySlots" :loading="saving" @toggle="toggleSlot" />
              </div>

              <ErrorMessage v-if="saveError">{{ saveError }}</ErrorMessage>
              <div
                v-if="feedback"
                class="rounded-xl border border-emerald-500 bg-[color-mix(in_oklab,var(--color-emerald-500)_10%,transparent)] px-4 py-3 text-sm text-emerald-200"
              >
                {{ feedback }}
              </div>

              <div class="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <Button type="button" variant="secondary" @click="activeSection = 'profiles'">Înapoi la profiluri</Button>
                <Button type="submit" :variant="saving ? 'block' : 'primary'">
                  {{ saving ? 'Se salvează...' : 'Salvează profilul' }}
                </Button>
              </div>
            </form>
          </template>

          <div v-else class="text-sm text-slate-400">
            Nu există niciun profil de editat.
          </div>
        </section>
      </template>
    </div>
  </div>
</template>
