<template>
  <section class="min-h-screen pb-16 pt-20 sm:pb-20 sm:pt-24">
    <div class="section-shell space-y-6">
      <header class="flex flex-col gap-4 text-center">
        <div class="flex items-center justify-center gap-3">
          <NuxtLink
            to="/admin/affiliates"
            class="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.16em] text-slate-200 transition-colors hover:bg-white/10"
          >
            Retour
          </NuxtLink>
          <p class="eyebrow mb-0">Admin</p>
        </div>
        <h1 class="font-display text-4xl text-white sm:text-5xl">
          Fiche <span class="text-amber-300">affilié</span>
        </h1>
        <p v-if="detail?.affiliate" class="mx-auto max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
          {{ detail.affiliate.name }} - {{ detail.affiliate.slug }}
        </p>
      </header>

      <div class="glass-panel border border-white/15 p-5 sm:p-6">
        <form class="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end" @submit.prevent="loadDetail">
          <div>
            <label class="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Token admin</label>
            <input
              v-model.trim="adminToken"
              type="password"
              class="form-input"
              placeholder="ADMIN_TOKEN"
              required
            />
          </div>
          <button
            type="submit"
            class="rounded-full border border-white/20 bg-white/5 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-white/10"
            :disabled="loading"
            :class="loading ? 'cursor-not-allowed opacity-60' : ''"
          >
            {{ loading ? 'Chargement...' : 'Charger la fiche' }}
          </button>
        </form>

        <p v-if="errorMessage" class="mt-4 text-sm text-rose-300">{{ errorMessage }}</p>
        <p v-if="actionMessage" class="mt-4 text-sm text-emerald-300">{{ actionMessage }}</p>
      </div>

      <div v-if="detail" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
          <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Clics</p>
          <p class="mt-2 text-2xl font-semibold text-white">{{ detail.metrics.totalClicks }}</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
          <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Ventes</p>
          <p class="mt-2 text-2xl font-semibold text-white">{{ detail.metrics.confirmedSales }}</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
          <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Commissions</p>
          <p class="mt-2 text-2xl font-semibold text-amber-300">{{ formatMoney(detail.metrics.totalCommissions) }}</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
          <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Taux conversion</p>
          <p class="mt-2 text-2xl font-semibold text-white">{{ Math.round(detail.metrics.conversionRate * 100) }}%</p>
        </div>
      </div>

      <div v-if="detail" class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div class="glass-panel border border-white/15 p-5 sm:p-6">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Identité</p>
              <h2 class="mt-2 text-2xl font-semibold text-white">{{ detail.affiliate.name }}</h2>
              <p class="mt-1 text-sm text-slate-300">{{ detail.affiliate.email }}</p>
              <p class="mt-1 text-xs text-slate-400">Créé le {{ formatDate(detail.affiliate.createdAt) }}</p>
            </div>
            <div class="flex flex-wrap gap-2">
              <span
                class="inline-flex rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-[0.12em]"
                :class="detail.affiliate.active ? 'border-emerald-400/35 bg-emerald-400/10 text-emerald-200' : 'border-rose-400/35 bg-rose-400/10 text-rose-200'"
              >
                {{ detail.affiliate.active ? 'Actif' : 'Désactivé' }}
              </span>
              <span
                class="inline-flex rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-[0.12em]"
                :class="inviteStatusClass(detail.inviteStatus)"
              >
                {{ inviteStatusLabel(detail.inviteStatus) }}
              </span>
            </div>
          </div>

          <div class="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Lien privé</p>
            <div class="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                :href="detail.affiliate.privateDashboardUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="break-all text-sm text-sky-300 underline decoration-white/20 underline-offset-2"
              >
                {{ detail.affiliate.privateDashboardUrl }}
              </a>
              <button
                type="button"
                class="rounded-md border border-white/20 px-3 py-2 text-[11px] uppercase tracking-[0.08em] text-white/90 hover:bg-white/10"
                @click="copyPrivateLink(detail.affiliate.privateDashboardUrl)"
              >
                {{ copiedPrivateLink === detail.affiliate.privateDashboardUrl ? 'Copié' : 'Copier' }}
              </button>
            </div>
          </div>

          <div class="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              class="rounded-full border border-white/20 bg-white/5 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-white/10"
              :disabled="busyAction || !adminToken"
              :class="busyAction ? 'cursor-not-allowed opacity-60' : ''"
              @click="resendInvite"
            >
              {{ busyAction === 'resend' ? 'Envoi...' : 'Renvoyer le lien privé' }}
            </button>
            <button
              type="button"
              class="rounded-full border border-amber-300/25 bg-amber-400/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-amber-100 transition-colors hover:bg-amber-400/20"
              :disabled="busyAction || !adminToken"
              :class="busyAction ? 'cursor-not-allowed opacity-60' : ''"
              @click="regenerateToken"
            >
              {{ busyAction === 'regenerate' ? 'Regénération...' : 'Régénérer le token' }}
            </button>
            <button
              type="button"
              class="rounded-full border px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] transition-colors"
              :class="detail.affiliate.active ? 'border-rose-300/25 bg-rose-400/10 text-rose-100 hover:bg-rose-400/20' : 'border-emerald-300/25 bg-emerald-400/10 text-emerald-100 hover:bg-emerald-400/20'"
              :disabled="busyAction || !adminToken"
              @click="toggleActive"
            >
              {{ busyAction === 'toggle' ? 'Mise à jour...' : (detail.affiliate.active ? 'Désactiver' : 'Réactiver') }}
            </button>
          </div>
        </div>

        <div class="glass-panel border border-white/15 p-5 sm:p-6">
          <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Infos</p>
          <dl class="mt-4 space-y-4 text-sm">
            <div>
              <dt class="text-slate-400">Slug</dt>
              <dd class="mt-1 text-white">{{ detail.affiliate.slug }}</dd>
            </div>
            <div>
              <dt class="text-slate-400">Code promo</dt>
              <dd class="mt-1 text-white">{{ detail.affiliate.promoCode }}</dd>
            </div>
            <div>
              <dt class="text-slate-400">Commission</dt>
              <dd class="mt-1 text-white">{{ Math.round(detail.affiliate.commissionRate * 100) }}%</dd>
            </div>
            <div>
              <dt class="text-slate-400">Statut email</dt>
              <dd class="mt-1 text-white">{{ inviteStatusLabel(detail.inviteStatus) }}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div v-if="detail" class="grid gap-6 lg:grid-cols-2">
        <div class="glass-panel border border-white/15 p-5 sm:p-6">
          <h3 class="font-display text-2xl text-white">Historique des actions admin</h3>
          <p class="mt-2 text-sm text-slate-400">Création, envois, régénérations, activation.</p>

          <div v-if="detail.auditEntries.length === 0" class="mt-4 text-sm text-slate-400">
            Aucun journal disponible.
          </div>

          <div v-else class="mt-4 space-y-3">
            <div
              v-for="entry in detail.auditEntries"
              :key="entry.id"
              class="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div class="flex flex-wrap items-center justify-between gap-2">
                <p class="text-sm text-white">{{ actionLabel(entry.action) }}</p>
                <span
                  class="inline-flex rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-[0.12em]"
                  :class="entry.status === 'success' ? 'border-emerald-400/35 bg-emerald-400/10 text-emerald-200' : entry.status === 'failed' ? 'border-rose-400/35 bg-rose-400/10 text-rose-200' : 'border-white/15 bg-white/5 text-slate-300'"
                >
                  {{ entry.status }}
                </span>
              </div>
              <p class="mt-2 text-xs text-slate-400">
                {{ formatDate(entry.createdAt) }} · {{ entry.actor }}
              </p>
              <p v-if="entry.details" class="mt-2 break-words text-xs text-slate-500">
                {{ entry.details }}
              </p>
            </div>
          </div>
        </div>

        <div class="glass-panel border border-white/15 p-5 sm:p-6">
          <h3 class="font-display text-2xl text-white">Ventes récentes</h3>
          <p class="mt-2 text-sm text-slate-400">Les dernières commissions attribuées à cet affilié.</p>

          <div v-if="detail.recentSales.length === 0" class="mt-4 text-sm text-slate-400">
            Aucune vente enregistrée.
          </div>

          <div v-else class="mt-4 space-y-3">
            <div
              v-for="sale in detail.recentSales"
              :key="sale.id"
              class="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div class="flex flex-wrap items-center justify-between gap-2">
                <p class="text-sm text-white">{{ sale.productType }}</p>
                <span class="text-sm text-amber-300">{{ formatMoney(sale.commissionCents) }}</span>
              </div>
              <p class="mt-2 text-xs text-slate-400">
                {{ formatDate(sale.createdAt) }} · {{ formatMoney(sale.amountCents) }}
              </p>
              <p class="mt-1 text-xs text-slate-500">
                Session: {{ sale.stripeSessionId || '-' }} · Facture: {{ sale.stripeInvoiceId || '-' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Admin Affilié - Stellara',
  description: 'Fiche détail d un affilié Stellara.',
})

type AffiliateDetailResponse = {
  affiliate: {
    id: string
    slug: string
    name: string
    email: string
    promoCode: string
    commissionRate: number
    active: boolean
    createdAt: string
    privateDashboardUrl: string
  }
  metrics: {
    totalClicks: number
    confirmedSales: number
    totalCommissions: number
    conversionRate: number
  }
  inviteStatus: 'sent' | 'failed' | 'never_sent'
  recentSales: Array<{
    id: string
    createdAt: string
    amountCents: number
    commissionCents: number
    productType: string
    status: string
    stripeSessionId: string | null
    stripeSubscriptionId: string | null
    stripeInvoiceId: string | null
  }>
  auditEntries: Array<{
    id: string
    action: string
    status: string
    actor: string
    details: string | null
    createdAt: string
  }>
}

const route = useRoute()
const adminToken = ref('')
const loading = ref(false)
const busyAction = ref<null | 'resend' | 'regenerate' | 'toggle'>(null)
const errorMessage = ref('')
const actionMessage = ref('')
const copiedPrivateLink = ref('')
const detail = ref<AffiliateDetailResponse | null>(null)

const slug = computed(() => String(route.params.slug || '').trim())

onMounted(async () => {
  if (typeof window !== 'undefined') {
    adminToken.value = sessionStorage.getItem('stellara_admin_token') || ''
  }

  if (adminToken.value) {
    await loadDetail()
  }
})

async function loadDetail() {
  if (!adminToken.value || !slug.value) return

  loading.value = true
  errorMessage.value = ''
  actionMessage.value = ''

  try {
    const response = await $fetch<AffiliateDetailResponse>(`/api/admin/affiliates/${encodeURIComponent(slug.value)}`, {
      headers: {
        Authorization: `Bearer ${adminToken.value}`,
      },
    })

    detail.value = response

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('stellara_admin_token', adminToken.value)
    }
  } catch (error) {
    console.error('[admin/affiliates/detail] load failed:', error)
    errorMessage.value = 'Impossible de charger la fiche. Verifie le token admin.'
  } finally {
    loading.value = false
  }
}

async function resendInvite() {
  await runAffiliateAction('resend', `/api/admin/affiliates/${encodeURIComponent(slug.value)}/resend`)
}

async function regenerateToken() {
  await runAffiliateAction('regenerate', `/api/admin/affiliates/${encodeURIComponent(slug.value)}/regenerate-token`)
}

async function toggleActive() {
  await runAffiliateAction('toggle', `/api/admin/affiliates/${encodeURIComponent(slug.value)}/toggle-active`)
}

async function runAffiliateAction(action: 'resend' | 'regenerate' | 'toggle', url: string) {
  if (!adminToken.value || !slug.value) return

  busyAction.value = action
  errorMessage.value = ''
  actionMessage.value = ''

  try {
    const response = await $fetch<{ ok: boolean; privateDashboardUrl?: string }>(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${adminToken.value}`,
      },
    })

    actionMessage.value = action === 'resend'
      ? 'Lien privé renvoyé.'
      : action === 'regenerate'
        ? 'Token régénéré et nouveau lien envoyé.'
        : 'Statut de l affilié mis à jour.'

    if (response.privateDashboardUrl && detail.value) {
      detail.value.affiliate.privateDashboardUrl = response.privateDashboardUrl
    }

    await loadDetail()
  } catch (error) {
    console.error('[admin/affiliates/detail] action failed:', error)
    errorMessage.value = extractApiErrorMessage(error, 'Action impossible pour le moment.')
  } finally {
    busyAction.value = null
  }
}

async function copyPrivateLink(link: string) {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(link)
    } else if (typeof document !== 'undefined') {
      const textarea = document.createElement('textarea')
      textarea.value = link
      textarea.setAttribute('readonly', 'readonly')
      textarea.style.position = 'absolute'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }

    copiedPrivateLink.value = link
    setTimeout(() => {
      if (copiedPrivateLink.value === link) copiedPrivateLink.value = ''
    }, 1500)
  } catch (error) {
    console.error('[admin/affiliates/detail] copy private link failed:', error)
    errorMessage.value = 'Impossible de copier le lien prive.'
  }
}

function inviteStatusLabel(status: AffiliateDetailResponse['inviteStatus']): string {
  if (status === 'sent') return 'Email envoyé'
  if (status === 'failed') return 'À renvoyer'
  return 'Jamais envoyé'
}

function inviteStatusClass(status: AffiliateDetailResponse['inviteStatus']): string {
  if (status === 'sent') return 'border-emerald-400/35 bg-emerald-400/10 text-emerald-200'
  if (status === 'failed') return 'border-amber-400/35 bg-amber-400/10 text-amber-100'
  return 'border-white/15 bg-white/5 text-slate-300'
}

function actionLabel(action: string): string {
  if (action === 'affiliate_created') return 'Affilié créé'
  if (action === 'invite_sent') return 'Lien envoyé'
  if (action === 'invite_failed') return 'Envoi en échec'
  if (action === 'invite_resent') return 'Lien renvoyé'
  if (action === 'token_regenerated') return 'Token régénéré'
  if (action === 'affiliate_disabled') return 'Affilié désactivé'
  if (action === 'affiliate_enabled') return 'Affilié réactivé'
  return action
}

function formatMoney(cents: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format((cents || 0) / 100)
}

function formatDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('fr-FR')
}

function extractApiErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === 'object') {
    const maybeError = error as {
      data?: { statusMessage?: string; message?: string }
      statusMessage?: string
      message?: string
    }

    return maybeError.data?.statusMessage || maybeError.data?.message || maybeError.statusMessage || maybeError.message || fallback
  }

  return fallback
}
</script>
