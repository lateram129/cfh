'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { I18nProvider } from '@/lib/i18n';
import AppHeader from './AppHeader';
import BottomNav from './BottomNav';
import ServiceWorkerRegister from './ServiceWorkerRegister';

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  // /admin has its own header + layout (desktop-oriented dashboard, not the
  // 5-tab public bottom nav) — see app/admin/layout.tsx.
  if (isAdmin) {
    return <I18nProvider>{children}</I18nProvider>;
  }

  return (
    <I18nProvider>
      <ServiceWorkerRegister />
      <div className="app-shell">
        <AppHeader />
        <main className="page-content page-enter">{children}</main>
        <BottomNav />
      </div>
    </I18nProvider>
  );
}
