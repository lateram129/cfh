import { createClient } from './client';
import type { Profile } from './types';

export type AdminSession = { userId: string; email: string | null; profile: Profile };

// Returns the current session's profile only if role === 'admin'; null for
// anyone else (logged out, or a logged-in non-admin). Used by
// app/admin/layout.tsx to gate the whole /admin tree.
export async function getAdminSession(): Promise<AdminSession | null> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
  if (!profile || profile.role !== 'admin') return null;

  return { userId: session.user.id, email: session.user.email ?? null, profile };
}

export async function signInAdmin(email: string, password: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signOutAdmin() {
  const supabase = createClient();
  await supabase.auth.signOut();
}
