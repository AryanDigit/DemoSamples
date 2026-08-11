# ZorBill User Manual

## Signing in

1. Open the ZorBill page URL.
2. Enter your Zoho-linked email (demo: `admin@zorbill.com`).
3. Select your role when testing (production roles come from Creator Users).
4. Click **Sign in with Zoho OAuth**.

Sessions expire after 45 minutes of inactivity.

## Roles

| Role | Access |
|------|--------|
| Super Admin | Everything including Settings & OAuth |
| Admin | All business modules + Settings |
| Staff | Sales, purchases, stock (no GST reports / settings) |
| Accountant | Billing, payments, expenses, GST, reports |

## Dashboard

View today’s sales, monthly revenue, customers, products, invoices, pending payments, GST collected, profit, and expenses. Charts show sales vs purchases and category mix.

## Customers & Suppliers

- Capture GSTIN, PAN, addresses, credit limits.
- Outstanding balances update from invoices/payments.
- Admins can export CSV.

## Products & Inventory

- Maintain SKU, HSN, GST %, warehouse, reorder level, expiry.
- Generate barcode / QR from the product row.
- Stock decreases on invoice save and increases when PO status is Received.
- Use **Stock Transfer** to move units between warehouses.
- Low-stock alerts appear on Inventory and Notifications.

## Quotations

Create quotes with validity dates. **To Invoice** converts an accepted/sent quote into a tax invoice.

## Billing

1. Click **New Invoice** (or top-bar shortcut).
2. Select customer (state code drives CGST/SGST vs IGST).
3. Add lines — search by name/SKU/barcode.
4. Apply discounts; totals and round-off calculate automatically.
5. Save as Draft or Pending/Paid.
6. Print/PDF, email (Zoho Mail), or WhatsApp share from the list.

Invoice numbers follow `INV-YYYY-####` (configurable prefix).

## Payments

Record receipts against open invoices. Cleared payments mark invoices Partial/Paid.

## Expenses

Log rent, utilities, salaries, etc. Included in P&L reports.

## GST

Monthly taxable value, CGST, SGST, IGST, CESS, and HSN-wise summary. Export CSV for GSTR preparation.

## Reports

Open any report card → preview → **CSV** or **PDF/Print**. Available: sales, purchases, customers, suppliers, GST, P&L, expenses, inventory, outstanding.

## Notifications

Bell icon shows unread alerts (low stock, overdue, sync). Use Notifications module to mark all read.

## Settings

- **Company** — legal name, GSTIN, invoice prefix
- **Zoho OAuth** — connect Books, Inventory, CRM, Mail, Analytics, Sign
- **Users & Roles** — permission matrix
- **Security** — session & audit notes
- **Backup** — download JSON snapshot / reset demo data

## Dark mode

Use the moon/sun icon in the sidebar footer.

## Tips

- Press `/` to focus global search.
- WhatsApp share opens `wa.me` with invoice summary text.
- Demo data persists in browser `localStorage` until cleared in Settings.
