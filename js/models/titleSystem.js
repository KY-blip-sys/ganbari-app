// ==========================================================
// titleSystem.js — 記録内容から称号を自動判定
// ==========================================================

import { CATEGORIES } from "./categories.js";

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
// より珍しい／条件が具体的な称号ほど上に置き、先に判定されるようにする。
export const TITLE_LIST = [
  // ---------- 1日の合計EXP ----------
  { id: "legendary-day", icon: "🌠", name: "伝説の一日", description: "1日の合計EXPが300を超える", matches: (ctx) => ctx.totalExp >= 300 },
  { id: "perfect-day", icon: "🏆", name: "パーフェクトデイ", description: "1日の合計EXPが200を超える", matches: (ctx) => ctx.totalExp >= 200 },
  { id: "fulfilling-day", icon: "✨", name: "充実の一日", description: "1日の合計EXPが100を超える", matches: (ctx) => ctx.totalExp >= 100 },
  { id: "steady-day", icon: "🌤️", name: "積み上げの一日", description: "1日の合計EXPが50を超える", matches: (ctx) => ctx.totalExp >= 50 },

  // ---------- 一撃の重さ ----------
  { id: "strike-master", icon: "💥", name: "神業の一撃", description: "1件の記録で80EXP以上を獲得する", matches: (ctx) => ctx.maxSingleExp >= 80 },
  { id: "overachiever", icon: "🔥", name: "限界突破者", description: "1件の記録で50EXP以上を獲得する", matches: (ctx) => ctx.maxSingleExp >= 50 },

  // ---------- 記録件数 ----------
  { id: "workaholic-day", icon: "⚡", name: "大忙しの一日", description: "1日に8件以上の記録を追加する", matches: (ctx) => ctx.recordCount >= 8 },
  { id: "multi-tasker", icon: "🧩", name: "マルチタスカー", description: "1日に5件以上の記録を追加する", matches: (ctx) => ctx.recordCount >= 5 },
  { id: "steady-effort", icon: "🪴", name: "コツコツ型", description: "1日に3件以上の記録を追加する", matches: (ctx) => ctx.recordCount >= 3 },

  // ---------- 組み合わせ ----------
  {
    id: "mind-and-body-day",
    icon: "🥋",
    name: "文武両道な一日",
    description: "「勉強」と「運動」をどちらも20EXP以上こなす",
    matches: (ctx) => (ctx.categoryExp["勉強"] || 0) >= 20 && (ctx.categoryExp["運動"] || 0) >= 20,
  },
  {
    id: "work-and-play-day",
    icon: "🎢",
    name: "オンオフの達人",
    description: "「仕事」と「趣味」をどちらも20EXP以上こなす",
    matches: (ctx) => (ctx.categoryExp["仕事"] || 0) >= 20 && (ctx.categoryExp["趣味"] || 0) >= 20,
  },
  {
    id: "care-and-connect-day",
    icon: "💞",
    name: "思いやりの一日",
    description: "「健康」と「人間関係」をどちらも15EXP以上こなす",
    matches: (ctx) => (ctx.categoryExp["健康"] || 0) >= 15 && (ctx.categoryExp["人間関係"] || 0) >= 15,
  },

  // ---------- カテゴリ特化 ----------
  { id: "scholar-plus", icon: "📜", name: "学問の探究者", description: "「勉強」で1日60EXP以上獲得する", matches: (ctx) => (ctx.categoryExp["勉強"] || 0) >= 60 },
  { id: "scholar", icon: "🎓", name: "勉強家", description: "「勉強」で1日30EXP以上獲得する", matches: (ctx) => (ctx.categoryExp["勉強"] || 0) >= 30 },
  { id: "health-master-plus", icon: "🏋️", name: "肉体の頂点", description: "「運動」で1日60EXP以上獲得する", matches: (ctx) => (ctx.categoryExp["運動"] || 0) >= 60 },
  { id: "health-master", icon: "💪", name: "健康マスター", description: "「運動」で1日30EXP以上獲得する", matches: (ctx) => (ctx.categoryExp["運動"] || 0) >= 30 },
  { id: "hustler-plus", icon: "🏢", name: "仕事の鬼", description: "「仕事」で1日60EXP以上獲得する", matches: (ctx) => (ctx.categoryExp["仕事"] || 0) >= 60 },
  { id: "hustler", icon: "💼", name: "仕事人間", description: "「仕事」で1日30EXP以上獲得する", matches: (ctx) => (ctx.categoryExp["仕事"] || 0) >= 30 },
  { id: "wellness-guru", icon: "❤️", name: "ウェルネスの達人", description: "「健康」で1日30EXP以上獲得する", matches: (ctx) => (ctx.categoryExp["健康"] || 0) >= 30 },
  { id: "mindful-one", icon: "🧘", name: "心の安定", description: "「メンタル」で1日30EXP以上獲得する", matches: (ctx) => (ctx.categoryExp["メンタル"] || 0) >= 30 },
  { id: "earner", icon: "💵", name: "稼ぎ頭", description: "「アルバイト」で1日30EXP以上獲得する", matches: (ctx) => (ctx.categoryExp["アルバイト"] || 0) >= 30 },
  { id: "artist", icon: "🎨", name: "趣味人", description: "「趣味」で1日30EXP以上獲得する", matches: (ctx) => (ctx.categoryExp["趣味"] || 0) >= 30 },
  { id: "socialite", icon: "🤝", name: "社交家", description: "「人間関係」で1日30EXP以上獲得する", matches: (ctx) => (ctx.categoryExp["人間関係"] || 0) >= 30 },
  {
    id: "life-skill-master",
    icon: "🏠",
    name: "生活力の達人",
    description: "「家事」を1日に2回以上記録する",
    matches: (ctx) => (ctx.categoryCounts["家事"] || 0) >= 2,
  },
  { id: "wildcard", icon: "🌟", name: "自由人", description: "「その他」で1日30EXP以上獲得する", matches: (ctx) => (ctx.categoryExp["その他"] || 0) >= 30 },

  // ---------- カテゴリの幅（シークレット含む） ----------
  {
    id: "all-categories-day",
    icon: "❔",
    name: "コンプリートデイ",
    description: "1日で全カテゴリを使って記録する",
    secret: true,
    hint: "1日で使えるカテゴリを全部使い切ると出会えるらしい",
    matches: (ctx) => ctx.touchedCategories >= CATEGORIES.length,
  },
  {
    id: "super-diverse-day",
    icon: "❔",
    name: "限界突破の万能選手",
    description: "1日に8種類以上のカテゴリで記録する",
    secret: true,
    hint: "とても幅広い1日を過ごすと現れる、らしい",
    matches: (ctx) => ctx.touchedCategories >= 8,
  },
  { id: "jack-of-all-trades", icon: "🌈", name: "何でも屋", description: "1日に6種類以上のカテゴリで記録する", matches: (ctx) => ctx.touchedCategories >= 6 },
  { id: "balancer", icon: "⚖️", name: "バランサー", description: "1日に4種類以上のカテゴリで記録する", matches: (ctx) => ctx.touchedCategories >= 4 },

  // ---------- 時間帯（シークレット含む） ----------
  {
    id: "no-sleep-day",
    icon: "❔",
    name: "不眠不休の一日",
    description: "朝7時前と夜23時以降の両方に記録する",
    secret: true,
    hint: "朝早くから夜遅くまで記録し続けると出会えるかもしれない",
    matches: (ctx) => ctx.earliestHour !== null && ctx.earliestHour < 7 && ctx.latestHour !== null && ctx.latestHour >= 23,
  },
  {
    id: "deep-night-day",
    icon: "❔",
    name: "深夜の閃き",
    description: "深夜4時より前に記録する",
    secret: true,
    hint: "日付が変わったあとに何かを記録すると出会えるかもしれない…",
    matches: (ctx) => ctx.earliestHour !== null && ctx.earliestHour < 4,
  },
  { id: "early-bird-day", icon: "🌅", name: "早起きさん", description: "朝7時より前に記録する", matches: (ctx) => ctx.earliestHour !== null && ctx.earliestHour < 7 },
  { id: "night-owl-day", icon: "🌙", name: "夜更かしさん", description: "夜23時以降に記録する", matches: (ctx) => ctx.latestHour !== null && ctx.latestHour >= 23 },
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
