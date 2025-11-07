-- Function to get realm info for invite page (bypasses RLS for unauthenticated users)
-- This allows anyone with a valid share_id to see the realm name and privacy status
CREATE OR REPLACE FUNCTION get_realm_for_invite(realm_id UUID, share_id_param UUID)
RETURNS TABLE (
  name TEXT,
  only_owner BOOLEAN
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.name,
    r.only_owner
  FROM realms r
  WHERE r.id = realm_id
    AND r.share_id = share_id_param;
END;
$$;

-- Grant execute permission to anon users
GRANT EXECUTE ON FUNCTION get_realm_for_invite(UUID, UUID) TO anon;
GRANT EXECUTE ON FUNCTION get_realm_for_invite(UUID, UUID) TO authenticated;
