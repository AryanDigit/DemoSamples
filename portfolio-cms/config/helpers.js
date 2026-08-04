const db = require('../database/db');

function getSettings() {
  const rows = db.prepare('SELECT setting_key, setting_value FROM settings').all();
  const settings = {};
  for (const row of rows) settings[row.setting_key] = row.setting_value;
  return settings;
}

function getSetting(key, fallback = '') {
  const row = db.prepare('SELECT setting_value FROM settings WHERE setting_key = ?').get(key);
  return row ? row.setting_value : fallback;
}

function setSetting(key, value) {
  db.prepare(`
    INSERT INTO settings (setting_key, setting_value, updated_at)
    VALUES (?, ?, datetime('now'))
    ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value, updated_at = datetime('now')
  `).run(key, value == null ? '' : String(value));
}

function setSettings(obj) {
  const tx = db.transaction((entries) => {
    for (const [k, v] of entries) setSetting(k, v);
  });
  tx(Object.entries(obj));
}

function getPage(slug) {
  return db.prepare('SELECT * FROM pages WHERE slug = ?').get(slug);
}

function parseJson(value, fallback = []) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

module.exports = {
  getSettings,
  getSetting,
  setSetting,
  setSettings,
  getPage,
  parseJson,
  formatDate
};
