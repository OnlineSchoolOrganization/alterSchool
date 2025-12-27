<script setup lang="ts">
  import { ref } from 'vue'
  import { useMutation } from '@vue/apollo-composable'
  import { RegisterDocument } from '@/api/graphql.ts'

  const credentials = ref({
    email: '',
    password: '',
    confirm: '',
    phoneNumber: '',
    firstName: '',
    lastName: '',
  })
  const errorMessage = ref('')

  const { mutate: registerMutate, loading } = useMutation(RegisterDocument)

  const register = async () => {
    try {
      if(credentials.value.confirm !== credentials.value.password) {
        throw new Error("Confirmarea parolei greșită.")
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
    } catch (err: any) {
      errorMessage.value = err.message ?? 'Login error'
    }
  }
</script>
<template>
  <div class="flex flex-col gap-4 justify-center items-center h-screen">
    <h1 class="text-2xl font-bold">Register</h1>

    <input
      v-model="credentials.email"
      type="email"
      placeholder="Email"
      class="border p-2 rounded w-64"
    />

    <input
      v-model="credentials.password"
      type="password"
      placeholder="Password"
      class="border p-2 rounded w-64"
    />

    <input
      v-model="credentials.confirm"
      type="password"
      placeholder="Confirm Password"
      class="border p-2 rounded w-64"
    />

    <input
      v-model="credentials.phoneNumber"
      type="tel"
      placeholder="Phone Number"
      class="border p-2 rounded w-64"
    />

    <input
      v-model="credentials.firstName"
      type="text"
      placeholder="First Name"
      class="border p-2 rounded w-64"
    />

    <input
      v-model="credentials.lastName"
      type="text"
      placeholder="Last Name"
      class="border p-2 rounded w-64"
    />

    <button
      @click="register"
      :disabled="loading"
      class="bg-blue-500 text-white p-2 rounded w-64"
    >
      {{ loading ? 'Registering...' : 'Register' }}
    </button>

    <div>Ai cont? <router-link to="/auth/login">Loghează-te</router-link></div>

    <p v-if="errorMessage" class="text-red-500 text-sm">
      {{ errorMessage }}
    </p>
  </div>
</template>
