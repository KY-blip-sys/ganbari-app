// ==========================================================
// mapSystem.js — 人生マップ（累計EXPでエリアが解放される）
// 総合マップに加え、ステータスごとのテーマ別マップを提供する
// ==========================================================

export const MAP_THEMES = [
  {
    id: "overall",
    label: "総合",
    icon: "public",
    statKey: null,
    areas: [
      { id: "start", icon: "eco", name: "スタート" },
      { id: "meadow", icon: "grass", name: "目覚めの草原" },
      { id: "forest-of-learning", icon: "auto_stories", name: "学びの森" },
      { id: "road-of-growth", icon: "directions_run", name: "成長街道" },
      { id: "mountain-of-challenge", icon: "terrain", name: "挑戦の山" },
      { id: "valley-of-passion", icon: "local_fire_department", name: "情熱の谷" },
      { id: "career-city", icon: "location_city", name: "キャリア都市" },
      { id: "tower-of-wisdom", icon: "apartment", name: "知恵の塔" },
      { id: "sea-of-glory", icon: "waves", name: "栄光の海" },
      { id: "ideal-self", icon: "workspace_premium", name: "理想の自分" },
    ],
    thresholds: [0, 150, 400, 800, 1500, 2500, 4000, 6000, 9000, 15000],
  },
  {
    id: "学び",
    label: "叡智の道",
    icon: "graduation-cap",
    statKey: "学び",
    areas: [
      { id: "start", icon: "eco", name: "スタート地点" },
      { id: "textbook-hill", icon: "import_contacts", name: "教科書の丘" },
      { id: "library-street", icon: "menu_book", name: "図書館通り" },
      { id: "forest-of-focus", icon: "park", name: "集中の森" },
      { id: "certification-bridge", icon: "confirmation_number", name: "検定合格の橋" },
      { id: "university-gate", icon: "account_balance", name: "大学の門" },
      { id: "researcher-tower", icon: "science", name: "研究者の塔" },
      { id: "sea-of-knowledge", icon: "waves", name: "知識の大海" },
      { id: "sages-hall", icon: "psychology", name: "賢者の間" },
      { id: "peak-of-wisdom", icon: "terrain", name: "叡智の頂" },
    ],
    thresholds: [0, 100, 300, 600, 1000, 1600, 2400, 3400, 4600, 6000],
  },
  {
    id: "健康",
    label: "鍛錬の道",
    icon: "heart",
    statKey: "健康",
    areas: [
      { id: "start", icon: "eco", name: "スタート地点" },
      { id: "morning-run", icon: "directions_run", name: "朝ランの小道" },
      { id: "gym-entrance", icon: "fitness_center", name: "ジムの入口" },
      { id: "protein-spring", icon: "sports_bar", name: "プロテインの泉" },
      { id: "muscle-hill", icon: "fitness_center", name: "筋肉の丘" },
      { id: "athlete-road", icon: "military_tech", name: "アスリート街道" },
      { id: "iron-bridge", icon: "bolt", name: "鉄人の橋" },
      { id: "unbreakable-range", icon: "terrain", name: "不屈の山脈" },
      { id: "legendary-arena", icon: "stadium", name: "伝説の闘技場" },
      { id: "peak-of-body", icon: "local_fire_department", name: "肉体の頂点" },
    ],
    thresholds: [0, 100, 300, 600, 1000, 1600, 2400, 3400, 4600, 6000],
  },
  {
    id: "お金",
    label: "繁栄の道",
    icon: "wallet",
    statKey: "お金",
    areas: [
      { id: "start", icon: "eco", name: "スタート地点" },
      { id: "saving-alley", icon: "savings", name: "節約横丁" },
      { id: "side-job-street", icon: "work", name: "副業通り" },
      { id: "savings-spring", icon: "account_balance", name: "貯金の泉" },
      { id: "investment-bridge", icon: "trending_up", name: "投資の橋" },
      { id: "asset-hill", icon: "diamond", name: "資産の丘" },
      { id: "startup-road", icon: "rocket_launch", name: "起業街道" },
      { id: "wealthy-district", icon: "location_city", name: "富豪街" },
      { id: "freedom-gate", icon: "flight", name: "経済的自由の門" },
      { id: "billionaire-castle", icon: "workspace_premium", name: "億万長者の城" },
    ],
    thresholds: [0, 100, 300, 600, 1000, 1600, 2400, 3400, 4600, 6000],
  },
  {
    id: "人間関係",
    label: "絆の道",
    icon: "people",
    statKey: "人間関係",
    areas: [
      { id: "start", icon: "eco", name: "スタート地点" },
      { id: "greeting-path", icon: "waving_hand", name: "挨拶の小道" },
      { id: "conversation-square", icon: "chat", name: "会話の広場" },
      { id: "friendship-bridge", icon: "handshake", name: "友情の橋" },
      { id: "trust-hill", icon: "favorite", name: "信頼の丘" },
      { id: "team-town", icon: "groups", name: "チームの街" },
      { id: "network-road", icon: "hub", name: "人脈街道" },
      { id: "influence-tower", icon: "campaign", name: "影響力の塔" },
      { id: "hall-of-fame", icon: "military_tech", name: "名声の間" },
      { id: "leaders-castle", icon: "workspace_premium", name: "伝説のリーダーの城" },
    ],
    thresholds: [0, 100, 300, 600, 1000, 1600, 2400, 3400, 4600, 6000],
  },
  {
    id: "趣味",
    label: "創造の道",
    icon: "palette",
    statKey: "趣味",
    areas: [
      { id: "start", icon: "eco", name: "スタート地点" },
      { id: "curiosity-path", icon: "star", name: "好奇心の小道" },
      { id: "workshop-of-challenge", icon: "build", name: "挑戦の工房" },
      { id: "forest-of-immersion", icon: "search", name: "没頭の森" },
      { id: "hill-of-works", icon: "image", name: "作品の丘" },
      { id: "stage-of-showcase", icon: "theater_comedy", name: "発表の舞台" },
      { id: "road-of-mastery", icon: "emoji_events", name: "匠の街道" },
      { id: "sea-of-creation", icon: "waves", name: "創造の大海" },
      { id: "masters-hall", icon: "theaters", name: "巨匠の間" },
      { id: "legendary-castle", icon: "workspace_premium", name: "伝説の趣味人の城" },
    ],
    thresholds: [0, 100, 300, 600, 1000, 1600, 2400, 3400, 4600, 6000],
  },
  {
    id: "生活力",
    label: "暮らしの道",
    icon: "house",
    statKey: "生活力",
    areas: [
      { id: "start", icon: "eco", name: "スタート地点" },
      { id: "cleaning-path", icon: "cleaning_services", name: "掃除の小道" },
      { id: "home-kitchen", icon: "restaurant", name: "自炊キッチン" },
      { id: "storage-hill", icon: "inventory_2", name: "収納の丘" },
      { id: "planning-bridge", icon: "checklist", name: "段取りの橋" },
      { id: "interior-road", icon: "weekend", name: "インテリア街道" },
      { id: "efficiency-tower", icon: "settings", name: "効率化の塔" },
      { id: "sea-of-living", icon: "waves", name: "暮らしの大海" },
      { id: "craftsman-hall", icon: "home_work", name: "匠の間" },
      { id: "household-castle", icon: "workspace_premium", name: "家事の王の城" },
    ],
    thresholds: [0, 100, 300, 600, 1000, 1600, 2400, 3400, 4600, 6000],
  },
  {
    id: "メンタル",
    label: "静寂の道",
    icon: "moon",
    statKey: "メンタル",
    areas: [
      { id: "start", icon: "eco", name: "スタート地点" },
      { id: "breathing-path", icon: "air", name: "深呼吸の小道" },
      { id: "meditation-square", icon: "self_improvement", name: "瞑想の広場" },
      { id: "river-of-emotion", icon: "waves", name: "感情の川" },
      { id: "resilience-bridge", icon: "shield", name: "ストレス耐性の橋" },
      { id: "calm-hill", icon: "self_improvement", name: "平常心の丘" },
      { id: "forest-of-introspection", icon: "visibility", name: "内省の森" },
      { id: "unshakable-range", icon: "terrain", name: "不動の山脈" },
      { id: "enlightenment-hall", icon: "self_improvement", name: "悟りの間" },
      { id: "peak-of-nirvana", icon: "auto_awesome", name: "涅槃の頂" },
    ],
    thresholds: [0, 100, 300, 600, 1000, 1600, 2400, 3400, 4600, 6000],
  },
];

export function computeMapThemesMeta() {
  return MAP_THEMES.map(({ id, label, icon }) => ({ id, label, icon }));
}

function expForTheme(theme, totalExp, lifeStatuses) {
  if (!theme.statKey) return Math.max(0, totalExp);
  const stat = lifeStatuses.find((s) => s.key === theme.statKey);
  return stat ? stat.exp : 0;
}

export function computeMapProgress(themeId, totalExp, lifeStatuses) {
  const theme = MAP_THEMES.find((t) => t.id === themeId) || MAP_THEMES[0];
  const exp = expForTheme(theme, totalExp, lifeStatuses);

  let currentIndex = 0;
  theme.thresholds.forEach((threshold, i) => {
    if (exp >= threshold) currentIndex = i;
  });

  const nextThreshold = theme.thresholds[currentIndex + 1];
  const currentThreshold = theme.thresholds[currentIndex];
  const progressRatio = nextThreshold !== undefined ? (exp - currentThreshold) / (nextThreshold - currentThreshold) : 1;

  const areas = theme.areas.map((area, i) => ({
    ...area,
    unlocked: i <= currentIndex,
    isCurrent: i === currentIndex,
  }));

  return {
    theme: { id: theme.id, label: theme.label, icon: theme.icon },
    areas,
    currentIndex,
    currentArea: theme.areas[currentIndex],
    nextArea: theme.areas[currentIndex + 1] || null,
    progressRatio: Math.min(1, Math.max(0, progressRatio)),
    expToNext: nextThreshold !== undefined ? nextThreshold - exp : 0,
    isFinalArea: nextThreshold === undefined,
  };
}
