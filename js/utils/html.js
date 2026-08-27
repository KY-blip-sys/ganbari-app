// ==========================================================
// html.js — 簡易的なHTMLエスケープ
// ==========================================================

export function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
