'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useI18n, calcAge, formatDate } from '@/lib/i18n';
import { getPlayerById } from '@/lib/data';
import { POSITIONS } from '@/lib/supabase/types';
import type { Player } from '@/lib/supabase/types';
import { ArrowLeft } from 'lucide-react';

export default function PlayerDetailPage() {
  const { t, lang } = useI18n();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [player, setPlayer] = useState<Player | null | undefined>(undefined);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate after mount, see lib/data/submissions.ts
    setPlayer(getPlayerById(params.id) ?? null);
  }, [params.id]);

  if (player === undefined) {
    return <div className="skeleton" style={{ height: 240 }} />;
  }

  if (player === null) {
    return (
      <div className="empty-state card">
        <div className="empty-state-icon">❓</div>
        <p>{t.players_empty_title}</p>
      </div>
    );
  }

  const stats = player.stats as { goals?: number; assists?: number; appearances?: number; clean_sheets?: number };
  const posLabel = POSITIONS.find((p) => p.value === player.position)?.labelId ?? player.position;

  return (
    <div>
      <button type="button" className="btn btn-ghost mb-3" onClick={() => router.back()}>
        <ArrowLeft size={16} /> {t.back}
      </button>

      <div className="profile-hero">
        <div className="profile-photo-lg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', background: 'var(--bg-surface-2)' }}>
          ⚽
        </div>
        <h2>{player.full_name}{player.nickname ? ` "${player.nickname}"` : ''}</h2>
        <span className="position-badge">{posLabel}</span>
        {player.current_club && <p className="text-sm">{t.players_card_club}: {player.current_club}</p>}
      </div>

      <div className="stat-grid">
        <div className="stat-box">
          <div className="stat-box-value">{stats.goals ?? 0}</div>
          <div className="stat-box-label">{t.players_goals}</div>
        </div>
        <div className="stat-box">
          <div className="stat-box-value">{stats.assists ?? 0}</div>
          <div className="stat-box-label">{t.players_assists}</div>
        </div>
        <div className="stat-box">
          <div className="stat-box-value">{stats.appearances ?? 0}</div>
          <div className="stat-box-label">{t.players_matches}</div>
        </div>
      </div>

      <div className="card">
        <div className="info-row">
          <span className="info-label">{t.form_birthdate}</span>
          <span className="info-value">{formatDate(player.birth_date, lang)} ({calcAge(player.birth_date)} {t.years_old})</span>
        </div>
        {player.birth_place && (
          <div className="info-row">
            <span className="info-label">{t.form_birthplace}</span>
            <span className="info-value">{player.birth_place}</span>
          </div>
        )}
        {player.height_cm && (
          <div className="info-row">
            <span className="info-label">{t.form_height}</span>
            <span className="info-value">{player.height_cm} cm</span>
          </div>
        )}
        {player.weight_kg && (
          <div className="info-row">
            <span className="info-label">{t.form_weight}</span>
            <span className="info-value">{player.weight_kg} kg</span>
          </div>
        )}
        <div className="info-row">
          <span className="info-label">{t.form_foot}</span>
          <span className="info-value">
            {player.dominant_foot === 'kanan' ? t.form_foot_right : player.dominant_foot === 'kiri' ? t.form_foot_left : t.form_foot_both}
          </span>
        </div>
        {player.status === 'pending' && (
          <div className="info-row">
            <span className="badge badge-gold">{t.admin_pending}</span>
          </div>
        )}
      </div>

      {player.video_url && (
        <a href={player.video_url} target="_blank" rel="noreferrer" className="btn btn-primary w-full mt-3">
          ▶ Video Highlight
        </a>
      )}
    </div>
  );
}
