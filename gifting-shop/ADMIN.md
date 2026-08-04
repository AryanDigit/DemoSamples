# Liora Gifting Shop — Demo Documentation

## Overview

**Liora** is a premium multi-page e-commerce demo for a curated gifting shop. It is built with static HTML, CSS, and JavaScript (no build step). Cart, wishlist, orders, and corporate inquiries persist in `localStorage` for demo purposes.

Open `index.html` in a browser, or serve the folder:

```bash
npx serve gifting-shop
```

## Brand

- **Palette:** ivory base, blush soft tones, deep maroon accent, champagne gold CTAs
- **Typography:** Cormorant Garamond (headings) + Outfit (body)
- **Tone:** warm, elegant, gift-worthy — uncluttered

## Pages

| Page | Purpose |
|------|---------|
| `index.html` | Home — hero, occasions, bestsellers, recipients, personalization, reviews, newsletter, trust |
| `shop.html` | Catalog with filters (occasion, recipient, category, price, personalization) + sort |
| `product.html` | PDP — gallery/zoom, personalization, wrap/card, cart & buy now, related, reviews + Product schema |
| `cart.html` | Cart, gift message, shipping threshold |
| `checkout.html` | Guest checkout, delivery date, occasion, payments (card/UPI/wallet/COD) |
| `order.html` | Confirmation |
| `track.html` | Order tracking by ID |
| `wishlist.html` | Saved products |
| `about.html` | Brand story |
| `corporate.html` | Bulk inquiry + catalog download |
| `contact.html` | FAQ + form + WhatsApp |
| `blog.html` | Gift guides |
| `admin.html` | Demo admin (orders, inquiries, stock snapshot) |

## Catalog management (demo)

Products live in `js/products.js` as `window.LIORA_PRODUCTS`.

To add a product:

1. Add images under `assets/products/`.
2. Append an object with `id`, `name`, `price`, `occasions`, `recipients`, `category`, `images`, etc.
3. Refresh the shop — filters and cards update automatically.

**Production recommendation:** Shopify, WooCommerce, or a headless CMS (e.g. Sanity/Contentful) with a Next.js storefront. Connect Razorpay/Stripe/PayU for real payments.

## Orders & email (demo vs production)

- Demo: orders saved to `localStorage` key `liora_orders`; no emails sent.
- Production: order confirmation, abandoned cart, and festive campaigns via Klaviyo, Brevo, or Shopify Email + Meta Pixel / GA4.

## Admin training (short)

1. Open `admin.html` to view demo orders and corporate inquiries on this device.
2. Edit inventory fields (`stock`) in `js/products.js` for the demo catalog.
3. For live stores, use the platform admin (Shopify Admin / WP Admin) for products, orders, and content — do not rely on this local panel.

## SEO included

- Meta titles/descriptions on key pages
- `sitemap.xml` and `robots.txt`
- JSON-LD `Store` on home and `Product` on PDP

## Payment gateway

Checkout UI supports cards, UPI, wallets, and COD in **demo mode** (no charges). Wire a gateway before going live; keep SSL enabled on hosting.

## WhatsApp / chat

Footer and Contact link to a placeholder WhatsApp URL (`wa.me/919876543210`). Replace with your business number.
