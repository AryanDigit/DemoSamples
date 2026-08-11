/**
 * Role-based access control & session (Zoho OAuth ready)
 * Roles: super_admin | admin | staff | accountant
 */
window.ZB = window.ZB || {};

ZB.RBAC = {
  permissions: {
    super_admin: ["*"],
    admin: [
      "dashboard", "customers", "products", "suppliers", "purchases", "inventory",
      "expenses", "quotations", "billing", "payments", "gst", "reports",
      "notifications", "settings"
    ],
    staff: [
      "dashboard", "customers", "products", "suppliers", "purchases", "inventory",
      "quotations", "billing", "notifications"
    ],
    accountant: [
      "dashboard", "customers", "expenses", "billing", "payments", "gst",
      "reports", "notifications"
    ]
  },

  can(role, module) {
    const perms = this.permissions[role] || [];
    return perms.includes("*") || perms.includes(module);
  },

  label(role) {
    return {
      super_admin: "Super Admin",
      admin: "Admin",
      staff: "Staff",
      accountant: "Accountant"
    }[role] || role;
  }
};

ZB.auth = {
  SESSION_KEY: "zorbill_session",
  TIMEOUT_MIN: 45,
  _guard: null,

  getSession() {
    try {
      const raw = sessionStorage.getItem(this.SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  isLoggedIn() {
    return !!this.getSession();
  },

  /**
   * Demo login — production uses Zoho OAuth redirect:
   * https://accounts.zoho.com/oauth/v2/auth?...
   */
  login({ email, role, name }) {
    const user = (window.ZORBILL_DATA?.users || []).find((u) => u.email === email) || {
      id: "demo",
      name: name || "User",
      email,
      role,
      avatar: (name || email || "U")[0].toUpperCase()
    };
    const session = {
      user: { ...user, role: role || user.role },
      loggedInAt: new Date().toISOString(),
      oauth: { provider: "zoho", demo: true },
      expiresAt: Date.now() + this.TIMEOUT_MIN * 60 * 1000
    };
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    this.startGuard();
    ZB.logActivity(`User ${session.user.name} signed in (${ZB.RBAC.label(session.user.role)})`);
    return session;
  },

  logout() {
    if (this._guard) this._guard.clear();
    sessionStorage.removeItem(this.SESSION_KEY);
  },

  startGuard() {
    if (this._guard) this._guard.clear();
    this._guard = ZB.utils.createSessionGuard(this.TIMEOUT_MIN, () => {
      ZB.toast("warning", "Session expired", "Please sign in again.");
      this.logout();
      location.reload();
    });
  },

  currentUser() {
    return this.getSession()?.user || null;
  },

  can(module) {
    const u = this.currentUser();
    return u ? ZB.RBAC.can(u.role, module) : false;
  }
};
