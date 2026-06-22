-- Migration 0003: table auth_magic_links + colonne secret_token sur affiliates
-- A exécuter dans neon.tech SQL editor

-- ─── 1. Table des tokens de lien magique ────────────────────────────────────

CREATE TABLE IF NOT EXISTS "auth_magic_links" (
  "id"          uuid        PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email"       text        NOT NULL,
  "token_hash"  text        NOT NULL,
  "expires_at"  timestamp   NOT NULL,
  "used_at"     timestamp,
  "created_at"  timestamp   DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "auth_magic_links_token_hash_unique"
  ON "auth_magic_links" USING btree ("token_hash");

CREATE INDEX IF NOT EXISTS "auth_magic_links_email_idx"
  ON "auth_magic_links" USING btree ("email");

CREATE INDEX IF NOT EXISTS "auth_magic_links_expires_at_idx"
  ON "auth_magic_links" USING btree ("expires_at");

-- ─── 2. Token secret privé sur la table affiliates ──────────────────────────

ALTER TABLE "affiliates"
  ADD COLUMN IF NOT EXISTS "secret_token" text;

-- Génère un token aléatoire pour chaque affilié existant qui n'en a pas encore
UPDATE "affiliates"
SET "secret_token" = encode(gen_random_bytes(32), 'hex')
WHERE "secret_token" IS NULL;

-- Rend la colonne obligatoire maintenant que tous les rangs sont remplis
ALTER TABLE "affiliates"
  ALTER COLUMN "secret_token" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "affiliates_secret_token_unique"
  ON "affiliates" USING btree ("secret_token");
