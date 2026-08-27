// ==========================================================
// mapSystem.js — 人生マップ（累計EXPでエリアが解放される）
// ==========================================================

export const MAP_AREAS = [
  { id: "start", icon: "🌱", name: "スタート", threshold: 0 },
  { id: "forest-of-learning", icon: "📖", name: "学びの森", threshold: 200 },
  { id: "road-of-growth", icon: "🏃", name: "成長街道", threshold: 600 },
  { id: "career-city", icon: "🏙", name: "キャリア都市", threshold: 1500 },
  { id: "mountain-of-challenge", icon: "🏔", name: "挑戦の山", threshold: 3000 },
  { id: "ideal-self", icon: "🏰", name: "理想の自分", threshold: 6000 },
];

export function computeMapProgress(totalExp) {
  const exp = Math.max(0, totalExp);

  let currentIndex = 0;
  MAP_AREAS.forEach((area, i) => {
    if (exp >= area.threshold) currentIndex = i;
  });

  const nextArea = MAP_AREAS[currentIndex + 1] || null;
  const currentArea = MAP_AREAS[currentIndex];
  const progressRatio = nextArea
    ? (exp - currentArea.threshold) / (nextArea.threshold - currentArea.threshold)
    : 1;

  const areas = MAP_AREAS.map((area, i) => ({
    ...area,
    unlocked: i <= currentIndex,
    isCurrent: i === currentIndex,
  }));

  return {
    areas,
    currentIndex,
    currentArea,
    nextArea,
    progressRatio: Math.min(1, Math.max(0, progressRatio)),
    expToNext: nextArea ? nextArea.threshold - exp : 0,
    isFinalArea: !nextArea,
  };
}
