// ==========================================================
// coachSystem.js — AIコーチのヒント（今は固定ロジック）
// 将来的にAIによる分析・提案へ差し替えやすいよう、
// 「今のルールベース実装」であることを明示しておく。
// ==========================================================

import { CATEGORIES } from "./categories.js";

function categoryHintFor(lifeStatKey) {
  const category = CATEGORIES.find((c) => c.lifeStat === lifeStatKey);
  return category ? `「${category.key}」の記録を追加してみましょう` : "";
}

export function computeCoachTips({ lifeStatuses, achievements, todayRecords }) {
  const weakestStat = [...lifeStatuses].sort((a, b) => a.exp - b.exp)[0] || null;

  // ACHIEVEMENT_LIST はおおむね達成しやすい順に並んでいるため、
  // 先頭にある未達成の実績を「一番近い実績」の簡易的な代用とする。
  const nextAchievement = achievements.find((a) => !a.unlocked) || null;

  const dailyMessage =
    todayRecords.length === 0
      ? "今日はまだ記録がありません 何か1つ頑張ったことを記録してみましょう"
      : "今日も記録できています この調子で続けましょう";

  return {
    dailyMessage,
    weakestStat,
    weakestStatHint: weakestStat ? categoryHintFor(weakestStat.key) : "",
    nextAchievement,
  };
}
