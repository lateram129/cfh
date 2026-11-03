'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { id } from './id';
import { en } from './en';

type Lang = 'id' | 'en';
type Translations = typeof id;

const translations: Record<Lang, Translations> = { id, en };

interface I18nContext {
  lang: Lang;
  t: Translations;
  toggle: () => void;
}

const I18nCtx = createContext<I18nContext>({
  lang: 'id',
  t: id,
  toggle: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('id');
  const toggle = () => setLang(l => (l === 'id' ? 'en' : 'id'));
  return (
    <I18nCtx.Provider value={{ lang, t: translations[lang], toggle }}>
      {children}
    </I18nCtx.Provider>
  );
}

export function useI18n() {
  return useContext(I18nCtx);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
}

export function calcAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export function formatDate(dateStr: string, lang: Lang = 'id'): string {
  return new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(dateStr));
}

export function formatDateTime(dateStr: string, lang: Lang = 'id'): string {
  return new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(dateStr));
}
