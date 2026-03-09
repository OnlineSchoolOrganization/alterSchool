<script setup lang="ts">
import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { LoginDocument } from '@/api/graphql.ts'

import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import ErrorMessage from '@/components/ui/ErrorMessage.vue'
// import AuthLayout from "./layout.vue"

const credentials = ref({
  email: '',
  password: '',
})
const error = ref(null)

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
    window.location.href = '/account'
  } catch (err: any) {
    error.value = err.message ?? 'Login error'
  }
}
</script>
<template>
  <!-- <AuthLayout> -->
  <div class="flex justify-center items-center w-full h-dvh">
    <div class="w-md min-w-xs m-3 flex flex-col bg-[color-mix(in_oklab,var(--color-slate-900)_50%,transparent)] p-10 border-slate-800 border rounded-lg gap-10">
      <div class="text-center">
        <h1 class="text-2xl font-medium text-zing-100">Bine ai revenit</h1>
        <p class="text-slate-400">Conecteaza-te pentru a-ți satisface curiozitatea</p>
      </div>
      <form @submit.prevent="login" class="flex flex-col gap-5">
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
          v-model="credentials.password"
          id="password"
          type="password"
          label="Password"
          placeholder="Scrie parola ta"
          name="password"
          autocomplate="current-password"
          required
        />
        <ErrorMessage v-if="error">{{ error }}</ErrorMessage>
        <Button type="submit" :variant="loading ? 'block' : 'primary'">
          {{ loading ? "Loading..." : "Login" }}
        </Button>
        <div class="pt-4 text-center">
          Nu ai cont? <router-link to="register" class="text-emerald-400 font-bold">Înregistrează-te</router-link>
        </div>
      </form>
    </div>
  </div>
  <!-- </AuthLayout> -->
</template>
