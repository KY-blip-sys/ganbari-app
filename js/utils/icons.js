// ==========================================================
// icons.js — 絵文字アイコンの共通レンダリングヘルパー
// 各 icon フィールドには実際の色付き絵文字を持たせ、ここではサイズを
// 揃えて埋め込むだけにする（アイコンの種類ごとの出し分けはしない）。
// ==========================================================

export function iconSvg(icon, { size = 20 } = {}) {
  return `<span class="icon-emoji" style="font-size:${size}px">${icon || ""}</span>`;
}

export function iconMarkup(icon, { size = 20 } = {}) {
  return iconSvg(icon, { size });
}

// 他のSVG（レーダーチャートなど）の中に <text> として直接埋め込むための、絵文字ラベル
export function iconPathsMarkup(icon) {
  return `<text x="12" y="12" text-anchor="middle" dominant-baseline="central" font-size="20">${icon || ""}</text>`;
}
