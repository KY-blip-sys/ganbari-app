// ==========================================================
// levelUpOverlay.js — レベルアップ演出
// ==========================================================

const overlayEl = document.getElementById("level-up-overlay");
const sublabelEl = document.getElementById("level-up-sublabel");

let hideTimer = null;

export function showLevelUp(level) {
  sublabelEl.textContent = `Lv.${level} に到達しました`;

  overlayEl.classList.remove("level-up-hidden");
  requestAnimationFrame(() => overlayEl.classList.add("level-up-visible"));

  if (hideTimer) clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    overlayEl.classList.remove("level-up-visible");
    setTimeout(() => overlayEl.classList.add("level-up-hidden"), 400);
  }, 2400);
}
