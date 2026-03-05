/**
 * ERP-EZEM ULTIMATE GLOBAL CORE v4.5
 * Consolidated Backend Engine: POS, Inventory, HR, Finance, Security & Refunds
 */

// --- SECRETS & ENVIRONMENT SHIM ---
// This allows using process.env.KEY similar to Node.js in Google Apps Script
const process = {
  env: new Proxy(
    {},
    {
      get: function (target, prop) {
        return PropertiesService.getScriptProperties().getProperty(prop);
      },
    },
  ),
};

const APP_CONFIG = {
  VERSION: "4.5.0",
  TIMEZONE: "GMT+2",
  SHEETS: {
    ITEMS: "Items",
    MENU_POS: "Menu POS", // New sheet for prepared items
    MOVEMENTS: "Movements",
    SUPPLIERS: "Suppliers",
    STAFF: "Staff",
    ATTENDANCE: "Attendance",
    EXPENSES: "Expenses",
    ORDERS: "Orders",
    MENU_ITEMS: "Menu Items",
    SALES: "Sales",
    RECIPES: "Recipes",
    USERS: "Users",
    LOCATIONS: "Locations",
    SHIFTS: "Shifts",
    LOGS: "System_Logs",
    RECON_ARCHIVE: "Reconciliation_Archive",
    BOH_COUNTS: "Inventory_Record", // Renamed for user preference
    INVENTORY_RECORD: "Inventory_Record",
    ANALYTICS_CACHE: "Analytics_Cache",
    TARGETS: "Monthly_Targets",
  },
};

/**
 * 🔐 PRODUCTION SETUP UTILITY
 * Run this function ONCE from the Apps Script Editor to securely store your
 * bot secrets in Script Properties. After running, they are auto-loaded via process.env.
 *
 * HOW TO USE:
 * 1. Paste your real token & chat ID below
 * 2. Click Run → syncSecretsFromEnv
 * 3. Done! You may then delete the values from this function
 */
function syncSecretsFromEnv() {
  var props = PropertiesService.getScriptProperties();
  props.setProperties({
    TELEGRAM_TOKEN: "8630064385:AAEOIyHLx5oHfJS9Gv0z4KanTLQZ61GTtEQ",
    TELEGRAM_CHAT_ID: "839787526",
    TELEGRAM_ENABLED: "true",
    GEMINI_API_KEY: "PASTE_YOUR_GEMINI_API_KEY_HERE",
    AUTO_REPORTS: JSON.stringify(["sales", "stock"]),
    AUTO_HOUR: "22",
  });
  Logger.log(" Secrets synced to Script Properties successfully!");
  Logger.log(
    " TELEGRAM_TOKEN  → " +
      (process.env.TELEGRAM_TOKEN ? "✅ Set" : "❌ Missing"),
  );
  Logger.log(
    " TELEGRAM_CHAT_ID → " +
      (process.env.TELEGRAM_CHAT_ID
        ? "✅ Set"
        : "⚠️ Not set yet – add your Chat ID!"),
  );
}

/**
 * دالة التهيئة الشاملة - تقوم ببناء أو تحديث النظام
 */
function setupSystem() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const config = [
    {
      name: "Items",
      head: [
        "Group",
        "Category",
        "Code",
        "Name",
        "Unit",
        "Cost",
        "Supplier",
        "In Stock", // Gap/Empty per user
        "Yield",
        "Max",
        "Min",
        "Status",
      ],
    },
    {
      name: "Menu POS",
      head: [
        "Group",
        "Category",
        "Code",
        "Name",
        "Price",
        "Cost",
        "RecipeID",
        "Type",
        "Status",
      ],
    },
    {
      name: "Inventory_Record",
      head: [
        "Group",
        "Category",
        "Code",
        "Name",
        "Unit",
        "Cost",
        "Qty", // Gap/Empty per user
        "Branch Name",
        "Date Inventory",
        "Date temp",
        "User",
      ],
    },
    {
      name: "Movements",
      head: [
        "Date",
        "Type",
        "Item Code",
        "Item Name",
        "Qty",
        "Cost",
        "Total",
        "Batch",
        "Expiry",
        "From",
        "To",
        "User",
        "Supp",
        "Ref",
        "Notes",
        "Reason",
        "Date Temp",
      ],
    },
    {
      name: "Suppliers",
      head: ["Name", "Contact", "Phone", "Email", "Address"],
    },
    {
      name: "Staff",
      head: ["ID", "Name", "Role", "Phone", "Salary", "JoinDate", "Status"],
    },
    {
      name: "Attendance",
      head: ["Date", "Name", "Type", "Time", "Loc", "RecordedBy"],
    },
    {
      name: "Expenses",
      head: ["Date", "Item", "Amount", "Reason", "Market", "User"],
    },
    {
      name: "Sales",
      head: [
        "ID",
        "Date",
        "Amount",
        "Items",
        "User",
        "Status",
        "ShiftID",
        "Payments",
        "Customer",
        "Type",
      ],
    },
    {
      name: "Recipes",
      head: [
        "ID",
        "Meal",
        "Ingredients",
        "Cost",
        "CreatedBy",
        "Price",
        "Type",
        "ProductType",
        "BatchQty",
        "Overhead",
        "Unit",
      ],
    },
    {
      name: "Users",
      head: ["ID", "Name", "User", "Pass", "Role", "Status", "Perms"],
    },
    {
      name: "Shifts",
      head: [
        "ID",
        "User",
        "OpenDate",
        "OpenAmount",
        "CloseDate",
        "CloseAmount",
        "SalesTotal",
        "Status",
      ],
    },
    { name: "Locations", head: ["ID", "Name", "Type", "Description"] },
    { name: "System_Logs", head: ["Timestamp", "User", "Action", "Details"] },
    {
      name: "Reconciliation_Archive",
      head: [
        "Date",
        "Branch",
        "Code",
        "Item Name",
        "Beg. Inv",
        "Recv",
        "Purch",
        "T-In",
        "T-Out",
        "Waste",
        "Ret",
        "Cons (POS)",
        "Cons (Manual)",
        "Theo. Stock",
        "Yield %",
        "Theo. Stock (Yield)",
        "Actual Count (On Hand)",
        "Variance",
        "Var. Value",
        "User",
      ],
    },
    {
      name: "Orders",
      head: [
        "ID",
        "Date",
        "Time",
        "Customer",
        "Phone",
        "Items",
        "Total",
        "Payment",
        "Amount",
        "Status",
        "Type",
        "Source",
        "Notes",
      ],
    },
    {
      name: "Report_Daily_Sales",
      head: ["Date", "TotalSales", "OrdersCount", "AvgCheck", "Exp", "Net"],
    },
    {
      name: "Report_Inventory_Levels",
      head: ["ItemName", "CurrentStock", "Unit", "TotalValue"],
    },
    {
      name: "Report_Talabat_Sales",
      head: ["ID", "Date", "Market", "Total", "Status"],
    },
    {
      name: "Report_Delivery_Performance",
      head: ["Driver", "Date", "TotalOrders", "OnTime", "Delayed"],
    },
    {
      name: "Report_Session_Archive",
      head: [
        "ShiftID",
        "User",
        "OpenDate",
        "CloseDate",
        "TotalRevenue",
        "Discrepancy",
      ],
    },
    {
      name: "Analytics_Cache",
      head: [
        "Date",
        "Branch",
        "TotalSales",
        "COGS",
        "WasteAmount",
        "OrderCount",
        "AvgTicket",
      ],
    },
    {
      name: "Monthly_Targets",
      head: ["Branch", "Month", "Year", "TargetType", "TargetValue"],
    },
  ];

  config.forEach((s) => {
    let sheet = ss.getSheetByName(s.name) || ss.insertSheet(s.name);
    sheet
      .getRange(1, 1, 1, s.head.length)
      .setValues([s.head])
      .setFontWeight("bold")
      .setBackground("#0f172a")
      .setFontColor("#ffffff");
    sheet.setFrozenRows(1);
  });

  // Default Admin if missing
  const userSheet = ss.getSheetByName("Users");
  if (userSheet.getLastRow() === 1) {
    userSheet.appendRow([
      "USR-001",
      "المدير العام",
      "admin",
      "123",
      "Admin",
      "Active",
      "ALL",
    ]);
  }

  return "✅ ERP-EZEM v4.5 System Ready!";
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000); // 15s Concurrency Safety
    const request = JSON.parse(e.postData.contents);
    const { action, data, user } = request;
    let response;

    if (!["LOGIN", "SETUP_SYSTEM"].includes(action) && !user)
      throw new Error("User session expired");

    switch (action) {
      case "INIT_DATA":
        response = { status: "success", db: loadAllData(user) };
        break;
      case "LOGIN":
        response = AuthService.login(data);
        break;
      case "VERIFY_MANAGER":
        response = AuthService.verifyManager(data);
        break;
      case "PROCESS_SALE":
        response = SalesService.process(data, user);
        break;
      case "UPDATE_ORDER_STATUS":
        response = AdminService.updateOrderStatus(data, user);
        break;
      case "PROCESS_REFUND":
        response = SalesService.refund(data, user);
        break;
      case "ADD_PRODUCT":
        response = InventoryService.add(data);
        break;
      case "SAVE_MOVEMENT":
        response = InventoryService.saveMovement(data, user);
        break;
      case "PROCESS_AUDIT":
        response = InventoryService.processAudit(data, user);
        break;
      case "LOG_ATTENDANCE":
        response = HRService.logAttendance(data, user);
        break;
      case "SAVE_STAFF":
        response = HRService.saveStaff(data);
        break;
      case "LOG_EXPENSE":
        response = FinanceService.save(data, user);
        break;
      case "SAVE_RECIPE":
        response = ProductionService.saveRecipe(data, user);
        break;
      case "MANAGE_USER":
        response = AdminService.handleUser(data);
        break;
      case "OPEN_SHIFT":
        response = ShiftService.open(data, user);
        break;
      case "CLOSE_SHIFT":
        response = ShiftService.close(data, user);
        break;
      case "UPDATE_RECORD":
        response = AdminService.updateRecord(data, user);
        break;
      case "DELETE_RECORD":
        response = AdminService.deleteRecord(data, user);
        break;
      case "ADD_RECORD":
        response = AdminService.addRecord(data, user);
        break;
      case "SETUP_SYSTEM":
        response = { status: "success", message: setupSystem() };
        break;
      case "GENERATE_REPORT":
        response = ReportService.get(data);
        break;
      case "GET_PL_REPORT":
        response = ReportService.getPnL(data);
        break;
      case "SAVE_TELEGRAM_CONFIG":
        var props = PropertiesService.getScriptProperties();
        props.setProperty("TELEGRAM_TOKEN", data.token);
        props.setProperty("TELEGRAM_CHAT_ID", data.chatId);
        props.setProperty("TELEGRAM_ENABLED", data.enabled ? "true" : "false");
        response = { status: "success" };
        break;
      case "TEST_TELEGRAM":
        response = TelegramService.send(
          "⚡ *Test Signal Received*\nEZEM PRO Intelligence is now LIVE!",
        );
        break;
      case "LOG_RECON":
        response = AdminService.saveReconSnapshot(data, user);
        break;
      case "GET_PREDICTIVE_DATA":
        response = IntelligenceService.getAdvancedAnalytics(data, user);
        break;
      case "SAVE_DSR_ENTRY":
        response = SalesService.saveDSR(data, user);
        break;
      case "GET_DSR_LOGS":
        response = SalesService.getDSRLogs(data, user);
        break;
      case "ADD_HISTORICAL_DSR":
        response = SalesService.addHistoricalDSR(data, user);
        break;
      case "SAVE_LOCATION":
        response = AdminService.saveLocation(data, user);
        break;
      case "SAVE_AUTOMATION":
        response = AutomationService.save(data);
        break;
      case "GET_TG_UPDATES":
        response = TelegramService.getUpdates();
        break;
      case "DELETE_SALE":
        response = SalesService.delete(data, user);
        break;
      case "UPDATE_SALE":
        response = AdminService.updateRecord(data, user);
        break;
      case "WIPE_DATA":
        response = AdminService.wipeData(data, user);
        break;
      case "SAVE_BOH_COUNT":
        response = BOHService.saveCounts(data, user);
        break;
      case "ASK_AI":
        response = AIService.ask(data, user);
        break;
      default:
        throw new Error("API Action Refused: " + action);
    }

    // --- TURBO SYNC ATTACHMENT ---
    // Automatically attach updated DB for all data-modifying actions
    if (
      response &&
      response.status === "success" &&
      ![
        "LOGIN",
        "GENERATE_REPORT",
        "GET_PL_REPORT",
        "TEST_TELEGRAM",
        "GET_TG_UPDATES",
      ].includes(action)
    ) {
      response.db = loadAllData(user);
    }

    return createResponse(response);
  } catch (error) {
    return createResponse({ status: "error", message: error.toString() });
  } finally {
    lock.releaseLock();
  }
}

function loadAllData(user) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const db = {};

  // Optimization: Map sheets first to avoid multiple ss.getSheetByName calls
  const sheets = ss.getSheets();
  const sheetMap = {};
  sheets.forEach((s) => (sheetMap[s.getName()] = s));

  Object.values(APP_CONFIG.SHEETS).forEach((n) => {
    const s = sheetMap[n];
    // Efficiently fetch all data in one go per sheet
    db[n.replace(/ /g, "_")] = s ? s.getDataRange().getValues().slice(1) : [];
  });

  // Group BOH_Counts by session key (date + branch + user) for frontend use
  const bohRaw = db.BOH_Counts || [];
  const bohSessions = {};
  bohRaw.forEach((row) => {
    const sessionKey = `${row[0]}__${row[2]}__${row[3]}`; // date__branch__user
    if (!bohSessions[sessionKey]) {
      bohSessions[sessionKey] = {
        date: row[0],
        time: row[1],
        branch: row[2],
        user: row[3],
        items: {},
      };
    }
    bohSessions[sessionKey].items[row[5]] = parseFloat(row[6]) || 0; // itemName -> qty
  });
  db.BOH_Sessions = Object.values(bohSessions).sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  db.activeShift = null;
  if (user && user.name) {
    const act = db.Shifts.find(
      (s) =>
        String(s[1]).trim() === String(user.name).trim() && s[7] === "Open",
    );
    if (act)
      db.activeShift = {
        id: act[0],
        user: act[1],
        openDate: act[2],
        openAmount: act[3],
      };
  }

  // Low Stock Logic (cached in the sync object)
  db.lowStock = db.Items.filter((i) => {
    const qty = parseFloat(i[7]) || 0; // In Stock at index 7 now
    const min = parseFloat(i[10]) || 0; // Min at index 10
    return qty <= min && min > 0;
  }).map((i) => ({ name: i[3], qty: i[7], uom: i[4] }));

  // Intelligence: Waste Breakdown
  const wasteMvmts = db.Movements.filter((m) => m[1] === "Waste");
  const wasteByReason = {};
  wasteMvmts.forEach((m) => {
    const reason = m[7] || "Other";
    const cost = parseFloat(m[12]) || 0;
    wasteByReason[reason] = (wasteByReason[reason] || 0) + cost;
  });
  db.intel = {
    wasteByReason: wasteByReason,
    topWastedItems: wasteMvmts.reduce((acc, m) => {
      acc[m[9]] = (acc[m[9]] || 0) + (parseFloat(m[12]) || 0);
      return acc;
    }, {}),
  };

  // Intelligence: Supplier Balances
  const suppliers = db.Suppliers || [];
  const purMvmts = db.Movements.filter((m) => m[1] === "Purchasing");
  db.supplierBalances = suppliers.map((s) => {
    const name = s[0];
    const totalPurchased = purMvmts
      .filter((m) => m[4] === name)
      .reduce((sum, m) => sum + (parseFloat(m[12]) || 0), 0);
    // Assuming we might have a 'Payments' sheet later, for now just show total purchased
    return { name, balance: totalPurchased };
  });

  // Telegram Config
  db.telegram = {
    token: "8630064385:AAEOIyHLx5oHfJS9Gv0z4KanTLQZ61GTtEQ",
    chatId: "839787526",
    enabled: true,
  };

  // Automation Config
  var props = PropertiesService.getScriptProperties();
  db.automation = {
    reports: JSON.parse(props.getProperty("AUTO_REPORTS") || "[]"),
    hour: props.getProperty("AUTO_HOUR") || "22",
  };

  return db;
}

const AuthService = {
  login: (d) => {
    const v = SpreadsheetApp.getActiveSpreadsheet()
      .getSheetByName("Users")
      .getDataRange()
      .getValues();
    for (let i = 1; i < v.length; i++) {
      if (v[i][2] == d.user && String(v[i][3]) == String(d.pass)) {
        return {
          status: "success",
          profile: {
            name: v[i][1],
            role: v[i][4],
            perms: v[i][6] || AuthService.getDefault(v[i][4]),
          },
        };
      }
    }
    return { status: "error", message: "كلمة مرور خاطئة" };
  },
  verifyManager: (d) => {
    const v = SpreadsheetApp.getActiveSpreadsheet()
      .getSheetByName("Users")
      .getDataRange()
      .getValues();
    for (let i = 1; i < v.length; i++)
      if (
        ["Admin", "Manager"].includes(v[i][4]) &&
        String(v[i][3]) == String(d.pass)
      )
        return { status: "success" };
    throw new Error("تحقق المدير فشل: كلمة مرور غير صحيحة");
  },
  getDefault: (r) =>
    ({
      Admin: "ALL",
      Manager:
        "dash,pos,inv,trx,recipes,audit,recon,sales_log,finance,hr,suppliers,users,settings,reports_hub,kds,purchasing,reports",
      Cashier: "pos,sales_log,dash,kds",
      Branches: "pos,inv,trx,audit,recon,dash,sales_log",
      "Call Center": "pos,dash,sales_log,reports_hub",
      Storekeeper: "inv,trx,audit,recon,purchasing,suppliers,dash",
      Chef: "kds,recipes,dash,inv",
      Accountant:
        "finance,reports,purchasing,suppliers,dash,reports_hub,recon,sales_log,hr",
    })[r] || "dash",
};

const SalesService = {
  process: (d, u) => {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const id = "INV-" + Date.now();
    const dt = d.manualDate
      ? d.manualDate
      : Utilities.formatDate(
          new Date(),
          APP_CONFIG.TIMEZONE,
          "yyyy-MM-dd HH:mm",
        );

    // Save to Sales Sheet
    ss.getSheetByName("Sales").appendRow([
      id,
      dt,
      d.total,
      JSON.stringify(d.cart),
      u.name,
      "Completed",
      d.shiftId,
      JSON.stringify(d.payments),
      d.customer || "Guest",
      d.orderType || "Walk-in",
      d.discount || 0, // Column 11: Discount
    ]);

    // Auto-save to Orders for KDS/Tracking
    ss.getSheetByName("Orders").appendRow([
      id,
      dt,
      "Now",
      d.orderType,
      "-",
      d.cart.map((i) => `${i.name} x${i.qty}`).join("\n"),
      d.total,
      0,
      d.total,
      "Pending",
      "Terminal 1",
      "POS",
      "Paid",
    ]);

    this.updateStock(d.cart, -1);
    AdminService.logAction(u.name, "SALE", `INV: ${id} | Total: ${d.total}`);
    return { status: "success", txnId: id, date: dt };
  },

  /**
   * 📅 Bulk Add Historical DSR for Data Mining (Months 1 & 2)
   */
  addHistoricalDSR: function (d, u) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName("Sales");
    const timestamp = d.date + " 22:00";

    // 1. Add Direct Sales (Walk-in/To Go)
    if (d.directAmount > 0) {
      sh.appendRow([
        "HIST-D-" + Date.now(),
        timestamp,
        d.directAmount,
        "[]",
        u.name,
        "Walk-in",
        "Cash",
        d.directAmount,
        0,
        "DSR_Import_Direct",
      ]);
    }

    // 2. Add Delivery/Aggregator Sales (Talabat, etc)
    if (d.deliveryAmount > 0) {
      sh.appendRow([
        "HIST-E-" + Date.now(),
        timestamp,
        d.deliveryAmount,
        "[]",
        u.name,
        "Delivery",
        "Bank",
        d.deliveryAmount,
        0,
        "DSR_Import_Delivery",
      ]);
    }

    AdminService.logAction(
      u.name,
      "DSR_IMPORT",
      `Date: ${d.date} | Direct: ${d.directAmount} | Delivery: ${d.deliveryAmount}`,
    );
    return { status: "success" };
  },

  /**
   * 📝 Save Detailed DSR Entry
   */
  saveDSR: function (d, u) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sh = ss.getSheetByName("DSR_Logs");
    if (!sh) {
      sh = ss.insertSheet("DSR_Logs");
      sh.appendRow([
        "ID",
        "Date",
        "Branch",
        "Morning_Sales",
        "Morning_Count",
        "Night_Sales",
        "Night_Count",
        "Delivery_Sales",
        "Delivery_Count",
        "Talabat_Sales",
        "Talabat_Count",
        "Total_Sales",
        "Total_Count",
        "Created_By",
      ]);
    }

    const totalSales =
      d.morningSales + d.nightSales + d.deliverySales + d.talabatSales;
    const totalCount =
      d.morningCount + d.nightCount + d.deliveryCount + d.talabatCount;
    const id = "DSR-" + Date.now();

    sh.appendRow([
      id,
      d.date,
      d.branch,
      d.morningSales,
      d.morningCount,
      d.nightSales,
      d.nightCount,
      d.deliverySales,
      d.deliveryCount,
      d.talabatSales,
      d.talabatCount,
      totalSales,
      totalCount,
      u.name,
    ]);

    // Also sync to main Sales for AI forecasting
    SalesService.addHistoricalDSR(
      {
        date: d.date,
        directAmount: d.morningSales + d.nightSales,
        deliveryAmount: d.deliverySales + d.talabatSales,
      },
      u,
    );

    return { status: "success", id: id };
  },

  /**
   * 📅 Fetch DSR Logs for specific month
   */
  getDSRLogs: function (d) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName("DSR_Logs");
    if (!sh) return { status: "success", data: [] };

    const data = sh.getDataRange().getValues();
    const monthFilter = d.month; // "YYYY-MM"
    const results = [];

    for (let i = 1; i < data.length; i++) {
      const rowDate = data[i][1]; // Date in YYYY-MM-DD
      if (rowDate.startsWith(monthFilter)) {
        const dObj = new Date(rowDate);
        results.push({
          id: data[i][0],
          date: rowDate,
          day: dObj.toLocaleDateString("en-US", { weekday: "short" }),
          branch: data[i][2],
          morningSales: data[i][3],
          morningCount: data[i][4],
          nightSales: data[i][5],
          nightCount: data[i][6],
          deliveryTotal: data[i][7] + data[i][9], // Delivery + Talabat
          totalSales: data[i][11],
          totalCount: data[i][12],
        });
      }
    }
    // Sort by date desc
    results.sort((a, b) => b.date.localeCompare(a.date));
    return { status: "success", data: results };
  },
  refund: (d, u) => {
    const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sales");
    const v = sh.getDataRange().getValues();
    for (let i = 1; i < v.length; i++) {
      if (v[i][0] === d.txnId && v[i][5] !== "Refunded") {
        sh.getRange(i + 1, 6).setValue("Refunded"); // Status
        const cart = JSON.parse(v[i][3]);
        this.updateStock(cart, 1); // Reverse Stock
        AdminService.logAction(u.name, "REFUND", `TXN: ${d.txnId}`);
        return { status: "success" };
      }
    }
    throw new Error(
      "لا يمكن إ تمام المرتجع: العملية غير موجودة أو تم استردادها سابقاً",
    );
  },
  updateStock: (cart, factor) => {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const ish = ss.getSheetByName("Items");
    const rsh = ss.getSheetByName("Recipes");
    const iv = ish.getDataRange().getValues();
    const rv = rsh ? rsh.getDataRange().getValues() : [];

    const reduce = (name, code, q) => {
      for (let i = 1; i < iv.length; i++) {
        if (iv[i][2] === code || iv[i][3] === name) {
          const cur = Number(iv[i][7]) || 0;
          ish.getRange(i + 1, 8).setValue(cur + q * factor);
          return true;
        }
      }
      return false;
    };

    cart.forEach((c) => {
      // 1. Handle BYO (Customized items)
      if (c.byo && c.details) {
        Object.values(c.details)
          .flat()
          .forEach((ing) => {
            reduce(ing.name, ing.code, Number(c.qty) || 1);
          });
      }

      // 2. Handle Recipes (Explode)
      const recipe = rv.find((r) => r[1] === c.name);
      if (recipe) {
        try {
          const ingredients = JSON.parse(recipe[2]);
          ingredients.forEach((ing) => {
            reduce(
              ing.name,
              null,
              (Number(ing.qty) || 0) * (Number(c.qty) || 1),
            );
          });
        } catch (e) {}
      }

      // 3. Direct stock reduction if it's a simple item or the base product
      if (!recipe) {
        reduce(c.name, c.id, Number(c.qty) || 1);
      }
    });
  },
  delete: function (d, u) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const shSales = ss.getSheetByName("Sales");
    const shOrders = ss.getSheetByName("Orders");

    // 1. Revert Stock if needed
    const vSales = shSales.getDataRange().getValues();
    for (let i = 1; i < vSales.length; i++) {
      if (vSales[i][0] === d.id) {
        const cart = JSON.parse(vSales[i][3] || "[]");
        this.updateStock(cart, 1); // Return items to stock
        shSales.deleteRow(i + 1);
        break;
      }
    }

    // 2. Clear from Orders
    const vOrders = shOrders.getDataRange().getValues();
    for (let i = 1; i < vOrders.length; i++) {
      if (vOrders[i][0] === d.id) {
        shOrders.deleteRow(i + 1);
        break;
      }
    }

    AdminService.logAction(u.name, "DELETE_SALE", `ID: ${d.id}`);
    return { status: "success" };
  },
};

const AIService = {
  ask: function (d, u) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "PASTE_YOUR_GEMINI_API_KEY_HERE") {
      throw new Error(
        "Gemini API Key is not configured. Please set it in syncSecretsFromEnv.",
      );
    }

    const context = this.buildContext();
    const prompt = `You are the AI Strategic Advisor for ERP-EZEM, a retail/POS system.
Review the following business data and answer the user question briefly and professionally.
Support both Arabic and English based on the user's input.

BUSINESS CONTEXT:
${JSON.stringify(context, null, 2)}

USER QUESTION:
${d.prompt}

Guidelines:
1. Be concise (max 3-4 sentences).
2. Proactively suggest improvements if you see bad trends (e.g. high waste).
3. Always use the user's name: ${u.name}.
4. Return your response in plain text without markdown if possible for better UI display.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const payload = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    };

    const options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    };

    const res = UrlFetchApp.fetch(url, options);
    const json = JSON.parse(res.getContentText());

    if (res.getResponseCode() !== 200) {
      throw new Error(
        "Gemini API Error: " +
          (json.error ? json.error.message : res.getContentText()),
      );
    }

    const aiText = json.candidates[0].content.parts[0].text;
    AdminService.logAction(u.name, "AI_QUERY", `Prompt: ${d.prompt}`);

    return { status: "success", response: aiText };
  },

  buildContext: function () {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const db = loadAllData({ name: "AI_SYSTEM" }); // Get fresh snapshot

    // Core summary for context
    return {
      totalSalesPeriod: db.Sales.reduce(
        (s, r) => s + (parseFloat(r[2]) || 0),
        0,
      ),
      orderCount: db.Sales.length,
      topWastedItems: db.intel.topWastedItems,
      lowStockItems: db.lowStock,
      recentLogs: db.System_Logs.slice(-10),
    };
  },
};

const InventoryService = {
  add: (d) => {
    const sheetName = d.sheet || "Items";
    if (sheetName === "Menu POS") {
      SpreadsheetApp.getActiveSpreadsheet()
        .getSheetByName("Menu POS")
        .appendRow([
          d.group || "Main",
          d.category || "General",
          d.code,
          d.name,
          d.price || 0,
          d.cost || 0,
          d.recipeId || d.code,
          d.type || "Ready to Sell",
          d.status || "Active",
        ]);
    } else {
      SpreadsheetApp.getActiveSpreadsheet()
        .getSheetByName("Items")
        .appendRow([
          d.group,
          d.category,
          d.code,
          d.name,
          d.unit || "Each",
          d.cost || 0,
          d.supplier || "-",
          0, // In Stock
          d.yield || 1,
          d.max || 100,
          d.min || 5,
          "Active",
        ]);
    }
    return { status: "success" };
  },
  saveMovement: (d, u) => {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const msh = ss.getSheetByName("Movements");
    const ish = ss.getSheetByName("Items");
    const iv = ish.getDataRange().getValues();
    d.items.forEach((l) => {
      // Audit: Log when the entry was actually made vs transaction date
      const systemDate = new Date();
      msh.appendRow([
        d.headers.date || systemDate.toISOString().split("T")[0], // Column 1: Date
        d.headers.type, // Column 2: Type
        l.code || "-", // Column 3: Item Code
        l.name, // Column 4: Item Name
        l.qty, // Column 5: Qty
        l.cost, // Column 6: Cost
        l.qty * l.cost, // Column 7: Total
        l.batch || "-", // Column 8: Batch
        l.expiry || "-", // Column 9: Expiry
        d.headers.from || "-", // Column 10: From
        d.headers.to || "-", // Column 11: To
        u.name, // Column 12: User
        d.headers.supp || "-", // Column 13: Supp
        d.headers.ref || "-", // Column 14: Ref
        d.headers.notes || "-", // Column 15: Notes
        d.headers.reason || "-", // Column 16: Reason
        systemDate, // Column 17: Date Temp
      ]);
      for (let i = 1; i < iv.length; i++)
        if (iv[i][2] === l.code || iv[i][3] === l.name) {
          const positiveTypes = [
            "Receiving",
            "Purchasing",
            "Transfer In",
            "وارد",
            "استلام",
          ];
          const negativeTypes = [
            "Waste",
            "Transfer Out",
            "Return",
            "Consumption",
            "هالك",
            "صادر",
            "مرتجع",
            "استهلاك",
          ];

          const act = positiveTypes.includes(d.headers.type)
            ? 1
            : negativeTypes.includes(d.headers.type)
              ? -1
              : 0;

          // Stock update is now handled by the Spreadsheet Formula for better integrity
          // ish.getRange(i + 1, 8).setValue((Number(iv[i][7]) || 0) + l.qty * act);
          ish.getRange(i + 1, 6).setValue(l.cost); // Update Cost
          break;
        }
    });
    return { status: "success" };
  },
  processAudit: function (d, u) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var ish = ss.getSheetByName("Items");
    var rec = ss.getSheetByName("Inventory_Record");
    var iv = ish.getDataRange().getValues();
    const dt = Utilities.formatDate(
      new Date(),
      APP_CONFIG.TIMEZONE,
      "yyyy-MM-dd",
    );
    const tm = Utilities.formatDate(new Date(), APP_CONFIG.TIMEZONE, "HH:mm");

    d.forEach(function (a) {
      // 1. Update Current Stock in Items
      for (var i = 1; i < iv.length; i++) {
        if (iv[i][2] === a.code) {
          ish.getRange(i + 1, 8).setValue(a.phy); // Update In Stock (col 8)

          // 2. Save to Inventory_Record
          rec.appendRow([
            iv[i][0], // Group
            iv[i][1], // Category
            iv[i][2], // Code
            iv[i][3], // Name
            iv[i][4], // Unit
            iv[i][5], // Cost
            a.phy, // Qty (Counted)
            "Main Branch", // TODO: Pass branch from frontend
            dt, // Date Inventory
            dt + " " + tm, // Date temp
            u.name, // User
          ]);

          AdminService.logAction(
            u.name,
            "AUDIT",
            "Item: " + a.name + " Corrected to " + a.phy,
          );
          break;
        }
      }
    });
    return { status: "success" };
  },
};

const HRService = {
  logAttendance: (d, u) => {
    SpreadsheetApp.getActiveSpreadsheet()
      .getSheetByName("Attendance")
      .appendRow([new Date(), d.staffName, d.type, "00:00", "Main", u.name]);
    return { status: "success" };
  },
  saveStaff: (d) => {
    SpreadsheetApp.getActiveSpreadsheet()
      .getSheetByName("Staff")
      .appendRow([
        d.id,
        d.name,
        d.role,
        d.phone || "-",
        d.salary,
        d.joinDate,
        "Active",
      ]);
    return { status: "success" };
  },
};

const ShiftService = {
  open: (d, u) => {
    const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Shifts");
    if (
      sh
        .getDataRange()
        .getValues()
        .some((s) => s[1] === u.name && s[7] === "Open")
    )
      return { status: "success" };
    sh.appendRow([
      "SH-" + Date.now(),
      u.name,
      new Date(),
      d.amount,
      "",
      0,
      0,
      "Open",
    ]);
    return { status: "success" };
  },
  close: (d, u) => {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName("Shifts");
    const v = sh.getDataRange().getValues();
    for (let i = 1; i < v.length; i++)
      if (v[i][1] === u.name && v[i][7] === "Open") {
        const sales = ss
          .getSheetByName("Sales")
          .getDataRange()
          .getValues()
          .filter((s) => s[6] === v[i][0])
          .reduce((a, b) => a + (parseFloat(b[2]) || 0), 0);
        sh.getRange(i + 1, 5).setValue(new Date());
        sh.getRange(i + 1, 6).setValue(d.amount);
        sh.getRange(i + 1, 7).setValue(sales);
        sh.getRange(i + 1, 8).setValue("Closed");
        return { status: "success" };
      }
  },
};

const AdminService = {
  handleUser: (d) => {
    SpreadsheetApp.getActiveSpreadsheet()
      .getSheetByName("Users")
      .appendRow([
        "USR-" + Date.now(),
        d.name,
        d.user,
        d.pass,
        d.role,
        "Active",
        d.perms || "",
      ]);
    return { status: "success" };
  },
  updateRecord: function (d, u) {
    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(d.sheet);
    if (!sh) throw new Error("Sheet not found: " + d.sheet);

    if (d.rowIndex) {
      d.updates.forEach(function (upd) {
        sh.getRange(d.rowIndex, upd.col + 1).setValue(upd.val);
      });
      AdminService.logAction(
        u.name,
        "UPDATE_ROW",
        "Sheet: " + d.sheet + " Row: " + d.rowIndex,
      );
      return { status: "success" };
    }

    var v = sh.getDataRange().getValues();
    var idIdx = d.idIndex || 0;
    for (var i = 1; i < v.length; i++) {
      if (String(v[i][idIdx]) === String(d.id)) {
        d.updates.forEach(function (upd) {
          sh.getRange(i + 1, upd.col + 1).setValue(upd.val);
        });
        return { status: "success" };
      }
    }
    throw new Error("Record not found: " + d.id);
  },
  deleteRecord: function (d, u) {
    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(d.sheet);
    if (!sh) throw new Error("Sheet not found: " + d.sheet);

    // Direct row deletion for records without unique IDs
    if (d.rowIndex) {
      sh.deleteRow(d.rowIndex);
      AdminService.logAction(
        u.name,
        "DELETE_ROW",
        "Sheet: " + d.sheet + " Row: " + d.rowIndex,
      );
      return { status: "success" };
    }

    var v = sh.getDataRange().getValues();
    var idIdx = d.idIndex || 0;
    for (var i = 1; i < v.length; i++) {
      if (String(v[i][idIdx]) === String(d.id)) {
        sh.deleteRow(i + 1);
        AdminService.logAction(
          u.name,
          "DELETE",
          "Sheet: " + d.sheet + " ID: " + d.id,
        );
        return { status: "success" };
      }
    }
    throw new Error("Record not found for deletion");
  },
  addRecord: function (d, u) {
    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(d.sheet);
    if (!sh) throw new Error("Sheet not found: " + d.sheet);
    sh.appendRow(d.data);
    AdminService.logAction(u.name, "ADD_RECORD", "Sheet: " + d.sheet);
    return { status: "success" };
  },
  updateOrderStatus: (d, u) => {
    const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Orders");
    const v = sh.getDataRange().getValues();
    for (let i = 1; i < v.length; i++) {
      if (String(v[i][0]) === String(d.orderId)) {
        sh.getRange(i + 1, 10).setValue(d.status); // Index 9 is Status
        AdminService.logAction(
          u.name,
          "ORDER_STATUS",
          `Order: ${d.orderId} -> ${d.status}`,
        );
        return { status: "success" };
      }
    }
    throw new Error("Order not found");
  },
  saveLocation: function (d, u) {
    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Locations");
    sh.appendRow([
      d.id || "LOC-" + Date.now(),
      d.name,
      d.type || "Store",
      d.notes || "-",
    ]);
    AdminService.logAction(u.name, "ADD_LOCATION", "Location: " + d.name);
    return { status: "success" };
  },
  logAction: function (u, a, d) {
    var s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("System_Logs");
    if (s) s.appendRow([new Date(), u, a, d]);
  },
  saveReconSnapshot: function (d, u) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var ash = ss.getSheetByName("Reconciliation_Archive");

    // Auto-fix headers to exactly match the requested layout
    var newHeaders = [
      "Date",
      "Branch",
      "Code",
      "Item Name",
      "Beg. Inv",
      "Recv",
      "Purch",
      "T-In",
      "T-Out",
      "Waste",
      "Ret",
      "Cons (POS)",
      "Cons (Manual)",
      "Theo. Stock",
      "Yield %",
      "Theo. Stock (Yield)",
      "Actual Count (On Hand)",
      "Variance",
      "Var. Value",
      "User",
    ];
    if (
      ash.getLastColumn() !== 20 ||
      ash.getRange(1, 1).getValue() !== "Date"
    ) {
      ash.clear(); // Clear old format if it exists
      ash
        .getRange(1, 1, 1, 20)
        .setValues([newHeaders])
        .setFontWeight("bold")
        .setBackground("#0f172a")
        .setFontColor("#ffffff");
    }

    var now = Utilities.formatDate(
      new Date(),
      APP_CONFIG.TIMEZONE || "GMT+2",
      "yyyy-MM-dd HH:mm:ss",
    );
    var batch = [];

    var num = function (val) {
      if (val === undefined || val === null || val === "" || isNaN(val))
        return 0;
      return Number(val);
    };

    d.rows.forEach(function (r) {
      batch.push([
        now, // 1 Date
        d.branch || "-", // 2 Branch
        r.code || "-", // 3 Code
        r.name || "-", // 4 Item Name
        num(r.beginning), // 5 Beg. Inv
        num(r.receiving), // 6 Recv
        num(r.purchasing), // 7 Purch
        num(r.trxIn), // 8 T-In
        num(r.trxOut), // 9 T-Out
        num(r.waste), // 10 Waste
        num(r.returns), // 11 Ret
        num(r.posCons), // 12 Cons (POS)
        num(r.manualCons), // 13 Cons (Manual)
        num(r.theoretical), // 14 Theo. Stock
        num(r.yieldVal), // 15 Yield %
        num(r.theoStockYield), // 16 Theo. Stock (Yield)
        num(r.actual), // 17 Actual Count (On Hand)
        num(r.variance), // 18 Variance
        num(r.cost), // 19 Var. Value
        u.name || "System", // 20 User
      ]);
    });

    if (batch.length > 0) {
      ash
        .getRange(ash.getLastRow() + 1, 1, batch.length, batch[0].length)
        .setValues(batch);
    }

    return { status: "success" };
  },
  wipeData: function (d, u) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetsToClear = [
      "Sales",
      "Movements",
      "Orders",
      "System_Logs",
      "Shifts",
      "Expenses",
      "Reconciliation_Archive",
    ];

    sheetsToClear.forEach((name) => {
      const sh = ss.getSheetByName(name);
      if (sh && sh.getLastRow() > 1) {
        sh.deleteRows(2, sh.getLastRow() - 1);
      }
    });

    // Reset Item Stocks to 0
    const ish = ss.getSheetByName("Items");
    if (ish && ish.getLastRow() > 1) {
      const last = ish.getLastRow();
      ish.getRange(2, 8, last - 1, 1).setValue(0); // Column 8 = In Stock (index 7)
    }

    AdminService.logAction(
      u.name,
      "SYSTEM_RESET",
      "All transactional data wiped for production",
    );
    return { status: "success" };
  },
  migrateMovements: function () {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const ish = ss.getSheetByName("Items");
    const msh = ss.getSheetByName("Movements");
    if (!ish || !msh) return { status: "error", message: "Sheets missing" };

    const movementRows = msh.getLastRow();
    if (movementRows < 2) return { status: "success", count: 0 };

    const range = msh.getRange(1, 1, movementRows, msh.getLastColumn());
    const data = range.getValues();
    const headers = data[0];

    if (headers[2] !== "Item Code" || headers[3] !== "Item Name") {
      const newData = data.map((row, idx) => {
        if (idx === 0)
          return [
            "Date",
            "Type",
            "Item Code",
            "Item Name",
            "Qty",
            "Cost",
            "Total",
            "Batch",
            "Expiry",
            "From",
            "To",
            "User",
            "Supp",
            "Ref",
            "Notes",
            "Reason",
            "Date Temp",
          ];
        return [
          row[0] || "",
          row[1] || "",
          row[10] || "-",
          row[9] || "-",
          row[11] || 0,
          row[12] || 0,
          row[13] || 0,
          row[14] || "-",
          row[15] || "-",
          row[2] || "-",
          row[3] || "-",
          row[8] || "-",
          row[4] || "-",
          row[5] || "-",
          row[6] || "-",
          row[7] || "-",
          row[16] || "",
        ];
      });
      msh.getRange(1, 1, movementRows, 17).setValues(newData);
    }

    const finalMovementRows = msh.getLastRow();
    if (finalMovementRows > 1) {
      msh
        .getRange(2, 3, finalMovementRows - 1, 1)
        .setFormula(
          '=IFERROR(VLOOKUP(D2, {Items!$D:$D, Items!$C:$C}, 2, 0), "-")',
        );
    }

    const itemRows = ish.getLastRow();
    if (itemRows > 1) {
      const stockFormula = `
        =IF(ISBLANK($C2), "", 
          SUMIFS(Movements!$E:$E, Movements!$C:$C, $C2, Movements!$B:$B, "Receiving") + 
          SUMIFS(Movements!$E:$E, Movements!$C:$C, $C2, Movements!$B:$B, "Purchasing") + 
          SUMIFS(Movements!$E:$E, Movements!$C:$C, $C2, Movements!$B:$B, "Transfer In") + 
          SUMIFS(Movements!$E:$E, Movements!$C:$C, $C2, Movements!$B:$B, "وارد") + 
          SUMIFS(Movements!$E:$E, Movements!$C:$C, $C2, Movements!$B:$B, "استلام") - 
          SUMIFS(Movements!$E:$E, Movements!$C:$C, $C2, Movements!$B:$B, "Waste") - 
          SUMIFS(Movements!$E:$E, Movements!$C:$C, $C2, Movements!$B:$B, "Transfer Out") - 
          SUMIFS(Movements!$E:$E, Movements!$C:$C, $C2, Movements!$B:$B, "Return") - 
          SUMIFS(Movements!$E:$E, Movements!$C:$C, $C2, Movements!$B:$B, "هالك") - 
          SUMIFS(Movements!$E:$E, Movements!$C:$C, $C2, Movements!$B:$B, "صادر") - 
          SUMIFS(Movements!$E:$E, Movements!$C:$C, $C2, Movements!$B:$B, "مرتجع")
        )`.replace(/\n/g, "");
      ish.getRange(2, 8, itemRows - 1, 1).setFormula(stockFormula);
    }

    return { status: "success", count: finalMovementRows - 1 };
  },
};

const FinanceService = {
  save: function (d, u) {
    SpreadsheetApp.getActiveSpreadsheet()
      .getSheetByName("Expenses")
      .appendRow([new Date(), d.item, d.amount, d.reason, "Market", u.name]);
    return { status: "success" };
  },
};

const TelegramService = {
  get ENABLED() {
    return (
      (PropertiesService.getScriptProperties().getProperty(
        "TELEGRAM_ENABLED",
      ) || "false") === "true"
    );
  },
  send: function (msg) {
    if (!this.ENABLED) {
      Logger.log("📵 Telegram disabled — skipped: " + msg.substring(0, 60));
      return {
        status: "error",
        message: "نظام التنبيهات معطل (Disabled). يرجى تفعيله من الإعدادات.",
      };
    }

    var token = (
      PropertiesService.getScriptProperties().getProperty("TELEGRAM_TOKEN") ||
      ""
    ).trim();
    var chatId = (
      PropertiesService.getScriptProperties().getProperty("TELEGRAM_CHAT_ID") ||
      ""
    ).trim();

    if (!token || !chatId) {
      Logger.log("Telegram Error: Missing Token or Chat ID");
      return {
        status: "error",
        message: "بيانات الربط ناقصة (Missing Token/ChatID)",
      };
    }

    var url = "https://api.telegram.org/bot" + token + "/sendMessage";
    var payload = {
      chat_id: chatId,
      text: "🚨 *EZEM PRO ALERT*\n\n" + msg,
      parse_mode: "Markdown",
    };

    try {
      var res = UrlFetchApp.fetch(url, {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify(payload),
        muteHttpExceptions: true,
      });

      var responseCode = res.getResponseCode();
      var responseText = res.getContentText();

      if (responseCode === 200) {
        return { status: "success" };
      } else {
        Logger.log("Telegram API Error: " + responseText);
        return { status: "error", message: "خطأ من تيليجرام: " + responseText };
      }
    } catch (e) {
      Logger.log("Telegram Network Error: " + e.toString());
      return {
        status: "error",
        message: "فشل الاتصال بخوادم تيليجرام: " + e.toString(),
      };
    }
  },
  getUpdates: function () {
    var token = (
      PropertiesService.getScriptProperties().getProperty("TELEGRAM_TOKEN") ||
      ""
    ).trim();
    if (!token) return { status: "error", message: "التوكن غير موجود" };

    var url =
      "https://api.telegram.org/bot" + token + "/getUpdates?limit=5&offset=-5";
    try {
      var res = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
      var data = JSON.parse(res.getContentText());
      if (data.ok && data.result.length > 0) {
        var last = data.result[data.result.length - 1];
        if (last.message) {
          return {
            status: "success",
            chatId: last.message.chat.id,
            name: last.message.from.first_name || "Unknown",
          };
        }
      }
      return {
        status: "error",
        message: "لم يتم العثور على رسائل حديثة. أرسل رسالة للبوت أولاً.",
      };
    } catch (e) {
      return { status: "error", message: e.toString() };
    }
  },
  checkLowStock: function () {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var items = ss.getSheetByName("Items").getDataRange().getValues();
    var lowItems = [];
    for (var i = 1; i < items.length; i++) {
      var stock = Number(items[i][12]) || 0;
      var reorder = Number(items[i][8]) || 5; // Default Reorder level
      if (stock <= reorder) {
        lowItems.push("- " + items[i][3] + ": " + stock + " " + items[i][5]);
      }
    }
    if (lowItems.length > 0) {
      this.send(
        "⚠️ *Low Stock Warning*\nThe following items have reached reorder levels:\n\n" +
          lowItems.join("\n"),
      );
    }
  },
};
const ProductionService = {
  saveRecipe: (d, u) => {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const recipeId = "RE-" + Date.now();

    // Save to Recipes Sheet
    ss.getSheetByName("Recipes").appendRow([
      recipeId,
      d.name,
      JSON.stringify(d.ingredients),
      d.totalCost,
      u.name,
      d.price,
    ]);

    // SYNC TO MENU POS
    const menuSheet = ss.getSheetByName("Menu POS");
    const menuData = menuSheet.getDataRange().getValues();
    let foundRow = -1;

    for (let i = 1; i < menuData.length; i++) {
      if (menuData[i][3] === d.name) {
        // Match by Name
        foundRow = i + 1;
        break;
      }
    }

    const menuRow = [
      d.group || "Prepared",
      d.category || "General",
      d.code || recipeId,
      d.name,
      d.price,
      d.totalCost,
      recipeId,
      d.type || "Recipe",
      "Active",
    ];

    if (foundRow > 0) {
      menuSheet.getRange(foundRow, 1, 1, menuRow.length).setValues([menuRow]);
    } else {
      menuSheet.appendRow(menuRow);
    }

    return { status: "success", recipeId: recipeId };
  },
};

const ReportService = {
  get: function (d) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    const range = { from: d.dateFrom, to: d.dateTo };

    if (d.reportId === "daily_sales")
      return ReportService.dailySales(ss, range);
    if (d.reportId === "inv_levels") return ReportService.invLevels(ss, range);
    if (d.reportId === "item_sales" || d.reportId === "sales_by_item")
      return ReportService.itemSales(ss, range);
    if (d.reportId === "session_summary")
      return ReportService.sessionSummary(ss, d.shiftId, range);
    if (d.reportId === "consumption_date")
      return ReportService.consumptionLog(ss, range);
    if (d.reportId === "item_sales_cons")
      return ReportService.salesCons(ss, range);
    if (d.reportId === "onspot_cons")
      return ReportService.onspotCons(ss, range);
    if (d.reportId === "order_tracking")
      return ReportService.orderTracking(ss, range);
    if (d.reportId === "ar_pm") return ReportService.paymentMethods(ss, range);
    if (d.reportId === "talabat_report")
      return ReportService.talabatSales(ss, range);
    if (d.reportId === "delivery_charge")
      return ReportService.deliveryAnalysis(ss, range);
    if (d.reportId === "item_profitability")
      return ReportService.getItemProfitability(range);
    if (d.reportId === "waste_intel") return ReportService.getWasteIntel(range);
    if (d.reportId === "moves_analysis")
      return ReportService.getMovesAnalysis(range, d.filters);

    // Advanced Movement Reports
    if (d.reportId === "mvmt_purchasing")
      return ReportService.getMovesAnalysis(range, { type: "Purchasing" });
    if (d.reportId === "mvmt_receiving")
      return ReportService.getMovesAnalysis(range, { type: "Receiving" });
    if (d.reportId === "mvmt_waste")
      return ReportService.getMovesAnalysis(range, { type: "Waste" });
    if (d.reportId === "mvmt_transfer")
      return ReportService.getMovesAnalysis(range, { type: "Transfer" });
    if (d.reportId === "mvmt_return")
      return ReportService.getMovesAnalysis(range, { type: "Return" });
    if (d.reportId === "mvmt_beginning")
      return ReportService.getMovesAnalysis(range, {
        type: "Beginning Inventory",
      });
    if (d.reportId === "mvmt_onhand")
      return ReportService.getMovesAnalysis(range, { type: "On Hand" });

    throw new Error("Report definition missing for: " + d.reportId);
  },

  getMovesAnalysis: function (range, filters = {}) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const mvmts = ss
      .getSheetByName("Movements")
      .getDataRange()
      .getValues()
      .slice(1);

    const filtered = mvmts.filter((m) => {
      // Date is in column 0 (index 0)
      const isDate = ReportService.isBetween(m[0], range);
      if (!isDate) return false;

      // Type is in index 1
      const typeMatch = filters.type
        ? String(m[1]).toLowerCase() === filters.type.toLowerCase()
        : true;

      // Item Name is in index 3
      const itemMatch = filters.item
        ? String(m[3]).toLowerCase().includes(filters.item.toLowerCase())
        : true;

      // Reason is in index 15
      const reasonMatch = filters.reason
        ? String(m[15]).toLowerCase().includes(filters.reason.toLowerCase())
        : true;

      return typeMatch && itemMatch && reasonMatch;
    });

    return {
      status: "success",
      data: filtered.map((m) => ({
        id: m[13], // Ref
        type: m[1],
        date: m[0],
        item: m[3],
        code: m[2],
        qty: m[4],
        unit: "",
        user: m[11],
        reason: m[15],
        from: m[9],
        to: m[10],
        cost: m[5],
        total: m[6],
        batch: `${m[7]} / ${m[8]}`, // Batch / Expiry
      })),
    };
  },

  isBetween: function (val, range) {
    if (!range.from || !range.to) return true;

    function toISO(v) {
      if (!v) return "";
      if (v instanceof Date)
        return Utilities.formatDate(v, "GMT+2", "yyyy-MM-dd");
      if (typeof v === "string") {
        const parts = v.split(" ")[0].split(/[-/]/);
        if (parts.length === 3) {
          // Check if it's DD/MM/YYYY or YYYY-MM-DD
          if (parts[0].length === 4) return parts.join("-");
          if (parts[2].length === 4)
            return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
        }
        return v.split(" ")[0];
      }
      return String(v);
    }

    const d = toISO(val);
    const f = toISO(range.from);
    const t = toISO(range.to);

    return d >= f && d <= t;
  },

  getItemProfitability: function (range) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sales = ss
      .getSheetByName("Sales")
      .getDataRange()
      .getValues()
      .slice(1);
    const result = {};
    sales.forEach((s) => {
      if (!ReportService.isBetween(s[1], range)) return;
      try {
        const cart = JSON.parse(s[3] || "[]");
        cart.forEach((item) => {
          if (!result[item.name])
            result[item.name] = { qty: 0, revenue: 0, cost: 0 };
          result[item.name].qty += Number(item.qty) || 0;
          result[item.name].revenue +=
            (Number(item.qty) || 0) * (Number(item.price) || 0);
          result[item.name].cost +=
            (Number(item.qty) || 0) * (Number(item.cost) || 0);
        });
      } catch (e) {}
    });
    return { status: "success", data: result };
  },

  getWasteIntel: function (range) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const mvmts = ss
      .getSheetByName("Movements")
      .getDataRange()
      .getValues()
      .slice(1);
    const waste = mvmts.filter(
      (m) => m[1] === "Waste" && ReportService.isBetween(m[2], range),
    );
    const byReason = {};
    waste.forEach((m) => {
      const reason = m[7] || "Unknown";
      byReason[reason] = (byReason[reason] || 0) + (Number(m[12]) || 0);
    });
    return { status: "success", data: byReason };
  },

  getPnL: function (d) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var from = d.from || new Date().toISOString().split("T")[0];
    var to = d.to || new Date().toISOString().split("T")[0];

    // 1. Get Revenue
    var sales = ss.getSheetByName("Sales").getDataRange().getValues();
    var revenue = 0;
    var cogs = 0;
    for (var i = 1; i < sales.length; i++) {
      var date = String(sales[i][1]);
      if (date >= from && date <= to + " Z") {
        revenue += Number(sales[i][2]) || 0;
        // Calculate COGS if recipes are linked
        try {
          var items = JSON.parse(sales[i][3]);
          items.forEach((it) => {
            cogs += (Number(it.cost) || 0) * (Number(it.qty) || 0);
          });
        } catch (e) {}
      }
    }

    // 2. Get Expenses
    var expenses = ss.getSheetByName("Expenses").getDataRange().getValues();
    var totalExpenses = 0;
    for (var j = 1; j < expenses.length; j++) {
      var expDate = Utilities.formatDate(
        new Date(expenses[j][0]),
        "GMT+2",
        "yyyy-MM-dd",
      );
      if (expDate >= from && expDate <= to) {
        totalExpenses += Number(expenses[j][2]) || 0;
      }
    }

    var grossProfit = revenue - cogs;
    var netProfit = grossProfit - totalExpenses;

    return {
      status: "success",
      data: {
        revenue: revenue,
        cogs: cogs,
        grossProfit: grossProfit,
        expenses: totalExpenses,
        netProfit: netProfit,
        from: from,
        to: to,
      },
    };
  },

  consumptionLog: function (ss, range) {
    var moves = ss.getSheetByName("Movements").getDataRange().getValues();
    var filtered = moves
      .slice(1)
      .filter((m) => ReportService.isBetween(m[2], range))
      .reverse();
    return { status: "success", data: filtered.slice(0, 100) };
  },

  salesCons: function (ss, range) {
    return ReportService.itemSales(ss, range);
  },

  dailySales: function (ss, range) {
    var sales = ss.getSheetByName("Sales").getDataRange().getValues();
    var total = 0;
    var count = 0;
    for (var i = 1; i < sales.length; i++) {
      if (ReportService.isBetween(sales[i][1], range)) {
        total += Number(sales[i][2]) || 0;
        count++;
      }
    }
    return {
      status: "success",
      data: { total: total, count: count, from: range.from, to: range.to },
    };
  },

  invLevels: function (ss) {
    var items = ss.getSheetByName("Items").getDataRange().getValues();
    var totalValue = 0;
    var data = [];
    for (var i = 1; i < items.length; i++) {
      var stock = Number(items[i][12]) || 0;
      var cost = Number(items[i][6]) || 0;
      var val = stock * cost;
      totalValue += val;
      data.push({
        name: items[i][3],
        stock: stock,
        unit: items[i][5],
        value: val,
      });
    }
    return { status: "success", data: { items: data, totalValue: totalValue } };
  },

  itemSales: function (ss, range) {
    var sales = ss.getSheetByName("Sales").getDataRange().getValues();
    var stats = {};
    for (var i = 1; i < sales.length; i++) {
      if (!ReportService.isBetween(sales[i][1], range)) continue;
      try {
        var items = JSON.parse(sales[i][3]);
        for (var j = 0; j < items.length; j++) {
          var it = items[j];
          stats[it.name] = (stats[it.name] || 0) + it.qty;
        }
      } catch (e) {}
    }
    return { status: "success", data: stats };
  },

  sessionSummary: function (ss, shiftId, range) {
    var sales = ss.getSheetByName("Sales").getDataRange().getValues();
    var total = 0,
      count = 0,
      discount = 0;
    var byMethod = {},
      byCat = {};

    for (var i = 1; i < sales.length; i++) {
      const matchShift = shiftId
        ? String(sales[i][6]) === String(shiftId)
        : true;
      if (matchShift && ReportService.isBetween(sales[i][1], range)) {
        total += Number(sales[i][2]) || 0;
        discount += Number(sales[i][10]) || 0;
        count++;

        try {
          var pays = JSON.parse(sales[i][7] || "{}");
          Object.entries(pays).forEach(([method, val]) => {
            byMethod[method] = (byMethod[method] || 0) + (Number(val) || 0);
          });

          var cart = JSON.parse(sales[i][3] || "[]");
          cart.forEach((item) => {
            byCat[item.category || "Other"] =
              (byCat[item.category || "Other"] || 0) + (Number(item.qty) || 0);
          });
        } catch (e) {}
      }
    }
    return {
      status: "success",
      data: {
        total: total,
        orders: count,
        methods: byMethod,
        categories: byCat,
        discount: discount,
      },
    };
  },

  onspotCons: function (ss, range) {
    var moves = ss.getSheetByName("Movements").getDataRange().getValues();
    var wastage = [];
    for (var i = 1; i < moves.length; i++) {
      if (!ReportService.isBetween(moves[i][2], range)) continue;
      if (["Wastage", "Damaged", "OnSpot"].indexOf(moves[i][1]) !== -1)
        wastage.push(moves[i]);
    }
    return { status: "success", data: wastage };
  },

  orderTracking: function (ss, range) {
    var orders = ss.getSheetByName("Orders").getDataRange().getValues();
    var filtered = orders
      .slice(1)
      .filter((o) => ReportService.isBetween(o[1], range));
    return { status: "success", data: filtered.reverse() };
  },

  paymentMethods: function (ss, range) {
    var sales = ss.getSheetByName("Sales").getDataRange().getValues();
    var stats = { Cash: 0, Bank: 0, Talabat: 0, Etisalat: 0, Others: 0 };
    for (var i = 1; i < sales.length; i++) {
      if (!ReportService.isBetween(sales[i][1], range)) continue;
      try {
        var pays = JSON.parse(sales[i][7] || "{}");
        Object.entries(pays).forEach(([method, val]) => {
          if (stats[method] !== undefined) stats[method] += Number(val) || 0;
          else stats.Others += Number(val) || 0;
        });
      } catch (e) {}
    }
    return { status: "success", data: stats };
  },

  talabatSales: function (ss, range) {
    var sales = ss.getSheetByName("Sales").getDataRange().getValues();
    var talabat = [];
    for (var i = 1; i < sales.length; i++) {
      if (!ReportService.isBetween(sales[i][1], range)) continue;
      if (
        String(sales[i][8]).indexOf("Talabat") !== -1 ||
        String(sales[i][9]).indexOf("Talabat") !== -1
      ) {
        talabat.push(sales[i]);
      }
    }
    return { status: "success", data: talabat };
  },

  deliveryAnalysis: function (ss, range) {
    var sales = ss.getSheetByName("Sales").getDataRange().getValues();
    var del = 0;
    for (var i = 1; i < sales.length; i++) {
      if (!ReportService.isBetween(sales[i][1], range)) continue;
      if (sales[i][9] === "Delivery") del += Number(sales[i][2]) || 0;
    }
    return { status: "success", data: { total: del } };
  },
};

const AutomationService = {
  save: function (d) {
    var props = PropertiesService.getScriptProperties();
    props.setProperty("AUTO_REPORTS", JSON.stringify(d.reports));
    props.setProperty("AUTO_HOUR", d.hour.toString());

    this.setupTrigger(d.hour);
    return { status: "success" };
  },

  setupTrigger: function (hour) {
    var triggers = ScriptApp.getProjectTriggers();
    triggers.forEach((t) => {
      if (t.getHandlerFunction() === "runScheduledReports")
        ScriptApp.deleteTrigger(t);
    });

    ScriptApp.newTrigger("runScheduledReports")
      .timeBased()
      .everyDays(1)
      .atHour(parseInt(hour))
      .create();
  },
};

/**
 * دالة الجدولة التلقائية - يتم استدعاؤها عبر Google Trigger
 */
function runScheduledReports() {
  if (!TelegramService.ENABLED) return;

  var props = PropertiesService.getScriptProperties();
  var reports = JSON.parse(props.getProperty("AUTO_REPORTS") || "[]");

  if (reports.includes("sales")) {
    var today = new Date().toISOString().split("T")[0];
    var res = ReportService.getPnL({ from: today, to: today });
    if (res.status === "success") {
      var msg =
        "📊 *تقرير المبيعات اليومي*\n" +
        "الإيرادات: " +
        res.data.revenue +
        " EGP\n" +
        "إجمالي المصاريف: " +
        res.data.expenses +
        " EGP\n" +
        "صافي الربح: " +
        res.data.netProfit +
        " EGP";
      TelegramService.send(msg);
    }
  }

  if (reports.includes("stock")) {
    TelegramService.checkLowStock();
  }

  if (reports.includes("intelligence")) {
    var res = IntelligenceService.getAdvancedAnalytics({}, { name: "System" });
    if (res.status === "success") {
      var d = res.data;
      var msg = "🧠 *Intelligence Daily Briefing*\n\n";
      msg +=
        "📉 *Sales Forecast*: " +
        (d.forecast.values[0] || 0) +
        " EGP (Confidence: " +
        d.forecast.confidence +
        "%)\n";
      msg +=
        "📦 *Inventory Risks*: " + d.inventoryRisk.length + " items at risk\n";
      msg += "⚠️ *Anomalies*: " + d.varianceAnomalies.length + " detected\n\n";
      if (d.inventoryRisk.length > 0) {
        msg +=
          "🚨 *Critical Items*:\n" +
          d.inventoryRisk
            .slice(0, 3)
            .map((r) => "• " + r.item + " (" + r.daysLeft + " days)")
            .join("\n");
      }
      TelegramService.send(msg);
    }
  }
}

/**
 * BOH (Back-of-House) Inventory Count Service
 * Saves physical count sessions to BOH_Counts sheet
 */
const BOHService = {
  saveCounts: function (d, u) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Ensure BOH_Counts sheet exists with proper headers
    let sh = ss.getSheetByName("BOH_Counts");
    if (!sh) {
      sh = ss.insertSheet("BOH_Counts");
      sh.getRange(1, 1, 1, 7)
        .setValues([
          [
            "Date",
            "Time",
            "Branch",
            "User",
            "Item Code",
            "Item Name",
            "Actual Qty",
          ],
        ])
        .setFontWeight("bold")
        .setBackground("#1e293b")
        .setFontColor("#ffffff");
      sh.setFrozenRows(1);
      sh.setColumnWidths(1, 7, 150);
    }

    const now = new Date();
    const dateStr = Utilities.formatDate(now, "GMT+2", "yyyy-MM-dd");
    const timeStr = Utilities.formatDate(now, "GMT+2", "HH:mm:ss");
    // Branch = user.branch if set, else role, else username
    const branch = (u && (u.branch || u.role || u.name)) || "Main Branch";
    const userName = u ? u.name : "System";

    // d.items = [{ code, name, qty }, ...]
    const rows = (d.items || []).map((item) => [
      dateStr,
      timeStr,
      branch,
      userName,
      item.code || "",
      item.name || "",
      parseFloat(item.qty) || 0,
    ]);

    if (rows.length > 0) {
      sh.getRange(sh.getLastRow() + 1, 1, rows.length, 7).setValues(rows);
    }

    AdminService.logAction(
      userName,
      "SAVE_BOH_COUNT",
      `Saved ${rows.length} items - Branch: ${branch} - Date: ${dateStr}`,
    );
    return { status: "success", saved: rows.length, date: dateStr, branch };
  },
};

/**
 * 🧠 INTELLIGENCE & PREDICTIVE ANALYTICS SERVICE
 * محرك الذكاء الاصطناعي والتحليلات التنبؤية
 */
const IntelligenceService = {
  getAdvancedAnalytics: function (data, user) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sales = ss
      .getSheetByName("Sales")
      .getDataRange()
      .getValues()
      .slice(1);
    const recon = ss.getSheetByName("Reconciliation_Archive")
      ? ss
          .getSheetByName("Reconciliation_Archive")
          .getDataRange()
          .getValues()
          .slice(1)
      : [];
    const items = ss
      .getSheetByName("Items")
      .getDataRange()
      .getValues()
      .slice(1);
    const targets = ss.getSheetByName("Monthly_Targets")
      ? ss.getSheetByName("Monthly_Targets").getDataRange().getValues().slice(1)
      : [];

    return {
      status: "success",
      data: {
        forecast: this.calculateForecast(sales),
        inventoryRisk: this.calculateInventoryRisk(items, sales),
        varianceAnomalies: this.detectVarianceAnomalies(recon),
        branchClusters: this.clusterBranches(sales, recon),
        topPerformers: this.calculateTopPerformers(sales),
      },
    };
  },

  /**
   * 📉 Sales Forecasting using Exponential Smoothing
   */
  calculateForecast: function (sales) {
    // Group sales by day
    const dailySales = {};
    sales.forEach((s) => {
      const date = String(s[1]).split(" ")[0];
      dailySales[date] = (dailySales[date] || 0) + (parseFloat(s[2]) || 0);
    });

    const dates = Object.keys(dailySales).sort();
    const values = dates.map((d) => dailySales[d]);

    if (values.length < 7) {
      // Mock data if history is too short for demo/new setups
      return {
        labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
        values: [1200, 1500, 1100, 1800, 2200, 2500, 2100],
        confidence: 45,
      };
    }

    // Simple Exponential Smoothing (Alpha = 0.3)
    const alpha = 0.3;
    let forecastVal = values[0];
    for (let i = 1; i < values.length; i++) {
      forecastVal = alpha * values[i] + (1 - alpha) * forecastVal;
    }

    // Predict next 30 days
    const next30 = [];
    const labels = [];
    let lastDate = new Date(dates[dates.length - 1]);

    for (let i = 1; i <= 30; i++) {
      lastDate.setDate(lastDate.getDate() + 1);
      const label = Utilities.formatDate(lastDate, "GMT+2", "yyyy-MM-dd");
      // Basic seasonality adjustment (weekends +15%)
      const day = lastDate.getDay();
      const seasonalFactor = day === 4 || day === 5 ? 1.15 : 1.0;

      next30.push(Math.round(forecastVal * seasonalFactor));
      labels.push(label);
    }

    return {
      labels: labels,
      values: next30,
      confidence: Math.min(95, 60 + values.length / 2),
    };
  },

  /**
   * 📦 Smart Inventory & Stock-out Risk
   */
  calculateInventoryRisk: function (items, sales) {
    const risks = [];
    const consumption = {};
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    sales.forEach((s) => {
      const date = new Date(s[1]);
      if (date >= thirtyDaysAgo) {
        try {
          const cart = JSON.parse(s[3]);
          cart.forEach((item) => {
            consumption[item.name] =
              (consumption[item.name] || 0) + (parseFloat(item.qty) || 0);
          });
        } catch (e) {}
      }
    });

    items.forEach((i) => {
      const name = i[3];
      const stock = parseFloat(i[7]) || 0;
      const min = parseFloat(i[10]) || 0;
      const avgDaily = (consumption[name] || 0) / 30;

      let daysLeft = avgDaily > 0 ? stock / avgDaily : 999;

      if (stock <= min || daysLeft < 10) {
        risks.push({
          item: name,
          stock: stock,
          daysLeft: Math.round(daysLeft),
          status: daysLeft < 3 ? "CRITICAL" : daysLeft < 7 ? "HIGH" : "WARNING",
          reorder: Math.round(avgDaily * 14 + min), // Restock for 2 weeks + safety buffer
        });
      }
    });

    return risks.sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 15);
  },

  /**
   * ⚠️ Variance Risk Detection (Anomalies)
   */
  detectVarianceAnomalies: function (recon) {
    if (!recon || recon.length === 0) return [];

    // Z-Score logic for variance value (Column 16: Var_Value)
    const values = recon.map((r) => Math.abs(parseFloat(r[16]) || 0));
    if (values.length < 5) return [];

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const stdDev =
      Math.sqrt(
        values.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) /
          values.length,
      ) || 1;

    return recon
      .filter((r) => {
        const val = Math.abs(parseFloat(r[16]) || 0);
        return val > mean + 2 * stdDev && val > 50;
      })
      .map((r) => ({
        date: String(r[0]).split("T")[0],
        item: r[2],
        cost: Math.abs(parseFloat(r[16]) || 0).toFixed(0),
        branch: r[17],
        level: "Anomaly",
      }))
      .slice(-10)
      .reverse();
  },

  /**
   * 🏢 Branch Performance Clustering
   */
  clusterBranches: function (sales, recon) {
    const branches = {};
    sales.forEach((s) => {
      const branch = s[4] || "Default";
      if (!branches[branch])
        branches[branch] = { revenue: 0, variance: 0, count: 0 };
      branches[branch].revenue += parseFloat(s[2]) || 0;
    });

    recon.forEach((r) => {
      const branch = r[17] || "Default";
      if (branches[branch]) {
        branches[branch].variance += Math.abs(parseFloat(r[16]) || 0);
        branches[branch].count++;
      }
    });

    return Object.keys(branches).map((name) => {
      const b = branches[name];
      const wasteRate = b.revenue > 0 ? (b.variance / b.revenue) * 100 : 0;

      let tier = "Standard";
      let color = "blue";

      if (b.revenue > 50000 && wasteRate < 3) {
        tier = "Elite (Star)";
        color = "emerald";
      } else if (wasteRate > 10) {
        tier = "High Loss (Risky)";
        color = "rose";
      } else if (b.revenue < 5000) {
        tier = "Low Volume";
        color = "slate";
      }

      return {
        name,
        revenue: Math.round(b.revenue),
        wasteRate: wasteRate.toFixed(1) + "%",
        tier,
        color,
      };
    });
  },

  /**
   * ⭐ Calculate Top Performance Products
   */
  calculateTopPerformers: function (sales) {
    const products = {};
    sales.forEach((s) => {
      try {
        const cart = JSON.parse(s[3] || "[]");
        cart.forEach((c) => {
          if (!products[c.name]) products[c.name] = { qty: 0, rev: 0 };
          products[c.name].qty += parseFloat(c.qty) || 0;
          products[c.name].rev +=
            (parseFloat(c.qty) || 0) *
            (parseFloat(c.price) || parseFloat(s[2]) / cart.length || 0);
        });
      } catch (e) {}
    });

    return Object.keys(products)
      .map((name) => ({
        name,
        qty: products[name].qty,
        revenue: Math.round(products[name].rev),
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  },

  /**
   * ⚡ Cache Service for Data Mining
   */
  syncCache: function () {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const cacheSh = ss.getSheetByName("Analytics_Cache");
    if (!cacheSh) return;

    // Implementation for background aggregation if needed
  },
};

function createResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
