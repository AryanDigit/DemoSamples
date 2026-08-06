/**
 * game.js — Sky Runner main controller
 * Owns the game loop, state machine, collisions, and module wiring.
 */
(function (global) {
  'use strict';

  const { StorageManager, SoundManager, InputManager, ParticleSystem,
    Background, Player, EnemySpawner, PickupSpawner, PICKUP_TYPES, UIManager } = global.SkyRunner;

  const STATE = Object.freeze({
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAMEOVER: 'gameover',
  });

  /** AABB intersection */
  function aabb(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  class Game {
    constructor() {
      this.canvas = document.getElementById('game-canvas');
      if (!this.canvas) throw new Error('[SkyRunner] Canvas element not found');
      this.ctx = this.canvas.getContext('2d', { alpha: false });
      if (!this.ctx) throw new Error('[SkyRunner] 2D context unavailable');

      this.width = 0;
      this.height = 0;
      this.dpr = 1;

      this.state = STATE.MENU;
      this.lastTime = 0;
      this.acc = 0;
      this.fixedDt = 1 / 60;
      this.rafId = null;
      this.fps = 60;
      this._fpsFrames = 0;
      this._fpsTimer = 0;

      this.score = 0;
      this.coins = 0;
      this.distance = 0;
      this.lives = 3;
      this.combo = 1;
      this.comboTimer = 0;
      this.baseSpeed = 280;
      this.speed = this.baseSpeed;

      this.storage = new StorageManager();
      this.sound = new SoundManager();
      this.input = new InputManager(document.getElementById('game-container'));
      this.particles = new ParticleSystem();
      this.background = null;
      this.player = null;
      this.enemies = new EnemySpawner();
      this.pickups = new PickupSpawner();

      this.ui = new UIManager(this._collectElements(), this.storage);

      this._onResize = this.resize.bind(this);
      this._onVisibility = this._handleVisibility.bind(this);
      this._onKeyPause = this._handlePauseKey.bind(this);

      this._init();
    }

    _collectElements() {
      return {
        hud: document.getElementById('hud'),
        hudPowerups: document.getElementById('hud-powerups'),
        menuStart: document.getElementById('menu-start'),
        menuPause: document.getElementById('menu-pause'),
        menuSettings: document.getElementById('menu-settings'),
        menuGameOver: document.getElementById('menu-gameover'),
        touchControls: document.getElementById('touch-controls'),
        btnPlay: document.getElementById('btn-play'),
        btnRestart: document.getElementById('btn-restart'),
        btnPauseRestart: document.getElementById('btn-pause-restart'),
        btnResume: document.getElementById('btn-resume'),
        btnPause: document.getElementById('btn-pause'),
        btnMenu: document.getElementById('btn-menu'),
        btnSettings: document.getElementById('btn-settings'),
        btnPauseSettings: document.getElementById('btn-pause-settings'),
        btnSettingsBack: document.getElementById('btn-settings-back'),
        btnSfx: document.getElementById('btn-sfx-toggle'),
        btnMusic: document.getElementById('btn-music-toggle'),
        btnParticles: document.getElementById('btn-particles-toggle'),
        finalScore: document.querySelector('[data-ui="finalScore"]'),
        finalCoins: document.querySelector('[data-ui="finalCoins"]'),
        finalDistance: document.querySelector('[data-ui="finalDistance"]'),
        newHighScore: document.getElementById('new-high-score'),
      };
    }

    _init() {
      try {
        this.resize();
        this.background = new Background(this.width, this.height);
        this.player = new Player(this.background.groundY);

        const settings = this.storage.getSettings();
        this.sound.setSfxEnabled(settings.sfx);
        this.sound.setMusicEnabled(settings.music);
        this.particles.setEnabled(settings.particles);

        this.input.bind(
          document.getElementById('touch-jump'),
          document.getElementById('touch-slide')
        );
        this.input.updateTouchVisibility(document.getElementById('touch-controls'));

        this.ui.bind({
          onPlay: () => this.startGame(),
          onRestart: () => this.startGame(),
          onResume: () => this.resume(),
          onPause: () => this.pause(),
          onMenu: () => this.toMenu(),
          onSettingsChange: (s) => this._applySettings(s),
        });

        window.addEventListener('resize', this._onResize);
        window.addEventListener('orientationchange', this._onResize);
        document.addEventListener('visibilitychange', this._onVisibility);
        window.addEventListener('keydown', this._onKeyPause);

        this.ui.showStart();
        this.lastTime = performance.now();
        this.loop(this.lastTime);
      } catch (err) {
        console.error('[SkyRunner] Init failed:', err);
        this._showFatal(err);
      }
    }

    _showFatal(err) {
      const msg = document.createElement('div');
      msg.style.cssText =
        'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;' +
        'background:#07111f;color:#e8f4ff;font-family:sans-serif;padding:2rem;text-align:center;z-index:9999';
      msg.innerHTML = `<div><h2>Sky Runner failed to start</h2><p>${String(err.message || err)}</p></div>`;
      document.body.appendChild(msg);
    }

    _applySettings(s) {
      this.sound.setSfxEnabled(s.sfx);
      this.sound.setMusicEnabled(s.music);
      this.particles.setEnabled(s.particles);
      this.sound.playClick();
    }

    resize() {
      const container = document.getElementById('game-container');
      const w = container ? container.clientWidth : window.innerWidth;
      const h = container ? container.clientHeight : window.innerHeight;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.width = w;
      this.height = h;
      this.canvas.width = Math.floor(w * this.dpr);
      this.canvas.height = Math.floor(h * this.dpr);
      this.canvas.style.width = `${w}px`;
      this.canvas.style.height = `${h}px`;
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

      if (this.background) {
        this.background.resize(w, h);
        if (this.player) this.player.setGroundY(this.background.groundY);
      }
    }

    async _ensureAudio() {
      await this.sound.init();
      const s = this.storage.getSettings();
      this.sound.setSfxEnabled(s.sfx);
      this.sound.setMusicEnabled(s.music);
      if (s.music) this.sound.startMusic();
    }

    async startGame() {
      try {
        await this._ensureAudio();
        this.sound.playClick();

        this.score = 0;
        this.coins = 0;
        this.distance = 0;
        this.lives = 3;
        this.combo = 1;
        this.comboTimer = 0;
        this.speed = this.baseSpeed;

        this.enemies.reset();
        this.pickups.reset();
        this.particles.clear();
        this.player.reset(this.background.groundY);
        this.background.time = 0.08;

        this.state = STATE.PLAYING;
        this.input.setEnabled(true);
        this.input.updateTouchVisibility(document.getElementById('touch-controls'));
        const touch = !document.getElementById('touch-controls').classList.contains('hidden');
        this.ui.showPlaying(touch);
        this.ui.updateHud(this._hudData());
      } catch (err) {
        console.error('[SkyRunner] startGame error:', err);
      }
    }

    pause() {
      if (this.state !== STATE.PLAYING) return;
      this.state = STATE.PAUSED;
      this.input.setEnabled(false);
      this.ui.showPause();
      this.sound.playClick();
    }

    resume() {
      if (this.state !== STATE.PAUSED) return;
      this.state = STATE.PLAYING;
      this.input.setEnabled(true);
      this.ui.hidePause();
      this.lastTime = performance.now();
      this.sound.playClick();
    }

    toMenu() {
      this.state = STATE.MENU;
      this.input.setEnabled(false);
      this.enemies.reset();
      this.pickups.reset();
      this.particles.clear();
      this.ui.showStart();
      this.sound.playClick();
    }

    gameOver() {
      this.state = STATE.GAMEOVER;
      this.input.setEnabled(false);
      this.sound.playGameOver();
      this.sound.stopMusic();
      const isNew = this.storage.setHighScore(this.score);
      this.ui.showGameOver(
        { score: this.score, coins: this.coins, distance: this.distance },
        isNew
      );
    }

    _handleVisibility() {
      if (document.hidden && this.state === STATE.PLAYING) {
        this.pause();
      }
    }

    _handlePauseKey(e) {
      if (e.code === 'Escape' || e.key === 'Escape' || e.code === 'KeyP') {
        if (this.state === STATE.PLAYING) this.pause();
        else if (this.state === STATE.PAUSED) this.resume();
      }
    }

    _hudData() {
      return {
        score: this.score,
        coins: this.coins,
        distance: this.distance,
        lives: this.lives,
        combo: this.combo,
        powerups: {
          magnet: this.player.magnetTime,
          shield: this.player.shieldTime,
          boost: this.player.boostTime,
        },
      };
    }

    /**
     * Main rAF loop targeting ~60 FPS with fixed update step.
     * @param {number} now
     */
    loop(now) {
      this.rafId = requestAnimationFrame((t) => this.loop(t));
      const frameDt = Math.min(0.05, (now - this.lastTime) / 1000);
      this.lastTime = now;

      this._fpsFrames += 1;
      this._fpsTimer += frameDt;
      if (this._fpsTimer >= 0.5) {
        this.fps = Math.round(this._fpsFrames / this._fpsTimer);
        this._fpsFrames = 0;
        this._fpsTimer = 0;
      }

      if (this.state === STATE.PLAYING) {
        this.acc += frameDt;
        // Cap spiral of death
        let steps = 0;
        while (this.acc >= this.fixedDt && steps < 5) {
          this.update(this.fixedDt);
          this.acc -= this.fixedDt;
          steps += 1;
        }
      } else {
        this.acc = 0;
        // Idle parallax on menus
        if (this.state === STATE.MENU || this.state === STATE.GAMEOVER) {
          this.background.update(frameDt, 40);
        }
      }

      this.render();
    }

    /**
     * @param {number} dt fixed timestep seconds
     */
    update(dt) {
      const jump = this.input.consumeJump();
      const slide = this.input.isSliding();

      // Progressive difficulty speed
      const difficulty = Math.min(1.8, this.distance / 2500);
      let targetSpeed = this.baseSpeed + difficulty * 180;
      if (this.player.hasBoost()) targetSpeed *= 1.45;
      this.speed += (targetSpeed - this.speed) * Math.min(1, dt * 3);

      const action = this.player.update(dt, { jump, slide });

      if (action.jumped === 'jump') this.sound.playJump();
      else if (action.jumped === 'double') this.sound.playDoubleJump();
      if (action.slid) this.sound.playSlide();

      this.background.update(dt, this.speed);
      this.enemies.update(dt, this.speed, this.distance, this.width, this.background.groundY);

      const attractor = {
        x: this.player.x + this.player.width / 2,
        y: this.player.y + this.player.height / 2,
        magnet: this.player.hasMagnet(),
      };
      this.pickups.update(dt, this.speed, this.width, this.background.groundY, attractor);

      this._resolveCollisions();

      this.distance += (this.speed * dt) / 8;
      this.score += (10 + this.combo * 2) * dt * (this.player.hasBoost() ? 1.5 : 1);

      this.comboTimer -= dt;
      if (this.comboTimer <= 0) this.combo = 1;

      // Foot dust while running
      if (this.player.isOnGround() && this.player.state === Player.STATE.RUN && Math.random() < 0.3) {
        this.particles.dust(this.player.x + 10, this.background.groundY - 2);
      }

      this.particles.update(dt);
      this.ui.updateHud(this._hudData());
    }

    _resolveCollisions() {
      const pb = this.player.getBounds();

      // Enemies
      for (const e of this.enemies.enemies) {
        if (!e.active) continue;
        if (aabb(pb, e.getBounds())) {
          const result = this.player.hit();
          if (result === 'shield') {
            this.sound.playPowerup();
            this.particles.burstPowerup(pb.x + pb.w / 2, pb.y + pb.h / 2, '#60a5fa');
            e.active = false;
          } else if (result === 'life') {
            this.sound.playHit();
            this.particles.burstHit(pb.x + pb.w / 2, pb.y + pb.h / 2);
            this.lives -= 1;
            this.combo = 1;
            e.active = false;
            if (this.lives <= 0) {
              this.gameOver();
              return;
            }
          }
        }
      }

      // Pickups
      for (const p of this.pickups.pickups) {
        if (!p.active) continue;
        if (aabb(pb, p.getBounds())) {
          p.active = false;
          this._collect(p);
        }
      }
    }

    _collect(p) {
      const cx = p.x;
      const cy = p.y;
      if (p.type === PICKUP_TYPES.COIN) {
        this.coins += 1;
        this.combo = Math.min(10, this.combo + 1);
        this.comboTimer = 2.2;
        this.score += 25 * this.combo;
        this.sound.playCoin();
        this.particles.burstCoins(cx, cy);
      } else if (p.type === PICKUP_TYPES.MAGNET) {
        this.player.applyPowerup('magnet', 7);
        this.sound.playPowerup();
        this.particles.burstPowerup(cx, cy, '#c084fc');
        this.score += 50;
      } else if (p.type === PICKUP_TYPES.SHIELD) {
        this.player.applyPowerup('shield', 7);
        this.sound.playPowerup();
        this.particles.burstPowerup(cx, cy, '#60a5fa');
        this.score += 50;
      } else if (p.type === PICKUP_TYPES.BOOST) {
        this.player.applyPowerup('boost', 5);
        this.sound.playPowerup();
        this.particles.burstPowerup(cx, cy, '#fb923c');
        this.score += 50;
      }
    }

    render() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);

      this.background.draw(ctx);

      if (this.state === STATE.PLAYING || this.state === STATE.PAUSED || this.state === STATE.GAMEOVER) {
        this.pickups.draw(ctx);
        this.enemies.draw(ctx);
        this.player.draw(ctx);
        this.particles.draw(ctx);
      } else if (this.state === STATE.MENU) {
        // Decorative idle runner silhouette
        this._drawMenuRunner(ctx);
      }

      // Soft vignette for polish
      this._drawVignette(ctx);
    }

    _drawMenuRunner(ctx) {
      const gy = this.background.groundY;
      ctx.save();
      ctx.globalAlpha = 0.9;
      ctx.translate(this.width * 0.28, gy - 40);
      ctx.fillStyle = '#3ecfff';
      ctx.fillRect(-14, -30, 28, 40);
      ctx.fillStyle = '#ffe0c2';
      ctx.beginPath();
      ctx.arc(0, -40, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ff6b4a';
      ctx.beginPath();
      ctx.arc(0, -44, 10, Math.PI, 0);
      ctx.fill();
      ctx.restore();
    }

    _drawVignette(ctx) {
      const g = ctx.createRadialGradient(
        this.width / 2,
        this.height / 2,
        Math.min(this.width, this.height) * 0.35,
        this.width / 2,
        this.height / 2,
        Math.max(this.width, this.height) * 0.75
      );
      g.addColorStop(0, 'rgba(0,0,0,0)');
      g.addColorStop(1, 'rgba(0,0,0,0.35)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, this.width, this.height);
    }
  }

  // Boot
  function boot() {
    try {
      global.SkyRunner.game = new Game();
    } catch (err) {
      console.error('[SkyRunner] Boot failure:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(typeof window !== 'undefined' ? window : globalThis);
