<script setup lang="ts">
import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { ProfileCreateDocument, UserRole, DayOfWeek } from '@/api/graphql.ts'
import TimeSlots from '@/components/availability/TimeSlots.vue'

const props = defineProps<{
  // Permitem injectarea email-ului dacă există deja (ex: la register)
  // Sau îl lăsăm editabil dacă e profil nou
  initialEmail?: string
  role: 'Student' | 'Parent'
}>()

const emit = defineEmits(['success', 'error'])

const form = ref({
  email: props.initialEmail || '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  availabilitySlots: [] as any[],
})

const { mutate, loading } = useMutation(ProfileCreateDocument)

function toggleSlot(dayOfWeek: DayOfWeek, startTime: number) {
  const index = form.value.availabilitySlots.findIndex(s => s.dayOfWeek === dayOfWeek && s.startTime === startTime)
  if (index === -1) {
    form.value.availabilitySlots.push({ dayOfWeek, startTime, duration: 60 })
  } else {
    form.value.availabilitySlots.splice(index, 1)
  }
}

// Aceasta este funcția "magică" pe care o vom apela din Register
const submitProfile = async (overrideEmail?: string) => {
  try {
    const result = await mutate({
      email: overrideEmail || form.value.email,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      phoneNumber: form.value.phoneNumber,
      availabilitySlots: form.value.availabilitySlots,
      type: props.role === 'Student' ? UserRole.User : UserRole.User,
    })
    emit('success', result)
    return result
  } catch (err) {
    emit('error', err)
    throw err
  }
}

// Expunem funcția și datele către exterior
defineExpose({ submitProfile, form, loading })
</script>

<template>
  <div class="space-y-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-if="!initialEmail" class="space-y-2 md:col-span-2">
        <label class="text-[10px] font-bold text-zinc-500 uppercase ml-1">Email Profil</label>
        <input v-model="form.email" type="email" class="auth-box-input" placeholder="email@student.ro" />
      </div>

      <div class="space-y-2">
        <label class="text-[10px] font-bold text-zinc-500 uppercase ml-1">Prenume</label>
        <input v-model="form.firstName" type="text" class="auth-box-input" placeholder="Andrei" />
      </div>

      <div class="space-y-2">
        <label class="text-[10px] font-bold text-zinc-500 uppercase ml-1">Nume</label>
        <input v-model="form.lastName" type="text" class="auth-box-input" placeholder="Popescu" />
      </div>

      <div class="space-y-2 md:col-span-2">
        <label class="text-[10px] font-bold text-zinc-500 uppercase ml-1">Telefon</label>
        <input v-model="form.phoneNumber" type="tel" class="auth-box-input" placeholder="07xx xxx xxx" />
      </div>
    </div>

    <div v-if="role === 'Student'" class="pt-8 border-t border-zinc-800/40 space-y-6">
      <div>
        <h3 class="text-lg font-bold text-[#c5a47e] uppercase italic tracking-tighter">Disponibilitate</h3>
        <p class="text-zinc-500 text-[11px] uppercase tracking-widest">Selectează orele pentru cursuri</p>
      </div>
      <TimeSlots :availabilitySlots="form.availabilitySlots" @toggle="toggleSlot" />
    </div>
  </div>
</template>
