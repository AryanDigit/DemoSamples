/** Expense Tracking */
ZB.modules = ZB.modules || {};
ZB.modules.expenses = {
  state: { page: 1 },
  async render(root) {
    const all = await ZB.API.listExpenses();
    const meta = ZB.utils.paginate(all, this.state.page, 10);
    const total = all.reduce((s, e) => s + Number(e.amount) + Number(e.gst || 0), 0);
    root.innerHTML = `
      ${ZB.ui.pageHeader("Expenses", "Track operating costs with GST & payment modes", `
        <button type="button" class="btn btn-primary btn-sm" id="exp-add"><span class="material-icons-round">add</span> Add Expense</button>
      `)}
      <div class="stat-pills"><div class="stat-pill">Total recorded <strong>${ZB.utils.money(total)}</strong></div></div>
      <div class="card glass-card content-enter">
        <div class="table-wrap"><table class="data-table">
          <thead><tr><th>Date</th><th>Category</th><th>Description</th><th>Vendor</th><th>Amount</th><th>GST</th><th>Mode</th></tr></thead>
          <tbody>${meta.items.map((e) => `
            <tr>
              <td>${ZB.utils.formatDate(e.date)}</td>
              <td>${ZB.utils.esc(e.category)}</td>
              <td>${ZB.utils.esc(e.description)}</td>
              <td>${ZB.utils.esc(e.vendor)}</td>
              <td>${ZB.utils.money(e.amount)}</td>
              <td>${ZB.utils.money(e.gst || 0)}</td>
              <td>${ZB.utils.esc(e.paymentMode)}</td>
            </tr>`).join("")}</tbody>
        </table></div>
        ${ZB.ui.pagination(meta)}
      </div>`;
    root.querySelectorAll("[data-page]").forEach((b) => b.addEventListener("click", () => { this.state.page = +b.dataset.page; this.render(root); }));
    root.querySelector("#exp-add")?.addEventListener("click", () => this.openForm(root));
  },
  openForm(root) {
    ZB.modal.open({
      title: "Add Expense",
      body: `<form id="exp-form">
        <div class="form-row">
          <div class="form-group"><label>Date</label><input type="date" name="date" value="${ZB.utils.todayISO()}" /></div>
          <div class="form-group"><label>Category</label>
            <select name="category">${["Rent","Utilities","Transport","Marketing","Salaries","Office","Travel","Other"].map((c) => `<option>${c}</option>`).join("")}</select>
          </div>
        </div>
        <div class="form-group"><label>Description</label><input name="description" required /></div>
        <div class="form-row">
          <div class="form-group"><label>Amount</label><input type="number" step="0.01" name="amount" required /></div>
          <div class="form-group"><label>GST</label><input type="number" step="0.01" name="gst" value="0" /></div>
          <div class="form-group"><label>Mode</label>
            <select name="paymentMode">${["Cash","UPI","NEFT","Card","Cheque"].map((m) => `<option>${m}</option>`).join("")}</select>
          </div>
        </div>
        <div class="form-group"><label>Vendor</label><input name="vendor" /></div>
      </form>`,
      footer: `<button type="button" class="btn btn-ghost" data-cancel>Cancel</button>
        <button type="button" class="btn btn-primary" id="exp-save">Save</button>`
    });
    document.querySelector("[data-cancel]")?.addEventListener("click", () => ZB.modal.close());
    document.getElementById("exp-save")?.addEventListener("click", async () => {
      const form = document.getElementById("exp-form");
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const data = ZB.ui.formData(form);
      data.amount = Number(data.amount); data.gst = Number(data.gst) || 0;
      await ZB.API.saveExpense(data);
      ZB.logActivity(`Expense: ${data.description}`);
      ZB.modal.close();
      ZB.toast("success", "Expense saved", "");
      this.render(root);
    });
  }
};
