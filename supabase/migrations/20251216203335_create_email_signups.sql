-- Create email_signups table
CREATE TABLE email_signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  source TEXT DEFAULT 'landing_page'
);

-- Enable Row Level Security
ALTER TABLE email_signups ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for the landing page)
CREATE POLICY "Allow anonymous inserts" ON email_signups
  FOR INSERT TO anon
  WITH CHECK (true);

-- Only authenticated users can read (for admin)
CREATE POLICY "Only authenticated can read" ON email_signups
  FOR SELECT TO authenticated
  USING (true);

-- Create index on email for faster lookups
CREATE INDEX idx_email_signups_email ON email_signups(email);

-- Create index on created_at for sorting
CREATE INDEX idx_email_signups_created_at ON email_signups(created_at DESC);
