<script setup lang="ts">
import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { RegisterDocument, ProfileCreateDocument, UserRole, DayOfWeek } from '@/api/graphql.ts'
import AuthLayout from './layout.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const credentials = ref({
  email: '',
  password: '',
  confirm: '',
  phoneNumber: '',
  firstName: '',
  lastName: '',
  type: 'Parent',
})

const errorMessage = ref('')

const { mutate: profileCreateMutate, loading: profileCreateLoading } = useMutation(ProfileCreateDocument)
const { mutate: registerMutate, loading: registerLoading } = useMutation(RegisterDocument)


const register = async () => {
  try {
    if (credentials.value.confirm !== credentials.value.password) {
        errorMessage.value = 'Confirmarea parolei greșită.'
        return
    }
    const res = await registerMutate({
      email: credentials.value.email,
      password: credentials.value.password,
      phoneNumber: credentials.value.phoneNumber,
      firstName: credentials.value.firstName,
      lastName: credentials.value.lastName,
    })

    const token = res?.data?.userSignUp
    if (!token) throw new Error('Registration failed')

    localStorage.setItem('token', token)

    if (credentials.value.type === 'Student') {
      const res = await profileCreateMutate({
        email: credentials.value.email,
        phoneNumber: credentials.value.phoneNumber,
        firstName: credentials.value.firstName,
        lastName: credentials.value.lastName,
        availabilitySlots: [],
        type: UserRole.User,
      })
      localStorage.setItem('profileId', res?.data?.profileCreate.id as string)
      router.push('/acount/create?step=2')
      return
    } else {
      router.push('/acount')
    }
  } catch (err: any) {
    errorMessage.value = err.message ?? 'Registration error'
  }
}
</script>
<template>
  <AuthLayout>
    <div class="space-y-10 p-10 bg-[#111113] border border-zinc-800 rounded-xl">
      <div class="space-y-2">
        <h2 class="text-2xl font-bold text-zinc-100 uppercase tracking-tighter italic">Cont Nou</h2>
        <p class="text-zinc-500 text-sm italic font-light">Ești la un pas de a face parte din comunitatea Alter.</p>
      </div>

      <form @submit.prevent="register" class="space-y-10">
        <div class="flex bg-[#111113] p-1 rounded-lg border border-zinc-800/60 w-fit">
          <button
            type="button"
            @click="credentials.type = 'Parent'"
            :class="credentials.type === 'Parent' ? 'bg-[#c5a47e] text-[#0a0a0b]' : 'text-zinc-500'"
            class="px-6 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all"
          >
            Părinte
          </button>
          <button
            type="button"
            @click="credentials.type = 'Student'"
            :class="credentials.type === 'Student' ? 'bg-[#c5a47e] text-[#0a0a0b]' : 'text-zinc-500'"
            class="px-6 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all"
          >
            Elev
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-[10px] font-bold text-zinc-500 uppercase ml-1">Prenume</label>
            <input v-model="credentials.firstName" type="text" placeholder="Andrei" class="auth-box-input" />
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-bold text-zinc-500 uppercase ml-1">Nume</label>
            <input v-model="credentials.lastName" type="text" placeholder="Popescu" class="auth-box-input" />
          </div>
          <div class="space-y-2 md:col-span-2">
            <label class="text-[10px] font-bold text-zinc-500 uppercase ml-1">Email</label>
            <input v-model="credentials.email" type="email" placeholder="email@exemplu.ro" class="auth-box-input" />
          </div>
          <div class="space-y-2 md:col-span-2">
            <label class="text-[10px] font-bold text-zinc-500 uppercase ml-1">Telefon</label>
            <input v-model="credentials.phoneNumber" type="tel" placeholder="07xx xxx xxx" class="auth-box-input" />
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-bold text-zinc-500 uppercase ml-1">Parolă</label>
            <input v-model="credentials.password" type="password" placeholder="••••••••" class="auth-box-input" />
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-bold text-zinc-500 uppercase ml-1">Confirmare</label>
            <input v-model="credentials.confirm" type="password" placeholder="••••••••" class="auth-box-input" />
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
          {{ registerLoading || (profileCreateLoading && credentials.type === 'Student') ? 'Se procesează...' : 'Creează Contul' }}
          </button>
          <router-link to="/auth/login" class="text-sm text-zinc-500">
            Ai deja cont? <span class="text-[#c5a47e] font-bold">Conectează-te</span>
          </router-link>
        </div>
      </form>
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
