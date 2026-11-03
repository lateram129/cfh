'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { signInAdmin } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInAdmin(email, password);
      router.push('/admin');
    } catch {
      setError('Login gagal. Cek email/password, atau akun ini belum di-set sebagai admin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-shell">
      <div className="admin-container" style={{ maxWidth: 360, paddingTop: '20vh' }}>
        <div className="text-center mb-3">
          <div className="header-logo-icon" style={{ margin: '0 auto 0.75rem', width: 48, height: 48, fontSize: '1.5rem' }}>⚽</div>
          <h2>{t.admin_login_title}</h2>
          <p className="text-sm">Cilangkahan Football Hub</p>
        </div>

        {!isSupabaseConfigured && (
          <div className="alert alert-warning">
            Supabase belum terkonfigurasi di .env.local — login admin tidak bisa dipakai sampai itu diisi.
          </div>
        )}

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="card">
          <div className="form-group">
            <label className="form-label">{t.admin_email}</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
          </div>
          <div className="form-group">
            <label className="form-label">{t.admin_password}</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading || !isSupabaseConfigured}>
            {loading ? t.form_submitting : t.admin_login_btn}
          </button>
        </form>
      </div>
    </div>
  );
}
