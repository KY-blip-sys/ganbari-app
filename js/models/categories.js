// ==========================================================
// categories.js — カテゴリ定義の単一の情報源（表記ゆれ防止）
// ==========================================================

export const CATEGORIES = [
  { key: "勉強", emoji: "📚", icon: "graduation-cap", lifeStat: "学び", questTarget: 20 },
  { key: "運動", emoji: "💪", icon: "dumbbell", lifeStat: "健康", questTarget: 10 },
  { key: "健康", emoji: "❤️", icon: "heart", lifeStat: "健康", questTarget: 10 },
  { key: "メンタル", emoji: "🧘", icon: "moon", lifeStat: "メンタル", questTarget: 10 },
  { key: "仕事", emoji: "💼", icon: "briefcase", lifeStat: "お金", questTarget: 20 },
  { key: "趣味", emoji: "🎨", icon: "palette", lifeStat: "趣味", questTarget: 10 },
  { key: "家事", emoji: "🧹", icon: "broom", lifeStat: "生活力", questTarget: 10 },
  { key: "その他", emoji: "✨", icon: "sparkle", lifeStat: null, questTarget: 10 },
  { key: "アルバイト", emoji: "💵", icon: "wallet", lifeStat: "お金", questTarget: 20 },
  { key: "人間関係", emoji: "🤝", icon: "people", lifeStat: "人間関係", questTarget: 10 },
];

export const DEFAULT_CATEGORY = "その他";

export function normalizeCategory(category) {
  return CATEGORIES.some((c) => c.key === category) ? category : DEFAULT_CATEGORY;
}
