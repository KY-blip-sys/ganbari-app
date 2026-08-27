// ==========================================================
// mapView.js — 人生マップ画面の描画
// ==========================================================

const containerEl = document.getElementById("map-content");

export function renderMap(mapProgress) {
  const { areas, currentArea, nextArea, progressRatio, expToNext, isFinalArea } = mapProgress;

  const pathHtml = areas
    .map(
      (a) => `
    <div class="map-area ${a.unlocked ? "unlocked" : "locked"} ${a.isCurrent ? "current" : ""}">
      <span class="map-area-icon">${a.icon}</span>
      <span class="map-area-name">${a.name}</span>
      ${a.isCurrent ? '<span class="map-area-here">現在地</span>' : ""}
      ${!a.unlocked ? '<span class="map-area-lock">🔒</span>' : ""}
    </div>
  `
    )
    .join("");

  const progressHtml = isFinalArea
    ? `<p class="map-progress-hint">🎉 最終エリアに到達しました！</p>`
    : `
      <div class="map-progress-track"><div class="map-progress-fill" style="width:${Math.round(progressRatio * 100)}%"></div></div>
      <p class="map-progress-hint">次のエリア「${nextArea.name}」まであと${expToNext}EXP</p>
    `;

  containerEl.innerHTML = `
    <p class="card-label">現在地：${currentArea.icon} ${currentArea.name}</p>
    <div class="map-path">${pathHtml}</div>
    ${progressHtml}
  `;
}
