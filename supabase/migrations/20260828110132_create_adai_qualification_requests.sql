/*
# Create ADAI qualification requests

1. New Tables
- `adai_qualification_requests` stores the completed qualification form as a durable review request.
- `id` is the request identifier.
- `company_name` stores the company label shown to the ADAI team.
- `answers` stores the structured qualification answers as JSON.
- `recommended_pack` stores the calculated recommendation.
- `complexity_score` stores the transparent recommendation score.
- `created_at` stores when the request was submitted.

2. Security
- Row level security is enabled.
- The application has no sign-in screen, so anonymous and authenticated sessions may create requests.
- Requests are readable only by the service role; the browser can submit but cannot browse the shared request inbox.

3. Notes
- The JSON snapshot keeps the complete qualification intact even if the form evolves.
- No existing tables or user data are modified.
*/

CREATE TABLE IF NOT EXISTS public.adai_qualification_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  recommended_pack text NOT NULL,
  complexity_score integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.adai_qualification_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can submit ADAI qualification" ON public.adai_qualification_requests;
CREATE POLICY "Public can submit ADAI qualification"
ON public.adai_qualification_requests FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Public cannot browse ADAI qualifications" ON public.adai_qualification_requests;
CREATE POLICY "Public cannot browse ADAI qualifications"
ON public.adai_qualification_requests FOR SELECT
TO anon, authenticated
USING (false);

DROP POLICY IF EXISTS "Public cannot edit ADAI qualifications" ON public.adai_qualification_requests;
CREATE POLICY "Public cannot edit ADAI qualifications"
ON public.adai_qualification_requests FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

DROP POLICY IF EXISTS "Public cannot delete ADAI qualifications" ON public.adai_qualification_requests;
CREATE POLICY "Public cannot delete ADAI qualifications"
ON public.adai_qualification_requests FOR DELETE
TO anon, authenticated
USING (false);

CREATE INDEX IF NOT EXISTS adai_qualification_requests_created_at_idx
ON public.adai_qualification_requests (created_at DESC);
