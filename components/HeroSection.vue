<template>
  <section class="relative flex min-h-screen items-center overflow-hidden px-6 pb-20 pt-12 lg:px-10">
    <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div class="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-violet-600/15 blur-[120px]" />
      <div class="absolute -right-20 top-1/3 h-[400px] w-[400px] rounded-full bg-amber-400/10 blur-[100px]" />
      <div class="absolute -left-20 bottom-0 h-[300px] w-[300px] rounded-full bg-purple-500/10 blur-[80px]" />
    </div>

    <div class="relative z-10 mx-auto w-full max-w-7xl">
      <div class="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div class="space-y-8">
          <div class="inline-flex items-center gap-3 rounded-full border border-amber-400/25 bg-amber-400/5 px-4 py-2">
            <span class="h-2 w-2 animate-pulse rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
            <span class="text-xs font-medium uppercase tracking-[0.35em] text-amber-400/90">Astrologie de précision</span>
          </div>

          <h1 class="font-display text-5xl leading-[1.1] text-white md:text-6xl xl:text-7xl">
            Découvrez ce que les
            <span class="text-shimmer"> étoiles </span>
            révèlent de vous
          </h1>

          <p class="max-w-xl text-lg leading-8 text-slate-300">
            Générez votre rapport natal complet : positions planétaires, maisons astrologiques et analyse personnalisée en quelques secondes.
          </p>

          <div id="rapport" class="flex scroll-mt-24 flex-col gap-4 sm:flex-row sm:items-center">
            <NuxtLink
              to="/rapport"
              class="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_0_40px_rgba(124,58,237,0.5)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_60px_rgba(124,58,237,0.7)]"
              style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #d97706 100%);"
            >
              <svg class="h-5 w-5 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <polygon points="12,2 15,9 22,9 16.5,13.5 18.5,21 12,17 5.5,21 7.5,13.5 2,9 9,9" />
              </svg>
              Obtenir mon thème astral gratuit
            </NuxtLink>

            <NuxtLink
              to="/#benefits"
              class="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm transition-all duration-300 hover:border-white/25 hover:bg-white/10"
            >
              En savoir plus
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </NuxtLink>
          </div>

          <div class="flex flex-wrap items-center gap-6 text-sm text-slate-400">
            <div class="flex items-center gap-2">
              <svg class="h-4 w-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              Calcul natal gratuit
            </div>

            <div class="flex items-center gap-2">
              <svg class="h-4 w-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              Résultats en quelques secondes
            </div>

            <div class="flex items-center gap-2">
              <svg class="h-4 w-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              +12 000 thèmes générés
            </div>
          </div>
        </div>

        <div class="relative flex items-center justify-center">
          <div class="absolute inset-0 scale-150 rounded-full bg-violet-600/10 blur-3xl" />

          <div class="relative animate-drift">
            <svg
              viewBox="0 0 400 400"
              class="h-72 w-72 drop-shadow-[0_0_60px_rgba(168,85,247,0.4)] sm:h-80 sm:w-80 lg:h-96 lg:w-96"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="200" cy="200" r="190" stroke="url(#hero-ring1)" stroke-width="1" opacity="0.6" />
              <circle cx="200" cy="200" r="155" stroke="url(#hero-ring2)" stroke-width="0.8" opacity="0.4" />
              <circle cx="200" cy="200" r="120" stroke="url(#hero-ring1)" stroke-width="0.8" opacity="0.3" />
              <circle cx="200" cy="200" r="80" stroke="url(#hero-ring2)" stroke-width="1" opacity="0.5" />

              <g stroke="rgba(251,191,36,0.15)" stroke-width="0.6">
                <line x1="200" y1="10" x2="200" y2="390" />
                <line x1="10" y1="200" x2="390" y2="200" />
                <line x1="67" y1="67" x2="333" y2="333" />
                <line x1="333" y1="67" x2="67" y2="333" />
                <line x1="30" y1="134" x2="370" y2="266" />
                <line x1="370" y1="134" x2="30" y2="266" />
                <line x1="134" y1="30" x2="266" y2="370" />
                <line x1="266" y1="30" x2="134" y2="370" />
              </g>

              <g
                fill="rgba(251,191,36,0.75)"
                font-size="15"
                font-family="serif"
                text-anchor="middle"
                dominant-baseline="central"
              >
                <text x="200" y="22">♈</text>
                <text x="297" y="50">♉</text>
                <text x="363" y="130">♊</text>
                <text x="376" y="215">♋</text>
                <text x="350" y="305">♌</text>
                <text x="278" y="370">♍</text>
                <text x="200" y="388">♎</text>
                <text x="118" y="370">♏</text>
                <text x="48" y="305">♐</text>
                <text x="24" y="215">♑</text>
                <text x="40" y="130">♒</text>
                <text x="106" y="50">♓</text>
              </g>

              <circle cx="200" cy="125" r="5" fill="#FBBF24" opacity="0.9" />
              <circle cx="265" cy="155" r="4" fill="#A855F7" opacity="0.8" />
              <circle cx="155" cy="260" r="3.5" fill="#60A5FA" opacity="0.7" />
              <circle cx="240" cy="280" r="4" fill="#F472B6" opacity="0.7" />
              <circle cx="142" cy="170" r="3" fill="#34D399" opacity="0.6" />

              <g transform="translate(200, 200)">
                <polygon
                  points="0,-28 7,-9 28,-9 13,5 19,26 0,14 -19,26 -13,5 -28,-9 -7,-9"
                  fill="url(#hero-center)"
                  opacity="0.9"
                />
              </g>

              <defs>
                <linearGradient id="hero-ring1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#FBBF24" stop-opacity="0.8" />
                  <stop offset="50%" stop-color="#A855F7" stop-opacity="0.6" />
                  <stop offset="100%" stop-color="#FBBF24" stop-opacity="0.8" />
                </linearGradient>

                <linearGradient id="hero-ring2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#7C3AED" stop-opacity="0.8" />
                  <stop offset="100%" stop-color="#FBBF24" stop-opacity="0.4" />
                </linearGradient>

                <radialGradient id="hero-center" cx="50%" cy="50%">
                  <stop offset="0%" stop-color="#FBBF24" />
                  <stop offset="100%" stop-color="#F59E0B" />
                </radialGradient>
              </defs>
            </svg>

            <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div class="relative h-52 w-52">
                <div class="animate-hero-orbit absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.9)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-slate-500">
      <span class="text-xs uppercase tracking-[0.3em]">Explorer</span>
      <div class="h-8 w-px animate-pulse bg-gradient-to-b from-transparent via-amber-400/50 to-transparent" />
    </div>
  </section>
</template>
