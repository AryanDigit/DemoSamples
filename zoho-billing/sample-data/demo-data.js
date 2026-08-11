/**
 * ZorBill Demo Sample Data
 * Mirrors Zoho Creator form records + Zoho Books / Inventory sync payloads.
 * Replace with live API calls via assets/js/api-client.js in production.
 */
window.ZORBILL_DATA = {
  company: {
    name: "Aryan Digital Traders Pvt Ltd",
    tradeName: "ADT Wholesale",
    gstin: "27AABCU9603R1ZM",
    pan: "AABCU9603R",
    address: "412, Tech Park, Andheri East",
    city: "Mumbai",
    state: "Maharashtra",
    stateCode: "27",
    pincode: "400069",
    phone: "+91 98765 43210",
    email: "billing@aryandigital.com",
    website: "https://aryandigital.com",
    invoicePrefix: "INV",
    quotePrefix: "QT",
    poPrefix: "PO",
    financialYear: "2025-26",
    currency: "INR",
    currencySymbol: "₹"
  },

  users: [
    { id: "u1", name: "Aryan Sharma", email: "admin@zorbill.com", role: "super_admin", avatar: "A" },
    { id: "u2", name: "Priya Mehta", email: "manager@zorbill.com", role: "admin", avatar: "P" },
    { id: "u3", name: "Rahul Verma", email: "staff@zorbill.com", role: "staff", avatar: "R" },
    { id: "u4", name: "Sneha Patel", email: "accounts@zorbill.com", role: "accountant", avatar: "S" }
  ],

  customers: [
    { id: "c1", name: "Sunrise Retailers", contact: "Amit Joshi", email: "amit@sunrise.in", phone: "9820011111", gstin: "27AADCS1234A1Z5", pan: "AADCS1234A", billingAddress: "12 MG Road, Pune", shippingAddress: "12 MG Road, Pune", city: "Pune", state: "Maharashtra", stateCode: "27", pincode: "411001", type: "Retailer", creditLimit: 500000, outstanding: 84500, status: "active", zohoCrmId: "crm_lead_1001" },
    { id: "c2", name: "BlueWave Distributors", contact: "Neha Kapoor", email: "neha@bluewave.co", phone: "9810022222", gstin: "07AABCB5678B1Z9", pan: "AABCB5678B", billingAddress: "88 Connaught Place", shippingAddress: "Warehouse 4, Okhla", city: "New Delhi", state: "Delhi", stateCode: "07", pincode: "110001", type: "Distributor", creditLimit: 1000000, outstanding: 212000, status: "active", zohoCrmId: "crm_lead_1002" },
    { id: "c3", name: "GreenLeaf Services", contact: "Vikram Rao", email: "vikram@greenleaf.in", phone: "9900033333", gstin: "29AAGCG9012C1Z3", pan: "AAGCG9012C", billingAddress: "ITPL Road, Whitefield", shippingAddress: "ITPL Road, Whitefield", city: "Bengaluru", state: "Karnataka", stateCode: "29", pincode: "560066", type: "Service", creditLimit: 250000, outstanding: 0, status: "active", zohoCrmId: "crm_lead_1003" },
    { id: "c4", name: "Metro Mart Chain", contact: "Pooja Nair", email: "pooja@metromart.com", phone: "9760044444", gstin: "33AAHCM3456D1Z7", pan: "AAHCM3456D", billingAddress: "Anna Salai, Chennai", shippingAddress: "Anna Salai, Chennai", city: "Chennai", state: "Tamil Nadu", stateCode: "33", pincode: "600002", type: "Wholesaler", creditLimit: 750000, outstanding: 45600, status: "active", zohoCrmId: "crm_lead_1004" },
    { id: "c5", name: "CraftHouse Mfg", contact: "Suresh Iyer", email: "suresh@crafthouse.in", phone: "9650055555", gstin: "24AAICC7890E1Z1", pan: "AAICC7890E", billingAddress: "GIDC Estate, Vadodara", shippingAddress: "GIDC Estate, Vadodara", city: "Vadodara", state: "Gujarat", stateCode: "24", pincode: "390010", type: "Manufacturer", creditLimit: 400000, outstanding: 128000, status: "active", zohoCrmId: "crm_lead_1005" },
    { id: "c6", name: "QuickFix Local", contact: "Ravi Desai", email: "ravi@quickfix.in", phone: "9540066666", gstin: "", pan: "BXUPD1234F", billingAddress: "Shop 5, Bandra West", shippingAddress: "Shop 5, Bandra West", city: "Mumbai", state: "Maharashtra", stateCode: "27", pincode: "400050", type: "Retailer", creditLimit: 50000, outstanding: 12500, status: "inactive", zohoCrmId: "crm_lead_1006" }
  ],

  suppliers: [
    { id: "s1", name: "Alpha Components Ltd", contact: "Kiran Shah", email: "kiran@alphacomp.in", phone: "9120010001", gstin: "27AABCA1111A1Z1", pan: "AABCA1111A", address: "MIDC, Thane", city: "Thane", state: "Maharashtra", stateCode: "27", pincode: "400604", outstanding: 67500, status: "active" },
    { id: "s2", name: "Nova Packagings", contact: "Meera Singh", email: "meera@novapack.in", phone: "9120010002", gstin: "09AABCN2222B1Z2", pan: "AABCN2222B", address: "Industrial Area, Noida", city: "Noida", state: "Uttar Pradesh", stateCode: "09", pincode: "201301", outstanding: 32000, status: "active" },
    { id: "s3", name: "SteelWorks India", contact: "Arjun Reddy", email: "arjun@steelworks.in", phone: "9120010003", gstin: "36AABCS3333C1Z3", pan: "AABCS3333C", address: "Jeedimetla", city: "Hyderabad", state: "Telangana", stateCode: "36", pincode: "500055", outstanding: 156000, status: "active" },
    { id: "s4", name: "EcoRaw Materials", contact: "Lata Menon", email: "lata@ecoraw.in", phone: "9120010004", gstin: "32AABCE4444D1Z4", pan: "AABCE4444D", address: "Kochi Port Road", city: "Kochi", state: "Kerala", stateCode: "32", pincode: "682001", outstanding: 0, status: "active" }
  ],

  categories: ["Electronics", "Stationery", "Packaging", "Raw Materials", "Services", "Hardware"],

  products: [
    { id: "p1", name: "Wireless Mouse Pro", sku: "EL-WM-001", hsn: "84716060", category: "Electronics", unit: "Pcs", purchasePrice: 450, salePrice: 799, gstRate: 18, stock: 145, reorderLevel: 30, warehouse: "WH-Mumbai", barcode: "8901001001001", image: null, expiry: null, status: "active" },
    { id: "p2", name: "A4 Copier Paper (500 sheets)", sku: "ST-A4-500", hsn: "48025610", category: "Stationery", unit: "Ream", purchasePrice: 180, salePrice: 260, gstRate: 12, stock: 420, reorderLevel: 100, warehouse: "WH-Mumbai", barcode: "8901001001002", image: null, expiry: null, status: "active" },
    { id: "p3", name: "Corrugated Box Medium", sku: "PK-CB-M", hsn: "48191010", category: "Packaging", unit: "Pcs", purchasePrice: 35, salePrice: 55, gstRate: 18, stock: 28, reorderLevel: 50, warehouse: "WH-Delhi", barcode: "8901001001003", image: null, expiry: null, status: "active" },
    { id: "p4", name: "Industrial Grease 5kg", sku: "RM-GR-5K", hsn: "27101990", category: "Raw Materials", unit: "Can", purchasePrice: 890, salePrice: 1250, gstRate: 18, stock: 64, reorderLevel: 20, warehouse: "WH-Mumbai", barcode: "8901001001004", image: null, expiry: "2027-06-30", status: "active" },
    { id: "p5", name: "Annual Maintenance Contract", sku: "SV-AMC-01", hsn: "998719", category: "Services", unit: "Yr", purchasePrice: 0, salePrice: 15000, gstRate: 18, stock: 999, reorderLevel: 0, warehouse: "Virtual", barcode: "8901001001005", image: null, expiry: null, status: "active" },
    { id: "p6", name: "SS Bolt M8 Pack", sku: "HW-BL-M8", hsn: "73181500", category: "Hardware", unit: "Pack", purchasePrice: 120, salePrice: 185, gstRate: 18, stock: 18, reorderLevel: 40, warehouse: "WH-Delhi", barcode: "8901001001006", image: null, expiry: null, status: "active" },
    { id: "p7", name: "LED Desk Lamp", sku: "EL-LD-002", hsn: "94052090", category: "Electronics", unit: "Pcs", purchasePrice: 650, salePrice: 1199, gstRate: 18, stock: 87, reorderLevel: 25, warehouse: "WH-Mumbai", barcode: "8901001001007", image: null, expiry: null, status: "active" },
    { id: "p8", name: "Premium Notebook Set", sku: "ST-NB-SET", hsn: "48201010", category: "Stationery", unit: "Set", purchasePrice: 95, salePrice: 175, gstRate: 12, stock: 210, reorderLevel: 50, warehouse: "WH-Mumbai", barcode: "8901001001008", image: null, expiry: null, status: "active" }
  ],

  warehouses: [
    { id: "w1", code: "WH-Mumbai", name: "Mumbai Central Warehouse", city: "Mumbai", capacity: 10000 },
    { id: "w2", code: "WH-Delhi", name: "Delhi North Warehouse", city: "New Delhi", capacity: 8000 },
    { id: "w3", code: "Virtual", name: "Virtual / Services", city: "—", capacity: 0 }
  ],

  invoices: [
    { id: "inv1", number: "INV-2026-0042", customerId: "c1", date: "2026-08-05", dueDate: "2026-08-20", status: "paid", items: [{ productId: "p1", qty: 20, rate: 799, discount: 5, gstRate: 18 }, { productId: "p2", qty: 50, rate: 260, discount: 0, gstRate: 12 }], paymentMode: "UPI", notes: "Thank you for your business", zohoBooksId: "zb_inv_4201" },
    { id: "inv2", number: "INV-2026-0041", customerId: "c2", date: "2026-08-04", dueDate: "2026-08-19", status: "pending", items: [{ productId: "p7", qty: 15, rate: 1199, discount: 0, gstRate: 18 }, { productId: "p3", qty: 100, rate: 55, discount: 10, gstRate: 18 }], paymentMode: "Credit", notes: "", zohoBooksId: "zb_inv_4200" },
    { id: "inv3", number: "INV-2026-0040", customerId: "c4", date: "2026-08-03", dueDate: "2026-08-18", status: "partial", items: [{ productId: "p8", qty: 80, rate: 175, discount: 0, gstRate: 12 }], paymentMode: "NEFT", notes: "Partial received", zohoBooksId: "zb_inv_4199" },
    { id: "inv4", number: "INV-2026-0039", customerId: "c5", date: "2026-08-01", dueDate: "2026-08-15", status: "overdue", items: [{ productId: "p4", qty: 25, rate: 1250, discount: 0, gstRate: 18 }, { productId: "p6", qty: 40, rate: 185, discount: 0, gstRate: 18 }], paymentMode: "Credit", notes: "Follow up required", zohoBooksId: "zb_inv_4198" },
    { id: "inv5", number: "INV-2026-0038", customerId: "c3", date: "2026-07-28", dueDate: "2026-08-12", status: "paid", items: [{ productId: "p5", qty: 1, rate: 15000, discount: 0, gstRate: 18 }], paymentMode: "Cheque", notes: "AMC FY 25-26", zohoBooksId: "zb_inv_4197" },
    { id: "inv6", number: "INV-2026-0037", customerId: "c1", date: "2026-08-06", dueDate: "2026-08-21", status: "draft", items: [{ productId: "p1", qty: 10, rate: 799, discount: 0, gstRate: 18 }], paymentMode: "", notes: "", zohoBooksId: null }
  ],

  quotations: [
    { id: "q1", number: "QT-2026-0018", customerId: "c2", date: "2026-08-02", validUntil: "2026-08-16", status: "sent", items: [{ productId: "p1", qty: 50, rate: 780, discount: 5, gstRate: 18 }, { productId: "p7", qty: 30, rate: 1150, discount: 0, gstRate: 18 }], notes: "Volume discount applied" },
    { id: "q2", number: "QT-2026-0017", customerId: "c4", date: "2026-07-30", validUntil: "2026-08-13", status: "accepted", items: [{ productId: "p2", qty: 200, rate: 250, discount: 8, gstRate: 12 }], notes: "" },
    { id: "q3", number: "QT-2026-0016", customerId: "c5", date: "2026-07-25", validUntil: "2026-08-08", status: "expired", items: [{ productId: "p4", qty: 100, rate: 1200, discount: 0, gstRate: 18 }], notes: "Price valid 14 days" },
    { id: "q4", number: "QT-2026-0019", customerId: "c3", date: "2026-08-05", validUntil: "2026-08-20", status: "draft", items: [{ productId: "p5", qty: 2, rate: 14500, discount: 0, gstRate: 18 }], notes: "Multi-year AMC" }
  ],

  purchases: [
    { id: "po1", number: "PO-2026-0012", supplierId: "s1", date: "2026-08-01", status: "received", items: [{ productId: "p1", qty: 100, rate: 450, gstRate: 18 }, { productId: "p7", qty: 50, rate: 650, gstRate: 18 }], notes: "Synced to Zoho Inventory" },
    { id: "po2", number: "PO-2026-0011", supplierId: "s2", date: "2026-07-28", status: "ordered", items: [{ productId: "p3", qty: 500, rate: 35, gstRate: 18 }], notes: "" },
    { id: "po3", number: "PO-2026-0010", supplierId: "s3", date: "2026-07-20", status: "partial", items: [{ productId: "p6", qty: 200, rate: 120, gstRate: 18 }], notes: "50% received" },
    { id: "po4", number: "PO-2026-0009", supplierId: "s4", date: "2026-07-15", status: "billed", items: [{ productId: "p4", qty: 40, rate: 890, gstRate: 18 }], notes: "" }
  ],

  expenses: [
    { id: "e1", date: "2026-08-05", category: "Rent", description: "Warehouse rent - Aug", amount: 85000, gst: 0, paymentMode: "NEFT", vendor: "Estate Corp" },
    { id: "e2", date: "2026-08-04", category: "Utilities", description: "Electricity bill", amount: 12400, gst: 0, paymentMode: "UPI", vendor: "MSEB" },
    { id: "e3", date: "2026-08-03", category: "Transport", description: "Last-mile delivery", amount: 8600, gst: 432, paymentMode: "Cash", vendor: "QuickLogistics" },
    { id: "e4", date: "2026-08-01", category: "Marketing", description: "Google Ads campaign", amount: 25000, gst: 4500, paymentMode: "Card", vendor: "Google India" },
    { id: "e5", date: "2026-07-28", category: "Salaries", description: "Staff payroll July", amount: 320000, gst: 0, paymentMode: "NEFT", vendor: "Payroll" },
    { id: "e6", date: "2026-07-25", category: "Office", description: "Stationery restock", amount: 4500, gst: 540, paymentMode: "UPI", vendor: "OfficeNeeds" }
  ],

  payments: [
    { id: "pay1", invoiceId: "inv1", customerId: "c1", date: "2026-08-05", amount: 24882.2, mode: "UPI", reference: "UPI240805001", status: "cleared" },
    { id: "pay2", invoiceId: "inv3", customerId: "c4", date: "2026-08-04", amount: 10000, mode: "NEFT", reference: "NEFT884422", status: "cleared" },
    { id: "pay3", invoiceId: "inv5", customerId: "c3", date: "2026-07-29", amount: 17700, mode: "Cheque", reference: "CHQ778899", status: "cleared" },
    { id: "pay4", invoiceId: "inv2", customerId: "c2", date: "2026-08-06", amount: 5000, mode: "UPI", reference: "UPI240806002", status: "pending" }
  ],

  stockTransfers: [
    { id: "st1", date: "2026-08-02", from: "WH-Mumbai", to: "WH-Delhi", productId: "p1", qty: 30, status: "completed" },
    { id: "st2", date: "2026-07-29", from: "WH-Delhi", to: "WH-Mumbai", productId: "p3", qty: 50, status: "in_transit" }
  ],

  notifications: [
    { id: "n1", type: "alert", title: "Low stock: Corrugated Box Medium", message: "Only 28 units left (reorder at 50). Sync with Zoho Inventory recommended.", time: "2026-08-06T08:30:00", read: false },
    { id: "n2", type: "payment", title: "Payment overdue", message: "INV-2026-0039 — CraftHouse Mfg outstanding ₹39,885.", time: "2026-08-06T07:15:00", read: false },
    { id: "n3", type: "sync", title: "Zoho Books sync complete", message: "12 invoices and 4 payments synced successfully.", time: "2026-08-05T22:00:00", read: false },
    { id: "n4", type: "info", title: "GST return reminder", message: "GSTR-1 filing window opens in 5 days.", time: "2026-08-05T10:00:00", read: true }
  ],

  salesTrend: {
    labels: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    sales: [420000, 485000, 510000, 560000, 620000, 710000, 385000],
    purchases: [280000, 310000, 295000, 340000, 380000, 420000, 210000]
  },

  categorySales: {
    labels: ["Electronics", "Stationery", "Packaging", "Raw Materials", "Services", "Hardware"],
    values: [32, 18, 12, 15, 14, 9]
  },

  activityLog: [
    { id: "a1", user: "Priya Mehta", action: "Created invoice INV-2026-0042", time: "2026-08-05T16:20:00" },
    { id: "a2", user: "Rahul Verma", action: "Updated stock for EL-WM-001", time: "2026-08-05T14:10:00" },
    { id: "a3", user: "Sneha Patel", action: "Recorded payment UPI240805001", time: "2026-08-05T16:45:00" },
    { id: "a4", user: "System", action: "Nightly Zoho Inventory sync", time: "2026-08-05T22:00:00" },
    { id: "a5", user: "Priya Mehta", action: "Sent quotation QT-2026-0018", time: "2026-08-02T11:30:00" }
  ],

  oauth: {
    books: { connected: false, orgId: "", lastSync: null },
    inventory: { connected: false, orgId: "", lastSync: null },
    crm: { connected: false, orgId: "", lastSync: null },
    mail: { connected: false, orgId: "", lastSync: null },
    analytics: { connected: false, orgId: "", lastSync: null },
    sign: { connected: false, orgId: "", lastSync: null }
  }
};
