<template>
  <section class="min-h-screen pb-16 pt-20 sm:pb-20 sm:pt-24">
    <div class="section-shell space-y-6">
      <header class="text-center">
        <p class="eyebrow mb-3">Programme Affiliation</p>
        <h1 class="font-display text-4xl text-white sm:text-5xl">
          Espace <span class="text-amber-300">{{ dashboard?.affiliate.name || 'Affilie' }}</span>
        </h1>
      </header>

      <div v-if="loading" class="glass-panel border border-white/15 p-6 text-slate-300">Chargement...</div>
      <div v-else-if="errorMessage" class="glass-panel border border-rose-400/25 bg-rose-500/10 p-6 text-rose-200">{{ errorMessage }}</div>

      <template v-else-if="dashboard">
        <div class="glass-panel border border-white/15 p-6">
          <p class="text-xs uppercase tracking-[0.18em] text-slate-400">Lien de partage</p>
          <div class="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input :value="dashboard.affiliate.shareLink" readonly class="form-input" />
            <button type="button" class="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.16em] text-white" @click="copyShareLink">Copier</button>
          </div>
          <p class="mt-3 text-sm text-slate-300">Code promo: <span class="text-amber-300">{{ dashboard.affiliate.promoCode }}</span></p>
        </div>

        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
            <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Clics</p>
            <p class="mt-2 text-2xl font-semibold text-white">{{ dashboard.metrics.totalClicks }}</p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
            <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Ventes</p>
            <p class="mt-2 text-2xl font-semibold text-white">{{ dashboard.metrics.confirmedSales }}</p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
            <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Commissions dues</p>
            <p class="mt-2 text-2xl font-semibold text-amber-300">{{ formatMoney(dashboard.metrics.totalCommissions) }}</p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
            <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Conversion</p>
            <p class="mt-2 text-2xl font-semibold text-white">{{ formatRate(dashboard.metrics.conversionRate) }}</p>
          </div>
        </div>

        <div class="glass-panel border border-white/15 p-0 overflow-hidden">
          <div class="border-b border-white/10 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.16em] text-slate-400">
            Ventes recentes
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full text-left text-sm">
              <thead class="text-xs uppercase tracking-[0.14em] text-slate-500">
                <tr>
                  <th class="px-4 py-3">Date</th>
                  <th class="px-4 py-3">Produit</th>
                  <th class="px-4 py-3">Montant</th>
                  <th class="px-4 py-3">Commission</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="sale in dashboard.recentSales" :key="sale.id" class="border-t border-white/5">
                  <td class="px-4 py-3 text-slate-300">{{ formatDate(sale.createdAt) }}</td>
                  <td class="px-4 py-3 text-slate-300">{{ formatProductType(sale.productType) }}</td>
                  <td class="px-4 py-3 text-slate-200">{{ formatMoney(sale.amountCents) }}</td>
                  <td class="px-4 py-3 text-amber-300">{{ formatMoney(sale.commissionCents) }}</td>
                </tr>
                <tr v-if="dashboard.recentSales.length === 0">
                  <td colspan="4" class="px-4 py-6 text-center text-slate-500">Aucune vente pour le moment.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Espace affilie - Stellara',
  description: 'Dashboard public de suivi affiliation Stellara.',
})

type DashboardResponse = {
  affiliate: {
    slug: string
    name: string
    promoCode: string
    shareLink: string
  }
  metrics: {
    totalClicks: number
    confirmedSales: number
    totalCommissions: number
    conversionRate: number
  }
  recentSales: Array<{
    id: string
    createdAt: string
    amountCents: number
    commissionCents: number
    productType: string
    status: string
  }>
}

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))

const loading = ref(true)
const errorMessage = ref('')
const dashboard = ref<DashboardResponse | null>(null)

async function loadDashboard() {
  loading.value = true
  errorMessage.value = ''

  try {
    dashboard.value = await $fetch(`/api/affilie/${encodeURIComponent(slug.value)}`)
  } catch (error) {
    console.error('[affilie] load failed:', error)
    errorMessage.value = 'Espace affilie introuvable ou indisponible.'
  } finally {
    loading.value = false
  }
}

function formatMoney(cents: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format((cents || 0) / 100)
}

function formatRate(rate: number): string {
  return `${(rate * 100).toFixed(2)}%`
}

function formatDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('fr-FR')
}

function formatProductType(productType: string): string {
  if (productType === 'orbite_premium') return 'Orbite Premium'
  return 'Rapport complet'
}

async function copyShareLink() {
  if (!dashboard.value) return
  try {
    await navigator.clipboard.writeText(dashboard.value.affiliate.shareLink)
  } catch (error) {
    console.error('[affilie] clipboard failed:', error)
  }
}

onMounted(loadDashboard)
watch(slug, loadDashboard)
</script>
