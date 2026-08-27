// ==========================================================
// statusCard.js — 人生ステータス（バー＋レベル）表示
// 複数の画面（ホームの簡易表示／ステータス画面のフル表示）から
// 呼べるよう、対象コンテナを引数で受け取る。
// ==========================================================

let onStatusClickCallback = null;

export function setOnStatusClick(callback) {
  onStatusClickCallback = callback;
}

export function renderLifeStatuses(containerEl, statuses) {
  containerEl.innerHTML = "";

  statuses.forEach(({ key, icon, level, progressRatio }) => {
    const row = document.createElement("button");
    row.className = "status-row tap-scale";
    row.innerHTML = `
      <span class="status-icon">${icon}</span>
      <span class="status-name">${key}</span>
      <span class="status-bar-track"><span class="status-bar-fill" style="width:${Math.round(progressRatio * 100)}%"></span></span>
      <span class="status-level">Lv.${level}</span>
      <span class="status-chevron">›</span>
    `;
    row.addEventListener("click", () => {
      if (onStatusClickCallback) onStatusClickCallback(key);
    });
    containerEl.appendChild(row);
  });
}

// ---------- レーダーチャート＋総合指標（ステータス画面の目玉演出） ----------

const RADAR_SIZE = 220;
const RADAR_CENTER = RADAR_SIZE / 2;
const RADAR_RADIUS = 82;

function radarXY(index, total, ratio) {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / total;
  return {
    x: RADAR_CENTER + RADAR_RADIUS * ratio * Math.cos(angle),
    y: RADAR_CENTER + RADAR_RADIUS * ratio * Math.sin(angle),
  };
}

function pointsAttr(points) {
  return points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
}

function radarChartMarkup(radar) {
  const total = radar.length;

  const gridPolygons = [0.25, 0.5, 0.75, 1]
    .map(
      (lv) =>
        `<polygon class="status-radar-grid" points="${pointsAttr(radar.map((_, i) => radarXY(i, total, lv)))}"></polygon>`
    )
    .join("");

  const axisLines = radar
    .map((_, i) => {
      const p = radarXY(i, total, 1);
      return `<line class="status-radar-axis" x1="${RADAR_CENTER}" y1="${RADAR_CENTER}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}"></line>`;
    })
    .join("");

  const dataPoints = radar.map((s, i) => radarXY(i, total, s.ratio));
  const dataPolygon = `<polygon class="status-radar-shape" points="${pointsAttr(dataPoints)}"></polygon>`;
  const dataDots = dataPoints
    .map((p) => `<circle class="status-radar-dot" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3.5"></circle>`)
    .join("");

  const labels = radar
    .map((s, i) => {
      const p = radarXY(i, total, 1.22);
      return `<text class="status-radar-label" x="${p.x.toFixed(1)}" y="${p.y.toFixed(1)}" text-anchor="middle" dominant-baseline="middle">${s.icon}</text>`;
    })
    .join("");

  return `<svg class="status-radar-svg" viewBox="0 0 ${RADAR_SIZE} ${RADAR_SIZE}">${gridPolygons}${axisLines}${dataPolygon}${dataDots}${labels}</svg>`;
}

export function renderStatusOverview(containerEl, overview) {
  containerEl.innerHTML = `
    <div class="status-overview-chart">${radarChartMarkup(overview.radar)}</div>
    <div class="status-overview-stats">
      <div class="status-overview-stat">
        <p class="status-overview-stat-label">総合ランク</p>
        <p class="status-overview-stat-value">${overview.rank.rank}<span class="status-overview-stat-sub">${overview.rank.label}</span></p>
      </div>
      <div class="status-overview-stat">
        <p class="status-overview-stat-label">平均Lv</p>
        <p class="status-overview-stat-value">${overview.averageLevel.toFixed(1)}</p>
      </div>
      <div class="status-overview-stat">
        <p class="status-overview-stat-label">合計Lv</p>
        <p class="status-overview-stat-value">${overview.totalLevel}</p>
      </div>
    </div>
  `;
}
