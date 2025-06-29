/*
  # Create friendships table

  1. New Tables
    - `friendships`
      - `id` (uuid, primary key)
      - `requester_id` (uuid, foreign key to users)
      - `addressee_id` (uuid, foreign key to users)
      - `status` (enum: pending, accepted, blocked)
      - `can_view_prayers` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `friendships` table
    - Add policies for friendship management
    - Add unique constraint to prevent duplicate friendships

  3. Indexes
    - Add indexes for efficient querying
*/

CREATE TABLE IF NOT EXISTS friendships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  addressee_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  can_view_prayers boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(requester_id, addressee_id)
);

ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

-- Users can manage friendships they're involved in
CREATE POLICY "Users can manage their friendships"
  ON friendships
  FOR ALL
  TO authenticated
  USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

-- Add indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_friendships_requester_id ON friendships(requester_id);
CREATE INDEX IF NOT EXISTS idx_friendships_addressee_id ON friendships(addressee_id);
CREATE INDEX IF NOT EXISTS idx_friendships_status ON friendships(status);

-- Trigger for updated_at
CREATE TRIGGER update_friendships_updated_at
  BEFORE UPDATE ON friendships
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();