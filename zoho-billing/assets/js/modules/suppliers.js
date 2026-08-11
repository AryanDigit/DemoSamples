/** Supplier Management */
ZB.modules = ZB.modules || {};
ZB.modules.suppliers = {
  state: { page: 1, q: "" },
  async render(root) {
    const all = await ZB.API.listSuppliers();
    const rows = ZB.utils.search(all, this.state.q, ["name", "gstin", "email", "city", "contact"]);
    const meta = ZB.utils.paginate(rows, this.state.page, 8);
    root.innerHTML = `
      ${ZB.ui.pageHeader("Suppliers", "Vendor masters with GST, PAN & payable balances", `
        <button type="button" class="btn btn-primary btn-sm" id="sup-add"><span class="material-icons-round">add</span> Add Supplier</button>
      `)}
      <div class="card glass-card content-enter">
        <div class="toolbar">
          <div class="search-inline"><span class="material-icons-round">search</span>
            <input id="sup-q" type="search" placeholder="Search suppliers…" value="${ZB.utils.esc(this.state.q)}" />
          </div>
        </div>
        <div class="table-wrap"><table class="data-table">
          <thead><tr><th>Supplier</th><th>GSTIN</th><th>Location</th><th>Phone</th><th>Payable</th><th>Status</th><th></th></tr></thead>
          <tbody>${meta.items.map((s) => `
            <tr>
              <td><strong>${ZB.utils.esc(s.name)}</strong><div class="text-muted" style="font-size:0.75rem">${ZB.utils.esc(s.contact)}</div></td>
              <td class="mono">${ZB.utils.esc(s.gstin)}</td>
              <td>${ZB.utils.esc(s.city)}, ${ZB.utils.esc(s.state)}</td>
              <td>${ZB.utils.esc(s.phone)}</td>
              <td>${ZB.utils.money(s.outstanding)}</td>
              <td>${ZB.ui.badge(s.status)}</td>
              <td class="table-actions"><button type="button" class="icon-btn" data-edit="${s.id}"><span class="material-icons-round">edit</span></button></td>
            </tr>`).join("")}</tbody>
        </table></div>
        ${ZB.ui.pagination(meta)}
      </div>`;
    root.querySelector("#sup-q")?.addEventListener("input", ZB.utils.debounce((e) => { this.state.q = e.target.value; this.state.page = 1; this.render(root); }, 200));
    root.querySelectorAll("[data-page]").forEach((b) => b.addEventListener("click", () => { this.state.page = +b.dataset.page; this.render(root); }));
    root.querySelector("#sup-add")?.addEventListener("click", () => this.openForm(root));
    root.querySelectorAll("[data-edit]").forEach((b) => b.addEventListener("click", () => this.openForm(root, all.find((s) => s.id === b.dataset.edit))));
  },
  openForm(root, s = null) {
    ZB.modal.open({
      title: s ? "Edit Supplier" : "Add Supplier",
      size: "modal-lg",
      body: `<form id="sup-form">
        <input type="hidden" name="id" value="${ZB.utils.esc(s?.id || "")}" />
        <div class="form-row">
          <div class="form-group"><label>Name *</label><input name="name" required value="${ZB.utils.esc(s?.name || "")}" /></div>
          <div class="form-group"><label>Contact</label><input name="contact" value="${ZB.utils.esc(s?.contact || "")}" /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Email</label><input name="email" type="email" value="${ZB.utils.esc(s?.email || "")}" /></div>
          <div class="form-group"><label>Phone</label><input name="phone" value="${ZB.utils.esc(s?.phone || "")}" /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>GSTIN</label><input name="gstin" value="${ZB.utils.esc(s?.gstin || "")}" /></div>
          <div class="form-group"><label>PAN</label><input name="pan" value="${ZB.utils.esc(s?.pan || "")}" /></div>
        </div>
        <div class="form-group"><label>Address</label><textarea name="address">${ZB.utils.esc(s?.address || "")}</textarea></div>
        <div class="form-row">
          <div class="form-group"><label>City</label><input name="city" value="${ZB.utils.esc(s?.city || "")}" /></div>
          <div class="form-group"><label>State</label><input name="state" value="${ZB.utils.esc(s?.state || "")}" /></div>
          <div class="form-group"><label>State Code</label><input name="stateCode" value="${ZB.utils.esc(s?.stateCode || "")}" /></div>
          <div class="form-group"><label>PIN</label><input name="pincode" value="${ZB.utils.esc(s?.pincode || "")}" /></div>
        </div>
      </form>`,
      footer: `<button type="button" class="btn btn-ghost" data-cancel>Cancel</button>
        <button type="button" class="btn btn-primary" id="sup-save">Save</button>`
    });
    document.querySelector("[data-cancel]")?.addEventListener("click", () => ZB.modal.close());
    document.getElementById("sup-save")?.addEventListener("click", async () => {
      const form = document.getElementById("sup-form");
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const data = ZB.ui.formData(form);
      if (!data.id) delete data.id;
      await ZB.API.saveSupplier(data);
      ZB.logActivity(`Saved supplier ${data.name}`);
      ZB.modal.close();
      ZB.toast("success", "Supplier saved", "");
      this.render(root);
    });
  }
};
