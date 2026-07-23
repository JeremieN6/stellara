<template>
  <section class="min-h-screen pb-16 pt-20 sm:pb-20 sm:pt-24">
    <div class="section-shell space-y-6">
      <header class="text-center">
        <p class="eyebrow mb-3">Admin</p>
        <h1 class="font-display text-4xl text-white sm:text-5xl">
          Dashboard <span class="text-amber-300">Lead Magnet</span>
        </h1>
        <p class="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
          Suivi des emails captures, progression de sequence et conversions premium.
        </p>
      </header>

      <div class="glass-panel border border-white/15 p-5 sm:p-6">
        <form class="grid gap-4 sm:grid-cols-[1fr_auto_auto] sm:items-end" @submit.prevent="loadDashboard">
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
            {{ loading ? 'Chargement...' : 'Charger le dashboard' }}
          </button>
          <button
            type="button"
            class="rounded-full border border-amber-400/35 bg-amber-400/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-amber-200 transition-colors hover:bg-amber-400/20"
            :disabled="running || !adminToken"
            :class="running ? 'cursor-not-allowed opacity-60' : ''"
            @click="runSequence"
          >
            {{ running ? 'Traitement...' : 'Lancer la sequence maintenant' }}
          </button>
        </form>

        <p v-if="errorMessage" class="mt-4 text-sm text-rose-300">{{ errorMessage }}</p>
        <p v-if="runMessage" class="mt-4 text-sm text-emerald-300">{{ runMessage }}</p>
      </div>

      <div v-if="stats" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
          <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Emails captures</p>
          <p class="mt-2 text-2xl font-semibold text-white">{{ stats.totalContacts }}</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
          <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Conversions</p>
          <p class="mt-2 text-2xl font-semibold text-emerald-300">{{ stats.convertedCount }}</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
          <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Sequence active</p>
          <p class="mt-2 text-2xl font-semibold text-white">{{ stats.activeSequenceCount }}</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
          <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Sequence terminee</p>
          <p class="mt-2 text-2xl font-semibold text-white">{{ stats.completedSequenceCount }}</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
          <p class="text-xs uppercase tracking-[0.16em] text-slate-400">A envoyer maintenant</p>
          <p class="mt-2 text-2xl font-semibold text-amber-300">{{ stats.dueNowCount }}</p>
        </div>
      </div>

      <div v-if="growthSeries.length > 0" class="grid gap-6 lg:grid-cols-2">
        <div class="glass-panel border border-white/15 p-5 sm:p-6">
          <div class="flex items-end justify-between gap-4">
            <div>
              <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Croissance</p>
              <h2 class="mt-2 font-display text-2xl text-white">Nouveaux leads (14 jours)</h2>
            </div>
            <p class="text-xs text-slate-400">Total: {{ growthTotal }} leads</p>
          </div>

          <div class="mt-5 flex h-40 items-end gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
            <div
              v-for="point in growthSeries"
              :key="point.day"
              class="group relative flex min-w-0 flex-1 items-end"
            >
              <div
                class="w-full rounded-t bg-amber-300/80 transition-all duration-300 group-hover:bg-amber-200"
                :style="{ height: `${barHeight(point.totalContacts)}%` }"
              />
              <div class="pointer-events-none absolute -top-9 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-white/15 bg-slate-950/95 px-2 py-1 text-[10px] text-slate-100 shadow-lg group-hover:block">
                {{ formatShortDay(point.day) }}: {{ point.totalContacts }}
              </div>
            </div>
          </div>

          <div class="mt-3 grid grid-cols-7 gap-1 text-[10px] text-slate-500">
            <p v-for="point in growthSeries" :key="`${point.day}-label`" class="truncate text-center" :title="point.day">
              {{ formatTinyDay(point.day) }}
            </p>
          </div>
        </div>

        <div class="glass-panel border border-white/15 p-5 sm:p-6">
          <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Attribution</p>
          <h2 class="mt-2 font-display text-2xl text-white">Sources d'acquisition</h2>
          <p class="mt-2 text-sm text-slate-400">
            Utilise tes liens avec ?src=nom_campagne (ex: ?src=commentaire_tiktok_juillet) pour suivre ce qui mord.
          </p>

          <div class="mt-4 overflow-hidden rounded-2xl border border-white/10">
            <table class="min-w-full text-left text-sm">
              <thead class="border-b border-white/10 bg-white/5 text-xs uppercase tracking-[0.14em] text-slate-400">
                <tr>
                  <th class="px-3 py-2">Source</th>
                  <th class="px-3 py-2">Leads</th>
                  <th class="px-3 py-2">Conv.</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in sourceBreakdown" :key="row.source" class="border-b border-white/5">
                  <td class="px-3 py-2 text-slate-200">{{ row.source }}</td>
                  <td class="px-3 py-2 text-slate-300">{{ row.totalContacts }}</td>
                  <td class="px-3 py-2 text-emerald-300">{{ sourceConversionRate(row) }}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div v-if="contacts.length > 0" class="glass-panel border border-white/15 p-0 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full text-left text-sm">
            <thead class="border-b border-white/10 bg-white/5 text-xs uppercase tracking-[0.16em] text-slate-400">
              <tr>
                <th class="px-4 py-3">Email</th>
                <th class="px-4 py-3">Source</th>
                <th class="px-4 py-3">Prénom</th>
                <th class="px-4 py-3">Etape</th>
                <th class="px-4 py-3">Envoyes</th>
                <th class="px-4 py-3">Prochain envoi</th>
                <th class="px-4 py-3">Conversion</th>
                <th class="px-4 py-3">Evenements</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="contact in contacts"
                :key="contact.id"
                class="border-b border-white/5 align-top"
              >
                <td class="px-4 py-3 text-slate-200">{{ contact.email }}</td>
                <td class="px-4 py-3 text-slate-400">{{ contact.acquisitionSource || 'direct' }}</td>
                <td class="px-4 py-3 text-slate-300">{{ contact.firstName || '-' }}</td>
                <td class="px-4 py-3 text-slate-300">{{ formatStep(contact.currentStep) }}</td>
                <td class="px-4 py-3 text-slate-300">{{ contact.sentEmailsCount }}</td>
                <td class="px-4 py-3 text-slate-300">{{ formatDate(contact.nextEmailDueAt) }}</td>
                <td class="px-4 py-3">
                  <span
                    class="inline-flex rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-[0.12em]"
                    :class="contact.converted ? 'border-emerald-400/35 bg-emerald-400/10 text-emerald-200' : 'border-white/15 bg-white/5 text-slate-400'"
                  >
                    {{ contact.converted ? 'Oui' : 'Non' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-xs text-slate-400">
                  <div class="space-y-1">
                    <p v-if="contact.events.length === 0">Aucun envoi</p>
                    <p
                      v-for="event in contact.events"
                      :key="`${contact.id}-${event.step}-${event.status}-${event.sentAt || 'none'}`"
                    >
                      {{ eventLabel(event.step) }} - {{ event.status }}
                    </p>
                  </div>
                </td>
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
  title: 'Admin Lead Sequence - Stellara',
  description: 'Dashboard admin pour le suivi de sequence email lead magnet.',
})

type DashboardStats = {
  totalContacts: number
  convertedCount: number
  activeSequenceCount: number
  completedSequenceCount: number
  dueNowCount: number
}

type GrowthPoint = {
  day: string
  totalContacts: number
  convertedContacts: number
}

type SourceRow = {
  source: string
  totalContacts: number
  convertedContacts: number
}

type ContactEvent = {
  step: number
  templateKey: string
  subject: string
  status: string
  sentAt: string | null
  errorMessage: string | null
}

type ContactRow = {
  id: string
  email: string
  firstName: string | null
  acquisitionSource: string | null
  currentStep: number
  sentEmailsCount: number
  converted: boolean
  isSequenceCompleted: boolean
  nextEmailDueAt: string | null
  lastEmailSentAt: string | null
  createdAt: string
  updatedAt: string
  latestSentStep: number | null
  events: ContactEvent[]
}

type DashboardResponse = {
  stats: DashboardStats
  growthSeries: GrowthPoint[]
  sourceBreakdown: SourceRow[]
  contacts: ContactRow[]
}

const adminToken = ref('')
const loading = ref(false)
const running = ref(false)
const errorMessage = ref('')
const runMessage = ref('')

const stats = ref<DashboardStats | null>(null)
const growthSeries = ref<GrowthPoint[]>([])
const sourceBreakdown = ref<SourceRow[]>([])
const contacts = ref<ContactRow[]>([])

const growthMax = computed(() => {
  return growthSeries.value.reduce((max, point) => Math.max(max, point.totalContacts), 0)
})

const growthTotal = computed(() => {
  return growthSeries.value.reduce((sum, point) => sum + point.totalContacts, 0)
})

async function loadDashboard() {
  if (!adminToken.value) return

  loading.value = true
  errorMessage.value = ''
  runMessage.value = ''

  try {
    const response = await $fetch<DashboardResponse>('/api/admin/lead-sequence/dashboard', {
      headers: {
        Authorization: `Bearer ${adminToken.value}`,
      },
    })

    stats.value = response.stats
    growthSeries.value = response.growthSeries || []
    sourceBreakdown.value = response.sourceBreakdown || []
    contacts.value = response.contacts
  } catch (error) {
    console.error('[admin/lead-sequence] dashboard load failed:', error)
    errorMessage.value = 'Impossible de charger le dashboard. Verifie le token admin.'
  } finally {
    loading.value = false
  }
}

function barHeight(value: number): number {
  const max = growthMax.value
  if (max <= 0) return 4
  return Math.max(4, Math.round((value / max) * 100))
}

function formatShortDay(dayIso: string): string {
  const date = new Date(`${dayIso}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return dayIso
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
}

function formatTinyDay(dayIso: string): string {
  const date = new Date(`${dayIso}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return '--'
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
}

function sourceConversionRate(row: SourceRow): number {
  if (!row.totalContacts) return 0
  return Math.round((row.convertedContacts / row.totalContacts) * 100)
}

async function runSequence() {
  if (!adminToken.value) return

  running.value = true
  errorMessage.value = ''
  runMessage.value = ''

  try {
    const response = await $fetch<{ ok: boolean; processed: number; sent: number; failed: number }>('/api/admin/lead-sequence/run', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${adminToken.value}`,
      },
      body: {
        limit: 100,
      },
    })

    runMessage.value = `Batch execute: ${response.processed} contacts traites, ${response.sent} envoyes, ${response.failed} en echec.`
    await loadDashboard()
  } catch (error) {
    console.error('[admin/lead-sequence] run failed:', error)
    errorMessage.value = 'Impossible de lancer la sequence. Verifie le token admin et la configuration SMTP.'
  } finally {
    running.value = false
  }
}

function formatDate(value: string | null): string {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString('fr-FR')
}

function formatStep(step: number): string {
  if (step <= 0) return 'Immediat'
  if (step === 1) return 'J+1'
  if (step === 2) return 'J+3'
  if (step === 3) return 'J+5'
  if (step === 4) return 'J+7'
  return 'Termine'
}

function eventLabel(step: number): string {
  if (step === 0) return 'Immediat'
  if (step === 1) return 'J+1'
  if (step === 2) return 'J+3'
  if (step === 3) return 'J+5'
  if (step === 4) return 'J+7'
  return `Step ${step}`
}
</script>
