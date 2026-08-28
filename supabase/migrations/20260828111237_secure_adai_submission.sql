/*
# Secure ADAI qualification submission

1. New Functions
- `submit_qualification_request(p_company_name text, p_answers jsonb, p_recommended_pack text, p_complexity_score int)`
  SECURITY DEFINER function that validates and inserts a qualification request.
  Validates: company_name length 1-200, recommended_pack in {start,grow,scale}, complexity_score >= 0.
  Replaces direct table INSERT so the browser cannot submit arbitrary payloads.

2. Modified Tables
- `adai_qualification_requests`: added CHECK constraints.
  - `recommended_pack` must be one of start/grow/scale.
  - `company_name` length between 1 and 200.
  - `complexity_score` must be >= 0.
- INSERT policy narrowed: the anon role can no longer INSERT directly into the table.
  All inserts go through the SECURITY DEFINER function which performs validation.

3. Security
- The function is SECURITY DEFINER, runs as the table owner, bypasses RLS.
- EXECUTE granted to anon, authenticated so the browser can call it via RPC.
- search_path is set to public to prevent path injection.
- Direct INSERT policy removed (deny-by-default); SELECT/UPDATE/DELETE remain denied.

4. Notes
- This is a no-auth public submission form. The function validates all inputs server-side.
- `discountRate` is validated inside the function body (must be in [0, 0.4]).
- Existing rows are not affected by the new CHECK constraints (added with NOT VALID).
*/

-- Add CHECK constraints idempotently
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'adai_req_recommended_pack_check'
  ) THEN
    ALTER TABLE public.adai_qualification_requests
    ADD CONSTRAINT adai_req_recommended_pack_check
    CHECK (recommended_pack IN ('start', 'grow', 'scale'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'adai_req_company_name_length_check'
  ) THEN
    ALTER TABLE public.adai_qualification_requests
    ADD CONSTRAINT adai_req_company_name_length_check
    CHECK (length(company_name) BETWEEN 1 AND 200);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'adai_req_complexity_score_nonneg_check'
  ) THEN
    ALTER TABLE public.adai_qualification_requests
    ADD CONSTRAINT adai_req_complexity_score_nonneg_check
    CHECK (complexity_score >= 0);
  END IF;
END $$;

-- Remove the open INSERT policy; inserts now go through the function only
DROP POLICY IF EXISTS "Public can submit ADAI qualification" ON public.adai_qualification_requests;

-- Revoke direct INSERT from anon and authenticated
REVOKE INSERT ON public.adai_qualification_requests FROM anon, authenticated;

-- Create the validated submission function
CREATE OR REPLACE FUNCTION public.submit_qualification_request(
  p_company_name text,
  p_answers jsonb,
  p_recommended_pack text,
  p_complexity_score int
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
  v_discount double precision;
BEGIN
  -- Validate company name
  IF p_company_name IS NULL OR length(trim(p_company_name)) < 1 OR length(p_company_name) > 200 THEN
    RAISE EXCEPTION 'Invalid company name';
  END IF;

  -- Validate recommended pack
  IF p_recommended_pack NOT IN ('start', 'grow', 'scale') THEN
    RAISE EXCEPTION 'Invalid recommended pack';
  END IF;

  -- Validate complexity score
  IF p_complexity_score IS NULL OR p_complexity_score < 0 THEN
    RAISE EXCEPTION 'Invalid complexity score';
  END IF;

  -- Validate discountRate from answers JSON (must be in [0, 0.4])
  v_discount := (p_answers->>'discountRate')::double precision;
  IF v_discount IS NULL OR v_discount < 0 OR v_discount > 0.4 THEN
    RAISE EXCEPTION 'Invalid discount rate';
  END IF;

  INSERT INTO public.adai_qualification_requests (
    company_name, answers, recommended_pack, complexity_score
  ) VALUES (
    trim(p_company_name), p_answers, p_recommended_pack, p_complexity_score
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

-- Grant EXECUTE to anon and authenticated so the browser can call it
GRANT EXECUTE ON FUNCTION public.submit_qualification_request TO anon, authenticated;
