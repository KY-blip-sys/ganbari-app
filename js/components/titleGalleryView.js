// ==========================================================
// titleGalleryView.js — 称号ギャラリー画面の描画
// ==========================================================

import { showHint } from "./hintPopup.js";

const containerEl = document.getElementById("titles-content");

function tileMarkup(t, index) {
  const secretLocked = !t.earned && t.secret;
  return `
    <button type="button" class="title-gallery-tile tap-scale ${t.earned ? "unlocked" : "locked"}" data-index="${index}">
      <span class="title-gallery-icon">${t.earned ? t.icon : secretLocked ? "❔" : "🔒"}</span>
      <span class="title-gallery-name">${t.earned ? t.name : secretLocked ? "？？？（シークレット）" : "？？？"}</span>
    </button>
  `;
}

export function renderTitleGallery(titles) {
  const earnedCount = titles.filter((t) => t.earned).length;

  containerEl.innerHTML = `
    <p class="card-label">獲得済み ${earnedCount} / ${titles.length}</p>
    <div class="title-gallery-grid">
      ${titles.map(tileMarkup).join("")}
    </div>
  `;

  containerEl.querySelectorAll(".title-gallery-tile").forEach((tileEl) => {
    tileEl.addEventListener("click", () => {
      const t = titles[Number(tileEl.dataset.index)];
      if (t.earned) {
        showHint({ icon: t.icon, title: t.name, text: t.description || "獲得済みの称号です" });
      } else if (t.secret) {
        showHint({ icon: "❔", title: "シークレット称号", text: t.hint || "まだ手がかりがありません" });
      } else {
        showHint({ icon: "🔒", title: "未獲得の称号", text: t.description || "条件はまだ不明です" });
      }
    });
  });
}
