/**
 * ui.js — Menu / HUD controller for Sky Runner
 * Separates DOM UI from canvas game logic.
 */
(function (global) {
  'use strict';

  class UIManager {
    /**
     * @param {object} els element map
     * @param {import('./storage.js')} storage
     */
    constructor(els, storage) {
      this.els = els;
      this.storage = storage;
      this._settingsReturn = 'start';
      this._onPlay = null;
      this._onRestart = null;
      this._onResume = null;
      this._onPause = null;
      this._onMenu = null;
      this._onSettingsChange = null;
    }

    /**
     * Wire button callbacks.
     * @param {object} handlers
     */
    bind(handlers) {
      this._onPlay = handlers.onPlay || null;
      this._onRestart = handlers.onRestart || null;
      this._onResume = handlers.onResume || null;
      this._onPause = handlers.onPause || null;
      this._onMenu = handlers.onMenu || null;
      this._onSettingsChange = handlers.onSettingsChange || null;

      this._click(this.els.btnPlay, () => this._onPlay && this._onPlay());
      this._click(this.els.btnRestart, () => this._onRestart && this._onRestart());
      this._click(this.els.btnPauseRestart, () => this._onRestart && this._onRestart());
      this._click(this.els.btnResume, () => this._onResume && this._onResume());
      this._click(this.els.btnPause, () => this._onPause && this._onPause());
      this._click(this.els.btnMenu, () => this._onMenu && this._onMenu());

      this._click(this.els.btnSettings, () => this.openSettings('start'));
      this._click(this.els.btnPauseSettings, () => this.openSettings('pause'));
      this._click(this.els.btnSettingsBack, () => this.closeSettings());

      this._click(this.els.btnSfx, () => this._toggleSetting('sfx'));
      this._click(this.els.btnMusic, () => this._toggleSetting('music'));
      this._click(this.els.btnParticles, () => this._toggleSetting('particles'));

      this.syncSettingsButtons();
      this.updateHighScore();
    }

    _click(el, fn) {
      if (!el) return;
      el.addEventListener('click', (e) => {
        e.preventDefault();
        fn();
      });
    }

    _show(el) {
      if (el) el.classList.remove('hidden');
    }

    _hide(el) {
      if (el) el.classList.add('hidden');
    }

    showStart() {
      this._hide(this.els.hud);
      this._hide(this.els.menuPause);
      this._hide(this.els.menuSettings);
      this._hide(this.els.menuGameOver);
      this._hide(this.els.touchControls);
      this._show(this.els.menuStart);
      this.updateHighScore();
    }

    showPlaying(showTouch) {
      this._hide(this.els.menuStart);
      this._hide(this.els.menuPause);
      this._hide(this.els.menuSettings);
      this._hide(this.els.menuGameOver);
      this._show(this.els.hud);
      if (showTouch) this._show(this.els.touchControls);
      else this._hide(this.els.touchControls);
    }

    showPause() {
      this._hide(this.els.menuSettings);
      this._show(this.els.menuPause);
    }

    hidePause() {
      this._hide(this.els.menuPause);
    }

    openSettings(from) {
      this._settingsReturn = from || 'start';
      this._hide(this.els.menuStart);
      this._hide(this.els.menuPause);
      this._hide(this.els.menuGameOver);
      this.syncSettingsButtons();
      this._show(this.els.menuSettings);
    }

    closeSettings() {
      this._hide(this.els.menuSettings);
      if (this._settingsReturn === 'pause') {
        this._show(this.els.menuPause);
      } else if (this._settingsReturn === 'gameover') {
        this._show(this.els.menuGameOver);
      } else {
        this._show(this.els.menuStart);
      }
    }

    /**
     * @param {object} stats
     * @param {boolean} isNewHigh
     */
    showGameOver(stats, isNewHigh) {
      this._hide(this.els.hud);
      this._hide(this.els.menuPause);
      this._hide(this.els.touchControls);
      this._setText(this.els.finalScore, String(Math.floor(stats.score)));
      this._setText(this.els.finalCoins, String(stats.coins));
      this._setText(this.els.finalDistance, `${Math.floor(stats.distance)}m`);
      this.updateHighScore();
      if (this.els.newHighScore) {
        this.els.newHighScore.classList.toggle('hidden', !isNewHigh);
      }
      this._show(this.els.menuGameOver);
    }

    updateHighScore() {
      const hs = this.storage.getHighScore();
      document.querySelectorAll('[data-ui="highScore"]').forEach((el) => {
        el.textContent = String(hs);
      });
    }

    /**
     * @param {object} data
     */
    updateHud(data) {
      this._setHud('score', String(Math.floor(data.score)));
      this._setHud('coins', String(data.coins));
      this._setHud('distance', `${Math.floor(data.distance)}m`);
      this._setHud('lives', String(data.lives));
      this._setHud('combo', `x${data.combo}`);
      this._updatePowerups(data.powerups || {});
    }

    _setHud(key, value) {
      const el = document.querySelector(`[data-hud="${key}"]`);
      if (el) el.textContent = value;
    }

    _setText(el, value) {
      if (el) el.textContent = value;
    }

    _updatePowerups(p) {
      const host = this.els.hudPowerups;
      if (!host) return;
      const chips = [];
      if (p.magnet > 0) chips.push(`<span class="powerup-chip magnet">MAGNET ${p.magnet.toFixed(1)}s</span>`);
      if (p.shield > 0) chips.push(`<span class="powerup-chip shield">SHIELD ${p.shield.toFixed(1)}s</span>`);
      if (p.boost > 0) chips.push(`<span class="powerup-chip boost">BOOST ${p.boost.toFixed(1)}s</span>`);
      host.innerHTML = chips.join('');
    }

    syncSettingsButtons() {
      const s = this.storage.getSettings();
      this._setToggle(this.els.btnSfx, s.sfx);
      this._setToggle(this.els.btnMusic, s.music);
      this._setToggle(this.els.btnParticles, s.particles);
    }

    _setToggle(btn, on) {
      if (!btn) return;
      btn.dataset.on = on ? 'true' : 'false';
      btn.textContent = on ? 'ON' : 'OFF';
    }

    _toggleSetting(key) {
      const s = this.storage.getSettings();
      s[key] = !s[key];
      this.storage.updateSettings(s);
      this.syncSettingsButtons();
      if (this._onSettingsChange) this._onSettingsChange(s);
    }
  }

  global.SkyRunner = global.SkyRunner || {};
  global.SkyRunner.UIManager = UIManager;
})(typeof window !== 'undefined' ? window : globalThis);
