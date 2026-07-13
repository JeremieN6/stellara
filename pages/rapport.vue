<template>
  <section class="min-h-screen pb-16 pt-20 sm:pb-20 sm:pt-24">
    <div class="section-shell">
      <Transition name="fade-up" mode="out-in">
        <div v-if="step === 0" key="form" class="mx-auto max-w-3xl">
          <header class="mb-8 text-center sm:mb-10">
            <p class="eyebrow mb-3">Thème natal</p>
            <h1 class="font-display text-4xl text-white sm:text-6xl">
              Votre <span class="text-amber-300">carte du ciel</span>
            </h1>
            <p class="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Découvrez les influences célestes qui guident votre chemin de vie,
              vos relations et votre potentiel caché.
            </p>
            <div class="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 sm:gap-6">
              <span class="inline-flex items-center gap-2"><span class="text-amber-300">🔒</span> Données privées</span>
              <span class="inline-flex items-center gap-2"><span class="text-amber-300">⚡</span> Résultat en 30s</span>
              <span class="inline-flex items-center gap-2"><span class="text-amber-300">✦</span> 100% Gratuit</span>
            </div>
          </header>

          <div class="glass-panel relative overflow-hidden border border-white/15 p-6 sm:p-8">
            <div class="pointer-events-none absolute -top-20 right-0 h-44 w-44 rounded-full bg-violet-500/20 blur-3xl" />
            <p class="eyebrow mb-2">Thème natal</p>
            <h2 class="font-display text-3xl leading-tight text-white sm:text-4xl">Commencer ma lecture astrale</h2>
            <p class="mt-2 text-sm leading-6 text-slate-300">
              Entrez vos donnees de naissance pour generer votre theme natal personnalisé.
              L'heure est optionnelle mais permet de calculer votre ascendant.
            </p>

            <form class="mt-8 space-y-5" @submit.prevent="calculate">
              <div>
                <label class="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Prénom</label>
                <input
                  v-model="form.firstName"
                  type="text"
                  class="form-input"
                  placeholder="Marie"
                  required
                />
              </div>

              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label class="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Date de naissance</label>
                  <input
                    v-model="form.birthDate"
                    type="date"
                    class="form-input"
                    required
                  />
                </div>
                <div>
                  <label class="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Heure de naissance <span class="normal-case tracking-normal text-slate-500">(optionnel)</span></label>
                  <input
                    v-model="form.birthTime"
                    type="time"
                    class="form-input"
                    :disabled="unknownBirthTime"
                  />
                </div>
              </div>

              <label class="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-slate-300 transition-colors hover:bg-white/10">
                <input v-model="unknownBirthTime" type="checkbox" class="mt-1 h-4 w-4 rounded border-white/30 bg-transparent text-amber-400" />
                <span>
                  Je ne connais pas l'heure exacte
                  <span class="mt-1 block text-xs text-slate-500">L'ascendant ne sera pas calculé - les autres positions restent precises.</span>
                </span>
              </label>

              <div class="relative">
                <label class="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Ville de naissance</label>
                <input
                  v-model="cityQuery"
                  type="text"
                  class="form-input pr-10"
                  placeholder="Paris, France"
                  autocomplete="off"
                  @input="debouncedGeoSearch"
                  required
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

              <button
                type="submit"
                class="cta-button mt-3 w-full justify-center"
                :disabled="calculating"
                :class="calculating ? 'cursor-not-allowed opacity-60' : ''"
              >
                <svg v-if="calculating" class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <span>{{ calculating ? 'Calcul en cours...' : '✦ Calculer mon theme natal ✦' }}</span>
              </button>
            </form>
          </div>
        </div>
      </Transition>

      <Transition name="fade-up" mode="out-in">
        <div v-if="step === 1" key="loading" class="mx-auto max-w-2xl">
          <div class="glass-panel p-10 text-center sm:p-12">
            <div class="mb-6 text-6xl animate-drift">✦</div>
            <h2 class="mb-3 font-display text-2xl font-semibold text-white">Calcul en cours...</h2>
            <p class="text-sm text-slate-400">Nous calculons vos positions planetaires et generons votre analyse.</p>
            <div class="mt-8 flex justify-center gap-1">
              <span v-for="i in 3" :key="i" class="h-2 w-2 animate-pulse rounded-full bg-amber-400/60" :style="`animation-delay: ${i * 200}ms`" />
            </div>
          </div>
        </div>
      </Transition>

      <Transition name="fade-up" mode="out-in">
        <div v-if="step === 2 && reportStore.reportData" key="report" class="mx-auto max-w-6xl">
          <ReportDisplay
            :report="reportStore.reportData"
            :is-premium="reportStore.isPremium"
            :user-email="reportStore.userEmail"
            @capture-email="handleCaptureEmail"
            @new-report="startNewReport"
          />
        </div>
      </Transition>
    </div>
  </section>
</template>

<script setup lang="ts">
import ReportDisplay from '~/components/ReportDisplay.vue'

useSeoMeta({
  title: 'Mon Thème Natal — Stellara',
  description: 'Calculez votre thème natal complet avec signe solaire, lunaire, ascendant et 10 planètes analysés par IA.',
})

const reportStore = useReportStore()
const step = ref(0)
const calculating = ref(false)
const unknownBirthTime = ref(false)

onMounted(async () => {
  reportStore.initFromStorage()

  if (reportStore.reportData) {
    step.value = 2
  }

  if (reportStore.userEmail) {
    const restored = reportStore.reportData
      ? true
      : await reportStore.restoreLatestReportFromServer(reportStore.userEmail)

    if (restored && reportStore.reportData) {
      step.value = 2
    }

    await reportStore.syncPremiumStatusFromServer(reportStore.userEmail)
  }
})

const form = reactive({
  firstName: '',
  birthDate: '',
  birthTime: '',
  gender: 'other',
  lat: null as number | null,
  lon: null as number | null,
  city: '',
})

const cityQuery = ref('')

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
  form.lat = null
  form.lon = null
  form.city = ''

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
  form.lat = parseFloat(r.lat)
  form.lon = parseFloat(r.lon)
  form.city = formatGeoLabel(r)
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

async function calculate() {
  if (!Number.isFinite(form.lat) || !Number.isFinite(form.lon)) {
    alert('Veuillez sélectionner votre lieu de naissance dans la liste.')
    return
  }

  calculating.value = true
  step.value = 1

  try {
    const res = await $fetch('/api/generate-report', {
      method: 'POST',
      body: {
        firstName: form.firstName,
        birthDate: form.birthDate,
        birthTime: unknownBirthTime.value ? '12:00' : (form.birthTime || '12:00'),
        lat: form.lat,
        lon: form.lon,
        city: form.city,
        gender: form.gender,
      },
    })

    reportStore.setReportData(res as Record<string, unknown>)
    step.value = 2
  } catch (err) {
    console.error(err)
    step.value = 0
    alert('Une erreur s\'est produite. Veuillez réessayer.')
  } finally {
    calculating.value = false
  }
}

function startNewReport() {
  reportStore.clearReportData()
  form.firstName = ''
  form.birthDate = ''
  form.birthTime = ''
  form.gender = 'other'
  form.lat = null
  form.lon = null
  form.city = ''
  cityQuery.value = ''
  geoResults.value = []
  unknownBirthTime.value = false
  step.value = 0
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

async function handleCaptureEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase()
  if (!normalizedEmail) return

  reportStore.setUserEmail(normalizedEmail)
  await reportStore.syncPremiumStatusFromServer(normalizedEmail)

  const reportId = String(reportStore.reportData?.reportId || '')
  const reportData = reportStore.reportData || {}
  const personalizedSummary = String(reportData.personalizedSummary || '').trim()
  const legacySummary = String(reportData.summary || '').trim()
  const previewPayload = {
    firstName: String(reportData.firstName || ''),
    birthDate: String(reportData.birthDate || ''),
    city: String(reportData.city || ''),
    sunSign: String(reportData.sunSign || ''),
    moonSign: String(reportData.moonSign || ''),
    ascendant: String(reportData.ascendant || ''),
    summary: personalizedSummary || legacySummary,
  }

  try {
    const response = await $fetch('/api/report/capture-email', {
      method: 'POST',
      body: {
        reportId,
        email: normalizedEmail,
        previewPayload,
      },
    }) as {
      emailSent?: boolean
      emailFallbackReason?: string | null
    }

    if (!response?.emailSent) {
      console.warn('[rapport] preview email fallback:', response?.emailFallbackReason || 'unknown')
    }
  } catch (error) {
    console.error('[rapport] capture-email failed:', error)
  }
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
