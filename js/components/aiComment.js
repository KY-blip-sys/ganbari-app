// ==========================================================
// aiComment.js — 画面下部のコメント表示
// EXP帯 × 時間帯でメッセージのバリエーションを持たせ、
// 同じ時間帯の中では安定、時間帯が変わると入れ替わる。
// 今は固定文言だが、将来ここをAI呼び出しに差し替える想定
// ==========================================================

const commentEl = document.getElementById("ai-comment-text");

const TIME_BUCKETS = [
  { id: "morning", test: (h) => h >= 5 && h < 11 },
  { id: "noon", test: (h) => h >= 11 && h < 14 },
  { id: "afternoon", test: (h) => h >= 14 && h < 18 },
  { id: "evening", test: (h) => h >= 18 && h < 22 },
  { id: "night", test: (h) => h >= 22 || h < 5 },
];

const EMPTY_COMMENTS = {
  morning: ["おはようございます\n今日の記録がまだありません 何か1つ始めてみましょう", "朝から気持ちよくスタートしましょう\nまずは1件、記録してみませんか？"],
  noon: ["今日の記録がまだありません\n何か1つ頑張ったことを追加してみましょう", "お昼までの出来事を振り返ってみましょう"],
  afternoon: ["今日の記録がまだありません\n午後からでも遅くありません", "少しずつでも記録を積み上げていきましょう"],
  evening: ["今日の記録がまだありません\n夕方からでも1日は変えられます", "今日はまだ何も記録がありません 今からでも大丈夫です"],
  night: ["今日の記録がまだありません\n寝る前に何か1つ振り返ってみませんか？", "今日1日、記録できることはありましたか？"],
};

const HIGH_COMMENTS = {
  morning: ["朝から絶好調です！\nこのペースを1日中キープしましょう", "素晴らしいスタートダッシュです！"],
  noon: ["素晴らしい1日でした！\nこの調子を明日以降も続けていきましょう", "お昼の時点でこの調子、最高です！"],
  afternoon: ["素晴らしい1日でした！\nこの調子を明日以降も続けていきましょう", "午後もこの勢い、見事です！"],
  evening: ["素晴らしい1日でした！\nこの調子を明日以降も続けていきましょう", "夕方までによくここまで積み上げました！"],
  night: ["素晴らしい1日でした！\nゆっくり休んで明日に備えましょう", "今日1日、本当にお疲れさまでした！最高の1日です"],
};

const MID_COMMENTS = {
  morning: ["いいペースです！\nこの調子で1日を進めていきましょう"],
  noon: ["今日もよく頑張りました！\nもう少しでSランクが見えてきます", "順調な滑り出しです この調子で"],
  afternoon: ["今日もよく頑張りました！\nもう少しでSランクが見えてきます", "午後も引き続き頑張っていきましょう"],
  evening: ["今日もよく頑張りました！\nもう少しでSランクが見えてきます", "夕方までによく積み上げました"],
  night: ["今日もよく頑張りました！\n無理せず、ここまでの自分を褒めましょう", "夜まで頑張った自分に拍手です"],
};

const LOW_COMMENTS = {
  morning: ["順調に積み上げていますね\nもう1つ記録を追加すると勢いがつきます", "いいスタートです このまま続けましょう"],
  noon: ["順調に積み上げていますね\nもう1つ記録を追加すると勢いがつきます"],
  afternoon: ["順調に積み上げていますね\nもう1つ記録を追加すると勢いがつきます", "午後にもう一押ししてみませんか？"],
  evening: ["順調に積み上げていますね\nもう1つ記録を追加すると勢いがつきます", "夕方のうちにもう1つ記録してみましょう"],
  night: ["順調に積み上げていますね\n寝る前にもう1つ記録してみませんか？"],
};

const SMALL_COMMENTS = {
  morning: ["小さな一歩も立派な前進です\n無理のない範囲で続けていきましょう", "朝の小さな1件が1日を変えます"],
  noon: ["小さな一歩も立派な前進です\n無理のない範囲で続けていきましょう"],
  afternoon: ["小さな一歩も立派な前進です\n無理のない範囲で続けていきましょう", "午後からでも十分間に合います"],
  evening: ["小さな一歩も立派な前進です\n無理のない範囲で続けていきましょう", "夕方からのひと踏ん張り、応援しています"],
  night: ["小さな一歩も立派な前進です\n無理のない範囲で続けていきましょう", "今日はゆっくり休むのも立派な選択です"],
};

function hashSeed(str) {
  let seed = 0;
  for (let i = 0; i < str.length; i++) seed = (seed * 31 + str.charCodeAt(i)) >>> 0;
  return seed;
}

function pickBySeed(list, seedStr) {
  return list[hashSeed(seedStr) % list.length];
}

function currentBucket() {
  const hour = new Date().getHours();
  return (TIME_BUCKETS.find((b) => b.test(hour)) || TIME_BUCKETS[0]).id;
}

function buildComment(todayExp, recordCount) {
  const bucket = currentBucket();
  const seed = `${bucket}-${todayExp}-${recordCount}`;

  if (recordCount === 0) return pickBySeed(EMPTY_COMMENTS[bucket], seed);
  if (todayExp >= 150) return pickBySeed(HIGH_COMMENTS[bucket], seed);
  if (todayExp >= 70) return pickBySeed(MID_COMMENTS[bucket], seed);
  if (todayExp >= 40) return pickBySeed(LOW_COMMENTS[bucket], seed);
  return pickBySeed(SMALL_COMMENTS[bucket], seed);
}

export function renderAiComment(todayExp, recordCount) {
  commentEl.textContent = buildComment(todayExp, recordCount);
}
