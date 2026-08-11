/**
 * Dashboard — real-time KPIs + Chart.js trends
 */
ZB.modules = ZB.modules || {};

ZB.modules.dashboard = {
  charts: [],

  destroyCharts() {
    this.charts.forEach((c) => c.destroy());
    this.charts = [];
  },

  async render(root) {
    this.destroyCharts();
    const d = ZB.API.getData();
    const today = ZB.utils.todayISO();
    const month = today.slice(0, 7);

    const invs = d.invoices.filter((i) => i.status !== "draft");
    const todaySales = invs
      .filter((i) => i.date === today)
      .reduce((s, i) => s + ZB.GST.invoiceTotals(i, d).grandTotal, 0);
    const monthlyRevenue = invs
      .filter((i) => i.date.startsWith(month))
      .reduce((s, i) => s + ZB.GST.invoiceTotals(i, d).grandTotal, 0);
    const pending = invs
      .filter((i) => ["pending", "partial", "overdue"].includes(i.status))
      .reduce((s, i) => s + ZB.GST.invoiceTotals(i, d).grandTotal, 0);
    const gstSum = ZB.GST.summary(invs, d, month + "-01", today);
    const expenses = d.expenses
      .filter((e) => e.date.startsWith(month))
      .reduce((s, e) => s + Number(e.amount) + Number(e.gst || 0), 0);
    const profit = monthlyRevenue - expenses;
    const lowStock = d.products.filter((p) => p.stock <= p.reorderLevel && p.warehouse !== "Virtual").length;

    const kpis = [
      { label: "Today's Sales", value: ZB.utils.money(todaySales), icon: "today", trend: "up", trendText: "Live" },
      { label: "Monthly Revenue", value: ZB.utils.money(monthlyRevenue), icon: "trending_up", trend: "up", trendText: "+12% MoM" },
      { label: "Customers", value: d.customers.length, icon: "groups", trend: "up", trendText: `${d.customers.filter((c) => c.status === "active").length} active` },
      { label: "Products", value: d.products.length, icon: "inventory_2", trend: "", trendText: `${lowStock} low stock` },
      { label: "Invoices", value: invs.length, icon: "receipt", trend: "", trendText: `${d.invoices.filter((i) => i.status === "draft").length} drafts` },
      { label: "Pending Payments", value: ZB.utils.money(pending), icon: "pending_actions", trend: "down", trendText: "Follow up" },
      { label: "GST Collected", value: ZB.utils.money(gstSum.totalTax), icon: "account_balance", trend: "up", trendText: "This month" },
      { label: "Profit (MTD)", value: ZB.utils.money(profit), icon: "savings", trend: profit >= 0 ? "up" : "down", trendText: "Rev − Exp" },
      { label: "Expenses (MTD)", value: ZB.utils.money(expenses), icon: "payments", trend: "", trendText: `${d.expenses.length} entries` },
      { label: "Suppliers", value: d.suppliers.length, icon: "local_shipping", trend: "", trendText: "Synced" }
    ];

    root.innerHTML = `
      ${ZB.ui.pageHeader("Dashboard", `Welcome back, ${ZB.utils.esc(ZB.auth.currentUser()?.name || "")} · ${ZB.utils.esc(d.company.tradeName)}`, `
        <button type="button" class="btn btn-secondary btn-sm" id="dash-refresh"><span class="material-icons-round">sync</span> Refresh</button>
      `)}
      <div class="kpi-grid stagger">
        ${kpis.map((k) => `
          <div class="kpi-card glass-card">
            <div class="kpi-icon"><span class="material-icons-round">${k.icon}</span></div>
            <div class="kpi-label">${k.label}</div>
            <div class="kpi-value">${k.value}</div>
            <div class="kpi-trend ${k.trend}"><span class="material-icons-round" style="font-size:14px">${k.trend === "up" ? "arrow_upward" : k.trend === "down" ? "arrow_downward" : "remove"}</span>${k.trendText}</div>
          </div>`).join("")}
      </div>
      <div class="charts-grid">
        <div class="chart-card glass-card">
          <div class="card-header"><h3>Sales vs Purchases</h3><span class="badge badge-info">Trend</span></div>
          <canvas id="chart-sales"></canvas>
        </div>
        <div class="chart-card glass-card">
          <div class="card-header"><h3>Category Mix</h3><span class="badge badge-info">Share</span></div>
          <canvas id="chart-cat"></canvas>
        </div>
      </div>
      <div class="two-col">
        <div class="card glass-card">
          <div class="card-header"><h3>Recent Invoices</h3>
            <button type="button" class="btn btn-sm btn-ghost" data-nav="billing">View all</button>
          </div>
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr><th>Invoice</th><th>Customer</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                ${d.invoices.slice(0, 5).map((inv) => {
                  const c = d.customers.find((x) => x.id === inv.customerId);
                  const t = ZB.GST.invoiceTotals(inv, d);
                  return `<tr>
                    <td class="mono">${ZB.utils.esc(inv.number)}</td>
                    <td>${ZB.utils.esc(c?.name || "—")}</td>
                    <td>${ZB.utils.formatDate(inv.date)}</td>
                    <td>${ZB.utils.money(t.grandTotal)}</td>
                    <td>${ZB.ui.badge(inv.status)}</td>
                  </tr>`;
                }).join("")}
              </tbody>
            </table>
          </div>
        </div>
        <div class="card glass-card">
          <div class="card-header"><h3>Activity Log</h3></div>
          <div style="display:flex;flex-direction:column;gap:10px">
            ${d.activityLog.slice(0, 6).map((a) => `
              <div style="display:flex;gap:10px;align-items:flex-start;padding:8px;border-radius:8px;background:var(--primary-soft)">
                <span class="material-icons-round" style="color:var(--primary);font-size:18px">history</span>
                <div style="flex:1">
                  <strong style="font-size:0.85rem">${ZB.utils.esc(a.action)}</strong>
                  <div class="text-muted" style="font-size:0.72rem">${ZB.utils.esc(a.user)} · ${ZB.utils.formatDateTime(a.time)}</div>
                </div>
              </div>`).join("")}
          </div>
        </div>
      </div>`;

    root.querySelector("#dash-refresh")?.addEventListener("click", () => {
      ZB.toast("success", "Dashboard refreshed", "KPIs updated from local Zoho mirror.");
      this.render(root);
    });
    root.querySelectorAll("[data-nav]").forEach((btn) =>
      btn.addEventListener("click", () => ZB.app.navigate(btn.dataset.nav))
    );

    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const gridColor = isDark ? "rgba(148,163,184,0.15)" : "rgba(148,163,184,0.25)";
    const textColor = isDark ? "#cbd5e1" : "#475569";

    if (window.Chart) {
      const salesCtx = document.getElementById("chart-sales");
      if (salesCtx) {
        this.charts.push(new Chart(salesCtx, {
          type: "line",
          data: {
            labels: d.salesTrend.labels,
            datasets: [
              { label: "Sales", data: d.salesTrend.sales, borderColor: "#2563eb", backgroundColor: "rgba(37,99,235,0.12)", fill: true, tension: 0.35 },
              { label: "Purchases", data: d.salesTrend.purchases, borderColor: "#64748b", backgroundColor: "rgba(100,116,139,0.1)", fill: true, tension: 0.35 }
            ]
          },
          options: {
            responsive: true,
            plugins: { legend: { labels: { color: textColor } } },
            scales: {
              x: { ticks: { color: textColor }, grid: { color: gridColor } },
              y: { ticks: { color: textColor, callback: (v) => "₹" + (v / 1000) + "k" }, grid: { color: gridColor } }
            }
          }
        }));
      }
      const catCtx = document.getElementById("chart-cat");
      if (catCtx) {
        this.charts.push(new Chart(catCtx, {
          type: "doughnut",
          data: {
            labels: d.categorySales.labels,
            datasets: [{
              data: d.categorySales.values,
              backgroundColor: ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#1d4ed8", "#64748b"],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            plugins: { legend: { position: "bottom", labels: { color: textColor, boxWidth: 12 } } }
          }
        }));
      }
    }
  }
};
