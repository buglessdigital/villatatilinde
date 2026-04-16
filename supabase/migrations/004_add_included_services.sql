-- Add included_services column to villas table if it doesn't exist
ALTER TABLE villas ADD COLUMN IF NOT EXISTS included_services TEXT[] DEFAULT '{}';
