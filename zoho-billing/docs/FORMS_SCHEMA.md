# Forms schema (Zoho Creator)

Create these forms in Creator. Field types are guidelines for the UI builder.

## Core

- **Company_Settings** — Name, Trade_Name, GSTIN, PAN, Address, City, State, State_Code, Pincode, Phone, Email, Invoice_Prefix, Quote_Prefix, PO_Prefix
- **OAuth_Config** — Books_Org_ID, Inventory_Org_ID, tokens (encrypted)
- **Users** — Name, Email, Role (Super_Admin|Admin|Staff|Accountant), Status
- **Activity_Logs** — Action, User_Name, Event_Time, IP_Address
- **Notifications** — Title, Message, Type, Is_Read

## Masters

- **Customers** — see `deluge/forms/Customers.dg`
- **Suppliers** — Name, Contact, Email, Phone, GSTIN, PAN, Address, City, State, State_Code, Outstanding, Status
- **Products** — Product_Name, SKU, HSN, Category, Unit, Purchase_Price, Sale_Price, GST_Rate, Stock, Reorder_Level, Warehouse, Barcode, Expiry, Zoho_Inventory_Item_ID
- **Warehouses** — Code, Name, City, Capacity

## Transactions

- **Invoices** + subform **Line_Items** — see `deluge/forms/Invoices.dg`
- **Quotations** + Line_Items — Number, Customer, Dates, Status, Notes
- **Purchases** + Line_Items — PO_Number, Supplier, Date, Status
- **Payments** — Invoice (lookup), Customer, Date, Amount, Mode, Reference, Status
- **Expenses** — Date, Category, Description, Amount, GST, Payment_Mode, Vendor
- **Stock_Transfers** — Date, From_WH, To_WH, Product, Qty, Status
