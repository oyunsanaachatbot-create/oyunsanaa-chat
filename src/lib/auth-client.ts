'use client';

import { supabase } from '@/lib/supabase/browser';

export async function getClientUser() {
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function signOutClient() {
  await supabase.auth.signOut();
}
