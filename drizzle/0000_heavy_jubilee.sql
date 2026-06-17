CREATE TABLE "horoscope_cache" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sign" text NOT NULL,
	"date" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoices_js" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"subscription_id" uuid,
	"stripe_invoice_id" text NOT NULL,
	"amount_paid_cents" integer,
	"currency" text DEFAULT 'eur' NOT NULL,
	"status" text,
	"hosted_invoice_url" text,
	"issued_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lead_magnet_contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"first_name" text,
	"moon_sign" text,
	"report_id" uuid,
	"current_step" integer DEFAULT 0 NOT NULL,
	"sent_emails_count" integer DEFAULT 0 NOT NULL,
	"converted" boolean DEFAULT false NOT NULL,
	"converted_at" timestamp,
	"is_sequence_completed" boolean DEFAULT false NOT NULL,
	"next_email_due_at" timestamp DEFAULT now() NOT NULL,
	"last_email_sent_at" timestamp,
	"last_error" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lead_magnet_email_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contact_id" uuid NOT NULL,
	"step" integer NOT NULL,
	"template_key" text NOT NULL,
	"subject" text NOT NULL,
	"status" text NOT NULL,
	"error_message" text,
	"sent_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plans_js" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"stripe_price_id" text,
	"amount_cents" integer,
	"currency" text DEFAULT 'eur' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"birth_date" text NOT NULL,
	"birth_time" text,
	"city" text NOT NULL,
	"lat" real NOT NULL,
	"lon" real NOT NULL,
	"gender" text,
	"email" text,
	"sun_sign" text NOT NULL,
	"moon_sign" text NOT NULL,
	"ascendant" text NOT NULL,
	"summary" text,
	"is_premium" boolean DEFAULT false,
	"stripe_session_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions_js" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"plan_id" uuid,
	"stripe_subscription_id" text NOT NULL,
	"status" text NOT NULL,
	"current_period_start" timestamp,
	"current_period_end" timestamp,
	"cancel_at_period_end" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users_js" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"first_name" text,
	"stripe_customer_id" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "invoices_js" ADD CONSTRAINT "invoices_js_user_id_users_js_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_js"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices_js" ADD CONSTRAINT "invoices_js_subscription_id_subscriptions_js_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions_js"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_magnet_contacts" ADD CONSTRAINT "lead_magnet_contacts_report_id_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_magnet_email_events" ADD CONSTRAINT "lead_magnet_email_events_contact_id_lead_magnet_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."lead_magnet_contacts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions_js" ADD CONSTRAINT "subscriptions_js_user_id_users_js_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_js"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions_js" ADD CONSTRAINT "subscriptions_js_plan_id_plans_js_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans_js"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "invoices_js_stripe_invoice_unique" ON "invoices_js" USING btree ("stripe_invoice_id");--> statement-breakpoint
CREATE INDEX "invoices_js_user_idx" ON "invoices_js" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "invoices_js_subscription_idx" ON "invoices_js" USING btree ("subscription_id");--> statement-breakpoint
CREATE UNIQUE INDEX "lead_magnet_contacts_email_unique" ON "lead_magnet_contacts" USING btree ("email");--> statement-breakpoint
CREATE INDEX "lead_magnet_contacts_next_email_due_idx" ON "lead_magnet_contacts" USING btree ("next_email_due_at");--> statement-breakpoint
CREATE INDEX "lead_magnet_contacts_converted_idx" ON "lead_magnet_contacts" USING btree ("converted");--> statement-breakpoint
CREATE INDEX "lead_magnet_contacts_sequence_completed_idx" ON "lead_magnet_contacts" USING btree ("is_sequence_completed");--> statement-breakpoint
CREATE UNIQUE INDEX "lead_magnet_email_events_contact_step_unique" ON "lead_magnet_email_events" USING btree ("contact_id","step");--> statement-breakpoint
CREATE INDEX "lead_magnet_email_events_contact_idx" ON "lead_magnet_email_events" USING btree ("contact_id");--> statement-breakpoint
CREATE INDEX "lead_magnet_email_events_status_idx" ON "lead_magnet_email_events" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "plans_js_slug_unique" ON "plans_js" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "plans_js_stripe_price_unique" ON "plans_js" USING btree ("stripe_price_id");--> statement-breakpoint
CREATE UNIQUE INDEX "subscriptions_js_stripe_sub_unique" ON "subscriptions_js" USING btree ("stripe_subscription_id");--> statement-breakpoint
CREATE INDEX "subscriptions_js_user_idx" ON "subscriptions_js" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "subscriptions_js_status_idx" ON "subscriptions_js" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "users_js_email_unique" ON "users_js" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "users_js_stripe_customer_unique" ON "users_js" USING btree ("stripe_customer_id");