// ==========================================================
// record.js — 「今日頑張ったこと」1件を表すデータモデル
// ==========================================================

import { CATEGORIES, DEFAULT_CATEGORY, normalizeCategory } from "./categories.js";

export const CATEGORY_EMOJI = Object.fromEntries(CATEGORIES.map((c) => [c.key, c.emoji]));

export function createRecord(title, category, exp) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    category: normalizeCategory(category),
    exp,
    createdAt: Date.now(),
  };
}

export function emojiForCategory(category) {
  return CATEGORY_EMOJI[category] || CATEGORY_EMOJI[DEFAULT_CATEGORY];
}
