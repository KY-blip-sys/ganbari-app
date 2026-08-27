// ==========================================================
// skillSystem.js — スキルツリー（画面のみ実装、解放条件は仮値）
// 人生ステータスの「レベル」を条件にスキルが解放される。
// しきい値は指示書の「条件は今後調整」を受けた仮の値。
// ==========================================================

export const SKILL_TREES = {
  学び: [
    { id: "study-habit", icon: "📖", name: "学習習慣", requiredLevel: 2 },
    { id: "reader", icon: "📚", name: "読書家", requiredLevel: 5 },
    { id: "english-master", icon: "🌍", name: "英語マスター", requiredLevel: 10 },
    { id: "certificate-collector", icon: "🎓", name: "資格コレクター", requiredLevel: 15 },
  ],
  健康: [
    { id: "exercise-habit", icon: "🏃", name: "運動習慣", requiredLevel: 2 },
    { id: "health-management", icon: "🥗", name: "健康管理", requiredLevel: 5 },
    { id: "athlete", icon: "🏅", name: "アスリート", requiredLevel: 10 },
  ],
  お金: [
    { id: "saver", icon: "🪙", name: "節約家", requiredLevel: 2 },
    { id: "income-up", icon: "📈", name: "収入アップ", requiredLevel: 5 },
    { id: "asset-builder", icon: "💎", name: "資産家", requiredLevel: 10 },
  ],
  人間関係: [
    { id: "good-listener", icon: "👂", name: "聞き上手", requiredLevel: 2 },
    { id: "circle-of-trust", icon: "💞", name: "信頼の輪", requiredLevel: 5 },
    { id: "networker", icon: "🌐", name: "人脈王", requiredLevel: 10 },
  ],
  趣味: [
    { id: "first-step", icon: "🌱", name: "一歩を踏み出す", requiredLevel: 2 },
    { id: "deep-diver", icon: "🔍", name: "没頭者", requiredLevel: 5 },
    { id: "hobby-master", icon: "🏆", name: "趣味の達人", requiredLevel: 10 },
  ],
};

export function computeSkillTree(lifeStatKey, statLevel) {
  return (SKILL_TREES[lifeStatKey] || []).map((node) => ({
    ...node,
    unlocked: statLevel >= node.requiredLevel,
  }));
}

export function computeAllSkillTrees(lifeStatuses) {
  return lifeStatuses.map(({ key, icon, level }) => ({
    key,
    icon,
    level,
    nodes: computeSkillTree(key, level),
  }));
}
