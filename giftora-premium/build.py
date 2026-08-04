#!/usr/bin/env python3
"""Giftora Premium — generate all demos, pages, assets, and root landing."""
from pathlib import Path
import textwrap

ROOT = Path(__file__).resolve().parent

CDN = {
    "bootstrap_css": "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
    "bootstrap_js": "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js",
    "fa": "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css",
    "swiper_css": "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css",
    "swiper_js": "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js",
    "aos_css": "https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css",
    "aos_js": "https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js",
}

DEMOS = [
    {
        "id": "demo-01-luxury",
        "name": "Luxury Gift Boutique",
        "tagline": "Black & Gold Elegance",
        "brand": "Giftora Luxe",
        "fonts": "Cormorant+Garamond:wght@400;500;600;700|Montserrat:wght@300;400;500;600;700",
        "font_display": "'Cormorant Garamond', serif",
        "font_body": "'Montserrat', sans-serif",
        "colors": {
            "bg": "#0a0a0a", "surface": "#141414", "text": "#f5f0e8", "muted": "#a89f91",
            "primary": "#c9a227", "secondary": "#8b7355", "accent": "#e8d5a3",
            "card": "rgba(255,255,255,0.06)", "border": "rgba(201,162,39,0.25)",
            "footer": "#050505", "hero_overlay": "rgba(0,0,0,0.55)",
        },
        "radius": "0", "card_style": "glass", "header_style": "transparent-glass",
        "hero_style": "fullscreen-slider", "product_style": "overlay-hover",
        "footer_style": "centered-luxury", "spacing": "spacious",
        "categories": ["Jewelry Boxes", "Perfume Sets", "Silk Scarves", "Crystal Décor", "Watches", "Champagne Hampers"],
        "products": [
            ("Velvet Jewelry Box", 189, 249, "sale"),
            ("Gold-Trim Perfume Set", 129, None, "new"),
            ("Silk Evening Scarf", 89, None, None),
            ("Crystal Decanter", 210, 260, "hot"),
            ("Champagne Gift Hamper", 299, None, "sale"),
            ("Leather Desk Set", 159, None, None),
            ("Gold Cufflinks", 79, 99, "sale"),
            ("Marble Candle Duo", 68, None, "new"),
        ],
        "hero_titles": [
            ("Timeless Luxury Gifts", "Curated treasures for moments that matter"),
            ("Gilded Collections", "Black, gold & unforgettable packaging"),
            ("Private Boutique Picks", "Exclusive hampers delivered worldwide"),
        ],
        "extra_sections": ["countdown", "lookbook", "instagram"],
    },
    {
        "id": "demo-02-flower",
        "name": "Flower & Bouquet Shop",
        "tagline": "Fresh Blooms Daily",
        "brand": "Giftora Bloom",
        "fonts": "Playfair+Display:wght@400;500;600;700|Lato:wght@300;400;700",
        "font_display": "'Playfair Display', serif",
        "font_body": "'Lato', sans-serif",
        "colors": {
            "bg": "#fdf8f5", "surface": "#ffffff", "text": "#3d2c2e", "muted": "#8a6f72",
            "primary": "#d4849a", "secondary": "#7a9e7e", "accent": "#f2c4ce",
            "card": "#ffffff", "border": "#f0e0e4",
            "footer": "#3d2c2e", "hero_overlay": "rgba(61,44,46,0.25)",
        },
        "radius": "1.5rem", "card_style": "soft-shadow", "header_style": "minimal-light",
        "hero_style": "split-floral", "product_style": "rounded-pastel",
        "footer_style": "floral-columns", "spacing": "airy",
        "categories": ["Bouquets", "Roses", "Orchids", "Dried Flowers", "Plants", "Gift Wraps"],
        "products": [
            ("Blush Rose Bouquet", 54, 68, "sale"),
            ("Peony Cloud Arrangement", 72, None, "new"),
            ("Lavender Dried Bundle", 32, None, None),
            ("Orchid Glass Vase", 89, None, "hot"),
            ("Sunflower Smile Box", 45, 55, "sale"),
            ("Succulent Garden Kit", 38, None, None),
            ("White Lily Elegance", 61, None, "new"),
            ("Wildflower Meadow Mix", 42, None, None),
        ],
        "hero_titles": [
            ("Blooms That Speak", "Hand-tied bouquets for every feeling"),
            ("Fresh From The Garden", "Same-day delivery across the city"),
        ],
        "extra_sections": ["seasonal", "care-tips", "instagram"],
    },
    {
        "id": "demo-03-personalized",
        "name": "Personalized Gift Store",
        "tagline": "Make It Yours",
        "brand": "Giftora Custom",
        "fonts": "Nunito:wght@400;600;700;800|Outfit:wght@300;400;500;600;700",
        "font_display": "'Nunito', sans-serif",
        "font_body": "'Outfit', sans-serif",
        "colors": {
            "bg": "#f7f9fc", "surface": "#ffffff", "text": "#1a2332", "muted": "#5a6a7e",
            "primary": "#e85d4c", "secondary": "#2a9d8f", "accent": "#f4a261",
            "card": "#ffffff", "border": "#e2e8f0",
            "footer": "#1a2332", "hero_overlay": "rgba(26,35,50,0.4)",
        },
        "radius": "0.75rem", "card_style": "bordered-action", "header_style": "bold-color",
        "hero_style": "product-showcase", "product_style": "action-bar",
        "footer_style": "newsletter-heavy", "spacing": "compact",
        "categories": ["Custom Mugs", "Photo Frames", "LED Lamps", "Name Necklaces", "Printed Cushions", "Engraved Pens"],
        "products": [
            ("Photo Collage Mug", 24, 32, "sale"),
            ("LED Night Lamp", 49, None, "new"),
            ("Wooden Photo Frame", 35, None, None),
            ("Name Necklace Gold", 78, 95, "hot"),
            ("Printed Memory Cushion", 29, None, None),
            ("Engraved Fountain Pen", 55, None, "new"),
            ("Custom Puzzle Print", 39, 48, "sale"),
            ("Star Map Poster", 42, None, None),
        ],
        "hero_titles": [
            ("Gifts With Their Name On It", "Upload a photo — we craft the rest"),
            ("Custom Mugs & Frames", "Personal touches that last forever"),
        ],
        "extra_sections": ["how-it-works", "upload-cta", "testimonials"],
    },
    {
        "id": "demo-04-corporate",
        "name": "Corporate Gifts",
        "tagline": "Elevate Client Relations",
        "brand": "Giftora Corp",
        "fonts": "Merriweather:wght@400;700|Source+Sans+3:wght@300;400;600;700",
        "font_display": "'Merriweather', serif",
        "font_body": "'Source Sans 3', sans-serif",
        "colors": {
            "bg": "#f4f7fb", "surface": "#ffffff", "text": "#0f172a", "muted": "#64748b",
            "primary": "#1e40af", "secondary": "#0ea5e9", "accent": "#334155",
            "card": "#ffffff", "border": "#dbe3ef",
            "footer": "#0f172a", "hero_overlay": "rgba(15,23,42,0.5)",
        },
        "radius": "0.375rem", "card_style": "clean-professional", "header_style": "utility-bar",
        "hero_style": "corporate-banner", "product_style": "list-meta",
        "footer_style": "multi-column-corp", "spacing": "structured",
        "categories": ["Executive Sets", "Branded Merch", "Tech Gadgets", "Desk Essentials", "Hampers", "Awards"],
        "products": [
            ("Executive Gift Set", 145, None, "hot"),
            ("Branded Wireless Charger", 68, 85, "sale"),
            ("Premium Notebook Kit", 42, None, None),
            ("Client Welcome Hamper", 120, None, "new"),
            ("Crystal Award Trophy", 95, None, None),
            ("USB Desk Organizer", 55, 70, "sale"),
            ("Leather Portfolio", 110, None, None),
            ("Gourmet Tea Box", 48, None, "new"),
        ],
        "hero_titles": [
            ("Corporate Gifting, Simplified", "Bulk orders, branding & nationwide logistics"),
            ("Impress Every Stakeholder", "Curated sets for clients, teams & events"),
        ],
        "extra_sections": ["bulk-order", "clients", "process"],
    },
    {
        "id": "demo-05-chocolate",
        "name": "Chocolate Store",
        "tagline": "Indulge in Pure Cocoa",
        "brand": "Giftora Cacao",
        "fonts": "Libre+Baskerville:wght@400;700|Karla:wght@300;400;500;600;700",
        "font_display": "'Libre Baskerville', serif",
        "font_body": "'Karla', sans-serif",
        "colors": {
            "bg": "#1a0f0a", "surface": "#2a1a12", "text": "#f5e6d3", "muted": "#b8997a",
            "primary": "#8b4513", "secondary": "#d4a574", "accent": "#c4783a",
            "card": "#241610", "border": "#3d2818",
            "footer": "#0d0805", "hero_overlay": "rgba(26,15,10,0.45)",
        },
        "radius": "0.5rem", "card_style": "rich-dark", "header_style": "dark-solid",
        "hero_style": "immersive-dark", "product_style": "cacao-tile",
        "footer_style": "rich-dark-footer", "spacing": "indulgent",
        "categories": ["Truffles", "Gift Boxes", "Bars", "Bonbons", "Hot Cocoa", "Assortments"],
        "products": [
            ("Dark Truffle Collection", 48, 60, "sale"),
            ("Gold Ribbon Gift Box", 75, None, "hot"),
            ("Single Origin Bars Set", 36, None, "new"),
            ("Salted Caramel Bonbons", 42, None, None),
            ("Luxury Assortment 24pc", 89, 110, "sale"),
            ("Ruby Cocoa Pralines", 55, None, None),
            ("Hot Cocoa Ritual Kit", 39, None, "new"),
            ("Heart-Shaped Box", 52, None, None),
        ],
        "hero_titles": [
            ("Cocoa, Crafted For Gifting", "Artisan chocolates in premium boxes"),
            ("Dark, Milk & Ruby", "Taste the seasons of cacao"),
        ],
        "extra_sections": ["pairing", "gift-cards", "instagram"],
    },
    {
        "id": "demo-06-wedding",
        "name": "Wedding Gift Shop",
        "tagline": "Celebrate Forever",
        "brand": "Giftora Vow",
        "fonts": "Cormorant:wght@400;500;600;700|Josefin+Sans:wght@300;400;500;600",
        "font_display": "'Cormorant', serif",
        "font_body": "'Josefin Sans', sans-serif",
        "colors": {
            "bg": "#fffcf7", "surface": "#ffffff", "text": "#3a3228", "muted": "#8c8070",
            "primary": "#b8956c", "secondary": "#d4c4a8", "accent": "#e8dcc8",
            "card": "#ffffff", "border": "#ebe3d6",
            "footer": "#3a3228", "hero_overlay": "rgba(58,50,40,0.3)",
        },
        "radius": "0", "card_style": "elegant-frame", "header_style": "centered-logo",
        "hero_style": "romantic-full", "product_style": "framed-elegant",
        "footer_style": "romantic-simple", "spacing": "elegant",
        "categories": ["Couple Sets", "Keepsakes", "Home Décor", "Jewelry", "Hampers", "Guest Favors"],
        "products": [
            ("Mr & Mrs Champagne Set", 98, None, "hot"),
            ("Engraved Couple Rings", 145, None, "new"),
            ("Wedding Memory Box", 72, 90, "sale"),
            ("Crystal Toast Flutes", 64, None, None),
            ("Love Letter Keepsake", 45, None, None),
            ("Honeymoon Hamper", 160, None, "new"),
            ("Guest Favor Minis (12)", 55, 70, "sale"),
            ("Gold Photo Album", 88, None, None),
        ],
        "hero_titles": [
            ("Gifts For The Newlyweds", "White, gold & forever moments"),
            ("Registry Favorites", "Elegant pieces for the big day"),
        ],
        "extra_sections": ["collections", "registry", "instagram"],
    },
    {
        "id": "demo-07-birthday",
        "name": "Birthday Gift Store",
        "tagline": "Party Starts Here",
        "brand": "Giftora Party",
        "fonts": "Fredoka:wght@400;500;600;700|Quicksand:wght@400;500;600;700",
        "font_display": "'Fredoka', sans-serif",
        "font_body": "'Quicksand', sans-serif",
        "colors": {
            "bg": "#fff9fb", "surface": "#ffffff", "text": "#2d1b4e", "muted": "#7a6a8e",
            "primary": "#ff4d8d", "secondary": "#ffc107", "accent": "#00c2ff",
            "card": "#ffffff", "border": "#ffe0ec",
            "footer": "#2d1b4e", "hero_overlay": "rgba(45,27,78,0.35)",
        },
        "radius": "1.25rem", "card_style": "playful-badge", "header_style": "colorful-bar",
        "hero_style": "party-burst", "product_style": "fun-rounded",
        "footer_style": "playful-footer", "spacing": "bouncy",
        "categories": ["Balloons", "Kids Toys", "Party Kits", "Cake Toppers", "Surprise Boxes", "Teen Gifts"],
        "products": [
            ("Rainbow Balloon Bundle", 28, 35, "sale"),
            ("Surprise Box Deluxe", 55, None, "hot"),
            ("Unicorn Plush Set", 32, None, "new"),
            ("Party Decoration Kit", 42, None, None),
            ("LED Number Candles", 18, 24, "sale"),
            ("Teen Tech Gift Pack", 68, None, None),
            ("Cake Topper Bundle", 22, None, "new"),
            ("Confetti Cannon Duo", 26, None, None),
        ],
        "hero_titles": [
            ("Make Birthdays Unforgettable", "Balloons, toys & surprise boxes"),
            ("Party In A Box", "Everything you need to celebrate"),
        ],
        "extra_sections": ["age-groups", "party-planner", "instagram"],
    },
    {
        "id": "demo-08-festival",
        "name": "Festival Gift Shop",
        "tagline": "Celebrate Every Season",
        "brand": "Giftora Fest",
        "fonts": "Rajdhani:wght@500;600;700|Poppins:wght@300;400;500;600",
        "font_display": "'Rajdhani', sans-serif",
        "font_body": "'Poppins', sans-serif",
        "colors": {
            "bg": "#fff8f0", "surface": "#ffffff", "text": "#2c1810", "muted": "#7a5648",
            "primary": "#c2410c", "secondary": "#ca8a04", "accent": "#166534",
            "card": "#ffffff", "border": "#fde8d0",
            "footer": "#2c1810", "hero_overlay": "rgba(44,24,16,0.4)",
        },
        "radius": "0.625rem", "card_style": "festive-border", "header_style": "festival-tabs",
        "hero_style": "seasonal-tabs", "product_style": "festive-tag",
        "footer_style": "festival-footer", "spacing": "festive",
        "categories": ["Diwali", "Christmas", "Eid", "Rakhi", "New Year", "Holi"],
        "products": [
            ("Diwali Lights Hamper", 65, 80, "sale"),
            ("Christmas Cookie Box", 48, None, "hot"),
            ("Eid Sweet Assortment", 55, None, "new"),
            ("Rakhi Gift Combo", 38, 45, "sale"),
            ("New Year Sparkle Set", 72, None, None),
            ("Festive Dry Fruit Box", 58, None, None),
            ("Holiday Candle Trio", 42, None, "new"),
            ("Seasonal Decor Pack", 35, None, None),
        ],
        "hero_titles": [
            ("Gifts For Every Festival", "Diwali, Christmas, Eid & more"),
            ("Seasonal Collections Live", "Limited festive editions"),
        ],
        "extra_sections": ["festivals", "countdown", "instagram"],
    },
    {
        "id": "demo-09-handmade",
        "name": "Handmade Gift Store",
        "tagline": "Crafted With Care",
        "brand": "Giftora Craft",
        "fonts": "Fraunces:wght@400;500;600;700|Source+Serif+4:wght@400;600",
        "font_display": "'Fraunces', serif",
        "font_body": "'Source Serif 4', serif",
        "colors": {
            "bg": "#f3efe6", "surface": "#faf7f0", "text": "#3e3226", "muted": "#7d6b56",
            "primary": "#6b4f3a", "secondary": "#8a9a6b", "accent": "#c4a882",
            "card": "#faf7f0", "border": "#ddd2c0",
            "footer": "#3e3226", "hero_overlay": "rgba(62,50,38,0.35)",
        },
        "radius": "0.25rem", "card_style": "rustic-wood", "header_style": "rustic-simple",
        "hero_style": "artisan-story", "product_style": "craft-label",
        "footer_style": "artisan-footer", "spacing": "organic",
        "categories": ["Woodcraft", "Pottery", "Textiles", "Candles", "Journals", "Eco Kits"],
        "products": [
            ("Hand-Carved Tray", 58, None, "hot"),
            ("Ceramic Mug Pair", 42, 52, "sale"),
            ("Linen Gift Wrap Set", 28, None, None),
            ("Soy Candle Collection", 45, None, "new"),
            ("Leather Journal", 49, None, None),
            ("Eco Seed Kit", 22, None, "new"),
            ("Woven Basket", 65, 78, "sale"),
            ("Macramé Wall Hanging", 55, None, None),
        ],
        "hero_titles": [
            ("Handmade, Heartfelt Gifts", "Wood, clay, linen & candlelight"),
            ("Meet The Makers", "Every piece tells a story"),
        ],
        "extra_sections": ["makers", "eco", "instagram"],
    },
    {
        "id": "demo-10-modern",
        "name": "Modern Gift Marketplace",
        "tagline": "Discover. Gift. Delight.",
        "brand": "Giftora Market",
        "fonts": "Space+Grotesk:wght@400;500;600;700|DM+Sans:wght@400;500;700",
        "font_display": "'Space Grotesk', sans-serif",
        "font_body": "'DM Sans', sans-serif",
        "colors": {
            "bg": "#f8fafc", "surface": "#ffffff", "text": "#0f172a", "muted": "#64748b",
            "primary": "#0f172a", "secondary": "#14b8a6", "accent": "#f43f5e",
            "card": "#ffffff", "border": "#e2e8f0",
            "footer": "#020617", "hero_overlay": "rgba(15,23,42,0.4)",
        },
        "radius": "0.5rem", "card_style": "marketplace", "header_style": "mega-search",
        "hero_style": "marketplace-grid", "product_style": "market-card",
        "footer_style": "market-footer", "spacing": "dense",
        "categories": ["Trending", "Under $25", "For Him", "For Her", "Home", "Tech", "Kids", "Experiences"],
        "products": [
            ("Wireless Earbuds Mini", 59, 79, "sale"),
            ("Ceramic Diffuser", 44, None, "new"),
            ("Minimal Desk Lamp", 68, None, "hot"),
            ("Scented Travel Set", 32, None, None),
            ("Smart Water Bottle", 49, 65, "sale"),
            ("Art Print Duo", 38, None, None),
            ("Cozy Throw Blanket", 55, None, "new"),
            ("Portable Charger Slim", 42, None, None),
        ],
        "hero_titles": [
            ("The Gift Marketplace", "Thousands of curated finds, one search"),
            ("Trending This Week", "What everyone is gifting right now"),
        ],
        "extra_sections": ["trending", "deals", "sellers"],
    },
]

PAGES = ["index", "shop", "product", "about", "gallery", "blog", "faq", "contact"]


def img(seed, w=800, h=600):
    return f"https://picsum.photos/seed/{seed}/{w}/{h}"


def ph(text, w=800, h=600, bg="333", fg="fff"):
    t = text.replace(" ", "+")
    return f"https://placehold.co/{w}x{h}/{bg}/{fg}?text={t}"


def write(path: Path, content: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content.strip() + "\n", encoding="utf-8")


def head_html(demo, title, active):
    c = demo["colors"]
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{demo['name']} — {demo['tagline']}. Premium gift shop HTML template by Giftora.">
  <meta name="keywords" content="gift shop, {demo['name']}, ecommerce template, Giftora">
  <meta name="author" content="Giftora Premium">
  <meta name="theme-color" content="{c['primary']}">
  <title>{title} | {demo['brand']} — Giftora Premium</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family={demo['fonts']}&display=swap" rel="stylesheet">
  <link href="{CDN['bootstrap_css']}" rel="stylesheet">
  <link href="{CDN['fa']}" rel="stylesheet">
  <link href="{CDN['swiper_css']}" rel="stylesheet">
  <link href="{CDN['aos_css']}" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body class="demo-{demo['id']} page-{active}">
  <div class="preloader" id="preloader" aria-hidden="true">
    <div class="preloader-inner"><span class="brand-mark">{demo['brand'][0]}</span><p>Loading…</p></div>
  </div>"""


def header_html(demo, active):
    brand = demo["brand"]
    nav = [
        ("index", "Home"),
        ("shop", "Shop"),
        ("product", "Product"),
        ("about", "About"),
        ("gallery", "Gallery"),
        ("blog", "Blog"),
        ("faq", "FAQ"),
        ("contact", "Contact"),
    ]
    links = "".join(
        f'<li class="nav-item"><a class="nav-link{" active" if active == p else ""}" href="{p}.html">{lab}</a></li>'
        for p, lab in nav
    )
    mega_cats = "".join(f'<a href="shop.html">{cat}</a>' for cat in demo["categories"][:6])
    style = demo["header_style"]

    if style == "transparent-glass":
        return f"""
  <header class="site-header header-glass sticky-top">
    <div class="container">
      <nav class="navbar navbar-expand-lg">
        <a class="navbar-brand" href="index.html"><span class="gold-text">{brand}</span></a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain" aria-label="Toggle navigation"><i class="fa-solid fa-bars"></i></button>
        <div class="collapse navbar-collapse" id="navMain">
          <ul class="navbar-nav mx-auto">{links}</ul>
          <div class="header-actions">
            <button class="btn-icon" data-wishlist aria-label="Wishlist"><i class="fa-regular fa-heart"></i><span class="badge-count" data-wish-count>0</span></button>
            <button class="btn-icon" data-cart-toggle aria-label="Cart"><i class="fa-solid fa-bag-shopping"></i><span class="badge-count" data-cart-count>0</span></button>
          </div>
        </div>
      </nav>
      <div class="mega-menu d-none d-lg-flex">{mega_cats}</div>
    </div>
  </header>"""

    if style == "minimal-light":
        return f"""
  <header class="site-header header-minimal sticky-top">
    <div class="top-strip"><div class="container text-center">Free bouquet delivery on orders over $60</div></div>
    <div class="container">
      <nav class="navbar navbar-expand-lg">
        <a class="navbar-brand" href="index.html">{brand}</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain" aria-label="Menu"><i class="fa-solid fa-bars"></i></button>
        <div class="collapse navbar-collapse" id="navMain">
          <ul class="navbar-nav ms-auto">{links}</ul>
          <div class="header-actions ms-lg-3">
            <button class="btn-icon" data-wishlist aria-label="Wishlist"><i class="fa-regular fa-heart"></i></button>
            <button class="btn-icon" data-cart-toggle aria-label="Cart"><i class="fa-solid fa-basket-shopping"></i><span class="badge-count" data-cart-count>0</span></button>
          </div>
        </div>
      </nav>
    </div>
  </header>"""

    if style == "bold-color":
        return f"""
  <header class="site-header header-bold sticky-top">
    <div class="container">
      <nav class="navbar navbar-expand-lg">
        <a class="navbar-brand" href="index.html"><i class="fa-solid fa-gift me-2"></i>{brand}</a>
        <form class="d-none d-md-flex header-search flex-grow-1 mx-4" role="search">
          <input class="form-control" type="search" placeholder="Search custom gifts…" aria-label="Search">
          <button type="submit" aria-label="Search"><i class="fa-solid fa-magnifying-glass"></i></button>
        </form>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain" aria-label="Menu"><i class="fa-solid fa-bars"></i></button>
        <div class="collapse navbar-collapse" id="navMain">
          <ul class="navbar-nav">{links}</ul>
          <div class="header-actions">
            <button class="btn-icon" data-wishlist aria-label="Wishlist"><i class="fa-regular fa-heart"></i></button>
            <button class="btn-icon btn-cart" data-cart-toggle aria-label="Cart"><i class="fa-solid fa-cart-shopping"></i> <span data-cart-count>0</span></button>
          </div>
        </div>
      </nav>
      <div class="mega-menu category-pills">{mega_cats}</div>
    </div>
  </header>"""

    if style == "utility-bar":
        return f"""
  <header class="site-header header-corp sticky-top">
    <div class="utility-bar"><div class="container d-flex justify-content-between flex-wrap">
      <span><i class="fa-solid fa-phone me-1"></i> +1 (800) 555-GIFT</span>
      <span>Bulk orders · Branding · Nationwide shipping</span>
      <span><a href="contact.html">Request a quote</a></span>
    </div></div>
    <div class="container">
      <nav class="navbar navbar-expand-lg">
        <a class="navbar-brand" href="index.html">{brand}</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain" aria-label="Menu"><i class="fa-solid fa-bars"></i></button>
        <div class="collapse navbar-collapse" id="navMain">
          <ul class="navbar-nav mx-auto">{links}</ul>
          <a class="btn btn-primary btn-sm" href="contact.html">Bulk Order</a>
          <button class="btn-icon ms-2" data-cart-toggle aria-label="Cart"><i class="fa-solid fa-briefcase"></i><span class="badge-count" data-cart-count>0</span></button>
        </div>
      </nav>
    </div>
  </header>"""

    if style == "dark-solid":
        return f"""
  <header class="site-header header-cacao sticky-top">
    <div class="container">
      <nav class="navbar navbar-expand-lg">
        <a class="navbar-brand" href="index.html">{brand}</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain" aria-label="Menu"><i class="fa-solid fa-bars"></i></button>
        <div class="collapse navbar-collapse" id="navMain">
          <ul class="navbar-nav mx-auto">{links}</ul>
          <div class="header-actions">
            <button class="btn-icon" data-wishlist aria-label="Wishlist"><i class="fa-regular fa-heart"></i></button>
            <button class="btn-icon" data-cart-toggle aria-label="Cart"><i class="fa-solid fa-box"></i><span class="badge-count" data-cart-count>0</span></button>
          </div>
        </div>
      </nav>
    </div>
  </header>"""

    if style == "centered-logo":
        return f"""
  <header class="site-header header-vow sticky-top">
    <div class="container text-center py-3">
      <a class="navbar-brand mx-auto d-inline-block" href="index.html">{brand}</a>
      <p class="header-tagline mb-0">{demo['tagline']}</p>
    </div>
    <nav class="navbar navbar-expand-lg border-top border-bottom">
      <div class="container">
        <button class="navbar-toggler mx-auto" type="button" data-bs-toggle="collapse" data-bs-target="#navMain" aria-label="Menu"><i class="fa-solid fa-bars"></i></button>
        <div class="collapse navbar-collapse" id="navMain">
          <ul class="navbar-nav mx-auto">{links}</ul>
          <div class="header-actions">
            <button class="btn-icon" data-wishlist aria-label="Wishlist"><i class="fa-regular fa-heart"></i></button>
            <button class="btn-icon" data-cart-toggle aria-label="Cart"><i class="fa-solid fa-bag-shopping"></i><span class="badge-count" data-cart-count>0</span></button>
          </div>
        </div>
      </div>
    </nav>
  </header>"""

    if style == "colorful-bar":
        return f"""
  <header class="site-header header-party sticky-top">
    <div class="party-strip"></div>
    <div class="container">
      <nav class="navbar navbar-expand-lg">
        <a class="navbar-brand" href="index.html"><i class="fa-solid fa-cake-candles me-2"></i>{brand}</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain" aria-label="Menu"><i class="fa-solid fa-bars"></i></button>
        <div class="collapse navbar-collapse" id="navMain">
          <ul class="navbar-nav ms-auto">{links}</ul>
          <div class="header-actions">
            <button class="btn-icon" data-wishlist aria-label="Wishlist"><i class="fa-regular fa-heart"></i></button>
            <button class="btn-icon" data-cart-toggle aria-label="Cart"><i class="fa-solid fa-cart-plus"></i><span class="badge-count" data-cart-count>0</span></button>
          </div>
        </div>
      </nav>
    </div>
  </header>"""

    if style == "festival-tabs":
        fest = "".join(f'<a href="shop.html">{c}</a>' for c in demo["categories"][:5])
        return f"""
  <header class="site-header header-fest sticky-top">
    <div class="fest-tabs"><div class="container d-flex gap-3 overflow-auto">{fest}</div></div>
    <div class="container">
      <nav class="navbar navbar-expand-lg">
        <a class="navbar-brand" href="index.html">{brand}</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain" aria-label="Menu"><i class="fa-solid fa-bars"></i></button>
        <div class="collapse navbar-collapse" id="navMain">
          <ul class="navbar-nav mx-auto">{links}</ul>
          <button class="btn-icon" data-cart-toggle aria-label="Cart"><i class="fa-solid fa-basket-shopping"></i><span class="badge-count" data-cart-count>0</span></button>
        </div>
      </nav>
    </div>
  </header>"""

    if style == "rustic-simple":
        return f"""
  <header class="site-header header-craft sticky-top">
    <div class="container">
      <nav class="navbar navbar-expand-lg align-items-end">
        <div>
          <a class="navbar-brand" href="index.html">{brand}</a>
          <small class="d-block text-muted">Handmade · Eco · Local</small>
        </div>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain" aria-label="Menu"><i class="fa-solid fa-bars"></i></button>
        <div class="collapse navbar-collapse" id="navMain">
          <ul class="navbar-nav ms-auto">{links}</ul>
          <button class="btn-icon" data-cart-toggle aria-label="Cart"><i class="fa-solid fa-leaf"></i><span class="badge-count" data-cart-count>0</span></button>
        </div>
      </nav>
    </div>
  </header>"""

    # mega-search (modern)
    return f"""
  <header class="site-header header-market sticky-top">
    <div class="container py-2">
      <div class="d-flex align-items-center gap-3 flex-wrap">
        <a class="navbar-brand mb-0" href="index.html">{brand}</a>
        <form class="market-search flex-grow-1" role="search">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="search" placeholder="Search gifts, brands, categories…" aria-label="Search marketplace">
        </form>
        <div class="header-actions">
          <button class="btn-icon" data-wishlist aria-label="Wishlist"><i class="fa-regular fa-heart"></i></button>
          <button class="btn-icon" data-cart-toggle aria-label="Cart"><i class="fa-solid fa-bag-shopping"></i><span class="badge-count" data-cart-count>0</span></button>
        </div>
      </div>
      <nav class="navbar navbar-expand-lg mt-1">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain" aria-label="Menu"><i class="fa-solid fa-bars"></i> Menu</button>
        <div class="collapse navbar-collapse" id="navMain">
          <ul class="navbar-nav">{links}</ul>
          <div class="mega-menu ms-lg-auto">{mega_cats}</div>
        </div>
      </nav>
    </div>
  </header>"""


def product_cards(demo, start=0, count=8, cols="col-6 col-md-4 col-lg-3"):
    cards = []
    for i, (name, price, old, badge) in enumerate(demo["products"][start:start + count]):
        seed = f"{demo['id']}-p{start + i}"
        badge_html = f'<span class="product-badge badge-{badge}">{badge}</span>' if badge else ""
        old_html = f'<span class="old-price">${old}</span>' if old else ""
        cards.append(f"""
        <div class="{cols}" data-aos="fade-up" data-aos-delay="{(i % 4) * 80}">
          <article class="product-card" data-product-id="{seed}" data-name="{name}" data-price="{price}">
            <div class="product-media">
              {badge_html}
              <img src="{img(seed, 600, 700)}" alt="{name}" loading="lazy" width="600" height="700">
              <div class="product-actions">
                <button type="button" class="btn-wish" data-add-wish aria-label="Add to wishlist"><i class="fa-regular fa-heart"></i></button>
                <button type="button" class="btn-quick" data-quick-view aria-label="Quick view"><i class="fa-regular fa-eye"></i></button>
                <button type="button" class="btn-add" data-add-cart aria-label="Add to cart"><i class="fa-solid fa-plus"></i></button>
              </div>
            </div>
            <div class="product-body">
              <h3 class="product-title"><a href="product.html">{name}</a></h3>
              <div class="product-price"><span class="price">${price}</span>{old_html}</div>
            </div>
          </article>
        </div>""")
    return "\n".join(cards)


def category_grid(demo):
    items = []
    for i, cat in enumerate(demo["categories"]):
        items.append(f"""
        <div class="col-6 col-md-4 col-lg-2" data-aos="zoom-in" data-aos-delay="{i * 50}">
          <a class="category-card" href="shop.html">
            <img src="{img(demo['id'] + '-cat' + str(i), 400, 400)}" alt="{cat}" loading="lazy">
            <span>{cat}</span>
          </a>
        </div>""")
    return "\n".join(items)


def hero_html(demo):
    style = demo["hero_style"]
    titles = demo["hero_titles"]

    if style == "fullscreen-slider":
        slides = ""
        for i, (t, s) in enumerate(titles):
            slides += f"""
            <div class="swiper-slide hero-slide" style="background-image:url('{img(demo["id"] + "-hero" + str(i), 1920, 1080)}')">
              <div class="hero-content container" data-aos="fade-up">
                <p class="eyebrow">Luxury Collection</p>
                <h1>{t}</h1>
                <p class="lead">{s}</p>
                <div class="hero-cta">
                  <a href="shop.html" class="btn btn-primary btn-ripple">Shop Collection</a>
                  <a href="about.html" class="btn btn-outline-light">Our Story</a>
                </div>
              </div>
            </div>"""
        return f"""
  <section class="hero hero-fullscreen">
    <div class="swiper hero-swiper">
      <div class="swiper-wrapper">{slides}</div>
      <div class="swiper-pagination"></div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>
  </section>"""

    if style == "split-floral":
        t, s = titles[0]
        return f"""
  <section class="hero hero-split">
    <div class="container-fluid px-0">
      <div class="row g-0 align-items-stretch min-vh-75">
        <div class="col-lg-5 hero-copy d-flex align-items-center" data-aos="fade-right">
          <div class="p-5">
            <p class="eyebrow">Fresh · Seasonal · Local</p>
            <h1>{t}</h1>
            <p class="lead">{s}</p>
            <a href="shop.html" class="btn btn-primary btn-ripple">Shop Bouquets</a>
          </div>
        </div>
        <div class="col-lg-7 hero-visual" style="background-image:url('{img(demo["id"] + "-hero", 1400, 900)}')" data-aos="fade-left"></div>
      </div>
    </div>
  </section>"""

    if style == "product-showcase":
        t, s = titles[0]
        return f"""
  <section class="hero hero-showcase">
    <div class="container py-5">
      <div class="row align-items-center g-4">
        <div class="col-lg-6" data-aos="fade-up">
          <p class="eyebrow">Upload · Customize · Gift</p>
          <h1>{t}</h1>
          <p class="lead">{s}</p>
          <div class="d-flex gap-2 flex-wrap">
            <a href="shop.html" class="btn btn-primary btn-ripple">Start Customizing</a>
            <a href="product.html" class="btn btn-outline-primary">See Examples</a>
          </div>
        </div>
        <div class="col-lg-6" data-aos="zoom-in">
          <div class="showcase-grid">
            <img src="{img(demo['id']+'-s1', 500, 500)}" alt="Custom mug" loading="lazy">
            <img src="{img(demo['id']+'-s2', 500, 500)}" alt="Photo frame" loading="lazy">
            <img src="{img(demo['id']+'-s3', 500, 500)}" alt="LED lamp" loading="lazy">
            <img src="{img(demo['id']+'-s4', 500, 500)}" alt="Name gift" loading="lazy">
          </div>
        </div>
      </div>
    </div>
  </section>"""

    if style == "corporate-banner":
        t, s = titles[0]
        return f"""
  <section class="hero hero-corp" style="background-image:url('{img(demo["id"] + "-hero", 1920, 800)}')">
    <div class="container py-5" data-aos="fade-up">
      <div class="corp-hero-card glass-card">
        <p class="eyebrow">B2B Gifting Platform</p>
        <h1>{t}</h1>
        <p class="lead">{s}</p>
        <div class="d-flex gap-2 flex-wrap">
          <a href="contact.html" class="btn btn-primary btn-ripple">Get a Quote</a>
          <a href="shop.html" class="btn btn-outline-light">Browse Catalog</a>
        </div>
      </div>
    </div>
  </section>"""

    if style == "immersive-dark":
        t, s = titles[0]
        return f"""
  <section class="hero hero-cacao">
    <div class="swiper hero-swiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide" style="background-image:url('{img(demo["id"] + "-hero0", 1920, 1000)}')">
          <div class="container hero-content" data-aos="fade-up">
            <h1>{t}</h1>
            <p class="lead">{s}</p>
            <a href="shop.html" class="btn btn-primary btn-ripple">Taste the Collection</a>
          </div>
        </div>
        <div class="swiper-slide" style="background-image:url('{img(demo["id"] + "-hero1", 1920, 1000)}')">
          <div class="container hero-content">
            <h1>{titles[1][0]}</h1>
            <p class="lead">{titles[1][1]}</p>
            <a href="shop.html" class="btn btn-primary btn-ripple">Shop Boxes</a>
          </div>
        </div>
      </div>
      <div class="swiper-pagination"></div>
    </div>
  </section>"""

    if style == "romantic-full":
        t, s = titles[0]
        return f"""
  <section class="hero hero-vow" style="background-image:url('{img(demo["id"] + "-hero", 1920, 1100)}')">
    <div class="vow-veil">
      <div class="container text-center" data-aos="fade-up">
        <p class="eyebrow">Wedding Collection</p>
        <h1>{t}</h1>
        <p class="lead mx-auto">{s}</p>
        <a href="shop.html" class="btn btn-primary btn-ripple">Explore Gifts</a>
      </div>
    </div>
  </section>"""

    if style == "party-burst":
        t, s = titles[0]
        return f"""
  <section class="hero hero-party">
    <div class="balloon balloon-1"></div>
    <div class="balloon balloon-2"></div>
    <div class="balloon balloon-3"></div>
    <div class="container text-center py-5" data-aos="zoom-in">
      <p class="eyebrow">🎉 Birthday Central</p>
      <h1>{t}</h1>
      <p class="lead mx-auto">{s}</p>
      <a href="shop.html" class="btn btn-primary btn-lg btn-ripple">Shop Party Gear</a>
    </div>
  </section>"""

    if style == "seasonal-tabs":
        t, s = titles[0]
        tabs = "".join(f'<button type="button" class="fest-chip{" active" if i==0 else ""}">{c}</button>' for i, c in enumerate(demo["categories"][:5]))
        return f"""
  <section class="hero hero-fest" style="background-image:url('{img(demo["id"] + "-hero", 1920, 900)}')">
    <div class="container py-5" data-aos="fade-up">
      <h1>{t}</h1>
      <p class="lead">{s}</p>
      <div class="fest-chip-row mb-4">{tabs}</div>
      <a href="shop.html" class="btn btn-primary btn-ripple">Shop Seasonal</a>
    </div>
  </section>"""

    if style == "artisan-story":
        t, s = titles[0]
        return f"""
  <section class="hero hero-craft">
    <div class="container">
      <div class="row align-items-center g-5">
        <div class="col-lg-6 order-lg-2" data-aos="fade-left">
          <img class="craft-hero-img" src="{img(demo['id']+'-hero', 1000, 900)}" alt="Handmade gifts" loading="eager">
        </div>
        <div class="col-lg-6" data-aos="fade-right">
          <p class="eyebrow">Studio · Workshop · Heart</p>
          <h1>{t}</h1>
          <p class="lead">{s}</p>
          <a href="shop.html" class="btn btn-primary btn-ripple">Shop Handmade</a>
          <a href="about.html" class="btn btn-link">Meet Makers</a>
        </div>
      </div>
    </div>
  </section>"""

    # marketplace-grid
    t, s = titles[0]
    return f"""
  <section class="hero hero-market">
    <div class="container-fluid">
      <div class="row g-3">
        <div class="col-lg-8">
          <div class="market-hero-main" style="background-image:url('{img(demo["id"] + "-hero", 1400, 700)}')">
            <div class="market-hero-copy" data-aos="fade-up">
              <h1>{t}</h1>
              <p>{s}</p>
              <a href="shop.html" class="btn btn-primary btn-ripple">Explore Marketplace</a>
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="row g-3 h-100">
            <div class="col-6 col-lg-12"><a class="market-tile" href="shop.html" style="background-image:url('{img(demo["id"]+"-t1", 600, 400)}')"><span>Trending</span></a></div>
            <div class="col-6 col-lg-12"><a class="market-tile" href="shop.html" style="background-image:url('{img(demo["id"]+"-t2", 600, 400)}')"><span>Flash Deals</span></a></div>
          </div>
        </div>
      </div>
    </div>
  </section>"""


def extra_sections_html(demo):
    out = []
    for sec in demo["extra_sections"]:
        if sec == "countdown":
            out.append(f"""
  <section class="section flash-sale">
    <div class="container">
      <div class="flash-inner glass-card" data-aos="fade-up">
        <div class="row align-items-center">
          <div class="col-md-6">
            <p class="eyebrow">Limited Offer</p>
            <h2>Flash Sale Ends Soon</h2>
            <p>Save up to 40% on selected {demo['name'].lower()} bestsellers.</p>
            <a href="shop.html" class="btn btn-primary btn-ripple">Shop Sale</a>
          </div>
          <div class="col-md-6">
            <div class="countdown" data-countdown="2026-12-31T23:59:59">
              <div><span data-days>00</span><small>Days</small></div>
              <div><span data-hours>00</span><small>Hours</small></div>
              <div><span data-mins>00</span><small>Mins</small></div>
              <div><span data-secs>00</span><small>Secs</small></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>""")
        elif sec == "lookbook":
            out.append(f"""
  <section class="section lookbook">
    <div class="container">
      <div class="section-head text-center" data-aos="fade-up"><h2>Lookbook</h2><p>Styled luxury moments</p></div>
      <div class="row g-3">
        {"".join(f'<div class="col-md-4"><a class="lookbook-item" href="gallery.html"><img src="{img(demo["id"]+"-lb"+str(i), 700, 900)}" alt="Lookbook {i+1}" loading="lazy"></a></div>' for i in range(3))}
      </div>
    </div>
  </section>""")
        elif sec == "instagram":
            tiles = "".join(f'<a href="#" aria-label="Instagram post"><img src="{img(demo["id"]+"-ig"+str(i), 400, 400)}" alt="Instagram {i+1}" loading="lazy"></a>' for i in range(6))
            out.append(f"""
  <section class="section instagram-feed">
    <div class="container">
      <div class="section-head text-center" data-aos="fade-up"><h2>@ {demo['brand'].replace(' ', '').lower()}</h2><p>Follow our gift stories</p></div>
      <div class="ig-grid">{tiles}</div>
    </div>
  </section>""")
        elif sec == "seasonal":
            out.append(f"""
  <section class="section seasonal-banner">
    <div class="container">
      <div class="row g-4">
        <div class="col-md-6" data-aos="fade-right"><a class="promo-banner" href="shop.html" style="background-image:url('{img(demo["id"]+"-sea1", 900, 500)}')"><span>Spring Blooms</span></a></div>
        <div class="col-md-6" data-aos="fade-left"><a class="promo-banner" href="shop.html" style="background-image:url('{img(demo["id"]+"-sea2", 900, 500)}')"><span>Dried & Forever</span></a></div>
      </div>
    </div>
  </section>""")
        elif sec == "care-tips":
            out.append("""
  <section class="section care-tips">
    <div class="container">
      <div class="section-head text-center" data-aos="fade-up"><h2>Flower Care Tips</h2><p>Keep blooms fresh longer</p></div>
      <div class="row g-4 text-center">
        <div class="col-md-4" data-aos="fade-up"><div class="tip-card"><i class="fa-solid fa-scissors"></i><h3>Trim Stems</h3><p>Cut at an angle under water every two days.</p></div></div>
        <div class="col-md-4" data-aos="fade-up" data-aos-delay="80"><div class="tip-card"><i class="fa-solid fa-droplet"></i><h3>Fresh Water</h3><p>Change water daily and remove leaves below the line.</p></div></div>
        <div class="col-md-4" data-aos="fade-up" data-aos-delay="160"><div class="tip-card"><i class="fa-solid fa-sun"></i><h3>Cool Spot</h3><p>Keep away from direct sun and ripening fruit.</p></div></div>
      </div>
    </div>
  </section>""")
        elif sec == "how-it-works":
            out.append("""
  <section class="section how-it-works">
    <div class="container">
      <div class="section-head text-center" data-aos="fade-up"><h2>How It Works</h2><p>Personalized in three steps</p></div>
      <div class="row g-4 text-center">
        <div class="col-md-4" data-aos="fade-up"><div class="step-card"><span class="step-num">1</span><h3>Choose Product</h3><p>Pick mugs, frames, lamps & more.</p></div></div>
        <div class="col-md-4" data-aos="fade-up" data-aos-delay="80"><div class="step-card"><span class="step-num">2</span><h3>Upload Photo</h3><p>Add names, dates or artwork.</p></div></div>
        <div class="col-md-4" data-aos="fade-up" data-aos-delay="160"><div class="step-card"><span class="step-num">3</span><h3>We Craft & Ship</h3><p>Printed with care, delivered fast.</p></div></div>
      </div>
    </div>
  </section>""")
        elif sec == "upload-cta":
            out.append(f"""
  <section class="section upload-cta">
    <div class="container">
      <div class="upload-box glass-card text-center" data-aos="zoom-in">
        <i class="fa-solid fa-cloud-arrow-up fa-2x mb-3"></i>
        <h2>Have a Photo Ready?</h2>
        <p>Start a custom gift in seconds.</p>
        <a href="product.html" class="btn btn-primary btn-ripple">Upload & Personalize</a>
      </div>
    </div>
  </section>""")
        elif sec == "testimonials":
            out.append(testimonial_block(demo))
        elif sec == "bulk-order":
            out.append("""
  <section class="section bulk-order">
    <div class="container">
      <div class="row align-items-center g-4">
        <div class="col-lg-6" data-aos="fade-right">
          <h2>Bulk & Branded Orders</h2>
          <p>Order 25+ units with logo printing, custom packaging and dedicated account support.</p>
          <ul class="feature-list">
            <li><i class="fa-solid fa-check"></i> Volume pricing tiers</li>
            <li><i class="fa-solid fa-check"></i> Logo embroidery & print</li>
            <li><i class="fa-solid fa-check"></i> Nationwide logistics</li>
          </ul>
          <a href="contact.html" class="btn btn-primary btn-ripple">Request Quote</a>
        </div>
        <div class="col-lg-6" data-aos="fade-left">
          <img src="{img}" alt="Corporate bulk gifts" class="img-fluid rounded" loading="lazy">
        </div>
      </div>
    </div>
  </section>""".replace("{img}", img(demo["id"] + "-bulk", 900, 600)))
        elif sec == "clients":
            logos = "".join(f'<div class="brand-logo">{ph(f"Client+{i+1}", 160, 60, "e2e8f0", "64748b")}</div>'.replace("{ph}", "PLACE") for i in range(6))
            # fix properly:
            logos = "".join(
                f'<div class="brand-logo"><img src="{ph(f"Client {i+1}", 160, 60, "e2e8f0", "64748b")}" alt="Client {i+1}" loading="lazy"></div>'
                for i in range(6)
            )
            out.append(f"""
  <section class="section client-logos">
    <div class="container text-center">
      <p class="eyebrow">Trusted By</p>
      <div class="logo-row">{logos}</div>
    </div>
  </section>""")
        elif sec == "process":
            out.append("""
  <section class="section process">
    <div class="container">
      <div class="section-head text-center" data-aos="fade-up"><h2>Our Process</h2></div>
      <div class="row g-3">
        <div class="col-md-3" data-aos="fade-up"><div class="process-step"><span>01</span><h3>Brief</h3><p>Share audience & budget.</p></div></div>
        <div class="col-md-3" data-aos="fade-up" data-aos-delay="60"><div class="process-step"><span>02</span><h3>Curate</h3><p>We propose gift sets.</p></div></div>
        <div class="col-md-3" data-aos="fade-up" data-aos-delay="120"><div class="process-step"><span>03</span><h3>Brand</h3><p>Apply your logo & pack.</p></div></div>
        <div class="col-md-3" data-aos="fade-up" data-aos-delay="180"><div class="process-step"><span>04</span><h3>Deliver</h3><p>On-time nationwide.</p></div></div>
      </div>
    </div>
  </section>""")
        elif sec == "pairing":
            out.append(f"""
  <section class="section pairing">
    <div class="container">
      <div class="section-head text-center" data-aos="fade-up"><h2>Perfect Pairings</h2><p>Chocolate meets coffee, wine & more</p></div>
      <div class="row g-4">
        <div class="col-md-4" data-aos="fade-up"><div class="pair-card"><img src="{img(demo['id']+'-pair1', 600, 400)}" alt="Wine pairing" loading="lazy"><h3>Wine Night Box</h3></div></div>
        <div class="col-md-4" data-aos="fade-up" data-aos-delay="80"><div class="pair-card"><img src="{img(demo['id']+'-pair2', 600, 400)}" alt="Coffee pairing" loading="lazy"><h3>Coffee Ritual</h3></div></div>
        <div class="col-md-4" data-aos="fade-up" data-aos-delay="160"><div class="pair-card"><img src="{img(demo['id']+'-pair3', 600, 400)}" alt="Tea pairing" loading="lazy"><h3>Afternoon Tea</h3></div></div>
      </div>
    </div>
  </section>""")
        elif sec == "gift-cards":
            out.append("""
  <section class="section gift-cards">
    <div class="container">
      <div class="gc-banner glass-card text-center" data-aos="zoom-in">
        <h2>Premium Gift Cards</h2>
        <p>Let them choose their favorite cocoa treasures.</p>
        <a href="shop.html" class="btn btn-primary btn-ripple">Buy Gift Card</a>
      </div>
    </div>
  </section>""")
        elif sec == "collections":
            out.append(f"""
  <section class="section collections">
    <div class="container">
      <div class="section-head text-center" data-aos="fade-up"><h2>Wedding Collections</h2></div>
      <div class="row g-4">
        {"".join(f'<div class="col-md-4"><a class="collection-card" href="shop.html"><img src="{img(demo["id"]+"-col"+str(i), 700, 800)}" alt="{name}" loading="lazy"><span>{name}</span></a></div>' for i, name in enumerate(["Something Gold", "Couple Keepsakes", "Guest Favors"]))}
      </div>
    </div>
  </section>""")
        elif sec == "registry":
            out.append("""
  <section class="section registry">
    <div class="container text-center" data-aos="fade-up">
      <h2>Gift Registry</h2>
      <p>Help guests find the perfect wedding gift.</p>
      <a href="contact.html" class="btn btn-primary btn-ripple">Create Registry</a>
    </div>
  </section>""")
        elif sec == "age-groups":
            out.append(f"""
  <section class="section age-groups">
    <div class="container">
      <div class="section-head text-center" data-aos="fade-up"><h2>Shop By Age</h2></div>
      <div class="row g-3">
        {"".join(f'<div class="col-6 col-md-3"><a class="age-card" href="shop.html"><img src="{img(demo["id"]+"-age"+str(i), 400, 400)}" alt="{a}" loading="lazy"><span>{a}</span></a></div>' for i, a in enumerate(["Kids 3–7", "Kids 8–12", "Teens", "Adults"]))}
      </div>
    </div>
  </section>""")
        elif sec == "party-planner":
            out.append("""
  <section class="section party-planner">
    <div class="container">
      <div class="planner-box glass-card" data-aos="fade-up">
        <h2>Party Planner Checklist</h2>
        <div class="row">
          <div class="col-md-6"><ul class="check-list"><li>Balloons & backdrop</li><li>Cake toppers</li><li>Tableware</li></ul></div>
          <div class="col-md-6"><ul class="check-list"><li>Surprise box</li><li>Candles</li><li>Party favors</li></ul></div>
        </div>
        <a href="shop.html" class="btn btn-primary btn-ripple">Build My Party Kit</a>
      </div>
    </div>
  </section>""")
        elif sec == "festivals":
            out.append(f"""
  <section class="section festivals">
    <div class="container">
      <div class="section-head text-center" data-aos="fade-up"><h2>Festival Collections</h2></div>
      <div class="row g-3">
        {"".join(f'<div class="col-6 col-md-4 col-lg-2"><a class="fest-card" href="shop.html"><img src="{img(demo["id"]+"-fest"+str(i), 300, 300)}" alt="{c}" loading="lazy"><span>{c}</span></a></div>' for i, c in enumerate(demo["categories"]))}
      </div>
    </div>
  </section>""")
        elif sec == "makers":
            out.append(f"""
  <section class="section makers">
    <div class="container">
      <div class="section-head text-center" data-aos="fade-up"><h2>Meet The Makers</h2></div>
      <div class="row g-4">
        {"".join(f'<div class="col-md-4" data-aos="fade-up"><div class="maker-card"><img src="{img(demo["id"]+"-maker"+str(i), 500, 500)}" alt="{m}" loading="lazy"><h3>{m}</h3><p>Artisan · Local studio</p></div></div>' for i, m in enumerate(["Asha Woodworks", "Clay & Co.", "Linen Loom"]))}
      </div>
    </div>
  </section>""")
        elif sec == "eco":
            out.append("""
  <section class="section eco">
    <div class="container text-center" data-aos="fade-up">
      <i class="fa-solid fa-seedling fa-2x mb-3"></i>
      <h2>Eco-Friendly Promise</h2>
      <p>Plastic-free packaging, reclaimed wood & natural dyes.</p>
    </div>
  </section>""")
        elif sec == "trending":
            out.append(f"""
  <section class="section trending">
    <div class="container">
      <div class="d-flex justify-content-between align-items-end mb-4" data-aos="fade-up">
        <div><h2>Trending Now</h2><p class="mb-0">Updated hourly</p></div>
        <a href="shop.html">View all</a>
      </div>
      <div class="row g-3">{product_cards(demo, 0, 4, "col-6 col-lg-3")}</div>
    </div>
  </section>""")
        elif sec == "deals":
            out.append(f"""
  <section class="section deals">
    <div class="container">
      <div class="deal-banner" data-aos="fade-up" style="background-image:url('{img(demo["id"]+"-deal", 1400, 400)}')">
        <div><h2>Weekend Deals</h2><p>Up to 50% off select marketplace finds</p><a href="shop.html" class="btn btn-light btn-ripple">Shop Deals</a></div>
      </div>
    </div>
  </section>""")
        elif sec == "sellers":
            out.append("""
  <section class="section sellers">
    <div class="container">
      <div class="section-head text-center" data-aos="fade-up"><h2>Top Sellers</h2></div>
      <div class="row g-3 text-center">
        <div class="col-6 col-md-3"><div class="seller-chip">Nordic Nest</div></div>
        <div class="col-6 col-md-3"><div class="seller-chip">Glow Lab</div></div>
        <div class="col-6 col-md-3"><div class="seller-chip">Paper & Clay</div></div>
        <div class="col-6 col-md-3"><div class="seller-chip">Tech Tidbits</div></div>
      </div>
    </div>
  </section>""")
    return "\n".join(out)


def testimonial_block(demo):
    return f"""
  <section class="section testimonials">
    <div class="container">
      <div class="section-head text-center" data-aos="fade-up"><h2>Kind Words</h2><p>Loved by gift-givers everywhere</p></div>
      <div class="swiper testimonial-swiper" data-aos="fade-up">
        <div class="swiper-wrapper">
          <div class="swiper-slide"><blockquote class="testimonial-card"><p>“Absolutely stunning packaging and quality. My go-to gift shop.”</p><cite>— Priya M.</cite></blockquote></div>
          <div class="swiper-slide"><blockquote class="testimonial-card"><p>“Fast delivery and the {demo['name'].lower()} selection is incredible.”</p><cite>— James R.</cite></blockquote></div>
          <div class="swiper-slide"><blockquote class="testimonial-card"><p>“From browse to unboxing — a premium experience.”</p><cite>— Aisha K.</cite></blockquote></div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
    </div>
  </section>"""


def brands_block(demo):
    logos = "".join(
        f'<div class="swiper-slide"><img src="{ph(f"Brand {i+1}", 140, 50, "cccccc", "666666")}" alt="Brand {i+1}" loading="lazy"></div>'
        for i in range(8)
    )
    return f"""
  <section class="section brands">
    <div class="container">
      <div class="swiper brand-swiper">
        <div class="swiper-wrapper">{logos}</div>
      </div>
    </div>
  </section>"""


def newsletter_block(demo):
    return f"""
  <section class="section newsletter">
    <div class="container">
      <div class="newsletter-box glass-card" data-aos="fade-up">
        <div class="row align-items-center g-3">
          <div class="col-lg-6">
            <h2>Join the {demo['brand']} List</h2>
            <p>Early access to drops, offers & gift ideas.</p>
          </div>
          <div class="col-lg-6">
            <form class="newsletter-form" data-newsletter>
              <label class="visually-hidden" for="nl-{demo['id']}">Email</label>
              <input id="nl-{demo['id']}" type="email" required placeholder="Your email address">
              <button type="submit" class="btn btn-primary btn-ripple">Subscribe</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>"""


def footer_html(demo):
    brand = demo["brand"]
    return f"""
  <footer class="site-footer footer-dark">
    <div class="container">
      <div class="row g-4 py-5">
        <div class="col-lg-4">
          <a class="footer-brand" href="index.html">{brand}</a>
          <p>{demo['tagline']}. A premium Giftora demo experience.</p>
          <div class="socials">
            <a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
            <a href="#" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="#" aria-label="Pinterest"><i class="fa-brands fa-pinterest-p"></i></a>
            <a href="#" aria-label="X"><i class="fa-brands fa-x-twitter"></i></a>
          </div>
        </div>
        <div class="col-6 col-lg-2">
          <h4>Shop</h4>
          <ul><li><a href="shop.html">All Gifts</a></li><li><a href="product.html">Featured</a></li><li><a href="gallery.html">Gallery</a></li></ul>
        </div>
        <div class="col-6 col-lg-2">
          <h4>Company</h4>
          <ul><li><a href="about.html">About</a></li><li><a href="blog.html">Blog</a></li><li><a href="faq.html">FAQ</a></li></ul>
        </div>
        <div class="col-lg-4">
          <h4>Contact</h4>
          <ul class="contact-mini">
            <li><i class="fa-solid fa-location-dot"></i> 120 Gift Avenue, NY</li>
            <li><i class="fa-solid fa-envelope"></i> hello@giftora.demo</li>
            <li><i class="fa-solid fa-phone"></i> +1 (800) 555-0199</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 {brand}. Giftora Premium HTML Template. All rights reserved.</p>
        <p><a href="../index.html">All Demos</a></p>
      </div>
    </div>
  </footer>
  <a href="#" class="back-to-top" id="backToTop" aria-label="Back to top"><i class="fa-solid fa-arrow-up"></i></a>
  <a href="https://wa.me/18005550199" class="whatsapp-float" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
  <div class="cart-drawer" id="cartDrawer" aria-hidden="true">
    <div class="cart-drawer-header"><h3>Your Bag</h3><button type="button" data-cart-close aria-label="Close">&times;</button></div>
    <div class="cart-drawer-body" data-cart-items><p class="empty-cart">Your bag is empty.</p></div>
    <div class="cart-drawer-footer"><div class="d-flex justify-content-between"><strong>Total</strong><strong data-cart-total>$0</strong></div><a href="shop.html" class="btn btn-primary w-100 mt-3">Checkout Demo</a></div>
  </div>
  <div class="cart-overlay" data-cart-close></div>
  <div class="modal fade" id="quickViewModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header"><h5 class="modal-title">Quick View</h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
        <div class="modal-body" data-qv-body></div>
      </div>
    </div>
  </div>
  <script src="{CDN['bootstrap_js']}"></script>
  <script src="{CDN['swiper_js']}"></script>
  <script src="{CDN['aos_js']}"></script>
  <script src="assets/js/main.js"></script>
</body>
</html>"""


def page_banner(title, subtitle=""):
    return f"""
  <section class="page-banner">
    <div class="container" data-aos="fade-up">
      <h1>{title}</h1>
      {f'<p>{subtitle}</p>' if subtitle else ''}
      <nav aria-label="breadcrumb"><ol class="breadcrumb"><li class="breadcrumb-item"><a href="index.html">Home</a></li><li class="breadcrumb-item active" aria-current="page">{title}</li></ol></nav>
    </div>
  </section>"""


def index_page(demo):
    parts = [
        head_html(demo, demo["name"], "index"),
        header_html(demo, "index"),
        hero_html(demo),
        f"""
  <section class="section categories">
    <div class="container">
      <div class="section-head text-center" data-aos="fade-up"><h2>Featured Categories</h2><p>Explore our curated gift worlds</p></div>
      <div class="row g-3">{category_grid(demo)}</div>
    </div>
  </section>""",
        f"""
  <section class="section bestsellers">
    <div class="container">
      <div class="section-head text-center" data-aos="fade-up"><h2>Best Sellers</h2><p>Most-loved gifts this season</p></div>
      <div class="row g-4">{product_cards(demo, 0, 4)}</div>
    </div>
  </section>""",
        f"""
  <section class="section new-arrivals">
    <div class="container">
      <div class="section-head text-center" data-aos="fade-up"><h2>New Arrivals</h2><p>Fresh finds just landed</p></div>
      <div class="row g-4">{product_cards(demo, 4, 4)}</div>
    </div>
  </section>""",
        extra_sections_html(demo),
    ]
    if "testimonials" not in demo["extra_sections"]:
        parts.append(testimonial_block(demo))
    parts.append(brands_block(demo))
    parts.append(newsletter_block(demo))
    parts.append(footer_html(demo))
    return "\n".join(parts)


def shop_page(demo):
    return "\n".join([
        head_html(demo, "Shop", "shop"),
        header_html(demo, "shop"),
        page_banner("Shop", f"Browse {demo['name']} collections"),
        f"""
  <section class="section shop-page">
    <div class="container">
      <div class="row g-4">
        <aside class="col-lg-3">
          <div class="shop-sidebar glass-card">
            <h3>Categories</h3>
            <ul class="side-cats">{"".join(f'<li><a href="#">{c}</a></li>' for c in demo["categories"])}</ul>
            <h3 class="mt-4">Price</h3>
            <div class="price-filter"><input type="range" min="0" max="300" value="200" aria-label="Max price"><p>Up to $200</p></div>
            <h3 class="mt-4">Availability</h3>
            <label class="d-block"><input type="checkbox" checked> In stock</label>
            <label class="d-block"><input type="checkbox"> On sale</label>
          </div>
        </aside>
        <div class="col-lg-9">
          <div class="shop-toolbar d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <p class="mb-0">Showing {len(demo['products'])} products</p>
            <select class="form-select w-auto" aria-label="Sort"><option>Featured</option><option>Price: Low to High</option><option>Price: High to Low</option><option>Newest</option></select>
          </div>
          <div class="row g-4">{product_cards(demo, 0, 8)}</div>
        </div>
      </div>
    </div>
  </section>""",
        footer_html(demo),
    ])


def product_page(demo):
    p = demo["products"][0]
    return "\n".join([
        head_html(demo, p[0], "product"),
        header_html(demo, "product"),
        page_banner(p[0], "Product details"),
        f"""
  <section class="section product-detail">
    <div class="container">
      <div class="row g-5">
        <div class="col-lg-6" data-aos="fade-right">
          <div class="product-gallery">
            <img class="main-img" src="{img(demo['id']+'-detail', 900, 1000)}" alt="{p[0]}" id="mainProductImg">
            <div class="thumbs">
              {"".join(f'<button type="button" data-thumb="{img(demo["id"]+"-th"+str(i), 200, 200)}"><img src="{img(demo["id"]+"-th"+str(i), 200, 200)}" alt="Thumb {i+1}"></button>' for i in range(4))}
            </div>
          </div>
        </div>
        <div class="col-lg-6" data-aos="fade-left">
          <p class="eyebrow">{demo['categories'][0]}</p>
          <h1>{p[0]}</h1>
          <div class="product-price mb-3"><span class="price">${p[1]}</span>{f'<span class="old-price">${p[2]}</span>' if p[2] else ''}</div>
          <div class="stars mb-3" aria-label="4.8 out of 5">{"".join('<i class="fa-solid fa-star"></i>' for _ in range(5))} <span>4.8 (128 reviews)</span></div>
          <p>Premium quality gift from the {demo['name']} collection. Beautifully packaged and ready to delight.</p>
          <div class="qty-row mb-3">
            <label for="qty">Qty</label>
            <input id="qty" type="number" min="1" value="1" class="form-control" style="max-width:100px">
          </div>
          <div class="d-flex gap-2 flex-wrap mb-4">
            <button class="btn btn-primary btn-ripple" data-add-cart data-name="{p[0]}" data-price="{p[1]}">Add to Cart</button>
            <button class="btn btn-outline-primary" data-add-wish>Wishlist</button>
          </div>
          <ul class="feature-list">
            <li><i class="fa-solid fa-truck"></i> Free shipping over $50</li>
            <li><i class="fa-solid fa-rotate"></i> 30-day easy returns</li>
            <li><i class="fa-solid fa-shield"></i> Secure checkout demo</li>
          </ul>
        </div>
      </div>
      <div class="product-tabs mt-5">
        <ul class="nav nav-tabs" role="tablist">
          <li class="nav-item"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#desc">Description</button></li>
          <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#info">Details</button></li>
          <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#reviews">Reviews</button></li>
        </ul>
        <div class="tab-content p-4 glass-card">
          <div class="tab-pane fade show active" id="desc"><p>Crafted for memorable gifting. Materials, finish and presentation elevate every unboxing.</p></div>
          <div class="tab-pane fade" id="info"><ul><li>SKU: GF-{demo['id'][-2:].upper()}-001</li><li>Category: {demo['categories'][0]}</li><li>Gift wrap available</li></ul></div>
          <div class="tab-pane fade" id="reviews"><p>“Gorgeous quality — arrived perfectly packaged.” — Verified buyer</p></div>
        </div>
      </div>
      <div class="related mt-5">
        <h2 class="mb-4">You May Also Like</h2>
        <div class="row g-4">{product_cards(demo, 1, 4)}</div>
      </div>
    </div>
  </section>""",
        footer_html(demo),
    ])


def about_page(demo):
    return "\n".join([
        head_html(demo, "About Us", "about"),
        header_html(demo, "about"),
        page_banner("About Us", demo["tagline"]),
        f"""
  <section class="section about-story">
    <div class="container">
      <div class="row align-items-center g-5">
        <div class="col-lg-6" data-aos="fade-right"><img src="{img(demo['id']+'-about', 900, 700)}" alt="About {demo['brand']}" class="img-fluid rounded" loading="lazy"></div>
        <div class="col-lg-6" data-aos="fade-left">
          <p class="eyebrow">Our Story</p>
          <h2>Welcome to {demo['brand']}</h2>
          <p>{demo['name']} is a Giftora Premium demo showcasing a complete ecommerce experience for {demo['tagline'].lower()}.</p>
          <p>We believe thoughtful gifts create lasting connections — and this template gives you every UI pattern to sell them beautifully.</p>
          <a href="shop.html" class="btn btn-primary btn-ripple">Explore Shop</a>
        </div>
      </div>
    </div>
  </section>
  <section class="section stats">
    <div class="container">
      <div class="row text-center g-4">
        <div class="col-6 col-md-3" data-aos="fade-up"><div class="stat-card"><strong>10k+</strong><span>Happy Customers</span></div></div>
        <div class="col-6 col-md-3" data-aos="fade-up" data-aos-delay="60"><div class="stat-card"><strong>500+</strong><span>Gift SKUs</span></div></div>
        <div class="col-6 col-md-3" data-aos="fade-up" data-aos-delay="120"><div class="stat-card"><strong>48h</strong><span>Avg. Delivery</span></div></div>
        <div class="col-6 col-md-3" data-aos="fade-up" data-aos-delay="180"><div class="stat-card"><strong>4.9</strong><span>Store Rating</span></div></div>
      </div>
    </div>
  </section>""",
        footer_html(demo),
    ])


def gallery_page(demo):
    tiles = "".join(
        f'<div class="col-6 col-md-4 col-lg-3" data-aos="zoom-in"><a class="gallery-item" href="{img(demo["id"]+"-g"+str(i), 1200, 1200)}" target="_blank" rel="noopener"><img src="{img(demo["id"]+"-g"+str(i), 600, 600)}" alt="Gallery {i+1}" loading="lazy"></a></div>'
        for i in range(12)
    )
    return "\n".join([
        head_html(demo, "Gallery", "gallery"),
        header_html(demo, "gallery"),
        page_banner("Gallery", "Visual inspiration"),
        f'<section class="section"><div class="container"><div class="row g-3">{tiles}</div></div></section>',
        footer_html(demo),
    ])


def blog_page(demo):
    posts = [
        ("Gift Wrapping Secrets", "Tips to elevate every unboxing."),
        ("Seasonal Gift Guide", "What to give this month."),
        ("Corporate Gifting 101", "Make clients feel valued."),
        ("Handmade vs Mass Market", "Why craft still wins."),
        ("Festival Prep Checklist", "Shop early, gift happily."),
        ("Photo Gift Ideas", "Turn memories into keepsakes."),
    ]
    cards = "".join(
        f"""<div class="col-md-6 col-lg-4" data-aos="fade-up">
          <article class="blog-card glass-card">
            <img src="{img(demo['id']+'-blog'+str(i), 700, 450)}" alt="{t}" loading="lazy">
            <div class="p-3">
              <p class="eyebrow">Journal</p>
              <h3>{t}</h3>
              <p>{e}</p>
              <a href="#">Read more</a>
            </div>
          </article>
        </div>"""
        for i, (t, e) in enumerate(posts)
    )
    return "\n".join([
        head_html(demo, "Blog", "blog"),
        header_html(demo, "blog"),
        page_banner("Blog", "Ideas, guides & inspiration"),
        f'<section class="section"><div class="container"><div class="row g-4">{cards}</div></div></section>',
        footer_html(demo),
    ])


def faq_page(demo):
    faqs = [
        ("Do you ship internationally?", "This is a demo template. Connect your own shipping provider in production."),
        ("Can I customize products?", "Yes — the personalized demo showcases upload & custom flows."),
        ("What payment methods are supported?", "Demo cart only. Integrate Stripe, PayPal or your gateway."),
        ("How do bulk orders work?", "Use the corporate contact form pattern for quote requests."),
        ("Is the template responsive?", "Fully responsive across mobile, tablet and desktop."),
        ("Are images included?", "Placeholders from picsum.photos / placehold.co — replace with your assets."),
    ]
    items = "".join(
        f"""<div class="accordion-item">
          <h2 class="accordion-header"><button class="accordion-button{" collapsed" if i else ""}" type="button" data-bs-toggle="collapse" data-bs-target="#faq{i}" aria-expanded="{"true" if i==0 else "false"}">{q}</button></h2>
          <div id="faq{i}" class="accordion-collapse collapse{" show" if i==0 else ""}" data-bs-parent="#faqAcc"><div class="accordion-body">{a}</div></div>
        </div>"""
        for i, (q, a) in enumerate(faqs)
    )
    return "\n".join([
        head_html(demo, "FAQ", "faq"),
        header_html(demo, "faq"),
        page_banner("FAQ", "Answers to common questions"),
        f'<section class="section"><div class="container"><div class="accordion" id="faqAcc">{items}</div></div></section>',
        footer_html(demo),
    ])


def contact_page(demo):
    return "\n".join([
        head_html(demo, "Contact", "contact"),
        header_html(demo, "contact"),
        page_banner("Contact", "We'd love to hear from you"),
        f"""
  <section class="section contact-page">
    <div class="container">
      <div class="row g-5">
        <div class="col-lg-6" data-aos="fade-right">
          <h2>Send a Message</h2>
          <form class="contact-form" data-contact>
            <div class="mb-3"><label class="form-label" for="c-name">Name</label><input class="form-control" id="c-name" required></div>
            <div class="mb-3"><label class="form-label" for="c-email">Email</label><input type="email" class="form-control" id="c-email" required></div>
            <div class="mb-3"><label class="form-label" for="c-subject">Subject</label><input class="form-control" id="c-subject"></div>
            <div class="mb-3"><label class="form-label" for="c-msg">Message</label><textarea class="form-control" id="c-msg" rows="5" required></textarea></div>
            <button type="submit" class="btn btn-primary btn-ripple">Send Message</button>
          </form>
        </div>
        <div class="col-lg-6" data-aos="fade-left">
          <div class="contact-info glass-card p-4 mb-4">
            <p><i class="fa-solid fa-location-dot me-2"></i> 120 Gift Avenue, New York, NY</p>
            <p><i class="fa-solid fa-envelope me-2"></i> hello@giftora.demo</p>
            <p><i class="fa-solid fa-phone me-2"></i> +1 (800) 555-0199</p>
            <p><i class="fa-solid fa-clock me-2"></i> Mon–Sat 9am–7pm</p>
          </div>
          <div class="map-placeholder" role="img" aria-label="Map placeholder">
            <img src="{ph('Google Map Placeholder', 800, 400, '1e293b', '94a3b8')}" alt="Map placeholder" loading="lazy">
          </div>
        </div>
      </div>
    </div>
  </section>""",
        footer_html(demo),
    ])


PAGE_BUILDERS = {
    "index": index_page,
    "shop": shop_page,
    "product": product_page,
    "about": about_page,
    "gallery": gallery_page,
    "blog": blog_page,
    "faq": faq_page,
    "contact": contact_page,
}


def css_for_demo(demo):
    c = demo["colors"]
    r = demo["radius"]
    return f"""/* {demo['brand']} — {demo['name']} */
:root {{
  --bg: {c['bg']};
  --surface: {c['surface']};
  --text: {c['text']};
  --muted: {c['muted']};
  --primary: {c['primary']};
  --secondary: {c['secondary']};
  --accent: {c['accent']};
  --card: {c['card']};
  --border: {c['border']};
  --footer: {c['footer']};
  --hero-overlay: {c['hero_overlay']};
  --radius: {r};
  --font-display: {demo['font_display']};
  --font-body: {demo['font_body']};
  --header-h: 72px;
  --shadow: 0 12px 40px rgba(0,0,0,.12);
}}

*,*::before,*::after {{ box-sizing: border-box; }}
html {{ scroll-behavior: smooth; }}
body {{
  margin: 0;
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  overflow-x: hidden;
}}
img {{ max-width: 100%; height: auto; display: block; }}
a {{ color: var(--primary); text-decoration: none; transition: .25s ease; }}
a:hover {{ color: var(--secondary); }}
h1,h2,h3,h4,.navbar-brand {{ font-family: var(--font-display); font-weight: 600; letter-spacing: .01em; }}
.section {{ padding: 5rem 0; }}
.section-head {{ margin-bottom: 2.5rem; }}
.section-head h2 {{ font-size: clamp(1.75rem, 3vw, 2.75rem); margin-bottom: .5rem; }}
.section-head p, .lead, .eyebrow {{ color: var(--muted); }}
.eyebrow {{ text-transform: uppercase; letter-spacing: .18em; font-size: .75rem; font-weight: 600; margin-bottom: .75rem; }}

/* Preloader */
.preloader {{
  position: fixed; inset: 0; z-index: 9999; background: var(--bg);
  display: grid; place-items: center; transition: opacity .4s ease, visibility .4s;
}}
.preloader.hide {{ opacity: 0; visibility: hidden; }}
.preloader-inner {{ text-align: center; }}
.brand-mark {{
  width: 64px; height: 64px; border-radius: 50%; display: grid; place-items: center; margin: 0 auto .75rem;
  border: 2px solid var(--primary); color: var(--primary); font-family: var(--font-display); font-size: 1.5rem;
  animation: pulse 1.2s ease infinite;
}}
@keyframes pulse {{ 50% {{ transform: scale(1.08); }} }}

/* Buttons */
.btn {{ border-radius: var(--radius); font-weight: 600; padding: .7rem 1.4rem; position: relative; overflow: hidden; }}
.btn-primary {{ background: var(--primary); border-color: var(--primary); color: #fff; }}
.btn-primary:hover {{ background: var(--secondary); border-color: var(--secondary); color: #fff; }}
.btn-outline-primary {{ border-color: var(--primary); color: var(--primary); }}
.btn-outline-primary:hover {{ background: var(--primary); color: #fff; }}
.btn-ripple .ripple {{
  position: absolute; border-radius: 50%; transform: scale(0); animation: ripple .6s linear; background: rgba(255,255,255,.35);
}}
@keyframes ripple {{ to {{ transform: scale(4); opacity: 0; }} }}

/* Glass */
.glass-card {{
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: calc(var(--radius) + .25rem);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: var(--shadow);
}}

/* Header */
.site-header {{
  background: color-mix(in srgb, var(--surface) 88%, transparent);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  z-index: 1030;
}}
.navbar-brand {{ font-size: 1.5rem; color: var(--text) !important; }}
.nav-link {{ color: var(--muted) !important; font-weight: 500; padding: .5rem .85rem !important; }}
.nav-link:hover, .nav-link.active {{ color: var(--primary) !important; }}
.navbar-toggler {{ border: 0; color: var(--text); font-size: 1.25rem; }}
.header-actions {{ display: flex; align-items: center; gap: .5rem; }}
.btn-icon {{
  background: transparent; border: 1px solid var(--border); color: var(--text);
  width: 42px; height: 42px; border-radius: 50%; display: inline-grid; place-items: center; position: relative;
}}
.btn-icon:hover {{ border-color: var(--primary); color: var(--primary); }}
.badge-count {{
  position: absolute; top: -4px; right: -4px; background: var(--primary); color: #fff;
  font-size: .65rem; min-width: 16px; height: 16px; border-radius: 999px; display: grid; place-items: center;
}}
.mega-menu {{ gap: 1rem; flex-wrap: wrap; padding: .5rem 0 1rem; font-size: .85rem; }}
.mega-menu a {{ color: var(--muted); padding: .35rem .75rem; border: 1px solid var(--border); border-radius: 999px; }}
.mega-menu a:hover {{ color: var(--primary); border-color: var(--primary); }}
.gold-text {{ background: linear-gradient(120deg, var(--accent), var(--primary)); -webkit-background-clip: text; background-clip: text; color: transparent; }}
.header-glass {{ background: rgba(10,10,10,.65); border-color: var(--border); }}
.header-minimal .top-strip {{ background: var(--accent); color: var(--text); font-size: .85rem; padding: .4rem 0; }}
.header-bold {{ background: var(--primary); }}
.header-bold .navbar-brand, .header-bold .nav-link {{ color: #fff !important; }}
.header-bold .btn-icon {{ border-color: rgba(255,255,255,.35); color: #fff; }}
.header-search {{ display: flex; background: #fff; border-radius: 999px; overflow: hidden; }}
.header-search input {{ border: 0; padding: .55rem 1rem; flex: 1; outline: none; }}
.header-search button {{ border: 0; background: var(--secondary); color: #fff; padding: 0 1rem; }}
.category-pills {{ background: var(--surface); margin: 0 -12px; padding: .75rem 12px !important; }}
.utility-bar {{ background: var(--primary); color: #fff; font-size: .85rem; padding: .4rem 0; }}
.utility-bar a {{ color: #fff; text-decoration: underline; }}
.header-corp {{ background: #fff; }}
.header-cacao {{ background: var(--surface); }}
.header-vow .header-tagline {{ font-size: .8rem; letter-spacing: .2em; text-transform: uppercase; color: var(--muted); }}
.party-strip {{ height: 6px; background: linear-gradient(90deg, var(--primary), var(--secondary), var(--accent), var(--primary)); background-size: 200% 100%; animation: party 4s linear infinite; }}
@keyframes party {{ to {{ background-position: 200% 0; }} }}
.fest-tabs {{ background: var(--primary); padding: .5rem 0; }}
.fest-tabs a {{ color: #fff; white-space: nowrap; font-weight: 600; opacity: .85; }}
.fest-tabs a:hover {{ opacity: 1; color: #fff; }}
.market-search {{ display: flex; align-items: center; gap: .75rem; background: #fff; border: 1px solid var(--border); border-radius: .75rem; padding: .65rem 1rem; }}
.market-search input {{ border: 0; outline: none; width: 100%; background: transparent; }}

/* Hero */
.hero-slide, .hero-visual, .hero-corp, .hero-cacao .swiper-slide, .hero-vow, .hero-fest, .market-hero-main, .market-tile, .promo-banner, .deal-banner, .collection-card, .lookbook-item {{
  background-size: cover; background-position: center;
}}
.hero-fullscreen .hero-slide {{ min-height: 92vh; display: flex; align-items: flex-end; position: relative; }}
.hero-fullscreen .hero-slide::before, .hero-corp::before, .hero-cacao .swiper-slide::before, .hero-vow::before, .hero-fest::before, .market-hero-main::before {{
  content: ""; position: absolute; inset: 0; background: var(--hero-overlay);
}}
.hero-content, .corp-hero-card, .vow-veil, .market-hero-copy {{ position: relative; z-index: 1; color: #fff; padding-bottom: 4rem; }}
.hero h1 {{ font-size: clamp(2.4rem, 6vw, 4.5rem); line-height: 1.1; margin-bottom: 1rem; }}
.hero-cta {{ display: flex; gap: .75rem; flex-wrap: wrap; }}
.hero-split .min-vh-75 {{ min-height: 75vh; }}
.hero-split .hero-copy {{ background: var(--surface); }}
.hero-split .hero-visual {{ min-height: 420px; }}
.showcase-grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; }}
.showcase-grid img {{ border-radius: var(--radius); aspect-ratio: 1; object-fit: cover; transition: transform .4s ease; }}
.showcase-grid img:hover {{ transform: scale(1.03); }}
.corp-hero-card {{ max-width: 560px; padding: 2.5rem; background: rgba(15,23,42,.72); border: 1px solid rgba(255,255,255,.15); color: #fff; }}
.hero-cacao .swiper-slide {{ min-height: 80vh; display: flex; align-items: center; position: relative; }}
.hero-vow {{ min-height: 88vh; display: flex; align-items: center; position: relative; }}
.vow-veil {{ width: 100%; padding: 4rem 0; }}
.vow-veil .lead {{ max-width: 520px; }}
.hero-party {{
  position: relative; overflow: hidden; min-height: 70vh; display: flex; align-items: center;
  background: radial-gradient(circle at 20% 20%, #ffe3ef, transparent 40%),
              radial-gradient(circle at 80% 10%, #fff3c4, transparent 35%),
              radial-gradient(circle at 50% 80%, #d9f7ff, transparent 40%), var(--bg);
}}
.hero-party .lead {{ max-width: 560px; }}
.balloon {{ position: absolute; width: 70px; height: 90px; border-radius: 50% 50% 50% 50% / 45% 45% 55% 55%; opacity: .85; animation: floaty 5s ease-in-out infinite; }}
.balloon::after {{ content: ""; position: absolute; left: 50%; bottom: -28px; width: 2px; height: 28px; background: #999; }}
.balloon-1 {{ background: var(--primary); top: 15%; left: 8%; }}
.balloon-2 {{ background: var(--secondary); top: 25%; right: 12%; animation-delay: 1s; }}
.balloon-3 {{ background: var(--accent); bottom: 20%; left: 20%; animation-delay: 2s; }}
@keyframes floaty {{ 50% {{ transform: translateY(-18px); }} }}
.hero-fest {{ min-height: 70vh; display: flex; align-items: center; position: relative; color: #fff; }}
.hero-fest .container {{ position: relative; z-index: 1; }}
.fest-chip-row {{ display: flex; gap: .5rem; flex-wrap: wrap; }}
.fest-chip {{ border: 1px solid rgba(255,255,255,.5); background: transparent; color: #fff; border-radius: 999px; padding: .4rem 1rem; }}
.fest-chip.active, .fest-chip:hover {{ background: #fff; color: var(--primary); }}
.hero-craft {{ padding: 4rem 0; }}
.craft-hero-img {{ border-radius: var(--radius); box-shadow: var(--shadow); border: 8px solid var(--surface); }}
.hero-market {{ padding: 1rem 0 0; }}
.market-hero-main {{ min-height: 420px; border-radius: var(--radius); position: relative; display: flex; align-items: flex-end; overflow: hidden; }}
.market-hero-copy {{ padding: 2rem; color: #fff; }}
.market-tile {{ display: block; min-height: 200px; border-radius: var(--radius); position: relative; overflow: hidden; }}
.market-tile span {{ position: absolute; left: 1rem; bottom: 1rem; background: #fff; color: var(--text); padding: .4rem .8rem; border-radius: .4rem; font-weight: 700; }}

/* Categories */
.category-card {{
  display: block; text-align: center; color: var(--text); border-radius: var(--radius); overflow: hidden;
}}
.category-card img {{ aspect-ratio: 1; object-fit: cover; transition: transform .5s ease; border-radius: var(--radius); }}
.category-card:hover img {{ transform: scale(1.06); }}
.category-card span {{ display: block; margin-top: .75rem; font-weight: 600; }}

/* Products */
.product-card {{
  background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; height: 100%;
  transition: transform .3s ease, box-shadow .3s ease;
}}
.product-card:hover {{ transform: translateY(-6px); box-shadow: var(--shadow); }}
.product-media {{ position: relative; overflow: hidden; }}
.product-media img {{ width: 100%; aspect-ratio: 6/7; object-fit: cover; transition: transform .5s ease; }}
.product-card:hover .product-media img {{ transform: scale(1.05); }}
.product-badge {{
  position: absolute; top: .75rem; left: .75rem; z-index: 2; text-transform: uppercase; font-size: .65rem;
  font-weight: 700; letter-spacing: .08em; padding: .3rem .55rem; border-radius: .25rem; background: var(--primary); color: #fff;
}}
.badge-new {{ background: var(--secondary); }}
.badge-hot {{ background: var(--accent); color: #111; }}
.badge-sale {{ background: #e11d48; }}
.product-actions {{
  position: absolute; inset: auto .75rem .75rem auto; display: flex; flex-direction: column; gap: .4rem;
  opacity: 0; transform: translateX(10px); transition: .3s ease;
}}
.product-card:hover .product-actions {{ opacity: 1; transform: none; }}
.product-actions button {{
  width: 40px; height: 40px; border: 0; border-radius: 50%; background: #fff; color: #111; box-shadow: var(--shadow);
}}
.product-actions button:hover {{ background: var(--primary); color: #fff; }}
.product-body {{ padding: 1rem; }}
.product-title {{ font-size: 1rem; margin: 0 0 .35rem; }}
.product-title a {{ color: var(--text); }}
.product-price .price {{ font-weight: 700; color: var(--primary); }}
.old-price {{ margin-left: .5rem; text-decoration: line-through; color: var(--muted); font-size: .9rem; }}

/* Flash / countdown */
.flash-inner {{ padding: 2.5rem; }}
.countdown {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: .75rem; text-align: center; }}
.countdown div {{ background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 1rem .5rem; }}
.countdown span {{ display: block; font-size: 1.6rem; font-family: var(--font-display); font-weight: 700; }}

/* Misc sections */
.promo-banner, .collection-card, .lookbook-item, .age-card, .fest-card, .gallery-item {{
  display: block; position: relative; overflow: hidden; border-radius: var(--radius); min-height: 220px;
}}
.promo-banner span, .collection-card span {{
  position: absolute; left: 1.25rem; bottom: 1.25rem; color: #fff; font-size: 1.4rem; font-family: var(--font-display); font-weight: 700;
  text-shadow: 0 4px 20px rgba(0,0,0,.4);
}}
.ig-grid {{ display: grid; grid-template-columns: repeat(6, 1fr); gap: .5rem; }}
.ig-grid img {{ aspect-ratio: 1; object-fit: cover; border-radius: .35rem; transition: .3s; }}
.ig-grid a:hover img {{ transform: scale(1.04); filter: brightness(.9); }}
.tip-card, .step-card, .process-step, .stat-card, .maker-card, .pair-card, .blog-card {{
  background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.5rem; height: 100%;
}}
.tip-card i, .step-num {{ color: var(--primary); font-size: 1.5rem; margin-bottom: .75rem; display: inline-block; }}
.step-num {{ font-family: var(--font-display); font-size: 2rem; font-weight: 700; }}
.feature-list {{ list-style: none; padding: 0; }}
.feature-list li {{ margin-bottom: .5rem; }}
.feature-list i {{ color: var(--primary); margin-right: .5rem; }}
.logo-row {{ display: flex; flex-wrap: wrap; gap: 1.5rem; justify-content: center; align-items: center; }}
.upload-box, .gc-banner, .planner-box, .newsletter-box {{ padding: 2.5rem; }}
.testimonial-card {{ background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 2rem; height: 100%; }}
.testimonial-card cite {{ color: var(--muted); font-style: normal; }}
.newsletter-form {{ display: flex; gap: .5rem; flex-wrap: wrap; }}
.newsletter-form input {{ flex: 1; min-width: 200px; border: 1px solid var(--border); background: var(--surface); color: var(--text); border-radius: var(--radius); padding: .75rem 1rem; }}
.deal-banner {{ min-height: 240px; border-radius: var(--radius); display: flex; align-items: center; padding: 2rem; color: #fff; position: relative; overflow: hidden; }}
.deal-banner::before {{ content: ""; position: absolute; inset: 0; background: rgba(0,0,0,.45); }}
.deal-banner > div {{ position: relative; z-index: 1; }}
.seller-chip {{ background: var(--surface); border: 1px solid var(--border); border-radius: 999px; padding: 1rem; font-weight: 700; }}
.check-list {{ list-style: none; padding: 0; }}
.check-list li::before {{ content: "✓ "; color: var(--primary); font-weight: 700; }}
.age-card img, .fest-card img, .maker-card img, .pair-card img, .blog-card img, .gallery-item img {{ width: 100%; aspect-ratio: 1; object-fit: cover; }}
.age-card span, .fest-card span {{ display: block; text-align: center; padding: .75rem; font-weight: 600; color: var(--text); }}

/* Page banner */
.page-banner {{
  padding: 4rem 0 2.5rem; background: linear-gradient(135deg, color-mix(in srgb, var(--primary) 18%, var(--bg)), var(--bg));
  border-bottom: 1px solid var(--border);
}}
.page-banner h1 {{ margin-bottom: .35rem; }}
.breadcrumb {{ background: transparent; padding: 0; margin-top: 1rem; }}
.breadcrumb-item, .breadcrumb-item a {{ color: var(--muted); }}
.breadcrumb-item.active {{ color: var(--primary); }}

/* Shop / product */
.shop-sidebar {{ padding: 1.25rem; position: sticky; top: 90px; }}
.side-cats {{ list-style: none; padding: 0; margin: 0; }}
.side-cats a {{ color: var(--muted); display: block; padding: .35rem 0; }}
.side-cats a:hover {{ color: var(--primary); }}
.product-gallery .main-img {{ width: 100%; border-radius: var(--radius); aspect-ratio: 9/10; object-fit: cover; }}
.thumbs {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: .5rem; margin-top: .75rem; }}
.thumbs button {{ border: 1px solid var(--border); padding: 0; border-radius: .35rem; overflow: hidden; background: transparent; }}
.thumbs img {{ width: 100%; aspect-ratio: 1; object-fit: cover; }}
.stars {{ color: var(--primary); }}
.stars span {{ color: var(--muted); margin-left: .35rem; }}
.map-placeholder img {{ width: 100%; border-radius: var(--radius); }}
.contact-form .form-control {{ background: var(--surface); border-color: var(--border); color: var(--text); }}
.accordion-item {{ background: var(--card); border-color: var(--border); color: var(--text); }}
.accordion-button {{ background: var(--card); color: var(--text); box-shadow: none !important; }}
.accordion-button:not(.collapsed) {{ background: color-mix(in srgb, var(--primary) 12%, var(--card)); color: var(--text); }}
.accordion-body {{ color: var(--muted); }}

/* Footer */
.site-footer {{ background: var(--footer); color: rgba(255,255,255,.78); }}
.footer-brand {{ color: #fff; font-size: 1.5rem; font-family: var(--font-display); display: inline-block; margin-bottom: .75rem; }}
.site-footer h4 {{ color: #fff; font-size: 1rem; margin-bottom: 1rem; }}
.site-footer ul {{ list-style: none; padding: 0; }}
.site-footer a {{ color: rgba(255,255,255,.7); }}
.site-footer a:hover {{ color: #fff; }}
.socials {{ display: flex; gap: .75rem; margin-top: 1rem; }}
.socials a {{ width: 38px; height: 38px; border: 1px solid rgba(255,255,255,.2); border-radius: 50%; display: grid; place-items: center; }}
.footer-bottom {{ border-top: 1px solid rgba(255,255,255,.1); padding: 1.25rem 0; display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; font-size: .9rem; }}
.contact-mini li {{ margin-bottom: .5rem; }}

/* Floaters */
.back-to-top, .whatsapp-float {{
  position: fixed; right: 1.25rem; z-index: 1040; width: 48px; height: 48px; border-radius: 50%;
  display: grid; place-items: center; color: #fff; box-shadow: var(--shadow);
}}
.back-to-top {{ bottom: 5.5rem; background: var(--primary); opacity: 0; pointer-events: none; transition: .3s; }}
.back-to-top.show {{ opacity: 1; pointer-events: auto; }}
.whatsapp-float {{ bottom: 1.5rem; background: #25d366; font-size: 1.4rem; }}

/* Cart drawer */
.cart-drawer {{
  position: fixed; top: 0; right: 0; width: min(380px, 100%); height: 100%; background: var(--surface); color: var(--text);
  z-index: 1080; transform: translateX(100%); transition: transform .35s ease; display: flex; flex-direction: column;
  border-left: 1px solid var(--border);
}}
.cart-drawer.open {{ transform: none; }}
.cart-drawer-header, .cart-drawer-footer {{ padding: 1.25rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }}
.cart-drawer-footer {{ border-bottom: 0; border-top: 1px solid var(--border); display: block; }}
.cart-drawer-body {{ flex: 1; overflow: auto; padding: 1.25rem; }}
.cart-overlay {{ position: fixed; inset: 0; background: rgba(0,0,0,.45); z-index: 1070; opacity: 0; pointer-events: none; transition: .3s; }}
.cart-overlay.open {{ opacity: 1; pointer-events: auto; }}
.cart-line {{ display: flex; justify-content: space-between; gap: 1rem; padding: .75rem 0; border-bottom: 1px solid var(--border); }}

/* Demo-specific tweaks */
.demo-demo-01-luxury .product-card {{ background: rgba(255,255,255,.05); }}
.demo-demo-01-luxury .section {{ padding: 6rem 0; }}
.demo-demo-02-flower .product-card {{ box-shadow: 0 10px 30px rgba(212,132,154,.12); border: 0; }}
.demo-demo-02-flower .btn-primary {{ border-radius: 999px; }}
.demo-demo-03-personalized .product-actions {{ flex-direction: row; inset: auto auto .75rem 50%; transform: translate(-50%, 10px); }}
.demo-demo-03-personalized .product-card:hover .product-actions {{ transform: translate(-50%, 0); }}
.demo-demo-04-corporate .product-body {{ border-top: 3px solid var(--primary); }}
.demo-demo-04-corporate .section-head {{ text-align: left !important; }}
.demo-demo-05-chocolate .product-badge {{ border-radius: 0; }}
.demo-demo-05-chocolate .btn {{ letter-spacing: .06em; text-transform: uppercase; font-size: .8rem; }}
.demo-demo-06-wedding .product-card {{ border: 1px solid var(--border); box-shadow: none; }}
.demo-demo-06-wedding .product-media {{ padding: .75rem; }}
.demo-demo-06-wedding .product-media img {{ border: 1px solid var(--border); }}
.demo-demo-07-birthday .product-card {{ border-radius: 1.5rem; border: 2px solid var(--border); }}
.demo-demo-07-birthday .product-badge {{ border-radius: 999px; }}
.demo-demo-08-festival .product-card {{ border-top: 4px solid var(--primary); }}
.demo-demo-09-handmade .product-card {{ background: var(--surface); box-shadow: 4px 4px 0 var(--border); }}
.demo-demo-09-handmade .btn-primary {{ border-radius: .2rem; }}
.demo-demo-10-modern .product-card {{ border-radius: .5rem; }}
.demo-demo-10-modern .section {{ padding: 3.5rem 0; }}
.demo-demo-10-modern .shop-page .col-lg-3 {{ order: -1; }}

@media (max-width: 991.98px) {{
  .ig-grid {{ grid-template-columns: repeat(3, 1fr); }}
  .mega-menu {{ display: none !important; }}
  .hero h1 {{ font-size: 2.2rem; }}
  .section {{ padding: 3.5rem 0; }}
}}
@media (max-width: 575.98px) {{
  .countdown {{ grid-template-columns: repeat(2, 1fr); }}
  .ig-grid {{ grid-template-columns: repeat(2, 1fr); }}
}}
"""


SHARED_JS = r"""/* Giftora Premium — shared demo interactions */
(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // Preloader
  window.addEventListener('load', () => {
    const pre = $('#preloader');
    if (pre) setTimeout(() => pre.classList.add('hide'), 400);
  });

  // AOS
  if (window.AOS) AOS.init({ duration: 700, once: true, offset: 60 });

  // Swipers
  if (window.Swiper) {
    if ($('.hero-swiper')) {
      new Swiper('.hero-swiper', {
        loop: true,
        autoplay: { delay: 4500, disableOnInteraction: false },
        pagination: { el: '.hero-swiper .swiper-pagination', clickable: true },
        navigation: { nextEl: '.hero-swiper .swiper-button-next', prevEl: '.hero-swiper .swiper-button-prev' },
        effect: 'fade',
        fadeEffect: { crossFade: true },
      });
    }
    if ($('.testimonial-swiper')) {
      new Swiper('.testimonial-swiper', {
        loop: true,
        autoplay: { delay: 5000 },
        pagination: { el: '.testimonial-swiper .swiper-pagination', clickable: true },
        slidesPerView: 1,
        spaceBetween: 24,
        breakpoints: { 768: { slidesPerView: 2 }, 1200: { slidesPerView: 3 } },
      });
    }
    if ($('.brand-swiper')) {
      new Swiper('.brand-swiper', {
        loop: true,
        autoplay: { delay: 2500 },
        slidesPerView: 2,
        spaceBetween: 24,
        breakpoints: { 576: { slidesPerView: 3 }, 992: { slidesPerView: 5 } },
      });
    }
  }

  // Sticky visual polish
  const header = $('.site-header');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 20);
    const topBtn = $('#backToTop');
    if (topBtn) topBtn.classList.toggle('show', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  $('#backToTop')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Ripple buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-ripple');
    if (!btn) return;
    const circle = document.createElement('span');
    circle.className = 'ripple';
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    circle.style.width = circle.style.height = size + 'px';
    circle.style.left = e.clientX - rect.left - size / 2 + 'px';
    circle.style.top = e.clientY - rect.top - size / 2 + 'px';
    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  });

  // Cart / wishlist (demo)
  const storageKey = 'giftora-cart-' + (document.body.className.match(/demo-[\w-]+/) || ['demo'])[0];
  const wishKey = storageKey + '-wish';
  let cart = JSON.parse(localStorage.getItem(storageKey) || '[]');
  let wish = JSON.parse(localStorage.getItem(wishKey) || '[]');

  const save = () => {
    localStorage.setItem(storageKey, JSON.stringify(cart));
    localStorage.setItem(wishKey, JSON.stringify(wish));
    renderCart();
  };

  const money = (n) => '$' + Number(n).toFixed(0);

  function renderCart() {
    $$('[data-cart-count]').forEach((el) => { el.textContent = cart.reduce((s, i) => s + i.qty, 0); });
    $$('[data-wish-count]').forEach((el) => { el.textContent = wish.length; });
    const box = $('[data-cart-items]');
    const total = $('[data-cart-total]');
    if (!box) return;
    if (!cart.length) {
      box.innerHTML = '<p class="empty-cart">Your bag is empty.</p>';
      if (total) total.textContent = '$0';
      return;
    }
    box.innerHTML = cart.map((i, idx) => `
      <div class="cart-line">
        <div><strong>${i.name}</strong><div>${money(i.price)} × ${i.qty}</div></div>
        <button type="button" aria-label="Remove" data-remove-cart="${idx}">&times;</button>
      </div>`).join('');
    if (total) total.textContent = money(cart.reduce((s, i) => s + i.price * i.qty, 0));
  }

  function openCart(open = true) {
    $('#cartDrawer')?.classList.toggle('open', open);
    $('.cart-overlay')?.classList.toggle('open', open);
    $('#cartDrawer')?.setAttribute('aria-hidden', open ? 'false' : 'true');
  }

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-cart-toggle]')) openCart(true);
    if (e.target.closest('[data-cart-close]')) openCart(false);

    const addBtn = e.target.closest('[data-add-cart]');
    if (addBtn) {
      const card = addBtn.closest('[data-product-id], .product-detail, body');
      const name = addBtn.dataset.name || card?.dataset?.name || $('.product-title', card)?.textContent?.trim() || 'Gift Item';
      const price = Number(addBtn.dataset.price || card?.dataset?.price || 49);
      const existing = cart.find((i) => i.name === name);
      if (existing) existing.qty += 1;
      else cart.push({ name, price, qty: 1 });
      save();
      openCart(true);
    }

    const wishBtn = e.target.closest('[data-add-wish], [data-wishlist]');
    if (wishBtn && wishBtn.hasAttribute('data-add-wish')) {
      const card = wishBtn.closest('[data-product-id]');
      const name = card?.dataset?.name || 'Gift';
      if (!wish.includes(name)) wish.push(name);
      save();
      wishBtn.querySelector('i')?.classList.replace('fa-regular', 'fa-solid');
    }

    const rm = e.target.closest('[data-remove-cart]');
    if (rm) {
      cart.splice(Number(rm.dataset.removeCart), 1);
      save();
    }

    const qv = e.target.closest('[data-quick-view]');
    if (qv) {
      const card = qv.closest('[data-product-id]');
      const body = $('[data-qv-body]');
      if (card && body && window.bootstrap) {
        body.innerHTML = `
          <div class="row g-3">
            <div class="col-md-5"><img src="${card.querySelector('img')?.src || ''}" alt="" class="img-fluid rounded"></div>
            <div class="col-md-7">
              <h3>${card.dataset.name}</h3>
              <p class="price">${money(card.dataset.price)}</p>
              <p>Quick preview of this Giftora demo product. Add to bag to try the cart UI.</p>
              <button class="btn btn-primary" data-add-cart data-name="${card.dataset.name}" data-price="${card.dataset.price}">Add to Cart</button>
            </div>
          </div>`;
        new bootstrap.Modal('#quickViewModal').show();
      }
    }

    const thumb = e.target.closest('[data-thumb]');
    if (thumb) {
      const main = $('#mainProductImg');
      if (main) main.src = thumb.dataset.thumb;
    }
  });

  renderCart();

  // Countdown
  $$('[data-countdown]').forEach((el) => {
    const end = new Date(el.dataset.countdown).getTime();
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      const set = (sel, val) => { const n = $(sel, el); if (n) n.textContent = String(val).padStart(2, '0'); };
      set('[data-days]', d); set('[data-hours]', h); set('[data-mins]', m); set('[data-secs]', s);
    };
    tick();
    setInterval(tick, 1000);
  });

  // Newsletter / contact demo submit
  $$('[data-newsletter], [data-contact]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thanks! This is a demo form — connect your backend or form service to go live.');
      form.reset();
    });
  });

  // Fest chips (visual only)
  $$('.fest-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      $$('.fest-chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });
})();
"""


def root_landing():
    cards = ""
    for i, d in enumerate(DEMOS, 1):
        cards += f"""
        <div class="col-md-6 col-xl-4" data-aos="fade-up" data-aos-delay="{(i % 3) * 80}">
          <article class="demo-card">
            <div class="demo-preview" style="background-image:url('{img(d["id"]+"-preview", 900, 700)}')">
              <span class="demo-num">0{i if i < 10 else i}</span>
              <div class="demo-overlay">
                <a class="btn btn-light" href="{d['id']}/index.html" target="_blank" rel="noopener">Live Preview</a>
              </div>
            </div>
            <div class="demo-meta">
              <h3>{d['name']}</h3>
              <p>{d['tagline']} · {d['brand']}</p>
              <div class="swatches">
                <i style="background:{d['colors']['primary']}"></i>
                <i style="background:{d['colors']['secondary']}"></i>
                <i style="background:{d['colors']['accent']}"></i>
                <i style="background:{d['colors']['bg']}; border:1px solid #ddd"></i>
              </div>
            </div>
          </article>
        </div>"""

    features = [
        ("10 Unique Demos", "Completely different layouts, palettes & typography"),
        ("80+ HTML Pages", "Shop, product, blog, FAQ, contact & more per demo"),
        ("Bootstrap 5", "Modern responsive grid & components"),
        ("Swiper + AOS", "Premium sliders & scroll animations"),
        ("Demo Cart & Wishlist", "Quick view, badges, countdown, newsletter"),
        ("SEO & Accessible", "Semantic HTML, lazy images, ARIA labels"),
    ]
    feat_html = "".join(
        f'<div class="col-md-6 col-lg-4" data-aos="fade-up"><div class="feature-tile"><h3>{t}</h3><p>{d}</p></div></div>'
        for t, d in features
    )

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Giftora Premium — ThemeForest-quality gift shop HTML template with 10 unique homepage demos.">
  <meta name="keywords" content="gift shop html template, themeforest, ecommerce, bootstrap 5, Giftora">
  <title>Giftora Premium HTML Template — 10 Gift Shop Demos</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link href="{CDN['bootstrap_css']}" rel="stylesheet">
  <link href="{CDN['fa']}" rel="stylesheet">
  <link href="{CDN['aos_css']}" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/landing.css">
</head>
<body>
  <div class="preloader" id="preloader"><div class="preloader-inner"><span>G</span><p>Giftora Premium</p></div></div>
  <header class="landing-header sticky-top">
    <div class="container d-flex align-items-center justify-content-between py-3">
      <a class="logo" href="index.html">Giftora <em>Premium</em></a>
      <nav class="d-none d-md-flex gap-4">
        <a href="#demos">Demos</a>
        <a href="#features">Features</a>
        <a href="#docs">Docs</a>
        <a href="documentation/index.html">Documentation</a>
      </nav>
      <a class="btn btn-buy" href="#purchase">Purchase</a>
    </div>
  </header>

  <section class="landing-hero">
    <div class="hero-glow"></div>
    <div class="container position-relative">
      <div class="row align-items-center g-5">
        <div class="col-lg-6" data-aos="fade-right">
          <p class="eyebrow">ThemeForest-Quality HTML Template</p>
          <h1>Giftora Premium</h1>
          <p class="lead">A complete gift shop HTML package with <strong>10 uniquely designed homepage demos</strong>, built with Bootstrap 5, Swiper.js &amp; AOS — no frameworks, no backend.</p>
          <div class="d-flex gap-2 flex-wrap">
            <a href="#demos" class="btn btn-light btn-lg">View All Demos</a>
            <a href="documentation/index.html" class="btn btn-outline-light btn-lg">Documentation</a>
          </div>
          <ul class="hero-meta">
            <li><i class="fa-solid fa-check"></i> 10 demos · 80+ pages</li>
            <li><i class="fa-solid fa-check"></i> HTML5 · CSS3 · Bootstrap 5</li>
            <li><i class="fa-solid fa-check"></i> Vanilla JS · Font Awesome</li>
          </ul>
        </div>
        <div class="col-lg-6" data-aos="fade-left">
          <div class="hero-mosaic">
            <img src="{img('giftora-land-1', 700, 500)}" alt="Giftora preview" loading="eager">
            <img src="{img('giftora-land-2', 500, 400)}" alt="Giftora preview 2" loading="lazy">
            <img src="{img('giftora-land-3', 500, 400)}" alt="Giftora preview 3" loading="lazy">
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section" id="features">
    <div class="container">
      <div class="text-center mb-5" data-aos="fade-up">
        <p class="eyebrow">Why Giftora</p>
        <h2>Built Like A Premium Marketplace Template</h2>
      </div>
      <div class="row g-4">{feat_html}</div>
    </div>
  </section>

  <section class="section demos-section" id="demos">
    <div class="container">
      <div class="text-center mb-5" data-aos="fade-up">
        <p class="eyebrow">10 Homepages</p>
        <h2>Choose Your Gift Shop Style</h2>
        <p>Every demo has a different layout, palette, type system, header, hero, product cards &amp; footer.</p>
      </div>
      <div class="row g-4">{cards}</div>
    </div>
  </section>

  <section class="section" id="docs">
    <div class="container">
      <div class="docs-band" data-aos="fade-up">
        <div>
          <h2>Documentation Included</h2>
          <p>Installation, structure, customization tips and feature checklist.</p>
        </div>
        <a class="btn btn-light" href="documentation/index.html">Open Docs</a>
      </div>
    </div>
  </section>

  <section class="section purchase-section" id="purchase">
    <div class="container text-center" data-aos="zoom-in">
      <h2>Ready To Launch Your Gift Brand?</h2>
      <p>Open any demo locally — just double-click <code>index.html</code>. Replace placeholders with your products and go live.</p>
      <a href="#demos" class="btn btn-light btn-lg">Browse Demos</a>
    </div>
  </section>

  <footer class="landing-footer">
    <div class="container d-flex justify-content-between flex-wrap gap-3 py-4">
      <p class="mb-0">&copy; 2026 Giftora Premium HTML Template</p>
      <p class="mb-0">HTML5 · Bootstrap 5 · Vanilla JS</p>
    </div>
  </footer>

  <script src="{CDN['bootstrap_js']}"></script>
  <script src="{CDN['aos_js']}"></script>
  <script src="assets/js/landing.js"></script>
</body>
</html>"""


LANDING_CSS = """
:root {
  --ink: #0b1020;
  --paper: #f6f3ee;
  --gold: #c6a75e;
  --teal: #1f8a7a;
  --card: #ffffff;
  --font-d: 'Syne', sans-serif;
  --font-b: 'Manrope', sans-serif;
}
* { box-sizing: border-box; }
body { margin: 0; font-family: var(--font-b); background: var(--paper); color: var(--ink); }
h1,h2,h3,.logo { font-family: var(--font-d); }
a { color: inherit; text-decoration: none; }
.section { padding: 5rem 0; }
.eyebrow { text-transform: uppercase; letter-spacing: .2em; font-size: .75rem; color: var(--teal); font-weight: 700; }
.preloader { position: fixed; inset: 0; background: var(--ink); color: #fff; display: grid; place-items: center; z-index: 9999; transition: .4s; }
.preloader.hide { opacity: 0; visibility: hidden; }
.preloader span { width: 64px; height: 64px; border: 2px solid var(--gold); border-radius: 50%; display: grid; place-items: center; margin: 0 auto .75rem; font-family: var(--font-d); font-size: 1.5rem; }
.landing-header { background: rgba(246,243,238,.85); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(0,0,0,.06); }
.logo { font-size: 1.35rem; font-weight: 800; }
.logo em { font-style: normal; color: var(--teal); }
.landing-header nav a { font-weight: 600; opacity: .75; }
.landing-header nav a:hover { opacity: 1; color: var(--teal); }
.btn-buy, .purchase-section .btn, .docs-band .btn { background: var(--ink); color: #fff; border-radius: 999px; padding: .65rem 1.25rem; font-weight: 700; }
.btn-buy:hover { background: var(--teal); color: #fff; }
.landing-hero {
  position: relative; overflow: hidden; color: #fff; padding: 6rem 0 5rem;
  background:
    linear-gradient(135deg, rgba(11,16,32,.92), rgba(31,138,122,.75)),
    url('https://picsum.photos/seed/giftora-hero-bg/1920/1100') center/cover;
}
.hero-glow {
  position: absolute; width: 480px; height: 480px; border-radius: 50%;
  background: radial-gradient(circle, rgba(198,167,94,.35), transparent 70%);
  top: -80px; right: -60px; pointer-events: none;
}
.landing-hero h1 { font-size: clamp(2.8rem, 7vw, 5rem); line-height: 1; margin: .5rem 0 1rem; }
.landing-hero .lead { font-size: 1.1rem; opacity: .9; max-width: 34rem; }
.hero-meta { list-style: none; padding: 0; margin: 2rem 0 0; display: flex; flex-wrap: wrap; gap: 1rem 1.5rem; }
.hero-meta i { color: var(--gold); margin-right: .35rem; }
.hero-mosaic { display: grid; grid-template-columns: 1.4fr 1fr; gap: .75rem; }
.hero-mosaic img { border-radius: 1rem; width: 100%; object-fit: cover; box-shadow: 0 30px 60px rgba(0,0,0,.35); }
.hero-mosaic img:first-child { grid-row: span 2; height: 100%; min-height: 360px; }
.feature-tile {
  background: var(--card); border-radius: 1.25rem; padding: 1.75rem; height: 100%;
  border: 1px solid rgba(0,0,0,.05); box-shadow: 0 10px 30px rgba(11,16,32,.04);
}
.feature-tile h3 { font-size: 1.2rem; margin-bottom: .5rem; }
.demos-section { background: #efeae2; }
.demo-card {
  background: var(--card); border-radius: 1.25rem; overflow: hidden; height: 100%;
  border: 1px solid rgba(0,0,0,.05); transition: transform .3s ease, box-shadow .3s ease;
}
.demo-card:hover { transform: translateY(-8px); box-shadow: 0 24px 50px rgba(11,16,32,.12); }
.demo-preview {
  aspect-ratio: 4/3; background-size: cover; background-position: center; position: relative;
}
.demo-num {
  position: absolute; top: 1rem; left: 1rem; background: rgba(11,16,32,.8); color: #fff;
  font-family: var(--font-d); font-weight: 700; padding: .35rem .65rem; border-radius: .5rem;
}
.demo-overlay {
  position: absolute; inset: 0; background: rgba(11,16,32,.45); display: grid; place-items: center;
  opacity: 0; transition: .3s;
}
.demo-card:hover .demo-overlay { opacity: 1; }
.demo-meta { padding: 1.25rem 1.35rem 1.5rem; }
.demo-meta h3 { font-size: 1.2rem; margin-bottom: .25rem; }
.demo-meta p { color: #667; margin-bottom: .75rem; }
.swatches { display: flex; gap: .4rem; }
.swatches i { width: 16px; height: 16px; border-radius: 50%; display: inline-block; }
.docs-band {
  background: var(--ink); color: #fff; border-radius: 1.5rem; padding: 2.5rem;
  display: flex; justify-content: space-between; align-items: center; gap: 1.5rem; flex-wrap: wrap;
}
.purchase-section {
  background:
    linear-gradient(135deg, rgba(31,138,122,.95), rgba(11,16,32,.92)),
    url('https://picsum.photos/seed/giftora-cta/1600/700') center/cover;
  color: #fff;
}
.purchase-section code { background: rgba(255,255,255,.15); padding: .15rem .4rem; border-radius: .3rem; }
.landing-footer { background: var(--ink); color: rgba(255,255,255,.7); }
@media (max-width: 767.98px) {
  .hero-mosaic { grid-template-columns: 1fr 1fr; }
  .hero-mosaic img:first-child { grid-row: auto; min-height: 200px; }
}
"""

LANDING_JS = """
window.addEventListener('load', () => {
  document.getElementById('preloader')?.classList.add('hide');
});
if (window.AOS) AOS.init({ duration: 700, once: true });
"""

DOCS = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Giftora Premium — Documentation</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700&family=Syne:wght@700&display=swap" rel="stylesheet">
  <style>
    body { font-family: Manrope, sans-serif; background: #f6f3ee; color: #0b1020; }
    h1,h2,h3 { font-family: Syne, sans-serif; }
    .docs-wrap { max-width: 900px; margin: 0 auto; padding: 3rem 1.25rem 5rem; }
    code, pre { background: #0b1020; color: #e8f5f2; border-radius: .5rem; }
    pre { padding: 1rem; overflow: auto; }
    .card-soft { background: #fff; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1rem; border: 1px solid rgba(0,0,0,.06); }
    a { color: #1f8a7a; }
  </style>
</head>
<body>
  <div class="docs-wrap">
    <p><a href="../index.html">&larr; Back to Giftora Landing</a></p>
    <h1>Giftora Premium Documentation</h1>
    <p class="lead">ThemeForest-quality gift shop HTML template with 10 unique demos.</p>

    <div class="card-soft">
      <h2>1. Getting Started</h2>
      <ol>
        <li>Unzip / open the <code>giftora-premium</code> folder.</li>
        <li>Open <code>index.html</code> in a modern browser (Chrome, Firefox, Edge, Safari).</li>
        <li>Click any <strong>Live Preview</strong> card to enter a demo.</li>
      </ol>
      <p>No build step or server is required for local preview. For best results with some browsers’ local file rules, you may serve the folder with a simple static server:</p>
      <pre>npx serve .
# or
python3 -m http.server 8080</pre>
    </div>

    <div class="card-soft">
      <h2>2. Folder Structure</h2>
      <pre>giftora-premium/
  index.html                 # Root landing / demo switcher
  assets/                    # Landing CSS &amp; JS
  documentation/             # This documentation
  demo-01-luxury/ … demo-10-modern/
    index.html shop.html product.html about.html
    gallery.html blog.html faq.html contact.html
    assets/css/style.css
    assets/js/main.js
    assets/images/ assets/fonts/</pre>
    </div>

    <div class="card-soft">
      <h2>3. Technologies</h2>
      <ul>
        <li>HTML5 · CSS3 · Bootstrap 5.3</li>
        <li>Vanilla JavaScript (ES6)</li>
        <li>Font Awesome 6 · Swiper.js 11 · AOS 2.3</li>
        <li>Google Fonts (unique per demo)</li>
        <li>Placeholder images: picsum.photos / placehold.co</li>
      </ul>
    </div>

    <div class="card-soft">
      <h2>4. Demos</h2>
      <ol>
        <li><strong>Luxury</strong> — Black &amp; gold glassmorphism boutique</li>
        <li><strong>Flower</strong> — Pastel floral minimal shop</li>
        <li><strong>Personalized</strong> — Custom mugs, frames, LED gifts</li>
        <li><strong>Corporate</strong> — Blue B2B gifting &amp; bulk orders</li>
        <li><strong>Chocolate</strong> — Dark cocoa luxury sweets</li>
        <li><strong>Wedding</strong> — White &amp; gold romantic collections</li>
        <li><strong>Birthday</strong> — Bright party &amp; kids gifts</li>
        <li><strong>Festival</strong> — Seasonal Diwali/Christmas/Eid shop</li>
        <li><strong>Handmade</strong> — Rustic eco craft store</li>
        <li><strong>Modern</strong> — Marketplace with mega search</li>
      </ol>
    </div>

    <div class="card-soft">
      <h2>5. Customization</h2>
      <ul>
        <li>Colors &amp; type: edit CSS variables in each demo’s <code>assets/css/style.css</code> (<code>:root</code>).</li>
        <li>Content: replace text/images in the HTML files.</li>
        <li>Cart/wishlist: demo state is stored in <code>localStorage</code> via <code>assets/js/main.js</code>.</li>
        <li>Forms: newsletter &amp; contact show a demo alert — wire to your endpoint or Formspree.</li>
      </ul>
    </div>

    <div class="card-soft">
      <h2>6. Feature Checklist</h2>
      <p>Sticky header, mega menu, hero slider, categories, best sellers, new arrivals, trending, product cards, wishlist, quick view, demo cart, badges, countdown/flash sale, testimonials, brand logos, Instagram gallery, newsletter, FAQ, contact + map placeholder, blog, back-to-top, loading screen, WhatsApp float, dark footer, AOS animations, hover effects, ripple buttons, glass cards, lazy loading, SEO meta, semantic &amp; accessible markup.</p>
    </div>

    <div class="card-soft">
      <h2>7. Credits</h2>
      <ul>
        <li>Bootstrap, Font Awesome, Swiper, AOS (CDN)</li>
        <li>Images: <a href="https://picsum.photos" target="_blank" rel="noopener">picsum.photos</a>, <a href="https://placehold.co" target="_blank" rel="noopener">placehold.co</a></li>
        <li>Fonts: Google Fonts</li>
      </ul>
      <p class="mb-0">&copy; 2026 Giftora Premium HTML Template</p>
    </div>
  </div>
</body>
</html>
"""


def main():
    print("Generating Giftora Premium…")
    for demo in DEMOS:
        folder = ROOT / demo["id"]
        write(folder / "assets" / "css" / "style.css", css_for_demo(demo))
        write(folder / "assets" / "js" / "main.js", SHARED_JS)
        (folder / "assets" / "images" / ".gitkeep").write_text("")
        (folder / "assets" / "fonts" / ".gitkeep").write_text("")
        for page, builder in PAGE_BUILDERS.items():
            write(folder / f"{page}.html", builder(demo))
            print(f"  ✓ {demo['id']}/{page}.html")

    write(ROOT / "index.html", root_landing())
    write(ROOT / "assets" / "css" / "landing.css", LANDING_CSS)
    write(ROOT / "assets" / "js" / "landing.js", LANDING_JS)
    write(ROOT / "documentation" / "index.html", DOCS)
    write(ROOT / "README.md", """# Giftora Premium HTML Template

ThemeForest-quality gift shop HTML template with **10 unique homepage demos**.

## Quick Start

Open `index.html` in your browser, or:

```bash
cd giftora-premium
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Demos

| Demo | Theme |
|------|-------|
| demo-01-luxury | Black & Gold Luxury Boutique |
| demo-02-flower | Pastel Flower & Bouquet Shop |
| demo-03-personalized | Custom / Photo Gifts |
| demo-04-corporate | Blue Corporate Gifting |
| demo-05-chocolate | Dark Chocolate Store |
| demo-06-wedding | White & Gold Wedding Gifts |
| demo-07-birthday | Bright Birthday Party Store |
| demo-08-festival | Seasonal Festival Gifts |
| demo-09-handmade | Rustic Handmade Crafts |
| demo-10-modern | Modern Gift Marketplace |

Each demo includes: Home, Shop, Product, About, Gallery, Blog, FAQ, Contact.

## Stack

HTML5 · CSS3 · Bootstrap 5 · Vanilla JS · Font Awesome · Swiper.js · AOS

See `documentation/index.html` for full docs.
""")
    print("Done.")


if __name__ == "__main__":
    main()
