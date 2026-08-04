#!/usr/bin/env node
/**
 * Builds Queentana Fresh professional website + optional demos.
 * Reference: https://www.queentana.co.uk/
 * Run: node scripts/build-pages.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const BRAND = "Queentana";
const BRAND_FULL = "Queentana Fresh";
const PHONE = "+44 (0) 208 538 0269";
const EMAIL = "trading@queentana.co.uk";
const SITE = "https://www.queentana.co.uk/";

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
  citrus:
    "https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=900&q=80",
  chilli:
    "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=900&q=80",
  mango:
    "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=900&q=80",
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

function navFixed(relDepth, { onDark = true, cta = "Get in touch" } = {}) {
  const dark = onDark ? " header-on-dark" : "";
  const demosHref =
    relDepth === 0 ? "demos.html" : relDepth === 1 ? "../demos.html" : "../../demos.html";
  return `
  <header class="site-header${dark}">
    <div class="container nav">
      <a class="logo" href="${fixLogoHref(relDepth)}">
        <span class="logo-mark logo-mark-theme" aria-hidden="true"></span>
        ${BRAND}
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
    relDepth === 0 ? "demos.html" : relDepth === 1 ? "../demos.html" : "../../demos.html";
  return `
  <footer class="site-footer">
    <div class="container footer-grid">
      <div>
        <div class="logo"><span class="logo-mark logo-mark-theme" aria-hidden="true"></span> ${BRAND_FULL}</div>
        <p class="footer-blurb">Wholesale fresh fruit and vegetables for retailers, wholesalers, foodservice and hospitality across the UK &amp; EU.</p>
        <p class="footer-blurb" style="margin-top:.75rem">Reference site: <a href="${SITE}" target="_blank" rel="noopener">${SITE.replace("https://","")}</a></p>
      </div>
      <div class="footer-col">
        <h4>Explore</h4>
        <a href="${page(relDepth, "products.html")}">Produce ranges</a>
        <a href="${page(relDepth, "services.html")}">Trade services</a>
        <a href="${page(relDepth, "import-export.html")}">Import &amp; export</a>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <a href="${page(relDepth, "about.html")}">About ${BRAND}</a>
        <a href="${page(relDepth, "contact.html")}">Contact</a>
        <a href="${demosHref}">Homepage demos</a>
        <a href="${SITE}" target="_blank" rel="noopener">queentana.co.uk</a>
      </div>
      <div class="footer-col">
        <h4>Trade desk</h4>
        <a href="mailto:${EMAIL}">${EMAIL}</a>
        <a href="tel:+442085380269">${PHONE}</a>
        <a href="${page(relDepth, "contact.html")}">Trade enquiry</a>
      </div>
    </div>
    <div class="container footer-bottom">
      <span>© ${new Date().getFullYear()} ${BRAND_FULL}. Demo inspired by <a href="${SITE}" style="color:inherit" target="_blank" rel="noopener">queentana.co.uk</a></span>
      <span>UK &amp; EU · Wholesale · Import · Export</span>
    </div>
  </footer>`;
}

function shell({ title, theme = "market", relDepth, body, onDark = true, cta, bodyClass = "" }) {
  const css = ["base.css", "components.css", "demos.css", "professional.css"]
    .map((f) => `  <link rel="stylesheet" href="${asset(relDepth, "css/" + f)}" />`)
    .join("\n");
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title} · ${BRAND_FULL}</title>
  <meta name="description" content="${BRAND_FULL} — wholesale fresh produce supplier UK & EU. Fruit & vegetables, cold-chain logistics, import & export." />
  <link rel="canonical" href="${SITE}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Fraunces:opsz,wght@9..144,500;9..144,560;9..144,650&family=IBM+Plex+Mono:wght@400;600&display=swap" rel="stylesheet" />
${css}
</head>
<body class="${bodyClass}" data-theme="${theme}">
${navFixed(relDepth, { onDark, cta })}
${body}
${footer(relDepth)}
  <script src="${asset(relDepth, "js/main.js")}"></script>
</body>
</html>
`;
}

const produceItems = `
        <div class="produce-item reveal">
          <img src="${IMG.tomatoes}" alt="Tomatoes" loading="lazy" />
          <div class="produce-meta"><strong>Core vegetables</strong><span>Tomatoes, peppers, courgettes, cucumbers</span></div>
        </div>
        <div class="produce-item reveal reveal-delay-1">
          <img src="${IMG.onions}" alt="Onions" loading="lazy" />
          <div class="produce-meta"><strong>Onions &amp; scallions</strong><span>Red, golden, shallots, leeks</span></div>
        </div>
        <div class="produce-item reveal reveal-delay-2">
          <img src="${IMG.carrots}" alt="Root vegetables" loading="lazy" />
          <div class="produce-meta"><strong>Root vegetables</strong><span>Sweet potatoes, carrots &amp; roots</span></div>
        </div>
        <div class="produce-item reveal">
          <img src="${IMG.leafy}" alt="Exotic vegetables" loading="lazy" />
          <div class="produce-meta"><strong>Exotic vegetables</strong><span>Okra, fine beans, baby corn</span></div>
        </div>
        <div class="produce-item reveal reveal-delay-1">
          <img src="${IMG.mango}" alt="Exotic fruits" loading="lazy" onerror="this.src='${IMG.peppers}'" />
          <div class="produce-meta"><strong>Exotic fruits</strong><span>Mango, avocado, papaya, dragon fruit</span></div>
        </div>
        <div class="produce-item reveal reveal-delay-2">
          <img src="${IMG.citrus}" alt="Citrus" loading="lazy" onerror="this.src='${IMG.broccoli}'" />
          <div class="produce-meta"><strong>Citrus &amp; chillies</strong><span>Lemons, limes · Scotch Bonnet to Jalapeño</span></div>
        </div>`;

function buildHome() {
  const body = `
  <section class="hero">
    <div class="hero-media">
      <img src="${IMG.hero}" alt="Wholesale fresh fruit and vegetables from Queentana Fresh" />
      <div class="hero-overlay"></div>
    </div>
    <div class="container hero-content">
      <p class="eyebrow reveal">Welcome to ${BRAND_FULL}</p>
      <h1 class="display reveal reveal-delay-1">${BRAND}</h1>
      <p class="lead reveal reveal-delay-2">Suppliers of wholesale fruit and vegetables in the UK &amp; EU — premium produce for retailers, wholesalers, foodservice and hospitality.</p>
      <div class="btn-group reveal reveal-delay-3">
        <a class="btn btn-light" href="pages/contact.html">Trade enquiry</a>
        <a class="btn btn-ghost" href="pages/products.html">View produce</a>
      </div>
    </div>
  </section>

  <div class="container">
    <div class="trust-strip reveal">
      <div class="trust-item"><strong>20+</strong><span>Years in business</span></div>
      <div class="trust-item"><strong>30+</strong><span>Countries sourced</span></div>
      <div class="trust-item"><strong>UK &amp; EU</strong><span>Delivery network</span></div>
      <div class="trust-item"><strong>Next-day</strong><span>Where available</span></div>
    </div>
  </div>

  <section class="section">
    <div class="container">
      <div class="section-head reveal">
        <p class="eyebrow">Freshness delivered</p>
        <h2 class="display">Wholesale fresh produce for retailers, distributors &amp; foodservice</h2>
        <p class="lead">We deliver across the UK &amp; EU with cold-chain logistics and transparent service — fresh, on time, and exactly as specified.</p>
      </div>
      <div class="pillar-grid">
        <article class="pillar reveal">
          <p class="eyebrow">01</p>
          <h3>Wholesale supply</h3>
          <p>Everyday staples to exotic specialities, packed for greengrocers, depots, markets and catering operators.</p>
          <a href="pages/products.html">Produce ranges →</a>
        </article>
        <article class="pillar reveal reveal-delay-1">
          <p class="eyebrow">02</p>
          <h3>Cold-chain logistics</h3>
          <p>Temperature-controlled handling from field to final delivery so quality holds through the journey.</p>
          <a href="pages/services.html">Our services →</a>
        </article>
        <article class="pillar reveal reveal-delay-2">
          <p class="eyebrow">03</p>
          <h3>Import &amp; export</h3>
          <p>Global grower partnerships and trade lanes supporting UK–EU fruit and vegetable programmes.</p>
          <a href="pages/import-export.html">Trade corridors →</a>
        </article>
      </div>
    </div>
  </section>

  <section class="band band-muted">
    <div class="container split">
      <div class="reveal">
        <p class="eyebrow">Ranges</p>
        <h2 class="display">From core staples to exotic specialities</h2>
        <p class="lead" style="margin-top:1rem">Core vegetables, onions, roots, exotic lines, tropical fruit, citrus, chillies, ginger and garlic — sourced for consistency and competitive pricing.</p>
        <div class="btn-group">
          <a class="btn btn-primary" href="pages/products.html">Browse catalogue</a>
          <a class="btn btn-ghost" href="${SITE}" target="_blank" rel="noopener" style="border-color:var(--brand);color:var(--brand-deep)">Visit queentana.co.uk</a>
        </div>
      </div>
      <div class="media-frame reveal reveal-delay-1">
        <img src="${IMG.crates}" alt="Wholesale produce crates" loading="lazy" />
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head reveal">
        <p class="eyebrow">Produce</p>
        <h2 class="display">What we supply</h2>
      </div>
      <div class="produce-grid">${produceItems}</div>
    </div>
  </section>

  <section class="band band-ink">
    <div class="container">
      <div class="pro-quote">
        <div class="reveal">
          <blockquote>Fresh. Reliable. Quality. Your strategic fresh produce partner across the UK &amp; EU.</blockquote>
          <cite><strong>${BRAND_FULL}</strong>More than 20 years supplying trade buyers with market-responsive produce.</cite>
        </div>
        <div class="reveal reveal-delay-1">
          <div class="stat-row" style="border:none;padding:0;grid-template-columns:1fr 1fr;gap:1.5rem">
            <div class="stat"><strong>Retail</strong><span>Independent &amp; multi-site</span></div>
            <div class="stat"><strong>Wholesale</strong><span>Depots &amp; markets</span></div>
            <div class="stat"><strong>Foodservice</strong><span>Catering &amp; hospitality</span></div>
            <div class="stat"><strong>Trade</strong><span>Import / export brokers</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container split">
      <div class="media-frame reveal">
        <img src="${IMG.export}" alt="UK and EU produce logistics" loading="lazy" />
      </div>
      <div class="reveal reveal-delay-1">
        <p class="eyebrow">UK &amp; EU network</p>
        <h2 class="display">London-based. Europe-ready.</h2>
        <p class="lead" style="margin-top:1rem">Head office in London, with distribution across major UK and European cities. Next-day dispatch where available.</p>
        <div class="lanes" style="margin-top:1.5rem">
          <div class="lane"><strong>UK wholesale</strong><span>Markets &amp; depots</span><span>Next-day*</span><span class="tag">Supply</span></div>
          <div class="lane"><strong>EU programmes</strong><span>Fruit &amp; veg</span><span>Cold-chain</span><span class="tag">Export</span></div>
          <div class="lane"><strong>Global origins</strong><span>30+ countries</span><span>Direct growers</span><span class="tag">Import</span></div>
        </div>
        <p style="margin-top:.75rem;font-size:.85rem;color:var(--muted)">*Where available</p>
      </div>
    </div>
  </section>

  <section class="band band-muted">
    <div class="container">
      <div class="section-head reveal">
        <p class="eyebrow">Process</p>
        <h2 class="display">How we work with trade buyers</h2>
      </div>
      <div class="process">
        <div class="process-item reveal"><h3>Tell us your needs</h3><p>Share volumes, lines and delivery windows — retail, wholesale or foodservice.</p></div>
        <div class="process-item reveal reveal-delay-1"><h3>We source &amp; pack</h3><p>Direct grower partnerships, flexible volumes from pallets to multi-container.</p></div>
        <div class="process-item reveal reveal-delay-2"><h3>Deliver fresh</h3><p>Cold-chain logistics with clear updates from dispatch to arrival.</p></div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head reveal">
        <p class="eyebrow">FAQs</p>
        <h2 class="display">Common questions</h2>
      </div>
      <div class="faq reveal">
        <details open>
          <summary>Who does ${BRAND_FULL} supply?</summary>
          <p>We supply retailers, wholesalers, foodservice distributors, and hospitality businesses across the UK and EU — from local greengrocers to large catering operators.</p>
        </details>
        <details>
          <summary>Where are you based?</summary>
          <p>Our head office is in London, with distribution networks across major UK and European cities.</p>
        </details>
        <details>
          <summary>Do you deliver directly to markets and wholesalers?</summary>
          <p>Yes. We supply wholesalers, catering businesses, major depots, produce markets and independent retailers. Orders are packed and dispatched for next-day delivery where available.</p>
        </details>
        <details>
          <summary>What products do you specialise in?</summary>
          <p>Core vegetables, onions, root crops, exotic vegetables, tropical fruits, citrus, chillies, ginger and garlic. Strengths include sweet potatoes, fine beans, chillies and other specialty produce sourced globally.</p>
        </details>
        <details>
          <summary>How can I open a trade account?</summary>
          <p>Complete our enquiry form with your company details. Our team reviews requests and aims to respond within 1–2 business days.</p>
        </details>
      </div>

      <div class="cta-strip reveal" style="margin-top:3rem">
        <div>
          <h2 class="display" style="font-size:clamp(1.8rem,3vw,2.5rem)">Need a reliable fresh produce partner?</h2>
          <p class="lead">Whether you’re scaling up or streamlining, we’re ready to support you.</p>
        </div>
        <a class="btn btn-light" href="pages/contact.html">Get in touch</a>
      </div>

      <div class="demos-bar reveal">
        <div>
          <strong>Official website</strong>
          <p>This demo is inspired by <a href="${SITE}" target="_blank" rel="noopener">queentana.co.uk</a> — open alternate homepage layouts below.</p>
        </div>
        <a class="btn btn-primary" href="demos.html">View demos</a>
      </div>
    </div>
  </section>`;

  fs.writeFileSync(
    path.join(ROOT, "index.html"),
    shell({
      title: "Wholesale Fresh Produce UK & EU",
      theme: "market",
      relDepth: 0,
      body,
      onDark: true,
      cta: "Get in touch",
      bodyClass: "pro-body",
    })
  );
  console.log("Wrote index.html");
}

const demoDefs = [
  { folder: "01-market", theme: "market", title: "Market", cta: "Shop produce", heroImg: IMG.market, heroAlt: "Fresh produce market", brand: `${BRAND} Market`, headline: BRAND, lead: "Morning-ready wholesale fruit and vegetables for greengrocers and neighbourhood retailers across the UK.", primaryCta: { label: "Browse produce", href: "products.html" }, secondaryCta: { label: "Trade enquiry", href: "contact.html" }, sectionEyebrow: "Today’s lines", sectionTitle: "Fresh staples, market-ready", sectionLead: "Retail-first layout for independent greengrocers and produce markets.", splitEyebrow: "Supply", splitTitle: "Packed for the stall and the shelf", splitLead: "Core vegetables and specialty lines graded and packed for next-day wholesale where available.", splitImg: IMG.crates, splitImgAlt: "Produce crates", splitBtn: { label: "Services", href: "services.html" }, ctaTitle: `Stock with ${BRAND_FULL}`, ctaLead: "Wholesale cartons and pallet formats for UK buyers.", extra: "" },
  { folder: "02-trade", theme: "trade", title: "Trade", cta: "Open RFQ", heroImg: IMG.trade, heroAlt: "Wholesale warehouse", brand: `${BRAND} Trade`, headline: BRAND, lead: "Cross-border fruit and vegetable trading with cold-chain discipline for UK & EU partners.", primaryCta: { label: "Start an RFQ", href: "contact.html" }, secondaryCta: { label: "View corridors", href: "import-export.html" }, sectionEyebrow: "Trade lanes", sectionTitle: "Produce that moves on schedule", sectionLead: "B2B layout for importers, exporters and wholesale distributors.", splitEyebrow: "Desk", splitTitle: "Specs, volumes and ship dates", splitLead: "Match buyers to grower programmes and track temperature-controlled loads to arrival.", splitImg: IMG.ship, splitImgAlt: "Export logistics", splitBtn: { label: "Import & export", href: "import-export.html" }, ctaTitle: "Need volume this week?", ctaLead: "Our trade desk responds quickly to wholesale RFQs.", extra: `
  <section class="section" style="padding-top:0"><div class="container"><div class="lanes">
    <div class="lane reveal"><strong>UK markets &amp; depots</strong><span>Mixed produce</span><span>Next-day*</span><span class="tag">Supply</span></div>
    <div class="lane reveal"><strong>EU wholesale</strong><span>Core &amp; exotic</span><span>Cold-chain</span><span class="tag">Export</span></div>
    <div class="lane reveal"><strong>Global origins</strong><span>30+ countries</span><span>Direct growers</span><span class="tag">Import</span></div>
  </div></div></section>` },
  { folder: "03-organic", theme: "organic", title: "Specialty", cta: "View lines", heroImg: IMG.organic, heroAlt: "Specialty produce fields", brand: `${BRAND} Specialty`, headline: BRAND, lead: "Specialty and exotic lines — okra, fine beans, chillies and tropicals for chefs and ethnic retail.", primaryCta: { label: "Specialty catalogue", href: "products.html" }, secondaryCta: { label: "Talk to us", href: "contact.html" }, sectionEyebrow: "Speciality", sectionTitle: "Lines chefs rely on", sectionLead: "Foodservice and ethnic market focused demo.", splitEyebrow: "Quality", splitTitle: "Sourced for freshness and flavour", splitLead: "Direct-from-grower programmes for consistent availability on specialty SKUs.", splitImg: IMG.greenhouse, splitImgAlt: "Specialty growing", splitBtn: { label: "About us", href: "about.html" }, ctaTitle: "Build a specialty programme", ctaLead: "Fine beans, chillies, sweet potatoes and more.", extra: "" },
  { folder: "04-export", theme: "export", title: "Export", cta: "Book supply", heroImg: IMG.export, heroAlt: "Port logistics", brand: `${BRAND} Export`, headline: BRAND, lead: "Export-ready fruit and vegetable programmes with documentation and cold-chain for EU buyers.", primaryCta: { label: "Export services", href: "services.html" }, secondaryCta: { label: "Corridors", href: "import-export.html" }, sectionEyebrow: "Outbound", sectionTitle: "Packed for the journey", sectionLead: "Logistics-forward demo for exporters.", splitEyebrow: "Cold chain", splitTitle: "Temperature is non-negotiable", splitLead: "Pre-cool, monitoring and arrival QC so cargo stays market-ready.", splitImg: IMG.ship, splitImgAlt: "Reefer export", splitBtn: { label: "Checklist", href: "import-export.html" }, ctaTitle: "Reserve capacity", ctaLead: `Speak to the ${BRAND} trade desk.`, extra: `
  <section class="band band-ink"><div class="container"><div class="stat-row">
    <div class="stat reveal"><strong>EU</strong><span>Delivery network</span></div>
    <div class="stat reveal reveal-delay-1"><strong>30+</strong><span>Origin countries</span></div>
    <div class="stat reveal reveal-delay-2"><strong>20+</strong><span>Years trading</span></div>
    <div class="stat reveal reveal-delay-3"><strong>24/7</strong><span>Ops mindset</span></div>
  </div></div></section>` },
  { folder: "05-wholesale", theme: "wholesale", title: "Wholesale", cta: "Bulk pricing", heroImg: IMG.wholesale, heroAlt: "Wholesale produce", brand: `${BRAND} Wholesale`, headline: BRAND, lead: "Pallet-scale fruit and vegetable supply for distributors, foodservice and multi-store retailers.", primaryCta: { label: "Bulk catalogue", href: "products.html" }, secondaryCta: { label: "Open account", href: "contact.html" }, sectionEyebrow: "By the pallet", sectionTitle: "Volume with clarity", sectionLead: "Wholesale marketplace style demo.", splitEyebrow: "Buyers", splitTitle: "One partner, flexible volumes", splitLead: "From pallet loads to multi-container supply — tailored to your needs.", splitImg: IMG.crates, splitImgAlt: "Wholesale pallets", splitBtn: { label: "Services", href: "services.html" }, ctaTitle: "Ready for next load-out?", ctaLead: "Send your cut list for confirmation.", extra: "" },
  { folder: "06-harbor", theme: "harbor", title: "Logistics", cta: "Ops enquiry", heroImg: IMG.harbor, heroAlt: "Harbor logistics", brand: `${BRAND} Logistics`, headline: BRAND, lead: "Cold-chain hub thinking — inbound imports, outbound programmes and temperature-controlled handoffs.", primaryCta: { label: "Logistics services", href: "services.html" }, secondaryCta: { label: "Contact ops", href: "contact.html" }, sectionEyebrow: "Network", sectionTitle: "From vessel to van", sectionLead: "Harbor and cold-store oriented demo.", splitEyebrow: "Terminal", splitTitle: "Inspect, hold cold, re-route", splitLead: "QC and last-mile handoff to UK & EU wholesale partners.", splitImg: IMG.ship, splitImgAlt: "Cold chain logistics", splitBtn: { label: "Import & export", href: "import-export.html" }, ctaTitle: "Planning a programme?", ctaLead: "Ops can align capacity and paperwork.", extra: "" },
  { folder: "07-fields", theme: "fields", title: "Growers", cta: "Partner", heroImg: IMG.fields, heroAlt: "Grower fields", brand: `${BRAND} Growers`, headline: BRAND, lead: "Direct grower partnerships for competitive pricing, consistent availability and full transparency.", primaryCta: { label: "Our approach", href: "about.html" }, secondaryCta: { label: "Become a supplier", href: "contact.html" }, sectionEyebrow: "Farms", sectionTitle: "Hands-on with trusted farms", sectionLead: "Grower partnership story demo.", splitEyebrow: "Partnership", splitTitle: "Transparency from field to buyer", splitLead: "We work with a global network of trusted growers for quality and value.", splitImg: IMG.farm, splitImgAlt: "Farm partnership", splitBtn: { label: "About Queentana", href: "about.html" }, ctaTitle: "Supply with us", ctaLead: "Growers and suppliers — get in touch.", extra: `
  <section class="band band-ink"><div class="container quote-block reveal">
    <blockquote>“Quality produce, consistently and responsibly — with no compromise on taste, freshness, or value.”</blockquote>
    <cite>— ${BRAND_FULL}</cite>
  </div></section>` },
  { folder: "08-basket", theme: "basket", title: "Retail", cta: "Order", heroImg: IMG.basket, heroAlt: "Fresh produce basket", brand: `${BRAND} Retail`, headline: BRAND, lead: "Retailer-focused fresh produce supply — consistent packs for independent stores and greengrocers.", primaryCta: { label: "Retail lines", href: "products.html" }, secondaryCta: { label: "Delivery info", href: "contact.html" }, sectionEyebrow: "Retail", sectionTitle: "Shelves that stay fresh", sectionLead: "Independent retail demo.", splitEyebrow: "Weekly", splitTitle: "Market-responsive supply", splitLead: "The lines your customers ask for — staples and specialities — delivered on time.", splitImg: IMG.tomatoes, splitImgAlt: "Retail produce", splitBtn: { label: "Produce", href: "products.html" }, ctaTitle: "Open a trade account", ctaLead: "Apply via our enquiry form.", extra: "" },
  { folder: "09-corporate", theme: "corporate", title: "Corporate", cta: "Talk to sales", heroImg: IMG.corporate, heroAlt: "Corporate procurement", brand: `${BRAND} Corporate`, headline: BRAND, lead: "Enterprise fresh produce programmes for national buyers and multi-site foodservice operators.", primaryCta: { label: "Enterprise supply", href: "services.html" }, secondaryCta: { label: "Book a call", href: "contact.html" }, sectionEyebrow: "Procurement", sectionTitle: "Produce as a managed category", sectionLead: "Corporate B2B demo.", splitEyebrow: "Control", splitTitle: "Visibility from order to dock", splitLead: "Fill rates, origin mix and cold-chain updates without losing produce expertise.", splitImg: IMG.crates, splitImgAlt: "Enterprise logistics", splitBtn: { label: "Services", href: "services.html" }, ctaTitle: "Category review", ctaLead: "Bring your SKU list — we’ll map supply.", extra: `
  <div class="ticker" aria-hidden="true"><div class="ticker-track">
    <span>Sweet potato <strong>firm</strong></span><span>Fine beans <strong>active</strong></span><span>Scotch Bonnet <strong>seasonal</strong></span><span>Onion brown <strong>stable</strong></span>
    <span>Sweet potato <strong>firm</strong></span><span>Fine beans <strong>active</strong></span><span>Scotch Bonnet <strong>seasonal</strong></span><span>Onion brown <strong>stable</strong></span>
  </div></div>` },
  { folder: "10-season", theme: "season", title: "Seasonal", cta: "Plan season", heroImg: IMG.season, heroAlt: "Seasonal harvest", brand: `${BRAND} Seasonal`, headline: BRAND, lead: "Seasonal calendars blending local peaks with import bridges for year-round UK & EU supply.", primaryCta: { label: "Seasonal lines", href: "products.html" }, secondaryCta: { label: "Plan with us", href: "contact.html" }, sectionEyebrow: "Calendar", sectionTitle: "Buy with the season", sectionLead: "Seasonal planning demo.", splitEyebrow: "Planning", splitTitle: "Four seasons, one promise", splitLead: "When local supply dips, import programmes keep shelves honest.", splitImg: IMG.farm, splitImgAlt: "Seasonal fields", splitBtn: { label: "About", href: "about.html" }, ctaTitle: "Lock your seasonal matrix", ctaLead: "Align plantings, imports and promotions.", extra: `
  <section class="section" style="padding-top:0" data-season-switch>
    <div class="container">
      <div class="band" style="padding:2.5rem;border-radius:var(--radius-lg);background:linear-gradient(135deg,#0a1f14,#1a4d32);color:#fff">
        <p class="eyebrow" style="color:rgba(255,255,255,.7)">Season switcher</p>
        <h2 class="display" data-season-title style="font-size:clamp(1.6rem,3vw,2.4rem);margin:.5rem 0">Peak summer harvest</h2>
        <p class="lead" data-season-copy style="color:rgba(255,255,255,.8)">Tomatoes, peppers, cucumbers and courgettes in volume for retail and foodservice.</p>
        <div class="season-chips">
          <button type="button" class="season-chip" data-season="spring">Spring</button>
          <button type="button" class="season-chip is-active" data-season="summer">Summer</button>
          <button type="button" class="season-chip" data-season="autumn">Autumn</button>
          <button type="button" class="season-chip" data-season="winter">Winter</button>
        </div>
      </div>
    </div>
  </section>` },
];

function buildDemo(def) {
  const rel = 2;
  const body = `
  <section class="hero">
    <div class="hero-media"><img src="${def.heroImg}" alt="${def.heroAlt}" /><div class="hero-overlay"></div></div>
    <div class="container hero-content">
      <p class="eyebrow reveal">${def.brand}</p>
      <h1 class="display reveal reveal-delay-1">${def.headline}</h1>
      <p class="lead reveal reveal-delay-2">${def.lead}</p>
      <div class="btn-group reveal reveal-delay-3">
        <a class="btn btn-light" href="${page(rel, def.primaryCta.href)}">${def.primaryCta.label}</a>
        <a class="btn btn-ghost" href="${page(rel, def.secondaryCta.href)}">${def.secondaryCta.label}</a>
      </div>
    </div>
  </section>
  ${def.extra || ""}
  <section class="section"><div class="container">
    <div class="section-head reveal"><p class="eyebrow">${def.sectionEyebrow}</p><h2 class="display">${def.sectionTitle}</h2><p class="lead">${def.sectionLead}</p></div>
    <div class="produce-grid">${produceItems}</div>
  </div></section>
  <section class="band band-muted"><div class="container split">
    <div class="reveal"><p class="eyebrow">${def.splitEyebrow}</p><h2 class="display">${def.splitTitle}</h2>
      <p class="lead" style="margin-top:1rem">${def.splitLead}</p>
      <div class="btn-group"><a class="btn btn-primary" href="${page(rel, def.splitBtn.href)}">${def.splitBtn.label}</a></div>
    </div>
    <div class="media-frame reveal reveal-delay-1"><img src="${def.splitImg}" alt="${def.splitImgAlt}" loading="lazy" /></div>
  </div></section>
  <section class="section"><div class="container">
    <div class="cta-strip reveal">
      <div><h2 class="display" style="font-size:clamp(1.8rem,3vw,2.5rem)">${def.ctaTitle}</h2><p class="lead">${def.ctaLead}</p></div>
      <a class="btn btn-light" href="${page(rel, "contact.html")}">Get in touch</a>
    </div>
  </div></section>`;
  const dir = path.join(ROOT, "demos", def.folder);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, "index.html"),
    shell({ title: def.title + " Demo", theme: def.theme, relDepth: rel, body, onDark: true, cta: def.cta })
  );
  console.log("Wrote", def.folder);
}

function buildDemosGallery() {
  const tiles = demoDefs
    .map((d, i) => {
      const num = String(i + 1).padStart(2, "0");
      return `<a class="demo-tile reveal" href="demos/${d.folder}/index.html">
        <img src="${d.heroImg}" alt="${d.title} demo" loading="lazy" />
        <div class="demo-tile-body"><div class="demo-num">Demo ${num}</div><h2>${d.title}</h2>
        <p>${d.lead.slice(0, 100)}…</p><span class="open">Open demo →</span></div></a>`;
    })
    .join("\n");
  const html = `<!DOCTYPE html>
<html lang="en-GB"><head>
<meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Homepage Demos · ${BRAND_FULL}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Fraunces:opsz,wght@9..144,500;9..144,560;9..144,650&family=IBM+Plex+Mono:wght@400;600&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="assets/css/base.css" />
<link rel="stylesheet" href="assets/css/components.css" />
<link rel="stylesheet" href="assets/css/demos.css" />
<link rel="stylesheet" href="assets/css/professional.css" />
</head>
<body class="showcase-body">
<header class="site-header is-solid"><div class="container nav">
  <a class="logo" href="index.html"><span class="logo-mark logo-mark-theme"></span> ${BRAND}</a>
  <button class="nav-toggle" aria-label="Open menu" aria-expanded="false"><span></span></button>
  <nav class="nav-links">
    <a href="pages/products.html">Produce</a>
    <a href="pages/services.html">Services</a>
    <a href="index.html">Main site</a>
    <a class="btn btn-ghost nav-cta" href="pages/contact.html" style="border-color:var(--brand);color:var(--brand-deep)">Get in touch</a>
  </nav>
</div></header>
<header class="showcase-hero" style="padding-top:2.5rem"><div class="container">
  <p class="eyebrow reveal">Inspired by <a href="${SITE}" target="_blank" rel="noopener">queentana.co.uk</a></p>
  <p class="brand-name reveal" style="font-size:clamp(2.5rem,7vw,4.5rem)">Homepage demos</p>
  <p class="lead reveal">Ten alternate layouts for the ${BRAND_FULL} wholesale produce site. Main site: <a href="index.html" style="color:var(--brand);font-weight:600">index.html</a>.</p>
</div></header>
<main class="container"><div class="demo-grid">${tiles}</div></main>
<footer class="container showcase-footer"><div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:1rem">
  <span>${BRAND_FULL} demos</span><a href="index.html" style="font-weight:600;color:var(--brand)">← Main site</a>
</div></footer>
<script src="assets/js/main.js"></script>
</body></html>`;
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
  <section class="page-hero"><div class="container">
    <p class="eyebrow">About us</p>
    <h1 class="display">Your strategic fresh produce partner</h1>
    <p class="lead">More than 20 years supplying premium fruit and vegetables to trade customers across the UK and Europe.</p>
  </div></section>
  <section class="section"><div class="container split">
    <div class="reveal">
      <p class="eyebrow">Our story</p>
      <h2 class="display">Quality produce, consistently and responsibly</h2>
      <p class="lead" style="margin-top:1rem">We partner with independent retailers, wholesalers, foodservice and hospitality businesses to deliver market-responsive, high-quality fresh produce — on time, every time.</p>
      <p style="margin-top:1rem;color:var(--muted)">Direct grower partnerships mean competitive pricing, consistent availability and full transparency. Reference: <a href="${SITE}" target="_blank" rel="noopener">queentana.co.uk</a>.</p>
    </div>
    <div class="media-frame reveal reveal-delay-1"><img src="${IMG.farm}" alt="Grower partnerships" loading="lazy" /></div>
  </div></section>
  <section class="band band-muted"><div class="container">
    <div class="section-head center reveal"><p class="eyebrow">Why us</p><h2 class="display">Built for trade buyers</h2></div>
    <div class="process">
      <div class="process-item reveal"><h3>Direct growers</h3><p>Hands-on with trusted farms for transparency and control.</p></div>
      <div class="process-item reveal reveal-delay-1"><h3>Flexible volumes</h3><p>From pallet loads to multi-container supply.</p></div>
      <div class="process-item reveal reveal-delay-2"><h3>Cold-chain</h3><p>Temperature-controlled logistics from field to delivery.</p></div>
    </div>
  </div></section>
  <section class="section"><div class="container">
    <div class="section-head reveal"><p class="eyebrow">Reach</p><h2 class="display">UK &amp; EU coverage</h2></div>
    <div class="origin-grid">
      <div class="origin-item reveal"><span class="origin-dot"></span><div><h3>London head office</h3><p>Trading desk and coordination for UK wholesale programmes.</p></div></div>
      <div class="origin-item reveal"><span class="origin-dot"></span><div><h3>UK distribution</h3><p>Markets, depots, greengrocers and catering operators.</p></div></div>
      <div class="origin-item reveal"><span class="origin-dot"></span><div><h3>European network</h3><p>Delivery across major EU cities with cold-chain partners.</p></div></div>
      <div class="origin-item reveal"><span class="origin-dot"></span><div><h3>Global origins</h3><p>30+ countries sourced for staples and speciality lines.</p></div></div>
    </div>
  </div></section>`,
    },
    {
      file: "products.html",
      theme: "wholesale",
      title: "Produce",
      body: `
  <section class="page-hero"><div class="container">
    <p class="eyebrow">Catalogue</p>
    <h1 class="display">Wholesale fruit &amp; vegetables</h1>
    <p class="lead">Core staples, roots, exotic vegetables, tropical fruit, citrus, chillies, ginger and garlic — for UK &amp; EU trade buyers.</p>
  </div></section>
  <section class="section"><div class="container">
    <div class="catalog">
      ${[
        ["Core vegetables", "Tomato, pepper, courgette, cucumber", "UK & EU programmes", "Weekly", IMG.tomatoes],
        ["Onions & scallions", "Red, golden, shallots, leeks", "Year-round", "Contract", IMG.onions],
        ["Root vegetables", "Sweet potato, carrot & roots", "Multi-origin", "Pallet", IMG.carrots],
        ["Exotic vegetables", "Okra, fine beans, baby corn", "Foodservice", "Carton", IMG.leafy],
        ["Exotic fruits", "Mango, avocado, papaya, dragon fruit", "Tropical", "Air / sea", IMG.mango],
        ["Citrus & chillies", "Lemon, lime · Scotch Bonnet to Jalapeño", "Specialty", "Programme", IMG.citrus],
      ]
        .map(
          ([name, pack, origin, mode, img], i) => `
      <div class="catalog-row reveal">
        <img src="${img}" alt="${name}" loading="lazy" onerror="this.src='${IMG.peppers}'" />
        <div><strong>${name}</strong><div style="color:var(--muted);font-size:.9rem">${pack}</div></div>
        <div class="hide-sm">${origin}</div>
        <div class="hide-sm">${mode}</div>
        <a class="btn btn-primary" style="min-height:2.4rem;padding:.45rem 1rem;font-size:.85rem" href="contact.html">Enquire</a>
      </div>`
        )
        .join("")}
    </div>
    <div style="margin-top:2.5rem" class="reveal"><div class="produce-grid">${produceItems}</div></div>
    <div class="cta-strip reveal" style="margin-top:3rem">
      <div><h2 class="display" style="font-size:clamp(1.6rem,3vw,2.2rem)">Need pricing or pack formats?</h2>
      <p class="lead">Tell us volumes and delivery windows — we’ll respond quickly.</p></div>
      <a class="btn btn-light" href="contact.html">Product enquiry</a>
    </div>
  </div></section>`,
    },
    {
      file: "services.html",
      theme: "export",
      title: "Services",
      body: `
  <section class="page-hero"><div class="container">
    <p class="eyebrow">Services</p>
    <h1 class="display">Wholesale supply &amp; cold-chain</h1>
    <p class="lead">End-to-end fresh produce services for retailers, wholesalers, foodservice and trade partners.</p>
  </div></section>
  <section class="section"><div class="container pillar-grid">
    <article class="pillar reveal"><p class="eyebrow">Sell</p><h3>Wholesale selling</h3><p>Trade supply for greengrocers, markets, depots and hospitality.</p></article>
    <article class="pillar reveal reveal-delay-1"><p class="eyebrow">Source</p><h3>Grower partnerships</h3><p>Direct-from-grower sourcing for pricing and availability.</p></article>
    <article class="pillar reveal reveal-delay-2"><p class="eyebrow">Import</p><h3>Import programmes</h3><p>Global origins bridging seasonal gaps into UK &amp; EU.</p></article>
    <article class="pillar reveal"><p class="eyebrow">Export</p><h3>Export execution</h3><p>Cold-chain outbound programmes for European buyers.</p></article>
    <article class="pillar reveal reveal-delay-1"><p class="eyebrow">Logistics</p><h3>Temperature control</h3><p>Field-to-delivery cold chain with clear shipment updates.</p></article>
    <article class="pillar reveal reveal-delay-2"><p class="eyebrow">Accounts</p><h3>Trade accounts</h3><p>Credit review typically within 1–2 business days.</p></article>
  </div></section>
  <section class="band band-muted"><div class="container split">
    <div class="media-frame reveal"><img src="${IMG.crates}" alt="Wholesale packing" loading="lazy" /></div>
    <div class="reveal reveal-delay-1">
      <p class="eyebrow">Engage</p>
      <h2 class="display">Spot buys or ongoing programmes</h2>
      <p class="lead" style="margin-top:1rem">Transactional enquiries or structured supply with volume bands — tailored to your business.</p>
      <div class="btn-group"><a class="btn btn-primary" href="contact.html">Talk to trading</a></div>
    </div>
  </div></section>`,
    },
    {
      file: "import-export.html",
      theme: "trade",
      title: "Import & Export",
      body: `
  <section class="page-hero"><div class="container">
    <p class="eyebrow">Cross-border</p>
    <h1 class="display">Import &amp; export produce</h1>
    <p class="lead">UK–EU fruit and vegetable trade with cold-chain logistics and grower-backed supply.</p>
  </div></section>
  <section class="section"><div class="container">
    <div class="section-head reveal"><p class="eyebrow">Corridors</p><h2 class="display">How we move produce</h2></div>
    <div class="lanes">
      <div class="lane reveal"><strong>Import → UK wholesale</strong><span>Roots, exotic, tropical</span><span>Sea / air</span><span class="tag">Import</span></div>
      <div class="lane reveal"><strong>UK → EU buyers</strong><span>Core &amp; specialty</span><span>Cold-chain</span><span class="tag">Export</span></div>
      <div class="lane reveal"><strong>Domestic UK</strong><span>Markets &amp; foodservice</span><span>Next-day*</span><span class="tag">Supply</span></div>
      <div class="lane reveal"><strong>Multi-origin</strong><span>30+ countries</span><span>Programmes</span><span class="tag">Sourcing</span></div>
    </div>
  </div></section>
  <section class="band band-ink"><div class="container"><div class="stat-row">
    <div class="stat reveal"><strong>Import</strong><span>Clearance + cold store</span></div>
    <div class="stat reveal reveal-delay-1"><strong>Export</strong><span>Docs + dispatch</span></div>
    <div class="stat reveal reveal-delay-2"><strong>Transit</strong><span>Temp-controlled</span></div>
    <div class="stat reveal reveal-delay-3"><strong>Arrival</strong><span>QC + handover</span></div>
  </div></div></section>
  <section class="section"><div class="container split">
    <div class="reveal">
      <p class="eyebrow">Assurance</p>
      <h2 class="display">What trade partners can expect</h2>
      <ul style="margin-top:1.25rem;display:grid;gap:.65rem;color:var(--muted)">
        <li>— Spec confirmation before despatch</li>
        <li>— Cold-chain handling end to end</li>
        <li>— Origin transparency via grower network</li>
        <li>— Flexible volumes (pallet to container)</li>
        <li>— Responsive UK trading desk</li>
      </ul>
      <div class="btn-group"><a class="btn btn-primary" href="contact.html">Import / export enquiry</a></div>
    </div>
    <div class="media-frame reveal reveal-delay-1"><img src="${IMG.export}" alt="Import export logistics" loading="lazy" /></div>
  </div></section>`,
    },
    {
      file: "contact.html",
      theme: "harbor",
      title: "Contact",
      body: `
  <section class="page-hero"><div class="container">
    <p class="eyebrow">Get in touch</p>
    <h1 class="display">Trade enquiry</h1>
    <p class="lead">Tell us about your business — product enquiry, pricing, become a customer or supplier.</p>
  </div></section>
  <section class="section"><div class="container contact-layout">
    <div class="contact-info reveal">
      <div><h3>Trading desk</h3><p><a href="mailto:${EMAIL}">${EMAIL}</a><br /><a href="tel:+442085380269">${PHONE}</a></p></div>
      <div><h3>Head office</h3><p>London, United Kingdom<br />Distribution across UK &amp; EU</p></div>
      <div><h3>Official site</h3><p><a href="${SITE}" target="_blank" rel="noopener">www.queentana.co.uk</a></p></div>
      <div class="map-placeholder">London · UK &amp; EU network</div>
    </div>
    <form class="reveal reveal-delay-1" data-demo-form>
      <div class="form-grid">
        <div class="form-row">
          <div class="field"><label for="name">Full name</label><input id="name" name="name" required autocomplete="name" /></div>
          <div class="field"><label for="company">Company</label><input id="company" name="company" autocomplete="organization" /></div>
        </div>
        <div class="form-row">
          <div class="field"><label for="email">Email</label><input id="email" name="email" type="email" required autocomplete="email" /></div>
          <div class="field"><label for="phone">Phone</label><input id="phone" name="phone" type="tel" autocomplete="tel" /></div>
        </div>
        <div class="form-row">
          <div class="field"><label for="help">What can we help with?</label>
            <select id="help" name="help">
              <option>Product enquiry</option>
              <option>Pricing request</option>
              <option>Become a customer</option>
              <option>Become a supplier</option>
              <option>Logistics / delivery</option>
              <option>Other</option>
            </select>
          </div>
          <div class="field"><label for="role">I’m contacting you as</label>
            <select id="role" name="role">
              <option>Trade Buyer / Retailer</option>
              <option>Trade Buyer / Wholesale</option>
              <option>Import/Export Broker</option>
              <option>Foodservice / Hospitality</option>
              <option>Market Stall / Greengrocer</option>
              <option>Grower / Supplier</option>
              <option>Logistics Partner</option>
              <option>Other</option>
            </select>
          </div>
        </div>
        <div class="field"><label for="message">Message</label><textarea id="message" name="message" placeholder="Volumes, lines, delivery areas…"></textarea></div>
        <button class="btn btn-primary" type="submit">Send enquiry</button>
        <p style="font-size:.85rem;color:var(--muted)">Demo form — for live enquiries use <a href="${SITE}" target="_blank" rel="noopener">queentana.co.uk</a>.</p>
      </div>
    </form>
  </div></section>`,
    },
  ];

  fs.mkdirSync(path.join(ROOT, "pages"), { recursive: true });
  for (const p of pages) {
    let html = shell({
      title: p.title,
      theme: p.theme,
      relDepth: rel,
      body: p.body,
      onDark: false,
      cta: "Get in touch",
      bodyClass: "pro-body",
    });
    html = html.replace('class="site-header"', 'class="site-header is-solid"').replace(" header-on-dark", "");
    fs.writeFileSync(path.join(ROOT, "pages", p.file), html);
    console.log("Wrote pages/" + p.file);
  }
}

// Validate image URLs aren't 404 for citrus/chilli/mango - use fallbacks if needed
async function checkImgs() {
  // sync build - use known-good fallbacks if we already know citrus/chilli may 404
}

buildHome();
demoDefs.forEach(buildDemo);
buildDemosGallery();
buildInnerPages();
console.log("Done. Reference:", SITE);
