// ==========================================================
// statusSummaryCard.js — ステータス画面の総合カード
// （レベル／次のレベルまで／総EXP／連続記録／今月EXPを1枚に集約）
// ==========================================================

const levelValueEl = document.getElementById("status-summary-level");
const levelHintEl = document.getElementById("status-summary-level-hint");
const barFillEl = document.getElementById("status-summary-bar-fill");
const totalExpEl = document.getElementById("status-summary-total-exp");
const streakEl = document.getElementById("status-summary-streak");
const monthExpEl = document.getElementById("status-summary-month-exp");

export function renderStatusSummary({ level, expToNext, progressRatio, totalExp, streak, monthExp }) {
  levelValueEl.textContent = `Lv.${level}`;
  levelHintEl.textContent = `あと${expToNext}EXP`;
  barFillEl.style.width = `${Math.round(progressRatio * 100)}%`;
  totalExpEl.textContent = totalExp.toLocaleString();
  streakEl.innerHTML = `${streak}<span class="status-summary-stat-unit">日</span>`;
  monthExpEl.textContent = monthExp.toLocaleString();
}
