/** GST Compliance — summaries, HSN reports */
ZB.modules = ZB.modules || {};
ZB.modules.gst = {
  async render(root) {
    const d = ZB.API.getData();
    const today = ZB.utils.todayISO();
    const monthStart = today.slice(0, 7) + "-01";
    const sum = ZB.GST.summary(d.invoices, d, monthStart, today);

    root.innerHTML = `
      ${ZB.ui.pageHeader("GST Compliance", "Tax summaries · HSN · GSTR-ready exports", `
        <button type="button" class="btn btn-secondary btn-sm" id="gst-export"><span class="material-icons-round">download</span> Export HSN CSV</button>
      `)}
      <div class="gst-summary-grid stagger">
        <div class="gst-box glass-card"><label>Taxable Value</label><strong>${ZB.utils.money(sum.taxable)}</strong></div>
        <div class="gst-box glass-card"><label>CGST</label><strong>${ZB.utils.money(sum.cgst)}</strong></div>
        <div class="gst-box glass-card"><label>SGST</label><strong>${ZB.utils.money(sum.sgst)}</strong></div>
        <div class="gst-box glass-card"><label>IGST</label><strong>${ZB.utils.money(sum.igst)}</strong></div>
        <div class="gst-box glass-card"><label>CESS</label><strong>${ZB.utils.money(sum.cess)}</strong></div>
        <div class="gst-box glass-card"><label>Total Tax</label><strong>${ZB.utils.money(sum.totalTax)}</strong></div>
      </div>
      <div class="two-col">
        <div class="card glass-card">
          <div class="card-header"><h3>HSN-wise Summary</h3><span class="badge badge-info">GSTR-1</span></div>
          <div class="table-wrap"><table class="data-table">
            <thead><tr><th>HSN</th><th>Qty</th><th>Taxable</th><th>Tax</th></tr></thead>
            <tbody>${sum.hsn.map((h) => `
              <tr>
                <td class="mono">${ZB.utils.esc(h.hsn)}</td>
                <td>${h.qty}</td>
                <td>${ZB.utils.money(h.taxable)}</td>
                <td>${ZB.utils.money(h.tax)}</td>
              </tr>`).join("") || `<tr><td colspan="4">${ZB.ui.empty("receipt", "No taxable invoices this month")}</td></tr>`}
            </tbody>
          </table></div>
        </div>
        <div class="card glass-card">
          <div class="card-header"><h3>Company GST Profile</h3></div>
          <p><strong>${ZB.utils.esc(d.company.name)}</strong></p>
          <p class="mono">GSTIN: ${ZB.utils.esc(d.company.gstin)}</p>
          <p class="mono">PAN: ${ZB.utils.esc(d.company.pan)}</p>
          <p>State: ${ZB.utils.esc(d.company.state)} (${ZB.utils.esc(d.company.stateCode)})</p>
          <p style="margin-top:16px" class="text-muted">Filing reminders are sent via Zoho Mail workflows. Use Zoho Analytics for GSTR dashboards.</p>
          <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap">
            <button type="button" class="btn btn-secondary btn-sm" id="gst-gstr1">Preview GSTR-1</button>
            <button type="button" class="btn btn-secondary btn-sm" id="gst-gstr3b">Preview GSTR-3B</button>
          </div>
        </div>
      </div>`;

    root.querySelector("#gst-export")?.addEventListener("click", () => {
      const csv = ZB.utils.toCSV(sum.hsn, [
        { label: "HSN", key: "hsn" }, { label: "Qty", key: "qty" },
        { label: "Taxable", key: "taxable" }, { label: "Tax", key: "tax" }
      ]);
      ZB.utils.download("hsn-summary.csv", csv, "text/csv");
      ZB.toast("success", "Exported", "HSN summary CSV ready.");
    });
    root.querySelector("#gst-gstr1")?.addEventListener("click", () => {
      ZB.toast("info", "GSTR-1", `Outward supplies taxable ${ZB.utils.money(sum.taxable)}, tax ${ZB.utils.money(sum.totalTax)}.`);
    });
    root.querySelector("#gst-gstr3b")?.addEventListener("click", () => {
      ZB.toast("info", "GSTR-3B", `3.1(a) Outward taxable: ${ZB.utils.money(sum.taxable)} | Tax: ${ZB.utils.money(sum.totalTax)}`);
    });
  }
};
