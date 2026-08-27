// ==========================================================
// questSystem.js — デイリー／ウィークリー／マンスリー／スペシャルの
// クエスト生成と達成判定
// ==========================================================

import { CATEGORIES } from "./categories.js";
import { computeCurrentStreak, countTouchedCategories } from "../utils/recordStats.js";

export const QUEST_REWARD_EXP = { daily: 30, weekly: 100, monthly: 300 };

// カテゴリごとのEXPクエストを categories.js から自動生成することで、
// カテゴリの表記ゆれや反映漏れを防ぐ（全カテゴリが必ずクエスト判定の対象になる）。
function buildCategoryQuests(multiplier) {
  return CATEGORIES.map((c) => {
    const target = c.questTarget * multiplier;
    return {
      id: `cat-${c.key}-x${multiplier}`,
      type: "categoryExp",
      category: c.key,
      target,
      label: `${c.key}で${target}EXP`,
    };
  });
}

const DAILY_POOL = [
  ...buildCategoryQuests(1),
  { id: "any3", type: "recordCount", category: null, target: 3, label: "記録を3件追加する" },
  { id: "total50", type: "totalExp", category: null, target: 50, label: "合計50EXP達成" },
  { id: "streak3", type: "streak", target: 3, label: "3日連続で記録する" },
  { id: "streak7", type: "streak", target: 7, label: "7日連続で記録する" },
  { id: "day-night21", type: "timeOfDay", mode: "after", hour: 21, target: 1, label: "21時以降に記録する" },
  { id: "day-morning9", type: "timeOfDay", mode: "before", hour: 9, target: 1, label: "9時より前に記録する" },
  { id: "day-diversity3", type: "categoryDiversity", target: 3, label: "今日3種類以上のカテゴリで記録する" },
];

const WEEKLY_POOL = [
  ...buildCategoryQuests(3),
  { id: "week-record10", type: "recordCount", category: null, target: 10, label: "今週の記録を10件追加する" },
  { id: "week-total200", type: "totalExp", category: null, target: 200, label: "今週の合計200EXP達成" },
  { id: "week-total350", type: "totalExp", category: null, target: 350, label: "今週の合計350EXP達成" },
  { id: "week-streak5", type: "streak", target: 5, label: "5日連続で記録する" },
  { id: "week-night21", type: "timeOfDay", mode: "after", hour: 21, target: 1, label: "今週、21時以降に記録する日を作る" },
  { id: "week-diversity5", type: "categoryDiversity", target: 5, label: "今週5種類以上のカテゴリで記録する" },
];

const MONTHLY_POOL = [
  ...buildCategoryQuests(8),
  { id: "month-record30", type: "recordCount", category: null, target: 30, label: "今月の記録を30件追加する" },
  { id: "month-total800", type: "totalExp", category: null, target: 800, label: "今月の合計800EXP達成" },
  { id: "month-total1500", type: "totalExp", category: null, target: 1500, label: "今月の合計1500EXP達成" },
  { id: "month-streak10", type: "streak", target: 10, label: "10日連続で記録する" },
  { id: "month-diversity7", type: "categoryDiversity", target: 7, label: "今月7種類以上のカテゴリで記録する" },
];

const QUEST_COUNT = { daily: 4, weekly: 4, monthly: 3 };

function pickQuests(pool, count, seedKey) {
  // periodKey（日付やweekKeyなど）を種にして同じ期間内では常に同じ組み合わせになるようにする
  let seed = 0;
  for (let i = 0; i < seedKey.length; i++) seed = (seed * 31 + seedKey.charCodeAt(i)) >>> 0;

  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    seed = (seed * 1103515245 + 12345) >>> 0;
    const j = seed % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count).map((quest) => ({ ...quest }));
}

export function generateQuests(periodType, periodKey) {
  const pool = { daily: DAILY_POOL, weekly: WEEKLY_POOL, monthly: MONTHLY_POOL }[periodType];
  return pickQuests(pool, QUEST_COUNT[periodType], `${periodType}-${periodKey}`);
}

export function evaluateQuest(quest, periodRecords, context = {}) {
  let current = 0;

  if (quest.type === "categoryExp") {
    current = periodRecords
      .filter((r) => r.category === quest.category)
      .reduce((sum, r) => sum + r.exp, 0);
  } else if (quest.type === "recordCount") {
    current = quest.category
      ? periodRecords.filter((r) => r.category === quest.category).length
      : periodRecords.length;
  } else if (quest.type === "totalExp") {
    current = periodRecords.reduce((sum, r) => sum + r.exp, 0);
  } else if (quest.type === "streak") {
    current = context.recordsByDate ? computeCurrentStreak(context.recordsByDate, context.todayKeyValue) : 0;
  } else if (quest.type === "timeOfDay") {
    const matches = periodRecords.some((r) => {
      const hour = new Date(r.createdAt).getHours();
      return quest.mode === "after" ? hour >= quest.hour : hour < quest.hour;
    });
    current = matches ? 1 : 0;
  } else if (quest.type === "categoryDiversity") {
    current = countTouchedCategories(periodRecords);
  }

  return {
    current: Math.min(current, quest.target),
    target: quest.target,
    done: current >= quest.target,
  };
}

// ---------- スペシャル（累計EXPマイルストーン） ----------

export const SPECIAL_MILESTONES = [
  { id: "sp-300", threshold: 300, reward: 50, icon: "🥉", label: "累計300EXP到達" },
  { id: "sp-800", threshold: 800, reward: 80, icon: "🥈", label: "累計800EXP到達" },
  { id: "sp-1500", threshold: 1500, reward: 120, icon: "🥇", label: "累計1500EXP到達" },
  { id: "sp-3000", threshold: 3000, reward: 200, icon: "💠", label: "累計3000EXP到達" },
  { id: "sp-5000", threshold: 5000, reward: 300, icon: "👑", label: "累計5000EXP到達" },
  { id: "sp-10000", threshold: 10000, reward: 500, icon: "🏆", label: "累計10000EXP到達" },
  { id: "sp-20000", threshold: 20000, reward: 800, icon: "🌌", label: "累計20000EXP到達" },
];

export function getNextSpecialMilestone(claimedIds) {
  return SPECIAL_MILESTONES.find((m) => !claimedIds.includes(m.id)) || null;
}

// totalExp が新たに超えたが未クレームのマイルストーンを全て返す
export function findNewlyReachedMilestones(totalExp, claimedIds) {
  return SPECIAL_MILESTONES.filter((m) => totalExp >= m.threshold && !claimedIds.includes(m.id));
}
