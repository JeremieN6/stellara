import { defineStore } from 'pinia'

export const useReportStore = defineStore('report', {
  state: () => ({
    isPremium: false as boolean,
    reportData: null as Record<string, unknown> | null,
    userEmail: '' as string,
  }),

  actions: {
    unlockPremium() {
      this.isPremium = true
      if (import.meta.client) {
        localStorage.setItem('Stellara_premium', '1')
      }
    },

    setPremiumStatus(val: boolean) {
      this.isPremium = val
      if (import.meta.client) {
        localStorage.setItem('Stellara_premium', val ? '1' : '0')
      }
    },

    setReportData(data: Record<string, unknown>) {
      this.reportData = data
      if (import.meta.client) {
        localStorage.setItem('Stellara_report_data', JSON.stringify(data))
      }
    },

    clearReportData() {
      this.reportData = null
      if (import.meta.client) {
        localStorage.removeItem('Stellara_report_data')
      }
    },

    setUserEmail(email: string) {
      this.userEmail = email.trim().toLowerCase()
      if (import.meta.client) {
        if (this.userEmail) {
          localStorage.setItem('Stellara_email', this.userEmail)
        } else {
          localStorage.removeItem('Stellara_email')
        }
      }
    },

    clearSession() {
      this.userEmail = ''
      this.isPremium = false
      this.reportData = null
      if (import.meta.client) {
        localStorage.removeItem('Stellara_email')
        localStorage.removeItem('Stellara_premium')
        localStorage.removeItem('Stellara_report_data')
      }
    },

    async syncPremiumStatusFromServer(email?: string) {
      const targetEmail = (email || this.userEmail || '').trim().toLowerCase()
      if (!targetEmail) return

      try {
        const response = await $fetch<{ isPremium: boolean }>('/api/user/subscription-status', {
          query: { email: targetEmail },
        })
        const serverIsPremium = Boolean(response?.isPremium)

        if (serverIsPremium) {
          this.setPremiumStatus(true)
          return
        }

        // Preserve local one-time premium unlocks for report purchases.
        if (!this.isPremium) {
          this.setPremiumStatus(false)
        }
      } catch (error) {
        console.error('[report-store] premium status sync failed:', error)
      }
    },

    async restoreLatestReportFromServer(email?: string) {
      const targetEmail = (email || this.userEmail || '').trim().toLowerCase()
      if (!targetEmail) return false

      try {
        const response = await $fetch<{
          isPremium: boolean
          report: Record<string, unknown> | null
        }>('/api/report/latest', {
          query: { email: targetEmail },
        })

        if (!response?.report) {
          return false
        }

        this.setUserEmail(targetEmail)
        this.setReportData(response.report)
        this.setPremiumStatus(Boolean(response.isPremium))
        return true
      } catch (error) {
        console.error('[report-store] latest report restore failed:', error)
        return false
      }
    },

    initFromStorage() {
      if (import.meta.client) {
        this.isPremium = localStorage.getItem('Stellara_premium') === '1'
        this.userEmail = localStorage.getItem('Stellara_email') || ''

        const rawReport = localStorage.getItem('Stellara_report_data')
        if (rawReport) {
          try {
            const parsed = JSON.parse(rawReport)
            if (parsed && typeof parsed === 'object') {
              this.reportData = parsed as Record<string, unknown>
            }
          } catch {
            localStorage.removeItem('Stellara_report_data')
          }
        }
      }
    },
  },
})
