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
                                <option value="Expired">${isAr ? "💥 منتهي الصلاحية" : "Expired"}</option>
                                <option value="Damaged">${isAr ? "⚠️ تالف / مكسور" : "Damaged / Broken"}</option>
                                <option value="Error">${isAr ? "🚫 خطأ في الإدخال" : "Entry Error"}</option>
                                <option value="Theft">${isAr ? "🕵️ عجز / سرقة" : "Shortage / Theft"}</option>
                                <option value="Quality Care">${isAr ? "🛡️ عناية جودة" : "Quality Care"}</option>
                                <option value="Conditional Receiving">${isAr ? "🤝 استلام مشروط" : "Conditional Receiving"}</option>
                                <option value="Gift">${isAr ? "🎁 ضيافة / هدايا" : "Complimentary / Gift"}</option>
                                <option value="Production">${isAr ? "⚙️ استخدام إنتاج" : "Production Use"}</option>
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
                        <div class="p-4 px-6 border-b border-slate-50 flex items-center justify-between bg-white shrink-0">
                            <h3 class="font-black text-slate-800 text-lg flex items-center gap-3">
                                 <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                    <i class="fa-solid fa-boxes-stacked"></i>
                                </div>
                                ${isAr ? "جدول إدخال الأصناف" : "Item Entry Catalog"}
                            </h3>
                            
                            <div class="flex items-center gap-3">
                                <!-- Group Filter -->
                                <select id="bulk-category-select" onchange="Movements.filterBulkTable()" class="input-premium h-10 text-[10px] min-w-[140px] font-black">
                                    <option value="">${isAr ? "📁 كل الفئات" : "All Categories"}</option>
                                    ${allCats.map(c => `<option value="${c}">${c}</option>`).join('')}
                                </select>

                                <!-- Search -->
                                <div class="relative w-64">
                                    <i class="fa-solid fa-search absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-300"></i>
                                    <input type="text" id="bulk-search-input" oninput="Movements.filterBulkTable()" placeholder="${isAr ? 'بحث عن صنف أو كود...' : 'Search for item or code...'}" 
                                        class="input-premium h-10 text-xs ${isAr ? 'pr-9 pl-3' : 'pl-9 pr-3'}">
                                </div>

                                <!-- Filter Entered -->
                                <label class="flex items-center gap-2 cursor-pointer bg-slate-50 h-10 px-3 rounded-xl border border-slate-200 hover:bg-slate-100 transition-all">
                                    <input type="checkbox" id="show-only-entered" onchange="Movements.filterBulkTable()" class="w-4 h-4 accent-indigo-600">
                                    <span class="text-[9px] font-black text-slate-600 uppercase whitespace-nowrap">${isAr ? 'المدخل فقط' : 'Entered'}</span>
                                </label>
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
    const items = STATE.db.Items || [];
    const isAr = STATE.lang === 'ar';
    const type = $('#txType').val();
    const expiryTypes = ["Receiving", "Purchasing", "Return", "Waste", "Beginning Inventory"];
    const showExpiry = expiryTypes.includes(type);

    return `
      <table class="w-full text-xs" id="bulkInitTable" style="border-collapse:collapse;">
        <thead class="sticky top-0 bg-slate-50 shadow-sm z-10">
          <tr class="${isAr ? 'text-right' : 'text-left'}">
            <th class="px-6 py-4 text-slate-400 font-black uppercase text-[10px] tracking-widest">${isAr ? 'الكود' : 'Code'}</th>
            <th class="px-6 py-4 text-slate-400 font-black uppercase text-[10px] tracking-widest">${isAr ? 'اسم الصنف' : 'Item Name'}</th>
            <th class="px-6 py-4 text-slate-400 font-black uppercase text-[10px] tracking-widest text-center">${isAr ? 'التكلفة' : 'Cost'}</th>
            <th class="px-6 py-4 text-slate-400 font-black uppercase text-[10px] tracking-widest text-center w-32">${isAr ? 'الكمية' : 'Qty'}</th>
            ${showExpiry ? `
                <th class="px-6 py-4 text-slate-400 font-black uppercase text-[10px] tracking-widest text-center w-24">${isAr ? 'تشغيلة' : 'Batch'}</th>
                <th class="px-6 py-4 text-slate-400 font-black uppercase text-[10px] tracking-widest text-center w-32">${isAr ? 'صلاحية' : 'Expiry'}</th>
            ` : ''}
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          ${items.map(item => this.renderBulkRow(item, showExpiry)).join('')}
        </tbody>
      </table>
    `;
  },

  renderBulkRow(item, showExpiry) {
      const code = item[2];
      const name = item[3];
      const cost = item[5] || 0;
      const cat = item[1] || '';
      
      return `
        <tr class="hover:bg-slate-50/50 transition-all bulk-row" data-category="${cat}">
          <td class="px-6 py-4 font-mono text-[10px] text-slate-300">#${code}</td>
          <td class="px-6 py-4">
              <div class="font-black text-slate-700 bulk-item-name transition-all">${name}</div>
              <div class="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">${cat}</div>
          </td>
          <td class="px-6 py-4 text-center font-black text-slate-400">${cost.toFixed(2)}</td>
          <td class="px-4 py-4">
            <input type="number" step="any" min="0" oninput="Movements.handleInput(this)"
                   class="bulk-qty-input w-full h-11 bg-white border border-slate-200 rounded-xl px-3 text-center font-black text-indigo-600 focus:border-indigo-500 outline-none transition-all" 
                   data-code="${code}" data-name="${name}" data-cost="${cost}" placeholder="0.00">
          </td>
          ${showExpiry ? `
            <td class="px-2 py-4"><input type="text" class="bulk-batch-input w-full h-11 border border-slate-200 rounded-lg px-2 text-center text-[10px] font-mono outline-none"></td>
            <td class="px-2 py-4"><input type="date" class="bulk-expiry-input w-full h-11 border border-slate-200 rounded-lg px-2 text-center text-[10px] outline-none"></td>
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
    $("#divReason").toggle(type === "Waste" || type === "Return" || type === "Consumption");
    $("#bulk-entry-ui").html(this.renderBulkTable());
    this.filterBulkTable();
  },

  preview() {
    const isAr = STATE.lang === 'ar';
    const itemsToPreview = [];
    $('.bulk-qty-input').each(function() {
      const q = parseFloat($(this).val()) || 0;
      if (q > 0) {
        const cost = parseFloat($(this).data('cost')) || 0;
        itemsToPreview.push({ code: $(this).data('code'), name: $(this).data('name'), qty: q, total: q * cost });
      }
    });

    if (!itemsToPreview.length) return Swal.fire('Error', isAr ? 'أدخل كميات أولاً!' : 'No entries!', 'warning');

    const rowsHtml = itemsToPreview.map(item => `
        <tr style="border-bottom:1px solid #f1f5f9;">
            <td style="padding:10px; font-family:monospace; color:#94a3b8;">#${item.code}</td>
            <td style="padding:10px; font-weight:800;">${item.name}</td>
            <td style="padding:10px; text-align:center; font-weight:900; color:#6366f1;">${item.qty}</td>
            <td style="padding:10px; text-align:end; font-weight:900; color:#10b981;">${Utils.formatCurrency(item.total)}</td>
        </tr>`).join('');

    Swal.fire({
      width: '700px',
      title: isAr ? '📄 معاينة الحركة' : '📄 Movement Preview',
      html: `
        <div style="direction:${isAr?'rtl':'ltr'}; text-align:start; font-family:sans-serif;">
            <div style="background:#f8fafc; padding:15px; border-radius:10px; margin-bottom:15px; font-size:11px;">
                <b>${isAr?'النوع:':'Type:'}</b> ${$('#txType').val()} | <b>${isAr?'التاريخ:':'Date:'}</b> ${$('#txDate').val()}
            </div>
            <table style="width:100%; border-collapse:collapse; font-size:12px;">
                <thead style="background:#0f172a; color:#fff;">
                    <tr><th style="padding:12px;">CODE</th><th style="padding:12px;">ITEM</th><th style="padding:12px;">QTY</th><th style="padding:12px;">TOTAL</th></tr>
                </thead>
                <tbody>${rowsHtml}</tbody>
            </table>
        </div>
      `
    });
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

    if (!itemsToSave.length) return Swal.fire("Error", "Empty order", "error");

    const data = {
      headers: {
        date: $("#txDate").val(), type, from: $("#txFrom").val(), to: $("#txTo").val(),
        supp: $("#txSupp").val(), ref: $("#txRef").val(), notes: $("#txNotes").val(), reason: $("#txReason").val(),
      },
      items: itemsToSave,
    };

    Utils.loadingProgress(true);
    try {
      await API.call("SAVE_MOVEMENT", data);
      await App.syncData(false);
      Utils.loadingProgress(false);
      this.render();
    } catch (e) {
      Utils.loadingProgress('close');
      Swal.fire("Error", e.toString(), "error");
    }
  }
};
