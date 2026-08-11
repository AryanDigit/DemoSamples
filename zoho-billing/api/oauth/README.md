# Zoho OAuth setup notes

## Connections (recommended)

Create these in Zoho Creator → Settings → Connections:

| Connection name | Zoho service |
|-----------------|--------------|
| `zorbill_books` | Zoho Books |
| `zorbill_inventory` | Zoho Inventory |
| `zorbill_crm` | Zoho CRM |

Using Connections avoids storing refresh tokens in application code.

## Self-client (for scripts / testing)

1. API Console → Self Client → Generate code with scopes from `config/app-config.json`.
2. Exchange code for tokens within 3 minutes.
3. Store refresh token encrypted in `OAuth_Config` form — never in HTML/JS.

## Data centers

| Region | Accounts | APIs |
|--------|----------|------|
| India | accounts.zoho.in | www.zohoapis.in |
| US | accounts.zoho.com | www.zohoapis.com |
| EU | accounts.zoho.eu | www.zohoapis.eu |

Update `config/app-config.json` `region` and Deluge URLs accordingly.

## Frontend demo

The static UI toggles connection state in Settings for walkthroughs. Live OAuth redirects must run inside Creator pages / widgets.
