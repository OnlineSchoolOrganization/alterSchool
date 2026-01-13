<template>
  <div class="min-h-screen bg-[#0a0a0b] text-zinc-100 font-sans selection:bg-[#c5a47e]/30">
    
    <div class="w-full px-4 sm:px-8 md:px-16 lg:px-24 py-12 md:py-20 flex flex-col gap-24 md:gap-32">

      <section class="flex flex-col gap-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
          <div class="space-y-4 text-center md:text-left">
            <h1 class="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
              Profil <span class="text-[#c5a47e]">Profesor</span>
            </h1>
            <div class="flex flex-wrap justify-center md:justify-start items-center gap-4 text-zinc-400">
              <div class="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] font-black uppercase">
                <span class="w-2 h-2 bg-[#c5a47e] rounded-full animate-pulse"></span>
                {{ userData.targetClass }}
              </div>
              <div class="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] font-black uppercase">
                {{ userData.targetCurriculum }}
              </div>
            </div>
          </div>
          
          <button @click="showUserAvailability = !showUserAvailability" 
            class="group flex items-center justify-center gap-3 bg-zinc-900 hover:bg-[#c5a47e] transition-all px-8 py-5 rounded-2xl border border-white/5 hover:border-[#c5a47e]">
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

      <section class="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20 items-start">
        <div class="lg:col-span-3 flex justify-center lg:justify-start">
          <div class="relative group">
            <div class="absolute -inset-1 bg-gradient-to-r from-[#c5a47e] to-[#8a6d4d] rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div class="relative w-56 h-56 md:w-72 md:h-72 rounded-[2.5rem] bg-zinc-900 border border-white/10 flex items-center justify-center text-7xl font-serif text-[#c5a47e] shadow-2xl">
              {{ teacherData.initials }}
            </div>
          </div>
        </div>
        
        <div class="lg:col-span-9 space-y-10 text-center lg:text-left">
          <div class="space-y-4">
            <h2 class="text-5xl md:text-8xl font-black tracking-tight text-white leading-none">{{ teacherData.name }}</h2>
            <div class="flex flex-wrap justify-center lg:justify-start gap-3">
              <span v-for="tag in ['Expert Mentor', 'Doctorat', '15+ Ani Exp']" :key="tag" class="text-[10px] font-black uppercase tracking-[0.2em] text-[#c5a47e]/70 border-b border-[#c5a47e]/20 pb-1">
                {{ tag }}
              </span>
            </div>
          </div>
          
          <p class="text-xl md:text-3xl text-zinc-400 leading-relaxed font-light max-w-5xl">
            {{ teacherData.bio }}
          </p>
          
          <div class="flex flex-wrap justify-center lg:justify-start gap-16 pt-6">
            <div v-for="stat in teacherData.stats" :key="stat.label" class="space-y-2">
              <span class="text-[11px] uppercase tracking-[0.4em] text-zinc-600 font-black block">{{ stat.label }}</span>
              <span class="text-4xl font-bold text-white tracking-tighter">{{ stat.value }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="space-y-12">
        <div class="flex flex-col md:flex-row md:items-center gap-6">
          <h3 class="text-2xl md:text-4xl font-black uppercase tracking-tighter">Grupe <span class="text-[#c5a47e]">Active</span></h3>
          <div class="h-px flex-1 bg-white/10"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10">
          <div v-for="group in teacherData.activeGroups" :key="group.id" 
            class="group relative bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-10 flex flex-col justify-between hover:bg-zinc-900 hover:border-[#c5a47e]/40 transition-all duration-500 overflow-hidden">
            
            <div v-if="group.promo" class="absolute top-0 right-0">
              <div class="bg-[#c5a47e] text-[#0a0a0b] text-[10px] font-black px-6 py-2 rounded-bl-2xl uppercase tracking-tighter">
                {{ group.promo.badgeText }}
              </div>
            </div>

            <div class="space-y-8">
              <div class="space-y-2 pt-4">
                <h4 class="text-3xl font-bold text-white group-hover:text-[#c5a47e] transition-colors leading-none">{{ group.name }}</h4>
                <div class="flex items-center gap-3">
                  <div class="flex gap-1.5">
                    <div v-for="n in group.capacity" :key="n" :class="n <= group.filled ? 'bg-[#c5a47e]' : 'bg-zinc-800'" class="w-2.5 h-2.5 rounded-full"></div>
                  </div>
                  <span class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{{ group.capacity - group.filled }} locuri libere</span>
                </div>
              </div>

              <p v-if="group.promo" class="text-xs text-[#c5a47e] font-bold italic bg-white/5 p-4 rounded-xl border border-white/5">
                "{{ group.promo.description }}"
              </p>

              <div class="space-y-4">
                <div v-for="(session, sIdx) in group.sessions" :key="sIdx" 
                  class="flex justify-between items-center py-4 border-b border-white/5 last:border-0">
                  <span class="text-xs font-black text-zinc-500 uppercase tracking-widest">{{ session.day }}</span>
                  <span class="text-base font-bold text-white italic">{{ session.time }}</span>
                </div>
              </div>
            </div>

            <div class="mt-12 flex items-center justify-between gap-6">
              <div class="flex flex-col">
                <span v-if="group.promo?.oldPrice" class="text-xs text-zinc-600 line-through font-bold">{{ group.promo.oldPrice }} RON</span>
                <div class="flex items-baseline gap-1">
                  <span class="text-4xl font-black text-[#c5a47e]">{{ group.price }}</span>
                  <span class="text-[10px] text-zinc-600 uppercase font-black">RON/șed</span>
                </div>
              </div>
              <button class="bg-white text-black px-8 py-4 rounded-2xl text-xs font-black uppercase hover:bg-[#c5a47e] transition-all transform active:scale-95 shadow-xl shadow-white/5">
                Rezervă
              </button>
            </div>
          </div>
        </div>
      </section>

      <section class="space-y-12">
        <div class="flex items-center gap-8">
          <div class="h-px flex-1 bg-white/10"></div>
          <h3 class="text-2xl md:text-4xl font-black uppercase tracking-tighter text-zinc-600 italic">Propune <span class="text-zinc-800">Grup Nou</span></h3>
          <div class="h-px flex-1 bg-white/10"></div>
        </div>

        <div class="bg-[#111113] border border-white/5 rounded-[4rem] p-10 md:p-20 space-y-20">
          <div class="max-w-3xl space-y-6">
            <h4 class="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight italic">Nu se potrivește programul tău?</h4>
            <p class="text-zinc-500 leading-relaxed text-xl font-medium">
              Solicită deschiderea unei grupe noi. Vom folosi <span class="text-[#c5a47e]">orarul de disponibilitate</span> pe care l-ai definit anterior pentru a face matching-ul.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14">
            <div v-for="plan in teacherData.pricingPlans" :key="plan.type" 
              class="flex flex-col gap-10 p-12 bg-zinc-900/40 border border-white/5 rounded-[3rem] hover:border-[#c5a47e]/30 transition-all duration-500 group">
              
              <div class="space-y-3">
                <span class="text-[11px] font-black text-[#c5a47e] uppercase tracking-[0.4em]">{{ plan.label }}</span>
                <div class="text-6xl font-black text-white group-hover:scale-105 transition-transform origin-left">
                  {{ plan.amount }}<span class="text-xl text-zinc-700 font-bold italic">/sed</span>
                </div>
              </div>
              
              <ul class="space-y-5 flex-1 border-t border-white/5 pt-10">
                <li v-for="b in plan.benefits" :key="b" class="flex gap-4 text-sm text-zinc-500 font-medium">
                  <span class="text-[#c5a47e] font-black italic">/</span> {{ b }}
                </li>
              </ul>

              <button class="w-full py-6 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:bg-[#c5a47e] hover:text-[#0a0a0b] hover:border-[#c5a47e] transition-all">
                Solicită acest tarif
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

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
    { label: "Succes BAC", value: "100%" },
    { label: "Mentorați", value: "450+" }
  ],
  activeGroups: [
    { 
      id: 1, name: "Intensiv Algebră", 
      sessions: [{ day: 'Luni', time: '15:00' }, { day: 'Miercuri', time: '17:00' }],
      filled: 4, capacity: 5, price: 65,
      promo: {
        badgeText: "Last Spot -30%",
        description: "Preț redus permanent pentru ocuparea ultimului loc.",
        oldPrice: 95
      }
    },
    { 
      id: 2, name: "Analiză & Geometrie", 
      sessions: [{ day: 'Marți', time: '16:00' }, { day: 'Vineri', time: '15:30' }],
      filled: 2, capacity: 5, price: 110,
      promo: {
        badgeText: "New Student",
        description: "Primele 3 ședințe cu discount de bun venit.",
        oldPrice: 130
      }
    },
    { 
      id: 3, name: "Grup Olimpiadă", 
      sessions: [{ day: 'Joi', time: '18:00' }, { day: 'Sâmbătă', time: '10:00' }],
      filled: 1, capacity: 3, price: 140,
      promo: {
        badgeText: "Bonus PDF",
        description: "Include acces la platforma de resurse video.",
      }
    }
  ],
  pricingPlans: [
    { type: 'Grup', label: 'Grup Standard (3-5)', amount: 95, benefits: ['Materiale studiu incluse', 'Grup de suport 24/7', 'Feedback săptămânal'] },
    { type: 'Duo', label: 'Grup Premium (2)', amount: 155, benefits: ['Focus dublu', 'Corectură teme live', 'Ritm adaptabil'] },
    { type: 'Solo', label: 'Individual (1-1)', amount: 220, benefits: ['Prioritate totală', 'Materiale personalizate', 'Program flexibil'] }
  ]
});
</script>

<style scoped>
.expand-enter-active, .expand-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 1000px;
}
.expand-enter-from, .expand-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>