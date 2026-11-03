'use client';

import { useEffect, useMemo, useState } from 'react';
import { useI18n, formatPrice } from '@/lib/i18n';
import { getProducts } from '@/lib/data';
import { CATEGORIES } from '@/lib/supabase/types';
import type { Product } from '@/lib/supabase/types';
import { MessageCircle } from 'lucide-react';

export default function FanzonePage() {
  const { t } = useI18n();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate after mount
    setProducts(getProducts());
  }, []);

  const filtered = useMemo(
    () => products.filter((p) => category === 'all' || p.category === category),
    [products, category]
  );

  const categoryLabel = (value: string) => {
    if (value === 'merchandise') return t.fanzone_merchandise;
    if (value === 'tiket') return t.fanzone_ticket;
    if (value === 'kuliner') return t.fanzone_food;
    if (value === 'jasa') return t.fanzone_services;
    return value;
  };

  return (
    <div>
      <h1 className="section-title">{t.fanzone_title}</h1>
      <p className="section-subtitle">{t.fanzone_subtitle}</p>

      <div className="filter-pills">
        <button type="button" className={`filter-pill${category === 'all' ? ' active' : ''}`} onClick={() => setCategory('all')}>
          {t.fanzone_all}
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            type="button"
            className={`filter-pill${category === c.value ? ' active' : ''}`}
            onClick={() => setCategory(c.value)}
          >
            {categoryLabel(c.value)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state-icon">🛍️</div>
          <p>{t.fanzone_empty}</p>
        </div>
      ) : (
        <div className="grid-2">
          {filtered.map((p) => (
            <div key={p.id} className="product-card">
              <div className="product-card-img-placeholder">
                {p.category === 'merchandise' ? '👕' : p.category === 'tiket' ? '🎫' : p.category === 'kuliner' ? '🍽️' : '🛠️'}
              </div>
              <div style={{ padding: '0.75rem' }}>
                <span className="badge badge-slate mb-2">{categoryLabel(p.category)}</span>
                <h4 className="truncate-2">{p.name}</h4>
                <strong style={{ color: 'var(--color-gold-400)', display: 'block', marginTop: 4 }}>
                  {p.price != null ? formatPrice(p.price) : '-'}
                </strong>
                <div className="text-sm mt-1">{t.fanzone_seller}: {p.seller_name}</div>
                {!p.is_available && <span className="badge badge-red mt-2">{t.fanzone_unavailable}</span>}
                {p.is_available && p.whatsapp && (
                  <a
                    href={`https://wa.me/${p.whatsapp}?text=${encodeURIComponent(`Halo, saya tertarik dengan ${p.name}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary w-full mt-2"
                    style={{ fontSize: '0.8125rem', padding: '0.5rem' }}
                  >
                    <MessageCircle size={14} /> {t.fanzone_buy}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
