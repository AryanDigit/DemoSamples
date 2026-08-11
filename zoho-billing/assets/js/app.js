/**
 * ZorBill App Shell — navigation, RBAC, theme, auth gate
 */
window.ZB = window.ZB || {};

ZB.app = {
  route: "dashboard",

  nav: [
    { section: "Overview", items: [
      { id: "dashboard", label: "Dashboard", icon: "dashboard" }
    ]},
    { section: "Sales", items: [
      { id: "customers", label: "Customers", icon: "groups" },
      { id: "quotations", label: "Quotations", icon: "request_quote" },
      { id: "billing", label: "Billing", icon: "receipt_long" },
      { id: "payments", label: "Payments", icon: "payments" }
    ]},
    { section: "Purchase & Stock", items: [
      { id: "suppliers", label: "Suppliers", icon: "local_shipping" },
      { id: "purchases", label: "Purchases", icon: "shopping_cart" },
      { id: "products", label: "Products", icon: "inventory_2" },
      { id: "inventory", label: "Inventory", icon: "warehouse" }
    ]},
    { section: "Finance", items: [
      { id: "expenses", label: "Expenses", icon: "account_balance_wallet" },
      { id: "gst", label: "GST", icon: "account_balance" },
      { id: "reports", label: "Reports", icon: "analytics" }
    ]},
    { section: "System", items: [
      { id: "notifications", label: "Notifications", icon: "notifications" },
      { id: "settings", label: "Settings", icon: "settings" }
    ]}
  ],

  init() {
    ZB.API.loadCache();
    this.bindAuth();
    this.bindChrome();
    this.applyTheme(localStorage.getItem("zorbill_theme") || "light");

    if (ZB.auth.isLoggedIn()) {
      ZB.auth.startGuard();
      this.showApp();
    }
  },

  bindAuth() {
    document.getElementById("login-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value.trim();
      const role = document.getElementById("login-role").value;
      ZB.auth.login({ email, role });
      ZB.toast("success", "Welcome", `Signed in as ${ZB.RBAC.label(role)}`);
      this.showApp();
    });
  },

  bindChrome() {
    document.getElementById("btn-theme")?.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      this.applyTheme(next);
    });
    document.getElementById("btn-logout")?.addEventListener("click", () => {
      ZB.auth.logout();
      location.reload();
    });
    document.getElementById("btn-menu")?.addEventListener("click", () => {
      document.getElementById("sidebar")?.classList.add("open");
      document.getElementById("sidebar-overlay")?.classList.add("show");
    });
    document.getElementById("sidebar-overlay")?.addEventListener("click", () => this.closeSidebar());
    document.getElementById("btn-notifications")?.addEventListener("click", () => {
      const panel = document.getElementById("notif-panel");
      panel.classList.toggle("open");
      panel.setAttribute("aria-hidden", panel.classList.contains("open") ? "false" : "true");
      ZB.modules.notifications.renderPanel();
    });
    document.getElementById("btn-close-notif")?.addEventListener("click", () => {
      document.getElementById("notif-panel")?.classList.remove("open");
    });
    document.getElementById("btn-quick-invoice")?.addEventListener("click", () => {
      if (ZB.auth.can("billing")) this.navigate("billing");
      else ZB.toast("error", "Access denied", "Billing not allowed for your role.");
    });

    // Global search shortcut
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
        e.preventDefault();
        document.getElementById("global-search")?.focus();
      }
    });
    document.getElementById("global-search")?.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      const q = e.target.value.trim().toLowerCase();
      if (!q) return;
      const d = ZB.API.getData();
      if (d.invoices.some((i) => i.number.toLowerCase().includes(q))) this.navigate("billing");
      else if (d.customers.some((c) => c.name.toLowerCase().includes(q))) this.navigate("customers");
      else if (d.products.some((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))) this.navigate("products");
      else ZB.toast("info", "No match", "Try customers, invoices, or product SKUs.");
    });
  },

  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("zorbill_theme", theme);
    const icon = document.querySelector("#btn-theme .material-icons-round");
    if (icon) icon.textContent = theme === "dark" ? "light_mode" : "dark_mode";
    // Re-render dashboard charts if active
    if (this.route === "dashboard" && !document.getElementById("app")?.classList.contains("hidden")) {
      this.navigate("dashboard");
    }
  },

  closeSidebar() {
    document.getElementById("sidebar")?.classList.remove("open");
    document.getElementById("sidebar-overlay")?.classList.remove("show");
  },

  showApp() {
    document.getElementById("auth-screen")?.classList.add("hidden");
    const app = document.getElementById("app");
    app?.classList.remove("hidden");
    app?.setAttribute("aria-hidden", "false");

    const user = ZB.auth.currentUser();
    document.getElementById("user-name").textContent = user?.name || "User";
    document.getElementById("user-role").textContent = ZB.RBAC.label(user?.role);
    document.getElementById("user-avatar").textContent = user?.avatar || "U";

    this.renderNav();
    this.updateNotifBadge();
    this.navigate(this.route);
  },

  renderNav() {
    const nav = document.getElementById("sidebar-nav");
    if (!nav) return;
    let html = "";
    this.nav.forEach((sec) => {
      const items = sec.items.filter((i) => ZB.auth.can(i.id));
      if (!items.length) return;
      html += `<div class="nav-section">${sec.section}</div>`;
      items.forEach((i) => {
        html += `<a href="#${i.id}" class="nav-item ${this.route === i.id ? "active" : ""}" data-route="${i.id}">
          <span class="material-icons-round">${i.icon}</span>
          <span>${i.label}</span>
        </a>`;
      });
    });
    nav.innerHTML = html;
    nav.querySelectorAll("[data-route]").forEach((a) =>
      a.addEventListener("click", (e) => {
        e.preventDefault();
        this.navigate(a.dataset.route);
        this.closeSidebar();
      })
    );
  },

  updateNotifBadge() {
    const unread = ZB.API.getData().notifications.filter((n) => !n.read).length;
    const el = document.getElementById("notif-count");
    if (el) {
      el.textContent = unread;
      el.style.display = unread ? "grid" : "none";
    }
  },

  async navigate(route) {
    if (!ZB.auth.can(route)) {
      ZB.toast("error", "Access denied", `Your role cannot access ${route}.`);
      route = "dashboard";
    }
    this.route = route;
    this.renderNav();
    const root = document.getElementById("content");
    if (!root) return;
    root.innerHTML = `<div class="empty-state"><span class="material-icons-round" style="animation:pulse 1s infinite">hourglass_empty</span><p>Loading…</p></div>`;

    const mod = ZB.modules[route];
    try {
      if (mod?.render) await mod.render(root);
      else root.innerHTML = ZB.ui.empty("error", "Module missing", route);
    } catch (err) {
      console.error(err);
      root.innerHTML = ZB.ui.empty("error", "Something went wrong", err.message || String(err));
      ZB.toast("error", "Error", err.message || "Module failed to load");
    }
    location.hash = route;
  }
};

document.addEventListener("DOMContentLoaded", () => ZB.app.init());
window.addEventListener("hashchange", () => {
  const r = location.hash.replace("#", "");
  if (r && ZB.auth.isLoggedIn() && r !== ZB.app.route) ZB.app.navigate(r);
});
