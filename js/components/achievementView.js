// ==========================================================
// achievementView.js — 実績（トロフィー）画面の描画
// ==========================================================

import { showHint } from "./hintPopup.js";
import { iconMarkup } from "../utils/icons.js";

const containerEl = document.getElementById("achievements-content");

// 達成の瞬間だけカードが拡大して光る演出を出すための、直前の解放状態
let previousUnlockedIds = null;

function tileMarkup(a, index, justUnlocked) {
  const secretLocked = !a.unlocked && a.secret;
  const iconName = a.unlocked ? a.icon : secretLocked ? "❓" : "🔒";
  return `
    <button type="button" class="achievement-tile tap-scale ${a.unlocked ? "unlocked" : "locked"} ${justUnlocked ? "achievement-tile-pop" : ""}" data-index="${index}">
      <span class="achievement-tile-icon">${iconMarkup(iconName, { size: 26 })}</span>
      <span class="achievement-tile-name">${a.unlocked ? a.name : secretLocked ? "？？？（シークレット）" : "？？？"}</span>
      <span class="achievement-tile-desc">${a.unlocked ? a.description : "タップしてヒントを見る"}</span>
    </button>
  `;
}

export function renderAchievements(achievements) {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const currentUnlockedIds = new Set(achievements.filter((a) => a.unlocked).map((a) => a.id));
  const seenBefore = previousUnlockedIds !== null;

  containerEl.innerHTML = `
    <p class="card-label">達成済み ${unlockedCount} / ${achievements.length}</p>
    <div class="achievement-grid">
      ${achievements
        .map((a, index) => tileMarkup(a, index, seenBefore && a.unlocked && !previousUnlockedIds.has(a.id)))
        .join("")}
    </div>
  `;

  previousUnlockedIds = currentUnlockedIds;

  containerEl.querySelectorAll(".achievement-tile").forEach((tileEl) => {
    tileEl.addEventListener("click", () => {
      const a = achievements[Number(tileEl.dataset.index)];
      if (a.unlocked) {
        showHint({ icon: a.icon, title: a.name, text: a.description });
      } else if (a.secret) {
        showHint({ icon: "❓", title: "シークレット実績", text: a.hint || "まだ手がかりがありません" });
      } else {
        showHint({ icon: "🔒", title: "未達成の実績", text: a.description });
      }
    });
  });
}
