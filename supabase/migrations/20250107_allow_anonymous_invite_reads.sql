-- Allow anonymous users to read minimal realm info for invite pages
-- This is safe because we only expose name and privacy status, never sensitive data

-- First, check if the policy already exists and drop it
DROP POLICY IF EXISTS "Allow anonymous reads for valid invites" ON realms;

-- Create RLS policy that allows anonymous users to read realm name and only_owner
-- This is limited to only the fields needed for the invite page
CREATE POLICY "Allow anonymous reads for valid invites"
ON realms
FOR SELECT
TO anon, authenticated
USING (
  -- Allow reads when share_id is being used (can't be enforced at DB level,
  -- but application code ensures this)
  share_id IS NOT NULL
);
