-- =============================================
-- CILANGKAHAN FOOTBALL ECOSYSTEM — Database Schema
-- Deploy to: Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. PROFILES (extends Supabase Auth)
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role TEXT DEFAULT 'public' CHECK (role IN ('admin', 'public')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- =============================================
-- 2. PLAYERS (Talent Pool)
-- =============================================
CREATE TABLE IF NOT EXISTS public.players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  nickname TEXT,
  birth_date DATE NOT NULL,
  birth_place TEXT,
  height_cm INT CHECK (height_cm BETWEEN 100 AND 250),
  weight_kg INT CHECK (weight_kg BETWEEN 30 AND 150),
  position TEXT NOT NULL CHECK (position IN ('GK','CB','LB','RB','CDM','CM','CAM','LW','RW','ST')),
  dominant_foot TEXT DEFAULT 'kanan' CHECK (dominant_foot IN ('kanan','kiri','kedua')),
  current_club TEXT,
  address TEXT,
  phone TEXT,
  photo_url TEXT,
  video_url TEXT,
  stats JSONB DEFAULT '{"goals":0,"assists":0,"appearances":0,"clean_sheets":0}'::jsonb,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  submitted_by UUID REFERENCES public.profiles(id),
  approved_by UUID REFERENCES public.profiles(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
CREATE POLICY "players_select" ON public.players FOR SELECT USING (
  status = 'approved'
  OR auth.uid() = submitted_by
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "players_insert" ON public.players FOR INSERT WITH CHECK (true);
CREATE POLICY "players_update_admin" ON public.players FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "players_delete_admin" ON public.players FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- =============================================
-- 3. TOURNAMENTS
-- =============================================
CREATE TABLE IF NOT EXISTS public.tournaments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  season TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  format TEXT DEFAULT 'liga' CHECK (format IN ('liga','gugur','grup')),
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming','ongoing','finished')),
  logo_url TEXT,
  description TEXT,
  prize TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tournaments_select_all" ON public.tournaments FOR SELECT USING (true);
CREATE POLICY "tournaments_admin" ON public.tournaments FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- =============================================
-- 4. TEAMS
-- =============================================
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  home_ground TEXT,
  founded_year INT,
  colors TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "teams_select_all" ON public.teams FOR SELECT USING (true);
CREATE POLICY "teams_admin" ON public.teams FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- =============================================
-- 5. MATCHES
-- =============================================
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  home_team_id UUID REFERENCES public.teams(id),
  away_team_id UUID REFERENCES public.teams(id),
  match_date TIMESTAMPTZ,
  venue TEXT,
  home_score INT DEFAULT 0,
  away_score INT DEFAULT 0,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled','live','finished','postponed')),
  match_week INT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "matches_select_all" ON public.matches FOR SELECT USING (true);
CREATE POLICY "matches_admin" ON public.matches FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- =============================================
-- 6. GOALS (Top Scorer tracking)
-- =============================================
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
  player_id UUID REFERENCES public.players(id),
  team_id UUID REFERENCES public.teams(id),
  minute INT CHECK (minute BETWEEN 1 AND 120),
  is_own_goal BOOLEAN DEFAULT false,
  is_penalty BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "goals_select_all" ON public.goals FOR SELECT USING (true);
CREATE POLICY "goals_admin" ON public.goals FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- =============================================
-- 7. STANDINGS — computed VIEW, not a table.
-- Admin never edits standings directly: they only enter match scores
-- (`matches.home_score`/`away_score`, `status = 'finished'`) and this view
-- recalculates played/won/drawn/lost/GF/GA/points on every query, so the
-- table and the standings can never drift out of sync.
-- =============================================
DROP TABLE IF EXISTS public.standings CASCADE;
DROP VIEW IF EXISTS public.standings CASCADE;

CREATE VIEW public.standings
WITH (security_invoker = true) AS
WITH team_matches AS (
  SELECT tournament_id, home_team_id AS team_id, home_score AS gf, away_score AS ga,
         (home_score > away_score)::int AS win,
         (home_score = away_score)::int AS draw,
         (home_score < away_score)::int AS loss
  FROM public.matches
  WHERE status = 'finished' AND home_team_id IS NOT NULL AND away_team_id IS NOT NULL
  UNION ALL
  SELECT tournament_id, away_team_id AS team_id, away_score AS gf, home_score AS ga,
         (away_score > home_score)::int AS win,
         (away_score = home_score)::int AS draw,
         (away_score < home_score)::int AS loss
  FROM public.matches
  WHERE status = 'finished' AND home_team_id IS NOT NULL AND away_team_id IS NOT NULL
)
SELECT
  (tournament_id::text || '-' || team_id::text) AS id,
  tournament_id,
  team_id,
  COUNT(*)::int AS played,
  SUM(win)::int AS won,
  SUM(draw)::int AS drawn,
  SUM(loss)::int AS lost,
  SUM(gf)::int AS goals_for,
  SUM(ga)::int AS goals_against,
  (SUM(win) * 3 + SUM(draw))::int AS points
FROM team_matches
GROUP BY tournament_id, team_id;

-- =============================================
-- 7b. TOP SCORERS — computed VIEW from goals + players.
-- Inherits players RLS through the join, so a pending/unapproved player's
-- goals never show up in the public top-scorer list.
-- =============================================
DROP VIEW IF EXISTS public.top_scorers CASCADE;

CREATE VIEW public.top_scorers
WITH (security_invoker = true) AS
SELECT
  g.player_id,
  p.full_name,
  p.current_club,
  p.position,
  COUNT(*)::int AS goals
FROM public.goals g
JOIN public.players p ON p.id = g.player_id
WHERE g.is_own_goal = false
GROUP BY g.player_id, p.full_name, p.current_club, p.position
ORDER BY goals DESC;

-- =============================================
-- 8. TRIALS (Open Recruitment / Career Portal)
-- =============================================
CREATE TABLE IF NOT EXISTS public.trials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  club_name TEXT NOT NULL,
  description TEXT,
  requirements TEXT,
  positions TEXT[],
  trial_date DATE,
  location TEXT,
  contact TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open','closed')),
  poster_url TEXT,
  age_min INT,
  age_max INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.trials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "trials_select_all" ON public.trials FOR SELECT USING (true);
CREATE POLICY "trials_admin" ON public.trials FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- =============================================
-- 9. PRODUCTS (UMKM / Fanzone)
-- =============================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price INT,
  image_url TEXT,
  category TEXT DEFAULT 'merchandise' CHECK (category IN ('merchandise','tiket','kuliner','jasa')),
  seller_name TEXT,
  contact TEXT,
  whatsapp TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_select_available" ON public.products FOR SELECT USING (is_available = true);
CREATE POLICY "products_admin" ON public.products FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- =============================================
-- AUTO-CREATE PROFILE TRIGGER
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
