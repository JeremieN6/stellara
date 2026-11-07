<template>
  <section class="min-h-screen pb-16 pt-20 sm:pb-20 sm:pt-24">
    <div class="section-shell">
      <div class="mx-auto max-w-4xl">
        <header class="text-center">
          <p class="eyebrow mb-3">Signe astrologique</p>
          <h1 class="font-display text-4xl text-white sm:text-6xl">
            Balance : Signe, Personnalité et Ascendant
          </h1>
          <p class="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Septième signe du zodiaque, la Balance incarne l'harmonie et la diplomatie. Découvrez sa personnalité en profondeur, et comment chacun des 12 ascendants modifie concrètement son expression au quotidien.
          </p>
        </header>

        <article class="mt-10 glass-panel border border-white/10 p-6 sm:p-8">
          <h2 class="font-display text-2xl text-white sm:text-3xl">Balance en bref</h2>
          <div class="mt-5 grid gap-4 sm:grid-cols-2">
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Dates</p>
              <p class="mt-1 text-sm text-slate-200">23 septembre - 22 octobre</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Élément</p>
              <p class="mt-1 text-sm text-slate-200">Air</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Modalité</p>
              <p class="mt-1 text-sm text-slate-200">Cardinal</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Planète maîtresse</p>
              <p class="mt-1 text-sm text-slate-200">Vénus</p>
            </div>
          </div>
          <p class="mt-5 text-sm leading-7 text-slate-300">
            <span class="text-slate-100">Mots-clés :</span> diplomate, esthète, équilibré, sociable, indécis, conciliant.
          </p>
        </article>

        <article class="mt-6 glass-panel border border-white/10 p-6 sm:p-8">
          <h2 class="font-display text-2xl text-white sm:text-3xl">Personnalité du Balance</h2>
          <p class="mt-4 text-base leading-8 text-slate-300">
            La Balance cherche instinctivement le point d'équilibre : dans une discussion, elle voit souvent les deux côtés d'un argument avant de se prononcer, ce qui en fait une excellente médiatrice mais aussi, parfois, quelqu'un qui met du temps à trancher. Son sens esthétique n'est pas superficiel — c'est une vraie recherche d'harmonie qui s'applique autant à son environnement qu'à ses relations.
          </p>
          <p class="mt-4 text-base leading-8 text-slate-300">
            Sa diplomatie est précieuse dans les situations tendues : la Balance sait désamorcer un conflit, trouver les mots qui apaisent, proposer un compromis acceptable pour tous. La difficulté apparaît quand ce souci d'équilibre tourne à l'indécision paralysante, ou quand elle évite un désaccord nécessaire simplement pour ne pas déplaire.
          </p>
          <p class="mt-4 text-base leading-8 text-slate-300">
            En relation, la Balance a besoin de réciprocité et d'un vrai dialogue : elle donne beaucoup d'attention à l'autre et attend la même chose en retour. Un lien trop déséquilibré, où elle donnerait sans recevoir, finit par l'épuiser, même si elle mettra du temps à l'exprimer clairement par peur de rompre l'harmonie.
          </p>
        </article>

        <article class="mt-6 glass-panel border border-white/10 p-6 sm:p-8">
          <h2 class="font-display text-2xl text-white sm:text-3xl">
            Balance et ascendant : comment chaque combinaison change votre expression
          </h2>
          <p class="mt-4 text-sm leading-7 text-slate-400">
            Le signe solaire décrit votre identité de fond, mais l'ascendant colore la façon dont
            cette énergie se manifeste concrètement au quotidien. Voici comment chacun des 12
            ascendants module la recherche d'harmonie de la Balance.
          </p>

          <div class="mt-6 space-y-5">
            <div v-for="item in ascendantCombos" :key="item.ascendant" class="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 class="font-display text-lg text-white sm:text-xl">
                Balance ascendant {{ item.ascendant }}
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
    text: 'Ici, l\'ascendant Bélier crée un contraste net avec la nature conciliante de la Balance : l\'abord devient plus direct et tranché, presque à l\'opposé de sa diplomatie habituelle. Face à un désaccord, cette personne peut trancher plus vite qu\'elle ne le ferait naturellement, avant de revenir ensuite vers une posture plus mesurée.',
  },
  {
    ascendant: 'Taureau',
    text: 'Concrètement, sous l\'ascendant Taureau, le besoin d\'harmonie de la Balance s\'ancre dans le concret. Cette personne cherche l\'équilibre à travers des repères stables et tangibles — un foyer agréable, une routine confortable — plutôt que par le seul dialogue ou la seule esthétique.',
  },
  {
    ascendant: 'Gémeaux',
    text: 'Dans les faits, l\'ascendant Gémeaux renforce le talent de dialogue de la Balance : le sens du lien, déjà fort chez le signe solaire, devient plus bavard et curieux des points de vue multiples. Cette personne aime littéralement discuter pour discuter, pas seulement pour arriver à un compromis.',
  },
  {
    ascendant: 'Cancer',
    text: 'On le remarque vite : sous l\'ascendant Cancer, la diplomatie de la Balance se double d\'une vraie sensibilité affective. Cette personne cherche l\'harmonie autant pour se sentir en sécurité émotionnellement que par simple goût de l\'équilibre, et elle est particulièrement affectée par les tensions relationnelles non résolues.',
  },
  {
    ascendant: 'Lion',
    text: 'Sur le terrain, l\'ascendant Lion donne de l\'éclat social au sens de l\'harmonie de la Balance : cette personne veut plaire et être remarquée pour son goût et son élégance, pas seulement pour sa capacité à concilier. Elle soigne son image avec un vrai souci de faire bonne impression.',
  },
  {
    ascendant: 'Vierge',
    text: 'En pratique, sous l\'ascendant Vierge, l\'esthétique de la Balance se canalise vers le détail précis. Cette personne affine son sens du beau avec un vrai souci de justesse : un intérieur ne sera pas juste harmonieux à ses yeux, il devra aussi être parfaitement agencé jusque dans les détails.',
  },
  {
    ascendant: 'Balance',
    text: 'Deux influences vénusiennes se superposent ici, amplifiant la recherche d\'équilibre déjà centrale chez le signe solaire. Face à une décision à prendre, cette personne pèsera longuement chaque option, cherchant la solution la plus juste possible — au risque d\'une indécision plus visible que chez une Balance classique.',
  },
  {
    ascendant: 'Scorpion',
    text: 'Ici, l\'ascendant Scorpion intensifie la relation chez la Balance : la recherche d\'harmonie se double d\'un besoin de profondeur et d\'authenticité qui va bien au-delà de la simple politesse sociale. Cette personne préfère un lien vrai, même exigeant, à une entente de façade.',
  },
  {
    ascendant: 'Sagittaire',
    text: 'Concrètement, sous l\'ascendant Sagittaire, la franchise vient nuancer le tact habituel de la Balance. Cette personne reste conciliante sur le fond, mais elle s\'exprime avec plus de spontanéité, disant parfois les choses plus directement que ne le ferait une Balance pure, quitte à surprendre son entourage.',
  },
  {
    ascendant: 'Capricorne',
    text: 'Dans les faits, l\'ascendant Capricorne structure la relation chez la Balance : le besoin d\'harmonie se conjugue à une posture plus sérieuse et réfléchie sur l\'engagement. Cette personne ne cherche pas seulement à plaire dans l\'instant, elle pense la relation sur le long terme, avec un vrai sens des responsabilités mutuelles.',
  },
  {
    ascendant: 'Verseau',
    text: 'On le remarque vite : sous l\'ascendant Verseau, l\'indépendance vient tempérer le besoin relationnel de la Balance. Cette personne cherche toujours l\'équilibre avec les autres, mais elle tient aussi à garder une vraie liberté de pensée, refusant de sacrifier ses convictions uniquement pour préserver l\'harmonie.',
  },
  {
    ascendant: 'Poissons',
    text: 'Sur le terrain, l\'ascendant Poissons adoucit encore l\'abord de la Balance : le sens de l\'harmonie devient plus intuitif et empathique, moins centré sur le calcul relationnel conscient. Cette personne ressent ce qui doit être apaisé avant même d\'avoir eu le temps d\'y réfléchir.',
  },
]

useSeoMeta({
  title: 'Balance : Signe, Personnalité et Ascendant | Stellara',
  description: "Découvrez la personnalité du signe Balance, ses forces et vigilances, et comment chacun des 12 ascendants modifie son expression au quotidien.",
})

const safeSiteUrl = useSiteUrl()

useHead(() => ({
  link: [
    {
      rel: 'canonical',
      href: `${safeSiteUrl.value}/balance`,
    },
  ],
}))
</script>
