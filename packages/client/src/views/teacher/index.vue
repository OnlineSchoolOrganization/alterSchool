<template>
  <div class="min-h-screen bg-[#0a0a0b] text-zinc-100 font-sans selection:bg-[#c5a47e]/30">
    
    <div class="w-full px-4 sm:px-8 md:px-16 lg:px-24 py-12 md:py-20 flex flex-col gap-24 md:gap-32">

      <section class="flex flex-col gap-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
          <div class="space-y-4">
            <h1 class="text-4xl md:text-6xl font-black tracking-tighter italic uppercase italic">
              Profil <span class="text-[#c5a47e]">Profesor</span>
            </h1>
            <div class="flex flex-wrap items-center gap-4 text-zinc-400">
              <div class="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-xs font-bold">
                <span class="w-2 h-2 bg-[#c5a47e] rounded-full animate-pulse"></span>
                {{ userData.targetClass }}
              </div>
              <div class="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-xs font-bold">
                {{ userData.targetCurriculum }}
              </div>
            </div>
          </div>
          
          <button @click="showUserAvailability = !showUserAvailability" 
            class="group flex items-center gap-3 bg-zinc-900 hover:bg-[#c5a47e] transition-all px-6 py-4 rounded-2xl border border-white/5 hover:border-[#c5a47e]">
            <span class="text-xs font-black uppercase tracking-widest group-hover:text-[#0a0a0b]">
              {{ showUserAvailability ? 'Închide Orarul' : 'Verifică Disponibilitatea Ta' }}
            </span>
            <svg :class="{'rotate-180': showUserAvailability}" class="w-4 h-4 transition-transform group-hover:text-[#0a0a0b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <Transition name="expand">
          <div v-if="showUserAvailability" class="overflow-hidden">
            <div class="py-6">
              <TimeSlots :availabilitySlots="userData.availabilitySlots" />
            </div>
          </div>
        </Transition>
      </section>

      <section class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div class="lg:col-span-3 flex justify-center lg:justify-start">
          <div class="relative group">
            <div class="absolute -inset-1 bg-gradient-to-r from-[#c5a47e] to-[#8a6d4d] rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div class="relative w-48 h-48 md:w-64 md:h-64 rounded-[2.2rem] bg-zinc-900 border border-white/10 flex items-center justify-center text-6xl font-serif text-[#c5a47e]">
              {{ teacherData.initials }}
            </div>
          </div>
        </div>
        
        <div class="lg:col-span-9 space-y-8 text-center lg:text-left">
          <div class="space-y-2">
            <h2 class="text-5xl md:text-7xl font-black tracking-tight text-white">{{ teacherData.name }}</h2>
            <p class="text-lg md:text-xl text-zinc-500 font-medium italic">Expert Educator & Mentor</p>
          </div>
          
          <p class="text-lg md:text-2xl text-zinc-400 leading-relaxed font-light max-w-4xl">
            {{ teacherData.bio }}
          </p>
          
          <div class="flex flex-wrap justify-center lg:justify-start gap-12 pt-6">
            <div v-for="stat in teacherData.stats" :key="stat.label" class="space-y-1">
              <span class="text-[11px] uppercase tracking-[0.3em] text-zinc-600 font-black block">{{ stat.label }}</span>
              <span class="text-3xl font-bold text-white">{{ stat.value }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="space-y-12">
        <div class="flex items-center gap-6">
          <h3 class="text-2xl md:text-4xl font-black uppercase tracking-tighter">Grupe <span class="text-[#c5a47e]">Existente</span></h3>
          <div class="h-px flex-1 bg-white/10"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          <div v-for="group in teacherData.activeGroups" :key="group.id" 
            class="group bg-zinc-900/50 border border-white/5 rounded-[2rem] p-8 flex flex-col justify-between hover:bg-zinc-900 hover:border-[#c5a47e]/30 transition-all duration-500">
            
            <div class="space-y-6">
              <div class="flex justify-between items-start">
                <div class="space-y-1">
                  <h4 class="text-2xl font-bold text-white group-hover:text-[#c5a47e] transition-colors">{{ group.name }}</h4>
                  <div class="flex items-center gap-2">
                    <div class="flex gap-1">
                      <div v-for="n in group.capacity" :key="n" :class="n <= group.filled ? 'bg-[#c5a47e]' : 'bg-zinc-800'" class="w-2 h-2 rounded-full"></div>
                    </div>
                    <span class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{{ group.capacity - group.filled }} locuri libere</span>
                  </div>
                </div>
              </div>

              <div class="space-y-3">
                <div v-for="(session, sIdx) in group.sessions" :key="sIdx" 
                  class="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                  <span class="text-xs font-black text-zinc-400 uppercase tracking-widest">{{ session.day }}</span>
                  <span class="text-sm font-bold text-white">{{ session.time }}</span>
                </div>
              </div>
            </div>

            <div class="mt-10 flex items-center justify-between gap-4">
              <div>
                <span class="text-3xl font-black text-[#c5a47e]">{{ group.price }} RON</span>
                <span class="text-[10px] block text-zinc-600 uppercase font-black">ședință 60 min</span>
              </div>
              <button class="bg-white text-black px-6 py-4 rounded-xl text-[10px] font-black uppercase hover:bg-[#c5a47e] transition-colors">
                Înscrie-te
              </button>
            </div>
          </div>
        </div>
      </section>

      <section class="space-y-12">
        <div class="flex items-center gap-6">
          <div class="h-px flex-1 bg-white/10"></div>
          <h3 class="text-2xl md:text-4xl font-black uppercase tracking-tighter text-zinc-500">Solicită <span class="text-zinc-700">Grup Nou</span></h3>
        </div>

        <div class="bg-[#111113] border border-white/5 rounded-[3rem] p-8 md:p-16 space-y-16">
          <div class="max-w-2xl space-y-4">
            <h4 class="text-3xl font-bold">Nu găsești orarul potrivit?</h4>
            <p class="text-zinc-500 leading-relaxed text-lg italic">
              Alege un pachet de mai jos. Vom încerca să configurăm o grupă nouă special pentru tine, folosind disponibilitatea ta deja salvată.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            <div v-for="plan in teacherData.pricingPlans" :key="plan.type" 
              class="flex flex-col gap-8 p-10 bg-zinc-900/40 border border-white/5 rounded-[2.5rem] hover:scale-[1.02] transition-transform duration-500">
              <div class="space-y-2">
                <span class="text-[11px] font-black text-[#c5a47e] uppercase tracking-[0.3em]">{{ plan.label }}</span>
                <div class="text-5xl font-black text-white">{{ plan.amount }}<span class="text-lg text-zinc-600 font-medium">/sed</span></div>
              </div>
              
              <ul class="space-y-4 flex-1">
                <li v-for="b in plan.benefits" :key="b" class="flex gap-3 text-sm text-zinc-400 font-medium">
                  <span class="text-[#c5a47e]">/</span> {{ b }}
                </li>
              </ul>

              <button class="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#c5a47e] hover:text-[#0a0a0b] transition-all">
                Solicită acest tarif
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<style scoped>
/* Animatii si Scroll */
.expand-enter-active, .expand-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 1000px;
}
.expand-enter-from, .expand-leave-to {
  max-height: 0;
  opacity: 0;
}

/* Stiluri pentru lizibilitate imbunatatita pe ecrane mari */
@media (min-width: 1440px) {
  .text-4xl { font-size: 4rem; }
  .text-7xl { font-size: 6rem; }
}

/* Optimize scrollbar for desktop horizontally */
.custom-scrollbar::-webkit-scrollbar { height: 4px; }
</style>

<script setup lang="ts">
import { ref } from 'vue';
import TimeSlots from '@/components/availability/TimeSlots.vue';

const showUserAvailability = ref(false);

const userData = ref({
  targetClass: "Clasa a 12-a",
  targetCurriculum: "Mate-Info BAC",
  availabilitySlots: [
    { dayOfWeek: "MONDAY", startTime: 900, duration: 60 },
    { dayOfWeek: "THURSDAY", startTime: 1020, duration: 60 }
  ]
});

const teacherData = ref({
  name: "Alexander Sterling",
  initials: "AS",
  bio: "Dedicat excelenței în matematică de peste 15 ani. Metodologia mea nu se bazează pe memorare, ci pe construirea unei baze logice solide care permite rezolvarea oricărei probleme de examen.",
  stats: [
    { label: "Experiență", value: "15 ani" },
    { label: "Rată BAC", value: "100%" },
    { label: "Elevi", value: "450+" }
  ],
  activeGroups: [
    { 
      id: 1, name: "Intensiv Algebră", 
      sessions: [{ day: 'Luni', time: '15:00' }, { day: 'Miercuri', time: '17:00' }],
      filled: 4, capacity: 5, price: 95 
    },
    { 
      id: 2, name: "Analiză & Geometrie", 
      sessions: [{ day: 'Marți', time: '16:00' }, { day: 'Vineri', time: '15:30' }],
      filled: 2, capacity: 5, price: 110 
    },
    { 
      id: 3, name: "Grup Excelență", 
      sessions: [{ day: 'Joi', time: '18:00' }, { day: 'Sâmbătă', time: '10:00' }],
      filled: 1, capacity: 3, price: 140 
    }
  ],
  pricingPlans: [
    { type: 'Grup', label: 'Grup Standard', amount: 95, benefits: ['Maxim 5 persoane', 'Suport PDF', 'Grup WhatsApp'] },
    { type: 'Duo', label: 'Grup Premium', amount: 150, benefits: ['Doar 2 persoane', 'Corectură teme live', 'Feedback părinți'] },
    { type: 'Solo', label: 'Individual', amount: 220, benefits: ['1-la-1 personalizat', 'Orar la cerere', 'Materiale VIP'] }
  ]
});
</script>