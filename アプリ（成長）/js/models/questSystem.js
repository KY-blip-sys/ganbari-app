// ==========================================================
// questSystem.js — デイリークエストの生成と達成判定
// ==========================================================

import { CATEGORIES } from "./categories.js";

export const QUEST_REWARD_EXP = 30;

// カテゴリごとのEXPクエストを categories.js から自動生成することで、
// カテゴリの表記ゆれや反映漏れを防ぐ（全カテゴリが必ずクエスト判定の対象になる）。
const CATEGORY_QUESTS = CATEGORIES.map((c) => ({
  id: `cat-${c.key}`,
  type: "categoryExp",
  category: c.key,
  target: c.questTarget,
  label: `${c.key}で${c.questTarget}EXP`,
}));

const META_QUESTS = [
  { id: "any3", type: "recordCount", category: null, target: 3, label: "記録を3件追加する" },
  { id: "total50", type: "totalExp", category: null, target: 50, label: "合計50EXP達成" },
];

const QUEST_POOL = [...CATEGORY_QUESTS, ...META_QUESTS];

export function generateDailyQuests() {
  const shuffled = [...QUEST_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3).map((quest) => ({ ...quest }));
}

export function evaluateQuest(quest, todayRecords) {
  let current = 0;

  if (quest.type === "categoryExp") {
    current = todayRecords
      .filter((r) => r.category === quest.category)
      .reduce((sum, r) => sum + r.exp, 0);
  } else if (quest.type === "recordCount") {
    current = quest.category
      ? todayRecords.filter((r) => r.category === quest.category).length
      : todayRecords.length;
  } else if (quest.type === "totalExp") {
    current = todayRecords.reduce((sum, r) => sum + r.exp, 0);
  }

  return {
    current: Math.min(current, quest.target),
    target: quest.target,
    done: current >= quest.target,
  };
}
