// ==========================================================
// syncError.js — 通信エラーを知らせる小さなバナー
// ==========================================================

const bannerEl = document.getElementById("sync-error-banner");

let hideTimer = null;

export function showSyncError(message) {
  if (!bannerEl) return;

  bannerEl.textContent = message;
  bannerEl.classList.remove("sync-error-hidden");
  requestAnimationFrame(() => bannerEl.classList.add("sync-error-visible"));

  if (hideTimer) clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    bannerEl.classList.remove("sync-error-visible");
    setTimeout(() => bannerEl.classList.add("sync-error-hidden"), 300);
  }, 4000);
}
