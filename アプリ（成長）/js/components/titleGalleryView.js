// ==========================================================
// titleGalleryView.js — 称号ギャラリー画面の描画
// ==========================================================

const containerEl = document.getElementById("titles-content");

export function renderTitleGallery(titles) {
  const earnedCount = titles.filter((t) => t.earned).length;

  containerEl.innerHTML = `
    <p class="card-label">獲得済み ${earnedCount} / ${titles.length}</p>
    <div class="title-gallery-grid">
      ${titles
        .map(
          (t) => `
        <div class="title-gallery-tile ${t.earned ? "unlocked" : "locked"}">
          <span class="title-gallery-icon">${t.earned ? t.icon : "🔒"}</span>
          <span class="title-gallery-name">${t.earned ? t.name : "？？？"}</span>
        </div>
      `
        )
        .join("")}
    </div>
  `;
}
