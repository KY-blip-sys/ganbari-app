// ==========================================================
// scrollLock.js — ボトムシート表示中に背景ページがスクロールしない
// ようにするための共通ロック（複数シートの多重呼び出しに対応）
// ==========================================================

let lockCount = 0;
let savedScrollY = 0;

export function lockBodyScroll() {
  lockCount++;
  if (lockCount > 1) return;

  savedScrollY = window.scrollY;
  document.body.style.position = "fixed";
  document.body.style.top = `-${savedScrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
}

export function unlockBodyScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount > 0) return;

  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  window.scrollTo(0, savedScrollY);
}
