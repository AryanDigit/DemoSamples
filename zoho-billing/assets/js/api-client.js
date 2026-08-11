/**
 * Zoho API Client — OAuth + Books / Inventory / CRM / Mail / Analytics / Sign
 * In demo mode, reads/writes ZORBILL_DATA. In production, Deluge/Creator
 * pages call these endpoints via invokeurl with OAuth tokens.
 */
window.ZB = window.ZB || {};

ZB.API = {
  mode: "demo", // "demo" | "live"
  base: {
    accounts: "https://accounts.zoho.com",
    books: "https://www.zohoapis.com/books/v3",
    inventory: "https://www.zohoapis.com/inventory/v1",
    crm: "https://www.zohoapis.com/crm/v2",
    mail: "https://mail.zoho.com/api",
    analytics: "https://analyticsapi.zoho.com/restapi/v2",
    sign: "https://sign.zoho.com/api/v1"
  },

  /** OAuth scopes required for full integration */
  scopes: [
    "ZohoBooks.fullaccess.all",
    "ZohoInventory.FullAccess.all",
    "ZohoCRM.modules.ALL",
    "ZohoMail.messages.CREATE",
    "ZohoAnalytics.fullaccess.all",
    "ZohoSign.documents.ALL"
  ].join(","),

  getData() {
    return window.ZORBILL_DATA;
  },

  /** Persist demo mutations */
  save() {
    try {
      localStorage.setItem("zorbill_data_cache", JSON.stringify(window.ZORBILL_DATA));
    } catch (_) { /* ignore quota */ }
  },

  loadCache() {
    try {
      const c = localStorage.getItem("zorbill_data_cache");
      if (c) {
        const parsed = JSON.parse(c);
        Object.assign(window.ZORBILL_DATA, parsed);
      }
    } catch (_) { /* ignore */ }
  },

  // ——— Customers ———
  async listCustomers() {
    return [...this.getData().customers];
  },
  async saveCustomer(cust) {
    const list = this.getData().customers;
    if (cust.id) {
      const i = list.findIndex((c) => c.id === cust.id);
      if (i >= 0) list[i] = { ...list[i], ...cust };
    } else {
      cust.id = ZB.utils.uid("c");
      cust.outstanding = cust.outstanding || 0;
      cust.status = cust.status || "active";
      list.push(cust);
    }
    this.save();
    // Live: POST /contacts (Books) + CRM Contacts module via Deluge
    return cust;
  },
  async deleteCustomer(id) {
    const d = this.getData();
    d.customers = d.customers.filter((c) => c.id !== id);
    this.save();
  },

  // ——— Products ———
  async listProducts() {
    return [...this.getData().products];
  },
  async saveProduct(p) {
    const list = this.getData().products;
    if (p.id) {
      const i = list.findIndex((x) => x.id === p.id);
      if (i >= 0) list[i] = { ...list[i], ...p };
    } else {
      p.id = ZB.utils.uid("p");
      p.status = p.status || "active";
      list.push(p);
    }
    this.save();
    return p;
  },
  async deleteProduct(id) {
    this.getData().products = this.getData().products.filter((p) => p.id !== id);
    this.save();
  },

  // ——— Suppliers ———
  async listSuppliers() {
    return [...this.getData().suppliers];
  },
  async saveSupplier(s) {
    const list = this.getData().suppliers;
    if (s.id) {
      const i = list.findIndex((x) => x.id === s.id);
      if (i >= 0) list[i] = { ...list[i], ...s };
    } else {
      s.id = ZB.utils.uid("s");
      s.outstanding = s.outstanding || 0;
      s.status = s.status || "active";
      list.push(s);
    }
    this.save();
    return s;
  },

  // ——— Invoices ———
  async listInvoices() {
    return [...this.getData().invoices];
  },
  async saveInvoice(inv) {
    const d = this.getData();
    if (!inv.id) {
      inv.id = ZB.utils.uid("inv");
      inv.number =
        inv.number ||
        ZB.utils.nextNumber(d.company.invoicePrefix, d.invoices.map((i) => i.number));
      d.invoices.unshift(inv);
      // Auto stock update on non-draft
      if (inv.status !== "draft") this._applySaleStock(inv);
    } else {
      const i = d.invoices.findIndex((x) => x.id === inv.id);
      if (i >= 0) d.invoices[i] = { ...d.invoices[i], ...inv };
    }
    this.save();
    return inv;
  },

  _applySaleStock(inv) {
    const products = this.getData().products;
    (inv.items || []).forEach((line) => {
      const p = products.find((x) => x.id === line.productId);
      if (p && p.warehouse !== "Virtual") {
        p.stock = Math.max(0, (p.stock || 0) - Number(line.qty || 0));
      }
    });
  },

  _applyPurchaseStock(po) {
    const products = this.getData().products;
    (po.items || []).forEach((line) => {
      const p = products.find((x) => x.id === line.productId);
      if (p) p.stock = (p.stock || 0) + Number(line.qty || 0);
    });
  },

  // ——— Purchases ———
  async listPurchases() {
    return [...this.getData().purchases];
  },
  async savePurchase(po) {
    const d = this.getData();
    if (!po.id) {
      po.id = ZB.utils.uid("po");
      po.number =
        po.number ||
        ZB.utils.nextNumber(d.company.poPrefix, d.purchases.map((i) => i.number));
      d.purchases.unshift(po);
      if (po.status === "received" || po.status === "billed") this._applyPurchaseStock(po);
    } else {
      const i = d.purchases.findIndex((x) => x.id === po.id);
      if (i >= 0) d.purchases[i] = { ...d.purchases[i], ...po };
    }
    this.save();
    return po;
  },

  // ——— Quotations ———
  async listQuotations() {
    return [...this.getData().quotations];
  },
  async saveQuotation(q) {
    const d = this.getData();
    if (!q.id) {
      q.id = ZB.utils.uid("q");
      q.number =
        q.number ||
        ZB.utils.nextNumber(d.company.quotePrefix, d.quotations.map((i) => i.number));
      d.quotations.unshift(q);
    } else {
      const i = d.quotations.findIndex((x) => x.id === q.id);
      if (i >= 0) d.quotations[i] = { ...d.quotations[i], ...q };
    }
    this.save();
    return q;
  },

  // ——— Expenses / Payments ———
  async listExpenses() {
    return [...this.getData().expenses];
  },
  async saveExpense(e) {
    const list = this.getData().expenses;
    if (!e.id) {
      e.id = ZB.utils.uid("e");
      list.unshift(e);
    } else {
      const i = list.findIndex((x) => x.id === e.id);
      if (i >= 0) list[i] = { ...list[i], ...e };
    }
    this.save();
    return e;
  },
  async listPayments() {
    return [...this.getData().payments];
  },
  async savePayment(p) {
    const d = this.getData();
    if (!p.id) {
      p.id = ZB.utils.uid("pay");
      d.payments.unshift(p);
      const inv = d.invoices.find((i) => i.id === p.invoiceId);
      if (inv && p.status === "cleared") {
        const totals = ZB.GST.invoiceTotals(inv, d);
        const paid = d.payments
          .filter((x) => x.invoiceId === inv.id && x.status === "cleared")
          .reduce((s, x) => s + Number(x.amount), 0);
        if (paid >= totals.grandTotal - 0.5) inv.status = "paid";
        else if (paid > 0) inv.status = "partial";
      }
    }
    this.save();
    return p;
  },

  // ——— Stock transfer ———
  async listTransfers() {
    return [...this.getData().stockTransfers];
  },
  async saveTransfer(t) {
    const d = this.getData();
    if (!t.id) {
      t.id = ZB.utils.uid("st");
      d.stockTransfers.unshift(t);
    }
    this.save();
    return t;
  },

  // ——— OAuth connect (demo toggles) ———
  connectService(key) {
    const oauth = this.getData().oauth;
    if (oauth[key]) {
      oauth[key] = {
        connected: true,
        orgId: "demo_org_" + key,
        lastSync: new Date().toISOString()
      };
      this.save();
    }
  },
  disconnectService(key) {
    const oauth = this.getData().oauth;
    if (oauth[key]) {
      oauth[key] = { connected: false, orgId: "", lastSync: null };
      this.save();
    }
  },

  /** Build Zoho OAuth authorize URL (for live deployment) */
  getAuthUrl(clientId, redirectUri) {
    const params = new URLSearchParams({
      scope: this.scopes,
      client_id: clientId,
      response_type: "code",
      access_type: "offline",
      redirect_uri: redirectUri,
      prompt: "consent"
    });
    return `${this.base.accounts}/oauth/v2/auth?${params}`;
  },

  /**
   * Live invokeurl template used inside Deluge:
   * response = invokeurl
   * [
   *   url: "https://www.zohoapis.com/books/v3/invoices?organization_id=..."
   *   type: GET
   *   connection: "zorbill_books"
   * ];
   */
  async syncBooks() {
    if (this.mode === "demo") {
      this.getData().oauth.books.lastSync = new Date().toISOString();
      this.getData().oauth.books.connected = true;
      this.save();
      return { success: true, message: "Demo sync: Zoho Books invoices mirrored." };
    }
    throw new Error("Live sync runs via Deluge connection zorbill_books");
  }
};

// Load persisted demo edits
if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => ZB.API.loadCache());
}
