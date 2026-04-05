/**
 * MOVEMENTS MODULE (Inventory Transactions)
 * Optimized for Bulk Data Entry with Fixed Footer Summary, Category Filter, and Full Reason List
 */
const Movements = {
  bulkSource: "items",
  bulkCategory: "",

  render() {
    const suppliers = STATE.db.Suppliers || [];
    const isAr = STATE.lang === "ar";
    const items = STATE.db.Items || [];
    // Get unique categories for the filter
    const allCats = [...new Set(items.map(i => i[1]).filter(String))].sort();

    document.getElementById("main-content").innerHTML = `
            <div class="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-fade-in ${isAr ? "text-right" : "text-left"}" dir="${isAr ? "rtl" : "ltr"}">
                <!-- 🏛️ Transaction Header -->
                <div class="xl:col-span-4 space-y-6">
                    <div class="glass-card">
                        <div class="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                            <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                <i class="fa-solid fa-file-invoice"></i>
                            </div>
                            <h3 class="text-lg font-black text-slate-800">${isAr ? "بيانات الحركة" : "Transaction Header"}</h3>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4 mb-4">
                            <div class="form-group">
                                <label class="nav-label p-0 mb-1 text-[10px] uppercase font-black text-slate-400">${isAr ? "التاريخ" : "Date"}</label>
                                <input type="date" id="txDate" class="input-premium" value="${new Date().toISOString().split("T")[0]}">
                            </div>
                            <div class="form-group">
                                <label class="nav-label p-0 mb-1 text-[10px] uppercase font-black text-slate-400">${__("trx_type")}</label>
                                <select id="txType" class="input-premium" onchange="Movements.toggleFields()">
                                    <option value="Beginning Inventory">${__("Beginning Inventory")}</option>
                                    <option value="Receiving">${__("Receiving")}</option>
                                    <option value="Purchasing">${__("Purchasing")}</option>
                                    <option value="Waste">${__("Waste")}</option>
                                    <option value="Transfer Out">${__("Transfer Out")}</option>
                                    <option value="Transfer In">${__("Transfer In")}</option>
                                    <option value="Return">${__("Return")}</option>
                                    <option value="Consumption">${isAr ? 'استهلاك' : 'Consumption'}</option>
                                    <option value="On Hand">${isAr ? 'رصيد فعلي' : 'On Hand'}</option>
                                    <option value="Corporate Order">${__("Corporate Order")}</option>
                                </select>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4 mb-4">
                            <div class="form-group">
                                <label class="nav-label p-0 mb-1 text-[10px] uppercase font-black text-slate-400">${isAr ? "من" : "From"}</label>
                                <select id="txFrom" class="input-premium select2-init">
                                    <option value="">${isAr ? "اختر..." : "Select..."}</option>
                                    ${(STATE.db.Locations || []).map((l) => `<option value="${l[1]}">${l[1]}</option>`).join("")}
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="nav-label p-0 mb-1 text-[10px] uppercase font-black text-slate-400">${isAr ? "إلى" : "To"}</label>
                                <select id="txTo" class="input-premium select2-init">
                                    <option value="">${isAr ? "اختر..." : "Select..."}</option>
                                    ${(STATE.db.Locations || []).map((l) => `<option value="${l[1]}">${l[1]}</option>`).join("")}
                                </select>
                            </div>
                        </div>

                        <div id="divSupp" style="display:none;" class="mb-4">
                             <label class="nav-label p-0 mb-1 text-[10px] uppercase font-black text-slate-400">${isAr ? "المورد" : "Supplier"}</label>
                             <select id="txSupp" class="input-premium select2-init">
                                <option value="">${isAr ? "اختر المورد..." : "Select Supplier..."}</option>
                                ${suppliers.map((s) => `<option value="${s[0]}">${s[0]}</option>`).join("")}
                             </select>
                        </div>

                        <div id="divReason" style="display:none;" class="mb-4">
                             <label class="nav-label p-0 mb-1 text-[10px] uppercase font-black text-slate-400">${isAr ? "السبب" : "Reason"}</label>
                             <select id="txReason" class="input-premium">
                                <option value="">${isAr ? "---" : "---"}</option>
                                <option value="Expired">${isAr ? "💥 منتهي الصلاحية" : "Expired"}</option>
                                <option value="Damaged">${isAr ? "⚠️ تالف / مكسور" : "Damaged / Broken"}</option>
                                <option value="Error">${isAr ? "🚫 خطأ في الإدخال" : "Entry Error"}</option>
                                <option value="Theft">${isAr ? "🕵️ عجز / سرقة" : "Shortage / Theft"}</option>
                                <option value="Quality Care">${isAr ? "🛡️ عناية جودة" : "Quality Care"}</option>
                                <option value="Conditional Receiving">${isAr ? "🤝 استلام مشروط" : "Conditional Receiving"}</option>
                                <option value="Gift">${isAr ? "🎁 ضيافة / هدايا" : "Complimentary / Gift"}</option>
                                <option value="Production">${isAr ? "⚙️ استخدام إنتاج" : "Production Use"}</option>
                                <option value="Corporate Order">${isAr ? "🏢 طلب شركات" : "Corporate Order"}</option>
                                <option value="Other">${isAr ? "📝 أخرى" : "Other"}</option>
                             </select>
                        </div>

                        <div class="mb-4">
                            <label class="nav-label p-0 mb-1 text-[10px] uppercase font-black text-slate-400">${isAr ? "المرجع" : "Ref #"}</label>
                            <input id="txRef" class="input-premium" placeholder="${isAr ? "رقم الفاتورة..." : "Invoice #"}">
                        </div>

                        <div class="mb-6">
                            <label class="nav-label p-0 mb-1 text-[10px] uppercase font-black text-slate-400">${isAr ? "ملاحظات" : "Notes"}</label>
                            <textarea id="txNotes" class="input-premium" rows="2"></textarea>
                        </div>
                    </div>
                </div>

                <!-- 📦 Item Entry Catalog Grid -->
                <div class="xl:col-span-8">
                    <div class="glass-card p-0 flex flex-col overflow-hidden" style="height: 750px;">
                        <!-- Table Header -->
                        <div class="p-4 border-b border-slate-100 flex flex-col gap-3 bg-white shrink-0 shadow-sm">
                            <div class="flex items-center justify-between">
                                <h3 class="font-black text-slate-900 text-lg flex items-center gap-3">
                                     <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg shadow-inner">
                                        <i class="fa-solid fa-cart-flatbed"></i>
                                    </div>
                                    ${isAr ? "كتالوج المخزن" : "Inventory Catalog"}
                                </h3>
                                
                                <div class="flex items-center gap-3">
                                     <!-- Group Filter -->
                                    <select id="bulk-category-select" onchange="Movements.filterBulkTable()" class="input-premium h-11 text-xs min-w-[250px] font-black bg-slate-50 border-slate-300">
                                        <option value="">${isAr ? "📁 كل الفئات" : "All Categories"}</option>
                                        ${allCats.map(c => `<option value="${c}">${c}</option>`).join('')}
                                    </select>

                                    <!-- Filter Entered -->
                                    <label class="flex items-center gap-2 cursor-pointer bg-slate-100 h-11 px-4 rounded-xl border border-slate-200 hover:bg-white hover:border-indigo-500 transition-all group">
                                        <input type="checkbox" id="show-only-entered" onchange="Movements.filterBulkTable()" class="w-5 h-5 accent-indigo-600 rounded">
                                        <span class="text-[10px] font-black text-slate-700 uppercase whitespace-nowrap group-hover:text-indigo-600">${isAr ? 'المدخل' : 'Entered'}</span>
                                    </label>
                                </div>
                            </div>

                            <div class="relative flex-1" id="divDirectSearch">
                                <i class="fa-solid fa-magnifying-glass absolute ${isAr ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 text-lg"></i>
                                <input type="text" id="bulk-search-input" oninput="Movements.filterBulkTable()" 
                                    placeholder="${isAr ? 'بحث سريع...' : 'Quick search...'}" 
                                    class="input-premium w-full h-11 text-sm font-black ${isAr ? 'pr-12 pl-4' : 'pl-12 pr-4'} bg-slate-50 border-2 border-slate-100 focus:border-indigo-400 focus:bg-white rounded-xl transition-all">
                            </div>
                        </div>

                        <!-- Main Table Area (Scrollable) -->
                        <div id="bulk-entry-ui" class="flex-1 overflow-y-auto bg-white custom-scrollbar-premium">
                            <!-- Rows loaded via renderBulkTable -->
                        </div>

                        <!-- 🚀 FIXED FOOTER SUMMARY -->
                        <div class="bg-indigo-950 p-5 px-8 flex items-center justify-between shrink-0 shadow-2xl border-t border-indigo-900">
                             <div class="flex items-center gap-8">
                                 <div class="space-y-1">
                                     <div class="text-[9px] font-black text-slate-400 uppercase tracking-widest">${isAr ? "عدد الأصناف" : "Items Count"}</div>
                                     <div id="bulkItemCount" class="text-2xl font-black text-white premium-num">0</div>
                                 </div>
                                 <div class="space-y-1">
                                     <div class="text-[9px] font-black text-slate-400 uppercase tracking-widest">${isAr ? "إجمالي التكلفة" : "Total Cost"}</div>
                                     <div id="bulkTotalCost" class="text-2xl font-black text-emerald-400 premium-num">0.00</div>
                                 </div>
                             </div>
                             
                             <div class="flex items-center gap-3">
                                <button onclick="Movements.preview()" class="h-12 px-6 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-black transition-all flex items-center gap-2 border border-white/10">
                                    <i class="fa-solid fa-eye text-indigo-400"></i> ${isAr ? "معاينة" : "Preview"}
                                </button>
                                <button onclick="Movements.save()" id="post-tx-btn" class="h-12 px-8 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2">
                                    <i class="fa-solid fa-check"></i> ${isAr ? "ترحيل الحساب" : "Post"}
                                </button>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

    setTimeout(() => {
      this.toggleFields();
      $(".select2-init").select2({ dir: isAr ? "rtl" : "ltr", width: "100%" });

      // 🎹 Keyboard Arrow Navigation
      $(document).off('keydown', '.bulk-qty-input').on('keydown', '.bulk-qty-input', function(e) {
          const $current = $(this);
          const $rows = $('#bulkInitTable tbody tr:visible');
          const index = $rows.index($current.closest('tr'));

          if (e.key === 'ArrowDown') {
              e.preventDefault();
              $rows.eq(index + 1).find('.bulk-qty-input').focus().select();
          } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              $rows.eq(index - 1).find('.bulk-qty-input').focus().select();
          }
      });
    }, 50);
  },

  renderBulkTable() {
    const isAr = STATE.lang === 'ar';
    const type = $('#txType').val();
    const expiryTypes = ["Receiving", "Purchasing", "Return", "Waste", "Beginning Inventory"];
    const showExpiry = expiryTypes.includes(type);

    // Dynamic items list
    let allItems = [];
    if(type === 'Waste' || type === 'On Hand') {
        const raw = (STATE.db.Items || []).map(i => ({ data: i, type: 'raw' }));
        const menu = (STATE.db.Menu_POS || []).filter(m => m[6]).map(m => ({ data: m, type: 'menu' }));
        allItems = [...raw, ...menu];
    } else {
        allItems = (STATE.db.Items || []).map(i => ({ data: i, type: 'raw' }));
    }

    return `
      <table class="w-full text-xs" id="bulkInitTable" style="border-collapse:collapse;">
        <thead class="sticky top-0 bg-slate-50 shadow-sm z-10">
          <tr class="${isAr ? 'text-right' : 'text-left'}">
            <th class="px-6 py-2.5 text-slate-400 font-black uppercase text-[10px] tracking-widest">${isAr ? 'الكود' : 'Code'}</th>
            <th class="px-6 py-2.5 text-slate-400 font-black uppercase text-[10px] tracking-widest">${isAr ? 'اسم الصنف' : 'Item Name'}</th>
            <th class="px-6 py-2.5 text-slate-400 font-black uppercase text-[10px] tracking-widest text-center">${isAr ? 'التكلفة' : 'Cost'}</th>
            <th class="px-6 py-2.5 text-slate-400 font-black uppercase text-[10px] tracking-widest text-center w-32">${isAr ? 'الكمية' : 'Qty'}</th>
            ${showExpiry ? `
                <th class="px-6 py-2.5 text-slate-400 font-black uppercase text-[10px] tracking-widest text-center w-24">${isAr ? 'تشغيلة' : 'Batch'}</th>
                <th class="px-6 py-2.5 text-slate-400 font-black uppercase text-[10px] tracking-widest text-center w-32">${isAr ? 'صلاحية' : 'Expiry'}</th>
            ` : ''}
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          ${allItems.map(obj => this.renderBulkRow(obj, showExpiry)).join('')}
        </tbody>
      </table>
    `;
  },

  renderBulkRow(obj, showExpiry) {
      const item = obj.data;
      const rowType = obj.type; // 'raw' or 'menu'
      const code = rowType === 'raw' ? item[2] : item[6];
      const name = item[3];
      const cost = rowType === 'raw' ? (item[5] || 0) : (parseFloat(item[5]) || 0);
      const cat = item[1] || '';
      const isAr = STATE.lang === 'ar';
      
      return `
        <tr class="hover:bg-slate-50/50 transition-all bulk-row" data-category="${cat}" data-type="${rowType}">
          <td class="px-6 py-2 font-mono text-[10px] text-slate-300">#${code}</td>
          <td class="px-6 py-2">
              <div class="font-black text-slate-700 bulk-item-name transition-all flex items-center gap-2 text-[11px]">
                ${name}
                ${rowType === 'menu' ? `<span class="px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 text-[6px] font-black uppercase tracking-tighter border border-rose-100">${isAr?'منتج':'PRODUCT'}</span>` : ''}
              </div>
              <div class="flex items-center gap-2 mt-0">
                <span class="text-[8px] text-slate-400 font-bold uppercase tracking-widest">${cat}</span>
                <span class="bulk-source-badge hidden px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-500 font-black text-[7px] uppercase tracking-tighter shadow-sm border border-indigo-100"></span>
              </div>
          </td>
          <td class="px-6 py-2 text-center font-black text-slate-400 text-[10px]">${Number(cost).toFixed(2)}</td>
          <td class="px-4 py-1.5">
            <input type="number" step="any" min="0" 
                   oninput="${rowType === 'menu' ? 'Movements.handleMenuInput(this)' : 'Movements.handleInput(this)'}"
                   class="bulk-qty-input w-full h-9 bg-white border border-slate-200 rounded-lg px-2 text-center font-black text-indigo-600 focus:border-indigo-500 outline-none transition-all text-sm" 
                   data-type="${rowType}" data-code="${code}" data-name="${name}" data-cost="${cost}" placeholder="0.00">
          </td>
          ${showExpiry ? `
            <td class="px-2 py-1.5"><input type="text" class="bulk-batch-input w-full h-9 border border-slate-200 rounded-lg px-2 text-center text-[10px] font-mono outline-none"></td>
            <td class="px-2 py-1.5"><input type="date" class="bulk-expiry-input w-full h-9 border border-slate-200 rounded-lg px-2 text-center text-[10px] outline-none"></td>
          ` : ''}
        </tr>`;
  },

  handleInput(input) {
      if (parseFloat(input.value) < 0) input.value = 0;
      const qty = parseFloat(input.value) || 0;
      const $row = $(input).closest('tr');
      const $name = $row.find('.bulk-item-name');

      if (qty > 0) {
          $name.addClass('word-art-active');
          $row.addClass('bg-indigo-50/20');
      } else {
          $name.removeClass('word-art-active');
          $row.removeClass('bg-indigo-50/20');
      }
      this.updateBulkStats();
  },

  handleMenuInput(input) {
      const menuQty = parseFloat(input.value) || 0;
      const recipeId = $(input).data('code');
      const itemName = $(input).data('name');
      const isAr = STATE.lang === 'ar';

      // Mark the row visually
      const $row = $(input).closest('tr');
      $row.toggleClass('bg-rose-50/20', menuQty > 0);

      // Trigger Explosion
      if (menuQty > 0) {
          const ingredients = this.getIngredientsRecursive(recipeId, menuQty, itemName);
          ingredients.forEach(ing => {
              let target = $(`.bulk-qty-input[data-type="raw"][data-code="${ing.code}"]`);
              if (!target.length) {
                  const searchName = String(ing.name || ing.code).trim().toLowerCase();
                  $(`.bulk-qty-input[data-type="raw"]`).each(function() {
                      if (String($(this).data('name')).trim().toLowerCase() === searchName) {
                          target = $(this);
                          return false;
                      }
                  });
              }

              if (target.length) {
                  // We update the quantity. 
                  // Note: This replaces whatever was there. 
                  // If multiple menu items share ingredients, they currently overwrite each other.
                  // A more robust way would be to track 'auto-quantities' vs 'manual' but let's keep it simple as requested.
                  target.val(ing.qty.toFixed(3)).trigger('input');
                  const $badge = target.closest('tr').find('.bulk-source-badge');
                  $badge.text(itemName).removeClass('hidden');
              }
          });
      }
      this.updateBulkStats();
  },

  filterBulkTable() {
    const query = ($('#bulk-search-input').val() || '').toLowerCase();
    const selectedCat = $('#bulk-category-select').val();
    const showOnlyEntered = $('#show-only-entered').is(':checked');

    $("#bulkInitTable tbody tr.bulk-row").each(function() {
        const text = $(this).text().toLowerCase();
        const rowCat = $(this).data('category');
        const qtyVal = parseFloat($(this).find('.bulk-qty-input').val()) || 0;

        const matchesSearch = text.includes(query);
        const matchesCat = !selectedCat || rowCat === selectedCat;
        const matchesEntered = !showOnlyEntered || qtyVal > 0;

        $(this).toggle(matchesSearch && matchesCat && matchesEntered);
    });
  },

  updateBulkStats() {
    let count = 0, totalValue = 0;
    $(".bulk-qty-input").each(function() {
        const q = parseFloat($(this).val()) || 0;
        const c = parseFloat($(this).data('cost')) || 0;
        if (q > 0) { count++; totalValue += (q * c); }
    });
    $("#bulkItemCount").text(count);
    $("#bulkTotalCost").text(Utils.formatCurrency(totalValue));
  },

  toggleFields() {
    const type = $("#txType").val();
    $("#divSupp").toggle(type === "Receiving" || type === "Purchasing" || type === "Return");
    $("#divReason").show(); // Always show it as an optional field for all movements as requested.
    $("#txReason").val(""); // Reset reason on type change to avoid carrying over old selections
    // #divMenuWaste is no longer needed since everything is in the flat table
    $("#divMenuWaste").hide(); 
    $("#divDirectSearch").show();
    $("#bulk-entry-ui").html(this.renderBulkTable());
    this.filterBulkTable();
  },

  preview() {
    const isAr = STATE.lang === 'ar';
    const type = $('#txType').val();
    const date = $('#txDate').val();
    const from = $('#txFrom').val() || '-';
    const to = $('#txTo').val() || '-';
    const ref = $('#txRef').val() || '-';
    const notes = $('#txNotes').val() || '-';
    const reason = $('#txReason').val() || '-';
    const itemsToPreview = [];
    
    $('.bulk-qty-input').each(function() {
      const q = parseFloat($(this).val()) || 0;
      if (q > 0) {
        const row = $(this).closest('tr');
        const cost = parseFloat($(this).data('cost')) || 0;
        const batch = row.find('.bulk-batch-input').val() || '-';
        itemsToPreview.push({ 
            code: $(this).data('code'), 
            name: $(this).data('name'), 
            cost: cost,
            qty: q, 
            batch: batch,
            total: q * cost 
        });
      }
    });

    if (!itemsToPreview.length) return Swal.fire('Error', isAr ? 'أدخل كميات أولاً!' : 'No entries!', 'warning');

    const totalCost = itemsToPreview.reduce((s, i) => s + i.total, 0);

    const rowsHtml = itemsToPreview.map(item => `
        <tr style="border-bottom:1px solid #f1f5f9;">
            <td style="padding:8px; font-family:monospace; color:#94a3b8; font-size:10px;">#${item.code}</td>
            <td style="padding:8px; font-weight:800; font-size:11px;">${item.name}</td>
            <td style="padding:8px; text-align:center; font-weight:900; color:#6366f1; font-size:11px;">${item.cost.toFixed(2)}</td>
            <td style="padding:8px; text-align:center; font-weight:900; color:#6366f1; font-size:11px;">${item.qty}</td>
            <td style="padding:8px; text-align:center; font-weight:900; color:#94a3b8; font-size:11px;">${item.batch}</td>
        </tr>`).join('');

    const previewHtml = `
        <div id="movement-preview-area" style="direction:${isAr?'rtl':'ltr'}; text-align:start; font-family:sans-serif;">
            <div style="background:#f8fafc; padding:12px; border-radius:12px; margin-bottom:12px; font-size:10px; border:1px solid #e2e8f0;">
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                    <div><b>${isAr?'النوع:':'Type:'}</b> ${type}</div>
                    <div><b>${isAr?'التاريخ:':'Date:'}</b> ${date}</div>
                    <div><b>${isAr?'من:':'From:'}</b> ${from}</div>
                    <div><b>${isAr?'إلى:':'To:'}</b> ${to}</div>
                    <div><b>${isAr?'رقم المرجع:':'Ref #:'}</b> ${ref}</div>
                    <div><b>${isAr?'السبب:':'Reason:'}</b> ${reason}</div>
                </div>
                <div style="margin-top:8px; border-top:1px dashed #cbd5e1; pt-5">
                    <b>${isAr?'ملاحظات:':'Notes:'}</b> ${notes}
                </div>
            </div>
            <table style="width:100%; border-collapse:collapse; font-size:11px;">
                <thead style="background:#0f172a; color:#fff;">
                    <tr>
                        <th style="padding:10px; text-align:start;">${isAr ? 'الكود' : 'CODE'}</th>
                        <th style="padding:10px; text-align:start;">${isAr ? 'اسم الصنف' : 'ITEM NAME'}</th>
                        <th style="padding:10px; text-align:center;">${isAr ? 'التكلفة' : 'COST'}</th>
                        <th style="padding:10px; text-align:center;">${isAr ? 'الكمية' : 'QTY'}</th>
                        <th style="padding:10px; text-align:center;">${isAr ? 'تشغيلة' : 'BATCH'}</th>
                    </tr>
                </thead>
                <tbody>${rowsHtml}</tbody>
                <tfoot style="background:#f8fafc; border-top:2px solid #0f172a;">
                    <tr>
                        <td colspan="4" style="padding:10px; text-align:end; font-weight:900;">${isAr ? 'إجمالي التكلفة:' : 'TOTAL COST:'}</td>
                        <td style="padding:10px; text-align:end; font-weight:900; color:#10b981;">${Utils.formatCurrency(totalCost)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    `;

    Swal.fire({
      width: '600px',
      title: `<div class="flex items-center gap-2 justify-center">
                <img src="assets/icon-192x192.png" style="height:30px; width:30px; border-radius:6px;">
                <span>${isAr ? 'معاينة الحركة' : 'Movement Preview'}</span>
              </div>`,
      html: previewHtml,
      showConfirmButton: true,
      confirmButtonText: isAr ? '<i class="fa-solid fa-file-pdf ml-2"></i> طباعة PDF' : '<i class="fa-solid fa-file-pdf mr-2"></i> Print PDF',
      showCancelButton: true,
      cancelButtonText: isAr ? 'إغلاق' : 'Close',
      customClass: {
          confirmButton: 'btn-premium bg-slate-900 text-white rounded-xl px-6 py-3 font-black text-[11px] uppercase tracking-widest',
          cancelButton: 'btn-premium bg-slate-100 text-slate-500 rounded-xl px-6 py-3 font-black text-[11px] uppercase tracking-widest'
      }
    }).then((result) => {
        if (result.isConfirmed) {
            this.exportPDF(previewHtml);
        }
    });
  },

  exportPDF(htmlContent) {
    const isAr = STATE.lang === 'ar';
    const win = window.open('', '_blank', 'width=800,height=900');
    win.document.write(`
        <html>
            <head>
                <title>Movement Preview</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
                <style>
                    @page { size: landscape; margin: 10mm; }
                    body {
                        font-family: ${isAr ? "'Cairo', sans-serif" : "'Inter', sans-serif"};
                        padding: 0; margin: 0; background: white;
                    }
                    .print-box {
                        width: 100%; border: 1px solid #e2e8f0; padding: 20px; border-radius: 10px;
                    }
                    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                    th, td { border: 1px solid #f1f5f9; padding: 8px; font-size: 10px; text-align: inherit; }
                    th { background: #f8fafc; font-weight: 900; text-transform: uppercase; }
                    .header { border-bottom: 2px solid #4f46e5; padding-bottom: 10px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; }
                </style>
            </head>
            <body onload="setTimeout(() => { window.print(); window.close(); }, 600)">
                <div class="header">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <img src="assets/icon-192x192.png" style="height: 35px; width: 35px; border-radius: 6px;">
                        <div style="font-weight:900; color:#4f46e5; font-size:18px;">EZEM PRO</div>
                    </div>
                    <div style="font-size:10px; font-weight:700; color:#94a3b8; text-transform:uppercase;">${isAr?'الخلاصة الجردية':'Inventory Summary Slip'}</div>
                </div>
                ${htmlContent}
                <div style="margin-top:20px; font-size:8px; color:#cbd5e1; text-align:center; text-transform:uppercase; letter-spacing:2px;">
                    Generated by EZEM ERP • ${new Date().toLocaleString()}
                </div>
            </body>
        </html>
    `);
    win.document.close();
  },

  async save() {
    const type = $("#txType").val();
    let itemsToSave = [];
    $(".bulk-qty-input").each(function() {
        const row = $(this).closest('tr');
        const q = parseFloat($(this).val()) || 0;
        if (q > 0) {
            itemsToSave.push({
                name: $(this).data('name'),
                code: $(this).data('code'),
                qty: q,
                cost: parseFloat($(this).data('cost')) || 0,
                batch: row.find('.bulk-batch-input').val() || 'BULK',
                expiry: row.find('.bulk-expiry-input').val() || ''
            });
        }
    });

    if (!itemsToSave.length) return Swal.fire(STATE.lang === 'ar' ? "خطأ" : "Error", STATE.lang === 'ar' ? "لا يوجد أصناف للترحيل" : "Empty order", "error");

    const data = {
      headers: {
        date: $("#txDate").val(), type, from: $("#txFrom").val(), to: $("#txTo").val(),
        supp: $("#txSupp").val(), ref: $("#txRef").val(), notes: $("#txNotes").val(), reason: $("#txReason").val(),
      },
      items: itemsToSave,
    };

    Utils.loadingProgress(true);
    let postSuccess = false;
    try {
      await API.call("SAVE_MOVEMENT", data);
      postSuccess = true;
      this.render(); // Wipe inputs immediately after successful post
      await App.syncData(false);
      Utils.loadingProgress(false);
      Utils.toast(STATE.lang === 'ar' ? 'تم الترحيل بنجاح' : 'Posted successfully');
    } catch (e) {
      Utils.loadingProgress('close');
      if (postSuccess) {
         // Post succeeded but sync failed. Inputs are already wiped.
         Swal.fire(STATE.lang === 'ar' ? "تنبيه" : "Warning", (STATE.lang === 'ar' ? "تم الترحيل، ولكن تعذرت المزامنة: " : "Posted but sync failed: ") + e.toString(), "warning");
      } else {
         // Post failed. Inputs remain intact so user can fix and try again.
         Swal.fire(STATE.lang === 'ar' ? "خطأ" : "Error", e.toString(), "error");
      }
    }
  },

  explodeMenuWaste() {
    const isAr = STATE.lang === 'ar';
    const select = $('#menu-waste-select');
    const fullVal = select.val(); // e.g. "MENU_rec123" or "RAW_itm123"
    if (!fullVal) return;

    const valType = select.find('option:selected').data('type'); // "menu" or "raw"
    const realId = fullVal.split('_')[1];
    const itemName = String(select.find('option:selected').text()).trim();

    Swal.fire({
      title: isAr ? 'كمية الهالك' : 'Waste Quantity',
      text: (isAr ? 'الصنف: ' : 'Item: ') + itemName,
      input: 'number',
      inputAttributes: { min: 0, step: 'any' },
      inputValue: 1,
      showCancelButton: true,
      confirmButtonText: isAr ? 'إضافة للهالك' : 'Add to Waste',
      confirmButtonColor: '#f43f5e'
    }).then((result) => {
      if (result.isConfirmed && result.value > 0) {
        const wasteQty = parseFloat(result.value);

        if (valType === 'raw') {
            // Direct Raw Item Addition
            let input = $(`.bulk-qty-input[data-code="${realId}"]`);
            if (input.length) {
                const current = parseFloat(input.val()) || 0;
                input.val((current + wasteQty).toFixed(3)).trigger('input');
                Utils.toast(isAr ? 'تم إضافة الصنف' : 'Item added');
            } else {
                Swal.fire(isAr?'خطأ':'Error', isAr?'الصنف غير موجود في القائمة':'Item not found in list', 'error');
            }
        } else {
            // Menu Item Explosion
            const ingredients = this.getIngredientsRecursive(realId, wasteQty, itemName);
            if (!ingredients || ingredients.length === 0) {
              return Swal.fire(isAr ? 'خطأ' : 'Error', isAr ? 'لا يوجد مكونات لهذا المنتج' : 'No ingredients found', 'error');
            }

            let addedCount = 0;
            ingredients.forEach(ing => {
                let input = $(`.bulk-qty-input[data-code="${ing.code}"]`);
                if (!input.length) {
                    const searchName = String(ing.name || ing.code).trim().toLowerCase();
                    $(".bulk-qty-input").each(function() {
                        if (String($(this).data('name')).trim().toLowerCase() === searchName) {
                            input = $(this);
                            return false;
                        }
                    });
                }

                if (input.length) {
                    const currentQty = parseFloat(input.val()) || 0;
                    input.val((currentQty + ing.qty).toFixed(3)).trigger('input');
                    const $badge = input.closest('tr').find('.bulk-source-badge');
                    $badge.text(itemName).removeClass('hidden');
                    addedCount++;
                }
            });
            Utils.toast(isAr ? `انفجار تم: ${addedCount} مكون` : `Exploded: ${addedCount} materials`);
        }

        // Auto-show only entered
        $('#show-only-entered').prop('checked', true).trigger('change');
      }
    });
  },

  getIngredientsRecursive(recipeId, multiplier, itemName = '') {
    const recipes = STATE.db.Recipes || [];
    const items = STATE.db.Items || [];
    
    const searchId = String(recipeId || '').trim().toLowerCase();
    const searchName = String(itemName || '').trim().toLowerCase();
    
    // 1. Try search by ID or Name
    let recipe = recipes.find(r => 
        String(r[0]).trim().toLowerCase() === searchId || 
        String(r[1]).trim().toLowerCase() === searchId ||
        (searchName && String(r[1]).trim().toLowerCase() === searchName)
    );

    if (!recipe) {
      console.error(`getIngredientsRecursive: No recipe found for "${recipeId}" / "${itemName}"`);
      return [];
    }

    const batchSize = parseFloat(recipe[8]) || 1;
    const factor = multiplier / batchSize;

    let ingredients = [];
    let rawJson = [];
    try {
        rawJson = JSON.parse(recipe[2] || '[]');
    } catch(e) { 
        console.error("Recipe JSON Parse Error", e, recipe[2]); 
        return []; 
    }

    rawJson.forEach(ing => {
        const qty = (parseFloat(ing.qty) || 0) * factor;
        const yieldVal = parseFloat(ing.yield || ing.Yield) || 100;
        const netQty = qty / (yieldVal / 100);

        // Flexible lookup: search for 'id', then 'name'
        let targetId = ing.id || ing.ID || ing.name || ing.Name;
        if (!targetId) return;

        // Strip prefix if exists (itm_xxx -> xxx)
        let cleanId = String(targetId).includes('_') ? String(targetId).split('_').slice(1).join('_') : targetId;

        // Check if it's a sub-recipe
        const isSubRecipe = ing.type === 'recipe' || String(targetId).startsWith('rec_');
        
        if (isSubRecipe) {
            const subIngredients = this.getIngredientsRecursive(cleanId, netQty, targetId);
            ingredients = ingredients.concat(subIngredients);
        } else {
            // It's an item. We need the CODE. 
            // If cleanId is already a code in Items sheet, use it.
            // If not, try to find the code by searching for Item Name matching cleanId.
            let finalCode = cleanId;
            const itemByCode = items.find(i => String(i[2]).trim() === String(cleanId).trim());
            
            if (!itemByCode) {
                // Try searching by name (index 3 in Items sheet)
                const itemByName = items.find(i => String(i[3]).trim().toLowerCase() === String(cleanId).trim().toLowerCase());
                if (itemByName) {
                    finalCode = itemByName[2]; // Use the Code (index 2)
                }
            }
            
            if (finalCode) ingredients.push({ code: finalCode, qty: netQty, name: cleanId });
        }
    });

    return ingredients;
  }
};
