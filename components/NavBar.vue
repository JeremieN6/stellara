<template>
  <header
    class="sticky top-0 z-50 w-full transition-all duration-500"
    :class="isScrolled ? 'border-b border-white/10 bg-[rgba(10,10,26,0.88)] backdrop-blur-2xl' : 'bg-transparent'"
  >
    <nav
      class="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-6 transition-all duration-500 lg:px-10"
      aria-label="Navigation principale"
    >
      <NuxtLink to="/" class="group inline-flex shrink-0 items-center gap-3">
        <span class="relative flex h-10 w-10 items-center justify-center">
          <svg viewBox="0 0 40 40" fill="none" class="absolute inset-0 h-full w-full opacity-30" aria-hidden="true">
            <circle cx="20" cy="20" r="18" stroke="#FBBF24" stroke-width="0.5" />
            <circle cx="20" cy="20" r="12" stroke="#A855F7" stroke-width="0.5" />
          </svg>
          <svg viewBox="0 0 24 24" class="relative h-5 w-5" fill="none" aria-hidden="true">
            <polygon
              points="12,2 14.5,9.5 22,9.5 16,14 18.5,21 12,17 5.5,21 8,14 2,9.5 9.5,9.5"
              fill="url(#star-nav)"
              opacity="0.95"
            />
            <defs>
              <linearGradient id="star-nav" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FBBF24" />
                <stop offset="100%" stop-color="#A855F7" />
              </linearGradient>
            </defs>
          </svg>
        </span>
        <span class="font-display text-lg tracking-[0.2em] text-white transition-colors duration-300 group-hover:text-amber-400">
          Stellara
        </span>
      </NuxtLink>

      <div class="hidden items-center gap-8 md:flex">
        <div ref="resourcesDropdownRef" class="relative">
          <button
            type="button"
            class="inline-flex items-center gap-2 pb-0.5 text-sm text-slate-300 transition-colors duration-200 hover:text-white"
            aria-haspopup="true"
            :aria-expanded="resourcesOpen"
            @click="resourcesOpen = !resourcesOpen"
          >
            Explorer astro
            <svg
              class="h-4 w-4 transition-transform duration-200"
              :class="resourcesOpen ? 'rotate-180' : ''"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>

          <Transition name="drop-fade">
            <div
              v-if="resourcesOpen"
              class="absolute right-0 top-full mt-3 w-60 overflow-hidden rounded-2xl border border-white/15 bg-[rgba(10,10,26,0.95)] p-2 shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
            >
              <NuxtLink
                v-for="resource in resourceLinks"
                :key="resource.href"
                :to="resource.href"
                class="block rounded-xl px-3 py-2.5 text-sm text-slate-200 transition hover:bg-white/10 hover:text-white"
                @click="resourcesOpen = false"
              >
                {{ resource.label }}
              </NuxtLink>
            </div>
          </Transition>
        </div>

        <template v-for="link in navLinks" :key="link.label">
          <NuxtLink
            :to="link.href"
            class="relative inline-flex items-center gap-2 pb-0.5 text-sm text-slate-300 transition-colors duration-200 hover:text-white after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-amber-400 after:transition-all after:duration-300 hover:after:w-full"
          >
            {{ link.label }}
            <span
              v-if="link.isNew"
              class="inline-flex items-center gap-1 rounded-full border border-emerald-300/35 bg-emerald-300/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-emerald-200"
            >
              <span class="new-dot h-1.5 w-1.5 rounded-full bg-emerald-300" aria-hidden="true" />
              Nouveau
            </span>
          </NuxtLink>
        </template>
      </div>

      <div class="flex items-center gap-3">
        <NuxtLink
          to="/account"
          class="hidden items-center gap-2 rounded-full border px-3.5 py-2 text-xs uppercase tracking-[0.14em] transition-colors sm:inline-flex"
          :class="isAuthenticated
            ? 'border-emerald-400/35 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/15'
            : 'border-white/10 bg-white/5 text-slate-300 hover:text-white'"
        >
          <span class="h-1.5 w-1.5 rounded-full" :class="isAuthenticated ? 'bg-emerald-300' : 'bg-slate-400'" />
          {{ isAuthenticated ? accountLabel : 'Mon compte' }}
        </NuxtLink>

        <NuxtLink
          to="/rapport"
          class="hidden items-center gap-2 rounded-full bg-[linear-gradient(135deg,#7c3aed,#a855f7_50%,#f59e0b)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] sm:inline-flex"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <polygon
              points="12,2 15,9 22,9 16.5,13.5 18.5,21 12,17 5.5,21 7.5,13.5 2,9 9,9"
              fill="currentColor"
              opacity="0.9"
            />
          </svg>
          Obtenir mon rapport
        </NuxtLink>

        <button
          class="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white md:hidden"
          aria-label="Menu"
          @click="menuOpen = !menuOpen"
        >
          <svg v-if="!menuOpen" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </nav>

    <Transition name="slide-down">
      <div v-if="menuOpen" class="border-t border-white/10 bg-[rgba(10,10,26,0.95)] px-6 py-4 md:hidden">
        <nav class="flex flex-col gap-4">
          <div class="rounded-2xl border border-white/10 bg-white/5 p-2">
            <button
              type="button"
              class="flex w-full items-center justify-between rounded-xl px-2 py-2 text-sm text-slate-200"
              :aria-expanded="mobileResourcesOpen"
              aria-controls="mobile-resources-menu"
              @click="mobileResourcesOpen = !mobileResourcesOpen"
            >
              <span>Explorer astro</span>
              <svg
                class="h-4 w-4 transition-transform duration-200"
                :class="mobileResourcesOpen ? 'rotate-180' : ''"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>

            <Transition name="drop-fade">
              <div v-if="mobileResourcesOpen" id="mobile-resources-menu" class="mt-1 flex flex-col gap-1">
                <NuxtLink
                  v-for="resource in resourceLinks"
                  :key="`mobile-resource-${resource.href}`"
                  :to="resource.href"
                  class="rounded-xl px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
                  @click="closeAllMenus"
                >
                  {{ resource.label }}
                </NuxtLink>
              </div>
            </Transition>
          </div>

          <template v-for="link in navLinks" :key="`mobile-${link.label}`">
            <NuxtLink
              :to="link.href"
              class="inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-white"
              @click="closeAllMenus"
            >
              {{ link.label }}
              <span
                v-if="link.isNew"
                class="inline-flex items-center gap-1 rounded-full border border-emerald-300/35 bg-emerald-300/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-emerald-200"
              >
                <span class="new-dot h-1.5 w-1.5 rounded-full bg-emerald-300" aria-hidden="true" />
                Nouveau
              </span>
            </NuxtLink>
          </template>

          <NuxtLink
            to="/account"
            class="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white"
            @click="closeAllMenus"
          >
            {{ isAuthenticated ? `Mon compte (${accountLabel})` : 'Mon compte' }}
          </NuxtLink>
          <NuxtLink
            to="/rapport"
            class="inline-flex justify-center rounded-full bg-[linear-gradient(135deg,#7c3aed,#a855f7_50%,#f59e0b)] px-5 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all duration-300"
            @click="closeAllMenus"
          >
            Obtenir mon rapport
          </NuxtLink>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const menuOpen = ref(false)
const resourcesOpen = ref(false)
const mobileResourcesOpen = ref(false)
const profileFirstName = ref('')
const reportStore = useReportStore()
const resourcesDropdownRef = ref<HTMLElement | null>(null)

const isAuthenticated = computed(() => Boolean(reportStore.userEmail))
const accountLabel = computed(() => {
  if (profileFirstName.value) return profileFirstName.value
  const email = reportStore.userEmail || ''
  if (!email.includes('@')) return 'Mon compte'
  return email.split('@')[0]
})

const navLinks = [
  { href: '/horoscope-du-jour', label: 'Horoscope du jour' },
  { href: '/#how-it-works', label: 'Comment ça marche' },
  { href: '/blog', label: 'Blog', isNew: true },
]

const resourceLinks = [
  { href: '/lexique', label: 'Lexique astro' },
  { href: '/signes-astrologiques', label: 'Signes astrologiques' },
]

function updateScrolledState() {
  isScrolled.value = window.scrollY > 8
}

function closeAllMenus() {
  menuOpen.value = false
  resourcesOpen.value = false
  mobileResourcesOpen.value = false
}

function handleDocumentClick(event: MouseEvent) {
  const target = event.target
  if (!(target instanceof Node)) return
  if (resourcesDropdownRef.value?.contains(target)) return
  resourcesOpen.value = false
}

async function hydrateProfileName() {
  const email = reportStore.userEmail
  if (!email) {
    profileFirstName.value = ''
    return
  }

  try {
    const response = await ($fetch('/api/user/profile', {
      query: { email },
    }) as Promise<{ user: { firstName: string | null } | null }>)
    profileFirstName.value = response?.user?.firstName || ''
  } catch {
    profileFirstName.value = ''
  }
}

onMounted(() => {
  reportStore.initFromStorage()
  updateScrolledState()
  hydrateProfileName()
  window.addEventListener('scroll', updateScrolledState, { passive: true })
  document.addEventListener('click', handleDocumentClick)
})

watch(
  () => reportStore.userEmail,
  () => {
    hydrateProfileName()
  },
)

watch(
  () => menuOpen.value,
  (isOpen) => {
    if (!isOpen) mobileResourcesOpen.value = false
  },
)

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrolledState)
  document.removeEventListener('click', handleDocumentClick)
  closeAllMenus()
})
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.drop-fade-enter-active,
.drop-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.drop-fade-enter-from,
.drop-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.new-dot {
  animation: soft-blink 2.2s ease-in-out infinite;
}

@keyframes soft-blink {
  0%,
  100% {
    opacity: 0.4;
    transform: scale(0.9);
  }

  50% {
    opacity: 1;
    transform: scale(1.15);
  }
}
</style>
