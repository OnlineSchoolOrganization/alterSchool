<template>
  <div class="min-h-screen bg-[#0a0a0b] text-zinc-100 font-sans selection:bg-[#c5a47e]/30">
    
    <nav class="w-full px-6 sm:px-12 py-6 border-b border-white/5 flex justify-between items-center bg-[#0a0a0b]/80 backdrop-blur-md sticky top-0 z-50">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-[#c5a47e] rounded-lg flex items-center justify-center font-black text-[#0a0a0b]">A</div>
        <span class="text-sm font-black uppercase tracking-tighter">alter<span class="text-[#c5a47e]">School</span></span>
      </div>
      <div class="hidden md:flex gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">
        <a href="#" class="hover:text-[#c5a47e] transition-colors">Cursuri</a>
        <a href="#" class="text-white border-b border-[#c5a47e]">Profesori</a>
        <a href="#" class="hover:text-[#c5a47e] transition-colors">Resurse</a>
      </div>
      <button class="text-xs font-bold px-5 py-2 bg-white/5 border border-white/10 rounded-full">Contul Meu</button>
    </nav>

    <main class="w-full px-4 sm:px-8 md:px-16 lg:px-24 py-16 md:py-24 space-y-16">
      
      <section class="space-y-6 max-w-4xl">
        <h1 class="text-5xl md:text-7xl font-black tracking-tighter leading-none">
          Echipa de <span class="text-[#c5a47e]">Mentori</span>
        </h1>
        <p class="text-zinc-500 text-lg md:text-xl font-medium leading-relaxed">
          Profesori selectați riguros pentru <span class="text-white">{{ userData.targetCurriculum }}</span>, disponibili în intervalele tale.
        </p>
      </section>

      <section class="grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-12">
        <div 
          v-for="teacher in teachers" 
          :key="teacher.id"
          class="group relative bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row gap-8 hover:bg-zinc-900/60 hover:border-[#c5a47e]/30 transition-all duration-500"
        >
          <div class="flex flex-col items-center md:items-start gap-6">
            <div class="relative">
              <div class="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] bg-zinc-800 border border-white/10 flex items-center justify-center text-4xl font-serif text-[#c5a47e] group-hover:scale-105 transition-transform duration-500">
                {{ teacher.initials }}
              </div>
              <div class="absolute -bottom-2 -right-2 bg-green-500 w-5 h-5 rounded-full border-4 border-[#121214]"></div>
            </div>
            
            <div class="space-y-4 w-full">
              <div v-for="stat in teacher.stats" :key="stat.label" class="flex justify-between md:flex-col md:justify-start gap-1 border-b border-white/5 md:border-0 pb-2 md:pb-0">
                <span class="text-[10px] uppercase text-zinc-600 font-black tracking-widest">{{ stat.label }}</span>
                <span class="text-sm font-bold text-zinc-300">{{ stat.value }}</span>
              </div>
            </div>
          </div>

          <div class="flex-1 flex flex-col justify-between space-y-6">
            <div class="space-y-4 text-center md:text-left">
              <div class="flex flex-wrap justify-center md:justify-start gap-2">
                <span v-for="tag in teacher.tags" :key="tag" class="px-2 py-0.5 bg-[#c5a47e]/10 text-[#c5a47e] text-[9px] font-black uppercase rounded border border-[#c5a47e]/20">
                  {{ tag }}
                </span>
              </div>
              
              <h2 class="text-3xl md:text-4xl font-black text-white group-hover:text-[#c5a47e] transition-colors">
                {{ teacher.name }}
              </h2>
              
              <p class="text-zinc-400 text-sm md:text-base leading-relaxed line-clamp-3 font-medium">
                {{ teacher.bio }}
              </p>
            </div>

            <div class="pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-6">
              <div class="flex flex-col">
                <span class="text-[10px] uppercase text-zinc-600 font-black tracking-widest">Tarif pornire</span>
                <div class="flex items-baseline gap-1">
                  <span class="text-2xl font-black text-white">{{ teacher.minPrice }} RON</span>
                  <span class="text-[10px] text-zinc-500 uppercase font-bold">/șed.</span>
                </div>
              </div>

              <router-link 
                to="/teacher" 
                class="flex-1 md:flex-none text-center px-8 py-4 bg-white text-black text-xs font-black uppercase rounded-2xl hover:bg-[#c5a47e] transition-all"
              >
                Vezi Profil Complet
              </router-link>
            </div>
          </div>
        </div>
      </section>

    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const userData = ref({
  targetCurriculum: "Mate-Info BAC",
  targetClass: "Clasa a 12-a"
});

const teachers = ref([
  {
    id: 1,
    name: "Alexandru Sterling",
    initials: "AS",
    bio: "Doctor în matematică cu 15 ani de experiență în pregătirea elevilor pentru examenele de stat și olimpiade naționale.",
    minPrice: 90,
    tags: ["Doctorat", "Top Mentor", "Olimpiade"],
    stats: [
      { label: "Experiență", value: "15 ani" },
      { label: "Rată Succes", value: "100%" }
    ]
  },
  {
    id: 2,
    name: "Elena Popescu",
    initials: "EP",
    bio: "Specializată în Fizică și Analiză Matematică. Abordarea mea este bazată pe vizualizarea conceptelor abstracte prin experimente digitale.",
    minPrice: 85,
    tags: ["Fizică", "Digital Learning", "Răbdare"],
    stats: [
      { label: "Experiență", value: "8 ani" },
      { label: "Elevi", value: "120+" }
    ]
  },
  {
    id: 3,
    name: "Victor Ionescu",
    initials: "VI",
    bio: "Fost corector de examene naționale. Cunosc exact punctele cheie urmărite în baremele de corectare.",
    minPrice: 100,
    tags: ["Ex-Corector", "Mate-Info", "Tehnici Exam"],
    stats: [
      { label: "Vechime", value: "20 ani" },
      { label: "Rating", value: "5.0/5" }
    ]
  },
  {
    id: 4,
    name: "Maria Dumitrescu",
    initials: "MD",
    bio: "Pregătire intensivă pentru admiterea la Poli și Universitate. Focus pe rezolvări rapide și logică aplicată.",
    minPrice: 120,
    tags: ["Admitere", "Inginerie", "Fast-Track"],
    stats: [
      { label: "Experiență", value: "10 ani" },
      { label: "Succes Admitere", value: "98%" }
    ]
  },
  {
    id: 5,
    name: "Cristian Stan",
    initials: "CS",
    bio: "Mentor pasionat de informatică și algoritmică. Pregătesc elevi pentru performanță în C++ și Python.",
    minPrice: 95,
    tags: ["Olimpiadă Info", "C++ Expert", "Modern"],
    stats: [
      { label: "Proiecte", value: "50+" },
      { label: "Vechime", value: "6 ani" }
    ]
  },
  {
    id: 6,
    name: "Andreea Voicu",
    initials: "AV",
    bio: "Specialistă în Științe Exacte pentru curriculum internațional (IB/AP). Predare bilingvă română-engleză.",
    minPrice: 150,
    tags: ["IB/AP Specialist", "Bilingv", "Premium"],
    stats: [
      { label: "Certificări", value: "IB Int" },
      { label: "Review-uri", value: "85" }
    ]
  }
]);
</script>

<style scoped>
/* Scroll fluid si fin pentru intreaga pagina */
html {
  scroll-behavior: smooth;
}

/* Efect de fade-in la hover pe carduri */
.group:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px -20px rgba(197, 164, 126, 0.15);
}
</style>