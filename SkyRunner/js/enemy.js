/**
 * enemy.js — Obstacles and hazards for Sky Runner
 */
(function (global) {
  'use strict';

  const TYPES = Object.freeze({
    SPIKE: 'spike',
    BARRIER: 'barrier',
    FLYER: 'flyer',
    LOW: 'low',
    BOULDER: 'boulder',
    LASER: 'laser',
  });

  class Enemy {
    /**
     * @param {string} type
     * @param {number} x
     * @param {number} groundY
     * @param {number} [speedMod]
     */
    constructor(type, x, groundY, speedMod = 0) {
      this.type = type;
      this.x = x;
      this.groundY = groundY;
      this.active = true;
      this.anim = Math.random() * Math.PI * 2;
      this.speedMod = speedMod;
      this._configure();
    }

    _configure() {
      switch (this.type) {
        case TYPES.SPIKE:
          this.w = 36;
          this.h = 34;
          this.y = this.groundY - this.h;
          this.color = '#ff6b4a';
          break;
        case TYPES.BARRIER:
          this.w = 28;
          this.h = 70;
          this.y = this.groundY - this.h;
          this.color = '#8b5a2b';
          break;
        case TYPES.LOW:
          // Must slide under
          this.w = 70;
          this.h = 28;
          this.y = this.groundY - 70;
          this.color = '#c084fc';
          break;
        case TYPES.FLYER:
          this.w = 44;
          this.h = 28;
          this.y = this.groundY - 110 - Math.random() * 40;
          this.color = '#f43f5e';
          this.baseY = this.y;
          break;
        case TYPES.BOULDER:
          this.w = 40;
          this.h = 40;
          this.y = this.groundY - this.h;
          this.color = '#78716c';
          this.speedMod = 60;
          break;
        case TYPES.LASER:
          this.w = 12;
          this.h = 90;
          this.y = this.groundY - this.h - 10;
          this.color = '#ef4444';
          this.pulse = true;
          break;
        default:
          this.w = 30;
          this.h = 30;
          this.y = this.groundY - this.h;
          this.color = '#ff6b4a';
      }
    }

    /**
     * @param {number} dt
     * @param {number} speed
     */
    update(dt, speed) {
      this.x -= (speed + this.speedMod) * dt;
      this.anim += dt * 6;
      if (this.type === TYPES.FLYER) {
        this.y = this.baseY + Math.sin(this.anim) * 12;
      }
      if (this.type === TYPES.BOULDER) {
        this.rot = (this.rot || 0) + dt * 8;
      }
      if (this.x + this.w < -40) this.active = false;
    }

    /** Expanded near-miss probe bounds */
    getNearMissBounds() {
      return {
        x: this.x - 18,
        y: this.y - 10,
        w: this.w + 36,
        h: this.h + 20,
      };
    }

    getBounds() {
      const inset = 4;
      return {
        x: this.x + inset,
        y: this.y + inset,
        w: this.w - inset * 2,
        h: this.h - inset * 2,
      };
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
      ctx.save();
      switch (this.type) {
        case TYPES.SPIKE:
          this._drawSpike(ctx);
          break;
        case TYPES.BARRIER:
          this._drawBarrier(ctx);
          break;
        case TYPES.LOW:
          this._drawLow(ctx);
          break;
        case TYPES.FLYER:
          this._drawFlyer(ctx);
          break;
        case TYPES.BOULDER:
          this._drawBoulder(ctx);
          break;
        case TYPES.LASER:
          this._drawLaser(ctx);
          break;
        default:
          ctx.fillStyle = this.color;
          ctx.fillRect(this.x, this.y, this.w, this.h);
      }
      ctx.restore();
    }

    _drawSpike(ctx) {
      ctx.fillStyle = '#ff6b4a';
      ctx.beginPath();
      ctx.moveTo(this.x, this.groundY);
      ctx.lineTo(this.x + this.w / 2, this.y);
      ctx.lineTo(this.x + this.w, this.groundY);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#ff9a82';
      ctx.beginPath();
      ctx.moveTo(this.x + this.w * 0.25, this.groundY);
      ctx.lineTo(this.x + this.w / 2, this.y + 8);
      ctx.lineTo(this.x + this.w * 0.5, this.groundY);
      ctx.closePath();
      ctx.fill();
    }

    _drawBarrier(ctx) {
      ctx.fillStyle = '#6b4226';
      ctx.fillRect(this.x + 8, this.y, 12, this.h);
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(this.x, this.y + 8, this.w, 10);
      ctx.fillRect(this.x, this.y + 28, this.w, 10);
      ctx.fillRect(this.x, this.y + 48, this.w, 10);
      // Warning stripe
      ctx.fillStyle = '#ffd166';
      ctx.fillRect(this.x, this.y, this.w, 6);
    }

    _drawLow(ctx) {
      // Overhead bar — slide under
      ctx.fillStyle = 'rgba(192,132,252,0.25)';
      ctx.fillRect(this.x - 4, this.y - 4, this.w + 8, this.h + 8);
      ctx.fillStyle = '#c084fc';
      ctx.fillRect(this.x, this.y, this.w, this.h);
      ctx.fillStyle = '#e9d5ff';
      ctx.fillRect(this.x + 6, this.y + 8, this.w - 12, 6);
      // Posts
      ctx.fillStyle = '#7c3aed';
      ctx.fillRect(this.x, this.y + this.h, 8, this.groundY - (this.y + this.h));
      ctx.fillRect(this.x + this.w - 8, this.y + this.h, 8, this.groundY - (this.y + this.h));
    }

    _drawFlyer(ctx) {
      const flap = Math.sin(this.anim) * 8;
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.ellipse(this.x + this.w / 2, this.y + this.h / 2, this.w / 2, this.h / 2.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fb7185';
      ctx.beginPath();
      ctx.moveTo(this.x + 8, this.y + this.h / 2);
      ctx.lineTo(this.x - 10, this.y + this.h / 2 - flap);
      ctx.lineTo(this.x + 8, this.y + this.h / 2 + 6);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(this.x + this.w - 8, this.y + this.h / 2);
      ctx.lineTo(this.x + this.w + 10, this.y + this.h / 2 - flap);
      ctx.lineTo(this.x + this.w - 8, this.y + this.h / 2 + 6);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(this.x + this.w * 0.65, this.y + this.h * 0.4, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#111';
      ctx.beginPath();
      ctx.arc(this.x + this.w * 0.68, this.y + this.h * 0.4, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    _drawBoulder(ctx) {
      const cx = this.x + this.w / 2;
      const cy = this.y + this.h / 2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(this.rot || 0);
      ctx.fillStyle = '#78716c';
      ctx.beginPath();
      ctx.arc(0, 0, this.w / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#a8a29e';
      ctx.beginPath();
      ctx.arc(-6, -4, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#44403c';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, this.w / 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    _drawLaser(ctx) {
      const pulse = 0.55 + 0.45 * Math.sin(this.anim * 2);
      ctx.fillStyle = `rgba(239,68,68,${0.25 + pulse * 0.25})`;
      ctx.fillRect(this.x - 6, this.y, this.w + 12, this.h);
      ctx.fillStyle = `rgba(254,202,202,${pulse})`;
      ctx.fillRect(this.x, this.y, this.w, this.h);
      ctx.fillStyle = '#fecaca';
      ctx.fillRect(this.x - 8, this.y - 6, this.w + 16, 6);
      ctx.fillRect(this.x - 8, this.y + this.h, this.w + 16, 6);
    }
  }

  class EnemySpawner {
    constructor() {
      this.enemies = [];
      this.timer = 0;
      this.nextInterval = 1.6;
    }

    reset() {
      this.enemies.length = 0;
      this.timer = 0;
      this.nextInterval = 1.6;
    }

    /**
     * Progressive difficulty: shorter gaps, more variety.
     * @param {number} dt
     * @param {number} speed
     * @param {number} distance
     * @param {number} canvasW
     * @param {number} groundY
     */
    update(dt, speed, distance, canvasW, groundY) {
      this.timer += dt;
      const difficulty = Math.min(1, distance / 4000);
      this.nextInterval = Math.max(0.75, 1.7 - difficulty * 0.85);

      if (this.timer >= this.nextInterval) {
        this.timer = 0;
        this._spawn(canvasW, groundY, difficulty);
      }

      for (let i = this.enemies.length - 1; i >= 0; i--) {
        const e = this.enemies[i];
        e.update(dt, speed);
        if (!e.active) this.enemies.splice(i, 1);
      }
    }

    _spawn(canvasW, groundY, difficulty) {
      const roll = Math.random();
      let type = TYPES.SPIKE;
      if (difficulty < 0.15) {
        type = roll < 0.7 ? TYPES.SPIKE : TYPES.BARRIER;
      } else if (difficulty < 0.4) {
        if (roll < 0.3) type = TYPES.SPIKE;
        else if (roll < 0.5) type = TYPES.BARRIER;
        else if (roll < 0.7) type = TYPES.LOW;
        else if (roll < 0.88) type = TYPES.FLYER;
        else type = TYPES.BOULDER;
      } else {
        if (roll < 0.18) type = TYPES.SPIKE;
        else if (roll < 0.34) type = TYPES.BARRIER;
        else if (roll < 0.52) type = TYPES.LOW;
        else if (roll < 0.7) type = TYPES.FLYER;
        else if (roll < 0.86) type = TYPES.BOULDER;
        else type = TYPES.LASER;
      }

      const x = canvasW + 40 + Math.random() * 60;
      this.enemies.push(new Enemy(type, x, groundY));

      if (difficulty > 0.55 && Math.random() < 0.28) {
        const gap = 140 + Math.random() * 60;
        const second = Math.random() < 0.5 ? TYPES.SPIKE : TYPES.FLYER;
        this.enemies.push(new Enemy(second, x + gap, groundY));
      }
    }

    draw(ctx) {
      for (const e of this.enemies) e.draw(ctx);
    }
  }

  global.SkyRunner = global.SkyRunner || {};
  global.SkyRunner.Enemy = Enemy;
  global.SkyRunner.EnemySpawner = EnemySpawner;
  global.SkyRunner.ENEMY_TYPES = TYPES;
})(typeof window !== 'undefined' ? window : globalThis);
