/**
 * achievements.js — Unlockable achievements with toast notifications
 */
(function (global) {
  'use strict';

  const DEFS = Object.freeze([
    { id: 'first_run', title: 'First Flight', desc: 'Complete your first run', check: (s) => s.totalRuns >= 1 },
    { id: 'score_1k', title: 'Sky Scout', desc: 'Score 1,000 points', check: (s) => s.score >= 1000 },
    { id: 'score_5k', title: 'Sky Ace', desc: 'Score 5,000 points', check: (s) => s.score >= 5000 },
    { id: 'coins_50', title: 'Coin Collector', desc: 'Collect 50 coins in one run', check: (s) => s.coins >= 50 },
    { id: 'distance_500', title: 'Marathon', desc: 'Run 500m in one run', check: (s) => s.distance >= 500 },
    { id: 'distance_1500', title: 'Horizon Chaser', desc: 'Run 1,500m in one run', check: (s) => s.distance >= 1500 },
    { id: 'near_10', title: 'Close Call', desc: 'Get 10 near-misses in one run', check: (s) => s.nearMisses >= 10 },
    { id: 'gem_3', title: 'Gem Hunter', desc: 'Collect 3 gems in one run', check: (s) => s.gems >= 3 },
    { id: 'combo_8', title: 'Combo King', desc: 'Reach an x8 combo', check: (s) => s.combo >= 8 },
    { id: 'bank_100', title: 'Saver', desc: 'Bank 100 total coins', check: (s) => s.totalCoins >= 100 },
    { id: 'all_biomes', title: 'World Tour', desc: 'Visit every biome in one run', check: (s) => s.biomesVisited >= 4 },
    { id: 'shield_save', title: 'Protected', desc: 'Survive a hit with a shield', check: (s) => s.shieldSaves >= 1 },
  ]);

  class AchievementManager {
    /**
     * @param {object} storage StorageManager
     */
    constructor(storage) {
      this.storage = storage;
      this.queue = [];
      this.toasts = [];
    }

    getDefinitions() {
      return DEFS;
    }

    /**
     * Evaluate run stats against locked achievements.
     * @param {object} stats
     * @returns {string[]} newly unlocked titles
     */
    evaluate(stats) {
      const unlocked = [];
      const enriched = {
        ...stats,
        totalRuns: this.storage.getTotalRuns(),
        totalCoins: this.storage.getTotalCoins(),
      };
      for (const def of DEFS) {
        if (this.storage.hasAchievement(def.id)) continue;
        try {
          if (def.check(enriched)) {
            if (this.storage.unlockAchievement(def.id)) {
              unlocked.push(def);
              this.toasts.push({
                title: def.title,
                desc: def.desc,
                life: 3.2,
              });
            }
          }
        } catch (err) {
          console.warn('[Achievements] check failed', def.id, err);
        }
      }
      return unlocked;
    }

    update(dt) {
      for (let i = this.toasts.length - 1; i >= 0; i--) {
        this.toasts[i].life -= dt;
        if (this.toasts[i].life <= 0) this.toasts.splice(i, 1);
      }
    }

    /**
     * Draw toast stack (top-right area, below pause).
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} width
     */
    draw(ctx, width) {
      let y = 64;
      for (const t of this.toasts) {
        const alpha = Math.min(1, t.life, 0.5);
        ctx.save();
        ctx.globalAlpha = Math.max(0.15, Math.min(1, t.life > 0.4 ? 1 : t.life / 0.4));
        const tw = Math.min(260, width * 0.7);
        const x = width - tw - 12;
        ctx.fillStyle = 'rgba(8,22,40,0.88)';
        ctx.strokeStyle = 'rgba(255,209,102,0.55)';
        ctx.lineWidth = 1.5;
        roundRect(ctx, x, y, tw, 52, 10);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#ffd166';
        ctx.font = '700 12px Orbitron, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('ACHIEVEMENT', x + 12, y + 16);
        ctx.fillStyle = '#e8f4ff';
        ctx.font = '700 14px Rajdhani, sans-serif';
        ctx.fillText(t.title, x + 12, y + 34);
        ctx.restore();
        y += 60;
        void alpha;
      }
    }

    listStatus() {
      return DEFS.map((d) => ({
        ...d,
        unlocked: this.storage.hasAchievement(d.id),
      }));
    }
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  global.SkyRunner = global.SkyRunner || {};
  global.SkyRunner.AchievementManager = AchievementManager;
  global.SkyRunner.ACHIEVEMENT_DEFS = DEFS;
})(typeof window !== 'undefined' ? window : globalThis);
