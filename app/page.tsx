'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useI18n, calcAge, formatDateTime } from '@/lib/i18n';
import { getApprovedPlayers, getTeams, getMatches, getUpcomingMatches } from '@/lib/data';
import type { Player, Match, Team } from '@/lib/supabase/types';
import { POSITIONS } from '@/lib/supabase/types';

export default function Home() {
  const { t, lang } = useI18n();
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [totalMatches, setTotalMatches] = useState(0);

  useEffect(() => {
    (async () => {
      const [approvedPlayers, upcoming, allTeams, allMatches] = await Promise.all([
        getApprovedPlayers(), getUpcomingMatches(2), getTeams(), getMatches(),
      ]);
      setPlayers(approvedPlayers);
      setMatches(upcoming);
      setTeams(allTeams);
      setTotalMatches(allMatches.length);
    })();
  }, []);

  const teamById = new Map(teams.map((team) => [team.id, team]));
  const latest = players.slice(0, 4);

  return (
    <div>
      <section className="hero">
        <div className="hero-eyebrow">⚽ Calon DOB Cilangkahan</div>
        <h1 className="hero-title">
          {t.home_hero_title} <span className="accent">{t.home_hero_subtitle}</span>
        </h1>
        <p className="hero-desc">{t.home_hero_desc}</p>
        <div className="hero-actions">
          <Link href="/pemain/daftar" className="btn btn-cta">+ {t.home_cta_register}</Link>
          <Link href="/pemain" className="btn btn-ghost">{t.home_cta_scout}</Link>
        </div>
      </section>

      <section className="section grid-3">
        <div className="stat-chip">
          <div className="stat-chip-value">{players.length}</div>
          <div className="stat-chip-label">{t.home_stats_players}</div>
        </div>
        <div className="stat-chip">
          <div className="stat-chip-value">{teams.length}</div>
          <div className="stat-chip-label">{t.home_stats_teams}</div>
        </div>
        <div className="stat-chip">
          <div className="stat-chip-value">{totalMatches}</div>
          <div className="stat-chip-label">{t.home_stats_matches}</div>
        </div>
      </section>

      <section className="section">
        <div className="flex-between mb-2">
          <h2 className="section-title" style={{ marginBottom: 0 }}>{t.home_today_matches}</h2>
          <Link href="/liga" className="text-sm" style={{ color: 'var(--accent-primary)' }}>{t.see_all}</Link>
        </div>
        {matches.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-state-icon">🗓️</div>
            <p>{t.home_no_matches}</p>
          </div>
        ) : (
          <div className="stack">
            {matches.map((m) => {
              const home = m.home_team_id ? teamById.get(m.home_team_id) : undefined;
              const away = m.away_team_id ? teamById.get(m.away_team_id) : undefined;
              return (
                <div key={m.id} className="match-card">
                  <div className="flex-between mb-2">
                    <span className="badge badge-slate">{m.match_date ? formatDateTime(m.match_date, lang) : '-'}</span>
                    <span className={`badge ${m.status === 'live' ? 'badge-live' : 'badge-slate'}`}>
                      {m.status === 'live' ? t.league_status_live : t.league_status_scheduled}
                    </span>
                  </div>
                  <div className="match-teams">
                    <div className="match-team"><strong>{home?.name ?? '—'}</strong></div>
                    <div className="match-score">{t.league_match_vs}</div>
                    <div className="match-team"><strong>{away?.name ?? '—'}</strong></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="section">
        <div className="flex-between mb-2">
          <h2 className="section-title" style={{ marginBottom: 0 }}>{t.home_latest_players}</h2>
          <Link href="/pemain" className="text-sm" style={{ color: 'var(--accent-primary)' }}>{t.see_all}</Link>
        </div>
        {latest.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-state-icon">👤</div>
            <p>{t.home_no_players}</p>
          </div>
        ) : (
          <div className="grid-2">
            {latest.map((p) => (
              <Link key={p.id} href={`/pemain/${p.id}`} className="player-card">
                <div className="player-card-photo-placeholder">⚽</div>
                <div style={{ padding: '0.75rem' }}>
                  <strong style={{ fontSize: '0.9rem' }}>{p.full_name}</strong>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)', marginTop: 2 }}>
                    {POSITIONS.find((pos) => pos.value === p.position)?.labelId ?? p.position} · {calcAge(p.birth_date)} {t.years_old}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
