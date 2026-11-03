// Real Supabase-backed data functions — the live counterpart of
// lib/data/dummy.ts. lib/data/index.ts picks between this file and the
// dummy one based on isSupabaseConfigured, so pages never call this
// directly.
import { createClient } from './client';
import type { Player, Team, Tournament, Match, Standing, Trial, Product } from './types';

export async function getApprovedPlayers(): Promise<Player[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .in('status', ['approved', 'pending'])
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getPlayerById(id: string): Promise<Player | undefined> {
  const supabase = createClient();
  const { data, error } = await supabase.from('players').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data ?? undefined;
}

export async function getTeams(): Promise<Team[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('teams').select('*').order('name');
  if (error) throw error;
  return data ?? [];
}

export async function getTeamById(id: string | null): Promise<Team | undefined> {
  if (!id) return undefined;
  const supabase = createClient();
  const { data, error } = await supabase.from('teams').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data ?? undefined;
}

export async function getTournaments(): Promise<Tournament[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('tournaments').select('*').order('start_date', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getActiveTournament(): Promise<Tournament | undefined> {
  const all = await getTournaments();
  return all.find((t) => t.status === 'ongoing') ?? all[0];
}

export async function getMatches(tournamentId?: string): Promise<Match[]> {
  const supabase = createClient();
  let query = supabase.from('matches').select('*').order('match_date', { ascending: true });
  if (tournamentId) query = query.eq('tournament_id', tournamentId);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getUpcomingMatches(limit = 3): Promise<Match[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .in('status', ['scheduled', 'live'])
    .order('match_date', { ascending: true })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function getStandings(tournamentId?: string): Promise<(Standing & { team?: Team })[]> {
  const supabase = createClient();
  let query = supabase.from('standings').select('*');
  if (tournamentId) query = query.eq('tournament_id', tournamentId);
  const { data, error } = await query;
  if (error) throw error;
  const teams = await getTeams();
  const teamById = new Map(teams.map((t) => [t.id, t]));
  return (data ?? [])
    .map((s) => ({ ...s, team: s.team_id ? teamById.get(s.team_id) : undefined }))
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return (b.goals_for - b.goals_against) - (a.goals_for - a.goals_against);
    });
}

export async function getTopScorers(limit = 10): Promise<{ player?: Player; team?: Team; goals: number }[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('top_scorers').select('*').limit(limit);
  if (error) throw error;
  return (data ?? []).map((row) => ({
    player: row.player_id
      ? ({ id: row.player_id, full_name: row.full_name, current_club: row.current_club, position: row.position } as Player)
      : undefined,
    team: undefined,
    goals: row.goals,
  }));
}

export async function getTrials(): Promise<Trial[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('trials').select('*').order('trial_date', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getProducts(category?: string): Promise<Product[]> {
  const supabase = createClient();
  let query = supabase.from('products').select('*').eq('is_available', true);
  if (category && category !== 'all') query = query.eq('category', category);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
