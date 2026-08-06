/**
 * coin.js — Collectible coins and power-up pickups
 */
(function (global) {
  'use strict';

  const PICKUP = Object.freeze({
    COIN: 'coin',
    MAGNET: 'magnet',
    SHIELD: 'shield',
    BOOST: 'boost',
  });

  class Pickup {
    /**
     * @param {string} type
     * @param {number} x
     * @param {number} y
     */
    constructor(type, x, y) {
      this.type = type;
      this.x = x;
      this.y = y;
      this.r = type === PICKUP.COIN ? 12 : 16;
      this.active = true;
      this.anim = Math.random() * Math.PI * 2;
      this.value = type === PICKUP.COIN ? 1 : 0;
    }

    /**
     * @param {number} dt
     * @param {number} speed
     * @param {{x:number,y:number,magnet:boolean}|null} attractor
     */
    update(dt, speed, attractor) {
      this.anim += dt * 5;
      this.x -= speed * dt;

      if (attractor && attractor.magnet && this.type === PICKUP.COIN) {
        const dx = attractor.x - this.x;
        const dy = attractor.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 220 && dist > 1) {
          const pull = (1 - dist / 220) * 520 * dt;
          this.x += (dx / dist) * pull;
          this.y += (dy / dist) * pull;
        }
      }

      if (this.x + this.r < -30) this.active = false;
    }

    getBounds() {
      return {
        x: this.x - this.r,
        y: this.y - this.r,
        w: this.r * 2,
        h: this.r * 2,
      };
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y + Math.sin(this.anim) * 3);
      switch (this.type) {
        case PICKUP.COIN:
          this._drawCoin(ctx);
          break;
        case PICKUP.MAGNET:
          this._drawMagnet(ctx);
          break;
        case PICKUP.SHIELD:
          this._drawShield(ctx);
          break;
        case PICKUP.BOOST:
          this._drawBoost(ctx);
          break;
        default:
          break;
      }
      ctx.restore();
    }

    _drawCoin(ctx) {
      ctx.fillStyle = '#ffd166';
      ctx.beginPath();
      ctx.arc(0, 0, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f0a202';
      ctx.beginPath();
      ctx.arc(0, 0, this.r * 0.65, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffe9a8';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('$', 0, 1);
    }

    _drawMagnet(ctx) {
      ctx.fillStyle = 'rgba(192,132,252,0.2)';
      ctx.beginPath();
      ctx.arc(0, 0, this.r + 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(0, 2, 10, Math.PI * 0.15, Math.PI * 0.85);
      ctx.stroke();
      ctx.strokeStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(-10, 2);
      ctx.lineTo(-10, -8);
      ctx.stroke();
      ctx.strokeStyle = '#3b82f6';
      ctx.beginPath();
      ctx.moveTo(10, 2);
      ctx.lineTo(10, -8);
      ctx.stroke();
    }

    _drawShield(ctx) {
      ctx.fillStyle = 'rgba(96,165,250,0.25)';
      ctx.beginPath();
      ctx.arc(0, 0, this.r + 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#60a5fa';
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.quadraticCurveTo(14, -6, 12, 6);
      ctx.quadraticCurveTo(0, 14, 0, 14);
      ctx.quadraticCurveTo(0, 14, -12, 6);
      ctx.quadraticCurveTo(-14, -6, 0, -12);
      ctx.fill();
      ctx.fillStyle = '#dbeafe';
      ctx.beginPath();
      ctx.moveTo(0, -8);
      ctx.quadraticCurveTo(8, -4, 7, 4);
      ctx.quadraticCurveTo(0, 9, 0, 9);
      ctx.quadraticCurveTo(0, 9, -7, 4);
      ctx.quadraticCurveTo(-8, -4, 0, -8);
      ctx.fill();
    }

    _drawBoost(ctx) {
      ctx.fillStyle = 'rgba(251,146,60,0.25)';
      ctx.beginPath();
      ctx.arc(0, 0, this.r + 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fb923c';
      ctx.beginPath();
      ctx.moveTo(-4, -12);
      ctx.lineTo(8, 0);
      ctx.lineTo(0, 0);
      ctx.lineTo(6, 12);
      ctx.lineTo(-8, 0);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();
    }
  }

  class PickupSpawner {
    constructor() {
      this.pickups = [];
      this.coinTimer = 0;
      this.powerTimer = 0;
    }

    reset() {
      this.pickups.length = 0;
      this.coinTimer = 0;
      this.powerTimer = 2.5;
    }

    /**
     * @param {number} dt
     * @param {number} speed
     * @param {number} canvasW
     * @param {number} groundY
     * @param {{x:number,y:number,magnet:boolean}|null} attractor
     */
    update(dt, speed, canvasW, groundY, attractor) {
      this.coinTimer += dt;
      this.powerTimer += dt;

      if (this.coinTimer > 0.55) {
        this.coinTimer = 0;
        this._spawnCoinPattern(canvasW, groundY);
      }

      if (this.powerTimer > 8 + Math.random() * 4) {
        this.powerTimer = 0;
        this._spawnPowerup(canvasW, groundY);
      }

      for (let i = this.pickups.length - 1; i >= 0; i--) {
        const p = this.pickups[i];
        p.update(dt, speed, attractor);
        if (!p.active) this.pickups.splice(i, 1);
      }
    }

    _spawnCoinPattern(canvasW, groundY) {
      const pattern = Math.floor(Math.random() * 3);
      const baseX = canvasW + 30;
      const midY = groundY - 90;

      if (pattern === 0) {
        // Arc
        for (let i = 0; i < 5; i++) {
          const t = i / 4;
          const x = baseX + i * 36;
          const y = midY - Math.sin(t * Math.PI) * 55;
          this.pickups.push(new Pickup(PICKUP.COIN, x, y));
        }
      } else if (pattern === 1) {
        // Low line (jumpable / runnable)
        for (let i = 0; i < 4; i++) {
          this.pickups.push(new Pickup(PICKUP.COIN, baseX + i * 34, groundY - 48));
        }
      } else {
        // High line
        for (let i = 0; i < 4; i++) {
          this.pickups.push(new Pickup(PICKUP.COIN, baseX + i * 34, groundY - 130));
        }
      }
    }

    _spawnPowerup(canvasW, groundY) {
      const types = [PICKUP.MAGNET, PICKUP.SHIELD, PICKUP.BOOST];
      const type = types[Math.floor(Math.random() * types.length)];
      const y = groundY - 70 - Math.random() * 70;
      this.pickups.push(new Pickup(type, canvasW + 40, y));
    }

    draw(ctx) {
      for (const p of this.pickups) p.draw(ctx);
    }
  }

  global.SkyRunner = global.SkyRunner || {};
  global.SkyRunner.Pickup = Pickup;
  global.SkyRunner.PickupSpawner = PickupSpawner;
  global.SkyRunner.PICKUP_TYPES = PICKUP;
})(typeof window !== 'undefined' ? window : globalThis);
