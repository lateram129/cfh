import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// True once .env.local has real Supabase credentials. Until then the data
// layer (lib/data/index.ts) falls back to the bundled dummy data, so the
// app keeps working for local demos before a backend exists.
export const isSupabaseConfigured = Boolean(
  URL && ANON_KEY && !URL.includes('YOUR_PROJECT_REF') && !ANON_KEY.includes('YOUR_ANON_KEY')
);

export function createClient() {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase belum dikonfigurasi — isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local. ' +
      'Cek isSupabaseConfigured sebelum memanggil createClient().'
    );
  }
  return createBrowserClient<Database>(URL!, ANON_KEY!);
}
