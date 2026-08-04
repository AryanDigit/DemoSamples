const express = require('express');
const { marked } = require('marked');
const db = require('../database/db');
const { getSettings, getPage, parseJson, formatDate } = require('../config/helpers');
const { body, validationResult } = require('express-validator');

const router = express.Router();

function siteLocals(extra = {}) {
  const settings = getSettings();
  return {
    settings,
    siteName: settings.site_name || 'Atelier',
    year: new Date().getFullYear(),
    formatDate,
    parseJson,
    marked,
    ...extra
  };
}

router.get('/', (req, res) => {
  const settings = getSettings();
  const page = getPage('home');
  const services = db.prepare('SELECT * FROM services WHERE is_published = 1 ORDER BY sort_order, id LIMIT 6').all();
  const projects = db.prepare(`
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM projects p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.is_published = 1
    ORDER BY p.is_featured DESC, p.sort_order, p.id DESC
    LIMIT 6
  `).all();
  const testimonials = db.prepare('SELECT * FROM testimonials WHERE is_published = 1 ORDER BY is_featured DESC, sort_order LIMIT 6').all();
  const posts = db.prepare(`
    SELECT b.*, c.name as category_name, u.name as author_name
    FROM blog_posts b
    LEFT JOIN categories c ON c.id = b.category_id
    LEFT JOIN users u ON u.id = b.author_id
    WHERE b.is_published = 1
    ORDER BY b.published_at DESC LIMIT 3
  `).all();
  const stats = db.prepare('SELECT * FROM stats WHERE is_published = 1 ORDER BY sort_order').all();
  const clients = db.prepare('SELECT * FROM clients WHERE is_published = 1 ORDER BY sort_order').all();
  const skills = db.prepare('SELECT * FROM skills WHERE is_published = 1 ORDER BY sort_order').all();

  res.render('pages/home', siteLocals({
    page,
    services,
    projects,
    testimonials,
    posts,
    stats,
    clients,
    skills,
    meta: {
      title: page?.meta_title || settings.seo_title,
      description: page?.meta_description || settings.seo_description,
      keywords: page?.meta_keywords || settings.seo_keywords,
      canonical: '/'
    }
  }));
});

router.get('/about', (req, res) => {
  const settings = getSettings();
  const page = getPage('about');
  const team = db.prepare('SELECT * FROM team_members WHERE is_published = 1 ORDER BY sort_order').all();
  const skills = db.prepare('SELECT * FROM skills WHERE is_published = 1 ORDER BY sort_order').all();
  const experience = db.prepare('SELECT * FROM experience WHERE is_published = 1 ORDER BY sort_order').all();
  const stats = db.prepare('SELECT * FROM stats WHERE is_published = 1 ORDER BY sort_order').all();

  res.render('pages/about', siteLocals({
    page, team, skills, experience, stats,
    meta: {
      title: page?.meta_title || `About — ${settings.site_name}`,
      description: page?.meta_description || settings.about_content?.slice(0, 160),
      canonical: '/about'
    }
  }));
});

router.get('/services', (req, res) => {
  const settings = getSettings();
  const page = getPage('services');
  const services = db.prepare('SELECT * FROM services WHERE is_published = 1 ORDER BY sort_order, id').all();
  res.render('pages/services', siteLocals({
    page, services,
    meta: {
      title: page?.meta_title || `Services — ${settings.site_name}`,
      description: page?.meta_description || 'Our creative and digital services.',
      canonical: '/services'
    }
  }));
});

router.get('/services/:slug', (req, res) => {
  const settings = getSettings();
  const service = db.prepare('SELECT * FROM services WHERE slug = ? AND is_published = 1').get(req.params.slug);
  if (!service) return res.status(404).render('pages/404', siteLocals({ meta: { title: 'Not Found' } }));
  service.featuresList = parseJson(service.features);
  const others = db.prepare('SELECT title, slug, short_description, icon FROM services WHERE is_published = 1 AND id != ? ORDER BY sort_order LIMIT 3').all(service.id);
  res.render('pages/service-detail', siteLocals({
    service, others,
    meta: {
      title: service.meta_title || `${service.title} — ${settings.site_name}`,
      description: service.meta_description || service.short_description,
      canonical: `/services/${service.slug}`,
      image: service.image
    }
  }));
});

router.get('/portfolio', (req, res) => {
  const settings = getSettings();
  const page = getPage('portfolio');
  const category = req.query.category || null;
  const categories = db.prepare(`SELECT * FROM categories WHERE type = 'project' ORDER BY sort_order`).all();

  let projects;
  if (category) {
    projects = db.prepare(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM projects p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.is_published = 1 AND c.slug = ?
      ORDER BY p.sort_order, p.id DESC
    `).all(category);
  } else {
    projects = db.prepare(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM projects p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.is_published = 1
      ORDER BY p.sort_order, p.id DESC
    `).all();
  }

  res.render('pages/portfolio', siteLocals({
    page, projects, categories, activeCategory: category,
    meta: {
      title: page?.meta_title || `Portfolio — ${settings.site_name}`,
      description: page?.meta_description || 'Selected work and case studies.',
      canonical: '/portfolio'
    }
  }));
});

router.get('/portfolio/:slug', (req, res) => {
  const settings = getSettings();
  const project = db.prepare(`
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM projects p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.slug = ? AND p.is_published = 1
  `).get(req.params.slug);
  if (!project) return res.status(404).render('pages/404', siteLocals({ meta: { title: 'Not Found' } }));
  project.galleryList = parseJson(project.gallery);
  project.techList = parseJson(project.technologies);
  const related = db.prepare(`
    SELECT p.*, c.name as category_name
    FROM projects p LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.is_published = 1 AND p.id != ? AND (p.category_id = ? OR ? IS NULL)
    ORDER BY p.is_featured DESC LIMIT 3
  `).all(project.id, project.category_id, project.category_id);

  res.render('pages/project-detail', siteLocals({
    project, related,
    meta: {
      title: project.meta_title || `${project.title} — ${settings.site_name}`,
      description: project.meta_description || project.short_description,
      canonical: `/portfolio/${project.slug}`,
      image: project.cover_image
    }
  }));
});

router.get('/blog', (req, res) => {
  const settings = getSettings();
  const page = getPage('blog');
  const posts = db.prepare(`
    SELECT b.*, c.name as category_name, u.name as author_name
    FROM blog_posts b
    LEFT JOIN categories c ON c.id = b.category_id
    LEFT JOIN users u ON u.id = b.author_id
    WHERE b.is_published = 1
    ORDER BY b.published_at DESC
  `).all();
  res.render('pages/blog', siteLocals({
    page, posts,
    meta: {
      title: page?.meta_title || `Insights — ${settings.site_name}`,
      description: page?.meta_description || 'Articles and insights.',
      canonical: '/blog'
    }
  }));
});

router.get('/blog/:slug', (req, res) => {
  const settings = getSettings();
  const post = db.prepare(`
    SELECT b.*, c.name as category_name, u.name as author_name
    FROM blog_posts b
    LEFT JOIN categories c ON c.id = b.category_id
    LEFT JOIN users u ON u.id = b.author_id
    WHERE b.slug = ? AND b.is_published = 1
  `).get(req.params.slug);
  if (!post) return res.status(404).render('pages/404', siteLocals({ meta: { title: 'Not Found' } }));

  db.prepare('UPDATE blog_posts SET views = views + 1 WHERE id = ?').run(post.id);
  post.tagList = parseJson(post.tags);
  post.html = marked.parse(post.content || '');

  const related = db.prepare(`
    SELECT b.*, c.name as category_name FROM blog_posts b
    LEFT JOIN categories c ON c.id = b.category_id
    WHERE b.is_published = 1 AND b.id != ? ORDER BY b.published_at DESC LIMIT 3
  `).all(post.id);

  res.render('pages/blog-detail', siteLocals({
    post, related,
    meta: {
      title: post.meta_title || `${post.title} — ${settings.site_name}`,
      description: post.meta_description || post.excerpt,
      canonical: `/blog/${post.slug}`,
      image: post.cover_image,
      type: 'article'
    }
  }));
});

router.get('/contact', (req, res) => {
  const settings = getSettings();
  const page = getPage('contact');
  res.render('pages/contact', siteLocals({
    page,
    meta: {
      title: page?.meta_title || `Contact — ${settings.site_name}`,
      description: page?.meta_description || 'Start a project with us.',
      canonical: '/contact'
    }
  }));
});

router.post('/contact',
  body('name').trim().isLength({ min: 2 }).withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg);
      return res.redirect('/contact');
    }
    const { name, email, phone, subject, message } = req.body;
    db.prepare(`
      INSERT INTO messages (name, email, phone, subject, message, ip_address)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(name, email, phone || '', subject || 'Website inquiry', message, req.ip);

    req.flash('success', 'Thank you — your message has been sent. We will reply soon.');
    res.redirect('/contact');
  }
);

router.get('/robots.txt', (req, res) => {
  const settings = getSettings();
  const base = process.env.SITE_URL || `${req.protocol}://${req.get('host')}`;
  res.type('text/plain').send(`User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: ${base}/sitemap.xml\n`);
});

router.get('/sitemap.xml', (req, res) => {
  const base = process.env.SITE_URL || `${req.protocol}://${req.get('host')}`;
  const staticPages = ['', '/about', '/services', '/portfolio', '/blog', '/contact'];
  const projects = db.prepare('SELECT slug, updated_at FROM projects WHERE is_published = 1').all();
  const posts = db.prepare('SELECT slug, updated_at FROM blog_posts WHERE is_published = 1').all();
  const services = db.prepare('SELECT slug, updated_at FROM services WHERE is_published = 1').all();

  let urls = staticPages.map(p => `
  <url><loc>${base}${p || '/'}</loc><changefreq>weekly</changefreq><priority>${p === '' ? '1.0' : '0.8'}</priority></url>`).join('');

  projects.forEach(p => {
    urls += `\n  <url><loc>${base}/portfolio/${p.slug}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`;
  });
  posts.forEach(p => {
    urls += `\n  <url><loc>${base}/blog/${p.slug}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`;
  });
  services.forEach(p => {
    urls += `\n  <url><loc>${base}/services/${p.slug}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`;
  });

  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`);
});

module.exports = router;
