/**
 * REPORTS HUB (Advanced Analytics Center)
 * Central hub for all system reports and data exports
 */
const ReportsHub = {
    render() {
        const isAr = STATE.lang === 'ar';
        const sections = [
            {
                title: isAr ? 'الاستخبارات الاستراتيجية والربحية' : 'Strategic Intelligence & Profitability',
                icon: 'fa-brain',
                color: 'indigo',
                items: [
                    { id: 'item_profitability', label: isAr ? 'ربحية الأصناف (Item P&L)' : 'Item Profitability (P&L)', desc: 'Revenue vs. Cost per product' },
                    { id: 'waste_intel', label: isAr ? 'ذكاء الهالك (Waste Intel)' : 'Waste Intelligence', desc: 'Detailed loss reason analysis' },
                    { id: 'supplier_aging', label: isAr ? 'ديون ومسحوبات الموردين' : 'Supplier Aging & Balances', desc: 'Accounts payable tracking' },
                    { id: 'promotion_impact', label: isAr ? 'تأثير العروض والخصومات' : 'Promotion & Discount Impact', desc: 'ROI on marketing spend' }
                ]
            },
            {
                title: isAr ? 'تقارير المخزون والإنتاج' : 'Inventory & Stock Reports',
                icon: 'fa-boxes-stacked',
                color: 'slate',
                items: [
                    { id: 'inv_levels', label: isAr ? 'تقرير مستويات المخزون' : 'Inventory Levels Reports', desc: 'Current stock value and quantities' },
                    { id: 'moves_analysis', label: isAr ? 'تحليل الحركات المتقدم' : 'Advanced Movements Analysis', desc: 'Filter by item, date, or reason' },
                    { id: 'consumption_date', label: isAr ? 'الاستهلاك بالتاريخ' : 'Consumption By Date', desc: 'Ingredient usage over time' },
                    { id: 'item_sales_cons', label: isAr ? 'المبيعات مقابل الاستهلاك' : 'Items Sales & Consumption', desc: 'Sale vs. Ingredient usage' },
                    { id: 'item_sales', label: isAr ? 'تقرير مبيعات الأصناف' : 'Item Sales Report', desc: 'Detailed item-level performance' },
                    { id: 'onspot_cons', label: isAr ? 'الاستهلاك المباشر' : 'OnSpot Consumption By Date', desc: 'Direct stock removals' }
                ]
            },
            {
                title: isAr ? 'الورديات والتشغيل' : 'Session & Operations',
                icon: 'fa-cash-register',
                color: 'emerald',
                items: [
                    { id: 'session_summary', label: isAr ? 'ملخص الوردية' : 'Session Summary Report', desc: 'Detailed shift balance breakdown' },
                    { id: 'session_receipt', label: isAr ? 'إيصال إغلاق الوردية' : 'Session Receipt', desc: 'Printable shift closing document' },
                    { id: 'order_tracking', label: isAr ? 'تقرير تتبع الطلبات' : 'Order Tracking Report', desc: 'Timeline of order fulfillment' },
                    { id: 'daily_sales', label: isAr ? 'المبيعات اليومية' : '01-Daily Sales', desc: 'Standard operating daily log' }
                ]
            },
            {
                title: isAr ? 'تحليل المبيعات والإيرادات' : 'Sales & Revenue Analysis',
                icon: 'fa-chart-pie',
                color: 'blue',
                items: [
                    { id: 'detailed_delivery', label: isAr ? 'تقرير التوصيل التفصيلي' : 'Detailed Delivery Report', desc: 'Driver and time analysis' },
                    { id: 'ar_pm', label: isAr ? 'المبيعات حسب طرق الدفع' : 'AR Branches sales by Payment Methods', desc: 'Visa, Cash, Mixed analysis' },
                    { id: 'sales_by_item', label: isAr ? 'المبيعات حسب الصنف' : 'Sales By Item', desc: 'Top performing product list' },
                    { id: 'delivery_charge', label: isAr ? 'رسوم خدمة التوصيل' : 'Delivery Service Charge Group', desc: 'Service fee revenue log' }
                ]
            },
            {
                title: isAr ? 'التقارير المتقدمة (حركات المخزون)' : 'Advanced Movement Reports',
                icon: 'fa-file-lines',
                color: 'orange',
                items: [
                    { id: 'mvmt_purchasing', label: isAr ? 'تقرير المشتريات' : 'Purchasing Report', desc: 'Filter: Trx Type = Purchasing' },
                    { id: 'mvmt_receiving', label: isAr ? 'تقرير الاستلامات' : 'Receiving Report', desc: 'Filter: Trx Type = Receiving' },
                    { id: 'mvmt_waste', label: isAr ? 'تقرير الهالك' : 'Waste Report', desc: 'Filter: Trx Type = Waste' },
                    { id: 'mvmt_transfer', label: isAr ? 'تقرير التحويلات' : 'Transfer Report', desc: 'Filter: Trx Type = Transfer' },
                    { id: 'mvmt_return', label: isAr ? 'تقرير المرتجعات' : 'Return Report', desc: 'Filter: Trx Type = Return' }
                ]
            },
            {
                title: isAr ? 'المنصات الخارجية' : 'External Integrations',
                icon: 'fa-motorcycle',
                color: 'rose',
                items: [
                    { id: 'talabat_report', label: isAr ? 'تقرير طلبات' : 'Talabat Report', desc: 'Standard Talabat integration log' }
                ]
            }
        ];

        document.getElementById('main-content').innerHTML = `
            <div class="space-y-6 animate-fade-in pb-10 ${isAr ? 'text-right' : 'text-left'}" dir="${isAr ? 'rtl' : 'ltr'}">
                <!-- Slim Header -->
                <div class="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm transition-all duration-300">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-lg shadow-lg shadow-indigo-100">
                            <i class="fa-solid fa-chart-line"></i>
                        </div>
                        <div>
                            <h2 class="text-lg font-black text-slate-800 tracking-tight leading-none mb-1">${__('reports_engine')}</h2>
                            <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Global Analytics & Professional Exports</p>
                        </div>
                    </div>
                    
                    <!-- Hidden inputs to prevent ReferenceErrors -->
                    <div class="hidden">
                        <input type="date" id="report_from">
                        <input type="date" id="report_to">
                    </div>
                </div>

                <!-- Slim Controls -->
                <div class="flex flex-wrap items-center gap-4">
                    <div class="relative flex-1 min-w-[300px]">
                        <i class="fa-solid fa-search absolute ${isAr ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-300 text-xs text-xs"></i>
                        <input type="text" placeholder="${__('search')}" onkeyup="ReportsHub.search(this.value)" 
                            class="w-full h-11 ${isAr ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'} bg-white border border-slate-200 rounded-2xl text-[12px] font-bold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50/50 transition-all placeholder:text-slate-300">
                    </div>
                    
                    <div class="flex items-center gap-2">
                        <button class="h-11 px-6 bg-slate-900 text-white text-[11px] font-black rounded-2xl hover:bg-slate-800 transition-all uppercase tracking-widest flex items-center gap-2">
                            <i class="fa-solid fa-file-pdf"></i> Bulk Export
                        </button>
                    </div>
                </div>

                <!-- Compact Sections Grid -->
                <div class="grid grid-cols-1 gap-6">
                    ${sections.map(sec => `
                        <div class="report-section">
                            <div class="flex items-center gap-2 mb-3 px-2">
                                <div class="w-1.5 h-1.5 rounded-full bg-${sec.color}-500"></div>
                                <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">${sec.title}</h3>
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                                ${sec.items.map(item => `
                                    <div onclick="ReportsHub.openReport('${item.id}')" 
                                        class="report-card group bg-white border border-slate-100 rounded-2xl p-4 transition-all duration-300 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/5 cursor-pointer relative overflow-hidden">
                                        <div class="absolute -right-2 -top-2 w-16 h-16 bg-slate-50 group-hover:bg-indigo-50 rounded-full blur-2xl transition-all"></div>
                                        <div class="relative z-10 flex flex-col h-full justify-between">
                                            <div class="flex items-start justify-between mb-3">
                                                <div class="w-9 h-9 bg-slate-50 group-hover:bg-indigo-500 group-hover:text-white rounded-xl flex items-center justify-center text-slate-400 transition-all duration-300">
                                                    <i class="fa-solid fa-file-contract"></i>
                                                </div>
                                                <div class="text-[10px] text-slate-200 group-hover:text-indigo-400 transition-all">
                                                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                                </div>
                                            </div>
                                            <div>
                                                <div class="text-[11px] font-black text-slate-800 mb-0.5 group-hover:text-indigo-600 transition-colors">${item.label}</div>
                                                <div class="text-[9px] text-slate-400 font-bold uppercase tracking-tight line-clamp-1">${item.desc}</div>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Set default dates
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('report_from').value = today;
        document.getElementById('report_to').value = today;
    },

    syncDates() {
        const from = document.getElementById('report_from').value;
        const to = document.getElementById('report_to').value;
        const isAr = STATE.lang === 'ar';
        Utils.toast(isAr ? `تم تحديث المدى: من ${from} إلى ${to}` : `Range synced: ${from} to ${to}`);
    },

    async openReport(id) {
        const isAr = STATE.lang === 'ar';
        const today = new Date().toISOString().split('T')[0];

        // 1. Prompt for Date Range First (As per user request)
        const { value: formValues } = await Swal.fire({
            title: isAr ? 'تحديد فترة التقرير' : 'Select Report Period',
            html: `
                <div class="flex flex-col gap-4 p-4">
                    <div class="flex flex-col text-right">
                        <label class="text-[10px] font-black text-slate-400 mb-1 uppercase">${isAr ? 'من تاريخ' : 'From Date'}</label>
                        <input type="date" id="swal-from" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none" value="${today}">
                    </div>
                    <div class="flex flex-col text-right">
                        <label class="text-[10px] font-black text-slate-400 mb-1 uppercase">${isAr ? 'إلى تاريخ' : 'To Date'}</label>
                        <input type="date" id="swal-to" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none" value="${today}">
                    </div>
                </div>
            `,
            focusConfirm: false,
            preConfirm: () => {
                return {
                    from: document.getElementById('swal-from').value,
                    to: document.getElementById('swal-to').value
                }
            },
            confirmButtonText: isAr ? 'عرض البيانات' : 'View Report',
            showCancelButton: true,
            cancelButtonText: isAr ? 'تراجع' : 'Cancel',
            customClass: {
                popup: 'rounded-[2.5rem]',
                confirmButton: 'btn-premium bg-indigo-600 text-white rounded-2xl px-10 py-3 font-black',
                cancelButton: 'btn-premium bg-slate-100 text-slate-500 rounded-2xl px-10 py-3 font-black'
            }
        });

        if (!formValues) return;

        const { from, to } = formValues;

        const reportNames = {
            'daily_sales': isAr ? 'تحليل المبيعات اليومية' : 'Daily Sales Performance',
            'inv_levels': isAr ? 'تقييم المخزون الحالي' : 'Core Inventory Valuation',
            'item_sales': isAr ? 'الأصناف الأكثر مبيعاً' : 'Top Performing Products',
            'sales_by_item': isAr ? 'المبيعات حسب الصنف' : 'Top Performing Products',
            'session_summary': isAr ? 'ملخص إغلاق الوردية' : 'Session Balance Verification',
            'onspot_cons': isAr ? 'الاستهلاك المباشر' : 'OnSpot Direct Usage',
            'order_tracking': isAr ? 'سجل تتبع الطلبات' : 'Fulfillment Timeline Log',
            'ar_pm': isAr ? 'طرق الدفع المستخدمة' : 'Payment Gateway Mix',
            'talabat_report': isAr ? 'تقرير منصة طلبات' : 'Talabat Integration Stream',
            'delivery_charge': isAr ? 'إيرادات خدمة التوصيل' : 'Delivery Logistics Revenue',
            'consumption_date': isAr ? 'الاستهلاك حسب التاريخ' : 'Usage by Date Analytics',
            'item_sales_cons': isAr ? 'تحليل المبيعات والاستهلاك' : 'Sales/Usage Correlation',
            'item_profitability': isAr ? 'ربحية الأصناف' : 'Item-Level Profitability',
            'waste_intel': isAr ? 'تحليل أسباب الهالك' : 'Waste Intelligence Analysis',
            'supplier_aging': isAr ? 'ديون الموردين' : 'Supplier Debt Aging',
            'moves_analysis': isAr ? 'تحليل الحركات المتقدم' : 'Advanced Movement Analysis',
            'mvmt_purchasing': isAr ? 'تقرير المشتريات التفصيلي' : 'Detailed Purchasing Report',
            'mvmt_receiving': isAr ? 'تقرير الاستلامات التفصيلي' : 'Detailed Receiving Report',
            'mvmt_waste': isAr ? 'تقرير الهالك التفصيلي' : 'Detailed Waste Report',
            'mvmt_transfer': isAr ? 'تقرير التحويلات التفصيلي' : 'Detailed Transfer Report',
            'mvmt_return': isAr ? 'تقرير المرتجعات التفصيلي' : 'Detailed Return Report'
        };

        Utils.loading(true, isAr ? 'جاري تجميع البيانات...' : 'Compiling Analytics...');
        try {
            const res = await API.call('GENERATE_REPORT', { 
                reportId: id, 
                shiftId: STATE.db.activeShift?.id,
                dateFrom: from,
                dateTo: to
            });
            Utils.loading(false);
            
            let html = `<div class="space-y-4 ${isAr ? 'text-right' : 'text-left'}" dir="${isAr ? 'rtl' : 'ltr'}">`;
            html += `<div class="flex justify-between items-center px-4 py-2 bg-slate-50 rounded-xl mb-2">
                        <span class="text-[9px] font-black text-slate-400 uppercase">${isAr ? 'الفترة المختارة' : 'Selected Period'}</span>
                        <span class="text-[10px] font-bold text-slate-600">${from} -> ${to}</span>
                     </div>`;
            
            if(id === 'daily_sales') {
                html += `<div class="bg-indigo-600 p-8 rounded-[2rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
                            <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                            <div class="relative z-10 text-center">
                                <div class="text-[10px] font-black opacity-60 uppercase mb-2 tracking-widest">${isAr ? 'إجمالي المبيعات' : 'Total Period Revenue'}</div>
                                <div class="text-4xl font-black">${res.data.total.toFixed(2)} <span class="text-sm opacity-50">EGP</span></div>
                                <div class="grid grid-cols-2 gap-4 mt-8 border-t border-white/10 pt-6">
                                    <div><div class="text-[9px] opacity-40 uppercase font-black">${isAr ? 'عدد الطلبات' : 'Total Orders'}</div><div class="text-xl font-black">${res.data.count}</div></div>
                                    <div><div class="text-[9px] opacity-40 uppercase font-black">${isAr ? 'متوسط الفاتورة' : 'Avg Transaction'}</div><div class="text-xl font-black">${(res.data.total / (res.data.count || 1)).toFixed(2)}</div></div>
                                </div>
                            </div>
                        </div>`;
            } else if(id === 'inv_levels') {
                const totalVal = res.data.totalValue || 0;
                const itemCount = res.data.items.length;
                html += `
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div class="bg-emerald-600 p-6 rounded-[2rem] text-white shadow-xl shadow-emerald-100 flex flex-col justify-center">
                            <div class="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">${isAr ? 'قيمة المخزون الإجمالية' : 'Total Inventory Value'}</div>
                            <div class="text-3xl font-black">${totalVal.toFixed(2)} <span class="text-xs opacity-50">EGP</span></div>
                        </div>
                        <div class="bg-slate-800 p-6 rounded-[2rem] text-white shadow-xl shadow-slate-100 flex flex-col justify-center">
                            <div class="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">${isAr ? 'عدد الأصناف المسجلة' : 'Tracked Items'}</div>
                            <div class="text-3xl font-black">${itemCount}</div>
                        </div>
                    </div>
                    <div class="max-h-[400px] overflow-y-auto space-y-2 custom-scrollbar p-1">
                        ${res.data.items.map(it => `<div class="flex justify-between p-3.5 bg-white border border-slate-100 rounded-2xl hover:border-indigo-400 transition-all"><span class="text-[11px] font-black text-slate-800">${it.name}</span><span class="text-[11px] font-black text-indigo-600">${it.stock} ${it.unit}</span></div>`).join('')}
                    </div>`;
            } else if(id === 'item_profitability') {
                const data = Object.entries(res.data).map(([name, vals]) => ({ name, ...vals, profit: vals.revenue - vals.cost }));
                const totalRev = data.reduce((s, i) => s + i.revenue, 0);
                const totalCost = data.reduce((s, i) => s + i.cost, 0);
                const totalProfit = totalRev - totalCost;
                const avgMargin = (totalProfit / (totalRev || 1)) * 100;

                html += `
                    <div class="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                        <div class="bg-blue-600 p-5 rounded-2xl text-white shadow-lg">
                            <div class="text-[8px] font-black opacity-60 uppercase mb-1">${isAr ? 'إجمالي الإيرادات' : 'Total Revenue'}</div>
                            <div class="text-xl font-black">${Utils.formatCurrency(totalRev)}</div>
                        </div>
                        <div class="bg-rose-500 p-5 rounded-2xl text-white shadow-lg">
                            <div class="text-[8px] font-black opacity-60 uppercase mb-1">${isAr ? 'إجمالي التكاليف' : 'Total Cost of Sales'}</div>
                            <div class="text-xl font-black">${Utils.formatCurrency(totalCost)}</div>
                        </div>
                        <div class="bg-emerald-600 p-5 rounded-2xl text-white shadow-lg lg:col-span-1 col-span-2">
                            <div class="text-[8px] font-black opacity-60 uppercase mb-1">${isAr ? 'صافي الربح التشغيلي' : 'Net Operating Profit'}</div>
                            <div class="text-xl font-black">${Utils.formatCurrency(totalProfit)} <span class="text-[10px] opacity-60">(${avgMargin.toFixed(1)}%)</span></div>
                        </div>
                    </div>
                    <div class="space-y-3 max-h-[500px] overflow-y-auto p-1 custom-scrollbar">
                        ${data.map(it => `
                            <div class="p-4 bg-white border border-slate-100 rounded-2xl hover:border-emerald-400 transition-all">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-[11px] font-black text-slate-800">${it.name}</span>
                                    <span class="text-[10px] font-black ${it.profit > 0 ? 'text-emerald-500 bg-emerald-50' : 'text-rose-500 bg-rose-50'} px-2 py-0.5 rounded-lg">P&L: ${Utils.formatCurrency(it.profit)}</span>
                                </div>
                                <div class="grid grid-cols-3 gap-2">
                                    <div class="text-center p-2 bg-slate-50 rounded-xl"><div class="text-[8px] text-slate-400 font-bold uppercase">Qty</div><div class="text-[10px] font-black">${it.qty}</div></div>
                                    <div class="text-center p-2 bg-slate-50 rounded-xl"><div class="text-[8px] text-slate-400 font-bold uppercase">Rev</div><div class="text-[10px] font-black">${Utils.formatCurrency(it.revenue)}</div></div>
                                    <div class="text-center p-2 bg-slate-50 rounded-xl"><div class="text-[8px] text-slate-400 font-bold uppercase">Margin</div><div class="text-[10px] font-black">${((it.profit / (it.revenue || 1)) * 100).toFixed(1)}%</div></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>`;
            } else if(id === 'waste_intel') {
                 const data = Object.entries(res.data);
                 const totalLoss = data.reduce((sum, d) => sum + d[1], 0);
                 const incidentCount = data.length;
                 html += `
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div class="bg-rose-500 p-6 rounded-[2rem] text-white shadow-xl flex flex-col justify-center">
                            <div class="text-[10px] font-black opacity-60 uppercase mb-1">${isAr ? 'إجمالي تكلفة الهالك' : 'Total Waste Loss'}</div>
                            <div class="text-3xl font-black">${Utils.formatCurrency(totalLoss)}</div>
                        </div>
                        <div class="bg-slate-800 p-6 rounded-[2rem] text-white shadow-xl flex flex-col justify-center">
                            <div class="text-[10px] font-black opacity-60 uppercase mb-1">${isAr ? 'عدد الأسباب المسجلة' : 'Waste Reasons'}</div>
                            <div class="text-3xl font-black">${incidentCount}</div>
                        </div>
                    </div>
                    <div class="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar p-1">
                        ${data.map(([reason, amount]) => `
                            <div class="flex justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-rose-400 transition-all">
                                <span class="text-[11px] font-black text-slate-700">${reason}</span>
                                <span class="text-[11px] font-black text-rose-600">${Utils.formatCurrency(amount)}</span>
                            </div>
                        `).join('')}
                    </div>`;
            } else if(id === 'supplier_aging') {
                const data = STATE.db.supplierBalances || [];
                const totalDebt = data.reduce((sum, s) => sum + (parseFloat(s.balance) || 0), 0);
                const supplierCount = data.length;
                html += `
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div class="bg-indigo-600 p-6 rounded-[2rem] text-white shadow-xl flex flex-col justify-center">
                            <div class="text-[10px] font-black opacity-60 uppercase mb-1">${isAr ? 'إجمالي ديون الموردين' : 'Total Outstanding Debt'}</div>
                            <div class="text-3xl font-black">${Utils.formatCurrency(totalDebt)}</div>
                        </div>
                        <div class="bg-slate-800 p-6 rounded-[2rem] text-white shadow-xl flex flex-col justify-center">
                            <div class="text-[10px] font-black opacity-60 uppercase mb-1">${isAr ? 'عدد الموردين' : 'Supplier Count'}</div>
                            <div class="text-3xl font-black">${supplierCount}</div>
                        </div>
                    </div>
                    <div class="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar p-1">
                        ${data.map(s => `
                            <div class="flex justify-between items-center p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-400 transition-all">
                                <div>
                                    <div class="text-[11px] font-black text-slate-800">${s.name}</div>
                                    <div class="text-[8px] text-slate-400 font-bold uppercase">Open Balance</div>
                                </div>
                                <div class="text-right">
                                    <div class="text-[12px] font-black text-indigo-600">${Utils.formatCurrency(s.balance)}</div>
                                    <div class="text-[8px] font-black text-rose-500 bg-rose-50 px-1.5 rounded-full inline-block">Unpaid</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>`;
            } else if(id.startsWith('mvmt_') || id === 'moves_analysis') {
                const totalCost = res.data.reduce((sum, m) => sum + (parseFloat(m.total || m.Total || 0) || 0), 0);
                const totalQty = res.data.reduce((sum, m) => sum + (parseFloat(m.qty || m.Qty || 0) || 0), 0);
                const uniqueItems = new Set(res.data.map(m => m.item || m.ItemName)).size;
                const movesCount = res.data.length;

                html += `
                    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                        <div class="bg-indigo-600 p-4 rounded-2xl text-white shadow-lg">
                            <div class="text-[8px] font-black opacity-60 uppercase mb-1">${isAr ? 'إجمالي التكلفة' : 'Total Cost'}</div>
                            <div class="text-lg font-black">${Utils.formatCurrency(totalCost)}</div>
                        </div>
                        <div class="bg-emerald-600 p-4 rounded-2xl text-white shadow-lg">
                            <div class="text-[8px] font-black opacity-60 uppercase mb-1">${isAr ? 'إجمالي الكميات' : 'Total Quantities'}</div>
                            <div class="text-lg font-black">${totalQty.toFixed(2)}</div>
                        </div>
                        <div class="bg-amber-500 p-4 rounded-2xl text-white shadow-lg">
                            <div class="text-[8px] font-black opacity-60 uppercase mb-1">${isAr ? 'عدد الأصناف' : 'Unique Items'}</div>
                            <div class="text-lg font-black">${uniqueItems}</div>
                        </div>
                        <div class="bg-slate-800 p-4 rounded-2xl text-white shadow-lg">
                            <div class="text-[8px] font-black opacity-60 uppercase mb-1">${isAr ? 'عدد العمليات' : 'Total Moves'}</div>
                            <div class="text-lg font-black">${movesCount}</div>
                        </div>
                    </div>
                    <div class="mb-4 flex gap-2 no-print px-1">
                        <input type="text" id="moves_search" placeholder="${isAr ? 'البحث عن صنف أو سبب...' : 'Search item or reason...'}" class="flex-1 p-4 bg-white border border-slate-200 rounded-2xl text-[11px] font-black outline-none focus:border-indigo-500 transition-all shadow-lg shadow-slate-100">
                    </div>
                    <div class="overflow-x-auto rounded-[1.5rem] border border-slate-100 shadow-sm max-h-[500px] overflow-y-auto custom-scrollbar">
                        <table class="w-full text-[11px] border-collapse" id="moves_table">
                            <thead class="sticky top-0 z-20">
                                <tr class="bg-slate-900 text-white uppercase font-black">
                                    <th class="p-4 text-center">#</th>
                                    <th class="p-4 text-right">${isAr ? 'التاريخ' : 'Date'}</th>
                                    <th class="p-4 text-center">${isAr ? 'النوع' : 'Trx Type'}</th>
                                    <th class="p-4 text-right">${isAr ? 'الصنف' : 'Item Name'}</th>
                                    <th class="p-4 text-center">${isAr ? 'الكمية' : 'Qty'}</th>
                                    <th class="p-4 text-right">${isAr ? 'تكلفة' : 'Cost'}</th>
                                    <th class="p-4 text-right">${isAr ? 'الإجمالي' : 'Total'}</th>
                                    <th class="p-4 text-center">${isAr ? 'الصلاحية' : 'Expiry'}</th>
                                    <th class="p-4 text-right">${isAr ? 'من' : 'From'}</th>
                                    <th class="p-4 text-right">${isAr ? 'إلى' : 'To'}</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-slate-50">
                                ${res.data.map((m, idx) => `
                                    <tr class="hover:bg-indigo-50/30 transition-all group">
                                        <td class="p-4 text-center text-slate-400 font-bold">${idx + 1}</td>
                                        <td class="p-4 font-bold text-slate-600 whitespace-nowrap">${String(m.date).split('T')[0]}</td>
                                        <td class="p-4 text-center">
                                            <span class="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase ${m.type === 'Waste' ? 'bg-rose-50 text-rose-500' : 'bg-indigo-50 text-indigo-600'}">
                                                ${m.type}
                                            </span>
                                        </td>
                                        <td class="p-4 font-black text-slate-800">${m.item || m.ItemName || '-'}</td>
                                        <td class="p-4 text-center font-black text-indigo-600">${m.qty || m.Qty || 0}</td>
                                        <td class="p-4 text-right font-bold text-slate-500">${Utils.formatCurrency(m.cost || m.Cost || 0)}</td>
                                        <td class="p-4 text-right font-black text-slate-900">${Utils.formatCurrency(m.total || m.Total || 0)}</td>
                                        <td class="p-4 text-center text-[9px] font-bold text-slate-400">${m.batch || 'N/A'}</td>
                                        <td class="p-4 text-right text-slate-500 text-[10px]">${m.from || '-'}</td>
                                        <td class="p-4 text-right text-slate-500 text-[10px]">${m.to || '-'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
            } else if(id === 'item_sales' || id === 'sales_by_item' || id === 'item_sales_cons') {
                const sorted = Object.entries(res.data).sort((a,b) => b[1] - a[1]);
                const totalQty = sorted.reduce((sum, item) => sum + item[1], 0);
                const uniqueItems = sorted.length;
                
                html += `
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div class="bg-blue-600 p-6 rounded-[2rem] text-white shadow-xl flex flex-col justify-center">
                            <div class="text-[10px] font-black opacity-60 uppercase mb-1">${isAr ? 'إجمالي الوحدات المباعة' : 'Total Units Sold'}</div>
                            <div class="text-3xl font-black">${totalQty.toFixed(2)}</div>
                        </div>
                        <div class="bg-indigo-900 p-6 rounded-[2rem] text-white shadow-xl flex flex-col justify-center">
                            <div class="text-[10px] font-black opacity-60 uppercase mb-1">${isAr ? 'عدد الأصناف المختلفة' : 'Unique Item Count'}</div>
                            <div class="text-3xl font-black">${uniqueItems}</div>
                        </div>
                    </div>
                    <div class="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar p-1">
                        ${sorted.map(([name, qty]) => `<div class="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:border-indigo-400 transition-all"><div class="w-8 h-8 rounded-lg bg-white group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center text-xs font-black text-indigo-600 shadow-sm transition-all">${qty}</div><div class="text-[11px] font-black text-slate-700">${name}</div></div>`).join('')}
                    </div>`;
            } else if(id === 'session_summary') {
                 html += `<div class="bg-slate-900 p-8 rounded-[2rem] text-white relative overflow-hidden mb-4">
                            <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
                            <div class="relative z-10">
                                <div class="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2">${isAr ? 'رصيد إغلاق الفترة' : 'Aggregate Session Balance'}</div>
                                <div class="text-4xl font-black mb-6 underline decoration-indigo-500 underline-offset-8 decoration-4">${res.data.total.toFixed(2)} <span class="text-xs opacity-30">EGP</span></div>
                                <div class="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                                    <div><div class="text-[8px] opacity-40 uppercase font-black mb-1">${isAr ? 'الطلبات' : 'Orders'}</div><div class="text-xl font-black">${res.data.orders}</div></div>
                                    <div><div class="text-[8px] opacity-40 uppercase font-black mb-1">${isAr ? 'الخصومات' : 'Discounts'}</div><div class="text-xl font-black text-rose-400">${Utils.formatCurrency(res.data.discount || 0)}</div></div>
                                </div>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-3 mb-4">
                            <div class="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                <h4 class="text-[9px] font-black text-emerald-600 uppercase mb-2">${isAr ? 'حسب طريقة الدفع' : 'By Payment Method'}</h4>
                                ${Object.entries(res.data.methods || {}).map(([m, v]) => `<div class="flex justify-between text-[10px] font-bold text-slate-700 mb-1"><span>${m}</span><span>${v.toFixed(2)}</span></div>`).join('')}
                            </div>
                            <div class="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                                <h4 class="text-[9px] font-black text-indigo-600 uppercase mb-2">${isAr ? 'حسب النوع' : 'By Category'}</h4>
                                ${Object.entries(res.data.categories || {}).map(([c, q]) => `<div class="flex justify-between text-[10px] font-bold text-slate-700 mb-1"><span>${c}</span><span>${q}</span></div>`).join('')}
                            </div>
                        </div>`;
            }

            html += `</div>`;

            Swal.fire({
                title: reportNames[id] || (isAr ? 'تحليل استراتيجي' : 'Strategic Insight'),
                html: `<div id="report-print-area">${html}</div>`,
                width: '95%',
                showDenyButton: true,
                confirmButtonText: isAr ? '<i class="fa-solid fa-file-pdf ml-2"></i> طباعة PDF' : '<i class="fa-solid fa-file-pdf mr-2"></i> Print PDF',
                denyButtonText: isAr ? '<i class="fa-solid fa-file-excel ml-2"></i> تصدير Excel' : '<i class="fa-solid fa-file-excel mr-2"></i> Export Excel',
                showCancelButton: true,
                cancelButtonText: isAr ? 'إغلاق' : 'Close',
                customClass: { 
                    popup: 'rounded-[2.5rem] p-4 border-none shadow-2xl', 
                    confirmButton: 'btn-premium bg-slate-900 text-white rounded-2xl px-6 py-4 font-black text-[11px] uppercase tracking-widest',
                    denyButton: 'btn-premium bg-emerald-600 text-white rounded-2xl px-6 py-4 font-black text-[11px] uppercase tracking-widest',
                    cancelButton: 'btn-premium bg-slate-100 text-slate-500 rounded-2xl px-6 py-4 font-black text-[11px] uppercase tracking-widest'
                },
                didOpen: () => {
                    const searchInput = document.getElementById('moves_search');
                    if(searchInput) {
                        searchInput.addEventListener('input', (e) => {
                            const val = e.target.value.toLowerCase();
                            const rows = document.querySelectorAll('#moves_table tbody tr');
                            rows.forEach(row => {
                                const text = row.innerText.toLowerCase();
                                row.style.display = text.includes(val) ? '' : 'none';
                            });
                        });
                    }
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    ReportsHub.exportPDF(id);
                } else if (result.isDenied) {
                    ReportsHub.exportExcel(id, res.data);
                }
            });

        } catch(e) { 
            Utils.loading(false); 
            Swal.fire({
                title: isAr ? 'معالجة البيانات' : 'Data Engine Processing',
                text: e.toString() || 'Analytical worker is crunching the pivot data.',
                icon: 'info',
                confirmButtonText: isAr ? 'موافق' : 'OK'
            });
        }
    },

    exportPDF(id) {
        const content = document.getElementById('report-print-area').innerHTML;
        const win = window.open('', '_blank', 'width=800,height=600');
        win.document.write(`
            <html>
                <head>
                    <title>ERP-EZEM Report: ${id}</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
                    <style>
                        body { padding: 40px; }
                        @media print { .no-print { display: none; } }
                    </style>
                </head>
                <body onload="window.print()">
                    <div class="mb-10 flex justify-between items-center border-b pb-5">
                        <div class="text-2xl font-black">ERP-EZEM <span class="text-indigo-600">PRO</span></div>
                        <div class="text-right">
                            <div class="text-[10px] font-bold text-slate-400 uppercase">Generated On</div>
                            <div class="text-xs font-black">${new Date().toLocaleString()}</div>
                        </div>
                    </div>
                    ${content}
                </body>
            </html>
        `);
        win.document.close();
    },

    exportExcel(id, data) {
        let csvContent = "\uFEFF";
        if (typeof data === 'object' && !Array.isArray(data)) {
            csvContent += "Key,Value\n";
            Object.entries(data).forEach(([k, v]) => {
                const val = typeof v === 'object' ? JSON.stringify(v).replace(/"/g, '""') : v;
                csvContent += `"${k}","${val}"\n`;
            });
        } else if (Array.isArray(data)) {
            if (data.length > 0) {
                csvContent += Object.keys(data[0]).join(',') + "\n";
                data.forEach(row => {
                    csvContent += Object.values(row).map(v => `"${v}"`).join(',') + "\n";
                });
            }
        }
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `EZEM_${id}_${new Date().getTime()}.csv`;
        link.click();
    },

    search(q) {
        const cards = document.querySelectorAll('.report-card');
        const query = q.toLowerCase();
        cards.forEach(card => {
            const text = card.innerText.toLowerCase();
            card.style.display = text.includes(query) ? 'block' : 'none';
        });
    }
};
