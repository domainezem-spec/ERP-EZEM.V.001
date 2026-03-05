/**
 * REPORTS MODULE (Enterprise Analytics)
 * Advanced Reporting - Movements with PDF/Excel export
 */
const Reports = {
    render(initialTab = 'sales') {
        const today = new Date().toISOString().split('T')[0];
        const isAr = STATE.lang === 'ar';
        const align = isAr ? 'text-right' : 'text-left';
        const dir = isAr ? 'rtl' : 'ltr';
        
        document.getElementById('main-content').innerHTML = `
            <div class="space-y-8 animate-fade-in ${align}" dir="${dir}">
                <!-- Advanced Header Section -->
                <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    
                    <div class="flex items-center gap-5 relative z-10">
                        <div class="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-[1.8rem] flex items-center justify-center text-2xl shadow-xl shadow-indigo-100">
                            <i class="fa-solid fa-chart-line"></i>
                        </div>
                        <div>
                            <h2 class="text-3xl font-black text-slate-800 tracking-tight">${__('reports_center')}</h2>
                            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">${__('reports_subtitle')}</p>
                        </div>
                    </div>

                    <div class="flex flex-wrap items-center gap-4 relative z-10">
                        <button onclick="Reports.wipeSystemData()" class="h-11 px-5 bg-rose-50 text-rose-600 rounded-2xl text-[10px] font-black border border-rose-100 hover:bg-rose-600 hover:text-white transition-all duration-300 flex items-center gap-2 group">
                            <i class="fa-solid fa-eraser group-hover:rotate-12 transition-transform"></i> ${__('wipe_demo_data')}
                        </button>

                        <button onclick="Reports.runMigration()" class="h-11 px-5 bg-indigo-50 text-indigo-600 rounded-2xl text-[10px] font-black border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all duration-300 flex items-center gap-2 group">
                            <i class="fa-solid fa-link group-hover:rotate-12 transition-transform"></i> ${isAr ? 'ربط الحركات القديمة' : 'Link Old History'}
                        </button>
                        
                        <div class="w-px h-10 bg-slate-100 hidden md:block mx-1"></div>

                        <div class="flex items-center gap-4 bg-slate-50 p-1.5 px-4 rounded-2xl border border-slate-100">
                             <div class="flex flex-col">
                                <span class="text-[8px] font-black text-slate-400 uppercase mb-0.5">${isAr ? 'الشهر' : 'Month'}</span>
                                <select id="rep-month-picker" onchange="Reports.setMonthFilter(this.value)" class="bg-transparent border-none text-[11px] font-black text-slate-700 outline-none w-28 h-5">
                                    <option value="">-- ${isAr ? 'اختر' : 'Pick'} --</option>
                                    ${Array.from({length: 12}, (_, i) => {
                                        const d = new Date(new Date().getFullYear(), i, 1);
                                        const name = d.toLocaleString(STATE.lang, { month: 'long' });
                                        return `<option value="${i}">${name}</option>`;
                                    }).join('')}
                                </select>
                            </div>
                            <div class="w-px h-6 bg-slate-200"></div>
                             <div class="flex flex-col">
                                <span class="text-[8px] font-black text-slate-400 uppercase mb-0.5">${__('from_date')}</span>
                                <input type="date" id="rep-global-from" class="bg-transparent border-none text-[11px] font-black text-slate-700 outline-none w-28 h-5" onchange="Reports.refreshActiveTab()">
                            </div>
                            <div class="w-px h-6 bg-slate-200"></div>
                            <div class="flex flex-col">
                                <span class="text-[8px] font-black text-slate-400 uppercase mb-0.5">${__('to_date')}</span>
                                <input type="date" id="rep-global-to" class="bg-transparent border-none text-[11px] font-black text-slate-700 outline-none w-28 h-5" value="${today}" onchange="Reports.refreshActiveTab()">
                            </div>
                            <button onclick="Reports.refreshActiveTab()" class="w-9 h-9 bg-white text-indigo-600 rounded-xl shadow-sm hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center">
                                <i class="fa-solid fa-rotate text-xs"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Report Tabs -->
                <div class="glass-card">
                    <div class="flex flex-wrap gap-2 mb-8 bg-slate-50 p-2 rounded-2xl">
                        <button onclick="Reports.switchTab('sales')" class="tab-pill ${initialTab==='sales'?'active':''}" id="rep-tab-sales">${__('sales_log_tab')}</button>
                        <button onclick="Reports.switchTab('ops')" class="tab-pill ${initialTab==='ops'?'active':''}" id="rep-tab-ops">${__('ops_log_tab')}</button>
                        <button onclick="Reports.switchTab('beginning')" class="tab-pill ${initialTab==='beginning'?'active':''}" id="rep-tab-beginning">${__('beg_inventory_tab')}</button>
                        <button onclick="Reports.switchTab('recon')" class="tab-pill ${initialTab==='recon'?'active':''}" id="rep-tab-recon">${__('recon_tab')}</button>
                        <button onclick="Reports.switchTab('shifts')" class="tab-pill ${initialTab==='shifts'?'active':''}" id="rep-tab-shifts">${__('shifts_tab')}</button>
                        <button onclick="Reports.switchTab('trxs')" class="tab-pill ${initialTab==='trxs'?'active':''}" id="rep-tab-trxs">${__('trxs_tab')}</button>
                    </div>

                    <div id="rep-content" class="space-y-6">
                        ${initialTab === 'sales' ? this.renderSalesLog() : 
                          initialTab === 'ops' ? this.renderOpsLog() :
                          initialTab === 'beginning' ? this.renderBeginningInventory() :
                          initialTab === 'recon' ? this.renderReconciliation() :
                          initialTab === 'shifts' ? this.renderShiftReport() :
                          this.renderTrxLog()}
                    </div>
                </div>
            </div>
        `;
    },

    refreshActiveTab() {
        const activeTab = $('.tab-pill.active').attr('id').replace('rep-tab-', '');
        this.switchTab(activeTab);
    },

    switchTab(tab) {
        if (this._opsTimeout) clearTimeout(this._opsTimeout);
        if (this._trxTimeout) clearTimeout(this._trxTimeout);
        
        $('.tab-pill').removeClass('active');
        $(`#rep-tab-${tab}`).addClass('active');
        
        let html = '';
        if(tab === 'sales') html = this.renderSalesLog();
        else if(tab === 'ops') html = this.renderOpsLog();
        else if(tab === 'beginning') html = this.renderBeginningInventory();
        else if(tab === 'recon') html = this.renderReconciliation();
        else if(tab === 'shifts') html = this.renderShiftReport();
        else if(tab === 'trxs') html = this.renderTrxLog();
        
        $('#rep-content').html(html);
    },

    setMonthFilter(monthIdx) {
        if (monthIdx === "") return;
        const year = new Date().getFullYear();
        const start = new Date(year, parseInt(monthIdx), 1).toISOString().split('T')[0];
        const end = new Date(year, parseInt(monthIdx) + 1, 0).toISOString().split('T')[0];
        
        $('#rep-global-from').val(start);
        $('#rep-global-to').val(end);
        this.refreshActiveTab();
    },

    renderSalesLog() {
        const from = $('#rep-global-from').val();
        const to = $('#rep-global-to').val();
        let sales = STATE.db.Sales || [];

        if (from) sales = sales.filter(s => s[1].slice(0, 10) >= from);
        if (to)   sales = sales.filter(s => s[1].slice(0, 10) <= to);

        const isAr = STATE.lang === 'ar';
        return `
            <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                     <h3 class="text-xl font-black text-slate-800">${__('sales_log_tab')}</h3>
                     <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">${isAr ? 'سجل المبيعات المسجلة عبر النظام أو يدوياً' : 'Sales log recorded via POS or manually'}</p>
                </div>
                <button onclick="Reports.addManualSale()" class="btn btn-primary h-11 px-6 rounded-xl shadow-lg shadow-indigo-100 flex items-center gap-2 group">
                    <i class="fa-solid fa-plus-circle group-hover:rotate-90 transition-transform"></i>
                    <span class="text-xs font-black uppercase tracking-wider">${isAr ? 'إضافة مبيعات يدوية' : 'Add Manual Sale'}</span>
                </button>
            </div>
            <div class="table-container table-scroll shadow-sm bg-white overflow-x-auto">
                <table class="report-table w-full ${STATE.lang === 'ar' ? 'text-right' : 'text-left'} min-w-[1000px]" id="sales_report-table">
                    <thead>
                        <tr class="bg-slate-50">
                            <th class="cursor-pointer hover:bg-slate-100 transition-colors" onclick="Utils.sortTable('sales_report-table', 0)">ID <i class="fa-solid fa-sort ml-1 text-slate-300"></i></th>
                            <th class="cursor-pointer hover:bg-slate-100 transition-colors" onclick="Utils.sortTable('sales_report-table', 1)">${__('date_time')} <i class="fa-solid fa-sort ml-1 text-slate-300"></i></th>
                            <th class="cursor-pointer hover:bg-slate-100 transition-colors" onclick="Utils.sortTable('sales_report-table', 2)">${__('customer')} <i class="fa-solid fa-sort ml-1 text-slate-300"></i></th>
                            <th class="cursor-pointer hover:bg-slate-100 transition-colors" onclick="Utils.sortTable('sales_report-table', 3)">${__('type')} <i class="fa-solid fa-sort ml-1 text-slate-300"></i></th>
                            <th class="cursor-pointer hover:bg-slate-100 transition-colors" onclick="Utils.sortTable('sales_report-table', 4, true)">${__('value')} <i class="fa-solid fa-sort ml-1 text-slate-300"></i></th>
                            <th class="text-center">${__('payment_details')}</th>
                            <th class="text-center cursor-pointer hover:bg-slate-100 transition-colors" onclick="Utils.sortTable('sales_report-table', 6)">${__('status')} <i class="fa-solid fa-sort ml-1 text-slate-300"></i></th>
                            <th class="text-center">${__('actions')}</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        ${sales.slice().reverse().map(s => {
                            let payments = '-';
                            try { 
                                const pJson = JSON.parse(s[7] || '{}');
                                payments = Object.entries(pJson)
                                    .filter(([k,v]) => v > 0)
                                    .map(([k,v]) => `<span class="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 text-[10px] ml-1">${k}: ${v}</span>`)
                                    .join('');
                            } catch(e) {}

                            return `
                                <tr class="hover:bg-indigo-50/10 transition-colors group">
                                    <td class="font-mono text-[10px] text-slate-400">#${s[0].slice(-6)}</td>
                                    <td class="text-[10px] text-slate-800 font-bold">${s[1]}</td>
                                    <td class="text-[11px] font-black text-indigo-600">${s[8] || __('walk_in_guest')}</td>
                                    <td><span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">${s[9] || __('walk_in')}</span></td>
                                    <td class="font-black text-slate-900">${Utils.formatCurrency(s[2])}</td>
                                    <td class="wrap-text"><div class="flex flex-wrap gap-1 justify-center">${payments}</div></td>
                                    <td class="text-center">
                                        <span class="px-3 py-1 rounded-full text-[10px] font-black ${s[5] === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}">
                                            ${s[5] === 'Completed' ? __('completed').toUpperCase() : __('cancelled').toUpperCase()}
                                        </span>
                                    </td>
                                    <td class="text-center">
                                        <div class="flex items-center justify-center gap-2 opacity-20 group-hover:opacity-100 transition-opacity">
                                            <button onclick="Reports.editSale('${s[0]}')" class="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all"><i class="fa-solid fa-pen text-[9px]"></i></button>
                                            <button onclick="Reports.deleteSale('${s[0]}')" class="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all"><i class="fa-solid fa-trash text-[9px]"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    updateOpsView() {
        if (this._opsTimeout) clearTimeout(this._opsTimeout);
        this._opsTimeout = setTimeout(() => {
            const input = $('#ops-search');
            let selection = null;
            if (input.length && input.is(':focus')) {
                selection = { start: input[0].selectionStart, end: input[0].selectionEnd };
            }

            const currentHtml = this.renderOpsLog();
            $('#rep-content').html(currentHtml);

            if (selection) {
                const newInput = $('#ops-search');
                if (newInput.length) {
                    newInput.focus();
                    newInput[0].setSelectionRange(selection.start, selection.end);
                }
            }
        }, 200);
    },

    renderOpsLog() {
        const isAr = STATE.lang === 'ar';
        const from = $('#rep-global-from').val();
        const to = $('#rep-global-to').val();
        const search = ($('#ops-search').val() || '').toLowerCase();
        let logs = (STATE.db.System_Logs || []).map((l, i) => ({ data: l, row: i + 2 }));

        if (from || to) {
            logs = logs.filter(l => {
                let logDate = '';
                try {
                    const d = new Date(l.data[0]);
                    if (!isNaN(d)) logDate = d.toISOString().split('T')[0];
                } catch(e) {}
                if (!logDate) return true; // If invalid date, keep it or skip? Let's keep it if no filter, or maybe skip? Actually just return true if no filters.
                return (!from || logDate >= from) && (!to || logDate <= to);
            });
        }

        if (search) {
            logs = logs.filter(l => 
                (String(l.data[1] || '')).toLowerCase().includes(search) || 
                (String(l.data[2] || '')).toLowerCase().includes(search) || 
                (String(l.data[3] || '')).toLowerCase().includes(search)
            );
        }

        const getBadgeClass = (action) => {
            action = (action || '').toUpperCase();
            if (action.includes('DELETE') || action.includes('WIPE')) return 'bg-rose-50 text-rose-600 border-rose-100';
            if (action.includes('UPDATE') || action.includes('EDIT')) return 'bg-amber-50 text-amber-600 border-amber-100';
            if (action.includes('LOGIN')) return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            if (action.includes('SAVE') || action.includes('UPLOAD')) return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            return 'bg-slate-50 text-slate-500 border-slate-100';
        };

        return `
            <div class="space-y-4">
                <div class="flex items-center justify-between mb-4">
                    <div class="relative flex-1 max-w-md">
                        <i class="fa-solid fa-magnifying-glass absolute ${STATE.lang === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-300 text-xs"></i>
                        <input type="text" id="ops-search" oninput="Reports.updateOpsView()" 
                               class="w-full h-11 ${STATE.lang === 'ar' ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'} bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all" 
                               placeholder="${__('ops_search_placeholder')}" value="${search || ''}">
                    </div>
                    <div class="flex items-center gap-2 ${STATE.lang === 'ar' ? 'mr-3' : 'ml-3'}">
                        <span class="text-[10px] font-black text-slate-400 uppercase">${isAr ? 'إجمالي:' : 'Total:'} <span class="text-indigo-600 font-black">${logs.length}</span></span>
                        <button onclick="Utils.exportToCSV('ops-report-table', 'Operations_Log')" class="h-9 px-4 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-black border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-1.5">
                            <i class="fa-solid fa-file-excel"></i> Excel
                        </button>
                    </div>
                </div>

                <!-- Operations Summary (Consumption & Manual Adjustment) -->
                ${(() => {
                    const consumptionTotal = (STATE.db.Sales || [])
                        .filter(s => (!from || s[1].slice(0,10) >= from) && (!to || s[1].slice(0,10) <= to))
                        .length;
                    
                    const manualTotalVal = Object.values(Reconciliation.manualQty || {}).reduce((s, v) => s + (parseFloat(v) || 0), 0);
                    
                    return `
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                            <div class="bg-indigo-600 p-5 rounded-2xl text-white shadow-lg shadow-indigo-100">
                                <div class="text-[9px] font-black opacity-60 uppercase tracking-widest mb-1">${isAr ? 'إجمالي حركات الاستهلاك' : 'Total Consumption Moves'}</div>
                                <div class="text-2xl font-black">${consumptionTotal} <span class="text-[10px] opacity-50 uppercase">${isAr ? 'طلب' : 'Orders'}</span></div>
                            </div>
                            <div class="bg-amber-500 p-5 rounded-2xl text-white shadow-lg shadow-amber-100">
                                <div class="text-[9px] font-black opacity-60 uppercase tracking-widest mb-1">${isAr ? 'سجلات النظام' : 'System Log Entries'}</div>
                                <div class="text-2xl font-black">${logs.length}</div>
                            </div>
                            <div class="bg-slate-800 p-5 rounded-2xl text-white shadow-lg shadow-slate-100">
                                <div class="text-[9px] font-black opacity-60 uppercase tracking-widest mb-1">${isAr ? 'الفترة الزمنية' : 'Report Period'}</div>
                                <div class="text-sm font-black truncate">${from || '---'} / ${to || '---'}</div>
                            </div>
                        </div>
                    `;
                })()}

                <div class="table-container table-scroll shadow-sm bg-white overflow-hidden border border-slate-100 rounded-2xl">
                    <table class="report-table w-full ${STATE.lang === 'ar' ? 'text-right' : 'text-left'}" id="ops-report-table">
                        <thead>
                            <tr class="bg-slate-900 text-white text-[9px] uppercase tracking-widest">
                                <th class="p-3 text-center font-black text-slate-500 w-10">#</th>
                                <th class="p-3 font-black text-slate-300 cursor-pointer hover:bg-slate-800 transition-colors" onclick="Utils.sortTable('ops-report-table', 1)">${__('date')} <i class="fa-solid fa-sort ml-1 text-slate-600"></i></th>
                                <th class="p-3 font-black text-indigo-400 cursor-pointer hover:bg-slate-800 transition-colors" onclick="Utils.sortTable('ops-report-table', 2)">${isAr ? 'الوقت' : 'Time'} <i class="fa-solid fa-sort ml-1 text-slate-600"></i></th>
                                <th class="p-3 font-black text-slate-300 cursor-pointer hover:bg-slate-800 transition-colors" onclick="Utils.sortTable('ops-report-table', 3)">${__('user')} <i class="fa-solid fa-sort ml-1 text-slate-600"></i></th>
                                <th class="p-3 font-black text-slate-300 cursor-pointer hover:bg-slate-800 transition-colors" onclick="Utils.sortTable('ops-report-table', 4)">${__('type')} <i class="fa-solid fa-sort ml-1 text-slate-600"></i></th>
                                <th class="p-3 font-black text-slate-300">${__('notes')}</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-50 text-[11px]">
                            ${logs.slice().reverse().map((l, idx) => {
                                const dt = new Date(l.data[0]);
                                let timeStr = '--:--';
                                let dateStr = '---';
                                let isoDate = '---';
                                
                                if (!isNaN(dt.getTime())) {
                                    timeStr = dt.toLocaleTimeString(STATE.lang === 'ar' ? 'ar-EG' : 'en-US', {hour: '2-digit', minute:'2-digit'});
                                    dateStr = dt.toLocaleDateString(STATE.lang === 'ar' ? 'ar-EG' : 'en-US', {day:'2-digit', month:'short', year:'numeric'});
                                    isoDate = dt.toISOString().split('T')[0];
                                }
                                
                                return `
                                    <tr class="hover:bg-indigo-50/40 transition-colors group">
                                        <td class="p-3 text-center text-slate-500 font-mono text-[10px] border-b border-slate-100">${idx + 1}</td>
                                        <td class="p-3 border-b border-slate-100">
                                            <div class="font-black text-slate-900 text-[11px]">${dateStr}</div>
                                            <div class="text-[9px] text-slate-500 font-black font-mono">${isoDate}</div>
                                        </td>
                                        <td class="p-3 border-b border-slate-100">
                                            <span class="font-black text-indigo-700 text-[11px] bg-indigo-100 px-2 py-1 rounded-lg border border-indigo-200">${timeStr}</span>
                                        </td>
                                        <td class="p-3 border-b border-slate-100">
                                            <div class="flex items-center gap-2">
                                                <div class="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                                                    <i class="fa-solid fa-user text-[10px]"></i>
                                                </div>
                                                <span class="font-black text-slate-900 text-[12px]">${l.data[1] || '-'}</span>
                                            </div>
                                        </td>
                                        <td class="p-3 border-b border-slate-100">
                                            <span class="px-3 py-1.5 rounded-lg border-2 font-black text-[10px] shadow-sm uppercase ${getBadgeClass(l.data[2])}">
                                                ${l.data[2] || '-'}
                                            </span>
                                        </td>
                                        <td class="p-3 border-b border-slate-100">
                                            <div class="flex items-center justify-between gap-3">
                                                <p class="text-slate-800 font-black leading-relaxed max-w-lg truncate group-hover:whitespace-normal group-hover:overflow-visible transition-all text-[11px]">
                                                    ${l.data[3] || '-'}
                                                </p>
                                                ${Auth.canEdit() ? `<button onclick="Reports.deleteByRow('System_Logs', ${l.row})" class="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 border border-rose-200 hover:bg-rose-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-sm shrink-0 flex items-center justify-center"><i class="fa-solid fa-trash text-[11px]"></i></button>` : ''}
                                            </div>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                            ${logs.length === 0 ? `<tr><td colspan="6" class="text-center py-24 text-slate-300 italic">${__('no_logs_found')}</td></tr>` : ''}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    renderShiftReport() {
        const from = $('#rep-global-from').val();
        const to = $('#rep-global-to').val();
        let shifts = (STATE.db.Shifts || []).map((s, i) => ({ data: s, row: i + 2 }));

        if (from || to) {
            shifts = shifts.filter(s => {
                const sDate = new Date(s.data[2]).toISOString().split('T')[0];
                const isAfter = !from || sDate >= from;
                const isBefore = !to || sDate <= to;
                return isAfter && isBefore;
            });
        }

        return `
            <div class="table-container table-scroll shadow-sm bg-white">
                <table class="report-table w-full ${STATE.lang === 'ar' ? 'text-right' : 'text-left'}" id="shifts-report-table">
                    <thead>
                        <tr>
                            <th class="cursor-pointer hover:bg-slate-100 transition-colors" onclick="Utils.sortTable('shifts-report-table', 0)">${__('shift_code')} <i class="fa-solid fa-sort ml-1 text-slate-300"></i></th>
                            <th class="cursor-pointer hover:bg-slate-100 transition-colors" onclick="Utils.sortTable('shifts-report-table', 1)">${__('user')} <i class="fa-solid fa-sort ml-1 text-slate-300"></i></th>
                            <th class="cursor-pointer hover:bg-slate-100 transition-colors" onclick="Utils.sortTable('shifts-report-table', 2)">${__('opened_closed')} <i class="fa-solid fa-sort ml-1 text-slate-300"></i></th>
                            <th class="cursor-pointer hover:bg-slate-100 transition-colors" onclick="Utils.sortTable('shifts-report-table', 3, true)">${__('recorded_sales')} <i class="fa-solid fa-sort ml-1 text-slate-300"></i></th>
                            <th class="cursor-pointer hover:bg-slate-100 transition-colors" onclick="Utils.sortTable('shifts-report-table', 4, true)">${__('supplied_amount')} <i class="fa-solid fa-sort ml-1 text-slate-300"></i></th>
                            <th class="text-center cursor-pointer hover:bg-slate-100 transition-colors" onclick="Utils.sortTable('shifts-report-table', 5, true)">${__('diff_amount')} <i class="fa-solid fa-sort ml-1 text-slate-300"></i></th>
                            <th class="text-center cursor-pointer hover:bg-slate-100 transition-colors" onclick="Utils.sortTable('shifts-report-table', 6)">${__('status')} <i class="fa-solid fa-sort ml-1 text-slate-300"></i></th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        ${shifts.map(sh => {
                            const s = sh.data;
                            const sales = parseFloat(s[6]) || 0;
                            const count = parseFloat(s[5]) || 0;
                            const diff = count - sales;
                            const diffColor = Math.abs(diff) < 1 ? 'text-emerald-500' : (diff > 0 ? 'text-amber-500' : 'text-rose-500');
                            return `
                                <tr class="hover:bg-slate-50 group">
                                    <td class="font-mono text-[10px] font-bold text-slate-400 flex items-center gap-2">
                                        ${Auth.canEdit() ? `<button onclick="Reports.deleteByRow('Shifts', ${sh.row})" class="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"><i class="fa-solid fa-trash text-[8px]"></i></button>` : ''}
                                        ${s[0]}
                                    </td>
                                    <td class="font-bold text-slate-700">${s[1]}</td>
                                    <td class="text-[10px] text-slate-400">
                                        <div><i class="fa-solid fa-door-open text-emerald-400 mr-1"></i> ${new Date(s[2]).toLocaleString('ar-EG')}</div>
                                        ${s[4] ? `<div><i class="fa-solid fa-door-closed text-rose-400 mr-1"></i> ${new Date(s[4]).toLocaleString('ar-EG')}</div>` : ''}
                                    </td>
                                    <td class="font-black text-slate-900">${Utils.formatCurrency(sales)}</td>
                                    <td class="font-black text-blue-600">${Utils.formatCurrency(count)}</td>
                                    <td class="text-center font-black ${diffColor}">${Utils.formatCurrency(diff)}</td>
                                    <td class="text-center">
                                        <span class="px-3 py-1 rounded-full text-[10px] font-bold ${s[7] === 'Open' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}">
                                            ${s[7] === 'Open' ? __('open') : __('closed')}
                                        </span>
                                    </td>
                                </tr>
                            `;
                        }).reverse().join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    renderTrxLog() {
        try {
            const isAr      = STATE.lang === 'ar';
            const movements = STATE.db.Movements || [];
            const items     = STATE.db.Items || [];

            const fromDate  = $('#rep-global-from').val() || '';
            const toDate    = $('#rep-global-to').val()   || '';
            const typeFilter= $('#trx-filter-type').val()  || 'All';
            const fromLocFilter = $('#trx-filter-from-loc').val() || 'All';
            const toLocFilter   = $('#trx-filter-to-loc').val()   || 'All';
            const search    = ($('#trx-search').val()      || '').toLowerCase().trim();

            // Safe location gathering
            const locSet = new Set();
            movements.forEach(m => {
                if (m[9] && m[9] !== '-')  locSet.add(m[9]);
                if (m[10] && m[10] !== '-') locSet.add(m[10]);
            });
            const allLocs = Array.from(locSet).sort();

            let filtered = movements;
            if(fromDate)                filtered = filtered.filter(m => m[0] >= fromDate);
            if(toDate)                  filtered = filtered.filter(m => m[0] <= toDate);
            if(typeFilter !== 'All')    filtered = filtered.filter(m => m[1] === typeFilter);
            if(fromLocFilter !== 'All') filtered = filtered.filter(m => m[9] === fromLocFilter);
            if(toLocFilter !== 'All')   filtered = filtered.filter(m => m[10] === toLocFilter);
            
            if(search) {
                filtered = filtered.filter(m => {
                    const name = String(m[3] || '').toLowerCase(); 
                    const code = String(m[2] || '').toLowerCase(); 
                    const date = String(m[0] || '').toLowerCase();
                    return name.includes(search) || code.includes(search) || date.includes(search);
                });
            }

            // KPIs
            const totalCost  = filtered.reduce((s, m) => s + (parseFloat(m[6]) || 0), 0);
            const itemCount  = new Set(filtered.map(m => String(m[3]))).size;

            const typeLabels = {
                'Receiving':           __('Receiving') || 'Receiving',
                'Waste':               __('Waste') || 'Waste',
                'Transfer Out':        __('Transfer Out') || 'Transfer Out',
                'Transfer In':         __('Transfer In') || 'Transfer In',
                'Return':              __('Return') || 'Return',
                'Purchasing':          __('Purchasing') || 'Purchasing',
                'Beginning Inventory': __('Beginning Inventory') || 'Beg Inventory'
            };

            const typeColors = {
                'Receiving':           'bg-emerald-50 text-emerald-600 border-emerald-200',
                'Waste':               'bg-rose-50 text-rose-600 border-rose-200',
                'Transfer Out':        'bg-amber-50 text-amber-600 border-amber-200',
                'Transfer In':         'bg-blue-50 text-blue-600 border-blue-200',
                'Return':              'bg-purple-50 text-purple-600 border-purple-200',
                'Purchasing':          'bg-indigo-50 text-indigo-600 border-indigo-200',
                'Beginning Inventory': 'bg-slate-100 text-slate-800 border-slate-300',
            };

            const canEdit = (typeof Auth !== 'undefined' && Auth.canEdit && Auth.canEdit());

            return `
                <div class="space-y-6">
                    <!-- FILTERS -->
                    <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                        <div class="flex flex-wrap gap-4 items-end">
                            <div>
                                <label class="nav-label p-0 mb-1 text-[10px]">${__('trx_type')}</label>
                                <select id="trx-filter-type" class="input-premium h-11 w-44" onchange="Reports.updateTrxView()">
                                    <option value="All" ${typeFilter==='All'?'selected':''}>-- ${__('all')} --</option>
                                    ${Object.keys(typeLabels).map(k => `<option value="${k}" ${typeFilter===k?'selected':''}>${typeLabels[k]}</option>`).join('')}
                                </select>
                            </div>
                            <div>
                                <label class="nav-label p-0 mb-1 text-[10px]">${__('from_loc')}</label>
                                <select id="trx-filter-from-loc" class="input-premium h-11 w-40" onchange="Reports.updateTrxView()">
                                    <option value="All" ${fromLocFilter==='All'?'selected':''}>-- ${__('all')} --</option>
                                    ${allLocs.map(l => `<option value="${l}" ${fromLocFilter===l?'selected':''}>${l}</option>`).join('')}
                                </select>
                            </div>
                            <div>
                                <label class="nav-label p-0 mb-1 text-[10px]">${__('to_loc')}</label>
                                <select id="trx-filter-to-loc" class="input-premium h-11 w-40" onchange="Reports.updateTrxView()">
                                    <option value="All" ${toLocFilter==='All'?'selected':''}>-- ${__('all')} --</option>
                                    ${allLocs.map(l => `<option value="${l}" ${toLocFilter===l?'selected':''}>${l}</option>`).join('')}
                                </select>
                            </div>
                            <div class="flex-1 flex justify-end gap-2">
                                <button onclick="Reports.printMovementReport()" class="btn btn-primary h-11 px-5 rounded-xl"><i class="fa-solid fa-file-pdf"></i> PDF</button>
                                <button onclick="Utils.exportToCSV('trx-report-table','Movements')" class="btn btn-outline h-11 px-5 rounded-xl"><i class="fa-solid fa-file-excel text-emerald-600"></i> Excel</button>
                            </div>
                        </div>
                        <div class="relative">
                            <i class="fa-solid fa-magnifying-glass absolute ${isAr ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                            <input type="text" id="trx-search" class="input-premium h-11 ${isAr ? 'pr-11' : 'pl-11'}" placeholder="${__('trx_search_placeholder')}" value="${search}" oninput="Reports.updateTrxView()">
                        </div>
                    </div>

                    <!-- KPIs -->
                    <div class="grid grid-cols-3 gap-4">
                        <div class="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 shadow-sm">
                            <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg"><i class="fa-solid fa-right-left"></i></div>
                            <div>
                                <div class="text-[10px] font-black text-slate-400 uppercase mb-0.5">${__('total_trxs')}</div>
                                <div class="text-2xl font-black text-slate-900">${filtered.length}</div>
                            </div>
                        </div>
                        <div class="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 shadow-sm">
                            <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg"><i class="fa-solid fa-boxes-stacked"></i></div>
                            <div>
                                <div class="text-[10px] font-black text-slate-400 uppercase mb-0.5">${__('items_count_label')}</div>
                                <div class="text-2xl font-black text-slate-900">${itemCount}</div>
                            </div>
                        </div>
                        <div class="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 shadow-sm">
                            <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg"><i class="fa-solid fa-sack-dollar"></i></div>
                            <div>
                                <div class="text-[10px] font-black text-slate-400 uppercase mb-0.5">${__('total_cost_label')}</div>
                                <div class="text-xl font-black text-emerald-600">${Utils.formatCurrency(totalCost)}</div>
                            </div>
                        </div>
                    </div>

                    <!-- TABLE -->
                    <div class="table-container table-scroll custom-scrollbar shadow-sm bg-white overflow-x-auto">
                        <table class="report-table w-full ${isAr ? 'text-right' : 'text-left'}" id="trx-report-table">
                            <thead>
                                <tr class="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                    <th class="py-4 px-3 text-center">#</th>
                                    <th class="py-4 px-3 cursor-pointer" onclick="Utils.sortTable('trx-report-table', 1)">${__('date')}</th>
                                    <th class="py-4 px-3 cursor-pointer" onclick="Utils.sortTable('trx-report-table', 2)">${__('trx_type')}</th>
                                    <th class="py-4 px-3 cursor-pointer" onclick="Utils.sortTable('trx-report-table', 3)">${isAr ? 'الكود' : 'Code'}</th>
                                    <th class="py-4 px-3 cursor-pointer" onclick="Utils.sortTable('trx-report-table', 4)">${__('item_name')}</th>
                                    <th class="py-4 px-3 text-center cursor-pointer" onclick="Utils.sortTable('trx-report-table', 5, true)">${__('qty')}</th>
                                    <th class="py-4 px-3 text-center cursor-pointer" onclick="Utils.sortTable('trx-report-table', 6, true)">${__('cost_unit')}</th>
                                    <th class="py-4 px-3 text-center cursor-pointer" onclick="Utils.sortTable('trx-report-table', 7, true)">${__('total_label')}</th>
                                    <th class="py-4 px-3">${isAr ? 'التشغيلة / الصلاحية' : 'Batch/Expiry'}</th>
                                    <th class="py-4 px-3">${__('from')}</th>
                                    <th class="py-4 px-3">${__('to')}</th>
                                    <th class="py-4 px-3">${__('user')}</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 text-xs">
                                ${filtered.length > 0 
                                    ? filtered.slice().reverse().map((m, idx) => {
                                        const rowIdx = movements.indexOf(m) + 2;
                                        return `
                                            <tr class="hover:bg-slate-50 group">
                                                <td class="text-slate-300 font-mono text-center">
                                                    ${canEdit ? `
                                                        <button onclick="Reports.editMovement(${rowIdx})" class="w-6 h-6 rounded bg-indigo-50 text-indigo-600 opacity-0 group-hover:opacity-100 transition-all"><i class="fa-solid fa-pen text-[8px]"></i></button>
                                                        <button onclick="Reports.deleteByRow('Movements', ${rowIdx})" class="w-6 h-6 rounded bg-rose-50 text-rose-600 opacity-0 group-hover:opacity-100 transition-all"><i class="fa-solid fa-trash text-[8px]"></i></button>
                                                    ` : ''}
                                                    <span class="ml-1">${idx + 1}</span>
                                                </td>
                                                <td class="font-bold px-3">${Utils.formatDate(m[0])}
                                                    <div class="text-[9px] text-slate-400 font-mono">${(m[16] && !isNaN(new Date(m[16]))) ? new Date(m[16]).toLocaleTimeString('ar-EG', {hour:'2-digit', minute:'2-digit'}) : ''}</div>
                                                </td>
                                                <td class="px-3">
                                                    <span class="px-2 py-0.5 rounded font-bold text-[9px] border ${typeColors[m[1]] || 'bg-slate-50 text-slate-600'}">
                                                        ${typeLabels[m[1]] || m[1]}
                                                    </span>
                                                </td>
                                                <td class="px-3 font-mono text-indigo-400">${m[2] || '-'}</td>
                                                <td class="px-3 font-black text-slate-700">${m[3]}</td>
                                                <td class="px-3 text-center font-black">${m[4]}</td>
                                                <td class="px-3 text-center text-slate-500">${Utils.formatCurrency(parseFloat(m[5]) || 0)}</td>
                                                <td class="px-3 text-center font-black text-indigo-600">${Utils.formatCurrency(parseFloat(m[6]) || 0)}</td>
                                                <td class="px-3">
                                                    <div class="text-[10px] font-bold text-slate-400">${m[7] || '-'}</div>
                                                    <div class="text-[9px] font-black text-rose-400">${m[8] || ''}</div>
                                                </td>
                                                <td class="px-3 text-slate-400">${m[9] || '-'}</td>
                                                <td class="px-3 text-slate-400">${m[10] || '-'}</td>
                                                <td class="px-3 text-indigo-400 font-bold">${m[11] || '-'}</td>
                                            </tr>
                                        `;
                                    }).join('')
                                    : `<tr><td colspan="12" class="text-center py-20 text-slate-300 italic">${__('no_trxs_found')}</td></tr>`
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        } catch (e) {
            console.error("renderTrxLog Error:", e);
            return `<div class="p-20 text-center"><div class="text-rose-500 font-black mb-2">Error Rendering Movements</div><div class="text-xs text-slate-400">${e.message}</div></div>`;
        }
    },

    async addManualSale() {
        const isAr = STATE.lang === 'ar';
        const { value: formValues } = await Swal.fire({
            title: isAr ? 'إضافة مبيعات يدوية' : 'Add Manual Sale',
            html: `
                <div class="space-y-4 text-left" dir="${isAr ? 'rtl' : 'ltr'}">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="col-span-2">
                            <label class="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">${isAr ? 'التاريخ' : 'Date'}</label>
                            <input type="date" id="man-sale-date" class="swal2-input !m-0 !w-full" value="${new Date().toISOString().split('T')[0]}">
                        </div>
                        <div class="col-span-2">
                             <label class="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">${isAr ? 'اسم العميل / البيان' : 'Customer / Description'}</label>
                             <input type="text" id="man-sale-cust" class="swal2-input !m-0 !w-full" placeholder="${isAr ? 'مثلاً: عميل عام' : 'e.g. Walk-in'}">
                        </div>
                        <div class="col-span-1">
                            <label class="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">${isAr ? 'المبلغ الكلي' : 'Total Amount'}</label>
                            <input type="number" id="man-sale-total" class="swal2-input !m-0 !w-full" placeholder="0.00">
                        </div>
                        <div class="col-span-1">
                            <label class="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">${isAr ? 'طريقة الدفع' : 'Payment'}</label>
                            <select id="man-sale-pay" class="swal2-select !m-0 !w-full">
                                <option value="Cash">${isAr ? 'كاش' : 'Cash'}</option>
                                <option value="Visa">${isAr ? 'فيزا' : 'Visa'}</option>
                                <option value="Mixed">${isAr ? 'مختلط' : 'Mixed'}</option>
                            </select>
                        </div>
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: isAr ? 'حفظ العملية' : 'Post Sale',
            confirmButtonColor: '#4f46e5',
            preConfirm: () => {
                const total = parseFloat(document.getElementById('man-sale-total').value);
                if (!total) { Swal.showValidationMessage(isAr ? 'يرجى إدخال المبلغ' : 'Please enter amount'); return false; }
                return {
                    date: document.getElementById('man-sale-date').value,
                    cust: document.getElementById('man-sale-cust').value || 'Manual Entry',
                    total: total,
                    pay: document.getElementById('man-sale-pay').value
                }
            }
        });

        if (formValues) {
            Utils.loading(true);
            try {
                const data = {
                    total: formValues.total,
                    cart: [], // Manual entry usually doesn't explode items
                    payments: { [formValues.pay]: formValues.total },
                    customer: formValues.cust,
                    orderType: 'Manual',
                    manualDate: formValues.date
                };
                await API.call('PROCESS_SALE', data);
                await App.syncData(true);
                this.refreshActiveTab();
                Utils.toast(isAr ? 'تم تسجيل العملية بنجاح' : 'Sale registered successfully');
            } catch (e) {
                Swal.fire('Error', e.toString(), 'error');
            } finally {
                Utils.loading(false);
            }
        }
    },

    updateTrxView() {
        if (this._trxTimeout) clearTimeout(this._trxTimeout);
        this._trxTimeout = setTimeout(() => {
            const input = $('#trx-search');
            let selection = null;
            if (input.length && input.is(':focus')) {
                selection = { start: input[0].selectionStart, end: input[0].selectionEnd };
            }

            const currentHtml = this.renderTrxLog();
            $('#rep-content').html(currentHtml);

            if (selection) {
                const newInput = $('#trx-search');
                if (newInput.length) {
                    newInput.focus();
                    newInput[0].setSelectionRange(selection.start, selection.end);
                }
            }
        }, 200);
    },

    printMovementReport() {
        const type   = $('#trx-filter-type').val() || 'All';
        const from   = $('#trx-filter-from').val() || 'البداية';
        const to     = $('#trx-filter-to').val()   || 'اليوم';
        const search = $('#trx-search').val()       || '';
        const isAr = STATE.lang === 'ar';
        const typeLabels = {
            'All': __('all'), 
            'Receiving': __('Receiving') || 'Receiving',
            'Purchasing': __('Purchasing') || 'Purchasing', 
            'Waste': __('Waste') || 'Waste',
            'Transfer Out': __('Transfer Out') || 'Transfer Out', 
            'Transfer In': __('Transfer In') || 'Transfer In',
            'Return': __('Return') || 'Return',
            'Beginning Inventory': __('beg_inventory_report')
        };

        const tableEl = document.getElementById('trx-report-table');
        if(!tableEl) return;

        // Build clean clone without badge HTML – plain text for print
        const rows = Array.from(tableEl.querySelectorAll('tbody tr, tfoot tr')).map(r =>
            `<tr>${Array.from(r.cells).map(c => `<td>${c.innerText}</td>`).join('')}</tr>`
        ).join('');

        const headerRow = Array.from(tableEl.querySelectorAll('thead th'))
            .map(th => `<th>${th.innerText}</th>`).join('');

        const win = window.open('', '_blank', 'height=900,width=1100');
        win.document.write(`
<!DOCTYPE html>
<html lang="${STATE.lang}" dir="${isAr ? 'rtl' : 'ltr'}">
<head>
<meta charset="UTF-8">
<title>${isAr ? 'تقرير حركات المخزن' : 'Stock Movements Report'}</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; }
  body  { font-family: 'Cairo', sans-serif; background: #fff; color: #1e293b; padding: 32px 40px; }

  /* === HEADER === */
  .report-header { display: flex; align-items: center; justify-content: space-between; border-bottom: 4px solid #4f46e5; padding-bottom: 20px; margin-bottom: 24px; }
  .report-header .brand-logo { width: 64px; height: 64px; background: linear-gradient(135deg, #4f46e5, #6366f1); border-radius: 16px; display: flex; align-items: center; justify-content: center; }
  .report-header .brand-logo img { width: 52px; height: 52px; object-fit: contain; }
  .report-header .brand-logo .logo-fallback { color: #fff; font-weight: 900; font-size: 18px; letter-spacing: -1px; }
  .report-header .brand-info { flex: 1; padding-right: 16px; }
  .report-header .brand-info h1 { font-size: 22px; font-weight: 900; color: #4f46e5; margin-bottom: 2px; }
  .report-header .brand-info p  { font-size: 13px; color: #64748b; }
  .report-header .report-meta   { text-align: left; font-size: 11px; color: #64748b; line-height: 1.8; }

  /* === KPI SUMMARY === */
  .kpi-row { display: flex; gap: 16px; margin-bottom: 24px; }
  .kpi-card { flex: 1; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 18px; }
  .kpi-card .label { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; color: #94a3b8; margin-bottom: 4px; }
  .kpi-card .value { font-size: 20px; font-weight: 900; color: #1e293b; }
  .kpi-card.green  .value { color: #059669; }

  /* === TABLE === */
  table  { width: 100%; border-collapse: collapse; font-size: 11px; }
  thead  { background: #0f172a; color: #f8fafc; }
  th     { padding: 11px 12px; font-weight: 800; text-align: right; font-size: 10px; letter-spacing: 0.05em; }
  td     { padding: 9px 12px; border-bottom: 1px solid #f1f5f9; }
  tr:nth-child(even) td { background: #fafafa; }
  tfoot  { background: #f1f5f9; }
  tfoot td { font-weight: 900; border-top: 2px solid #e2e8f0; color: #059669; font-size: 12px; }

  /* === FOOTER === */
  .report-footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 14px; display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #94a3b8; font-weight: 700; }
  .report-footer .stamp { background: #f1f5f9; border-radius: 10px; padding: 6px 14px; }

  @media print {
    body { padding: 16px; }
    .no-print { display: none !important; }
  }
</style>
</head>
<body>

<!-- ========== REPORT HEADER ========== -->
<div class="report-header">
  <div class="brand-logo">
    <img src="assets/icon-192x192.png.ico" alt="EZEM" onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
    <div class="logo-fallback" style="display:none">EZ</div>
  </div>
  <div class="brand-info">
    <h1>EZEM PRO ERP &ndash; ${isAr ? 'تقرير حركات المخزن' : 'Stock Movements Report'}</h1>
    <p>${isAr ? 'نوع التقرير' : 'Report Type'}: <strong>${typeLabels[type] || type}</strong> ${search ? `&ndash; ${isAr ? 'بحث' : 'Search'}: "${search}"` : ''}</p>
  </div>
  <div class="report-meta">
    <div>${isAr ? 'الفترة' : 'Period'}: <strong>${from}</strong> ${isAr ? 'إلى' : 'to'} <strong>${to}</strong></div>
    <div>${isAr ? 'تاريخ الاستخراج' : 'Exported on'}: <strong>${new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-US')}</strong></div>
    <div>${isAr ? 'الوقت' : 'Time'}: <strong>${new Date().toLocaleTimeString(isAr ? 'ar-EG' : 'en-US')}</strong></div>
  </div>
</div>

<!-- ========== KPI SUMMARY ========== -->
<div class="kpi-row">
  <div class="kpi-card"><div class="label">${__('total_trxs')}</div><div class="value" id="p-total-trx">-</div></div>
  <div class="kpi-card"><div class="label">${__('items_count_label')}</div><div class="value" id="p-item-count">-</div></div>
  <div class="kpi-card green"><div class="label">${__('total_cost_label')}</div><div class="value" id="p-total-cost">-</div></div>
</div>

<!-- ========== TABLE ========== -->
<table>
  <thead><tr>${headerRow}</tr></thead>
  <tbody>${rows}</tbody>
</table>

<!-- ========== FOOTER ========== -->
<div class="report-footer">
  <div class="stamp">${isAr ? 'بواسطة' : 'By'}: ${STATE.user?.name || 'Admin'}</div>
  <div>EZEM PRO ERP &copy; ${new Date().getFullYear()}</div>
  <div class="stamp">${isAr ? 'تاريخ الطباعة' : 'Printed on'}: ${new Date().toLocaleString(isAr ? 'ar-EG' : 'en-US')}</div>
</div>

<script>
  // Fill KPIs from parent window
  try {
    const rows = document.querySelectorAll('tbody tr');
    let totalCost = 0, items = new Set();
    rows.forEach(r => {
      const cells = r.cells;
      if(!cells[6]) return;
      const costText = cells[6].innerText.replace(/[^0-9.\\-]/g,'');
      totalCost += parseFloat(costText) || 0;
      if(cells[3]) items.add(cells[3].innerText.trim());
    });
    document.getElementById('p-total-trx').innerText  = rows.length;
    document.getElementById('p-item-count').innerText = items.size;
    document.getElementById('p-total-cost').innerText = new Intl.NumberFormat('${isAr ? 'ar-EG' : 'en-US'}',{style:'currency',currency:'EGP'}).format(totalCost);
  } catch(e) {}
  window.onload = () => window.print();
</script>
</body>
</html>
        `);
        win.document.close();
    },

    renderHRReport() {
        return `
            <div class="flex flex-col items-center justify-center py-20 opacity-30">
                <i class="fa-solid fa-users-line text-6xl mb-4"></i>
                <h4 class="text-xl font-black">تقرير الحضور والرواتب</h4>
                <p>جاري تلخيص ساعات العمل والإضافي...</p>
            </div>
        `;
    },

    async deleteSale(id) {
        const res = await Swal.fire({
            title: 'حذف مبيعة؟',
            text: "سيتم حذف السجل وإرجاع الأصناف للمخزن. لا يمكن التراجع!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'نعم، احذف',
            cancelButtonText: 'تراجع'
        });

        if (res.isConfirmed) {
            Utils.loading(true, 'جاري الحذف وإعادة الجدولة...');
            try {
                await API.call('DELETE_SALE', { id });
                this.render();
                Utils.toast('تم حذف المبيعة بنجاح');
            } catch(e) { Swal.fire('خطأ', e.toString(), 'error'); }
            finally { Utils.loading(false); }
        }
    },

    async editSale(id) {
        const sale = STATE.db.Sales.find(s => s[0] === id);
        if(!sale) return;

        const { value: formValues } = await Swal.fire({
            title: 'تعديل بيانات المبيعة',
            html: `
                <div class="space-y-4 text-right" dir="rtl">
                    <div>
                        <label class="text-[10px] font-black text-slate-400 block mb-1">اسم العميل</label>
                        <input id="edit-sale-cust" class="swal2-input !m-0 !w-full" value="${sale[8] || ''}">
                    </div>
                    <div>
                        <label class="text-[10px] font-black text-slate-400 block mb-1">نوع الطلب</label>
                        <select id="edit-sale-type" class="swal2-select !m-0 !w-full">
                            <option value="Walk-in" ${sale[9] === 'Walk-in' ? 'selected' : ''}>Walk-in</option>
                            <option value="Delivery" ${sale[9] === 'Delivery' ? 'selected' : ''}>Delivery</option>
                            <option value="Takeaway" ${sale[9] === 'Takeaway' ? 'selected' : ''}>Takeaway</option>
                        </select>
                    </div>
                </div>`,
            focusConfirm: false,
            preConfirm: () => {
                return {
                    customer: document.getElementById('edit-sale-cust').value,
                    type: document.getElementById('edit-sale-type').value
                }
            }
        });

        if (formValues) {
            Utils.loading(true);
            try {
                await API.call('UPDATE_SALE', {
                    sheet: 'Sales',
                    id: id,
                    idIndex: 0,
                    updates: [
                        { col: 8, val: formValues.customer },
                        { col: 9, val: formValues.type }
                    ]
                });
                this.render();
                Utils.toast('تم تحديث البيانات');
            } catch(e) { Swal.fire('خطأ', e.toString(), 'error'); }
            finally { Utils.loading(false); }
        }
    },

    async editMovement(rowIdx) {
        const movements = STATE.db.Movements || [];
        // Movement row index corresponds to array + 2, so array index = rowIdx - 2
        const mv = movements[rowIdx - 2];
        if(!mv) return;

        const { value: formValues } = await Swal.fire({
            title: STATE.lang === 'ar' ? 'تعديل حركة مخزنية' : 'Edit Movement',
            html: `
                <div class="space-y-4 text-left" dir="ltr">
                    <div>
                        <label class="text-[10px] font-black text-slate-400 block mb-1">Quantity (الكمية)</label>
                        <input type="number" step="any" id="edit-mv-qty" class="swal2-input !m-0 !w-full" value="${mv[10] || 0}">
                    </div>
                    <div>
                        <label class="text-[10px] font-black text-slate-400 block mb-1">Cost/Unit (تكلفة الوحدة)</label>
                        <input type="number" step="any" id="edit-mv-cost" class="swal2-input !m-0 !w-full" value="${mv[11] || 0}">
                    </div>
                    <div>
                        <label class="text-[10px] font-black text-slate-400 block mb-1">Notes (الملاحظات)</label>
                        <textarea id="edit-mv-notes" class="swal2-textarea !m-0 !w-full !min-h-[60px] text-sm p-3">${mv[6] || ''}</textarea>
                    </div>
                </div>`,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: STATE.lang === 'ar' ? 'حفظ التعديلات' : 'Save Changes',
            cancelButtonText: STATE.lang === 'ar' ? 'إلغاء' : 'Cancel',
            preConfirm: () => {
                const q = parseFloat(document.getElementById('edit-mv-qty').value) || 0;
                const c = parseFloat(document.getElementById('edit-mv-cost').value) || 0;
                return {
                    qty: q,
                    cost: c,
                    total: q * c,
                    notes: document.getElementById('edit-mv-notes').value
                };
            }
        });

        if (formValues) {
            Utils.loading(true);
            try {
                await API.call('UPDATE_RECORD', {
                    sheet: 'Movements',
                    rowIndex: rowIdx,
                    updates: [
                        { col: 10, val: formValues.qty },
                        { col: 11, val: formValues.cost },
                        { col: 12, val: formValues.total },
                        { col: 6, val: formValues.notes }
                    ]
                });
                await App.syncData(true);
                this.updateTrxView();
                Utils.toast(STATE.lang === 'ar' ? 'تم تحديث الحركة بنجاح' : 'Movement updated successfully');
            } catch(e) { Swal.fire('Error', e.toString(), 'error'); }
            finally { Utils.loading(false); }
        }
    },

    renderBeginningInventory() {
        const isAr = STATE.lang === 'ar';
        const from = $('#rep-global-from').val();
        const to = $('#rep-global-to').val();
        const items = STATE.db.Items || [];
        const movements = STATE.db.Movements || [];
        const align = isAr ? 'text-right' : 'text-left';

        // Pre-calculate Consumption
        const consMap = {};
        const sales = (STATE.db.Sales || []).filter(s => {
            const d = s[1].slice(0,10);
            return (!from || d >= from) && (!to || d <= to);
        });
        const recipes = STATE.db.Recipes || [];
        
        sales.forEach(s => {
            try {
                const cart = JSON.parse(s[3]);
                cart.forEach(c => {
                    const q = parseFloat(c.qty) || 0;
                    consMap[c.name] = (consMap[c.name] || 0) + q;
                    if(c.code) consMap[c.code] = (consMap[c.code] || 0) + q;
                    const rc = recipes.find(r => r[1] === c.name);
                    if (rc) {
                        try {
                            const ingr = JSON.parse(rc[2]);
                            ingr.forEach(ing => {
                                const val = (parseFloat(ing.qty) || 0) * q;
                                consMap[ing.name] = (consMap[ing.name] || 0) + val;
                                if(ing.code) consMap[ing.code] = (consMap[ing.code] || 0) + val;
                            });
                        } catch(e){}
                    }
                });
            } catch(e){}
        });

        return `
            <div class="flex flex-wrap items-center justify-between gap-4 mb-6 ${align}">
                <div>
                     <h3 class="text-xl font-black text-slate-800">${__('beg_inventory_tab')}</h3>
                     <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">${isAr ? 'بيان تفصيلي للأرصدة والحركات خلال الفترة' : 'Detailed breakdown of balances and movements for the period'}</p>
                </div>
                <div class="flex gap-2">
                    <button onclick="Utils.exportToCSV('beg-inv-table', 'Beginning_Inventory_Report')" class="h-11 px-6 bg-cyan-900/10 text-cyan-600 rounded-xl text-xs font-black hover:bg-cyan-600 hover:text-white transition-all">
                        <i class="fa-solid fa-file-excel mr-2"></i> EXCEL
                    </button>
                    <button onclick="window.print()" class="h-11 px-6 bg-slate-900 text-white rounded-xl text-xs font-black shadow-lg shadow-slate-200 transition-all flex items-center gap-2">
                        <i class="fa-solid fa-print"></i> PRINT
                    </button>
                </div>
            </div>

            <div class="table-container shadow-sm bg-white overflow-x-auto border border-slate-100 rounded-2xl">
                <table class="report-table w-full ${align} whitespace-nowrap" id="beg-inv-table">
                    <thead>
                        <tr class="bg-slate-50 text-[9px] text-slate-400 font-black uppercase tracking-widest uppercase">
                            <th class="p-4 sticky ${isAr ? 'right-0' : 'left-0'} bg-slate-50 z-10">${__('item_name')}</th>
                            <th class="text-center p-4">${__('beg_qty_label')}</th>
                            <th class="text-center p-4">${isAr ? 'استلام' : 'Rec'}</th>
                            <th class="text-center p-4">${isAr ? 'شراء' : 'Pur'}</th>
                            <th class="text-center p-4">${isAr ? 'تحويل+' : 'T-In'}</th>
                            <th class="text-center p-4">${isAr ? 'تحويل-' : 'T-Out'}</th>
                            <th class="text-center p-4">${isAr ? 'هالك' : 'Waste'}</th>
                            <th class="text-center p-4">${isAr ? 'مرتجع' : 'Ret'}</th>
                            <th class="text-center p-4 text-orange-600 underline">${isAr ? 'استهلاك' : 'Cons.'}</th>
                            <th class="text-center p-4 text-indigo-600 underline">${isAr ? 'يدوي' : 'Manual'}</th>
                            <th class="text-center p-4 bg-slate-100 text-slate-900">${isAr ? 'النظري' : 'Theo.'}</th>
                            <th class="text-center p-4 bg-amber-50 text-amber-600">${isAr ? 'الفعلي' : 'Actual'}</th>
                            <th class="text-center p-4">${__('variance')}</th>
                            <th class="text-center p-4">${__('variance_value')}</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 text-[11px]">
                        ${items.map(item => {
                            const itemName = item[3];
                            const code = item[2];
                            const cost = parseFloat(item[5]) || 0;

                            const itemMvmts = movements.filter(m => (m[2] && m[2] !== '-' ? m[2] === code : m[3] === itemName));
                            const getQty = (type) => itemMvmts.filter(m => {
                                if (m[1] !== type) return false;
                                const d = (m[0] instanceof Date) ? m[0].toISOString().slice(0,10) : String(m[0] || '').slice(0,10);
                                return (!from || d >= from) && (!to || d <= to);
                            }).reduce((s, m) => s + (parseFloat(m[4]) || 0), 0);

                            const beg = getQty('Beginning Inventory');
                            const rec = getQty('Receiving');
                            const pur = getQty('Purchasing');
                            const tIn = getQty('Transfer In');
                            const tOut = getQty('Transfer Out');
                            const wst = getQty('Waste');
                            const ret = getQty('Return');

                            const consumption = (code && consMap[code]) ? consMap[code] : (consMap[itemName] || 0);
                            const manual = parseFloat(Reconciliation.manualQty[code || itemName]) || 0;

                            const theoretical = (beg + rec + pur + tIn) - (tOut + wst + ret + consumption + manual);
                            const actual = parseFloat(item[7]) || 0;

                            const diff = actual - theoretical;
                            const val = diff * cost;

                            const fz = (v) => v === 0 ? '<span class="opacity-20">-</span>' : v.toFixed(2);
                            const fzc = (v) => v === 0 ? '<span class="opacity-20">-</span>' : Utils.formatCurrency(v);

                            return `
                                <tr class="hover:bg-indigo-50/10 transition-colors group">
                                    <td class="p-4 font-black text-slate-800 sticky ${isAr ? 'right-0' : 'left-0'} bg-white group-hover:bg-slate-50 z-10 border-l border-slate-50 shadow-[1px_0_0_0_#f1f5f9]">
                                        <div class="text-xs truncate max-w-[10rem]">${itemName}</div>
                                        <div class="text-[8px] text-slate-400 font-mono">#${code}</div>
                                    </td>
                                    <td class="p-4 text-center font-bold text-slate-500">${fz(beg)}</td>
                                    <td class="p-4 text-center font-bold text-emerald-500">${fz(rec)}</td>
                                    <td class="p-4 text-center font-bold text-emerald-500">${fz(pur)}</td>
                                    <td class="p-4 text-center font-bold text-blue-500">${fz(tIn)}</td>
                                    <td class="p-4 text-center font-bold text-amber-500">${fz(tOut)}</td>
                                    <td class="p-4 text-center font-bold text-rose-500">${fz(wst)}</td>
                                    <td class="p-4 text-center font-bold text-purple-500">${fz(ret)}</td>
                                    <td class="p-4 text-center font-black text-orange-600 bg-orange-50/30">${fz(consumption)}</td>
                                    <td class="p-4 text-center font-black text-indigo-600 bg-indigo-50/30">${fz(manual)}</td>
                                    <td class="p-4 text-center font-black bg-slate-50 text-slate-900">${fz(theoretical)}</td>
                                    <td class="p-4 text-center font-black bg-amber-50/30 text-amber-600">${fz(actual)}</td>
                                    <td class="p-4 text-center font-black ${diff < 0 ? 'text-rose-500' : (diff > 0 ? 'text-emerald-500' : 'text-slate-300')}">${fz(diff)}</td>
                                    <td class="p-4 text-center font-black ${val < 0 ? 'text-rose-700' : (val > 0 ? 'text-emerald-700' : 'text-slate-300')}">${fzc(val)}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    renderReconciliation() {
        const items = STATE.db.Items || [];
        const movements = STATE.db.Movements || [];
        const sessions = (STATE.db.BOH_Counts || []).sort((a,b) => new Date(b[0]) - new Date(a[0]));
        const isAr = STATE.lang === 'ar';
        const align = isAr ? 'text-right' : 'text-left';

        // Build session options for picker
        const sessionOpts = sessions.map(s => 
            `<option value='${s[1]}'>${s[0]} - ${s[4]} (${s[2]})</option>`
        ).join('');

        return `
            <div class="space-y-6 ${align}">
                <!-- Header -->
                <div class="bg-indigo-900 text-white p-8 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
                    <div class="z-10">
                        <h3 class="text-2xl font-black mb-2 flex items-center gap-3">
                            <i class="fa-solid fa-scale-balanced text-indigo-400"></i> ${__('recon_ledger')}
                        </h3>
                        <p class="text-indigo-200 text-sm max-w-xl">
                            ${__('recon_guide_text')}
                        </p>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-2 z-10 shrink-0">
                        <button onclick="window.print()" class="h-12 px-5 bg-indigo-800 text-indigo-200 hover:bg-indigo-700 rounded-xl font-black transition-all">
                            <i class="fa-solid fa-print"></i>
                        </button>
                        <button onclick="Utils.exportToCSV('recon-table', 'Reconciliation_Report')" class="h-12 px-5 bg-cyan-900 text-cyan-400 hover:bg-cyan-800 rounded-xl font-black transition-all">
                            <i class="fa-solid fa-file-excel"></i>
                        </button>
                        <button onclick="Reports.finalizeRecon()" class="h-12 px-8 bg-white text-indigo-900 hover:bg-emerald-400 hover:text-white rounded-xl font-black transition-all shadow-xl flex items-center gap-2">
                            <i class="fa-solid fa-check-double"></i> ${__('confirm')}
                        </button>
                    </div>
                </div>

                <!-- Session picker -->
                <div class="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
                    <div class="flex items-center gap-3 text-slate-600 text-sm font-black">
                        <i class="fa-solid fa-calendar-check text-indigo-500 text-lg"></i>
                        ${__('load_saved_inv')}
                    </div>
                    ${sessions.length > 0 ? `
                    <select id="recon-session-picker" onchange="Reports.applyBOHSessionToRecon(this.value)" class="flex-1 h-11 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="">-- ${isAr ? 'اختر جلسة جرد' : 'Select Session'} --</option>
                        ${sessionOpts}
                    </select>` :
                    `<span class="text-slate-400 text-xs font-bold italic">${isAr ? 'لا توجد جلسات جرد محفوظة بعد' : 'No saved inventory sessions yet.'}</span>`
                    }
                </div>

                <!-- Live Grid Table -->
                <div class="table-container shadow-sm bg-white overflow-x-auto border border-slate-100 rounded-2xl">
                    <table class="w-full ${align} whitespace-nowrap" id="recon-table">
                        <thead>
                            <tr class="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-500 uppercase tracking-widest">
                                <th class="font-black w-48 sticky ${isAr ? 'right-0' : 'left-0'} bg-slate-50 z-10 cursor-pointer hover:bg-slate-100 transition-colors" onclick="Utils.sortTable('recon-table', 0)">${__('item_name')} <i class="fa-solid fa-sort ml-1 text-slate-300"></i></th>
                                <th class="text-center font-black cursor-pointer hover:bg-slate-100 transition-colors" onclick="Utils.sortTable('recon-table', 1, true)">${__('beg_qty_label')} <i class="fa-solid fa-sort ml-1 text-slate-300"></i></th>
                                <th class="text-center font-black cursor-pointer hover:bg-slate-100 transition-colors" onclick="Utils.sortTable('recon-table', 2, true)">${__('Receiving') || 'Rec'} <i class="fa-solid fa-sort ml-1 text-slate-300"></i></th>
                                <th class="text-center font-black cursor-pointer hover:bg-slate-100 transition-colors" onclick="Utils.sortTable('recon-table', 3, true)">${__('Purchasing') || 'Pur'} <i class="fa-solid fa-sort ml-1 text-slate-300"></i></th>
                                <th class="text-center font-black cursor-pointer hover:bg-slate-100 transition-colors" onclick="Utils.sortTable('recon-table', 4, true)">${__('Transfer In') || 'T-In'} <i class="fa-solid fa-sort ml-1 text-slate-300"></i></th>
                                <th class="text-center font-black cursor-pointer hover:bg-slate-100 transition-colors" onclick="Utils.sortTable('recon-table', 5, true)">${__('Transfer Out') || 'T-Out'} <i class="fa-solid fa-sort ml-1 text-slate-300"></i></th>
                                <th class="text-center font-black cursor-pointer hover:bg-slate-100 transition-colors" onclick="Utils.sortTable('recon-table', 6, true)">${__('Waste') || 'Waste'} <i class="fa-solid fa-sort ml-1 text-slate-300"></i></th>
                                <th class="text-center font-black cursor-pointer hover:bg-slate-100 transition-colors" onclick="Utils.sortTable('recon-table', 7, true)">${__('Return') || 'Ret'} <i class="fa-solid fa-sort ml-1 text-slate-300"></i></th>
                                <th class="text-center font-black text-orange-600 bg-orange-50 leading-tight">${isAr ? 'استهلاك مبيعات' : 'Cons. POS'}</th>
                                <th class="text-center font-black text-slate-900 bg-slate-100 leading-tight cursor-pointer hover:bg-slate-200 transition-colors" onclick="Utils.sortTable('recon-table', 9, true)">${__('theoretical_stock')} <i class="fa-solid fa-sort ml-1 text-slate-300"></i></th>
                                <th class="text-center font-black text-indigo-900 bg-indigo-50 leading-tight cursor-pointer hover:bg-indigo-100 transition-colors" onclick="Utils.sortTable('recon-table', 10, true)">${isAr ? 'نسبة الهالك (Yield)' : 'Yield %'} <i class="fa-solid fa-sort ml-1 text-indigo-300"></i></th>
                                <th class="text-center font-black text-blue-900 bg-blue-50 leading-tight cursor-pointer hover:bg-blue-100 transition-colors" onclick="Utils.sortTable('recon-table', 11, true)">${isAr ? 'الرصيد الدفتري (بالنسبة)' : 'Theo. Stock (Yield)'} <i class="fa-solid fa-sort ml-1 text-blue-300"></i></th>
                                <th class="text-center font-black w-32 bg-amber-50 leading-tight border-r border-amber-100 cursor-pointer hover:bg-amber-100 transition-colors" onclick="Utils.sortTable('recon-table', 12, true)">${__('actual_count')} <i class="fa-solid fa-sort ml-1 text-amber-300"></i></th>
                                <th class="text-center font-black text-rose-500 leading-tight cursor-pointer hover:bg-rose-100 transition-colors" onclick="Utils.sortTable('recon-table', 13, true)">${__('variance')} <i class="fa-solid fa-sort ml-1 text-rose-300"></i></th>
                                <th class="text-center font-black text-rose-500 leading-tight cursor-pointer hover:bg-rose-100 transition-colors" onclick="Utils.sortTable('recon-table', 14, true)">${__('variance_value')} <i class="fa-solid fa-sort ml-1 text-rose-300"></i></th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 text-[11px]">
                            ${(() => {
                                // Pre-calculate Consumption
                                const consMap = {};
                                const from = $('#rep-global-from').val();
                                const to = $('#rep-global-to').val();
                                const sales = (STATE.db.Sales || []).filter(s => {
                                    const d = s[1].slice(0,10);
                                    return (!from || d >= from) && (!to || d <= to);
                                });
                                const recipes = STATE.db.Recipes || [];
                                
                                sales.forEach(s => {
                                    try {
                                        const cart = JSON.parse(s[3]);
                                        cart.forEach(c => {
                                            const q = parseFloat(c.qty) || 0;
                                            consMap[c.name] = (consMap[c.name] || 0) + q;
                                            if(c.code) consMap[c.code] = (consMap[c.code] || 0) + q;
                                            const rc = recipes.find(r => r[1] === c.name);
                                            if (rc) {
                                                try {
                                                    const ingr = JSON.parse(rc[2]);
                                                    ingr.forEach(ing => {
                                                        const val = (parseFloat(ing.qty) || 0) * q;
                                                        consMap[ing.name] = (consMap[ing.name] || 0) + val;
                                                        if(ing.code) consMap[ing.code] = (consMap[ing.code] || 0) + val;
                                                    });
                                                } catch(e){}
                                            }
                                        });
                                    } catch(e){}
                                });

                                return items.map(item => {
                                    const itemName = item[3];
                                    const code = item[2];
                                    const cost = parseFloat(item[5]) || 0;

                                    const itemMvmts = movements.filter(m => (m[2] && m[2] !== '-' ? m[2] === code : m[3] === itemName));
                                    const getQty = (type) => itemMvmts.filter(m => {
                                        if (m[1] !== type) return false;
                                        const d = (m[0] instanceof Date) ? m[0].toISOString().slice(0,10) : String(m[0] || '').slice(0,10);
                                        return (!from || d >= from) && (!to || d <= to);
                                    }).reduce((s, m) => s + (parseFloat(m[4]) || 0), 0);

                                    const beg = getQty('Beginning Inventory');
                                    const rec = getQty('Receiving');
                                    const pur = getQty('Purchasing');
                                    const tIn = getQty('Transfer In');
                                    const tOut = getQty('Transfer Out');
                                    const wst = getQty('Waste');
                                    const ret = getQty('Return');

                                    const consumption = (code && consMap[code]) ? consMap[code] : (consMap[itemName] || 0);

                                    const theoretical = (beg + rec + pur + tIn) - (tOut + wst + ret + consumption);
                                    
                                    const yieldVal = parseFloat(item[8]) || 100;
                                    const theoStockYield = theoretical * (yieldVal / 100);
                                    
                                    const physical = parseFloat(item[7]) || 0;

                                    const initialDiff = physical - theoStockYield;
                                    const initialVal = initialDiff * cost;
                                    const diffClass = initialDiff === 0 ? 'text-slate-300' : (initialDiff > 0 ? 'text-emerald-500' : 'text-rose-500');
                                    const valClass = initialVal === 0 ? 'text-slate-300' : (initialVal > 0 ? 'text-emerald-500' : 'text-rose-500');

                                    const fz = (val) => val === 0 ? '<span class="opacity-20">-</span>' : val.toFixed(2);

                                    return `
                                        <tr class="hover:bg-slate-50 transition-colors group">
                                            <td class="font-black text-slate-800 py-3 sticky ${isAr ? 'right-0' : 'left-0'} bg-white group-hover:bg-slate-50 z-10 border-l border-slate-50 w-48 shadow-[1px_0_0_0_#f1f5f9]">
                                                <div class="truncate max-w-[12rem] text-xs">${itemName}</div>
                                                <div class="text-[8px] text-slate-400 font-bold uppercase">#${code} | ${item[4]}</div>
                                            </td>
                                            <td class="text-center font-bold text-slate-500">${fz(beg)}</td>
                                            <td class="text-center font-bold text-emerald-500">${fz(rec)}</td>
                                            <td class="text-center font-bold text-emerald-500">${fz(pur)}</td>
                                            <td class="text-center font-bold text-blue-500">${fz(tIn)}</td>
                                            <td class="text-center font-bold text-amber-500">${fz(tOut)}</td>
                                            <td class="text-center font-bold text-rose-500">${fz(wst)}</td>
                                            <td class="text-center font-bold text-purple-500">${fz(ret)}</td>
                                            <td class="text-center font-black bg-orange-50/30 text-orange-600">${fz(consumption)}</td>
                                            <td class="text-center font-black bg-slate-50 text-slate-900 text-[12px]">${fz(theoretical)}</td>
                                            <td class="text-center font-bold text-slate-500">${yieldVal}%</td>
                                            <td class="text-center font-black bg-blue-50/50 text-blue-900 text-[12px]">${fz(theoStockYield)}</td>
                                            <td class="text-center px-2 bg-amber-50/30 border-r border-amber-100">
                                                <input type="number" min="0" step="0.01"
                                                    class="recon-actual-input w-24 h-8 border border-amber-200 bg-white rounded-lg text-center font-black text-slate-900 focus:border-amber-500 outline-none shadow-inner mx-auto block"
                                                    value="${physical}"
                                                    data-code="${code}"
                                                    data-name="${itemName}"
                                                    data-theo="${theoStockYield}"
                                                    data-cost="${cost}"
                                                    oninput="Reports.calculateBatchRecon()">
                                            </td>
                                            <td class="text-center">
                                                <span class="recon-diff text-[12px] font-black ${diffClass}" dir="ltr">${initialDiff > 0 ? '+'+initialDiff.toFixed(2) : initialDiff.toFixed(2)}</span>
                                            </td>
                                            <td class="text-center">
                                                <span class="recon-val text-[11px] font-black ${valClass}" dir="ltr">${Utils.formatCurrency(initialVal)}</span>
                                            </td>
                                        </tr>
                                    `;
                                }).join('');
                            })()}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    calculateBatchRecon() {
        $('.recon-actual-input').each(function() {
            const actual = parseFloat($(this).val()) || 0;
            const theoretical = parseFloat($(this).data('theo')) || 0;
            const cost = parseFloat($(this).data('cost')) || 0;
            const diff = actual - theoretical;
            const val = diff * cost;
            
            const row = $(this).closest('tr');
            row.find('.recon-diff').text(diff > 0 ? `+${diff}` : diff)
               .removeClass('text-slate-300 text-rose-500 text-emerald-500')
               .addClass(diff === 0 ? 'text-slate-300' : (diff > 0 ? 'text-emerald-500' : 'text-rose-500'));
            
            row.find('.recon-val').text(Utils.formatCurrency(val))
               .removeClass('text-slate-300 text-rose-500 text-emerald-500')
               .addClass(val === 0 ? 'text-slate-300' : (val > 0 ? 'text-emerald-500' : 'text-rose-500'));
        });
    },

    async finalizeRecon() {
        const data = [];
        $('.recon-actual-input').each(function() {
            const actual = parseFloat($(this).val()) || 0;
            const theoretical = parseFloat($(this).data('theo')) || 0;
            if (actual !== theoretical) {
                data.push({
                    code: $(this).data('code'),
                    name: $(this).data('name'),
                    actual: actual,
                    theo: theoretical,
                    diff: actual - theoretical,
                    cost: $(this).data('cost')
                });
            }
        });

        if (data.length === 0) return Swal.fire('تنبيه', 'لم يتم تغيير أي أرصدة للمطابقة', 'info');

        const confirm = await Swal.fire({
            title: __('confirm_recon_title'),
            text: __('confirm_recon_text').replace('{count}', data.length),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: __('confirm_yes'),
            cancelButtonText: __('cancel')
        });

        if (confirm.isConfirmed) {
            Utils.loading(true, __('processing_recon'));
            try {
                // For each diff, save a movement and update stock
                for (const row of data) {
                    await API.call('SAVE_MOVEMENT', {
                        headers: {
                            date: new Date().toISOString().split('T')[0],
                            type: row.diff > 0 ? 'Beginning Inventory' : 'Waste',
                            from: '-',
                            to: '-',
                            ref: 'RECON-ADJ',
                            notes: `Inventory Reconciliation Adjustment: Diff ${row.diff}`
                        },
                        items: [{
                            name: row.name,
                            qty: Math.abs(row.diff),
                            cost: row.cost
                        }]
                    });
                }
                Swal.fire(__('success'), __('recon_success_msg'), 'success');
                this.render();
            } catch(e) { Swal.fire('خطأ', e.toString(), 'error'); }
            finally { Utils.loading(false); }
        }
    },

    async deleteByRow(sheet, rowIndex) {
        if (!Auth.canEdit()) return Swal.fire(__('warning'), __('no_delete_perm'), 'error');
        const res = await Swal.fire({
            title: __('confirm_delete_title'),
            text: __('confirm_delete_text'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: __('confirm_delete_yes'),
            cancelButtonText: __('cancel')
        });

        if (res.isConfirmed) {
            Utils.loading(true, __('processing_delete'));
            try {
                await API.call('DELETE_RECORD', { sheet, rowIndex });
                await App.syncData(true);
                this.refreshActiveTab();
                Utils.toast(__('delete_success'));
            } catch (e) {
                Swal.fire(__('error'), e.toString(), 'error');
            } finally {
                Utils.loading(false);
            }
        }
    },

    async wipeSystemData() {
        const res = await Swal.fire({
            title: __('wipe_data_title'),
            text: __('wipe_data_text'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: __('wipe_data_yes'),
            cancelButtonText: __('cancel_wipe')
        });

        if (res.isConfirmed) {
            Utils.loading(true, __('processing_wipe'));
            try {
                await API.call('WIPE_DATA');
                await App.syncData(); // CRITICAL: synchronize to zero-out local cache immediately
                this.render();
                Swal.fire(__('wipe_success_title'), __('wipe_success_msg'), 'success');
            } catch(e) { Swal.fire('خطأ', e.toString(), 'error'); }
            finally { Utils.loading(false); }
        }
    },

    async runMigration() {
        const res = await Swal.fire({
            title: STATE.lang === 'ar' ? 'ربط البيانات القديمة؟' : 'Link Old History?',
            text: STATE.lang === 'ar' ? 'سكريرة النظام ستقوم بربط كل الحركات السابقة بالأكواد لضمان دقة التقارير عند تغيير الأسماء.' : 'This will link all past movements to item codes to ensure report accuracy after renaming.',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: STATE.lang === 'ar' ? 'ابدأ الربط' : 'Start Linking'
        });

        if (res.isConfirmed) {
            Utils.loading(true);
            try {
                const result = await API.call('MIGRATE_MOVEMENTS');
                Utils.toast(STATE.lang === 'ar' ? `تم ربط ${result.count} حركة بنجاح` : `Linked ${result.count} movements`);
            } catch(e) { Swal.fire('Error', e.toString(), 'error'); }
            finally { Utils.loading(false); }
        }
    }
};
