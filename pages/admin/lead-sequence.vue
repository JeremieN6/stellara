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

      <div v-if="contacts.length > 0" class="glass-panel border border-white/15 p-0 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full text-left text-sm">
            <thead class="border-b border-white/10 bg-white/5 text-xs uppercase tracking-[0.16em] text-slate-400">
              <tr>
                <th class="px-4 py-3">Email</th>
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
  contacts: ContactRow[]
}

const adminToken = ref('')
const loading = ref(false)
const running = ref(false)
const errorMessage = ref('')
const runMessage = ref('')

const stats = ref<DashboardStats | null>(null)
const contacts = ref<ContactRow[]>([])

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
    contacts.value = response.contacts
  } catch (error) {
    console.error('[admin/lead-sequence] dashboard load failed:', error)
    errorMessage.value = 'Impossible de charger le dashboard. Verifie le token admin.'
  } finally {
    loading.value = false
  }
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
