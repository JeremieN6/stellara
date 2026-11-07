<template>
  <section class="min-h-screen pb-16 pt-20 sm:pb-20 sm:pt-24">
    <div class="section-shell">
      <div class="mx-auto max-w-4xl">
        <header class="text-center">
          <p class="eyebrow mb-3">Signe astrologique</p>
          <h1 class="font-display text-4xl text-white sm:text-6xl">
            Capricorne : Signe, Personnalité et Ascendant
          </h1>
          <p class="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Dixième signe du zodiaque, le Capricorne incarne la discipline et l'ambition de long terme. Découvrez sa personnalité en profondeur, et comment chacun des 12 ascendants modifie concrètement son expression au quotidien.
          </p>
        </header>

        <article class="mt-10 glass-panel border border-white/10 p-6 sm:p-8">
          <h2 class="font-display text-2xl text-white sm:text-3xl">Capricorne en bref</h2>
          <div class="mt-5 grid gap-4 sm:grid-cols-2">
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Dates</p>
              <p class="mt-1 text-sm text-slate-200">22 décembre - 19 janvier</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Élément</p>
              <p class="mt-1 text-sm text-slate-200">Terre</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Modalité</p>
              <p class="mt-1 text-sm text-slate-200">Cardinal</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Planète maîtresse</p>
              <p class="mt-1 text-sm text-slate-200">Saturne</p>
            </div>
          </div>
          <p class="mt-5 text-sm leading-7 text-slate-300">
            <span class="text-slate-100">Mots-clés :</span> discipliné, ambitieux, responsable, patient, réservé, structuré.
          </p>
        </article>

        <article class="mt-6 glass-panel border border-white/10 p-6 sm:p-8">
          <h2 class="font-display text-2xl text-white sm:text-3xl">Personnalité du Capricorne</h2>
          <p class="mt-4 text-base leading-8 text-slate-300">
            Le Capricorne construit patiemment, conscient que rien de solide ne se fait dans la précipitation. Il fixe ses objectifs sur le long terme et avance vers eux avec une constance qui impressionne, même quand les résultats tardent à se voir.
          </p>
          <p class="mt-4 text-base leading-8 text-slate-300">
            Son sens des responsabilités en fait quelqu'un sur qui l'on peut s'appuyer : le Capricorne tient ses engagements, assume ses erreurs, et ne fuit pas devant la charge de travail. La difficulté apparaît quand cette rigueur se transforme en pression excessive envers lui-même, ou quand la retenue émotionnelle l'empêche d'exprimer ce qu'il ressent réellement, même à ses proches.
          </p>
          <p class="mt-4 text-base leading-8 text-slate-300">
            En relation, le Capricorne préfère un engagement clair et mature à une romance légère et sans lendemain : il montre son attachement par des actes concrets et une vraie fiabilité, plus que par de grandes déclarations. Il a besoin de temps pour faire confiance, mais une fois cette confiance installée, elle est solide et durable.
          </p>
        </article>

        <article class="mt-6 glass-panel border border-white/10 p-6 sm:p-8">
          <h2 class="font-display text-2xl text-white sm:text-3xl">
            Capricorne et ascendant : comment chaque combinaison change votre expression
          </h2>
          <p class="mt-4 text-sm leading-7 text-slate-400">
            Le signe solaire décrit votre identité de fond, mais l'ascendant colore la façon dont
            cette énergie se manifeste concrètement au quotidien. Voici comment chacun des 12
            ascendants module l'ambition du Capricorne.
          </p>

          <div class="mt-6 space-y-5">
            <div v-for="item in ascendantCombos" :key="item.ascendant" class="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 class="font-display text-lg text-white sm:text-xl">
                Capricorne ascendant {{ item.ascendant }}
              </h3>
              <p class="mt-3 text-sm leading-7 text-slate-300">
                {{ item.text }}
              </p>
            </div>
          </div>
        </article>

        <div class="mt-10 flex flex-wrap items-center justify-center gap-4 text-center">
          <NuxtLink to="/rapport" class="cta-button">
            Découvrir mon ascendant réel avec mon thème natal
          </NuxtLink>
          <NuxtLink to="/signes-astrologiques" class="secondary-button">
            Voir les 12 signes astrologiques
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const ascendantCombos = [
  {
    ascendant: 'Bélier',
    text: 'Ici, l\'ascendant Bélier ajoute de l\'impatience à l\'ambition du Capricorne : cette personne veut construire vite, avec une posture plus directe et moins attentiste que le Capricorne pur. Face à un objectif, elle passe à l\'action immédiatement plutôt que d\'attendre le moment jugé idéal.',
  },
  {
    ascendant: 'Taureau',
    text: 'Deux influences de terre se renforcent ici : la discipline du Capricorne se double d\'un goût du concret qui donne une posture particulièrement stable et peu encline au changement. Cette personne construit ses projets brique par brique, sans jamais bâcler une étape.',
  },
  {
    ascendant: 'Gémeaux',
    text: 'Concrètement, sous l\'ascendant Gémeaux, la structure du Capricorne s\'accompagne d\'une vraie aisance à communiquer ses plans. Cette personne, plutôt réservée par nature, trouve ici les mots pour expliquer sa vision, ce qui la rend plus persuasive qu\'un Capricorne classique dans un rôle de présentation.',
  },
  {
    ascendant: 'Cancer',
    text: 'Dans les faits, l\'ascendant Cancer adoucit la posture du Capricorne : l\'ambition reste entière, mais elle se double d\'un besoin de sécurité affective bien plus visible en surface. Cette personne peut sembler sérieuse et déterminée tout en étant, en privé, beaucoup plus tendre qu\'elle ne le montre au travail.',
  },
  {
    ascendant: 'Lion',
    text: 'On le remarque vite : sous l\'ascendant Lion, l\'ambition du Capricorne gagne en visibilité : cette personne cherche la reconnaissance de ses efforts, pas seulement le résultat concret. Elle assume plus volontiers sa réussite en public qu\'un Capricorne discret ne le ferait naturellement.',
  },
  {
    ascendant: 'Vierge',
    text: 'Deux influences de terre-Mercure se renforcent pour donner une rigueur encore plus poussée. Cette personne allie méthode et discipline avec une posture particulièrement mesurée, orientée vers des résultats précis et vérifiables plutôt que vers de grandes déclarations d\'intention.',
  },
  {
    ascendant: 'Balance',
    text: 'Sur le terrain, l\'ascendant Balance adoucit la retenue habituelle du Capricorne : l\'ambition se conjugue à un vrai souci de l\'image renvoyée et de l\'harmonie relationnelle. Cette personne soigne sa réputation autant que ses résultats concrets.',
  },
  {
    ascendant: 'Scorpion',
    text: 'En pratique, sous l\'ascendant Scorpion, la détermination du Capricorne s\'intensifie : cette personne poursuit ses objectifs avec plus de profondeur et moins de transparence sur ses intentions réelles, gardant volontiers sa stratégie pour elle jusqu\'au dernier moment.',
  },
  {
    ascendant: 'Sagittaire',
    text: 'Ici, l\'ascendant Sagittaire élargit la vision du Capricorne : la structure naturelle du signe s\'ouvre à des ambitions plus larges, portées par un abord plus direct et optimiste que celui d\'un Capricorne classique, souvent perçu comme plus prudent.',
  },
  {
    ascendant: 'Capricorne',
    text: 'Deux influences saturniennes se renforcent ici plutôt que de se nuancer. La discipline et le sens des responsabilités, déjà marqués chez le signe solaire, deviennent presque omniprésents dès le premier abord : cette personne dégage un sérieux immédiatement perceptible, parfois au détriment de la spontanéité.',
  },
  {
    ascendant: 'Verseau',
    text: 'Concrètement, sous l\'ascendant Verseau, l\'ambition du Capricorne s\'accompagne d\'une vraie indépendance de pensée. Cette personne structure ses projets avec rigueur, mais elle garde une vision personnelle, parfois en décalage avec les méthodes conventionnelles de son secteur.',
  },
  {
    ascendant: 'Poissons',
    text: 'Dans les faits, l\'ascendant Poissons adoucit l\'abord du Capricorne : la discipline reste réelle, mais elle se présente avec plus de sensibilité et moins de rigidité apparente. Cette personne peut surprendre par une vraie douceur derrière son sérieux habituel, surtout avec ceux en qui elle a confiance.',
  },
]

useSeoMeta({
  title: 'Capricorne : Signe, Personnalité et Ascendant | Stellara',
  description: "Découvrez la personnalité du signe Capricorne, ses forces et vigilances, et comment chacun des 12 ascendants modifie son expression au quotidien.",
})

const safeSiteUrl = useSiteUrl()

useHead(() => ({
  link: [
    {
      rel: 'canonical',
      href: `${safeSiteUrl.value}/capricorne`,
    },
  ],
}))
</script>
