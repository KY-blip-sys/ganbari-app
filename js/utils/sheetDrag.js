// ==========================================================
// sheetDrag.js — ボトムシート上部のハンドルバーを下に引いて閉じる
// 共通ジェスチャー（記録モーダル／その他メニュー／日別詳細／能力詳細で共用）
// ==========================================================

const CLOSE_DISTANCE = 90;
const CLOSE_VELOCITY = 0.5; // px/ms

export function initSheetDragToClose(handleEl, sheetEl, onClose) {
  let startY = 0;
  let startTime = 0;
  let draggedY = 0;
  let dragging = false;

  handleEl.addEventListener(
    "touchstart",
    (e) => {
      startY = e.touches[0].clientY;
      startTime = Date.now();
      draggedY = 0;
      dragging = true;
      sheetEl.style.transition = "none";
    },
    { passive: true }
  );

  handleEl.addEventListener(
    "touchmove",
    (e) => {
      if (!dragging) return;
      draggedY = Math.max(0, e.touches[0].clientY - startY);
      sheetEl.style.transform = `translateY(${draggedY}px)`;
      e.preventDefault();
    },
    { passive: false }
  );

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    sheetEl.style.transition = "";

    const elapsed = Math.max(1, Date.now() - startTime);
    const velocity = draggedY / elapsed;
    const shouldClose = draggedY > CLOSE_DISTANCE || velocity > CLOSE_VELOCITY;

    sheetEl.style.transform = "";
    if (shouldClose) onClose();
  }

  handleEl.addEventListener("touchend", endDrag);
  handleEl.addEventListener("touchcancel", endDrag);
}
