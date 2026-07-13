-- Add thematic sections (Amour, Communication, Mission, Blocages, Aspects)
-- Stored as { key: { teaser, full } }. Safe/idempotent.
ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "sections" jsonb;
