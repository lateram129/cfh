'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { getAdminSession, signOutAdmin, type AdminSession } from '@/lib/supabase/admin';
import { LogOut } from 'lucide-react';

const TABS = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/pemain', label: 'Pemain' },
  { href: '/admin/liga', label: 'Liga' },
  { href: '/admin/trial', label: 'Trial' },
  { href: '/admin/fanzone', label: 'Fanzone' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<AdminSession | null | undefined>(undefined);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) return;
    (async () => {
      const s = await getAdminSession();
      setSession(s);
      if (!s) router.replace('/admin/login');
    })();
  }, [isLoginPage, router]);

  if (isLoginPage) return <>{children}</>;

  if (session === undefined) {
    return (
      <div className="admin-shell">
        <div className="admin-container">
          <div className="skeleton" style={{ height: 200 }} />
        </div>
      </div>
    );
  }

  if (session === null) return null; // redirecting to /admin/login

  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <div className="header-logo">
          <span className="header-logo-icon">⚽</span>
          <span className="header-logo-text">{t.admin_title}</span>
        </div>
        <button
          type="button"
          className="btn btn-ghost"
          style={{ padding: '0.5rem 0.875rem', minHeight: 36 }}
          onClick={async () => { await signOutAdmin(); router.push('/admin/login'); }}
        >
          <LogOut size={14} /> {t.admin_logout}
        </button>
      </div>
      <div className="admin-container">
        <div className="tabs" style={{ overflowX: 'auto' }}>
          {TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`tab${pathname === tab.href ? ' active' : ''}`}
              style={{ whiteSpace: 'nowrap' }}
            >
              {tab.label}
            </Link>
          ))}
        </div>
        {children}
      </div>
    </div>
  );
}
