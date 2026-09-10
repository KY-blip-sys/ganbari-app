// ==========================================================
// titleCard.js — 今日の称号表示
// ==========================================================

const nameEl = document.getElementById("title-name");

export function renderTitle({ name }) {
  nameEl.textContent = name;
}
