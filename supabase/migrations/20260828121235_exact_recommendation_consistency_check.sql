/*
  # Make the recommendation consistency check exact

  The previous scope check used a heuristic ("start" with 6 or more domains is
  rejected). The scoring catalog allows a legitimate 6-domain answer set with
  no functions, usages or tools to total 28 points, which is a genuine START
  result, so the heuristic could reject a valid submission.

  Replaced with two exact checks that cannot produce a false rejection:

  1. Pack / score consistency
     The pack is derived from the score by fixed thresholds (55 = scale,
     32 = grow, below = start). Both values are computed in the browser and
     were stored verbatim, so the function now recomputes the pack from the
     score and rejects any mismatch.

  2. Score floor from the submitted scope
     The cheapest domain in the catalog is worth 4 points, so a submission
     selecting N domains cannot legitimately score below 4 * N. This rejects a
     zeroed or deflated score while leaving every real answer set valid.

  No table or column is altered by this migration.
*/

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
  v_expected_pack text;
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

  -- Complexity score, bounded both ends
  IF p_complexity_score IS NULL
     OR p_complexity_score < 0
     OR p_complexity_score > 1000 THEN
    RAISE EXCEPTION 'Invalid complexity score';
  END IF;

  -- Answers must be a JSON object
  IF p_answers IS NULL OR jsonb_typeof(p_answers) <> 'object' THEN
    RAISE EXCEPTION 'Invalid answers payload';
  END IF;

  -- Overall payload ceiling
  IF pg_column_size(p_answers) > 16384 THEN
    RAISE EXCEPTION 'Answers payload too large';
  END IF;

  -- Per-field text ceilings
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

  -- Selection array ceilings
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

  -- The pack must be the one the score implies
  v_expected_pack := CASE
    WHEN p_complexity_score >= 55 THEN 'scale'
    WHEN p_complexity_score >= 32 THEN 'grow'
    ELSE 'start'
  END;
  IF p_recommended_pack <> v_expected_pack THEN
    RAISE EXCEPTION 'Recommendation does not match the submitted scope';
  END IF;

  -- The score cannot fall below what the selected scope is worth
  IF p_answers ? 'selectedDomains'
     AND jsonb_typeof(p_answers -> 'selectedDomains') = 'array' THEN
    v_domain_count := jsonb_array_length(p_answers -> 'selectedDomains');
  END IF;

  IF p_complexity_score < 4 * v_domain_count THEN
    RAISE EXCEPTION 'Recommendation does not match the submitted scope';
  END IF;

  -- Duplicate submission guard
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

GRANT EXECUTE ON FUNCTION public.submit_qualification_request(text, jsonb, text, integer)
  TO anon, authenticated;
