/**
 * storage.js — LocalStorage persistence for Sky Runner
 * High score, banked coins, skins, achievements, missions, settings.
 */
(function (global) {
  'use strict';

  const STORAGE_KEY = 'skyRunner_v2';
  const LEGACY_KEY = 'skyRunner_v1';

  const DEFAULTS = Object.freeze({
    highScore: 0,
    bestDistance: 0,
    bankCoins: 0,
    totalCoins: 0,
    totalRuns: 0,
    totalNearMisses: 0,
    selectedSkin: 'azure',
    unlockedSkins: ['azure'],
    achievements: {},
    missionIndex: 0,
    missionProgress: 0,
    tutorialSeen: false,
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
        let raw = localStorage.getItem(this.key);
        if (!raw) {
          // Migrate v1 if present
          const legacy = localStorage.getItem(LEGACY_KEY);
          if (legacy) {
            const old = JSON.parse(legacy);
            const migrated = {
              ...DEFAULTS,
              highScore: old.highScore || 0,
              sfx: old.sfx !== false,
              music: old.music !== false,
              particles: old.particles !== false,
            };
            this.data = migrated;
            this._save();
            return { ...migrated };
          }
          return { ...DEFAULTS, unlockedSkins: ['azure'], achievements: {} };
        }
        const parsed = JSON.parse(raw);
        const data = {
          ...DEFAULTS,
          ...parsed,
          unlockedSkins: Array.isArray(parsed.unlockedSkins)
            ? parsed.unlockedSkins
            : ['azure'],
          achievements:
            parsed.achievements && typeof parsed.achievements === 'object'
              ? parsed.achievements
              : {},
        };
        if (!data.unlockedSkins.includes('azure')) data.unlockedSkins.push('azure');
        return data;
      } catch (err) {
        console.warn('[Storage] Failed to load:', err);
        return { ...DEFAULTS, unlockedSkins: ['azure'], achievements: {} };
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

    setHighScore(score) {
      const value = Math.floor(Number(score) || 0);
      if (value > this.getHighScore()) {
        this.data.highScore = value;
        this._save();
        return true;
      }
      return false;
    }

    getBestDistance() {
      return Number(this.data.bestDistance) || 0;
    }

    setBestDistance(dist) {
      const value = Math.floor(Number(dist) || 0);
      if (value > this.getBestDistance()) {
        this.data.bestDistance = value;
        this._save();
        return true;
      }
      return false;
    }

    getBankCoins() {
      return Number(this.data.bankCoins) || 0;
    }

    addBankCoins(amount) {
      const n = Math.max(0, Math.floor(Number(amount) || 0));
      this.data.bankCoins = this.getBankCoins() + n;
      this.data.totalCoins = (Number(this.data.totalCoins) || 0) + n;
      this._save();
      return this.data.bankCoins;
    }

    spendBankCoins(amount) {
      const n = Math.max(0, Math.floor(Number(amount) || 0));
      if (this.getBankCoins() < n) return false;
      this.data.bankCoins -= n;
      this._save();
      return true;
    }

    recordRun() {
      this.data.totalRuns = (Number(this.data.totalRuns) || 0) + 1;
      this._save();
    }

    getTotalRuns() {
      return Number(this.data.totalRuns) || 0;
    }

    getTotalCoins() {
      return Number(this.data.totalCoins) || 0;
    }

    addNearMisses(n) {
      this.data.totalNearMisses = (Number(this.data.totalNearMisses) || 0) + n;
      this._save();
    }

    getTotalNearMisses() {
      return Number(this.data.totalNearMisses) || 0;
    }

    getSelectedSkin() {
      return this.data.selectedSkin || 'azure';
    }

    setSelectedSkin(id) {
      if (!this.isSkinUnlocked(id)) return false;
      this.data.selectedSkin = id;
      this._save();
      return true;
    }

    isSkinUnlocked(id) {
      return (this.data.unlockedSkins || []).includes(id);
    }

    unlockSkin(id) {
      if (!this.data.unlockedSkins) this.data.unlockedSkins = ['azure'];
      if (!this.data.unlockedSkins.includes(id)) {
        this.data.unlockedSkins.push(id);
        this._save();
        return true;
      }
      return false;
    }

    getUnlockedSkins() {
      return [...(this.data.unlockedSkins || ['azure'])];
    }

    hasAchievement(id) {
      return Boolean(this.data.achievements && this.data.achievements[id]);
    }

    unlockAchievement(id) {
      if (!this.data.achievements) this.data.achievements = {};
      if (this.data.achievements[id]) return false;
      this.data.achievements[id] = Date.now();
      this._save();
      return true;
    }

    getAchievements() {
      return { ...(this.data.achievements || {}) };
    }

    getMissionIndex() {
      return Number(this.data.missionIndex) || 0;
    }

    setMissionIndex(i) {
      this.data.missionIndex = Math.max(0, Math.floor(i));
      this.data.missionProgress = 0;
      this._save();
    }

    getMissionProgress() {
      return Number(this.data.missionProgress) || 0;
    }

    setMissionProgress(v) {
      this.data.missionProgress = Math.max(0, Number(v) || 0);
      this._save();
    }

    hasSeenTutorial() {
      return Boolean(this.data.tutorialSeen);
    }

    setTutorialSeen() {
      this.data.tutorialSeen = true;
      this._save();
    }

    getSettings() {
      return {
        sfx: Boolean(this.data.sfx),
        music: Boolean(this.data.music),
        particles: Boolean(this.data.particles),
      };
    }

    updateSettings(settings) {
      if (!settings || typeof settings !== 'object') return;
      if (typeof settings.sfx === 'boolean') this.data.sfx = settings.sfx;
      if (typeof settings.music === 'boolean') this.data.music = settings.music;
      if (typeof settings.particles === 'boolean') this.data.particles = settings.particles;
      this._save();
    }

    reset() {
      this.data = { ...DEFAULTS, unlockedSkins: ['azure'], achievements: {} };
      this._save();
    }
  }

  global.SkyRunner = global.SkyRunner || {};
  global.SkyRunner.StorageManager = StorageManager;
})(typeof window !== 'undefined' ? window : globalThis);
