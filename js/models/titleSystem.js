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

  return { totalExp, categoryExp, categoryCounts, touchedCategories: Object.keys(categoryExp).length };
}

// 判定順そのものが優先順位（先にマッチした称号が採用される）。
export const TITLE_LIST = [
  {
    id: "perfect-day",
    icon: "🏆",
    name: "パーフェクトデイ",
    matches: (ctx) => ctx.totalExp >= 100,
  },
  {
    id: "scholar",
    icon: "🎓",
    name: "勉強家",
    matches: (ctx) => (ctx.categoryExp["勉強"] || 0) >= 30,
  },
  {
    id: "health-master",
    icon: "💪",
    name: "健康マスター",
    matches: (ctx) => (ctx.categoryExp["運動"] || 0) >= 30,
  },
  {
    id: "life-skill-master",
    icon: "🏠",
    name: "生活力の達人",
    matches: (ctx) => (ctx.categoryCounts["家事"] || 0) >= 2,
  },
  {
    id: "balancer",
    icon: "⚖️",
    name: "バランサー",
    matches: (ctx) => ctx.touchedCategories >= 4,
  },
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
