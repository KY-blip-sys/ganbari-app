// ==========================================================
// recordCard.js — 記録1件分のカード表示（一覧・カレンダー詳細で共用）
// ==========================================================

import { emojiForCategory } from "../models/record.js";
import { formatTime } from "../utils/dateUtils.js";
import { escapeHtml } from "../utils/html.js";

export function recordCardMarkup(record) {
  return `
    <div class="record-card-main">
      <span class="record-card-emoji">${emojiForCategory(record.category)}</span>
      <div class="record-card-text">
        <span class="record-card-title">${escapeHtml(record.title)}</span>
        <span class="record-card-meta">${escapeHtml(record.category)} ・ ${formatTime(record.createdAt)}</span>
      </div>
    </div>
    <span class="record-card-exp">⭐ +${record.exp} EXP</span>
  `;
}
