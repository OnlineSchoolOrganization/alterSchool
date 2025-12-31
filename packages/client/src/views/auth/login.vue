<script setup lang="ts">
import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { LoginDocument } from '@/api/graphql.ts'

const credentials = ref({
  email: '',
  password: '',
})
const errorMessage = ref('')

const { mutate: loginMutate, loading } = useMutation(LoginDocument)

const login = async () => {
  try {
    const res = await loginMutate({
      email: credentials.value.email,
      password: credentials.value.password,
    })

    const token = res?.data?.userSignIn
    if (!token) throw new Error('Login failed')

    localStorage.setItem('token', token)
  } catch (err: any) {
    errorMessage.value = err.message ?? 'Login error'
  }
}
</script>
<template>
  <div class="flex flex-col gap-4 justify-center items-center h-screen">
    <h1 class="text-2xl font-bold">Login</h1>

    <input v-model="credentials.email" type="email" placeholder="Email" class="border p-2 rounded w-64" />

    <input v-model="credentials.password" type="password" placeholder="Password" class="border p-2 rounded w-64" />

    <button @click="login" :disabled="loading" class="bg-blue-500 text-white p-2 rounded w-64">
      {{ loading ? 'Logging in...' : 'Login' }}
    </button>

    <div>Nu ai cont? <router-link to="/auth/register">Înregistrează-te</router-link></div>

    <p v-if="errorMessage" class="text-red-500 text-sm">
      {{ errorMessage }}
    </p>
  </div>
</template>
