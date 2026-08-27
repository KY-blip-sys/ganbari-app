// ==========================================================
// aiComment.js — 画面下部のコメント表示
// 今は固定文言だが、将来ここをAI呼び出しに差し替える想定
// ==========================================================

const commentEl = document.getElementById("ai-comment-text");

function buildComment(todayExp, recordCount) {
  if (recordCount === 0) {
    return "今日の記録がまだありません\n何か1つ頑張ったことを追加してみましょう";
  }
  if (todayExp >= 150) {
    return "素晴らしい1日でした！\nこの調子を明日以降も続けていきましょう";
  }
  if (todayExp >= 70) {
    return "今日もよく頑張りました！\nもう少しでSランクが見えてきます";
  }
  if (todayExp >= 40) {
    return "順調に積み上げていますね\nもう1つ記録を追加すると勢いがつきます";
  }
  return "小さな一歩も立派な前進です\n無理のない範囲で続けていきましょう";
}

export function renderAiComment(todayExp, recordCount) {
  commentEl.textContent = buildComment(todayExp, recordCount);
}
