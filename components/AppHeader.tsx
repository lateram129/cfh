'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

export default function AppHeader() {
  const { lang, toggle } = useI18n();

  return (
    <header className="app-header">
      <Link href="/" className="header-logo">
        <span className="header-logo-icon">⚽</span>
        <span>
          <span className="header-logo-text" style={{ display: 'block' }}>Cilangkahan FH</span>
          <span className="header-logo-sub">Football Ecosystem</span>
        </span>
      </Link>
      <button type="button" className="lang-toggle" onClick={toggle} aria-label="Toggle language">
        🌐 {lang.toUpperCase()}
      </button>
    </header>
  );
}
