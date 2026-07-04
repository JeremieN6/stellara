<template>
  <section class="min-h-screen pb-16 pt-20 sm:pb-20 sm:pt-24">
    <div class="section-shell">
      <div class="mx-auto max-w-4xl">
        <header class="mb-8 text-center sm:mb-10">
          <p class="eyebrow mb-3">Horoscope quotidien</p>
          <h1 class="font-display text-4xl text-white sm:text-6xl">
            Votre <span class="text-amber-300">horoscope du jour</span>
          </h1>
          <p class="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Selectionnez votre signe pour obtenir une lecture astrologique rapide: amour, travail,
            energie et conseil du jour.
          </p>
        </header>

        <div class="glass-panel border border-white/15 p-6 sm:p-8">
          <div class="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <label class="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Signe astrologique</label>
              <select v-model="selectedSign" class="form-input" @change="saveSignPreference">
                <option v-for="s in signs" :key="s.value" :value="s.value">
                  {{ s.label }}
                </option>
              </select>
            </div>
            <button
              type="button"
              class="cta-button w-full justify-center sm:w-auto"
              :disabled="loading"
              :class="loading ? 'cursor-not-allowed opacity-60' : ''"
              @click="fetchHoroscope"
            >
              <span>{{ loading ? 'Generation...' : 'Voir mon horoscope' }}</span>
            </button>
          </div>

          <p class="mt-3 text-xs text-slate-500">
            Mis en cache par jour et par signe pour une reponse instantanée.
          </p>

          <div v-if="errorMessage" class="mt-6 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {{ errorMessage }}
          </div>

          <div v-if="horoscope" class="mt-8 space-y-5">
            <div class="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <h2 class="font-display text-2xl text-white">
                  {{ signLabel(horoscope.sign) }} - {{ formattedDate(horoscope.date) }}
                </h2>
                <span class="rounded-full border border-amber-300/25 bg-amber-400/10 px-3 py-1 text-xs uppercase tracking-[0.14em] text-amber-200">
                  Source réelle
                </span>
              </div>
              <p class="mt-3 text-xs uppercase tracking-[0.16em] text-slate-400">
                Lecture quotidienne par signe
              </p>
              <p class="mt-4 text-sm leading-7 text-slate-200">{{ horoscope.readingFr }}</p>
            </div>

            <div class="rounded-2xl border border-amber-300/30 bg-amber-400/10 p-5">
              <p class="text-xs uppercase tracking-[0.16em] text-amber-200">Orbite Premium</p>
              <h3 class="mt-3 font-display text-2xl text-white sm:text-3xl">Lecture approfondie</h3>
              <p class="mt-3 text-sm leading-7 text-slate-200">
                Ajoutez une lecture plus detaillee avec vos transits personnels, synchronisée avec votre compte.
              </p>

              <div class="mt-5 flex flex-wrap items-center gap-3">
                <a
                  href="/api/stripe/create-checkout-session?productType=orbite_premium&billingInterval=monthly"
                  class="cta-button w-full justify-center sm:w-auto"
                >
                  Aller plus loin avec Orbite Premium - 19EUR/mois
                </a>
                <NuxtLink to="/account" class="secondary-button w-full justify-center sm:w-auto">
                  Verifier mon statut
                </NuxtLink>
              </div>
            </div>

            <!-- <p class="text-xs text-slate-500">
              Source: {{ horoscope.provider }} ({{ horoscope.source }}). {{ horoscope.disclaimer }}
            </p> -->
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Horoscope du jour - Stellara',
  description: 'Horoscope du jour gratuit par signe solaire et aperçu premium basé sur vos transits personnels.',
})

type SignValue =
  | 'belier'
  | 'taureau'
  | 'gemeaux'
  | 'cancer'
  | 'lion'
  | 'vierge'
  | 'balance'
  | 'scorpion'
  | 'sagittaire'
  | 'capricorne'
  | 'verseau'
  | 'poissons'

interface HoroscopeResponse {
  date: string
  sign: SignValue
  reading: string
  readingFr: string
  provider: 'api_ninjas'
  source: 'api' | 'cache'
  disclaimer: string
}

const signs: Array<{ value: SignValue; label: string }> = [
  { value: 'belier', label: 'Belier' },
  { value: 'taureau', label: 'Taureau' },
  { value: 'gemeaux', label: 'Gemeaux' },
  { value: 'cancer', label: 'Cancer' },
  { value: 'lion', label: 'Lion' },
  { value: 'vierge', label: 'Vierge' },
  { value: 'balance', label: 'Balance' },
  { value: 'scorpion', label: 'Scorpion' },
  { value: 'sagittaire', label: 'Sagittaire' },
  { value: 'capricorne', label: 'Capricorne' },
  { value: 'verseau', label: 'Verseau' },
  { value: 'poissons', label: 'Poissons' },
]

const selectedSign = ref<SignValue>('belier')
const loading = ref(false)
const horoscope = ref<HoroscopeResponse | null>(null)
const errorMessage = ref('')

const signLabelMap = new Map(signs.map((item) => [item.value, item.label]))

function signLabel(value: SignValue): string {
  return signLabelMap.get(value) || value
}

function saveSignPreference() {
  if (!import.meta.client) return
  localStorage.setItem('Stellara_sign', selectedSign.value)
}

function loadSignPreference() {
  if (!import.meta.client) return
  const saved = localStorage.getItem('Stellara_sign')
  if (saved && signs.some((item) => item.value === saved)) {
    selectedSign.value = saved as SignValue
  }
}

function formattedDate(date: string): string {
  const dt = new Date(`${date}T12:00:00`)
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }).format(dt)
}

async function fetchHoroscope() {
  loading.value = true
  errorMessage.value = ''

  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Paris'
    const res = await $fetch('/api/horoscope-today', {
      query: {
        sign: selectedSign.value,
        lang: 'fr',
        timezone: timeZone,
      },
    })
    horoscope.value = res as HoroscopeResponse
    saveSignPreference()
  } catch (error) {
    console.error(error)
    const apiMessage =
      typeof error === 'object' && error
        ? ((error as { data?: { statusMessage?: string }; statusMessage?: string }).data?.statusMessage
            || (error as { statusMessage?: string }).statusMessage)
        : ''

    errorMessage.value =
      typeof apiMessage === 'string' && apiMessage.trim()
        ? apiMessage
        : 'Impossible de recuperer votre horoscope pour le moment. Reessayez dans quelques instants.'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  loadSignPreference()
  await fetchHoroscope()
})
</script>
