// ==========================================================
// recordSummaryCard.js — 記録画面の「今日の記録」サマリーと
// 「今日の獲得EXP」進捗バーの描画
// ==========================================================

import { computeTodayExpGoal } from "../utils/scoreUtils.js";

const todayExpEl = document.getElementById("record-today-exp");
const todayCountEl = document.getElementById("record-today-count");
const goalFillEl = document.getElementById("record-exp-goal-fill");
const goalTextEl = document.getElementById("record-exp-goal-text");

export function renderRecordToday(todayExp, count) {
  todayExpEl.innerHTML = `${todayExp}<span class="record-today-unit">EXP</span>`;
  todayCountEl.innerHTML = `${count}<span class="record-today-unit">件</span>`;
}

export function renderRecordExpGoal(todayExp) {
  const { goal, ratio } = computeTodayExpGoal(todayExp);
  goalFillEl.style.width = `${Math.round(ratio * 100)}%`;
  goalTextEl.textContent = `${todayExp} / ${goal}EXP`;
}
