<template>
  <section class="min-h-screen pb-16 pt-20 sm:pb-20 sm:pt-24">
    <div class="section-shell">
      <div class="mx-auto max-w-4xl">
        <header class="text-center">
          <p class="eyebrow mb-3">Signe astrologique</p>
          <h1 class="font-display text-4xl text-white sm:text-6xl">
            Lion : Signe, Personnalité et Ascendant
          </h1>
          <p class="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Cinquième signe du zodiaque, le Lion incarne le rayonnement et la générosité créative. Découvrez sa personnalité en profondeur, et comment chacun des 12 ascendants modifie concrètement son expression au quotidien.
          </p>
        </header>

        <article class="mt-10 glass-panel border border-white/10 p-6 sm:p-8">
          <h2 class="font-display text-2xl text-white sm:text-3xl">Lion en bref</h2>
          <div class="mt-5 grid gap-4 sm:grid-cols-2">
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Dates</p>
              <p class="mt-1 text-sm text-slate-200">23 juillet - 22 août</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Élément</p>
              <p class="mt-1 text-sm text-slate-200">Feu</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Modalité</p>
              <p class="mt-1 text-sm text-slate-200">Fixe</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Planète maîtresse</p>
              <p class="mt-1 text-sm text-slate-200">Soleil</p>
            </div>
          </div>
          <p class="mt-5 text-sm leading-7 text-slate-300">
            <span class="text-slate-100">Mots-clés :</span> généreux, charismatique, fier, créatif, chaleureux, en quête de reconnaissance.
          </p>
        </article>

        <article class="mt-6 glass-panel border border-white/10 p-6 sm:p-8">
          <h2 class="font-display text-2xl text-white sm:text-3xl">Personnalité du Lion</h2>
          <p class="mt-4 text-base leading-8 text-slate-300">
            Le Lion a besoin d'exister pleinement, pas seulement d'être présent : dans un groupe, il cherche naturellement une place où sa singularité peut s'exprimer et être vue. Cette envie de rayonner n'est pas que de la vanité — c'est une vraie générosité créative qui a besoin d'un public, même restreint, pour se déployer pleinement.
          </p>
          <p class="mt-4 text-base leading-8 text-slate-300">
            Sa chaleur et sa capacité à porter une vision inspirent souvent ceux qui l'entourent : le Lion sait donner confiance, motiver, entraîner un groupe vers un objectif commun. La difficulté survient quand la reconnaissance manque : un Lion qui se sent invisible ou sous-estimé peut se braquer, insister sur son mérite d'une façon qui finit par desservir l'image qu'il cherche justement à construire.
          </p>
          <p class="mt-4 text-base leading-8 text-slate-300">
            En relation, le Lion aime avec générosité et attend en retour une vraie considération : il se donne à fond pour ceux qu'il aime, et a besoin que cet investissement soit reconnu, ne serait-ce que par des mots. Un lien où il se sentirait pris pour acquis, sans jamais de retour valorisant, finit par l'épuiser bien plus vite que ne le laisse deviner son assurance apparente.
          </p>
        </article>

        <article class="mt-6 glass-panel border border-white/10 p-6 sm:p-8">
          <h2 class="font-display text-2xl text-white sm:text-3xl">
            Lion et ascendant : comment chaque combinaison change votre expression
          </h2>
          <p class="mt-4 text-sm leading-7 text-slate-400">
            Le signe solaire décrit votre identité de fond, mais l'ascendant colore la façon dont
            cette énergie se manifeste concrètement au quotidien. Voici comment chacun des 12
            ascendants module le rayonnement du Lion.
          </p>

          <div class="mt-6 space-y-5">
            <div v-for="item in ascendantCombos" :key="item.ascendant" class="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 class="font-display text-lg text-white sm:text-xl">
                Lion ascendant {{ item.ascendant }}
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
    text: 'Avec l\'ascendant en Bélier, le besoin de briller du Lion se double d\'une vraie impatience à passer à l\'action. Face à une opportunité de leadership, cette personne se porte volontaire presque instantanément, portée par une confiance en elle qui ne laisse que peu de place au doute.',
  },
  {
    ascendant: 'Taureau',
    text: 'Ici, l\'ascendant Taureau stabilise le rayonnement du Lion : le magnétisme reste entier, mais il se déploie avec plus de constance et moins de besoin de validation immédiate. Dans un projet de long terme, cette personne construira patiemment sa réputation plutôt que de chercher une reconnaissance instantanée.',
  },
  {
    ascendant: 'Gémeaux',
    text: 'Concrètement, sous l\'ascendant Gémeaux, le Lion capte l\'attention autant par la parole que par la présence physique. Dans une réunion, cette personne prendra la parole avec aisance et humour, utilisant son sens du récit pour captiver son auditoire plutôt que de simplement occuper l\'espace.',
  },
  {
    ascendant: 'Cancer',
    text: 'Dans les faits, l\'ascendant Cancer adoucit la fierté du Lion avec un vrai besoin de proximité affective. Cette personne cherche la reconnaissance, mais surtout celle de ses proches : un compliment venant d\'un inconnu la touchera bien moins qu\'une marque d\'affection sincère de la part de quelqu\'un qu\'elle aime.',
  },
  {
    ascendant: 'Lion',
    text: 'Deux influences solaires se superposent ici, amplifiant le besoin naturel de reconnaissance du signe. Dès le premier abord, cette personne occupe l\'espace avec une assurance qui ne laisse aucun doute sur sa présence, et elle attend, presque comme une évidence, d\'être remarquée pour ce qu\'elle apporte.',
  },
  {
    ascendant: 'Vierge',
    text: 'On le remarque vite : l\'ascendant Vierge canalise la générosité du Lion vers des actes utiles plutôt que vers la seule démonstration. Cette personne préfère souvent aider concrètement en coulisses — organiser, corriger, faciliter — quitte à laisser à d\'autres la lumière qu\'elle mériterait, un vrai contraste avec le Lion pur.',
  },
  {
    ascendant: 'Balance',
    text: 'Sur le terrain, sous l\'ascendant Balance, le rayonnement naturel du Lion se met au service du lien social. Cette personne cherche à plaire autant qu\'à impressionner, soignant son image avec un vrai sens esthétique et un souci constant de l\'harmonie avec son entourage.',
  },
  {
    ascendant: 'Scorpion',
    text: 'En pratique, l\'ascendant Scorpion donne au charisme du Lion une densité moins immédiatement lisible. Cette personne dégage une vraie présence, mais elle la garde volontairement mystérieuse, révélant sa force et ses intentions par petites touches plutôt que d\'un seul coup.',
  },
  {
    ascendant: 'Sagittaire',
    text: 'Deux influences de feu se combinent pour amplifier le besoin d\'expansion du Lion. Face à une occasion de porter un projet à plus grande échelle, cette personne saisira l\'opportunité avec enthousiasme, cherchant une reconnaissance qui dépasse largement son cercle immédiat.',
  },
  {
    ascendant: 'Capricorne',
    text: 'Ici, sous l\'ascendant Capricorne, l\'ambition du Lion se structure autour de résultats concrets plutôt que de la seule présence. Cette personne vise la reconnaissance par la réussite tangible de ses projets, avec une posture publique plus sobre que celle d\'un Lion classique.',
  },
  {
    ascendant: 'Verseau',
    text: 'Concrètement, l\'ascendant Verseau pousse le Lion à chercher à se distinguer par la différence plutôt que par la norme. Cette personne veut être reconnue, mais pour son originalité et sa vision propre, pas seulement pour son éclat — elle préfère souvent innover plutôt que de suivre un chemin déjà tracé.',
  },
  {
    ascendant: 'Poissons',
    text: 'Dans les faits, sous l\'ascendant Poissons, la générosité du Lion devient plus discrète et empathique. Cette personne continue de donner avec chaleur, mais elle le fait avec une sensibilité qui l\'amène à sentir intuitivement ce dont l\'autre a besoin, plutôt que de simplement se mettre en scène pour être vue.',
  },
]

useSeoMeta({
  title: 'Lion : Signe, Personnalité et Ascendant | Stellara',
  description: "Découvrez la personnalité du signe Lion, ses forces et vigilances, et comment chacun des 12 ascendants modifie son expression au quotidien.",
})

const safeSiteUrl = useSiteUrl()

useHead(() => ({
  link: [
    {
      rel: 'canonical',
      href: `${safeSiteUrl.value}/lion`,
    },
  ],
}))
</script>
