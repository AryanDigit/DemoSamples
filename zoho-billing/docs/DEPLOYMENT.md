# Deployment Guide — ZorBill

## Architecture

```
┌─────────────────────┐     OAuth / Connections     ┌──────────────────┐
│  Zoho Creator App   │────────────────────────────▶│  Zoho Books API  │
│  · Forms (data)     │                             ├──────────────────┤
│  · Deluge workflows │────────────────────────────▶│ Zoho Inventory   │
│  · Pages (HTML/JS)  │                             ├──────────────────┤
│  · Schedules        │────────────────────────────▶│ Zoho CRM / Mail  │
└─────────────────────┘                             │ Analytics / Sign │
         ▲                                          └──────────────────┘
         │  Portal / published URL
         │
┌─────────────────────┐
│  Browser (ZorBill)  │  HTML · CSS · JS · Chart.js
└─────────────────────┘
```

No external VPS or third-party backend is deployed.

## Environments

| Env | Purpose | Data |
|-----|---------|------|
| Development | Creator staging app + demo JS | Sample / sandbox org |
| Production | Published Creator app | Live Books/Inventory orgs |

Duplicate the Creator application for staging. Keep separate OAuth clients per environment.

## Production checklist

- [ ] Company GSTIN, PAN, state code verified
- [ ] Invoice / quote / PO prefixes finalized
- [ ] OAuth connections authorized and tested
- [ ] Role profiles assigned to all users
- [ ] Session timeout confirmed (Creator session + JS guard)
- [ ] Nightly sync + payment reminder schedules enabled
- [ ] Email from-address verified in Zoho Mail
- [ ] Backup schedule writing to WorkDrive
- [ ] Activity log retention policy reviewed
- [ ] Custom domain / portal branding (optional)

## Publishing

1. Creator → **Publish** → Publish selected components (pages + forms needed by portal).
2. Enable **Customer Portal** if external accountants/staff need access without Zoho licenses (per plan).
3. Restrict page permissions by role profile.
4. Turn on **application audit** in Zoho One Admin Panel.

## Performance

- Index Creator fields used in searches: `Invoice_Number`, `SKU`, `GSTIN`, `Barcode`.
- Keep invoice line-item subforms under ~100 rows per document.
- Use nightly bulk sync instead of full re-sync on every page load.
- Serve Chart.js / icon fonts from CDN or Creator file cache.

## Security

- Never embed client secrets in HTML/JS. Secrets stay in Creator Connections.
- Encrypt org IDs and refresh tokens in `OAuth_Config` using Zoho encryption tasks where available.
- Enforce HTTPS (Zoho-hosted).
- Use RBAC function before rendering sensitive page sections.
- Escape all user-generated content in custom HTML (demo app uses `ZB.utils.esc`).

## Rollback

1. Creator → **History / Versions** → restore previous application version.
2. Re-import last JSON backup from Settings → Backup (`zorbill-backup.json` / WorkDrive export).

## Monitoring

- Activity_Logs form + dashboard widget
- Notifications for sync failures
- Zoho Books / Inventory API usage reports in API Console
