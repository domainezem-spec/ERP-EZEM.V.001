/**
 * FINANCE & INTELLIGENCE MODULE (P&L Tracking & Business Analysis)
 * Advanced Profit & Loss Engine with Date Range Filtering
 */
const Finance = {
    filters: {
        from: new Date().toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0]
    },

    async render() {
        const expenses = STATE.db.EXPENSES || [];
        const isAr = STATE.lang === 'ar';
        
        // Initial P&L fetch for default date (Today)
        let plData = null;
        try {
            const res = await API.call('GET_PL_REPORT', this.filters);
            plData = res.data;
        } catch(e) { console.error("P&L Initial Error", e); }

        document.getElementById('main-content').innerHTML = `
            <div class="space-y-8 animate-fade-in ${isAr ? 'text-right' : 'text-left'}" dir="${isAr ? 'rtl' : 'ltr'}">
                
                <!-- Advanced Intelligence Header -->
                <div class="flex flex-wrap justify-between items-center gap-4 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-all">
                    <div class="flex items-center gap-4">
                        <div class="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                            <i class="fa-solid fa-file-invoice-dollar"></i>
                        </div>
                        <div>
                            <h2 class="text-2xl font-black text-slate-800 tracking-tight">${__('daily_pl')}</h2>
                            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Real-time Revenue, COGS & Net Margin Analysis</p>
                        </div>
                    </div>

                    <div class="flex flex-wrap gap-3 items-center">
                        <div class="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shadow-inner">
                            <div class="flex flex-col px-3 ${isAr ? 'border-l' : 'border-r'} border-slate-200">
                                <label class="text-[9px] font-black text-slate-400 uppercase">${isAr ? 'من' : 'From'}</label>
                                <input type="date" id="pl-from" class="bg-transparent text-xs font-bold outline-none" value="${this.filters.from}" onchange="Finance.updateFilters()">
                            </div>
                            <div class="flex flex-col px-3">
                                <label class="text-[9px] font-black text-slate-400 uppercase">${isAr ? 'إلى' : 'To'}</label>
                                <input type="date" id="pl-to" class="bg-transparent text-xs font-bold outline-none" value="${this.filters.to}" onchange="Finance.updateFilters()">
                            </div>
                        </div>
                        <button onclick="Finance.showAddExpense()" class="h-12 px-6 bg-rose-600 text-white rounded-[1.25rem] text-xs font-black shadow-xl shadow-rose-100 hover:bg-slate-900 transition-all flex items-center gap-2">
                            <i class="fa-solid fa-plus-circle"></i> ${__('add_expense')}
                        </button>
                    </div>
                </div>

                <!-- P&L Breakdown Grid -->
                <div id="pl-report-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    ${this.renderPLSummary(plData)}
                </div>

                <div class="grid grid-cols-1 xl:grid-cols-12 gap-8">
                     <!-- Expense Log -->
                    <div class="xl:col-span-8 space-y-6">
                        <div class="glass-card bg-white h-full">
                            <div class="flex justify-between items-center mb-6">
                                <h3 class="text-lg font-black text-slate-800 flex items-center gap-3">
                                    <i class="fa-solid fa-list-ul text-rose-500"></i> ${__('expense_log')}
                                </h3>
                            </div>

                            <div class="table-container shadow-sm bg-white overflow-hidden rounded-2xl border border-slate-100">
                                <div class="max-h-[400px] overflow-y-auto custom-scrollbar">
                                    <table class="w-full ${isAr ? 'text-right' : 'text-left'} border-collapse">
                                         <thead class="sticky top-0 bg-slate-50 z-10 border-b border-slate-100">
                                            <tr>
                                                <th class="p-4 text-[10px] font-black text-slate-400 uppercase">${isAr ? 'التاريخ' : 'Date'}</th>
                                                <th class="p-4 text-[10px] font-black text-slate-400 uppercase ${isAr ? 'text-right' : 'text-left'}">${__('category')}</th>
                                                <th class="p-4 text-[10px] font-black text-slate-400 uppercase">${__('notes')}</th>
                                                <th class="p-4 text-[10px] font-black text-slate-400 uppercase text-center">${__('amount')}</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-slate-50">
                                            ${this.renderExpenseRows(expenses)}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Visual Breakdown / KPI -->
                    <div class="xl:col-span-4 flex flex-col gap-6">
                        <div class="glass-card bg-slate-900 text-white p-8 rounded-[2.5rem] relative overflow-hidden h-full flex flex-col justify-between">
                            <div class="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
                            <div>
                                <h4 class="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2">Net Margin Performance</h4>
                                <div class="text-5xl font-black text-white" id="pl-net-display">${plData ? Utils.formatCurrency(plData.netProfit) : '...'}</div>
                            </div>
                            
                            <div class="space-y-4 mt-8">
                                <div class="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <span class="text-xs font-bold text-slate-400">Profitability Ratio</span>
                                    <span class="text-lg font-black text-emerald-400">${plData && plData.revenue > 0 ? ((plData.netProfit / plData.revenue) * 100).toFixed(1) + '%' : '0%'}</span>
                                </div>
                                <div class="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <span class="text-xs font-bold text-slate-400">COGS Impact</span>
                                    <span class="text-lg font-black text-rose-400">${plData && plData.revenue > 0 ? ((plData.cogs / plData.revenue) * 100).toFixed(1) + '%' : '0%'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderPLSummary(data) {
        if(!data) return `
            <div class="col-span-4 p-20 text-center bg-white rounded-3xl border border-dashed border-slate-200 animate-pulse">
                <i class="fa-solid fa-spinner fa-spin text-indigo-500 text-3xl mb-4"></i>
                <p class="text-slate-400 font-bold uppercase text-[10px]">${__('processing')}</p>
            </div>
        `;

        const cards = [
            { label: __('revenue'), value: data.revenue, color: 'text-emerald-600', bg: 'bg-emerald-50/50', icon: 'fa-cart-arrow-down' },
            { label: __('cogs'), value: data.cogs, color: 'text-amber-600', bg: 'bg-amber-50/50', icon: 'fa-boxes-stacked' },
            { label: __('expenses'), value: data.expenses, color: 'text-rose-600', bg: 'bg-rose-50/50', icon: 'fa-receipt' },
            { label: __('net_profit'), value: data.netProfit, color: 'text-indigo-600', bg: 'bg-indigo-50/50', icon: 'fa-sack-dollar' }
        ];

        return cards.map(c => `
            <div class="glass-card ${c.bg} border-transparent p-6 relative overflow-hidden group">
                <div class="absolute -bottom-4 -right-4 w-12 h-12 bg-white/20 rounded-full group-hover:scale-[3] transition-transform duration-700 opacity-20"></div>
                <div class="flex items-center gap-4 mb-3">
                    <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center ${c.color} shadow-sm">
                        <i class="fa-solid ${c.icon}"></i>
                    </div>
                </div>
                <div class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">${c.label}</div>
                <div class="text-2xl font-black text-slate-800">${Utils.formatCurrency(c.value)}</div>
            </div>
        `).join('');
    },

    renderExpenseRows(expenses) {
        if(!expenses.length) return `<tr><td colspan="5" class="text-center py-20 text-slate-400 italic">No business expenses documented</td></tr>`;
        
        return expenses.slice().reverse().map((exp, idx) => `
            <tr class="hover:bg-slate-50/50 transition-colors">
                <td class="p-4 text-slate-400 font-mono text-[10px]">${Utils.formatDate(exp[0])}</td>
                <td class="p-4">
                    <span class="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-tight">${exp[1]}</span>
                </td>
                <td class="p-4 font-bold text-slate-600 text-xs">${exp[3] || '-'}</td>
                <td class="p-4 text-center font-black text-rose-600">${Utils.formatCurrency(exp[2])}</td>
                <td class="p-4 text-center">
                    <button onclick="Finance.deleteExpense(${expenses.length - 1 - idx})" class="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all"><i class="fa-solid fa-trash text-[9px]"></i></button>
                </td>
            </tr>
        `).join('');
    },

    async deleteExpense(rowIndex) {
        const res = await Swal.fire({ title: __('confirm'), icon: 'warning', showCancelButton: true });
        if (res.isConfirmed) {
            Utils.loading(true, __('processing'));
            try {
                // rowIndex in frontend is base 0 from data, but sheet is base 1 and has header
                // However, we filter expenses by date in memory often. 
                // Better to use sheet rowIndex directly if possible.
                // For now, let's use rowIndex + 2 (1 for header, 1 for 1-based) if it were the full sheet.
                // But it's safer to use DELETE_RECORD if we had IDs. 
                // Expenses don't have IDs in common schema. Let's use direct rowIndex.
                await API.call('DELETE_RECORD', { sheet: 'Expenses', rowIndex: rowIndex + 2 });
                await App.syncData();
                this.render();
                Utils.toast(__('success'));
            } catch(e) { Swal.fire(__('error'), e.toString(), 'error'); }
            finally { Utils.loading(false); }
        }
    },

    async updateFilters() {
        this.filters.from = $('#pl-from').val();
        this.filters.to = $('#pl-to').val();
        
        $('#pl-report-container').html(this.renderPLSummary(null));
        
        try {
            await API.call('GET_PL_REPORT', this.filters);
            this.render(); // Re-render everything with new data
        } catch(e) { Swal.fire('Error', e.toString(), 'error'); }
    },

    showAddExpense() {
        const isAr = STATE.lang === 'ar';
        const body = `
            <div class="space-y-6 animate-scale-in ${isAr ? 'text-right' : 'text-left'}" dir="${isAr ? 'rtl' : 'ltr'}">
                <div class="text-center">
                    <div class="w-14 h-14 bg-rose-50 text-rose-600 rounded-[1.5rem] flex items-center justify-center text-2xl mx-auto mb-4 shadow-inner">
                        <i class="fa-solid fa-receipt"></i>
                    </div>
                    <h3 class="text-xl font-black text-slate-800">${__('add_expense')}</h3>
                    <p class="text-[10px] text-slate-400 font-bold uppercase mt-1">Documenting operational spending</p>
                </div>
                
                <div class="grid grid-cols-1 gap-4">
                    <div>
                        <label class="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">${__('expense_cat')}</label>
                        <select id="exp-cat" class="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold">
                            <option value="Labor">Labor & Salaries</option>
                            <option value="Rent">Facility Rent</option>
                            <option value="Utilities">Electricity/Water</option>
                            <option value="Purchases">Inventory Purchases</option>
                            <option value="Maintenance">Maintenance</option>
                            <option value="Marketing">Marketing/Ads</option>
                            <option value="Other">General / Other</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">${__('amount')}</label>
                        <input type="number" id="exp-amount" class="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold" placeholder="0.00">
                    </div>
                    <div>
                        <label class="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">${__('notes')}</label>
                        <textarea id="exp-notes" class="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold" rows="3" placeholder="..."></textarea>
                    </div>
                </div>
                
                <button onclick="Finance.saveExpense()" class="w-full h-14 bg-rose-600 text-white rounded-2xl text-[14px] font-black shadow-xl shadow-rose-100 hover:bg-slate-900 transition-all flex items-center justify-center gap-3 mt-4">
                    <span>${__('save')}</span>
                    <i class="fa-solid fa-cloud-arrow-up"></i>
                </button>
            </div>
        `;
        Utils.openModal(body);
        setTimeout(() => {
            $('#exp-cat, #exp-amount, #exp-notes').on('keypress', function(e) {
                if(e.which === 13) Finance.saveExpense();
            });
        }, 100);
    },

    async saveExpense() {
        const data = {
            item: $('#exp-cat').val(),
            amount: parseFloat($('#exp-amount').val()) || 0,
            reason: $('#exp-notes').val()
        };
        
        if(!data.amount || data.amount <= 0) return Swal.fire(__('warning'), 'Invalid amount', 'warning');

        Utils.loading(true, __('processing'));
        try {
            await API.call('SAVE_EXPENSE', data);
            await App.syncData();
            Utils.closeModal();
            this.render();
            Utils.toast(__('success'));
        } catch(e) { Swal.fire(__('error'), e.toString(), 'error'); }
        finally { Utils.loading(false); }
    }
};
