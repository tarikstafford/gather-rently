-- Whiteboards table for persistent collaborative drawing
CREATE TABLE IF NOT EXISTS whiteboards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  realm_id UUID NOT NULL REFERENCES realms(id) ON DELETE CASCADE,
  room_index INTEGER NOT NULL,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  canvas_data JSONB NOT NULL DEFAULT '{"elements": [], "appState": {}}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for fast lookups by realm
CREATE INDEX IF NOT EXISTS idx_whiteboards_realm ON whiteboards(realm_id, room_index);

-- Index for position lookups
CREATE INDEX IF NOT EXISTS idx_whiteboards_position ON whiteboards(realm_id, room_index, x, y);

-- Row Level Security
ALTER TABLE whiteboards ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view whiteboards in realms they have access to
CREATE POLICY "Users can view whiteboards in accessible realms"
  ON whiteboards FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM realms
      WHERE realms.id = whiteboards.realm_id
      AND (realms.owner_id = auth.uid() OR realms.only_owner = FALSE)
    )
  );

-- Policy: Realm owners can insert whiteboards
CREATE POLICY "Realm owners can insert whiteboards"
  ON whiteboards FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM realms
      WHERE realms.id = whiteboards.realm_id
      AND realms.owner_id = auth.uid()
    )
  );

-- Policy: Anyone with access can update whiteboard canvas data
CREATE POLICY "Users can update whiteboards in accessible realms"
  ON whiteboards FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM realms
      WHERE realms.id = whiteboards.realm_id
      AND (realms.owner_id = auth.uid() OR realms.only_owner = FALSE)
    )
  );

-- Policy: Only realm owners can delete whiteboards
CREATE POLICY "Realm owners can delete whiteboards"
  ON whiteboards FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM realms
      WHERE realms.id = whiteboards.realm_id
      AND realms.owner_id = auth.uid()
    )
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_whiteboard_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function
CREATE TRIGGER update_whiteboards_updated_at
  BEFORE UPDATE ON whiteboards
  FOR EACH ROW
  EXECUTE FUNCTION update_whiteboard_updated_at();

-- Enable realtime for collaborative editing
ALTER PUBLICATION supabase_realtime ADD TABLE whiteboards;
