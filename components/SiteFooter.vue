<template>
  <footer class="relative z-10 border-t border-white/10 bg-[rgba(5,5,16,0.68)] backdrop-blur-sm">
    <div class="mx-auto max-w-7xl px-6 py-12 lg:px-10">
      <div class="grid gap-10 md:grid-cols-2 xl:grid-cols-[1.2fr_1fr_1fr_auto]">
        <div class="space-y-4">
          <div class="inline-flex items-center gap-3">
            <span class="relative flex h-9 w-9 items-center justify-center">
              <svg viewBox="0 0 40 40" fill="none" class="absolute inset-0 h-full w-full opacity-30" aria-hidden="true">
                <circle cx="20" cy="20" r="18" stroke="#FBBF24" stroke-width="0.5" />
              </svg>
              <svg viewBox="0 0 24 24" class="relative h-4 w-4" fill="none" aria-hidden="true">
                <polygon
                  points="12,2 15,9 22,9 16.5,13.5 18.5,21 12,17 5.5,21 7.5,13.5 2,9 9,9"
                  fill="url(#footer-star)"
                  opacity="0.95"
                />
                <defs>
                  <linearGradient id="footer-star" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#FBBF24" />
                    <stop offset="100%" stop-color="#A855F7" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <span class="font-display text-base tracking-[0.2em] text-white">Stellara</span>
          </div>

          <p class="max-w-xs text-sm leading-6 text-slate-400">
            Votre thème astral personnel, calculé à la minute près. Une expérience astrologique unique et profonde.
          </p>
        </div>

        <div>
          <h3 class="mb-4 text-xs uppercase tracking-[0.3em] text-slate-500">Navigation</h3>
          <ul class="space-y-3">
            <li>
              <NuxtLink to="/" class="text-sm text-slate-400 transition hover:text-white">Accueil</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/#benefits" class="text-sm text-slate-400 transition hover:text-white">Pourquoi Stellara</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/#how-it-works" class="text-sm text-slate-400 transition hover:text-white">Comment ça marche</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/#pricing" class="text-sm text-slate-400 transition hover:text-white">Tarifs</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/horoscope-du-jour" class="text-sm text-slate-400 transition hover:text-white">Horoscope du jour</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/lexique" class="text-sm text-slate-400 transition hover:text-white">Lexique astrologique</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/blog" class="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
                <span>Blog</span>
                <span class="inline-flex items-center gap-1 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-emerald-200">
                  <span class="h-1.5 w-1.5 rounded-full bg-emerald-300" aria-hidden="true" />
                  Nouveau
                </span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="mb-4 text-xs uppercase tracking-[0.3em] text-slate-500">Légal</h3>
          <ul class="space-y-3">
            <li>
              <NuxtLink to="/mentions-legales" class="text-sm text-slate-400 transition hover:text-white">Mentions légales</NuxtLink>
            </li>
            <li>
              <a href="#" class="text-sm text-slate-400 transition hover:text-white">Politique de confidentialité</a>
            </li>
            <li>
              <a href="#" class="text-sm text-slate-400 transition hover:text-white">CGV</a>
            </li>
            <li>
              <a href="mailto:contact.stellara@sassify.fr" class="text-sm text-slate-400 transition hover:text-white">Contact</a>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="mb-4 text-xs uppercase tracking-[0.3em] text-slate-500">Nous suivre</h3>
          <div class="flex flex-col gap-3">
            <a href="#" class="inline-flex items-center gap-3 text-sm text-slate-400 transition hover:text-white" aria-label="Instagram">
            <span class="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:border-white/20 hover:bg-white/10"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg></span>
              Instagram
            </a>

            <a href="#" class="inline-flex items-center gap-3 text-sm text-slate-400 transition hover:text-white" aria-label="TikTok">
              <span class="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:border-white/20 hover:bg-white/10">
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.77a8.16 8.16 0 004.77 1.52V6.84a4.85 4.85 0 01-1-.15z" />
                </svg>
              </span>
              TikTok
            </a>
          </div>
        </div>
      </div>

      <div class="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
        <p class="text-center text-sm text-slate-500 sm:text-left">© {{ year }} Stellara - Tous droits réservés.</p>
        <p class="text-center text-xs text-slate-600 sm:text-right">Construit avec 💖 sous les étoiles ✨</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>
