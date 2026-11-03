'use client';

import { useEffect, useState } from 'react';
import { useI18n, formatDate } from '@/lib/i18n';
import { getTrials } from '@/lib/data';
import type { Trial } from '@/lib/supabase/types';
import { MapPin, Phone, Calendar } from 'lucide-react';

export default function TrialPage() {
  const { t, lang } = useI18n();
  const [trials, setTrials] = useState<Trial[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate after mount
    setTrials(getTrials());
  }, []);

  return (
    <div>
      <h1 className="section-title">{t.trial_title}</h1>
      <p className="section-subtitle">{t.trial_subtitle}</p>

      {trials.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state-icon">📋</div>
          <h3>{t.trial_empty_title}</h3>
          <p>{t.trial_empty_desc}</p>
        </div>
      ) : (
        <div className="stack">
          {trials.map((tr) => (
            <div key={tr.id} className="trial-card">
              <div className="flex-between mb-2">
                <span className="badge badge-green">{tr.club_name}</span>
                <span className={`badge ${tr.status === 'open' ? 'badge-gold' : 'badge-slate'}`}>
                  {tr.status === 'open' ? t.trial_open : t.trial_closed}
                </span>
              </div>
              <h3>{tr.title}</h3>
              {tr.description && <p className="text-sm mt-1">{tr.description}</p>}

              <div className="divider" />

              {tr.trial_date && (
                <div className="info-row">
                  <span className="info-label"><Calendar size={14} style={{ display: 'inline', marginRight: 4 }} />{t.trial_date}</span>
                  <span className="info-value">{formatDate(tr.trial_date, lang)}</span>
                </div>
              )}
              {tr.location && (
                <div className="info-row">
                  <span className="info-label"><MapPin size={14} style={{ display: 'inline', marginRight: 4 }} />{t.trial_location}</span>
                  <span className="info-value">{tr.location}</span>
                </div>
              )}
              {(tr.age_min || tr.age_max) && (
                <div className="info-row">
                  <span className="info-label">{t.trial_age}</span>
                  <span className="info-value">{tr.age_min}-{tr.age_max} {t.years_old}</span>
                </div>
              )}
              {tr.positions && tr.positions.length > 0 && (
                <div className="info-row">
                  <span className="info-label">{t.trial_positions}</span>
                  <span className="info-value">{tr.positions.join(', ')}</span>
                </div>
              )}
              {tr.requirements && (
                <div className="info-row">
                  <span className="info-label">{t.trial_requirements}</span>
                  <span className="info-value">{tr.requirements}</span>
                </div>
              )}

              {tr.contact && (
                <a href={`tel:${tr.contact.replace(/[^0-9+]/g, '')}`} className="btn btn-primary w-full mt-3">
                  <Phone size={16} /> {t.trial_contact}: {tr.contact}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
