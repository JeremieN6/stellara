/**
 * useReveal — IntersectionObserver composable
 * Adds `.is-visible` to `.reveal-on-scroll` elements when they enter the viewport
 */
export function useReveal() {
  if (import.meta.server) return

  const route = useRoute()
  let observer: IntersectionObserver | null = null

  const revealVisibleElements = () => {
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight
    const elements = document.querySelectorAll<HTMLElement>('.reveal-on-scroll:not(.is-visible)')

    elements.forEach((element) => {
      const rect = element.getBoundingClientRect()

      if (rect.top < viewportHeight - 48 && rect.bottom > 0) {
        element.classList.add('is-visible')
        observer?.unobserve(element)
      }
    })
  }

  const observeElements = () => {
    observer?.disconnect()

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer?.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -48px 0px',
      },
    )

    const elements = document.querySelectorAll<HTMLElement>('.reveal-on-scroll:not(.is-visible)')

    elements.forEach((element) => observer?.observe(element))
    revealVisibleElements()
  }

  const refreshReveal = () => {
    requestAnimationFrame(() => {
      observeElements()
    })
  }

  onMounted(() => {
    refreshReveal()
  })

  watch(
    () => route.fullPath,
    async () => {
      await nextTick()
      refreshReveal()
    },
  )

  onUnmounted(() => {
    observer?.disconnect()
  })
}
