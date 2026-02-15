<template>
  <div class="flex flex-col lg:flex-row min-h-screen bg-[#0a0a0b] text-zinc-100 font-sans">
    
    <aside class="hidden lg:flex lg:w-1/3 h-screen sticky top-0 bg-[#111113] border-r border-zinc-800/50 p-12 flex-col justify-between">
      <div class="space-y-1">
        <span class="text-3xl font-serif font-bold text-[#c5a47e] italic tracking-tight">Alter</span>
        <div class="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-medium">Portal Academic</div>
      </div>

      <div class="space-y-6">
        <h1 class="text-2xl font-light text-zinc-100 leading-tight">
          Sistem integrat de <br/>
          <span class="text-[#c5a47e] italic font-serif">management școlar.</span>
        </h1>
        <div class="h-[1px] w-10 bg-zinc-800"></div>
        <p class="text-zinc-500 text-sm leading-relaxed max-w-xs">
          O interfață rafinată pentru performanță academică ridicată.
        </p>
      </div>

      <div class="text-zinc-700 text-[10px] uppercase tracking-widest font-bold">
        © 2026 Alter School
      </div>
    </aside>

    <main class="flex-1 flex flex-col min-h-screen overflow-y-auto">
      <div class="flex-1 flex items-center justify-center p-6 p-12">
        <div class="w-full max-w-5xl flex items-center justify-center">
          <slot />
        </div>
      </div>
    </main>

  </div>
</template>