/**
 * input.js — Keyboard + mobile touch input for Sky Runner
 */
(function (global) {
  'use strict';

  class InputManager {
    /**
     * @param {HTMLElement} root
     */
    constructor(root) {
      this.root = root;
      this.keys = Object.create(null);
      this.jumpPressed = false;
      this.slideHeld = false;
      this._jumpQueued = false;
      this._bound = {
        keydown: this._onKeyDown.bind(this),
        keyup: this._onKeyUp.bind(this),
        blur: this._onBlur.bind(this),
      };
      this._touchJump = null;
      this._touchSlide = null;
      this.enabled = true;
    }

    /**
     * @param {HTMLElement|null} jumpBtn
     * @param {HTMLElement|null} slideBtn
     */
    bind(jumpBtn, slideBtn) {
      window.addEventListener('keydown', this._bound.keydown);
      window.addEventListener('keyup', this._bound.keyup);
      window.addEventListener('blur', this._bound.blur);

      this._touchJump = jumpBtn;
      this._touchSlide = slideBtn;

      if (jumpBtn) {
        const start = (e) => {
          e.preventDefault();
          if (!this.enabled) return;
          this._queueJump();
        };
        jumpBtn.addEventListener('touchstart', start, { passive: false });
        jumpBtn.addEventListener('mousedown', start);
      }

      if (slideBtn) {
        const down = (e) => {
          e.preventDefault();
          if (!this.enabled) return;
          this.slideHeld = true;
        };
        const up = (e) => {
          e.preventDefault();
          this.slideHeld = false;
        };
        slideBtn.addEventListener('touchstart', down, { passive: false });
        slideBtn.addEventListener('touchend', up, { passive: false });
        slideBtn.addEventListener('touchcancel', up, { passive: false });
        slideBtn.addEventListener('mousedown', down);
        slideBtn.addEventListener('mouseup', up);
        slideBtn.addEventListener('mouseleave', up);
      }
    }

    unbind() {
      window.removeEventListener('keydown', this._bound.keydown);
      window.removeEventListener('keyup', this._bound.keyup);
      window.removeEventListener('blur', this._bound.blur);
    }

    _onKeyDown(e) {
      if (!this.enabled) return;
      const key = e.code || e.key;
      if (['Space', 'ArrowDown', 'ArrowUp', 'KeyW', 'KeyS'].includes(key)) {
        e.preventDefault();
      }
      if (this.keys[key]) return; // ignore key repeat
      this.keys[key] = true;

      if (key === 'Space' || key === 'ArrowUp' || key === 'KeyW') {
        this._queueJump();
      }
      if (key === 'ArrowDown' || key === 'KeyS') {
        this.slideHeld = true;
      }
    }

    _onKeyUp(e) {
      const key = e.code || e.key;
      this.keys[key] = false;
      if (key === 'ArrowDown' || key === 'KeyS') {
        this.slideHeld = false;
      }
    }

    _onBlur() {
      this.keys = Object.create(null);
      this.slideHeld = false;
      this._jumpQueued = false;
    }

    _queueJump() {
      this._jumpQueued = true;
      this.jumpPressed = true;
    }

    /**
     * Consume a jump press for this frame (edge-triggered).
     * @returns {boolean}
     */
    consumeJump() {
      if (this._jumpQueued) {
        this._jumpQueued = false;
        this.jumpPressed = false;
        return true;
      }
      return false;
    }

    isSliding() {
      return this.slideHeld;
    }

    setEnabled(on) {
      this.enabled = Boolean(on);
      if (!this.enabled) {
        this.keys = Object.create(null);
        this.slideHeld = false;
        this._jumpQueued = false;
      }
    }

    /** Show/hide mobile touch UI based on coarse pointer. */
    updateTouchVisibility(container) {
      if (!container) return;
      const isTouch =
        window.matchMedia('(pointer: coarse)').matches ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0;
      container.classList.toggle('hidden', !isTouch);
      container.setAttribute('aria-hidden', isTouch ? 'false' : 'true');
    }
  }

  global.SkyRunner = global.SkyRunner || {};
  global.SkyRunner.InputManager = InputManager;
})(typeof window !== 'undefined' ? window : globalThis);
