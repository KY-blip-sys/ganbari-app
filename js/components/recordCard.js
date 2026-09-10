// ==========================================================
// recordCard.js — 記録1件分のカード表示（一覧・カレンダー詳細で共用）
// ==========================================================

import { iconForCategory } from "../models/record.js";
import { formatTime } from "../utils/dateUtils.js";
import { escapeHtml } from "../utils/html.js";
import { iconSvg } from "../utils/icons.js";

// 記録追加モーダルのEXP選択肢（5 / 10 / 20 / 35 / 50）と対応する頑張り度の星評価
const EXP_STAR_TIERS = [5, 10, 20, 35, 50];

function starsForExp(exp) {
  const idx = EXP_STAR_TIERS.findIndex((tier) => exp <= tier);
  return idx === -1 ? 5 : idx + 1;
}

function starsMarkup(exp) {
  const filled = starsForExp(exp);
  return `<span class="record-card-stars-filled">${"★".repeat(filled)}</span><span class="record-card-stars-empty">${"☆".repeat(5 - filled)}</span>`;
}

export function recordCardMarkup(record) {
  return `
    <div class="record-card-main">
      <span class="record-card-icon">${iconSvg(iconForCategory(record.category), { size: 18 })}</span>
      <div class="record-card-text">
        <span class="record-card-title">${escapeHtml(record.title)}</span>
        <span class="record-card-meta">
          <span class="record-card-category">${escapeHtml(record.category)}</span>
          <span class="record-card-dot">・</span>
          <span class="record-card-stars">${starsMarkup(record.exp)}</span>
          <span class="record-card-dot">・</span>
          <span class="record-card-time">${formatTime(record.createdAt)}</span>
        </span>
      </div>
    </div>
    <span class="record-card-exp">+${record.exp} EXP</span>
  `;
}
