// ==========================================================
// categories.js — カテゴリ定義の単一の情報源（表記ゆれ防止）
// ==========================================================

export const CATEGORIES = [
  { key: "勉強", emoji: "📚", icon: "📚", lifeStat: "学び", questTarget: 20 },
  { key: "運動", emoji: "💪", icon: "💪", lifeStat: "健康", questTarget: 10 },
  { key: "健康", emoji: "❤️", icon: "❤️", lifeStat: "健康", questTarget: 10 },
  { key: "メンタル", emoji: "🧘", icon: "🧘", lifeStat: "メンタル", questTarget: 10 },
  { key: "仕事", emoji: "💼", icon: "💼", lifeStat: "お金", questTarget: 20 },
  { key: "趣味", emoji: "🎨", icon: "🎨", lifeStat: "趣味", questTarget: 10 },
  { key: "家事", emoji: "🧹", icon: "🧹", lifeStat: "生活力", questTarget: 10 },
  { key: "その他", emoji: "✨", icon: "✨", lifeStat: null, questTarget: 10 },
  { key: "アルバイト", emoji: "💵", icon: "💵", lifeStat: "お金", questTarget: 20 },
  { key: "人間関係", emoji: "🤝", icon: "🤝", lifeStat: "人間関係", questTarget: 10 },
];

export const DEFAULT_CATEGORY = "その他";

export function normalizeCategory(category) {
  return CATEGORIES.some((c) => c.key === category) ? category : DEFAULT_CATEGORY;
}
