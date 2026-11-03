'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function AdminOverviewPage() {
  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const [tournamentCount, setTournamentCount] = useState<number | null>(null);
  const [trialCount, setTrialCount] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const [players, tournaments, trials] = await Promise.all([
        supabase.from('players').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('tournaments').select('id', { count: 'exact', head: true }).eq('status', 'ongoing'),
        supabase.from('trials').select('id', { count: 'exact', head: true }).eq('status', 'open'),
      ]);
      setPendingCount(players.count ?? 0);
      setTournamentCount(tournaments.count ?? 0);
      setTrialCount(trials.count ?? 0);
    })();
  }, []);

  return (
    <div>
      <h1 className="section-title">Overview</h1>
      <div className="grid-3 mb-3">
        <div className="stat-chip">
          <div className="stat-chip-value">{pendingCount ?? '—'}</div>
          <div className="stat-chip-label">Menunggu Verifikasi</div>
        </div>
        <div className="stat-chip">
          <div className="stat-chip-value">{tournamentCount ?? '—'}</div>
          <div className="stat-chip-label">Turnamen Aktif</div>
        </div>
        <div className="stat-chip">
          <div className="stat-chip-value">{trialCount ?? '—'}</div>
          <div className="stat-chip-label">Trial Dibuka</div>
        </div>
      </div>

      {pendingCount !== null && pendingCount > 0 && (
        <div className="alert alert-warning">
          Ada {pendingCount} pendaftaran pemain menunggu verifikasi.{' '}
          <Link href="/admin/pemain" style={{ textDecoration: 'underline' }}>Tinjau sekarang →</Link>
        </div>
      )}

      <div className="stack">
        <Link href="/admin/pemain" className="card flex-between">
          <span>Verifikasi pendaftaran pemain</span> <span>→</span>
        </Link>
        <Link href="/admin/liga" className="card flex-between">
          <span>Kelola pertandingan & skor</span> <span>→</span>
        </Link>
        <Link href="/admin/trial" className="card flex-between">
          <span>Kelola open trial</span> <span>→</span>
        </Link>
        <Link href="/admin/fanzone" className="card flex-between">
          <span>Kelola produk Fanzone/UMKM</span> <span>→</span>
        </Link>
      </div>
    </div>
  );
}
