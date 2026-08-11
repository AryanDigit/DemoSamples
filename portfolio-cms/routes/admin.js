const express = require('express');
const bcrypt = require('bcryptjs');
const slugify = require('slugify');
const db = require('../database/db');
const { requireAuth, guestOnly } = require('../middleware/auth');
const { createUploader } = require('../middleware/upload');
const { getSettings, setSettings, setSetting, parseJson } = require('../config/helpers');
const { body, validationResult } = require('express-validator');
const path = require('path');

const router = express.Router();
const upload = createUploader('general');
const uploadPortfolio = createUploader('portfolio');
const uploadBlog = createUploader('blog');
const uploadTeam = createUploader('team');

function makeSlug(text) {
  return slugify(text || '', { lower: true, strict: true });
}

function uniqueSlug(table, base, excludeId = null) {
  let slug = base || 'item';
  let i = 0;
  while (true) {
    const candidate = i === 0 ? slug : `${slug}-${i}`;
    const row = excludeId
      ? db.prepare(`SELECT id FROM ${table} WHERE slug = ? AND id != ?`).get(candidate, excludeId)
      : db.prepare(`SELECT id FROM ${table} WHERE slug = ?`).get(candidate);
    if (!row) return candidate;
    i += 1;
  }
}

function saveMedia(file, folder = 'general', alt = '') {
  if (!file) return null;
  const rel = `/uploads/${folder}/${file.filename}`;
  db.prepare(`
    INSERT INTO media (filename, original_name, path, mime_type, size, alt_text, folder)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(file.filename, file.originalname, rel, file.mimetype, file.size, alt, folder);
  return rel;
}

// ─── Auth ───────────────────────────────────────────────
router.get('/login', guestOnly, (req, res) => {
  res.render('admin/auth/login', { title: 'Admin Login', layout: false });
});

router.post('/login', guestOnly,
  body('email').isEmail(),
  body('password').notEmpty(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', 'Invalid credentials.');
      return res.redirect('/admin/login');
    }
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(req.body.email.toLowerCase().trim());
    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/admin/login');
    }
    req.session.userId = user.id;
    req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    req.flash('success', `Welcome back, ${user.name}.`);
    res.redirect('/admin');
  }
);

router.post('/logout', requireAuth, (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

router.use(requireAuth);

router.use((req, res, next) => {
  res.locals.layout = 'admin/layouts/main';
  next();
});

// ─── Dashboard ──────────────────────────────────────────
router.get('/', (req, res) => {
  const stats = {
    projects: db.prepare('SELECT COUNT(*) as c FROM projects').get().c,
    services: db.prepare('SELECT COUNT(*) as c FROM services').get().c,
    posts: db.prepare('SELECT COUNT(*) as c FROM blog_posts').get().c,
    messages: db.prepare('SELECT COUNT(*) as c FROM messages WHERE is_read = 0').get().c,
    testimonials: db.prepare('SELECT COUNT(*) as c FROM testimonials').get().c,
    team: db.prepare('SELECT COUNT(*) as c FROM team_members').get().c
  };
  const recentMessages = db.prepare('SELECT * FROM messages ORDER BY created_at DESC LIMIT 5').all();
  const recentProjects = db.prepare('SELECT id, title, is_published, created_at FROM projects ORDER BY id DESC LIMIT 5').all();
  res.render('admin/dashboard/index', {
    title: 'Dashboard',
    stats,
    recentMessages,
    recentProjects,
    settings: getSettings()
  });
});

// ─── Settings ───────────────────────────────────────────
router.get('/settings', (req, res) => {
  res.render('admin/settings/index', {
    title: 'Site Settings',
    settings: getSettings(),
    tab: req.query.tab || 'general'
  });
});

router.post('/settings', upload.single('logo_file'), (req, res) => {
  const data = { ...req.body };
  delete data._method;
  if (req.file) {
    data.logo_image = saveMedia(req.file, 'general', 'Site logo');
  }
  const tab = req.body._tab || 'general';
  // Explicit checkbox handling
  if (tab === 'general') {
    data.show_preloader = req.body.show_preloader ? '1' : '0';
    data.maintenance_mode = req.body.maintenance_mode ? '1' : '0';
  }
  const allowed = Object.keys(data).filter(k => !k.startsWith('_'));
  const payload = {};
  for (const k of allowed) payload[k] = data[k];
  setSettings(payload);
  req.flash('success', 'Settings saved successfully.');
  res.redirect(`/admin/settings?tab=${tab}`);
});

router.post('/settings/password',
  body('current_password').notEmpty(),
  body('new_password').isLength({ min: 8 }),
  (req, res) => {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.session.userId);
    if (!bcrypt.compareSync(req.body.current_password, user.password)) {
      req.flash('error', 'Current password is incorrect.');
      return res.redirect('/admin/settings?tab=account');
    }
    if (req.body.new_password !== req.body.confirm_password) {
      req.flash('error', 'New passwords do not match.');
      return res.redirect('/admin/settings?tab=account');
    }
    const hash = bcrypt.hashSync(req.body.new_password, 12);
    db.prepare('UPDATE users SET password = ?, updated_at = datetime(\'now\') WHERE id = ?').run(hash, user.id);
    req.flash('success', 'Password updated.');
    res.redirect('/admin/settings?tab=account');
  }
);

router.post('/settings/profile', (req, res) => {
  db.prepare('UPDATE users SET name = ?, email = ?, updated_at = datetime(\'now\') WHERE id = ?')
    .run(req.body.name, req.body.email.toLowerCase().trim(), req.session.userId);
  req.session.user.name = req.body.name;
  req.session.user.email = req.body.email.toLowerCase().trim();
  req.flash('success', 'Profile updated.');
  res.redirect('/admin/settings?tab=account');
});

// ─── Services CRUD ──────────────────────────────────────
router.get('/services', (req, res) => {
  const services = db.prepare('SELECT * FROM services ORDER BY sort_order, id').all();
  res.render('admin/services/index', { title: 'Services', services });
});

router.get('/services/new', (req, res) => {
  res.render('admin/services/form', { title: 'Add Service', service: null });
});

router.post('/services', upload.single('image_file'), (req, res) => {
  const slug = uniqueSlug('services', makeSlug(req.body.slug || req.body.title));
  const features = JSON.stringify((req.body.features || '').split('\n').map(s => s.trim()).filter(Boolean));
  let image = req.body.image || '';
  if (req.file) image = saveMedia(req.file, 'general');
  db.prepare(`
    INSERT INTO services (title, slug, short_description, description, icon, image, features, sort_order, is_featured, is_published, meta_title, meta_description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    req.body.title, slug, req.body.short_description, req.body.description, req.body.icon || 'star',
    image, features, Number(req.body.sort_order) || 0,
    req.body.is_featured ? 1 : 0, req.body.is_published ? 1 : 0,
    req.body.meta_title || '', req.body.meta_description || ''
  );
  req.flash('success', 'Service created.');
  res.redirect('/admin/services');
});

router.get('/services/:id/edit', (req, res) => {
  const service = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
  if (!service) return res.redirect('/admin/services');
  service.featuresText = parseJson(service.features).join('\n');
  res.render('admin/services/form', { title: 'Edit Service', service });
});

router.post('/services/:id', upload.single('image_file'), (req, res) => {
  const id = req.params.id;
  const slug = uniqueSlug('services', makeSlug(req.body.slug || req.body.title), id);
  const features = JSON.stringify((req.body.features || '').split('\n').map(s => s.trim()).filter(Boolean));
  let image = req.body.image || '';
  if (req.file) image = saveMedia(req.file, 'general');
  db.prepare(`
    UPDATE services SET title=?, slug=?, short_description=?, description=?, icon=?, image=?, features=?,
    sort_order=?, is_featured=?, is_published=?, meta_title=?, meta_description=?, updated_at=datetime('now')
    WHERE id=?
  `).run(
    req.body.title, slug, req.body.short_description, req.body.description, req.body.icon || 'star',
    image, features, Number(req.body.sort_order) || 0,
    req.body.is_featured ? 1 : 0, req.body.is_published ? 1 : 0,
    req.body.meta_title || '', req.body.meta_description || '', id
  );
  req.flash('success', 'Service updated.');
  res.redirect('/admin/services');
});

router.post('/services/:id/delete', (req, res) => {
  db.prepare('DELETE FROM services WHERE id = ?').run(req.params.id);
  req.flash('success', 'Service deleted.');
  res.redirect('/admin/services');
});

// ─── Projects CRUD ──────────────────────────────────────
router.get('/projects', (req, res) => {
  const projects = db.prepare(`
    SELECT p.*, c.name as category_name FROM projects p
    LEFT JOIN categories c ON c.id = p.category_id
    ORDER BY p.sort_order, p.id DESC
  `).all();
  res.render('admin/projects/index', { title: 'Projects', projects });
});

router.get('/projects/new', (req, res) => {
  const categories = db.prepare(`SELECT * FROM categories WHERE type='project' ORDER BY sort_order`).all();
  res.render('admin/projects/form', { title: 'Add Project', project: null, categories });
});

router.post('/projects', uploadPortfolio.single('cover_file'), (req, res) => {
  const slug = uniqueSlug('projects', makeSlug(req.body.slug || req.body.title));
  const technologies = JSON.stringify((req.body.technologies || '').split(',').map(s => s.trim()).filter(Boolean));
  const gallery = JSON.stringify((req.body.gallery || '').split('\n').map(s => s.trim()).filter(Boolean));
  let cover = req.body.cover_image || '';
  if (req.file) cover = saveMedia(req.file, 'portfolio');
  db.prepare(`
    INSERT INTO projects (title, slug, short_description, description, client, project_url, cover_image, gallery, category_id, technologies, completion_date, is_featured, is_published, sort_order, meta_title, meta_description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    req.body.title, slug, req.body.short_description, req.body.description,
    req.body.client || '', req.body.project_url || '', cover, gallery,
    req.body.category_id || null, technologies, req.body.completion_date || '',
    req.body.is_featured ? 1 : 0, req.body.is_published ? 1 : 0,
    Number(req.body.sort_order) || 0, req.body.meta_title || '', req.body.meta_description || ''
  );
  req.flash('success', 'Project created.');
  res.redirect('/admin/projects');
});

router.get('/projects/:id/edit', (req, res) => {
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!project) return res.redirect('/admin/projects');
  project.techText = parseJson(project.technologies).join(', ');
  project.galleryText = parseJson(project.gallery).join('\n');
  const categories = db.prepare(`SELECT * FROM categories WHERE type='project' ORDER BY sort_order`).all();
  res.render('admin/projects/form', { title: 'Edit Project', project, categories });
});

router.post('/projects/:id', uploadPortfolio.single('cover_file'), (req, res) => {
  const id = req.params.id;
  const slug = uniqueSlug('projects', makeSlug(req.body.slug || req.body.title), id);
  const technologies = JSON.stringify((req.body.technologies || '').split(',').map(s => s.trim()).filter(Boolean));
  const gallery = JSON.stringify((req.body.gallery || '').split('\n').map(s => s.trim()).filter(Boolean));
  let cover = req.body.cover_image || '';
  if (req.file) cover = saveMedia(req.file, 'portfolio');
  db.prepare(`
    UPDATE projects SET title=?, slug=?, short_description=?, description=?, client=?, project_url=?, cover_image=?, gallery=?,
    category_id=?, technologies=?, completion_date=?, is_featured=?, is_published=?, sort_order=?, meta_title=?, meta_description=?, updated_at=datetime('now')
    WHERE id=?
  `).run(
    req.body.title, slug, req.body.short_description, req.body.description,
    req.body.client || '', req.body.project_url || '', cover, gallery,
    req.body.category_id || null, technologies, req.body.completion_date || '',
    req.body.is_featured ? 1 : 0, req.body.is_published ? 1 : 0,
    Number(req.body.sort_order) || 0, req.body.meta_title || '', req.body.meta_description || '', id
  );
  req.flash('success', 'Project updated.');
  res.redirect('/admin/projects');
});

router.post('/projects/:id/delete', (req, res) => {
  db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
  req.flash('success', 'Project deleted.');
  res.redirect('/admin/projects');
});

// Categories
router.post('/categories', (req, res) => {
  const slug = uniqueSlug('categories', makeSlug(req.body.name));
  db.prepare('INSERT INTO categories (name, slug, type, sort_order) VALUES (?, ?, ?, ?)').run(
    req.body.name, slug, req.body.type || 'project', Number(req.body.sort_order) || 0
  );
  req.flash('success', 'Category added.');
  res.redirect(req.body.redirect || '/admin/projects');
});

// ─── Blog CRUD ──────────────────────────────────────────
router.get('/blog', (req, res) => {
  const posts = db.prepare(`
    SELECT b.*, c.name as category_name FROM blog_posts b
    LEFT JOIN categories c ON c.id = b.category_id
    ORDER BY b.id DESC
  `).all();
  res.render('admin/blog/index', { title: 'Blog Posts', posts });
});

router.get('/blog/new', (req, res) => {
  const categories = db.prepare(`SELECT * FROM categories WHERE type='blog' ORDER BY sort_order`).all();
  res.render('admin/blog/form', { title: 'New Post', post: null, categories });
});

router.post('/blog', uploadBlog.single('cover_file'), (req, res) => {
  const slug = uniqueSlug('blog_posts', makeSlug(req.body.slug || req.body.title));
  const tags = JSON.stringify((req.body.tags || '').split(',').map(s => s.trim()).filter(Boolean));
  let cover = req.body.cover_image || '';
  if (req.file) cover = saveMedia(req.file, 'blog');
  db.prepare(`
    INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, category_id, author_id, tags, is_featured, is_published, published_at, meta_title, meta_description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), ?, ?)
  `).run(
    req.body.title, slug, req.body.excerpt, req.body.content, cover,
    req.body.category_id || null, req.session.userId, tags,
    req.body.is_featured ? 1 : 0, req.body.is_published ? 1 : 0,
    req.body.meta_title || '', req.body.meta_description || ''
  );
  req.flash('success', 'Post created.');
  res.redirect('/admin/blog');
});

router.get('/blog/:id/edit', (req, res) => {
  const post = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(req.params.id);
  if (!post) return res.redirect('/admin/blog');
  post.tagsText = parseJson(post.tags).join(', ');
  const categories = db.prepare(`SELECT * FROM categories WHERE type='blog' ORDER BY sort_order`).all();
  res.render('admin/blog/form', { title: 'Edit Post', post, categories });
});

router.post('/blog/:id', uploadBlog.single('cover_file'), (req, res) => {
  const id = req.params.id;
  const slug = uniqueSlug('blog_posts', makeSlug(req.body.slug || req.body.title), id);
  const tags = JSON.stringify((req.body.tags || '').split(',').map(s => s.trim()).filter(Boolean));
  let cover = req.body.cover_image || '';
  if (req.file) cover = saveMedia(req.file, 'blog');
  db.prepare(`
    UPDATE blog_posts SET title=?, slug=?, excerpt=?, content=?, cover_image=?, category_id=?, tags=?,
    is_featured=?, is_published=?, meta_title=?, meta_description=?, updated_at=datetime('now') WHERE id=?
  `).run(
    req.body.title, slug, req.body.excerpt, req.body.content, cover,
    req.body.category_id || null, tags,
    req.body.is_featured ? 1 : 0, req.body.is_published ? 1 : 0,
    req.body.meta_title || '', req.body.meta_description || '', id
  );
  req.flash('success', 'Post updated.');
  res.redirect('/admin/blog');
});

router.post('/blog/:id/delete', (req, res) => {
  db.prepare('DELETE FROM blog_posts WHERE id = ?').run(req.params.id);
  req.flash('success', 'Post deleted.');
  res.redirect('/admin/blog');
});

// ─── Testimonials ───────────────────────────────────────
router.get('/testimonials', (req, res) => {
  const testimonials = db.prepare('SELECT * FROM testimonials ORDER BY sort_order, id DESC').all();
  res.render('admin/testimonials/index', { title: 'Testimonials', testimonials });
});

router.get('/testimonials/new', (req, res) => {
  res.render('admin/testimonials/form', { title: 'Add Testimonial', item: null });
});

router.post('/testimonials', (req, res) => {
  db.prepare(`
    INSERT INTO testimonials (name, role, company, avatar, content, rating, is_featured, is_published, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    req.body.name, req.body.role || '', req.body.company || '', req.body.avatar || '',
    req.body.content, Number(req.body.rating) || 5,
    req.body.is_featured ? 1 : 0, req.body.is_published ? 1 : 0, Number(req.body.sort_order) || 0
  );
  req.flash('success', 'Testimonial added.');
  res.redirect('/admin/testimonials');
});

router.get('/testimonials/:id/edit', (req, res) => {
  const item = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(req.params.id);
  if (!item) return res.redirect('/admin/testimonials');
  res.render('admin/testimonials/form', { title: 'Edit Testimonial', item });
});

router.post('/testimonials/:id', (req, res) => {
  db.prepare(`
    UPDATE testimonials SET name=?, role=?, company=?, avatar=?, content=?, rating=?, is_featured=?, is_published=?, sort_order=?
    WHERE id=?
  `).run(
    req.body.name, req.body.role || '', req.body.company || '', req.body.avatar || '',
    req.body.content, Number(req.body.rating) || 5,
    req.body.is_featured ? 1 : 0, req.body.is_published ? 1 : 0, Number(req.body.sort_order) || 0,
    req.params.id
  );
  req.flash('success', 'Testimonial updated.');
  res.redirect('/admin/testimonials');
});

router.post('/testimonials/:id/delete', (req, res) => {
  db.prepare('DELETE FROM testimonials WHERE id = ?').run(req.params.id);
  req.flash('success', 'Testimonial deleted.');
  res.redirect('/admin/testimonials');
});

// ─── Team ───────────────────────────────────────────────
router.get('/team', (req, res) => {
  const team = db.prepare('SELECT * FROM team_members ORDER BY sort_order').all();
  res.render('admin/team/index', { title: 'Team', team });
});

router.get('/team/new', (req, res) => {
  res.render('admin/team/form', { title: 'Add Member', member: null });
});

router.post('/team', uploadTeam.single('avatar_file'), (req, res) => {
  let avatar = req.body.avatar || '';
  if (req.file) avatar = saveMedia(req.file, 'team');
  const social = JSON.stringify({
    linkedin: req.body.linkedin || '',
    dribbble: req.body.dribbble || '',
    github: req.body.github || '',
    behance: req.body.behance || ''
  });
  db.prepare(`
    INSERT INTO team_members (name, role, bio, avatar, email, social_links, sort_order, is_published)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(req.body.name, req.body.role || '', req.body.bio || '', avatar, req.body.email || '', social,
    Number(req.body.sort_order) || 0, req.body.is_published ? 1 : 0);
  req.flash('success', 'Team member added.');
  res.redirect('/admin/team');
});

router.get('/team/:id/edit', (req, res) => {
  const member = db.prepare('SELECT * FROM team_members WHERE id = ?').get(req.params.id);
  if (!member) return res.redirect('/admin/team');
  member.social = parseJson(member.social_links, {});
  res.render('admin/team/form', { title: 'Edit Member', member });
});

router.post('/team/:id', uploadTeam.single('avatar_file'), (req, res) => {
  let avatar = req.body.avatar || '';
  if (req.file) avatar = saveMedia(req.file, 'team');
  const social = JSON.stringify({
    linkedin: req.body.linkedin || '',
    dribbble: req.body.dribbble || '',
    github: req.body.github || '',
    behance: req.body.behance || ''
  });
  db.prepare(`
    UPDATE team_members SET name=?, role=?, bio=?, avatar=?, email=?, social_links=?, sort_order=?, is_published=? WHERE id=?
  `).run(req.body.name, req.body.role || '', req.body.bio || '', avatar, req.body.email || '', social,
    Number(req.body.sort_order) || 0, req.body.is_published ? 1 : 0, req.params.id);
  req.flash('success', 'Team member updated.');
  res.redirect('/admin/team');
});

router.post('/team/:id/delete', (req, res) => {
  db.prepare('DELETE FROM team_members WHERE id = ?').run(req.params.id);
  req.flash('success', 'Team member deleted.');
  res.redirect('/admin/team');
});

// ─── Skills ─────────────────────────────────────────────
router.get('/skills', (req, res) => {
  const skills = db.prepare('SELECT * FROM skills ORDER BY sort_order').all();
  const experience = db.prepare('SELECT * FROM experience ORDER BY sort_order').all();
  const stats = db.prepare('SELECT * FROM stats ORDER BY sort_order').all();
  res.render('admin/skills/index', { title: 'Skills & Experience', skills, experience, stats });
});

router.post('/skills', (req, res) => {
  db.prepare('INSERT INTO skills (name, percentage, category, sort_order, is_published) VALUES (?, ?, ?, ?, ?)')
    .run(req.body.name, Number(req.body.percentage) || 80, req.body.category || 'Design', Number(req.body.sort_order) || 0, req.body.is_published ? 1 : 0);
  req.flash('success', 'Skill added.');
  res.redirect('/admin/skills');
});

router.post('/skills/:id/delete', (req, res) => {
  db.prepare('DELETE FROM skills WHERE id = ?').run(req.params.id);
  req.flash('success', 'Skill deleted.');
  res.redirect('/admin/skills');
});

router.post('/experience', (req, res) => {
  db.prepare(`
    INSERT INTO experience (title, company, location, start_date, end_date, is_current, description, type, sort_order, is_published)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `).run(req.body.title, req.body.company || '', req.body.location || '', req.body.start_date || '',
    req.body.end_date || '', req.body.is_current ? 1 : 0, req.body.description || '', req.body.type || 'work', Number(req.body.sort_order) || 0);
  req.flash('success', 'Experience added.');
  res.redirect('/admin/skills');
});

router.post('/experience/:id/delete', (req, res) => {
  db.prepare('DELETE FROM experience WHERE id = ?').run(req.params.id);
  req.flash('success', 'Experience deleted.');
  res.redirect('/admin/skills');
});

router.post('/stats', (req, res) => {
  db.prepare('INSERT INTO stats (label, value, suffix, sort_order, is_published) VALUES (?, ?, ?, ?, 1)')
    .run(req.body.label, req.body.value, req.body.suffix || '', Number(req.body.sort_order) || 0);
  req.flash('success', 'Stat added.');
  res.redirect('/admin/skills');
});

router.post('/stats/:id/delete', (req, res) => {
  db.prepare('DELETE FROM stats WHERE id = ?').run(req.params.id);
  req.flash('success', 'Stat deleted.');
  res.redirect('/admin/skills');
});

// ─── Messages ───────────────────────────────────────────
router.get('/messages', (req, res) => {
  const messages = db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all();
  res.render('admin/messages/index', { title: 'Messages', messages });
});

router.get('/messages/:id', (req, res) => {
  const message = db.prepare('SELECT * FROM messages WHERE id = ?').get(req.params.id);
  if (!message) return res.redirect('/admin/messages');
  db.prepare('UPDATE messages SET is_read = 1 WHERE id = ?').run(message.id);
  res.render('admin/messages/show', { title: 'Message', message });
});

router.post('/messages/:id/delete', (req, res) => {
  db.prepare('DELETE FROM messages WHERE id = ?').run(req.params.id);
  req.flash('success', 'Message deleted.');
  res.redirect('/admin/messages');
});

router.post('/messages/:id/replied', (req, res) => {
  db.prepare('UPDATE messages SET is_replied = 1, is_read = 1 WHERE id = ?').run(req.params.id);
  req.flash('success', 'Marked as replied.');
  res.redirect('/admin/messages/' + req.params.id);
});

// ─── Pages SEO ──────────────────────────────────────────
router.get('/pages', (req, res) => {
  const pages = db.prepare('SELECT * FROM pages ORDER BY sort_order').all();
  res.render('admin/pages/index', { title: 'Pages & SEO', pages });
});

router.get('/pages/:id/edit', (req, res) => {
  const page = db.prepare('SELECT * FROM pages WHERE id = ?').get(req.params.id);
  if (!page) return res.redirect('/admin/pages');
  res.render('admin/pages/form', { title: 'Edit Page SEO', page });
});

router.post('/pages/:id', (req, res) => {
  db.prepare(`
    UPDATE pages SET title=?, content=?, meta_title=?, meta_description=?, meta_keywords=?, is_published=?, updated_at=datetime('now')
    WHERE id=?
  `).run(req.body.title, req.body.content || '', req.body.meta_title || '', req.body.meta_description || '',
    req.body.meta_keywords || '', req.body.is_published ? 1 : 0, req.params.id);
  req.flash('success', 'Page updated.');
  res.redirect('/admin/pages');
});

// ─── Media ──────────────────────────────────────────────
router.get('/media', (req, res) => {
  const media = db.prepare('SELECT * FROM media ORDER BY created_at DESC').all();
  res.render('admin/media/index', { title: 'Media Library', media });
});

router.post('/media', upload.single('file'), (req, res) => {
  if (!req.file) {
    req.flash('error', 'Please choose a file.');
    return res.redirect('/admin/media');
  }
  saveMedia(req.file, 'general', req.body.alt_text || '');
  req.flash('success', 'File uploaded.');
  res.redirect('/admin/media');
});

router.post('/media/:id/delete', (req, res) => {
  const item = db.prepare('SELECT * FROM media WHERE id = ?').get(req.params.id);
  if (item) {
    const fs = require('fs');
    const full = path.join(__dirname, '..', 'public', item.path);
    if (fs.existsSync(full)) fs.unlinkSync(full);
    db.prepare('DELETE FROM media WHERE id = ?').run(item.id);
  }
  req.flash('success', 'Media deleted.');
  res.redirect('/admin/media');
});

module.exports = router;
