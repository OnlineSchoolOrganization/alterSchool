<script setup lang="ts">
import AuthLayout from '../auth/layout.vue'
import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { DayOfWeek, ProfileCreateDocument, UserRole } from '@/api/graphql'
import TimeSlots from '@/components/ui/availability/TimeSlots.vue'
import { gql } from '@apollo/client'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()

const route = useRoute()

const step = ref(route.query.step || '1')

type AvailabilitySlot = {
  dayOfWeek: DayOfWeek
  startTime: number
  duration: number
}

const credentials = ref({
  email: null,
  phoneNumber: null, 
  username: '',
  availabilitySlots: [] as AvailabilitySlot[],
})

const errorMessage = ref('')

const { mutate: profileCreateMutate, loading: profileCreateLoading } = useMutation(ProfileCreateDocument)
const PROFILE_EDIT_AVAILABILITY_SLOTS = gql`
  mutation ProfileEditAvailabilitySlots($profileId: ID!, $availabilitySlots: [IAvailabilitySlot!]!) {
    profileUpdateAvailabilitySlots(profileId: $profileId, availabilitySlots: $availabilitySlots) {
      id
    }
  }
`
const { mutate: profileEditAvailabilitySlotsMutate, loading: profileEditAvailabilitySlotsLoading } = useMutation(PROFILE_EDIT_AVAILABILITY_SLOTS)

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

const step1 = async () => {
  try {
    const res = await profileCreateMutate({
        email: credentials.value.email,
        phoneNumber: credentials.value.phoneNumber,
        username: credentials.value.username,
        availabilitySlots: [],
        type: UserRole.User,
    })
    localStorage.setItem('profileId', res?.data?.profileCreate.id as string)
    router.push('/acount/create?step=2')
    step.value = '2'
  } catch (err: any) {
    errorMessage.value = err.message ?? 'Registration error'
  }
}
const step2 = async () => {
  try {
    await profileEditAvailabilitySlotsMutate({
        profileId: localStorage.getItem('profileId') as string,
        availabilitySlots: credentials.value.availabilitySlots,
        type: UserRole.User,
    })
    router.push('/acount')
  } catch (err: any) {
    errorMessage.value = err.message ?? 'Registration error'
  }
}
</script>

<template>
  <AuthLayout>
    <div v-if="step === '1' || !step" class="space-y-10 p-10 bg-[#111113] border border-zinc-800 rounded-xl">
      <div class="space-y-2">
        <h2 class="text-2xl font-bold text-zinc-100 uppercase tracking-tighter italic">Student nou</h2>
        <p class="text-zinc-500 text-sm italic font-light">Ești la un pas de a face parte din comunitatea Alter.</p>
      </div>

      <form @submit.prevent="step1" class="space-y-10">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-[10px] font-bold text-zinc-500 uppercase ml-1">Prenume</label>
            <input v-model="credentials.username" type="text" placeholder="Andrei" class="auth-box-input" />
          </div>
          <div class="space-y-2 md:col-span-2">
            <label class="text-[10px] font-bold text-zinc-500 uppercase ml-1">Email</label>
            <input v-model="credentials.email" type="email" placeholder="email@exemplu.ro" class="auth-box-input" />
          </div>
          <div class="space-y-2 md:col-span-2">
            <label class="text-[10px] font-bold text-zinc-500 uppercase ml-1">Telefon</label>
            <input v-model="credentials.phoneNumber" type="tel" placeholder="07xx xxx xxx" class="auth-box-input" />
          </div>
        </div>

        <div class="pt-4 flex flex-col items-center gap-6">
          <div v-if="errorMessage" class="text-red-500 text-sm">
            {{ errorMessage }}
          </div>
          <button
            type="submit"
            class="w-full py-4 bg-[#c5a47e] text-[#0a0a0b] font-bold rounded-lg text-xs uppercase tracking-widest hover:bg-[#d6b58f] transition-all"
          >
            {{ profileCreateLoading ? 'Se procesează...' : 'Treci la pasul urmator' }}
          </button>
        </div>
      </form>
    </div>
    <div v-else-if="step === '2'" class="w-full space-y-8 animate-in fade-in duration-500">
      <div class="text-center space-y-3">
         <div class="flex justify-center items-center gap-2 text-[#c5a47e] text-[10px] font-bold uppercase tracking-widest">
          <span class="w-6 h-6 rounded-full bg-[#c5a47e] text-[#0a0a0b] flex items-center justify-center">2</span>
          Finalizare Profil
        </div>
        <h3 class="text-3xl font-bold text-zinc-100 uppercase italic tracking-tighter">Disponibilitate</h3>
        <p class="text-zinc-500 text-sm max-w-md mx-auto">Selectează intervalele orare în care ești disponibil pentru cursuri.</p>
      </div>

        <TimeSlots 
          :availabilitySlots="credentials.availabilitySlots" 
          @toggle="toggleSlot" 
          :loading="profileEditAvailabilitySlotsLoading"
        />

      <div class="mx-auto pt-6 justify-between flex gap-4">
        <div v-if="errorMessage" class="text-red-400 text-xs italic text-center mb-4">{{ errorMessage }}</div>
        <button
          @click="() => { router.push('/acount/create?step=1'); step = '1' }"
          class="w-full max-w-md py-4 bg-[#c5a47e] text-[#0a0a0b] font-bold rounded-lg text-xs uppercase tracking-widest hover:bg-[#d6b58f] transition-all shadow-xl shadow-[#c5a47e]/5"
        >
            Inapoi
        </button>
        <button
          @click="step2"
          class="w-full max-w-md py-4 bg-[#c5a47e] text-[#0a0a0b] font-bold rounded-lg text-xs uppercase tracking-widest hover:bg-[#d6b58f] transition-all shadow-xl shadow-[#c5a47e]/5"
        >
          {{ profileEditAvailabilitySlotsLoading ? 'Se salvează...' : 'Finalizează Crearea Profilului' }}
        </button>
      </div>
    </div>
  </AuthLayout>
</template>

<style scoped>
.auth-box-input {
  width: 100%;
  background-color: #111113;
  border: 1px solid #27272a;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: #f4f4f5;
  transition: all 0.2s ease;
}

.auth-box-input:focus {
  outline: none;
  border-color: #c5a47e;
}

.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #27272a;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #c5a47e;
}
</style>
