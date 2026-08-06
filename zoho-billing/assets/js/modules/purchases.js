/** Purchase Management — PO with stock receive */
ZB.modules = ZB.modules || {};
ZB.modules.purchases = {
  state: { page: 1, q: "" },
  async render(root) {
    const d = ZB.API.getData();
    const all = await ZB.API.listPurchases();
    const rows = ZB.utils.search(all, this.state.q, ["number", "notes"]);
    const meta = ZB.utils.paginate(rows, this.state.page, 8);
    root.innerHTML = `
      ${ZB.ui.pageHeader("Purchases", "Purchase orders · receive stock · Zoho Inventory sync", `
        <button type="button" class="btn btn-primary btn-sm" id="po-add"><span class="material-icons-round">add_shopping_cart</span> New PO</button>
      `)}
      <div class="card glass-card content-enter">
        <div class="toolbar">
          <div class="search-inline"><span class="material-icons-round">search</span>
            <input id="po-q" type="search" value="${ZB.utils.esc(this.state.q)}" placeholder="Search PO…" />
          </div>
        </div>
        <div class="table-wrap"><table class="data-table">
          <thead><tr><th>PO #</th><th>Supplier</th><th>Date</th><th>Items</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>${meta.items.map((po) => {
            const sup = d.suppliers.find((s) => s.id === po.supplierId);
            let amt = 0;
            (po.items || []).forEach((it) => {
              const tax = ZB.GST.lineTax(it, "intra");
              amt += tax.total;
            });
            return `<tr>
              <td class="mono">${ZB.utils.esc(po.number)}</td>
              <td>${ZB.utils.esc(sup?.name || "—")}</td>
              <td>${ZB.utils.formatDate(po.date)}</td>
              <td>${(po.items || []).length}</td>
              <td>${ZB.utils.money(amt)}</td>
              <td>${ZB.ui.badge(po.status)}</td>
            </tr>`;
          }).join("")}</tbody>
        </table></div>
        ${ZB.ui.pagination(meta)}
      </div>`;
    root.querySelector("#po-q")?.addEventListener("input", ZB.utils.debounce((e) => { this.state.q = e.target.value; this.state.page = 1; this.render(root); }, 200));
    root.querySelectorAll("[data-page]").forEach((b) => b.addEventListener("click", () => { this.state.page = +b.dataset.page; this.render(root); }));
    root.querySelector("#po-add")?.addEventListener("click", () => this.openForm(root));
  },
  openForm(root) {
    const d = ZB.API.getData();
    ZB.modal.open({
      title: "New Purchase Order",
      size: "modal-lg",
      body: `<form id="po-form">
        <div class="form-row">
          <div class="form-group"><label>Supplier *</label>
            <select name="supplierId" required>${d.suppliers.map((s) => `<option value="${s.id}">${ZB.utils.esc(s.name)}</option>`).join("")}</select>
          </div>
          <div class="form-group"><label>Date</label><input type="date" name="date" value="${ZB.utils.todayISO()}" /></div>
          <div class="form-group"><label>Status</label>
            <select name="status"><option value="ordered">Ordered</option><option value="received">Received (update stock)</option><option value="partial">Partial</option><option value="billed">Billed</option></select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Product</label>
            <select name="productId">${d.products.map((p) => `<option value="${p.id}">${ZB.utils.esc(p.name)}</option>`).join("")}</select>
          </div>
          <div class="form-group"><label>Qty</label><input type="number" name="qty" value="10" min="1" /></div>
          <div class="form-group"><label>Rate</label><input type="number" step="0.01" name="rate" value="100" /></div>
        </div>
        <div class="form-group"><label>Notes</label><textarea name="notes"></textarea></div>
      </form>`,
      footer: `<button type="button" class="btn btn-ghost" data-cancel>Cancel</button>
        <button type="button" class="btn btn-primary" id="po-save">Create PO</button>`
    });
    document.querySelector("[data-cancel]")?.addEventListener("click", () => ZB.modal.close());
    document.getElementById("po-save")?.addEventListener("click", async () => {
      const form = document.getElementById("po-form");
      const data = ZB.ui.formData(form);
      const prod = d.products.find((p) => p.id === data.productId);
      const po = {
        supplierId: data.supplierId,
        date: data.date,
        status: data.status,
        notes: data.notes,
        items: [{ productId: data.productId, qty: Number(data.qty), rate: Number(data.rate) || prod?.purchasePrice || 0, gstRate: prod?.gstRate || 18 }]
      };
      await ZB.API.savePurchase(po);
      ZB.logActivity(`Created purchase order`);
      ZB.modal.close();
      ZB.toast("success", "PO created", data.status === "received" ? "Stock updated automatically." : "Marked as ordered.");
      this.render(root);
    });
  }
};
