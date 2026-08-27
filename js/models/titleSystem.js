// ==========================================================
// titleSystem.js — 記録内容から称号を自動判定
// ==========================================================

function buildDayContext(dayRecords) {
  const totalExp = dayRecords.reduce((sum, r) => sum + r.exp, 0);
  const categoryExp = {};
  const categoryCounts = {};

  dayRecords.forEach((r) => {
    categoryExp[r.category] = (categoryExp[r.category] || 0) + r.exp;
    categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
  });

  const hours = dayRecords.map((r) => new Date(r.createdAt).getHours());

  return {
    totalExp,
    categoryExp,
    categoryCounts,
    touchedCategories: Object.keys(categoryExp).length,
    recordCount: dayRecords.length,
    maxSingleExp: Math.max(0, ...dayRecords.map((r) => r.exp)),
    earliestHour: hours.length ? Math.min(...hours) : null,
    latestHour: hours.length ? Math.max(...hours) : null,
  };
}

// 判定順そのものが優先順位（先にマッチした称号が採用される）。
export const TITLE_LIST = [
  { id: "legendary-day", icon: "🌠", name: "伝説の一日", matches: (ctx) => ctx.totalExp >= 300 },
  { id: "perfect-day", icon: "🏆", name: "パーフェクトデイ", matches: (ctx) => ctx.totalExp >= 200 },
  { id: "fulfilling-day", icon: "✨", name: "充実の一日", matches: (ctx) => ctx.totalExp >= 100 },

  { id: "overachiever", icon: "🔥", name: "限界突破者", matches: (ctx) => ctx.maxSingleExp >= 50 },
  { id: "multi-tasker", icon: "🧩", name: "マルチタスカー", matches: (ctx) => ctx.recordCount >= 5 },

  { id: "scholar", icon: "🎓", name: "勉強家", matches: (ctx) => (ctx.categoryExp["勉強"] || 0) >= 30 },
  { id: "health-master", icon: "💪", name: "健康マスター", matches: (ctx) => (ctx.categoryExp["運動"] || 0) >= 30 },
  { id: "wellness-guru", icon: "❤️", name: "ウェルネスの達人", matches: (ctx) => (ctx.categoryExp["健康"] || 0) >= 30 },
  { id: "mindful-one", icon: "🧘", name: "心の安定", matches: (ctx) => (ctx.categoryExp["メンタル"] || 0) >= 30 },
  { id: "hustler", icon: "💼", name: "仕事人間", matches: (ctx) => (ctx.categoryExp["仕事"] || 0) >= 30 },
  { id: "earner", icon: "💵", name: "稼ぎ頭", matches: (ctx) => (ctx.categoryExp["アルバイト"] || 0) >= 30 },
  { id: "artist", icon: "🎨", name: "趣味人", matches: (ctx) => (ctx.categoryExp["趣味"] || 0) >= 30 },
  { id: "socialite", icon: "🤝", name: "社交家", matches: (ctx) => (ctx.categoryExp["人間関係"] || 0) >= 30 },
  {
    id: "life-skill-master",
    icon: "🏠",
    name: "生活力の達人",
    matches: (ctx) => (ctx.categoryCounts["家事"] || 0) >= 2,
  },
  { id: "wildcard", icon: "🌟", name: "自由人", matches: (ctx) => (ctx.categoryExp["その他"] || 0) >= 30 },

  { id: "jack-of-all-trades", icon: "🌈", name: "何でも屋", matches: (ctx) => ctx.touchedCategories >= 6 },
  { id: "balancer", icon: "⚖️", name: "バランサー", matches: (ctx) => ctx.touchedCategories >= 4 },

  { id: "early-bird-day", icon: "🌅", name: "早起きさん", matches: (ctx) => ctx.earliestHour !== null && ctx.earliestHour < 7 },
  { id: "night-owl-day", icon: "🌙", name: "夜更かしさん", matches: (ctx) => ctx.latestHour !== null && ctx.latestHour >= 23 },
];

const DEFAULT_TITLE = { icon: "🌱", name: "今日の一歩" };
const EMPTY_TITLE = { icon: "💤", name: "まだ記録なし" };

export function computeTodayTitle(todayRecords) {
  if (todayRecords.length === 0) return EMPTY_TITLE;

  const ctx = buildDayContext(todayRecords);
  const matched = TITLE_LIST.find((t) => t.matches(ctx));
  return matched ? { icon: matched.icon, name: matched.name } : DEFAULT_TITLE;
}

// 過去の全日付に同じ判定を再実行し、これまでに獲得したことがある称号一覧を導出する。
// 新しい永続状態は持たず、既存の records だけから導出する。
export function computeAllEarnedTitles(recordsByDate) {
  const earnedIds = new Set();

  Object.values(recordsByDate).forEach((dayRecords) => {
    if (!dayRecords.length) return;
    const ctx = buildDayContext(dayRecords);
    const matched = TITLE_LIST.find((t) => t.matches(ctx));
    if (matched) earnedIds.add(matched.id);
  });

  return TITLE_LIST.map((t) => ({ ...t, earned: earnedIds.has(t.id) }));
}
