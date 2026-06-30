<template>
  <section class="min-h-screen pb-16 pt-20 sm:pb-20 sm:pt-24">
    <div class="section-shell">
      <div class="mx-auto max-w-5xl">
        <header class="text-center">
          <p class="eyebrow mb-3">Référence astrologique</p>
          <h1 class="font-display text-4xl text-white sm:text-6xl">
            Lexique de l'astrologie
          </h1>
          <p class="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            Retrouvez les définitions essentielles pour comprendre un thème natal, les aspects,
            les transits et les notions clés comme l'ascendant ou le Big Three.
          </p>
        </header>

        <div class="mt-8 rounded-2xl border border-white/15 bg-white/5 p-4 sm:p-5">
          <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Accès rapide</p>
          <div class="mt-3 flex flex-wrap gap-2.5">
            <a
              v-for="entry in entries"
              :key="`jump-${entry.id}`"
              :href="`#${entry.id}`"
              class="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:border-amber-300/45 hover:text-amber-200"
            >
              {{ entry.title }}
            </a>
          </div>
        </div>

        <div class="mt-8 space-y-4">
          <article
            v-for="entry in entries"
            :key="entry.id"
            class="overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-white/8 to-white/5"
          >
            <div class="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <h2 :id="entry.id" class="scroll-mt-28 font-display text-2xl text-white sm:text-3xl">
                {{ entry.title }}
              </h2>
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-200 transition hover:border-amber-300/45 hover:text-amber-200"
                :aria-controls="`panel-${entry.id}`"
                :aria-expanded="isOpen(entry.id)"
                @click="toggleEntry(entry.id)"
              >
                {{ isOpen(entry.id) ? 'Réduire' : 'Déplier' }}
              </button>
            </div>

            <Transition name="lexi-expand">
              <div
                v-show="isOpen(entry.id)"
                :id="`panel-${entry.id}`"
                class="border-t border-white/10 px-5 pb-5 pt-4 sm:px-6 sm:pb-6"
              >
                <p class="text-sm leading-7 text-slate-200">{{ entry.definition }}</p>
                <p class="mt-3 text-sm leading-7 text-slate-300">{{ entry.details }}</p>

                <div v-if="entry.schema" class="mt-4 rounded-2xl border border-amber-300/25 bg-amber-400/10 p-4">
                  <p class="text-xs uppercase tracking-[0.16em] text-amber-200">Schéma simple</p>
                  <p class="mt-2 text-sm leading-7 text-amber-100">{{ entry.schema }}</p>
                </div>
              </div>
            </Transition>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "Lexique de l'astrologie — Tous les termes expliqués simplement | Stellara",
  description: "Lexique clair pour comprendre transit astrologique signification, qu'est-ce qu'un aspect en astrologie et ascendant astrologie signification.",
})

type LexiconId =
  | 'theme-natal'
  | 'ascendant'
  | 'maisons-astrologiques'
  | 'aspects-planetaires'
  | 'transit-astrologique'
  | 'planetes-lentes-rapides'
  | 'retrograde'
  | 'big-three'

interface LexiconEntry {
  id: LexiconId
  title: string
  definition: string
  details: string
  schema?: string
}

const entries: LexiconEntry[] = [
  {
    id: 'theme-natal',
    title: 'Thème natal',
    definition: "Le thème natal est la carte du ciel au moment exact de votre naissance. Il positionne les planètes, les maisons et les angles pour décrire vos dynamiques de base.",
    details: "On l'utilise comme référence stable pour interpréter les cycles de vie, les transits du jour et les périodes plus intenses. Sans heure précise, la lecture perd une partie de sa finesse.",
    schema: 'Date + heure + lieu de naissance -> Carte du ciel -> Interprétation personnalisée',
  },
  {
    id: 'ascendant',
    title: 'Ascendant',
    definition: "L'ascendant correspond au signe qui se levait à l'est à l'instant de votre naissance. Il influence la manière dont vous entrez en relation avec le monde.",
    details: "Il colore votre style d'expression, votre première impression et votre rythme d'action. C'est l'un des piliers majeurs d'une lecture astrologique de précision.",
    schema: 'Signe solaire = identité centrale | Ascendant = manière d agir',
  },
  {
    id: 'maisons-astrologiques',
    title: 'Les 12 maisons astrologiques',
    definition: "Les maisons divisent la carte en 12 zones de vie: identité, ressources, relations, carrière, etc. Elles montrent où les énergies planétaires se manifestent concrètement.",
    details: "Une même planète ne s'exprime pas de la même façon selon la maison où elle tombe. Les maisons permettent donc de passer d'une symbolique générale à un terrain de vie précis.",
    schema: 'Planète = quoi | Signe = comment | Maison = où',
  },
  {
    id: 'aspects-planetaires',
    title: 'Aspects planétaires (conjonction, opposition, carré, trigone, sextile)',
    definition: "Les aspects sont des angles entre planètes. Ils décrivent la qualité de relation entre deux fonctions psychiques: fluidité, tension ou activation.",
    details: "Conjonction: fusion d'énergies. Opposition: polarité à équilibrer. Carré: tension motrice. Trigone: circulation naturelle. Sextile: opportunité qui demande une action consciente.",
    schema: 'Angle planétaire -> Type d aspect -> Effet vécu',
  },
  {
    id: 'transit-astrologique',
    title: 'Transit astrologique',
    definition: "Un transit compare la position actuelle des planètes avec votre thème natal. Il indique les thèmes activés à court, moyen ou long terme.",
    details: "Les transits rapides donnent la météo du quotidien. Les transits lents marquent des périodes de transformation plus profondes.",
    schema: 'Ciel du jour + thème natal -> période activée',
  },
  {
    id: 'planetes-lentes-rapides',
    title: 'Planète lente vs planète rapide',
    definition: "Les planètes rapides (Lune, Mercure, Vénus, Mars) bougent vite et décrivent des variations fréquentes. Les planètes lentes (Jupiter à Pluton) agissent sur des cycles plus longs.",
    details: "En lecture, les rapides précisent le contexte immédiat tandis que les lentes donnent la trame de fond. Croiser les deux rend l'analyse plus fiable.",
    schema: 'Rapides = quotidien | Lentes = cycles de fond',
  },
  {
    id: 'retrograde',
    title: 'Rétrograde',
    definition: "La rétrogradation est un effet visuel où une planète semble reculer depuis la Terre. En astrologie, cela symbolise une phase de révision, d'ajustement ou de retour sur un sujet.",
    details: "Mercure rétrograde est la plus connue, mais chaque planète rétrograde selon sa nature: communication, engagement, structure ou vision. Ce n'est pas un blocage permanent, plutôt un temps de recalibrage.",
    schema: 'Apparence de recul -> Révision -> Reprise plus nette',
  },
  {
    id: 'big-three',
    title: 'Big Three',
    definition: "Le Big Three regroupe le signe solaire, le signe lunaire et l'ascendant. Ce trio forme une base simple pour comprendre identité, émotions et expression sociale.",
    details: "Le Soleil montre votre axe central, la Lune votre monde intérieur, l'Ascendant votre mode d'incarnation. C'est souvent la meilleure porte d'entrée avant une lecture complète du thème natal.",
    schema: 'Soleil = noyau | Lune = émotionnel | Ascendant = posture',
  },
]

const openIds = ref<LexiconId[]>(['theme-natal'])

function isOpen(id: LexiconId): boolean {
  return openIds.value.includes(id)
}

function toggleEntry(id: LexiconId) {
  if (isOpen(id)) {
    openIds.value = openIds.value.filter((item) => item !== id)
    return
  }
  openIds.value = [...openIds.value, id]
}
</script>

<style scoped>
.lexi-expand-enter-active,
.lexi-expand-leave-active {
  transition: all 0.25s ease;
}

.lexi-expand-enter-from,
.lexi-expand-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
