-- Make villa_id nullable for reservations from mock villas
ALTER TABLE reservations ALTER COLUMN villa_id DROP NOT NULL;
