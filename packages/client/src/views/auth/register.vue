<script setup lang="ts">
import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { RegisterDocument, ProfileCreateDocument, UserRole, DayOfWeek } from '@/api/graphql.ts'
import { useRouter } from 'vue-router'
// import AuthLayout from './layout.vue'

import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import ErrorMessage from '@/components/ui/ErrorMessage.vue'

const router = useRouter()

const credentials = ref<{
  email: string,
  password: string,
  confirm: string,
  phoneNumber: string,
  username: string
  type: "Parent" | "Student"
}>({
  email: '',
  password: '',
  confirm: '',
  phoneNumber: '',
  username: '',
  type: 'Parent',
})

const error = ref('')

const { mutate, loading } = useMutation(RegisterDocument)


const register = async () => {
  try {
    if (credentials.value.confirm !== credentials.value.password) {
        error.value = 'Confirmarea parolei greșită.'
        return
    }
    const res = await mutate({
      email: credentials.value.email,
      password: credentials.value.password,
      phoneNumber: credentials.value.phoneNumber,
      username: credentials.value.username,
    })

    const token = res?.data?.userSignUp
    if (!token) throw new Error('Registration failed')

    localStorage.setItem('token', token)
    if(credentials.value.type === "Parent") {
      router.push('/student/create?type=parent')
    } else {
      router.push('/student/create?type=student')
    }
  } catch (err: any) {
    error.value = err.message ?? 'Registration error'
  }
}
</script>
<template>
  <!-- <AuthLayout> -->
  <div class="flex justify-center items-center w-full h-dvh">
    <div class="w-md min-w-xs m-3 flex flex-col bg-[color-mix(in_oklab,var(--color-slate-900)_50%,transparent)] p-10 border-slate-800 border rounded-lg gap-10">
      <div class="text-center">
        <h1 class="text-2xl font-medium text-zing-100">Bine ai venit</h1>
        <p class="text-slate-400">Alătură-te școlii noastre, nu o să regreți</p>
      </div>
      <form @submit.prevent="register" class="flex flex-col gap-5">
        <div>
          <span class="text-zinc-100">Mă înregistrez în calitate de:</span>
          <div class="flex gap-5 h-12">
            <Button @click="() => credentials.type = 'Parent'" type="button" :variant="credentials.type === 'Parent' ? 'secondary-green' : 'secondary'">Parent</Button>
            <Button @click="() => credentials.type = 'Student'" type="button" :variant="credentials.type === 'Student' ? 'secondary-green' : 'secondary'">Student</Button>
          </div>
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
        <Input
          v-model="credentials.username"
          id="name"
          type="text"
          label="Numele"
          placeholder="Scrie numele tău"
          name="name"
          autocomplete="name"
          required
        />
        <Input
          v-model="credentials.password"
          id="password"
          type="password"
          label="Password"
          placeholder="Scrie parola ta"
          name="password"
          required
        />
        <Input
          v-model="credentials.confirm"
          id="confirm"
          type="password"
          label="Confirmă parola"
          placeholder="Scrie parola ta"
          name="confirm"
          required
        />
        <ErrorMessage v-if="error">{{ error }}</ErrorMessage>
        <Button type="submit" :variant="loading ? 'block' : 'primary'">
          {{ loading ? "Loading..." : "Register" }}
        </Button>
        <div class="pt-4 text-center">
          Ai deja cont? <router-link to="login" class="text-emerald-400 font-bold">Conectează-te</router-link>
        </div>
      </form>
    </div>
  </div>
  <!-- </AuthLayout> -->
</template>
