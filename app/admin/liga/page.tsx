'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Match, Team, Tournament, Database } from '@/lib/supabase/types';

type MatchUpdate = Database['public']['Tables']['matches']['Update'];

export default function AdminLigaPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [tournamentId, setTournamentId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const [newMatch, setNewMatch] = useState({ home_team_id: '', away_team_id: '', match_date: '', venue: '', match_week: '' });
  const [newTournament, setNewTournament] = useState({ name: '', season: '' });
  const [showNewTournament, setShowNewTournament] = useState(false);

  const load = async () => {
    setLoading(true);
    const supabase = createClient();
    const [t, tm] = await Promise.all([
      supabase.from('tournaments').select('*').order('start_date', { ascending: false }),
      supabase.from('teams').select('*').order('name'),
    ]);
    setTournaments(t.data ?? []);
    setTeams(tm.data ?? []);
    const activeId = tournamentId || t.data?.find((x) => x.status === 'ongoing')?.id || t.data?.[0]?.id || '';
    setTournamentId(activeId);
    if (activeId) {
      const { data: m } = await supabase.from('matches').select('*').eq('tournament_id', activeId).order('match_date');
      setMatches(m ?? []);
    }
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect -- load() fetches then sets state async, not a sync effect loop
  useEffect(() => { load(); }, []);

  const loadMatches = async (tid: string) => {
    const supabase = createClient();
    const { data } = await supabase.from('matches').select('*').eq('tournament_id', tid).order('match_date');
    setMatches(data ?? []);
  };

  const updateMatch = async (id: string, patch: MatchUpdate) => {
    const supabase = createClient();
    await supabase.from('matches').update(patch).eq('id', id);
    loadMatches(tournamentId);
  };

  const addMatch = async () => {
    if (!newMatch.home_team_id || !newMatch.away_team_id || !tournamentId) return;
    const supabase = createClient();
    await supabase.from('matches').insert({
      tournament_id: tournamentId,
      home_team_id: newMatch.home_team_id,
      away_team_id: newMatch.away_team_id,
      match_date: newMatch.match_date || null,
      venue: newMatch.venue || null,
      match_week: newMatch.match_week ? Number(newMatch.match_week) : null,
      status: 'scheduled',
    });
    setNewMatch({ home_team_id: '', away_team_id: '', match_date: '', venue: '', match_week: '' });
    loadMatches(tournamentId);
  };

  const addTournament = async () => {
    if (!newTournament.name.trim() || !newTournament.season.trim()) return;
    const supabase = createClient();
    const { data } = await supabase.from('tournaments').insert({
      name: newTournament.name.trim(), season: newTournament.season.trim(), status: 'ongoing',
    }).select().maybeSingle();
    setNewTournament({ name: '', season: '' });
    setShowNewTournament(false);
    await load();
    if (data) setTournamentId(data.id);
  };

  const teamName = (id: string | null) => teams.find((t) => t.id === id)?.name ?? '—';

  if (loading) return <div className="skeleton" style={{ height: 200 }} />;

  return (
    <div>
      <h1 className="section-title">Kelola Liga</h1>

      <div className="form-group">
        <label className="form-label">Turnamen</label>
        <select value={tournamentId} onChange={(e) => { setTournamentId(e.target.value); loadMatches(e.target.value); }}>
          {tournaments.map((t) => <option key={t.id} value={t.id}>{t.name} ({t.season})</option>)}
        </select>
      </div>

      {!showNewTournament ? (
        <button type="button" className="btn btn-ghost mb-3" onClick={() => setShowNewTournament(true)}>+ Turnamen baru</button>
      ) : (
        <div className="card mb-3">
          <div className="form-group">
            <label className="form-label">Nama turnamen</label>
            <input value={newTournament.name} onChange={(e) => setNewTournament((s) => ({ ...s, name: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Musim</label>
            <input placeholder="2024/2025" value={newTournament.season} onChange={(e) => setNewTournament((s) => ({ ...s, season: e.target.value }))} />
          </div>
          <div className="flex-row gap-2">
            <button type="button" className="btn btn-primary w-full" onClick={addTournament}>Simpan</button>
            <button type="button" className="btn btn-ghost w-full" onClick={() => setShowNewTournament(false)}>Batal</button>
          </div>
        </div>
      )}

      <h3 className="mb-2">Tambah pertandingan</h3>
      <div className="card mb-3">
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Tim kandang</label>
            <select value={newMatch.home_team_id} onChange={(e) => setNewMatch((s) => ({ ...s, home_team_id: e.target.value }))}>
              <option value="">—</option>
              {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Tim tandang</label>
            <select value={newMatch.away_team_id} onChange={(e) => setNewMatch((s) => ({ ...s, away_team_id: e.target.value }))}>
              <option value="">—</option>
              {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Tanggal & jam</label>
            <input type="datetime-local" value={newMatch.match_date} onChange={(e) => setNewMatch((s) => ({ ...s, match_date: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Pekan</label>
            <input type="number" value={newMatch.match_week} onChange={(e) => setNewMatch((s) => ({ ...s, match_week: e.target.value }))} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Venue</label>
          <input value={newMatch.venue} onChange={(e) => setNewMatch((s) => ({ ...s, venue: e.target.value }))} />
        </div>
        <button type="button" className="btn btn-primary w-full" onClick={addMatch}>Tambah Pertandingan</button>
      </div>

      <h3 className="mb-2">Pertandingan</h3>
      <div className="stack">
        {matches.map((m) => (
          <div key={m.id} className="card">
            <div className="flex-between mb-2">
              <strong>{teamName(m.home_team_id)} vs {teamName(m.away_team_id)}</strong>
              <select value={m.status} onChange={(e) => updateMatch(m.id, { status: e.target.value as Match['status'] })} style={{ width: 'auto', minHeight: 32, padding: '0.25rem 0.5rem' }}>
                <option value="scheduled">Scheduled</option>
                <option value="live">Live</option>
                <option value="finished">Finished</option>
                <option value="postponed">Postponed</option>
              </select>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Skor kandang</label>
                <input type="number" min={0} value={m.home_score} onChange={(e) => updateMatch(m.id, { home_score: Number(e.target.value) })} />
              </div>
              <div className="form-group">
                <label className="form-label">Skor tandang</label>
                <input type="number" min={0} value={m.away_score} onChange={(e) => updateMatch(m.id, { away_score: Number(e.target.value) })} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
