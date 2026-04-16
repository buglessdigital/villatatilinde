-- Add villa_slug column to reservations for linking to mock villa data
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS villa_slug TEXT;
