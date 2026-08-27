// ==========================================================
// authService.js — Supabase Auth の薄いラッパー（DOM操作なし）
// ==========================================================

import { getSupabaseClient } from "../lib/supabaseClient.js";

export async function signUp(email, password) {
  const supabase = await getSupabaseClient();
  return supabase.auth.signUp({ email, password });
}

export async function signIn(email, password) {
  const supabase = await getSupabaseClient();
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  const supabase = await getSupabaseClient();
  return supabase.auth.signOut();
}

export async function getSession() {
  const supabase = await getSupabaseClient();
  return supabase.auth.getSession();
}

export async function onAuthStateChange(callback) {
  const supabase = await getSupabaseClient();
  return supabase.auth.onAuthStateChange((event, session) => callback(event, session));
}
