'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useI18n, calcAge } from '@/lib/i18n';
import { getApprovedPlayers } from '@/lib/data';
import { POSITIONS } from '@/lib/supabase/types';
import type { Player } from '@/lib/supabase/types';

export default function PemainPage() {
  const { t } = useI18n();
  const [players, setPlayers] = useState<Player[]>([]);
  const [position, setPosition] = useState<string>('all');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate after mount, see lib/data/submissions.ts
    setPlayers(getApprovedPlayers());
  }, []);

  const filtered = useMemo(
    () => players.filter((p) => position === 'all' || p.position === position),
    [players, position]
  );

  return (
    <div>
      <h1 className="section-title">{t.players_title}</h1>
      <p className="section-subtitle">{t.players_subtitle}</p>

      <div className="filter-pills">
        <button
          type="button"
          className={`filter-pill${position === 'all' ? ' active' : ''}`}
          onClick={() => setPosition('all')}
        >
          {t.players_filter_all}
        </button>
        {POSITIONS.map((pos) => (
          <button
            key={pos.value}
            type="button"
            className={`filter-pill${position === pos.value ? ' active' : ''}`}
            onClick={() => setPosition(pos.value)}
          >
            {pos.value}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state-icon">🔍</div>
          <h3>{t.players_empty_title}</h3>
          <p>{t.players_empty_desc}</p>
          <Link href="/pemain/daftar" className="btn btn-primary mt-2">{t.players_register_btn}</Link>
        </div>
      ) : (
        <div className="grid-2">
          {filtered.map((p) => (
            <Link key={p.id} href={`/pemain/${p.id}`} className="player-card">
              <div className="player-card-photo-placeholder">⚽</div>
              <div style={{ padding: '0.75rem' }}>
                <strong style={{ fontSize: '0.9rem' }}>{p.full_name}</strong>
                <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {POSITIONS.find((pos) => pos.value === p.position)?.labelId ?? p.position} · {calcAge(p.birth_date)} {t.years_old}
                </div>
                <div className="flex-row gap-2 mt-2">
                  <span className="badge badge-green">{(p.stats as { goals?: number })?.goals ?? 0} {t.players_goals}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Link href="/pemain/daftar" className="fab">
        + {t.players_register_btn.replace('+ ', '')}
      </Link>
    </div>
  );
}
