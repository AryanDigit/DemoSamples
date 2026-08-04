#!/usr/bin/env node
/**
 * Builds Verdura professional website + optional 10-demo gallery.
 * Run: node scripts/build-pages.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

const IMG = {
  hero:
    "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=2200&q=80",
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
  market:
    "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=2000&q=80",
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

function navFixed(relDepth, { onDark = true, cta = "Request a quote" } = {}) {
  const dark = onDark ? " header-on-dark" : "";
  const demosHref =
    relDepth === 0
      ? "demos.html"
      : relDepth === 1
        ? "../demos.html"
        : "../../demos.html";
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
        <a href="${page(relDepth, "services.html")}">Services</a>
        <a href="${page(relDepth, "import-export.html")}">Import &amp; export</a>
        <a href="${page(relDepth, "about.html")}">About</a>
        <a href="${demosHref}">Demos</a>
        <a class="btn btn-ghost nav-cta" href="${page(relDepth, "contact.html")}">${cta}</a>
      </nav>
    </div>
  </header>`;
}

function footer(relDepth) {
  const demosHref =
    relDepth === 0
      ? "demos.html"
      : relDepth === 1
        ? "../demos.html"
        : "../../demos.html";
  return `
  <footer class="site-footer">
    <div class="container footer-grid">
      <div>
        <div class="logo"><span class="logo-mark logo-mark-theme" aria-hidden="true"></span> Verdura</div>
        <p class="footer-blurb">Professional vegetable selling, wholesale supply, and global import/export — from harvest to harbor.</p>
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
        <a href="${demosHref}">Homepage demos</a>
      </div>
      <div class="footer-col">
        <h4>Trade desk</h4>
        <a href="mailto:trade@verdura.example">trade@verdura.example</a>
        <a href="tel:+18005550192">+1 (800) 555-0192</a>
        <a href="${page(relDepth, "contact.html")}">RFQ form</a>
      </div>
    </div>
    <div class="container footer-bottom">
      <span>© ${new Date().getFullYear()} Verdura. Vegetable selling · Import · Export</span>
      <span>Demo content for template use</span>
    </div>
  </footer>`;
}

function shell({
  title,
  theme = "market",
  relDepth,
  body,
  onDark = true,
  cta,
  bodyClass = "",
  extraCss = "",
}) {
  const cssBase = asset(relDepth, "css/base.css");
  const cssComp = asset(relDepth, "css/components.css");
  const cssDemo = asset(relDepth, "css/demos.css");
  const cssPro = asset(relDepth, "css/professional.css");
  const js = asset(relDepth, "js/main.js");
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title} · Verdura</title>
  <meta name="description" content="Verdura — professional vegetable selling, wholesale, and import/export." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Fraunces:opsz,wght@9..144,500;9..144,560;9..144,650&family=IBM+Plex+Mono:wght@400;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="${cssBase}" />
  <link rel="stylesheet" href="${cssComp}" />
  <link rel="stylesheet" href="${cssDemo}" />
  <link rel="stylesheet" href="${cssPro}" />
  ${extraCss}
</head>
<body class="${bodyClass}" data-theme="${theme}">
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

/* ——— Professional company homepage ——— */
function buildHome() {
  const body = `
  <section class="hero">
    <div class="hero-media">
      <img src="${IMG.hero}" alt="Fresh vegetables at Verdura market and packing" />
      <div class="hero-overlay"></div>
    </div>
    <div class="container hero-content">
      <p class="eyebrow reveal">Vegetable selling · Import · Export</p>
      <h1 class="display reveal reveal-delay-1">Verdura</h1>
      <p class="lead reveal reveal-delay-2">A professional vegetable house for retailers, wholesalers, and cross-border buyers — fresh supply, documented quality, and cold-chain discipline.</p>
      <div class="btn-group reveal reveal-delay-3">
        <a class="btn btn-light" href="pages/contact.html">Request a quote</a>
        <a class="btn btn-ghost" href="pages/import-export.html">View trade lanes</a>
      </div>
    </div>
  </section>

  <div class="container">
    <div class="trust-strip reveal">
      <div class="trust-item"><strong>48</strong><span>Export destinations</span></div>
      <div class="trust-item"><strong>120+</strong><span>Grower partners</span></div>
      <div class="trust-item"><strong>99.1%</strong><span>On-spec arrivals</span></div>
      <div class="trust-item"><strong>24/7</strong><span>Trade desk coverage</span></div>
    </div>
  </div>

  <section class="section">
    <div class="container">
      <div class="section-head reveal">
        <p class="eyebrow">What we do</p>
        <h2 class="display">Sell locally. Source globally. Ship with care.</h2>
        <p class="lead">Verdura connects farm supply to market demand — whether you need retail packs tomorrow or a seasonal import program.</p>
      </div>
      <div class="pillar-grid">
        <article class="pillar reveal">
          <p class="eyebrow">01</p>
          <h3>Vegetable selling</h3>
          <p>Retail merchandising, wholesale docks, and foodservice cuts with clear pack formats and daily availability.</p>
          <a href="pages/products.html">Browse produce →</a>
        </article>
        <article class="pillar reveal reveal-delay-1">
          <p class="eyebrow">02</p>
          <h3>Import programs</h3>
          <p>Bridging seasonal gaps with certified origins, entry coordination, and cold storage handoffs.</p>
          <a href="pages/import-export.html">Import overview →</a>
        </article>
        <article class="pillar reveal reveal-delay-2">
          <p class="eyebrow">03</p>
          <h3>Export execution</h3>
          <p>Phytosanitary files, reefer bookings, and destination QC so cargo arrives market-ready.</p>
          <a href="pages/services.html">Export services →</a>
        </article>
      </div>
    </div>
  </section>

  <section class="band band-muted">
    <div class="container split">
      <div class="reveal">
        <p class="eyebrow">Produce</p>
        <h2 class="display">Catalog built for buyers who move volume</h2>
        <p class="lead" style="margin-top:1rem">From greenhouse tomatoes to storage onions — graded, packed, and priced for retail, wholesale, and export programs.</p>
        <div class="btn-group">
          <a class="btn btn-primary" href="pages/products.html">Full catalog</a>
          <a class="btn btn-ghost" href="pages/contact.html" style="border-color:var(--brand);color:var(--brand-deep)">Ask for a cut list</a>
        </div>
      </div>
      <div class="media-frame reveal reveal-delay-1">
        <img src="${IMG.crates}" alt="Vegetable crates ready for distribution" loading="lazy" />
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head reveal">
        <p class="eyebrow">Featured lines</p>
        <h2 class="display">This week’s highlight crops</h2>
      </div>
      <div class="produce-grid">${produceItems}</div>
    </div>
  </section>

  <section class="band band-ink">
    <div class="container">
      <div class="pro-quote">
        <div class="reveal">
          <blockquote>“Verdura treats temperature and paperwork with the same seriousness as the produce itself. That is rare — and it shows on arrival.”</blockquote>
          <cite><strong>Elena Marquez</strong>Procurement Director, North Atlantic Retail</cite>
        </div>
        <div class="reveal reveal-delay-1">
          <div class="stat-row" style="border:none;padding:0;grid-template-columns:1fr 1fr;gap:1.5rem">
            <div class="stat"><strong>14</strong><span>Years in trade</span></div>
            <div class="stat"><strong>6</strong><span>Packing hubs</span></div>
            <div class="stat"><strong>3</strong><span>Port partnerships</span></div>
            <div class="stat"><strong>1</strong><span>Promise: on-spec</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container split">
      <div class="media-frame reveal">
        <img src="${IMG.export}" alt="Port containers for vegetable export" loading="lazy" />
      </div>
      <div class="reveal reveal-delay-1">
        <p class="eyebrow">Import &amp; export</p>
        <h2 class="display">Lanes that clear customs cleanly</h2>
        <p class="lead" style="margin-top:1rem">We plan plantings against calendars, book capacity early, and keep lot traceability from field block to destination dock.</p>
        <div class="lanes" style="margin-top:1.5rem">
          <div class="lane"><strong>Med → N. Europe</strong><span>Tomato &amp; pepper</span><span>Reefer</span><span class="tag">Export</span></div>
          <div class="lane"><strong>Andes → US East</strong><span>Asparagus</span><span>Air</span><span class="tag">Import</span></div>
          <div class="lane"><strong>Domestic hubs</strong><span>Mixed SKUs</span><span>Overnight</span><span class="tag">Wholesale</span></div>
        </div>
        <div class="btn-group">
          <a class="btn btn-primary" href="pages/import-export.html">All corridors</a>
        </div>
      </div>
    </div>
  </section>

  <section class="band band-muted">
    <div class="container">
      <div class="section-head reveal">
        <p class="eyebrow">Process</p>
        <h2 class="display">How a Verdura shipment works</h2>
      </div>
      <div class="process">
        <div class="process-item reveal"><h3>Spec &amp; source</h3><p>Agree grade, pack, and origin. Match growers to your volume and calendar.</p></div>
        <div class="process-item reveal reveal-delay-1"><h3>Pack &amp; pre-cool</h3><p>Harvest windows, QC photos, and continuous temperature logs from the shed.</p></div>
        <div class="process-item reveal reveal-delay-2"><h3>Ship &amp; settle</h3><p>Docs travel with the cargo. Arrival QC and fair claims if nature intervenes.</p></div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head reveal">
        <p class="eyebrow">FAQ</p>
        <h2 class="display">Common buyer questions</h2>
      </div>
      <div class="faq reveal">
        <details>
          <summary>Do you sell retail packs and bulk pallets?</summary>
          <p>Yes. We support retail-ready packs, foodservice cuts, and pallet-scale wholesale for distributors and multi-store retailers.</p>
        </details>
        <details>
          <summary>Can you handle both import and export?</summary>
          <p>Yes. Verdura runs inbound bridging programs and outbound export bookings with phytosanitary documentation and cold-chain monitoring.</p>
        </details>
        <details>
          <summary>How fast do you respond to RFQs?</summary>
          <p>Our trade desk aims to respond within one business day with availability, pack options, and indicative pricing.</p>
        </details>
        <details>
          <summary>Do you offer organic lines?</summary>
          <p>We maintain certified organic programs with lot-level traceability and audit-ready documentation for retail buyers.</p>
        </details>
      </div>

      <div class="cta-strip reveal" style="margin-top:3rem">
        <div>
          <h2 class="display" style="font-size:clamp(1.8rem,3vw,2.5rem)">Ready to stock or ship?</h2>
          <p class="lead">Tell us volumes, origins, and delivery windows — we’ll build a clear quote.</p>
        </div>
        <a class="btn btn-light" href="pages/contact.html">Contact the desk</a>
      </div>

      <div class="demos-bar reveal">
        <div>
          <strong>Looking for alternate homepage layouts?</strong>
          <p>Explore 10 design demos for market, trade, export, and more.</p>
        </div>
        <a class="btn btn-primary" href="demos.html">View demos</a>
      </div>
    </div>
  </section>`;

  const html = shell({
    title: "Vegetable Selling & Import/Export",
    theme: "market",
    relDepth: 0,
    body,
    onDark: true,
    cta: "Request a quote",
    bodyClass: "pro-body",
  });
  fs.writeFileSync(path.join(ROOT, "index.html"), html);
  console.log("Wrote index.html (professional site)");
}

/* ——— Demo gallery ——— */
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
    heroAlt: "Warehouse distribution for trade",
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

  const html = shell({
    title: def.title + " Demo",
    theme: def.theme,
    relDepth: rel,
    body,
    onDark: true,
    cta: def.cta,
  });

  const dir = path.join(ROOT, "demos", def.folder);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html);
  console.log("Wrote", def.folder);
}

function buildDemosGallery() {
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
  <title>Homepage Demos · Verdura</title>
  <meta name="description" content="10 homepage demos for the Verdura vegetable trade website template." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Fraunces:opsz,wght@9..144,500;9..144,560;9..144,650&family=IBM+Plex+Mono:wght@400;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="assets/css/base.css" />
  <link rel="stylesheet" href="assets/css/components.css" />
  <link rel="stylesheet" href="assets/css/demos.css" />
  <link rel="stylesheet" href="assets/css/professional.css" />
</head>
<body class="showcase-body">
  <header class="site-header is-solid">
    <div class="container nav">
      <a class="logo" href="index.html"><span class="logo-mark logo-mark-theme" aria-hidden="true"></span> Verdura</a>
      <button class="nav-toggle" aria-label="Open menu" aria-expanded="false"><span></span></button>
      <nav class="nav-links" aria-label="Primary">
        <a href="pages/products.html">Produce</a>
        <a href="pages/services.html">Services</a>
        <a href="pages/import-export.html">Import &amp; export</a>
        <a href="index.html">Main site</a>
        <a class="btn btn-ghost nav-cta" href="pages/contact.html" style="border-color:var(--brand);color:var(--brand-deep)">Request a quote</a>
      </nav>
    </div>
  </header>
  <header class="showcase-hero" style="padding-top:2.5rem">
    <div class="container">
      <p class="eyebrow reveal">Template gallery · 10 demos</p>
      <p class="brand-name reveal reveal-delay-1" style="font-size:clamp(2.5rem,7vw,4.5rem)">Homepage demos</p>
      <p class="lead reveal reveal-delay-2">Alternate visual directions for the Verdura vegetable selling and import/export template. The main professional site is <a href="index.html" style="color:var(--brand);font-weight:600">index.html</a>.</p>
    </div>
  </header>
  <main class="container">
    <div class="demo-grid">${tiles}</div>
  </main>
  <footer class="container showcase-footer">
    <div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:1rem">
      <span>Verdura demos · Vegetable selling &amp; import/export</span>
      <a href="index.html" style="font-weight:600;color:var(--brand)">← Back to main site</a>
    </div>
  </footer>
  <script src="assets/js/main.js"></script>
</body>
</html>
`;
  fs.writeFileSync(path.join(ROOT, "demos.html"), html);
  console.log("Wrote demos.html");
}

function buildInnerPages() {
  const rel = 1;
  const pages = [
    {
      file: "about.html",
      theme: "market",
      title: "About",
      body: `
  <section class="page-hero">
    <div class="container">
      <p class="eyebrow">Company</p>
      <h1 class="display">Grown for trade. Built for trust.</h1>
      <p class="lead">Verdura is a professional vegetable house — selling fresh produce, managing wholesale programs, and executing import/export with cold-chain discipline.</p>
    </div>
  </section>
  <section class="section">
    <div class="container split">
      <div class="reveal">
        <p class="eyebrow">Who we are</p>
        <h2 class="display">From regional market to global lanes</h2>
        <p class="lead" style="margin-top:1rem">We started as a regional seller and grew into a full trade partner — still obsessed with freshness, now fluent in freight, documentation, and multi-origin sourcing.</p>
        <p style="margin-top:1rem;color:var(--muted)">Today Verdura serves retailers, distributors, foodservice operators, and international buyers across dozens of destinations.</p>
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
  </section>
  <section class="section">
    <div class="container">
      <div class="section-head reveal"><p class="eyebrow">Origins</p><h2 class="display">Where we source</h2></div>
      <div class="origin-grid">
        <div class="origin-item reveal"><span class="origin-dot"></span><div><h3>Domestic fields</h3><p>Seasonal peaks for leafy greens, roots, and alliums with overnight dock delivery.</p></div></div>
        <div class="origin-item reveal"><span class="origin-dot"></span><div><h3>Mediterranean greenhouses</h3><p>Tomato, cucumber, and pepper programs for European and Middle East retail.</p></div></div>
        <div class="origin-item reveal"><span class="origin-dot"></span><div><h3>Andean highlands</h3><p>Asparagus and specialty lines for North American import windows.</p></div></div>
        <div class="origin-item reveal"><span class="origin-dot"></span><div><h3>Controlled environment</h3><p>Year-round herbs and baby leaf with consistent pack and label standards.</p></div></div>
      </div>
    </div>
  </section>`,
    },
    {
      file: "products.html",
      theme: "wholesale",
      title: "Produce",
      body: `
  <section class="page-hero">
    <div class="container">
      <p class="eyebrow">Catalog</p>
      <h1 class="display">Vegetables for sale &amp; shipment</h1>
      <p class="lead">Retail packs, foodservice cuts, and export grades — professional lines for buyers who need clarity on pack, origin, and mode.</p>
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
      <div class="cta-strip reveal" style="margin-top:3rem">
        <div>
          <h2 class="display" style="font-size:clamp(1.6rem,3vw,2.2rem)">Need a custom cut list?</h2>
          <p class="lead">Send volumes and delivery windows — we’ll confirm packs and pricing.</p>
        </div>
        <a class="btn btn-light" href="contact.html">Request pricing</a>
      </div>
    </div>
  </section>`,
    },
    {
      file: "services.html",
      theme: "export",
      title: "Services",
      body: `
  <section class="page-hero">
    <div class="container">
      <p class="eyebrow">Services</p>
      <h1 class="display">Professional trade services</h1>
      <p class="lead">End-to-end vegetable trading — from farm-gate sales to international delivery and claims support.</p>
    </div>
  </section>
  <section class="section">
    <div class="container pillar-grid">
      <article class="pillar reveal"><p class="eyebrow">Sell</p><h3>Vegetable selling</h3><p>Retail merchandising, wholesale sales desks, and private-label pack programs.</p></article>
      <article class="pillar reveal reveal-delay-1"><p class="eyebrow">Source</p><h3>Sourcing &amp; packing</h3><p>Grower networks, packing house oversight, and buyer-aligned specs.</p></article>
      <article class="pillar reveal reveal-delay-2"><p class="eyebrow">Import</p><h3>Import coordination</h3><p>Entry filings, cold storage, and inland distribution handoffs.</p></article>
      <article class="pillar reveal"><p class="eyebrow">Export</p><h3>Export execution</h3><p>Booking, documentation, and destination QC for outbound cargo.</p></article>
      <article class="pillar reveal reveal-delay-1"><p class="eyebrow">Quality</p><h3>Quality claims</h3><p>Photo protocols, surveyors, and fair resolution when nature intervenes.</p></article>
      <article class="pillar reveal reveal-delay-2"><p class="eyebrow">Plan</p><h3>Program planning</h3><p>Seasonal calendars that blend local peaks with import bridges.</p></article>
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
      body: `
  <section class="page-hero">
    <div class="container">
      <p class="eyebrow">Cross-border</p>
      <h1 class="display">Import &amp; export for vegetables</h1>
      <p class="lead">Documented, temperature-controlled movement of fresh vegetables between origins and markets.</p>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="section-head reveal"><p class="eyebrow">Lanes</p><h2 class="display">Active corridors</h2></div>
      <div class="lanes">
        <div class="lane reveal"><strong>EU greenhouse → UK retail</strong><span>Tomato &amp; cucumber</span><span>Road reefer</span><span class="tag">Export</span></div>
        <div class="lane reveal"><strong>LatAm → North America</strong><span>Asparagus programs</span><span>Air</span><span class="tag">Import</span></div>
        <div class="lane reveal"><strong>N. Africa → GCC</strong><span>Peppers &amp; beans</span><span>Sea reefer</span><span class="tag">Export</span></div>
        <div class="lane reveal"><strong>Asia herbs → EU</strong><span>Basil &amp; specialty leaves</span><span>Air</span><span class="tag">Import</span></div>
      </div>
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
        <div class="btn-group"><a class="btn btn-primary" href="contact.html">Start an RFQ</a></div>
      </div>
      <div class="media-frame reveal reveal-delay-1"><img src="${IMG.export}" alt="Export containers" loading="lazy" /></div>
    </div>
  </section>`,
    },
    {
      file: "contact.html",
      theme: "harbor",
      title: "Contact",
      body: `
  <section class="page-hero">
    <div class="container">
      <p class="eyebrow">Trade desk</p>
      <h1 class="display">Request a quote</h1>
      <p class="lead">Tell us what you need to sell, import, or export — we respond within one business day.</p>
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
        <div>
          <h3>Office</h3>
          <p>Verdura Trade Floor<br />120 Harbor Avenue</p>
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
      onDark: false,
      cta: "Request a quote",
      bodyClass: "pro-body",
    });
    const withSolid = html
      .replace('class="site-header"', 'class="site-header is-solid"')
      .replace(" header-on-dark", "");
    fs.writeFileSync(path.join(dir, p.file), withSolid);
    console.log("Wrote pages/" + p.file);
  }
}

buildHome();
demoDefs.forEach(buildDemo);
buildDemosGallery();
buildInnerPages();
console.log("Done.");
