const multer = require('multer');
const path = require('path');
const fs = require('fs');
const slugify = require('slugify');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function createUploader(folder = 'general') {
  const dest = path.join(__dirname, '..', 'public', 'uploads', folder);
  ensureDir(dest);

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dest),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const base = slugify(path.basename(file.originalname, ext), { lower: true, strict: true }) || 'file';
      cb(null, `${base}-${Date.now()}${ext}`);
    }
  });

  return multer({
    storage,
    limits: { fileSize: 8 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      const allowed = /jpeg|jpg|png|gif|webp|svg|pdf/;
      const ok = allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype.split('/')[1] || file.mimetype);
      // Allow common image mimes
      const mimeOk = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'application/pdf'].includes(file.mimetype);
      cb(null, mimeOk);
    }
  });
}

module.exports = { createUploader };
