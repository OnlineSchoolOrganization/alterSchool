<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { ProfileCreateDocument, UserRole, DayOfWeek } from '@/api/graphql.ts'
import { useRouter, useRoute } from 'vue-router'
// import AuthLayout from './layout.vue'

const route = useRoute()
const type: 'student' | 'parent' = route.query.type === 'student' ? 'student' : 'parent'

import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import ErrorMessage from '@/components/ui/ErrorMessage.vue'
import TimeSlots from '@/components/ui/availability/TimeSlots.vue'
import { graphql } from '@/api'
import { GET_MY_PROFILES } from './query'

const router = useRouter()

type AvailabilitySlot = {
  dayOfWeek: DayOfWeek
  startTime: number
  duration: number
}

const credentials = ref<{
    email: string | undefined
    phoneNumber: string | undefined
    username: string
    availabilitySlots: AvailabilitySlot[]
}>({
  email: undefined,
  phoneNumber: undefined, 
  username: '',
  availabilitySlots: [],
})
const error = ref('')
const loadingUserCredentials = ref(false)

type TSteps = 'username' | 'contacts' | 'availability'
const steps: TSteps[] = ['username', 'contacts', 'availability']
const step = ref(0)
const currentStep = computed(() => steps[step.value])
const isFirstStep = computed(() => step.value === 0)
const isLastStep = computed(() => step.value === steps.length - 1)
function nextStep() {
    if(step.value < steps.length-1) step.value += 1
}
function prevStep() {
    if(step.value > 0) step.value -= 1
}
function goToStep(name: TSteps) {
  const index = steps.indexOf(name)
  if (index !== -1) step.value = index
}

function verifyType() {
    if(type === 'parent') return
    const USER_DOCUMENT = graphql(`
    query User {
        user {
            email
            phoneNumber
            username
        }
    }
    `)
    const { result, loading } = useQuery(USER_DOCUMENT)
    loadingUserCredentials.value = loading.value
    const user = computed(() => result.value?.user)
    watch(user, (u) => {
        if (!u) return
        credentials.value.email = u.email
        credentials.value.phoneNumber = u.phoneNumber
        credentials.value.username = u.username
        loadingUserCredentials.value = false
        goToStep('availability')
    })
}
verifyType()

const { mutate, loading} = useMutation(ProfileCreateDocument)

const createProfile = async () => {
  try {
    const res = await mutate({
        email: credentials.value.email,
        phoneNumber: credentials.value.phoneNumber,
        username: credentials.value.username,
        availabilitySlots: credentials.value.availabilitySlots,
        type: UserRole.User,
    }, {
        refetchQueries: [{
            query: GET_MY_PROFILES
        }]
    })
    localStorage.setItem('profileId', res?.data?.profileCreate.id as string)
    router.push('/profile/select')
  } catch (err: any) {
    error.value = err.message ?? 'Registration error'
  }
}

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
  <!-- <AuthLayout> -->
  <div class="flex justify-center w-full">
      <form @submit.prevent="createProfile" class="flex flex-col gap-10 w-6xl m-3 bg-[color-mix(in_oklab,var(--color-slate-900)_50%,transparent)] p-10 border-slate-800 border rounded-lg h-max my-15">
        <div v-if="!loadingUserCredentials" class="flex flex-col gap-10">
            <div class="flex justify-between items-center">
                <h1 class="text-2xl">Creaza profilul studentului</h1>
                <div class="bg-slate-700 py-1 px-5 rounded-md">
                    Pasul {{ step + 1 }} din {{ steps.length }}
                </div>
            </div>
            <div class="w-full bg-slate-800 h-2 rounded-xl">
                <div :style="`width: ${Math.floor(100/steps.length) * (step + 1)}%`" :class="`w-[${Math.floor(100/steps.length) * (step + 1)}%] from-emerald-300 bg-linear-to-r to-emerald-600 h-full rounded-xl`"></div>
            </div>
            <div v-if="currentStep === 'username'" class="max-w-md flex flex-col gap-3">
                <div>
                    <h1 class="text-2xl font-medium text-zing-100">Numele studentului</h1>
                </div>
                <Input
                    v-model="credentials.username"
                    id="name"
                    type="text"
                    label="Numele"
                    placeholder="Scrie numele studentului"
                    name="name"
                    autocomplete="name"
                    required
                />
            </div>
            <div v-if="currentStep === 'contacts'" class="max-w-md flex flex-col gap-3">
                <div>
                    <h1 class="text-2xl font-medium text-zing-100">Contactele studentului (optional)</h1>
                </div>
                <Input
                    v-model="credentials.email"
                    id="email"
                    type="email"
                    label="Email"
                    placeholder="Scrie email-ul tău"
                    name="email"
                    autocomplete="email"
                    required
                />
                <Input
                    v-model="credentials.phoneNumber"
                    id="phone"
                    type="tel"
                    label="Numarul de telefon"
                    placeholder="Scrie numarul tău de telefon"
                    name="phone"
                    autocomplete="phone"
                    required
                />
            </div>
            <div v-else-if="currentStep === 'availability'" class="flex flex-col items-center">
                <div class="w-full xl:w-auto">
                    <h1 class="mb-6 text-2xl font-medium text-zing-100">Timpul liber al studentului</h1>
                    <TimeSlots 
                        :availabilitySlots="credentials.availabilitySlots" 
                        @toggle="toggleSlot"
                        :loading="loading"
                    />
                </div>
            </div>
        </div>
        <div v-else>
            Loading
        </div>
        
        <div class="flex flex-col gap-5">
            <ErrorMessage v-if="error">{{ error }}</ErrorMessage>
            <div class="flex justify-between">
                <div>
                    <Button @click="prevStep" type="button" variant="secondary" v-if="!isFirstStep" :disabled="isFirstStep">
                        Înapoi
                    </Button>
                    <router-link class="w-full h-full flex justify-center items-center py-2 px-4 rounded-md text-sm cursor-pointer transition-colors bg-[color-mix(in_oklab,var(--color-slate-800)_50%,transparent)] text-zinc-100 border-2 border-slate-700" v-else to="/profile/select">
                        Acasă
                    </router-link>
                </div>
                <div>
                    <Button @click="nextStep" type="button" v-if="!isLastStep" :disabled="isLastStep">
                        {{ currentStep === 'contacts' && !credentials.email && !credentials.phoneNumber ? 'Sari peste' : 'Înainte' }}
                    </Button>
                    <Button v-else type="submit" :variant="loading ? 'block' : 'primary'">
                      {{ loading ? "Loading..." : "Înregistrează" }}
                    </Button>
                </div>
            </div>
        </div>
      </form>
  </div>
  <!-- </AuthLayout> -->
</template>
