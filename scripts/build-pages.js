#!/usr/bin/env node
/**
 * Builds Verdura demo pages + shared inner pages from content definitions.
 * Run: node scripts/build-pages.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

const IMG = {
  market:
    "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=2000&q=80",
  trade:
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=80",
  organic:
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=2000&q=80",
  export:
    "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=2000&q=80",
  wholesale:
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=2000&q=80",
  harbor:
    "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=2000&q=80",
  fields:
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=80",
  basket:
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=2000&q=80",
  corporate:
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=2000&q=80",
  season:
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=2000&q=80",
  tomatoes:
    "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=900&q=80",
  leafy:
    "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=900&q=80",
  peppers:
    "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=900&q=80",
  carrots:
    "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=900&q=80",
  broccoli:
    "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=900&q=80",
  onions:
    "https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?auto=format&fit=crop&w=900&q=80",
  farm:
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1400&q=80",
  crates:
    "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1400&q=80",
  ship:
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1400&q=80",
  greenhouse:
    "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1400&q=80",
};

function asset(relDepth, file) {
  return `${"../".repeat(relDepth)}assets/${file}`;
}

function page(relDepth, file) {
  return `${"../".repeat(relDepth)}pages/${file}`;
}

function fixLogoHref(relDepth) {
  if (relDepth === 2) return "../../index.html";
  if (relDepth === 1) return "../index.html";
  return "index.html";
}

function navFixed(relDepth, { onDark = true, cta = "Request quote" } = {}) {
  const dark = onDark ? " header-on-dark" : "";
  return `
  <header class="site-header${dark}">
    <div class="container nav">
      <a class="logo" href="${fixLogoHref(relDepth)}">
        <span class="logo-mark logo-mark-theme" aria-hidden="true"></span>
        Verdura
      </a>
      <button class="nav-toggle" aria-label="Open menu" aria-expanded="false"><span></span></button>
      <nav class="nav-links" aria-label="Primary">
        <a href="${page(relDepth, "products.html")}">Produce</a>
        <a href="${page(relDepth, "services.html")}">Trade services</a>
        <a href="${page(relDepth, "import-export.html")}">Import &amp; export</a>
        <a href="${page(relDepth, "about.html")}">About</a>
        <a class="btn btn-ghost nav-cta" href="${page(relDepth, "contact.html")}">${cta}</a>
      </nav>
    </div>
  </header>`;
}

function footer(relDepth) {
  return `
  <footer class="site-footer">
    <div class="container footer-grid">
      <div>
        <div class="logo"><span class="logo-mark logo-mark-theme" aria-hidden="true"></span> Verdura</div>
        <p class="footer-blurb">Vegetable selling, wholesale supply, and global import/export — from harvest to harbor.</p>
      </div>
      <div class="footer-col">
        <h4>Explore</h4>
        <a href="${page(relDepth, "products.html")}">Produce catalog</a>
        <a href="${page(relDepth, "services.html")}">Trade services</a>
        <a href="${page(relDepth, "import-export.html")}">Import &amp; export</a>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <a href="${page(relDepth, "about.html")}">About Verdura</a>
        <a href="${page(relDepth, "contact.html")}">Contact</a>
        <a href="${fixLogoHref(relDepth)}">All demos</a>
      </div>
      <div class="footer-col">
        <h4>Trade desk</h4>
        <a href="mailto:trade@verdura.example">trade@verdura.example</a>
        <a href="tel:+18005550192">+1 (800) 555-0192</a>
        <a href="${page(relDepth, "contact.html")}">RFQ form</a>
      </div>
    </div>
    <div class="container footer-bottom">
      <span>© ${new Date().getFullYear()} Verdura Template. Demo content only.</span>
      <span>Vegetable selling · Import · Export</span>
    </div>
  </footer>`;
}

function shell({ title, theme, relDepth, body, onDark = true, cta }) {
  const cssBase = asset(relDepth, "css/base.css");
  const cssComp = asset(relDepth, "css/components.css");
  const cssDemo = asset(relDepth, "css/demos.css");
  const js = asset(relDepth, "js/main.js");
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title} · Verdura</title>
  <meta name="description" content="Verdura — vegetable selling and import/export website template demo." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Fraunces:opsz,wght@9..144,500;9..144,560;9..144,650&family=IBM+Plex+Mono:wght@400;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="${cssBase}" />
  <link rel="stylesheet" href="${cssComp}" />
  <link rel="stylesheet" href="${cssDemo}" />
</head>
<body data-theme="${theme}">
${navFixed(relDepth, { onDark, cta })}
${body}
${footer(relDepth)}
  <script src="${js}"></script>
</body>
</html>
`;
}

const produceItems = `
        <div class="produce-item reveal">
          <img src="${IMG.tomatoes}" alt="Ripe tomatoes" loading="lazy" />
          <div class="produce-meta"><strong>Tomatoes</strong><span>Export grade · Cluster &amp; loose</span></div>
        </div>
        <div class="produce-item reveal reveal-delay-1">
          <img src="${IMG.leafy}" alt="Leafy greens" loading="lazy" />
          <div class="produce-meta"><strong>Leafy greens</strong><span>Hydroponic &amp; field</span></div>
        </div>
        <div class="produce-item reveal reveal-delay-2">
          <img src="${IMG.peppers}" alt="Bell peppers" loading="lazy" />
          <div class="produce-meta"><strong>Peppers</strong><span>Color assortments</span></div>
        </div>
        <div class="produce-item reveal">
          <img src="${IMG.carrots}" alt="Carrots" loading="lazy" />
          <div class="produce-meta"><strong>Root vegetables</strong><span>Storage &amp; baby roots</span></div>
        </div>
        <div class="produce-item reveal reveal-delay-1">
          <img src="${IMG.broccoli}" alt="Broccoli" loading="lazy" />
          <div class="produce-meta"><strong>Brassicas</strong><span>Chilled program</span></div>
        </div>
        <div class="produce-item reveal reveal-delay-2">
          <img src="${IMG.onions}" alt="Onions" loading="lazy" />
          <div class="produce-meta"><strong>Alliums</strong><span>Bulk &amp; retail packs</span></div>
        </div>`;

const demoDefs = [
  {
    folder: "01-market",
    theme: "market",
    title: "Market",
    cta: "Shop produce",
    heroImg: IMG.market,
    heroAlt: "Fresh vegetable market stall",
    brand: "Verdura Market",
    headline: "Verdura",
    lead: "Morning-picked vegetables for neighborhood tables — sold fresh, packed clean, and ready for the day’s trade.",
    primaryCta: { label: "Browse produce", href: "products.html" },
    secondaryCta: { label: "Visit the stall", href: "contact.html" },
    sectionEyebrow: "Today’s harvest",
    sectionTitle: "Crisp, colorful, close to home",
    sectionLead: "A retail-first demo for farm markets and green grocers who sell vegetables daily.",
    splitEyebrow: "How we sell",
    splitTitle: "From crate to counter before noon",
    splitLead: "Local growers deliver overnight. We grade, mist, and merchandize by dawn so shoppers see peak color and snap.",
    splitImg: IMG.crates,
    splitImgAlt: "Vegetable crates at market",
    splitBtn: { label: "See market services", href: "services.html" },
    ctaTitle: "Stock your shelf with Verdura",
    ctaLead: "Wholesale pallets and retail-ready packs available daily.",
    extra: "",
  },
  {
    folder: "02-trade",
    theme: "trade",
    title: "Trade",
    cta: "Open RFQ",
    heroImg: IMG.trade,
    heroAlt: "Global shipping containers",
    brand: "Verdura Trade",
    headline: "Verdura",
    lead: "Cross-border vegetable trading with documented quality, cold-chain discipline, and lanes that move on schedule.",
    primaryCta: { label: "Start an RFQ", href: "contact.html" },
    secondaryCta: { label: "View trade lanes", href: "import-export.html" },
    sectionEyebrow: "Active lanes",
    sectionTitle: "Produce that clears customs cleanly",
    sectionLead: "B2B import/export demo built for traders, importers, and distribution partners.",
    splitEyebrow: "Trade desk",
    splitTitle: "Contracts, specs, and ship dates in one flow",
    splitLead: "Lock volumes against harvest calendars, match buyers to certified growers, and track reefers until delivery.",
    splitImg: IMG.ship,
    splitImgAlt: "Cargo ship at port",
    splitBtn: { label: "Import & export overview", href: "import-export.html" },
    ctaTitle: "Need volume this week?",
    ctaLead: "Our trade desk responds to RFQs within one business day.",
    extra: `
  <section class="section" style="padding-top:0">
    <div class="container">
      <div class="lanes">
        <div class="lane reveal"><strong>Mediterranean → North Europe</strong><span>Tomatoes &amp; peppers</span><span>Reefer · 4–6 days</span><span class="tag">Export</span></div>
        <div class="lane reveal"><strong>Andes → US East</strong><span>Asparagus programs</span><span>Air + truck</span><span class="tag">Import</span></div>
        <div class="lane reveal"><strong>SE Asia → GCC</strong><span>Leafy &amp; herbs</span><span>Air freight</span><span class="tag">Export</span></div>
        <div class="lane reveal"><strong>Domestic hub → retail DCs</strong><span>Mixed vegetable SKUs</span><span>Overnight</span><span class="tag">Wholesale</span></div>
      </div>
    </div>
  </section>`,
  },
  {
    folder: "03-organic",
    theme: "organic",
    title: "Organic",
    cta: "View certifications",
    heroImg: IMG.organic,
    heroAlt: "Organic vegetable rows in field",
    brand: "Verdura Organic",
    headline: "Verdura",
    lead: "Certified organic vegetables grown with soil health first — traceable lots for retailers who refuse compromise.",
    primaryCta: { label: "Organic catalog", href: "products.html" },
    secondaryCta: { label: "Talk to growers", href: "contact.html" },
    sectionEyebrow: "Certified lines",
    sectionTitle: "Soil-grown, paperwork-ready",
    sectionLead: "Organic specialty demo with grower partnerships and audit-ready documentation.",
    splitEyebrow: "Integrity",
    splitTitle: "Every crate carries its story",
    splitLead: "Lot codes link back to field blocks, inputs, and packing dates — so buyers can verify before they commit.",
    splitImg: IMG.greenhouse,
    splitImgAlt: "Greenhouse organic greens",
    splitBtn: { label: "About our standards", href: "about.html" },
    ctaTitle: "Build an organic program",
    ctaLead: "Seasonal planning for private label and national retail.",
    extra: "",
  },
  {
    folder: "04-export",
    theme: "export",
    title: "Export",
    cta: "Book capacity",
    heroImg: IMG.export,
    heroAlt: "Port containers for export",
    brand: "Verdura Export",
    headline: "Verdura",
    lead: "Export logistics for perishable vegetables — packing specs, phytosanitary files, and reefer slots that hold the cold.",
    primaryCta: { label: "Export services", href: "services.html" },
    secondaryCta: { label: "Lane schedule", href: "import-export.html" },
    sectionEyebrow: "Outward bound",
    sectionTitle: "Packed for the voyage",
    sectionLead: "Logistics-forward demo for exporters moving vegetables across oceans and borders.",
    splitEyebrow: "Cold chain",
    splitTitle: "Temperature is a promise we keep",
    splitLead: "Pre-cool, continuous monitoring, and destination QC so cargo arrives market-ready — not merely intact.",
    splitImg: IMG.ship,
    splitImgAlt: "Export vessel",
    splitBtn: { label: "Export checklist", href: "import-export.html" },
    ctaTitle: "Reserve reefer capacity",
    ctaLead: "Seasonal peaks fill fast — lock space with our export desk.",
    extra: `
  <section class="band band-ink">
    <div class="container">
      <div class="stat-row">
        <div class="stat reveal"><strong>48</strong><span>Export destinations</span></div>
        <div class="stat reveal reveal-delay-1"><strong>12h</strong><span>Avg. pre-cool window</span></div>
        <div class="stat reveal reveal-delay-2"><strong>99.1%</strong><span>On-spec arrivals</span></div>
        <div class="stat reveal reveal-delay-3"><strong>24/7</strong><span>Track &amp; trace desk</span></div>
      </div>
    </div>
  </section>`,
  },
  {
    folder: "05-wholesale",
    theme: "wholesale",
    title: "Wholesale",
    cta: "Get bulk pricing",
    heroImg: IMG.wholesale,
    heroAlt: "Wholesale produce market",
    brand: "Verdura Wholesale",
    headline: "Verdura",
    lead: "Pallet-scale vegetable supply for distributors, foodservice, and multi-store retailers who buy by the truckload.",
    primaryCta: { label: "Bulk catalog", href: "products.html" },
    secondaryCta: { label: "Open account", href: "contact.html" },
    sectionEyebrow: "By the pallet",
    sectionTitle: "Volume without the noise",
    sectionLead: "Wholesale marketplace demo focused on price clarity, pack formats, and dependable fills.",
    splitEyebrow: "Buyers",
    splitTitle: "One dock, many programs",
    splitLead: "Mix conventional and specialty SKUs on the same PO. We consolidate, label, and stage for early morning pickup.",
    splitImg: IMG.crates,
    splitImgAlt: "Wholesale vegetable pallets",
    splitBtn: { label: "Wholesale services", href: "services.html" },
    ctaTitle: "Ready for Monday load-out?",
    ctaLead: "Send your cut list — we’ll confirm pack-outs today.",
    extra: "",
  },
  {
    folder: "06-harbor",
    theme: "harbor",
    title: "Harbor",
    cta: "Port inquiry",
    heroImg: IMG.harbor,
    heroAlt: "Harbor shipping port",
    brand: "Verdura Harbor",
    headline: "Verdura",
    lead: "Port-side vegetable hub — inbound imports, outbound export, and cold rooms that bridge ship and truck.",
    primaryCta: { label: "Harbor services", href: "services.html" },
    secondaryCta: { label: "Contact stevedore desk", href: "contact.html" },
    sectionEyebrow: "At the water’s edge",
    sectionTitle: "Where reefers meet the road",
    sectionLead: "Harbor demo for cold-chain terminals and import clearance teams.",
    splitEyebrow: "Terminal",
    splitTitle: "Inspect, re-ice, re-route",
    splitLead: "On-dock QC, phytosanitary coordination, and last-mile handoff to regional distributors.",
    splitImg: IMG.ship,
    splitImgAlt: "Harbor cargo operations",
    splitBtn: { label: "Import & export lanes", href: "import-export.html" },
    ctaTitle: "Clearing a vessel this week?",
    ctaLead: "Harbor ops can stage cold capacity and paperwork in parallel.",
    extra: "",
  },
  {
    folder: "07-fields",
    theme: "fields",
    title: "Fields",
    cta: "Meet growers",
    heroImg: IMG.fields,
    heroAlt: "Vegetable fields at golden hour",
    brand: "Verdura Fields",
    headline: "Verdura",
    lead: "Field-to-freight storytelling for grower cooperatives who sell vegetables and ship surplus abroad.",
    primaryCta: { label: "Our farms", href: "about.html" },
    secondaryCta: { label: "Partner with us", href: "contact.html" },
    sectionEyebrow: "On the land",
    sectionTitle: "Harvest that travels well",
    sectionLead: "Narrative-led demo connecting farm identity with export-ready packing.",
    splitEyebrow: "Partnership",
    splitTitle: "Growers keep the brand close",
    splitLead: "We plan plantings with export calendars, then co-brand packs that still feel like the field they came from.",
    splitImg: IMG.farm,
    splitImgAlt: "Farm workers in vegetable field",
    splitBtn: { label: "Grower story", href: "about.html" },
    ctaTitle: "Export your next surplus",
    ctaLead: "Turn peak harvest into booked lanes — not waste.",
    extra: `
  <section class="band band-ink">
    <div class="container quote-block reveal">
      <blockquote>“We don’t just move vegetables. We move the season — carefully — so distant kitchens still taste the field.”</blockquote>
      <cite>— Verdura grower cooperative</cite>
    </div>
  </section>`,
  },
  {
    folder: "08-basket",
    theme: "basket",
    title: "Basket",
    cta: "Order delivery",
    heroImg: IMG.basket,
    heroAlt: "Fresh vegetable basket",
    brand: "Verdura Basket",
    headline: "Verdura",
    lead: "Online vegetable shop demo — curated baskets, same-week delivery, and add-on crates for chefs at home.",
    primaryCta: { label: "Build a basket", href: "products.html" },
    secondaryCta: { label: "Delivery areas", href: "contact.html" },
    sectionEyebrow: "Shop",
    sectionTitle: "Fill the basket, skip the guesswork",
    sectionLead: "Consumer ecommerce feel for direct-to-customer vegetable selling.",
    splitEyebrow: "Weekly drops",
    splitTitle: "Chosen for ripeness, not shelf theater",
    splitLead: "We pack what is actually ready — then suggest recipes that match the crate you receive.",
    splitImg: IMG.tomatoes,
    splitImgAlt: "Fresh tomatoes for baskets",
    splitBtn: { label: "See produce", href: "products.html" },
    ctaTitle: "Get next week’s basket",
    ctaLead: "Subscribe or order once — cancel anytime.",
    extra: "",
  },
  {
    folder: "09-corporate",
    theme: "corporate",
    title: "Corporate",
    cta: "Talk to sales",
    heroImg: IMG.corporate,
    heroAlt: "Corporate trading desk",
    brand: "Verdura Corporate",
    headline: "Verdura",
    lead: "Enterprise vegetable procurement and trading — SLAs, multi-origin sourcing, and reporting your board will recognize.",
    primaryCta: { label: "Enterprise programs", href: "services.html" },
    secondaryCta: { label: "Book a briefing", href: "contact.html" },
    sectionEyebrow: "Procurement",
    sectionTitle: "Vegetables as a managed category",
    sectionLead: "Corporate B2B demo for national buyers and food manufacturers.",
    splitEyebrow: "Control tower",
    splitTitle: "Visibility from contract to dock",
    splitLead: "Dashboards for fill rates, claim ratios, origin mix, and sustainability metrics — without losing the produce expertise.",
    splitImg: IMG.crates,
    splitImgAlt: "Enterprise produce logistics",
    splitBtn: { label: "Corporate services", href: "services.html" },
    ctaTitle: "Run a category review",
    ctaLead: "Bring your SKU list — we’ll map origins and risk.",
    extra: `
  <div class="ticker" aria-hidden="true">
    <div class="ticker-track">
      <span>Tomato 6x6 <strong>+2.1%</strong></span><span>Bell pepper mix <strong>stable</strong></span><span>Iceberg <strong>−0.8%</strong></span><span>Carrot jumbo <strong>+1.4%</strong></span><span>Broccoli crowns <strong>firm</strong></span>
      <span>Tomato 6x6 <strong>+2.1%</strong></span><span>Bell pepper mix <strong>stable</strong></span><span>Iceberg <strong>−0.8%</strong></span><span>Carrot jumbo <strong>+1.4%</strong></span><span>Broccoli crowns <strong>firm</strong></span>
    </div>
  </div>`,
  },
  {
    folder: "10-season",
    theme: "season",
    title: "Season",
    cta: "Seasonal plan",
    heroImg: IMG.season,
    heroAlt: "Seasonal vegetable harvest",
    brand: "Verdura Season",
    headline: "Verdura",
    lead: "Seasonal vegetable calendars for buyers who plan import windows and local peaks together.",
    primaryCta: { label: "Seasonal catalog", href: "products.html" },
    secondaryCta: { label: "Plan with us", href: "contact.html" },
    sectionEyebrow: "Calendar",
    sectionTitle: "Buy with the season, not against it",
    sectionLead: "Seasonal demo for CSA-style selling and import bridging when local supply dips.",
    splitEyebrow: "Planning",
    splitTitle: "Four seasons, one supply promise",
    splitLead: "When local fields rest, import programs keep shelves honest — labeled clearly, priced fairly.",
    splitImg: IMG.farm,
    splitImgAlt: "Seasonal farm landscape",
    splitBtn: { label: "How seasons work", href: "about.html" },
    ctaTitle: "Lock your seasonal matrix",
    ctaLead: "We’ll align plantings, imports, and promotions.",
    extra: `
  <section class="section" style="padding-top:0" data-season-switch>
    <div class="container">
      <div class="band" style="padding:2.5rem;border-radius:var(--radius-lg);background:linear-gradient(135deg,#2a1c0d,#3d5c45);color:#fff">
        <p class="eyebrow" style="color:rgba(255,255,255,.7)">Season switcher</p>
        <h2 class="display" data-season-title style="font-size:clamp(1.6rem,3vw,2.4rem);margin:.5rem 0">Peak summer harvest</h2>
        <p class="lead" data-season-copy style="color:rgba(255,255,255,.8)">Tomatoes, peppers, cucumbers, and courgettes in volume for retail and foodservice.</p>
        <div class="season-chips">
          <button type="button" class="season-chip" data-season="spring">Spring</button>
          <button type="button" class="season-chip is-active" data-season="summer">Summer</button>
          <button type="button" class="season-chip" data-season="autumn">Autumn</button>
          <button type="button" class="season-chip" data-season="winter">Winter</button>
        </div>
      </div>
    </div>
  </section>`,
  },
];

function pHref(relDepth, file) {
  return page(relDepth, file);
}

function buildDemo(def) {
  const rel = 2;
  const body = `
  <section class="hero">
    <div class="hero-media">
      <img src="${def.heroImg}" alt="${def.heroAlt}" />
      <div class="hero-overlay"></div>
    </div>
    <div class="container hero-content">
      <p class="eyebrow reveal">${def.brand}</p>
      <h1 class="display reveal reveal-delay-1">${def.headline}</h1>
      <p class="lead reveal reveal-delay-2">${def.lead}</p>
      <div class="btn-group reveal reveal-delay-3">
        <a class="btn btn-light" href="${pHref(rel, def.primaryCta.href)}">${def.primaryCta.label}</a>
        <a class="btn btn-ghost" href="${pHref(rel, def.secondaryCta.href)}">${def.secondaryCta.label}</a>
      </div>
    </div>
  </section>
  ${def.extra || ""}
  <section class="section">
    <div class="container">
      <div class="section-head reveal">
        <p class="eyebrow">${def.sectionEyebrow}</p>
        <h2 class="display">${def.sectionTitle}</h2>
        <p class="lead">${def.sectionLead}</p>
      </div>
      <div class="produce-grid">${produceItems}</div>
    </div>
  </section>
  <section class="band band-muted">
    <div class="container split">
      <div class="reveal">
        <p class="eyebrow">${def.splitEyebrow}</p>
        <h2 class="display">${def.splitTitle}</h2>
        <p class="lead" style="margin-top:1rem">${def.splitLead}</p>
        <div class="btn-group">
          <a class="btn btn-primary" href="${pHref(rel, def.splitBtn.href)}">${def.splitBtn.label}</a>
        </div>
      </div>
      <div class="media-frame reveal reveal-delay-1">
        <img src="${def.splitImg}" alt="${def.splitImgAlt}" loading="lazy" />
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="cta-strip reveal">
        <div>
          <h2 class="display" style="font-size:clamp(1.8rem,3vw,2.5rem)">${def.ctaTitle}</h2>
          <p class="lead">${def.ctaLead}</p>
        </div>
        <a class="btn btn-light" href="${pHref(rel, "contact.html")}">Request quote</a>
      </div>
    </div>
  </section>`;

  // Corporate ticker should appear after header/before or after hero - put after hero via extra already at top
  // For corporate, extra is ticker - place after hero by restructuring
  let finalBody = body;
  if (def.folder === "09-corporate") {
    finalBody = body.replace(
      `  ${def.extra || ""}\n  <section class="section">`,
      `  ${def.extra}\n  <section class="section">`
    );
  }
  if (def.folder === "04-export") {
    // stats band already in extra at top - move after produce? Fine at top after hero
  }

  const html = shell({
    title: def.title,
    theme: def.theme,
    relDepth: rel,
    body: finalBody,
    onDark: true,
    cta: def.cta,
  });

  const dir = path.join(ROOT, "demos", def.folder);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html);
  console.log("Wrote", def.folder);
}

function buildInnerPages() {
  const rel = 1;
  const pages = [
    {
      file: "about.html",
      theme: "market",
      title: "About",
      onDark: false,
      body: `
  <section class="page-hero">
    <div class="container">
      <p class="eyebrow">Company</p>
      <h1 class="display">Grown for trade. Built for trust.</h1>
      <p class="lead">Verdura connects vegetable growers, sellers, importers, and exporters — so produce moves with the care it deserves.</p>
    </div>
  </section>
  <section class="section">
    <div class="container split">
      <div class="reveal">
        <p class="eyebrow">Who we are</p>
        <h2 class="display">A vegetable house with global reach</h2>
        <p class="lead" style="margin-top:1rem">We started as a regional market seller and grew into a full import/export partner — still obsessed with freshness, now fluent in freight.</p>
        <p style="margin-top:1rem;color:var(--muted)">Today Verdura operates retail programs, wholesale docks, and cross-border lanes across dozens of destinations.</p>
      </div>
      <div class="media-frame reveal reveal-delay-1"><img src="${IMG.farm}" alt="Verdura farm partnership" loading="lazy" /></div>
    </div>
  </section>
  <section class="band band-muted">
    <div class="container">
      <div class="section-head center reveal"><p class="eyebrow">Values</p><h2 class="display">What we refuse to rush</h2></div>
      <div class="process">
        <div class="process-item reveal"><h3>Quality grading</h3><p>Size, color, and firmness standards agreed before the first crate ships.</p></div>
        <div class="process-item reveal reveal-delay-1"><h3>Cold discipline</h3><p>Pre-cool and continuous temperature logs from packing shed to destination.</p></div>
        <div class="process-item reveal reveal-delay-2"><h3>Clear paperwork</h3><p>Phytosanitary, origin, and organic docs prepared with the cargo — not after it.</p></div>
      </div>
    </div>
  </section>`,
    },
    {
      file: "products.html",
      theme: "wholesale",
      title: "Produce",
      onDark: false,
      body: `
  <section class="page-hero">
    <div class="container">
      <p class="eyebrow">Catalog</p>
      <h1 class="display">Vegetables for sale &amp; shipment</h1>
      <p class="lead">Retail packs, foodservice cuts, and export grades — sample lines for the Verdura template.</p>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="catalog">
        ${[
          ["Tomatoes — cluster", "Export / retail", "Spain · Morocco", "Market bid", IMG.tomatoes],
          ["Baby leafy mix", "Clamshell 150g", "Local greenhouse", "Contract", IMG.leafy],
          ["Bell peppers — tricolor", "Carton 5kg", "Netherlands", "Weekly", IMG.peppers],
          ["Carrots — jumbo", "Bulk bin", "Domestic", "Spot", IMG.carrots],
          ["Broccoli crowns", "Ice-packed", "Multi-origin", "Program", IMG.broccoli],
          ["Yellow onions", "Mesh 10kg", "Storage crop", "Forward", IMG.onions],
        ]
          .map(
            ([name, pack, origin, mode, img], i) => `
        <div class="catalog-row reveal${i ? ` reveal-delay-${Math.min(i, 3)}` : ""}">
          <img src="${img}" alt="${name}" loading="lazy" />
          <div><strong>${name}</strong><div style="color:var(--muted);font-size:.9rem">${pack}</div></div>
          <div class="hide-sm">${origin}</div>
          <div class="hide-sm">${mode}</div>
          <a class="btn btn-primary" style="min-height:2.4rem;padding:.45rem 1rem;font-size:.85rem" href="contact.html">RFQ</a>
        </div>`
          )
          .join("")}
      </div>
      <div style="margin-top:2.5rem" class="reveal">
        <div class="produce-grid">${produceItems}</div>
      </div>
    </div>
  </section>`,
    },
    {
      file: "services.html",
      theme: "export",
      title: "Trade services",
      onDark: false,
      body: `
  <section class="page-hero">
    <div class="container">
      <p class="eyebrow">Services</p>
      <h1 class="display">Sell locally. Ship globally.</h1>
      <p class="lead">End-to-end vegetable trading services — from farm gate sales to international delivery.</p>
    </div>
  </section>
  <section class="section">
    <div class="container process">
      <div class="process-item reveal"><h3>Vegetable selling</h3><p>Retail merchandising, wholesale sales desks, and private-label pack programs.</p></div>
      <div class="process-item reveal reveal-delay-1"><h3>Sourcing &amp; packing</h3><p>Grower networks, packing house oversight, and buyer-aligned specs.</p></div>
      <div class="process-item reveal reveal-delay-2"><h3>Import coordination</h3><p>Entry filings, cold storage, and inland distribution handoffs.</p></div>
      <div class="process-item reveal"><h3>Export execution</h3><p>Booking, documentation, and destination QC for outbound cargo.</p></div>
      <div class="process-item reveal reveal-delay-1"><h3>Quality claims</h3><p>Photo protocols, surveyors, and fair resolution when nature intervenes.</p></div>
      <div class="process-item reveal reveal-delay-2"><h3>Program planning</h3><p>Seasonal calendars that blend local peaks with import bridges.</p></div>
    </div>
  </section>
  <section class="band band-muted">
    <div class="container split">
      <div class="media-frame reveal"><img src="${IMG.crates}" alt="Packed vegetables ready for trade" loading="lazy" /></div>
      <div class="reveal reveal-delay-1">
        <p class="eyebrow">Engagement</p>
        <h2 class="display">Spot buys or season-long contracts</h2>
        <p class="lead" style="margin-top:1rem">Choose transactional RFQs or structured programs with volume bands and review cadences.</p>
        <div class="btn-group"><a class="btn btn-primary" href="contact.html">Talk to the desk</a></div>
      </div>
    </div>
  </section>`,
    },
    {
      file: "import-export.html",
      theme: "trade",
      title: "Import & Export",
      onDark: false,
      body: `
  <section class="page-hero">
    <div class="container">
      <p class="eyebrow">Cross-border</p>
      <h1 class="display">Import &amp; export lanes for vegetables</h1>
      <p class="lead">Documented, temperature-controlled movement of fresh vegetables between origins and markets.</p>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="section-head reveal"><p class="eyebrow">Lanes</p><h2 class="display">Sample corridors</h2></div>
      <div class="lanes">
        <div class="lane reveal"><strong>EU greenhouse → UK retail</strong><span>Tomato &amp; cucumber</span><span>Road reefer</span><span class="tag">Export</span></div>
        <div class="lane reveal"><strong>LatAm → North America</strong><span>Asparagus &amp; berries*</span><span>Air</span><span class="tag">Import</span></div>
        <div class="lane reveal"><strong>N. Africa → GCC</strong><span>Peppers &amp; beans</span><span>Sea reefer</span><span class="tag">Export</span></div>
        <div class="lane reveal"><strong>Asia herbs → EU</strong><span>Basil &amp; specialty leaves</span><span>Air</span><span class="tag">Import</span></div>
      </div>
      <p style="margin-top:1rem;font-size:.85rem;color:var(--muted)">*Demo content — berry line shown for mixed produce programs.</p>
    </div>
  </section>
  <section class="band band-ink">
    <div class="container">
      <div class="stat-row">
        <div class="stat reveal"><strong>Import</strong><span>Clearance + cold store</span></div>
        <div class="stat reveal reveal-delay-1"><strong>Export</strong><span>Docs + vessel booking</span></div>
        <div class="stat reveal reveal-delay-2"><strong>Transit</strong><span>Live temp telemetry</span></div>
        <div class="stat reveal reveal-delay-3"><strong>Arrival</strong><span>QC + claims desk</span></div>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container split">
      <div class="reveal">
        <p class="eyebrow">Checklist</p>
        <h2 class="display">What every shipment carries</h2>
        <ul style="margin-top:1.25rem;display:grid;gap:.65rem;color:var(--muted)">
          <li>— Commercial invoice &amp; packing list</li>
          <li>— Phytosanitary certificate</li>
          <li>— Temperature recorder / logger IDs</li>
          <li>— Origin &amp; lot traceability</li>
          <li>— Buyer spec confirmation</li>
        </ul>
      </div>
      <div class="media-frame reveal reveal-delay-1"><img src="${IMG.export}" alt="Export containers" loading="lazy" /></div>
    </div>
  </section>`,
    },
    {
      file: "contact.html",
      theme: "harbor",
      title: "Contact",
      onDark: false,
      body: `
  <section class="page-hero">
    <div class="container">
      <p class="eyebrow">Trade desk</p>
      <h1 class="display">Request a quote</h1>
      <p class="lead">Tell us what you need to sell, import, or export — we’ll respond within one business day.</p>
    </div>
  </section>
  <section class="section">
    <div class="container contact-layout">
      <div class="contact-info reveal">
        <div>
          <h3>Sales &amp; RFQ</h3>
          <p>trade@verdura.example<br />+1 (800) 555-0192</p>
        </div>
        <div>
          <h3>Harbor ops</h3>
          <p>Pier 12 Cold Complex<br />Weekdays 04:00–18:00</p>
        </div>
        <div class="map-placeholder">Verdura hub · Demo map</div>
      </div>
      <form class="reveal reveal-delay-1" data-demo-form>
        <div class="form-grid">
          <div class="form-row">
            <div class="field"><label for="name">Name</label><input id="name" name="name" required autocomplete="name" /></div>
            <div class="field"><label for="company">Company</label><input id="company" name="company" autocomplete="organization" /></div>
          </div>
          <div class="form-row">
            <div class="field"><label for="email">Email</label><input id="email" name="email" type="email" required autocomplete="email" /></div>
            <div class="field"><label for="interest">Interest</label>
              <select id="interest" name="interest">
                <option>Vegetable selling / wholesale</option>
                <option>Import program</option>
                <option>Export booking</option>
                <option>Organic supply</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div class="field"><label for="message">Cargo or product details</label><textarea id="message" name="message" placeholder="Volumes, origins, pack formats, delivery window…"></textarea></div>
          <button class="btn btn-primary" type="submit">Send request</button>
        </div>
      </form>
    </div>
  </section>`,
    },
  ];

  const dir = path.join(ROOT, "pages");
  fs.mkdirSync(dir, { recursive: true });
  for (const p of pages) {
    const html = shell({
      title: p.title,
      theme: p.theme,
      relDepth: rel,
      body: p.body,
      onDark: p.onDark,
      cta: "Request quote",
    });
    // Inner pages use solid header
    const withSolid = html
      .replace('class="site-header"', 'class="site-header is-solid"')
      .replace(" header-on-dark", "");
    fs.writeFileSync(path.join(dir, p.file), withSolid);
    console.log("Wrote pages/" + p.file);
  }
}

// Showcase index
function buildIndex() {
  const tiles = demoDefs
    .map((d, i) => {
      const num = String(i + 1).padStart(2, "0");
      return `
      <a class="demo-tile reveal${i % 3 === 1 ? " reveal-delay-1" : i % 3 === 2 ? " reveal-delay-2" : ""}" href="demos/${d.folder}/index.html">
        <img src="${d.heroImg}" alt="${d.title} demo preview" loading="lazy" />
        <div class="demo-tile-body">
          <div class="demo-num">Demo ${num}</div>
          <h2>${d.title}</h2>
          <p>${d.lead.slice(0, 110)}…</p>
          <span class="open">Open demo →</span>
        </div>
      </a>`;
    })
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Verdura — 10 Demo Vegetable Trade Template</title>
  <meta name="description" content="10-demo website template for vegetable selling and import/export. Verdura multi-concept HTML template." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Fraunces:opsz,wght@9..144,500;9..144,560;9..144,650&family=IBM+Plex+Mono:wght@400;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="assets/css/base.css" />
  <link rel="stylesheet" href="assets/css/components.css" />
  <link rel="stylesheet" href="assets/css/demos.css" />
</head>
<body class="showcase-body">
  <header class="showcase-hero">
    <div class="container">
      <p class="eyebrow reveal">HTML website template · 10 demos</p>
      <p class="brand-name reveal reveal-delay-1">Verdura</p>
      <p class="lead reveal reveal-delay-2">A multi-demo template for vegetable selling, wholesale, and import/export — ten homepage directions, one shared trade system.</p>
      <div class="btn-group reveal reveal-delay-3">
        <a class="btn btn-primary" href="demos/01-market/index.html">View first demo</a>
        <a class="btn btn-ghost" href="pages/contact.html">Contact page</a>
      </div>
    </div>
  </header>
  <main class="container">
    <div class="demo-grid">${tiles}</div>
  </main>
  <footer class="container showcase-footer">
    <div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:1rem">
      <span>Verdura template · Vegetable selling &amp; import/export</span>
      <span>Shared pages: About · Produce · Services · Import/Export · Contact</span>
    </div>
  </footer>
  <script src="assets/js/main.js"></script>
</body>
</html>
`;
  fs.writeFileSync(path.join(ROOT, "index.html"), html);
  console.log("Wrote index.html");
}

demoDefs.forEach(buildDemo);
buildInnerPages();
buildIndex();
console.log("Done.");
