-- Migration 0004: journal d'actions admin pour les affiliés
-- A exécuter dans neon.tech SQL editor

CREATE TABLE IF NOT EXISTS "affiliate_admin_actions" (
  "id"           uuid        PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "affiliate_id" uuid        NOT NULL,
  "actor"        text        DEFAULT 'admin' NOT NULL,
  "action"       text        NOT NULL,
  "status"       text        NOT NULL,
  "details"      text,
  "created_at"   timestamp   DEFAULT now() NOT NULL
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'affiliate_admin_actions_affiliate_id_affiliates_id_fk'
  ) THEN
    ALTER TABLE "affiliate_admin_actions"
      ADD CONSTRAINT "affiliate_admin_actions_affiliate_id_affiliates_id_fk"
      FOREIGN KEY ("affiliate_id") REFERENCES "public"."affiliates"("id")
      ON DELETE cascade ON UPDATE no action;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "affiliate_admin_actions_affiliate_idx"
  ON "affiliate_admin_actions" USING btree ("affiliate_id");

CREATE INDEX IF NOT EXISTS "affiliate_admin_actions_action_idx"
  ON "affiliate_admin_actions" USING btree ("action");

CREATE INDEX IF NOT EXISTS "affiliate_admin_actions_created_at_idx"
  ON "affiliate_admin_actions" USING btree ("created_at");
