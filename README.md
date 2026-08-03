# Verdura — 10-Demo Vegetable Trade Template

A multi-demo HTML website template for **vegetable selling**, wholesale supply, and **import/export**.

## Quick start (local system — no server)

1. Download **`dist/verdura-html-template.zip`** (or clone this branch).
2. Unzip, then open **`index.html`** in your browser (double-click or File → Open).
3. Click any demo tile to open that homepage.

All pages are plain HTML/CSS/JS with relative paths, so they work from disk. Demo photos load from Unsplash (internet needed for images).

### Optional local server

```bash
npm start
```

Then open [http://localhost:5173](http://localhost:5173).

## What’s included

### Demo showcase
- `index.html` — pick any of the 10 homepage demos

### 10 homepage demos
| # | Demo | Focus |
|---|------|--------|
| 01 | [Market](demos/01-market/) | Fresh retail / farm market selling |
| 02 | [Trade](demos/02-trade/) | Global B2B import/export trading |
| 03 | [Organic](demos/03-organic/) | Certified organic programs |
| 04 | [Export](demos/04-export/) | Export logistics & cold chain |
| 05 | [Wholesale](demos/05-wholesale/) | Pallet-scale wholesale buying |
| 06 | [Harbor](demos/06-harbor/) | Port hub & inbound clearance |
| 07 | [Fields](demos/07-fields/) | Grower / farm-to-freight story |
| 08 | [Basket](demos/08-basket/) | Online vegetable shop / baskets |
| 09 | [Corporate](demos/09-corporate/) | Enterprise procurement |
| 10 | [Season](demos/10-season/) | Seasonal calendar & planning |

### Shared pages
- `pages/about.html` — company story
- `pages/products.html` — produce catalog
- `pages/services.html` — trade services
- `pages/import-export.html` — corridors & documentation
- `pages/contact.html` — RFQ form

### Assets
- `assets/css/` — base, components, demo themes
- `assets/js/main.js` — nav, reveal motion, seasonal switcher, form demo

## Regenerating pages

Page HTML is generated from:

```bash
node scripts/build-pages.js
```

Edit `scripts/build-pages.js` to adjust demo copy, then regenerate.

## Stack

Static HTML + CSS + vanilla JS. No build bundler required. Fonts: Fraunces, DM Sans, IBM Plex Mono.
