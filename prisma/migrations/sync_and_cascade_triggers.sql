-- 1. Backfill any existing users from auth.users into public."User"
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt")
SELECT 
  id::text,
  email,
  COALESCE(raw_user_meta_data->>'name', raw_user_meta_data->>'full_name', split_part(email, '@', 1)) AS name,
  created_at AS "createdAt",
  NOW() AS "updatedAt"
FROM auth.users
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, public."User".name),
    "updatedAt" = NOW();

-- 2. Trigger function to automatically create or update public."User" when auth.users is created or updated
CREATE OR REPLACE FUNCTION public.handle_auth_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt")
  VALUES (
    NEW.id::text,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.created_at, NOW()),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      name = COALESCE(EXCLUDED.name, public."User".name),
      "updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_or_updated ON auth.users;
CREATE TRIGGER on_auth_user_created_or_updated
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_auth_user();

-- 3. Trigger function to automatically delete public."User" when auth.users is deleted
CREATE OR REPLACE FUNCTION public.handle_auth_user_deleted()
RETURNS trigger AS $$
BEGIN
  DELETE FROM public."User" WHERE id = OLD.id::text;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
  AFTER DELETE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_auth_user_deleted();

-- 4. Trigger function to automatically delete from auth.users when a user is deleted from public."User"
-- This guarantees that deleting from the Supabase Table Editor ("User") completely wipes credentials from auth.users
CREATE OR REPLACE FUNCTION public.handle_public_user_deleted()
RETURNS trigger AS $$
BEGIN
  DELETE FROM auth.users WHERE id = OLD.id::uuid;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_public_user_deleted ON public."User";
CREATE TRIGGER on_public_user_deleted
  AFTER DELETE ON public."User"
  FOR EACH ROW EXECUTE FUNCTION public.handle_public_user_deleted();
