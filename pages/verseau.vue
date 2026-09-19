<template>
  <section class="min-h-screen pb-16 pt-20 sm:pb-20 sm:pt-24">
    <div class="section-shell">
      <div class="mx-auto max-w-4xl">
        <header class="text-center">
          <p class="eyebrow mb-3">Signe astrologique</p>
          <h1 class="font-display text-4xl text-white sm:text-6xl">
            Verseau : Signe, Personnalité et Ascendant
          </h1>
          <p class="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Onzième signe du zodiaque, le Verseau incarne l'indépendance et la vision. Découvrez sa personnalité en profondeur, et comment chacun des 12 ascendants modifie concrètement son expression au quotidien.
          </p>
        </header>

        <article class="mt-10 glass-panel border border-white/10 p-6 sm:p-8">
          <h2 class="font-display text-2xl text-white sm:text-3xl">Verseau en bref</h2>
          <div class="mt-5 grid gap-4 sm:grid-cols-2">
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Dates</p>
              <p class="mt-1 text-sm text-slate-200">20 janvier - 18 février</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Élément</p>
              <p class="mt-1 text-sm text-slate-200">Air</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Modalité</p>
              <p class="mt-1 text-sm text-slate-200">Fixe</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Planète maîtresse</p>
              <p class="mt-1 text-sm text-slate-200">Uranus (mod.) / Saturne (trad.)</p>
            </div>
          </div>
          <p class="mt-5 text-sm leading-7 text-slate-300">
            <span class="text-slate-100">Mots-clés :</span> indépendant, original, visionnaire, humaniste, détaché, non conformiste.
          </p>
        </article>

        <article class="mt-6 glass-panel border border-white/10 p-6 sm:p-8">
          <h2 class="font-display text-2xl text-white sm:text-3xl">Personnalité du Verseau</h2>
          <p class="mt-4 text-base leading-8 text-slate-300">
            Le Verseau pense différemment presque par réflexe : face à une norme établie, il se demande spontanément pourquoi les choses doivent forcément se faire ainsi, et s'il n'existerait pas une meilleure façon de procéder. Cette originalité n'est pas une posture — c'est une vraie manière de voir le monde qui le pousse naturellement vers l'innovation.
          </p>
          <p class="mt-4 text-base leading-8 text-slate-300">
            Son sens de l'humain à grande échelle en fait un allié précieux pour des causes collectives : le Verseau se soucie souvent plus de l'avenir du groupe ou de la société que de son intérêt personnel immédiat. La difficulté apparaît dans la proximité individuelle : une certaine distance émotionnelle peut faire sentir à ses proches qu'il intellectualise tout, même les sujets les plus intimes.
          </p>
          <p class="mt-4 text-base leading-8 text-slate-300">
            En relation, le Verseau a besoin d'espace et de respect mutuel : il s'attache profondément mais refuse la fusion étouffante, préférant un lien qui évolue et laisse à chacun sa liberté. Il apprécie particulièrement une relation qui ressemble davantage à une amitié complice qu'à une dépendance affective classique.
          </p>
        </article>

        <article class="mt-6 glass-panel border border-white/10 p-6 sm:p-8">
          <h2 class="font-display text-2xl text-white sm:text-3xl">
            Verseau et ascendant : comment chaque combinaison change votre expression
          </h2>
          <p class="mt-4 text-sm leading-7 text-slate-400">
            Le signe solaire décrit votre identité de fond, mais l'ascendant colore la façon dont
            cette énergie se manifeste concrètement au quotidien. Voici comment chacun des 12
            ascendants module l'indépendance du Verseau.
          </p>

          <div class="mt-6 space-y-5">
            <div v-for="item in ascendantCombos" :key="item.ascendant" class="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 class="font-display text-lg text-white sm:text-xl">
                Verseau ascendant {{ item.ascendant }}
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
    text: 'Ici, l\'ascendant Bélier ajoute de l\'impulsivité à l\'indépendance du Verseau : cette personne affirme sa différence avec plus de rapidité et moins de détour qu\'un Verseau classique. Face à une idée qui la convainc, elle agit presque immédiatement, sans attendre l\'approbation du groupe.',
  },
  {
    ascendant: 'Taureau',
    text: 'Concrètement, sous l\'ascendant Taureau, l\'originalité du Verseau se stabilise en surface : cette personne garde sa vision propre, mais elle l\'exprime avec plus de constance et de calme apparent, ce qui peut la rendre plus persuasive auprès d\'un public habituellement méfiant envers le changement.',
  },
  {
    ascendant: 'Gémeaux',
    text: 'Deux influences d\'air se renforcent ici pour donner une vraie vivacité intellectuelle : l\'indépendance d\'esprit du Verseau se traduit par un plaisir manifeste de l\'échange d\'idées, cette personne aimant particulièrement débattre de concepts nouveaux ou inhabituels.',
  },
  {
    ascendant: 'Cancer',
    text: 'Dans les faits, l\'ascendant Cancer adoucit le détachement du Verseau : l\'originalité reste entière, mais elle se double d\'une sensibilité plus visible qu\'attendu en premier abord. Cette personne peut surprendre en montrant un vrai attachement affectif derrière son discours souvent tourné vers les grandes idées.',
  },
  {
    ascendant: 'Lion',
    text: 'On le remarque vite : sous l\'ascendant Lion, la différence du Verseau gagne en visibilité : cette personne affiche plus ouvertement son besoin d\'être reconnue pour son unicité, revendiquant avec assurance ce qui la distingue des autres plutôt que de le garder discret.',
  },
  {
    ascendant: 'Vierge',
    text: 'Sur le terrain, l\'ascendant Vierge canalise la vision du Verseau vers le concret : l\'originalité se met au service d\'idées précises et applicables. Cette personne peut ainsi transformer une intuition visionnaire en système pratique et fonctionnel, ce qu\'un Verseau pur laisse parfois à l\'état de concept.',
  },
  {
    ascendant: 'Balance',
    text: 'En pratique, sous l\'ascendant Balance, l\'indépendance du Verseau se conjugue à un vrai souci du lien et de l\'harmonie relationnelle. Cette personne défend ses idées originales, mais elle prend soin de le faire avec diplomatie, cherchant à convaincre plutôt qu\'à simplement affirmer sa différence.',
  },
  {
    ascendant: 'Scorpion',
    text: 'Ici, l\'ascendant Scorpion intensifie le détachement du Verseau : cette personne garde ses distances avec plus de profondeur et moins de transparence apparente, observant longuement avant de révéler ce qu\'elle pense vraiment d\'une situation.',
  },
  {
    ascendant: 'Sagittaire',
    text: 'Deux influences d\'air-feu se combinent pour amplifier l\'ouverture d\'esprit du Verseau : l\'indépendance se double d\'une soif d\'horizons larges et d\'idées neuves, cette personne cherchant constamment à élargir sa vision du monde.',
  },
  {
    ascendant: 'Capricorne',
    text: 'Concrètement, sous l\'ascendant Capricorne, l\'originalité du Verseau se structure : cette personne garde sa vision propre, mais elle l\'organise avec plus de sérieux et de méthode, ce qui lui permet de faire accepter des idées non conventionnelles dans des contextes plus traditionnels.',
  },
  {
    ascendant: 'Verseau',
    text: 'Deux influences uraniennes se renforcent ici plutôt que de se nuancer. L\'indépendance et le non-conformisme, déjà marqués chez le signe solaire, deviennent presque absolus dès le premier abord : cette personne assume pleinement sa différence, sans chercher particulièrement à rassurer son entourage.',
  },
  {
    ascendant: 'Poissons',
    text: 'Dans les faits, l\'ascendant Poissons adoucit le détachement du Verseau : l\'indépendance devient plus intuitive et empathique, moins purement intellectuelle. Cette personne continue de penser différemment, mais elle le fait avec une sensibilité et une ouverture émotionnelle qu\'un Verseau pur n\'exprime pas toujours.',
  },
]

useSeoMeta({
  title: 'Verseau : Signe, Personnalité et Ascendant | Stellara',
  description: "Découvrez la personnalité du signe Verseau, ses forces et vigilances, et comment chacun des 12 ascendants modifie son expression au quotidien.",
})

const safeSiteUrl = useSiteUrl()

useHead(() => ({
  link: [
    {
      rel: 'canonical',
      href: `${safeSiteUrl.value}/verseau`,
    },
  ],
}))
</script>
