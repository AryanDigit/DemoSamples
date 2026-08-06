# Installation Guide — ZorBill

## Prerequisites

- Zoho One / Zoho Creator paid plan (or trial)
- Zoho Books organization
- Zoho Inventory organization (can share Books org)
- Zoho CRM (optional but recommended)
- Zoho Mail for outbound invoices
- Admin access to [API Console](https://api-console.zoho.com/)

**Not required:** Node.js, Firebase, Supabase, Laravel, Django, .NET, or any third-party hosting backend.

## 1. Create the Creator application

1. Open Zoho Creator → **Create Application** → **Create from scratch**.
2. Name it **ZorBill**.
3. Create forms matching schemas in `deluge/forms/`:
   - Customers, Suppliers, Products, Warehouses
   - Invoices (+ Line_Items subform), Quotations, Purchases
   - Payments, Expenses, Stock_Transfers
   - Notifications, Activity_Logs, Users, Company_Settings, OAuth_Config

## 2. Import Deluge scripts

1. For each form, open **Workflows** → paste scripts from `deluge/forms/` and `deluge/workflows/`.
2. Under **Microservices / Functions**, create functions from `deluge/functions/`.
3. Under **Schedules**, add jobs from `deluge/schedulers/Nightly_Jobs.dg`.

## 3. Configure OAuth connections

1. Creator → **Settings** → **Connections** → Add Zoho Books, Inventory, CRM.
2. Name them exactly: `zorbill_books`, `zorbill_inventory`, `zorbill_crm`.
3. Authorize with the admin Zoho account.
4. Fill `OAuth_Config` and `Company_Settings` records (GSTIN, state code, prefixes).

## 4. Deploy the UI page

1. Creator → **Pages** → Create page **ZorBill_App**.
2. Add an **HTML snippet** / panel and paste contents of `index.html` **or** host static assets in Creator’s file storage / WorkDrive and reference them.
3. Upload CSS/JS from `assets/` (or zip and attach).
4. For production, replace demo `ZB.API` calls with `ZOHO.CREATOR.API` / widget SDK invocations that call published Creator functions.

### Quick local preview (no Zoho account)

```bash
cd zoho-billing
# Any static server, e.g.:
python3 -m http.server 8080
# Open http://localhost:8080
```

Demo login: `admin@zorbill.com` / `demo1234` (any password works in demo). Pick a role to test RBAC.

## 5. Roles & sharing

1. Create Creator profiles: Super Admin, Admin, Staff, Accountant.
2. Map permissions using `RBAC_Can_Access` and page visibility rules.
3. Share the application with portal users or organization users.

## 6. Sample data

Import CSVs from `sample-data/` via Creator **Import Data**, or use the bundled `demo-data.js` for UI preview.

## 7. Verify integrations

1. Settings → Zoho OAuth → Connect each service (demo) or authorize connections (live).
2. Create a test customer → confirm Books contact + CRM account.
3. Create invoice → confirm stock decrement + Books invoice ID.
4. Trigger payment reminder schedule in test mode.

See also: [DEPLOYMENT.md](./DEPLOYMENT.md) · [USER_MANUAL.md](./USER_MANUAL.md) · [API.md](./API.md)
