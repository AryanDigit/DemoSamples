/**
 * sound.js — Procedural audio via Web Audio API
 * Falls back gracefully when AudioContext is unavailable.
 * Optional asset URLs can be registered; procedural tones play if assets missing.
 */
(function (global) {
  'use strict';

  class SoundManager {
    constructor() {
      this.enabled = true;
      this.musicEnabled = true;
      this.ctx = null;
      this.masterGain = null;
      this.musicGain = null;
      this.sfxGain = null;
      this.musicNodes = [];
      this.musicPlaying = false;
      this.unlocked = false;
      this._buffers = new Map();
    }

    /** Lazily create / resume AudioContext (must follow a user gesture). */
    async init() {
      try {
        if (!this.ctx) {
          const AC = window.AudioContext || window.webkitAudioContext;
          if (!AC) {
            console.warn('[Sound] Web Audio API not supported');
            return false;
          }
          this.ctx = new AC();
          this.masterGain = this.ctx.createGain();
          this.masterGain.gain.value = 0.7;
          this.masterGain.connect(this.ctx.destination);

          this.sfxGain = this.ctx.createGain();
          this.sfxGain.gain.value = 0.55;
          this.sfxGain.connect(this.masterGain);

          this.musicGain = this.ctx.createGain();
          this.musicGain.gain.value = 0.18;
          this.musicGain.connect(this.masterGain);
        }
        if (this.ctx.state === 'suspended') {
          await this.ctx.resume();
        }
        this.unlocked = true;
        return true;
      } catch (err) {
        console.warn('[Sound] Init failed:', err);
        return false;
      }
    }

    setSfxEnabled(on) {
      this.enabled = Boolean(on);
      if (this.sfxGain) {
        this.sfxGain.gain.value = this.enabled ? 0.55 : 0;
      }
    }

    setMusicEnabled(on) {
      this.musicEnabled = Boolean(on);
      if (this.musicGain) {
        this.musicGain.gain.value = this.musicEnabled ? 0.18 : 0;
      }
      if (this.musicEnabled && this.unlocked && !this.musicPlaying) {
        this.startMusic();
      } else if (!this.musicEnabled) {
        this.stopMusic();
      }
    }

    /**
     * Optional: load an audio file buffer. Failures are ignored.
     * @param {string} name
     * @param {string} url
     */
    async load(name, url) {
      if (!this.ctx) await this.init();
      if (!this.ctx) return;
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const arr = await res.arrayBuffer();
        const buf = await this.ctx.decodeAudioData(arr);
        this._buffers.set(name, buf);
      } catch {
        // Assets are optional — procedural synthesis is the default.
      }
    }

    _playBuffer(name, gainNode, rate = 1) {
      if (!this.ctx || !this._buffers.has(name)) return false;
      try {
        const src = this.ctx.createBufferSource();
        src.buffer = this._buffers.get(name);
        src.playbackRate.value = rate;
        src.connect(gainNode);
        src.start();
        return true;
      } catch {
        return false;
      }
    }

    /**
     * Play a short synthesized tone.
     * @param {number} freq
     * @param {number} duration
     * @param {string} type
     * @param {number} volume
     * @param {number} slideTo
     */
    _tone(freq, duration, type = 'square', volume = 0.3, slideTo = null) {
      if (!this.enabled || !this.ctx || !this.unlocked) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, t);
        if (slideTo != null) {
          osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t + duration);
        }
        gain.gain.setValueAtTime(volume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + duration + 0.02);
      } catch (err) {
        console.warn('[Sound] Tone error:', err);
      }
    }

    playJump() {
      if (this._playBuffer('jump', this.sfxGain)) return;
      this._tone(420, 0.12, 'square', 0.22, 680);
    }

    playDoubleJump() {
      if (this._playBuffer('doubleJump', this.sfxGain)) return;
      this._tone(520, 0.1, 'triangle', 0.2, 880);
      setTimeout(() => this._tone(720, 0.1, 'triangle', 0.16, 1100), 40);
    }

    playSlide() {
      if (this._playBuffer('slide', this.sfxGain)) return;
      this._tone(180, 0.18, 'sawtooth', 0.12, 80);
    }

    playCoin() {
      if (this._playBuffer('coin', this.sfxGain)) return;
      this._tone(880, 0.08, 'sine', 0.25, 1400);
    }

    playPowerup() {
      if (this._playBuffer('powerup', this.sfxGain)) return;
      this._tone(360, 0.1, 'triangle', 0.22, 720);
      setTimeout(() => this._tone(540, 0.12, 'triangle', 0.2, 980), 70);
    }

    playHit() {
      if (this._playBuffer('hit', this.sfxGain)) return;
      this._tone(140, 0.25, 'sawtooth', 0.3, 40);
    }

    playGameOver() {
      if (this._playBuffer('gameOver', this.sfxGain)) return;
      this._tone(300, 0.2, 'square', 0.25, 150);
      setTimeout(() => this._tone(200, 0.35, 'triangle', 0.22, 80), 180);
    }

    playClick() {
      this._tone(640, 0.05, 'sine', 0.12);
    }

    /** Soft looping procedural music (arpeggio). */
    startMusic() {
      if (!this.musicEnabled || !this.ctx || !this.unlocked || this.musicPlaying) return;
      try {
        this.stopMusic();
        this.musicPlaying = true;

        const notes = [196, 247, 294, 370, 294, 247, 220, 294];
        let step = 0;
        const beat = 0.42;

        const schedule = () => {
          if (!this.musicPlaying || !this.ctx) return;
          const t = this.ctx.currentTime;
          const freq = notes[step % notes.length];
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();
          osc.type = 'triangle';
          osc.frequency.value = freq;
          filter.type = 'lowpass';
          filter.frequency.value = 1200;
          gain.gain.setValueAtTime(0.0001, t);
          gain.gain.linearRampToValueAtTime(0.35, t + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + beat * 0.9);
          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.musicGain);
          osc.start(t);
          osc.stop(t + beat);
          this.musicNodes.push(osc);
          step += 1;
          this._musicTimer = setTimeout(schedule, beat * 1000);
        };
        schedule();
      } catch (err) {
        console.warn('[Sound] Music start failed:', err);
        this.musicPlaying = false;
      }
    }

    stopMusic() {
      this.musicPlaying = false;
      if (this._musicTimer) {
        clearTimeout(this._musicTimer);
        this._musicTimer = null;
      }
      this.musicNodes.forEach((n) => {
        try {
          n.stop();
        } catch {
          /* already stopped */
        }
      });
      this.musicNodes = [];
    }
  }

  global.SkyRunner = global.SkyRunner || {};
  global.SkyRunner.SoundManager = SoundManager;
})(typeof window !== 'undefined' ? window : globalThis);
