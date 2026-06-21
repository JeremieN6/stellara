<template>
  <section id="pricing" class="section-transition scroll-mt-24 py-20 sm:py-24">
    <div class="section-shell">
    <div class="mx-auto mb-16 max-w-3xl text-center">
      <p class="eyebrow reveal-on-scroll mb-4">Tarifs</p>
      <h2 class="section-title reveal-on-scroll mx-auto max-w-2xl">Choisissez votre destinée</h2>
      <p class="reveal-on-scroll mx-auto mt-6 max-w-xl text-lg text-slate-300">
        Commencez avec un rapport essentiel offert, approfondissez avec votre theme natal integral ou passez au suivi premium.
      </p>
    </div>

    <div class="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
      <div
        class="reveal-on-scroll glass-panel relative flex flex-col overflow-hidden px-7 py-8 transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
      >
        <div class="mb-6">
          <p class="text-xs uppercase tracking-[0.35em] text-slate-400">Constellation Decouverte</p>
          <div class="mt-3 flex items-end gap-2">
            <span class="font-display text-5xl text-white">0€</span>
          </div>
          <p class="mt-2 text-sm text-slate-400">Rapport essentiel offert pour reveler votre signature astrale</p>
        </div>

        <ul class="flex-1 space-y-3">
          <li v-for="feat in freeFeatures" :key="feat" class="flex items-start gap-3 text-sm text-slate-300">
            <svg class="mt-0.5 h-4 w-4 shrink-0 text-amber-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            {{ feat }}
          </li>

          <li v-for="feat in lockedFreeFeatures" :key="feat" class="flex items-start gap-3 text-sm text-slate-600">
            <svg class="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fill-rule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2V7a3 3 0 00-6 0v2h6z"
                clip-rule="evenodd"
              />
            </svg>
            {{ feat }}
          </li>
        </ul>

        <div class="mt-8">
          <NuxtLink
            to="/rapport"
            class="block w-full rounded-full border border-white/15 bg-white/5 py-3.5 text-center text-sm font-bold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10"
          >
            Obtenir mon rapport essentiel
          </NuxtLink>
        </div>
      </div>

      <div
        class="reveal-on-scroll glass-panel relative flex flex-col overflow-hidden border border-white/15 px-7 py-8 transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
      >
        <div class="mb-6">
          <p class="text-xs uppercase tracking-[0.35em] text-slate-400">Carte Natale Integrale</p>
          <div class="mt-3 flex items-end gap-2">
            <span class="font-display text-5xl text-white">9,99€</span>
            <span class="mb-1.5 text-sm text-slate-400">paiement unique</span>
          </div>
          <p class="mt-2 text-sm text-slate-400">Le theme natal complet a conserver, relire et telecharger</p>
        </div>

        <ul class="flex-1 space-y-3">
          <li v-for="feat in oneShotFeatures" :key="feat" class="flex items-start gap-3 text-sm text-slate-300">
            <svg class="mt-0.5 h-4 w-4 shrink-0 text-amber-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            {{ feat }}
          </li>
        </ul>

        <div class="mt-8">
          <a
            href="/api/stripe/create-checkout-session?productType=rapport_complet"
            class="block w-full rounded-full border border-white/15 bg-white/5 py-3.5 text-center text-sm font-bold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10"
          >
            Obtenir mon rapport complet
          </a>
        </div>
      </div>

      <div
        class="reveal-on-scroll glass-panel relative flex flex-col overflow-hidden border border-violet-500/40 px-7 py-8 shadow-[0_0_60px_rgba(124,58,237,0.2)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_80px_rgba(124,58,237,0.3)]"
      >
        <div
          class="absolute -right-8 top-5 rotate-45 bg-gradient-to-r from-violet-600 to-fuchsia-500 px-10 py-1.5 text-center text-xs font-bold uppercase tracking-[0.2em] text-white"
        >
          Populaire
        </div>

        <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />

        <div class="mb-6">
          <p class="text-xs uppercase tracking-[0.35em] text-slate-400">Orbite Premium</p>
          <div class="mt-4 inline-flex items-center rounded-full border border-white/15 bg-white/5 p-1 text-xs">
            <button
              type="button"
              class="rounded-full px-3 py-1.5 font-semibold uppercase tracking-[0.16em] transition-colors"
              :class="premiumBilling === 'monthly' ? 'bg-white text-slate-900' : 'text-slate-300 hover:text-white'"
              @click="premiumBilling = 'monthly'"
            >
              Mensuel
            </button>
            <button
              type="button"
              class="rounded-full px-3 py-1.5 font-semibold uppercase tracking-[0.16em] transition-colors"
              :class="premiumBilling === 'yearly' ? 'bg-white text-slate-900' : 'text-slate-300 hover:text-white'"
              @click="premiumBilling = 'yearly'"
            >
              Annuel
            </button>
          </div>
          <div class="mt-3 flex items-end gap-2">
            <span class="font-display text-5xl text-white">{{ premiumPriceDisplay }}</span>
            <span class="mb-1.5 text-sm text-slate-400">{{ premiumPriceSuffix }}</span>
          </div>
          <p class="mt-2 text-sm text-slate-400">{{ premiumDescription }}</p>
          <p v-if="premiumBilling === 'yearly'" class="mt-2 text-xs text-emerald-300">
            Soit l'equivalent de 12,42€/mois, avec une reduction proche de 35%.
          </p>
        </div>

        <ul class="flex-1 space-y-3">
          <li v-for="feat in subscriptionFeatures" :key="feat" class="flex items-start gap-3 text-sm text-slate-300">
            <svg class="mt-0.5 h-4 w-4 shrink-0 text-amber-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            {{ feat }}
          </li>
        </ul>

        <div class="mt-8">
          <a
            :href="activeSubscriptionCheckoutLink"
            class="block w-full rounded-full bg-[linear-gradient(135deg,#7c3aed_0%,#a855f7_50%,#d97706_100%)] py-3.5 text-center text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_50px_rgba(124,58,237,0.7)]"
          >
            {{ premiumCtaLabel }}
          </a>
        </div>

        <p class="mt-4 text-center text-xs text-slate-500">Le plan annuel est le plus avantageux si vous voulez suivre vos cycles sur la durée.</p>
      </div>
    </div>

    <div class="reveal-on-scroll mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500">
      <div v-for="badge in trustBadges" :key="badge.label" class="flex items-center gap-2">
        <svg class="h-5 w-5 text-amber-400/60" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path :d="badge.path" :fill-rule="badge.fillRule" :clip-rule="badge.clipRule" />
        </svg>
        {{ badge.label }}
      </div>
    </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const premiumBilling = ref<'monthly' | 'yearly'>('monthly')

const subscriptionMonthlyLink = '/api/stripe/create-checkout-session?productType=orbite_premium&billingInterval=monthly'
const subscriptionYearlyLink = '/api/stripe/create-checkout-session?productType=orbite_premium&billingInterval=yearly'

const premiumPriceDisplay = computed(() => (premiumBilling.value === 'monthly' ? '19€' : '149€'))
const premiumPriceSuffix = computed(() => (premiumBilling.value === 'monthly' ? '/ mois' : '/ an'))
const premiumDescription = computed(() =>
  premiumBilling.value === 'monthly'
    ? 'Le suivi vivant: horoscope enrichi, transits, mensuels et alertes'
    : 'Le suivi vivant en formule annuelle: meme experience premium, tarif optimise'
)
const premiumCtaLabel = computed(() =>
  premiumBilling.value === 'monthly' ? 'Activer mon suivi astral mensuel' : 'Activer mon suivi astral annuel'
)
const activeSubscriptionCheckoutLink = computed(() =>
  premiumBilling.value === 'monthly' ? subscriptionMonthlyLink : subscriptionYearlyLink
)

const freeFeatures = [
  'Signe solaire, lunaire et ascendant',
  'Mini portrait astrologique structure',
  'Forces dominantes et points de vigilance',
  'Rapport essentiel telechargeable',
]

const lockedFreeFeatures = [
  'Analyse des 10 planètes',
  'Les 12 maisons astrologiques',
  'Aspects planétaires complets',
  'Transits et cycles du moment',
]

const oneShotFeatures = [
  'Position exacte de vos 10 planètes',
  'Les 12 maisons astrologiques',
  'Tous les aspects planétaires',
  'Lecture de personnalité approfondie',
  'Compatibilité amoureuse & relationnelle',
  'Rapport PDF premium 30+ pages',
  'Paiement unique, sans abonnement',
]

const subscriptionFeatures = [
  'Chaque matin, ce que le ciel te réserve, avant que ta journée commence',
  'Historique et tendances sur plusieurs jours',
  'Sais quand agir, quand attendre, quand lancer grâce à tes cycles personnels',
  'Rapport mensuel et alertes importantes',
  'Priorite sur les nouvelles fonctions premium',
  'Transits majeurs et influence des planètes lentes pour mieux comprendre les grands cycles de ta vie',
]

const trustBadges = [
  {
    label: 'Paiement 100% sécurisé',
    path: 'M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z',
    fillRule: 'evenodd',
    clipRule: 'evenodd',
  },
  {
    label: 'Paiement unique',
    path: 'M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z',
  },
  {
    label: 'Rapport en quelques secondes',
    path: 'M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z',
    fillRule: 'evenodd',
    clipRule: 'evenodd',
  },
  {
    label: '4.9/5 - +12 000 thèmes',
    path: 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z',
  },
]
</script>
