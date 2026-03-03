/**
 * RECONCILIATION MODULE (Stock Reconciliation & Consumption Analysis)
 * Advanced Master Stock Control Ledger with Sticky Header & Search
 */
const Reconciliation = {
    filters: {
        from: '',
        to: '',
        location: '',
        search: ''
    },
    manualQty: {},

    render() {
        const items = STATE.db.Items || [];
        const locations = STATE.db.Locations || [];
        const isAr = STATE.lang === 'ar';

        if (!this.filters.from) this.filters.from = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
        if (!this.filters.to) this.filters.to = new Date().toISOString().split('T')[0];

        document.getElementById('main-content').innerHTML = `
            <div class="space-y-6 animate-fade-in ${isAr ? 'text-right' : 'text-left'} h-full flex flex-col" dir="${isAr ? 'rtl' : 'ltr'}">
                <!-- Header Actions -->
                <div class="flex flex-wrap justify-between items-center gap-4 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm shrink-0">
                    <div class="flex items-center gap-4">
                        <div class="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                            <i class="fa-solid fa-scale-balanced"></i>
                        </div>
                        <div>
                            <h2 class="text-2xl font-black text-slate-800 tracking-tight">${__('recon_ledger')}</h2>
                            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Master Stock Control &amp; Consumption Ledger</p>
                        </div>
                    </div>

                    <div class="flex flex-wrap gap-2 items-center">
                        <!-- Month Picker -->
                        <div class="flex flex-col px-3 py-1 bg-slate-50 rounded-xl border border-slate-100">
                            <label class="text-[8px] font-black text-slate-400 uppercase tracking-tighter">${isAr ? 'الشهر' : 'Month'}</label>
                            <select id="recon-month-picker" onchange="Reconciliation.setMonthFilter(this.value)" class="bg-transparent text-[10px] font-bold outline-none cursor-pointer w-28">
                                <option value="">-- ${isAr ? 'اختر' : 'Pick'} --</option>
                                ${Array.from({length: 12}, (_, i) => {
                                    const d = new Date(new Date().getFullYear(), i, 1);
                                    const name = d.toLocaleString(STATE.lang, { month: 'long' });
                                    return `<option value="${i}">${name}</option>`;
                                }).join('')}
                            </select>
                        </div>

                        <!-- Search Box -->
                        <div class="relative w-56 ${isAr ? 'mr-2' : 'ml-2'}">
                            <i class="fa-solid fa-magnifying-glass absolute ${isAr ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                            <input type="text" id="recon-search" class="input-premium ${isAr ? 'pr-10' : 'pl-10'} h-11" placeholder="${__('search')}" value="${this.filters.search}" oninput="Reconciliation.handleSearch(this)">
                        </div>

                        <div class="flex gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shadow-inner">
                            <div class="flex flex-col px-2">
                                <label class="text-[8px] font-black text-slate-400 uppercase tracking-tighter">${__('from')}</label>
                                <input type="date" id="recon-from" class="bg-transparent text-[10px] font-bold outline-none" value="${this.filters.from}" onchange="Reconciliation.updateFilter()">
                            </div>
                            <div class="w-px bg-slate-200"></div>
                            <div class="flex flex-col px-2">
                                <label class="text-[8px] font-black text-slate-400 uppercase tracking-tighter">${__('to')}</label>
                                <input type="date" id="recon-to" class="bg-transparent text-[10px] font-bold outline-none" value="${this.filters.to}" onchange="Reconciliation.updateFilter()">
                            </div>
                            <div class="w-px bg-slate-200"></div>
                            <div class="flex flex-col px-2">
                                <label class="text-[8px] font-black text-slate-400 uppercase tracking-tighter">${__('category')}</label>
                                <select id="recon-loc" class="bg-transparent text-[10px] font-bold outline-none cursor-pointer" onchange="Reconciliation.updateFilter()">
                                    <option value="">${__('all')}</option>
                                    ${locations.map(l => `<option value="${l[1]}" ${this.filters.location === l[1] ? 'selected' : ''}>${l[1]}</option>`).join('')}
                                </select>
                            </div>
                        </div>

                        <button onclick="Reconciliation.archive()" class="h-11 px-5 bg-indigo-600 text-white rounded-xl text-[10px] font-black shadow-lg hover:bg-slate-900 transition-all flex items-center gap-2">
                            <i class="fa-solid fa-box-archive"></i> ${__('save_archive')}
                        </button>
                        <button onclick="window.print()" class="h-11 px-5 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black shadow-sm hover:bg-slate-200 transition-all flex items-center gap-2">
                            <i class="fa-solid fa-print"></i> ${isAr ? 'طباعة' : 'Print'}
                        </button>
                        <button onclick="Utils.exportToCSV('recon-table', 'Reconciliation')" class="h-11 px-5 bg-slate-900 text-white rounded-xl text-[10px] font-black shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2">
                            <i class="fa-solid fa-file-excel"></i> Excel
                        </button>
                    </div>
                </div>

                <!-- Analysis Grid -->
                <div class="flex-1 min-h-0 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden">
                    <div class="flex-1 overflow-auto custom-scrollbar" id="recon-scroll-container">
                        <table class="w-full ${isAr ? 'text-right' : 'text-left'} border-collapse text-[10px]" id="recon-table">
                            <thead class="sticky top-0 z-20 bg-slate-900 text-white text-[9px]">
                                <tr>
                                    <th class="p-3 font-black text-slate-100 uppercase text-center border-b border-white/10">#</th>
                                    <th class="p-3 font-black text-slate-100 uppercase border-b border-white/10">${__('item_code')}</th>
                                    <th class="p-3 font-black text-slate-100 uppercase border-b border-white/10">${__('item_name')}</th>
                                    <th class="p-3 font-black text-blue-300 uppercase text-center bg-slate-800 border-x border-slate-700 border-b border-white/10">${isAr ? 'أول المدة' : 'Beg. Inv'}</th>
                                    <th class="p-3 font-black text-emerald-300 uppercase text-center border-b border-white/10">Recv</th>
                                    <th class="p-3 font-black text-emerald-300 uppercase text-center border-b border-white/10">Purch</th>
                                    <th class="p-3 font-black text-sky-300 uppercase text-center border-b border-white/10">T-In</th>
                                    <th class="p-3 font-black text-rose-300 uppercase text-center border-b border-white/10">T-Out</th>
                                    <th class="p-3 font-black text-rose-300 uppercase text-center border-b border-white/10">Waste</th>
                                    <th class="p-3 font-black text-rose-300 uppercase text-center border-b border-white/10">Ret</th>
                                    <th class="p-3 font-black text-orange-300 uppercase text-center bg-slate-800 border-x border-slate-700 border-b border-white/10">Cons (POS)</th>
                                    <th class="p-3 font-black text-red-300 uppercase text-center bg-slate-800 border-b border-white/10">${isAr ? 'استهلاك يدوي' : 'Cons (Manual)'}</th>
                                    <th class="p-3 font-black text-indigo-300 uppercase text-center bg-slate-800 border-b border-white/10">Manual Adj</th>
                                    <th class="p-3 font-black text-amber-300 uppercase text-center bg-slate-800 border-x border-slate-700 border-b border-white/10">${isAr ? 'المخزون النظري' : 'Theo. Stock'} (End)</th>
                                    <th class="p-3 font-black text-emerald-300 uppercase text-center bg-slate-800 border-b border-white/10">${__('actual_count')}</th>
                                    <th class="p-3 font-black text-rose-300 uppercase text-center border-b border-white/10">${__('variance')}</th>
                                    <th class="p-3 font-black text-rose-400 uppercase text-center border-b border-white/10">${__('variance_value')}</th>
                                </tr>
                            </thead>
                            <tbody id="recon-tbody" class="divide-y divide-slate-50">
                                ${this.renderRows(items)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    setMonthFilter(monthIdx) {
        if (monthIdx === '') return;
        const year = new Date().getFullYear();
        const start = new Date(year, parseInt(monthIdx), 1).toISOString().split('T')[0];
        const end = new Date(year, parseInt(monthIdx) + 1, 0).toISOString().split('T')[0];
        this.filters.from = start;
        this.filters.to = end;
        this.render();
    },

    handleSearch(el) {
        this.filters.search = $(el).val().toLowerCase().trim();
        this.updateView();
    },

    updateFilter() {
        this.filters.from = $('#recon-from').val();
        this.filters.to = $('#recon-to').val();
        this.filters.location = $('#recon-loc').val();
        this.render();
    },

    updateView() {
        const items = STATE.db.Items || [];
        $('#recon-tbody').html(this.renderRows(items));
    },

    _buildConsMap(from, to) {
        const consMap = {};
        const sales = (STATE.db.Sales || []).map(s => {
            const d = s[1];
            const dateStr = (d instanceof Date) ? d.toISOString().split('T')[0] : String(d || '').split('T')[0];
            return [s[0], dateStr, ...s.slice(2)];
        });
        const recipes = STATE.db.Recipes || [];

        sales.forEach(s => {
            if (s[1] < from || s[1] > to) return;
            try {
                const cart = JSON.parse(s[3]);
                cart.forEach(c => {
                    const q = parseFloat(c.qty) || 0;
                    consMap[c.name] = (consMap[c.name] || 0) + q;
                    if (c.code) consMap[c.code] = (consMap[c.code] || 0) + q;
                    const rc = recipes.find(r => r[1] === c.name);
                    if (rc) {
                        try {
                            const ingredients = JSON.parse(rc[2]);
                            ingredients.forEach(ing => {
                                const val = (parseFloat(ing.qty) || 0) * q;
                                consMap[ing.name] = (consMap[ing.name] || 0) + val;
                                if (ing.code) consMap[ing.code] = (consMap[ing.code] || 0) + val;
                            });
                        } catch (e) {}
                    }
                });
            } catch (e) {}
        });
        return consMap;
    },

    _normalizeMovements() {
        return (STATE.db.Movements || []).map(m => {
            const d = m[0];
            const dateStr = (d instanceof Date)
                ? d.toISOString().split('T')[0]
                : String(d || '').split('T')[0].split(' ')[0];
            return [dateStr, ...m.slice(1)];
        });
    },

    renderRows(items) {
        const isAr = STATE.lang === 'ar';
        const movements = this._normalizeMovements();
        const from = this.filters.from;
        const to = this.filters.to;
        const loc = this.filters.location;
        const search = this.filters.search;

        let filteredItems = items;
        if (search) {
            filteredItems = items.filter(i =>
                (i[3] || '').toLowerCase().includes(search) ||
                (i[2] || '').toLowerCase().includes(search)
            );
        }

        if (!filteredItems.length) return `<tr><td colspan="17" class="text-center py-24 text-slate-300 italic font-bold">${__('no_trxs_found')}</td></tr>`;

        const consMap = this._buildConsMap(from, to);

        return filteredItems.map((item, rowIdx) => {
            const name = item[3];
            const code = item[2];
            const cost = parseFloat(item[5]) || 0;
            const currentStock = parseFloat(item[7]) || 0;

            const itemMv = movements.filter(m => (m[2] && m[2] !== '-' ? m[2] === code : m[3] === name));
            const getMv = (type, locCol) => itemMv
                .filter(m => m[1] === type && m[0] >= from && m[0] <= to && (!loc || m[locCol || 10] === loc))
                .reduce((s, m) => s + (parseFloat(m[4]) || 0), 0);

            const beginning       = getMv('Beginning Inventory', 10);
            const receiving       = getMv('Receiving', 10);
            const purchasing      = getMv('Purchasing', 10);
            const transferIn      = getMv('Transfer In', 10);
            const transferOut     = getMv('Transfer Out', 9);
            const waste           = getMv('Waste', 9);
            const returns         = getMv('Return', 9);
            const manualCons      = getMv('Consumption', 9);   // NEW: manual consumption movement
            const onHandMv        = getMv('On Hand', 10);       // NEW: on-hand physical count movement

            const posConsumption = (code && consMap[code]) ? consMap[code] : (consMap[name] || 0);
            const manualAdj      = parseFloat(this.manualQty[code || name]) || 0;

            // Theoretical = Beg + Inflows - Outflows - POS Cons - Manual Cons - Manual Adj
            const theoretical = (beginning + receiving + purchasing + transferIn)
                              - (transferOut + waste + returns + posConsumption + manualCons + manualAdj);

            // Actual Count: On Hand movement > manual override > current stock
            const actualKey = `actual_${code || name}`;
            const actual = Object.prototype.hasOwnProperty.call(this.manualQty, actualKey)
                ? (parseFloat(this.manualQty[actualKey]) || 0)
                : (onHandMv > 0 ? onHandMv : currentStock);

            const variance     = actual - theoretical;
            const varianceCost = variance * cost;

            const fz  = (val) => { const n = parseFloat(val)||0; return n===0 ? '<span class="opacity-20">-</span>' : n.toFixed(2); };
            const fzc = (val) => { const n = parseFloat(val)||0; return n===0 ? '<span class="opacity-20">-</span>' : Utils.formatCurrency(n); };

            const autoHint = onHandMv > 0 ? (STATE.lang==='ar' ? 'تلقائي من حركة On Hand' : 'Auto from On Hand movement') : (STATE.lang==='ar' ? 'من المخزون الحالي' : 'From current stock');

            return `
                <tr class="hover:bg-indigo-50/20 transition-colors group">
                    <td class="p-3 text-center text-slate-500 font-mono text-[9px] border-b border-slate-100">${rowIdx + 1}</td>
                    <td class="p-3 font-mono text-indigo-600 text-[11px] font-black whitespace-nowrap border-b border-slate-100">${code || '-'}</td>
                    <td class="p-3 font-black text-slate-900 whitespace-nowrap max-w-[140px] truncate border-b border-slate-100" title="${name}">${name}</td>
                    <td class="p-3 text-center font-black bg-blue-50/40 text-blue-800 border-b border-slate-100">${fz(beginning)}</td>
                    <td class="p-3 text-center font-black text-emerald-700 border-b border-slate-100">${fz(receiving)}</td>
                    <td class="p-3 text-center font-black text-emerald-700 border-b border-slate-100">${fz(purchasing)}</td>
                    <td class="p-3 text-center font-black text-sky-700 border-b border-slate-100">${fz(transferIn)}</td>
                    <td class="p-3 text-center font-black text-rose-600 border-b border-slate-100">${fz(transferOut)}</td>
                    <td class="p-3 text-center font-black text-rose-600 border-b border-slate-100">${fz(waste)}</td>
                    <td class="p-3 text-center font-black text-rose-600 border-b border-slate-100">${fz(returns)}</td>
                    <td class="p-3 text-center font-black bg-orange-50/40 text-orange-800 border-b border-slate-100">${fz(posConsumption)}</td>
                    <td class="p-3 text-center font-black bg-red-50/40 text-red-800 border-b border-slate-100">${fz(manualCons)}</td>
                    <td class="p-2 text-center bg-indigo-50/40 border-b border-slate-100">
                        <input type="number" step="any"
                            class="w-16 h-8 bg-white border border-indigo-300 rounded-lg text-center text-[11px] font-black text-slate-900 focus:border-indigo-600 outline-none shadow-sm transition-colors"
                            value="${manualAdj || ''}" placeholder="0"
                            title="${isAr ? 'تعديل يدوي' : 'Manual Adjustment'}"
                            oninput="Reconciliation.updateManualQty('${code || name}', this.value)">
                    </td>
                    <td class="p-3 text-center font-black bg-amber-50/40 text-amber-900 text-[12px] border-x border-amber-200 border-b border-slate-100">${fz(theoretical)}</td>
                    <td class="p-2 text-center bg-emerald-50/40 border-b border-slate-100">
                        <input type="number" step="any"
                            class="w-16 h-8 bg-white border border-emerald-300 rounded-lg text-center text-[11px] font-black text-slate-900 focus:border-emerald-600 outline-none shadow-sm transition-colors"
                            value="${actual || ''}" placeholder="0"
                            title="${autoHint}"
                            oninput="Reconciliation.updateActualQty('${code || name}', this.value)">
                    </td>
                    <td class="p-3 text-center font-black border-b border-slate-100 ${variance < 0 ? 'bg-rose-100/50 text-rose-700' : (variance > 0 ? 'bg-emerald-100/50 text-emerald-700' : 'text-slate-400')}">${fz(variance)}</td>
                    <td class="p-3 text-center font-black border-b border-slate-100 ${varianceCost < 0 ? 'bg-rose-100/50 text-rose-900' : (varianceCost > 0 ? 'bg-emerald-100/50 text-emerald-900' : 'text-slate-400')}">${fzc(varianceCost)}</td>
                </tr>
            `;
        }).join('');
    },

    async archive() {
        const rows = [];
        const items = STATE.db.Items || [];
        const movements = this._normalizeMovements();
        const from = this.filters.from;
        const to = this.filters.to;
        const loc = this.filters.location;
        const consMap = this._buildConsMap(from, to);

        items.forEach(item => {
            const name = item[3];
            const code = item[2];
            const costValue = parseFloat(item[5]) || 0;
            const currentStock = parseFloat(item[7]) || 0;

            const itemMv = movements.filter(m => (m[2] && m[2] !== '-' ? m[2] === code : m[3] === name));
            const getMv = (type, locCol) => itemMv
                .filter(m => m[1] === type && m[0] >= from && m[0] <= to && (!loc || m[locCol || 10] === loc))
                .reduce((s, m) => s + (parseFloat(m[4]) || 0), 0);

            const beginning  = getMv('Beginning Inventory', 10);
            const rec        = getMv('Receiving', 10);
            const pur        = getMv('Purchasing', 10);
            const tin        = getMv('Transfer In', 10);
            const tout       = getMv('Transfer Out', 9);
            const wst        = getMv('Waste', 9);
            const ret        = getMv('Return', 9);
            const manualCons = getMv('Consumption', 9);
            const onHandMv   = getMv('On Hand', 10);

            const posCons  = (code && consMap[code]) ? consMap[code] : (consMap[name] || 0);
            const manual   = parseFloat(this.manualQty[code || name]) || 0;
            const theoretical = (beginning + rec + pur + tin) - (tout + wst + ret + posCons + manualCons + manual);

            const actualKey = `actual_${code || name}`;
            const actual = Object.prototype.hasOwnProperty.call(this.manualQty, actualKey)
                ? (parseFloat(this.manualQty[actualKey]) || 0)
                : (onHandMv > 0 ? onHandMv : currentStock);

            const variance = actual - theoretical;
            const vcost    = variance * costValue;

            rows.push({ code, name, beginning, receiving: rec, purchasing: pur, trxIn: tin, trxOut: tout, waste: wst, returns: ret, posCons, manualCons, manual, actual, theoretical, variance, cost: vcost });
        });

        const confirm = await Swal.fire({ title: __('confirm'), icon: 'info', showCancelButton: true, confirmButtonText: __('save') });
        if (confirm.isConfirmed) {
            Utils.loading(true, __('processing'));
            try {
                await API.call('LOG_RECON', { rows });
                Utils.loading(false);
                Utils.toast(__('success'));
            } catch (e) {
                Utils.loading(false);
                Swal.fire(__('error'), e.toString(), 'error');
            }
        }
    },

    updateManualQty(id, val) {
        this.manualQty[id] = parseFloat(val) || 0;
        if (this._updateTimeout) clearTimeout(this._updateTimeout);
        this._updateTimeout = setTimeout(() => { this.updateView(); }, 800);
    },

    updateActualQty(id, val) {
        this.manualQty[`actual_${id}`] = parseFloat(val) || 0;
        if (this._updateTimeout) clearTimeout(this._updateTimeout);
        this._updateTimeout = setTimeout(() => { this.updateView(); }, 800);
    }
};
