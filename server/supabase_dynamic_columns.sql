-- ==============================================================================
-- 🚀 SUPABASE POSTGRESQL FUNCTION FOR DYNAMIC COLUMN CREATION
-- ==============================================================================
-- Run this SQL in your Supabase Dashboard -> SQL Editor (or New Query)
-- ==============================================================================

-- 1. Drop existing function if it already exists with a different return type
DROP FUNCTION IF EXISTS public.add_lead_column(text, text);
DROP FUNCTION IF EXISTS public.add_lead_column(text);
DROP FUNCTION IF EXISTS public.add_lead_column;

-- 2. Create the stored function with SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.add_lead_column(
  column_name text,
  column_type text DEFAULT 'text'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  clean_col text;
BEGIN
  -- Sanitize column identifier (lowercase, letters/numbers/underscores only)
  clean_col := lower(regexp_replace(trim(column_name), '[^a-zA-Z0-9_]', '_', 'g'));

  IF clean_col IS NULL OR clean_col = '' THEN
    RAISE EXCEPTION 'Invalid column name provided';
  END IF;

  clean_col := substring(clean_col from 1 for 63);

  -- Execute dynamic ALTER TABLE query safely using format and %I (identifier escape)
  EXECUTE format('ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS %I %s', clean_col, column_type);
END;
$$;

-- 3. Grant execution permissions
GRANT EXECUTE ON FUNCTION public.add_lead_column(text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.add_lead_column(text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.add_lead_column(text, text) TO authenticated;

-- 4. Pre-create the primary columns for your current contact form
ALTER TABLE public.leads 
  ADD COLUMN IF NOT EXISTS full_name text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS company text,
  ADD COLUMN IF NOT EXISTS service text;

-- ==============================================================================
