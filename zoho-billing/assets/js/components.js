/**
 * Reusable UI components — toast, modal, table, pagination
 */
window.ZB = window.ZB || {};

ZB.toast = function (type, title, message) {
  const root = document.getElementById("toast-root");
  if (!root) return;
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  const icons = { success: "check_circle", error: "error", warning: "warning", info: "info" };
  el.innerHTML = `
    <span class="material-icons-round" style="color:var(--${type === "error" ? "danger" : type === "success" ? "success" : type === "warning" ? "warning" : "info"})">${icons[type] || "info"}</span>
    <div class="toast-msg"><strong>${ZB.utils.esc(title)}</strong>${ZB.utils.esc(message || "")}</div>
    <button type="button" class="icon-btn" aria-label="Dismiss"><span class="material-icons-round">close</span></button>`;
  el.querySelector("button").onclick = () => el.remove();
  root.appendChild(el);
  setTimeout(() => el.remove(), 4500);
};

ZB.modal = {
  open({ title, body, footer, size = "" }) {
    const root = document.getElementById("modal-root");
    root.classList.add("open");
    root.setAttribute("aria-hidden", "false");
    root.innerHTML = `
      <div class="modal ${size}" role="dialog" aria-modal="true" aria-label="${ZB.utils.esc(title)}">
        <div class="modal-header">
          <h2>${title}</h2>
          <button type="button" class="icon-btn" data-close aria-label="Close"><span class="material-icons-round">close</span></button>
        </div>
        <div class="modal-body">${body}</div>
        ${footer ? `<div class="modal-footer">${footer}</div>` : ""}
      </div>`;
    root.querySelector("[data-close]").onclick = () => this.close();
    root.onclick = (e) => { if (e.target === root) this.close(); };
    document.addEventListener("keydown", this._esc);
    return root.querySelector(".modal");
  },
  _esc(e) {
    if (e.key === "Escape") ZB.modal.close();
  },
  close() {
    const root = document.getElementById("modal-root");
    root.classList.remove("open");
    root.setAttribute("aria-hidden", "true");
    root.innerHTML = "";
    document.removeEventListener("keydown", this._esc);
  }
};

ZB.ui = {
  pageHeader(title, subtitle, actionsHtml = "") {
    return `
      <div class="page-header animate-fade-up">
        <div>
          <h1>${title}</h1>
          <p>${subtitle || ""}</p>
        </div>
        <div class="page-actions" style="display:flex;gap:8px;flex-wrap:wrap">${actionsHtml}</div>
      </div>`;
  },

  badge(status) {
    const map = {
      paid: "paid", active: "active", received: "success", cleared: "success", accepted: "success", completed: "success", connected: "success",
      pending: "pending", draft: "draft", ordered: "warning", sent: "info", in_transit: "warning", partial: "partial",
      overdue: "overdue", inactive: "inactive", expired: "danger", billed: "info"
    };
    const cls = map[status] || "info";
    return `<span class="badge badge-${cls}">${ZB.utils.esc(status || "—")}</span>`;
  },

  pagination(meta, onPageAttr = "data-page") {
    if (meta.pages <= 1) return `<div class="pagination"><span class="page-info">${meta.total} records</span></div>`;
    let btns = "";
    for (let i = 1; i <= meta.pages; i++) {
      btns += `<button type="button" class="btn btn-sm ${i === meta.page ? "btn-primary" : "btn-ghost"}" ${onPageAttr}="${i}">${i}</button>`;
    }
    return `<div class="pagination">
      <span class="page-info">Showing ${(meta.page - 1) * meta.perPage + 1}–${Math.min(meta.page * meta.perPage, meta.total)} of ${meta.total}</span>
      <button type="button" class="btn btn-sm btn-ghost" ${onPageAttr}="${meta.page - 1}" ${meta.page <= 1 ? "disabled" : ""}>Prev</button>
      ${btns}
      <button type="button" class="btn btn-sm btn-ghost" ${onPageAttr}="${meta.page + 1}" ${meta.page >= meta.pages ? "disabled" : ""}>Next</button>
    </div>`;
  },

  empty(icon, title, hint) {
    return `<div class="empty-state">
      <span class="material-icons-round">${icon || "inbox"}</span>
      <h3>${title || "No data"}</h3>
      <p>${hint || ""}</p>
    </div>`;
  },

  /** Bind form values from object */
  fillForm(form, data) {
    Object.keys(data || {}).forEach((k) => {
      const el = form.elements.namedItem(k);
      if (el) el.value = data[k] ?? "";
    });
  },

  formData(form) {
    const fd = new FormData(form);
    const obj = {};
    fd.forEach((v, k) => { obj[k] = v; });
    return obj;
  }
};

ZB.logActivity = function (action) {
  const d = ZB.API.getData();
  const user = ZB.auth.currentUser()?.name || "System";
  d.activityLog.unshift({
    id: ZB.utils.uid("a"),
    user,
    action,
    time: new Date().toISOString()
  });
  d.activityLog = d.activityLog.slice(0, 100);
  ZB.API.save();
};
