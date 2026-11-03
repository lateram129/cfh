'use client';

import { useEffect, useState } from 'react';
import { useI18n, calcAge } from '@/lib/i18n';
import { createClient } from '@/lib/supabase/client';
import { POSITIONS } from '@/lib/supabase/types';
import type { Player } from '@/lib/supabase/types';

export default function AdminPemainPage() {
  const { t } = useI18n();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const load = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from('players').select('*').order('created_at', { ascending: false });
    setPlayers(data ?? []);
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect -- load() fetches then sets state async, not a sync effect loop
  useEffect(() => { load(); }, []);

  const approve = async (id: string) => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    await supabase.from('players').update({
      status: 'approved',
      approved_by: session?.user.id ?? null,
      approved_at: new Date().toISOString(),
    }).eq('id', id);
    load();
  };

  const reject = async (id: string) => {
    const supabase = createClient();
    await supabase.from('players').update({
      status: 'rejected',
      rejection_reason: rejectReason.trim() || null,
    }).eq('id', id);
    setRejectingId(null);
    setRejectReason('');
    load();
  };

  if (loading) return <div className="skeleton" style={{ height: 200 }} />;

  const pending = players.filter((p) => p.status === 'pending');
  const others = players.filter((p) => p.status !== 'pending');

  return (
    <div>
      <h1 className="section-title">{t.admin_pending}</h1>

      {pending.length === 0 ? (
        <div className="empty-state card mb-3"><p>Tidak ada pendaftaran yang menunggu.</p></div>
      ) : (
        <div className="stack mb-3">
          {pending.map((p) => (
            <div key={p.id} className="card">
              <div className="flex-between mb-2">
                <strong>{p.full_name}</strong>
                <span className="badge badge-gold">{t.admin_pending}</span>
              </div>
              <div className="text-sm mb-2">
                {POSITIONS.find((pos) => pos.value === p.position)?.labelId ?? p.position} · {calcAge(p.birth_date)} {t.years_old}
                {p.phone ? ` · ${p.phone}` : ''}{p.current_club ? ` · ${p.current_club}` : ''}
              </div>

              {rejectingId === p.id ? (
                <div>
                  <input
                    placeholder={t.admin_reject_reason}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="mb-2"
                  />
                  <div className="flex-row gap-2">
                    <button type="button" className="btn btn-danger w-full" onClick={() => reject(p.id)}>{t.admin_reject}</button>
                    <button type="button" className="btn btn-ghost w-full" onClick={() => setRejectingId(null)}>{t.cancel}</button>
                  </div>
                </div>
              ) : (
                <div className="flex-row gap-2">
                  <button type="button" className="btn btn-primary w-full" onClick={() => approve(p.id)}>{t.admin_approve}</button>
                  <button type="button" className="btn btn-ghost w-full" onClick={() => setRejectingId(p.id)}>{t.admin_reject}</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <h3 className="mb-2">Riwayat</h3>
      <table className="admin-table">
        <thead>
          <tr><th>Nama</th><th>Posisi</th><th>Status</th></tr>
        </thead>
        <tbody>
          {others.map((p) => (
            <tr key={p.id}>
              <td>{p.full_name}</td>
              <td>{p.position}</td>
              <td>
                <span className={`badge ${p.status === 'approved' ? 'badge-green' : 'badge-red'}`}>
                  {p.status === 'approved' ? t.admin_approved : t.admin_rejected}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
