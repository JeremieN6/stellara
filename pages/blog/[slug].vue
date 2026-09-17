<template>
  <main class="py-20 sm:py-24">
    <div class="section-shell">
      <article v-if="post" class="mx-auto max-w-4xl">
        <nav class="mb-8 text-sm text-slate-400">
          <NuxtLink to="/blog" class="transition hover:text-white">
            ← Retour au blog
          </NuxtLink>
        </nav>

        <header class="glass-panel relative overflow-hidden border border-white/10 p-8 sm:p-10">
          <div class="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-400/10 via-transparent to-violet-500/10" />
          <div class="relative z-10 flex flex-wrap items-center gap-3 text-sm text-slate-400">
            <span class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
              <span aria-hidden="true">{{ post.image }}</span>
              Article
            </span>
            <time :datetime="post.date">{{ formatDate(post.date) }}</time>
          </div>

          <h1 class="relative z-10 mt-5 font-display text-4xl text-white sm:text-5xl">
            {{ post.titre }}
          </h1>

          <p class="relative z-10 mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            {{ post.intro }}
          </p>
        </header>

        <section class="mt-10 space-y-6">
          <article
            v-for="section in postSections"
            :key="section.sous_titre"
            class="glass-panel border border-white/10 p-6 sm:p-8"
          >
            <h2 class="font-display text-2xl text-white sm:text-3xl">
              {{ section.sous_titre }}
            </h2>
            <p class="mt-4 text-base leading-8 text-slate-300">
              {{ section.contenu }}
            </p>
          </article>
        </section>

        <aside class="mt-10 rounded-3xl border border-amber-400/20 bg-amber-400/10 p-6 text-slate-200 sm:p-8">
          <p class="text-xs uppercase tracking-[0.3em] text-amber-200">À retenir</p>
          <p class="mt-3 text-base leading-8 text-slate-200">
            Stellara aide à transformer la lecture astrologique en repères utiles pour décider, planifier et agir avec plus de clarté.
          </p>
          <div class="mt-5">
            <NuxtLink to="/" class="cta-button">
              Découvrir Stellara
            </NuxtLink>
          </div>
        </aside>
      </article>
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

const route = useRoute()

const normalizedSlug = computed(() => {
  const slugParam = route.params.slug
  const rawSlug = Array.isArray(slugParam) ? slugParam[0] : slugParam
  return String(rawSlug || '').trim().toLowerCase()
})

const allPosts = computed<BlogPost[]>(() => {
  return Array.isArray(blogPosts) ? (blogPosts as BlogPost[]) : []
})

const post = computed<BlogPost | null>(() => {
  if (!normalizedSlug.value) {
    return null
  }

  return allPosts.value.find((entry) => String(entry.slug || '').toLowerCase() === normalizedSlug.value) || null
})

const safeSiteUrl = useSiteUrl()

const postSections = computed<BlogSection[]>(() => {
  return Array.isArray(post.value?.sections) ? post.value.sections : []
})

if (!post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Article introuvable',
  })
}

const seoTitle = computed(() => `${post.value?.titre} | Blog Stellara`)
const seoDescription = computed(() => post.value?.metaDescription || post.value?.intro || 'Article du blog Stellara.')

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: computed(() => post.value?.titre || 'Blog Stellara'),
  ogDescription: seoDescription,
  ogType: 'article',
  twitterCard: 'summary_large_image',
})

useHead(() => ({
  link: [
    {
      rel: 'canonical',
      href: `${safeSiteUrl.value}/blog/${post.value?.slug}`,
    },
  ],
  script: post.value
    ? [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.value.titre,
            description: post.value.metaDescription || post.value.intro,
            datePublished: post.value.date,
            image: `${safeSiteUrl.value}/og-image.jpg`,
            mainEntityOfPage: `${safeSiteUrl.value}/blog/${post.value.slug}`,
            author: {
              '@type': 'Organization',
              name: 'Stellara',
            },
          }),
        },
      ]
    : [],
}))

function formatDate(dateValue: string) {
  const parsedDate = new Date(`${dateValue}T00:00:00`)

  if (Number.isNaN(parsedDate.getTime())) {
    return dateValue
  }

  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(parsedDate)
}
</script>