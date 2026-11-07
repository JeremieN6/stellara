<template>
  <section class="min-h-screen pb-16 pt-20 sm:pb-20 sm:pt-24">
    <div class="section-shell">
      <div class="mx-auto max-w-4xl">
        <header class="text-center">
          <p class="eyebrow mb-3">Signe astrologique</p>
          <h1 class="font-display text-4xl text-white sm:text-6xl">
            Bélier : Signe, Personnalité et Ascendant
          </h1>
          <p class="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Premier signe du zodiaque, le Bélier incarne l'élan et le courage d'agir. Découvrez sa personnalité en profondeur, et comment chacun des 12 ascendants modifie concrètement son expression au quotidien.
          </p>
        </header>

        <article class="mt-10 glass-panel border border-white/10 p-6 sm:p-8">
          <h2 class="font-display text-2xl text-white sm:text-3xl">Bélier en bref</h2>
          <div class="mt-5 grid gap-4 sm:grid-cols-2">
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Dates</p>
              <p class="mt-1 text-sm text-slate-200">21 mars - 19 avril</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Élément</p>
              <p class="mt-1 text-sm text-slate-200">Feu</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Modalité</p>
              <p class="mt-1 text-sm text-slate-200">Cardinal</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Planète maîtresse</p>
              <p class="mt-1 text-sm text-slate-200">Mars</p>
            </div>
          </div>
          <p class="mt-5 text-sm leading-7 text-slate-300">
            <span class="text-slate-100">Mots-clés :</span> audacieux, impulsif, courageux, direct, pionnier, impatient.
          </p>
        </article>

        <article class="mt-6 glass-panel border border-white/10 p-6 sm:p-8">
          <h2 class="font-display text-2xl text-white sm:text-3xl">Personnalité du Bélier</h2>
          <p class="mt-4 text-base leading-8 text-slate-300">
            Le Bélier agit avant de trop réfléchir : sa nature profonde est celle du démarrage, portée par une énergie cardinale de feu qui a besoin de se dépenser tout de suite plutôt que d'attendre le moment idéal. Face à un problème, il n'est pas du genre à attendre qu'on lui indique la marche à suivre : il préfère souvent se tromper en avançant que de rester immobile par excès de prudence.
          </p>
          <p class="mt-4 text-base leading-8 text-slate-300">
            Cette impulsivité est aussi sa plus grande force : dans un groupe qui hésite, c'est souvent le Bélier qui relance le mouvement et ose la première proposition. Le revers de cette médaille apparaît quand l'urgence d'agir prend le pas sur l'écoute : une réponse envoyée trop vite, une décision prise sans consulter les autres, ou une impatience visible quand les choses n'avancent pas à son rythme.
          </p>
          <p class="mt-4 text-base leading-8 text-slate-300">
            En relation, le Bélier est direct et sans détour : il dit ce qu'il pense, et attend la même franchise en retour. Il a besoin d'un lien vivant, où l'on peut se confronter sans que cela devienne un drame, et se lasse vite d'une relation qui tourne en rond ou qui manque de spontanéité.
          </p>
        </article>

        <article class="mt-6 glass-panel border border-white/10 p-6 sm:p-8">
          <h2 class="font-display text-2xl text-white sm:text-3xl">
            Bélier et ascendant : comment chaque combinaison change votre expression
          </h2>
          <p class="mt-4 text-sm leading-7 text-slate-400">
            Le signe solaire décrit votre identité de fond, mais l'ascendant colore la façon dont
            cette énergie se manifeste concrètement au quotidien. Voici comment chacun des 12
            ascendants module l'élan naturel du Bélier.
          </p>

          <div class="mt-6 space-y-5">
            <div v-for="item in ascendantCombos" :key="item.ascendant" class="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 class="font-display text-lg text-white sm:text-xl">
                Bélier ascendant {{ item.ascendant }}
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
    text: 'Avec l\'ascendant en Bélier, l\'élan du signe solaire ne rencontre presque aucun frein en façade. Face à une décision à prendre en réunion par exemple, cette personne est souvent la première à trancher, avant même d\'avoir terminé de peser le pour et le contre. Ce réflexe d\'action immédiate peut impressionner par son efficacité, mais il laisse parfois peu de place à la concertation avec le reste du groupe.',
  },
  {
    ascendant: 'Taureau',
    text: 'Ici, l\'ascendant Taureau agit comme un frein naturel sur la vitesse du Bélier : l\'énergie de démarrage reste intacte, mais elle se manifeste avec plus de calme apparent. Dans une négociation par exemple, cette personne prend le temps de poser sa position avant d\'agir, même si intérieurement elle bouillonne déjà d\'impatience. Cette combinaison donne souvent une image de sang-froid qui masque une vraie urgence intérieure d\'avancer.',
  },
  {
    ascendant: 'Gémeaux',
    text: 'Quand l\'ascendant est en Gémeaux, l\'audace du Bélier se double d\'un besoin de parler autant que d\'agir. Face à un projet nouveau, cette personne annonce ses idées à voix haute presque aussi vite qu\'elle les a eues, testant plusieurs pistes en public avant de choisir. Elle peut ainsi paraître plus dispersée que son noyau Bélier ne l\'est réellement, simplement parce qu\'elle verbalise chaque étape de sa réflexion.',
  },
  {
    ascendant: 'Cancer',
    text: 'Concrètement, l\'ascendant Cancer enveloppe la fougue du Bélier d\'une couche de prudence en surface. Lors d\'un premier rendez-vous professionnel par exemple, cette personne observe d\'abord l\'ambiance et les réactions de son interlocuteur avant de se lancer, alors que son noyau Bélier la pousserait normalement à foncer directement. Cette protection initiale cède souvent la place à l\'élan naturel une fois la confiance installée.',
  },
  {
    ascendant: 'Lion',
    text: 'Avec l\'ascendant en Lion, l\'énergie de démarrage du Bélier gagne en visibilité et en mise en scène. Dans un contexte de prise de parole, comme un pitch ou une présentation, cette personne ne se contente pas d\'agir vite : elle cherche aussi à être remarquée pour son initiative. Cette combinaison produit souvent des profils qui aiment être les premiers à essayer quelque chose, à condition que cela se voie.',
  },
  {
    ascendant: 'Vierge',
    text: 'Dans les faits, l\'ascendant Vierge introduit un filtre de méthode entre l\'envie d\'agir du Bélier et le passage à l\'acte. Avant de se lancer dans une tâche urgente, cette personne prend malgré tout quelques secondes pour vérifier les détails essentiels, un réflexe que son noyau Bélier seul n\'aurait pas. Le résultat est une impulsivité canalisée, plus efficace mais parfois vécue comme frustrante en interne.',
  },
  {
    ascendant: 'Balance',
    text: 'Quand l\'ascendant est en Balance, l\'impatience du Bélier se cache derrière une posture plus diplomate. Face à un désaccord, cette personne cherche d\'abord un compromis ou une formulation qui ménage l\'autre, alors que son instinct profond voudrait trancher immédiatement. Cette tension entre besoin d\'harmonie en façade et urgence intérieure est une des dynamiques les plus caractéristiques de cette combinaison.',
  },
  {
    ascendant: 'Scorpion',
    text: 'On le remarque vite : l\'ascendant Scorpion densifie l\'énergie du Bélier plutôt que de la freiner. Dans une situation de conflit par exemple, cette personne ne réagit pas seulement vite : elle réagit avec une intensité et une détermination qui rendent sa réaction difficile à anticiper de l\'extérieur. Cette combinaison produit souvent des profils perçus comme redoutables en situation de tension, précisément parce que leur énergie brute est moins lisible qu\'avec un ascendant plus expressif.',
  },
  {
    ascendant: 'Sagittaire',
    text: 'Avec l\'ascendant en Sagittaire, le Bélier trouve un allié plutôt qu\'un frein : les deux signes partagent le même goût pour l\'action directe. Face à une opportunité de voyage ou de changement, cette personne dit oui presque instantanément, sans attendre d\'avoir toutes les garanties. Cette combinaison donne des profils particulièrement francs, parfois au point de sembler impulsifs même pour des standards Bélier.',
  },
  {
    ascendant: 'Capricorne',
    text: 'Sur le terrain, l\'ascendant Capricorne impose une structure à l\'élan naturel du Bélier. Avant de se lancer dans un projet ambitieux, cette personne prend le temps d\'en évaluer sérieusement la faisabilité, un comportement qui contraste avec le réflexe purement instinctif du signe solaire seul. Le résultat est souvent une personne perçue comme sérieuse et maîtrisée, alors qu\'en interne l\'envie d\'agir vite reste très présente.',
  },
  {
    ascendant: 'Verseau',
    text: 'Quand l\'ascendant est en Verseau, l\'audace du Bélier s\'exprime davantage par l\'originalité des choix que par la seule rapidité d\'exécution. Face à un problème classique, cette personne propose volontiers une solution qui sort des sentiers battus plutôt que la réponse la plus évidente. Cette combinaison est fréquente chez les profils qui aiment innover autant qu\'agir.',
  },
  {
    ascendant: 'Poissons',
    text: 'En pratique, l\'ascendant Poissons adoucit les contours nets du Bélier avec une touche de flou et d\'intuition. Dans une prise de décision rapide, cette personne agit toujours avec la spontanéité du Bélier, mais sa justification tient souvent davantage du ressenti que d\'un raisonnement logique explicite. Cette combinaison peut dérouter l\'entourage, qui perçoit à la fois une énergie directe et une part d\'imprévisibilité presque rêveuse.',
  },
]

useSeoMeta({
  title: 'Bélier : Signe, Personnalité et Ascendant | Stellara',
  description: "Découvrez la personnalité du signe Bélier, ses forces et vigilances, et comment chacun des 12 ascendants modifie son expression au quotidien.",
})

const safeSiteUrl = useSiteUrl()

useHead(() => ({
  link: [
    {
      rel: 'canonical',
      href: `${safeSiteUrl.value}/belier`,
    },
  ],
}))
</script>
