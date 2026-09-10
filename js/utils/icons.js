// ==========================================================
// icons.js — 絵文字を使わない統一ラインアイコン（SF Symbols風）
// ホーム画面など、アイコンを動的に描画する箇所から利用する。
// ==========================================================

const PATHS = {
  "graduation-cap": `<path d="M12 5 21 9.5 12 14 3 9.5 12 5Z"/><path d="M7 11.5V15c0 1.4 2 2.5 5 2.5s5-1.1 5-2.5v-3.5"/><path d="M21 9.5V15"/>`,
  heart: `<path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 6.9l-1.7-1.3a5 5 0 0 0-7.1 7.1L12 21l8.8-8.3a5 5 0 0 0 0-7.1Z"/>`,
  moon: `<path d="M20.5 14.5A8.5 8.5 0 1 1 9.9 3.9a6.8 6.8 0 0 0 10.6 10.6Z"/>`,
  wallet: `<rect x="3" y="6.5" width="18" height="12" rx="2.5"/><path d="M3 10.5h18"/><circle cx="16.5" cy="14" r="1.1" fill="currentColor" stroke="none"/>`,
  people: `<circle cx="9" cy="8.2" r="3"/><path d="M3.5 19c0-3.3 2.5-5.6 5.5-5.6s5.5 2.3 5.5 5.6"/><circle cx="17" cy="9" r="2.3"/><path d="M15 13.8c2.6.5 4.5 2.5 4.5 5.2"/>`,
  palette: `<path d="M12 3a9 9 0 1 0 0 18c1 0 1.8-.8 1.8-1.7 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-.9.8-1.7 1.8-1.7H16a5 5 0 0 0 5-5c0-4-4-6.2-9-6.2Z"/><circle cx="7.6" cy="11" r="1.1" fill="currentColor" stroke="none"/><circle cx="9.4" cy="7.3" r="1.1" fill="currentColor" stroke="none"/><circle cx="13.8" cy="6.8" r="1.1" fill="currentColor" stroke="none"/><circle cx="16.3" cy="10" r="1.1" fill="currentColor" stroke="none"/>`,
  house: `<path d="M4 11.5 12 4l8 7.5"/><path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9"/><path d="M10 20v-5h4v5"/>`,
  trophy: `<path d="M7 4h10v3.2a5 5 0 0 1-5 5 5 5 0 0 1-5-5V4Z"/><path d="M7 5.2H4.3A2.8 2.8 0 0 0 7 8.6"/><path d="M17 5.2h2.7A2.8 2.8 0 0 1 17 8.6"/><path d="M12 12.2V15"/><path d="M9 19.5h6"/><path d="M9.8 16.5h4.4l1 3h-6.4l1-3Z"/>`,
  badge: `<circle cx="12" cy="9.3" r="5.3"/><path d="M9 13.9 7.4 20.5l4.6-2.4 4.6 2.4-1.6-6.6"/>`,
  check: `<path d="M5 12.5 9.5 17 19 7"/>`,
  dumbbell: `<path d="M9.3 12h5.4"/><rect x="3.3" y="9" width="2.6" height="6" rx="1"/><rect x="18.1" y="9" width="2.6" height="6" rx="1"/><path d="M6 10.5v3"/><path d="M18 10.5v3"/>`,
  briefcase: `<rect x="3" y="8" width="18" height="11" rx="2.2"/><path d="M8.5 8V6.3A1.8 1.8 0 0 1 10.3 4.5h3.4A1.8 1.8 0 0 1 15.5 6.3V8"/><path d="M3 13.5h18"/>`,
  broom: `<path d="M19 4 10 13"/><path d="M10 13c-2.2.4-4.2 1.2-6 3-1.6 1.6-2 3.6-2 5 1.4 0 3.4-.4 5-2 1.8-1.8 2.6-3.8 3-6Z"/><path d="M7.5 15.5 9 17"/>`,
  sparkle: `<path d="M12 3c.7 3.6 1.9 5.7 4.1 6.8 2.2 1.1 4.9 1.2 4.9 1.2s-2.7.1-4.9 1.2c-2.2 1.1-3.4 3.2-4.1 6.8-.7-3.6-1.9-5.7-4.1-6.8C5.7 11 3 10.9 3 10.9s2.7-.1 4.9-1.2C10.1 8.6 11.3 6.5 12 3Z"/>`,
  flame: `<path d="M12 3c1.8 3 3.6 5 3.6 8.4a4.6 4.6 0 0 1-9.2 0c0-1.9.9-3.2 1.9-4.6.1 1.4.8 2.2 1.6 2.2.8 0 1.1-.7.8-1.7-.4-1.6 0-2.9 1.3-4.3Z"/>`,
  list: `<path d="M9 6.5h11"/><path d="M9 12h11"/><path d="M9 17.5h11"/><circle cx="4.5" cy="6.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="4.5" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="4.5" cy="17.5" r="1.3" fill="currentColor" stroke="none"/>`,
};

export function iconSvg(name, { size = 20 } = {}) {
  const inner = PATHS[name] || "";
  return `<svg class="icon-svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}
