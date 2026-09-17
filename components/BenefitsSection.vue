<template>
  <section id="benefits" class="section-transition scroll-mt-24 py-20 sm:py-24">
    <div class="section-shell">
    <div class="mx-auto mb-16 max-w-3xl text-center">
      <p class="eyebrow reveal-on-scroll mb-4">Pourquoi Stellara ?</p>
      <h2 class="section-title reveal-on-scroll mx-auto max-w-3xl">
        L'astrologie de précision, accessible à tous
      </h2>
      <p class="reveal-on-scroll mx-auto mt-6 max-w-2xl text-lg text-slate-300">
        Contrairement aux horoscopes génériques, votre
        <NuxtLink to="/theme-astral-ia" class="text-amber-400 underline decoration-amber-400/40 underline-offset-4 transition hover:text-amber-300">
          thème astral IA
        </NuxtLink>
        révèle qui vous êtes vraiment.
      </p>
    </div>

    <div class="grid gap-6 md:grid-cols-3">
      <article
        v-for="benefit in benefits"
        :key="benefit.title"
        class="reveal-on-scroll glass-panel group relative overflow-hidden px-8 py-10 text-center transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_32px_80px_rgba(124,58,237,0.25)]"
        :style="`animation-delay: ${benefit.delay}ms`"
      >
        <div
          class="pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          :class="benefit.glow"
        />
        <div
          class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        <div
          class="relative z-10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-amber-400/30 bg-amber-400/10 text-4xl transition-all duration-500 group-hover:border-amber-400/60 group-hover:bg-amber-400/20 group-hover:shadow-[0_0_40px_rgba(251,191,36,0.35)]"
        >
          {{ benefit.icon }}
        </div>

        <div
          class="pointer-events-none absolute left-1/2 top-[72px] h-24 w-24 -translate-x-1/2 rounded-full border border-amber-400/10 opacity-0 transition-all duration-500 group-hover:scale-125 group-hover:opacity-100"
        />

        <h3 class="relative z-10 font-display text-2xl text-white">
          {{ benefit.title }}
        </h3>
        <p class="relative z-10 mt-4 text-base leading-8 text-slate-400">
          {{ benefit.description }}
        </p>
      </article>
    </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const benefits = [
  {
    icon: '✨',
    glow: 'from-amber-500/20 to-amber-400/5',
    title: 'Rapport 100% personnalisé',
    description: 'Basé sur votre date, heure et lieu exact de naissance. Chaque rapport est unique — comme vous.',
    delay: 0,
  },
  {
    icon: '🔭',
    glow: 'from-violet-500/20 to-purple-400/5',
    title: 'Stellara astro-experte',
    description: 'Stellara analyse la position combinée de 10+ planètes et 12 maisons pour une lecture d\'une précision inégalée.',
    delay: 100,
  },
  {
    icon: '⚡',
    glow: 'from-blue-500/20 to-cyan-400/5',
    title: 'Résultats en 30 secondes',
    description: 'Instantané, sans inscription obligatoire. Entrez vos données et recevez votre analyse complète en quelques secondes.',
    delay: 200,
  },
]
</script>
