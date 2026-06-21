CREATE TABLE IF NOT EXISTS "affiliates" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slug" text NOT NULL,
  "name" text NOT NULL,
  "email" text NOT NULL,
  "promo_code" text NOT NULL,
  "stripe_coupon_id" text NOT NULL,
  "commission_rate" real DEFAULT 0.4 NOT NULL,
  "active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "affiliate_clicks" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "affiliate_id" uuid NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "referrer" text
);

CREATE TABLE IF NOT EXISTS "affiliate_sales" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "affiliate_id" uuid NOT NULL,
  "stripe_session_id" text NOT NULL,
  "amount_cents" integer NOT NULL,
  "commission_cents" integer NOT NULL,
  "product_type" text NOT NULL,
  "status" text DEFAULT 'confirmed' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'affiliate_clicks_affiliate_id_affiliates_id_fk'
  ) THEN
    ALTER TABLE "affiliate_clicks"
      ADD CONSTRAINT "affiliate_clicks_affiliate_id_affiliates_id_fk"
      FOREIGN KEY ("affiliate_id") REFERENCES "public"."affiliates"("id")
      ON DELETE cascade ON UPDATE no action;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'affiliate_sales_affiliate_id_affiliates_id_fk'
  ) THEN
    ALTER TABLE "affiliate_sales"
      ADD CONSTRAINT "affiliate_sales_affiliate_id_affiliates_id_fk"
      FOREIGN KEY ("affiliate_id") REFERENCES "public"."affiliates"("id")
      ON DELETE cascade ON UPDATE no action;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "affiliates_slug_unique" ON "affiliates" USING btree ("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "affiliates_promo_code_unique" ON "affiliates" USING btree ("promo_code");
CREATE INDEX IF NOT EXISTS "affiliates_email_idx" ON "affiliates" USING btree ("email");
CREATE INDEX IF NOT EXISTS "affiliates_active_idx" ON "affiliates" USING btree ("active");

CREATE INDEX IF NOT EXISTS "affiliate_clicks_affiliate_idx" ON "affiliate_clicks" USING btree ("affiliate_id");
CREATE INDEX IF NOT EXISTS "affiliate_clicks_created_at_idx" ON "affiliate_clicks" USING btree ("created_at");

CREATE UNIQUE INDEX IF NOT EXISTS "affiliate_sales_stripe_session_unique" ON "affiliate_sales" USING btree ("stripe_session_id");
CREATE INDEX IF NOT EXISTS "affiliate_sales_affiliate_idx" ON "affiliate_sales" USING btree ("affiliate_id");
CREATE INDEX IF NOT EXISTS "affiliate_sales_status_idx" ON "affiliate_sales" USING btree ("status");
CREATE INDEX IF NOT EXISTS "affiliate_sales_created_at_idx" ON "affiliate_sales" USING btree ("created_at");
