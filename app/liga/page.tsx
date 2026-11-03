'use client';

import { useEffect, useState } from 'react';
import { useI18n, formatDateTime } from '@/lib/i18n';
import { getActiveTournament, getMatches, getStandings, getTopScorers, getTeamById } from '@/lib/data';
import type { Match, Standing, Team, Tournament } from '@/lib/supabase/types';

type Tab = 'schedule' | 'standings' | 'scorers';

export default function LigaPage() {
  const { t, lang } = useI18n();
  const [tab, setTab] = useState<Tab>('schedule');
  const [tournament, setTournament] = useState<Tournament | undefined>(undefined);
  const [matches, setMatches] = useState<Match[]>([]);
  const [standings, setStandings] = useState<(Standing & { team?: Team })[]>([]);
  const [scorers, setScorers] = useState<ReturnType<typeof getTopScorers>>([]);

  useEffect(() => {
    const tourn = getActiveTournament();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTournament(tourn);
    setMatches(getMatches(tourn?.id));
    setStandings(getStandings(tourn?.id));
    setScorers(getTopScorers());
  }, []);

  const statusLabel = (s: Match['status']) =>
    s === 'live' ? t.league_status_live : s === 'finished' ? t.league_status_finished : s === 'postponed' ? t.league_status_postponed : t.league_status_scheduled;

  return (
    <div>
      <h1 className="section-title">{t.league_title}</h1>
      <p className="section-subtitle">{t.league_subtitle}</p>

      {tournament && (
        <div className="card mb-3">
          <div className="flex-between">
            <strong>{tournament.name}</strong>
            <span className="badge badge-green">{tournament.season}</span>
          </div>
          {tournament.prize && <p className="text-sm mt-1">🏆 {tournament.prize}</p>}
        </div>
      )}

      <div className="tabs">
        <button type="button" className={`tab${tab === 'schedule' ? ' active' : ''}`} onClick={() => setTab('schedule')}>
          {t.league_tab_schedule}
        </button>
        <button type="button" className={`tab${tab === 'standings' ? ' active' : ''}`} onClick={() => setTab('standings')}>
          {t.league_tab_standings}
        </button>
        <button type="button" className={`tab${tab === 'scorers' ? ' active' : ''}`} onClick={() => setTab('scorers')}>
          {t.league_tab_scorers}
        </button>
      </div>

      {tab === 'schedule' && (
        matches.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-state-icon">🗓️</div>
            <p>{t.league_empty}</p>
          </div>
        ) : (
          <div className="stack">
            {matches.map((m) => {
              const home = getTeamById(m.home_team_id);
              const away = getTeamById(m.away_team_id);
              return (
                <div key={m.id} className="match-card">
                  <div className="flex-between mb-2">
                    <span className="badge badge-slate">{t.league_week} {m.match_week ?? '-'}</span>
                    <span className={`badge ${m.status === 'live' ? 'badge-live' : 'badge-slate'}`}>{statusLabel(m.status)}</span>
                  </div>
                  <div className="match-teams">
                    <div className="match-team"><strong>{home?.name ?? '—'}</strong></div>
                    <div className="match-score">
                      {m.status === 'finished' || m.status === 'live' ? `${m.home_score} - ${m.away_score}` : t.league_match_vs}
                    </div>
                    <div className="match-team"><strong>{away?.name ?? '—'}</strong></div>
                  </div>
                  <div className="divider" />
                  <div className="text-sm text-center">
                    {m.match_date ? formatDateTime(m.match_date, lang) : '-'}{m.venue ? ` · ${m.venue}` : ''}
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {tab === 'standings' && (
        standings.length === 0 ? (
          <div className="empty-state card"><p>{t.league_empty}</p></div>
        ) : (
          <table className="standings-table">
            <thead>
              <tr>
                <th>{t.league_standings_team}</th>
                <th>{t.league_standings_p}</th>
                <th>{t.league_standings_w}</th>
                <th>{t.league_standings_d}</th>
                <th>{t.league_standings_l}</th>
                <th>{t.league_standings_gd}</th>
                <th>{t.league_standings_pts}</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((s, i) => (
                <tr key={s.id} className={i === 0 ? 'leader' : ''}>
                  <td>{s.team?.name ?? '—'}</td>
                  <td>{s.played}</td>
                  <td>{s.won}</td>
                  <td>{s.drawn}</td>
                  <td>{s.lost}</td>
                  <td>{s.goals_for - s.goals_against}</td>
                  <td><strong>{s.points}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}

      {tab === 'scorers' && (
        scorers.length === 0 ? (
          <div className="empty-state card"><p>{t.league_empty}</p></div>
        ) : (
          <div className="stack">
            {scorers.map((row, i) => (
              <div key={row.player?.id ?? i} className="card flex-between">
                <div className="flex-row gap-2">
                  <span className="badge badge-gold">#{i + 1}</span>
                  <div>
                    <strong>{row.player?.full_name ?? 'Unknown'}</strong>
                    <div className="text-sm">{row.player?.current_club ?? '-'}</div>
                  </div>
                </div>
                <span className="badge badge-green">{row.goals} {t.players_goals}</span>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
