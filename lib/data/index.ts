// =============================================
// DATA LAYER — single place every page calls into.
//
// Picks live Supabase (lib/supabase/queries.ts) when .env.local has real
// credentials, otherwise falls back to the bundled dummy data
// (lib/data/dummy.ts) + whatever a visitor submitted locally
// (lib/data/submissions.ts) — so the app still works for a quick local
// demo before a backend exists. Every function here is async either way,
// so pages never need to change when Supabase gets connected.
// =============================================
import { isSupabaseConfigured } from '../supabase/client';
import * as live from '../supabase/queries';
import {
  dummyPlayers, dummyTeams, dummyTournaments, dummyMatches,
  dummyStandings, dummyGoals, dummyTrials, dummyProducts,
} from './dummy';
import { getLocalPlayers, addLocalPlayer } from './submissions';
import { createClient } from '../supabase/client';
import type { Player, Team, Tournament, Match, Standing, Trial, Product } from '../supabase/types';

// Registration form (app/pemain/daftar) calls this. Status is always
// 'pending' — see the DEFAULT on players.status and the admin approval
// flow (/admin/pemain).
export async function registerPlayer(input: Database_PlayerInsert): Promise<void> {
  if (isSupabaseConfigured) {
    const supabase = createClient();
    const { error } = await supabase.from('players').insert(input);
    if (error) throw error;
    return;
  }
  addLocalPlayer({
    id: `local-${Date.now()}`,
    full_name: input.full_name,
    nickname: input.nickname ?? null,
    birth_date: input.birth_date,
    birth_place: input.birth_place ?? null,
    height_cm: input.height_cm ?? null,
    weight_kg: input.weight_kg ?? null,
    position: input.position,
    dominant_foot: input.dominant_foot ?? 'kanan',
    current_club: input.current_club ?? null,
    address: input.address ?? null,
    phone: input.phone ?? null,
    photo_url: input.photo_url ?? null,
    video_url: input.video_url ?? null,
    stats: input.stats ?? { goals: 0, assists: 0, appearances: 0, clean_sheets: 0 },
    status: 'pending',
    submitted_by: null,
    approved_by: null,
    approved_at: null,
    rejection_reason: null,
    created_at: new Date().toISOString(),
  });
}

type Database_PlayerInsert = {
  full_name: string; birth_date: string; position: string; nickname?: string | null;
  birth_place?: string | null; height_cm?: number | null; weight_kg?: number | null;
  dominant_foot?: string; current_club?: string | null; address?: string | null; phone?: string | null;
  photo_url?: string | null; video_url?: string | null; stats?: Player['stats'];
};

export async function getApprovedPlayers(): Promise<Player[]> {
  if (isSupabaseConfigured) return live.getApprovedPlayers();
  return [...getLocalPlayers(), ...dummyPlayers].filter((p) => p.status === 'approved' || p.status === 'pending');
}

export async function getPlayerById(id: string): Promise<Player | undefined> {
  if (isSupabaseConfigured) return live.getPlayerById(id);
  return [...getLocalPlayers(), ...dummyPlayers].find((p) => p.id === id);
}

export async function getTeams(): Promise<Team[]> {
  if (isSupabaseConfigured) return live.getTeams();
  return dummyTeams;
}

async function getTeamById(id: string | null): Promise<Team | undefined> {
  if (!id) return undefined;
  if (isSupabaseConfigured) return live.getTeamById(id);
  return dummyTeams.find((t) => t.id === id);
}

export async function getTournaments(): Promise<Tournament[]> {
  if (isSupabaseConfigured) return live.getTournaments();
  return dummyTournaments;
}

export async function getActiveTournament(): Promise<Tournament | undefined> {
  if (isSupabaseConfigured) return live.getActiveTournament();
  return dummyTournaments.find((t) => t.status === 'ongoing') ?? dummyTournaments[0];
}

export async function getMatches(tournamentId?: string): Promise<Match[]> {
  if (isSupabaseConfigured) return live.getMatches(tournamentId);
  return dummyMatches
    .filter((m) => !tournamentId || m.tournament_id === tournamentId)
    .sort((a, b) => (a.match_date ?? '').localeCompare(b.match_date ?? ''));
}

export async function getUpcomingMatches(limit = 3): Promise<Match[]> {
  if (isSupabaseConfigured) return live.getUpcomingMatches(limit);
  const all = await getMatches();
  return all.filter((m) => m.status === 'scheduled' || m.status === 'live').slice(0, limit);
}

export async function getStandings(tournamentId?: string): Promise<(Standing & { team?: Team })[]> {
  if (isSupabaseConfigured) return live.getStandings(tournamentId);
  const rows = await Promise.all(
    dummyStandings
      .filter((s) => !tournamentId || s.tournament_id === tournamentId)
      .map(async (s) => ({ ...s, team: await getTeamById(s.team_id) }))
  );
  return rows.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return (b.goals_for - b.goals_against) - (a.goals_for - a.goals_against);
  });
}

export async function getTopScorers(limit = 10): Promise<{ player?: Player; team?: Team; goals: number }[]> {
  if (isSupabaseConfigured) return live.getTopScorers(limit);
  const counts = new Map<string, number>();
  for (const g of dummyGoals) {
    if (g.is_own_goal || !g.player_id) continue;
    counts.set(g.player_id, (counts.get(g.player_id) ?? 0) + 1);
  }
  const rows = await Promise.all(
    [...counts.entries()].map(async ([playerId, goals]) => {
      const player = dummyPlayers.find((p) => p.id === playerId);
      const team = player?.current_club ? dummyTeams.find((t) => t.name === player.current_club) : undefined;
      return { player, team, goals };
    })
  );
  return rows.sort((a, b) => b.goals - a.goals).slice(0, limit);
}

export async function getTrials(): Promise<Trial[]> {
  if (isSupabaseConfigured) return live.getTrials();
  return [...dummyTrials].sort((a, b) => (a.trial_date ?? '').localeCompare(b.trial_date ?? ''));
}

export async function getProducts(category?: string): Promise<Product[]> {
  if (isSupabaseConfigured) return live.getProducts(category);
  return dummyProducts.filter((p) => !category || category === 'all' || p.category === category);
}
