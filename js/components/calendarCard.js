// ==========================================================
// calendarCard.js — 月間カレンダーと日別記録の詳細表示
// ==========================================================

import { todayKey } from "../utils/dateUtils.js";
import { iconSvg } from "../utils/icons.js";
import { recordCardMarkup } from "./recordCard.js";
import { lockBodyScroll, unlockBodyScroll } from "../utils/scrollLock.js";
import { initSheetDragToClose } from "../utils/sheetDrag.js";

const titleEl = document.getElementById("calendar-title");
const gridEl = document.getElementById("calendar-grid");
const prevBtn = document.getElementById("btn-cal-prev");
const nextBtn = document.getElementById("btn-cal-next");

const dayDetailOverlay = document.getElementById("day-detail-overlay");
const dayDetailSheetEl = document.getElementById("day-detail-sheet");
const dayDetailHandleEl = dayDetailSheetEl.querySelector(".modal-handle");
const dayDetailTitleEl = document.getElementById("day-detail-title");
const dayDetailListEl = document.getElementById("day-detail-list");
const dayDetailEmptyEl = document.getElementById("day-detail-empty");

const displayDate = new Date();
let cachedRecords = {};

export function initCalendar() {
  prevBtn.addEventListener("click", () => {
    displayDate.setMonth(displayDate.getMonth() - 1);
    render();
  });

  nextBtn.addEventListener("click", () => {
    displayDate.setMonth(displayDate.getMonth() + 1);
    render();
  });

  dayDetailOverlay.addEventListener("click", (e) => {
    if (e.target === dayDetailOverlay) closeDayDetail();
  });
  initSheetDragToClose(dayDetailHandleEl, dayDetailSheetEl, closeDayDetail);
}

export function renderCalendar(records) {
  cachedRecords = records;
  render();
}

function render() {
  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();
  titleEl.textContent = `${year}年${month + 1}月`;

  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = todayKey();

  gridEl.innerHTML = "";

  for (let i = 0; i < firstWeekday; i++) {
    const empty = document.createElement("div");
    empty.className = "calendar-cell calendar-cell-empty";
    gridEl.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayRecords = cachedRecords[dateKey] || [];
    const hasRecords = dayRecords.length > 0;

    const cell = document.createElement("button");
    cell.className = "calendar-cell tap-scale";
    if (dateKey === today) cell.classList.add("calendar-cell-today");
    if (hasRecords) cell.classList.add("calendar-cell-recorded");

    const flameHtml = isStreakDay(dateKey)
      ? `<span class="calendar-cell-flame">${iconSvg("flame", { size: 9 })}</span>`
      : "";

    cell.innerHTML = `<span class="calendar-cell-badge">${day}</span>${flameHtml}`;
    cell.addEventListener("click", () => openDayDetail(dateKey, dayRecords));
    gridEl.appendChild(cell);
  }
}

function shiftDateKey(dateKey, deltaDays) {
  const [y, m, d] = dateKey.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + deltaDays);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
}

function isStreakDay(dateKey) {
  if (!(cachedRecords[dateKey] || []).length) return false;
  const prevHasRecords = (cachedRecords[shiftDateKey(dateKey, -1)] || []).length > 0;
  const nextHasRecords = (cachedRecords[shiftDateKey(dateKey, 1)] || []).length > 0;
  return prevHasRecords || nextHasRecords;
}

function openDayDetail(dateKey, records) {
  const [, month, day] = dateKey.split("-");
  dayDetailTitleEl.textContent = `${Number(month)}月${Number(day)}日の記録`;

  dayDetailListEl.innerHTML = "";
  dayDetailEmptyEl.style.display = records.length === 0 ? "block" : "none";

  records.forEach((record) => {
    const li = document.createElement("li");
    li.className = "record-item";
    li.innerHTML = `<div class="record-item-body record-item-static">${recordCardMarkup(record)}</div>`;
    dayDetailListEl.appendChild(li);
  });

  dayDetailOverlay.classList.remove("modal-hidden");
  requestAnimationFrame(() => dayDetailOverlay.classList.add("modal-visible"));
  lockBodyScroll();
}

function closeDayDetail() {
  dayDetailOverlay.classList.remove("modal-visible");
  unlockBodyScroll();
  setTimeout(() => dayDetailOverlay.classList.add("modal-hidden"), 300);
}
