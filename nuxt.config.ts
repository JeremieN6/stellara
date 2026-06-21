// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  modules: [
    ['@nuxtjs/tailwindcss', { configPath: '~/tailwind.config.ts' }],
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
  ],

  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    classSuffix: '',
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'fr', class: 'dark' },
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },

  runtimeConfig: {
    // Server-only
    databaseUrl: process.env.DATABASE_URL || '',
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    stripePriceId: process.env.STRIPE_PRICE_ID || '',
      stripePriceIdMonthly: process.env.STRIPE_PRICE_ID_MONTHLY || '',
      stripePriceIdYearly: process.env.STRIPE_PRICE_ID_YEARLY || '',
    stripeBuyLink: process.env.STRIPE_BUY_LINK || 'https://buy.stripe.com/test_example',
      affiliateBuyerDiscountPercent: process.env.AFFILIATE_BUYER_DISCOUNT_PERCENT || '10',
    emailHost: process.env.EMAIL_HOST || process.env.SMTP_HOST || '',
    emailPort: process.env.EMAIL_PORT || process.env.SMTP_PORT || '587',
    emailUser: process.env.EMAIL_USER || process.env.SMTP_USER || '',
    emailPass: process.env.EMAIL_PASS || process.env.SMTP_PASS || '',
    emailFrom: process.env.EMAIL_FROM || process.env.SMTP_FROM || '',
    adminToken: process.env.ADMIN_TOKEN || '',
    leadSequenceCronEnabled: process.env.LEAD_SEQUENCE_CRON_ENABLED || 'false',
    leadSequenceCronSchedule: process.env.LEAD_SEQUENCE_CRON_SCHEDULE || '*/15 * * * *',
    leadSequenceCronBatchLimit: process.env.LEAD_SEQUENCE_CRON_BATCH_LIMIT || '50',
    // Public (exposed to client)
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      stripeOneShotLink: process.env.NUXT_PUBLIC_STRIPE_ONE_SHOT_LINK || '',
      stripeBuyLinkFallback: process.env.STRIPE_BUY_LINK || '',
      stripeSubMonthlyLink: process.env.NUXT_PUBLIC_STRIPE_SUB_MONTHLY_LINK || '',
      stripeSubYearlyLink: process.env.NUXT_PUBLIC_STRIPE_SUB_YEARLY_LINK || '',
        appUrl: process.env.NUXT_PUBLIC_APP_URL || process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
  },

  nitro: {
    experimental: {
      wasm: false,
    },
  },
})
