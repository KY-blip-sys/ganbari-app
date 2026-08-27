// ==========================================================
// achievementView.js — 実績（トロフィー）画面の描画
// ==========================================================

import { showHint } from "./hintPopup.js";

const containerEl = document.getElementById("achievements-content");

function tileMarkup(a, index) {
  const secretLocked = !a.unlocked && a.secret;
  return `
    <button type="button" class="achievement-tile tap-scale ${a.unlocked ? "unlocked" : "locked"}" data-index="${index}">
      <span class="achievement-tile-icon">${a.unlocked ? a.icon : secretLocked ? "❔" : "🔒"}</span>
      <span class="achievement-tile-name">${a.unlocked ? a.name : secretLocked ? "？？？（シークレット）" : "？？？"}</span>
      <span class="achievement-tile-desc">${a.unlocked ? a.description : "タップしてヒントを見る"}</span>
    </button>
  `;
}

export function renderAchievements(achievements) {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  containerEl.innerHTML = `
    <p class="card-label">達成済み ${unlockedCount} / ${achievements.length}</p>
    <div class="achievement-grid">
      ${achievements.map(tileMarkup).join("")}
    </div>
  `;

  containerEl.querySelectorAll(".achievement-tile").forEach((tileEl) => {
    tileEl.addEventListener("click", () => {
      const a = achievements[Number(tileEl.dataset.index)];
      if (a.unlocked) {
        showHint({ icon: a.icon, title: a.name, text: a.description });
      } else if (a.secret) {
        showHint({ icon: "❔", title: "シークレット実績", text: a.hint || "まだ手がかりがありません" });
      } else {
        showHint({ icon: "🔒", title: "未達成の実績", text: a.description });
      }
    });
  });
}
