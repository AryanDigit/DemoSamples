/** Settings — company, OAuth, roles, security */
ZB.modules = ZB.modules || {};
ZB.modules.settings = {
  tab: "company",

  async render(root) {
    const d = ZB.API.getData();
    const tabs = [
      { id: "company", label: "Company" },
      { id: "oauth", label: "Zoho OAuth" },
      { id: "users", label: "Users & Roles" },
      { id: "security", label: "Security" },
      { id: "backup", label: "Backup & Audit" }
    ];

    root.innerHTML = `
      ${ZB.ui.pageHeader("Settings", "Organization · OAuth connections · RBAC · security", "")}
      <div class="settings-grid content-enter">
        <div class="card glass-card settings-nav">
          ${tabs.map((t) => `<button type="button" data-tab="${t.id}" class="${this.tab === t.id ? "active" : ""}">${t.label}</button>`).join("")}
        </div>
        <div class="card glass-card" id="settings-panel">${this.panel()}</div>
      </div>`;

    root.querySelectorAll("[data-tab]").forEach((b) =>
      b.addEventListener("click", () => {
        this.tab = b.dataset.tab;
        this.render(root);
      })
    );
    this.bind(root);
  },

  panel() {
    const d = ZB.API.getData();
    if (this.tab === "company") {
      return `
        <h3 style="margin-bottom:14px">Company Profile</h3>
        <form id="co-form">
          <div class="form-row">
            <div class="form-group"><label>Legal Name</label><input name="name" value="${ZB.utils.esc(d.company.name)}" /></div>
            <div class="form-group"><label>Trade Name</label><input name="tradeName" value="${ZB.utils.esc(d.company.tradeName)}" /></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>GSTIN</label><input name="gstin" value="${ZB.utils.esc(d.company.gstin)}" /></div>
            <div class="form-group"><label>PAN</label><input name="pan" value="${ZB.utils.esc(d.company.pan)}" /></div>
            <div class="form-group"><label>State Code</label><input name="stateCode" value="${ZB.utils.esc(d.company.stateCode)}" /></div>
          </div>
          <div class="form-group"><label>Address</label><input name="address" value="${ZB.utils.esc(d.company.address)}" /></div>
          <div class="form-row">
            <div class="form-group"><label>Invoice Prefix</label><input name="invoicePrefix" value="${ZB.utils.esc(d.company.invoicePrefix)}" /></div>
            <div class="form-group"><label>Email</label><input name="email" value="${ZB.utils.esc(d.company.email)}" /></div>
          </div>
          <button type="submit" class="btn btn-primary">Save Company</button>
        </form>`;
    }
    if (this.tab === "oauth") {
      const services = [
        { key: "books", name: "Zoho Books", desc: "Invoices, payments, contacts" },
        { key: "inventory", name: "Zoho Inventory", desc: "Items, stock, warehouses" },
        { key: "crm", name: "Zoho CRM", desc: "Leads & accounts" },
        { key: "mail", name: "Zoho Mail", desc: "Invoice email delivery" },
        { key: "analytics", name: "Zoho Analytics", desc: "BI dashboards" },
        { key: "sign", name: "Zoho Sign", desc: "E-sign quotations" }
      ];
      return `
        <h3 style="margin-bottom:8px">Zoho OAuth Connections</h3>
        <p class="text-muted" style="margin-bottom:16px">Production uses Zoho OAuth 2.0 with offline refresh tokens. Demo toggles connection state.</p>
        ${services.map((s) => {
          const st = d.oauth[s.key];
          return `
            <div class="oauth-status ${st.connected ? "connected" : ""}">
              <span class="dot"></span>
              <div style="flex:1">
                <strong>${s.name}</strong>
                <div class="text-muted" style="font-size:0.78rem">${s.desc}${st.lastSync ? " · Last sync " + ZB.utils.formatDateTime(st.lastSync) : ""}</div>
              </div>
              <button type="button" class="btn btn-sm ${st.connected ? "btn-ghost" : "btn-primary"}" data-oauth="${s.key}">
                ${st.connected ? "Disconnect" : "Connect"}
              </button>
            </div>`;
        }).join("")}
        <p class="form-hint" style="margin-top:12px">Authorize URL scopes: Books, Inventory, CRM, Mail, Analytics, Sign. See <code>docs/API.md</code>.</p>`;
    }
    if (this.tab === "users") {
      return `
        <h3 style="margin-bottom:14px">Users &amp; Role Permissions</h3>
        <div class="table-wrap"><table class="data-table">
          <thead><tr><th>User</th><th>Email</th><th>Role</th></tr></thead>
          <tbody>${d.users.map((u) => `
            <tr>
              <td><strong>${ZB.utils.esc(u.name)}</strong></td>
              <td>${ZB.utils.esc(u.email)}</td>
              <td>${ZB.ui.badge(u.role)}</td>
            </tr>`).join("")}</tbody>
        </table></div>
        <div style="margin-top:16px" class="table-wrap"><table class="data-table">
          <thead><tr><th>Module</th><th>Super Admin</th><th>Admin</th><th>Staff</th><th>Accountant</th></tr></thead>
          <tbody>${["dashboard","customers","products","suppliers","purchases","inventory","expenses","quotations","billing","payments","gst","reports","settings"].map((m) => `
            <tr>
              <td>${m}</td>
              <td>✓</td>
              <td>${ZB.RBAC.can("admin", m) ? "✓" : "—"}</td>
              <td>${ZB.RBAC.can("staff", m) ? "✓" : "—"}</td>
              <td>${ZB.RBAC.can("accountant", m) ? "✓" : "—"}</td>
            </tr>`).join("")}</tbody>
        </table></div>`;
    }
    if (this.tab === "security") {
      return `
        <h3 style="margin-bottom:14px">Security</h3>
        <ul style="display:flex;flex-direction:column;gap:10px;color:var(--text-secondary)">
          <li>✓ Session timeout: ${ZB.auth.TIMEOUT_MIN} minutes of inactivity</li>
          <li>✓ Role-based module gating on navigation</li>
          <li>✓ Activity audit log for sensitive actions</li>
          <li>✓ OAuth tokens stored encrypted in Zoho Creator (production)</li>
          <li>✓ HTML escaping on all rendered fields (XSS mitigation)</li>
          <li>✓ Demo data cached in localStorage only for this browser</li>
        </ul>
        <button type="button" class="btn btn-danger btn-sm" id="clear-cache" style="margin-top:16px">Clear local demo cache</button>`;
    }
    // backup
    return `
      <h3 style="margin-bottom:14px">Backup &amp; Audit</h3>
      <p class="text-muted" style="margin-bottom:12px">Export JSON snapshot or review recent activity. Nightly Deluge schedules back up to Zoho WorkDrive.</p>
      <div style="display:flex;gap:8px;margin-bottom:16px">
        <button type="button" class="btn btn-primary btn-sm" id="backup-json">Download JSON Backup</button>
        <button type="button" class="btn btn-secondary btn-sm" id="reset-demo">Reset Sample Data</button>
      </div>
      <div class="table-wrap"><table class="data-table">
        <thead><tr><th>Time</th><th>User</th><th>Action</th></tr></thead>
        <tbody>${d.activityLog.slice(0, 20).map((a) => `
          <tr>
            <td>${ZB.utils.formatDateTime(a.time)}</td>
            <td>${ZB.utils.esc(a.user)}</td>
            <td>${ZB.utils.esc(a.action)}</td>
          </tr>`).join("")}</tbody>
      </table></div>`;
  },

  bind(root) {
    root.querySelector("#co-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      Object.assign(ZB.API.getData().company, ZB.ui.formData(e.target));
      ZB.API.save();
      ZB.logActivity("Updated company profile");
      ZB.toast("success", "Saved", "Company profile updated.");
    });
    root.querySelectorAll("[data-oauth]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const key = btn.dataset.oauth;
        const st = ZB.API.getData().oauth[key];
        if (st.connected) ZB.API.disconnectService(key);
        else ZB.API.connectService(key);
        ZB.logActivity(`${st.connected ? "Disconnected" : "Connected"} Zoho ${key}`);
        ZB.toast("success", st.connected ? "Disconnected" : "Connected", `Zoho ${key}`);
        this.render(root);
      })
    );
    root.querySelector("#clear-cache")?.addEventListener("click", () => {
      localStorage.removeItem("zorbill_data_cache");
      ZB.toast("success", "Cache cleared", "Reload to restore original sample data.");
    });
    root.querySelector("#backup-json")?.addEventListener("click", () => {
      ZB.utils.download("zorbill-backup.json", JSON.stringify(ZB.API.getData(), null, 2), "application/json");
      ZB.toast("success", "Backup ready", "");
    });
    root.querySelector("#reset-demo")?.addEventListener("click", () => {
      localStorage.removeItem("zorbill_data_cache");
      location.reload();
    });
  }
};
