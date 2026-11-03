'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Trophy, Megaphone, ShoppingBag } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const ITEMS = [
  { href: '/', icon: Home, key: 'nav_home' as const },
  { href: '/pemain', icon: Users, key: 'nav_players' as const },
  { href: '/liga', icon: Trophy, key: 'nav_league' as const },
  { href: '/trial', icon: Megaphone, key: 'nav_trial' as const },
  { href: '/fanzone', icon: ShoppingBag, key: 'nav_fanzone' as const },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <div className="bottom-nav-inner">
        {ITEMS.map(({ href, icon: Icon, key }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link key={href} href={href} className={`nav-item${active ? ' active' : ''}`}>
              <span className="nav-item-icon">
                <Icon size={20} strokeWidth={active ? 2.4 : 2} />
              </span>
              <span className="nav-item-label">{t[key]}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
