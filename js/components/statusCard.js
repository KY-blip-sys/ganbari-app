// ==========================================================
// statusCard.js — 人生ステータス（バー＋レベル）表示
// 複数の画面（ホームの簡易表示／ステータス画面のフル表示）から
// 呼べるよう、対象コンテナを引数で受け取る。
// ==========================================================

export function renderLifeStatuses(containerEl, statuses) {
  containerEl.innerHTML = "";

  statuses.forEach(({ key, icon, level, progressRatio }) => {
    const row = document.createElement("div");
    row.className = "status-row";
    row.innerHTML = `
      <span class="status-icon">${icon}</span>
      <span class="status-name">${key}</span>
      <span class="status-bar-track"><span class="status-bar-fill" style="width:${Math.round(progressRatio * 100)}%"></span></span>
      <span class="status-level">Lv.${level}</span>
    `;
    containerEl.appendChild(row);
  });
}
