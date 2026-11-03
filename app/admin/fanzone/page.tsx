'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CATEGORIES } from '@/lib/supabase/types';
import type { Product } from '@/lib/supabase/types';
import { formatPrice } from '@/lib/i18n';
import { Trash2 } from 'lucide-react';

const EMPTY = { name: '', description: '', price: '', category: 'merchandise', seller_name: '', contact: '', whatsapp: '' };

export default function AdminFanzonePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);

  const load = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data ?? []);
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect -- load() fetches then sets state async, not a sync effect loop
  useEffect(() => { load(); }, []);

  const addProduct = async () => {
    if (!form.name.trim()) return;
    const supabase = createClient();
    await supabase.from('products').insert({
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: form.price ? Number(form.price) : null,
      category: form.category,
      seller_name: form.seller_name.trim() || null,
      contact: form.contact.trim() || null,
      whatsapp: form.whatsapp.trim() || null,
      is_available: true,
    });
    setForm(EMPTY);
    load();
  };

  const toggleAvailable = async (p: Product) => {
    const supabase = createClient();
    await supabase.from('products').update({ is_available: !p.is_available }).eq('id', p.id);
    load();
  };

  const remove = async (id: string) => {
    const supabase = createClient();
    await supabase.from('products').delete().eq('id', id);
    load();
  };

  if (loading) return <div className="skeleton" style={{ height: 200 }} />;

  return (
    <div>
      <h1 className="section-title">Kelola Fanzone & UMKM</h1>

      <div className="card mb-3">
        <h3 className="mb-2">Tambah produk</h3>
        <div className="form-group">
          <label className="form-label">Nama produk</label>
          <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="form-label">Deskripsi</label>
          <textarea rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
        </div>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Harga (Rp)</label>
            <input type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Kategori</label>
            <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.labelId}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Nama penjual</label>
            <input value={form.seller_name} onChange={(e) => setForm((f) => ({ ...f, seller_name: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">WhatsApp (62xxx)</label>
            <input value={form.whatsapp} onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))} />
          </div>
        </div>
        <button type="button" className="btn btn-primary w-full" onClick={addProduct}>Tambah Produk</button>
      </div>

      <div className="stack">
        {products.map((p) => (
          <div key={p.id} className="card flex-between">
            <div>
              <strong>{p.name}</strong>
              <div className="text-sm">{p.price != null ? formatPrice(p.price) : '-'} · {p.seller_name}</div>
              <span className={`badge ${p.is_available ? 'badge-green' : 'badge-red'} mt-1`}>{p.is_available ? 'Tersedia' : 'Habis'}</span>
            </div>
            <div className="flex-row gap-2">
              <button type="button" className="btn btn-ghost" style={{ minHeight: 36, padding: '0.5rem 0.75rem' }} onClick={() => toggleAvailable(p)}>
                {p.is_available ? 'Sold out' : 'Tersedia'}
              </button>
              <button type="button" className="btn btn-danger" style={{ minHeight: 36, padding: '0.5rem 0.75rem' }} onClick={() => remove(p.id)}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
