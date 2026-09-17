<template>
  <div>
    <HeroSection />
    <BenefitsSection />
    <ProcessSection />
    <PricingSection />
    <TestimonialsSection />
    <FaqSection />
    <CtaSection />
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Stellara — Thème Natal Personnalisé | Gratuit',
  description: 'Découvrez votre thème natal complet (soleil, lune, ascendant, 10 planètes) en 30 secondes. Analyse astrologique personnalisée. Rapport gratuit.',
  ogTitle: 'Stellara — Thème Natal Personnalisé',
  ogDescription: 'Votre thème natal complet calculé et analysé par intelligence artificielle. Gratuit en 30 secondes.',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

const safeSiteUrl = useSiteUrl()

useHead(() => ({
  link: [
    {
      rel: 'canonical',
      href: safeSiteUrl.value,
    },
  ],
}))
</script>
