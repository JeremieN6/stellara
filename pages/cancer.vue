<template>
  <section class="min-h-screen pb-16 pt-20 sm:pb-20 sm:pt-24">
    <div class="section-shell">
      <div class="mx-auto max-w-4xl">
        <header class="text-center">
          <p class="eyebrow mb-3">Signe astrologique</p>
          <h1 class="font-display text-4xl text-white sm:text-6xl">
            Cancer : Signe, Personnalité et Ascendant
          </h1>
          <p class="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Quatrième signe du zodiaque, le Cancer incarne la sensibilité et l'instinct de protection. Découvrez sa personnalité en profondeur, et comment chacun des 12 ascendants modifie concrètement son expression au quotidien.
          </p>
        </header>

        <article class="mt-10 glass-panel border border-white/10 p-6 sm:p-8">
          <h2 class="font-display text-2xl text-white sm:text-3xl">Cancer en bref</h2>
          <div class="mt-5 grid gap-4 sm:grid-cols-2">
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Dates</p>
              <p class="mt-1 text-sm text-slate-200">21 juin - 22 juillet</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Élément</p>
              <p class="mt-1 text-sm text-slate-200">Eau</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Modalité</p>
              <p class="mt-1 text-sm text-slate-200">Cardinal</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Planète maîtresse</p>
              <p class="mt-1 text-sm text-slate-200">Lune</p>
            </div>
          </div>
          <p class="mt-5 text-sm leading-7 text-slate-300">
            <span class="text-slate-100">Mots-clés :</span> sensible, protecteur, intuitif, loyal, nostalgique, attaché.
          </p>
        </article>

        <article class="mt-6 glass-panel border border-white/10 p-6 sm:p-8">
          <h2 class="font-display text-2xl text-white sm:text-3xl">Personnalité du Cancer</h2>
          <p class="mt-4 text-base leading-8 text-slate-300">
            Le Cancer ressent avant de comprendre : une ambiance, une ombre dans la voix de quelqu'un, un souvenir qui remonte sans prévenir — sa perception du monde passe d'abord par l'émotion. Cette sensibilité aiguë en fait quelqu'un de particulièrement attentif aux besoins des autres, souvent avant même qu'ils ne les expriment.
          </p>
          <p class="mt-4 text-base leading-8 text-slate-300">
            Son instinct de protection est une vraie force dans un rôle d'aidant, de parent ou de soutien : le Cancer sait créer un cadre sécurisant où l'autre se sent accueilli. Le revers apparaît quand la sensibilité devient susceptibilité : une remarque anodine peut être surinterprétée, et le repli sur soi devient alors un réflexe de défense plutôt qu'un vrai choix.
          </p>
          <p class="mt-4 text-base leading-8 text-slate-300">
            En relation, le Cancer s'attache profondément et durablement, parfois même après la fin d'un lien. Il a besoin de preuves de confiance répétées pour se sentir en sécurité, et une fois cette confiance installée, il devient l'un des partenaires les plus loyaux du zodiaque.
          </p>
        </article>

        <article class="mt-6 glass-panel border border-white/10 p-6 sm:p-8">
          <h2 class="font-display text-2xl text-white sm:text-3xl">
            Cancer et ascendant : comment chaque combinaison change votre expression
          </h2>
          <p class="mt-4 text-sm leading-7 text-slate-400">
            Le signe solaire décrit votre identité de fond, mais l'ascendant colore la façon dont
            cette énergie se manifeste concrètement au quotidien. Voici comment chacun des 12
            ascendants module la sensibilité du Cancer.
          </p>

          <div class="mt-6 space-y-5">
            <div v-for="item in ascendantCombos" :key="item.ascendant" class="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 class="font-display text-lg text-white sm:text-xl">
                Cancer ascendant {{ item.ascendant }}
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
    text: 'Ici, l\'ascendant Bélier crée un contraste frappant avec la sensibilité profonde du Cancer : l\'abord devient plus direct et réactif, presque à l\'opposé de la prudence habituelle du signe. Face à une critique par exemple, cette personne répondra du tac au tac, avant de ressentir, une fois seule, la blessure que son noyau Cancer encaisse en silence d\'ordinaire.',
  },
  {
    ascendant: 'Taureau',
    text: 'Concrètement, sous l\'ascendant Taureau, le besoin de sécurité affective du Cancer se double d\'un besoin tout aussi fort de stabilité matérielle. Cette personne cherchera à ancrer sa vie dans des repères concrets — un foyer, une routine, des habitudes — pour se sentir vraiment protégée, bien au-delà du seul lien émotionnel.',
  },
  {
    ascendant: 'Gémeaux',
    text: 'Dans les faits, l\'ascendant Gémeaux donne au Cancer une façade plus légère et bavarde que sa nature profonde ne le suggère. En société, cette personne racontera volontiers des anecdotes et échangera facilement, tout en gardant, sous cette aisance verbale, la même sensibilité et le même besoin de protection que n\'importe quel Cancer.',
  },
  {
    ascendant: 'Cancer',
    text: 'Ici, deux influences d\'eau cardinale se renforcent mutuellement au lieu de se nuancer l\'une l\'autre. La mémoire affective et l\'instinct protecteur du Cancer deviennent presque envahissants dès le premier contact : cette personne se souviendra d\'un détail dit en passant des années plus tôt, et en tiendra compte sans même le mentionner.',
  },
  {
    ascendant: 'Lion',
    text: 'On le remarque vite : sous l\'ascendant Lion, la tendresse du Cancer se manifeste avec plus de démonstration : prendre soin des autres devient aussi une façon de se sentir valorisé et reconnu. Dans une fête de famille par exemple, cette personne organisera volontiers les choses avec chaleur, cherchant à la fois le bien-être du groupe et une place centrale en son sein.',
  },
  {
    ascendant: 'Vierge',
    text: 'Sur le terrain, l\'ascendant Vierge canalise l\'instinct protecteur du Cancer vers des gestes très concrets : plutôt que de grandes démonstrations d\'affection, cette personne prend soin par de petites attentions pratiques — préparer un repas, organiser un rendez-vous médical, anticiper un besoin avant qu\'il ne soit exprimé.',
  },
  {
    ascendant: 'Balance',
    text: 'En pratique, sous l\'ascendant Balance, le besoin de sécurité du Cancer passe davantage par la recherche d\'harmonie que par le seul repli protecteur. Face à un conflit familial par exemple, cette personne cherchera activement à apaiser les tensions plutôt que de se retirer, portée par un vrai souci de préserver le lien.',
  },
  {
    ascendant: 'Scorpion',
    text: 'Deux influences d\'eau se combinent ici pour intensifier la profondeur émotionnelle plutôt que de l\'atténuer. Les sentiments du Cancer, déjà intenses, deviennent sous cet ascendant presque impénétrables de l\'extérieur : cette personne peut vivre une émotion très forte sans que son entourage proche s\'en rende compte immédiatement.',
  },
  {
    ascendant: 'Sagittaire',
    text: 'Un contraste net se dessine entre le besoin de sécurité du Cancer et l\'appel du large propre à l\'ascendant Sagittaire. Cette personne peut afficher un enthousiasme et une ouverture d\'esprit très visibles en société, tout en ayant, une fois rentrée chez elle, un besoin bien réel de retrouver un cocon familier et rassurant.',
  },
  {
    ascendant: 'Capricorne',
    text: 'Le besoin de protection du Cancer se structure sous cet ascendant : cette personne montre sa sollicitude avec plus de retenue et de sérieux, souvent à travers des actes de responsabilité plutôt que des démonstrations émotionnelles. Elle peut par exemple prendre en charge des questions pratiques pour sa famille sans jamais en faire état ouvertement.',
  },
  {
    ascendant: 'Verseau',
    text: 'Ici, sous l\'ascendant Verseau, la sensibilité du Cancer se pare d\'une distance apparente qui peut surprendre son entourage. Cette personne reste attachée et loyale au fond, mais elle montre son affection de façon plus originale et moins conventionnelle qu\'un Cancer classique, parfois par des gestes inattendus plutôt que par la présence physique constante.',
  },
  {
    ascendant: 'Poissons',
    text: 'Deux signes d\'eau se rejoignent pour renforcer une réceptivité émotionnelle déjà très marquée chez le Cancer. Cette personne absorbe les ambiances et les états d\'âme de son entourage avec une facilité presque déconcertante, au point de devoir parfois s\'isoler simplement pour retrouver ses propres émotions au milieu de celles des autres.',
  },
]

useSeoMeta({
  title: 'Cancer : Signe, Personnalité et Ascendant | Stellara',
  description: "Découvrez la personnalité du signe Cancer, ses forces et vigilances, et comment chacun des 12 ascendants modifie son expression au quotidien.",
})

const safeSiteUrl = useSiteUrl()

useHead(() => ({
  link: [
    {
      rel: 'canonical',
      href: `${safeSiteUrl.value}/cancer`,
    },
  ],
}))
</script>
