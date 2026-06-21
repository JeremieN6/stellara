import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  real,
  integer,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core'

export const reports = pgTable('reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: text('first_name').notNull(),
  birthDate: text('birth_date').notNull(),
  birthTime: text('birth_time'),
  city: text('city').notNull(),
  lat: real('lat').notNull(),
  lon: real('lon').notNull(),
  gender: text('gender'),
  email: text('email'),
  sunSign: text('sun_sign').notNull(),
  moonSign: text('moon_sign').notNull(),
  ascendant: text('ascendant').notNull(),
  summary: text('summary'),
  isPremium: boolean('is_premium').default(false),
  stripeSessionId: text('stripe_session_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const horoscopeCache = pgTable('horoscope_cache', {
  id: uuid('id').primaryKey().defaultRandom(),
  sign: text('sign').notNull(),
  date: text('date').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const users = pgTable('users_js', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull(),
  firstName: text('first_name'),
  stripeCustomerId: text('stripe_customer_id'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailUnique: uniqueIndex('users_js_email_unique').on(table.email),
  stripeCustomerUnique: uniqueIndex('users_js_stripe_customer_unique').on(table.stripeCustomerId),
}))

export const plans = pgTable('plans_js', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  stripePriceId: text('stripe_price_id'),
  amountCents: integer('amount_cents'),
  currency: text('currency').default('eur').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  slugUnique: uniqueIndex('plans_js_slug_unique').on(table.slug),
  stripePriceUnique: uniqueIndex('plans_js_stripe_price_unique').on(table.stripePriceId),
}))

export const subscriptions = pgTable('subscriptions_js', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  planId: uuid('plan_id').references(() => plans.id, { onDelete: 'set null' }),
  stripeSubscriptionId: text('stripe_subscription_id').notNull(),
  status: text('status').notNull(),
  currentPeriodStart: timestamp('current_period_start'),
  currentPeriodEnd: timestamp('current_period_end'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  stripeSubscriptionUnique: uniqueIndex('subscriptions_js_stripe_sub_unique').on(table.stripeSubscriptionId),
  userIdx: index('subscriptions_js_user_idx').on(table.userId),
  statusIdx: index('subscriptions_js_status_idx').on(table.status),
}))

export const invoices = pgTable('invoices_js', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  subscriptionId: uuid('subscription_id').references(() => subscriptions.id, { onDelete: 'set null' }),
  stripeInvoiceId: text('stripe_invoice_id').notNull(),
  amountPaidCents: integer('amount_paid_cents'),
  currency: text('currency').default('eur').notNull(),
  status: text('status'),
  hostedInvoiceUrl: text('hosted_invoice_url'),
  issuedAt: timestamp('issued_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  stripeInvoiceUnique: uniqueIndex('invoices_js_stripe_invoice_unique').on(table.stripeInvoiceId),
  userIdx: index('invoices_js_user_idx').on(table.userId),
  subscriptionIdx: index('invoices_js_subscription_idx').on(table.subscriptionId),
}))

export const leadMagnetContacts = pgTable('lead_magnet_contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull(),
  firstName: text('first_name'),
  moonSign: text('moon_sign'),
  reportId: uuid('report_id').references(() => reports.id, { onDelete: 'set null' }),
  currentStep: integer('current_step').default(0).notNull(),
  sentEmailsCount: integer('sent_emails_count').default(0).notNull(),
  converted: boolean('converted').default(false).notNull(),
  convertedAt: timestamp('converted_at'),
  isSequenceCompleted: boolean('is_sequence_completed').default(false).notNull(),
  nextEmailDueAt: timestamp('next_email_due_at').defaultNow().notNull(),
  lastEmailSentAt: timestamp('last_email_sent_at'),
  lastError: text('last_error'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailUnique: uniqueIndex('lead_magnet_contacts_email_unique').on(table.email),
  nextEmailDueIdx: index('lead_magnet_contacts_next_email_due_idx').on(table.nextEmailDueAt),
  convertedIdx: index('lead_magnet_contacts_converted_idx').on(table.converted),
  sequenceCompletedIdx: index('lead_magnet_contacts_sequence_completed_idx').on(table.isSequenceCompleted),
}))

export const leadMagnetEmailEvents = pgTable('lead_magnet_email_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  contactId: uuid('contact_id').notNull().references(() => leadMagnetContacts.id, { onDelete: 'cascade' }),
  step: integer('step').notNull(),
  templateKey: text('template_key').notNull(),
  subject: text('subject').notNull(),
  status: text('status').notNull(),
  errorMessage: text('error_message'),
  sentAt: timestamp('sent_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  contactStepUnique: uniqueIndex('lead_magnet_email_events_contact_step_unique').on(table.contactId, table.step),
  contactIdx: index('lead_magnet_email_events_contact_idx').on(table.contactId),
  statusIdx: index('lead_magnet_email_events_status_idx').on(table.status),
}))

export const affiliates = pgTable('affiliates', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  promoCode: text('promo_code').notNull(),
  stripeCouponId: text('stripe_coupon_id').notNull(),
  commissionRate: real('commission_rate').default(0.4).notNull(),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  slugUnique: uniqueIndex('affiliates_slug_unique').on(table.slug),
  promoCodeUnique: uniqueIndex('affiliates_promo_code_unique').on(table.promoCode),
  emailIdx: index('affiliates_email_idx').on(table.email),
  activeIdx: index('affiliates_active_idx').on(table.active),
}))

export const affiliateClicks = pgTable('affiliate_clicks', {
  id: uuid('id').primaryKey().defaultRandom(),
  affiliateId: uuid('affiliate_id').notNull().references(() => affiliates.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  referrer: text('referrer'),
}, (table) => ({
  affiliateIdx: index('affiliate_clicks_affiliate_idx').on(table.affiliateId),
  createdAtIdx: index('affiliate_clicks_created_at_idx').on(table.createdAt),
}))

export const affiliateSales = pgTable('affiliate_sales', {
  id: uuid('id').primaryKey().defaultRandom(),
  affiliateId: uuid('affiliate_id').notNull().references(() => affiliates.id, { onDelete: 'cascade' }),
  stripeSessionId: text('stripe_session_id').notNull(),
  amountCents: integer('amount_cents').notNull(),
  commissionCents: integer('commission_cents').notNull(),
  productType: text('product_type').notNull(),
  status: text('status').default('confirmed').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  stripeSessionUnique: uniqueIndex('affiliate_sales_stripe_session_unique').on(table.stripeSessionId),
  affiliateIdx: index('affiliate_sales_affiliate_idx').on(table.affiliateId),
  statusIdx: index('affiliate_sales_status_idx').on(table.status),
  createdAtIdx: index('affiliate_sales_created_at_idx').on(table.createdAt),
}))
