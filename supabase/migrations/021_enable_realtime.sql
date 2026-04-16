-- Enable realtime for notifications
begin;
  -- Supabase often comes with a publication named 'supabase_realtime'.
  -- Add the tables to the publication so the client can listen to INSERT events.
  
  -- Add reservations table
  DO $$ 
  BEGIN
    IF NOT EXISTS (
      SELECT 1 
      FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' AND tablename = 'reservations'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE reservations;
    END IF;
  END $$;

  -- Add user_questions table
  DO $$ 
  BEGIN
    IF NOT EXISTS (
      SELECT 1 
      FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' AND tablename = 'user_questions'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE user_questions;
    END IF;
  END $$;
commit;
