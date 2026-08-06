/**
 * floating.js — Floating score / banner text overlays (canvas)
 */
(function (global) {
  'use strict';

  class FloatingText {
    constructor(x, y, text, opts = {}) {
      this.x = x;
      this.y = y;
      this.text = text;
      this.color = opts.color || '#ffd166';
      this.size = opts.size || 18;
      this.life = opts.life || 0.9;
      this.maxLife = this.life;
      this.vy = opts.vy ?? -48;
      this.active = true;
    }

    update(dt) {
      this.life -= dt;
      this.y += this.vy * dt;
      if (this.life <= 0) this.active = false;
    }

    draw(ctx) {
      const a = Math.max(0, this.life / this.maxLife);
      ctx.save();
      ctx.globalAlpha = a;
      ctx.font = `700 ${this.size}px Orbitron, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = this.color;
      ctx.strokeStyle = 'rgba(0,0,0,0.45)';
      ctx.lineWidth = 3;
      ctx.strokeText(this.text, this.x, this.y);
      ctx.fillText(this.text, this.x, this.y);
      ctx.restore();
    }
  }

  class FloatingTextSystem {
    constructor() {
      this.items = [];
      this.banner = null;
    }

    spawn(x, y, text, opts) {
      this.items.push(new FloatingText(x, y, text, opts));
    }

    /**
     * Full-width announcement (biome change, mission complete, etc.)
     * @param {string} text
     * @param {number} duration
     * @param {string} color
     */
    showBanner(text, duration = 2.2, color = '#3ecfff') {
      this.banner = { text, life: duration, maxLife: duration, color };
    }

    update(dt) {
      for (let i = this.items.length - 1; i >= 0; i--) {
        this.items[i].update(dt);
        if (!this.items[i].active) this.items.splice(i, 1);
      }
      if (this.banner) {
        this.banner.life -= dt;
        if (this.banner.life <= 0) this.banner = null;
      }
    }

    draw(ctx, width, height) {
      for (const item of this.items) item.draw(ctx);
      if (this.banner) {
        const a = Math.min(1, this.banner.life * 2, this.banner.maxLife - this.banner.life + 0.01);
        const fade = Math.min(1, this.banner.life, (this.banner.maxLife - this.banner.life) * 2);
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, fade));
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.fillRect(0, height * 0.22, width, 48);
        ctx.font = '700 22px Orbitron, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = this.banner.color;
        ctx.fillText(this.banner.text, width / 2, height * 0.22 + 24);
        ctx.restore();
        void a;
      }
    }

    clear() {
      this.items.length = 0;
      this.banner = null;
    }
  }

  global.SkyRunner = global.SkyRunner || {};
  global.SkyRunner.FloatingTextSystem = FloatingTextSystem;
})(typeof window !== 'undefined' ? window : globalThis);
