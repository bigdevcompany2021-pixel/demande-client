/*
# Revoke unnecessary table grants

The anon and authenticated roles retain SELECT, UPDATE, DELETE grants
on adai_qualification_requests, but all three are denied by policy (USING false).
Revoke them so the table is truly locked down — only the SECURITY DEFINER
function can write, and nobody can read via the Data API.
*/

REVOKE SELECT, UPDATE, DELETE ON public.adai_qualification_requests FROM anon, authenticated;
