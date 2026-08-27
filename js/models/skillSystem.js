// ==========================================================
// skillSystem.js — スキルツリー（画面のみ実装、解放条件は仮値）
// 人生ステータスの「レベル」を条件にスキルが解放される。
// しきい値は指示書の「条件は今後調整」を受けた仮の値。
// ==========================================================

export const SKILL_TREES = {
  学び: [
    { id: "study-habit", icon: "📖", name: "学習習慣", requiredLevel: 2 },
    { id: "reader", icon: "📚", name: "読書家", requiredLevel: 4 },
    { id: "note-master", icon: "📝", name: "ノート術マスター", requiredLevel: 6 },
    { id: "english-master", icon: "🌍", name: "英語マスター", requiredLevel: 9 },
    { id: "certificate-collector", icon: "🎓", name: "資格コレクター", requiredLevel: 12 },
    { id: "explorer", icon: "🔬", name: "探求者", requiredLevel: 16 },
    { id: "giant-of-knowledge", icon: "🗼", name: "知の巨人", requiredLevel: 20 },
    { id: "sage", icon: "🧙", name: "賢者", requiredLevel: 25 },
  ],
  健康: [
    { id: "exercise-habit", icon: "🏃", name: "運動習慣", requiredLevel: 2 },
    { id: "health-management", icon: "🥗", name: "健康管理", requiredLevel: 4 },
    { id: "early-riser", icon: "🌅", name: "早寝早起き", requiredLevel: 6 },
    { id: "athlete", icon: "🏅", name: "アスリート", requiredLevel: 9 },
    { id: "iron-will", icon: "🦾", name: "鉄の意志", requiredLevel: 12 },
    { id: "stoic-master", icon: "🧘", name: "ストイックマスター", requiredLevel: 16 },
    { id: "unbreakable-body", icon: "🛡️", name: "不屈の肉体", requiredLevel: 20 },
    { id: "living-legend", icon: "🐉", name: "生ける伝説", requiredLevel: 25 },
  ],
  お金: [
    { id: "saver", icon: "🪙", name: "節約家", requiredLevel: 2 },
    { id: "budget-keeper", icon: "📒", name: "家計管理人", requiredLevel: 4 },
    { id: "income-up", icon: "📈", name: "収入アップ", requiredLevel: 6 },
    { id: "investor-debut", icon: "📊", name: "投資家デビュー", requiredLevel: 9 },
    { id: "asset-builder", icon: "💎", name: "資産家", requiredLevel: 12 },
    { id: "financial-freedom", icon: "🕊️", name: "経済的自由への道", requiredLevel: 16 },
    { id: "wealth-architect", icon: "🏛️", name: "富の建築家", requiredLevel: 20 },
    { id: "on-the-way-to-millions", icon: "👑", name: "億万長者への道", requiredLevel: 25 },
  ],
  人間関係: [
    { id: "good-listener", icon: "👂", name: "聞き上手", requiredLevel: 2 },
    { id: "thoughtful", icon: "🎁", name: "気配り上手", requiredLevel: 4 },
    { id: "circle-of-trust", icon: "💞", name: "信頼の輪", requiredLevel: 6 },
    { id: "networker", icon: "🌐", name: "人脈王", requiredLevel: 9 },
    { id: "influencer", icon: "🎤", name: "影響力の達人", requiredLevel: 12 },
    { id: "heart-connector", icon: "🕊️", name: "心を繋ぐ人", requiredLevel: 16 },
    { id: "beloved", icon: "🏵️", name: "人望家", requiredLevel: 20 },
    { id: "legendary-leader", icon: "👑", name: "伝説のリーダー", requiredLevel: 25 },
  ],
  趣味: [
    { id: "first-step", icon: "🌱", name: "一歩を踏み出す", requiredLevel: 2 },
    { id: "deep-diver", icon: "🔍", name: "没頭者", requiredLevel: 4 },
    { id: "craftsman", icon: "🛠️", name: "こだわり職人", requiredLevel: 6 },
    { id: "hobby-master", icon: "🏆", name: "趣味の達人", requiredLevel: 9 },
    { id: "creator", icon: "🎬", name: "クリエイター", requiredLevel: 12 },
    { id: "performer", icon: "🎭", name: "表現者", requiredLevel: 16 },
    { id: "meister", icon: "🥇", name: "マイスター", requiredLevel: 20 },
    { id: "legendary-hobbyist", icon: "🌟", name: "伝説の趣味人", requiredLevel: 25 },
  ],
  生活力: [
    { id: "solo-living", icon: "🧹", name: "一人暮らしの第一歩", requiredLevel: 2 },
    { id: "home-cooking", icon: "🍳", name: "自炊習慣", requiredLevel: 4 },
    { id: "tidy-master", icon: "🧺", name: "整理整頓の達人", requiredLevel: 6 },
    { id: "planner", icon: "📋", name: "段取り上手", requiredLevel: 9 },
    { id: "living-craftsman", icon: "🛋️", name: "暮らしの匠", requiredLevel: 12 },
    { id: "efficiency-master", icon: "⚙️", name: "効率化マスター", requiredLevel: 16 },
    { id: "life-master", icon: "🏡", name: "生活の達人", requiredLevel: 20 },
    { id: "household-king", icon: "👑", name: "家事の王", requiredLevel: 25 },
  ],
  メンタル: [
    { id: "deep-breath", icon: "🌬️", name: "深呼吸の習慣", requiredLevel: 2 },
    { id: "mindfulness-beginner", icon: "🧘", name: "マインドフルネス入門", requiredLevel: 4 },
    { id: "emotion-control", icon: "🌊", name: "感情のコントロール", requiredLevel: 6 },
    { id: "stress-resilience", icon: "🛡️", name: "ストレス耐性", requiredLevel: 9 },
    { id: "calm-master", icon: "☯️", name: "平常心の達人", requiredLevel: 12 },
    { id: "introspector", icon: "🪞", name: "内省の探求者", requiredLevel: 16 },
    { id: "unshakable-mind", icon: "🗿", name: "不動心", requiredLevel: 20 },
    { id: "enlightened", icon: "🕉️", name: "悟りの境地", requiredLevel: 25 },
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
