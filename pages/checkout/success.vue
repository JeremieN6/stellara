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

type CheckoutSessionResponse = {
  customerEmail: string | null
  reportId: string | null
}

function unlock() {
  reportStore.unlockPremium()
}

onMounted(async () => {
  reportStore.unlockPremium()

  let email = typeof route.query.email === 'string' ? route.query.email : ''
  let reportId = typeof route.query.report_id === 'string' ? route.query.report_id : ''
  const sessionId = typeof route.query.session_id === 'string' ? route.query.session_id : ''

  if (sessionId) {
    try {
      const loginResponse = await $fetch('/api/auth/checkout-session-login', {
        method: 'POST',
        body: { sessionId },
      }) as { email?: string }

      if (!email && loginResponse?.email) {
        email = loginResponse.email
      }
    } catch (error) {
      console.error('[checkout/success] checkout-session-login failed:', error)
    }
  }

  if ((!email || !reportId) && sessionId) {
    try {
      const session = await $fetch('/api/stripe/checkout-session', {
        query: { session_id: sessionId },
      }) as CheckoutSessionResponse

      if (!email && session.customerEmail) {
        email = session.customerEmail
      }

      if (!reportId && session.reportId) {
        reportId = session.reportId
      }
    } catch (error) {
      console.error('[checkout/success] session lookup failed:', error)
    }
  }

  if (email) {
    reportStore.setUserEmail(email)
    await reportStore.restoreLatestReportFromServer(email)
    await reportStore.syncPremiumStatusFromServer(email)
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
