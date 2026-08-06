/**
 * storage.js — LocalStorage persistence for Sky Runner
 * Handles high score and settings with safe fallbacks.
 */
(function (global) {
  'use strict';

  const STORAGE_KEY = 'skyRunner_v1';

  const DEFAULTS = Object.freeze({
    highScore: 0,
    sfx: true,
    music: true,
    particles: true,
  });

  class StorageManager {
    constructor(key = STORAGE_KEY) {
      this.key = key;
      this.data = this._load();
    }

    /** @returns {object} */
    _load() {
      try {
        const raw = localStorage.getItem(this.key);
        if (!raw) return { ...DEFAULTS };
        const parsed = JSON.parse(raw);
        return { ...DEFAULTS, ...parsed };
      } catch (err) {
        console.warn('[Storage] Failed to load:', err);
        return { ...DEFAULTS };
      }
    }

    _save() {
      try {
        localStorage.setItem(this.key, JSON.stringify(this.data));
      } catch (err) {
        console.warn('[Storage] Failed to save:', err);
      }
    }

    getHighScore() {
      return Number(this.data.highScore) || 0;
    }

    /**
     * Persist a new high score if higher than current.
     * @param {number} score
     * @returns {boolean} true if a new record was set
     */
    setHighScore(score) {
      const value = Math.floor(Number(score) || 0);
      if (value > this.getHighScore()) {
        this.data.highScore = value;
        this._save();
        return true;
      }
      return false;
    }

    getSettings() {
      return {
        sfx: Boolean(this.data.sfx),
        music: Boolean(this.data.music),
        particles: Boolean(this.data.particles),
      };
    }

    /**
     * @param {Partial<{sfx:boolean, music:boolean, particles:boolean}>} settings
     */
    updateSettings(settings) {
      if (!settings || typeof settings !== 'object') return;
      if (typeof settings.sfx === 'boolean') this.data.sfx = settings.sfx;
      if (typeof settings.music === 'boolean') this.data.music = settings.music;
      if (typeof settings.particles === 'boolean') this.data.particles = settings.particles;
      this._save();
    }

    reset() {
      this.data = { ...DEFAULTS };
      this._save();
    }
  }

  global.SkyRunner = global.SkyRunner || {};
  global.SkyRunner.StorageManager = StorageManager;
})(typeof window !== 'undefined' ? window : globalThis);
