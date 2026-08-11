# ZorBill API Documentation

ZorBill integrates exclusively with the **Zoho ecosystem** via OAuth 2.0 and official REST APIs. No Node.js, Firebase, Supabase, Laravel, Django, or .NET backends are used.

## Authentication (OAuth 2.0)

1. Register a Self Client / Server-based application in [Zoho API Console](https://api-console.zoho.com/).
2. Add scopes listed in `config/app-config.json`.
3. In Zoho Creator, create **Connections** named:
   - `zorbill_books`
   - `zorbill_inventory`
   - `zorbill_crm`
4. Store `organization_id` values in the `OAuth_Config` Creator form (encrypted fields).

### Authorize URL

```
https://accounts.zoho.in/oauth/v2/auth
  ?scope=ZohoBooks.fullaccess.all,ZohoInventory.FullAccess.all,ZohoCRM.modules.ALL,...
  &client_id=YOUR_CLIENT_ID
  &response_type=code
  &access_type=offline
  &redirect_uri=YOUR_REDIRECT
  &prompt=consent
```

### Token exchange (Deluge)

```deluge
resp = invokeurl
[
  url :"https://accounts.zoho.in/oauth/v2/token"
  type :POST
  parameters: {
    "code": code,
    "client_id": clientId,
    "client_secret": clientSecret,
    "redirect_uri": redirectUri,
    "grant_type": "authorization_code"
  }
];
```

Prefer Creator **Connections** so refresh tokens are managed by Zoho.

---

## Zoho Books API

Base: `https://www.zohoapis.in/books/v3` (India DC; use `.com` for US)

| Action | Method | Endpoint |
|--------|--------|----------|
| List contacts | GET | `/contacts?organization_id={org}` |
| Create contact | POST | `/contacts?organization_id={org}` |
| Create invoice | POST | `/invoices?organization_id={org}` |
| Update invoice | PUT | `/invoices/{id}?organization_id={org}` |
| Customer payment | POST | `/customerpayments?organization_id={org}` |
| Taxes | GET | `/settings/taxes?organization_id={org}` |

Deluge reference: `deluge/functions/Sync_Invoice_To_Books.dg`

---

## Zoho Inventory API

Base: `https://www.zohoapis.in/inventory/v1`

| Action | Method | Endpoint |
|--------|--------|----------|
| Create item | POST | `/items?organization_id={org}` |
| Adjust stock | POST | `/inventoryadjustments?organization_id={org}` |
| Warehouses | GET | `/warehouses?organization_id={org}` |
| Transfer order | POST | `/transferorders?organization_id={org}` |

Deluge reference: `deluge/functions/Sync_Stock_To_Inventory.dg`

---

## Zoho CRM API

Base: `https://www.zohoapis.in/crm/v2`

| Action | Method | Endpoint |
|--------|--------|----------|
| Upsert Account | POST | `/Accounts/upsert` |
| Search | GET | `/Accounts/search?criteria=...` |

Use `zoho.crm.upsert` in Deluge when the CRM integration is enabled for the Creator app.

---

## Zoho Mail

Use Deluge `sendmail` or Mail API:

```
POST https://mail.zoho.in/api/accounts/{accountId}/messages
```

Invoice emails: `deluge/functions/Send_Invoice_Email.dg`

---

## Zoho Analytics

Push aggregate tables nightly (sales, GST, inventory valuation) via Analytics Data API, or embed Analytics dashboards in Creator pages with iframe / JS API.

---

## Zoho Sign

Send quotation PDFs for e-signature:

```
POST https://sign.zoho.in/api/v1/requests
```

Attach generated invoice/quote PDF from Creator file field.

---

## Frontend API client (demo)

`assets/js/api-client.js` mirrors these operations against sample data when running the static demo. Switch `ZB.API.mode` to `"live"` only inside Creator pages that proxy through Deluge.

## Error handling

All Deluge sync functions wrap `invokeurl` in `try/catch`, write to `Activity_Logs`, and surface Creator notifications on failure. HTTP non-zero Books/Inventory `code` values are returned as `ERROR:...` strings for workflow branching.

## Rate limits

Respect Zoho API concurrency limits. Nightly schedulers batch syncs; interactive saves sync only the changed record.
