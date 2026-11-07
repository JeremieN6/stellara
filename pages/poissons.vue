<template>
  <section class="min-h-screen pb-16 pt-20 sm:pb-20 sm:pt-24">
    <div class="section-shell">
      <div class="mx-auto max-w-4xl">
        <header class="text-center">
          <p class="eyebrow mb-3">Signe astrologique</p>
          <h1 class="font-display text-4xl text-white sm:text-6xl">
            Poissons : Signe, Personnalité et Ascendant
          </h1>
          <p class="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Douzième et dernier signe du zodiaque, les Poissons incarnent l'empathie et l'imagination. Découvrez sa personnalité en profondeur, et comment chacun des 12 ascendants modifie concrètement son expression au quotidien.
          </p>
        </header>

        <article class="mt-10 glass-panel border border-white/10 p-6 sm:p-8">
          <h2 class="font-display text-2xl text-white sm:text-3xl">Poissons en bref</h2>
          <div class="mt-5 grid gap-4 sm:grid-cols-2">
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Dates</p>
              <p class="mt-1 text-sm text-slate-200">19 février - 20 mars</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Élément</p>
              <p class="mt-1 text-sm text-slate-200">Eau</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Modalité</p>
              <p class="mt-1 text-sm text-slate-200">Mutable</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Planète maîtresse</p>
              <p class="mt-1 text-sm text-slate-200">Neptune (mod.) / Jupiter (trad.)</p>
            </div>
          </div>
          <p class="mt-5 text-sm leading-7 text-slate-300">
            <span class="text-slate-100">Mots-clés :</span> empathique, imaginatif, intuitif, romantique, flou, compatissant.
          </p>
        </article>

        <article class="mt-6 glass-panel border border-white/10 p-6 sm:p-8">
          <h2 class="font-display text-2xl text-white sm:text-3xl">Personnalité du Poissons</h2>
          <p class="mt-4 text-base leading-8 text-slate-300">
            Les Poissons perçoivent ce qui ne se dit pas : une tension dans une pièce, un chagrin caché derrière un sourire, une ambiance qui change sans raison apparente. Cette porosité émotionnelle en fait des personnes profondément empathiques, capables de se connecter à autrui avec une facilité presque déconcertante.
          </p>
          <p class="mt-4 text-base leading-8 text-slate-300">
            Leur imagination est une vraie richesse créative : les Poissons rêvent grand, perçoivent des possibilités que d'autres ne voient pas, et apportent souvent une touche artistique ou intuitive là où ils passent. La difficulté apparaît quand cette porosité devient un manque de limites claires, ou quand ils se perdent dans le flou d'une situation qu'ils n'osent pas affronter concrètement.
          </p>
          <p class="mt-4 text-base leading-8 text-slate-300">
            En relation, les Poissons cherchent une connexion d'âme plus qu'un simple compagnonnage : ils s'attachent profondément et aiment avec une vraie générosité, parfois au point de s'oublier eux-mêmes pour l'autre. Ils ont besoin d'un partenaire capable de comprendre leur sensibilité sans la juger comme excessive.
          </p>
        </article>

        <article class="mt-6 glass-panel border border-white/10 p-6 sm:p-8">
          <h2 class="font-display text-2xl text-white sm:text-3xl">
            Poissons et ascendant : comment chaque combinaison change votre expression
          </h2>
          <p class="mt-4 text-sm leading-7 text-slate-400">
            Le signe solaire décrit votre identité de fond, mais l'ascendant colore la façon dont
            cette énergie se manifeste concrètement au quotidien. Voici comment chacun des 12
            ascendants module la sensibilité des Poissons.
          </p>

          <div class="mt-6 space-y-5">
            <div v-for="item in ascendantCombos" :key="item.ascendant" class="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 class="font-display text-lg text-white sm:text-xl">
                Poissons ascendant {{ item.ascendant }}
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
    text: 'Ici, l\'ascendant Bélier ajoute de la vivacité à la sensibilité des Poissons : cette personne réagit plus vite et plus directement que sa nature intérieure ne le suggère. Face à une émotion forte, elle l\'exprime presque immédiatement plutôt que de la laisser mûrir en silence comme le ferait un Poissons classique.',
  },
  {
    ascendant: 'Taureau',
    text: 'Concrètement, sous l\'ascendant Taureau, l\'imagination des Poissons s\'ancre dans le concret : cette personne garde sa sensibilité, mais elle l\'exprime avec plus de stabilité et de repères tangibles, transformant souvent ses intuitions en projets réellement construits plutôt qu\'en simples rêveries.',
  },
  {
    ascendant: 'Gémeaux',
    text: 'Dans les faits, l\'ascendant Gémeaux renforce la communication chez les Poissons : l\'intuition se traduit par une vraie aisance à mettre des mots sur des ressentis, ce qui permet à cette personne de partager sa sensibilité plus facilement qu\'un Poissons plus renfermé.',
  },
  {
    ascendant: 'Cancer',
    text: 'Deux influences d\'eau se renforcent ici pour intensifier la porosité émotionnelle des Poissons. L\'empathie, déjà très marquée chez le signe solaire, se double d\'un besoin de protection et de sécurité affective particulièrement fort dès le premier abord.',
  },
  {
    ascendant: 'Lion',
    text: 'On le remarque vite : sous l\'ascendant Lion, la sensibilité des Poissons gagne en visibilité : cette personne exprime plus ouvertement son monde intérieur, avec une vraie chaleur démonstrative qui tranche avec la discrétion habituelle du signe solaire.',
  },
  {
    ascendant: 'Vierge',
    text: 'Sur le terrain, l\'ascendant Vierge canalise l\'intuition des Poissons vers le service concret : cette personne transforme sa sensibilité en attentions pratiques et précises, prenant soin des autres par des gestes tangibles plutôt que par de simples mots réconfortants.',
  },
  {
    ascendant: 'Balance',
    text: 'En pratique, sous l\'ascendant Balance, l\'empathie des Poissons se double d\'un vrai souci d\'harmonie et de diplomatie dans la relation. Cette personne cherche activement à apaiser les tensions autour d\'elle, portée par une sensibilité aux ambiances doublée d\'un vrai talent relationnel.',
  },
  {
    ascendant: 'Scorpion',
    text: 'Ici, l\'ascendant Scorpion intensifie la profondeur des Poissons : la sensibilité devient plus dense et moins facile à cerner, presque mystérieuse. Cette personne ressent des émotions très puissantes qu\'elle choisit souvent de garder pour elle plutôt que de les exposer.',
  },
  {
    ascendant: 'Sagittaire',
    text: 'Concrètement, sous l\'ascendant Sagittaire, l\'imagination des Poissons se teinte d\'optimisme : cette personne rêve grand et affiche une vision plus ouverte et positive du monde, moins encline au flou mélancolique que peut avoir un Poissons pur.',
  },
  {
    ascendant: 'Capricorne',
    text: 'Dans les faits, l\'ascendant Capricorne structure la sensibilité des Poissons : cette personne garde son intuition, mais elle la présente avec plus de retenue et de sérieux apparent, ce qui peut donner une image de solidité qui masque une vraie profondeur émotionnelle intérieure.',
  },
  {
    ascendant: 'Verseau',
    text: 'On le remarque vite : sous l\'ascendant Verseau, l\'empathie naturelle des Poissons s\'accompagne d\'un détachement apparent : cette personne reste sensible au fond, mais elle adopte une posture plus distante en façade, comme pour se protéger d\'un monde qu\'elle ressent trop intensément.',
  },
  {
    ascendant: 'Poissons',
    text: 'Deux influences neptuniennes se renforcent ici plutôt que de se nuancer. La porosité émotionnelle, déjà très marquée chez le signe solaire, devient presque totale dès le premier abord : cette personne absorbe les ambiances avec une facilité qui peut la submerger si elle ne prend pas soin de se protéger régulièrement.',
  },
]

useSeoMeta({
  title: 'Poissons : Signe, Personnalité et Ascendant | Stellara',
  description: "Découvrez la personnalité du signe Poissons, ses forces et vigilances, et comment chacun des 12 ascendants modifie son expression au quotidien.",
})

const safeSiteUrl = useSiteUrl()

useHead(() => ({
  link: [
    {
      rel: 'canonical',
      href: `${safeSiteUrl.value}/poissons`,
    },
  ],
}))
</script>
