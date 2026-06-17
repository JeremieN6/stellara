CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS "lead_magnet_contacts" (
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

CREATE TABLE IF NOT EXISTS "lead_magnet_email_events" (
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

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'lead_magnet_contacts_report_id_reports_id_fk'
  ) THEN
    ALTER TABLE "lead_magnet_contacts"
      ADD CONSTRAINT "lead_magnet_contacts_report_id_reports_id_fk"
      FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id")
      ON DELETE set null ON UPDATE no action;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'lead_magnet_email_events_contact_id_lead_magnet_contacts_id_fk'
  ) THEN
    ALTER TABLE "lead_magnet_email_events"
      ADD CONSTRAINT "lead_magnet_email_events_contact_id_lead_magnet_contacts_id_fk"
      FOREIGN KEY ("contact_id") REFERENCES "public"."lead_magnet_contacts"("id")
      ON DELETE cascade ON UPDATE no action;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "lead_magnet_contacts_email_unique"
  ON "lead_magnet_contacts" USING btree ("email");

CREATE INDEX IF NOT EXISTS "lead_magnet_contacts_next_email_due_idx"
  ON "lead_magnet_contacts" USING btree ("next_email_due_at");

CREATE INDEX IF NOT EXISTS "lead_magnet_contacts_converted_idx"
  ON "lead_magnet_contacts" USING btree ("converted");

CREATE INDEX IF NOT EXISTS "lead_magnet_contacts_sequence_completed_idx"
  ON "lead_magnet_contacts" USING btree ("is_sequence_completed");

CREATE UNIQUE INDEX IF NOT EXISTS "lead_magnet_email_events_contact_step_unique"
  ON "lead_magnet_email_events" USING btree ("contact_id", "step");

CREATE INDEX IF NOT EXISTS "lead_magnet_email_events_contact_idx"
  ON "lead_magnet_email_events" USING btree ("contact_id");

CREATE INDEX IF NOT EXISTS "lead_magnet_email_events_status_idx"
  ON "lead_magnet_email_events" USING btree ("status");
