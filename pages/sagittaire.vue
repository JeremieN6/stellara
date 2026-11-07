<template>
  <section class="min-h-screen pb-16 pt-20 sm:pb-20 sm:pt-24">
    <div class="section-shell">
      <div class="mx-auto max-w-4xl">
        <header class="text-center">
          <p class="eyebrow mb-3">Signe astrologique</p>
          <h1 class="font-display text-4xl text-white sm:text-6xl">
            Sagittaire : Signe, Personnalité et Ascendant
          </h1>
          <p class="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Neuvième signe du zodiaque, le Sagittaire incarne l'optimisme et le besoin d'horizon. Découvrez sa personnalité en profondeur, et comment chacun des 12 ascendants modifie concrètement son expression au quotidien.
          </p>
        </header>

        <article class="mt-10 glass-panel border border-white/10 p-6 sm:p-8">
          <h2 class="font-display text-2xl text-white sm:text-3xl">Sagittaire en bref</h2>
          <div class="mt-5 grid gap-4 sm:grid-cols-2">
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Dates</p>
              <p class="mt-1 text-sm text-slate-200">22 novembre - 21 décembre</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Élément</p>
              <p class="mt-1 text-sm text-slate-200">Feu</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Modalité</p>
              <p class="mt-1 text-sm text-slate-200">Mutable</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Planète maîtresse</p>
              <p class="mt-1 text-sm text-slate-200">Jupiter</p>
            </div>
          </div>
          <p class="mt-5 text-sm leading-7 text-slate-300">
            <span class="text-slate-100">Mots-clés :</span> optimiste, aventurier, franc, philosophe, impatient, expansif.
          </p>
        </article>

        <article class="mt-6 glass-panel border border-white/10 p-6 sm:p-8">
          <h2 class="font-display text-2xl text-white sm:text-3xl">Personnalité du Sagittaire</h2>
          <p class="mt-4 text-base leading-8 text-slate-300">
            Le Sagittaire a besoin d'horizon : un projet qui ne mène nulle part, une routine sans perspective, l'essoufflent rapidement. Sa curiosité ne se limite pas à la géographie — elle touche aussi les idées, les cultures, les grandes questions existentielles, avec un vrai appétit pour comprendre le monde dans son ensemble.
          </p>
          <p class="mt-4 text-base leading-8 text-slate-300">
            Sa franchise est rafraîchissante pour ceux qui l'apprécient : le Sagittaire dit ce qu'il pense, sans détour ni calcul, avec un optimisme qui redonne souvent du courage à son entourage. Le revers apparaît dans le manque de tact occasionnel, ou dans une tendance à promettre plus qu'il ne peut tenir, emporté par son enthousiasme du moment.
          </p>
          <p class="mt-4 text-base leading-8 text-slate-300">
            En relation, le Sagittaire a besoin de liberté et de sincérité : il se sent vite étouffé par la possessivité, mais s'engage pleinement avec quelqu'un qui partage son goût de l'aventure et respecte son besoin d'espace. Il aime construire une relation qui évolue et se renouvelle, plutôt qu'un lien figé dans une routine sans surprise.
          </p>
        </article>

        <article class="mt-6 glass-panel border border-white/10 p-6 sm:p-8">
          <h2 class="font-display text-2xl text-white sm:text-3xl">
            Sagittaire et ascendant : comment chaque combinaison change votre expression
          </h2>
          <p class="mt-4 text-sm leading-7 text-slate-400">
            Le signe solaire décrit votre identité de fond, mais l'ascendant colore la façon dont
            cette énergie se manifeste concrètement au quotidien. Voici comment chacun des 12
            ascendants module l'optimisme du Sagittaire.
          </p>

          <div class="mt-6 space-y-5">
            <div v-for="item in ascendantCombos" :key="item.ascendant" class="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 class="font-display text-lg text-white sm:text-xl">
                Sagittaire ascendant {{ item.ascendant }}
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
    text: 'Deux influences de feu se combinent ici pour amplifier l\'élan naturel du Sagittaire. Face à une opportunité, cette personne dit oui presque avant d\'avoir fini d\'y réfléchir, portée par un besoin d\'action immédiate qui laisse peu de place à l\'hésitation.',
  },
  {
    ascendant: 'Taureau',
    text: 'Ici, sous l\'ascendant Taureau, l\'optimisme du Sagittaire s\'ancre davantage dans le concret. Cette personne garde son goût de l\'aventure, mais elle avance avec plus de patience, prenant le temps de sécuriser des bases stables avant de se lancer dans un nouveau projet.',
  },
  {
    ascendant: 'Gémeaux',
    text: 'Concrètement, l\'ascendant Gémeaux renforce la curiosité du Sagittaire, mais la tourne davantage vers les idées que vers le mouvement physique. Cette personne peut explorer le monde autant à travers les livres et les conversations qu\'à travers de vrais déplacements.',
  },
  {
    ascendant: 'Cancer',
    text: 'Dans les faits, sous l\'ascendant Cancer, l\'élan du Sagittaire se double d\'une vraie attention affective. Cette personne garde son besoin d\'horizon, mais elle reste attentive aux besoins de ses proches, hésitant parfois entre l\'appel du large et l\'envie de rester proche de ceux qu\'elle aime.',
  },
  {
    ascendant: 'Lion',
    text: 'On le remarque vite : l\'ascendant Lion donne de l\'éclat à la vision du Sagittaire : cette personne affiche plus ouvertement sa confiance et cherche à inspirer par son enthousiasme, presque comme un guide naturel pour ceux qui l\'entourent.',
  },
  {
    ascendant: 'Vierge',
    text: 'Sur le terrain, sous l\'ascendant Vierge, l\'élan du Sagittaire se double d\'un souci de méthode qui tempère sa spontanéité naturelle. Cette personne rêve grand, mais elle prépare aussi ses projets avec un sérieux inattendu pour le signe, vérifiant les détails avant de se lancer.',
  },
  {
    ascendant: 'Balance',
    text: 'En pratique, l\'ascendant Balance adoucit la franchise parfois abrupte du Sagittaire : cette personne reste directe sur le fond, mais elle cherche davantage à préserver l\'harmonie dans ses échanges, choisissant ses mots avec plus de tact qu\'un Sagittaire pur.',
  },
  {
    ascendant: 'Scorpion',
    text: 'Ici, sous l\'ascendant Scorpion, l\'optimisme naturel du Sagittaire se double d\'une lucidité plus profonde. Cette personne garde son enthousiasme, mais elle observe aussi les situations avec une intensité qui la rend moins immédiatement ouverte qu\'elle ne le paraît en société.',
  },
  {
    ascendant: 'Sagittaire',
    text: 'Deux influences jupitériennes se renforcent ici plutôt que de se nuancer. La franchise et le besoin d\'horizon, déjà marqués chez le signe solaire, deviennent quasiment débordants dès le premier abord : cette personne dit ce qu\'elle pense sans filtre, et parle de ses projets avec un enthousiasme communicatif.',
  },
  {
    ascendant: 'Capricorne',
    text: 'Concrètement, l\'ascendant Capricorne structure l\'exploration du Sagittaire : cette personne garde son goût du large, mais elle l\'organise avec plus de sérieux et de discipline, transformant ses envies d\'aventure en projets réellement planifiés plutôt qu\'en simples élans.',
  },
  {
    ascendant: 'Verseau',
    text: 'Dans les faits, sous l\'ascendant Verseau, le besoin d\'explorer du Sagittaire se tourne vers les idées non conventionnelles et les visions d\'avenir. Cette personne s\'intéresse moins aux voyages physiques qu\'aux façons différentes de penser le monde et d\'anticiper ce qui vient.',
  },
  {
    ascendant: 'Poissons',
    text: 'On le remarque vite : l\'ascendant Poissons adoucit l\'abord du Sagittaire : l\'optimisme devient plus rêveur et intuitif, moins directement affirmé. Cette personne continue de croire en de grandes possibilités, mais elle les exprime avec une douceur et une sensibilité que le Sagittaire pur n\'a pas toujours.',
  },
]

useSeoMeta({
  title: 'Sagittaire : Signe, Personnalité et Ascendant | Stellara',
  description: "Découvrez la personnalité du signe Sagittaire, ses forces et vigilances, et comment chacun des 12 ascendants modifie son expression au quotidien.",
})

const safeSiteUrl = useSiteUrl()

useHead(() => ({
  link: [
    {
      rel: 'canonical',
      href: `${safeSiteUrl.value}/sagittaire`,
    },
  ],
}))
</script>
