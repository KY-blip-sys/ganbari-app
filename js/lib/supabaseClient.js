// ==========================================================
// supabaseClient.js — Supabase クライアントのシングルトン生成
// URL / anon key は /api/config から取得する（コードに直書きしない）
// ==========================================================

let clientPromise = null;

export function getSupabaseClient() {
  if (!clientPromise) {
    clientPromise = (async () => {
      const res = await fetch("/api/config");
      if (!res.ok) throw new Error("config fetch failed");
      const { supabaseUrl, supabaseAnonKey } = await res.json();

      const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2.45.4");
      return createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: true, autoRefreshToken: true },
      });
    })();
  }
  return clientPromise;
}
