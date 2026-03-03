/**
 * MOVEMENTS MODULE (Inventory Transactions)
 * Precise replication of NEW.25-1.html layout in Premium Light Theme
 */
const Movements = {
  tempItems: [],
  bulkSource: "items",
  bulkCategory: "",

  render() {
    const suppliers = STATE.db.Suppliers || [];
    const items = STATE.db.Items || [];
    const isAr = STATE.lang === "ar";
    const isEn = STATE.lang === "en";

    document.getElementById("main-content").innerHTML = `
            <div class="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-fade-in ${isAr ? "text-right" : "text-left"}" dir="${isAr ? "rtl" : "ltr"}">
                <!-- Transaction Header Form -->
                <div class="xl:col-span-4 space-y-6">
                    <div class="glass-card">
                        <div class="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                            <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                <i class="fa-solid fa-file-invoice"></i>
                            </div>
                            <h3 class="text-lg font-black text-slate-800">${isAr ? "بيانات الحركة (Header)" : "Transaction Header"}</h3>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4 mb-4">
                            <div class="form-group">
                                <label class="nav-label p-0 mb-1">${isAr ? "التاريخ" : "Date"}</label>
                                <input type="date" id="txDate" class="input-premium" value="${new Date().toISOString().split("T")[0]}">
                            </div>
                            <div class="form-group">
                                <label class="nav-label p-0 mb-1">${__("trx_type")}</label>
                                <select id="txType" class="input-premium" onchange="Movements.toggleFields()">
                                    <option value="Beginning Inventory">${__("Beginning Inventory")}</option>
                                    <option value="Receiving">${__("Receiving")}</option>
                                    <option value="Purchasing">${__("Purchasing")}</option>
                                    <option value="Waste">${__("Waste")}</option>
                                    <option value="Transfer Out">${__("Transfer Out")}</option>
                                    <option value="Transfer In">${__("Transfer In")}</option>
                                    <option value="Return">${__("Return")}</option>
                                    <option value="Consumption">${isAr ? 'استهلاك (يدوي)' : 'Consumption (Manual)'}</option>
                                    <option value="On Hand">${isAr ? 'رصيد فعلي (On Hand)' : 'On Hand (Physical Count)'}</option>
                                </select>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4 mb-4">
                            <div class="form-group">
                                <label class="nav-label p-0 mb-1">${isAr ? "من موقع (From)" : "From Location"}</label>
                                <select id="txFrom" class="input-premium select2-init">
                                    <option value="">${isAr ? "اختر الموقع..." : "Select Location..."}</option>
                                    ${(STATE.db.Locations || []).map((l) => `<option value="${l[1]}">${l[1]}</option>`).join("")}
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="nav-label p-0 mb-1">${isAr ? "إلى موقع (To)" : "To Location"}</label>
                                <select id="txTo" class="input-premium select2-init">
                                    <option value="">${isAr ? "اختر الموقع..." : "Select Location..."}</option>
                                    ${(STATE.db.Locations || []).map((l) => `<option value="${l[1]}">${l[1]}</option>`).join("")}
                                </select>
                            </div>
                        </div>

                        <div class="form-group mb-4" id="divSupp" style="display: none;">
                            <label class="nav-label p-0 mb-1">${isAr ? "المورد / الشركة" : "Supplier / Vendor"}</label>
                            <select id="txSupp" class="input-premium select2-init">
                                <option value="">${isAr ? "اختر المورد..." : "Select Supplier..."}</option>
                                ${suppliers.map((s) => `<option value="${s[0]}">${s[0]}</option>`).join("")}
                            </select>
                        </div>

                        <div class="form-group mb-4" id="divReason" style="display: none;">
                            <label class="nav-label p-0 mb-1">${isAr ? "سبب الهالك أو التعديل" : "Waste/Adjustment Reason"}</label>
                            <select id="txReason" class="input-premium">
                                <option value="Expired">${isAr ? "منتهي الصلاحية" : "Expired"}</option>
                                <option value="Damaged">${isAr ? "تالف / كسر" : "Damaged"}</option>
                                <option value="Error">${isAr ? "خطأ إنتاج" : "Production Error"}</option>
                                <option value="Theft">${isAr ? "عناية / جودة" : "Quality Care"}</option>
                                <option value="Conditional Receiving">${isAr ? "استلام مشروط" : "Conditional Receiving"}</option>
                                <option value="Other">${isAr ? "أخرى" : "Other"}</option>
                            </select>
                        </div>

                        <div class="form-group mb-4">
                            <label class="nav-label p-0 mb-1">${isAr ? "رقم المرجع (Invoice/Ref)" : "Reference #"}</label>
                            <input id="txRef" class="input-premium" placeholder="${isAr ? "مثلاً: رقم الفاتورة..." : "Invoice #"}">
                        </div>

                        <div class="form-group mb-6">
                            <label class="nav-label p-0 mb-1">${isAr ? "ملاحظات إضافية" : "Additional Notes"}</label>
                            <textarea id="txNotes" class="input-premium" rows="3" placeholder="..."></textarea>
                        </div>

                        <div class="flex gap-3 mt-2">
                            <button onclick="Movements.preview()" class="flex-1 h-12 rounded-2xl border-2 border-slate-200 bg-white text-slate-600 font-black text-xs flex items-center justify-center gap-2 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                                <i class="fa-solid fa-eye"></i> ${isAr ? "معاينة" : "Preview"}
                            </button>
                            <button onclick="Movements.save()" id="post-tx-btn" class="flex-1 btn btn-primary h-12 rounded-2xl shadow-xl shadow-indigo-200 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                                <i class="fa-solid fa-paper-plane"></i> ${isAr ? "ترحيل" : "Post"}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Line Items Detail -->
                <div class="xl:col-span-8 space-y-6">
                    <div class="glass-card" style="display:flex; flex-direction:column; overflow:hidden;">
                        <div class="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                            <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                <i class="fa-solid fa-list-check"></i>
                            </div>
                            <h3 class="text-lg font-black text-slate-800">${isAr ? "تفاصيل الأصناف (Line Items)" : "Item Details"}</h3>
                        </div>

                        <!-- 1. Standard Entry UI (Single Item) -->
                        <div id="standard-entry-ui">
                            <!-- Add Item Bar -->
                            <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-wrap gap-4 items-end mb-4">
                                <div class="flex-1 min-w-[240px]">
                                    <label class="nav-label p-0 mb-1 text-[10px]">${isAr ? "اختر الصنف من المخزن" : "Select Item from Catalog"}</label>
                                    <select id="txItem" class="input-premium select2-init">
                                        <option value="">${isAr ? "بحث عن صنف..." : "Search for item..."}</option>
                                        <optgroup label="${isAr ? "أصناف المخزن" : "Stock Items"}">
                                            ${items
                                            .map((i) => {
                                                const name = i[3];
                                                const code = i[2];
                                                return `<option value="${name}" data-code="${code}" data-type="item" data-cost="${i[5]}">${name}</option>`;
                                            })
                                            .join("")}
                                        </optgroup>
                                        <optgroup label="${isAr ? "أصناف منيو POS (وصفات)" : "POS Menu (Recipes)"}">
                                            ${(STATE.db.Menu_POS || [])
                                            .map((p) => {
                                                const name = p[3];
                                                const code = p[2];
                                                return `<option value="${name}" data-code="${code}" data-type="pos" data-cost="${p[5]}">${name}</option>`;
                                            })
                                            .join("")}
                                        </optgroup>
                                    </select>
                                </div>
                                <div class="w-24">
                                    <label class="nav-label p-0 mb-1 text-[10px]">${isAr ? "الكمية" : "Qty"}</label>
                                    <input type="number" id="txQty" class="input-premium input-blue-soft text-center font-black" placeholder="0.00">
                                </div>
                                <div class="w-32">
                                    <label class="nav-label p-0 mb-1 text-[10px]">${isAr ? "إجمالي التكلفة" : "Total Cost"}</label>
                                    <input type="number" id="txCost" class="input-premium input-blue-soft text-center font-black text-indigo-600" placeholder="0.00">
                                    <input type="hidden" id="txUnitPrice">
                                </div>

                                <!-- Expiry Logic -->
                                <div id="divItemExpiry" style="display: none;" class="flex gap-4">
                                    <div class="w-32">
                                        <label class="nav-label p-0 mb-1 text-[10px]">${isAr ? "رقم التشغيلة (Batch)" : "Batch #"}</label>
                                        <input type="text" id="txBatch" class="input-premium text-center" placeholder="B-000">
                                    </div>
                                    <div class="w-40">
                                        <label class="nav-label p-0 mb-1 text-[10px]">${isAr ? "تاريخ الانتهاء" : "Expiry Date"}</label>
                                        <input type="date" id="txExpiry" class="input-premium text-center">
                                    </div>
                                </div>

                                <div class="flex flex-wrap gap-2">
                                    <button onclick="Movements.addTempItem()" class="btn btn-primary h-12 px-6 rounded-xl shadow-lg flex items-center gap-2">
                                        <i class="fa-solid fa-plus text-xs"></i> 
                                        <span class="text-xs font-black uppercase">${isAr ? "إضافة" : "Add"}</span>
                                    </button>
                                    <button onclick="Movements.clearInputs()" class="h-12 w-12 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm flex items-center justify-center" title="${isAr ? 'مسح البيانات' : 'Clear Inputs'}">
                                        <i class="fa-solid fa-xmark text-lg"></i>
                                    </button>
                                </div>
                            </div>

                            <!-- Scrollable Table -->
                            <div style="flex:1; overflow-y:auto; max-height:300px; border:1px solid #f1f5f9; border-radius:12px; margin-bottom:0;">
                                <table class="w-full" style="border-collapse:collapse;">
                                    <thead style="position:sticky; top:0; z-index:10; background:#f8fafc; box-shadow:0 2px 6px rgba(0,0,0,0.07);">
                                        <tr>
                                            <th style="padding:10px 14px; font-size:11px; font-weight:800; color:#64748b; text-transform:uppercase; letter-spacing:.05em; border-bottom:1px solid #e2e8f0;">${isAr ? "الكود" : "Code"}</th>
                                            <th class="w-1/3" style="padding:10px 14px; font-size:11px; font-weight:800; color:#64748b; text-transform:uppercase; letter-spacing:.05em; border-bottom:1px solid #e2e8f0;">${isAr ? "اسم الصنف" : "Item Name"}</th>
                                            <th class="text-center" style="padding:10px 14px; font-size:11px; font-weight:800; color:#64748b; text-transform:uppercase; letter-spacing:.05em; border-bottom:1px solid #e2e8f0;">${isAr ? "التشغيلة/الصلاحية" : "Batch/Expiry"}</th>
                                            <th class="text-center" style="padding:10px 14px; font-size:11px; font-weight:800; color:#64748b; text-transform:uppercase; letter-spacing:.05em; border-bottom:1px solid #e2e8f0;">${isAr ? "الكمية" : "Qty"}</th>
                                            <th class="text-center" style="padding:10px 14px; font-size:11px; font-weight:800; color:#94a3b8; text-transform:uppercase; letter-spacing:.05em; border-bottom:1px solid #e2e8f0;">${isAr ? "سعر الوحدة" : "Unit Price"}</th>
                                            <th class="text-center" style="padding:10px 14px; font-size:11px; font-weight:800; color:#64748b; text-transform:uppercase; letter-spacing:.05em; border-bottom:1px solid #e2e8f0;">${isAr ? "الإجمالي" : "Total"}</th>
                                            <th class="text-center" style="padding:10px 14px; font-size:11px; font-weight:800; color:#64748b; text-transform:uppercase; letter-spacing:.05em; border-bottom:1px solid #e2e8f0;">${isAr ? "إجراء" : "Action"}</th>
                                        </tr>
                                    </thead>
                                    <tbody id="txBody" class="divide-y divide-slate-50">
                                        ${this.renderTempItems()}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- 2. Bulk Entry UI (Beginning Inventory) -->
                        <div id="bulk-entry-ui" style="display:none;">
                            <!-- Placeholder: Will be injected via script -->
                        </div>

                        <!-- Sticky Footer Bar: Item Count + Total + Preview + Post -->
                        <div id="txFooterBar" style="display:flex; align-items:center; justify-content:space-between; background:#0f172a; color:#fff; padding:12px 20px; border-radius:0 0 16px 16px; margin-top:0; gap:16px; flex-shrink:0;">
                            <div style="display:flex; align-items:center; gap:10px;">
                                <div style="background:#1e293b; border-radius:10px; padding:6px 14px; display:flex; align-items:center; gap:8px;">
                                    <i class="fa-solid fa-boxes-stacked" style="color:#818cf8; font-size:13px;"></i>
                                    <span style="font-size:11px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:.05em;">${isAr ? "عدد الأصناف" : "Items"}</span>
                                    <span id="txItemCount" style="font-size:16px; font-weight:900; color:#fff;">${this.tempItems.length}</span>
                                </div>
                            </div>
                            <div style="display:flex; align-items:center; gap:12px;">
                                <div style="text-align:${isAr ? "right" : "left"};">
                                    <div style="font-size:9px; font-weight:800; color:#64748b; text-transform:uppercase; letter-spacing:.08em;">${isAr ? "إجمالي قيمة الحركة" : "Total Transaction Value"}</div>
                                    <div id="txTotalDisplay" style="font-size:22px; font-weight:900; color:#34d399; line-height:1.2;">${Utils.formatCurrency(this.calculateTotal())}</div>
                                </div>
                                <button onclick="Movements.preview()" id="preview-tx-btn"
                                    style="height:46px; padding:0 20px; background:#334155; color:#94a3b8; border-radius:12px; border:1.5px solid #475569; font-size:11px; font-weight:900; cursor:pointer; display:flex; align-items:center; gap:8px; transition:all .2s; letter-spacing:.05em; text-transform:uppercase;"
                                    onmouseover="this.style.background='#475569';this.style.color='#fff'" onmouseout="this.style.background='#334155';this.style.color='#94a3b8'">
                                    <i class="fa-solid fa-eye" style="font-size:13px;"></i>
                                    ${isAr ? 'معاينة' : 'Preview'}
                                </button>
                                <button onclick="Movements.save()" id="post-tx-btn"
                                    style="height:46px; padding:0 26px; background:linear-gradient(135deg,#6366f1,#4f46e5); color:#fff; border-radius:12px; border:none; font-size:11px; font-weight:900; cursor:pointer; display:flex; align-items:center; gap:8px; transition:all .2s; box-shadow:0 6px 20px rgba(99,102,241,.4); letter-spacing:.05em; text-transform:uppercase;">
                                    <i class="fa-solid fa-paper-plane" style="font-size:12px;"></i>
                                    ${isAr ? 'ترحيل' : 'Post'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

    setTimeout(() => {
      this.toggleFields();
      const updateCostDisplay = () => {
        const qty = parseFloat($("#txQty").val()) || 0;
        const unitPrice = parseFloat($("#txUnitPrice").val()) || 0;
        $("#txCost").val((qty * unitPrice).toFixed(2));
      };

      $(".select2-init")
        .select2({
          dir: isAr ? "rtl" : "ltr",
          width: "100%",
        })
        .on("change", function () {
          const cost = $(this).find(":selected").data("cost") || 0;
          $("#txUnitPrice").val(cost);
          updateCostDisplay();
          // UX: Auto-focus Qty after selecting item
          if (this.id === "txItem") {
            setTimeout(() => $("#txQty").focus(), 100);
          }
        });

      $("#txQty").on("input", updateCostDisplay);
      $("#txCost").on("input", function () {
        const total = parseFloat($(this).val()) || 0;
        const qty = parseFloat($("#txQty").val()) || 0;
        if (qty > 0) $("#txUnitPrice").val((total / qty).toFixed(4));
      });

      // Enter key to add item
      $("#txQty, #txCost, #txBatch, #txExpiry").on("keypress", function (e) {
        if (e.which === 13) {
          Movements.addTempItem();
        }
      });
    }, 50);
  },

  renderTempItems() {
    if (!this.tempItems.length)
      return `<tr><td colspan="6" class="text-center py-16 text-slate-400 font-bold">${STATE.lang === "ar" ? "ابدأ بإضافة الأصناف أعلاه..." : "Start by adding items above..."}</td></tr>`;

    // Build a map of item names to count occurrences
    const nameCounts = {};
    this.tempItems.forEach(item => {
        nameCounts[item.name] = (nameCounts[item.name] || 0) + 1;
    });
    const seenNames = {};

    return [...this.tempItems]
      .map(
        (item, idx) => {
            const isDuplicate = nameCounts[item.name] > 1;
            seenNames[item.name] = (seenNames[item.name] || 0) + 1;
            const isFirstOccurrence = seenNames[item.name] === 1;
            // Style the 2nd+ occurrences in orange
            const rowStyle = (isDuplicate && !isFirstOccurrence)
                ? 'background: #fff7ed; border-left: 3px solid #f97316;'
                : '';
            const dupBadge = (isDuplicate && !isFirstOccurrence)
                ? `<span style="background:#fff7ed;color:#ea580c;border:1px solid #fdba74;padding:1px 6px;border-radius:6px;font-size:8px;font-weight:900;margin-inline-start:4px;">${STATE.lang === 'ar' ? '⚠ مكرر' : '⚠ DUP'}</span>`
                : '';
            return `
            <tr class="hover:bg-slate-50/50 transition-colors" style="${rowStyle}">
                <td class="font-mono text-[10px] text-indigo-400 font-black">${item.code || '-'}</td>
                <td class="font-bold text-slate-700">
                    ${item.name}${dupBadge}
                    ${item.isRecipe ? `<span class="px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 text-[8px] border border-amber-100 uppercase ml-1">${STATE.lang === 'ar' ? 'وصفة' : 'Recipe'}</span>` : ''}
                </td>
                <td class="text-center">
                    <div class="text-[10px] font-mono text-slate-400">${item.batch || "-"}</div>
                    <div class="text-[9px] font-black text-rose-400">${item.expiry || ""}</div>
                </td>
                <td class="text-center font-mono" style="${isDuplicate && !isFirstOccurrence ? 'color:#ea580c;font-weight:900;' : 'color:#334155;font-weight:700;'}">${item.qty}</td>
                <td class="text-center font-mono text-slate-400 text-[10px]">${Utils.formatCurrency(item.cost)}</td>
                <td class="text-center font-black text-indigo-600">${Utils.formatCurrency(item.qty * item.cost)}</td>
                <td class="text-center">
                    <button onclick="Movements.removeItem(${idx})" class="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all">
                        <i class="fa-solid fa-trash-can text-sm"></i>
                    </button>
                </td>
            </tr>
        `;
        }
      )
      .join("");
    },

    addTempItem() {
        const sel = $('#txItem').find(':selected');
        const type = sel.data('type');
        const code = sel.data('code');
        const nameRaw = $('#txItem').val();
        const name = nameRaw ? String(nameRaw).trim() : '';
        
        let qtyRaw = $('#txQty').val();
        const qty = parseFloat(qtyRaw);
        
        const cost = parseFloat($('#txUnitPrice').val()) || 0;
        const batch = $('#txBatch').val();
        const expiry = $('#txExpiry').val();
        
        const isAr = STATE.lang === 'ar';
        if (!name) return Swal.fire('Error', isAr ? 'يرجى اختيار صنف صحيح' : 'Please select a valid item', 'warning');
        if (isNaN(qty) || qty <= 0) return Swal.fire('Error', isAr ? 'يرجى تحديد كمية صحيحة أكبر من الصفر' : 'Please enter a valid quantity greater than zero', 'warning');

        if (type === 'pos') {
            const recipe = (STATE.db.Recipes || []).find(r => r[1] === name);
            if (recipe) {
                try {
                    const ingredients = JSON.parse(recipe[2]);
                    this.tempItems.unshift({
                        name: name,
                        code: code,
                        qty: qty,
                        cost: ingredients.reduce((s, i) => s + (i.qty * i.cost), 0),
                        batch: batch,
                        expiry: expiry,
                        isRecipe: true,
                        ingredients: ingredients
                    });
                } catch (e) {
                    console.error("Recipe parse error", e);
                    this.tempItems.unshift({ name, code, qty, cost: cost || 0, batch, expiry });
                }
            } else {
                this.tempItems.unshift({ name, code, qty, cost: cost || 0, batch, expiry });
            }
        } else {
            this.tempItems.unshift({ name, code, qty, cost: cost || 0, batch, expiry });
        }

        // --- Duplicate Item Detection ---
        const matches = this.tempItems.filter(i => i.name === name);
        if (matches.length > 1) {
            const isAr2 = STATE.lang === 'ar';
            Utils.toast(
                isAr2
                    ? `⚠️ تنبيه: الصنف "${name}" تم إضافته من قبل (دخل مرتين)`
                    : `⚠️ Warning: "${name}" was already added (duplicate entry)`,
                'warning'
            );
        }

        // Reset fields and auto-open item picker for next entry
        this.clearInputs();
        this.refreshItemsTable();
        
        // UX: Auto-reopen the item selection dropdown
        setTimeout(() => {
            $('#txItem').select2('open');
        }, 100);
    },

    clearInputs() {
        $('#txQty').val('').trigger('input');
        $('#txCost').val('').trigger('input');
        $('#txUnitPrice').val('');
        $('#txBatch').val('');
        $('#txExpiry').val('');
        if ($('#txItem').data('select2')) {
            $('#txItem').val('').trigger('change');
        } else {
            $('#txItem').val('');
        }
    },

  removeItem(idx) {
    this.tempItems.splice(idx, 1);
    this.refreshItemsTable();
  },

  // Lightweight refresh: only updates tbody rows, total and item count — does NOT re-render the full page
  refreshItemsTable() {
    const tbody = document.getElementById("txBody");
    if (tbody) tbody.innerHTML = this.renderTempItems();
    const totalEl = document.getElementById("txTotalDisplay");
    if (totalEl)
      totalEl.textContent = Utils.formatCurrency(this.calculateTotal());
    const countEl = document.getElementById("txItemCount");
    if (countEl) countEl.textContent = this.tempItems.length;
  },

  calculateTotal() {
    return this.tempItems.reduce((sum, item) => sum + item.qty * item.cost, 0);
  },

  renderBulkBeginning() {
    const items = STATE.db.Items || [];
    const posItems = STATE.db.Menu_POS || [];
    const isAr = STATE.lang === 'ar';
    const type = $('#txType').val();

    // Determine columns to show based on movement type
    const expiryTypes = ["Receiving", "Purchasing", "Return", "Waste"];
    const showExpiry = expiryTypes.includes(type);

    // Get unique categories for BOTH sources to populate the dropdown filter properly
    // Or we can just show all categories from both since we filter by source too
    const allCats = [...new Set([...items.map(i => i[1]), ...posItems.map(i => i[1])].filter(Boolean))].sort();

    return `
      <div class="p-4 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center gap-4">
        <div class="flex flex-wrap items-center gap-3">
             <div class="relative w-48">
                <i class="fa-solid fa-search absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-300 text-[10px]"></i>
                <input type="text" id="bulk-search-input" oninput="Movements.filterBulkTable()" placeholder="${isAr ? 'بحث سريع...' : 'Quick search...'}" 
                    class="w-full h-10 ${isAr ? 'pr-9 pl-3' : 'pl-9 pr-3'} bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-indigo-400 transition-all">
            </div>

            <div class="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                <button onclick="Movements.setBulkSource('items')" id="btn-src-items" class="h-8 px-3 rounded-lg text-[10px] font-black transition-all ${this.bulkSource === 'items' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-indigo-600'}">
                    ${isAr ? 'أصناف المخزن' : 'STOCK ITEMS'}
                </button>
                <button onclick="Movements.setBulkSource('pos')" id="btn-src-pos" class="h-8 px-3 rounded-lg text-[10px] font-black transition-all ${this.bulkSource === 'pos' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-indigo-600'}">
                    ${isAr ? 'منيو POS' : 'POS MENU'}
                </button>
            </div>

            <select id="bulk-category-select" onchange="Movements.filterBulkTable()" class="h-10 px-4 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-indigo-400 transition-all min-w-[140px]">
                <option value="">${isAr ? 'جميع الفئات (Category)' : 'All Categories'}</option>
                ${allCats.map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>
            
            <label class="flex items-center gap-2 cursor-pointer bg-white h-10 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all group">
                <input type="checkbox" id="show-only-entered" onchange="Movements.filterBulkTable()" class="w-4 h-4 accent-indigo-600">
                <span class="text-[10px] font-black text-slate-600 group-hover:text-indigo-600 whitespace-nowrap">${isAr ? 'المدخل فقط' : 'Entered Only'}</span>
            </label>
        </div>
      </div>

      <div class="overflow-y-auto max-h-[500px] bulk-scroll-container">
        <table class="w-full text-[11px]" id="bulkInitTable">
          <thead class="sticky top-0 bg-white shadow-sm z-10">
            <tr>
              <th class="p-4 text-start text-slate-400 uppercase font-black tracking-widest border-b border-slate-100">${isAr ? 'الكود' : 'Code'}</th>
              <th class="p-4 text-start text-slate-400 uppercase font-black tracking-widest border-b border-slate-100">${isAr ? 'الصنف' : 'Item'}</th>
              <th class="p-4 text-center text-slate-400 uppercase font-black tracking-widest w-24 border-b border-slate-100">${isAr ? 'الكمية' : 'Qty'}</th>
              ${showExpiry ? `
                <th class="p-4 text-center text-slate-400 uppercase font-black tracking-widest w-24 border-b border-slate-100">${isAr ? 'التشغيلة' : 'Batch'}</th>
                <th class="p-4 text-center text-slate-400 uppercase font-black tracking-widest w-32 border-b border-slate-100">${isAr ? 'الانتهاء' : 'Expiry'}</th>
              ` : ''}
              <th class="p-4 text-center text-slate-400 uppercase font-black tracking-widest w-24 border-b border-slate-100">${isAr ? 'التكلفة' : 'Cost'}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 bg-white">
            <!-- Render Stock Items -->
            ${items.map(item => this.renderBulkRow(item, 'items', showExpiry)).join('')}
            <!-- Render POS Items -->
            ${posItems.map(item => this.renderBulkRow(item, 'pos', showExpiry)).join('')}
          </tbody>
        </table>
      </div>

      <!-- Bulk Footer: Preview + Post -->
      <div style="display:flex; align-items:center; justify-content:space-between; background:#0f172a; padding:12px 20px; border-radius:0 0 20px 20px; gap:16px; flex-wrap:wrap; position:sticky; bottom:0; z-index:10;">
        <div style="display:flex; align-items:center; gap:10px;">
          <div style="background:#1e293b; border-radius:10px; padding:6px 14px; display:flex; align-items:center; gap:8px;">
            <i class="fa-solid fa-boxes-stacked" style="color:#818cf8; font-size:12px;"></i>
            <span style="font-size:10px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:.05em;">${isAr ? 'الأصناف' : 'Items'}</span>
            <span id="bulkItemCount" style="font-size:16px; font-weight:900; color:#fff;">0</span>
          </div>
          <div style="background:#1e293b; border-radius:10px; padding:6px 14px; display:flex; align-items:center; gap:8px;">
            <i class="fa-solid fa-calculator" style="color:#34d399; font-size:12px;"></i>
            <span style="font-size:10px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:.05em;">${isAr ? 'القيمة' : 'Value'}</span>
            <span id="bulkTotalCost" style="font-size:16px; font-weight:900; color:#34d399;">0.00</span>
          </div>
        </div>
        <div style="display:flex; gap:10px;">
          <button onclick="Movements.preview()"
            style="height:44px; padding:0 20px; background:#334155; color:#94a3b8; border-radius:12px; border:1.5px solid #475569; font-size:11px; font-weight:900; cursor:pointer; display:flex; align-items:center; gap:7px; transition:all .2s; text-transform:uppercase; letter-spacing:.04em;"
            onmouseover="this.style.background='#475569';this.style.color='#fff'" onmouseout="this.style.background='#334155';this.style.color='#94a3b8'">
            <i class="fa-solid fa-eye" style="font-size:12px;"></i> ${isAr ? 'معاينة' : 'Preview'}
          </button>
          <button onclick="Movements.save()"
            style="height:44px; padding:0 26px; background:linear-gradient(135deg,#6366f1,#4f46e5); color:#fff; border-radius:12px; border:none; font-size:11px; font-weight:900; cursor:pointer; display:flex; align-items:center; gap:7px; transition:all .2s; box-shadow:0 6px 20px rgba(99,102,241,.4); text-transform:uppercase; letter-spacing:.04em;">
            <i class="fa-solid fa-paper-plane" style="font-size:12px;"></i> ${isAr ? 'ترحيل' : 'Post'}
          </button>
        </div>
      </div>
    `;
  },

  renderBulkRow(item, source, showExpiry) {
      const cat = item[1] || 'General';
      const cost = source === 'pos' ? (item[5] || 0) : (item[5] || 0);
      return `
        <tr class="hover:bg-indigo-50/30 transition-colors bulk-row" data-category="${cat}" data-source="${source}">
          <td class="p-4 font-mono text-slate-300 text-[10px]">#${item[2]}</td>
          <td class="p-4">
              <div class="font-bold text-slate-700">${item[3]}</div>
              <div class="text-[8px] text-slate-400 uppercase font-black opacity-50 tracking-wider">${cat}</div>
          </td>
          <td class="p-2">
            <input type="number" step="any" oninput="Movements.updateBulkStats()"
                   class="bulk-qty-input input-blue-soft w-full h-11 border border-slate-200 rounded-xl px-2 text-center font-black text-indigo-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all" 
                   data-code="${item[2]}" data-name="${item[3]}" data-cost="${cost}" data-type="${source}" placeholder="0.00">
          </td>
          ${showExpiry ? `
            <td class="p-2">
              <input type="text" class="bulk-batch-input w-full h-11 border border-slate-200 rounded-xl px-2 text-center text-[10px] font-mono outline-none focus:border-indigo-400" placeholder="Batch">
            </td>
            <td class="p-2">
              <input type="date" class="bulk-expiry-input w-full h-11 border border-slate-200 rounded-xl px-2 text-center text-[10px] outline-none focus:border-indigo-400">
            </td>
          ` : ''}
          <td class="p-4 text-center text-slate-400 font-mono font-bold">${cost}</td>
        </tr>`;
  },
  setBulkSource(src) {
    this.bulkSource = src;
    this.filterBulkTable();
    // Update button styles
    $('#btn-src-items').toggleClass('bg-indigo-600 text-white shadow-sm', src === 'items').toggleClass('text-slate-400', src !== 'items');
    $('#btn-src-pos').toggleClass('bg-indigo-600 text-white shadow-sm', src === 'pos').toggleClass('text-slate-400', src !== 'pos');
  },

  filterBulkTable() {
    const query = ($('#bulk-search-input').val() || '').toLowerCase();
    const showOnlyEntered = $('#show-only-entered').is(':checked');
    const selectedCat = $('#bulk-category-select').val();
    const selectedSource = this.bulkSource;

    $("#bulkInitTable tbody tr.bulk-row").each(function() {
        const text = $(this).text().toLowerCase();
        const qtyVal = parseFloat($(this).find('.bulk-qty-input').val()) || 0;
        const rowCat = $(this).data('category');
        const rowSource = $(this).data('source');
        
        const matchesSearch = text.includes(query);
        const hasNumbers = qtyVal > 0;
        const matchesCat = !selectedCat || rowCat === selectedCat;
        const matchesSource = rowSource === selectedSource;
        
        const visible = matchesSearch && matchesSource && matchesCat && (!showOnlyEntered || hasNumbers);
        $(this).toggle(visible);
    });
  },

  updateBulkStats() {
    let count = 0;
    let totalValue = 0;
    
    $(".bulk-qty-input").each(function() {
        const q = parseFloat($(this).val()) || 0;
        const c = parseFloat($(this).data('cost')) || 0;
        if (q > 0) {
            count++;
            totalValue += (q * c);
        }
    });
    
    $("#bulkItemCount").text(count);
    $("#bulkTotalCost").text(Utils.formatCurrency(totalValue));
    
    // If "Show Only Entered" is active, re-filter when values change
    if($('#show-only-entered').is(':checked')) {
        this.filterBulkTable();
    }
  },

  toggleFields() {
    const type = $("#txType").val();
    const isBeginning = (type === "Beginning Inventory");
    const isBulkType = true; // Every movement now uses the bulk display style
    
    // Standard toggles
    const expiryTypes = ["Receiving", "Purchasing", "Beginning Inventory", "Return"];
    $("#divSupp").toggle(type === "Receiving" || type === "Purchasing" || type === "Return");
    $("#divReason").toggle(type === "Waste" || type === "Return" || type === "Consumption");
    $("#divItemExpiry").toggle(expiryTypes.includes(type) && !isBeginning);

    // Toggle between Single Entry and Bulk Entry (Always use Bulk if so desired)
    $("#standard-entry-ui").hide();
    $("#bulk-entry-ui").show().html(this.renderBulkBeginning());
    $("#txFooterBar").hide(); 
    
    // Initialize filters on render
    this.filterBulkTable();
  },

  preview() {
    const isAr = STATE.lang === 'ar';
    const type = $('#txType').val();
    let itemsToPreview = [];
    $('.bulk-qty-input').each(function() {
      const row = $(this).closest('tr');
      const q = parseFloat($(this).val()) || 0;
      if (q > 0) {
        const unitCost = parseFloat($(this).data('cost')) || 0;
        itemsToPreview.push({
          code: $(this).data('code'),
          name: $(this).data('name'),
          qty: q,
          unitCost: unitCost,
          total: q * unitCost,
          batch: row.find('.bulk-batch-input').val() || '',
          expiry: row.find('.bulk-expiry-input').val() || ''
        });
      }
    });

    if (!itemsToPreview.length) {
      Swal.fire({
        icon: 'warning',
        title: isAr ? 'لا توجد بيانات' : 'No Items',
        text: isAr ? 'أضف أصنافاً أولاً قبل المعاينة.' : 'Please add items before previewing.'
      });
      return;
    }

    const date    = $('#txDate').val() || '-';
    const fromLoc = $('#txFrom').val() || '-';
    const toLoc   = $('#txTo').val()   || '-';
    const ref     = $('#txRef').val()  || '-';
    const notes   = $('#txNotes').val()|| '-';

    const totalVal = itemsToPreview.reduce((s, i) => s + i.total, 0);
    const totalQty = itemsToPreview.reduce((s, i) => s + i.qty,   0);

    const typeColors = {
      'Beginning Inventory': '#6366f1',
      'Receiving':   '#10b981', 'Purchasing':  '#3b82f6',
      'Waste':       '#ef4444', 'Transfer Out':'#f59e0b',
      'Transfer In': '#8b5cf6', 'Return':      '#ec4899',
      'Consumption': '#dc2626', 'On Hand':     '#0ea5e9',
    };
    const bc = typeColors[type] || '#64748b';

    const rowsHtml = itemsToPreview.map((item, idx) => `
      <tr style="background:${idx%2===0?'#f8fafc':'#fff'};border-bottom:1px solid #f1f5f9;">
        <td style="padding:9px 12px;font-family:monospace;font-size:10px;color:#94a3b8;">#${item.code}</td>
        <td style="padding:9px 12px;font-weight:800;font-size:11px;color:#1e293b;">${item.name}</td>
        <td style="padding:9px 12px;text-align:center;font-weight:900;font-size:13px;color:#6366f1;">${item.qty.toFixed(2)}</td>
        <td style="padding:9px 12px;text-align:center;font-size:10px;color:#64748b;">${Utils.formatCurrency(item.unitCost)}</td>
        <td style="padding:9px 12px;text-align:center;font-weight:900;font-size:12px;color:#10b981;">${Utils.formatCurrency(item.total)}</td>
      </tr>`).join('');

    Swal.fire({
      title: '',
      width: 'min(90vw,820px)',
      padding: '0',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: `<i class="fa-solid fa-paper-plane"></i> ${isAr ? 'ترحيل الآن' : 'Post Now'}`,
      cancelButtonText:  `<i class="fa-solid fa-pencil"></i> ${isAr ? 'تعديل' : 'Edit'}`,
      confirmButtonColor: '#6366f1',
      cancelButtonColor:  '#94a3b8',
      html: `
        <div style="font-family:'Inter',system-ui,sans-serif;direction:${isAr?'rtl':'ltr'};text-align:${isAr?'right':'left'};">
          <div style="background:linear-gradient(135deg,#0f172a,#1e293b);padding:22px 28px;
                      border-radius:15px 15px 0 0;display:flex;align-items:center;gap:14px;flex-wrap:wrap;">
            <div style="width:46px;height:46px;background:rgba(255,255,255,.08);border-radius:13px;
                        display:flex;align-items:center;justify-content:center;font-size:22px;">📋</div>
            <div>
              <div style="font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px;">
                ${isAr ? 'معاينة الحركة قبل الترحيل' : 'Transaction Preview'}
              </div>
              <span style="display:inline-flex;align-items:center;gap:6px;background:${bc}22;color:${bc};
                           border:1px solid ${bc}55;border-radius:8px;padding:3px 14px;font-size:12px;font-weight:900;">
                <span style="width:7px;height:7px;border-radius:50%;background:${bc};display:inline-block;"></span>
                ${type}
              </span>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:10px;
                      padding:18px 22px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;">
            ${[
              {label: isAr?'التاريخ':'Date',    val: date,    icon:'📅'},
              {label: isAr?'من':'From',          val: fromLoc, icon:'📤'},
              {label: isAr?'إلى':'To',           val: toLoc,   icon:'📥'},
              {label: isAr?'المرجع':'Ref',       val: ref,     icon:'🔖'},
              {label: isAr?'ملاحظات':'Notes',    val: notes,   icon:'📝'},
            ].map(c=>`
              <div style="background:#fff;border-radius:11px;padding:10px 13px;border:1px solid #e2e8f0;">
                <div style="font-size:9px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;margin-bottom:3px;">${c.icon} ${c.label}</div>
                <div style="font-size:11px;font-weight:900;color:#1e293b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${c.val}">${c.val}</div>
              </div>`).join('')}
          </div>

          <div style="padding:14px 22px;">
            <div style="font-size:9px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px;">
              ${isAr?'الأصناف':'Items'} <span style="background:#e0e7ff;color:#6366f1;border-radius:6px;padding:1px 8px;font-size:10px;">${itemsToPreview.length}</span>
            </div>
            <div style="max-height:38vh;overflow-y:auto;border-radius:11px;border:1px solid #e2e8f0;">
              <table style="width:100%;border-collapse:collapse;font-size:11px;">
                <thead style="position:sticky;top:0;background:#0f172a;color:#fff;">
                  <tr>
                    <th style="padding:9px 12px;text-align:left;font-size:9px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;">${isAr?'كود':'Code'}</th>
                    <th style="padding:9px 12px;text-align:left;font-size:9px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;">${isAr?'اسم الصنف':'Item'}</th>
                    <th style="padding:9px 12px;text-align:center;font-size:9px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;">${isAr?'الكمية':'Qty'}</th>
                    <th style="padding:9px 12px;text-align:center;font-size:9px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;">${isAr?'س. الوحدة':'Unit'}</th>
                    <th style="padding:9px 12px;text-align:center;font-size:9px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;">${isAr?'الإجمالي':'Total'}</th>
                  </tr>
                </thead>
                <tbody>${rowsHtml}</tbody>
              </table>
            </div>
          </div>

          <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 22px;
                      background:linear-gradient(135deg,#f0fdf4,#ecfdf5);border-top:1px solid #d1fae5;
                      border-radius:0 0 15px 15px;flex-wrap:wrap;gap:12px;">
            <div style="display:flex;gap:20px;flex-wrap:wrap;">
              <div style="text-align:center;">
                <div style="font-size:9px;color:#64748b;font-weight:700;text-transform:uppercase;">${isAr?'عدد الأصناف':'SKUs'}</div>
                <div style="font-size:22px;font-weight:900;color:#1e293b;">${itemsToPreview.length}</div>
              </div>
              <div style="text-align:center;">
                <div style="font-size:9px;color:#64748b;font-weight:700;text-transform:uppercase;">${isAr?'إجمالي الكمية':'Total Qty'}</div>
                <div style="font-size:22px;font-weight:900;color:#6366f1;">${totalQty.toFixed(2)}</div>
              </div>
            </div>
            <div style="text-align:${isAr?'left':'right'};">
              <div style="font-size:9px;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:.08em;">${isAr?'إجمالي القيمة':'Total Value'}</div>
              <div style="font-size:30px;font-weight:900;color:#10b981;line-height:1.1;">${Utils.formatCurrency(totalVal)}</div>
            </div>
          </div>
        </div>
      `,
    }).then(result => {
      if (result.isConfirmed) { this.save(); }
    });
  },

  async save() {
    const type = $("#txType").val();
    let itemsToSave = [];
    const rawItems = STATE.db.Items || [];
    $(".bulk-qty-input").each(function() {
            const row = $(this).closest('tr');
            const q = parseFloat($(this).val()) || 0;
            if (q > 0) {
                const name = $(this).data('name');
                const code = $(this).data('code');
                const cost = parseFloat($(this).data('cost')) || 0;
                const src = $(this).data('type');
                const batch = row.find('.bulk-batch-input').val() || (type === 'On Hand' ? 'ON-HAND' : (type === 'Consumption' ? 'CONS-MANUAL' : 'BULK-INIT'));
                const expiry = row.find('.bulk-expiry-input').val() || '';

                if (src === 'pos') {
                    const recipe = (STATE.db.Recipes || []).find(r => r[1] === name);
                    if (recipe) {
                        try {
                            const ingredients = JSON.parse(recipe[2]);
                            ingredients.forEach(ing => {
                                const rawItem = rawItems.find(r => r[3] === ing.name || r[2] === ing.code);
                                itemsToSave.push({
                                    name: ing.name,
                                    code: rawItem ? rawItem[2] : (ing.code || ''),
                                    qty: ing.qty * q,
                                    cost: ing.cost,
                                    batch: batch,
                                    expiry: expiry
                                });
                            });
                        } catch (e) {
                             itemsToSave.push({ name, code, qty: q, cost, batch, expiry });
                        }
                    } else {
                        itemsToSave.push({ name, code, qty: q, cost, batch, expiry });
                    }
                } else {
                    itemsToSave.push({ name, code, qty: q, cost, batch, expiry });
                }
            }
        });

    if (!itemsToSave.length) return Swal.fire("Error", "No quantities entered to post", "error");

    const btn = document.getElementById("post-tx-btn");
    if (btn) btn.disabled = true;

    const data = {
      headers: {
        date: $("#txDate").val(),
        type: type,
        from: $("#txFrom").val(),
        to: $("#txTo").val(),
        supp: $("#txSupp").val(),
        ref: $("#txRef").val(),
        notes: $("#txNotes").val(),
        reason: $("#txReason").val(),
      },
      items: itemsToSave,
    };

    Utils.loadingProgress(true);
    try {
      await API.call("SAVE_MOVEMENT", data);
      
      this.tempItems = []; // Clear items
      await App.syncData(false); // Sync State (silent to avoid double rendering)

      Utils.loadingProgress(false); // Success 100% notification
      this.render(); // reset all fields to clear format UI
    } catch (e) {
      Utils.loadingProgress('close');
      if (btn) btn.disabled = false;
      Swal.fire("Error", e.toString(), "error");
    }
  },
};
