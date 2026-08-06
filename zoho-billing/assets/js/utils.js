/**
 * ZorBill Utilities — currency, dates, pagination, export helpers
 */
window.ZB = window.ZB || {};

ZB.utils = {
  /** Format INR currency */
  money(n, symbol = "₹") {
    const val = Number(n) || 0;
    return symbol + val.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  },

  /** Round to 2 decimals (Indian GST style) */
  round2(n) {
    return Math.round((Number(n) + Number.EPSILON) * 100) / 100;
  },

  /** Round-off to nearest rupee */
  roundOff(n) {
    const r = Math.round(Number(n));
    return { rounded: r, diff: ZB.utils.round2(r - Number(n)) };
  },

  formatDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  },

  formatDateTime(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
  },

  todayISO() {
    return new Date().toISOString().slice(0, 10);
  },

  /** Generate next document number */
  nextNumber(prefix, existing, pad = 4) {
    const year = new Date().getFullYear();
    const nums = existing
      .map((x) => {
        const m = String(x).match(/(\d+)$/);
        return m ? parseInt(m[1], 10) : 0;
      })
      .filter(Boolean);
    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    return `${prefix}-${year}-${String(next).padStart(pad, "0")}`;
  },

  /** Simple debounce */
  debounce(fn, ms = 250) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  },

  /** Escape HTML */
  esc(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  },

  /** Paginate array */
  paginate(arr, page = 1, perPage = 10) {
    const total = arr.length;
    const pages = Math.max(1, Math.ceil(total / perPage));
    const p = Math.min(Math.max(1, page), pages);
    const start = (p - 1) * perPage;
    return { items: arr.slice(start, start + perPage), page: p, pages, total, perPage };
  },

  /** Filter by search across fields */
  search(arr, query, fields) {
    const q = String(query || "").trim().toLowerCase();
    if (!q) return arr;
    return arr.filter((row) =>
      fields.some((f) => String(row[f] ?? "").toLowerCase().includes(q))
    );
  },

  /** Download text as file (CSV / JSON) */
  download(filename, content, mime = "text/plain") {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  },

  /** Convert array of objects to CSV */
  toCSV(rows, columns) {
    const header = columns.map((c) => c.label).join(",");
    const body = rows
      .map((r) =>
        columns
          .map((c) => {
            const v = typeof c.value === "function" ? c.value(r) : r[c.key];
            const s = String(v ?? "").replace(/"/g, '""');
            return `"${s}"`;
          })
          .join(",")
      )
      .join("\n");
    return header + "\n" + body;
  },

  /** Print HTML content in new window */
  printHtml(html, title = "Print") {
    const w = window.open("", "_blank", "width=900,height=700");
    if (!w) {
      ZB.toast("error", "Popup blocked", "Allow popups to print or download PDF.");
      return;
    }
    w.document.write(`<!DOCTYPE html><html><head><title>${title}</title>
      <style>
        body{font-family:DM Sans,system-ui,sans-serif;padding:24px;color:#0f172a}
        table{width:100%;border-collapse:collapse;margin-top:12px}
        th,td{border:1px solid #e2e8f0;padding:8px;text-align:left;font-size:13px}
        th{background:#eff6ff}
        h1{font-size:20px;margin:0 0 4px}
        .muted{color:#64748b;font-size:12px}
        .totals{margin-top:16px;max-width:280px;margin-left:auto}
        .totals div{display:flex;justify-content:space-between;padding:4px 0}
        .grand{font-weight:700;border-top:2px solid #2563eb;padding-top:8px;margin-top:8px}
        @media print{button{display:none}}
      </style></head><body>${html}
      <script>window.onload=()=>setTimeout(()=>window.print(),300)<\\/script>
      </body></html>`);
    w.document.close();
  },

  /** WhatsApp share link */
  whatsappShare(phone, text) {
    const p = String(phone || "").replace(/\D/g, "");
    const url = `https://wa.me/91${p.slice(-10)}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  },

  uid(prefix = "id") {
    return prefix + "_" + Math.random().toString(36).slice(2, 10);
  },

  /** Session timeout helper */
  createSessionGuard(minutes, onTimeout) {
    let timer;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(onTimeout, minutes * 60 * 1000);
    };
    ["click", "keydown", "mousemove", "scroll"].forEach((ev) =>
      document.addEventListener(ev, reset, { passive: true })
    );
    reset();
    return { reset, clear: () => clearTimeout(timer) };
  }
};
