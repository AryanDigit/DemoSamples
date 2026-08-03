# Verdura — Professional Vegetable Trade Website

A professional multi-page website for **vegetable selling**, wholesale supply, and **import/export**, plus an optional gallery of 10 homepage demos.

## Quick start (local — no server)

1. Download **`dist/verdura-html-template.zip`** or clone this branch.
2. Open **`index.html`** in your browser.
3. Browse Produce, Services, Import & Export, About, and Contact.

Demo photos load from Unsplash (internet needed for images).

### Optional local server

```bash
npm start
```

Open [http://localhost:5173](http://localhost:5173).

## Site structure

| Path | Description |
|------|-------------|
| `index.html` | **Professional company homepage** |
| `pages/about.html` | Company story & origins |
| `pages/products.html` | Produce catalog |
| `pages/services.html` | Trade services |
| `pages/import-export.html` | Corridors & documentation |
| `pages/contact.html` | RFQ / contact form |
| `demos.html` | 10 alternate homepage demos |
| `demos/01-market` … `10-season` | Individual demo homepages |
| `assets/` | CSS & JS |

## Regenerating HTML

```bash
node scripts/build-pages.js
```

## Stack

Static HTML + CSS + vanilla JS. Fonts: Fraunces, DM Sans, IBM Plex Mono.
