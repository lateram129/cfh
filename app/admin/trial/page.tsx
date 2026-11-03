'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { POSITIONS } from '@/lib/supabase/types';
import type { Trial } from '@/lib/supabase/types';
import { Trash2 } from 'lucide-react';

const EMPTY = {
  title: '', club_name: '', description: '', requirements: '', trial_date: '', location: '', contact: '',
  age_min: '', age_max: '', positions: [] as string[],
};

export default function AdminTrialPage() {
  const [trials, setTrials] = useState<Trial[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);

  const load = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from('trials').select('*').order('trial_date');
    setTrials(data ?? []);
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect -- load() fetches then sets state async, not a sync effect loop
  useEffect(() => { load(); }, []);

  const togglePosition = (pos: string) =>
    setForm((f) => ({ ...f, positions: f.positions.includes(pos) ? f.positions.filter((p) => p !== pos) : [...f.positions, pos] }));

  const addTrial = async () => {
    if (!form.title.trim() || !form.club_name.trim()) return;
    const supabase = createClient();
    await supabase.from('trials').insert({
      title: form.title.trim(),
      club_name: form.club_name.trim(),
      description: form.description.trim() || null,
      requirements: form.requirements.trim() || null,
      trial_date: form.trial_date || null,
      location: form.location.trim() || null,
      contact: form.contact.trim() || null,
      age_min: form.age_min ? Number(form.age_min) : null,
      age_max: form.age_max ? Number(form.age_max) : null,
      positions: form.positions.length ? form.positions : null,
      status: 'open',
    });
    setForm(EMPTY);
    load();
  };

  const toggleStatus = async (t: Trial) => {
    const supabase = createClient();
    await supabase.from('trials').update({ status: t.status === 'open' ? 'closed' : 'open' }).eq('id', t.id);
    load();
  };

  const remove = async (id: string) => {
    const supabase = createClient();
    await supabase.from('trials').delete().eq('id', id);
    load();
  };

  if (loading) return <div className="skeleton" style={{ height: 200 }} />;

  return (
    <div>
      <h1 className="section-title">Kelola Trial</h1>

      <div className="card mb-3">
        <h3 className="mb-2">Tambah open trial</h3>
        <div className="form-group">
          <label className="form-label">Judul</label>
          <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="form-label">Nama klub</label>
          <input value={form.club_name} onChange={(e) => setForm((f) => ({ ...f, club_name: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="form-label">Deskripsi</label>
          <textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="form-label">Persyaratan</label>
          <textarea rows={2} value={form.requirements} onChange={(e) => setForm((f) => ({ ...f, requirements: e.target.value }))} />
        </div>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Tanggal trial</label>
            <input type="date" value={form.trial_date} onChange={(e) => setForm((f) => ({ ...f, trial_date: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Lokasi</label>
            <input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Kontak</label>
            <input value={form.contact} onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Usia (min-max)</label>
            <div className="flex-row gap-2">
              <input type="number" value={form.age_min} onChange={(e) => setForm((f) => ({ ...f, age_min: e.target.value }))} />
              <input type="number" value={form.age_max} onChange={(e) => setForm((f) => ({ ...f, age_max: e.target.value }))} />
            </div>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Posisi dibutuhkan</label>
          <div className="filter-pills">
            {POSITIONS.map((p) => (
              <button key={p.value} type="button" className={`filter-pill${form.positions.includes(p.value) ? ' active' : ''}`} onClick={() => togglePosition(p.value)}>
                {p.value}
              </button>
            ))}
          </div>
        </div>
        <button type="button" className="btn btn-primary w-full" onClick={addTrial}>Tambah Trial</button>
      </div>

      <div className="stack">
        {trials.map((tr) => (
          <div key={tr.id} className="card flex-between">
            <div>
              <strong>{tr.title}</strong>
              <div className="text-sm">{tr.club_name}</div>
              <span className={`badge ${tr.status === 'open' ? 'badge-gold' : 'badge-slate'} mt-1`}>{tr.status}</span>
            </div>
            <div className="flex-row gap-2">
              <button type="button" className="btn btn-ghost" style={{ minHeight: 36, padding: '0.5rem 0.75rem' }} onClick={() => toggleStatus(tr)}>
                {tr.status === 'open' ? 'Tutup' : 'Buka'}
              </button>
              <button type="button" className="btn btn-danger" style={{ minHeight: 36, padding: '0.5rem 0.75rem' }} onClick={() => remove(tr.id)}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
