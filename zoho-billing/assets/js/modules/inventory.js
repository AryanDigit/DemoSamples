/** Inventory — stock levels, low alerts, transfers, expiry */
ZB.modules = ZB.modules || {};
ZB.modules.inventory = {
  async render(root) {
    const d = ZB.API.getData();
    const products = d.products.filter((p) => p.warehouse !== "Virtual");
    const low = products.filter((p) => p.stock <= p.reorderLevel);
    const expiring = products.filter((p) => p.expiry && p.expiry < "2027-01-01");
    const transfers = await ZB.API.listTransfers();

    root.innerHTML = `
      ${ZB.ui.pageHeader("Inventory", "Auto stock updates · warehouses · transfers · expiry alerts", `
        <button type="button" class="btn btn-secondary btn-sm" id="inv-sync"><span class="material-icons-round">cloud_sync</span> Sync Inventory</button>
        <button type="button" class="btn btn-primary btn-sm" id="inv-transfer"><span class="material-icons-round">swap_horiz</span> Stock Transfer</button>
      `)}
      <div class="stat-pills">
        <div class="stat-pill">SKUs <strong>${products.length}</strong></div>
        <div class="stat-pill">Low stock <strong class="text-danger">${low.length}</strong></div>
        <div class="stat-pill">Warehouses <strong>${d.warehouses.length}</strong></div>
        <div class="stat-pill">Expiring soon <strong>${expiring.length}</strong></div>
      </div>
      <div class="two-col">
        <div class="card glass-card">
          <div class="card-header"><h3>Stock Levels</h3></div>
          <div class="table-wrap"><table class="data-table">
            <thead><tr><th>Product</th><th>WH</th><th>Stock</th><th>Reorder</th><th>Expiry</th></tr></thead>
            <tbody>${products.map((p) => `
              <tr>
                <td><strong>${ZB.utils.esc(p.name)}</strong><div class="mono text-muted">${ZB.utils.esc(p.sku)}</div></td>
                <td>${ZB.utils.esc(p.warehouse)}</td>
                <td class="${p.stock <= p.reorderLevel ? "text-danger" : "text-success"}"><strong>${p.stock}</strong></td>
                <td>${p.reorderLevel}</td>
                <td>${p.expiry ? ZB.utils.formatDate(p.expiry) : "—"}</td>
              </tr>`).join("")}</tbody>
          </table></div>
        </div>
        <div>
          <div class="card glass-card" style="margin-bottom:16px">
            <div class="card-header"><h3>Low Stock Alerts</h3></div>
            ${low.length ? low.map((p) => `
              <div class="notif-item" style="margin-bottom:8px">
                <h4>${ZB.utils.esc(p.name)}</h4>
                <p>${p.stock} left · reorder at ${p.reorderLevel} · ${ZB.utils.esc(p.warehouse)}</p>
              </div>`).join("") : ZB.ui.empty("check_circle", "All good", "No low-stock items.")}
          </div>
          <div class="card glass-card">
            <div class="card-header"><h3>Stock Transfers</h3></div>
            <div class="table-wrap"><table class="data-table">
              <thead><tr><th>Date</th><th>Route</th><th>Product</th><th>Qty</th><th>Status</th></tr></thead>
              <tbody>${transfers.map((t) => {
                const p = d.products.find((x) => x.id === t.productId);
                return `<tr>
                  <td>${ZB.utils.formatDate(t.date)}</td>
                  <td>${ZB.utils.esc(t.from)} → ${ZB.utils.esc(t.to)}</td>
                  <td>${ZB.utils.esc(p?.name || "—")}</td>
                  <td>${t.qty}</td>
                  <td>${ZB.ui.badge(t.status)}</td>
                </tr>`;
              }).join("")}</tbody>
            </table></div>
          </div>
        </div>
      </div>`;

    root.querySelector("#inv-sync")?.addEventListener("click", async () => {
      ZB.API.getData().oauth.inventory.connected = true;
      ZB.API.getData().oauth.inventory.lastSync = new Date().toISOString();
      ZB.API.save();
      ZB.toast("success", "Zoho Inventory synced", "Stock levels mirrored (demo).");
    });
    root.querySelector("#inv-transfer")?.addEventListener("click", () => this.openTransfer(root));
  },
  openTransfer(root) {
    const d = ZB.API.getData();
    ZB.modal.open({
      title: "Stock Transfer",
      body: `<form id="tr-form">
        <div class="form-group"><label>Product</label>
          <select name="productId">${d.products.map((p) => `<option value="${p.id}">${ZB.utils.esc(p.name)}</option>`).join("")}</select>
        </div>
        <div class="form-row">
          <div class="form-group"><label>From</label>
            <select name="from">${d.warehouses.map((w) => `<option value="${w.code}">${w.code}</option>`).join("")}</select>
          </div>
          <div class="form-group"><label>To</label>
            <select name="to">${d.warehouses.map((w) => `<option value="${w.code}">${w.code}</option>`).join("")}</select>
          </div>
          <div class="form-group"><label>Qty</label><input type="number" name="qty" value="10" min="1" /></div>
        </div>
      </form>`,
      footer: `<button type="button" class="btn btn-ghost" data-cancel>Cancel</button>
        <button type="button" class="btn btn-primary" id="tr-save">Transfer</button>`
    });
    document.querySelector("[data-cancel]")?.addEventListener("click", () => ZB.modal.close());
    document.getElementById("tr-save")?.addEventListener("click", async () => {
      const data = ZB.ui.formData(document.getElementById("tr-form"));
      if (data.from === data.to) { ZB.toast("error", "Invalid", "From and To must differ."); return; }
      await ZB.API.saveTransfer({ ...data, qty: Number(data.qty), date: ZB.utils.todayISO(), status: "completed" });
      ZB.logActivity(`Stock transfer ${data.from} → ${data.to}`);
      ZB.modal.close();
      ZB.toast("success", "Transfer recorded", "");
      this.render(root);
    });
  }
};
