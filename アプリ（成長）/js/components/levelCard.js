// ==========================================================
// levelCard.js — レベル・経験値バー表示
// ==========================================================

const levelValueEl = document.getElementById("level-value");
const expBarFillEl = document.getElementById("exp-bar-fill");
const expHintEl = document.getElementById("exp-hint");

export function renderLevel({ level, expToNext, progressRatio }) {
  levelValueEl.textContent = `Lv.${level}`;
  expBarFillEl.style.width = `${Math.round(progressRatio * 100)}%`;
  expHintEl.textContent = `あと${expToNext}EXPでレベルアップ`;
}
