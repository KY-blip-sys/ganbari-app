// ==========================================================
// titleCard.js — 今日の称号表示
// ==========================================================

const iconEl = document.getElementById("title-icon");
const nameEl = document.getElementById("title-name");

export function renderTitle({ icon, name }) {
  iconEl.textContent = icon;
  nameEl.textContent = name;
}
