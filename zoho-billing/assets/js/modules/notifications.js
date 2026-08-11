/** Notifications center */
ZB.modules = ZB.modules || {};
ZB.modules.notifications = {
  async render(root) {
    const list = ZB.API.getData().notifications;
    root.innerHTML = `
      ${ZB.ui.pageHeader("Notifications", "Alerts · payment reminders · sync events", `
        <button type="button" class="btn btn-secondary btn-sm" id="notif-readall">Mark all read</button>
      `)}
      <div class="card glass-card content-enter">
        ${list.map((n) => `
          <div class="notif-item" style="opacity:${n.read ? 0.7 : 1}">
            <div style="display:flex;justify-content:space-between;gap:8px">
              <h4>${ZB.utils.esc(n.title)}</h4>
              ${ZB.ui.badge(n.type)}
            </div>
            <p>${ZB.utils.esc(n.message)}</p>
            <time>${ZB.utils.formatDateTime(n.time)}</time>
          </div>`).join("") || ZB.ui.empty("notifications", "All caught up")}
      </div>`;
    root.querySelector("#notif-readall")?.addEventListener("click", () => {
      list.forEach((n) => (n.read = true));
      ZB.API.save();
      ZB.app.updateNotifBadge();
      ZB.toast("success", "Done", "All notifications marked read.");
      this.render(root);
    });
  },

  renderPanel() {
    const list = document.getElementById("notif-list");
    if (!list) return;
    const items = ZB.API.getData().notifications;
    list.innerHTML = items.map((n) => `
      <div class="notif-item">
        <h4>${ZB.utils.esc(n.title)}</h4>
        <p>${ZB.utils.esc(n.message)}</p>
        <time>${ZB.utils.formatDateTime(n.time)}</time>
      </div>`).join("");
  }
};
