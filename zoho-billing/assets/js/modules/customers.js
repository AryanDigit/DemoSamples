/**
 * Customer Management — GSTIN, PAN, addresses, outstanding
 */
ZB.modules = ZB.modules || {};

ZB.modules.customers = {
  state: { page: 1, q: "", status: "all" },

  async render(root) {
    const all = await ZB.API.listCustomers();
    let rows = ZB.utils.search(all, this.state.q, ["name", "email", "phone", "gstin", "city", "contact"]);
    if (this.state.status !== "all") rows = rows.filter((c) => c.status === this.state.status);
    const meta = ZB.utils.paginate(rows, this.state.page, 8);

    root.innerHTML = `
      ${ZB.ui.pageHeader("Customers", "Manage parties with GST, PAN, credit limits & Zoho CRM sync", `
        <button type="button" class="btn btn-secondary btn-sm" id="cust-export"><span class="material-icons-round">download</span> CSV</button>
        <button type="button" class="btn btn-primary btn-sm" id="cust-add"><span class="material-icons-round">person_add</span> Add Customer</button>
      `)}
      <div class="card glass-card content-enter">
        <div class="toolbar">
          <div class="search-inline">
            <span class="material-icons-round">search</span>
            <input type="search" id="cust-q" placeholder="Search name, GSTIN, phone…" value="${ZB.utils.esc(this.state.q)}" />
          </div>
          <select id="cust-status">
            <option value="all" ${this.state.status === "all" ? "selected" : ""}>All status</option>
            <option value="active" ${this.state.status === "active" ? "selected" : ""}>Active</option>
            <option value="inactive" ${this.state.status === "inactive" ? "selected" : ""}>Inactive</option>
          </select>
        </div>
        <div class="stat-pills">
          <div class="stat-pill">Total <strong>${all.length}</strong></div>
          <div class="stat-pill">Outstanding <strong>${ZB.utils.money(all.reduce((s, c) => s + Number(c.outstanding || 0), 0))}</strong></div>
        </div>
        ${meta.items.length ? `
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr>
              <th>Customer</th><th>GSTIN</th><th>City / State</th><th>Phone</th><th>Outstanding</th><th>Status</th><th></th>
            </tr></thead>
            <tbody>
              ${meta.items.map((c) => `
                <tr>
                  <td><strong>${ZB.utils.esc(c.name)}</strong><div class="text-muted" style="font-size:0.75rem">${ZB.utils.esc(c.contact)} · ${ZB.utils.esc(c.type)}</div></td>
                  <td class="mono">${ZB.utils.esc(c.gstin || "—")}</td>
                  <td>${ZB.utils.esc(c.city)}, ${ZB.utils.esc(c.state)}</td>
                  <td>${ZB.utils.esc(c.phone)}</td>
                  <td class="${c.outstanding > 0 ? "text-warning" : ""}">${ZB.utils.money(c.outstanding)}</td>
                  <td>${ZB.ui.badge(c.status)}</td>
                  <td class="table-actions">
                    <button type="button" class="icon-btn" data-edit="${c.id}" title="Edit"><span class="material-icons-round">edit</span></button>
                    <button type="button" class="icon-btn" data-view="${c.id}" title="View"><span class="material-icons-round">visibility</span></button>
                  </td>
                </tr>`).join("")}
            </tbody>
          </table>
        </div>
        ${ZB.ui.pagination(meta)}` : ZB.ui.empty("groups", "No customers found", "Add your first customer to start billing.")}
      </div>`;

    root.querySelector("#cust-q")?.addEventListener("input", ZB.utils.debounce((e) => {
      this.state.q = e.target.value; this.state.page = 1; this.render(root);
    }, 200));
    root.querySelector("#cust-status")?.addEventListener("change", (e) => {
      this.state.status = e.target.value; this.state.page = 1; this.render(root);
    });
    root.querySelectorAll("[data-page]").forEach((b) =>
      b.addEventListener("click", () => { this.state.page = +b.dataset.page; this.render(root); })
    );
    root.querySelector("#cust-add")?.addEventListener("click", () => this.openForm(root));
    root.querySelectorAll("[data-edit]").forEach((b) =>
      b.addEventListener("click", () => this.openForm(root, all.find((c) => c.id === b.dataset.edit)))
    );
    root.querySelectorAll("[data-view]").forEach((b) =>
      b.addEventListener("click", () => this.view(all.find((c) => c.id === b.dataset.view)))
    );
    root.querySelector("#cust-export")?.addEventListener("click", () => {
      const csv = ZB.utils.toCSV(all, [
        { label: "Name", key: "name" }, { label: "GSTIN", key: "gstin" }, { label: "PAN", key: "pan" },
        { label: "Email", key: "email" }, { label: "Phone", key: "phone" }, { label: "City", key: "city" },
        { label: "State", key: "state" }, { label: "Outstanding", key: "outstanding" }
      ]);
      ZB.utils.download("customers.csv", csv, "text/csv");
      ZB.toast("success", "Exported", "Customer CSV downloaded.");
    });
  },

  openForm(root, cust = null) {
    const isEdit = !!cust;
    ZB.modal.open({
      title: isEdit ? "Edit Customer" : "Add Customer",
      size: "modal-lg",
      body: `
        <form id="cust-form">
          <input type="hidden" name="id" value="${ZB.utils.esc(cust?.id || "")}" />
          <div class="form-row">
            <div class="form-group"><label>Business Name *</label><input name="name" required value="${ZB.utils.esc(cust?.name || "")}" /></div>
            <div class="form-group"><label>Contact Person</label><input name="contact" value="${ZB.utils.esc(cust?.contact || "")}" /></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>Email</label><input type="email" name="email" value="${ZB.utils.esc(cust?.email || "")}" /></div>
            <div class="form-group"><label>Phone *</label><input name="phone" required value="${ZB.utils.esc(cust?.phone || "")}" /></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>GSTIN</label><input name="gstin" maxlength="15" value="${ZB.utils.esc(cust?.gstin || "")}" placeholder="27AABCU9603R1ZM" /></div>
            <div class="form-group"><label>PAN</label><input name="pan" maxlength="10" value="${ZB.utils.esc(cust?.pan || "")}" /></div>
            <div class="form-group"><label>Type</label>
              <select name="type">
                ${["Retailer","Wholesaler","Distributor","Manufacturer","Service"].map((t) => `<option ${cust?.type === t ? "selected" : ""}>${t}</option>`).join("")}
              </select>
            </div>
          </div>
          <div class="form-group"><label>Billing Address</label><textarea name="billingAddress">${ZB.utils.esc(cust?.billingAddress || "")}</textarea></div>
          <div class="form-row">
            <div class="form-group"><label>City</label><input name="city" value="${ZB.utils.esc(cust?.city || "")}" /></div>
            <div class="form-group"><label>State</label><input name="state" value="${ZB.utils.esc(cust?.state || "")}" /></div>
            <div class="form-group"><label>State Code</label><input name="stateCode" maxlength="2" value="${ZB.utils.esc(cust?.stateCode || "")}" placeholder="27" /></div>
            <div class="form-group"><label>PIN</label><input name="pincode" value="${ZB.utils.esc(cust?.pincode || "")}" /></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>Credit Limit</label><input type="number" name="creditLimit" value="${cust?.creditLimit ?? 100000}" /></div>
            <div class="form-group"><label>Status</label>
              <select name="status"><option value="active">Active</option><option value="inactive" ${cust?.status === "inactive" ? "selected" : ""}>Inactive</option></select>
            </div>
          </div>
        </form>`,
      footer: `
        <button type="button" class="btn btn-ghost" data-cancel>Cancel</button>
        <button type="button" class="btn btn-primary" id="cust-save">Save &amp; Sync CRM</button>`
    });
    document.querySelector("[data-cancel]")?.addEventListener("click", () => ZB.modal.close());
    document.getElementById("cust-save")?.addEventListener("click", async () => {
      const form = document.getElementById("cust-form");
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const data = ZB.ui.formData(form);
      data.creditLimit = Number(data.creditLimit) || 0;
      data.shippingAddress = data.billingAddress;
      data.outstanding = cust?.outstanding || 0;
      if (!data.id) delete data.id;
      await ZB.API.saveCustomer(data);
      ZB.logActivity(`${isEdit ? "Updated" : "Created"} customer ${data.name}`);
      ZB.modal.close();
      ZB.toast("success", "Saved", "Customer synced to Zoho CRM (demo).");
      this.render(root);
    });
  },

  view(c) {
    if (!c) return;
    ZB.modal.open({
      title: c.name,
      body: `
        <div class="form-row">
          <div><label class="text-muted">Contact</label><div><strong>${ZB.utils.esc(c.contact)}</strong></div></div>
          <div><label class="text-muted">GSTIN</label><div class="mono">${ZB.utils.esc(c.gstin || "Unregistered")}</div></div>
          <div><label class="text-muted">PAN</label><div class="mono">${ZB.utils.esc(c.pan || "—")}</div></div>
          <div><label class="text-muted">Outstanding</label><div class="text-warning"><strong>${ZB.utils.money(c.outstanding)}</strong></div></div>
        </div>
        <p style="margin-top:14px">${ZB.utils.esc(c.billingAddress)}, ${ZB.utils.esc(c.city)}, ${ZB.utils.esc(c.state)} ${ZB.utils.esc(c.pincode)}</p>
        <p class="text-muted" style="margin-top:8px">Zoho CRM ID: <span class="mono">${ZB.utils.esc(c.zohoCrmId || "—")}</span></p>`,
      footer: `<button type="button" class="btn btn-primary" data-cancel>Close</button>`
    });
    document.querySelector("[data-cancel]")?.addEventListener("click", () => ZB.modal.close());
  }
};
