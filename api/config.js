// ==========================================================
// config.js — Vercel Serverless Function
// ブラウザに Supabase の URL / anon key を安全に渡す
// （service_role キーや秘密鍵はここでは絶対に扱わない）
// ==========================================================

module.exports = (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_KEY,
  });
};
