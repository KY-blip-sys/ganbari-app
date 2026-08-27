// ==========================================================
// calendarCard.js — 月間カレンダーと日別記録の詳細表示
// ==========================================================

import { todayKey } from "../utils/dateUtils.js";
import { getCalendarDayTier } from "../utils/scoreUtils.js";
import { recordCardMarkup } from "./recordCard.js";

const titleEl = document.getElementById("calendar-title");
const gridEl = document.getElementById("calendar-grid");
const prevBtn = document.getElementById("btn-cal-prev");
const nextBtn = document.getElementById("btn-cal-next");

const dayDetailOverlay = document.getElementById("day-detail-overlay");
const dayDetailTitleEl = document.getElementById("day-detail-title");
const dayDetailListEl = document.getElementById("day-detail-list");
const dayDetailEmptyEl = document.getElementById("day-detail-empty");
const dayDetailCloseBtn = document.getElementById("btn-day-detail-close");

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

  dayDetailCloseBtn.addEventListener("click", closeDayDetail);
  dayDetailOverlay.addEventListener("click", (e) => {
    if (e.target === dayDetailOverlay) closeDayDetail();
  });
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
    const dayExp = dayRecords.reduce((sum, r) => sum + r.exp, 0);

    const cell = document.createElement("button");
    cell.className = "calendar-cell tap-scale";
    if (dateKey === today) cell.classList.add("calendar-cell-today");

    let starHtml = "";
    if (hasRecords) {
      const tier = getCalendarDayTier(dayExp);
      cell.classList.add(`calendar-cell-${tier}`);
      if (tier === "gold") starHtml = '<span class="calendar-cell-star">★</span>';
    }

    cell.innerHTML = `<span class="calendar-cell-day">${day}</span>${starHtml}`;
    cell.addEventListener("click", () => openDayDetail(dateKey, dayRecords));
    gridEl.appendChild(cell);
  }
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
}

function closeDayDetail() {
  dayDetailOverlay.classList.remove("modal-visible");
  setTimeout(() => dayDetailOverlay.classList.add("modal-hidden"), 300);
}
