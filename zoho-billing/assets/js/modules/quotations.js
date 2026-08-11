/** Quotations — create, convert to invoice */
ZB.modules = ZB.modules || {};
ZB.modules.quotations = {
  state: { page: 1 },
  async render(root) {
    const d = ZB.API.getData();
    const all = await ZB.API.listQuotations();
    const meta = ZB.utils.paginate(all, this.state.page, 8);
    root.innerHTML = `
      ${ZB.ui.pageHeader("Quotations", "Estimates with validity · convert to tax invoice", `
        <button type="button" class="btn btn-primary btn-sm" id="qt-add"><span class="material-icons-round">request_quote</span> New Quote</button>
      `)}
      <div class="card glass-card content-enter">
        <div class="table-wrap"><table class="data-table">
          <thead><tr><th>Quote #</th><th>Customer</th><th>Date</th><th>Valid Until</th><th>Amount</th><th>Status</th><th></th></tr></thead>
          <tbody>${meta.items.map((q) => {
            const c = d.customers.find((x) => x.id === q.customerId);
            const t = ZB.GST.invoiceTotals(q, d);
            return `<tr>
              <td class="mono">${ZB.utils.esc(q.number)}</td>
              <td>${ZB.utils.esc(c?.name || "—")}</td>
              <td>${ZB.utils.formatDate(q.date)}</td>
              <td>${ZB.utils.formatDate(q.validUntil)}</td>
              <td>${ZB.utils.money(t.grandTotal)}</td>
              <td>${ZB.ui.badge(q.status)}</td>
              <td class="table-actions">
                ${q.status === "accepted" || q.status === "sent" ? `<button type="button" class="btn btn-sm btn-secondary" data-convert="${q.id}">To Invoice</button>` : ""}
              </td>
            </tr>`;
          }).join("")}</tbody>
        </table></div>
        ${ZB.ui.pagination(meta)}
      </div>`;
    root.querySelectorAll("[data-page]").forEach((b) => b.addEventListener("click", () => { this.state.page = +b.dataset.page; this.render(root); }));
    root.querySelector("#qt-add")?.addEventListener("click", () => this.openForm(root));
    root.querySelectorAll("[data-convert]").forEach((b) =>
      b.addEventListener("click", async () => {
        const q = all.find((x) => x.id === b.dataset.convert);
        if (!q) return;
        await ZB.API.saveInvoice({
          customerId: q.customerId,
          date: ZB.utils.todayISO(),
          dueDate: ZB.utils.todayISO(),
          status: "pending",
          items: q.items,
          paymentMode: "Credit",
          notes: `Converted from ${q.number}`
        });
        q.status = "accepted";
        await ZB.API.saveQuotation(q);
        ZB.logActivity(`Converted ${q.number} to invoice`);
        ZB.toast("success", "Invoice created", `From ${q.number}`);
        ZB.app.navigate("billing");
      })
    );
  },
  openForm(root) {
    const d = ZB.API.getData();
    ZB.modal.open({
      title: "New Quotation",
      size: "modal-lg",
      body: `<form id="qt-form">
        <div class="form-row">
          <div class="form-group"><label>Customer</label>
            <select name="customerId">${d.customers.map((c) => `<option value="${c.id}">${ZB.utils.esc(c.name)}</option>`).join("")}</select>
          </div>
          <div class="form-group"><label>Date</label><input type="date" name="date" value="${ZB.utils.todayISO()}" /></div>
          <div class="form-group"><label>Valid Until</label><input type="date" name="validUntil" value="${ZB.utils.todayISO()}" /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Product</label>
            <select name="productId">${d.products.map((p) => `<option value="${p.id}">${ZB.utils.esc(p.name)}</option>`).join("")}</select>
          </div>
          <div class="form-group"><label>Qty</label><input type="number" name="qty" value="1" /></div>
          <div class="form-group"><label>Rate</label><input type="number" step="0.01" name="rate" id="qt-rate" /></div>
          <div class="form-group"><label>Discount %</label><input type="number" name="discount" value="0" /></div>
        </div>
        <div class="form-group"><label>Notes</label><textarea name="notes"></textarea></div>
      </form>`,
      footer: `<button type="button" class="btn btn-ghost" data-cancel>Cancel</button>
        <button type="button" class="btn btn-primary" id="qt-save">Save Quote</button>`
    });
    const form = document.getElementById("qt-form");
    const syncRate = () => {
      const p = d.products.find((x) => x.id === form.productId.value);
      form.rate.value = p?.salePrice || 0;
    };
    form.productId.addEventListener("change", syncRate);
    syncRate();
    document.querySelector("[data-cancel]")?.addEventListener("click", () => ZB.modal.close());
    document.getElementById("qt-save")?.addEventListener("click", async () => {
      const data = ZB.ui.formData(form);
      const prod = d.products.find((p) => p.id === data.productId);
      await ZB.API.saveQuotation({
        customerId: data.customerId,
        date: data.date,
        validUntil: data.validUntil,
        status: "sent",
        notes: data.notes,
        items: [{ productId: data.productId, qty: Number(data.qty), rate: Number(data.rate), discount: Number(data.discount) || 0, gstRate: prod?.gstRate || 18 }]
      });
      ZB.modal.close();
      ZB.toast("success", "Quotation sent", "");
      this.render(root);
    });
  }
};
