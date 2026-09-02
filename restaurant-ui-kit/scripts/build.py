#!/usr/bin/env python3
"""Restaurant UI Kit — generate demos, pages, landing, SEO, docs."""
from __future__ import annotations

import json
import re
from pathlib import Path

from config import CDN, DEMOS, IMG, PAGES, ROOT

ASSET_CSS = "../../assets/css/main.css"
ASSET_JS = "../../assets/js/main.js"
ASSET_CSS_MIN = "../../assets/css/main.min.css"
ASSET_JS_MIN = "../../assets/js/main.min.js"


def asset_prefix(depth: int) -> str:
    return "../" * depth


def fonts_link(demo: dict) -> str:
    f = demo["fonts"]
    if f.startswith("family=") or "&family=" in f:
        # Already partially formatted (e.g. "Foo&family=Bar:wght@400")
        if not f.startswith("family="):
            f = "family=" + f
        return f"https://fonts.googleapis.com/css2?{f}&display=swap"
    parts = []
    for chunk in f.split("|"):
        if ":" in chunk:
            name, weights = chunk.split(":", 1)
            parts.append(f"family={name}:{weights}")
        else:
            parts.append(f"family={chunk}")
    return "https://fonts.googleapis.com/css2?" + "&".join(parts) + "&display=swap"


def head(title: str, demo: dict, depth: int = 2, desc: str | None = None, schema: str | None = None) -> str:
    p = asset_prefix(depth)
    d = desc or f"{demo['brand']} — {demo['tagline']}. Premium restaurant template by Restaurant UI Kit."
    canon = f"https://restaurant-uikit.example/{demo['id']}/"
    return f"""<!DOCTYPE html>
<html lang="en" data-demo="{demo['id']}" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} | {demo['brand']}</title>
  <meta name="description" content="{d}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="{canon}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="{title} | {demo['brand']}">
  <meta property="og:description" content="{d}">
  <meta property="og:image" content="{demo['hero_img']}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{title} | {demo['brand']}">
  <meta name="theme-color" content="var(--rui-primary)">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="{fonts_link(demo)}" rel="stylesheet">
  <link href="{CDN['bootstrap_css']}" rel="stylesheet">
  <link href="{CDN['bi']}" rel="stylesheet">
  <link href="{CDN['fa']}" rel="stylesheet">
  <link href="{CDN['aos_css']}" rel="stylesheet">
  <link href="{CDN['swiper_css']}" rel="stylesheet">
  <link href="{CDN['glightbox_css']}" rel="stylesheet">
  <link href="{CDN['lenis_css']}" rel="stylesheet">
  <link href="{p}assets/css/main.css" rel="stylesheet">
  {schema or restaurant_schema(demo)}
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<div class="preloader" aria-hidden="true"><div class="loader-brand">{demo['brand']}</div></div>
"""


def restaurant_schema(demo: dict) -> str:
    data = {
        "@context": "https://schema.org",
        "@type": "Restaurant",
        "name": demo["brand"],
        "description": demo["tagline"],
        "servesCuisine": demo["name"],
        "url": f"https://restaurant-uikit.example/{demo['id']}/",
        "image": demo["hero_img"],
        "priceRange": "$$",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "128 Culinary Avenue",
            "addressLocality": "New York",
            "addressRegion": "NY",
            "postalCode": "10001",
            "addressCountry": "US",
        },
        "telephone": "+1-212-555-0148",
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                "opens": "11:00",
                "closes": "23:00",
            }
        ],
    }
    return f'<script type="application/ld+json">{json.dumps(data)}</script>'


def scripts(depth: int = 2) -> str:
    p = asset_prefix(depth)
    return f"""
<script src="{CDN['bootstrap_js']}" defer></script>
<script src="{CDN['aos_js']}" defer></script>
<script src="{CDN['swiper_js']}" defer></script>
<script src="{CDN['gsap']}" defer></script>
<script src="{CDN['scrolltrigger']}" defer></script>
<script src="{CDN['glightbox_js']}" defer></script>
<script src="{CDN['isotope']}" defer></script>
<script src="{CDN['countup']}" defer></script>
<script src="{CDN['typed']}" defer></script>
<script src="{CDN['lenis_js']}" defer></script>
<script src="{CDN['chart']}" defer></script>
<script src="{p}assets/js/main.js" defer></script>
"""


def nav_links(demo: dict, depth: int = 2, active: str = "home") -> str:
    p = asset_prefix(depth)
    base = f"{p}demos/{demo['id']}/" if depth != 2 else ""
    # When inside demo folder depth=0 for demo pages... we'll use relative
    items = [
        ("index.html", "Home", "home"),
        ("menu.html", "Menu", "menu"),
        ("about.html", "About", "about"),
        ("reservation.html", "Reservation", "reservation"),
        ("gallery.html", "Gallery", "gallery"),
        ("blog-grid.html", "Blog", "blog"),
        ("contact.html", "Contact", "contact"),
    ]
    # For pages in demos folder, links are local
    lis = []
    for href, label, key in items:
        cls = ' class="active"' if key == active else ""
        lis.append(f'<li><a href="{href}"{cls}>{label}</a></li>')
    return "\n".join(lis)


def header(demo: dict, depth: int = 0, active: str = "home") -> str:
    style = demo["nav_style"]
    brand = demo["brand"]
    short = brand.split()[0]
    links = nav_links(demo, depth, active)

    if style == "transparent-centered":
        return f"""
<header class="site-header header-transparent">
  <div class="announcement-bar">Private dining available · <a href="reservation.html">Reserve tonight</a></div>
  <div class="container-rui navbar-rui">
    <button class="icon-btn nav-toggle" aria-label="Open menu" aria-expanded="false"><i class="bi bi-list"></i></button>
    <ul class="nav-links">{links}</ul>
    <a class="brand" href="index.html">{brand}</a>
    <div class="header-actions">
      <button class="icon-btn" data-theme-toggle aria-label="Toggle theme"><i class="bi bi-sun"></i></button>
      <a class="btn-rui btn-sm" href="reservation.html">Reserve</a>
    </div>
  </div>
</header>
{mobile_nav(demo)}
"""
    if style == "solid-split":
        return f"""
<header class="site-header" style="background:var(--rui-surface);border-bottom:1px solid var(--rui-border)">
  <div class="container-rui navbar-rui">
    <a class="brand" href="index.html">{brand}</a>
    <ul class="nav-links">{links}</ul>
    <div class="header-actions">
      <button class="icon-btn" data-theme-toggle aria-label="Toggle theme"><i class="bi bi-moon-stars"></i></button>
      <a class="btn-rui" href="reservation.html">Book a Table</a>
    </div>
    <button class="icon-btn nav-toggle" aria-label="Open menu"><i class="bi bi-list"></i></button>
  </div>
</header>
{mobile_nav(demo)}
"""
    if style == "minimal-side":
        return f"""
<header class="site-header header-transparent">
  <div class="container-rui navbar-rui">
    <a class="brand" href="index.html" style="letter-spacing:0.2em;font-size:1.2rem">{short.upper()}</a>
    <ul class="nav-links">{links}</ul>
    <div class="header-actions">
      <button class="icon-btn" data-theme-toggle><i class="bi bi-sun"></i></button>
      <a class="btn-rui btn-outline btn-sm" href="menu.html">Omakase</a>
    </div>
    <button class="icon-btn nav-toggle" aria-label="Open menu"><i class="bi bi-list"></i></button>
  </div>
</header>
{mobile_nav(demo)}
"""
    if style == "bold-color":
        return f"""
<header class="site-header" style="background:var(--rui-primary)">
  <div class="container-rui navbar-rui">
    <a class="brand" href="index.html" style="color:#111">{brand}</a>
    <ul class="nav-links">{links.replace('var(--rui-text)', '#111')}</ul>
    <div class="header-actions">
      <a class="btn-rui btn-dark" href="reservation.html">¡Reservar!</a>
      <button class="icon-btn nav-toggle" aria-label="Open menu" style="border-color:#111;color:#111"><i class="bi bi-list"></i></button>
    </div>
  </div>
</header>
{mobile_nav(demo)}
"""
    if style == "app-bar":
        return f"""
<header class="site-header" style="background:var(--rui-accent);color:#fff">
  <div class="container-rui navbar-rui">
    <a class="brand" href="index.html" style="color:#fff;font-family:var(--rui-font-display);font-size:2rem">{brand.upper()}</a>
    <ul class="nav-links">{links}</ul>
    <div class="header-actions">
      <a class="btn-rui" href="takeaway.html">Order Now</a>
      <button class="icon-btn nav-toggle" aria-label="Open menu"><i class="bi bi-list"></i></button>
    </div>
  </div>
</header>
{mobile_nav(demo)}
"""
    # default ornate / industrial / wave / soft / warm
    return f"""
<header class="site-header">
  <div class="container-rui navbar-rui">
    <a class="brand" href="index.html">{brand}</a>
    <ul class="nav-links">{links}</ul>
    <div class="header-actions">
      <button class="icon-btn" data-theme-toggle aria-label="Toggle theme"><i class="bi bi-moon-stars"></i></button>
      <a class="btn-rui" href="reservation.html">Reserve</a>
      <button class="icon-btn nav-toggle" aria-label="Open menu"><i class="bi bi-list"></i></button>
    </div>
  </div>
</header>
{mobile_nav(demo)}
"""


def mobile_nav(demo: dict) -> str:
    return f"""
<nav class="mobile-nav" aria-label="Mobile">
  <div style="display:flex;justify-content:space-between;align-items:center">
    <strong class="brand">{demo['brand']}</strong>
    <button class="icon-btn mobile-nav-close" aria-label="Close menu"><i class="bi bi-x-lg"></i></button>
  </div>
  <ul class="mobile-links">
    <li><a href="index.html">Home</a></li>
    <li><a href="menu.html">Menu</a></li>
    <li><a href="about.html">About</a></li>
    <li><a href="reservation.html">Reservation</a></li>
    <li><a href="gallery.html">Gallery</a></li>
    <li><a href="contact.html">Contact</a></li>
    <li><a href="../../pages/components-showcase.html">UI Components</a></li>
  </ul>
</nav>
"""


def footer(demo: dict) -> str:
    style = demo["footer_style"]
    brand = demo["brand"]
    if style == "centered-luxury":
        return f"""
<footer class="site-footer" style="text-align:center">
  <div class="container-rui">
    <div class="brand">{brand}</div>
    <p style="max-width:28rem;margin:0 auto 1.5rem">An intimate fine-dining experience crafted for discerning guests.</p>
    <div class="socials" style="justify-content:center;margin-bottom:2rem">
      <a href="#" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
      <a href="#" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
      <a href="#" aria-label="X"><i class="bi bi-twitter-x"></i></a>
    </div>
    <div class="footer-bottom" style="justify-content:center">
      <span>© 2026 {brand}. Restaurant UI Kit.</span>
    </div>
  </div>
</footer>
<a class="whatsapp-float" href="https://wa.me/12125550148" aria-label="WhatsApp"><i class="bi bi-whatsapp"></i></a>
"""
    if style == "minimal-zen":
        return f"""
<footer class="site-footer">
  <div class="container-rui" style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:2rem;padding-bottom:2rem">
    <div><div class="brand">{brand}</div><p>静 · Season · Craft</p></div>
    <div><h6>Visit</h6><p>12 Sakura Lane · Reservations only</p></div>
    <div class="socials">
      <a href="#" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
    </div>
  </div>
  <div class="container-rui footer-bottom"><span>© 2026 {brand}</span></div>
</footer>
"""
    # multi-column default
    return f"""
<footer class="site-footer">
  <div class="container-rui footer-grid">
    <div>
      <div class="brand">{brand}</div>
      <p>{demo['tagline']}</p>
      <div class="socials" style="margin-top:1rem">
        <a href="#" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
        <a href="#" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
        <a href="#" aria-label="YouTube"><i class="bi bi-youtube"></i></a>
      </div>
    </div>
    <div>
      <h6>Explore</h6>
      <ul>
        <li><a href="menu.html">Menu</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="gallery.html">Gallery</a></li>
        <li><a href="events.html">Events</a></li>
      </ul>
    </div>
    <div>
      <h6>Visit</h6>
      <ul>
        <li><a href="location.html">Location</a></li>
        <li><a href="reservation.html">Reservations</a></li>
        <li><a href="contact.html">Contact</a></li>
        <li><a href="career.html">Careers</a></li>
      </ul>
    </div>
    <div>
      <h6>Hours</h6>
      <ul class="hours-list">
        <li><span>Mon–Thu</span><strong>11–22</strong></li>
        <li><span>Fri–Sat</span><strong>11–23</strong></li>
        <li><span>Sun</span><strong>10–21</strong></li>
      </ul>
    </div>
  </div>
  <div class="container-rui footer-bottom">
    <span>© 2026 {brand}. All rights reserved.</span>
    <span><a href="privacy-policy.html">Privacy</a> · <a href="terms.html">Terms</a></span>
  </div>
</footer>
<a class="whatsapp-float" href="https://wa.me/12125550148" aria-label="WhatsApp"><i class="bi bi-whatsapp"></i></a>
"""


def menu_cards(demo: dict, limit: int = 8) -> str:
    cards = []
    imgs = [demo["dish_img"], IMG["pasta"], IMG["sushi"], IMG["steak"], IMG["salad"], IMG["burger"], IMG["pastry"], IMG["dessert"]]
    for i, (name, price, cat, diet, rating) in enumerate(demo["menu"][:limit]):
        badge = "badge-veg" if diet == "veg" else "badge-spicy" if i % 3 == 0 else "badge-new" if i % 4 == 0 else ""
        badge_txt = "Veg" if diet == "veg" else "Spicy" if i % 3 == 0 else "New" if i % 4 == 0 else "Chef"
        img = imgs[i % len(imgs)]
        cards.append(f"""
        <div class="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="{i*50}">
          <article class="card-rui food-card hover-lift" data-menu-item data-category="{cat} {diet}" data-name="{name.lower()}" data-price="{price}" data-rating="{rating}">
            <div class="card-media">
              <span class="badge-rui {badge or 'badge-outline'}">{badge_txt}</span>
              <div class="quick-actions">
                <button class="action-btn" data-quick-view data-title="{name}" data-price="${price}" data-desc="Signature {demo['name']} dish." data-img="{img}" aria-label="Quick view"><i class="bi bi-eye"></i></button>
                <button class="action-btn" aria-label="Favorite"><i class="bi bi-heart"></i></button>
              </div>
              <img src="{img}" alt="{name}" loading="lazy" width="600" height="450">
            </div>
            <div class="card-body">
              <h3 style="font-size:1.25rem;margin-bottom:0.35rem">{name}</h3>
              <div class="card-meta">
                <span><i class="bi bi-star-fill" style="color:var(--rui-primary)"></i> {rating}</span>
                <span class="price">${price}</span>
              </div>
            </div>
          </article>
        </div>""")
    return "\n".join(cards)


def stats_html(demo: dict) -> str:
    items = []
    for n, label in demo["stats"]:
        items.append(f'<div class="stat-item"><div class="stat-num" data-count="{n}">0</div><div class="stat-label">{label}</div></div>')
    return f'<div class="stats-grid">{"".join(items)}</div>'


def chef_cards(demo: dict) -> str:
    imgs = [IMG["chef1"], IMG["chef2"], IMG["chef3"]]
    cards = []
    for i, (name, role) in enumerate(demo["chefs"]):
        cards.append(f"""
        <div class="col-md-4" data-aos="fade-up" data-aos-delay="{i*100}">
          <article class="chef-card">
            <div class="chef-photo">
              <img src="{imgs[i]}" alt="{name}" loading="lazy">
              <div class="socials"><a href="#" aria-label="Instagram"><i class="bi bi-instagram"></i></a></div>
            </div>
            <h4>{name}</h4>
            <div class="role">{role}</div>
          </article>
        </div>""")
    return "\n".join(cards)


def testimonials() -> str:
    quotes = [
        ("An unforgettable evening — every plate was art.", "Ava Morgan", "Food Critic"),
        ("Warm service and flavors that linger.", "James Cole", "Regular Guest"),
        ("The tasting menu is worth every visit.", "Priya Nair", "Travel Blogger"),
    ]
    slides = []
    for q, n, r in quotes:
        slides.append(f"""
        <div class="swiper-slide">
          <div class="testimonial-card">
            <div class="stars">★★★★★</div>
            <p class="quote">“{q}”</p>
            <div class="author"><img src="{IMG['avatar']}" alt=""><div><strong>{n}</strong><span>{r}</span></div></div>
          </div>
        </div>""")
    return f"""
    <div class="testimonial-swiper swiper">
      <div class="swiper-wrapper">{''.join(slides)}</div>
      <div class="swiper-pagination"></div>
    </div>"""


def gallery_grid(masonry: bool = False) -> str:
    imgs = [IMG["gallery1"], IMG["gallery2"], IMG["gallery3"], IMG["gallery4"], IMG["gallery5"], IMG["interior"], IMG["wine"], IMG["dessert"]]
    items = []
    for i, img in enumerate(imgs):
        items.append(f"""
        <a class="gallery-item glightbox" href="{img}" data-aos="zoom-in" data-aos-delay="{i*40}">
          <img src="{img}" alt="Gallery {i+1}" loading="lazy">
          <span class="gallery-overlay"><i class="bi bi-plus-lg"></i></span>
        </a>""")
    cls = "gallery-grid masonry" if masonry else "gallery-grid"
    return f'<div class="{cls}">{"".join(items)}</div>'


def quick_view_modal() -> str:
    return """
<div class="modal fade modal-food" id="foodQuickView" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg">
    <div class="modal-content">
      <div class="modal-header"><h5 class="modal-title qv-title">Dish</h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
      <div class="modal-body row g-3">
        <div class="col-md-6"><img class="qv-img w-100 rounded" src="" alt=""></div>
        <div class="col-md-6"><div class="price qv-price mb-2"></div><p class="qv-desc"></p>
          <ul class="list-unstyled small text-muted"><li>Calories: 420 kcal</li><li>Prep: 25 min</li><li>Chef special</li></ul>
          <a href="reservation.html" class="btn-rui mt-2">Reserve to Enjoy</a>
        </div>
      </div>
    </div>
  </div>
</div>
"""


# ---------------------------------------------------------------------------
# Unique home layouts
# ---------------------------------------------------------------------------

def home_luxury(demo: dict) -> str:
    return f"""
<main id="main">
  <section class="hero">
    <div class="hero-swiper swiper" data-effect="fade" style="position:absolute;inset:0">
      <div class="swiper-wrapper">
        <div class="swiper-slide"><div class="hero-media"><img src="{demo['hero_img']}" alt="Dining room"></div></div>
        <div class="swiper-slide"><div class="hero-media"><img src="{IMG['interior']}" alt="Interior"></div></div>
        <div class="swiper-slide"><div class="hero-media"><img src="{demo['dish_img']}" alt="Signature dish"></div></div>
      </div>
    </div>
    <div class="hero-overlay"></div>
    <div class="hero-content text-center" style="margin-inline:auto;text-align:center">
      <p class="hero-eyebrow">Est. Fine Dining</p>
      <h1 class="hero-title" style="max-width:none;margin-inline:auto">{demo['brand']}</h1>
      <p class="hero-text" style="margin-inline:auto">{demo['tagline']} — an evening of quiet luxury.</p>
      <div class="hero-actions" style="justify-content:center">
        <a class="btn-rui magnetic" href="reservation.html">Reserve Your Table</a>
        <a class="btn-rui btn-outline" href="menu.html">View Menu</a>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container-rui">
      <div class="section-title" data-aos="fade-up">
        <span class="eyebrow">Tonight</span>
        <h2>Signature Collection</h2>
        <p>Seasonal tasting plates composed by our executive chef.</p>
      </div>
      <div class="row g-4" data-menu-grid>{menu_cards(demo, 4)}</div>
    </div>
  </section>

  <section class="section" style="background:var(--rui-surface)">
    <div class="container-rui">
      <div class="row align-items-center g-5">
        <div class="col-lg-6" data-aos="fade-right"><img class="w-100 image-reveal" src="{IMG['interior']}" alt="Maison interior" style="border-radius:var(--rui-radius)"></div>
        <div class="col-lg-6" data-aos="fade-left">
          <span class="eyebrow" style="color:var(--rui-primary);letter-spacing:0.28em;text-transform:uppercase;font-size:0.75rem;font-weight:600">Our Story</span>
          <h2>Where silence meets flavor</h2>
          <p>Maison Étoile is a sanctuary of candlelit tables, rare wines, and dishes that whisper rather than shout.</p>
          <a class="btn-rui btn-outline" href="our-story.html">Discover More</a>
        </div>
      </div>
    </div>
  </section>

  <section class="section"><div class="container-rui">{stats_html(demo)}</div></section>

  <section class="cta-block">
    <div class="cta-bg"><img src="{IMG['wine']}" alt=""></div>
    <div class="cta-overlay"></div>
    <div class="cta-content container-rui">
      <h2>An evening reserved for you</h2>
      <p>Private dining rooms · Sommelier pairing · Chef's table</p>
      <a class="btn-rui magnetic" href="reservation.html">Book Now</a>
    </div>
  </section>

  <section class="section">
    <div class="container-rui">
      <div class="section-title"><span class="eyebrow">Voices</span><h2>Guest Reflections</h2></div>
      {testimonials()}
    </div>
  </section>

  <section class="section" style="padding-top:0">
    <div class="container-rui"><div class="section-title"><span class="eyebrow">Moments</span><h2>Gallery</h2></div>{gallery_grid()}</div>
  </section>
</main>
{quick_view_modal()}
"""


def home_italian(demo: dict) -> str:
    return f"""
<main id="main">
  <section class="section" style="padding:0;min-height:100vh;display:grid;grid-template-columns:1fr;align-items:stretch">
    <div class="row g-0" style="min-height:100vh">
      <div class="col-lg-6 d-flex align-items-center" style="padding:6rem 8vw;background:var(--rui-bg)">
        <div data-aos="fade-up">
          <p class="hero-eyebrow">Benvenuti</p>
          <h1 style="font-size:clamp(3rem,6vw,5rem)">{demo['brand']}</h1>
          <p class="hero-text" style="color:var(--rui-muted)">{demo['tagline']}. Handmade pasta, wood-fired pizza, and wine from the hills.</p>
          <div class="hero-actions">
            <a class="btn-rui" href="menu.html">Explore Menu</a>
            <a class="btn-rui btn-outline" href="reservation.html">Prenota</a>
          </div>
        </div>
      </div>
      <div class="col-lg-6" style="min-height:50vh;background:url('{demo['hero_img']}') center/cover"></div>
    </div>
  </section>

  <section class="section">
    <div class="container-rui">
      <div class="section-title"><span class="eyebrow">La Cucina</span><h2>From Our Kitchen</h2></div>
      <div class="menu-filter">{''.join(f'<button class="filter-btn {"active" if i==0 else ""}" data-menu-filter="{("*" if i==0 else c.lower())}">{c}</button>' for i,c in enumerate(["All"]+demo["categories"][:4]))}</div>
      <div class="row g-4" data-menu-grid>{menu_cards(demo)}</div>
    </div>
  </section>

  <section class="section" style="background:linear-gradient(180deg,rgba(193,18,31,0.08),transparent)">
    <div class="container-rui">
      <div class="row g-4 align-items-center">
        <div class="col-lg-5"><h2>Family recipes since 1985</h2><p>Every Sunday sauce simmers for six hours. Every dough rests overnight. This is Italian hospitality.</p><a class="btn-rui" href="our-story.html">Our Story</a></div>
        <div class="col-lg-7"><div class="row g-3"><div class="col-6"><img class="w-100" src="{IMG['pasta']}" alt="" style="border-radius:var(--rui-radius)"></div><div class="col-6"><img class="w-100" src="{IMG['pizza']}" alt="" style="border-radius:var(--rui-radius);margin-top:2rem"></div></div></div>
      </div>
    </div>
  </section>

  <section class="section"><div class="container-rui"><div class="section-title"><h2>The Family</h2></div><div class="row g-4">{chef_cards(demo)}</div></div></section>
  <section class="section" style="background:var(--rui-surface)"><div class="container-rui">{stats_html(demo)}</div></section>
  <section class="newsletter-block container-rui mb-5"><h2>Join the Bella Club</h2><p>Seasonal menus & Sunday specials in your inbox.</p><form class="newsletter-form" data-validate-form data-success-url="newsletter-success.html"><input type="email" required placeholder="Email address" aria-label="Email"><button class="btn-rui" type="submit">Subscribe</button></form></section>
</main>
{quick_view_modal()}
"""


def home_sushi(demo: dict) -> str:
    return f"""
<main id="main">
  <section class="hero" style="min-height:100vh">
    <div class="hero-media"><img src="{demo['hero_img']}" alt="Sushi" data-parallax="15"></div>
    <div class="hero-overlay" style="background:linear-gradient(90deg,rgba(13,17,23,0.9),rgba(13,17,23,0.35))"></div>
    <div class="hero-content">
      <p class="hero-eyebrow">江戸前</p>
      <h1 class="hero-title">{demo['brand']}</h1>
      <p class="hero-text"><span data-typed="Precision.|Season.|Harmony.|Omakase."></span></p>
      <div class="hero-actions">
        <a class="btn-rui" href="reservation.html">Book Omakase</a>
        <a class="btn-rui btn-ghost" href="menu.html">View Menu</a>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container-rui" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.5rem">
      {''.join(f'<div class="card-rui" style="padding:1.5rem;text-align:center" data-aos="fade-up"><h3 style="font-size:1.1rem">{c}</h3><p>Seasonal selection</p></div>' for c in demo['categories'])}
    </div>
  </section>

  <section class="section" style="background:var(--rui-surface)">
    <div class="container-rui">
      <div class="section-title"><span class="eyebrow">本日の</span><h2>Today's Board</h2></div>
      <div class="menu-swiper swiper"><div class="swiper-wrapper">
      {''.join(f"""
      <div class="swiper-slide">
        <article class="card-rui food-card">
          <div class="card-media"><img src="{demo['dish_img']}" alt="{name}"></div>
          <div class="card-body"><h3 style="font-size:1.2rem">{name}</h3><div class="price">${price}</div></div>
        </article>
      </div>""" for name, price, *_ in demo['menu'])}
      </div>
      <div class="swiper-button-prev"></div><div class="swiper-button-next"></div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container-rui">
      <div class="row g-5 align-items-center">
        <div class="col-lg-6 order-lg-2"><img src="{IMG['sushi']}" class="w-100 morph-blob" alt="" style="object-fit:cover;aspect-ratio:1"></div>
        <div class="col-lg-6"><h2>One counter. One conversation.</h2><p>Twelve seats. Fish selected at dawn. A quiet dialogue between itamae and guest.</p><a class="btn-rui btn-outline" href="our-chef.html">Meet the Itamae</a></div>
      </div>
    </div>
  </section>

  <section class="section"><div class="container-rui">{stats_html(demo)}</div></section>
  <section class="section" style="padding-top:0"><div class="container-rui">{gallery_grid(True)}</div></section>
</main>
"""


def home_indian(demo: dict) -> str:
    return f"""
<main id="main">
  <section class="hero">
    <div class="hero-media"><img src="{demo['hero_img']}" alt="Indian feast"></div>
    <div class="hero-overlay" style="background:radial-gradient(ellipse at center, rgba(232,93,4,0.25), rgba(26,15,10,0.85))"></div>
    <div class="hero-content">
      <p class="hero-eyebrow">स्वागत है</p>
      <h1 class="hero-title">{demo['brand']}</h1>
      <p class="hero-text">{demo['tagline']}</p>
      <div class="hero-actions"><a class="btn-rui" href="reservation.html">Reserve</a><a class="btn-rui btn-outline" href="menu.html">Thali Menu</a></div>
    </div>
  </section>

  <section class="section">
    <div class="container-rui">
      <div class="section-title"><span class="eyebrow">Regional</span><h2>Spice Map</h2></div>
      <div class="row g-4">{''.join(f'<div class="col-6 col-md-3"><div class="card-rui text-center p-4 hover-3d"><h3 style="font-size:1.2rem">{c}</h3></div></div>' for c in demo['categories'])}</div>
    </div>
  </section>

  <section class="section" style="background:var(--rui-surface)">
    <div class="container-rui">
      <div class="section-title"><h2>Chef's Thali Picks</h2></div>
      <div class="row g-4" data-menu-grid>{menu_cards(demo)}</div>
    </div>
  </section>

  <section class="section">
    <div class="container-rui">
      <div class="section-title"><span class="eyebrow">Legacy</span><h2>Our Journey</h2></div>
      <div class="timeline">
        <div class="timeline-item"><div class="year">1998</div><h3>First kitchen</h3><p>A family tandoor opens its doors.</p></div>
        <div class="timeline-item"><div class="year">2008</div><h3>Spice Route born</h3><p>Regional menus from four corners of India.</p></div>
        <div class="timeline-item"><div class="year">2018</div><h3>Award night</h3><p>Best Indian Restaurant — City Dining Awards.</p></div>
        <div class="timeline-item"><div class="year">2026</div><h3>Today</h3><p>Still grinding spices fresh each morning.</p></div>
      </div>
    </div>
  </section>

  <section class="cta-block"><div class="cta-bg"><img src="{IMG['curry']}" alt=""></div><div class="cta-overlay"></div><div class="cta-content container-rui"><h2>Celebrate with us</h2><p>Weddings · Festivals · Corporate thalis</p><a class="btn-rui" href="private-events.html">Plan an Event</a></div></section>
  <section class="section"><div class="container-rui"><div class="row g-4">{chef_cards(demo)}</div></div></section>
</main>
{quick_view_modal()}
"""


def home_mexican(demo: dict) -> str:
    return f"""
<main id="main">
  <section style="min-height:100vh;display:grid;grid-template-columns:1.1fr 0.9fr;clip-path:polygon(0 0,100% 0,100% 92%,0 100%)">
    <div style="background:var(--rui-primary);display:flex;align-items:center;padding:6rem 8vw;color:#111">
      <div data-aos="fade-right">
        <p style="letter-spacing:0.25em;text-transform:uppercase;font-weight:800;margin-bottom:1rem">¡Bienvenidos!</p>
        <h1 style="font-size:clamp(3rem,7vw,5.5rem);color:#111;line-height:0.95">{demo['brand']}</h1>
        <p style="font-size:1.2rem;max-width:28rem;color:#3d1f0f">{demo['tagline']}</p>
        <div class="hero-actions" style="margin-top:2rem">
          <a class="btn-rui btn-dark" href="menu.html">See the Menu</a>
          <a class="btn-rui" style="--btn-bg:#fff;--btn-border:#fff" href="reservation.html">Book Fiesta</a>
        </div>
      </div>
    </div>
    <div style="background:url('{demo['hero_img']}') center/cover"></div>
  </section>

  <section class="section">
    <div class="container-rui">
      <div class="section-title"><span class="eyebrow">Antojitos</span><h2>Street Favorites</h2></div>
      <div class="row g-4" data-menu-grid>{menu_cards(demo)}</div>
    </div>
  </section>

  <section class="section" style="background:var(--rui-secondary);color:#fff">
    <div class="container-rui text-center">
      <h2 style="color:#fff">Salsa Bar · Live Music · Mezcal Nights</h2>
      <p style="color:rgba(255,255,255,0.85);max-width:32rem;margin:1rem auto 2rem">Every Friday the courtyard fills with mariachi and fire-roasted aromas.</p>
      <a class="btn-rui" href="events.html">Upcoming Events</a>
    </div>
  </section>

  <section class="section"><div class="container-rui">{stats_html(demo)}</div></section>
  <section class="section"><div class="container-rui"><div class="instagram-grid">{''.join(f'<a href="#"><img src="{img}" alt="" loading="lazy"></a>' for img in [IMG['taco'],IMG['mexican_hero'],IMG['gallery1'],IMG['gallery3'],IMG['dessert'],IMG['gallery4']])}</div></div></section>
</main>
{quick_view_modal()}
"""


def home_bbq(demo: dict) -> str:
    return f"""
<main id="main">
  <section class="hero" style="min-height:92vh">
    <div class="hero-media"><img src="{demo['hero_img']}" alt="BBQ"></div>
    <div class="hero-overlay" style="background:linear-gradient(to top, #1b120b 10%, transparent 60%), rgba(0,0,0,0.35)"></div>
    <div class="hero-content" style="padding-bottom:4rem">
      <p class="hero-eyebrow">Est. Smokehouse</p>
      <h1 class="hero-title" style="font-size:clamp(3.5rem,10vw,7rem);max-width:none;text-transform:uppercase">{demo['brand']}</h1>
      <p class="hero-text">{demo['tagline']}</p>
      <div class="hero-actions">
        <a class="btn-rui btn-lg" href="reservation.html">Get a Table</a>
        <a class="btn-rui btn-outline btn-lg" href="menu.html">Meat Menu</a>
      </div>
    </div>
  </section>

  <section class="section" style="background:var(--rui-surface)">
    <div class="container-rui">
      <div class="row g-4">{''.join(f'<div class="col-md-3"><div class="p-4 border border-secondary text-center"><div class="stat-num" data-count="{n}" style="font-size:2.5rem">0</div><div class="stat-label">{l}</div></div></div>' for n,l in demo['stats'])}</div>
    </div>
  </section>

  <section class="section">
    <div class="container-rui">
      <div class="section-title"><span class="eyebrow">From the Pit</span><h2>Smoke Board</h2></div>
      <div class="row g-4" data-menu-grid>{menu_cards(demo)}</div>
    </div>
  </section>

  <section class="section" style="background:#120c08">
    <div class="container-rui">
      <div class="row align-items-center g-5">
        <div class="col-lg-6"><img src="{IMG['steak']}" class="w-100" alt="Steak" style="border:4px solid var(--rui-primary)"></div>
        <div class="col-lg-6"><h2 style="text-transform:uppercase">14-hour brisket. 45-day ribeye.</h2><p>We don't rush smoke. We don't fake char. Iron, fire, patience.</p><a class="btn-rui" href="our-chef.html">Meet the Pitmaster</a></div>
      </div>
    </div>
  </section>

  <section class="section"><div class="container-rui"><div class="section-title"><h2>What Folks Say</h2></div>{testimonials()}</div></section>
</main>
{quick_view_modal()}
"""


def home_seafood(demo: dict) -> str:
    return f"""
<main id="main">
  <section class="hero">
    <div class="hero-media"><img src="{demo['hero_img']}" alt="Harbor" data-parallax="12"></div>
    <div class="hero-overlay" style="background:linear-gradient(180deg, rgba(2,48,71,0.2), rgba(2,48,71,0.85))"></div>
    <div class="hero-content text-center" style="text-align:center;margin-inline:auto">
      <p class="hero-eyebrow">Daily Catch</p>
      <h1 class="hero-title" style="max-width:none;margin-inline:auto">{demo['brand']}</h1>
      <p class="hero-text" style="margin-inline:auto">{demo['tagline']}</p>
      <div class="hero-actions" style="justify-content:center">
        <a class="btn-rui" href="menu.html">Today's Catch</a>
        <a class="btn-rui btn-outline" href="reservation.html">Reserve Harbor View</a>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container-rui">
      <div class="row g-4 align-items-stretch">
        <div class="col-lg-4"><div class="card-rui p-4 h-100"><h3>Raw Bar</h3><p>Oysters shucked to order. Ice-cold and bright.</p></div></div>
        <div class="col-lg-4"><div class="card-rui p-4 h-100" style="border-color:var(--rui-primary)"><h3>Grill</h3><p>Whole fish, lobster, and coastal vegetables.</p></div></div>
        <div class="col-lg-4"><div class="card-rui p-4 h-100"><h3>Stews</h3><p>Cioppino, chowders, and sailor classics.</p></div></div>
      </div>
    </div>
  </section>

  <section class="section" style="background:var(--rui-surface)">
    <div class="container-rui">
      <div class="section-title"><h2>From the Tide</h2></div>
      <div class="row g-4" data-menu-grid>{menu_cards(demo)}</div>
    </div>
  </section>

  <section class="section">
    <div class="container-rui">
      <div class="row g-5">
        <div class="col-lg-6"><h2>Dockside since sunrise</h2><p>Our buyers walk the piers at 6 AM. What you taste tonight swam this morning.</p>{stats_html(demo)}</div>
        <div class="col-lg-6">{gallery_grid()}</div>
      </div>
    </div>
  </section>

  <section class="newsletter-block container-rui mb-5"><h2>Catch of the week</h2><form class="newsletter-form" data-validate-form data-success-url="newsletter-success.html"><input type="email" required placeholder="Email" aria-label="Email"><button class="btn-rui" type="submit">Subscribe</button></form></section>
</main>
{quick_view_modal()}
"""


def home_cafe(demo: dict) -> str:
    return f"""
<main id="main">
  <section class="section" style="padding-top:7rem">
    <div class="container-rui">
      <div class="row align-items-center g-5">
        <div class="col-lg-6" data-aos="fade-up">
          <p class="hero-eyebrow" style="color:var(--rui-primary)">Organic · Local · Kind</p>
          <h1 style="font-size:clamp(2.8rem,5vw,4.5rem)">{demo['brand']}</h1>
          <p style="font-size:1.15rem;color:var(--rui-muted)">{demo['tagline']} Bowls, juices, and slow mornings.</p>
          <div class="hero-actions">
            <a class="btn-rui" href="menu.html">See Bowls</a>
            <a class="btn-rui btn-outline" href="reservation.html">Book a Spot</a>
          </div>
        </div>
        <div class="col-lg-6">
          <div style="border-radius:2rem;overflow:hidden;box-shadow:var(--rui-shadow)" class="float-y">
            <img src="{demo['hero_img']}" alt="Cafe" class="w-100">
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container-rui">
      <div class="section-title"><span class="eyebrow">Nourish</span><h2>Feel-good plates</h2></div>
      <div class="row g-4" data-menu-grid>{menu_cards(demo)}</div>
    </div>
  </section>

  <section class="section" style="background:var(--rui-surface)">
    <div class="container-rui text-center">
      <h2>12 partner farms. Zero food waste goal.</h2>
      <p>We compost, recycle oils, and source within 100 miles.</p>
      <a class="btn-rui" href="sustainability.html">Our Promise</a>
      <div class="mt-5">{stats_html(demo)}</div>
    </div>
  </section>

  <section class="section"><div class="container-rui"><div class="row g-4">{chef_cards(demo)}</div></div></section>
  <section class="section"><div class="container-rui">{testimonials()}</div></section>
</main>
{quick_view_modal()}
"""


def home_fastfood(demo: dict) -> str:
    return f"""
<main id="main">
  <section class="section" style="padding-top:6rem;background:radial-gradient(circle at 80% 20%, rgba(255,183,3,0.35), transparent 40%), var(--rui-bg)">
    <div class="container-rui">
      <div class="row align-items-center g-4">
        <div class="col-lg-6">
          <p class="hero-eyebrow" style="color:var(--rui-secondary)">Hot · Fast · Loud</p>
          <h1 style="font-size:clamp(4rem,12vw,8rem);line-height:0.85;text-transform:uppercase">{demo['brand']}</h1>
          <p style="font-size:1.25rem;font-weight:600;color:var(--rui-muted)">{demo['tagline']}</p>
          <div class="hero-actions">
            <a class="btn-rui btn-lg" href="takeaway.html">Order Pickup</a>
            <a class="btn-rui btn-outline btn-lg" href="menu.html">Full Menu</a>
          </div>
        </div>
        <div class="col-lg-6 text-center">
          <img src="{demo['dish_img']}" alt="Burger" class="mx-auto float-y" style="max-width:420px;filter:drop-shadow(0 30px 40px rgba(0,0,0,0.25))">
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container-rui">
      <div class="section-title"><span class="eyebrow">Bestsellers</span><h2>STACK UP</h2></div>
      <div class="row g-4" data-menu-grid>{menu_cards(demo)}</div>
    </div>
  </section>

  <section class="section" style="background:var(--rui-accent);color:#fff">
    <div class="container-rui">
      <div class="row align-items-center">
        <div class="col-md-8"><h2 style="color:#fff;text-transform:uppercase">Download the Bolt App</h2><p style="color:rgba(255,255,255,0.8)">Skip the line. Track your smash. Earn free fries.</p></div>
        <div class="col-md-4 text-md-end"><a class="btn-rui" href="app-landing.html">Get the App</a></div>
      </div>
    </div>
  </section>

  <section class="section"><div class="container-rui">{stats_html(demo)}</div></section>
  <section class="section" style="background:var(--rui-surface)"><div class="container-rui"><div class="section-title"><h2>Fan Love</h2></div>{testimonials()}</div></section>
</main>
{quick_view_modal()}
"""


def home_bakery(demo: dict) -> str:
    return f"""
<main id="main">
  <section class="section" style="padding-top:8rem;padding-bottom:4rem">
    <div class="container-rui">
      <div class="row">
        <div class="col-lg-8">
          <p class="hero-eyebrow">Bakery · Coffee · Slow mornings</p>
          <h1 style="font-size:clamp(3rem,6vw,5rem);font-weight:500">{demo['brand']}</h1>
          <p style="max-width:32rem;font-size:1.15rem">{demo['tagline']}</p>
        </div>
        <div class="col-lg-4 d-flex align-items-end justify-content-lg-end">
          <a class="btn-rui" href="menu.html">Today's Bake</a>
        </div>
      </div>
      <div class="mt-5" style="border-radius:var(--rui-radius);overflow:hidden;aspect-ratio:21/9">
        <img src="{demo['hero_img']}" alt="Bakery" class="w-100 h-100" style="object-fit:cover">
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container-rui">
      <div class="row g-5">
        <div class="col-md-4"><h3>Bread</h3><p>Sourdough, focaccia, and seasonal loaves.</p></div>
        <div class="col-md-4"><h3>Pastry</h3><p>Croissants laminated with European butter.</p></div>
        <div class="col-md-4"><h3>Coffee</h3><p>Single-origin pour-overs and flat whites.</p></div>
      </div>
    </div>
  </section>

  <section class="section" style="background:var(--rui-surface)">
    <div class="container-rui">
      <div class="section-title"><span class="eyebrow">Case</span><h2>From the counter</h2></div>
      <div class="row g-4" data-menu-grid>{menu_cards(demo)}</div>
    </div>
  </section>

  <section class="section">
    <div class="container-rui">
      <div class="row g-5 align-items-center">
        <div class="col-lg-5"><img src="{IMG['coffee']}" class="w-100" alt="Coffee" style="border-radius:var(--rui-radius)"></div>
        <div class="col-lg-7"><h2>Baked at 4 AM. Brewed to order.</h2><p>Pull up a stool. Stay for a chapter. Leave with crumbs on your sweater.</p>{stats_html(demo)}<a class="btn-rui mt-3" href="contact.html">Find Us</a></div>
      </div>
    </div>
  </section>

  <section class="section"><div class="container-rui"><div class="row g-4">{chef_cards(demo)}</div></div></section>
  <section class="section" style="padding-top:0"><div class="container-rui">{gallery_grid(True)}</div></section>
</main>
{quick_view_modal()}
"""


HOME_BUILDERS = {
    "luxury": home_luxury,
    "italian": home_italian,
    "sushi": home_sushi,
    "indian": home_indian,
    "mexican": home_mexican,
    "bbq": home_bbq,
    "seafood": home_seafood,
    "cafe": home_cafe,
    "fastfood": home_fastfood,
    "bakery": home_bakery,
}


def close_body(depth: int = 0) -> str:
    return scripts(depth) + "\n</body>\n</html>\n"


def write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    print(f"  + {path.relative_to(ROOT)}")


# === PAGE BUILDERS ===

PAGE_BLURBS = {
    "about": "Our philosophy, kitchen, and hospitality.",
    "our-story": "The story behind the brand and tables.",
    "our-chef": "Meet the culinary leadership.",
    "team": "The people who make every service shine.",
    "menu": "Explore dishes with filters, search, and quick view.",
    "special-menu": "Limited seasonal tasting menus.",
    "food-categories": "Browse by cuisine category.",
    "reservation": "Elegant booking with date, time, and table selection.",
    "online-booking": "Full online booking experience.",
    "events": "Upcoming dinners, tastings, and live nights.",
    "gallery": "Atmosphere, plates, and moments.",
    "services": "Dining, catering, and private experiences.",
    "pricing": "Memberships, packages, and event pricing.",
    "testimonials": "What guests say about us.",
    "faqs": "Answers to common questions.",
    "contact": "Reach the restaurant — forms, maps, hours.",
    "location": "Find us and get directions.",
    "blog-grid": "Stories from the kitchen in a grid layout.",
    "blog-list": "Editorial list of culinary stories.",
    "blog-details": "In-depth article template.",
    "404": "Page not found.",
    "coming-soon": "We're preparing something delicious.",
    "maintenance": "We'll be right back.",
    "components-showcase": "200+ reusable UI components.",
}


def page_hero(title: str, crumb: str = "") -> str:
    return f"""
<section class="page-hero">
  <div class="container-rui">
    <nav aria-label="Breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="index.html">Home</a></li>
        <li class="breadcrumb-item active" aria-current="page">{title}</li>
      </ol>
    </nav>
    <h1>{title}</h1>
    <p>{crumb or PAGE_BLURBS.get(title.lower().replace(' ', '-'), 'Premium restaurant page template.')}</p>
  </div>
</section>
"""


def build_menu_page(demo: dict) -> str:
    filters = ["*", "veg", "nonveg", "starters", "mains", "desserts"]
    # use demo categories
    cats = ["*"] + [c.lower().replace(" ", "")[:8] for c in demo["categories"][:5]]
    labels = ["All"] + demo["categories"][:5]
    btns = "".join(
        f'<button class="filter-btn {"active" if i==0 else ""}" data-menu-filter="{cats[i] if i else "*"}">{labels[i]}</button>'
        for i in range(len(labels))
    )
    return f"""
<main id="main">
  {page_hero("Menu", "Filter, search, sort, and explore every plate.")}
  <section class="section">
    <div class="container-rui">
      <div class="menu-toolbar">
        <div class="search-box"><i class="bi bi-search"></i><input type="search" data-menu-search placeholder="Search dishes..." aria-label="Search dishes"></div>
        <select class="form-select" data-menu-sort style="max-width:200px;background:var(--rui-surface);color:var(--rui-text);border-color:var(--rui-border)">
          <option value="default">Sort: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>
      <div class="menu-filter">{btns}
        <button class="filter-btn" data-menu-filter="veg">Vegetarian</button>
        <button class="filter-btn" data-menu-filter="nonveg">Non-Veg</button>
      </div>
      <div class="row g-4" data-menu-grid>{menu_cards(demo)}</div>
    </div>
  </section>
</main>
{quick_view_modal()}
"""


def build_reservation_page(demo: dict) -> str:
    seats = "".join(
        f'<button type="button" class="table-seat {"taken" if i in (3,7,11) else ""}" data-table="T{i+1}">T{i+1}</button>'
        for i in range(12)
    )
    return f"""
<main id="main">
  {page_hero("Reservation", "Select date, time, guests, and your preferred table.")}
  <section class="section">
    <div class="container-rui">
      <div class="row g-5">
        <div class="col-lg-7">
          <form class="reservation-form form-rui" data-reservation-form data-success-url="reservation-success.html">
            <div class="row g-3">
              <div class="col-md-6 form-group"><label class="form-label" for="name">Full Name</label><input class="form-control" id="name" name="name" required></div>
              <div class="col-md-6 form-group"><label class="form-label" for="email">Email</label><input class="form-control" id="email" name="email" type="email" required></div>
              <div class="col-md-6 form-group"><label class="form-label" for="phone">Phone</label><input class="form-control" id="phone" name="phone" required></div>
              <div class="col-md-6 form-group"><label class="form-label" for="date">Date</label><input class="form-control" id="date" name="date" type="date" required></div>
              <div class="col-md-6 form-group"><label class="form-label" for="time">Time</label>
                <select class="form-select" id="time" name="time" required>
                  <option value="">Select</option>
                  <option>17:00</option><option>17:30</option><option>18:00</option><option>18:30</option>
                  <option>19:00</option><option>19:30</option><option>20:00</option><option>20:30</option>
                </select>
              </div>
              <div class="col-md-6 form-group"><label class="form-label">Guests</label>
                <div class="guest-counter">
                  <button type="button" data-guest="dec" aria-label="Decrease">−</button>
                  <span data-guest-count>2</span>
                  <button type="button" data-guest="inc" aria-label="Increase">+</button>
                </div>
                <input type="hidden" name="guests" value="2">
              </div>
              <div class="col-md-6 form-group"><label class="form-label" for="occasion">Occasion</label>
                <select class="form-select" id="occasion" name="occasion">
                  <option>None</option><option>Birthday</option><option>Anniversary</option><option>Business</option><option>Date Night</option>
                </select>
              </div>
              <div class="col-md-6 form-group"><label class="form-label" for="coupon">Coupon</label><input class="form-control" id="coupon" name="coupon" placeholder="Optional"></div>
              <div class="col-12 form-group"><label class="form-label">Table Selection</label><div class="table-grid">{seats}</div><input type="hidden" name="table"></div>
              <div class="col-12 form-group"><label class="form-label" for="notes">Special Request</label><textarea class="form-control" id="notes" name="notes" rows="3"></textarea></div>
              <div class="col-12"><button class="btn-rui" type="submit">Confirm Reservation</button></div>
            </div>
          </form>
        </div>
        <div class="col-lg-5">
          <div class="card-rui p-4 mb-4">
            <h3>Dining Hours</h3>
            <ul class="hours-list">
              <li><span>Monday – Thursday</span><strong>11:00 – 22:00</strong></li>
              <li><span>Friday – Saturday</span><strong>11:00 – 23:00</strong></li>
              <li><span>Sunday</span><strong>10:00 – 21:00</strong></li>
            </ul>
          </div>
          <div class="card-rui p-4">
            <h3>{demo['brand']}</h3>
            <p>128 Culinary Avenue, New York, NY 10001</p>
            <p><a href="tel:+12125550148">+1 212 555 0148</a></p>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>
"""


def build_contact_page(demo: dict) -> str:
    return f"""
<main id="main">
  {page_hero("Contact", "We would love to hear from you.")}
  <section class="section">
    <div class="container-rui">
      <div class="row g-5">
        <div class="col-lg-6">
          <form class="form-rui reservation-form" data-validate-form data-success-url="contact-success.html" data-success-message="Message sent!">
            <div class="row g-3">
              <div class="col-md-6 form-group"><label class="form-label">Name</label><input class="form-control" required name="name"></div>
              <div class="col-md-6 form-group"><label class="form-label">Email</label><input class="form-control" type="email" required name="email"></div>
              <div class="col-12 form-group"><label class="form-label">Subject</label><input class="form-control" required name="subject"></div>
              <div class="col-12 form-group"><label class="form-label">Message</label><textarea class="form-control" rows="5" required name="message"></textarea></div>
              <div class="col-12"><button class="btn-rui" type="submit">Send Message</button></div>
            </div>
          </form>
        </div>
        <div class="col-lg-6">
          <iframe class="map-embed" title="Map" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
            src="https://maps.google.com/maps?q=New%20York%20Restaurant&t=&z=13&ie=UTF8&iwloc=&output=embed"></iframe>
          <div class="row g-3 mt-3">
            <div class="col-sm-6"><div class="card-rui p-3"><strong>Address</strong><p class="mb-0">128 Culinary Ave, NY</p></div></div>
            <div class="col-sm-6"><div class="card-rui p-3"><strong>Email</strong><p class="mb-0">hello@{demo['id'].replace('-', '')}.com</p></div></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>
"""


def build_gallery_page(demo: dict) -> str:
    return f"""
<main id="main">
  {page_hero("Gallery", "A visual taste of {demo['brand']}.")}
  <section class="section"><div class="container-rui">{gallery_grid(True)}</div></section>
</main>
"""


def build_about_page(demo: dict) -> str:
    return f"""
<main id="main">
  {page_hero("About", demo['tagline'])}
  <section class="section">
    <div class="container-rui">
      <div class="row g-5 align-items-center">
        <div class="col-lg-6"><img src="{demo['hero_img']}" class="w-100" alt="" style="border-radius:var(--rui-radius)"></div>
        <div class="col-lg-6">
          <span class="eyebrow" style="color:var(--rui-primary);letter-spacing:0.2em;text-transform:uppercase;font-size:0.75rem">Who we are</span>
          <h2>{demo['brand']}</h2>
          <p>{demo['name']} crafted for modern guests — memorable plating, warm service, and a distinct sense of place.</p>
          <a class="btn-rui" href="reservation.html">Dine With Us</a>
        </div>
      </div>
    </div>
  </section>
  <section class="section" style="background:var(--rui-surface)"><div class="container-rui">{stats_html(demo)}</div></section>
  <section class="section"><div class="container-rui"><div class="section-title"><h2>Leadership</h2></div><div class="row g-4">{chef_cards(demo)}</div></div></section>
</main>
"""


def build_generic_page(demo: dict, slug: str, title: str, category: str) -> str:

    # Specialized pages
    if slug == "menu":
        return build_menu_page(demo)
    if slug in ("reservation", "online-booking", "book-event"):
        return build_reservation_page(demo)
    if slug == "contact":
        return build_contact_page(demo)
    if slug == "gallery" or slug == "video-gallery" or slug == "instagram-feed":
        return build_gallery_page(demo)
    if slug in ("about", "our-story", "restaurant-history"):
        return build_about_page(demo)
    if slug in ("our-chef", "team", "chef-profile"):
        return f"<main id='main'>{page_hero(title)}<section class='section'><div class='container-rui'><div class='row g-4'>{chef_cards(demo)}</div></div></section></main>"
    if slug in ("testimonials", "customer-stories"):
        return f"<main id='main'>{page_hero(title)}<section class='section'><div class='container-rui'>{testimonials()}</div></section></main>"
    if slug in ("faqs", "faq-category"):
        faqs = [
            ("Do you take walk-ins?", "Yes, subject to availability. Reservations are recommended on weekends."),
            ("Is there a dress code?", "Smart casual is appreciated for dinner service."),
            ("Do you accommodate allergies?", "Please note allergies in your reservation — our kitchen will advise."),
            ("Is parking available?", "Validated parking is available at the adjoining garage."),
            ("Can I host a private event?", "Yes — see Private Events for rooms and packages."),
        ]
        items = "".join(
            f"""<div class="accordion-item"><button class="accordion-button" aria-expanded="false">{q}<i class="bi bi-plus"></i></button><div class="accordion-body" hidden><p>{a}</p></div></div>"""
            for q, a in faqs
        )
        schema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faqs],
        }
        return f"<main id='main'>{page_hero(title)}<section class='section'><div class='container-rui'><div class='accordion-rui'>{items}</div></div></section></main><!-- FAQ_SCHEMA:{json.dumps(schema)} -->"
    if slug == "pricing" or slug == "membership" or slug == "loyalty-program":
        plans = [
            ("Essentials", 29, ["Priority booking", "Welcome drink", "Member newsletter"]),
            ("Gourmet", 79, ["Chef's table access", "Seasonal tasting", "Birthday dessert", "2 guest passes"], True),
            ("Connoisseur", 149, ["Private dining credit", "Wine pairing nights", "Unlimited guest passes", "Concierge"]),
        ]
        cards = []
        for plan in plans:
            name, price, features = plan[0], plan[1], plan[2]
            featured = len(plan) > 3
            lis = "".join(f'<li><i class="bi bi-check2"></i>{f}</li>' for f in features)
            cards.append(f'<div class="col-md-4"><div class="pricing-card {"featured" if featured else ""}"><h3>{name}</h3><div class="plan-price">${price}<span>/mo</span></div><ul>{lis}</ul><a class="btn-rui {"btn-outline" if not featured else ""}" href="reservation.html">Choose</a></div></div>')
        return f"<main id='main'>{page_hero(title)}<section class='section'><div class='container-rui'><div class='row g-4'>{''.join(cards)}</div></div></section></main>"
    if slug in ("blog-grid", "blog-list", "news", "recipes"):
        posts = [
            ("Seasonal tasting notes", IMG["blog1"], "Mar 12, 2026"),
            ("Behind the pass", IMG["blog2"], "Mar 05, 2026"),
            ("Wine & cheese pairing", IMG["blog3"], "Feb 28, 2026"),
            ("Farm partners visit", IMG["gallery1"], "Feb 20, 2026"),
            ("Dessert trends", IMG["dessert"], "Feb 14, 2026"),
            ("Coffee roasting day", IMG["coffee"], "Feb 08, 2026"),
        ]
        cards = "".join(
            f"""<div class="col-md-6 col-lg-4"><article class="blog-card"><div class="blog-media"><img src="{img}" alt="{t}" loading="lazy"></div><div class="blog-body"><div class="blog-meta">{d}</div><h3 style="font-size:1.35rem"><a href="blog-details.html">{t}</a></h3><p>Short excerpt for editorial storytelling.</p></div></article></div>"""
            for t, img, d in posts
        )
        return f"<main id='main'>{page_hero(title)}<section class='section'><div class='container-rui'><div class='row g-4'>{cards}</div></div></section></main>"
    if slug == "blog-details":
        return f"""
<main id="main">
  {page_hero("Blog Details")}
  <section class="section"><div class="container-rui" style="max-width:800px">
    <img src="{IMG['blog1']}" class="w-100 mb-4" alt="" style="border-radius:var(--rui-radius)">
    <p class="lead">A long-form culinary story template with semantic article markup, share links, and related posts.</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris.</p>
    <p>Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor.</p>
    <div class="mt-4"><a class="btn-rui btn-outline" href="blog-grid.html">Back to Blog</a></div>
  </div></section>
</main>"""
    if slug in ("404",):
        return f"""<main id="main"><section class="section"><div class="container-rui"><div class="error-state"><div class="icon"><i class="bi bi-compass"></i></div><h1>404</h1><p>This plate left the kitchen. Let's get you back.</p><a class="btn-rui" href="index.html">Back Home</a></div></div></section></main>"""
    if slug in ("coming-soon", "maintenance"):
        return f"""<main id="main"><section class="section" style="min-height:70vh;display:grid;place-items:center"><div class="container-rui text-center"><h1>{title}</h1><p>We're preparing something special for {demo['brand']}.</p><form class="newsletter-form" style="margin:2rem auto;max-width:420px;display:flex;gap:0.5rem" data-validate-form data-success-url="newsletter-success.html"><input class="form-control" type="email" required placeholder="Notify me" aria-label="Email"><button class="btn-rui" type="submit">Notify</button></form></div></section></main>"""
    if slug in ("reservation-success", "contact-success", "newsletter-success", "thank-you"):
        return f"""<main id="main"><section class="section"><div class="container-rui"><div class="success-state"><div class="icon"><i class="bi bi-check-circle"></i></div><h1>{title}</h1><p>You're all set — we sent a confirmation email.</p><a class="btn-rui" href="index.html">Back Home</a></div></div></section></main>"""
    if slug == "reservation-failed":
        return f"""<main id="main"><section class="section"><div class="container-rui"><div class="error-state"><div class="icon"><i class="bi bi-x-circle"></i></div><h1>Reservation Failed</h1><p>Something went wrong. Please try again or call us.</p><a class="btn-rui" href="reservation.html">Try Again</a></div></div></section></main>"""
    if slug in ("analytics", "reports", "charts", "statistics", "admin-preview", "customer-dashboard"):
        return f"""
<main id="main">
  {page_hero(title, "Dashboard & analytics UI preview.")}
  <section class="section"><div class="container-rui">
    <div class="dashboard-grid mb-4">
      <div class="dash-card"><div class="dash-label">Revenue</div><div class="dash-value">$48.2k</div><div class="dash-trend">↑ 12% vs last week</div></div>
      <div class="dash-card"><div class="dash-label">Covers</div><div class="dash-value">1,284</div><div class="dash-trend">↑ 8%</div></div>
      <div class="dash-card"><div class="dash-label">Avg Ticket</div><div class="dash-value">$62</div><div class="dash-trend">↑ 3%</div></div>
      <div class="dash-card"><div class="dash-label">Rating</div><div class="dash-value">4.9</div><div class="dash-trend">★ Excellent</div></div>
    </div>
    <div class="card-rui p-4"><canvas data-chart="line" data-label="Weekly Revenue" height="120"></canvas></div>
  </div></section>
</main>"""
    if slug == "components-showcase":
        return build_components_showcase()
    if slug in ("login", "signup", "forgot-password"):
        fields = {
            "login": [("email", "Email", "email"), ("password", "Password", "password")],
            "signup": [("name", "Name", "text"), ("email", "Email", "email"), ("password", "Password", "password")],
            "forgot-password": [("email", "Email", "email")],
        }[slug]
        inputs = "".join(f'<div class="form-group mb-3"><label class="form-label">{lab}</label><input class="form-control" type="{typ}" name="{name}" required></div>' for name, lab, typ in fields)
        return f"""<main id="main"><section class="section"><div class="container-rui" style="max-width:440px"><div class="reservation-form form-rui"><h1 class="h2 mb-4">{title}</h1><form data-validate-form data-success-url="thank-you.html">{inputs}<button class="btn-rui w-100" type="submit">Continue</button></form></div></div></section></main>"""
    if "landing" in slug:
        return f"""
<main id="main">
  <section class="hero" style="min-height:85vh">
    <div class="hero-media"><img src="{demo['hero_img']}" alt=""></div>
    <div class="hero-overlay"></div>
    <div class="hero-content text-center" style="text-align:center;margin-inline:auto">
      <p class="hero-eyebrow">Campaign</p>
      <h1 class="hero-title" style="max-width:18ch;margin-inline:auto">{title}</h1>
      <p class="hero-text" style="margin-inline:auto">High-converting promotional landing for {demo['brand']}.</p>
      <div class="hero-actions" style="justify-content:center"><a class="btn-rui btn-lg" href="reservation.html">Get Started</a></div>
    </div>
  </section>
  <section class="section"><div class="container-rui"><div class="row g-4" data-menu-grid>{menu_cards(demo, 4)}</div></div></section>
  <section class="section" style="background:var(--rui-surface)"><div class="container-rui">{stats_html(demo)}</div></section>
</main>{quick_view_modal()}"""
    if slug in ("wine-collection", "coffee-collection", "dessert-collection", "kids-menu", "breakfast-menu", "lunch-menu", "dinner-menu", "festival-menu", "special-menu", "food-categories", "favorite-meals", "compare-meals", "wishlist", "takeaway"):
        return f"<main id='main'>{page_hero(title)}<section class='section'><div class='container-rui'><div class='row g-4' data-menu-grid>{menu_cards(demo)}</div></div></section></main>{quick_view_modal()}"
    if slug in ("restaurant-timeline", "awards-timeline", "awards"):
        return f"""
<main id="main">{page_hero(title)}
<section class="section"><div class="container-rui">
  <div class="timeline">
    <div class="timeline-item"><div class="year">2012</div><h3>Opened doors</h3><p>First service under {demo['brand']}.</p></div>
    <div class="timeline-item"><div class="year">2016</div><h3>City Award</h3><p>Best new restaurant.</p></div>
    <div class="timeline-item"><div class="year">2020</div><h3>Expansion</h3><p>Second location & catering arm.</p></div>
    <div class="timeline-item"><div class="year">2026</div><h3>Today</h3><p>Still obsessed with the craft.</p></div>
  </div>
</div></section></main>"""
    if slug in ("location", "location-finder", "store-locator", "branches", "branch-details"):
        return f"""
<main id="main">{page_hero(title)}
<section class="section"><div class="container-rui">
  <iframe class="map-embed mb-4" title="Map" loading="lazy" src="https://maps.google.com/maps?q=restaurant&t=&z=12&ie=UTF8&iwloc=&output=embed"></iframe>
  <div class="row g-4">
    {''.join(f'<div class="col-md-4"><div class="card-rui p-4"><h3>Branch {i}</h3><p>128 Culinary Ave Suite {i}</p><a class="btn-rui btn-sm" href="branch-details.html">Details</a></div></div>' for i in range(1,4))}
  </div>
</div></section></main>"""
    if slug in ("events", "event-details", "private-events", "corporate-dining", "wedding-catering", "birthday-catering"):
        return f"""
<main id="main">{page_hero(title)}
<section class="section"><div class="container-rui"><div class="row g-4">
  {''.join(f'<div class="col-md-4"><article class="blog-card"><div class="blog-media"><img src="{img}" alt=""></div><div class="blog-body"><div class="blog-meta">Event</div><h3 style="font-size:1.3rem">{t}</h3><p>{d}</p><a class="btn-rui btn-sm" href="book-event.html">Book</a></div></article></div>' for t,img,d in [("Wine Night",IMG["wine"],"Sommelier-led tasting"),("Chef's Table",IMG["interior"],"8-seat experience"),("Brunch Social",IMG["cafe_hero"],"Weekend gathering")])}
</div></div></section></main>"""
    if slug in ("privacy-policy", "terms", "cookie-policy"):
        return f"""
<main id="main">{page_hero(title)}
<section class="section"><div class="container-rui" style="max-width:800px">
  <h2>1. Introduction</h2><p>This {title} applies to guests of {demo['brand']} and users of this template demo.</p>
  <h2>2. Information We Collect</h2><p>Contact details provided via reservation and contact forms.</p>
  <h2>3. How We Use Data</h2><p>To confirm bookings, respond to inquiries, and improve service.</p>
  <h2>4. Contact</h2><p>Email privacy@{demo['id']}.com for questions.</p>
</div></section></main>"""
    if slug in ("profile", "settings", "notifications", "reservation-history", "order-tracking", "invoice", "review-submission", "search-results"):
        return f"""
<main id="main">{page_hero(title)}
<section class="section"><div class="container-rui">
  <div class="row g-4">
    <div class="col-lg-4"><div class="card-rui p-4"><h3>Account</h3><ul class="list-unstyled"><li class="py-2"><a href="profile.html">Profile</a></li><li class="py-2"><a href="settings.html">Settings</a></li><li class="py-2"><a href="reservation-history.html">Reservations</a></li><li class="py-2"><a href="notifications.html">Notifications</a></li></ul></div></div>
    <div class="col-lg-8"><div class="card-rui p-4"><h3>{title}</h3><p>Interactive UI pattern for {title.lower()} within the restaurant guest portal.</p>
      <div class="table-responsive mt-3"><table class="table" style="color:var(--rui-text)"><thead><tr><th>Item</th><th>Date</th><th>Status</th></tr></thead><tbody>
        <tr><td>Dinner for 2</td><td>Apr 12</td><td><span class="badge-rui">Confirmed</span></td></tr>
        <tr><td>Chef's Table</td><td>Apr 20</td><td><span class="badge-rui badge-new">Pending</span></td></tr>
      </tbody></table></div>
    </div></div>
  </div>
</div></section></main>"""
    # Default rich content page
    return f"""
<main id="main">
  {page_hero(title, PAGE_BLURBS.get(slug, f'Premium {title} page for {demo["brand"]}.'))}
  <section class="section">
    <div class="container-rui">
      <div class="row g-5">
        <div class="col-lg-7">
          <h2>{title}</h2>
          <p>{demo['brand']} presents a complete {title.lower()} experience — designed for ThemeForest-quality restaurant websites.</p>
          <p>Use this page as a starting point for content, CTAs, and supporting modules such as stats, galleries, and forms.</p>
          <a class="btn-rui" href="contact.html">Talk to Us</a>
          <a class="btn-rui btn-outline ms-2" href="reservation.html">Reserve</a>
        </div>
        <div class="col-lg-5"><img src="{demo.get('dish_img', IMG['luxury_dish'])}" class="w-100" alt="" style="border-radius:var(--rui-radius)"></div>
      </div>
      <div class="mt-5">{stats_html(demo)}</div>
    </div>
  </section>
</main>
"""


def build_components_showcase() -> str:
    return """
<main id="main">
  <section class="page-hero"><div class="container-rui"><h1>Components Showcase</h1><p>200+ reusable UI patterns for restaurant websites.</p></div></section>
  <section class="section components-showcase"><div class="container-rui">
    <div class="comp-block"><h2>Buttons</h2><div class="d-flex flex-wrap gap-2">
      <a class="btn-rui" href="#">Primary</a><a class="btn-rui btn-outline" href="#">Outline</a>
      <a class="btn-rui btn-ghost" href="#">Ghost</a><a class="btn-rui btn-dark" href="#">Dark</a>
      <a class="btn-rui btn-sm" href="#">Small</a><a class="btn-rui btn-lg magnetic" href="#">Magnetic</a>
    </div></div>
    <div class="comp-block"><h2>Badges</h2>
      <span class="badge-rui">Featured</span> <span class="badge-rui badge-sale">Sale</span>
      <span class="badge-rui badge-new">New</span> <span class="badge-rui badge-spicy">Spicy</span>
      <span class="badge-rui badge-veg">Veg</span> <span class="badge-rui badge-outline">Outline</span>
    </div>
    <div class="comp-block"><h2>Alerts</h2>
      <div class="alert-rui alert-success mb-2"><i class="bi bi-check-circle"></i> Reservation confirmed.</div>
      <div class="alert-rui alert-danger mb-2"><i class="bi bi-exclamation-triangle"></i> Please check required fields.</div>
      <div class="alert-rui alert-info"><i class="bi bi-info-circle"></i> Kitchen closes at 22:00.</div>
    </div>
    <div class="comp-block"><h2>Form Controls</h2>
      <form class="form-rui row g-3"><div class="col-md-6"><label class="form-label">Name</label><input class="form-control" placeholder="Full name"></div>
      <div class="col-md-6"><label class="form-label">Party Size</label><select class="form-select"><option>2</option><option>4</option></select></div></form>
    </div>
    <div class="comp-block"><h2>Progress</h2><div class="progress-rui"><div class="bar" style="width:72%"></div></div></div>
    <div class="comp-block"><h2>Skeleton Loaders</h2><div class="row g-3"><div class="col-md-4"><div class="skeleton" style="height:160px"></div></div><div class="col-md-4"><div class="skeleton" style="height:160px"></div></div><div class="col-md-4"><div class="skeleton" style="height:160px"></div></div></div></div>
    <div class="comp-block"><h2>Empty / Error / Success</h2><div class="row g-4">
      <div class="col-md-4"><div class="empty-state card-rui"><div class="icon"><i class="bi bi-inbox"></i></div><h3>Empty</h3></div></div>
      <div class="col-md-4"><div class="error-state card-rui"><div class="icon"><i class="bi bi-x-circle"></i></div><h3>Error</h3></div></div>
      <div class="col-md-4"><div class="success-state card-rui"><div class="icon"><i class="bi bi-check-circle"></i></div><h3>Success</h3></div></div>
    </div></div>
    <div class="comp-block"><h2>Color System</h2><div class="row g-2">
      <div class="col"><div class="swatch" style="background:var(--rui-primary)"></div></div>
      <div class="col"><div class="swatch" style="background:var(--rui-secondary)"></div></div>
      <div class="col"><div class="swatch" style="background:var(--rui-accent)"></div></div>
      <div class="col"><div class="swatch" style="background:var(--rui-surface)"></div></div>
      <div class="col"><div class="swatch" style="background:var(--rui-bg);border:1px solid #444"></div></div>
    </div></div>
  </div></section>
</main>
"""



def build_demo_pages(demo: dict) -> None:
    """Generate homepage + all shared pages inside each demo folder."""
    out = ROOT / "demos" / demo["id"]
    out.mkdir(parents=True, exist_ok=True)

    # Home
    builder = HOME_BUILDERS[demo["layout"]]
    html = head("Home", demo, depth=2) + header(demo, active="home") + builder(demo) + footer(demo) + close_body(2)
    write(out / "index.html", html)

    # All catalog pages
    for slug, title, category in PAGES:
        active = "menu" if "menu" in slug else "about" if slug in ("about", "our-story") else "reservation" if "reserv" in slug else "gallery" if "gallery" in slug else "blog" if "blog" in slug else "contact" if slug == "contact" else "home"
        body = build_generic_page(demo, slug, title, category)
        # Inject FAQ schema into head if present
        schema_extra = None
        if "FAQ_SCHEMA:" in body:
            import re as _re
            m = _re.search(r"<!-- FAQ_SCHEMA:(.*?) -->", body)
            if m:
                schema_extra = f'<script type="application/ld+json">{m.group(1)}</script>'
                body = body.replace(m.group(0), "")
        page_head = head(title, demo, depth=2, schema=(schema_extra + restaurant_schema(demo)) if schema_extra else None)
        html = page_head + header(demo, active=active) + body + footer(demo) + close_body(2)
        write(out / f"{slug}.html", html)


def build_root_landing() -> None:
    cards = []
    for d in DEMOS:
        cards.append(f"""
        <div class="col-md-6 col-xl-4" data-aos="fade-up">
          <a class="card-rui hover-lift d-block text-decoration-none" href="demos/{d['id']}/index.html" style="color:inherit">
            <div class="card-media" style="aspect-ratio:16/10"><img src="{d['hero_img']}" alt="{d['name']}" loading="lazy"></div>
            <div class="card-body">
              <div class="badge-rui mb-2">{d['id'].split('-')[1]}</div>
              <h3 style="font-size:1.4rem;margin-bottom:0.35rem">{d['brand']}</h3>
              <p class="mb-0">{d['name']} — {d['tagline']}</p>
            </div>
          </a>
        </div>""")
    html = f"""<!DOCTYPE html>
<html lang="en" data-demo="demo-01-luxury" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Restaurant UI Kit — Ultra Premium ThemeForest Template</title>
  <meta name="description" content="10 unique restaurant demos, 100+ pages, 200+ UI components. HTML5, Bootstrap 5, SCSS, GSAP.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet">
  <link href="{CDN['bootstrap_css']}" rel="stylesheet">
  <link href="{CDN['bi']}" rel="stylesheet">
  <link href="{CDN['aos_css']}" rel="stylesheet">
  <link href="assets/css/main.css" rel="stylesheet">
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header is-sticky">
  <div class="container-rui navbar-rui">
    <a class="brand" href="index.html">Restaurant <span>UI Kit</span></a>
    <ul class="nav-links">
      <li><a href="#demos">Demos</a></li>
      <li><a href="#features">Features</a></li>
      <li><a href="documentation/index.html">Docs</a></li>
      <li><a href="pages/components-showcase.html">Components</a></li>
    </ul>
    <div class="header-actions">
      <button class="icon-btn" data-theme-toggle aria-label="Toggle theme"><i class="bi bi-sun"></i></button>
      <a class="btn-rui" href="#demos">View Demos</a>
    </div>
  </div>
</header>
<main id="main">
  <section class="hero" style="min-height:90vh">
    <div class="hero-media"><img src="{IMG['luxury_hero']}" alt="Restaurant UI Kit"></div>
    <div class="hero-overlay" style="background:linear-gradient(120deg,rgba(0,0,0,0.8),rgba(0,0,0,0.45))"></div>
    <div class="hero-content">
      <p class="hero-eyebrow">ThemeForest Elite Ready</p>
      <h1 class="hero-title" style="max-width:14ch">Ultra Premium Restaurant HTML UI Kit</h1>
      <p class="hero-text">10 unique demos · 100+ pages · 200+ components · SCSS · GSAP · Accessibility · SEO</p>
      <div class="hero-actions">
        <a class="btn-rui btn-lg magnetic" href="#demos">Explore Demos</a>
        <a class="btn-rui btn-outline btn-lg" href="documentation/index.html">Documentation</a>
      </div>
    </div>
  </section>

  <section class="section" id="features" style="background:var(--rui-surface)">
    <div class="container-rui">
      <div class="section-title"><span class="eyebrow">Why this kit</span><h2>Built for commercial sale</h2></div>
      <div class="row g-4">
        {''.join(f'<div class="col-md-6 col-lg-3"><div class="card-rui p-4 h-100"><h3 style="font-size:1.15rem">{t}</h3><p>{d}</p></div></div>' for t,d in [
          ("10 Unique Demos","Completely different layouts, type, color, and UX."),
          ("100+ Pages","Menus, booking, dashboards, landings, legal & more."),
          ("200+ Components","Buttons, cards, forms, charts, states, widgets."),
          ("SCSS 7-1","Tokens, mixins, themes, and production CSS."),
          ("Dark & Light","System detection, toggle, persistence."),
          ("Animations","GSAP, AOS, Lenis, magnetic buttons, reveals."),
          ("SEO Ready","Schema, OG, sitemap, robots, semantic HTML."),
          ("WCAG Minded","Skip links, ARIA, focus, keyboard nav."),
        ])}
      </div>
    </div>
  </section>

  <section class="section" id="demos">
    <div class="container-rui">
      <div class="section-title"><span class="eyebrow">Demos</span><h2>Ten restaurant worlds</h2><p>Each demo ships with a full page set.</p></div>
      <div class="row g-4">{''.join(cards)}</div>
    </div>
  </section>

  <section class="cta-block">
    <div class="cta-bg"><img src="{IMG['interior']}" alt=""></div>
    <div class="cta-overlay"></div>
    <div class="cta-content container-rui">
      <h2>Start customizing tonight</h2>
      <p>Open any demo, swap colors via CSS variables, and ship.</p>
      <a class="btn-rui" href="documentation/index.html">Read the Docs</a>
    </div>
  </section>
</main>
<footer class="site-footer"><div class="container-rui footer-bottom" style="border:0"><span>© 2026 Restaurant UI Kit</span><span>HTML5 · Bootstrap 5 · SCSS · Vanilla JS</span></div></footer>
<script src="{CDN['bootstrap_js']}" defer></script>
<script src="{CDN['aos_js']}" defer></script>
<script src="assets/js/main.js" defer></script>
</body></html>
"""
    write(ROOT / "index.html", html)


def build_shared_pages_mirror() -> None:
    """Also expose pages/ from demo-01 for documentation linking."""
    demo = DEMOS[0]
    pages_dir = ROOT / "pages"
    pages_dir.mkdir(exist_ok=True)
    # components showcase at pages/
    body = build_components_showcase()
    html = head("Components Showcase", demo, depth=1) + header(demo) + body + footer(demo) + close_body(1)
    # Fix header links for depth 1 - patch brand href
    html = html.replace('href="index.html"', 'href="../demos/demo-01-luxury/index.html"', 1)
    write(pages_dir / "components-showcase.html", html)


def build_docs() -> None:
    doc = ROOT / "documentation" / "index.html"
    content = """<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Documentation — Restaurant UI Kit</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&family=Cormorant+Garamond:wght@600&display=swap" rel="stylesheet">
<style>
:root{--bg:#0b0b0b;--surface:#141414;--text:#f5f0e8;--muted:#a89f91;--primary:#c9a227}
body{margin:0;font-family:Montserrat,sans-serif;background:var(--bg);color:var(--text);line-height:1.7}
.wrap{display:grid;grid-template-columns:260px 1fr;min-height:100vh}
nav{background:var(--surface);padding:2rem 1.25rem;border-right:1px solid #222;position:sticky;top:0;height:100vh;overflow:auto}
nav a{display:block;color:var(--muted);text-decoration:none;padding:.4rem 0;font-size:.9rem}
nav a:hover{color:var(--primary)}
main{padding:3rem clamp(1.5rem,4vw,3.5rem);max-width:900px}
h1,h2,h3{font-family:"Cormorant Garamond",serif}
h1{font-size:2.8rem}h2{margin-top:2.5rem;color:var(--primary)}
code,pre{background:#1c1c1c;border-radius:6px}
pre{padding:1rem;overflow:auto}
.badge{display:inline-block;background:var(--primary);color:#111;padding:.2rem .6rem;border-radius:99px;font-size:.7rem;font-weight:700}
@media(max-width:900px){.wrap{grid-template-columns:1fr}nav{height:auto;position:relative}}
</style></head><body>
<div class="wrap">
<nav>
  <div style="font-family:'Cormorant Garamond',serif;font-size:1.5rem;margin-bottom:1rem">Restaurant UI Kit</div>
  <a href="#install">Installation</a>
  <a href="#structure">Folder Structure</a>
  <a href="#scss">SCSS Architecture</a>
  <a href="#components">Component Usage</a>
  <a href="#js">JavaScript API</a>
  <a href="#theme">Theme Customization</a>
  <a href="#colors">Color System</a>
  <a href="#type">Typography</a>
  <a href="#build">Build Process</a>
  <a href="#browsers">Browser Support</a>
  <a href="#perf">Performance</a>
  <a href="#seo">SEO Guide</a>
  <a href="#a11y">Accessibility</a>
  <a href="#credits">Credits</a>
  <a href="#license">License</a>
  <a href="../index.html">← Back to Landing</a>
</nav>
<main>
  <p class="badge">v1.0.0</p>
  <h1>Documentation</h1>
  <p>Complete guide for the Ultra Premium Restaurant Website HTML UI Kit.</p>

  <h2 id="install">Installation</h2>
  <ol>
    <li>Unzip the package.</li>
    <li>Open <code>restaurant-ui-kit/index.html</code> or run a local server:</li>
  </ol>
  <pre>cd restaurant-ui-kit
npx serve -l 5500
# or: python3 -m http.server 5500</pre>
  <p>Visit <code>http://localhost:5500</code> and choose a demo.</p>

  <h2 id="structure">Folder Structure</h2>
  <pre>restaurant-ui-kit/
├── demos/                 # 10 unique restaurant demos
├── assets/
│   ├── scss/              # 7-1 SCSS source
│   ├── css/               # Compiled CSS (+ min)
│   ├── js/                # Main JS (+ min)
│   ├── images/            # Placeholders / categories
│   └── vendors/           # Optional local vendors
├── pages/                 # Shared component showcase
├── documentation/
├── changelog/
├── licensing/
├── sitemap.xml
└── robots.txt</pre>

  <h2 id="scss">SCSS Architecture (7-1)</h2>
  <p>Sources live in <code>assets/scss/</code>:</p>
  <ul>
    <li><strong>abstracts/</strong> — variables, mixins, functions</li>
    <li><strong>base/</strong> — reset & typography</li>
    <li><strong>layout/</strong> — header, footer, hero</li>
    <li><strong>components/</strong> — UI, restaurant modules, animations</li>
    <li><strong>themes/</strong> — per-demo CSS variables</li>
  </ul>
  <pre>npm run build:css
# sass assets/scss/main.scss:assets/css/main.css</pre>

  <h2 id="components">Component Usage</h2>
  <p>Use utility classes such as <code>.btn-rui</code>, <code>.card-rui</code>, <code>.food-card</code>, <code>.reservation-form</code>, <code>.badge-rui</code>, <code>.tabs-rui</code>, <code>.accordion-rui</code>.</p>
  <p>See <a href="../pages/components-showcase.html">Components Showcase</a>.</p>

  <h2 id="js">JavaScript API</h2>
  <p><code>assets/js/main.js</code> initializes:</p>
  <ul>
    <li>Theme toggle + persistence (<code>localStorage.rui-theme</code>)</li>
    <li>Lenis smooth scroll, AOS, GSAP ScrollTrigger</li>
    <li>Swiper, GLightbox, Isotope, CountUp, Typed</li>
    <li>Menu filter/search/sort, reservation UI, form validation</li>
    <li>Charts via Chart.js (<code>[data-chart]</code>)</li>
    <li><code>window.ruiToast(message, type)</code></li>
  </ul>

  <h2 id="theme">Theme Customization</h2>
  <p>Each demo sets <code>data-demo="demo-XX-..."</code> on <code>&lt;html&gt;</code>. Override tokens:</p>
  <pre>:root {
  --rui-primary: #c9a227;
  --rui-font-display: "Your Font", serif;
  --rui-radius: 0.5rem;
}</pre>

  <h2 id="colors">Color System</h2>
  <p>All colors are CSS variables (<code>--rui-*</code>) with dark/light themes via <code>data-theme</code>.</p>

  <h2 id="type">Typography</h2>
  <p>Each demo loads unique Google Fonts. Display headings use <code>--rui-font-display</code>; body uses <code>--rui-font-body</code>.</p>

  <h2 id="build">Build Process</h2>
  <pre>npm install
npm run build        # regenerate HTML package
npm run build:css    # compile SCSS
npm run serve        # local preview</pre>

  <h2 id="browsers">Browser Support</h2>
  <p>Chrome, Firefox, Safari, Edge — last 2 versions. Graceful degradation for older browsers.</p>

  <h2 id="perf">Performance Tips</h2>
  <ul>
    <li>Images use <code>loading="lazy"</code> and responsive Unsplash placeholders (replace with WebP for production).</li>
    <li>Scripts are deferred; critical CSS can be inlined for Lighthouse gains.</li>
    <li>Prefer <code>main.min.css</code> / <code>main.min.js</code> in production.</li>
  </ul>

  <h2 id="seo">SEO Guide</h2>
  <ul>
    <li>Semantic HTML5 landmarks and heading hierarchy</li>
    <li>Meta, Open Graph, Twitter cards on every page</li>
    <li>Restaurant / FAQ JSON-LD where relevant</li>
    <li><code>sitemap.xml</code> and <code>robots.txt</code> included</li>
  </ul>

  <h2 id="a11y">Accessibility Guide</h2>
  <ul>
    <li>Skip link, ARIA labels on icon buttons</li>
    <li>Keyboard-friendly nav and forms</li>
    <li><code>prefers-reduced-motion</code> respected</li>
    <li>Focus-visible outlines on interactive controls</li>
  </ul>

  <h2 id="credits">Credits</h2>
  <ul>
    <li>Bootstrap 5, Bootstrap Icons, Font Awesome</li>
    <li>GSAP, AOS, Swiper, GLightbox, Isotope</li>
    <li>CountUp.js, Typed.js, Lenis, Chart.js</li>
    <li>Google Fonts · Unsplash photography (placeholders)</li>
  </ul>

  <h2 id="license">License</h2>
  <p>See <code>licensing/LICENSE.md</code>. For ThemeForest Regular/Extended licenses, follow Envato terms.</p>
</main>
</div>
</body></html>
"""
    write(doc, content)


def build_seo_and_meta() -> None:
    urls = ["https://restaurant-uikit.example/"]
    for d in DEMOS:
        urls.append(f"https://restaurant-uikit.example/demos/{d['id']}/")
        for slug, _, _ in PAGES:
            urls.append(f"https://restaurant-uikit.example/demos/{d['id']}/{slug}.html")
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for u in urls:
        lines.append(f"  <url><loc>{u}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>")
    lines.append("</urlset>")
    write(ROOT / "sitemap.xml", "\n".join(lines) + "\n")
    write(
        ROOT / "robots.txt",
        "User-agent: *\nAllow: /\nSitemap: https://restaurant-uikit.example/sitemap.xml\n",
    )
    write(
        ROOT / "changelog" / "CHANGELOG.md",
        "# Changelog\n\n## 1.0.0 — 2026-08-06\n\n"
        "- Initial ThemeForest release\n"
        "- 10 unique restaurant demos\n"
        "- 100+ HTML pages\n"
        "- 200+ UI components\n"
        "- SCSS 7-1, dark/light themes, SEO & a11y\n",
    )
    write(
        ROOT / "licensing" / "LICENSE.md",
        "# License\n\n## Restaurant UI Kit\n\n"
        "Copyright © 2026 Restaurant UI Kit contributors.\n\n"
        "This package is intended for ThemeForest / Envato Market distribution.\n\n"
        "- **Regular License** — single end product (for yourself or a client).\n"
        "- **Extended License** — single end product for which an end user is charged.\n\n"
        "Customize under your Envato license. Do not redistribute as a competing kit.\n"
        "Unsplash photos follow the Unsplash License. Vendor libs keep their licenses.\n",
    )
    write(
        ROOT / "README.md",
        "# Restaurant UI Kit\n\n"
        "Ultra Premium Restaurant Website HTML UI Kit — ThemeForest ready.\n\n"
        "## Highlights\n\n"
        "- **10 unique demos** (Luxury, Italian, Sushi, Indian, Mexican, BBQ, Seafood, Cafe, Fast Food, Bakery)\n"
        "- **100+ HTML pages** per demo set\n"
        "- **200+ reusable UI components**\n"
        "- **SCSS 7-1 architecture** + minified CSS/JS\n"
        "- Dark / Light themes, GSAP & AOS animations, Lenis smooth scroll\n"
        "- SEO (schema, sitemap, robots) & accessibility foundations\n\n"
        "## Quick Start\n\n"
        "```bash\n"
        "cd restaurant-ui-kit\n"
        "npm install\n"
        "npm run build:css\n"
        "npm run serve\n"
        "```\n\n"
        "Open `http://localhost:5500`.\n\n"
        "## Regenerate package\n\n"
        "```bash\nnpm run build\n```\n\n"
        "## Documentation\n\n"
        "See `documentation/index.html`.\n\n"
        "## Stack\n\n"
        "HTML5 · CSS3 · SCSS · Bootstrap 5.3 · Vanilla JS · GSAP · AOS · Swiper · "
        "GLightbox · Isotope · CountUp · Typed · Lenis · Chart.js · Bootstrap Icons · "
        "Font Awesome · Google Fonts\n",
    )


def minify_js_css() -> None:
    """Lightweight minify for JS; SCSS compiler produces CSS min."""
    import re as _re
    js = (ROOT / "assets" / "js" / "main.js").read_text(encoding="utf-8")
    js_min = _re.sub(r"/\*[\s\S]*?\*/", "", js)
    js_min = _re.sub(r"\n\s*\n+", "\n", js_min)
    (ROOT / "assets" / "js" / "main.min.js").write_text(js_min, encoding="utf-8")
    print("  + assets/js/main.min.js")


def main() -> None:
    print("Building Restaurant UI Kit…")
    (ROOT / "assets" / "json").mkdir(parents=True, exist_ok=True)
    write(ROOT / "assets" / "json" / "demos.json", json.dumps([{k: d[k] for k in ('id','name','brand','tagline')} for d in DEMOS], indent=2))

    for demo in DEMOS:
        print(f"Demo: {demo['id']}")
        build_demo_pages(demo)

    build_root_landing()
    build_shared_pages_mirror()
    build_docs()
    build_seo_and_meta()
    minify_js_css()

    # Count pages
    html_files = list(ROOT.rglob("*.html"))
    print(f"\nDone. Generated {len(html_files)} HTML files across {len(DEMOS)} demos.")


if __name__ == "__main__":
    main()
