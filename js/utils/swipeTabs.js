// ==========================================================
// swipeTabs.js — 横スワイプでタブ内容を切り替えるための共通ジェスチャー
// 人生マップ／スキルツリーのカテゴリタブで共用する。
// ==========================================================

const SWIPE_THRESHOLD = 48;
const SWIPE_MAX_OFF_AXIS = 60;

export function initSwipeableTabs(targetEl, { onSwipeLeft, onSwipeRight }) {
  let startX = 0;
  let startY = 0;
  let tracking = false;

  targetEl.addEventListener(
    "touchstart",
    (e) => {
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      tracking = true;
    },
    { passive: true }
  );

  targetEl.addEventListener(
    "touchend",
    (e) => {
      if (!tracking) return;
      tracking = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;

      if (Math.abs(dy) > SWIPE_MAX_OFF_AXIS) return;
      if (dx <= -SWIPE_THRESHOLD) onSwipeLeft?.();
      else if (dx >= SWIPE_THRESHOLD) onSwipeRight?.();
    },
    { passive: true }
  );
}
