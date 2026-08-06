# ZorBill — Cloud Billing & Invoicing (Zoho Ecosystem)

Production-ready billing, invoicing, inventory, and GST software built **only** on the Zoho stack:

**Zoho Creator · Deluge · Zoho Books API · Zoho Inventory API · Zoho CRM API · Zoho OAuth · HTML/CSS/JS**

Inspired by Zoho Books, Tally Prime, Vyapar, and Marg ERP — white & blue theme, glassmorphism, dark mode, Material Icons, and interactive charts.

## Quick demo

```bash
cd zoho-billing
python3 -m http.server 8080
# → http://localhost:8080
```

Sign in with `admin@zorbill.com` (any password) and pick a role: Super Admin, Admin, Staff, or Accountant.

## Features

| Module | Capabilities |
|--------|----------------|
| Dashboard | Real-time KPIs, sales trends, category charts, activity log |
| Customers / Suppliers | GSTIN, PAN, addresses, credit limits, outstanding |
| Products | SKU, HSN, GST%, stock, barcode/QR, bulk import hook |
| Purchases | PO lifecycle, auto stock receive |
| Inventory | Low-stock alerts, warehouses, transfers, expiry |
| Quotations | Validity, convert to invoice |
| Billing | Auto numbers, CGST/SGST/IGST/CESS, discounts, round-off, PDF/print, email, WhatsApp |
| Payments | Receipt matching, status updates |
| Expenses | Category tracking for P&L |
| GST | Tax + HSN summaries, GSTR-oriented exports |
| Reports | Sales, purchase, P&L, inventory, outstanding → CSV/PDF |
| Settings | Company profile, OAuth connections, RBAC matrix, backup/audit |

## Stack constraints (honored)

- ❌ No Firebase, Supabase, Node.js, Laravel, Django, .NET, or third-party backends  
- ✅ Zoho Creator forms + Deluge workflows  
- ✅ Official Zoho Books / Inventory / CRM / Mail / Analytics / Sign APIs via OAuth  

## Project structure

```
zoho-billing/
├── index.html              # App shell (Creator Page)
├── assets/css|js           # UI + modules
├── sample-data/            # Demo dataset + CSV templates
├── deluge/                 # Forms, functions, workflows, schedulers
├── api/                    # OAuth & service notes
├── config/app-config.json
├── templates/invoices/     # Printable invoice HTML
└── docs/                   # Install, deploy, API, user manual
```

## Documentation

- [Installation](docs/INSTALLATION.md)
- [Deployment](docs/DEPLOYMENT.md)
- [API & OAuth](docs/API.md)
- [User Manual](docs/USER_MANUAL.md)

## Roles

Super Admin · Admin · Staff · Accountant — see Settings → Users & Roles for the permission matrix.

## License

Demo sample for evaluation and Zoho Creator deployment.
