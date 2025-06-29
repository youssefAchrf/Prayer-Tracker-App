/*
  # Create prayers table

  1. New Tables
    - `prayers`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `prayer_name` (text)
      - `prayer_date` (date)
      - `status` (enum: jamaah, alone, late, missed, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `prayers` table
    - Add policies for prayer data access
    - Users can manage their own prayers
    - Friends can view prayers if permission granted

  3. Indexes
    - Add indexes for efficient querying by user and date
*/

CREATE TABLE IF NOT EXISTS prayers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  prayer_name text NOT NULL CHECK (prayer_name IN ('Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha')),
  prayer_date date NOT NULL,
  status text CHECK (status IN ('jamaah', 'alone', 'late', 'missed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, prayer_name, prayer_date)
);

ALTER TABLE prayers ENABLE ROW LEVEL SECURITY;

-- Users can manage their own prayers
CREATE POLICY "Users can manage own prayers"
  ON prayers
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Friends can view prayers if permission is granted
CREATE POLICY "Friends can view prayers with permission"
  ON prayers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM friendships f
      JOIN users u ON u.id = prayers.user_id
      WHERE (f.requester_id = auth.uid() AND f.addressee_id = prayers.user_id)
         OR (f.addressee_id = auth.uid() AND f.requester_id = prayers.user_id)
      AND f.status = 'accepted'
      AND f.can_view_prayers = true
      AND NOT u.is_private
    )
  );

-- Add indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_prayers_user_id ON prayers(user_id);
CREATE INDEX IF NOT EXISTS idx_prayers_date ON prayers(prayer_date);
CREATE INDEX IF NOT EXISTS idx_prayers_user_date ON prayers(user_id, prayer_date);

-- Trigger for updated_at
CREATE TRIGGER update_prayers_updated_at
  BEFORE UPDATE ON prayers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();