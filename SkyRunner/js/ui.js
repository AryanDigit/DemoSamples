/**
 * ui.js — Menu / HUD controller for Sky Runner
 * Start, pause, settings, shop, achievements, tutorial, game over.
 */
(function (global) {
  'use strict';

  const { SKINS } = global.SkyRunner;

  class UIManager {
    /**
     * @param {object} els
     * @param {object} storage
     * @param {object} achievements
     * @param {object} missions
     */
    constructor(els, storage, achievements, missions) {
      this.els = els;
      this.storage = storage;
      this.achievements = achievements;
      this.missions = missions;
      this._settingsReturn = 'start';
      this._handlers = {};
    }

    /**
     * @param {object} handlers
     */
    bind(handlers) {
      this._handlers = handlers || {};

      this._click(this.els.btnPlay, () => this._handlers.onPlay && this._handlers.onPlay());
      this._click(this.els.btnRestart, () => this._handlers.onRestart && this._handlers.onRestart());
      this._click(this.els.btnPauseRestart, () => this._handlers.onRestart && this._handlers.onRestart());
      this._click(this.els.btnResume, () => this._handlers.onResume && this._handlers.onResume());
      this._click(this.els.btnPause, () => this._handlers.onPause && this._handlers.onPause());
      this._click(this.els.btnMenu, () => this._handlers.onMenu && this._handlers.onMenu());
      this._click(this.els.btnTutorialOk, () => {
        this.storage.setTutorialSeen();
        if (this._handlers.onPlay) this._handlers.onPlay();
      });

      this._click(this.els.btnSettings, () => this.openSettings('start'));
      this._click(this.els.btnPauseSettings, () => this.openSettings('pause'));
      this._click(this.els.btnSettingsBack, () => this.closeSettings());

      this._click(this.els.btnShop, () => this.openShop());
      this._click(this.els.btnShopBack, () => this.closeOverlayToStart());
      this._click(this.els.btnAchievements, () => this.openAchievements());
      this._click(this.els.btnAchievementsBack, () => this.closeOverlayToStart());

      this._click(this.els.btnSfx, () => this._toggleSetting('sfx'));
      this._click(this.els.btnMusic, () => this._toggleSetting('music'));
      this._click(this.els.btnParticles, () => this._toggleSetting('particles'));

      this.syncSettingsButtons();
      this.refreshMeta();
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

    _hideAllMenus() {
      this._hide(this.els.menuStart);
      this._hide(this.els.menuPause);
      this._hide(this.els.menuSettings);
      this._hide(this.els.menuGameOver);
      this._hide(this.els.menuShop);
      this._hide(this.els.menuAchievements);
      this._hide(this.els.menuTutorial);
    }

    refreshMeta() {
      this.updateHighScore();
      this.updateBank();
      this.updateBestDistance();
      this.updateMissionPreview();
    }

    showStart() {
      this._hide(this.els.hud);
      this._hide(this.els.touchControls);
      this._hideAllMenus();
      this.refreshMeta();
      this._show(this.els.menuStart);
    }

    showTutorial() {
      this._hideAllMenus();
      this._show(this.els.menuTutorial);
    }

    showPlaying(showTouch) {
      this._hideAllMenus();
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
      this._hideAllMenus();
      this.syncSettingsButtons();
      this._show(this.els.menuSettings);
    }

    closeSettings() {
      this._hide(this.els.menuSettings);
      if (this._settingsReturn === 'pause') this._show(this.els.menuPause);
      else if (this._settingsReturn === 'gameover') this._show(this.els.menuGameOver);
      else this._show(this.els.menuStart);
    }

    openShop() {
      this._hideAllMenus();
      this.renderShop();
      this._show(this.els.menuShop);
    }

    openAchievements() {
      this._hideAllMenus();
      this.renderAchievements();
      this._show(this.els.menuAchievements);
    }

    closeOverlayToStart() {
      this._hideAllMenus();
      this.refreshMeta();
      this._show(this.els.menuStart);
    }

    renderShop() {
      const host = this.els.shopList;
      if (!host) return;
      const selected = this.storage.getSelectedSkin();
      host.innerHTML = '';
      for (const skin of SKINS) {
        const unlocked = this.storage.isSkinUnlocked(skin.id);
        const row = document.createElement('div');
        row.className = 'shop-item' + (selected === skin.id ? ' selected' : '');
        row.innerHTML = `
          <div class="shop-swatch" style="background:${skin.body}"></div>
          <div class="shop-meta">
            <strong>${skin.name}</strong>
            <span>${unlocked ? (selected === skin.id ? 'Equipped' : 'Owned') : `${skin.price} coins`}</span>
          </div>
        `;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-secondary';
        btn.style.padding = '0.45rem 0.7rem';
        btn.style.fontSize = '0.7rem';
        if (!unlocked) {
          btn.textContent = 'Buy';
          btn.disabled = this.storage.getBankCoins() < skin.price;
          btn.addEventListener('click', () => this._buySkin(skin));
        } else if (selected === skin.id) {
          btn.textContent = 'On';
          btn.disabled = true;
        } else {
          btn.textContent = 'Equip';
          btn.addEventListener('click', () => {
            this.storage.setSelectedSkin(skin.id);
            if (this._handlers.onSkinChange) this._handlers.onSkinChange(skin.id);
            this.renderShop();
            this.refreshMeta();
          });
        }
        row.appendChild(btn);
        host.appendChild(row);
      }
      this.updateBank();
    }

    _buySkin(skin) {
      if (!this.storage.spendBankCoins(skin.price)) return;
      this.storage.unlockSkin(skin.id);
      this.storage.setSelectedSkin(skin.id);
      if (this._handlers.onSkinChange) this._handlers.onSkinChange(skin.id);
      if (this._handlers.onSettingsChange) {
        /* click feedback via sound in game */
      }
      this.renderShop();
      this.refreshMeta();
      if (this._handlers.onBuy) this._handlers.onBuy();
    }

    renderAchievements() {
      const host = this.els.achievementsList;
      if (!host || !this.achievements) return;
      const list = this.achievements.listStatus();
      host.innerHTML = list
        .map(
          (a) => `
        <div class="ach-item ${a.unlocked ? 'unlocked' : 'locked'}">
          <div class="ach-meta">
            <strong>${a.title}</strong>
            <span>${a.desc}</span>
          </div>
          <span>${a.unlocked ? '✓' : '…'}</span>
        </div>`
        )
        .join('');
    }

    /**
     * @param {object} stats
     * @param {boolean} isNewHigh
     * @param {{completed:boolean, reward:number, label:string}|null} missionInfo
     */
    showGameOver(stats, isNewHigh, missionInfo) {
      this._hide(this.els.hud);
      this._hide(this.els.touchControls);
      this._hideAllMenus();
      this._setText(this.els.finalScore, String(Math.floor(stats.score)));
      this._setText(this.els.finalCoins, String(stats.coins));
      this._setText(this.els.finalDistance, `${Math.floor(stats.distance)}m`);
      this._setAll('finalGems', String(stats.gems || 0));
      this._setAll('finalNear', String(stats.nearMisses || 0));
      this.updateHighScore();
      this.updateBank();
      if (this.els.newHighScore) {
        this.els.newHighScore.classList.toggle('hidden', !isNewHigh);
      }
      if (this.els.missionResult) {
        if (missionInfo && missionInfo.completed) {
          this.els.missionResult.textContent = `Mission complete! +${missionInfo.reward} banked coins`;
          this.els.missionResult.classList.remove('hidden');
        } else {
          this.els.missionResult.classList.add('hidden');
        }
      }
      this._show(this.els.menuGameOver);
    }

    updateHighScore() {
      const hs = this.storage.getHighScore();
      document.querySelectorAll('[data-ui="highScore"]').forEach((el) => {
        el.textContent = String(hs);
      });
    }

    updateBank() {
      const bank = this.storage.getBankCoins();
      document.querySelectorAll('[data-ui="bankCoins"]').forEach((el) => {
        el.textContent = String(bank);
      });
    }

    updateBestDistance() {
      const d = this.storage.getBestDistance();
      document.querySelectorAll('[data-ui="bestDistance"]').forEach((el) => {
        el.textContent = `${d}m`;
      });
    }

    updateMissionPreview() {
      if (!this.missions) return;
      const m = this.missions.getCurrent();
      const el = document.getElementById('mission-preview');
      if (el) el.textContent = `Mission: ${m.label} (+${m.reward})`;
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
      this._setHud('biome', data.biome || 'MEADOW');
      this._setHud('mission', data.missionLabel || '—');
      if (this.els.missionFill) {
        this.els.missionFill.style.width = `${Math.round((data.missionProgress || 0) * 100)}%`;
      }
      this._updatePowerups(data.powerups || {});
    }

    _setHud(key, value) {
      const el = document.querySelector(`[data-hud="${key}"]`);
      if (el) el.textContent = value;
    }

    _setAll(key, value) {
      document.querySelectorAll(`[data-ui="${key}"]`).forEach((el) => {
        el.textContent = value;
      });
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
      if (p.slowmo > 0) chips.push(`<span class="powerup-chip slowmo">SLOW-MO ${p.slowmo.toFixed(1)}s</span>`);
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
      if (this._handlers.onSettingsChange) this._handlers.onSettingsChange(s);
    }
  }

  global.SkyRunner = global.SkyRunner || {};
  global.SkyRunner.UIManager = UIManager;
})(typeof window !== 'undefined' ? window : globalThis);
