// ==========================================================
// statusDetailView.js — ステータス詳細（内訳／推移／次の目標）モーダル
// ==========================================================

const overlayEl = document.getElementById("status-detail-overlay");
const iconEl = document.getElementById("status-detail-icon");
const titleEl = document.getElementById("status-detail-title");
const levelEl = document.getElementById("status-detail-level");
const barFillEl = document.getElementById("status-detail-bar-fill");
const hintEl = document.getElementById("status-detail-hint");
const breakdownEl = document.getElementById("status-detail-breakdown");
const trendEl = document.getElementById("status-detail-trend");
const goalsEl = document.getElementById("status-detail-goals");
const closeBtn = document.getElementById("btn-status-detail-close");

export function initStatusDetail() {
  closeBtn.addEventListener("click", closeStatusDetail);
  overlayEl.addEventListener("click", (e) => {
    if (e.target === overlayEl) closeStatusDetail();
  });
}

function renderBreakdown(breakdown) {
  if (!breakdown.length) {
    breakdownEl.innerHTML = `<p class="record-empty">まだ記録がありません</p>`;
    return;
  }

  breakdownEl.innerHTML = breakdown
    .map(
      (b) => `
    <div class="status-detail-breakdown-row">
      <span class="status-detail-breakdown-icon">${b.icon}</span>
      <span class="status-detail-breakdown-name">${b.category}</span>
      <span class="status-bar-track"><span class="status-bar-fill" style="width:${Math.round(b.ratio * 100)}%"></span></span>
      <span class="status-detail-breakdown-exp">${b.exp}EXP</span>
    </div>
  `
    )
    .join("");
}

function renderTrend(trend) {
  const maxExp = Math.max(1, ...trend.map((t) => t.exp));

  trendEl.innerHTML = `
    <div class="trend-bars">
      ${trend
        .map(
          (t) => `
        <div class="trend-bar-col" title="${t.exp}EXP">
          <div class="trend-bar" style="height:${Math.max(4, Math.round((t.exp / maxExp) * 100))}%"></div>
        </div>
      `
        )
        .join("")}
    </div>
  `;
}

function renderGoals(nextSkill, nextAchievement) {
  const items = [];

  if (nextSkill) {
    items.push(`
      <div class="status-detail-goal-item">
        <span class="status-detail-goal-icon">🔒</span>
        <div class="status-detail-goal-text">
          <p class="status-detail-goal-title">${nextSkill.name}</p>
          <p class="status-detail-goal-desc">Lv.${nextSkill.requiredLevel}で解放</p>
        </div>
      </div>
    `);
  }

  if (nextAchievement) {
    items.push(`
      <div class="status-detail-goal-item">
        <span class="status-detail-goal-icon">${nextAchievement.icon}</span>
        <div class="status-detail-goal-text">
          <p class="status-detail-goal-title">${nextAchievement.name}</p>
          <p class="status-detail-goal-desc">${nextAchievement.description}</p>
        </div>
      </div>
    `);
  }

  goalsEl.innerHTML = items.length ? items.join("") : `<p class="record-empty">すべての目標を達成しました</p>`;
}

export function openStatusDetail({
  key,
  icon,
  level,
  progressRatio,
  expToNext,
  breakdown,
  trend,
  nextSkill,
  nextAchievement,
}) {
  iconEl.textContent = icon;
  titleEl.textContent = key;
  levelEl.textContent = `Lv.${level}`;
  barFillEl.style.width = `${Math.round(progressRatio * 100)}%`;
  hintEl.textContent = `あと${expToNext}EXPでレベルアップ`;

  renderBreakdown(breakdown);
  renderTrend(trend);
  renderGoals(nextSkill, nextAchievement);

  overlayEl.classList.remove("modal-hidden");
  requestAnimationFrame(() => overlayEl.classList.add("modal-visible"));
}

function closeStatusDetail() {
  overlayEl.classList.remove("modal-visible");
  setTimeout(() => overlayEl.classList.add("modal-hidden"), 300);
}
