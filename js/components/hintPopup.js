// ==========================================================
// hintPopup.js — 実績・称号のロック中カードをタップした時に
// ヒント文を見せる軽量ポップアップ（達成/称号ギャラリーで共用）
// ==========================================================

const overlayEl = document.getElementById("hint-popup-overlay");
const sheetEl = document.getElementById("hint-popup-sheet");
const iconEl = document.getElementById("hint-popup-icon");
const titleEl = document.getElementById("hint-popup-title");
const textEl = document.getElementById("hint-popup-text");

export function showHint({ icon, title, text }) {
  iconEl.textContent = icon;
  titleEl.textContent = title;
  textEl.textContent = text;

  overlayEl.classList.remove("modal-hidden");
  requestAnimationFrame(() => overlayEl.classList.add("modal-visible"));
}

function hideHint() {
  overlayEl.classList.remove("modal-visible");
  setTimeout(() => overlayEl.classList.add("modal-hidden"), 300);
}

overlayEl.addEventListener("click", hideHint);
sheetEl.addEventListener("click", hideHint);
