const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'data.sqlite');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function migrate() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      avatar TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      setting_key TEXT NOT NULL UNIQUE,
      setting_value TEXT,
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      content TEXT,
      meta_title TEXT,
      meta_description TEXT,
      meta_keywords TEXT,
      og_image TEXT,
      is_published INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      short_description TEXT,
      description TEXT,
      icon TEXT,
      image TEXT,
      features TEXT,
      sort_order INTEGER DEFAULT 0,
      is_featured INTEGER DEFAULT 0,
      is_published INTEGER DEFAULT 1,
      meta_title TEXT,
      meta_description TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL DEFAULT 'project',
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      short_description TEXT,
      description TEXT,
      client TEXT,
      project_url TEXT,
      cover_image TEXT,
      gallery TEXT,
      category_id INTEGER,
      technologies TEXT,
      completion_date TEXT,
      is_featured INTEGER DEFAULT 0,
      is_published INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      meta_title TEXT,
      meta_description TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      excerpt TEXT,
      content TEXT,
      cover_image TEXT,
      category_id INTEGER,
      author_id INTEGER,
      tags TEXT,
      is_featured INTEGER DEFAULT 0,
      is_published INTEGER DEFAULT 1,
      published_at TEXT,
      meta_title TEXT,
      meta_description TEXT,
      views INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
      FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT,
      company TEXT,
      avatar TEXT,
      content TEXT NOT NULL,
      rating INTEGER DEFAULT 5,
      is_featured INTEGER DEFAULT 0,
      is_published INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS team_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT,
      bio TEXT,
      avatar TEXT,
      email TEXT,
      social_links TEXT,
      sort_order INTEGER DEFAULT 0,
      is_published INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      percentage INTEGER DEFAULT 80,
      category TEXT DEFAULT 'Design',
      icon TEXT,
      sort_order INTEGER DEFAULT 0,
      is_published INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT,
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      is_replied INTEGER DEFAULT 0,
      ip_address TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      original_name TEXT,
      path TEXT NOT NULL,
      mime_type TEXT,
      size INTEGER,
      alt_text TEXT,
      folder TEXT DEFAULT 'general',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS experience (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      company TEXT,
      location TEXT,
      start_date TEXT,
      end_date TEXT,
      is_current INTEGER DEFAULT 0,
      description TEXT,
      type TEXT DEFAULT 'work',
      sort_order INTEGER DEFAULT 0,
      is_published INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT NOT NULL,
      value TEXT NOT NULL,
      suffix TEXT DEFAULT '',
      icon TEXT,
      sort_order INTEGER DEFAULT 0,
      is_published INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      logo TEXT,
      url TEXT,
      sort_order INTEGER DEFAULT 0,
      is_published INTEGER DEFAULT 1
    );
  `);
}

migrate();

module.exports = db;
