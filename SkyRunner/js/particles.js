/**
 * particles.js — Lightweight particle system for VFX
 */
(function (global) {
  'use strict';

  class Particle {
    /**
     * @param {number} x
     * @param {number} y
     * @param {object} opts
     */
    constructor(x, y, opts = {}) {
      this.x = x;
      this.y = y;
      this.vx = opts.vx ?? (Math.random() - 0.5) * 4;
      this.vy = opts.vy ?? (Math.random() - 0.5) * 4;
      this.life = opts.life ?? 0.6;
      this.maxLife = this.life;
      this.size = opts.size ?? 3 + Math.random() * 3;
      this.color = opts.color || '#fff';
      this.gravity = opts.gravity ?? 0.12;
      this.fade = opts.fade !== false;
      this.active = true;
    }

    /**
     * @param {number} dt seconds
     */
    update(dt) {
      this.life -= dt;
      if (this.life <= 0) {
        this.active = false;
        return;
      }
      this.vy += this.gravity * (dt * 60);
      this.x += this.vx * (dt * 60);
      this.y += this.vy * (dt * 60);
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
      const alpha = this.fade ? Math.max(0, this.life / this.maxLife) : 1;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  class ParticleSystem {
    constructor(maxParticles = 220) {
      this.max = maxParticles;
      this.particles = [];
      this.enabled = true;
    }

    setEnabled(on) {
      this.enabled = Boolean(on);
      if (!this.enabled) this.particles.length = 0;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} count
     * @param {object} opts
     */
    emit(x, y, count, opts = {}) {
      if (!this.enabled) return;
      const n = Math.min(count, this.max - this.particles.length);
      for (let i = 0; i < n; i++) {
        this.particles.push(new Particle(x, y, opts));
      }
    }

    burstCoins(x, y) {
      this.emit(x, y, 10, {
        color: '#ffd166',
        size: 2 + Math.random() * 2,
        vx: (Math.random() - 0.5) * 6,
        vy: -Math.random() * 4 - 1,
        life: 0.45 + Math.random() * 0.3,
        gravity: 0.18,
      });
    }

    burstHit(x, y) {
      this.emit(x, y, 16, {
        color: Math.random() > 0.5 ? '#ff6b4a' : '#fff',
        size: 2 + Math.random() * 3,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 0.35 + Math.random() * 0.25,
        gravity: 0.05,
      });
    }

    burstPowerup(x, y, color) {
      this.emit(x, y, 14, {
        color: color || '#3ecfff',
        size: 2 + Math.random() * 3,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        life: 0.5 + Math.random() * 0.3,
        gravity: -0.02,
      });
    }

    dust(x, y) {
      this.emit(x, y, 3, {
        color: 'rgba(200,180,140,0.9)',
        size: 1.5 + Math.random() * 2,
        vx: -2 - Math.random() * 2,
        vy: -Math.random() * 1.5,
        life: 0.25,
        gravity: 0.05,
      });
    }

    /**
     * @param {number} dt
     */
    update(dt) {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.update(dt);
        if (!p.active) this.particles.splice(i, 1);
      }
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
      if (!this.enabled || this.particles.length === 0) return;
      ctx.save();
      for (let i = 0; i < this.particles.length; i++) {
        this.particles[i].draw(ctx);
      }
      ctx.restore();
    }

    clear() {
      this.particles.length = 0;
    }
  }

  global.SkyRunner = global.SkyRunner || {};
  global.SkyRunner.ParticleSystem = ParticleSystem;
})(typeof window !== 'undefined' ? window : globalThis);
