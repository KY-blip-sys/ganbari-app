// ==========================================================
// recordList.js — 記録一覧の描画とスワイプ／長押しでの削除・編集
// ==========================================================

import { recordCardMarkup } from "./recordCard.js";
import { showConfirm } from "./confirmDialog.js";

const listEl = document.getElementById("record-list");
const emptyEl = document.getElementById("record-empty");

const SWIPE_OPEN_X = -76;
const SWIPE_THRESHOLD = -40;
const LONG_PRESS_MS = 500;

let onDeleteCallback = null;
let onEditCallback = null;

export function setOnDelete(callback) {
  onDeleteCallback = callback;
}

export function setOnEdit(callback) {
  onEditCallback = callback;
}

export function renderRecords(records) {
  listEl.innerHTML = "";
  emptyEl.style.display = records.length === 0 ? "block" : "none";

  records
    .slice()
    .reverse()
    .forEach((record) => {
      listEl.appendChild(buildRecordItem(record));
    });
}

function buildRecordItem(record) {
  const li = document.createElement("li");
  li.className = "record-item record-item-enter";
  li.dataset.id = record.id;

  li.innerHTML = `
    <div class="record-item-swipe">
      <button class="record-item-delete">削除</button>
      <div class="record-item-body">
        ${recordCardMarkup(record)}
      </div>
    </div>
    <button class="record-edit-btn tap-scale" aria-label="編集">✏️</button>
  `;

  const bodyEl = li.querySelector(".record-item-body");
  const deleteBtn = li.querySelector(".record-item-delete");
  const editBtn = li.querySelector(".record-edit-btn");

  attachSwipeToDelete(li, bodyEl);

  deleteBtn.addEventListener("click", () => {
    showConfirm({
      title: "この記録を削除しますか？",
      text: "この操作は取り消せません。",
      confirmLabel: "削除",
      onConfirm: () => removeItem(li, record.id),
      onCancel: () => setTranslate(bodyEl, 0),
    });
  });

  editBtn.addEventListener("click", () => {
    if (onEditCallback) onEditCallback(record);
  });

  return li;
}

function attachSwipeToDelete(li, bodyEl) {
  let startX = 0;
  let currentX = 0;
  let dragging = false;
  let longPressTimer = null;

  bodyEl.addEventListener("pointerdown", (e) => {
    startX = e.clientX;
    dragging = true;
    bodyEl.style.transition = "none";
    bodyEl.setPointerCapture(e.pointerId);

    longPressTimer = setTimeout(() => {
      currentX = SWIPE_OPEN_X;
      setTranslate(bodyEl, currentX);
      dragging = false;
    }, LONG_PRESS_MS);
  });

  bodyEl.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const delta = e.clientX - startX;
    if (Math.abs(delta) > 6 && longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
    const base = currentX === SWIPE_OPEN_X ? SWIPE_OPEN_X : 0;
    const next = clamp(base + delta, SWIPE_OPEN_X, 0);
    setTranslate(bodyEl, next);
  });

  function endDrag(e) {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
    if (!dragging) return;
    dragging = false;
    bodyEl.style.transition = "";

    const delta = e.clientX - startX;
    const base = currentX === SWIPE_OPEN_X ? SWIPE_OPEN_X : 0;
    const finalX = clamp(base + delta, SWIPE_OPEN_X, 0);

    if (finalX <= SWIPE_THRESHOLD) {
      currentX = SWIPE_OPEN_X;
    } else {
      currentX = 0;
    }
    setTranslate(bodyEl, currentX);
  }

  bodyEl.addEventListener("pointerup", endDrag);
  bodyEl.addEventListener("pointercancel", endDrag);
}

function setTranslate(el, x) {
  el.style.transform = `translateX(${x}px)`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function removeItem(li, id) {
  li.classList.add("record-item-leaving");
  li.style.transition = "max-height 0.25s ease, margin 0.25s ease";
  const height = li.offsetHeight;
  li.style.maxHeight = `${height}px`;
  requestAnimationFrame(() => {
    li.style.maxHeight = "0px";
  });

  setTimeout(() => {
    if (onDeleteCallback) onDeleteCallback(id);
  }, 260);
}
