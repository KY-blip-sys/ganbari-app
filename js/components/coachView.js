// ==========================================================
// coachView.js — AIコーチ画面の描画
// ==========================================================

const containerEl = document.getElementById("coach-content");

export function renderCoach({ dailyMessage, weakestStat, weakestStatHint, nextAchievement }) {
  containerEl.innerHTML = `
    <section class="card glass-card coach-tip-card">
      <p class="card-label">✨ 今日のひとこと</p>
      <p class="coach-tip-text">${dailyMessage}</p>
    </section>
    <section class="card glass-card coach-tip-card">
      <p class="card-label">📊 伸ばすと良いステータス</p>
      <p class="coach-tip-text">${
        weakestStat
          ? `「${weakestStat.key}」が一番育っていません ${weakestStatHint}`
          : "記録を追加するとおすすめが表示されます"
      }</p>
    </section>
    <section class="card glass-card coach-tip-card">
      <p class="card-label">🏆 次に狙える実績</p>
      <p class="coach-tip-text">${
        nextAchievement ? `「${nextAchievement.name}」まであと少しです` : "すべての実績を達成しました！"
      }</p>
    </section>
  `;
}
