/**
 * INVENTORY AUDIT & ANALYSIS MODULE
 * Comprehensive Physical Inventory Management
 */
const Audit = {
    render() {
        const items = STATE.db.Items || [];
        const locations = STATE.db.Locations || [];
        const isAr = STATE.lang === 'ar';
        
        document.getElementById('main-content').innerHTML = `
            <div class="space-y-6 animate-fade-in ${isAr ? 'text-right' : 'text-left'}" dir="${isAr ? 'rtl' : 'ltr'}">
                <!-- Header Actions -->
                <div class="flex flex-wrap justify-between items-center gap-4 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div class="flex items-center gap-4">
                        <div class="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                            <i class="fa-solid fa-clipboard-check"></i>
                        </div>
                        <div>
                            <h2 class="text-2xl font-black text-slate-800 tracking-tight">${__('audit_analysis')}</h2>
                            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Physical Inventory vs Theoretical Stock</p>
                        </div>
                    </div>

                    <div class="flex flex-wrap gap-3 items-center">
                        <div class="relative w-64 shadow-sm border border-slate-100 rounded-xl overflow-hidden">
                            <i class="fa-solid fa-location-dot absolute ${isAr ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-300"></i>
                            <select id="auditLoc" class="w-full h-12 ${isAr ? 'pr-10 pl-4' : 'pl-10 pr-4'} bg-slate-50 text-xs font-bold border-none outline-none focus:bg-white transition-all appearance-none cursor-pointer">
                                <option value="">${isAr ? 'اختر المخزن المستهدف...' : 'Select Target Store...'}</option>
                                ${locations.map(l => `<option value="${l[1]}">${l[1]}</option>`).join('')}
                            </select>
                        </div>
                        <button onclick="Audit.saveAudit()" class="h-12 px-8 bg-indigo-600 text-white rounded-[1.25rem] text-xs font-black shadow-xl shadow-indigo-100 hover:bg-slate-900 transition-all flex items-center gap-2">
                            <i class="fa-solid fa-cloud-arrow-up"></i> ${__('save_audit')}
                        </button>
                    </div>
                </div>

                <!-- Guidance Alert -->
                <div class="bg-indigo-50/50 p-5 rounded-3xl border border-indigo-100/50 flex items-start gap-4">
                    <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-500 shadow-sm shrink-0">
                        <i class="fa-solid fa-info-circle text-lg"></i>
                    </div>
                    <div class="flex-1">
                        <h4 class="text-[11px] font-black text-indigo-900 uppercase tracking-widest mb-1">Stock Variance Protocol</h4>
                        <p class="text-[11px] text-indigo-700/70 font-bold leading-relaxed">
                            ${isAr ? 'يرجى إدخال الكميات الفعلية (Actual Count) التي تم حصرها في المتجر. سيقوم النظام آلياً بحساب الفوارق (Variance) ومقارنتها بالرصيد الدفتري المسجل.' : 'Please enter the Physical actual counts. The system will automatically calculate variances against theoretical records.'}
                        </p>
                    </div>
                </div>

                <div class="flex items-center gap-3 px-5 py-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-700 text-xs font-bold mb-4">
                    <i class="fa-solid fa-triangle-exclamation text-amber-500"></i>
                    ${isAr ? 'المستخدم' : 'User'}: <strong>${STATE.user?.name || '-'}</strong>
                    &nbsp;|&nbsp; ${isAr ? 'التاريخ' : 'Date'}: <strong>${Utils.formatDate(new Date())}</strong>
                    &nbsp;|&nbsp; ${isAr ? 'عدد الأصناف' : 'Items'}: <strong>${items.length}</strong>
                </div>

                <div class="flex flex-col sm:flex-row gap-2 relative z-10 shrink-0 mb-4 ${isAr ? 'justify-end' : 'justify-start'}">
                    ${STATE.db.BOH_Sessions && STATE.db.BOH_Sessions.length > 0 ? `
                    <select id="boh-session-picker" onchange="Audit.loadBOHSession(this.value)" class="h-12 bg-white border border-slate-200 text-slate-700 rounded-xl px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm">
                        <option value="">📂 ${isAr ? 'تحميل جلسات جرد سابقة...' : 'Load previous sessions...'}</option>
                        ${STATE.db.BOH_Sessions.map(s => `<option value='${encodeURIComponent(JSON.stringify(s))}'>${s.date} — ${s.branch} — ${s.user}</option>`).join('')}
                    </select>` : ''}
                    <button onclick="Audit.saveBOHCount()" class="h-12 px-8 bg-emerald-500 hover:bg-emerald-400 text-white rounded-[1.25rem] text-xs font-black transition-all flex items-center gap-2 shadow-xl shadow-emerald-100">
                        <i class="fa-solid fa-floppy-disk"></i> ${isAr ? 'حفظ الجرد الفعلي مؤقتاً' : 'Save Partial Count'}
                    </button>
                </div>

                <!-- Analysis Table -->
                <div class="table-container bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
                    <table class="w-full ${isAr ? 'text-right' : 'text-left'} border-collapse" id="audit-table">
                         <thead class="bg-slate-50/80 border-b border-slate-100">
                            <tr>
                                <th class="p-5 text-[10px] font-black text-slate-400 uppercase tracking-tighter">${__('item_name')}</th>
                                <th class="p-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-tighter">${__('theoretical_stock')}</th>
                                <th class="p-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-tighter w-[180px]">${__('actual_count')}</th>
                                <th class="p-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-tighter">${__('variance')}</th>
                                <th class="p-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-tighter">${__('cost')}</th>
                                <th class="p-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-tighter">${__('variance_value')}</th>
                                <th class="p-5 text-[10px] font-black text-slate-400 uppercase tracking-tighter">${__('notes')}</th>
                            </tr>
                        </thead>
                        <tbody id="audit-tbody" class="divide-y divide-slate-50">
                            ${this.renderAuditRows(items)}
                        </tbody>
                        <tfoot class="bg-slate-900 text-white">
                            <tr>
                                <td colspan="3" class="p-5 font-black text-indigo-300 uppercase text-xs tracking-widest">Global Variance Summary</td>
                                <td id="total-variance-qty" class="p-5 text-center font-black text-sm">0.00</td>
                                <td class="p-5"></td>
                                <td id="total-variance-value" class="p-5 text-center font-black text-emerald-400 text-sm">0.00 EGP</td>
                                <td class="p-5"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        `;
    },

    renderAuditRows(items) {
        if(!items.length) return `<tr><td colspan="7" class="text-center py-24 text-slate-300 italic font-bold">No active inventory items discovered</td></tr>`;
        const isEn = STATE.lang === 'en';

        return items.map((item, idx) => {
            const systemQty = parseFloat(item[7]) || 0; // In Stock at index 7
            const cost = parseFloat(item[5]) || 0; // Cost at index 5
            const name = item[3]; // Name at index 3
            return `
                <tr class="audit-row group hover:bg-indigo-50/10 transition-colors" data-code="${item[2]}" data-cost="${cost}">
                    <td class="p-5">
                        <div class="flex flex-col">
                            <span class="font-black text-slate-800 text-sm mb-1 group-hover:text-indigo-600 transition-colors">${name}</span>
                            <span class="text-[9px] font-black text-slate-400 tracking-widest uppercase">CODE: ${item[2]}</span>
                        </div>
                    </td>
                    <td class="text-center font-black text-slate-400 sys-qty p-5 bg-slate-50/30">${systemQty.toFixed(2)}</td>
                    <td class="p-5 text-center">
                        <input type="number" class="w-full h-11 bg-white border-2 border-slate-100 rounded-xl text-center font-black text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/50 transition-all phy-qty shadow-sm" 
                            placeholder="---" onkeyup="Audit.calc(this)">
                    </td>
                    <td class="text-center p-5">
                        <div class="variance-cell font-black text-sm text-slate-300">0.00</div>
                    </td>
                    <td class="text-center font-bold text-slate-500 text-xs p-5">${cost.toFixed(2)}</td>
                    <td class="text-center p-5">
                        <div class="value-cell font-black text-sm text-slate-300">0.00</div>
                    </td>
                    <td class="p-5">
                        <input type="text" class="w-full h-10 bg-slate-50 border border-slate-100 rounded-lg px-4 text-[10px] font-bold text-slate-600 outline-none focus:bg-white audit-notes" 
                            placeholder="...">
                    </td>
                </tr>
            `;
        }).join('');
    },

    calc(el) {
        const row = $(el).closest('tr');
        const sys = parseFloat(row.find('.sys-qty').text()) || 0;
        const phyValue = $(el).val();
        const cost = parseFloat(row.attr('data-cost')) || 0;
        
        if (phyValue === "") {
            row.find('.variance-cell, .value-cell').text("0.00").removeClass('text-rose-600 text-emerald-600').addClass('text-slate-300');
            this.updateTotals();
            return;
        }

        const phy = parseFloat(phyValue) || 0;
        const diff = phy - sys;
        const valDiff = diff * cost;
        
        const vCell = row.find('.variance-cell');
        const valCell = row.find('.value-cell');
        
        vCell.text(diff > 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2)).removeClass('text-slate-300');
        valCell.text(valDiff.toFixed(2) + " EGP").removeClass('text-slate-300');
        
        if(diff < 0) {
            vCell.addClass('text-rose-600').removeClass('text-emerald-600');
            valCell.addClass('text-rose-600').removeClass('text-emerald-600');
        } else if (diff > 0) {
            vCell.addClass('text-emerald-600').removeClass('text-rose-600');
            valCell.addClass('text-emerald-600').removeClass('text-rose-600');
        } else {
             vCell.addClass('text-slate-400').removeClass('text-rose-600 text-emerald-600');
             valCell.addClass('text-slate-400').removeClass('text-rose-600 text-emerald-600');
        }

        this.updateTotals();
    },

    updateTotals() {
        let totalQty = 0;
        let totalVal = 0;
        $('.audit-row').each(function() {
            const vText = $(this).find('.variance-cell').text();
            if (vText !== "0.00" && !$(this).find('.variance-cell').hasClass('text-slate-300')) {
                totalQty += parseFloat(vText) || 0;
                totalVal += parseFloat($(this).find('.value-cell').text()) || 0;
            }
        });
        $('#total-variance-qty').text(totalQty.toFixed(2));
        $('#total-variance-value').text(totalVal.toFixed(2) + " EGP");
    },

    async saveAudit() {
        const location = $('#auditLoc').val();
        if(!location) return Swal.fire(__('warning'), 'Select store location', 'warning');

        const auditData = [];
        $('.audit-row').each(function() {
            const phy = $(this).find('.phy-qty').val();
            if(phy !== "") {
                auditData.push({
                    code: $(this).data('code'),
                    name: $(this).find('.text-sm').text(),
                    sys: $(this).find('.sys-qty').text(),
                    phy: phy,
                    notes: $(this).find('.audit-notes').val(),
                    location: location
                });
            }
        });

        if(!auditData.length) return Swal.fire(__('warning'), 'Enter some counts', 'warning');

        const confirm = await Swal.fire({
            title: __('confirm'),
            text: `Post audit for ${location}?`,
            icon: 'warning',
            showCancelButton: true
        });

        if(confirm.isConfirmed) {
            Utils.loading(true, __('processing'));
            try {
                await API.call('PROCESS_AUDIT', auditData);
                await App.syncData();
                Utils.loading(false);
                Utils.toast(__('success'));
                this.render();
            } catch(e) { 
                Utils.loading(false);
                Swal.fire(__('error'), e.toString(), 'error'); 
            }
        }
    },

    async saveBOHCount() {
        const inputs = document.querySelectorAll('.phy-qty');
        const items = [];
        inputs.forEach(inp => {
            const qty = parseFloat(inp.value);
            if (!isNaN(qty) && inp.value !== '') {
                const tr = inp.closest('tr');
                items.push({
                    code: tr.dataset.code,
                    name: tr.querySelector('.text-sm').innerText,
                    qty: qty
                });
            }
        });

        if (items.length === 0) return Swal.fire(__('warning'), 'Nothing to save', 'warning');

        Utils.loading(true, __('processing'));
        try {
            await API.call('SAVE_BOH_COUNT', { items });
            await App.syncData();
            Utils.toast(__('success'));
            this.render();
        } catch(e) { Swal.fire(__('error'), e.toString(), 'error'); }
        finally { Utils.loading(false); }
    },

    loadBOHSession(encodedSession) {
        if (!encodedSession) return;
        try {
            const session = JSON.parse(decodeURIComponent(encodedSession));
            document.querySelectorAll('.phy-qty').forEach(i => { i.value = ''; Audit.calc(i);});
            let loaded = 0;
            const items = STATE.db.Items || [];
            session.items && Object.entries(session.items).forEach(([itemName, qty]) => {
                const itm = items.find(i=>i[3]===itemName); // Use Name (index 3)
                if(itm) {
                    const input = document.querySelector(`.audit-row[data-code="${itm[2]}"] .phy-qty`);
                    if (input) {
                        input.value = qty;
                        loaded++;
                        Audit.calc(input);
                    }
                }
            });
            Utils.toast(`Loaded ${loaded} items`);
        } catch(e) { console.error(e); }
    }
};
