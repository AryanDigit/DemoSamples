/**
 * Billing & Invoicing — GST calc, PDF/print, email, WhatsApp, barcode
 */
ZB.modules = ZB.modules || {};
ZB.modules.billing = {
  state: { page: 1, q: "", status: "all" },

  async render(root) {
    const d = ZB.API.getData();
    let all = await ZB.API.listInvoices();
    all = ZB.utils.search(all, this.state.q, ["number", "notes"]);
    if (this.state.status !== "all") all = all.filter((i) => i.status === this.state.status);
    const meta = ZB.utils.paginate(all, this.state.page, 8);

    root.innerHTML = `
      ${ZB.ui.pageHeader("Billing & Invoicing", "Tax invoices · auto numbers · GST · PDF · WhatsApp", `
        <button type="button" class="btn btn-primary btn-sm" id="inv-add"><span class="material-icons-round">receipt_long</span> New Invoice</button>
      `)}
      <div class="card glass-card content-enter">
        <div class="toolbar">
          <div class="search-inline"><span class="material-icons-round">search</span>
            <input id="inv-q" type="search" placeholder="Search invoice…" value="${ZB.utils.esc(this.state.q)}" />
          </div>
          <select id="inv-status">
            <option value="all">All</option>
            ${["draft","pending","partial","paid","overdue"].map((s) => `<option value="${s}" ${this.state.status === s ? "selected" : ""}>${s}</option>`).join("")}
          </select>
        </div>
        <div class="table-wrap"><table class="data-table">
          <thead><tr><th>Invoice</th><th>Customer</th><th>Date</th><th>Due</th><th>Amount</th><th>Status</th><th></th></tr></thead>
          <tbody>${meta.items.map((inv) => {
            const c = d.customers.find((x) => x.id === inv.customerId);
            const t = ZB.GST.invoiceTotals(inv, d);
            return `<tr>
              <td class="mono">${ZB.utils.esc(inv.number)}</td>
              <td>${ZB.utils.esc(c?.name || "—")}</td>
              <td>${ZB.utils.formatDate(inv.date)}</td>
              <td>${ZB.utils.formatDate(inv.dueDate)}</td>
              <td><strong>${ZB.utils.money(t.grandTotal)}</strong></td>
              <td>${ZB.ui.badge(inv.status)}</td>
              <td class="table-actions">
                <button type="button" class="icon-btn" data-view="${inv.id}" title="View / Print"><span class="material-icons-round">print</span></button>
                <button type="button" class="icon-btn" data-wa="${inv.id}" title="WhatsApp"><span class="material-icons-round">chat</span></button>
                <button type="button" class="icon-btn" data-mail="${inv.id}" title="Email"><span class="material-icons-round">email</span></button>
              </td>
            </tr>`;
          }).join("")}</tbody>
        </table></div>
        ${ZB.ui.pagination(meta)}
      </div>`;

    root.querySelector("#inv-q")?.addEventListener("input", ZB.utils.debounce((e) => { this.state.q = e.target.value; this.state.page = 1; this.render(root); }, 200));
    root.querySelector("#inv-status")?.addEventListener("change", (e) => { this.state.status = e.target.value; this.state.page = 1; this.render(root); });
    root.querySelectorAll("[data-page]").forEach((b) => b.addEventListener("click", () => { this.state.page = +b.dataset.page; this.render(root); }));
    root.querySelector("#inv-add")?.addEventListener("click", () => this.openBuilder(root));
    root.querySelectorAll("[data-view]").forEach((b) => b.addEventListener("click", () => this.printInvoice(all.find((i) => i.id === b.dataset.view) || d.invoices.find((i) => i.id === b.dataset.view))));
    root.querySelectorAll("[data-wa]").forEach((b) => b.addEventListener("click", () => {
      const inv = d.invoices.find((i) => i.id === b.dataset.wa);
      const c = d.customers.find((x) => x.id === inv?.customerId);
      const t = ZB.GST.invoiceTotals(inv, d);
      ZB.utils.whatsappShare(c?.phone, `Invoice ${inv.number} for ${ZB.utils.money(t.grandTotal)} from ${d.company.name}. Due ${inv.dueDate}.`);
    }));
    root.querySelectorAll("[data-mail]").forEach((b) => b.addEventListener("click", () => {
      ZB.toast("success", "Email queued", "Sent via Zoho Mail API (demo). Deluge workflow: sendmail.");
      ZB.logActivity("Emailed invoice via Zoho Mail");
    }));
  },

  openBuilder(root) {
    const d = ZB.API.getData();
    const lines = [{ productId: d.products[0]?.id, qty: 1, rate: d.products[0]?.salePrice || 0, discount: 0, gstRate: d.products[0]?.gstRate || 18 }];

    const renderBody = () => {
      const draft = {
        customerId: document.getElementById("inv-customer")?.value || d.customers[0]?.id,
        items: lines
      };
      const totals = ZB.GST.invoiceTotals(draft, d);
      return `
        <div class="invoice-builder">
          <div>
            <div class="form-row">
              <div class="form-group"><label>Customer *</label>
                <select id="inv-customer">${d.customers.map((c) => `<option value="${c.id}">${ZB.utils.esc(c.name)} (${c.stateCode})</option>`).join("")}</select>
              </div>
              <div class="form-group"><label>Date</label><input type="date" id="inv-date" value="${ZB.utils.todayISO()}" /></div>
              <div class="form-group"><label>Due Date</label><input type="date" id="inv-due" value="${ZB.utils.todayISO()}" /></div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Status</label>
                <select id="inv-status-new"><option value="pending">Pending</option><option value="draft">Draft</option><option value="paid">Paid</option></select>
              </div>
              <div class="form-group"><label>Payment Mode</label>
                <select id="inv-mode">${["UPI","NEFT","Cash","Card","Cheque","Credit"].map((m) => `<option>${m}</option>`).join("")}</select>
              </div>
              <div class="form-group"><label>Product search</label>
                <input type="search" id="inv-prod-search" placeholder="Type product name or SKU…" />
              </div>
            </div>
            <h4 style="margin:12px 0 8px">Line Items</h4>
            <div class="line-items" id="inv-lines">
              ${lines.map((l, idx) => `
                <div class="line-item-row" data-idx="${idx}">
                  <div class="form-group"><label>Product</label>
                    <select data-field="productId">${d.products.map((p) => `<option value="${p.id}" ${p.id === l.productId ? "selected" : ""}>${ZB.utils.esc(p.name)}</option>`).join("")}</select>
                  </div>
                  <div class="form-group"><label>Qty</label><input type="number" data-field="qty" value="${l.qty}" min="1" /></div>
                  <div class="form-group"><label>Rate</label><input type="number" step="0.01" data-field="rate" value="${l.rate}" /></div>
                  <div class="form-group"><label>Disc %</label><input type="number" data-field="discount" value="${l.discount}" /></div>
                  <div class="form-group"><label>GST %</label><input type="number" data-field="gstRate" value="${l.gstRate}" /></div>
                  <button type="button" class="icon-btn" data-remove="${idx}" ${lines.length <= 1 ? "disabled" : ""}><span class="material-icons-round">delete</span></button>
                </div>`).join("")}
            </div>
            <button type="button" class="btn btn-secondary btn-sm" id="inv-add-line" style="margin-top:8px"><span class="material-icons-round">add</span> Add line</button>
            <div class="form-group" style="margin-top:14px"><label>Notes</label><textarea id="inv-notes" placeholder="Terms / thank you note"></textarea></div>
          </div>
          <div>
            <div class="totals-box" id="inv-totals">
              <div class="totals-row"><span>Taxable</span><span>${ZB.utils.money(totals.taxable)}</span></div>
              ${totals.type === "intra" ? `
                <div class="totals-row"><span>CGST</span><span>${ZB.utils.money(totals.cgst)}</span></div>
                <div class="totals-row"><span>SGST</span><span>${ZB.utils.money(totals.sgst)}</span></div>` : `
                <div class="totals-row"><span>IGST</span><span>${ZB.utils.money(totals.igst)}</span></div>`}
              <div class="totals-row"><span>Discount</span><span>− ${ZB.utils.money(totals.discount)}</span></div>
              <div class="totals-row"><span>Round off</span><span>${ZB.utils.money(totals.roundOff)}</span></div>
              <div class="totals-row grand"><span>Grand Total</span><span>${ZB.utils.money(totals.grandTotal)}</span></div>
              <p class="form-hint" style="margin-top:10px">Tax type: <strong>${totals.type === "intra" ? "Intra-state (CGST+SGST)" : "Inter-state (IGST)"}</strong></p>
            </div>
            <div class="barcode-preview" style="margin-top:12px">
              <canvas id="inv-qr"></canvas>
              <div class="text-muted">Invoice QR (e-invoice ready)</div>
            </div>
          </div>
        </div>`;
    };

    const modal = ZB.modal.open({
      title: "Create Tax Invoice",
      size: "modal-xl",
      body: renderBody(),
      footer: `
        <button type="button" class="btn btn-ghost" data-cancel>Cancel</button>
        <button type="button" class="btn btn-secondary" id="inv-preview">Preview PDF</button>
        <button type="button" class="btn btn-primary" id="inv-save">Save Invoice</button>`
    });

    const refresh = () => {
      // read lines from DOM
      modal.querySelectorAll(".line-item-row").forEach((row) => {
        const idx = +row.dataset.idx;
        if (!lines[idx]) return;
        row.querySelectorAll("[data-field]").forEach((el) => {
          const f = el.dataset.field;
          lines[idx][f] = f === "productId" ? el.value : Number(el.value) || 0;
        });
        const prod = d.products.find((p) => p.id === lines[idx].productId);
        if (prod && !row.dataset.touched) {
          /* keep user rate */
        }
      });
      const body = modal.querySelector(".modal-body");
      const scroll = body.scrollTop;
      body.innerHTML = renderBody();
      body.scrollTop = scroll;
      bind();
      setTimeout(() => {
        if (window.QRCode) {
          QRCode.toCanvas(document.getElementById("inv-qr"), `ZB-INV-DRAFT|${Date.now()}`, { width: 120 });
        }
      }, 30);
    };

    const bind = () => {
      document.getElementById("inv-customer")?.addEventListener("change", refresh);
      modal.querySelectorAll("[data-field]").forEach((el) => {
        el.addEventListener("change", () => {
          if (el.dataset.field === "productId") {
            const idx = +el.closest(".line-item-row").dataset.idx;
            const prod = d.products.find((p) => p.id === el.value);
            if (prod) {
              lines[idx].productId = prod.id;
              lines[idx].rate = prod.salePrice;
              lines[idx].gstRate = prod.gstRate;
            }
          }
          refresh();
        });
        el.addEventListener("input", ZB.utils.debounce(refresh, 300));
      });
      modal.querySelectorAll("[data-remove]").forEach((btn) =>
        btn.addEventListener("click", () => {
          lines.splice(+btn.dataset.remove, 1);
          refresh();
        })
      );
      document.getElementById("inv-add-line")?.addEventListener("click", () => {
        const p = d.products[0];
        lines.push({ productId: p.id, qty: 1, rate: p.salePrice, discount: 0, gstRate: p.gstRate });
        refresh();
      });
      document.getElementById("inv-prod-search")?.addEventListener("input", ZB.utils.debounce((e) => {
        const q = e.target.value.toLowerCase();
        const p = d.products.find((x) => x.name.toLowerCase().includes(q) || x.sku.toLowerCase().includes(q) || x.barcode.includes(q));
        if (p) {
          lines[0].productId = p.id;
          lines[0].rate = p.salePrice;
          lines[0].gstRate = p.gstRate;
          refresh();
          ZB.toast("info", "Product selected", p.name);
        }
      }, 400));
    };
    bind();
    setTimeout(() => {
      if (window.QRCode) QRCode.toCanvas(document.getElementById("inv-qr"), `ZB-INV-DRAFT|${Date.now()}`, { width: 120 });
    }, 50);

    document.querySelector("[data-cancel]")?.addEventListener("click", () => ZB.modal.close());
    document.getElementById("inv-preview")?.addEventListener("click", () => {
      const inv = this._buildInv(lines);
      this.printInvoice(inv);
    });
    document.getElementById("inv-save")?.addEventListener("click", async () => {
      // sync lines
      modal.querySelectorAll(".line-item-row").forEach((row) => {
        const idx = +row.dataset.idx;
        row.querySelectorAll("[data-field]").forEach((el) => {
          const f = el.dataset.field;
          lines[idx][f] = f === "productId" ? el.value : Number(el.value) || 0;
        });
      });
      const inv = this._buildInv(lines);
      await ZB.API.saveInvoice(inv);
      ZB.logActivity(`Created invoice ${inv.number || "(new)"}`);
      ZB.modal.close();
      ZB.toast("success", "Invoice saved", "Stock updated · Zoho Books sync queued.");
      this.render(root);
    });
  },

  _buildInv(lines) {
    return {
      customerId: document.getElementById("inv-customer")?.value,
      date: document.getElementById("inv-date")?.value || ZB.utils.todayISO(),
      dueDate: document.getElementById("inv-due")?.value || ZB.utils.todayISO(),
      status: document.getElementById("inv-status-new")?.value || "pending",
      paymentMode: document.getElementById("inv-mode")?.value || "",
      notes: document.getElementById("inv-notes")?.value || "",
      items: lines.map((l) => ({ ...l }))
    };
  },

  printInvoice(inv) {
    if (!inv) return;
    const d = ZB.API.getData();
    const t = ZB.GST.invoiceTotals(inv, d);
    const html = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <h1>${ZB.utils.esc(d.company.name)}</h1>
          <div class="muted">GSTIN: ${ZB.utils.esc(d.company.gstin)} · PAN: ${ZB.utils.esc(d.company.pan)}</div>
          <div class="muted">${ZB.utils.esc(d.company.address)}, ${ZB.utils.esc(d.company.city)} ${ZB.utils.esc(d.company.pincode)}</div>
        </div>
        <div style="text-align:right">
          <h1 style="color:#2563eb">TAX INVOICE</h1>
          <div><strong>${ZB.utils.esc(inv.number || "DRAFT")}</strong></div>
          <div class="muted">Date: ${ZB.utils.formatDate(inv.date)} · Due: ${ZB.utils.formatDate(inv.dueDate)}</div>
        </div>
      </div>
      <hr style="margin:16px 0;border:none;border-top:2px solid #2563eb" />
      <div><strong>Bill To:</strong> ${ZB.utils.esc(t.customer?.name || "")}<br/>
        <span class="muted">${ZB.utils.esc(t.customer?.billingAddress || "")}<br/>
        GSTIN: ${ZB.utils.esc(t.customer?.gstin || "URP")} · State: ${ZB.utils.esc(t.customer?.state || "")} (${ZB.utils.esc(t.customer?.stateCode || "")})</span>
      </div>
      <table>
        <thead><tr><th>#</th><th>Item</th><th>HSN</th><th>Qty</th><th>Rate</th><th>Disc</th><th>Taxable</th><th>Tax</th><th>Total</th></tr></thead>
        <tbody>${t.lines.map((l, i) => `
          <tr>
            <td>${i + 1}</td>
            <td>${ZB.utils.esc(l.productName)}</td>
            <td>${ZB.utils.esc(l.hsn)}</td>
            <td>${l.qty}</td>
            <td>${ZB.utils.money(l.rate)}</td>
            <td>${l.discount}%</td>
            <td>${ZB.utils.money(l.taxable)}</td>
            <td>${ZB.utils.money(l.cgst + l.sgst + l.igst)}</td>
            <td>${ZB.utils.money(l.total)}</td>
          </tr>`).join("")}</tbody>
      </table>
      <div class="totals">
        <div><span>Taxable</span><span>${ZB.utils.money(t.taxable)}</span></div>
        ${t.type === "intra" ? `<div><span>CGST</span><span>${ZB.utils.money(t.cgst)}</span></div><div><span>SGST</span><span>${ZB.utils.money(t.sgst)}</span></div>` : `<div><span>IGST</span><span>${ZB.utils.money(t.igst)}</span></div>`}
        <div><span>Round off</span><span>${ZB.utils.money(t.roundOff)}</span></div>
        <div class="grand"><span>Grand Total</span><span>${ZB.utils.money(t.grandTotal)}</span></div>
      </div>
      <p class="muted" style="margin-top:24px">${ZB.utils.esc(inv.notes || "")}<br/>This is a computer-generated invoice · ZorBill on Zoho</p>`;
    ZB.utils.printHtml(html, inv.number || "Invoice");
  }
};
