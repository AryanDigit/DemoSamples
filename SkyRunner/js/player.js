/**
 * player.js — Runner character: jump, double-jump, slide, power-ups
 */
(function (global) {
  'use strict';

  const STATE = Object.freeze({
    RUN: 'run',
    JUMP: 'jump',
    SLIDE: 'slide',
    HURT: 'hurt',
  });

  class Player {
    /**
     * @param {number} groundY
     */
    constructor(groundY) {
      this.groundY = groundY;
      this.width = 42;
      this.height = 58;
      this.x = 110;
      this.y = groundY - this.height;
      this.vy = 0;
      this.gravity = 2200;
      this.jumpForce = -780;
      this.doubleJumpForce = -700;

      this.state = STATE.RUN;
      this.jumpsUsed = 0;
      this.maxJumps = 2;
      this.slideTimer = 0;
      this.slideDuration = 0.55;
      this.invulnTimer = 0;
      this.animTime = 0;
      this.facing = 1;

      // Power-ups (seconds remaining)
      this.magnetTime = 0;
      this.shieldTime = 0;
      this.boostTime = 0;
      this.slowmoTime = 0;

      this.skin = {
        id: 'azure',
        body: '#3ecfff',
        accent: '#1a6f9a',
        cap: '#ff6b4a',
      };

      this.alive = true;
      this.runFrame = 0;
    }

    /**
     * @param {{id:string, body:string, accent?:string, cap:string}} skin
     */
    setSkin(skin) {
      if (!skin) return;
      this.skin = {
        id: skin.id || 'azure',
        body: skin.body || '#3ecfff',
        accent: skin.accent || '#1a6f9a',
        cap: skin.cap || '#ff6b4a',
      };
    }

    reset(groundY) {
      this.groundY = groundY;
      this.height = 58;
      this.width = 42;
      this.y = groundY - this.height;
      this.vy = 0;
      this.state = STATE.RUN;
      this.jumpsUsed = 0;
      this.slideTimer = 0;
      this.invulnTimer = 0;
      this.magnetTime = 0;
      this.shieldTime = 0;
      this.boostTime = 0;
      this.slowmoTime = 0;
      this.alive = true;
      this.animTime = 0;
    }

    setGroundY(groundY) {
      const wasOnGround = this.isOnGround();
      this.groundY = groundY;
      if (wasOnGround) this.y = groundY - this.height;
    }

    isOnGround() {
      return this.y + this.height >= this.groundY - 0.5;
    }

    hasMagnet() {
      return this.magnetTime > 0;
    }

    hasShield() {
      return this.shieldTime > 0;
    }

    hasBoost() {
      return this.boostTime > 0;
    }

    hasSlowmo() {
      return this.slowmoTime > 0;
    }

    /**
     * @param {'magnet'|'shield'|'boost'|'slowmo'} type
     * @param {number} duration seconds
     */
    applyPowerup(type, duration = 6) {
      if (type === 'magnet') this.magnetTime = Math.max(this.magnetTime, duration);
      if (type === 'shield') this.shieldTime = Math.max(this.shieldTime, duration);
      if (type === 'boost') this.boostTime = Math.max(this.boostTime, duration);
      if (type === 'slowmo') this.slowmoTime = Math.max(this.slowmoTime, duration);
    }

    jump() {
      if (!this.alive) return false;
      if (this.state === STATE.SLIDE) this._endSlide();

      if (this.isOnGround()) {
        this.vy = this.jumpForce;
        this.jumpsUsed = 1;
        this.state = STATE.JUMP;
        return 'jump';
      }
      if (this.jumpsUsed < this.maxJumps) {
        this.vy = this.doubleJumpForce;
        this.jumpsUsed += 1;
        this.state = STATE.JUMP;
        return 'double';
      }
      return false;
    }

    startSlide() {
      if (!this.alive || !this.isOnGround()) return false;
      if (this.state === STATE.SLIDE) {
        this.slideTimer = this.slideDuration;
        return true;
      }
      this.state = STATE.SLIDE;
      this.slideTimer = this.slideDuration;
      this.height = 32;
      this.y = this.groundY - this.height;
      return true;
    }

    _endSlide() {
      this.height = 58;
      this.y = this.groundY - this.height;
      this.state = STATE.RUN;
      this.slideTimer = 0;
    }

    /**
     * @param {number} dt
     * @param {{jump:boolean, slide:boolean}} input
     * @returns {{jumped:false|'jump'|'double', slid:boolean}}
     */
    update(dt, input) {
      const result = { jumped: false, slid: false };
      if (!this.alive) return result;

      this.animTime += dt;
      this.invulnTimer = Math.max(0, this.invulnTimer - dt);
      this.magnetTime = Math.max(0, this.magnetTime - dt);
      this.shieldTime = Math.max(0, this.shieldTime - dt);
      this.boostTime = Math.max(0, this.boostTime - dt);
      this.slowmoTime = Math.max(0, this.slowmoTime - dt);

      if (input.jump) {
        const j = this.jump();
        if (j) result.jumped = j;
      }

      if (input.slide && this.isOnGround()) {
        const wasSliding = this.state === STATE.SLIDE;
        if (this.startSlide() && !wasSliding) result.slid = true;
      }

      if (this.state === STATE.SLIDE) {
        this.slideTimer -= dt;
        if (this.slideTimer <= 0 || (!input.slide && this.slideTimer < this.slideDuration * 0.6)) {
          this._endSlide();
        }
      }

      // Physics
      this.vy += this.gravity * dt;
      this.y += this.vy * dt;

      if (this.y + this.height >= this.groundY) {
        this.y = this.groundY - this.height;
        this.vy = 0;
        if (this.state === STATE.JUMP || this.state === STATE.HURT) {
          this.state = STATE.RUN;
        }
        this.jumpsUsed = 0;
      } else if (this.state !== STATE.SLIDE) {
        this.state = STATE.JUMP;
      }

      this.runFrame = Math.floor(this.animTime * 10) % 4;
      return result;
    }

    /**
     * Take a hit. Returns true if life should be lost.
     * Shield absorbs hit without life loss.
     */
    hit() {
      if (this.invulnTimer > 0) return false;
      if (this.hasShield()) {
        this.shieldTime = 0;
        this.invulnTimer = 1.2;
        return 'shield';
      }
      this.invulnTimer = 1.5;
      this.state = STATE.HURT;
      this.vy = -320;
      return 'life';
    }

    /** Axis-aligned bounding box (slightly inset for fairness). */
    getBounds() {
      const insetX = 8;
      const insetTop = this.state === STATE.SLIDE ? 4 : 10;
      return {
        x: this.x + insetX,
        y: this.y + insetTop,
        w: this.width - insetX * 2,
        h: this.height - insetTop - 4,
      };
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
      if (!this.alive) return;

      const blink = this.invulnTimer > 0 && Math.floor(this.invulnTimer * 12) % 2 === 0;
      if (blink) return;

      ctx.save();
      ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

      // Shield aura
      if (this.hasShield()) {
        ctx.strokeStyle = 'rgba(96,165,250,0.85)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, Math.max(this.width, this.height) * 0.62, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(96,165,250,0.12)';
        ctx.fill();
      }

      // Magnet ring
      if (this.hasMagnet()) {
        ctx.strokeStyle = 'rgba(192,132,252,0.7)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(0, 0, 40, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Boost trail glow
      if (this.hasBoost()) {
        ctx.fillStyle = 'rgba(251,146,60,0.35)';
        ctx.beginPath();
        ctx.ellipse(-28, 8, 22, 10, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Slow-mo pulse
      if (this.hasSlowmo()) {
        ctx.strokeStyle = 'rgba(125,211,252,0.7)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 36 + Math.sin(this.animTime * 8) * 3, 0, Math.PI * 2);
        ctx.stroke();
      }

      this._drawBody(ctx);
      ctx.restore();
    }

    _drawBody(ctx) {
      const sliding = this.state === STATE.SLIDE;
      const legPhase = this.runFrame;
      const body = this.skin.body;
      const cap = this.skin.cap;
      const accent = this.skin.accent;

      ctx.fillStyle = body;
      if (sliding) {
        ctx.fillRect(-22, -8, 44, 22);
        ctx.fillStyle = '#ffe0c2';
        ctx.beginPath();
        ctx.arc(16, -2, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0b1a2b';
        ctx.fillRect(18, -5, 4, 3);
      } else {
        ctx.fillRect(-14, -22, 28, 34);
        ctx.fillStyle = '#ffe0c2';
        ctx.beginPath();
        ctx.arc(0, -30, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = cap;
        ctx.beginPath();
        ctx.arc(0, -34, 10, Math.PI, 0);
        ctx.fill();
        ctx.fillStyle = '#0b1a2b';
        ctx.fillRect(2, -32, 4, 4);

        ctx.fillStyle = accent;
        if (this.state === STATE.JUMP) {
          ctx.fillRect(-10, 12, 8, 16);
          ctx.fillRect(4, 10, 8, 14);
        } else {
          const o = legPhase % 2 === 0 ? 6 : -6;
          ctx.fillRect(-12, 12, 8, 16 + (o > 0 ? 2 : -2));
          ctx.fillRect(4, 12, 8, 16 - (o > 0 ? 2 : -2));
        }

        ctx.fillStyle = '#ffe0c2';
        const armSwing = this.state === STATE.JUMP ? -10 : legPhase % 2 === 0 ? 8 : -8;
        ctx.fillRect(-20, -10, 8, 16);
        ctx.fillRect(12, -10 + armSwing * 0.15, 8, 16);
      }
    }
  }

  Player.STATE = STATE;

  global.SkyRunner = global.SkyRunner || {};
  global.SkyRunner.Player = Player;
})(typeof window !== 'undefined' ? window : globalThis);
