<template>
  <section class="min-h-screen pb-16 pt-20 sm:pb-20 sm:pt-24">
    <div class="section-shell">
      <div class="mx-auto max-w-4xl">
        <header class="text-center">
          <p class="eyebrow mb-3">Signe astrologique</p>
          <h1 class="font-display text-4xl text-white sm:text-6xl">
            Scorpion : Signe, Personnalité et Ascendant
          </h1>
          <p class="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Huitième signe du zodiaque, le Scorpion incarne l'intensité et la transformation. Découvrez sa personnalité en profondeur, et comment chacun des 12 ascendants modifie concrètement son expression au quotidien.
          </p>
        </header>

        <article class="mt-10 glass-panel border border-white/10 p-6 sm:p-8">
          <h2 class="font-display text-2xl text-white sm:text-3xl">Scorpion en bref</h2>
          <div class="mt-5 grid gap-4 sm:grid-cols-2">
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Dates</p>
              <p class="mt-1 text-sm text-slate-200">23 octobre - 21 novembre</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Élément</p>
              <p class="mt-1 text-sm text-slate-200">Eau</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Modalité</p>
              <p class="mt-1 text-sm text-slate-200">Fixe</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Planète maîtresse</p>
              <p class="mt-1 text-sm text-slate-200">Pluton (mod.) / Mars (trad.)</p>
            </div>
          </div>
          <p class="mt-5 text-sm leading-7 text-slate-300">
            <span class="text-slate-100">Mots-clés :</span> intense, lucide, mystérieux, déterminé, méfiant, transformateur.
          </p>
        </article>

        <article class="mt-6 glass-panel border border-white/10 p-6 sm:p-8">
          <h2 class="font-display text-2xl text-white sm:text-3xl">Personnalité du Scorpion</h2>
          <p class="mt-4 text-base leading-8 text-slate-300">
            Le Scorpion ne fait rien à moitié : ce qui l'intéresse, il s'y investit avec une intensité rare, et ce qui ne compte plus pour lui, il peut le couper net, sans retour en arrière. Cette capacité à voir au-delà des apparences en fait quelqu'un de difficile à berner : il sent vite quand quelque chose sonne faux, même si personne d'autre ne l'a remarqué.
          </p>
          <p class="mt-4 text-base leading-8 text-slate-300">
            Sa force de transformation est impressionnante : le Scorpion traverse les crises et en ressort souvent plus fort, capable de se réinventer là où d'autres resteraient bloqués. La difficulté apparaît quand la lucidité tourne à la méfiance systématique, ou quand le besoin de contrôle l'empêche de lâcher prise, même quand ce serait la meilleure chose à faire.
          </p>
          <p class="mt-4 text-base leading-8 text-slate-300">
            En relation, le Scorpion s'engage à fond ou pas du tout : il n'a pas de goût pour les liens superficiels et cherche une vraie profondeur émotionnelle. La confiance se gagne lentement avec lui, mais une fois accordée, elle s'accompagne d'une loyauté totale, rarement remise en cause tant qu'elle n'a pas été trahie.
          </p>
        </article>

        <article class="mt-6 glass-panel border border-white/10 p-6 sm:p-8">
          <h2 class="font-display text-2xl text-white sm:text-3xl">
            Scorpion et ascendant : comment chaque combinaison change votre expression
          </h2>
          <p class="mt-4 text-sm leading-7 text-slate-400">
            Le signe solaire décrit votre identité de fond, mais l'ascendant colore la façon dont
            cette énergie se manifeste concrètement au quotidien. Voici comment chacun des 12
            ascendants module l'intensité du Scorpion.
          </p>

          <div class="mt-6 space-y-5">
            <div v-for="item in ascendantCombos" :key="item.ascendant" class="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 class="font-display text-lg text-white sm:text-xl">
                Scorpion ascendant {{ item.ascendant }}
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
    text: 'Ici, l\'ascendant Bélier ajoute de l\'impulsivité à l\'intensité naturelle du Scorpion : cette personne agit plus vite qu\'à son habitude, avec une détermination très visible en surface. Face à un obstacle, elle fonce plutôt que d\'observer longuement, ce qui contraste avec la prudence habituelle du signe solaire.',
  },
  {
    ascendant: 'Taureau',
    text: 'Concrètement, sous l\'ascendant Taureau, la puissance intérieure du Scorpion se stabilise en surface. Cette personne garde son intensité, mais elle la montre avec plus de calme et de constance apparente — un sang-froid qui masque, sous cet ascendant fixe comme le signe, une détermination tout aussi tenace.',
  },
  {
    ascendant: 'Gémeaux',
    text: 'Dans les faits, l\'ascendant Gémeaux ajoute de la légèreté en façade au Scorpion : cette personne paraît plus communicative et accessible qu\'un Scorpion classique, tout en gardant sa profondeur en réserve. Elle peut ainsi surprendre son entourage en révélant, dans un second temps, une intensité qu\'ils n\'avaient pas soupçonnée.',
  },
  {
    ascendant: 'Cancer',
    text: 'On le remarque vite : sous l\'ascendant Cancer, la lucidité du Scorpion se double d\'un besoin de sécurité affective plus visible. Cette personne protège ceux qu\'elle aime avec une détermination farouche, capable de se transformer en vrai bouclier dès qu\'elle sent une menace peser sur ses proches.',
  },
  {
    ascendant: 'Lion',
    text: 'Sur le terrain, l\'ascendant Lion donne de la présence au magnétisme du Scorpion : l\'intensité devient plus affirmée et moins dissimulée. Cette personne ne cache plus totalement sa force, elle l\'assume avec un certain éclat, presque théâtral, qui tranche avec la discrétion habituelle du signe solaire.',
  },
  {
    ascendant: 'Vierge',
    text: 'En pratique, sous l\'ascendant Vierge, le contrôle du Scorpion se canalise vers la précision plutôt que vers la seule intensité émotionnelle. Cette personne analyse méthodiquement les situations, préférant comprendre en détail avant d\'agir plutôt que de laisser transparaître directement son ressenti.',
  },
  {
    ascendant: 'Balance',
    text: 'Ici, l\'ascendant Balance adoucit l\'abord du Scorpion : l\'intensité reste réelle en profondeur, mais elle se présente avec plus de diplomatie et de souci de l\'autre en surface. Cette personne peut sembler conciliante alors qu\'elle observe en réalité très attentivement la situation.',
  },
  {
    ascendant: 'Scorpion',
    text: 'Deux influences plutoniennes se renforcent ici plutôt que de se nuancer. La profondeur, déjà marquée chez le Scorpion solaire, devient presque totale dès le premier abord : cette personne dégage une intensité difficile à ignorer, tout en restant volontairement opaque sur ses intentions réelles.',
  },
  {
    ascendant: 'Sagittaire',
    text: 'Un contraste net se dessine entre la profondeur intérieure du Scorpion et un abord plus ouvert, franc et optimiste sous l\'ascendant Sagittaire. Cette personne peut sembler étonnamment directe et spontanée en société, alors que sa nature profonde reste bien plus réservée et calculatrice qu\'il n\'y paraît.',
  },
  {
    ascendant: 'Capricorne',
    text: 'Concrètement, sous l\'ascendant Capricorne, la puissance du Scorpion se canalise vers l\'ambition et la maîtrise plutôt que vers l\'émotion visible. Cette personne poursuit ses objectifs avec une détermination froide et méthodique, gardant ses véritables motivations pour elle jusqu\'à ce que les résultats parlent d\'eux-mêmes.',
  },
  {
    ascendant: 'Verseau',
    text: 'Dans les faits, l\'ascendant Verseau ajoute du détachement apparent à une nature pourtant intense : cette personne se présente avec une posture plus distante et analytique, presque comme si elle observait sa propre intensité de l\'extérieur avant de décider comment l\'exprimer.',
  },
  {
    ascendant: 'Poissons',
    text: 'Deux influences d\'eau se combinent pour renforcer la porosité émotionnelle du Scorpion. Cette personne ressent tout avec une intensité rare, mais cette intensité se teinte ici d\'une sensibilité plus diffuse et moins contrôlée en surface, parfois même difficile à nommer pour elle-même.',
  },
]

useSeoMeta({
  title: 'Scorpion : Signe, Personnalité et Ascendant | Stellara',
  description: "Découvrez la personnalité du signe Scorpion, ses forces et vigilances, et comment chacun des 12 ascendants modifie son expression au quotidien.",
})

const safeSiteUrl = useSiteUrl()

useHead(() => ({
  link: [
    {
      rel: 'canonical',
      href: `${safeSiteUrl.value}/scorpion`,
    },
  ],
}))
</script>
