<template>
  <section class="min-h-screen pb-16 pt-20 sm:pb-20 sm:pt-24">
    <div class="section-shell">
      <div class="mx-auto max-w-4xl">
        <header class="text-center">
          <p class="eyebrow mb-3">Astrologue IA</p>
          <h1 class="font-display text-4xl text-white sm:text-6xl">
            Thème Astral IA Gratuit
          </h1>
          <p class="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Stellara est votre astrologue IA personnalisé : renseignez votre date, heure et lieu de
            naissance et recevez en quelques secondes un thème astral généré par intelligence
            artificielle à partir de vos positions planétaires exactes.
          </p>
          <div class="mt-8 flex justify-center">
            <NuxtLink to="/rapport" class="cta-button">
              Générer mon thème astral IA gratuit
            </NuxtLink>
          </div>
        </header>

        <div class="mt-14 space-y-4">
          <article class="glass-panel border border-white/10 p-6 sm:p-8">
            <h2 class="font-display text-2xl text-white sm:text-3xl">
              Qu'est-ce qu'un thème astral ?
            </h2>
            <p class="mt-4 text-base leading-8 text-slate-300">
              Un thème astral (ou thème natal) est la photographie du ciel au moment exact de votre
              naissance : la position du Soleil, de la Lune et des autres planètes, réparties dans
              les 12 maisons astrologiques et reliées entre elles par des aspects. C'est cette carte
              unique, propre à votre date, heure et lieu de naissance, qui sert de base à toute
              lecture astrologique personnalisée.
            </p>
          </article>

          <article class="glass-panel border border-white/10 p-6 sm:p-8">
            <h2 class="font-display text-2xl text-white sm:text-3xl">
              Comment fonctionne l'analyse IA de Stellara
            </h2>

            <h3 class="mt-6 font-display text-lg text-white sm:text-xl">
              1. Un calcul astronomique précis
            </h3>
            <p class="mt-3 text-base leading-8 text-slate-300">
              À partir de votre date, heure et lieu de naissance, le moteur astrologique de Stellara
              calcule la position réelle de vos 10 planètes et de vos 12 maisons au moment exact de
              votre naissance. Ce n'est pas une approximation par signe solaire : chaque thème est
              recalculé individuellement.
            </p>

            <h3 class="mt-6 font-display text-lg text-white sm:text-xl">
              2. Une synthèse par intelligence artificielle
            </h3>
            <p class="mt-3 text-base leading-8 text-slate-300">
              Une fois ces positions calculées, un modèle de langage avancé transforme ces données
              brutes en un texte personnalisé et lisible, guidé par une base de connaissances en
              astrologie classique et moderne. Le résultat n'est ni un texte générique par signe, ni
              une interprétation figée : il est reconstruit à partir de votre carte du ciel précise.
            </p>
          </article>

          <article class="glass-panel border border-white/10 p-6 sm:p-8">
            <h2 class="font-display text-2xl text-white sm:text-3xl">
              En quoi un thème astral IA est différent d'un thème astral classique
            </h2>
            <p class="mt-4 text-base leading-8 text-slate-300">
              Un thème astral classique, statique, se limite souvent à un texte préécrit par signe
              solaire : les 12 lecteurs du même signe reçoivent exactement le même contenu. Un thème
              astral IA croise l'ensemble de vos positions (planètes, maisons, aspects) pour générer
              un texte unique à chaque profil, au lieu d'un résumé générique. C'est aussi un format
              vivant : contrairement à un PDF figé une fois pour toutes, une lecture par IA peut
              évoluer avec vos transits et votre situation.
            </p>
            <p class="mt-4 text-base leading-8 text-slate-300">
              Vous pouvez tester ce principe dès maintenant en générant votre
              <NuxtLink to="/rapport" class="text-amber-400 underline decoration-amber-400/40 underline-offset-4 transition hover:text-amber-300">
                rapport natal gratuit
              </NuxtLink>
              : signe solaire, lunaire, ascendant et un mini-portrait structuré, en moins de 30
              secondes.
            </p>
          </article>
        </div>

        <div class="mt-14">
          <header class="text-center">
            <p class="eyebrow mb-3">FAQ</p>
            <h2 class="font-display text-2xl text-white sm:text-3xl">
              Questions fréquentes
            </h2>
          </header>

          <div class="mx-auto mt-8 max-w-3xl space-y-3">
            <div
              v-for="(item, i) in faqs"
              :key="item.question"
              class="glass-panel overflow-hidden border border-white/10"
            >
              <button
                type="button"
                class="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors duration-200"
                :aria-expanded="openFaq === i"
                @click="toggleFaq(i)"
              >
                <span class="pr-5 font-display text-base text-white md:text-lg">{{ item.question }}</span>
                <svg
                  class="h-4 w-4 shrink-0 text-amber-400 transition-transform duration-300"
                  :class="openFaq === i ? 'rotate-45' : ''"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 5v14M5 12h14" />
                </svg>
              </button>
              <div v-show="openFaq === i" class="px-6 pb-6">
                <p class="text-sm leading-7 text-slate-300">{{ item.answer }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const faqs = [
  {
    question: 'Le thème astral IA de Stellara est-il vraiment gratuit ?',
    answer: "Oui. Le rapport essentiel (signe solaire, lunaire, ascendant et mini-portrait) est entièrement gratuit et généré en quelques secondes. Une version complète, avec les 10 planètes, les 12 maisons et tous les aspects, est disponible en paiement unique pour une analyse approfondie.",
  },
  {
    question: 'En quoi une IA est-elle différente d\'un horoscope classique ?',
    answer: "Un horoscope classique se base uniquement sur votre signe solaire et propose le même texte à des millions de personnes nées le même mois. L'analyse IA de Stellara part de votre thème natal complet, propre à votre date, heure et lieu de naissance, pour générer un texte réellement personnalisé.",
  },
  {
    question: 'Ai-je besoin de connaître mon heure de naissance exacte ?',
    answer: "L'heure de naissance est surtout importante pour calculer votre ascendant avec précision, car il change de signe toutes les deux heures environ. Sans heure exacte, les positions des planètes restent fiables, mais l'ascendant peut être approximatif.",
  },
  {
    question: 'Mes données de naissance sont-elles en sécurité ?',
    answer: "Vos données de naissance sont chiffrées en transit (HTTPS) et ne sont jamais vendues à des tiers. Elles servent uniquement à générer votre thème astral et peuvent être supprimées sur demande.",
  },
  {
    question: 'Un astrologue IA peut-il remplacer un astrologue humain ?',
    answer: "L'astrologue IA de Stellara est un outil de lecture rapide et personnalisée, utile pour explorer votre thème natal en autonomie. Il ne remplace pas l'accompagnement approfondi d'un astrologue humain pour une question complexe, mais donne une base solide et immédiate pour se situer.",
  },
]

const openFaq = ref<number | null>(0)

function toggleFaq(index: number) {
  openFaq.value = openFaq.value === index ? null : index
}

useSeoMeta({
  title: 'Thème Astral IA (Gratuit) — Stellara',
  description: "Thème astral IA gratuit en 30 secondes : analyse personnalisée de votre thème natal par intelligence artificielle, sans inscription. Essayez Stellara.",
  ogTitle: 'Thème Astral IA Gratuit — Stellara',
  ogDescription: "Votre astrologue IA personnalisé : thème astral gratuit généré en 30 secondes à partir de vos positions planétaires exactes.",
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

const safeSiteUrl = useSiteUrl()

useHead(() => ({
  link: [
    {
      rel: 'canonical',
      href: `${safeSiteUrl.value}/theme-astral-ia`,
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }),
    },
  ],
}))
</script>
