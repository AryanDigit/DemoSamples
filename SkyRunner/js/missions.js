/**
 * missions.js — Sequential run missions with coin rewards
 */
(function (global) {
  'use strict';

  const MISSIONS = Object.freeze([
    { id: 'm_coins_15', label: 'Collect 15 coins', type: 'coins', target: 15, reward: 20 },
    { id: 'm_dist_200', label: 'Run 200 meters', type: 'distance', target: 200, reward: 25 },
    { id: 'm_score_800', label: 'Reach 800 score', type: 'score', target: 800, reward: 30 },
    { id: 'm_nearmiss_5', label: 'Land 5 near-misses', type: 'nearMisses', target: 5, reward: 35 },
    { id: 'm_gem_1', label: 'Collect 1 gem', type: 'gems', target: 1, reward: 40 },
    { id: 'm_combo_5', label: 'Reach x5 combo', type: 'combo', target: 5, reward: 35 },
    { id: 'm_coins_40', label: 'Collect 40 coins', type: 'coins', target: 40, reward: 50 },
    { id: 'm_dist_800', label: 'Run 800 meters', type: 'distance', target: 800, reward: 60 },
    { id: 'm_biomes_3', label: 'Visit 3 biomes', type: 'biomes', target: 3, reward: 55 },
    { id: 'm_score_3k', label: 'Reach 3,000 score', type: 'score', target: 3000, reward: 80 },
  ]);

  /** Unlockable runner skins for the shop */
  const SKINS = Object.freeze([
    { id: 'azure', name: 'Azure', price: 0, body: '#3ecfff', accent: '#ff6b4a', cap: '#ff6b4a' },
    { id: 'ember', name: 'Ember', price: 50, body: '#fb923c', accent: '#7f1d1d', cap: '#fbbf24' },
    { id: 'violet', name: 'Violet', price: 80, body: '#c084fc', accent: '#4c1d95', cap: '#e9d5ff' },
    { id: 'jade', name: 'Jade', price: 100, body: '#34d399', accent: '#064e3b', cap: '#6ee7b7' },
    { id: 'solar', name: 'Solar', price: 150, body: '#fde047', accent: '#a16207', cap: '#fff7ed' },
    { id: 'ghost', name: 'Ghost', price: 200, body: '#e2e8f0', accent: '#64748b', cap: '#94a3b8' },
  ]);

  class MissionManager {
    /**
     * @param {object} storage
     */
    constructor(storage) {
      this.storage = storage;
      this.completedThisRun = false;
    }

    getCurrent() {
      const idx = this.storage.getMissionIndex() % MISSIONS.length;
      return { ...MISSIONS[idx], index: idx };
    }

    /**
     * @param {object} runStats
     * @returns {{completed:boolean, mission:object|null, reward:number}}
     */
    updateProgress(runStats) {
      const mission = this.getCurrent();

      if (this.completedThisRun) {
        return { completed: false, mission, reward: 0 };
      }

      let progress = 0;
      switch (mission.type) {
        case 'coins':
          progress = runStats.coins || 0;
          break;
        case 'distance':
          progress = runStats.distance || 0;
          break;
        case 'score':
          progress = runStats.score || 0;
          break;
        case 'nearMisses':
          progress = runStats.nearMisses || 0;
          break;
        case 'gems':
          progress = runStats.gems || 0;
          break;
        case 'combo':
          progress = runStats.maxCombo || 0;
          break;
        case 'biomes':
          progress = runStats.biomesVisited || 0;
          break;
        default:
          progress = 0;
      }
      this.storage.setMissionProgress(Math.min(progress, mission.target));

      if (progress >= mission.target) {
        this.completedThisRun = true;
        this.storage.addBankCoins(mission.reward);
        this.storage.setMissionIndex(mission.index + 1);
        return { completed: true, mission, reward: mission.reward };
      }
      return { completed: false, mission, reward: 0 };
    }

    resetRunFlag() {
      this.completedThisRun = false;
    }

    getProgressRatio() {
      const m = this.getCurrent();
      const p = this.storage.getMissionProgress();
      return Math.min(1, p / m.target);
    }
  }

  global.SkyRunner = global.SkyRunner || {};
  global.SkyRunner.MissionManager = MissionManager;
  global.SkyRunner.MISSIONS = MISSIONS;
  global.SkyRunner.SKINS = SKINS;
})(typeof window !== 'undefined' ? window : globalThis);
