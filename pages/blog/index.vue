<template>
  <main class="py-20 sm:py-24">
    <div class="section-shell">
      <header class="mx-auto max-w-3xl text-center">
        <p class="eyebrow mb-4">Blog Stellara</p>
        <h1 class="font-display text-4xl text-white sm:text-6xl">
          Astrologie appliquée, lecture claire et conseils concrets
        </h1>
        <p class="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          Des contenus pensés pour aider à mieux comprendre vos cycles, vos décisions et vos priorités sans jargon inutile.
        </p>
      </header>

      <section class="mt-14 grid gap-6 lg:grid-cols-3">
        <article
          v-for="post in posts"
          :key="post.slug"
          class="glass-panel group relative overflow-hidden border border-white/10 p-6 transition-all duration-500 hover:-translate-y-2 hover:border-amber-400/25"
        >
          <div class="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-400/10 via-transparent to-violet-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div class="relative z-10 flex items-center justify-between gap-4 text-sm text-slate-400">
            <span class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
              <span aria-hidden="true">{{ post.image }}</span>
              Blog
            </span>
            <time :datetime="post.date">{{ formatDate(post.date) }}</time>
          </div>

          <h2 class="relative z-10 mt-5 text-2xl font-semibold text-white transition-colors duration-300 group-hover:text-amber-300">
            {{ post.titre }}
          </h2>

          <p class="relative z-10 mt-4 text-sm leading-7 text-slate-400">
            {{ post.intro }}
          </p>

          <div class="relative z-10 mt-6 flex items-center justify-between gap-4">
            <NuxtLink
              :to="`/blog/${post.slug}`"
              class="inline-flex items-center gap-2 text-sm font-medium text-amber-300 transition hover:text-amber-200"
            >
              Lire l'article
              <span aria-hidden="true">→</span>
            </NuxtLink>
            <span class="text-xs uppercase tracking-[0.2em] text-slate-500">{{ post.sections.length }} sections</span>
          </div>
        </article>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import blogPosts from '~/data/blog.json'

type BlogSection = {
  sous_titre: string
  contenu: string
}

type BlogPost = {
  slug: string
  titre: string
  intro: string
  date: string
  image: string
  metaDescription?: string
  sections: BlogSection[]
}

const posts = computed(() => {
  return [...(blogPosts as BlogPost[])]
    .sort((left, right) => right.date.localeCompare(left.date))
})

useSeoMeta({
  title: 'Blog Stellara | Astrologie appliquée et conseils concrets',
  description: 'Explorez les articles Stellara sur le thème natal, les cycles personnels, l\'horoscope du jour et l\'usage pratique de l\'astrologie.',
  ogTitle: 'Blog Stellara',
  ogDescription: 'Des articles clairs pour mieux comprendre vos cycles, vos priorités et vos fenêtres d\'opportunités.',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

const safeSiteUrl = useSiteUrl()

useHead(() => ({
  link: [
    {
      rel: 'canonical',
      href: `${safeSiteUrl.value}/blog`,
    },
  ],
}))

function formatDate(dateValue: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${dateValue}T00:00:00`))
}
</script>