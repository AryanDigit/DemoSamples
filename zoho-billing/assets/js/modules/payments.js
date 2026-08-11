/** Payment Management */
ZB.modules = ZB.modules || {};
ZB.modules.payments = {
  state: { page: 1 },
  async render(root) {
    const d = ZB.API.getData();
    const all = await ZB.API.listPayments();
    const meta = ZB.utils.paginate(all, this.state.page, 10);
    root.innerHTML = `
      ${ZB.ui.pageHeader("Payments", "Record receipts · match invoices · Zoho Books customer payments", `
        <button type="button" class="btn btn-primary btn-sm" id="pay-add"><span class="material-icons-round">payments</span> Record Payment</button>
      `)}
      <div class="card glass-card content-enter">
        <div class="table-wrap"><table class="data-table">
          <thead><tr><th>Date</th><th>Customer</th><th>Invoice</th><th>Amount</th><th>Mode</th><th>Reference</th><th>Status</th></tr></thead>
          <tbody>${meta.items.map((p) => {
            const c = d.customers.find((x) => x.id === p.customerId);
            const inv = d.invoices.find((x) => x.id === p.invoiceId);
            return `<tr>
              <td>${ZB.utils.formatDate(p.date)}</td>
              <td>${ZB.utils.esc(c?.name || "—")}</td>
              <td class="mono">${ZB.utils.esc(inv?.number || "—")}</td>
              <td><strong>${ZB.utils.money(p.amount)}</strong></td>
              <td>${ZB.utils.esc(p.mode)}</td>
              <td class="mono">${ZB.utils.esc(p.reference)}</td>
              <td>${ZB.ui.badge(p.status)}</td>
            </tr>`;
          }).join("")}</tbody>
        </table></div>
        ${ZB.ui.pagination(meta)}
      </div>`;
    root.querySelectorAll("[data-page]").forEach((b) => b.addEventListener("click", () => { this.state.page = +b.dataset.page; this.render(root); }));
    root.querySelector("#pay-add")?.addEventListener("click", () => this.openForm(root));
  },
  openForm(root) {
    const d = ZB.API.getData();
    const openInvs = d.invoices.filter((i) => ["pending", "partial", "overdue"].includes(i.status));
    ZB.modal.open({
      title: "Record Payment",
      body: `<form id="pay-form">
        <div class="form-group"><label>Invoice</label>
          <select name="invoiceId">${openInvs.map((i) => {
            const c = d.customers.find((x) => x.id === i.customerId);
            const t = ZB.GST.invoiceTotals(i, d);
            return `<option value="${i.id}">${i.number} — ${c?.name} (${ZB.utils.money(t.grandTotal)})</option>`;
          }).join("") || "<option value=''>No open invoices</option>"}</select>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Amount</label><input type="number" step="0.01" name="amount" required /></div>
          <div class="form-group"><label>Date</label><input type="date" name="date" value="${ZB.utils.todayISO()}" /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Mode</label>
            <select name="mode">${["UPI","NEFT","Cash","Card","Cheque"].map((m) => `<option>${m}</option>`).join("")}</select>
          </div>
          <div class="form-group"><label>Reference</label><input name="reference" placeholder="UTR / UPI ref" /></div>
          <div class="form-group"><label>Status</label>
            <select name="status"><option value="cleared">Cleared</option><option value="pending">Pending</option></select>
          </div>
        </div>
      </form>`,
      footer: `<button type="button" class="btn btn-ghost" data-cancel>Cancel</button>
        <button type="button" class="btn btn-primary" id="pay-save">Save Payment</button>`
    });
    document.querySelector("[data-cancel]")?.addEventListener("click", () => ZB.modal.close());
    document.getElementById("pay-save")?.addEventListener("click", async () => {
      const form = document.getElementById("pay-form");
      if (!form.checkValidity() || !form.invoiceId.value) { form.reportValidity(); return; }
      const data = ZB.ui.formData(form);
      const inv = d.invoices.find((i) => i.id === data.invoiceId);
      data.customerId = inv?.customerId;
      data.amount = Number(data.amount);
      await ZB.API.savePayment(data);
      ZB.logActivity(`Payment ${ZB.utils.money(data.amount)} for ${inv?.number}`);
      ZB.modal.close();
      ZB.toast("success", "Payment recorded", "Invoice status updated.");
      this.render(root);
    });
  }
};
