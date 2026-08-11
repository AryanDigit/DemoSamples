/** Reports — sales, purchases, P&L, outstanding, export */
ZB.modules = ZB.modules || {};
ZB.modules.reports = {
  async render(root) {
    const d = ZB.API.getData();
    const invs = d.invoices.filter((i) => i.status !== "draft");
    const sales = invs.reduce((s, i) => s + ZB.GST.invoiceTotals(i, d).grandTotal, 0);
    const purchases = d.purchases.reduce((s, po) => {
      (po.items || []).forEach((it) => { s += ZB.GST.lineTax(it).total; });
      return s;
    }, 0);
    const expenses = d.expenses.reduce((s, e) => s + Number(e.amount) + Number(e.gst || 0), 0);
    const outstanding = invs
      .filter((i) => ["pending", "partial", "overdue"].includes(i.status))
      .reduce((s, i) => s + ZB.GST.invoiceTotals(i, d).grandTotal, 0);
    const gst = ZB.GST.summary(invs, d);

    const reports = [
      { id: "sales", title: "Sales Report", desc: "Invoice-wise sales with tax", icon: "point_of_sale" },
      { id: "purchases", title: "Purchase Report", desc: "PO and bills", icon: "shopping_bag" },
      { id: "customers", title: "Customer Report", desc: "Party balances", icon: "groups" },
      { id: "suppliers", title: "Supplier Report", desc: "Payables", icon: "local_shipping" },
      { id: "gst", title: "GST Report", desc: "Tax liability", icon: "account_balance" },
      { id: "pnl", title: "Profit & Loss", desc: "Revenue − costs", icon: "analytics" },
      { id: "expenses", title: "Expense Report", desc: "Category spend", icon: "payments" },
      { id: "inventory", title: "Inventory Report", desc: "Stock valuation", icon: "inventory" },
      { id: "outstanding", title: "Outstanding", desc: "Receivables aging", icon: "hourglass_bottom" }
    ];

    root.innerHTML = `
      ${ZB.ui.pageHeader("Reports", "Filter · export PDF / Excel / CSV · Zoho Analytics ready", "")}
      <div class="stat-pills">
        <div class="stat-pill">Sales <strong>${ZB.utils.money(sales)}</strong></div>
        <div class="stat-pill">Purchases <strong>${ZB.utils.money(purchases)}</strong></div>
        <div class="stat-pill">Expenses <strong>${ZB.utils.money(expenses)}</strong></div>
        <div class="stat-pill">P&amp;L <strong>${ZB.utils.money(sales - purchases - expenses)}</strong></div>
        <div class="stat-pill">Outstanding <strong>${ZB.utils.money(outstanding)}</strong></div>
        <div class="stat-pill">GST <strong>${ZB.utils.money(gst.totalTax)}</strong></div>
      </div>
      <div class="kpi-grid">
        ${reports.map((r) => `
          <button type="button" class="kpi-card glass-card" data-report="${r.id}" style="text-align:left;cursor:pointer;width:100%">
            <div class="kpi-icon"><span class="material-icons-round">${r.icon}</span></div>
            <div class="kpi-label">${r.title}</div>
            <div style="font-size:0.85rem;color:var(--text-secondary);margin-top:4px">${r.desc}</div>
            <div style="margin-top:12px;display:flex;gap:6px">
              <span class="badge badge-info">PDF</span>
              <span class="badge badge-info">Excel</span>
              <span class="badge badge-info">CSV</span>
            </div>
          </button>`).join("")}
      </div>
      <div class="card glass-card" style="margin-top:16px" id="report-preview">
        <div class="card-header"><h3>Report Preview</h3>
          <div style="display:flex;gap:8px">
            <button type="button" class="btn btn-sm btn-secondary" id="rpt-csv">CSV</button>
            <button type="button" class="btn btn-sm btn-secondary" id="rpt-print">PDF / Print</button>
          </div>
        </div>
        <div id="rpt-body">${ZB.ui.empty("analytics", "Select a report", "Choose a card above to preview.")}</div>
      </div>`;

    let currentRows = [];
    let currentCols = [];
    let currentTitle = "Report";

    const showSales = () => {
      currentTitle = "Sales Report";
      currentCols = [
        { label: "Invoice", key: "number" }, { label: "Customer", value: (r) => r.customer },
        { label: "Date", key: "date" }, { label: "Amount", key: "amount" }, { label: "Status", key: "status" }
      ];
      currentRows = invs.map((i) => {
        const c = d.customers.find((x) => x.id === i.customerId);
        return { number: i.number, customer: c?.name, date: i.date, amount: ZB.GST.invoiceTotals(i, d).grandTotal, status: i.status };
      });
      document.getElementById("rpt-body").innerHTML = `
        <div class="table-wrap"><table class="data-table">
          <thead><tr><th>Invoice</th><th>Customer</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>${currentRows.map((r) => `<tr>
            <td class="mono">${ZB.utils.esc(r.number)}</td><td>${ZB.utils.esc(r.customer)}</td>
            <td>${ZB.utils.formatDate(r.date)}</td><td>${ZB.utils.money(r.amount)}</td><td>${ZB.ui.badge(r.status)}</td>
          </tr>`).join("")}</tbody>
        </table></div>`;
    };

    root.querySelectorAll("[data-report]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const id = btn.dataset.report;
        if (id === "sales" || id === "outstanding") showSales();
        else if (id === "pnl") {
          currentTitle = "Profit & Loss";
          document.getElementById("rpt-body").innerHTML = `
            <div class="totals-box" style="max-width:400px">
              <div class="totals-row"><span>Revenue</span><span>${ZB.utils.money(sales)}</span></div>
              <div class="totals-row"><span>Purchases</span><span>− ${ZB.utils.money(purchases)}</span></div>
              <div class="totals-row"><span>Expenses</span><span>− ${ZB.utils.money(expenses)}</span></div>
              <div class="totals-row grand"><span>Net Profit</span><span>${ZB.utils.money(sales - purchases - expenses)}</span></div>
            </div>`;
          currentRows = [{ revenue: sales, purchases, expenses, profit: sales - purchases - expenses }];
          currentCols = [
            { label: "Revenue", key: "revenue" }, { label: "Purchases", key: "purchases" },
            { label: "Expenses", key: "expenses" }, { label: "Profit", key: "profit" }
          ];
        } else if (id === "gst") {
          currentTitle = "GST Report";
          currentRows = gst.hsn;
          currentCols = [
            { label: "HSN", key: "hsn" }, { label: "Qty", key: "qty" },
            { label: "Taxable", key: "taxable" }, { label: "Tax", key: "tax" }
          ];
          document.getElementById("rpt-body").innerHTML = `
            <p>Total tax liability: <strong>${ZB.utils.money(gst.totalTax)}</strong></p>
            <div class="table-wrap" style="margin-top:12px"><table class="data-table">
              <thead><tr><th>HSN</th><th>Qty</th><th>Taxable</th><th>Tax</th></tr></thead>
              <tbody>${gst.hsn.map((h) => `<tr>
                <td class="mono">${h.hsn}</td><td>${h.qty}</td><td>${ZB.utils.money(h.taxable)}</td><td>${ZB.utils.money(h.tax)}</td>
              </tr>`).join("")}</tbody>
            </table></div>`;
        } else if (id === "inventory") {
          currentTitle = "Inventory Valuation";
          currentRows = d.products.map((p) => ({ name: p.name, sku: p.sku, stock: p.stock, value: p.stock * p.purchasePrice }));
          currentCols = [
            { label: "Name", key: "name" }, { label: "SKU", key: "sku" },
            { label: "Stock", key: "stock" }, { label: "Value", key: "value" }
          ];
          document.getElementById("rpt-body").innerHTML = `
            <div class="table-wrap"><table class="data-table">
              <thead><tr><th>Product</th><th>SKU</th><th>Stock</th><th>Value</th></tr></thead>
              <tbody>${currentRows.map((r) => `<tr>
                <td>${ZB.utils.esc(r.name)}</td><td class="mono">${ZB.utils.esc(r.sku)}</td>
                <td>${r.stock}</td><td>${ZB.utils.money(r.value)}</td>
              </tr>`).join("")}</tbody>
            </table></div>`;
        } else if (id === "customers") {
          currentTitle = "Customer Outstanding";
          currentRows = d.customers;
          currentCols = [
            { label: "Name", key: "name" }, { label: "GSTIN", key: "gstin" },
            { label: "Outstanding", key: "outstanding" }
          ];
          document.getElementById("rpt-body").innerHTML = `
            <div class="table-wrap"><table class="data-table">
              <thead><tr><th>Customer</th><th>GSTIN</th><th>Outstanding</th></tr></thead>
              <tbody>${d.customers.map((c) => `<tr>
                <td>${ZB.utils.esc(c.name)}</td><td class="mono">${ZB.utils.esc(c.gstin || "—")}</td>
                <td>${ZB.utils.money(c.outstanding)}</td>
              </tr>`).join("")}</tbody>
            </table></div>`;
        } else if (id === "expenses") {
          currentTitle = "Expenses";
          currentRows = d.expenses;
          currentCols = [
            { label: "Date", key: "date" }, { label: "Category", key: "category" },
            { label: "Amount", key: "amount" }, { label: "Vendor", key: "vendor" }
          ];
          document.getElementById("rpt-body").innerHTML = `
            <div class="table-wrap"><table class="data-table">
              <thead><tr><th>Date</th><th>Category</th><th>Description</th><th>Amount</th></tr></thead>
              <tbody>${d.expenses.map((e) => `<tr>
                <td>${ZB.utils.formatDate(e.date)}</td><td>${ZB.utils.esc(e.category)}</td>
                <td>${ZB.utils.esc(e.description)}</td><td>${ZB.utils.money(e.amount)}</td>
              </tr>`).join("")}</tbody>
            </table></div>`;
        } else {
          showSales();
        }
        ZB.toast("info", currentTitle, "Preview loaded. Export CSV or print PDF.");
      })
    );

    root.querySelector("#rpt-csv")?.addEventListener("click", () => {
      if (!currentRows.length) { ZB.toast("warning", "Nothing to export", "Select a report first."); return; }
      ZB.utils.download(`${currentTitle.replace(/\s+/g, "-").toLowerCase()}.csv`, ZB.utils.toCSV(currentRows, currentCols), "text/csv");
      ZB.toast("success", "CSV exported", "");
    });
    root.querySelector("#rpt-print")?.addEventListener("click", () => {
      const body = document.getElementById("rpt-body")?.innerHTML || "";
      ZB.utils.printHtml(`<h1>${ZB.utils.esc(currentTitle)}</h1><div class="muted">${ZB.utils.esc(d.company.name)}</div>${body}`, currentTitle);
    });
  }
};
