# Sky Runner

Infinite scrolling HTML5 Canvas runner built with pure HTML5, CSS3, and ES6 JavaScript — no frameworks.

## Play

Open `index.html` in a modern browser, or:

```bash
cd SkyRunner
python3 -m http.server 8080
```

Visit `http://localhost:8080`.

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
- Obstacles: spikes, barriers, overhead bars, flyers, boulders, lasers
- Coins, gems, hearts, magnet / shield / boost / slow-mo power-ups
- Near-miss bonus scoring with floating text
- Biome transitions: Meadow → Desert → Snow → Volcano
- Day/night cycle, weather particles, parallax scenery
- Missions with banked coin rewards
- Achievement system with toast notifications
- Skin shop (unlock & equip runner colors)
- Tutorial on first play
- Particle effects, procedural SFX & music
- Start / Pause / Settings / Shop / Achievements / Game Over
- High score, best distance & coin bank via LocalStorage
- 60 FPS `requestAnimationFrame` loop

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
│   ├── floating.js
│   ├── achievements.js
│   ├── missions.js
│   └── background.js
└── assets/
```
