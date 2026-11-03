// =============================================
// DATA LAYER — single place every page calls into.
//
// Right now every function below reads the static
// dummy.ts data (+ anything a visitor has submitted
// locally, see submissions.ts). Once a real Supabase
// project exists:
//   1. fill NEXT_PUBLIC_SUPABASE_URL / ANON_KEY in .env.local
//   2. run supabase/schema.sql then supabase/seed.sql in the SQL editor
//   3. replace each function body with the matching
//      `createClient().from('<table>').select(...)` call
//      (lib/supabase/client.ts / server.ts already exist)
// No page needs to change — they only import from here.
// =============================================
import {
  dummyPlayers, dummyTeams, dummyTournaments, dummyMatches,
  dummyStandings, dummyGoals, dummyTrials, dummyProducts,
} from './dummy';
import { getLocalPlayers } from './submissions';
import type { Player, Team, Tournament, Match, Standing, Trial, Product } from '../supabase/types';

export function getApprovedPlayers(): Player[] {
  return [...getLocalPlayers(), ...dummyPlayers].filter((p) => p.status === 'approved' || p.status === 'pending');
}

export function getPlayerById(id: string): Player | undefined {
  return [...getLocalPlayers(), ...dummyPlayers].find((p) => p.id === id);
}

export function getTeams(): Team[] {
  return dummyTeams;
}

export function getTeamById(id: string | null): Team | undefined {
  if (!id) return undefined;
  return dummyTeams.find((t) => t.id === id);
}

export function getTournaments(): Tournament[] {
  return dummyTournaments;
}

export function getActiveTournament(): Tournament | undefined {
  return dummyTournaments.find((t) => t.status === 'ongoing') ?? dummyTournaments[0];
}

export function getMatches(tournamentId?: string): Match[] {
  return dummyMatches
    .filter((m) => !tournamentId || m.tournament_id === tournamentId)
    .sort((a, b) => (a.match_date ?? '').localeCompare(b.match_date ?? ''));
}

export function getUpcomingMatches(limit = 3): Match[] {
  return getMatches()
    .filter((m) => m.status === 'scheduled' || m.status === 'live')
    .slice(0, limit);
}

export function getStandings(tournamentId?: string): (Standing & { team?: Team })[] {
  return dummyStandings
    .filter((s) => !tournamentId || s.tournament_id === tournamentId)
    .map((s) => ({ ...s, team: getTeamById(s.team_id) }))
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const gdA = a.goals_for - a.goals_against;
      const gdB = b.goals_for - b.goals_against;
      return gdB - gdA;
    });
}

export function getTopScorers(limit = 10): { player?: Player; team?: Team; goals: number }[] {
  const counts = new Map<string, number>();
  for (const g of dummyGoals) {
    if (g.is_own_goal || !g.player_id) continue;
    counts.set(g.player_id, (counts.get(g.player_id) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([playerId, goals]) => {
      const player = getPlayerById(playerId);
      return { player, team: getTeamById(player?.current_club ? dummyTeams.find((t) => t.name === player.current_club)?.id ?? null : null), goals };
    })
    .sort((a, b) => b.goals - a.goals)
    .slice(0, limit);
}

export function getTrials(): Trial[] {
  return [...dummyTrials].sort((a, b) => (a.trial_date ?? '').localeCompare(b.trial_date ?? ''));
}

export function getProducts(category?: string): Product[] {
  return dummyProducts.filter((p) => !category || category === 'all' || p.category === category);
}
