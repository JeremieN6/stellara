<template>
  <section class="min-h-screen pb-16 pt-20 sm:pb-20 sm:pt-24">
    <div class="section-shell">
      <div class="mx-auto max-w-4xl">
        <header class="text-center">
          <p class="eyebrow mb-3">Signe astrologique</p>
          <h1 class="font-display text-4xl text-white sm:text-6xl">
            Gémeaux : Signe, Personnalité et Ascendant
          </h1>
          <p class="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Troisième signe du zodiaque, le Gémeaux incarne la curiosité et l'agilité mentale. Découvrez sa personnalité en profondeur, et comment chacun des 12 ascendants modifie concrètement son expression au quotidien.
          </p>
        </header>

        <article class="mt-10 glass-panel border border-white/10 p-6 sm:p-8">
          <h2 class="font-display text-2xl text-white sm:text-3xl">Gémeaux en bref</h2>
          <div class="mt-5 grid gap-4 sm:grid-cols-2">
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Dates</p>
              <p class="mt-1 text-sm text-slate-200">21 mai - 20 juin</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Élément</p>
              <p class="mt-1 text-sm text-slate-200">Air</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Modalité</p>
              <p class="mt-1 text-sm text-slate-200">Mutable</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Planète maîtresse</p>
              <p class="mt-1 text-sm text-slate-200">Mercure</p>
            </div>
          </div>
          <p class="mt-5 text-sm leading-7 text-slate-300">
            <span class="text-slate-100">Mots-clés :</span> curieux, communicatif, adaptable, vif, dispersé, sociable.
          </p>
        </article>

        <article class="mt-6 glass-panel border border-white/10 p-6 sm:p-8">
          <h2 class="font-display text-2xl text-white sm:text-3xl">Personnalité du Gémeaux</h2>
          <p class="mt-4 text-base leading-8 text-slate-300">
            Le Gémeaux fonctionne par association d'idées : une conversation en amène une autre, un sujet en ouvre dix de plus, et c'est précisément cette agilité qui le définit. Face à une question, il aime explorer plusieurs réponses possibles avant de se fixer, quitte à changer d'avis en cours de route si un argument plus convaincant se présente.
          </p>
          <p class="mt-4 text-base leading-8 text-slate-300">
            Cette adaptabilité est un vrai atout professionnel et social : le Gémeaux s'ajuste vite à un nouvel environnement, une nouvelle équipe, un nouveau rythme. La limite apparaît quand la dispersion prend le dessus — trop de projets lancés en même temps, trop de promesses faites dans l'enthousiasme du moment, sans toujours le temps de toutes les tenir.
          </p>
          <p class="mt-4 text-base leading-8 text-slate-300">
            En relation, le Gémeaux se connecte par la parole : une bonne conversation compte souvent plus pour lui qu'un grand geste silencieux. Il a besoin d'un lien qui le stimule intellectuellement, et se lasse assez vite d'une routine qui ne laisse plus de place à la surprise ou à la nouveauté.
          </p>
        </article>

        <article class="mt-6 glass-panel border border-white/10 p-6 sm:p-8">
          <h2 class="font-display text-2xl text-white sm:text-3xl">
            Gémeaux et ascendant : comment chaque combinaison change votre expression
          </h2>
          <p class="mt-4 text-sm leading-7 text-slate-400">
            Le signe solaire décrit votre identité de fond, mais l'ascendant colore la façon dont
            cette énergie se manifeste concrètement au quotidien. Voici comment chacun des 12
            ascendants module la curiosité naturelle du Gémeaux.
          </p>

          <div class="mt-6 space-y-5">
            <div v-for="item in ascendantCombos" :key="item.ascendant" class="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 class="font-display text-lg text-white sm:text-xl">
                Gémeaux ascendant {{ item.ascendant }}
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
    text: 'Avec l\'ascendant en Bélier, la vivacité mentale du Gémeaux se transforme presque directement en action : une idée qui germe en réunion devient une initiative avant même que les autres aient fini d\'en discuter. Cette combinaison donne des profils rapides à la fois en pensée et en geste, parfois au prix d\'une réflexion un peu écourtée.',
  },
  {
    ascendant: 'Taureau',
    text: 'Ici, l\'ascendant Taureau ralentit la présentation du Gémeaux sans toucher à sa curiosité intérieure. Dans un entretien par exemple, cette personne prend le temps de formuler ses idées avec plus de calme apparent, même si son esprit continue, en coulisses, à sauter d\'un sujet à l\'autre à toute vitesse. Elle paraît ainsi plus posée que son noyau Gémeaux ne le laisserait deviner.',
  },
  {
    ascendant: 'Gémeaux',
    text: 'Deux influences d\'air mutable s\'additionnent ici plutôt que de se nuancer : la vivacité et le besoin de changer de sujet deviennent quasiment permanents dès le premier abord. Lors d\'un dîner, cette personne peut passer par cinq thèmes de conversation différents sans même s\'en rendre compte, portée par un enthousiasme communicatif.',
  },
  {
    ascendant: 'Cancer',
    text: 'Concrètement, sous l\'ascendant Cancer, l\'agilité mentale du Gémeaux se double d\'une vraie attention aux réactions de son entourage. Avant de lancer une plaisanterie ou une remarque, cette personne observera discrètement comment elle risque d\'être reçue, un réflexe protecteur que son noyau Gémeaux seul n\'aurait pas.',
  },
  {
    ascendant: 'Lion',
    text: 'Dans les faits, l\'ascendant Lion transforme la conversation en scène : le Gémeaux ne se contente plus d\'échanger, il cherche aussi à captiver. Dans un groupe, cette personne prendra volontiers la parole en premier et développera ses idées avec un vrai sens du récit, cherchant la réaction de son audience autant que l\'échange lui-même.',
  },
  {
    ascendant: 'Vierge',
    text: 'Deux influences de Mercure se combinent ici pour organiser la curiosité naturelle du Gémeaux. La dispersion reste possible, mais elle est davantage canalisée : cette personne préfère creuser un sujet avec précision plutôt que de multiplier les pistes sans les approfondir, un vrai changement par rapport au Gémeaux pur.',
  },
  {
    ascendant: 'Balance',
    text: 'On le remarque vite : sous l\'ascendant Balance, le besoin d\'échanger du Gémeaux se met au service du lien plutôt que de la seule curiosité. Dans une négociation par exemple, cette personne cherchera activement un terrain d\'entente, utilisant son aisance verbale pour désamorcer les tensions plutôt que pour simplement partager des idées.',
  },
  {
    ascendant: 'Scorpion',
    text: 'Sur le terrain, l\'ascendant Scorpion ajoute une réserve inattendue à la légèreté habituelle du Gémeaux : la vivacité mentale reste intacte, mais elle s\'accompagne d\'une observation plus fine de ce que l\'autre laisse transparaître. Cette personne peut sembler bavarde en surface tout en gardant, en réalité, une bonne partie de ses pensées pour elle.',
  },
  {
    ascendant: 'Sagittaire',
    text: 'Face à une opportunité de voyage ou de formation par exemple, l\'association Gémeaux-Sagittaire pousse à dire oui immédiatement : la curiosité du signe solaire rencontre ici le besoin d\'horizons larges de l\'ascendant. Le résultat est une soif d\'apprendre qui dépasse le simple goût de la conversation pour devenir une vraie quête de sens.',
  },
  {
    ascendant: 'Capricorne',
    text: 'En pratique, l\'ascendant Capricorne pose un cadre plus sérieux sur l\'agilité du Gémeaux. Dans un cadre professionnel, cette personne continuera à avoir des idées en abondance, mais elle les présentera avec plus de structure et de mesure, consciente que la crédibilité se construit aussi par la rigueur.',
  },
  {
    ascendant: 'Verseau',
    text: 'Deux influences d\'air se rejoignent pour renforcer le goût des idées non conventionnelles. Face à un problème classique, cette personne proposera volontiers une solution originale, presque à contre-courant, portée par un mélange de curiosité Gémeaux et d\'indépendance Verseau.',
  },
  {
    ascendant: 'Poissons',
    text: 'Ici, sous l\'ascendant Poissons, la vivacité verbale du Gémeaux se teinte d\'intuition : cette personne capte les non-dits et les ambiances presque aussi vite qu\'elle capte les mots. Dans une conversation délicate, elle saura souvent ce que l\'autre ressent avant même que celui-ci ne l\'exprime clairement.',
  },
]

useSeoMeta({
  title: 'Gémeaux : Signe, Personnalité et Ascendant | Stellara',
  description: "Découvrez la personnalité du signe Gémeaux, ses forces et vigilances, et comment chacun des 12 ascendants modifie son expression au quotidien.",
})

const safeSiteUrl = useSiteUrl()

useHead(() => ({
  link: [
    {
      rel: 'canonical',
      href: `${safeSiteUrl.value}/gemeaux`,
    },
  ],
}))
</script>
