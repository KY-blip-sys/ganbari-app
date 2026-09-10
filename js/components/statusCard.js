// ==========================================================
// statusCard.js — 人生ステータス（バー＋レベル）表示
// 複数の画面（ホームの簡易表示／ステータス画面のフル表示）から
// 呼べるよう、対象コンテナを引数で受け取る。
// ==========================================================

import { iconSvg, iconPathsMarkup } from "../utils/icons.js";

let onStatusClickCallback = null;

export function setOnStatusClick(callback) {
  onStatusClickCallback = callback;
}

export function renderLifeStatuses(containerEl, statuses) {
  containerEl.innerHTML = "";

  statuses.forEach(({ key, icon, level, progressRatio, expToNext }) => {
    const row = document.createElement("button");
    row.className = "status-row tap-scale";
    row.innerHTML = `
      <div class="status-row-top">
        <span class="status-icon">${iconSvg(icon || "badge", { size: 18 })}</span>
        <span class="status-name">${key}</span>
        <span class="status-level">Lv.${level}</span>
        <span class="status-chevron">›</span>
      </div>
      <div class="status-row-bottom">
        <span class="status-bar-track"><span class="status-bar-fill" style="width:${Math.round(progressRatio * 100)}%"></span></span>
        <span class="status-next-exp">次まで${expToNext}EXP</span>
      </div>
    `;
    row.addEventListener("click", () => {
      if (onStatusClickCallback) onStatusClickCallback(key);
    });
    containerEl.appendChild(row);
  });
}

// ---------- レーダーチャート＋総合指標（ステータス画面の目玉演出） ----------

const RADAR_SIZE = 260;
const RADAR_CENTER = RADAR_SIZE / 2;
const RADAR_RADIUS = 96;

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

  const LABEL_ICON_SCALE = 0.72;
  const LABEL_ICON_HALF = 12 * LABEL_ICON_SCALE;
  const labels = radar
    .map((s, i) => {
      const p = radarXY(i, total, 1.22);
      const x = (p.x - LABEL_ICON_HALF).toFixed(1);
      const y = (p.y - LABEL_ICON_HALF).toFixed(1);
      return `<g class="status-radar-label" transform="translate(${x},${y}) scale(${LABEL_ICON_SCALE})">${iconPathsMarkup(s.icon)}</g>`;
    })
    .join("");

  const dataPoints = radar.map((s, i) => radarXY(i, total, s.ratio));
  const dataPolygon = `<polygon class="status-radar-shape" points="${pointsAttr(dataPoints)}"></polygon>`;
  const dataDots = dataPoints
    .map((p) => `<circle class="status-radar-dot" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3.5"></circle>`)
    .join("");

  return `<svg class="status-radar-svg" viewBox="0 0 ${RADAR_SIZE} ${RADAR_SIZE}">
    <g class="status-radar-base">${gridPolygons}${axisLines}${labels}</g>
    <g class="status-radar-shape-group" style="transform-origin:${RADAR_CENTER}px ${RADAR_CENTER}px">${dataPolygon}${dataDots}</g>
  </svg>`;
}

export function renderStatusOverview(containerEl, overview) {
  const { rank, nextRank, expToNextRank, rankProgressRatio, averageLevel, totalLevel } = overview;

  const rankProgressMarkup = nextRank
    ? `
      <div class="status-rank-badge-progress">
        <div class="exp-bar-track"><div class="exp-bar-fill" style="width:${Math.round(rankProgressRatio * 100)}%"></div></div>
        <p class="status-rank-badge-hint">あと${expToNextRank}EXPで${nextRank.rank}ランク</p>
      </div>
    `
    : `<p class="status-rank-badge-hint">最高ランクに到達しました</p>`;

  containerEl.innerHTML = `
    <div class="status-overview-chart">${radarChartMarkup(overview.radar)}</div>
    <div class="status-rank-badge" style="--rank-color:var(--rank-${rank.tier})">
      <p class="status-rank-badge-label">総合ランク</p>
      <p class="status-rank-badge-value">${rank.rank}<span class="status-rank-badge-sub">${rank.label}</span></p>
      ${rankProgressMarkup}
    </div>
    <div class="status-overview-stats">
      <div class="status-overview-stat">
        <p class="status-overview-stat-label">平均Lv</p>
        <p class="status-overview-stat-value">${averageLevel.toFixed(1)}</p>
      </div>
      <div class="status-overview-stat">
        <p class="status-overview-stat-label">合計Lv</p>
        <p class="status-overview-stat-value">${totalLevel}</p>
      </div>
    </div>
  `;
}
