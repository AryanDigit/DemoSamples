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
      if (this.x + this.w < -40) this.active = false;
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
      // Wings
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
      // Eye
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(this.x + this.w * 0.65, this.y + this.h * 0.4, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#111';
      ctx.beginPath();
      ctx.arc(this.x + this.w * 0.68, this.y + this.h * 0.4, 2, 0, Math.PI * 2);
      ctx.fill();
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
      if (difficulty < 0.2) {
        type = roll < 0.7 ? TYPES.SPIKE : TYPES.BARRIER;
      } else if (difficulty < 0.5) {
        if (roll < 0.35) type = TYPES.SPIKE;
        else if (roll < 0.6) type = TYPES.BARRIER;
        else if (roll < 0.8) type = TYPES.LOW;
        else type = TYPES.FLYER;
      } else {
        if (roll < 0.25) type = TYPES.SPIKE;
        else if (roll < 0.45) type = TYPES.BARRIER;
        else if (roll < 0.7) type = TYPES.LOW;
        else type = TYPES.FLYER;
      }

      const x = canvasW + 40 + Math.random() * 60;
      this.enemies.push(new Enemy(type, x, groundY));

      // Occasional double pack at higher difficulty
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
