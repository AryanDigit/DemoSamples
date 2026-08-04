require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const helmet = require('helmet');
const compression = require('compression');
const { attachLocals } = require('./middleware/auth');
const { getSettings } = require('./config/helpers');
const db = require('./database/db');

const webRoutes = require('./routes/web');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Security & performance
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(compression());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);
app.set('trust proxy', 1);

app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: process.env.NODE_ENV === 'production' ? '7d' : 0
}));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(session({
  name: 'atelier.sid',
  secret: process.env.SESSION_SECRET || 'atelier-dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 8 // 8 hours
  }
}));
app.use(flash());
app.use(attachLocals);

// Global template helpers
app.use((req, res, next) => {
  res.locals.settings = getSettings();
  res.locals.siteUrl = process.env.SITE_URL || `${req.protocol}://${req.get('host')}`;
  res.locals.siteName = getSettings().site_name || 'Atelier';
  res.locals.year = new Date().getFullYear();
  res.locals.unreadMessages = 0;
  if (req.session && req.session.userId) {
    try {
      res.locals.unreadMessages = db.prepare('SELECT COUNT(*) as c FROM messages WHERE is_read = 0').get().c;
    } catch (_) {}
  }
  next();
});

// Maintenance mode (skip admin)
app.use((req, res, next) => {
  const settings = getSettings();
  if (settings.maintenance_mode === '1' && !req.path.startsWith('/admin') && !req.path.startsWith('/css') && !req.path.startsWith('/js')) {
    return res.status(503).render('pages/maintenance', {
      settings,
      meta: { title: 'Maintenance' },
      siteName: settings.site_name || 'Atelier',
      year: new Date().getFullYear(),
      layout: false
    });
  }
  next();
});

app.use('/', webRoutes);
app.use('/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).render('pages/404', {
    settings: getSettings(),
    meta: { title: 'Page Not Found' },
    siteName: getSettings().site_name || 'Atelier',
    year: new Date().getFullYear(),
    formatDate: () => '',
    parseJson: () => [],
    marked: { parse: (s) => s }
  });
});

app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).send('Something went wrong. Please try again.');
});

// Auto-seed if empty
const userCount = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
if (userCount === 0) {
  console.log('No users found — running seed...');
  require('./database/seed');
}

app.listen(PORT, () => {
  console.log(`\n✦ Atelier Portfolio CMS`);
  console.log(`  Site:  http://localhost:${PORT}`);
  console.log(`  Admin: http://localhost:${PORT}/admin`);
  console.log(`  Login: ${process.env.ADMIN_EMAIL || 'admin@atelier.demo'} / ${process.env.ADMIN_PASSWORD || 'Admin@12345'}\n`);
});

module.exports = app;
