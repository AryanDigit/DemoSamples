function requireAuth(req, res, next) {
  if (req.session && req.session.userId) return next();
  req.flash('error', 'Please sign in to continue.');
  return res.redirect('/admin/login');
}

function guestOnly(req, res, next) {
  if (req.session && req.session.userId) return res.redirect('/admin');
  return next();
}

function attachLocals(req, res, next) {
  res.locals.currentUser = req.session.user || null;
  res.locals.flash = {
    success: req.flash('success'),
    error: req.flash('error'),
    info: req.flash('info')
  };
  res.locals.currentPath = req.path || '/';
  next();
}

module.exports = { requireAuth, guestOnly, attachLocals };
