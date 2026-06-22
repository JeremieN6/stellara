<template>
  <section class="min-h-screen flex items-center justify-center py-20">
    <div class="section-shell">
      <div class="mx-auto max-w-lg glass-panel p-10 sm:p-14 text-center">
        <div class="mb-6 flex justify-center">
          <div class="flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-500/10 text-4xl">
            ✓
          </div>
        </div>

        <h1 class="font-display text-2xl sm:text-3xl font-semibold text-white mb-4">
          Rapport premium activé !
        </h1>
        <p class="text-slate-400 text-sm mb-8 leading-6">
          Merci pour votre achat. Votre rapport complet est maintenant disponible.
          Retournez sur la page de rapport pour accéder à votre analyse intégrale.
        </p>

        <NuxtLink to="/rapport" class="cta-button w-full justify-center" @click="unlock">
          Voir mon rapport complet
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, useHead, navigateTo } from '#imports'
import { useReportStore } from '~/stores/report'

useHead({ title: 'Paiement réussi — Stellara' })

const reportStore = useReportStore()
const route = useRoute()

function unlock() {
  reportStore.unlockPremium()
}

onMounted(() => {
  reportStore.unlockPremium()

  const email = typeof route.query.email === 'string' ? route.query.email : ''
  const reportId = typeof route.query.report_id === 'string' ? route.query.report_id : ''

  if (email) {
    reportStore.setUserEmail(email)
    reportStore.syncPremiumStatusFromServer(email)
  }

  if (reportId && reportStore.reportData) {
    const currentReportId = String(reportStore.reportData.reportId || '').trim()
    if (!currentReportId) {
      reportStore.setReportData({
        ...reportStore.reportData,
        reportId,
      })
    }
  }

  setTimeout(() => {
    navigateTo('/rapport', { replace: true })
  }, 800)
})
</script>
