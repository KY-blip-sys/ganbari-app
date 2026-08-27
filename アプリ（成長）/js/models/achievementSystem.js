// ==========================================================
// achievementSystem.js — 実績（トロフィー）
// 既存データ（totalExp / records / 人生ステータスLv）だけから
// 判定する。新しい永続状態は持たない。
// ==========================================================

function computeMaxStreak(records) {
  const days = Object.keys(records)
    .filter((key) => records[key].length > 0)
    .map((key) => {
      const [y, m, d] = key.split("-").map(Number);
      return new Date(y, m - 1, d).getTime();
    })
    .sort((a, b) => a - b);

  if (days.length === 0) return 0;

  let maxStreak = 1;
  let current = 1;
  const ONE_DAY = 24 * 60 * 60 * 1000;

  for (let i = 1; i < days.length; i++) {
    const diff = Math.round((days[i] - days[i - 1]) / ONE_DAY);
    current = diff === 1 ? current + 1 : 1;
    maxStreak = Math.max(maxStreak, current);
  }

  return maxStreak;
}

export const ACHIEVEMENT_LIST = [
  { id: "exp-10", icon: "🌟", name: "初めの一歩", description: "累計10EXP達成", check: (ctx) => ctx.totalExp >= 10 },
  { id: "exp-500", icon: "🔥", name: "継続は力なり", description: "累計500EXP達成", check: (ctx) => ctx.totalExp >= 500 },
  { id: "exp-1000", icon: "💠", name: "千里の道も一歩から", description: "累計1000EXP達成", check: (ctx) => ctx.totalExp >= 1000 },
  { id: "exp-5000", icon: "👑", name: "伝説の始まり", description: "累計5000EXP達成", check: (ctx) => ctx.totalExp >= 5000 },

  { id: "record-1", icon: "📝", name: "最初の記録", description: "記録を1件追加する", check: (ctx) => ctx.recordCount >= 1 },
  { id: "record-50", icon: "📚", name: "習慣化への道", description: "記録を50件追加する", check: (ctx) => ctx.recordCount >= 50 },
  { id: "record-200", icon: "🏆", name: "記録の達人", description: "記録を200件追加する", check: (ctx) => ctx.recordCount >= 200 },

  { id: "streak-3", icon: "🔥", name: "3日坊主卒業", description: "3日連続で記録する", check: (ctx) => ctx.maxStreak >= 3 },
  { id: "streak-7", icon: "🔥", name: "週間戦士", description: "7日連続で記録する", check: (ctx) => ctx.maxStreak >= 7 },
  { id: "streak-30", icon: "🔥", name: "継続の鬼", description: "30日連続で記録する", check: (ctx) => ctx.maxStreak >= 30 },

  { id: "stat-学び-5", icon: "🧠", name: "学びLv.5", description: "人生ステータス「学び」がLv.5に到達", check: (ctx) => (ctx.lifeStatLevels["学び"] || 1) >= 5 },
  { id: "stat-健康-5", icon: "❤️", name: "健康Lv.5", description: "人生ステータス「健康」がLv.5に到達", check: (ctx) => (ctx.lifeStatLevels["健康"] || 1) >= 5 },
  { id: "stat-お金-5", icon: "💰", name: "お金Lv.5", description: "人生ステータス「お金」がLv.5に到達", check: (ctx) => (ctx.lifeStatLevels["お金"] || 1) >= 5 },
  { id: "stat-人間関係-5", icon: "🤝", name: "人間関係Lv.5", description: "人生ステータス「人間関係」がLv.5に到達", check: (ctx) => (ctx.lifeStatLevels["人間関係"] || 1) >= 5 },
  { id: "stat-趣味-5", icon: "🎨", name: "趣味Lv.5", description: "人生ステータス「趣味」がLv.5に到達", check: (ctx) => (ctx.lifeStatLevels["趣味"] || 1) >= 5 },

  {
    id: "all-rounder",
    icon: "⚖️",
    name: "オールラウンダー",
    description: "全ての人生ステータスがLv.3以上",
    check: (ctx) => Object.values(ctx.lifeStatLevels).every((lv) => lv >= 3),
  },
];

export function computeAchievements({ totalExp, records, lifeStatLevels }) {
  const ctx = {
    totalExp,
    recordCount: Object.values(records).flat().length,
    maxStreak: computeMaxStreak(records),
    lifeStatLevels,
  };

  return ACHIEVEMENT_LIST.map((a) => ({ ...a, unlocked: a.check(ctx) }));
}
