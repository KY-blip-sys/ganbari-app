// ==========================================================
// recordModal.js — 記録追加・編集モーダルの制御（共通コンポーネント）
// ==========================================================

const DEFAULT_EXP = 10;
const ADD_TITLE = "今日頑張ったことを追加";
const EDIT_TITLE = "記録を編集";

const overlayEl = document.getElementById("modal-overlay");
const sheetEl = document.getElementById("modal-sheet");
const modalTitleEl = document.getElementById("modal-title");
const titleInputEl = document.getElementById("input-title");
const categoryGridEl = document.getElementById("category-grid");
const expGridEl = document.getElementById("exp-grid");
const saveBtn = document.getElementById("btn-save-record");
const cancelBtn = document.getElementById("btn-cancel-record");
const addBtn = document.getElementById("btn-add-record");

let selectedCategory = null;
let selectedExp = DEFAULT_EXP;
let mode = "add";
let editingId = null;
let onSaveCallback = null;
let onUpdateCallback = null;

export function initRecordModal({ onSave, onUpdate }) {
  onSaveCallback = onSave;
  onUpdateCallback = onUpdate;

  addBtn.addEventListener("click", () => openModal());
  cancelBtn.addEventListener("click", closeModal);
  overlayEl.addEventListener("click", (e) => {
    if (e.target === overlayEl) closeModal();
  });

  categoryGridEl.addEventListener("click", (e) => {
    const chip = e.target.closest(".category-chip");
    if (!chip) return;
    selectedCategory = chip.dataset.category;
    [...categoryGridEl.children].forEach((c) => c.classList.toggle("selected", c === chip));
    updateSaveState();
  });

  expGridEl.addEventListener("click", (e) => {
    const chip = e.target.closest(".exp-chip");
    if (!chip) return;
    selectedExp = Number(chip.dataset.exp);
    [...expGridEl.children].forEach((c) => c.classList.toggle("selected", c === chip));
    updateSaveState();
  });

  titleInputEl.addEventListener("input", updateSaveState);

  saveBtn.addEventListener("click", () => {
    if (!canSave()) return;
    const data = {
      title: titleInputEl.value.trim(),
      category: selectedCategory,
      exp: selectedExp,
    };

    if (mode === "edit") {
      onUpdateCallback(editingId, data);
    } else {
      onSaveCallback(data);
    }
    closeModal();
  });
}

export function openRecordModalForEdit(record) {
  openModal(record);
}

function canSave() {
  return titleInputEl.value.trim().length > 0 && selectedCategory && selectedExp;
}

function updateSaveState() {
  saveBtn.disabled = !canSave();
}

function openModal(record = null) {
  mode = record ? "edit" : "add";
  editingId = record ? record.id : null;
  modalTitleEl.textContent = record ? EDIT_TITLE : ADD_TITLE;

  resetForm(record);

  overlayEl.classList.remove("modal-hidden");
  requestAnimationFrame(() => overlayEl.classList.add("modal-visible"));
  setTimeout(() => titleInputEl.focus(), 300);
}

function closeModal() {
  overlayEl.classList.remove("modal-visible");
  setTimeout(() => overlayEl.classList.add("modal-hidden"), 300);
}

function resetForm(record = null) {
  titleInputEl.value = record ? record.title : "";
  selectedCategory = record ? record.category : null;
  selectedExp = record ? record.exp : DEFAULT_EXP;

  [...categoryGridEl.children].forEach((c) => {
    c.classList.toggle("selected", c.dataset.category === selectedCategory);
  });
  [...expGridEl.children].forEach((c) => {
    c.classList.toggle("selected", Number(c.dataset.exp) === selectedExp);
  });
  updateSaveState();
}
