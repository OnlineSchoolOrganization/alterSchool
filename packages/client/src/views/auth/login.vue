<script setup lang="ts">
import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { LoginDocument } from '@/api/graphql.ts'
import AuthLayout from './layout.vue'

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
    window.location.href = '/account'
  } catch (err: any) {
    errorMessage.value = err.message ?? 'Login error'
  }
}
</script>
<template>
  <AuthLayout>
    <div class="max-w-md w-full bg-[#111113] border border-zinc-800/60 rounded-2xl p-8 md:p-10 flex flex-col gap-8 shadow-2xl">
      
      <div class="flex flex-col gap-2 text-center lg:text-left">
        <h2 class="text-2xl font-bold text-zinc-100 uppercase tracking-tighter italic">Autentificare</h2>
        <p class="text-zinc-500 text-sm">Introdu acreditările pentru acces.</p>
      </div>

      <form @submit.prevent="login" class="flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <label class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Email</label>
          <input 
            v-model="credentials.email" 
            type="email" 
            placeholder="nume@exemplu.ro"
            class="w-full bg-[#0a0a0b] border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-zinc-100 focus:outline-none focus:border-[#c5a47e] transition-all"
          />
        </div>

        <div class="flex flex-col gap-2">
          <div class="flex justify-between items-center px-1">
            <label class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Parolă</label>
            <a href="#" class="text-[10px] text-[#c5a47e] uppercase font-bold hover:underline">Ai uitat?</a>
          </div>
          <input 
            v-model="credentials.password" 
            type="password" 
            placeholder="••••••••"
            class="w-full bg-[#0a0a0b] border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-zinc-100 focus:outline-none focus:border-[#c5a47e] transition-all"
          />
        </div>

        <button 
          type="submit" 
          class="w-full py-4 bg-[#c5a47e] text-[#0a0a0b] font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-[#d6b58f] transition-all shadow-lg shadow-[#c5a47e]/10 mt-2"
        >
          {{ loading ? 'Se procesează...' : 'Intră în cont' }}
        </button>

        <div class="flex justify-center pt-4 border-t border-zinc-800/40">
          <p class="text-sm text-zinc-500">
            Nu ai cont? 
            <router-link to="/auth/register" class="text-[#c5a47e] font-bold hover:underline ml-1">
              Înregistrează-te
            </router-link>
          </p>
        </div>
      </form>
    </div>
  </AuthLayout>
</template>