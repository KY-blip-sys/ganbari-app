// ==========================================================
// skillSystem.js — スキルツリー（画面のみ実装、解放条件は仮値）
// 人生ステータスの「レベル」を条件にスキルが解放される。
// しきい値は指示書の「条件は今後調整」を受けた仮の値。
// 各ステータスは2〜3系統（サブテーマ）に分岐し、テーマの一貫性を
// 保ちながら並行して解放されていく構成にしている。
// ==========================================================

export const SKILL_TREES = {
  学び: [
    {
      id: "learning-habit",
      label: "学習習慣",
      nodes: [
        { id: "study-habit", icon: "📖", name: "学習習慣", requiredLevel: 2 },
        { id: "note-master", icon: "📝", name: "ノート術マスター", requiredLevel: 6 },
        { id: "certificate-collector", icon: "🎓", name: "資格コレクター", requiredLevel: 12 },
        { id: "sage", icon: "🧙", name: "賢者", requiredLevel: 20 },
      ],
    },
    {
      id: "reading",
      label: "読書",
      nodes: [
        { id: "reader", icon: "📚", name: "読書家", requiredLevel: 3 },
        { id: "well-read", icon: "📕", name: "多読家", requiredLevel: 8 },
        { id: "bookworm", icon: "🐛", name: "読書の虫", requiredLevel: 14 },
        { id: "book-collector", icon: "🏛️", name: "蔵書家", requiredLevel: 22 },
      ],
    },
    {
      id: "english",
      label: "英語",
      nodes: [
        { id: "english-beginner", icon: "🔤", name: "英語入門", requiredLevel: 4 },
        { id: "english-master", icon: "🌍", name: "英語マスター", requiredLevel: 9 },
        { id: "bilingual", icon: "🗣️", name: "バイリンガル", requiredLevel: 16 },
        { id: "global-connector", icon: "🌏", name: "世界を繋ぐ人", requiredLevel: 24 },
      ],
    },
  ],
  健康: [
    {
      id: "exercise",
      label: "運動",
      nodes: [
        { id: "exercise-habit", icon: "🏃", name: "運動習慣", requiredLevel: 2 },
        { id: "athlete", icon: "🏅", name: "アスリート", requiredLevel: 8 },
        { id: "iron-will", icon: "🦾", name: "鉄の意志", requiredLevel: 14 },
        { id: "living-legend", icon: "🐉", name: "生ける伝説", requiredLevel: 22 },
      ],
    },
    {
      id: "diet-sleep",
      label: "食事・睡眠",
      nodes: [
        { id: "early-riser", icon: "🌅", name: "早寝早起き", requiredLevel: 3 },
        { id: "health-management", icon: "🥗", name: "健康管理", requiredLevel: 9 },
        { id: "nutrition-meister", icon: "🍽️", name: "栄養マイスター", requiredLevel: 16 },
        { id: "unbreakable-body", icon: "🛡️", name: "不屈の肉体", requiredLevel: 24 },
      ],
    },
    {
      id: "self-care",
      label: "セルフケア",
      nodes: [
        { id: "stretch-habit", icon: "🤸", name: "ストレッチ習慣", requiredLevel: 4 },
        { id: "stoic-master", icon: "🧘", name: "ストイックマスター", requiredLevel: 10 },
        { id: "recovery-master", icon: "💆", name: "回復の達人", requiredLevel: 18 },
        { id: "ageless-body", icon: "♻️", name: "不老の身体", requiredLevel: 25 },
      ],
    },
  ],
  お金: [
    {
      id: "income-work",
      label: "収入・仕事",
      nodes: [
        { id: "income-up", icon: "📈", name: "収入アップ", requiredLevel: 2 },
        { id: "work-master", icon: "💼", name: "仕事の達人", requiredLevel: 8 },
        { id: "wealth-architect", icon: "🏛️", name: "富の建築家", requiredLevel: 14 },
        { id: "on-the-way-to-millions", icon: "👑", name: "億万長者への道", requiredLevel: 22 },
      ],
    },
    {
      id: "saving-management",
      label: "節約・管理",
      nodes: [
        { id: "saver", icon: "🪙", name: "節約家", requiredLevel: 3 },
        { id: "budget-keeper", icon: "📒", name: "家計管理人", requiredLevel: 9 },
        { id: "spending-optimizer", icon: "🧮", name: "支出の最適化", requiredLevel: 16 },
        { id: "financial-freedom", icon: "🕊️", name: "経済的自由への道", requiredLevel: 24 },
      ],
    },
    {
      id: "investment",
      label: "投資・資産形成",
      nodes: [
        { id: "investor-debut", icon: "📊", name: "投資家デビュー", requiredLevel: 4 },
        { id: "asset-builder", icon: "💎", name: "資産家", requiredLevel: 10 },
        { id: "portfolio-master", icon: "📑", name: "ポートフォリオマスター", requiredLevel: 18 },
        { id: "wealth-alchemist", icon: "🧪", name: "富の錬金術師", requiredLevel: 25 },
      ],
    },
  ],
  人間関係: [
    {
      id: "family-friends",
      label: "家族・友人",
      nodes: [
        { id: "good-listener", icon: "👂", name: "聞き上手", requiredLevel: 2 },
        { id: "circle-of-trust", icon: "💞", name: "信頼の輪", requiredLevel: 8 },
        { id: "heart-connector", icon: "🕊️", name: "心を繋ぐ人", requiredLevel: 14 },
        { id: "beloved", icon: "🏵️", name: "人望家", requiredLevel: 22 },
      ],
    },
    {
      id: "gratitude-kindness",
      label: "感謝・思いやり",
      nodes: [
        { id: "thoughtful", icon: "🎁", name: "気配り上手", requiredLevel: 3 },
        { id: "gratitude-master", icon: "🙏", name: "感謝の達人", requiredLevel: 9 },
        { id: "kindness-embodied", icon: "💗", name: "思いやりの化身", requiredLevel: 16 },
        { id: "compassionate-one", icon: "☺️", name: "慈愛の人", requiredLevel: 24 },
      ],
    },
    {
      id: "communication",
      label: "コミュニケーション",
      nodes: [
        { id: "good-talker", icon: "💬", name: "会話上手", requiredLevel: 4 },
        { id: "networker", icon: "🌐", name: "人脈王", requiredLevel: 10 },
        { id: "influencer", icon: "🎤", name: "影響力の達人", requiredLevel: 18 },
        { id: "legendary-leader", icon: "👑", name: "伝説のリーダー", requiredLevel: 25 },
      ],
    },
  ],
  趣味: [
    {
      id: "creation",
      label: "制作・創作",
      nodes: [
        { id: "first-step", icon: "🌱", name: "一歩を踏み出す", requiredLevel: 2 },
        { id: "craftsman", icon: "🛠️", name: "こだわり職人", requiredLevel: 8 },
        { id: "creator", icon: "🎬", name: "クリエイター", requiredLevel: 14 },
        { id: "meister", icon: "🥇", name: "マイスター", requiredLevel: 22 },
      ],
    },
    {
      id: "exploration",
      label: "探究・収集",
      nodes: [
        { id: "deep-diver", icon: "🔍", name: "没頭者", requiredLevel: 3 },
        { id: "collector", icon: "🗃️", name: "コレクター", requiredLevel: 9 },
        { id: "explorer-master", icon: "🔭", name: "探求の達人", requiredLevel: 16 },
        { id: "knowledgeable-collector", icon: "📚", name: "博識のコレクター", requiredLevel: 24 },
      ],
    },
    {
      id: "dedication",
      label: "継続・熱中",
      nodes: [
        { id: "continuer", icon: "👟", name: "継続の一歩", requiredLevel: 4 },
        { id: "hobby-master", icon: "🏆", name: "趣味の達人", requiredLevel: 10 },
        { id: "performer", icon: "🎭", name: "表現者", requiredLevel: 18 },
        { id: "legendary-hobbyist", icon: "🌟", name: "伝説の趣味人", requiredLevel: 25 },
      ],
    },
  ],
  生活力: [
    {
      id: "housework",
      label: "家事",
      nodes: [
        { id: "solo-living", icon: "🧹", name: "一人暮らしの第一歩", requiredLevel: 2 },
        { id: "tidy-master", icon: "🧺", name: "整理整頓の達人", requiredLevel: 8 },
        { id: "living-craftsman", icon: "🛋️", name: "暮らしの匠", requiredLevel: 14 },
        { id: "household-king", icon: "👑", name: "家事の王", requiredLevel: 22 },
      ],
    },
    {
      id: "cooking",
      label: "自炊",
      nodes: [
        { id: "home-cooking", icon: "🍳", name: "自炊習慣", requiredLevel: 3 },
        { id: "thrifty-cook", icon: "🥘", name: "節約自炊家", requiredLevel: 9 },
        { id: "nutrition-balancer", icon: "🥗", name: "栄養バランスの匠", requiredLevel: 16 },
        { id: "kitchen-meister", icon: "👨‍🍳", name: "キッチンマイスター", requiredLevel: 24 },
      ],
    },
    {
      id: "organizing",
      label: "整理整頓・段取り",
      nodes: [
        { id: "planner", icon: "📋", name: "段取り上手", requiredLevel: 4 },
        { id: "efficiency-master", icon: "⚙️", name: "効率化マスター", requiredLevel: 10 },
        { id: "scheduling-demon", icon: "🗓️", name: "スケジューリングの鬼", requiredLevel: 18 },
        { id: "life-master", icon: "🏡", name: "生活の達人", requiredLevel: 25 },
      ],
    },
  ],
  メンタル: [
    {
      id: "rest-recovery",
      label: "休息・回復",
      nodes: [
        { id: "deep-breath", icon: "🌬️", name: "深呼吸の習慣", requiredLevel: 2 },
        { id: "rest-master", icon: "😌", name: "休息の達人", requiredLevel: 8 },
        { id: "recovery-embodied", icon: "🔋", name: "回復力の化身", requiredLevel: 14 },
        { id: "unshakable-mind", icon: "🗿", name: "不動心", requiredLevel: 22 },
      ],
    },
    {
      id: "mindfulness",
      label: "マインドフルネス",
      nodes: [
        { id: "mindfulness-beginner", icon: "🧘", name: "マインドフルネス入門", requiredLevel: 3 },
        { id: "meditation-habit", icon: "🕯️", name: "瞑想習慣", requiredLevel: 9 },
        { id: "calm-master", icon: "☯️", name: "平常心の達人", requiredLevel: 16 },
        { id: "enlightened", icon: "🕉️", name: "悟りの境地", requiredLevel: 24 },
      ],
    },
    {
      id: "self-understanding",
      label: "自己理解",
      nodes: [
        { id: "emotion-control", icon: "🌊", name: "感情のコントロール", requiredLevel: 4 },
        { id: "stress-resilience", icon: "🛡️", name: "ストレス耐性", requiredLevel: 10 },
        { id: "introspector", icon: "🪞", name: "内省の探求者", requiredLevel: 18 },
        { id: "wise-heart", icon: "🧠", name: "賢者の心得", requiredLevel: 25 },
      ],
    },
  ],
};

export function computeSkillTree(lifeStatKey, statLevel) {
  return (SKILL_TREES[lifeStatKey] || []).map((branch) => ({
    ...branch,
    nodes: branch.nodes.map((node) => ({
      ...node,
      unlocked: statLevel >= node.requiredLevel,
    })),
  }));
}

export function computeAllSkillTrees(lifeStatuses) {
  return lifeStatuses.map(({ key, icon, level }) => ({
    key,
    icon,
    level,
    branches: computeSkillTree(key, level),
  }));
}
