/**
 * background.js — Parallax sky scenery with day/night cycle
 * Layers: sky gradient, stars, sun/moon, clouds, mountains, trees, ground
 */
(function (global) {
  'use strict';

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  class Background {
    /**
     * @param {number} width
     * @param {number} height
     */
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.groundY = height * 0.78;
      this.time = 0; // 0..1 day cycle
      this.daySpeed = 0.008; // cycle units per second-ish via distance
      this.scroll = 0;

      this.clouds = [];
      this.mountains = [];
      this.trees = [];
      this.stars = [];
      this.groundTiles = [];
      this.weather = [];

      // Biome system: meadow → desert → snow → volcano (cycles)
      this.biomeIndex = 0;
      this.biomeBlend = 0;
      this.biomeNames = ['MEADOW', 'DESERT', 'SNOW', 'VOLCANO'];
      this.visitedBiomes = new Set(['MEADOW']);

      this._seedLayers();
      this._seedWeather();
    }

    getBiomeName() {
      return this.biomeNames[this.biomeIndex % this.biomeNames.length];
    }

    getVisitedBiomeCount() {
      return this.visitedBiomes.size;
    }

    /**
     * Advance biome based on distance. Returns new biome name if changed.
     * @param {number} distance
     * @returns {string|null}
     */
    updateBiome(distance) {
      const next = Math.min(3, Math.floor(distance / 450));
      const cycle = Math.floor(distance / 1800);
      const idx = (next + cycle) % 4;
      if (idx !== this.biomeIndex) {
        this.biomeIndex = idx;
        const name = this.getBiomeName();
        this.visitedBiomes.add(name);
        this._seedWeather();
        return name;
      }
      return null;
    }

    resetBiomes() {
      this.biomeIndex = 0;
      this.visitedBiomes = new Set(['MEADOW']);
      this._seedWeather();
    }

    _seedWeather() {
      this.weather = [];
      const name = this.getBiomeName();
      const count = name === 'SNOW' || name === 'VOLCANO' ? 40 : name === 'DESERT' ? 18 : 0;
      for (let i = 0; i < count; i++) {
        this.weather.push({
          x: Math.random() * this.width,
          y: Math.random() * this.groundY,
          s: 1 + Math.random() * 2.5,
          vy: name === 'SNOW' ? 40 + Math.random() * 50 : 70 + Math.random() * 90,
          vx: name === 'DESERT' ? -30 - Math.random() * 40 : -10 + Math.random() * 20,
        });
      }
    }

    resize(width, height) {
      this.width = width;
      this.height = height;
      this.groundY = height * 0.78;
      this._seedLayers();
    }

    _seedLayers() {
      const w = this.width;
      const h = this.height;
      const gy = this.groundY;

      this.clouds = [];
      for (let i = 0; i < 8; i++) {
        this.clouds.push({
          x: rand(0, w * 1.5),
          y: rand(h * 0.08, h * 0.42),
          s: rand(0.6, 1.4),
          speed: rand(0.15, 0.45),
          alpha: rand(0.45, 0.85),
        });
      }

      this.mountains = [];
      for (let i = 0; i < 6; i++) {
        this.mountains.push({
          x: i * (w * 0.45) - 40,
          w: rand(w * 0.35, w * 0.55),
          h: rand(h * 0.18, h * 0.32),
          shade: 0.35 + Math.random() * 0.35,
        });
      }

      this.trees = [];
      for (let i = 0; i < 12; i++) {
        this.trees.push({
          x: rand(0, w * 2),
          h: rand(40, 90),
          type: Math.random() > 0.5 ? 0 : 1,
        });
      }

      this.stars = [];
      for (let i = 0; i < 60; i++) {
        this.stars.push({
          x: Math.random() * w,
          y: Math.random() * gy * 0.7,
          r: Math.random() * 1.6 + 0.4,
          tw: Math.random() * Math.PI * 2,
        });
      }

      this.groundTiles = [];
      const tileW = 48;
      const count = Math.ceil(w / tileW) + 3;
      for (let i = 0; i < count; i++) {
        this.groundTiles.push({
          x: i * tileW,
          shade: 0.85 + Math.random() * 0.15,
        });
      }
    }

    /**
     * Advance scenery based on world speed and elapsed time.
     * @param {number} dt seconds
     * @param {number} speed world scroll speed (px/s)
     */
    update(dt, speed) {
      this.scroll += speed * dt;
      this.time = (this.time + dt * this.daySpeed) % 1;

      const w = this.width;
      for (const c of this.clouds) {
        c.x -= (speed * 0.18 + c.speed * 40) * dt;
        if (c.x < -180) c.x = w + rand(20, 200);
      }

      for (const m of this.mountains) {
        m.x -= speed * 0.28 * dt;
        if (m.x + m.w < 0) {
          m.x = this._maxMountainX() + rand(20, 80);
          m.w = rand(w * 0.35, w * 0.55);
          m.h = rand(this.height * 0.18, this.height * 0.32);
        }
      }

      for (const t of this.trees) {
        t.x -= speed * 0.72 * dt;
        if (t.x < -40) {
          t.x = w + rand(10, 160);
          t.h = rand(40, 90);
          t.type = Math.random() > 0.5 ? 0 : 1;
        }
      }

      const tileW = 48;
      for (const g of this.groundTiles) {
        g.x -= speed * dt;
        if (g.x < -tileW) {
          let maxX = -Infinity;
          for (const other of this.groundTiles) maxX = Math.max(maxX, other.x);
          g.x = maxX + tileW;
          g.shade = 0.85 + Math.random() * 0.15;
        }
      }

      for (const s of this.stars) {
        s.tw += dt * 3;
      }

      for (const w of this.weather) {
        w.y += w.vy * dt;
        w.x += w.vx * dt;
        if (w.y > this.groundY) {
          w.y = -4;
          w.x = Math.random() * this.width;
        }
        if (w.x < -10) w.x = this.width + 10;
        if (w.x > this.width + 10) w.x = -10;
      }
    }

    _maxMountainX() {
      let m = -Infinity;
      for (const mountain of this.mountains) m = Math.max(m, mountain.x + mountain.w);
      return m;
    }

    /** Night factor 0 (day) .. 1 (night) */
    getNightFactor() {
      // Smooth night around time 0.5–0.85
      const t = this.time;
      if (t < 0.25) return 0;
      if (t < 0.4) return (t - 0.25) / 0.15;
      if (t < 0.7) return 1;
      if (t < 0.85) return 1 - (t - 0.7) / 0.15;
      return 0;
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
      const w = this.width;
      const h = this.height;
      const gy = this.groundY;
      const night = this.getNightFactor();

      this._drawSky(ctx, w, h, night);
      this._drawCelestial(ctx, w, h, night);
      if (night > 0.15) this._drawStars(ctx, night);
      this._drawMountains(ctx, gy, night);
      this._drawClouds(ctx, night);
      this._drawTrees(ctx, gy, night);
      this._drawGround(ctx, w, h, gy, night);
      this._drawWeather(ctx);
    }

    _biomePalette() {
      const name = this.getBiomeName();
      switch (name) {
        case 'DESERT':
          return {
            dayTop: '#fbbf24',
            dayBot: '#fde68a',
            nightTop: '#1c1917',
            nightBot: '#44403c',
            dirt: '#b45309',
            grass: '#d97706',
            mountain: '#a16207',
            leaf: '#ca8a04',
          };
        case 'SNOW':
          return {
            dayTop: '#93c5fd',
            dayBot: '#e0f2fe',
            nightTop: '#0f172a',
            nightBot: '#1e293b',
            dirt: '#cbd5e1',
            grass: '#f8fafc',
            mountain: '#64748b',
            leaf: '#e2e8f0',
          };
        case 'VOLCANO':
          return {
            dayTop: '#7f1d1d',
            dayBot: '#fb923c',
            nightTop: '#1a0505',
            nightBot: '#3f0a0a',
            dirt: '#292524',
            grass: '#b91c1c',
            mountain: '#44403c',
            leaf: '#78716c',
          };
        default:
          return {
            dayTop: '#4ec4ff',
            dayBot: '#c8e8ff',
            nightTop: '#050b18',
            nightBot: '#1a2744',
            dirt: '#5a3a1e',
            grass: '#4caf50',
            mountain: '#3d5a73',
            leaf: '#2f8f4e',
          };
      }
    }

    _drawWeather(ctx) {
      const name = this.getBiomeName();
      if (!this.weather.length) return;
      ctx.save();
      if (name === 'SNOW') {
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        for (const w of this.weather) {
          ctx.beginPath();
          ctx.arc(w.x, w.y, w.s * 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (name === 'VOLCANO') {
        ctx.fillStyle = 'rgba(251,146,60,0.7)';
        for (const w of this.weather) {
          ctx.fillRect(w.x, w.y, 2, w.s * 2);
        }
      } else if (name === 'DESERT') {
        ctx.fillStyle = 'rgba(253,230,138,0.35)';
        for (const w of this.weather) {
          ctx.fillRect(w.x, w.y, w.s * 6, 1.5);
        }
      }
      ctx.restore();
    }

    _drawSky(ctx, w, h, night) {
      const p = this._biomePalette();
      const top = this._lerpColor(p.dayTop, p.nightTop, night);
      const bot = this._lerpColor(p.dayBot, p.nightBot, night);

      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, top);
      g.addColorStop(0.55, bot);
      g.addColorStop(1, this._lerpColor(p.grass, '#1a2e1f', night));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }

    _drawCelestial(ctx, w, h, night) {
      const cx = w * (0.15 + this.time * 0.7);
      const cy = h * 0.18 + Math.sin(this.time * Math.PI) * (-h * 0.08);

      if (night < 0.55) {
        const alpha = 1 - night * 1.2;
        ctx.save();
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.fillStyle = '#ffe566';
        ctx.beginPath();
        ctx.arc(cx, cy, 28, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255, 230, 100, 0.25)';
        ctx.beginPath();
        ctx.arc(cx, cy, 48, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (night > 0.35) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, (night - 0.35) / 0.4);
        ctx.fillStyle = '#e8f0ff';
        ctx.beginPath();
        ctx.arc(cx, cy, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(cx + 8, cy - 4, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    _drawStars(ctx, night) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, night);
      ctx.fillStyle = '#fff';
      for (const s of this.stars) {
        const a = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(s.tw));
        ctx.globalAlpha = Math.min(1, night) * a;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    _drawClouds(ctx, night) {
      ctx.save();
      for (const c of this.clouds) {
        ctx.globalAlpha = c.alpha * (1 - night * 0.55);
        ctx.fillStyle = this._lerpColor('#ffffff', '#8899bb', night);
        this._cloud(ctx, c.x, c.y, c.s);
      }
      ctx.restore();
    }

    _cloud(ctx, x, y, s) {
      ctx.beginPath();
      ctx.arc(x, y, 22 * s, 0, Math.PI * 2);
      ctx.arc(x + 24 * s, y - 8 * s, 18 * s, 0, Math.PI * 2);
      ctx.arc(x + 48 * s, y, 24 * s, 0, Math.PI * 2);
      ctx.arc(x + 22 * s, y + 8 * s, 16 * s, 0, Math.PI * 2);
      ctx.fill();
    }

    _drawMountains(ctx, gy, night) {
      const p = this._biomePalette();
      for (const m of this.mountains) {
        const base = this._lerpColor(p.mountain, '#1a2438', night);
        ctx.fillStyle = this._shade(base, m.shade);
        ctx.beginPath();
        ctx.moveTo(m.x, gy);
        ctx.lineTo(m.x + m.w * 0.35, gy - m.h);
        ctx.lineTo(m.x + m.w * 0.55, gy - m.h * 0.7);
        ctx.lineTo(m.x + m.w * 0.75, gy - m.h * 1.05);
        ctx.lineTo(m.x + m.w, gy);
        ctx.closePath();
        ctx.fill();

        if (this.getBiomeName() === 'SNOW' || (night < 0.6 && this.getBiomeName() === 'MEADOW')) {
          ctx.fillStyle = `rgba(255,255,255,${0.55 * (1 - night * 0.5)})`;
          ctx.beginPath();
          ctx.moveTo(m.x + m.w * 0.28, gy - m.h * 0.82);
          ctx.lineTo(m.x + m.w * 0.35, gy - m.h);
          ctx.lineTo(m.x + m.w * 0.42, gy - m.h * 0.82);
          ctx.closePath();
          ctx.fill();
        }
        if (this.getBiomeName() === 'VOLCANO') {
          ctx.fillStyle = 'rgba(239,68,68,0.45)';
          ctx.beginPath();
          ctx.moveTo(m.x + m.w * 0.7, gy - m.h * 1.05);
          ctx.lineTo(m.x + m.w * 0.75, gy - m.h * 0.85);
          ctx.lineTo(m.x + m.w * 0.8, gy - m.h * 1.0);
          ctx.fill();
        }
      }
    }

    _drawTrees(ctx, gy, night) {
      const p = this._biomePalette();
      for (const t of this.trees) {
        const trunk = this._lerpColor('#6b4226', '#2a1a10', night);
        const leaf = this._lerpColor(p.leaf, '#143822', night);
        ctx.fillStyle = trunk;
        ctx.fillRect(t.x - 4, gy - t.h * 0.35, 8, t.h * 0.35);

        ctx.fillStyle = leaf;
        if (this.getBiomeName() === 'DESERT') {
          // Cactus
          ctx.fillStyle = this._lerpColor('#16a34a', '#14532d', night);
          ctx.fillRect(t.x - 6, gy - t.h, 12, t.h);
          ctx.fillRect(t.x - 18, gy - t.h * 0.55, 14, 8);
          ctx.fillRect(t.x + 4, gy - t.h * 0.7, 14, 8);
        } else if (t.type === 0) {
          ctx.beginPath();
          ctx.moveTo(t.x, gy - t.h);
          ctx.lineTo(t.x - 18, gy - t.h * 0.35);
          ctx.lineTo(t.x + 18, gy - t.h * 0.35);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(t.x, gy - t.h * 0.55, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(t.x - 10, gy - t.h * 0.4, 12, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(t.x + 10, gy - t.h * 0.4, 12, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    _drawGround(ctx, w, h, gy, night) {
      const p = this._biomePalette();
      const dirt = this._lerpColor(p.dirt, '#24180e', night);
      const grass = this._lerpColor(p.grass, '#1e3d24', night);

      ctx.fillStyle = dirt;
      ctx.fillRect(0, gy, w, h - gy);

      ctx.fillStyle = grass;
      ctx.fillRect(0, gy, w, 14);

      const tileW = 48;
      for (const g of this.groundTiles) {
        ctx.fillStyle = `rgba(0,0,0,${0.12 * g.shade})`;
        ctx.fillRect(g.x, gy + 14, tileW * 0.45, h - gy - 14);
      }

      ctx.strokeStyle = this._lerpColor(p.grass, '#2a5530', night);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(w, gy);
      ctx.stroke();
    }

    _lerpColor(a, b, t) {
      const ca = this._hexToRgb(a);
      const cb = this._hexToRgb(b);
      const r = Math.round(ca.r + (cb.r - ca.r) * t);
      const g = Math.round(ca.g + (cb.g - ca.g) * t);
      const bl = Math.round(ca.b + (cb.b - ca.b) * t);
      return `rgb(${r},${g},${bl})`;
    }

    _shade(rgb, factor) {
      const m = rgb.match(/\d+/g);
      if (!m) return rgb;
      const r = Math.round(Number(m[0]) * factor);
      const g = Math.round(Number(m[1]) * factor);
      const b = Math.round(Number(m[2]) * factor);
      return `rgb(${r},${g},${b})`;
    }

    _hexToRgb(hex) {
      const h = hex.replace('#', '');
      return {
        r: parseInt(h.slice(0, 2), 16),
        g: parseInt(h.slice(2, 4), 16),
        b: parseInt(h.slice(4, 6), 16),
      };
    }
  }

  global.SkyRunner = global.SkyRunner || {};
  global.SkyRunner.Background = Background;
})(typeof window !== 'undefined' ? window : globalThis);
