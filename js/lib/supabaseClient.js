// ==========================================================
// supabaseClient.js — Supabase クライアントのシングルトン生成
// URL / anon key は /api/config から取得する（コードに直書きしない）
// ==========================================================

let clientPromise = null;

// SUPABASE_URL に /rest/v1 などのパスが誤って混入していても、
// createClient() には常にオリジン（https://<project>.supabase.co）だけを渡す。
function toOrigin(url) {
  try {
    return new URL(url).origin;
  } catch {
    return url;
  }
}

export function getSupabaseClient() {
  if (!clientPromise) {
    clientPromise = (async () => {
      const res = await fetch("/api/config");
      if (!res.ok) throw new Error("config fetch failed");
      const { supabaseUrl, supabaseAnonKey } = await res.json();

      const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2.45.4");
      return createClient(toOrigin(supabaseUrl), supabaseAnonKey, {
        auth: { persistSession: true, autoRefreshToken: true },
      });
    })();
  }
  return clientPromise;
}
