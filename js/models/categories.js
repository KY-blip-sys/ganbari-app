// ==========================================================
// categories.js — カテゴリ定義の単一の情報源（表記ゆれ防止）
// ==========================================================

export const CATEGORIES = [
  { key: "勉強", emoji: "📚", lifeStat: "学び", questTarget: 20 },
  { key: "運動", emoji: "💪", lifeStat: "健康", questTarget: 10 },
  { key: "健康", emoji: "❤️", lifeStat: "健康", questTarget: 10 },
  { key: "仕事", emoji: "💼", lifeStat: "お金", questTarget: 20 },
  { key: "趣味", emoji: "🎨", lifeStat: "趣味", questTarget: 10 },
  { key: "家事", emoji: "🧹", lifeStat: null, questTarget: 10 },
  { key: "その他", emoji: "✨", lifeStat: null, questTarget: 10 },
  { key: "アルバイト", emoji: "💵", lifeStat: "お金", questTarget: 20 },
  { key: "人間関係", emoji: "🤝", lifeStat: "人間関係", questTarget: 10 },
];

export const DEFAULT_CATEGORY = "その他";

export function normalizeCategory(category) {
  return CATEGORIES.some((c) => c.key === category) ? category : DEFAULT_CATEGORY;
}
