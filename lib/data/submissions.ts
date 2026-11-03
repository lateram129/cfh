'use client';

// Local-only persistence for the player registration form while there is
// no real backend yet. Lives in the visitor's own browser (localStorage),
// so it is NOT shared between devices — purely so today's demo feels end
// to end. Once Supabase is wired up, the registration form should insert
// into `players` instead and this file can be deleted.
import type { Player } from '../supabase/types';

const KEY = 'cfh_local_players_v1';

export function getLocalPlayers(): Player[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Player[]) : [];
  } catch {
    return [];
  }
}

export function addLocalPlayer(player: Player) {
  if (typeof window === 'undefined') return;
  try {
    const current = getLocalPlayers();
    window.localStorage.setItem(KEY, JSON.stringify([player, ...current]));
  } catch {
    /* storage unavailable (private mode, quota) — ignore */
  }
}
