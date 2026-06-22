<template>
  <section class="min-h-screen pb-16 pt-20 sm:pb-20 sm:pt-24">
    <div class="section-shell">
      <div class="mx-auto max-w-3xl">
        <header class="mb-8 text-center sm:mb-10">
          <p class="eyebrow mb-3">Compte</p>
          <h1 class="font-display text-4xl text-white sm:text-5xl">
            Mon <span class="text-amber-300">espace</span>
          </h1>
          <p class="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Retrouve ton statut premium, ton abonnement actif et l'email lié à tes achats.
          </p>
        </header>

        <div class="glass-panel border border-white/15 p-6 sm:p-8">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Identité</p>
              <p class="mt-1 text-sm text-slate-200">
                {{ activeEmail || 'Non connecté' }}
              </p>
            </div>

            <div v-if="activeEmail" class="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs uppercase tracking-[0.14em]"
              :class="reportStore.isPremium ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200' : 'border-white/15 bg-white/5 text-slate-300'"
            >
              <span class="h-1.5 w-1.5 rounded-full" :class="reportStore.isPremium ? 'bg-emerald-300' : 'bg-slate-400'" />
              {{ reportStore.isPremium ? 'Premium actif' : 'Mode essentiel' }}
            </div>
          </div>

          <form class="mt-6" @submit.prevent="connectEmail">
            <label class="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Email de compte</label>
            <div class="flex flex-col gap-3 sm:flex-row">
              <input
                v-model="emailInput"
                type="email"
                class="form-input"
                placeholder="votre@email.com"
                required
              />
              <button
                type="submit"
                class="rounded-full border border-white/20 bg-white/5 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-white/10"
              >
                Mettre a jour
              </button>
            </div>
            <p class="mt-2 text-xs text-slate-500">
              Utilise le <strong>même email</strong> que celui saisi lors du paiement si tu a un compte premium ou que tu as déjà eu un rapport natale complet.
            </p>
          </form>

          <form class="mt-6" @submit.prevent="sendMagicLink">
            <label class="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Connexion sécurisée</label>
            <div class="flex flex-col gap-3 sm:flex-row">
              <input
                v-model="magicLinkEmailInput"
                type="email"
                class="form-input"
                placeholder="email de paiement Stripe"
                required
              />
              <button
                type="submit"
                class="rounded-full border border-white/20 bg-white/5 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-white/10"
                :disabled="magicLinkLoading"
                :class="magicLinkLoading ? 'cursor-not-allowed opacity-60' : ''"
              >
                {{ magicLinkLoading ? 'Envoi...' : 'Envoyer lien magique' }}
              </button>
            </div>
            <p class="mt-2 text-xs text-slate-500">
              Un lien de connexion sans mot de passe sera envoyé à cet email.
            </p>
          </form>

          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Plan détecté</p>
              <p class="mt-2 text-sm text-white">{{ planLabel }}</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Renouvellement</p>
              <p class="mt-2 text-sm text-white">{{ renewalLabel }}</p>
            </div>
          </div>

          <div v-if="latestReport" class="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Dernier rapport sauvegarde</p>
            <p class="mt-2 text-sm text-white">
              {{ latestReport.firstName }} - {{ latestReport.sunSign }} / {{ latestReport.moonSign }} / {{ latestReport.ascendant }}
            </p>
            <p class="mt-1 text-xs text-slate-400">{{ latestReport.city }} - {{ latestReport.birthDate }}</p>
            <button
              type="button"
              class="mt-4 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-white/10"
              @click="resumeLatestReport"
            >
              Reprendre mon rapport
            </button>
          </div>

          <div class="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div class="flex items-center justify-between gap-3">
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Mes rapports</p>
              <span class="text-xs text-slate-500">{{ reportsHistory.length }} rapport(s)</span>
            </div>

            <p v-if="reportsHistory.length === 0" class="mt-3 text-sm text-slate-400">
              Aucun rapport sauvegarde pour ce compte.
            </p>

            <div v-else class="mt-3 space-y-2">
              <button
                v-for="item in reportsHistory"
                :key="item.id"
                type="button"
                class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left transition-colors hover:bg-white/10"
                @click="openReportFromHistory(item.id)"
              >
                <p class="text-sm text-white">
                  {{ item.firstName }} - {{ item.sunSign }} / {{ item.moonSign }} / {{ item.ascendant }}
                </p>
                <p class="mt-1 text-xs text-slate-400">
                  {{ formatHistoryDate(item.createdAt) }} - {{ item.city }} - {{ item.birthDate }}
                </p>
              </button>
            </div>
          </div>

          <div class="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              class="rounded-full border border-white/20 bg-white/5 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-white/10"
              :disabled="loading || !activeEmail"
              :class="loading || !activeEmail ? 'cursor-not-allowed opacity-60' : ''"
              @click="refreshAccount"
            >
              {{ loading ? 'Actualisation...' : 'Actualiser le statut' }}
            </button>

            <button
              v-if="activeEmail"
              type="button"
              class="rounded-full border border-rose-300/25 bg-rose-400/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-rose-100 transition-colors hover:bg-rose-400/20"
              @click="disconnect"
            >
              Se déconnecter
            </button>

            <NuxtLink
              to="/#pricing"
              class="rounded-full bg-[linear-gradient(135deg,#7c3aed_0%,#a855f7_50%,#d97706_100%)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white"
            >
              Voir les offres
            </NuxtLink>
          </div>

          <p v-if="errorMessage" class="mt-4 text-sm text-rose-300">{{ errorMessage }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Mon compte — Stellara',
  description: 'Consultez votre statut premium et vos informations d abonnement Stellara.',
})

type ProfileResponse = {
  user: {
    id: string
    email: string
    firstName: string | null
  } | null
  subscription: {
    status: string | null
    currentPeriodEnd: string | null
  } | null
  plan: {
    planType: string | null
    billingInterval: string | null
  } | null
}

type SubscriptionStatusResponse = {
  isPremium: boolean
}

type LatestReportResponse = {
  isPremium: boolean
  report: {
    reportId: string
    firstName: string
    birthDate: string
    city: string
    sunSign: string
    moonSign: string
    ascendant: string
    summary: string
  } | null
}

type AuthMeResponse = {
  authenticated: boolean
  email: string | null
}

type ReportsHistoryResponse = {
  email: string
  reports: Array<{
    id: string
    firstName: string
    birthDate: string
    city: string
    sunSign: string
    moonSign: string
    ascendant: string
    isPremium: boolean | null
    createdAt: string
  }>
}

const reportStore = useReportStore()

const loading = ref(false)
const errorMessage = ref('')
const emailInput = ref('')
const magicLinkEmailInput = ref('')
const magicLinkLoading = ref(false)
const profile = ref<ProfileResponse | null>(null)
const latestReport = ref<LatestReportResponse['report']>(null)
const reportsHistory = ref<ReportsHistoryResponse['reports']>([])

const activeEmail = computed(() => reportStore.userEmail)

const planLabel = computed(() => {
  if (!activeEmail.value) return 'Aucun email renseigne'
  if (!profile.value?.plan) return reportStore.isPremium ? 'Premium actif' : 'Essentiel'

  const type = profile.value.plan.planType || 'premium'
  const interval = profile.value.plan.billingInterval

  if (!interval) return type
  if (interval === 'month') return `${type} - mensuel`
  if (interval === 'year') return `${type} - annuel`
  return `${type} - ${interval}`
})

const renewalLabel = computed(() => {
  const rawDate = profile.value?.subscription?.currentPeriodEnd
  if (!rawDate) return 'Non disponible'

  const date = new Date(rawDate)
  if (Number.isNaN(date.getTime())) return 'Non disponible'
  return date.toLocaleDateString('fr-FR')
})

async function refreshAccount() {
  const email = activeEmail.value
  if (!email) return

  loading.value = true
  errorMessage.value = ''

  try {
    const [profileData, statusData] = await Promise.all([
      $fetch('/api/user/profile', { query: { email } }) as Promise<ProfileResponse>,
      $fetch('/api/user/subscription-status', { query: { email } }) as Promise<SubscriptionStatusResponse>,
    ])

    profile.value = profileData
    reportStore.setPremiumStatus(Boolean(statusData?.isPremium))

    const latestReportResponse = await $fetch('/api/report/latest', {
      query: { email },
    }) as LatestReportResponse

    latestReport.value = latestReportResponse.report

    if (latestReportResponse.report) {
      reportStore.setReportData(latestReportResponse.report)
      if (latestReportResponse.isPremium) {
        reportStore.setPremiumStatus(true)
      }
    }

    const historyResponse = await $fetch('/api/report/history', {
      query: { email },
    }) as ReportsHistoryResponse
    reportsHistory.value = historyResponse.reports || []
  } catch (error) {
    console.error('[account] refresh failed:', error)
    errorMessage.value = 'Impossible de recuperer vos informations pour le moment.'
  } finally {
    loading.value = false
  }
}

async function connectEmail() {
  const normalized = emailInput.value.trim().toLowerCase()
  if (!normalized) return

  reportStore.setUserEmail(normalized)
  await refreshAccount()
}

async function sendMagicLink() {
  const email = magicLinkEmailInput.value.trim().toLowerCase()
  if (!email) return

  magicLinkLoading.value = true
  errorMessage.value = ''

  try {
    const response = await $fetch('/api/auth/magic-link', {
      method: 'POST',
      body: { email },
    }) as { sent: boolean; reason?: string | null }

    if (!response.sent) {
      errorMessage.value = 'Envoi du lien impossible pour le moment. Verifie la configuration SMTP.'
      return
    }

    errorMessage.value = 'Lien magique envoyé. Vérifie ta boite email pour te connecter.'
  } catch (error) {
    console.error('[account] magic link failed:', error)
    errorMessage.value = 'Impossible d envoyer le lien magique.'
  } finally {
    magicLinkLoading.value = false
  }
}

function disconnect() {
  reportStore.clearSession()
  profile.value = null
  latestReport.value = null
  reportsHistory.value = []
  emailInput.value = ''
  magicLinkEmailInput.value = ''
  errorMessage.value = ''

  $fetch('/api/auth/logout', { method: 'POST' }).catch((error) => {
    console.error('[account] logout failed:', error)
  })
}

async function resumeLatestReport() {
  const restored = await reportStore.restoreLatestReportFromServer(activeEmail.value)
  if (!restored) {
    errorMessage.value = 'Aucun rapport sauvegarde n a ete retrouve pour cet email.'
    return
  }

  await navigateTo('/rapport')
}

async function openReportFromHistory(reportId: string) {
  const selected = reportsHistory.value.find((item) => item.id === reportId)
  if (!selected) return

  const email = activeEmail.value
  if (!email) {
    errorMessage.value = 'Connecte un email pour ouvrir un rapport.'
    return
  }

  try {
    const response = await $fetch('/api/report/latest', {
      query: {
        email,
        reportId: selected.id,
      },
    }) as LatestReportResponse

    if (!response?.report) {
      errorMessage.value = 'Impossible de charger ce rapport pour le moment.'
      return
    }

    reportStore.setReportData(response.report)
    latestReport.value = response.report
    if (response.isPremium) {
      reportStore.setPremiumStatus(true)
    }

    await navigateTo('/rapport')
  } catch (error) {
    console.error('[account] open report from history failed:', error)
    errorMessage.value = 'Impossible de charger ce rapport pour le moment.'
  }
}

function formatHistoryDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('fr-FR')
}

onMounted(async () => {
  reportStore.initFromStorage()

  const route = useRoute()

  const magicToken = typeof route.query.magic_token === 'string' ? route.query.magic_token : ''
  if (magicToken) {
    try {
      const verifyResponse = await $fetch('/api/auth/verify-magic-link', {
        method: 'POST',
        body: { token: magicToken },
      }) as { email: string }

      if (verifyResponse.email) {
        reportStore.setUserEmail(verifyResponse.email)
      }
    } catch (error) {
      console.error('[account] magic link verification failed:', error)
      errorMessage.value = 'Lien magique invalide ou expiré.'
    }

    await navigateTo('/account', { replace: true })
  }

  try {
    const me = await $fetch('/api/auth/me') as AuthMeResponse
    if (me.authenticated && me.email) {
      reportStore.setUserEmail(me.email)
    }
  } catch (error) {
    console.error('[account] auth me failed:', error)
  }

  emailInput.value = reportStore.userEmail
  magicLinkEmailInput.value = reportStore.userEmail

  if (reportStore.userEmail) {
    await refreshAccount()
  }
})
</script>
