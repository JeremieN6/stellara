<template>
  <div class="space-y-5 sm:space-y-6">
    <header class="mx-auto max-w-4xl pb-4 pt-2 text-center">
      <p class="eyebrow mb-3">Theme natal</p>
      <h1 class="font-display text-4xl text-white sm:text-6xl">
        Le theme de <span class="text-amber-300 uppercase">{{ firstName }}</span>
      </h1>
      <p class="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
        Decouvrez les influences célestes qui guident votre chemin de vie,
        vos relations et votre potentiel cache.
      </p>
    </header>

    <article
      v-for="(card, index) in coreCards"
      :key="card.title"
      class="glass-panel relative overflow-hidden border border-white/15 px-5 py-5 sm:px-8"
      :class="index === 0 ? 'sm:py-7' : ''"
    >
      <div class="absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-violet-500/15 to-transparent" />
      <div class="relative">
        <p class="eyebrow mb-1">{{ card.eyebrow }}</p>
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 class="font-display text-3xl text-white sm:text-4xl">{{ card.title }}</h2>
            <p class="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{{ card.subtitle }}</p>
          </div>
          <div class="hidden h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-4xl text-violet-300 sm:flex">
            {{ card.glyph }}
          </div>
        </div>
        <p class="mt-5 max-w-4xl text-sm leading-7 text-slate-200 sm:text-[15px]">{{ card.description }}</p>
        <div class="mt-4 flex flex-wrap gap-2">
          <span
            v-for="tag in card.tags"
            :key="tag"
            class="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] text-slate-300"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </article>

    <section class="glass-panel relative overflow-hidden border border-violet-400/20 px-5 py-5 sm:px-8 sm:py-7">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="eyebrow mb-2">Resumé personnalisé</p>
          <h3 class="font-display text-2xl text-white sm:text-3xl">Votre lecture rapide</h3>
        </div>
        <button
          v-if="hasAccessUnlocked"
          type="button"
          class="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition-colors hover:border-white/30 hover:text-white"
          :disabled="pdfLoading"
          @click="downloadPreviewPdf"
        >
          {{ pdfLoading ? 'Generation...' : (isPremium ? 'Telecharger mon rapport complet' : 'Recevoir mon aperçu PDF') }}
        </button>
      </div>
      <p class="mt-4 text-sm leading-7 text-slate-200 sm:text-[15px]">{{ summaryText }}</p>
    </section>

    <section v-if="showLeadCapture" class="glass-panel overflow-hidden border border-white/15 px-5 py-5 sm:px-8 sm:py-7">
      <div class="mb-4 flex items-center justify-between gap-4">
        <div>
          <p class="eyebrow mb-1">Planètes</p>
          <h3 class="font-display text-2xl text-white sm:text-3xl">Positions planetaires</h3>
        </div>
        <span class="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-300">{{ isPremium ? 'Acces complet' : 'Aperçu gratuit' }}</span>
      </div>

      <div class="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3">
        <div
          v-for="(planet, index) in publicPreviewPlanets"
          :key="`${planet.planet}-public-${index}`"
          class="rounded-xl border border-white/15 bg-white/10 px-3 py-3"
        >
          <p class="text-center text-lg text-violet-300">{{ planetEmoji[planet.planet] || '✦' }}</p>
          <p class="mt-1 text-center text-[10px] uppercase tracking-[0.2em] text-slate-400">{{ planet.planet }}</p>
          <p class="mt-1 text-center text-xs text-white">{{ planet.sign }}</p>
          <p class="text-center text-[11px] text-slate-400">{{ elementForSign(planet.sign) }}</p>
        </div>
      </div>
    </section>

    <section
      v-if="showLeadCapture"
      class="glass-panel relative overflow-hidden border border-amber-400/30 bg-gradient-to-b from-amber-400/10 to-transparent px-5 py-5 sm:px-8 sm:py-7"
    >
      <div class="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-amber-300/20 blur-2xl" />
      <div class="relative">
        <p class="eyebrow mb-2">Étape suivante</p>
        <h3 class="font-display text-2xl text-white sm:text-3xl">Recevez votre aperçu et sauvegardez votre theme</h3>
        <p class="mt-3 max-w-6xl text-sm leading-7 text-slate-200">
          Entrez votre email pour reçevoir votre rapport en PDF. Retrouver votre lecture plus tard et debloquer 1 planète supplementaire en aperçu gratuit.
        </p>

        <form class="mt-5 space-y-4" @submit.prevent="submitLeadEmail">
          <div>
            <label class="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Email</label>
            <input
              v-model.trim="leadEmail"
              type="email"
              class="form-input"
              placeholder="marie@email.com"
              required
            />
            <p class="mt-1 text-[11px] text-slate-500">Aucun spam. Desinscription en un clic. Utilisez une seule adresse pour retrouver vos informations et accès premium sur un autre appareil. </p>
          </div>

          <button
            type="submit"
            class="cta-button w-full justify-center sm:w-auto"
            :disabled="leadSubmitting"
            :class="leadSubmitting ? 'cursor-not-allowed opacity-60' : ''"
          >
            {{ leadSubmitting ? 'Validation...' : 'Recevoir mon aperçu gratuit' }}
          </button>
        </form>
      </div>
    </section>

    <section v-if="hasAccessUnlocked" class="glass-panel overflow-hidden border border-white/15 px-5 py-5 sm:px-8 sm:py-7">
      <div class="mb-4 flex items-center justify-between gap-4">
        <div>
          <p class="eyebrow mb-1">Planètes</p>
          <h3 class="font-display text-2xl text-white sm:text-3xl">Positions planetaires</h3>
        </div>
        <span class="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-300">{{ isPremium ? 'Acces complet' : 'Aperçu gratuit' }}</span>
      </div>

      <div class="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3">
        <div
          v-for="(planet, index) in planets"
          :key="`${planet.planet}-${index}`"
          class="relative rounded-xl border border-white/15 px-3 py-3"
          :class="isLockedPlanet(index) ? 'bg-white/5' : 'bg-white/10'"
        >
          <div :class="isLockedPlanet(index) ? 'blur-[3px] opacity-65 select-none' : ''">
            <p class="text-center text-lg text-violet-300">{{ planetEmoji[planet.planet] || '✦' }}</p>
            <p class="mt-1 text-center text-[10px] uppercase tracking-[0.2em] text-slate-400">{{ planet.planet }}</p>
            <p class="mt-1 text-center text-xs text-white">{{ planet.sign }}</p>
            <p class="text-center text-[11px] text-slate-400">{{ elementForSign(planet.sign) }}</p>
          </div>
          <div v-if="isLockedPlanet(index)" class="absolute inset-0 flex items-end justify-center pb-2">
            <span class="rounded-full border border-amber-400/35 bg-black/45 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-amber-300">🔒</span>
          </div>
        </div>
      </div>
    </section>

    <section v-if="hasAccessUnlocked" class="glass-panel overflow-hidden border border-white/15 px-5 py-5 sm:px-8 sm:py-7">
      <div class="mb-4 flex items-center justify-between gap-4">
        <div>
          <p class="eyebrow mb-1">Maisons astrologiques</p>
          <h3 class="font-display text-2xl text-white sm:text-3xl">Les 12 maisons</h3>
        </div>
        <span class="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-300">{{ isPremium ? 'Acces complet' : 'Aperçu gratuit' }}</span>
      </div>

      <div class="space-y-2">
        <div
          v-for="house in houses"
          :key="house.index"
          class="relative rounded-2xl border border-white/15 bg-white/5 px-4 py-3"
        >
          <div :class="house.locked && !isPremium ? 'blur-[4px] opacity-65 select-none' : ''">
            <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Maison {{ toRoman(house.index) }} - {{ house.title }}</p>
            <p class="mt-1 text-sm text-slate-200">{{ house.description }}</p>
          </div>
          <div v-if="house.locked && !isPremium" class="absolute inset-y-0 right-3 flex items-center">
            <span class="rounded-full border border-amber-400/35 bg-black/50 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-amber-300">🔒 Premium</span>
          </div>
        </div>
      </div>
    </section>

    <section v-if="hasAccessUnlocked" class="glass-panel relative overflow-hidden border border-white/15 px-5 py-5 sm:px-8 sm:py-7">
      <div :class="isPremium ? '' : 'blur-[4px] opacity-60 select-none'">
        <p class="eyebrow mb-1">Aspects planetaires</p>
        <h3 class="font-display text-2xl text-white sm:text-3xl">Harmonies et tensions du ciel</h3>
        <p class="mt-2 max-w-3xl text-sm text-slate-300">
          Conjonctions, carres, trigones, oppositions et sextiles - la carte complete de vos dynamiques interieures.
        </p>
      </div>
      <div v-if="!isPremium" class="absolute inset-0 flex items-center justify-end pr-4 sm:pr-8">
        <span class="rounded-2xl border border-amber-400/35 bg-black/45 px-4 py-3 text-xs uppercase tracking-[0.2em] text-amber-300">🔒 Debloquer pour voir</span>
      </div>
    </section>

    <section v-if="hasAccessUnlocked && !isPremium" class="glass-panel text-center relative overflow-hidden border border-amber-400/30 bg-gradient-to-b from-violet-500/15 to-transparent px-5 py-7 sm:px-8 sm:py-9">
      <p class="mx-auto mb-3 inline-flex rounded-full border border-amber-400/35 bg-amber-400/10 px-4 py-1 text-xs uppercase tracking-[0.2em] text-amber-300">
        ✦ Rapport complet premium ✦
      </p>
      <h3 class="text-center font-display text-3xl text-white sm:text-3xl">Débloquez l'integralité de votre theme natal</h3>
      <p class="mx-auto mt-4 max-w-3xl text-center text-sm leading-7 text-slate-200 sm:text-base">
        Accedez aux 10 planètes, aux 12 maisons, aux aspects planetaires, aux transits et a la compatibilité amoureuse.
      </p>

      <div class="mx-auto mt-6 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
        <div v-for="feat in premiumFeatures" :key="feat.title" class="rounded-2xl border border-white/15 bg-white/5 px-3 py-3 text-center">
          <p class="text-lg">{{ feat.icon }}</p>
          <p class="mt-1 text-xs font-semibold text-white">{{ feat.title }}</p>
          <p class="mt-1 text-[11px] text-slate-400">{{ feat.subtitle }}</p>
        </div>
      </div>

      <p class="mx-auto mt-6 max-w-3xl text-center text-sm leading-7 text-slate-200 sm:text-base">
        <span class="font-semibold text-white">{{ firstName }},</span>
        ce que vous venez de lire n'est que la surface de votre carte du ciel.
        Vos aspects planétaires revelent les tensions et dons que vous portez depuis la naissance,
        et vos transits actuels expliquent ce que vous traversez en ce moment précis.
      </p>

      <div class="mt-8 text-center">
        <a :href="stripeLink" class="cta-button w-full max-w-xl justify-center" target="_blank" rel="noopener">
          ✦ Debloquer mon rapport complet - 9,99€ ✦
        </a>
        <p class="text-xs text-slate-500 flex flex-wrap items-center justify-center gap-3 mt-5"><span data-v-47d01a91="">🔒 Paiement sécurisé Stripe</span><span data-v-47d01a91="">·</span><span data-v-47d01a91="">✅ Garantie 7 jours</span><span data-v-47d01a91="">·</span><span data-v-47d01a91="">📄 PDF téléchargeable</span></p>      </div>
    </section>

    <section v-if="isPremium && fullAnalysis" class="glass-panel border border-violet-400/30 p-6 sm:p-8">
      <p class="eyebrow mb-2">Rapport detaille</p>
      <h3 class="font-display text-2xl text-white sm:text-3xl">Analyse complete</h3>
      <div class="prose prose-invert mt-5 max-w-none prose-sm" v-html="fullAnalysis" />
    </section>

    <div class="space-y-2 py-2 text-center flex flex-col items-center justify-center gap-3">
      <button
        v-if="hasAccessUnlocked"
        type="button"
        class="mx-auto inline-flex items-center gap-2 rounded-full border border-amber-400/35 bg-amber-400/10 px-4 py-2 text-sm font-medium text-amber-200 transition-colors hover:border-amber-300/60 hover:text-amber-100"
        :disabled="pdfLoading"
        @click="downloadPreviewPdf"
      >
        {{ pdfLoading ? 'Generation...' : (isPremium ? 'Telecharger mon rapport complet' : 'Recevoir mon aperçu PDF') }}
      </button>

      <NuxtLink to="/rapport" class="text-sm text-slate-400 underline underline-offset-4 transition-colors hover:text-white">
        Calculer un autre theme
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  report: Record<string, unknown>
  isPremium: boolean
  userEmail: string
}>()

const emit = defineEmits<{
  (e: 'capture-email', email: string): void
}>()

const isPremium = computed(() => props.isPremium)
const reportData = computed(() => props.report as Record<string, unknown>)
const hasLeadEmail = computed(() => props.userEmail.trim().length > 0)
const hasAccessUnlocked = computed(() => isPremium.value || hasLeadEmail.value)
const showLeadCapture = computed(() => !isPremium.value && !hasLeadEmail.value)

const stripeLink = computed(() => {
  const params = new URLSearchParams({ productType: 'rapport_complet' })
  const reportId = String(reportData.value.reportId || '').trim()
  const email = String(props.userEmail || '').trim()

  if (reportId) params.set('reportId', reportId)
  if (email) params.set('email', email)

  return `/api/stripe/create-checkout-session?${params.toString()}`
})

const planetEmoji: Record<string, string> = {
  Soleil: '☀',
  Lune: '☽',
  Mercure: '☿',
  'Vénus': '♀',
  Mars: '♂',
  Jupiter: '♃',
  Saturne: '♄',
  Uranus: '♅',
  Neptune: '♆',
  Pluton: '♇',
}

const leadEmail = ref('')
const leadSubmitting = ref(false)
const pdfLoading = ref(false)

type PlanetEntry = { planet: string; sign: string }

const planets = computed(() => {
  const value = reportData.value.planets
  if (!Array.isArray(value)) return [] as PlanetEntry[]
  return value as PlanetEntry[]
})

const firstName = computed(() => String(reportData.value.firstName || ''))
const summaryText = computed(() => String(reportData.value.summary || 'Resume indisponible.'))
const fullAnalysis = computed(() => String(reportData.value.fullAnalysis || ''))

const signInsight: Record<string, { subtitle: string; description: string; tags: string[]; glyph: string }> = {
  belier: { subtitle: 'Feu - impulsion', description: 'Votre energie est directe, entreprenante et orientee action.', tags: ['Initiative', 'Courage', 'Action'], glyph: '♈' },
  taureau: { subtitle: 'Terre - stabilite', description: 'Vous avancez avec constance et un fort sens du concret.', tags: ['Loyaute', 'Stabilite', 'Sensuel'], glyph: '♉' },
  gemeaux: { subtitle: 'Air - communication', description: 'Votre esprit curieux capte vite les nuances et les idees.', tags: ['Curiosite', 'Adaptable', 'Esprit vif'], glyph: '♊' },
  cancer: { subtitle: 'Eau - sensibilite', description: 'Votre monde interieur nourrit une grande intuition relationnelle.', tags: ['Intuition', 'Protection', 'Empathie'], glyph: '♋' },
  lion: { subtitle: 'Feu - rayonnement', description: 'Vous exprimez une energie creative et une presence chaleureuse.', tags: ['Creatif', 'Noble', 'Charisme'], glyph: '♌' },
  vierge: { subtitle: 'Terre - discernement', description: 'Vous cherchez la justesse, la precision et l utilite.', tags: ['Analyse', 'Service', 'Rigueur'], glyph: '♍' },
  balance: { subtitle: 'Air - harmonie', description: 'Vous cultivez l equilibre, le charme et la cooperation.', tags: ['Diplomatie', 'Esthetique', 'Equilibre'], glyph: '♎' },
  scorpion: { subtitle: 'Eau - transformation', description: 'Votre intensite emotionnelle alimente des metamorphoses profondes.', tags: ['Intensite', 'Perception', 'Profondeur'], glyph: '♏' },
  sagittaire: { subtitle: 'Feu - expansion', description: 'Votre quete de sens vous pousse vers de nouveaux horizons.', tags: ['Optimiste', 'Explorateur', 'Vision'], glyph: '♐' },
  capricorne: { subtitle: 'Terre - structure', description: 'Votre trajectoire se construit avec ambition et discipline.', tags: ['Ambition', 'Maturite', 'Perseverance'], glyph: '♑' },
  verseau: { subtitle: 'Air - innovation', description: 'Vous pensez differemment et aimez ouvrir de nouvelles voies.', tags: ['Original', 'Visionnaire', 'Libre'], glyph: '♒' },
  poissons: { subtitle: 'Eau - receptivite', description: 'Votre sensibilite capte les subtilites invisibles.', tags: ['Intuitif', 'Imaginaire', 'Compassion'], glyph: '♓' },
}

function normalizeSign(sign: string): string {
  return sign
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function getInsight(sign: string) {
  return signInsight[normalizeSign(sign)] || {
    subtitle: 'Energie astrologique',
    description: 'Votre configuration céleste met en avant une dynamique singuliere a explorer.',
    tags: ['Unique', 'Nuance', 'Evolution'],
    glyph: '✦',
  }
}

function elementForSign(sign: string): string {
  const key = normalizeSign(sign)
  if (['belier', 'lion', 'sagittaire'].includes(key)) return 'Feu'
  if (['taureau', 'vierge', 'capricorne'].includes(key)) return 'Terre'
  if (['gemeaux', 'balance', 'verseau'].includes(key)) return 'Air'
  if (['cancer', 'scorpion', 'poissons'].includes(key)) return 'Eau'
  return 'Element'
}

const coreCards = computed(() => {
  const sun = String(reportData.value.sunSign || 'Inconnu')
  const moon = String(reportData.value.moonSign || 'Inconnu')
  const asc = String(reportData.value.ascendant || 'Inconnu')
  const sunInsight = getInsight(sun)
  const moonInsight = getInsight(moon)
  const ascInsight = getInsight(asc)

  return [
    {
      eyebrow: '☀ Soleil en',
      title: sun,
      subtitle: sunInsight.subtitle,
      description: `${firstName.value}, ${sunInsight.description}`,
      tags: sunInsight.tags,
      glyph: sunInsight.glyph,
    },
    {
      eyebrow: '☽ Lune en',
      title: moon,
      subtitle: moonInsight.subtitle,
      description: moonInsight.description,
      tags: moonInsight.tags,
      glyph: moonInsight.glyph,
    },
    {
      eyebrow: '↑ Ascendant',
      title: asc,
      subtitle: ascInsight.subtitle,
      description: `Votre presence sociale reflete l energie ${asc.toLowerCase()}. ${ascInsight.description}`,
      tags: ascInsight.tags,
      glyph: ascInsight.glyph,
    },
  ]
})

function isLockedPlanet(index: number): boolean {
  return !props.isPremium && index >= 5
}

const publicPreviewPlanets = computed(() => planets.value.slice(0, 5))

const houses = computed(() => {
  const asc = String(reportData.value.ascendant || 'votre ascendant')
  return [
    { index: 1, title: 'Identité', description: `Avec votre ascendant en ${asc}, votre maniere d\'entrer en relation est marquée par cette energie.`, locked: false },
    { index: 2, title: 'Valeurs et ressources', description: 'Votre rapport à l\'argent et à vos talents naturels.', locked: true },
    { index: 3, title: 'Communication', description: 'Votre facon de penser, d\'apprendre et d\'echanger.', locked: true },
    { index: 4, title: 'Foyer et racines', description: 'Votre base émotionnelle et vos besoins de securité.', locked: true },
    { index: 5, title: 'Creativité et amour', description: 'Expression de soi, joie et élan du coeur.', locked: true },
    { index: 6, title: 'Santé et travail', description: 'Organisation, habitudes et sens du service.', locked: true },
    { index: 7, title: 'Partenariats', description: 'Dynamique de couple et collaborations majeures.', locked: true },
    { index: 8, title: 'Transformations', description: 'Mues profondes, pouvoir personnel et intimité.', locked: true },
    { index: 9, title: 'Vision et philosophie', description: 'Croyances, études et ouverture au monde.', locked: true },
    { index: 10, title: 'Carrière et mission', description: 'Direction de vie et réalisation publique.', locked: true },
    { index: 11, title: 'Amitiés et projets', description: 'Réseaux et ideal collectif.', locked: true },
    { index: 12, title: 'Inconscient', description: 'Monde interieur, intuition et retrait.', locked: true },
  ]
})

function toRoman(num: number): string {
  const map = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']
  return map[num - 1] || String(num)
}

const premiumFeatures = [
  { icon: '🪐', title: '10 planètes', subtitle: 'Uranus, Neptune, Pluton et plus' },
  { icon: '🏠', title: '12 maisons', subtitle: 'Chaque domaine de votre vie' },
  { icon: '⚡', title: 'Aspects', subtitle: 'Tensions et harmonies célestes' },
  { icon: '💕', title: 'Compatibilité', subtitle: 'Affinites amoureuses par signe' },
]

watch(
  () => props.userEmail,
  (email) => {
    if (email?.trim()) {
      leadEmail.value = email.trim()
      leadSubmitting.value = false
    }
  },
  { immediate: true },
)

function submitLeadEmail() {
  const normalized = leadEmail.value.trim().toLowerCase()
  if (!normalized) return

  leadSubmitting.value = true
  emit('capture-email', normalized)
}

async function downloadPreviewPdf() {
  if (pdfLoading.value) return
  pdfLoading.value = true

  try {
    const response = await fetch('/api/report/preview-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: firstName.value,
        birthDate: String(reportData.value.birthDate || ''),
        city: String(reportData.value.city || ''),
        sunSign: String(reportData.value.sunSign || ''),
        moonSign: String(reportData.value.moonSign || ''),
        ascendant: String(reportData.value.ascendant || ''),
        summary: summaryText.value,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${props.isPremium ? 'rapport-complet' : 'apercu-theme'}-${firstName.value || 'stellara'}.pdf`
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('[report] preview pdf download failed:', error)
    alert('Impossible de generer le PDF pour le moment.')
  } finally {
    pdfLoading.value = false
  }
}
</script>
