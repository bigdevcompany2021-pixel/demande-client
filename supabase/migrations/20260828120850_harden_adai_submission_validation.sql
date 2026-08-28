/*
  # Harden the public ADAI qualification submission endpoint

  The submission function is the only client-reachable write surface in this
  application and it is callable anonymously by design (public lead form).
  It validated the company name, the pack enum, the sign of the score and the
  discount rate, but placed no ceiling on the payload it stored and no ceiling
  on how often the same payload could be stored.

  1. Payload size limits (F1)
     - `answers` is capped at 16 KB. Real submissions measure 57-1343 bytes, so
       this leaves ample headroom while removing the unbounded-storage abuse.
     - The free-text fields carried inside `answers` are bounded individually.
     - The four selection arrays are capped at 64 elements each; the catalog
       offers at most 36 functions, so this cannot reject a legitimate answer.
     - Backed by a table CHECK constraint so no future writer can bypass it.

  2. Duplicate submission guard (F2)
     - An identical company_name + answers pair inside a 60 second window is
       rejected. This kills replay and accidental double-submit. Per-IP volume
       limiting is not visible to a Postgres function and remains a platform
       control.

  3. Complexity score upper bound (F3)
     - The score was bounded below only. The scoring catalog can produce at
       most ~210 points, so the score is now bounded to 0..1000 in both the
       function and the table constraint.

  4. Scope consistency guard (F4)
     - The pack and score are computed in the browser and were stored verbatim.
       Submissions whose declared pack plainly contradicts the submitted scope
       are now rejected, so the stored recommendation cannot claim a minimal
       engagement for a full-scope answer set.

  5. Notes
     - No table is dropped, no column is removed, no existing row is modified.
     - Existing rows satisfy both new constraints (checked before applying).
*/

-- 1. Replace the one-sided score constraint with a bounded range (F3)
ALTER TABLE public.adai_qualification_requests
  DROP CONSTRAINT IF EXISTS adai_req_complexity_score_nonneg_check;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'adai_req_complexity_score_range_check'
  ) THEN
    ALTER TABLE public.adai_qualification_requests
      ADD CONSTRAINT adai_req_complexity_score_range_check
      CHECK (complexity_score BETWEEN 0 AND 1000);
  END IF;
END $$;

-- 2. Cap the stored payload size at the table level (F1)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'adai_req_answers_size_check'
  ) THEN
    ALTER TABLE public.adai_qualification_requests
      ADD CONSTRAINT adai_req_answers_size_check
      CHECK (pg_column_size(answers) <= 16384);
  END IF;
END $$;

-- 3. Rewrite the submission function with the full validation set
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
  v_domain_count int := 0;
  v_text_key text;
  v_array_key text;
  v_max_len int;
BEGIN
  -- Company name
  IF p_company_name IS NULL
     OR length(trim(p_company_name)) < 1
     OR length(p_company_name) > 200 THEN
    RAISE EXCEPTION 'Invalid company name';
  END IF;

  -- Pack enum
  IF p_recommended_pack NOT IN ('start', 'grow', 'scale') THEN
    RAISE EXCEPTION 'Invalid recommended pack';
  END IF;

  -- Complexity score, bounded both ends (F3)
  IF p_complexity_score IS NULL
     OR p_complexity_score < 0
     OR p_complexity_score > 1000 THEN
    RAISE EXCEPTION 'Invalid complexity score';
  END IF;

  -- Answers must be a JSON object
  IF p_answers IS NULL OR jsonb_typeof(p_answers) <> 'object' THEN
    RAISE EXCEPTION 'Invalid answers payload';
  END IF;

  -- Overall payload ceiling (F1)
  IF pg_column_size(p_answers) > 16384 THEN
    RAISE EXCEPTION 'Answers payload too large';
  END IF;

  -- Per-field text ceilings (F1)
  FOR v_text_key, v_max_len IN
    SELECT * FROM (VALUES
      ('companyName', 200),
      ('industry', 200),
      ('people', 40),
      ('organization', 80),
      ('priority', 120),
      ('timeline', 80),
      ('need', 4000)
    ) AS t(k, n)
  LOOP
    IF p_answers ? v_text_key
       AND jsonb_typeof(p_answers -> v_text_key) = 'string'
       AND length(p_answers ->> v_text_key) > v_max_len THEN
      RAISE EXCEPTION 'Answers field too long';
    END IF;
  END LOOP;

  -- Selection array ceilings (F1)
  FOREACH v_array_key IN ARRAY ARRAY[
    'selectedDomains', 'selectedFunctions', 'selectedUsages', 'selectedTools'
  ]
  LOOP
    IF p_answers ? v_array_key THEN
      IF jsonb_typeof(p_answers -> v_array_key) <> 'array' THEN
        RAISE EXCEPTION 'Invalid answers payload';
      END IF;
      IF jsonb_array_length(p_answers -> v_array_key) > 64 THEN
        RAISE EXCEPTION 'Too many selections';
      END IF;
    END IF;
  END LOOP;

  -- Discount rate range
  v_discount := (p_answers ->> 'discountRate')::double precision;
  IF v_discount IS NULL OR v_discount < 0 OR v_discount > 0.4 THEN
    RAISE EXCEPTION 'Invalid discount rate';
  END IF;

  -- Scope consistency: the browser computes the pack, so reject a declared
  -- pack that plainly contradicts the submitted scope (F4)
  IF p_answers ? 'selectedDomains'
     AND jsonb_typeof(p_answers -> 'selectedDomains') = 'array' THEN
    v_domain_count := jsonb_array_length(p_answers -> 'selectedDomains');
  END IF;

  IF p_recommended_pack = 'start' AND v_domain_count >= 6 THEN
    RAISE EXCEPTION 'Recommendation does not match the submitted scope';
  END IF;

  IF p_complexity_score = 0 AND v_domain_count > 0 THEN
    RAISE EXCEPTION 'Recommendation does not match the submitted scope';
  END IF;

  -- Duplicate submission guard (F2)
  IF EXISTS (
    SELECT 1
    FROM public.adai_qualification_requests
    WHERE company_name = trim(p_company_name)
      AND answers = p_answers
      AND created_at > now() - interval '60 seconds'
  ) THEN
    RAISE EXCEPTION 'This request was just submitted';
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

-- The function stays callable by the browser: this is a public lead form and
-- the function is the only write path, replacing a direct table grant.
GRANT EXECUTE ON FUNCTION public.submit_qualification_request(text, jsonb, text, integer)
  TO anon, authenticated;
