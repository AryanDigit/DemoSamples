# Sky Runner

Infinite scrolling HTML5 Canvas runner built with pure HTML5, CSS3, and ES6 JavaScript — no frameworks.

## Play

Open `index.html` in a modern browser (Chrome, Edge, Firefox, Safari), or serve the folder locally:

```bash
cd SkyRunner
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Controls

| Input | Action |
|-------|--------|
| Space / ↑ / W | Jump |
| Double Space | Double jump |
| ↓ / S | Slide |
| Esc / P | Pause |
| Mobile | On-screen Jump / Slide buttons |

## Features

- Infinite scrolling with progressive difficulty
- Obstacles: spikes, barriers, overhead bars, flying enemies
- Coins with combo scoring
- Power-ups: Magnet, Shield, Speed Boost
- Day/night cycle, parallax clouds, mountains, trees, ground
- Particle effects, procedural SFX & music (Web Audio API)
- Start / Pause / Settings / Game Over menus
- High score via LocalStorage
- Responsive HUD and 60 FPS `requestAnimationFrame` loop

## Project structure

```
SkyRunner/
├── index.html
├── style.css
├── js/
│   ├── game.js
│   ├── player.js
│   ├── enemy.js
│   ├── coin.js
│   ├── ui.js
│   ├── input.js
│   ├── storage.js
│   ├── sound.js
│   ├── particles.js
│   └── background.js
└── assets/
    ├── images/
    ├── audio/
    └── fonts/
```

Graphics and audio assets are optional. The game draws placeholders with Canvas and synthesizes sound when files are missing.
