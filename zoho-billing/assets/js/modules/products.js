/**
 * Product Management — SKU, HSN, barcode, stock, bulk import
 */
ZB.modules = ZB.modules || {};

ZB.modules.products = {
  state: { page: 1, q: "", category: "all" },

  async render(root) {
    const all = await ZB.API.listProducts();
    const cats = ZB.API.getData().categories;
    let rows = ZB.utils.search(all, this.state.q, ["name", "sku", "hsn", "barcode"]);
    if (this.state.category !== "all") rows = rows.filter((p) => p.category === this.state.category);
    const meta = ZB.utils.paginate(rows, this.state.page, 8);

    root.innerHTML = `
      ${ZB.ui.pageHeader("Products", "SKU · HSN · pricing · stock · barcode · Zoho Inventory sync", `
        <button type="button" class="btn btn-secondary btn-sm" id="prod-import"><span class="material-icons-round">upload</span> Import</button>
        <button type="button" class="btn btn-primary btn-sm" id="prod-add"><span class="material-icons-round">add_box</span> Add Product</button>
      `)}
      <div class="card glass-card content-enter">
        <div class="toolbar">
          <div class="search-inline">
            <span class="material-icons-round">search</span>
            <input type="search" id="prod-q" placeholder="Search name, SKU, HSN, barcode…" value="${ZB.utils.esc(this.state.q)}" />
          </div>
          <select id="prod-cat">
            <option value="all">All categories</option>
            ${cats.map((c) => `<option value="${c}" ${this.state.category === c ? "selected" : ""}>${c}</option>`).join("")}
          </select>
        </div>
        ${meta.items.length ? `
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr>
              <th>Product</th><th>SKU</th><th>HSN</th><th>Price</th><th>GST</th><th>Stock</th><th>Warehouse</th><th></th>
            </tr></thead>
            <tbody>
              ${meta.items.map((p) => `
                <tr>
                  <td>
                    <div style="display:flex;align-items:center;gap:10px">
                      <div class="product-thumb">${ZB.utils.esc(p.name.slice(0, 2).toUpperCase())}</div>
                      <div><strong>${ZB.utils.esc(p.name)}</strong><div class="text-muted" style="font-size:0.75rem">${ZB.utils.esc(p.category)} · ${ZB.utils.esc(p.unit)}</div></div>
                    </div>
                  </td>
                  <td class="mono">${ZB.utils.esc(p.sku)}</td>
                  <td class="mono">${ZB.utils.esc(p.hsn)}</td>
                  <td>${ZB.utils.money(p.salePrice)}</td>
                  <td>${p.gstRate}%</td>
                  <td class="${p.stock <= p.reorderLevel ? "text-danger" : ""}"><strong>${p.stock}</strong></td>
                  <td>${ZB.utils.esc(p.warehouse)}</td>
                  <td class="table-actions">
                    <button type="button" class="icon-btn" data-barcode="${p.id}" title="Barcode"><span class="material-icons-round">qr_code_2</span></button>
                    <button type="button" class="icon-btn" data-edit="${p.id}" title="Edit"><span class="material-icons-round">edit</span></button>
                  </td>
                </tr>`).join("")}
            </tbody>
          </table>
        </div>
        ${ZB.ui.pagination(meta)}` : ZB.ui.empty("inventory_2", "No products", "Add products or import a CSV.")}
      </div>`;

    root.querySelector("#prod-q")?.addEventListener("input", ZB.utils.debounce((e) => {
      this.state.q = e.target.value; this.state.page = 1; this.render(root);
    }, 200));
    root.querySelector("#prod-cat")?.addEventListener("change", (e) => {
      this.state.category = e.target.value; this.state.page = 1; this.render(root);
    });
    root.querySelectorAll("[data-page]").forEach((b) =>
      b.addEventListener("click", () => { this.state.page = +b.dataset.page; this.render(root); })
    );
    root.querySelector("#prod-add")?.addEventListener("click", () => this.openForm(root));
    root.querySelectorAll("[data-edit]").forEach((b) =>
      b.addEventListener("click", () => this.openForm(root, all.find((p) => p.id === b.dataset.edit)))
    );
    root.querySelectorAll("[data-barcode]").forEach((b) =>
      b.addEventListener("click", () => this.showBarcode(all.find((p) => p.id === b.dataset.barcode)))
    );
    root.querySelector("#prod-import")?.addEventListener("click", () => {
      ZB.toast("info", "Bulk import", "Upload CSV via Zoho Creator import or use sample template in /sample-data/products-import.csv");
    });
  },

  openForm(root, p = null) {
    const cats = ZB.API.getData().categories;
    const wh = ZB.API.getData().warehouses;
    ZB.modal.open({
      title: p ? "Edit Product" : "Add Product",
      size: "modal-lg",
      body: `
        <form id="prod-form">
          <input type="hidden" name="id" value="${ZB.utils.esc(p?.id || "")}" />
          <div class="form-row">
            <div class="form-group"><label>Name *</label><input name="name" required value="${ZB.utils.esc(p?.name || "")}" /></div>
            <div class="form-group"><label>SKU *</label><input name="sku" required value="${ZB.utils.esc(p?.sku || "")}" /></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>HSN / SAC</label><input name="hsn" value="${ZB.utils.esc(p?.hsn || "")}" /></div>
            <div class="form-group"><label>Category</label>
              <select name="category">${cats.map((c) => `<option ${p?.category === c ? "selected" : ""}>${c}</option>`).join("")}</select>
            </div>
            <div class="form-group"><label>Unit</label>
              <select name="unit">${["Pcs","Ream","Pack","Can","Kg","Ltr","Yr","Box"].map((u) => `<option ${p?.unit === u ? "selected" : ""}>${u}</option>`).join("")}</select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>Purchase Price</label><input type="number" step="0.01" name="purchasePrice" value="${p?.purchasePrice ?? 0}" /></div>
            <div class="form-group"><label>Sale Price *</label><input type="number" step="0.01" name="salePrice" required value="${p?.salePrice ?? 0}" /></div>
            <div class="form-group"><label>GST %</label>
              <select name="gstRate">${[0,5,12,18,28].map((r) => `<option value="${r}" ${Number(p?.gstRate) === r ? "selected" : ""}>${r}%</option>`).join("")}</select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>Stock</label><input type="number" name="stock" value="${p?.stock ?? 0}" /></div>
            <div class="form-group"><label>Reorder Level</label><input type="number" name="reorderLevel" value="${p?.reorderLevel ?? 10}" /></div>
            <div class="form-group"><label>Warehouse</label>
              <select name="warehouse">${wh.map((w) => `<option value="${w.code}" ${p?.warehouse === w.code ? "selected" : ""}>${w.name}</option>`).join("")}</select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>Barcode</label><input name="barcode" value="${ZB.utils.esc(p?.barcode || "")}" placeholder="Auto if blank" /></div>
            <div class="form-group"><label>Expiry (optional)</label><input type="date" name="expiry" value="${ZB.utils.esc(p?.expiry || "")}" /></div>
          </div>
        </form>`,
      footer: `
        <button type="button" class="btn btn-ghost" data-cancel>Cancel</button>
        <button type="button" class="btn btn-primary" id="prod-save">Save Product</button>`
    });
    document.querySelector("[data-cancel]")?.addEventListener("click", () => ZB.modal.close());
    document.getElementById("prod-save")?.addEventListener("click", async () => {
      const form = document.getElementById("prod-form");
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const data = ZB.ui.formData(form);
      ["purchasePrice", "salePrice", "gstRate", "stock", "reorderLevel"].forEach((k) => (data[k] = Number(data[k]) || 0));
      if (!data.barcode) data.barcode = "890" + String(Date.now()).slice(-10);
      if (!data.id) delete data.id;
      data.status = "active";
      await ZB.API.saveProduct(data);
      ZB.logActivity(`Saved product ${data.name}`);
      ZB.modal.close();
      ZB.toast("success", "Product saved", "Ready for Zoho Inventory sync.");
      this.render(root);
    });
  },

  showBarcode(p) {
    if (!p) return;
    ZB.modal.open({
      title: `Barcode / QR — ${p.name}`,
      body: `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
          <div class="barcode-preview"><svg id="barcode-svg"></svg><div class="mono">${ZB.utils.esc(p.barcode)}</div></div>
          <div class="qr-preview"><canvas id="qr-canvas"></canvas><div class="text-muted">SKU ${ZB.utils.esc(p.sku)}</div></div>
        </div>`,
      footer: `<button type="button" class="btn btn-primary" data-cancel>Close</button>`
    });
    document.querySelector("[data-cancel]")?.addEventListener("click", () => ZB.modal.close());
    setTimeout(() => {
      if (window.JsBarcode) {
        try { JsBarcode("#barcode-svg", p.barcode, { format: "EAN13", width: 1.5, height: 60, displayValue: true }); }
        catch { JsBarcode("#barcode-svg", p.barcode, { format: "CODE128", width: 1.5, height: 60 }); }
      }
      if (window.QRCode) {
        QRCode.toCanvas(document.getElementById("qr-canvas"), JSON.stringify({ sku: p.sku, barcode: p.barcode, name: p.name }), { width: 140 });
      }
    }, 50);
  }
};
