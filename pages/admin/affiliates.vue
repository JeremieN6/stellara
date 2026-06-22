<template>
  <section class="min-h-screen pb-16 pt-20 sm:pb-20 sm:pt-24">
    <div class="section-shell space-y-6">
      <header class="text-center">
        <p class="eyebrow mb-3">Admin</p>
        <h1 class="font-display text-4xl text-white sm:text-5xl">
          Dashboard <span class="text-amber-300">Affiliation</span>
        </h1>
      </header>

      <div class="glass-panel border border-white/15 p-5 sm:p-6">
        <form class="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end" @submit.prevent="loadDashboard">
          <div>
            <label class="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Token admin</label>
            <input v-model.trim="adminToken" type="password" class="form-input" placeholder="ADMIN_TOKEN" required />
          </div>
          <button type="submit" class="rounded-full border border-white/20 bg-white/5 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white" :disabled="loading">
            {{ loading ? 'Chargement...' : 'Charger' }}
          </button>
        </form>

        <p v-if="errorMessage" class="mt-4 text-sm text-rose-300">{{ errorMessage }}</p>
      </div>

      <div class="glass-panel border border-white/15 p-5 sm:p-6">
        <h2 class="font-display text-2xl text-white">Creer un nouvel affilie</h2>
        <form class="mt-4 grid gap-4 sm:grid-cols-2" @submit.prevent="createAffiliate">
          <input v-model.trim="createForm.name" class="form-input" placeholder="Nom" required />
          <input v-model.trim="createForm.email" class="form-input" type="email" placeholder="Email" required />
          <input v-model.trim="createForm.slug" class="form-input" placeholder="slug ex: marie10" required />
          <input v-model.trim="createForm.promoCode" class="form-input" placeholder="Code promo ex: MARIE10" required />
          <input v-model.number="createForm.commissionRate" class="form-input" type="number" min="0.01" max="1" step="0.01" placeholder="Commission (0.40)" />
          <input v-model.number="createForm.buyerDiscountPercent" class="form-input" type="number" min="1" max="99" step="1" placeholder="Reduction client (%) ex: 10" />
          <button type="submit" class="rounded-full bg-[linear-gradient(135deg,#7c3aed_0%,#a855f7_50%,#d97706_100%)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white" :disabled="creating || !adminToken">
            {{ creating ? 'Creation...' : 'Creer affilie' }}
          </button>
        </form>
        <p v-if="createMessage" class="mt-3 text-sm text-emerald-300">{{ createMessage }}</p>
      </div>

      <div v-if="dashboard" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
          <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Affilies</p>
          <p class="mt-2 text-2xl font-semibold text-white">{{ dashboard.affiliates.length }}</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
          <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Commissions globales dues</p>
          <p class="mt-2 text-2xl font-semibold text-amber-300">{{ formatMoney(dashboard.globalCommissions) }}</p>
        </div>
      </div>

      <div v-if="dashboard" class="glass-panel border border-white/15 p-0 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full text-left text-sm">
            <thead class="border-b border-white/10 bg-white/5 text-xs uppercase tracking-[0.16em] text-slate-400">
              <tr>
                <th class="px-4 py-3">Nom</th>
                <th class="px-4 py-3">Slug</th>
                <th class="px-4 py-3">Lien affilié</th>
                <th class="px-4 py-3">Clics</th>
                <th class="px-4 py-3">Ventes</th>
                <th class="px-4 py-3">Commissions dues</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="affiliate in dashboard.affiliates" :key="affiliate.id" class="border-b border-white/5">
                <td class="px-4 py-3 text-slate-200">{{ affiliate.name }}</td>
                <td class="px-4 py-3 text-slate-300">{{ affiliate.slug }}</td>
                <td class="px-4 py-3 text-slate-300">
                  <div class="flex min-w-[260px] items-center gap-2">
                    <a
                      :href="affiliateShareLink(affiliate.slug)"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="max-w-[260px] truncate text-sky-300 underline decoration-white/20 underline-offset-2"
                    >
                      {{ affiliateShareLink(affiliate.slug) }}
                    </a>
                    <button
                      type="button"
                      class="rounded-md border border-white/20 px-2 py-1 text-[11px] uppercase tracking-[0.08em] text-white/90 hover:bg-white/10"
                      @click="copyAffiliateLink(affiliate.slug)"
                    >
                      {{ copiedSlug === affiliate.slug ? 'Copié' : 'Copier' }}
                    </button>
                  </div>
                </td>
                <td class="px-4 py-3 text-slate-300">{{ affiliate.totalClicks }}</td>
                <td class="px-4 py-3 text-slate-300">{{ affiliate.confirmedSales }}</td>
                <td class="px-4 py-3 text-amber-300">{{ formatMoney(affiliate.totalCommissions) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Admin Affiliates - Stellara',
  description: 'Dashboard admin affiliations Stellara.',
})

type AdminDashboard = {
  affiliates: Array<{
    id: string
    slug: string
    name: string
    email: string
    promoCode: string
    commissionRate: number
    active: boolean
    createdAt: string
    totalClicks: number
    confirmedSales: number
    totalCommissions: number
  }>
  globalCommissions: number
}

const adminToken = ref('')
const loading = ref(false)
const creating = ref(false)
const errorMessage = ref('')
const createMessage = ref('')
const copiedSlug = ref('')
const dashboard = ref<AdminDashboard | null>(null)
const runtimeConfig = useRuntimeConfig()

const affiliateBaseUrl = computed(() => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return String(window.location.origin).replace(/\/$/, '')
  }

  const fromConfig = String(runtimeConfig.public.appUrl || runtimeConfig.public.siteUrl || '').trim()
  return fromConfig.replace(/\/$/, '')
})

const createForm = reactive({
  name: '',
  email: '',
  slug: '',
  promoCode: '',
  commissionRate: 0.4,
  buyerDiscountPercent: 10,
})

async function loadDashboard() {
  if (!adminToken.value) return
  loading.value = true
  errorMessage.value = ''

  try {
    dashboard.value = await $fetch('/api/admin/affiliates', {
      headers: {
        Authorization: `Bearer ${adminToken.value}`,
      },
    })
  } catch (error) {
    console.error('[admin/affiliates] load failed:', error)
    errorMessage.value = extractApiErrorMessage(error, 'Impossible de charger le dashboard affiliation.')
  } finally {
    loading.value = false
  }
}

async function createAffiliate() {
  if (!adminToken.value) return
  creating.value = true
  errorMessage.value = ''
  createMessage.value = ''

  try {
    const response = await $fetch('/api/admin/affiliates', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${adminToken.value}`,
      },
      body: createForm,
    }) as { ok: boolean; affiliate: { slug: string }; buyerDiscountPercent: number }

    createMessage.value = `Affilié crée avec succes: ${response.affiliate.slug} (${response.buyerDiscountPercent}% de reduction client)`
    await loadDashboard()
  } catch (error) {
    console.error('[admin/affiliates] create failed:', error)
    errorMessage.value = extractApiErrorMessage(error, 'Creation impossible. Verifie les champs et l unicite slug/promo code.')
  } finally {
    creating.value = false
  }
}

function formatMoney(cents: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format((cents || 0) / 100)
}

function affiliateShareLink(slug: string): string {
  return `${affiliateBaseUrl.value}/?ref=${slug}`
}

async function copyAffiliateLink(slug: string) {
  const link = affiliateShareLink(slug)

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

    copiedSlug.value = slug
    setTimeout(() => {
      if (copiedSlug.value === slug) copiedSlug.value = ''
    }, 1500)
  } catch (error) {
    console.error('[admin/affiliates] copy link failed:', error)
    errorMessage.value = 'Impossible de copier le lien dans le presse-papiers.'
  }
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
