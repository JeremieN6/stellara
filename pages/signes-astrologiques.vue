<template>
  <section class="min-h-screen pb-16 pt-20 sm:pb-20 sm:pt-24">
    <div class="section-shell">
      <div class="mx-auto max-w-6xl">
        <header class="text-center">
          <p class="eyebrow mb-3">Guide debutant</p>
          <h1 class="font-display text-4xl text-white sm:text-6xl">
            Les 12 signes astrologiques et leur nature profonde
          </h1>
          <p class="mx-auto mt-4 max-w-4xl text-sm leading-7 text-slate-300 sm:text-base">
            Cette page vous aide a comprendre chaque signe astrologique simplement: temperament, force interieure,
            zones de vigilance et facon d aimer. Une bonne base si vous etes curieux de l astrologie,
            meme sans connaissance prealable.
          </p>
        </header>

        <div class="mt-8 rounded-2xl border border-white/15 bg-white/5 p-4 sm:p-5">
          <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Acces rapide par signe</p>
          <div class="mt-3 flex flex-wrap gap-2.5">
            <a
              v-for="sign in signs"
              :key="`jump-${sign.slug}`"
              :href="`#${sign.slug}`"
              class="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:border-amber-300/45 hover:text-amber-200"
            >
              {{ sign.name }}
            </a>
          </div>
        </div>

        <div class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="sign in signs"
            :id="sign.slug"
            :key="sign.slug"
            class="scroll-mt-28 rounded-3xl border border-white/15 bg-gradient-to-b from-white/8 to-white/5 p-5"
          >
            <div class="flex items-center justify-between gap-3">
              <h2 class="font-display text-2xl text-white">
                {{ sign.name }}
              </h2>
              <span class="rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-slate-300">
                {{ sign.period }}
              </span>
            </div>

            <p class="mt-3 text-xs uppercase tracking-[0.14em] text-amber-200">
              Element: {{ sign.element }} · Modalite: {{ sign.modality }}
            </p>

            <p class="mt-3 text-sm leading-7 text-slate-200">
              {{ sign.essence }}
            </p>

            <div class="mt-4 space-y-3 text-sm leading-6 text-slate-300">
              <p><span class="text-slate-100">Force naturelle:</span> {{ sign.strength }}</p>
              <p><span class="text-slate-100">Point de vigilance:</span> {{ sign.watchout }}</p>
              <p><span class="text-slate-100">En relation:</span> {{ sign.relationship }}</p>
            </div>
          </article>
        </div>

        <section class="mt-10 rounded-3xl border border-white/15 bg-white/5 p-5 sm:p-6">
          <h2 class="font-display text-3xl text-white">FAQ rapide</h2>
          <div class="mt-4 space-y-4 text-sm leading-7 text-slate-300">
            <p>
              <span class="text-slate-100"><strong><em>Quel est le signe astrologique le plus sensible ?</em></strong></span> <br>
              En astrologie populaire, les signes d eau (Cancer, Scorpion, Poissons) sont souvent vus comme les plus
              receptifs sur le plan emotionnel.
            </p>
            <p>
              <span class="text-slate-100"><strong><em>Le signe solaire suffit-il pour se connaitre ?</em></strong></span> <br>
              Non. Le signe solaire est la base, mais l ascendant, la Lune et les maisons donnent une lecture beaucoup
              plus precise.
            </p>
            <p>
              <span class="text-slate-100"><strong><em>Comment aller plus loin apres cette page ?</em></strong></span> <br>
              Vous pouvez continuer avec le lexique astrologique pour comprendre les notions de theme natal,
              aspects et transits.
            </p>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Signes astrologiques: la nature profonde des 12 signes | Stellara',
  description: 'Découvrez les 12 signes astrologiques simplement: traits profonds, forces, vigilance et dynamique relationnelle pour debuter en astrologie.',
})

type SignSlug =
  | 'belier'
  | 'taureau'
  | 'gemeaux'
  | 'cancer'
  | 'lion'
  | 'vierge'
  | 'balance'
  | 'scorpion'
  | 'sagittaire'
  | 'capricorne'
  | 'verseau'
  | 'poissons'

interface SignProfile {
  slug: SignSlug
  name: string
  period: string
  element: 'Feu' | 'Terre' | 'Air' | 'Eau'
  modality: 'Cardinal' | 'Fixe' | 'Mutable'
  essence: string
  strength: string
  watchout: string
  relationship: string
}

const signs: SignProfile[] = [
  {
    slug: 'belier',
    name: 'Belier',
    period: '21 mars - 19 avril',
    element: 'Feu',
    modality: 'Cardinal',
    essence: 'Le Belier agit vite, aime ouvrir la voie et prefere l action a l attente. Son energie profonde est celle du demarrage et du courage.',
    strength: 'Il ose, tranche et remet du mouvement quand tout stagne.',
    watchout: 'Son impatience peut le pousser a forcer le rythme ou a repondre trop vite.',
    relationship: 'Direct et passionne, il a besoin de spontaneite et d un lien vivant.',
  },
  {
    slug: 'taureau',
    name: 'Taureau',
    period: '20 avril - 20 mai',
    element: 'Terre',
    modality: 'Fixe',
    essence: 'Le Taureau cherche la stabilite, la qualite et la coherence dans le temps. Sa nature profonde construit pas a pas.',
    strength: 'Endurance, fiabilite et sens du concret sur le long terme.',
    watchout: 'Il peut rester trop longtemps dans une zone connue par peur de perdre ses repaires.',
    relationship: 'Fidele et rassurant, il aime les preuves concretes et la continuite.',
  },
  {
    slug: 'gemeaux',
    name: 'Gemeaux',
    period: '21 mai - 20 juin',
    element: 'Air',
    modality: 'Mutable',
    essence: 'Le Gemeaux capte vite, relie les idees et vit a travers la curiosite. Son moteur est l echange intellectuel.',
    strength: 'Adaptabilite, vivacite mentale et talent de communication.',
    watchout: 'La dispersion peut apparaitre s il multiplie trop de pistes en meme temps.',
    relationship: 'Il se connecte par la conversation, l humour et la stimulation mentale.',
  },
  {
    slug: 'cancer',
    name: 'Cancer',
    period: '21 juin - 22 juillet',
    element: 'Eau',
    modality: 'Cardinal',
    essence: 'Le Cancer fonctionne avec la sensibilite, la memoire et l instinct de protection. Sa force profonde est emotionnelle.',
    strength: 'Empathie, intuition et capacite a creer un cadre securisant.',
    watchout: 'Il peut se refermer ou surinterpreter quand il se sent blesse.',
    relationship: 'Attache, tendre et loyal, il a besoin de confiance et de securite affective.',
  },
  {
    slug: 'lion',
    name: 'Lion',
    period: '23 juillet - 22 aout',
    element: 'Feu',
    modality: 'Fixe',
    essence: 'Le Lion veut rayonner, assumer sa singularite et inspirer. Sa nature profonde cherche une expression noble et creative.',
    strength: 'Generosite, presence et capacite a porter une vision.',
    watchout: 'Il peut se crisper sur l image ou mal vivre le manque de reconnaissance.',
    relationship: 'Chaleureux et demonstratif, il aime les liens francs et valorisants.',
  },
  {
    slug: 'vierge',
    name: 'Vierge',
    period: '23 aout - 22 septembre',
    element: 'Terre',
    modality: 'Mutable',
    essence: 'La Vierge observe, trie et optimise. Son energie profonde est celle de la clarte, du service utile et de l amelioration continue.',
    strength: 'Precision, sens du detail et intelligence pratique.',
    watchout: 'Le perfectionnisme peut creer du stress ou une autocritique excessive.',
    relationship: 'Elle montre son attachement par les gestes concrets et la fiabilite du quotidien.',
  },
  {
    slug: 'balance',
    name: 'Balance',
    period: '23 septembre - 22 octobre',
    element: 'Air',
    modality: 'Cardinal',
    essence: 'La Balance cherche l harmonie, la justesse et l equilibre entre soi et l autre. Sa nature profonde est relationnelle.',
    strength: 'Diplomatie, sens esthetique et capacite a concilier.',
    watchout: 'Elle peut hesiter longtemps pour eviter le conflit ou deplaire.',
    relationship: 'Elle aime le dialogue, la reciprocite et un cadre relationnel elegant.',
  },
  {
    slug: 'scorpion',
    name: 'Scorpion',
    period: '23 octobre - 21 novembre',
    element: 'Eau',
    modality: 'Fixe',
    essence: 'Le Scorpion vit avec intensite et cherche la verite derriere les apparences. Sa force profonde est transformative.',
    strength: 'Lucidite, puissance interieure et capacite de regeneration.',
    watchout: 'Le controle ou la mefiance peuvent prendre trop de place en phase de defense.',
    relationship: 'Total et engage, il a besoin d authenticite et de profondeur emotionnelle.',
  },
  {
    slug: 'sagittaire',
    name: 'Sagittaire',
    period: '22 novembre - 21 decembre',
    element: 'Feu',
    modality: 'Mutable',
    essence: 'Le Sagittaire avance par elan, sens et vision large. Sa nature profonde est l exploration, physique ou philosophique.',
    strength: 'Optimisme, franchise et capacite a ouvrir des horizons.',
    watchout: 'Il peut promettre trop, contourner les details ou paraitre abrupt.',
    relationship: 'Il aime la liberte partagee, l aventure et la sincerite.',
  },
  {
    slug: 'capricorne',
    name: 'Capricorne',
    period: '22 decembre - 19 janvier',
    element: 'Terre',
    modality: 'Cardinal',
    essence: 'Le Capricorne construit avec discipline, strategie et sens des responsabilites. Sa force profonde est structurelle.',
    strength: 'Rigueur, constance et capacite a concretiser dans la duree.',
    watchout: 'Il peut se durcir, trop se mettre la pression ou retarder l expression emotionnelle.',
    relationship: 'Loyal et solide, il prefere un engagement clair et mature.',
  },
  {
    slug: 'verseau',
    name: 'Verseau',
    period: '20 janvier - 18 fevrier',
    element: 'Air',
    modality: 'Fixe',
    essence: 'Le Verseau pense differemment, questionne les normes et projette vers demain. Sa nature profonde est innovante.',
    strength: 'Vision, independance et capacite a faire evoluer les systemes.',
    watchout: 'La distance emotionnelle peut apparaitre s il intellectualise tout.',
    relationship: 'Il a besoin d espace, de respect mutuel et d un lien qui evolue.',
  },
  {
    slug: 'poissons',
    name: 'Poissons',
    period: '19 fevrier - 20 mars',
    element: 'Eau',
    modality: 'Mutable',
    essence: 'Les Poissons ressentent en profondeur et percoivent les nuances invisibles. Leur nature est imaginative, intuitive et compassionnelle.',
    strength: 'Sensibilite fine, creativite et grande capacite d accueil.',
    watchout: 'Ils peuvent manquer de limites claires ou se perdre dans le flou.',
    relationship: 'Romantiques et empathiques, ils recherchent une connexion d ame et de coeur.',
  },
]
</script>
