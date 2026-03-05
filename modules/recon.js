/**
 * RECONCILIATION MODULE (Stock Reconciliation & Consumption Analysis)
 * Advanced Master Stock Control Ledger with Sticky Header & Search
 */
const Reconciliation = {
    filters: {
        from: '',
        to: '',
        location: '',
        category: '',
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
                <div class="flex flex-wrap justify-between items-center gap-4 bg-white p-6 rounded-xl border border-slate-100 shadow-sm shrink-0">
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
                                <label class="text-[8px] font-black text-slate-400 uppercase tracking-tighter">${isAr ? 'الموقع' : 'Location'}</label>
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

                <!-- Category Tabs -->
                <div class="flex flex-wrap items-center gap-2 bg-white/50 p-2 rounded-xl border border-slate-100/50 shrink-0">
                    <button onclick="Reconciliation.setCategory('')" class="h-9 px-6 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${!this.filters.category ? 'bg-black text-white shadow-lg' : 'bg-white text-black border border-slate-200 hover:bg-slate-100'}">
                        ${__('all')}
                    </button>
                    ${[...new Set(items.filter(i => i[1]).map(i => i[1]))].sort().map(cat => `
                        <button onclick="Reconciliation.setCategory('${cat}')" class="h-9 px-6 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${this.filters.category === cat ? 'bg-indigo-700 text-white shadow-lg' : 'bg-white text-black border border-slate-200 hover:bg-slate-100'}">
                            ${cat}
                        </button>
                    `).join('')}
                </div>

                <!-- Analysis Grid -->
                <div class="flex-1 min-h-0 bg-white rounded-xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden">
                    <div class="flex-1 overflow-auto custom-scrollbar" id="recon-scroll-container">
                        <table class="w-full ${isAr ? 'text-right' : 'text-left'} border-collapse text-[11px]" id="recon-table">
                            <thead class="sticky top-0 z-20 bg-slate-100 text-slate-900 text-[10px] border-b border-slate-300">
                                <tr>
                                    <th class="p-3 font-black text-slate-900 uppercase text-center border-b border-slate-200">#</th>
                                    <th class="p-3 font-black text-slate-900 uppercase border-b border-slate-200">${__('item_code')}</th>
                                    <th class="p-3 font-black text-slate-900 uppercase border-b border-slate-200">${__('item_name')}</th>
                                    <th class="p-3 font-black text-black uppercase text-center bg-blue-100 border-x border-slate-400 border-b border-slate-400">${isAr ? 'أول المدة' : 'Beg. Inv'}</th>
                                    <th class="p-3 font-black text-black uppercase text-center border-b border-slate-400">Recv</th>
                                    <th class="p-3 font-black text-black uppercase text-center border-b border-slate-400">Purch</th>
                                    <th class="p-3 font-black text-black uppercase text-center border-b border-slate-400">T-In</th>
                                    <th class="p-3 font-black text-black uppercase text-center border-b border-slate-400">T-Out</th>
                                    <th class="p-3 font-black text-black uppercase text-center border-b border-slate-400 font-black text-rose-600">Waste</th>
                                    <th class="p-3 font-black text-black uppercase text-center border-b border-slate-400 font-black text-rose-600">Ret</th>
                                    <th class="p-3 font-black text-black uppercase text-center bg-orange-100 border-x border-slate-400 border-b border-slate-400">Cons (POS)</th>
                                    <th class="p-3 font-black text-black uppercase text-center bg-red-100 border-b border-slate-400">${isAr ? 'استهلاك يدوي' : 'Cons (Manual)'}</th>
                                    <th class="p-3 font-black text-black uppercase text-center bg-amber-100 border-x border-slate-400 border-b border-slate-400">${isAr ? 'الرصيد الدفتري' : 'Theo. Stock'}</th>
                                    <th class="p-3 font-black text-black uppercase text-center bg-indigo-50 border-b border-slate-400">${isAr ? 'نسبة الـ Yield' : 'Yield %'}</th>
                                    <th class="p-3 font-black text-black uppercase text-center bg-blue-50 border-b border-slate-400">${isAr ? 'الرصيد بعد الـ Yield' : 'Theo. Stock (Yield)'}</th>
                                    <th class="p-3 font-black text-black uppercase text-center bg-emerald-100 border-b border-slate-400">${isAr ? 'رصيد فعلي (On Hand)' : 'Actual Count (On Hand)'}</th>
                                    <th class="p-3 font-black text-black uppercase text-center border-b border-slate-400">${__('variance')}</th>
                                    <th class="p-3 font-black text-black uppercase text-center border-b border-slate-400">${__('variance_value')}</th>
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
        
        // Add global listener for arrow keys if not already added
        if (!this._keyListenerAdded) {
            $(document).on('keydown', '.recon-input', (e) => {
                const row = parseInt($(e.target).data('row'));
                const col = parseInt($(e.target).data('col'));
                this.handleKey(e, row, col);
            });
            this._keyListenerAdded = true;
        }
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

    setCategory(cat) {
        this.filters.category = cat;
        this.render();
    },

    updateView() {
        const items = STATE.db.Items || [];
        $('#recon-tbody').html(this.renderRows(items));
    },

    handleKey(e, row, col) {
        const rowCount = $('#recon-tbody tr').length;
        let nextRow = row;
        let nextCol = col;

        if (e.key === 'ArrowUp') {
            nextRow = Math.max(0, row - 1);
        } else if (e.key === 'ArrowDown' || e.key === 'Enter') {
            nextRow = Math.min(rowCount - 1, row + 1);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            nextCol = 0;
        } else {
            return;
        }

        if (nextRow !== row || nextCol !== col) {
            e.preventDefault();
            const target = $(`.recon-input[data-row="${nextRow}"][data-col="${nextCol}"]`);
            if (target.length) {
                target.focus().select();
            }
        }
    },

    _buildConsMap(from, to) {
        const consMap = {};
        const sales = (STATE.db.Sales || []).map(s => {
            const d = s[1];
            let dateStr = '';
            if (d instanceof Date) {
                dateStr = d.toISOString().split('T')[0];
            } else if (typeof d === 'string') {
                const parts = d.split(' ')[0].split('T')[0];
                if (parts.includes('-')) {
                    dateStr = parts;
                } else if (parts.includes('/')) {
                    const bits = parts.split('/');
                    if (bits[0].length === 4) dateStr = bits.join('-');
                    else if (bits[2].length === 4) dateStr = `${bits[2]}-${bits[0].padStart(2,'0')}-${bits[1].padStart(2,'0')}`;
                    else dateStr = parts;
                } else {
                    dateStr = parts;
                }
            } else {
                dateStr = String(d || '').split('T')[0].split(' ')[0];
            }
            return [s[0], dateStr, ...s.slice(2)];
        });
        const recipes = STATE.db.Recipes || [];

        sales.forEach(s => {
            if (s[1] < from || s[1] > to) return;
            try {
                const cart = typeof s[3] === 'string' ? JSON.parse(s[3]) : (s[3] || []);
                cart.forEach(c => {
                    const q = parseFloat(c.qty) || 0;
                    const cName = String(c.name || '').trim().toLowerCase();
                    const cCode = String(c.code || '').trim().toLowerCase();
                    
                    if (cName) consMap[cName] = (consMap[cName] || 0) + q;
                    if (cCode && cCode !== '-') consMap[cCode] = (consMap[cCode] || 0) + q;
                    
                    const rc = recipes.find(r => String(r[1]).trim().toLowerCase() === cName);
                    if (rc) {
                        try {
                            const ingredients = typeof rc[2] === 'string' ? JSON.parse(rc[2]) : (rc[2] || []);
                            ingredients.forEach(ing => {
                                const val = (parseFloat(ing.qty) || 0) * q;
                                const iName = String(ing.name || '').trim().toLowerCase();
                                const iCode = String(ing.code || '').trim().toLowerCase();
                                if (iName) consMap[iName] = (consMap[iName] || 0) + val;
                                if (iCode && iCode !== '-') consMap[iCode] = (consMap[iCode] || 0) + val;
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
            let dateStr = '';
            if (d instanceof Date) {
                dateStr = d.toISOString().split('T')[0];
            } else {
                const parts = String(d || '').split('T')[0].split(' ')[0];
                if (parts.includes('-')) {
                    dateStr = parts;
                } else if (parts.includes('/')) {
                    const bits = parts.split('/');
                    if (bits[0].length === 4) dateStr = bits.join('-');
                    else if (bits[2].length === 4) dateStr = `${bits[2]}-${bits[0].padStart(2,'0')}-${bits[1].padStart(2,'0')}`;
                    else dateStr = parts;
                } else {
                    dateStr = parts;
                }
            }
            return [dateStr, ...m.slice(1)];
        });
    },

    renderRows(items) {
        const movements = this._normalizeMovements();
        const from = this.filters.from;
        const to = this.filters.to;
        const loc = this.filters.location;
        const search = this.filters.search;

        let filteredItems = items;
        if (search) {
            filteredItems = items.filter(i =>
                String(i[3] || '').toLowerCase().includes(search) ||
                String(i[2] || '').toLowerCase().includes(search)
            );
        }

        if (this.filters.category) {
            filteredItems = filteredItems.filter(i => String(i[1]) === this.filters.category);
        }

        if (!filteredItems.length) return `<tr><td colspan="18" class="text-center py-24 text-slate-300 italic font-bold">${__('no_trxs_found')}</td></tr>`;

        const consMap = this._buildConsMap(from, to);

        return filteredItems.map((item, rowIdx) => {
            const name = String(item[3] || '').trim();
            const code = String(item[2] || '').trim();
            const cost = parseFloat(item[5]) || 0;
            const currentStock = parseFloat(item[7]) || 0;

            const nameKey = name.toLowerCase();
            const codeKey = code.toLowerCase();

            const itemMv = movements.filter(m => (m[2] && m[2] !== '-' ? String(m[2]).trim() === code : String(m[3]).trim() === name));
            
            const getMv = (types, locCol) => {
                const typeList = Array.isArray(types) ? types : [types];
                const lowerTypes = typeList.map(t => String(t).toLowerCase());
                return itemMv
                    .filter(m => {
                        const mType = String(m[1] || '').trim().toLowerCase();
                        const matchesType = lowerTypes.includes(mType);
                        const matchesDate = m[0] >= from && m[0] <= to;
                        const matchesLoc = !loc || m[locCol || 10] === loc;
                        return matchesType && matchesDate && matchesLoc;
                    })
                    .reduce((s, m) => s + (parseFloat(m[4]) || 0), 0);
            };

            const beginning       = getMv(['Beginning Inventory', 'رصيد أول المدة'], 10);
            const receiving       = getMv(['Receiving', 'استلام توريد', 'استلام'], 10);
            const purchasing      = getMv(['Purchasing', 'شراء مباشر', 'شراء'], 10);
            const transferIn      = getMv(['Transfer In', 'تحويل وارد'], 10);
            const transferOut     = getMv(['Transfer Out', 'تحويل صادر'], 9);
            const waste           = getMv(['Waste', 'هالك'], 9);
            const returns         = getMv(['Return', 'مرتجع'], 9);
            const manualCons      = getMv(['Consumption', 'Consumption (Manual)', 'استهلاك (يدوي)', 'استهلاك'], 9);   
            const onHandMv        = getMv(['On Hand', 'جرد رصيد فعلي', 'رصيد فعلي (On Hand)'], 10);       

            const posConsumption = (codeKey && consMap[codeKey]) ? consMap[codeKey] : (consMap[nameKey] || 0);

            const yieldVal = (String(item[8]).trim() === "" || isNaN(parseFloat(item[8]))) ? 100 : parseFloat(item[8]);
            
            // Actual Count: On Hand movement > manual override > current stock
            const actualKey = `actual_${code || name}`;
            const actual = Object.prototype.hasOwnProperty.call(this.manualQty, actualKey)
                ? (parseFloat(this.manualQty[actualKey]) || 0)
                : (onHandMv > 0 ? onHandMv : currentStock);

            const results = Utils.calculateInventory({
                beginning_inventory: beginning,
                received: receiving,
                purchased: purchasing,
                transfer_in: transferIn,
                transfer_out: transferOut,
                waste: waste,
                returns: returns,
                pos_consumption: posConsumption,
                manual_consumption: manualCons,
                yield_percentage: yieldVal,
                actual_count: actual,
                item_cost: cost
            });

            const { theoretical_stock: theoretical, theoretical_stock_after_yield: theoStockYield, variance, variance_value: varianceCost } = results;

            const fz  = (val) => { const n = parseFloat(val)||0; return n===0 ? '<span class="text-slate-300">-</span>' : n.toFixed(2); };
            const fzc = (val) => { const n = parseFloat(val)||0; return n===0 ? '<span class="text-slate-300">-</span>' : Utils.formatCurrency(n); };

            const isManualActual = Object.prototype.hasOwnProperty.call(this.manualQty, actualKey);
            const isModified = isManualActual;

            return `
                <tr class="border-b border-slate-300 transition-colors ${isModified ? 'bg-blue-100 hover:bg-blue-200' : 'hover:bg-slate-50 text-black'}">
                    <td class="p-3 text-center text-black font-mono text-[11px] font-black border-b border-slate-300">${rowIdx + 1}</td>
                    <td class="p-3 font-mono text-black text-[12px] font-black whitespace-nowrap border-b border-slate-300">${code || '-'}</td>
                    <td class="p-3 font-black text-black whitespace-normal min-w-[160px] border-b border-slate-300 ${STATE.lang === 'ar' ? 'text-right' : 'text-left'}" title="${name}">${name}</td>
                    <td class="p-3 text-center font-black bg-blue-50 text-black border-b border-slate-300">${fz(beginning)}</td>
                    <td class="p-3 text-center font-black text-black border-b border-slate-300">${fz(receiving)}</td>
                    <td class="p-3 text-center font-black text-black border-b border-slate-300">${fz(purchasing)}</td>
                    <td class="p-3 text-center font-black text-black border-b border-slate-300">${fz(transferIn)}</td>
                    <td class="p-3 text-center font-black text-black border-b border-slate-300">${fz(transferOut)}</td>
                    <td class="p-3 text-center font-black text-rose-600 border-b border-slate-300">${fz(waste)}</td>
                    <td class="p-3 text-center font-black text-rose-600 border-b border-slate-300">${fz(returns)}</td>
                    <td class="p-3 text-center font-black bg-orange-50 text-black border-b border-slate-300">${fz(posConsumption)}</td>
                    <td class="p-3 text-center font-black bg-red-50 text-black border-b border-slate-300">${fz(manualCons)}</td>
                    <td class="p-3 text-center font-black bg-amber-50 text-black text-[13px] border-x border-amber-400 border-b border-slate-300">${fz(theoretical)}</td>
                    <td class="p-3 text-center font-black text-slate-600 bg-indigo-50 border-b border-slate-300">${yieldVal}%</td>
                    <td class="p-3 text-center font-black text-indigo-700 bg-blue-50 border-x border-blue-400 border-b border-slate-300">${fz(theoStockYield)}</td>
                    <td class="p-2 text-center bg-emerald-50 border-b border-slate-300">
                        <input type="number" step="any" min="0"
                            class="recon-input w-20 h-8 bg-white border border-black rounded-lg text-center text-[12px] font-black text-black focus:border-blue-600 outline-none shadow-sm transition-colors"
                            value="${actual || ''}" placeholder="0"
                            data-row="${rowIdx}" data-col="0"
                            oninput="Reconciliation.updateActualQty('${code || name}', this.value, this)">
                    </td>
                    <td class="p-3 text-center font-black border-b border-slate-300 ${variance < 0 ? 'bg-red-700 text-white' : (variance > 0 ? 'bg-green-700 text-white' : 'text-black')}">${fz(variance)}</td>
                    <td class="p-3 text-center font-black border-b border-slate-300 ${varianceCost < 0 ? 'bg-red-700 text-white' : (varianceCost > 0 ? 'bg-green-700 text-white' : 'text-black')}">${fzc(varianceCost)}</td>
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
            const name = String(item[3] || '').trim();
            const code = String(item[2] || '').trim();
            const costValue = parseFloat(item[5]) || 0;
            const currentStock = parseFloat(item[7]) || 0;

            const itemMv = movements.filter(m => (m[2] && m[2] !== '-' ? String(m[2]).trim() === code : String(m[3]).trim() === name));
            
            const getMv = (types, locCol) => {
                const typeList = Array.isArray(types) ? types : [types];
                const lowerTypes = typeList.map(t => String(t).toLowerCase());
                return itemMv
                    .filter(m => {
                        const mType = String(m[1] || '').trim().toLowerCase();
                        return lowerTypes.includes(mType) && m[0] >= from && m[0] <= to && (!loc || m[locCol || 10] === loc);
                    })
                    .reduce((s, m) => s + (parseFloat(m[4]) || 0), 0);
            };

            const beginning  = getMv(['Beginning Inventory', 'رصيد أول المدة'], 10);
            const rec        = getMv(['Receiving', 'استلام توريد', 'استلام'], 10);
            const pur        = getMv(['Purchasing', 'شراء مباشر', 'شراء'], 10);
            const tin        = getMv(['Transfer In', 'تحويل وارد'], 10);
            const tout       = getMv(['Transfer Out', 'تحويل صادر'], 9);
            const wst        = getMv(['Waste', 'هالك'], 9);
            const ret        = getMv(['Return', 'مرتجع'], 9);
            const manualCons = getMv(['Consumption', 'Consumption (Manual)', 'استهلاك (يدوي)', 'استهلاك'], 9);
            const onHandMv   = getMv(['On Hand', 'جرد رصيد فعلي', 'رصيد فعلي (On Hand)'], 10);

            const posCons  = (code && consMap[code.toLowerCase()]) ? consMap[code.toLowerCase()] : (consMap[name.toLowerCase()] || 0);
            const yieldVal = (String(item[8]).trim() === "" || isNaN(parseFloat(item[8]))) ? 100 : parseFloat(item[8]);

            const actualKey = `actual_${code || name}`;
            const actual = Object.prototype.hasOwnProperty.call(this.manualQty, actualKey)
                ? (parseFloat(this.manualQty[actualKey]) || 0)
                : (onHandMv > 0 ? onHandMv : currentStock);

            const results = Utils.calculateInventory({
                beginning_inventory: beginning,
                received: rec,
                purchased: pur,
                transfer_in: tin,
                transfer_out: tout,
                waste: wst,
                returns: ret,
                pos_consumption: posCons,
                manual_consumption: manualCons,
                yield_percentage: yieldVal,
                actual_count: actual,
                item_cost: costValue
            });

            rows.push({ 
                code, name, beginning, receiving: rec, purchasing: pur, trxIn: tin, trxOut: tout, 
                waste: wst, returns: ret, posCons, manualCons, 
                theoretical: results.theoretical_stock, 
                yieldVal, 
                theoStockYield: results.theoretical_stock_after_yield, 
                actual, 
                variance: results.variance, 
                cost: results.variance_value 
            });
        });

        const confirm = await Swal.fire({ title: __('confirm'), icon: 'info', showCancelButton: true, confirmButtonText: __('save') });
        if (confirm.isConfirmed) {
            Utils.loading(true, __('processing'));
            try {
                await API.call('LOG_RECON', { rows, branch: loc });
                Utils.loading(false);
                Utils.toast(__('success'));
            } catch (e) {
                Utils.loading(false);
                Swal.fire(__('error'), e.toString(), 'error');
            }
        }
    },

    updateActualQty(id, val, el) {
        const actualKey = `actual_${id}`;
        if (val === '') {
            delete this.manualQty[actualKey];
        } else {
            const num = parseFloat(val);
            if (num < 0) {
                if (el) el.value = 0;
                this.manualQty[actualKey] = 0;
            } else {
                this.manualQty[actualKey] = num || 0;
            }
        }
        if (this._updateTimeout) clearTimeout(this._updateTimeout);
        this._updateTimeout = setTimeout(() => { this.updateView(); }, 300);
    }
};
