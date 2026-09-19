<template>
  <section class="min-h-screen pb-16 pt-20 sm:pb-20 sm:pt-24">
    <div class="section-shell">
      <div class="mx-auto max-w-4xl">
        <header class="text-center">
          <p class="eyebrow mb-3">Signe astrologique</p>
          <h1 class="font-display text-4xl text-white sm:text-6xl">
            Taureau : Signe, Personnalité et Ascendant
          </h1>
          <p class="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Deuxième signe du zodiaque, le Taureau incarne la stabilité et l'attachement au concret. Découvrez sa personnalité en profondeur, et comment chacun des 12 ascendants modifie concrètement son expression au quotidien.
          </p>
        </header>

        <article class="mt-10 glass-panel border border-white/10 p-6 sm:p-8">
          <h2 class="font-display text-2xl text-white sm:text-3xl">Taureau en bref</h2>
          <div class="mt-5 grid gap-4 sm:grid-cols-2">
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Dates</p>
              <p class="mt-1 text-sm text-slate-200">20 avril - 20 mai</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Élément</p>
              <p class="mt-1 text-sm text-slate-200">Terre</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Modalité</p>
              <p class="mt-1 text-sm text-slate-200">Fixe</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Planète maîtresse</p>
              <p class="mt-1 text-sm text-slate-200">Vénus</p>
            </div>
          </div>
          <p class="mt-5 text-sm leading-7 text-slate-300">
            <span class="text-slate-100">Mots-clés :</span> stable, sensuel, fiable, patient, obstiné, terre-à-terre.
          </p>
        </article>

        <article class="mt-6 glass-panel border border-white/10 p-6 sm:p-8">
          <h2 class="font-display text-2xl text-white sm:text-3xl">Personnalité du Taureau</h2>
          <p class="mt-4 text-base leading-8 text-slate-300">
            Le Taureau avance lentement mais sûrement, préférant la solidité d'un projet mûri à l'excitation d'un coup de tête. Sa nature profonde de terre fixe cherche la continuité : une fois qu'il a trouvé ce qui lui convient — un métier, un lieu de vie, une routine — il n'a aucune envie d'en changer juste pour la nouveauté. Face à une proposition de changement soudain, il aura besoin de temps pour l'apprivoiser, même si elle est objectivement bonne pour lui.
          </p>
          <p class="mt-4 text-base leading-8 text-slate-300">
            Cette endurance est sa plus grande force : là où d'autres s'épuisent ou abandonnent, le Taureau tient la distance, avec une régularité qui finit presque toujours par payer. Le revers apparaît quand cette stabilité devient de l'entêtement : rester dans un emploi qui ne convient plus, ou refuser une remise en question par simple peur de perdre ses repères, même quand ceux-ci ne lui rendent plus service.
          </p>
          <p class="mt-4 text-base leading-8 text-slate-300">
            En relation, le Taureau a besoin de preuves concrètes plus que de grandes déclarations : un geste régulier compte plus à ses yeux qu'un mot rare mais spectaculaire. Il est fidèle et rassurant une fois engagé, et attend en retour une continuité similaire — les ruptures de rythme ou les revirements soudains de l'autre le déstabilisent bien plus qu'il ne le montre.
          </p>
        </article>

        <article class="mt-6 glass-panel border border-white/10 p-6 sm:p-8">
          <h2 class="font-display text-2xl text-white sm:text-3xl">
            Taureau et ascendant : comment chaque combinaison change votre expression
          </h2>
          <p class="mt-4 text-sm leading-7 text-slate-400">
            Le signe solaire décrit votre identité de fond, mais l'ascendant colore la façon dont
            cette énergie se manifeste concrètement au quotidien. Voici comment chacun des 12
            ascendants module le besoin de stabilité du Taureau.
          </p>

          <div class="mt-6 space-y-5">
            <div v-for="item in ascendantCombos" :key="item.ascendant" class="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 class="font-display text-lg text-white sm:text-xl">
                Taureau ascendant {{ item.ascendant }}
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
    text: 'L\'ascendant Bélier vient bousculer la lenteur naturelle du Taureau : le besoin de stabilité reste entier, mais la manière d\'y arriver devient plus pressée. Face à un choix de carrière par exemple, cette personne décide vite — plus vite que son noyau Taureau ne le ferait seul — puis s\'accroche ensuite à ce choix avec toute l\'obstination habituelle du signe. On observe souvent chez elle une impatience de façade qui cache un vrai besoin de sécurité en dessous.',
  },
  {
    ascendant: 'Taureau',
    text: 'Ici, deux influences terre-fixe se superposent au lieu de se nuancer. Le besoin de repères concrets, déjà fort chez le Taureau solaire, devient quasiment incontournable dès le premier abord : un changement d\'appartement, de travail ou d\'habitude est accueilli avec une résistance immédiate, même avant d\'avoir été évalué sur le fond. Cette combinaison donne des profils reconnaissables à leur constance presque prévisible.',
  },
  {
    ascendant: 'Gémeaux',
    text: 'Avec l\'ascendant en Gémeaux, quelque chose d\'inattendu se glisse dans le calme du Taureau : une curiosité verbale qui donne l\'image de quelqu\'un de plus bavard et mobile que ne le suggère sa nature profonde. Lors d\'une soirée entre amis, cette personne enchaînera les sujets de conversation avec aisance, tout en gardant, une fois rentrée chez elle, ses habitudes et ses repères parfaitement intacts.',
  },
  {
    ascendant: 'Cancer',
    text: 'Le besoin de sécurité matérielle du Taureau se double ici d\'un besoin de sécurité affective tout aussi marqué. Dans une nouvelle relation par exemple, cette personne cherchera à établir vite des rituels rassurants — un dîner du dimanche, un appel quotidien — parce que la stabilité, pour elle, se construit autant dans le cœur que dans le portefeuille.',
  },
  {
    ascendant: 'Lion',
    text: 'Ici, l\'ascendant Lion ajoute une dimension sociale au tempérament posé du Taureau : la personne garde son sens du concret, mais elle aime aussi que ses efforts et sa réussite matérielle soient vus et reconnus. En société, elle s\'installera avec assurance, presque avec panache, alors que son noyau Taureau seul se contenterait de discrétion.',
  },
  {
    ascendant: 'Vierge',
    text: 'Deux signes de terre se rejoignent ici pour renforcer le sens pratique : le goût du concret du Taureau se double d\'un vrai souci du détail. Avant tout achat important, cette personne comparera, vérifiera, recommencera ses calculs — une prudence qui peut vite virer à l\'anxiété si le budget est serré.',
  },
  {
    ascendant: 'Balance',
    text: 'Le goût du confort matériel du Taureau se transforme sous cet ascendant en un vrai sens esthétique. Dans le choix d\'un intérieur ou d\'une tenue par exemple, cette personne ne cherchera pas seulement le solide et le durable : elle voudra aussi que ce soit beau, harmonieux, digne d\'être montré.',
  },
  {
    ascendant: 'Scorpion',
    text: 'Sous l\'ascendant Scorpion, la résistance au changement du Taureau prend une tournure plus défensive : ce n\'est plus seulement une préférence pour la stabilité, mais une vraie méfiance envers ce qui pourrait la menacer. Face à une remise en question, cette personne se refermera plutôt que de discuter ouvertement, gardant ses doutes pour elle jusqu\'à ce que la confiance soit totale.',
  },
  {
    ascendant: 'Sagittaire',
    text: 'Une tension intéressante s\'installe ici entre l\'attachement du Taureau à ses repères et l\'appel du large propre au Sagittaire. Cette personne peut rêver de voyages et de grands changements de vie tout en tardant à les concrétiser, précisément parce qu\'une part d\'elle reste fondamentalement attachée à ce qu\'elle connaît déjà.',
  },
  {
    ascendant: 'Capricorne',
    text: 'Deux énergies de terre s\'associent pour donner une posture particulièrement stable et sérieuse. La patience naturelle du Taureau se double d\'une vraie discipline : face à un objectif de long terme, comme épargner pour un achat important, cette personne tiendra le cap avec une régularité presque mécanique, sans se laisser distraire.',
  },
  {
    ascendant: 'Verseau',
    text: 'L\'indépendance propre au Verseau vient nuancer l\'attachement du Taureau à ses habitudes : cette personne garde son besoin de repères, mais elle aime aussi qu\'ils soient un peu à elle, différents de la norme. Elle peut ainsi défendre farouchement un mode de vie non conventionnel, avec la même obstination qu\'un Taureau plus classique défendrait ses traditions.',
  },
  {
    ascendant: 'Poissons',
    text: 'Concrètement, sous l\'ascendant Poissons, la solidité du Taureau se pare d\'une sensibilité plus discrète et moins immédiatement visible. Le besoin de sécurité reste réel, mais il s\'exprime davantage à travers l\'intuition et l\'attention aux ambiances que par de simples repères matériels — cette personne peut par exemple choisir un logement autant pour ce qu\'elle y ressent que pour son prix ou sa solidité.',
  },
]

useSeoMeta({
  title: 'Taureau : Signe, Personnalité et Ascendant | Stellara',
  description: "Découvrez la personnalité du signe Taureau, ses forces et vigilances, et comment chacun des 12 ascendants modifie son expression au quotidien.",
})

const safeSiteUrl = useSiteUrl()

useHead(() => ({
  link: [
    {
      rel: 'canonical',
      href: `${safeSiteUrl.value}/taureau`,
    },
  ],
}))
</script>
