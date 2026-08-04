# Atelier — Premium Portfolio CMS

A modern, ThemeForest-grade portfolio website with a secure Admin Panel (CMS). Built for freelancers, web developers, designers, digital agencies, photographers, architects, software developers, marketing agencies, and creative professionals.

## Features

### Public website
- Full-bleed hero with GSAP + AOS motion
- About, Services, Portfolio (filterable), Blog, Contact
- Project & service detail pages, Markdown blog posts
- Testimonials, team, skills, experience, stats
- SEO: meta tags, Open Graph, JSON-LD, sitemap.xml, robots.txt
- Mobile-first responsive layout, fast static assets + compression

### Admin CMS (`/admin`)
Manage the entire site without editing code:
- Site settings (brand, hero, about, contact, social, SEO, custom CSS/JS)
- Services, portfolio projects, categories
- Blog posts, testimonials, team members
- Skills, experience, stats counters
- Contact inbox with read/replied status
- Pages SEO meta, media library uploads
- Secure session auth (bcrypt passwords, httpOnly cookies, Helmet)

## Tech stack

| Layer | Stack |
|-------|--------|
| Frontend | HTML5, CSS3, JavaScript (ES6), EJS |
| Motion | AOS + GSAP (ScrollTrigger) |
| Backend | Node.js + Express |
| Database | SQLite (MySQL-compatible schema; swap-ready) |
| Security | Helmet, bcrypt, express-session, input validation |

> PHP/Laravel was preferred in the brief; this environment ships Node.js. The CMS architecture mirrors a typical Laravel admin (CRUD modules, settings, media, SEO).

## Quick start

```bash
cd portfolio-cms
cp .env.example .env
npm install
npm run seed
npm start
```

- **Site:** http://localhost:3000  
- **Admin:** http://localhost:3000/admin  
- **Default login:** `admin@atelier.demo` / `Admin@12345`

Change `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `SESSION_SECRET` in `.env` before production.

## Admin modules

| Module | What you can manage |
|--------|---------------------|
| Site Settings | Brand name, hero copy/image, about, contact, social links, SEO defaults, analytics, maintenance mode |
| Pages & SEO | Per-page titles and meta descriptions |
| Services | Full CRUD + features + images |
| Portfolio | Projects, categories, galleries, tech tags |
| Blog | Markdown posts, tags, covers |
| Testimonials | Quotes, ratings, avatars |
| Team | Members, bios, social links |
| Skills & Stats | Skill bars, counters, experience timeline |
| Messages | Contact form inbox |
| Media | Upload images/PDFs for reuse |

## Design direction

- **Brand:** Atelier — ink & teal editorial aesthetic  
- **Type:** Syne (display) + DM Sans (body)  
- **Motion:** Preloader, hero entrance, scroll reveals, skill bars, stat counters  

## Production notes

1. Set `NODE_ENV=production` and a strong `SESSION_SECRET`
2. Put Nginx/Caddy in front; enable HTTPS (`secure` cookies activate in production)
3. Back up `database/data.sqlite` and `public/uploads/`
4. For MySQL: migrate the schema in `database/db.js` to MySQL and replace the `better-sqlite3` adapter with `mysql2`

## License

MIT — suitable as a demo / starter for ThemeForest-style portfolio products.
