'use client';

import type { ReactNode } from 'react';
import { I18nProvider } from '@/lib/i18n';
import AppHeader from './AppHeader';
import BottomNav from './BottomNav';
import ServiceWorkerRegister from './ServiceWorkerRegister';

export default function AppShell({ children }: { children: ReactNode }) {
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
