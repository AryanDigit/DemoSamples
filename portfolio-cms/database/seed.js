require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const bcrypt = require('bcryptjs');
const db = require('./db');
const path = require('path');
const fs = require('fs');

function setSetting(key, value) {
  db.prepare(`
    INSERT INTO settings (setting_key, setting_value, updated_at)
    VALUES (?, ?, datetime('now'))
    ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value, updated_at = datetime('now')
  `).run(key, value);
}

function seed() {
  console.log('🌱 Seeding Atelier Portfolio CMS...');

  // Clear existing data for fresh demo
  const tables = [
    'clients', 'stats', 'experience', 'media', 'messages', 'skills',
    'team_members', 'testimonials', 'blog_posts', 'projects', 'categories',
    'services', 'pages', 'settings', 'users'
  ];
  for (const t of tables) {
    db.prepare(`DELETE FROM ${t}`).run();
  }

  const password = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'Admin@12345', 12);
  const admin = db.prepare(`
    INSERT INTO users (name, email, password, role)
    VALUES (?, ?, ?, 'admin')
  `).run('Alex Morgan', process.env.ADMIN_EMAIL || 'admin@atelier.demo', password);

  const settings = {
    site_name: 'Atelier',
    site_tagline: 'Craft Digital Experiences That Convert',
    site_description: 'Premium portfolio & creative studio for freelancers, designers, developers, and digital agencies.',
    logo_text: 'Atelier',
    favicon: '',
    primary_color: '#0F766E',
    accent_color: '#D4A574',
    hero_eyebrow: 'Creative Studio',
    hero_title: 'We design bold digital products for ambitious brands',
    hero_subtitle: 'Strategy, design, and engineering — crafted into experiences that feel premium and perform.',
    hero_cta_text: 'View Work',
    hero_cta_link: '/portfolio',
    hero_cta2_text: 'Start a Project',
    hero_cta2_link: '/contact',
    hero_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&q=80',
    about_title: 'A studio built on craft and clarity',
    about_subtitle: 'About Atelier',
    about_content: `Atelier is a multidisciplinary creative practice helping freelancers, startups, and agencies ship distinctive digital work. We blend editorial design, modern engineering, and brand storytelling into websites that feel intentional — never template-generic.

From concept to launch, every project is treated as a signature piece: researched, refined, and built to last.`,
    about_image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80',
    resume_url: '#',
    contact_email: 'hello@atelier.studio',
    contact_phone: '+1 (415) 555-0142',
    contact_address: 'San Francisco, CA — Remote Worldwide',
    contact_map_embed: '',
    social_linkedin: 'https://linkedin.com',
    social_dribbble: 'https://dribbble.com',
    social_behance: 'https://behance.net',
    social_github: 'https://github.com',
    social_instagram: 'https://instagram.com',
    social_twitter: 'https://x.com',
    footer_text: 'Crafting digital experiences with intention.',
    footer_copyright: '© 2026 Atelier Studio. All rights reserved.',
    seo_title: 'Atelier — Premium Portfolio & Creative Studio',
    seo_description: 'Atelier is a premium portfolio CMS for freelancers, designers, developers, photographers, architects, and creative agencies.',
    seo_keywords: 'portfolio, freelance, designer, developer, agency, creative studio, CMS',
    google_analytics: '',
    custom_css: '',
    custom_js: '',
    show_preloader: '1',
    maintenance_mode: '0'
  };

  for (const [k, v] of Object.entries(settings)) {
    setSetting(k, v);
  }

  // Pages
  const pages = [
    ['home', 'Home', 'Welcome to Atelier', 'Atelier — Premium Portfolio & Creative Studio', 'Craft digital experiences for ambitious brands.', 'portfolio, creative, design'],
    ['about', 'About', 'About Atelier Studio', 'About — Atelier Studio', 'Learn about our creative practice and approach.', 'about, studio, team'],
    ['services', 'Services', 'Our Services', 'Services — Atelier', 'Strategy, design, development, and brand systems.', 'services, design, development'],
    ['portfolio', 'Portfolio', 'Selected Work', 'Portfolio — Atelier', 'Explore our featured projects and case studies.', 'portfolio, work, projects'],
    ['blog', 'Insights', 'Insights & Articles', 'Blog — Atelier', 'Design thinking, product craft, and creative process.', 'blog, insights, design'],
    ['contact', 'Contact', 'Let\'s talk', 'Contact — Atelier', 'Start a project or say hello.', 'contact, hire, freelance']
  ];
  const insertPage = db.prepare(`
    INSERT INTO pages (slug, title, content, meta_title, meta_description, meta_keywords, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  pages.forEach((p, i) => insertPage.run(...p, i));

  // Categories
  const insertCat = db.prepare(`INSERT INTO categories (name, slug, type, sort_order) VALUES (?, ?, ?, ?)`);
  const projectCats = [
    ['Branding', 'branding', 'project', 1],
    ['Web Design', 'web-design', 'project', 2],
    ['Development', 'development', 'project', 3],
    ['Photography', 'photography', 'project', 4],
    ['Architecture', 'architecture', 'project', 5]
  ];
  const blogCats = [
    ['Design', 'design', 'blog', 1],
    ['Development', 'dev-blog', 'blog', 2],
    ['Business', 'business', 'blog', 3]
  ];
  projectCats.forEach(c => insertCat.run(...c));
  blogCats.forEach(c => insertCat.run(...c));

  // Services
  const services = [
    ['Brand Identity', 'brand-identity', 'Distinctive visual systems that feel premium and memorable.', 'We craft brand identities with typography, color, and motion systems that scale across digital and print.', 'palette', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80', '["Logo Systems","Visual Language","Brand Guidelines","Art Direction"]', 1, 1],
    ['UI/UX Design', 'ui-ux-design', 'Interfaces that feel effortless and look intentional.', 'From wireframes to high-fidelity prototypes, we design product experiences with clarity and delight.', 'layout', 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&q=80', '["User Research","Wireframing","Prototyping","Design Systems"]', 2, 1],
    ['Web Development', 'web-development', 'Fast, secure, SEO-ready websites and web apps.', 'Modern frontends and robust backends — built for performance, accessibility, and maintainability.', 'code', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80', '["Frontend","CMS Integration","API Development","Performance"]', 3, 1],
    ['Digital Marketing', 'digital-marketing', 'Campaigns and content that attract the right audience.', 'SEO, content strategy, and conversion-focused landing experiences for growth-minded brands.', 'megaphone', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', '["SEO","Content Strategy","Landing Pages","Analytics"]', 4, 1],
    ['Photography', 'photography', 'Editorial and product imagery with cinematic presence.', 'On-location and studio photography for brands, architecture, and portfolios.', 'camera', 'https://images.unsplash.com/photo-1452587925148-ce544e77e286?w=800&q=80', '["Editorial","Product","Architecture","Retouching"]', 5, 0],
    ['Creative Direction', 'creative-direction', 'Concept leadership across campaigns and product launches.', 'We guide visual narrative, art direction, and cross-channel consistency.', 'compass', 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80', '["Art Direction","Campaign Concepts","Moodboards","Launch Kits"]', 6, 0]
  ];
  const insertService = db.prepare(`
    INSERT INTO services (title, slug, short_description, description, icon, image, features, sort_order, is_featured, is_published)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `);
  services.forEach(s => insertService.run(...s));

  // Projects
  const catId = (slug) => db.prepare('SELECT id FROM categories WHERE slug = ?').get(slug)?.id;
  const projects = [
    ['Lumina Finance', 'lumina-finance', 'Fintech brand & dashboard redesign', 'A complete brand refresh and product UI system for a modern finance platform. We redefined visual hierarchy, introduced a calm color language, and shipped a component library used across web and mobile.', 'Lumina Inc.', 'https://example.com', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80', '["https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80","https://images.unsplash.com/photo-1556155092-490a1ba16284?w=1200&q=80"]', 'web-design', '["Figma","React","Tailwind","Framer Motion"]', '2025-11', 1, 1],
    ['Nordic Atelier', 'nordic-atelier', 'Architecture portfolio for a Nordic studio', 'An immersive architecture site with full-bleed photography, subtle motion, and a CMS-driven project library — built for quiet luxury.', 'Nordic Atelier AS', '#', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80', '["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80"]', 'architecture', '["HTML","GSAP","CMS","Photography"]', '2025-08', 1, 2],
    ['Pulse Agency', 'pulse-agency', 'Marketing site for a growth agency', 'Positioning, messaging, and a conversion-focused website with case studies, service pages, and lead capture flows.', 'Pulse Media', '#', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80', '[]', 'branding', '["Brand Strategy","Web Design","SEO"]', '2025-06', 1, 3],
    ['Frame & Form', 'frame-and-form', 'Photographer portfolio with booking', 'A cinematic portfolio for a commercial photographer featuring galleries, client proofs, and inquiry workflows.', 'Maya Chen', '#', 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&q=80', '[]', 'photography', '["Photography","UX","Booking System"]', '2025-03', 1, 4],
    ['CodeCraft SaaS', 'codecraft-saas', 'Developer tools landing & docs', 'Product marketing site and documentation portal for a developer SaaS — fast, accessible, and search-optimized.', 'CodeCraft Labs', '#', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80', '[]', 'development', '["Next.js","MDX","TypeScript"]', '2024-12', 0, 5],
    ['Verde Kitchen', 'verde-kitchen', 'Hospitality brand identity system', 'Identity, menus, and digital presence for a farm-to-table restaurant group.', 'Verde Group', '#', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80', '[]', 'branding', '["Branding","Print","Web"]', '2024-09', 0, 6]
  ];
  const insertProject = db.prepare(`
    INSERT INTO projects (title, slug, short_description, description, client, project_url, cover_image, gallery, category_id, technologies, completion_date, is_featured, is_published, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
  `);
  projects.forEach(([title, slug, shortDesc, desc, client, url, cover, gallery, catSlug, tech, date, featured, order]) => {
    insertProject.run(title, slug, shortDesc, desc, client, url, cover, gallery, catId(catSlug), tech, date, featured, order);
  });

  // Blog
  const designCat = db.prepare("SELECT id FROM categories WHERE slug = 'design'").get()?.id;
  const devBlogCat = db.prepare("SELECT id FROM categories WHERE slug = 'dev-blog'").get()?.id;
  const posts = [
    ['Designing portfolios that feel premium', 'designing-premium-portfolios', 'What separates a forgettable template from a portfolio that wins clients.', 'Premium portfolios are not about more sections — they are about hierarchy, restraint, and a clear creative point of view. In this article we break down typography pairing, hero composition, motion budget, and CMS structure that lets you ship updates without touching code.\n\n## Start with one composition\n\nYour first viewport should read as a single idea: brand, headline, one supporting line, and a dominant visual. Everything else can wait.\n\n## Motion with purpose\n\nUse two or three intentional motions — page load, scroll reveals, and hover states — rather than decorating every element.', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80', designCat, '["design","portfolio","ux"]', 1],
    ['SEO foundations for creative websites', 'seo-for-creative-websites', 'Practical SEO steps every freelancer and agency site should get right.', 'Creative sites often look beautiful and rank poorly. Fix the fundamentals: unique titles, descriptive meta, semantic headings, fast images, structured data for projects, and internal linking between case studies and services.\n\n## Technical checklist\n\nCompress images, lazy-load below the fold, ship a sitemap, and keep Core Web Vitals healthy.', 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=1200&q=80', devBlogCat, '["seo","marketing"]', 1],
    ['From Figma to production without friction', 'figma-to-production', 'A workflow for designers and developers shipping polished sites faster.', 'Hand-off friction kills momentum. Shared tokens, component naming, and a CMS that maps cleanly to design sections keep teams aligned from prototype to launch.', 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=1200&q=80', devBlogCat, '["workflow","development"]', 0]
  ];
  const insertPost = db.prepare(`
    INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, category_id, author_id, tags, is_featured, is_published, published_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, datetime('now'))
  `);
  posts.forEach(([title, slug, excerpt, content, cover, categoryId, tags, featured]) => {
    insertPost.run(title, slug, excerpt, content, cover, categoryId, admin.lastInsertRowid, tags, featured);
  });

  // Testimonials
  const testimonials = [
    ['Jordan Lee', 'Founder', 'Lumina Inc.', 'https://i.pravatar.cc/150?u=jordan', 'Atelier delivered a brand and product UI that finally matched how ambitious we feel. The process was calm, structured, and the results speak for themselves.', 5, 1],
    ['Sofia Berg', 'Principal Architect', 'Nordic Atelier', 'https://i.pravatar.cc/150?u=sofia', 'They understood quiet luxury. Our new site showcases the work without competing with it — exactly what we needed.', 5, 1],
    ['Marcus Reid', 'CMO', 'Pulse Media', 'https://i.pravatar.cc/150?u=marcus', 'Conversion-focused without looking like a lead-gen factory. Beautiful craft and measurable lift in inquiries.', 5, 1],
    ['Priya Shah', 'Photographer', 'Frame & Form', 'https://i.pravatar.cc/150?u=priya', 'The portfolio feels cinematic and the booking flow is effortless. Clients comment on the site before the shoot.', 5, 0]
  ];
  const insertTestimonial = db.prepare(`
    INSERT INTO testimonials (name, role, company, avatar, content, rating, is_featured, is_published, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)
  `);
  testimonials.forEach((t, i) => insertTestimonial.run(...t, i));

  // Team
  const team = [
    ['Alex Morgan', 'Creative Director', 'Leads brand strategy and visual systems across studio projects.', 'https://i.pravatar.cc/300?u=alex', 'alex@atelier.studio', '{"linkedin":"#","dribbble":"#"}', 1],
    ['Sam Rivera', 'Lead Developer', 'Builds fast, accessible frontends and maintainable CMS integrations.', 'https://i.pravatar.cc/300?u=sam', 'sam@atelier.studio', '{"github":"#","linkedin":"#"}', 2],
    ['Nina Okonkwo', 'Product Designer', 'Shapes product UX with research-backed flows and refined interfaces.', 'https://i.pravatar.cc/300?u=nina', 'nina@atelier.studio', '{"behance":"#","linkedin":"#"}', 3]
  ];
  const insertTeam = db.prepare(`
    INSERT INTO team_members (name, role, bio, avatar, email, social_links, sort_order, is_published)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1)
  `);
  team.forEach(t => insertTeam.run(...t));

  // Skills
  const skills = [
    ['Brand Strategy', 95, 'Strategy', 1],
    ['UI Design', 92, 'Design', 2],
    ['Web Development', 90, 'Development', 3],
    ['Motion Design', 85, 'Design', 4],
    ['SEO & Content', 88, 'Marketing', 5],
    ['Photography', 80, 'Creative', 6]
  ];
  const insertSkill = db.prepare(`
    INSERT INTO skills (name, percentage, category, sort_order, is_published) VALUES (?, ?, ?, ?, 1)
  `);
  skills.forEach(s => insertSkill.run(...s));

  // Experience
  const experience = [
    ['Creative Director', 'Atelier Studio', 'San Francisco', '2021', null, 1, 'Leading brand and digital product engagements for global clients.', 'work', 1],
    ['Senior Product Designer', 'Orbit Labs', 'Remote', '2018', '2021', 0, 'Designed SaaS interfaces and design systems used by 200k+ users.', 'work', 2],
    ['BFA Interaction Design', 'California College of the Arts', 'Oakland', '2014', '2018', 0, 'Focused on digital product design and typography.', 'education', 3]
  ];
  const insertExp = db.prepare(`
    INSERT INTO experience (title, company, location, start_date, end_date, is_current, description, type, sort_order, is_published)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `);
  experience.forEach(e => insertExp.run(...e));

  // Stats
  const stats = [
    ['Projects Delivered', '120', '+', 1],
    ['Happy Clients', '85', '+', 2],
    ['Years Experience', '10', '', 3],
    ['Awards Won', '24', '', 4]
  ];
  const insertStat = db.prepare(`INSERT INTO stats (label, value, suffix, sort_order, is_published) VALUES (?, ?, ?, ?, 1)`);
  stats.forEach(s => insertStat.run(...s));

  // Clients
  const clients = [
    ['Lumina', 1], ['Nordic', 2], ['Pulse', 3], ['CodeCraft', 4], ['Verde', 5], ['Frame', 6]
  ];
  const insertClient = db.prepare(`INSERT INTO clients (name, sort_order, is_published) VALUES (?, ?, 1)`);
  clients.forEach(c => insertClient.run(...c));

  // Sample message
  db.prepare(`
    INSERT INTO messages (name, email, subject, message, is_read)
    VALUES ('Taylor Kim', 'taylor@example.com', 'Website redesign inquiry', 'Hi Atelier — we love your work and want to discuss a full redesign for our agency site. Available next week?', 0)
  `).run();

  console.log('✅ Seed complete.');
  console.log(`   Admin: ${process.env.ADMIN_EMAIL || 'admin@atelier.demo'}`);
  console.log(`   Pass:  ${process.env.ADMIN_PASSWORD || 'Admin@12345'}`);
}

seed();
