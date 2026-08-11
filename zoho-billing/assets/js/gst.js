/**
 * GST Engine — CGST / SGST / IGST / CESS + discounts + round-off
 * Compliant with Indian GST for intra/inter-state supplies.
 */
window.ZB = window.ZB || {};

ZB.GST = {
  /**
   * Determine tax split based on company vs customer state codes.
   */
  taxType(companyState, customerState) {
    if (!customerState || companyState === customerState) return "intra"; // CGST+SGST
    return "inter"; // IGST
  },

  /**
   * Calculate tax for a single line item.
   * @param {{ qty, rate, discount, gstRate, cessRate? }} line
   * @param {"intra"|"inter"} type
   */
  lineTax(line, type = "intra") {
    const qty = Number(line.qty) || 0;
    const rate = Number(line.rate) || 0;
    const discountPct = Number(line.discount) || 0;
    const gstRate = Number(line.gstRate) || 0;
    const cessRate = Number(line.cessRate) || 0;

    const gross = qty * rate;
    const discountAmt = ZB.utils.round2((gross * discountPct) / 100);
    const taxable = ZB.utils.round2(gross - discountAmt);

    let cgst = 0, sgst = 0, igst = 0;
    if (type === "inter") {
      igst = ZB.utils.round2((taxable * gstRate) / 100);
    } else {
      cgst = ZB.utils.round2((taxable * gstRate) / 200);
      sgst = ZB.utils.round2((taxable * gstRate) / 200);
    }
    const cess = ZB.utils.round2((taxable * cessRate) / 100);
    const total = ZB.utils.round2(taxable + cgst + sgst + igst + cess);

    return { gross, discountAmt, taxable, cgst, sgst, igst, cess, total, gstRate };
  },

  /**
   * Full invoice totals from invoice record + data store.
   */
  invoiceTotals(invoice, data) {
    data = data || ZB.API.getData();
    const company = data.company;
    const customer = data.customers.find((c) => c.id === invoice.customerId);
    const type = this.taxType(company.stateCode, customer?.stateCode);

    let taxable = 0, cgst = 0, sgst = 0, igst = 0, cess = 0, discount = 0;
    const lines = (invoice.items || []).map((item) => {
      const t = this.lineTax(item, type);
      taxable += t.taxable;
      cgst += t.cgst;
      sgst += t.sgst;
      igst += t.igst;
      cess += t.cess;
      discount += t.discountAmt;
      const product = data.products.find((p) => p.id === item.productId);
      return { ...item, ...t, productName: product?.name || "Item", hsn: product?.hsn || "" };
    });

    taxable = ZB.utils.round2(taxable);
    cgst = ZB.utils.round2(cgst);
    sgst = ZB.utils.round2(sgst);
    igst = ZB.utils.round2(igst);
    cess = ZB.utils.round2(cess);
    discount = ZB.utils.round2(discount);

    const beforeRound = ZB.utils.round2(taxable + cgst + sgst + igst + cess);
    const { rounded, diff } = ZB.utils.roundOff(beforeRound);

    return {
      type,
      lines,
      discount,
      taxable,
      cgst,
      sgst,
      igst,
      cess,
      beforeRound,
      roundOff: diff,
      grandTotal: rounded,
      customer,
      company
    };
  },

  /** Aggregate GST for reports (date range optional) */
  summary(invoices, data, from, to) {
    data = data || ZB.API.getData();
    let cgst = 0, sgst = 0, igst = 0, cess = 0, taxable = 0;
    const hsnMap = {};

    invoices.forEach((inv) => {
      if (inv.status === "draft") return;
      if (from && inv.date < from) return;
      if (to && inv.date > to) return;
      const t = this.invoiceTotals(inv, data);
      cgst += t.cgst;
      sgst += t.sgst;
      igst += t.igst;
      cess += t.cess;
      taxable += t.taxable;
      t.lines.forEach((l) => {
        const h = l.hsn || "NA";
        if (!hsnMap[h]) hsnMap[h] = { hsn: h, taxable: 0, tax: 0, qty: 0 };
        hsnMap[h].taxable += l.taxable;
        hsnMap[h].tax += l.cgst + l.sgst + l.igst + l.cess;
        hsnMap[h].qty += Number(l.qty) || 0;
      });
    });

    return {
      taxable: ZB.utils.round2(taxable),
      cgst: ZB.utils.round2(cgst),
      sgst: ZB.utils.round2(sgst),
      igst: ZB.utils.round2(igst),
      cess: ZB.utils.round2(cess),
      totalTax: ZB.utils.round2(cgst + sgst + igst + cess),
      hsn: Object.values(hsnMap).map((h) => ({
        ...h,
        taxable: ZB.utils.round2(h.taxable),
        tax: ZB.utils.round2(h.tax)
      }))
    };
  }
};
