<template>
  <div class="glass-panel relative overflow-hidden border border-white/15 p-6 sm:p-8">
    <div class="pointer-events-none absolute -top-16 right-0 h-40 w-40 rounded-full bg-violet-500/20 blur-3xl" />
    <p class="eyebrow mb-2">Calculateur gratuit</p>
    <h2 class="font-display text-2xl leading-tight text-white sm:text-3xl">
      Calculer mon signe lunaire
    </h2>
    <p class="mt-2 text-sm leading-6 text-slate-300">
      Entrez votre date, heure et lieu de naissance : le résultat s'affiche instantanément,
      calculé à partir de la position réelle de la Lune ce jour-là.
    </p>

    <Transition name="fade-up" mode="out-in">
      <form v-if="!result" key="form" class="mt-6 space-y-5" @submit.prevent="calculate">
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Date de naissance</label>
            <input v-model="form.birthDate" type="date" class="form-input" required />
          </div>
          <div>
            <label class="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Heure de naissance</label>
            <input v-model="form.birthTime" type="time" class="form-input" required />
          </div>
        </div>
        <p class="text-xs text-slate-500">
          L'heure exacte compte : la Lune change de signe tous les deux à trois jours.
        </p>

        <div class="relative">
          <label class="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Ville de naissance</label>
          <input
            v-model="cityQuery"
            type="text"
            class="form-input pr-10"
            placeholder="Paris, France"
            autocomplete="off"
            required
            @input="debouncedGeoSearch"
          />
          <div v-if="geoLoading" class="absolute right-3 top-[41px]">
            <svg class="h-4 w-4 animate-spin text-slate-500" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>

          <ul v-if="geoResults.length > 0" class="absolute z-20 mt-1 w-full overflow-hidden rounded-2xl border border-white/10 bg-[rgba(10,10,26,0.96)] shadow-[0_8px_32px_rgba(10,10,26,0.6)] backdrop-blur-xl">
            <li
              v-for="r in geoResults"
              :key="r.place_id"
              class="cursor-pointer px-4 py-3 text-sm text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
              @click="selectCity(r)"
            >
              <p class="font-medium text-white">{{ formatGeoPrimary(r) }}</p>
              <p class="mt-0.5 text-xs text-slate-400">{{ formatGeoSecondary(r) }}</p>
            </li>
          </ul>
        </div>

        <p v-if="errorMessage" class="text-sm text-rose-300">{{ errorMessage }}</p>

        <button
          type="submit"
          class="cta-button mt-2 w-full justify-center"
          :disabled="calculating"
          :class="calculating ? 'cursor-not-allowed opacity-60' : ''"
        >
          <svg v-if="calculating" class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span>{{ calculating ? 'Calcul en cours...' : '✦ Calculer mon signe lunaire ✦' }}</span>
        </button>
      </form>

      <div v-else key="result" class="mt-6 text-center">
        <p class="text-xs uppercase tracking-[0.18em] text-slate-400">Votre signe lunaire</p>
        <p class="mt-2 font-display text-3xl text-amber-300 sm:text-4xl">
          Lune en {{ result.moonSign }}
        </p>
        <p class="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-300">
          {{ moonBlurb }}
        </p>
        <div class="mt-6 flex flex-wrap items-center justify-center gap-4">
          <NuxtLink to="/rapport" class="cta-button">
            Obtenir mon thème astral complet
          </NuxtLink>
          <button
            type="button"
            class="secondary-button"
            @click="reset"
          >
            Refaire un calcul
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const form = reactive({
  birthDate: '',
  birthTime: '',
})

const cityQuery = ref('')
const lat = ref<number | null>(null)
const lon = ref<number | null>(null)
const calculating = ref(false)
const errorMessage = ref('')

interface GeoResult {
  place_id: string
  display_name: string
  lat: string
  lon: string
  addresstype?: string
  type?: string
  address?: {
    city?: string
    town?: string
    village?: string
    municipality?: string
    hamlet?: string
    suburb?: string
    county?: string
    state?: string
    postcode?: string
    country?: string
  }
}

const geoResults = ref<GeoResult[]>([])
const geoLoading = ref(false)
let geoTimer: ReturnType<typeof setTimeout> | null = null

const geoAllowedTypes = new Set([
  'city',
  'town',
  'village',
  'municipality',
  'hamlet',
  'suburb',
  'quarter',
])

function debouncedGeoSearch() {
  lat.value = null
  lon.value = null

  if (geoTimer) clearTimeout(geoTimer)
  geoTimer = setTimeout(geoSearch, 350)
}

async function geoSearch() {
  const q = cityQuery.value.trim()
  if (q.length < 2) { geoResults.value = []; return }
  geoLoading.value = true
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=8&addressdetails=1`, {
      headers: { 'Accept-Language': 'fr' },
    })
    const allResults = await res.json() as GeoResult[]
    const preciseResults = allResults.filter((result) => {
      const type = (result.addresstype || result.type || '').toLowerCase()
      return geoAllowedTypes.has(type)
    })

    geoResults.value = preciseResults.length > 0 ? preciseResults.slice(0, 5) : allResults.slice(0, 5)
  } catch {
    geoResults.value = []
  } finally {
    geoLoading.value = false
  }
}

function selectCity(r: GeoResult) {
  lat.value = parseFloat(r.lat)
  lon.value = parseFloat(r.lon)
  cityQuery.value = formatGeoLabel(r)
  geoResults.value = []
}

function formatGeoPrimary(r: GeoResult): string {
  return (
    r.address?.city ||
    r.address?.town ||
    r.address?.village ||
    r.address?.municipality ||
    r.address?.hamlet ||
    r.address?.suburb ||
    r.display_name.split(',')[0]?.trim() ||
    r.display_name
  )
}

function formatGeoSecondary(r: GeoResult): string {
  const primary = formatGeoPrimary(r).toLowerCase()
  const segments = [
    r.address?.county,
    r.address?.state,
    r.address?.postcode,
    r.address?.country,
  ]

  const unique = Array.from(new Set(segments.filter(Boolean))).filter(
    (segment) => segment!.toLowerCase() !== primary,
  )

  return unique.join(', ')
}

function formatGeoLabel(r: GeoResult): string {
  const secondary = formatGeoSecondary(r)
  return secondary ? `${formatGeoPrimary(r)}, ${secondary}` : formatGeoPrimary(r)
}

const MOON_SIGN_BLURBS: Record<string, string> = {
  'Bélier': "vos émotions surgissent vite et se voient immédiatement : vous vous sentez en sécurité quand vous pouvez agir sur ce qui vous préoccupe, plutôt que d'attendre.",
  'Taureau': "vous avez besoin de repères stables et de confort concret pour vous sentir apaisé : un rythme régulier vous rassure plus que n'importe quel discours.",
  'Gémeaux': "vous digérez vos émotions en les mettant en mots : parler, échanger, comprendre intellectuellement ce que vous ressentez fait partie de votre équilibre.",
  'Cancer': "votre sécurité intérieure passe par le lien affectif et le foyer : vous ressentez tout intensément et avez besoin d'un cadre familier pour vous régénérer.",
  'Lion': "vous avez besoin d'être vu et reconnu pour vous sentir bien émotionnellement : la chaleur des autres nourrit votre confiance en vous.",
  'Vierge': "vous vous rassurez en comprenant et en organisant : rendre service ou remettre de l'ordre dans une situation apaise votre tension intérieure.",
  'Balance': "l'harmonie relationnelle est votre baromètre émotionnel : un conflit non résolu vous pèse plus longtemps que vous ne le montrez.",
  'Scorpion': "vous vivez vos émotions avec intensité et discrétion à la fois, et vous avez besoin de contrôler le rythme auquel vous vous ouvrez aux autres.",
  'Sagittaire': "vous avez besoin de perspective et de mouvement pour vous sentir bien : un horizon qui se dégage compte plus pour vous qu'un cadre rassurant mais figé.",
  'Capricorne': "vous préférez canaliser vos émotions dans l'action et la responsabilité plutôt que de les exposer : la maîtrise de vous-même est votre façon de vous rassurer.",
  'Verseau': "vous prenez du recul sur vos propres émotions, presque en observateur : votre équilibre vient de votre liberté à penser et vivre à votre façon.",
  'Poissons': "vos frontières émotionnelles sont poreuses : vous ressentez facilement ce qui vous entoure, ce qui demande d'apprendre à vous protéger sans vous fermer.",
}

const result = ref<{ moonSign: string; moonDegree: number; sunSign: string } | null>(null)

const moonBlurb = computed(() => {
  if (!result.value) return ''
  return MOON_SIGN_BLURBS[result.value.moonSign] || ''
})

async function calculate() {
  errorMessage.value = ''

  if (!Number.isFinite(lat.value) || !Number.isFinite(lon.value)) {
    errorMessage.value = 'Veuillez sélectionner votre lieu de naissance dans la liste.'
    return
  }

  calculating.value = true

  try {
    const res = await $fetch('/api/moon-sign', {
      method: 'POST',
      body: {
        birthDate: form.birthDate,
        birthTime: form.birthTime,
        lat: lat.value,
        lon: lon.value,
      },
    })

    result.value = res as { moonSign: string; moonDegree: number; sunSign: string }
  } catch (err) {
    console.error(err)
    errorMessage.value = 'Une erreur s\'est produite. Veuillez réessayer.'
  } finally {
    calculating.value = false
  }
}

function reset() {
  result.value = null
  form.birthDate = ''
  form.birthTime = ''
  cityQuery.value = ''
  lat.value = null
  lon.value = null
  geoResults.value = []
}
</script>

<style scoped>
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(1.5rem);
}
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem);
}
</style>
