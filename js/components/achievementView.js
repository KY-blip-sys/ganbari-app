// ==========================================================
// achievementView.js — 実績（トロフィー）画面の描画
// ==========================================================

const containerEl = document.getElementById("achievements-content");

function tileMarkup(a) {
  return `
    <div class="achievement-tile ${a.unlocked ? "unlocked" : "locked"}">
      <span class="achievement-tile-icon">${a.unlocked ? a.icon : "🔒"}</span>
      <span class="achievement-tile-name">${a.unlocked ? a.name : "？？？"}</span>
      <span class="achievement-tile-desc">${a.unlocked ? a.description : "未達成"}</span>
    </div>
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
}
