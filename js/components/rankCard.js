// ==========================================================
// rankCard.js — 今日の評価（ランク）表示
// ==========================================================

const valueEl = document.getElementById("rank-value");
const messageEl = document.getElementById("rank-message");
const cardEl = document.getElementById("rank-card");

export function renderRank({ rank, tier, message }) {
  valueEl.textContent = `${rank}ランク`;
  messageEl.textContent = message;
  cardEl.style.setProperty("--rank-color", `var(--rank-${tier})`);
}
