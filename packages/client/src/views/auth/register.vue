<script setup lang="ts">
import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { RegisterDocument } from '@/api/graphql.ts'
import { ProfileCreateDocument } from '@/api/graphql.ts'
import TimeSlots from '@/components/availability/TimeSlots.vue'
import { UserRole, DayOfWeek } from '@/api/graphql.ts'
import { gql } from '@apollo/client'

type AvailabilitySlot = {
  dayOfWeek: DayOfWeek
  startTime: number
  duration: number
}

const credentials = ref({
  email: '',
  password: '',
  confirm: '',
  phoneNumber: '',
  firstName: '',
  lastName: '',
  type: 'Parent',
  availabilitySlots: [] as AvailabilitySlot[],
})

const errorMessage = ref('')

const { mutate: profileCreateMutate, loading: profileCreateLoading } = useMutation(ProfileCreateDocument)

const { mutate: registerMutate, loading: registerLoading } = useMutation(RegisterDocument)

function toggleSlot(dayOfWeek: DayOfWeek, startTime: number) {
  const key = `${dayOfWeek}-${startTime}`

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

const register = async () => {
  try {
    if (credentials.value.confirm !== credentials.value.password) {
      throw new Error('Confirmarea parolei greșită.')
    }
    const res = await registerMutate({
      email: credentials.value.email,
      password: credentials.value.password,
      phoneNumber: credentials.value.phoneNumber,
      firstName: credentials.value.firstName,
      lastName: credentials.value.lastName,
    })

    const token = res?.data?.userSignUp
    if (!token) throw new Error('Login failed')

    localStorage.setItem('token', token)

    if (credentials.value.type === 'Student') {
      await profileCreateMutate({
        email: credentials.value.email,
        phoneNumber: credentials.value.phoneNumber,
        firstName: credentials.value.firstName,
        lastName: credentials.value.lastName,
        availabilitySlots: credentials.value.availabilitySlots,
        type: UserRole.User,
      })
    }
  } catch (err: any) {
    errorMessage.value = err.message ?? 'Login error'
  }
}
</script>
<template>
  <div class="flex flex-col gap-4 justify-center items-center h-screen">
    <h1 class="text-2xl font-bold">Register</h1>

    <div class="flex gap-4">
      <button
        :class="['bg-blue-500 text-white p-2 rounded', credentials.type === 'Parent' ? 'bg-green-700' : '']"
        @click="credentials.type = 'Parent'"
      >
        Părinte
      </button>
      <button
        :class="['bg-blue-500 text-white p-2 rounded', credentials.type === 'Student' ? 'bg-green-700' : '']"
        @click="credentials.type = 'Student'"
      >
        Elev
      </button>
    </div>

    <input v-model="credentials.email" type="email" placeholder="Email" class="border p-2 rounded w-64" />

    <input v-model="credentials.password" type="password" placeholder="Password" class="border p-2 rounded w-64" />

    <input
      v-model="credentials.confirm"
      type="password"
      placeholder="Confirm Password"
      class="border p-2 rounded w-64"
    />

    <input v-model="credentials.phoneNumber" type="tel" placeholder="Phone Number" class="border p-2 rounded w-64" />

    <input v-model="credentials.firstName" type="text" placeholder="First Name" class="border p-2 rounded w-64" />

    <input v-model="credentials.lastName" type="text" placeholder="Last Name" class="border p-2 rounded w-64" />

    <TimeSlots
      v-if="credentials.type == 'Student'"
      :availabilitySlots="credentials.availabilitySlots"
      @toggle="toggleSlot"
    />

    <button
      @click="register"
      :disabled="registerLoading || profileCreateLoading"
      class="bg-blue-500 text-white p-2 rounded w-64"
    >
      {{ registerLoading || profileCreateLoading ? 'Registering...' : 'Register' }}
    </button>

    <div>Ai cont? <router-link to="/auth/login">Loghează-te</router-link></div>

    <p v-if="errorMessage" class="text-red-500 text-sm">
      {{ errorMessage }}
    </p>
  </div>
</template>
