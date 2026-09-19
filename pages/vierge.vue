<template>
  <section class="min-h-screen pb-16 pt-20 sm:pb-20 sm:pt-24">
    <div class="section-shell">
      <div class="mx-auto max-w-4xl">
        <header class="text-center">
          <p class="eyebrow mb-3">Signe astrologique</p>
          <h1 class="font-display text-4xl text-white sm:text-6xl">
            Vierge : Signe, Personnalité et Ascendant
          </h1>
          <p class="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Sixième signe du zodiaque, la Vierge incarne la précision et le sens pratique. Découvrez sa personnalité en profondeur, et comment chacun des 12 ascendants modifie concrètement son expression au quotidien.
          </p>
        </header>

        <article class="mt-10 glass-panel border border-white/10 p-6 sm:p-8">
          <h2 class="font-display text-2xl text-white sm:text-3xl">Vierge en bref</h2>
          <div class="mt-5 grid gap-4 sm:grid-cols-2">
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Dates</p>
              <p class="mt-1 text-sm text-slate-200">23 août - 22 septembre</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Élément</p>
              <p class="mt-1 text-sm text-slate-200">Terre</p>
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
            <span class="text-slate-100">Mots-clés :</span> précis, analytique, serviable, perfectionniste, organisé, pragmatique.
          </p>
        </article>

        <article class="mt-6 glass-panel border border-white/10 p-6 sm:p-8">
          <h2 class="font-display text-2xl text-white sm:text-3xl">Personnalité du Vierge</h2>
          <p class="mt-4 text-base leading-8 text-slate-300">
            La Vierge observe avant d'agir : elle repère les détails que d'autres laissent passer, identifie ce qui pourrait être amélioré, et ressent souvent un vrai inconfort face à ce qui est mal fait ou laissé à moitié. Cette attention au détail n'est pas de la pinaillerie gratuite — c'est une vraie recherche de justesse et d'utilité concrète.
          </p>
          <p class="mt-4 text-base leading-8 text-slate-300">
            Son sens pratique en fait une personne sur qui l'on peut compter : la Vierge tient ses engagements, anticipe les problèmes, et sait transformer une idée floue en plan d'action précis. La difficulté apparaît quand le perfectionnisme se retourne contre elle-même : une autocritique sévère, un stress lié à l'impression de ne jamais en faire assez, ou une difficulté à déléguer par peur que ce soit mal fait.
          </p>
          <p class="mt-4 text-base leading-8 text-slate-300">
            En relation, la Vierge montre son attachement à travers des gestes concrets plutôt que de grandes déclarations : elle se souviendra d'un détail important, anticipera un besoin, réglera discrètement un problème avant même qu'on le lui demande. Elle a besoin de fiabilité en retour, et se sent rapidement déstabilisée par le flou ou l'imprévisibilité.
          </p>
        </article>

        <article class="mt-6 glass-panel border border-white/10 p-6 sm:p-8">
          <h2 class="font-display text-2xl text-white sm:text-3xl">
            Vierge et ascendant : comment chaque combinaison change votre expression
          </h2>
          <p class="mt-4 text-sm leading-7 text-slate-400">
            Le signe solaire décrit votre identité de fond, mais l'ascendant colore la façon dont
            cette énergie se manifeste concrètement au quotidien. Voici comment chacun des 12
            ascendants module le sens pratique de la Vierge.
          </p>

          <div class="mt-6 space-y-5">
            <div v-for="item in ascendantCombos" :key="item.ascendant" class="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 class="font-display text-lg text-white sm:text-xl">
                Vierge ascendant {{ item.ascendant }}
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
    text: 'Ici, l\'ascendant Bélier ajoute une vraie impatience au souci de bien faire de la Vierge. Face à une tâche urgente, cette personne veut agir tout de suite, quitte à commencer avant d\'avoir terminé son analyse habituelle — un compromis parfois inconfortable pour elle, tiraillée entre précision et rapidité.',
  },
  {
    ascendant: 'Taureau',
    text: 'Concrètement, sous l\'ascendant Taureau, le sens pratique de la Vierge se double d\'un vrai goût du concret et de la stabilité. Cette personne préfère les solutions durables aux ajustements rapides, et elle construit méthodiquement, brique par brique, avec une patience que la Vierge seule n\'a pas toujours.',
  },
  {
    ascendant: 'Gémeaux',
    text: 'Dans les faits, l\'ascendant Gémeaux donne à l\'analyse de la Vierge plus de fluidité à l\'oral. Cette personne communique facilement ses observations, parfois avec un débit rapide qui trahit combien d\'informations elle a déjà traitées avant même d\'ouvrir la bouche.',
  },
  {
    ascendant: 'Cancer',
    text: 'On le remarque vite : sous l\'ascendant Cancer, le souci du détail de la Vierge se met au service du soin des autres. Cette personne remarque les petits signes de fatigue ou de tristesse chez ses proches, et y répond par des attentions précises et discrètes plutôt que par de grandes démonstrations.',
  },
  {
    ascendant: 'Lion',
    text: 'Sur le terrain, l\'ascendant Lion donne plus de visibilité à l\'exigence habituellement discrète de la Vierge. Cette personne veut que son travail bien fait soit vu et reconnu, et elle peut, à l\'occasion, insister pour que ses efforts ne passent pas inaperçus — un vrai contraste avec la modestie naturelle du signe.',
  },
  {
    ascendant: 'Vierge',
    text: 'Deux influences de Mercure-terre se renforcent ici plutôt que de se nuancer. La précision et l\'autocritique, déjà marquées chez la Vierge solaire, deviennent presque systématiques dès le premier abord : cette personne relira, vérifiera, ajustera un détail plusieurs fois avant de considérer une tâche vraiment terminée.',
  },
  {
    ascendant: 'Balance',
    text: 'En pratique, sous l\'ascendant Balance, l\'exigence de la Vierge se met au service de l\'harmonie relationnelle plutôt que de la seule performance. Cette personne cherchera à corriger les choses sans blesser, en formulant ses remarques avec beaucoup plus de tact qu\'une Vierge pure ne le ferait spontanément.',
  },
  {
    ascendant: 'Scorpion',
    text: 'Ici, l\'ascendant Scorpion intensifie l\'analyse de la Vierge : cette personne observe avec une profondeur presque clinique, et garde volontiers ses conclusions pour elle jusqu\'à ce qu\'elle soit certaine d\'avoir bien compris la situation. Elle peut ainsi sembler distante alors qu\'elle est en réalité en pleine évaluation silencieuse.',
  },
  {
    ascendant: 'Sagittaire',
    text: 'Un contraste intéressant naît ici entre le souci du détail de la Vierge et la vision large propre à l\'ascendant Sagittaire. Cette personne peut se perdre dans les petits détails d\'un projet tout en gardant, en toile de fond, une ambition ou une envie d\'horizon qui dépasse largement la simple exécution.',
  },
  {
    ascendant: 'Capricorne',
    text: 'Concrètement, sous l\'ascendant Capricorne, la méthode de la Vierge se double d\'une vraie discipline de long terme. Cette personne construit sa réussite pas à pas, avec un sérieux et une orientation résultat qui font d\'elle une collaboratrice particulièrement fiable sur des projets exigeants.',
  },
  {
    ascendant: 'Verseau',
    text: 'Dans les faits, l\'ascendant Verseau applique la rigueur de la Vierge à des sujets ou des méthodes moins conventionnels. Cette personne peut, par exemple, développer un système d\'organisation très personnel et non standard, mais qui fonctionne parfaitement pour elle une fois mis en place.',
  },
  {
    ascendant: 'Poissons',
    text: 'On le remarque vite : sous l\'ascendant Poissons, la précision de la Vierge s\'accompagne d\'une vraie intuition. Cette personne peut résoudre un problème autant par un raisonnement logique que par un pressentiment qu\'elle a du mal à justifier sur le moment, mais qui se révèle souvent juste après coup.',
  },
]

useSeoMeta({
  title: 'Vierge : Signe, Personnalité et Ascendant | Stellara',
  description: "Découvrez la personnalité du signe Vierge, ses forces et vigilances, et comment chacun des 12 ascendants modifie son expression au quotidien.",
})

const safeSiteUrl = useSiteUrl()

useHead(() => ({
  link: [
    {
      rel: 'canonical',
      href: `${safeSiteUrl.value}/vierge`,
    },
  ],
}))
</script>
