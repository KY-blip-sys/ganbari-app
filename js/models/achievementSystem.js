// ==========================================================
// achievementSystem.js — 実績（トロフィー）
// 既存データ（totalExp / records / 人生ステータスLv）だけから
// 判定する。新しい永続状態は持たない。
// ==========================================================

import { CATEGORIES } from "./categories.js";
import { computeMaxStreak, countTouchedCategories } from "../utils/recordStats.js";

function buildExtendedContext(records) {
  const allRecords = Object.values(records).flat();

  const categoryTotals = {};
  allRecords.forEach((r) => {
    categoryTotals[r.category] = (categoryTotals[r.category] || 0) + r.exp;
  });

  const dayExpTotals = Object.values(records).map((list) => list.reduce((sum, r) => sum + r.exp, 0));
  const bestDayExp = dayExpTotals.length ? Math.max(...dayExpTotals) : 0;

  const daysRecorded = Object.values(records).filter((list) => list.length > 0).length;

  const earlyBirdCount = allRecords.filter((r) => new Date(r.createdAt).getHours() < 7).length;
  const nightOwlCount = allRecords.filter((r) => new Date(r.createdAt).getHours() >= 23).length;

  return {
    allRecords,
    categoryTotals,
    bestDayExp,
    daysRecorded,
    categoriesEverUsed: countTouchedCategories(allRecords),
    earlyBirdCount,
    nightOwlCount,
  };
}

const STAT_ICON = {
  学び: "🧠",
  健康: "❤️",
  メンタル: "🧘",
  お金: "💰",
  人間関係: "🤝",
  趣味: "🎨",
  生活力: "🏠",
};

const STAT_ACHIEVEMENTS = Object.keys(STAT_ICON).flatMap((key) =>
  [5, 10, 20].map((level) => ({
    id: `stat-${key}-${level}`,
    icon: STAT_ICON[key],
    name: `${key}Lv.${level}`,
    description: `人生ステータス「${key}」がLv.${level}に到達`,
    check: (ctx) => (ctx.lifeStatLevels[key] || 1) >= level,
  }))
);

const CATEGORY_ACHIEVEMENTS = CATEGORIES.map((c) => ({
  id: `cat-total-${c.key}`,
  icon: c.emoji,
  name: `${c.key}の探求者`,
  description: `「${c.key}」で累計200EXP達成`,
  check: (ctx) => (ctx.categoryTotals[c.key] || 0) >= 200,
}));

export const ACHIEVEMENT_LIST = [
  // ---------- 累計EXP ----------
  { id: "exp-10", icon: "🌟", name: "初めの一歩", description: "累計10EXP達成", check: (ctx) => ctx.totalExp >= 10 },
  { id: "exp-100", icon: "✨", name: "軌道に乗ってきた", description: "累計100EXP達成", check: (ctx) => ctx.totalExp >= 100 },
  { id: "exp-500", icon: "🔥", name: "継続は力なり", description: "累計500EXP達成", check: (ctx) => ctx.totalExp >= 500 },
  { id: "exp-1000", icon: "💠", name: "千里の道も一歩から", description: "累計1000EXP達成", check: (ctx) => ctx.totalExp >= 1000 },
  { id: "exp-3000", icon: "💫", name: "止まらない成長", description: "累計3000EXP達成", check: (ctx) => ctx.totalExp >= 3000 },
  { id: "exp-5000", icon: "👑", name: "伝説の始まり", description: "累計5000EXP達成", check: (ctx) => ctx.totalExp >= 5000 },
  { id: "exp-10000", icon: "🏵️", name: "一万の頂", description: "累計10000EXP達成", check: (ctx) => ctx.totalExp >= 10000 },
  { id: "exp-20000", icon: "🌌", name: "限界突破者", description: "累計20000EXP達成", check: (ctx) => ctx.totalExp >= 20000 },
  { id: "exp-50000", icon: "🪐", name: "生きる伝説", description: "累計50000EXP達成", check: (ctx) => ctx.totalExp >= 50000 },

  // ---------- 記録数 ----------
  { id: "record-1", icon: "📝", name: "最初の記録", description: "記録を1件追加する", check: (ctx) => ctx.recordCount >= 1 },
  { id: "record-10", icon: "🖊️", name: "書き続ける人", description: "記録を10件追加する", check: (ctx) => ctx.recordCount >= 10 },
  { id: "record-50", icon: "📚", name: "習慣化への道", description: "記録を50件追加する", check: (ctx) => ctx.recordCount >= 50 },
  { id: "record-100", icon: "📖", name: "百戦錬磨", description: "記録を100件追加する", check: (ctx) => ctx.recordCount >= 100 },
  { id: "record-200", icon: "🏆", name: "記録の達人", description: "記録を200件追加する", check: (ctx) => ctx.recordCount >= 200 },
  { id: "record-500", icon: "🗂️", name: "積み重ねの化身", description: "記録を500件追加する", check: (ctx) => ctx.recordCount >= 500 },
  { id: "record-1000", icon: "🗄️", name: "記録の殿堂", description: "記録を1000件追加する", check: (ctx) => ctx.recordCount >= 1000 },

  // ---------- 連続記録日数 ----------
  { id: "streak-3", icon: "🔥", name: "3日坊主卒業", description: "3日連続で記録する", check: (ctx) => ctx.maxStreak >= 3 },
  { id: "streak-7", icon: "🔥", name: "週間戦士", description: "7日連続で記録する", check: (ctx) => ctx.maxStreak >= 7 },
  { id: "streak-14", icon: "🔥", name: "2週間の炎", description: "14日連続で記録する", check: (ctx) => ctx.maxStreak >= 14 },
  { id: "streak-30", icon: "🔥", name: "継続の鬼", description: "30日連続で記録する", check: (ctx) => ctx.maxStreak >= 30 },
  { id: "streak-60", icon: "🔥", name: "習慣の化身", description: "60日連続で記録する", check: (ctx) => ctx.maxStreak >= 60 },
  { id: "streak-100", icon: "🔥", name: "百日不滅", description: "100日連続で記録する", check: (ctx) => ctx.maxStreak >= 100 },

  // ---------- 記録した日数（連続でなくても可） ----------
  { id: "days-10", icon: "📅", name: "10日間の軌跡", description: "記録した日数が合計10日", check: (ctx) => ctx.daysRecorded >= 10 },
  { id: "days-30", icon: "🗓️", name: "1ヶ月分の積み上げ", description: "記録した日数が合計30日", check: (ctx) => ctx.daysRecorded >= 30 },
  { id: "days-100", icon: "📆", name: "百日の足跡", description: "記録した日数が合計100日", check: (ctx) => ctx.daysRecorded >= 100 },
  { id: "days-365", icon: "🎊", name: "一年間の物語", description: "記録した日数が合計365日", check: (ctx) => ctx.daysRecorded >= 365 },

  // ---------- 人生ステータスLv ----------
  ...STAT_ACHIEVEMENTS,

  // ---------- オールラウンダー ----------
  {
    id: "all-rounder-3",
    icon: "⚖️",
    name: "オールラウンダー",
    description: "全ての人生ステータスがLv.3以上",
    check: (ctx) => Object.values(ctx.lifeStatLevels).every((lv) => lv >= 3),
  },
  {
    id: "all-rounder-5",
    icon: "🧭",
    name: "バランス型の達人",
    description: "全ての人生ステータスがLv.5以上",
    check: (ctx) => Object.values(ctx.lifeStatLevels).every((lv) => lv >= 5),
  },
  {
    id: "all-rounder-10",
    icon: "🎖️",
    name: "完全体",
    description: "全ての人生ステータスがLv.10以上",
    check: (ctx) => Object.values(ctx.lifeStatLevels).every((lv) => lv >= 10),
  },
  {
    id: "all-rounder-15",
    icon: "🌐",
    name: "神域",
    description: "全ての人生ステータスがLv.15以上",
    check: (ctx) => Object.values(ctx.lifeStatLevels).every((lv) => lv >= 15),
  },

  // ---------- ステータスの組み合わせ（シナジー） ----------
  {
    id: "synergy-mind-and-body",
    icon: "🥋",
    name: "文武両道",
    description: "「学び」と「健康」がともにLv.10以上",
    check: (ctx) => (ctx.lifeStatLevels["学び"] || 1) >= 10 && (ctx.lifeStatLevels["健康"] || 1) >= 10,
  },
  {
    id: "synergy-work-life-balance",
    icon: "⚖️",
    name: "ワークライフバランス",
    description: "「お金」と「趣味」がともにLv.10以上",
    check: (ctx) => (ctx.lifeStatLevels["お金"] || 1) >= 10 && (ctx.lifeStatLevels["趣味"] || 1) >= 10,
  },
  {
    id: "synergy-mind-body-life",
    icon: "☯️",
    name: "心技体",
    description: "「メンタル」「健康」「生活力」がすべてLv.8以上",
    check: (ctx) =>
      (ctx.lifeStatLevels["メンタル"] || 1) >= 8 &&
      (ctx.lifeStatLevels["健康"] || 1) >= 8 &&
      (ctx.lifeStatLevels["生活力"] || 1) >= 8,
  },
  {
    id: "synergy-people-person",
    icon: "💞",
    name: "人格者",
    description: "「人間関係」と「メンタル」がともにLv.10以上",
    check: (ctx) => (ctx.lifeStatLevels["人間関係"] || 1) >= 10 && (ctx.lifeStatLevels["メンタル"] || 1) >= 10,
  },

  // ---------- カテゴリ探求 ----------
  ...CATEGORY_ACHIEVEMENTS,
  {
    id: "category-diversity-5",
    icon: "🎲",
    name: "多趣味な人",
    description: "5種類以上のカテゴリで記録したことがある",
    check: (ctx) => ctx.categoriesEverUsed >= 5,
  },
  {
    id: "category-diversity-all",
    icon: "🌈",
    name: "全方位型",
    description: "全カテゴリで記録したことがある",
    check: (ctx) => ctx.categoriesEverUsed >= CATEGORIES.length,
  },

  // ---------- ベストな一日 ----------
  { id: "best-day-100", icon: "🌤️", name: "充実の一日", description: "1日の合計が100EXPを超える", check: (ctx) => ctx.bestDayExp >= 100 },
  { id: "best-day-200", icon: "☀️", name: "全力の一日", description: "1日の合計が200EXPを超える", check: (ctx) => ctx.bestDayExp >= 200 },
  { id: "best-day-300", icon: "🌟", name: "限界突破の一日", description: "1日の合計が300EXPを超える", check: (ctx) => ctx.bestDayExp >= 300 },

  // ---------- 生活リズム ----------
  { id: "early-bird", icon: "🌅", name: "早起きは三文の徳", description: "朝7時前に5回記録する", check: (ctx) => ctx.earlyBirdCount >= 5 },
  { id: "night-owl", icon: "🌙", name: "夜型の探求者", description: "夜23時以降に5回記録する", check: (ctx) => ctx.nightOwlCount >= 5 },
];

export function computeAchievements({ totalExp, records, lifeStatLevels }) {
  const extended = buildExtendedContext(records);
  const ctx = {
    totalExp,
    recordCount: extended.allRecords.length,
    maxStreak: computeMaxStreak(records),
    lifeStatLevels,
    ...extended,
  };

  return ACHIEVEMENT_LIST.map((a) => ({ ...a, unlocked: a.check(ctx) }));
}
