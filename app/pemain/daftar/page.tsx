'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { POSITIONS } from '@/lib/supabase/types';
import { registerPlayer } from '@/lib/data';

type FormState = {
  full_name: string;
  nickname: string;
  birth_date: string;
  birth_place: string;
  address: string;
  phone: string;
  height_cm: string;
  weight_kg: string;
  position: string;
  dominant_foot: 'kanan' | 'kiri' | 'kedua';
  current_club: string;
  goals: string;
  assists: string;
  appearances: string;
  clean_sheets: string;
  video_url: string;
};

const EMPTY: FormState = {
  full_name: '', nickname: '', birth_date: '', birth_place: '', address: '', phone: '',
  height_cm: '', weight_kg: '', position: '', dominant_foot: 'kanan', current_club: '',
  goals: '0', assists: '0', appearances: '0', clean_sheets: '0', video_url: '',
};

const TOTAL_STEPS = 4;

export default function DaftarTalentaPage() {
  const { t } = useI18n();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const canNext = () => {
    if (step === 1) return form.full_name.trim() && form.birth_date && form.phone.trim();
    if (step === 2) return form.position;
    return true;
  };

  const handleSubmit = async () => {
    setError('');
    setSubmitting(true);
    try {
      await registerPlayer({
        full_name: form.full_name.trim(),
        nickname: form.nickname.trim() || null,
        birth_date: form.birth_date,
        birth_place: form.birth_place.trim() || null,
        height_cm: form.height_cm ? Number(form.height_cm) : null,
        weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
        position: form.position,
        dominant_foot: form.dominant_foot,
        current_club: form.current_club.trim() || null,
        address: form.address.trim() || null,
        phone: form.phone.trim() || null,
        video_url: form.video_url.trim() || null,
        stats: {
          goals: Number(form.goals) || 0,
          assists: Number(form.assists) || 0,
          appearances: Number(form.appearances) || 0,
          clean_sheets: Number(form.clean_sheets) || 0,
        },
      });
      setDone(true);
    } catch {
      setError(t.form_error);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="success-container">
        <div className="success-icon">✅</div>
        <h2>{t.form_success_title}</h2>
        <p>{t.form_success_desc}</p>
        <Link href="/pemain" className="btn btn-primary mt-3">{t.see_all}</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="section-title">{t.form_title}</h1>
      <p className="section-subtitle">{t.form_subtitle}</p>

      <div className="step-indicator">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
          <div key={s} className={`step-dot${s === step ? ' active' : s < step ? ' done' : ''}`} />
        ))}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {step === 1 && (
        <div className="card">
          <h3 className="mb-3">{t.form_step1}</h3>
          <div className="form-group">
            <label className="form-label">{t.form_name}<span className="required">*</span></label>
            <input value={form.full_name} onChange={(e) => update('full_name', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">{t.form_nickname}</label>
            <input value={form.nickname} onChange={(e) => update('nickname', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">{t.form_birthdate}<span className="required">*</span></label>
            <input type="date" value={form.birth_date} onChange={(e) => update('birth_date', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">{t.form_birthplace}</label>
            <input value={form.birth_place} onChange={(e) => update('birth_place', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">{t.form_address}</label>
            <input value={form.address} onChange={(e) => update('address', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">{t.form_phone}<span className="required">*</span></label>
            <input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="08xx-xxxx-xxxx" required />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card">
          <h3 className="mb-3">{t.form_step2}</h3>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">{t.form_height}</label>
              <input type="number" value={form.height_cm} onChange={(e) => update('height_cm', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">{t.form_weight}</label>
              <input type="number" value={form.weight_kg} onChange={(e) => update('weight_kg', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{t.form_position}<span className="required">*</span></label>
            <select value={form.position} onChange={(e) => update('position', e.target.value)} required>
              <option value="">—</option>
              {POSITIONS.map((p) => (
                <option key={p.value} value={p.value}>{p.labelId} ({p.value})</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">{t.form_foot}</label>
            <select value={form.dominant_foot} onChange={(e) => update('dominant_foot', e.target.value as FormState['dominant_foot'])}>
              <option value="kanan">{t.form_foot_right}</option>
              <option value="kiri">{t.form_foot_left}</option>
              <option value="kedua">{t.form_foot_both}</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">{t.form_club}</label>
            <input value={form.current_club} onChange={(e) => update('current_club', e.target.value)} />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="card">
          <h3 className="mb-3">{t.form_step3}</h3>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">{t.form_goals}</label>
              <input type="number" min={0} value={form.goals} onChange={(e) => update('goals', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">{t.form_assists}</label>
              <input type="number" min={0} value={form.assists} onChange={(e) => update('assists', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">{t.form_appearances}</label>
              <input type="number" min={0} value={form.appearances} onChange={(e) => update('appearances', e.target.value)} />
            </div>
            {form.position === 'GK' && (
              <div className="form-group">
                <label className="form-label">{t.form_clean_sheets}</label>
                <input type="number" min={0} value={form.clean_sheets} onChange={(e) => update('clean_sheets', e.target.value)} />
              </div>
            )}
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="card">
          <h3 className="mb-3">{t.form_step4}</h3>
          <div className="alert alert-warning">
            Upload foto & video akan aktif setelah penyimpanan Supabase Storage tersambung. Untuk sekarang, isi link video (YouTube/Instagram) jika ada.
          </div>
          <div className="form-group">
            <label className="form-label">{t.form_video}</label>
            <input value={form.video_url} onChange={(e) => update('video_url', e.target.value)} placeholder="https://" />
          </div>
        </div>
      )}

      <div className="flex-between gap-3 mt-3">
        {step > 1 ? (
          <button type="button" className="btn btn-ghost w-full" onClick={() => setStep((s) => s - 1)}>
            {t.form_back}
          </button>
        ) : (
          <Link href="/pemain" className="btn btn-ghost w-full">{t.cancel}</Link>
        )}
        {step < TOTAL_STEPS ? (
          <button type="button" className="btn btn-primary w-full" disabled={!canNext()} onClick={() => setStep((s) => s + 1)}>
            {t.form_next}
          </button>
        ) : (
          <button type="button" className="btn btn-cta w-full" disabled={submitting} onClick={handleSubmit}>
            {submitting ? t.form_submitting : t.form_submit}
          </button>
        )}
      </div>
    </div>
  );
}
