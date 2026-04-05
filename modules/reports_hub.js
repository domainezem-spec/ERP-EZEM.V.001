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
                    { id: 'mvmt_return', label: isAr ? 'تقرير المرتجعات' : 'Return Report', desc: 'Filter: Trx Type = Return' },
                    { id: 'mvmt_beginning', label: isAr ? 'تقرير أرصدة بداية المدة' : 'Beginning Inventory Report', desc: 'Filter: Trx Type = Beginning Inventory' },
                    { id: 'mvmt_onhand', label: isAr ? 'تقرير الجرد الفعلي' : 'Actual Count (On Hand) Report', desc: 'Filter: Trx Type = On Hand' },
                    { id: 'mvmt_corporate', label: isAr ? 'تقرير طلبات الشركات' : 'Corporate Order Report', desc: 'Filter: Trx Type = Corporate Order' }
                ]
            },
            {
                title: isAr ? 'المنصات الخارجية' : 'External Integrations',
                icon: 'fa-motorcycle',
                color: 'rose',
                items: [
                    { id: 'dsr_report', label: isAr ? 'تقرير المبيعات اليومي (DSR)' : 'Daily Sales Report (DSR)', desc: 'Holistic summary: Sales, Platforms, Expenses' },
                    { id: 'daily_sales', label: isAr ? 'تحليل المبيعات والربحية' : 'Sales & P&L Analysis', desc: 'Detailed cost vs revenue' },
                    { id: 'platform_sales', label: isAr ? 'تقرير مبيعات المنصات' : 'Platform Sales Analysis', desc: 'Detailed analysis for Talabat, Menus, etc.' },
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
                        <button onclick="AIAdvisor.toggleChat()" class="h-11 px-6 bg-indigo-50 text-indigo-600 text-[11px] font-black rounded-2xl hover:bg-indigo-100 transition-all uppercase tracking-widest flex items-center gap-2 shadow-sm shadow-indigo-100">
                            <i class="fa-solid fa-brain"></i> AI Insight
                        </button>
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
                                ${sec.items.filter(item => {
                                    if (Auth.canView('admin_stats')) return true;
                                    return Auth.canView(item.id);
                                }).map(item => `
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
                    `).filter(html => html.includes('report-card')).join('')}
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

        // 1. Prepare Locations List (Same as reports.js)
        const movements = STATE.db.Movements || [];
        const locSet = new Set();
        movements.forEach(m => {
            if (m[9] && m[9] !== '-')  locSet.add(m[9]);
            if (m[10] && m[10] !== '-') locSet.add(m[10]);
        });
        const allLocs = Array.from(locSet).sort();
        const locationsHtml = allLocs.map(l => `<option value="${l}">${l}</option>`).join('');

        // 1.5 Prepare Items List for search
        const items = STATE.db.Items || [];
        const itemsHtml = items.map(it => `<option value="${it[3]}">${it[2]} - ${it[3]}</option>`).join('');

        const isMovementReport = id.startsWith('mvmt_') || id === 'moves_analysis';

        // 2. Prompt for Report Parameters
        const { value: formValues } = await Swal.fire({
            title: isAr ? 'تحديد فترة ومعايير التقرير' : 'Report Parameters',
            html: `
                <div class="flex flex-col gap-5 p-4" dir="${isAr ? 'rtl' : 'ltr'}">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex flex-col text-right">
                            <label class="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">${isAr ? 'من تاريخ' : 'From Date'}</label>
                            <input type="date" id="swal-from" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none" value="${today}">
                        </div>
                        <div class="flex flex-col text-right">
                            <label class="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">${isAr ? 'إلى تاريخ' : 'To Date'}</label>
                            <input type="date" id="swal-to" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none" value="${today}">
                        </div>
                    </div>

                    ${isMovementReport ? `
                    <div class="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50">
                        <div class="flex flex-col text-right">
                            <label class="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">${isAr ? 'من موقع' : 'From Location'}</label>
                            <select id="swal-from-loc" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none">
                                <option value="All">-- ${isAr ? 'الكل' : 'All'} --</option>
                                ${locationsHtml}
                            </select>
                        </div>
                        <div class="flex flex-col text-right">
                            <label class="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">${isAr ? 'إلى موقع' : 'To Location'}</label>
                            <select id="swal-to-loc" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none">
                                <option value="All">-- ${isAr ? 'الكل' : 'All'} --</option>
                                ${locationsHtml}
                            </select>
                        </div>
                    </div>

                    <div class="flex flex-col text-right">
                        <label class="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">${__('filter_by_item')}</label>
                        <select id="swal-item-select" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none searchable-select">
                            <option value="All">-- ${isAr ? 'كل الأصناف' : 'All Items'} --</option>
                            ${itemsHtml}
                        </select>
                    </div>
                    ` : ''}

                    ${id === 'mvmt_transfer' ? `
                    <div class="flex flex-col text-right">
                        <label class="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">${isAr ? 'نوع التحويل' : 'Transfer Type'}</label>
                        <select id="swal-transfer-type" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none select-premium">
                            <option value="All">${isAr ? 'الكل (صادر ووارد)' : 'All Transfers'}</option>
                            <option value="Transfer In">${isAr ? 'تحويل وارد (Transfer In)' : 'Transfer In'}</option>
                            <option value="Transfer Out">${isAr ? 'تحويل صادر (Transfer Out)' : 'Transfer Out'}</option>
                        </select>
                    </div>
                    ` : ''}
                </div>
            `,
            focusConfirm: false,
            preConfirm: () => {
                return {
                    from: document.getElementById('swal-from').value,
                    to: document.getElementById('swal-to').value,
                    fromLoc: document.getElementById('swal-from-loc') ? document.getElementById('swal-from-loc').value : 'All',
                    toLoc: document.getElementById('swal-to-loc') ? document.getElementById('swal-to-loc').value : 'All',
                    item: document.getElementById('swal-item-select') ? document.getElementById('swal-item-select').value : 'All',
                    transferType: document.getElementById('swal-transfer-type') ? document.getElementById('swal-transfer-type').value : null
                }
            },
            didOpen: () => {
                if ($('#swal-item-select').length) {
                    $('#swal-item-select').select2({
                        dropdownParent: $('.swal2-container'),
                        width: '100%',
                        placeholder: isAr ? 'بحث عن صنف...' : 'Search for an item...'
                    });
                }
            },
            confirmButtonText: isAr ? 'تحليل واستخراج التقرير' : 'Generate Analytics',
            showCancelButton: true,
            cancelButtonText: isAr ? 'تراجع' : 'Cancel',
            customClass: {
                popup: 'rounded-[2.5rem]',
                confirmButton: 'btn-premium bg-indigo-600 text-white rounded-2xl px-10 py-3 font-black',
                cancelButton: 'btn-premium bg-slate-100 text-slate-500 rounded-2xl px-10 py-3 font-black'
            }
        });

        if (!formValues) return;

        const { from, to, fromLoc, toLoc, transferType } = formValues;

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
            'mvmt_return': isAr ? 'تقرير المرتجعات التفصيلي' : 'Detailed Return Report',
            'mvmt_beginning': isAr ? 'تقرير أرصدة بداية المدة التفصيلي' : 'Detailed Beginning Inventory Report',
            'mvmt_onhand': isAr ? 'تقرير الجرد الفعلي التفصيلي' : 'Detailed Actual Count (On Hand) Report',
            'mvmt_corporate': isAr ? 'تقرير طلبات الشركات التفصيلي' : 'Detailed Corporate Order Report',
            'platform_sales': isAr ? 'تحليل مبيعات المنصات' : 'Platform Sales Analysis',
            'dsr_report': isAr ? 'تقرير المبيعات اليومي (DSR)' : 'Daily Sales Report (DSR)'
        };

        Utils.loading(true, isAr ? 'جاري تجميع البيانات...' : 'Compiling Analytics...');
        try {
            const res = await API.call('GENERATE_REPORT', { 
                reportId: id, 
                shiftId: STATE.db.activeShift?.id,
                dateFrom: from,
                dateTo: to,
                subType: transferType,
                fromLoc: fromLoc,
                toLoc: toLoc,
                item: formValues.item === 'All' ? null : formValues.item
            });
            Utils.loading(false);
            
            let html = `<div class="space-y-4 ${isAr ? 'text-right' : 'text-left'}" dir="${isAr ? 'rtl' : 'ltr'}">`;
            html += `
                <div class="flex flex-wrap justify-between items-center gap-2 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl mb-4 no-print">
                    <div class="flex items-center gap-3">
                        <div class="flex flex-col">
                            <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">${isAr ? 'الفترة' : 'Period'}</span>
                            <span class="text-[11px] font-black text-slate-800">${from} → ${to}</span>
                        </div>
                    </div>
                    ${fromLoc !== 'All' || toLoc !== 'All' ? `
                    <div class="flex items-center gap-3 border-r border-slate-200 pr-3 mr-auto h-8">
                        <div class="flex flex-col">
                            <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">${isAr ? 'الفلاتر' : 'Filters'}</span>
                            <span class="text-[10px] font-bold text-indigo-600">${fromLoc !== 'All' ? (isAr ? 'من: ' : 'From: ') + fromLoc : ''} ${toLoc !== 'All' ? (isAr ? ' إلى: ' : ' To: ') + toLoc : ''}</span>
                        </div>
                    </div>
                    ` : ''}
                    <div class="flex items-center gap-3 border-l border-slate-200 pl-3">
                        <div class="flex flex-col text-left">
                            <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">${isAr ? 'بواسطة' : 'Reported By'}</span>
                            <span class="text-[11px] font-black text-indigo-500">${STATE.user?.name || 'Active User'}</span>
                        </div>
                    </div>
                </div>
            `;
            
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
                    <div class="flex flex-nowrap gap-3 mb-8 font-sans overflow-x-auto pb-2 no-print" style="min-width: 100%;">
                        <div class="flex-1 min-w-[160px] bg-indigo-600 p-5 rounded-[2rem] text-white shadow-xl flex flex-col justify-between relative overflow-hidden transition-all hover:scale-[1.02]">
                            <div class="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full blur-2xl"></div>
                            <div class="text-[9px] font-black opacity-60 uppercase mb-2 tracking-widest">${isAr ? 'إجمالي التكلفة' : 'Total Cost'}</div>
                            <div class="text-xl font-black">${Utils.formatCurrency(totalCost)}</div>
                        </div>
                        <div class="flex-1 min-w-[160px] bg-emerald-600 p-5 rounded-[2rem] text-white shadow-xl flex flex-col justify-between relative overflow-hidden transition-all hover:scale-[1.02]">
                            <div class="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full blur-2xl"></div>
                            <div class="text-[9px] font-black opacity-60 uppercase mb-2 tracking-widest">${isAr ? 'إجمالي الكميات' : 'Total Quantities'}</div>
                            <div class="text-xl font-black">${totalQty.toFixed(2)}</div>
                        </div>
                        <div class="flex-1 min-w-[160px] bg-rose-500 p-5 rounded-[2rem] text-white shadow-xl flex flex-col justify-between relative overflow-hidden transition-all hover:scale-[1.02]">
                            <div class="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full blur-2xl"></div>
                            <div class="text-[9px] font-black opacity-60 uppercase mb-2 tracking-widest">${isAr ? 'إجمالي الوزن' : 'Total Net Weight'}</div>
                            <div class="text-xl font-black">${res.data.reduce((s, m) => s + (m.totalWeight || 0), 0).toFixed(2)} <span class="text-[10px] opacity-60">KG</span></div>
                        </div>
                        <div class="flex-1 min-w-[160px] bg-amber-500 p-5 rounded-[2rem] text-white shadow-xl flex flex-col justify-between relative overflow-hidden transition-all hover:scale-[1.02]">
                            <div class="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full blur-2xl"></div>
                            <div class="text-[9px] font-black opacity-60 uppercase mb-2 tracking-widest">${isAr ? 'عدد الأصناف' : 'Unique Items'}</div>
                            <div class="text-xl font-black">${uniqueItems}</div>
                        </div>
                        <div class="flex-1 min-w-[160px] bg-slate-800 p-5 rounded-[2rem] text-white shadow-xl flex flex-col justify-between relative overflow-hidden transition-all hover:scale-[1.02]">
                            <div class="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full blur-2xl"></div>
                            <div class="text-[9px] font-black opacity-60 uppercase mb-2 tracking-widest">${isAr ? 'عدد الحركات' : 'Total Moves'}</div>
                            <div class="text-xl font-black">${movesCount}</div>
                        </div>
                    </div>
                    <div class="mb-4 flex gap-2 no-print px-1">
                        <input type="text" id="moves_search" placeholder="${isAr ? 'البحث عن صنف أو سبب...' : 'Search item or reason...'}" class="flex-1 p-4 bg-white border border-slate-200 rounded-2xl text-[11px] font-black outline-none focus:border-indigo-500 transition-all shadow-lg shadow-slate-100">
                    </div>
                    <div id="report-print-area" class="overflow-x-auto rounded-[1.5rem] border border-slate-100 shadow-sm max-h-[500px] overflow-y-auto custom-scrollbar">
                        <table class="w-full text-[11px] border-collapse" id="moves_table">
                            <thead class="sticky top-0 z-20">
                                <tr class="bg-indigo-950 text-white uppercase font-black tracking-tighter">
                                    <th class="p-4 text-center">#</th>
                                    <th class="p-4 text-right">${isAr ? 'التاريخ' : 'Date'}</th>
                                    <th class="p-4 text-center">${isAr ? 'نوع الحركة' : 'Transaction Type'}</th>
                                    <th class="p-4 text-right">${isAr ? 'الكود' : 'Code'}</th>
                                    <th class="p-4 text-right">${isAr ? 'اسم الصنف' : 'Item Name'}</th>
                                    <th class="p-4 text-center">${isAr ? 'الكمية' : 'Quantity'}</th>
                                    <th class="p-4 text-right">${isAr ? 'تكلفة الوحدة' : 'Unit Cost'}</th>
                                    <th class="p-4 text-right">${isAr ? 'التكلفة الإجمالية' : 'Total Cost'}</th>
                                    <th class="p-4 text-right">${isAr ? 'من موقع' : 'From Location'}</th>
                                    <th class="p-4 text-right">${isAr ? 'إلى موقع' : 'To Location'}</th>
                                    <th class="p-4 text-right">${isAr ? 'السبب' : 'Reason'}</th>
                                    <th class="p-4 text-center">${isAr ? 'رقم المرجع' : 'Ref #'}</th>
                                    <th class="p-4 text-right">${isAr ? 'ملاحظات' : 'Notes'}</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-slate-50">
                                ${res.data.map((m, idx) => `
                                    <tr class="hover:bg-indigo-50/30 transition-all group">
                                        <td class="p-4 text-center text-slate-400 font-bold">${idx + 1}</td>
                                        <td class="p-4 font-bold text-slate-600 whitespace-nowrap">${String(m.date).split('T')[0]}</td>
                                        <td class="p-4 text-center">
                                            <span class="px-3 py-1.5 rounded-xl text-[9px] font-black uppercase ${String(m.type).toLowerCase().includes('waste') ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-indigo-50 text-indigo-700 border border-indigo-100'}">
                                                ${m.type}
                                            </span>
                                        </td>
                                        <td class="p-4 font-mono text-[10px] text-slate-500 font-black">${m.code || '-'}</td>
                                        <td class="p-4 font-black text-slate-800">${m.item || m.ItemName || '-'}</td>
                                        <td class="p-4 text-center font-black text-indigo-600">${m.qty || m.Qty || 0}</td>
                                        <td class="p-4 text-right font-bold text-slate-500">${Utils.formatCurrency(m.cost || m.Cost || 0)}</td>
                                        <td class="p-4 text-right font-black text-slate-900 bg-slate-50/50">${Utils.formatCurrency(m.total || m.Total || 0)}</td>
                                        <td class="p-4 text-right text-slate-500 text-[10px] font-bold">${m.from || '-'}</td>
                                        <td class="p-4 text-right text-slate-500 text-[10px] font-bold text-indigo-500">${m.to || '-'}</td>
                                        <td class="p-4 text-right text-[10px] text-slate-400 italic font-black text-rose-500">${m.reason || '-'}</td>
                                        <td class="p-4 text-center font-mono text-[10px] text-indigo-400 font-black underline">${m.ref || '-'}</td>
                                        <td class="p-4 text-right text-[10px] text-slate-400 leading-tight">${m.notes || '-'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
            } else if (id === 'dsr_report') {
                const d = res.data;
                html += `
                    <div class="space-y-6">
                        <!-- Top KPI Row -->
                        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div class="bg-indigo-600 p-5 rounded-3xl text-white shadow-xl">
                                <div class="text-[9px] font-black opacity-60 uppercase mb-1 tracking-widest">${isAr ? 'إجمالي المبيعات' : 'Gross Sales'}</div>
                                <div class="text-2xl font-black">${Utils.formatCurrency(d.gross)}</div>
                            </div>
                            <div class="bg-slate-900 p-5 rounded-3xl text-white shadow-xl">
                                <div class="text-[9px] font-black opacity-60 uppercase mb-1 tracking-widest">${isAr ? 'صافي الإيراد' : 'Net Revenue'}</div>
                                <div class="text-2xl font-black">${Utils.formatCurrency(d.net)}</div>
                            </div>
                            <div class="bg-rose-500 p-5 rounded-3xl text-white shadow-xl">
                                <div class="text-[9px] font-black opacity-60 uppercase mb-1 tracking-widest">${isAr ? 'إجمالي الخصومات' : 'Total Discounts'}</div>
                                <div class="text-2xl font-black">${Utils.formatCurrency(d.discount)}</div>
                            </div>
                            <div class="bg-amber-500 p-5 rounded-3xl text-white shadow-xl">
                                <div class="text-[9px] font-black opacity-60 uppercase mb-1 tracking-widest">${isAr ? 'إجمالي المصروفات' : 'Total Expenses'}</div>
                                <div class="text-2xl font-black">${Utils.formatCurrency(d.totalExpenses)}</div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <!-- Left Col: Breakdown -->
                            <div class="space-y-6">
                                <div class="glass-card p-6">
                                    <h4 class="text-xs font-black text-slate-800 uppercase mb-4 flex items-center gap-2">
                                        <i class="fa-solid fa-credit-card text-indigo-500"></i>
                                        ${isAr ? 'توزيع طرق الدفع' : 'Payment Distribution'}
                                    </h4>
                                    <div class="space-y-2">
                                        ${Object.entries(d.payments).map(([m,v]) => `
                                            <div class="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                                                <span class="text-[11px] font-bold text-slate-600">${m}</span>
                                                <span class="text-[11px] font-black text-slate-900">${Utils.formatCurrency(v)}</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>

                                <div class="glass-card p-6 border-indigo-100">
                                    <h4 class="text-xs font-black text-slate-800 uppercase mb-4 flex items-center gap-2">
                                        <i class="fa-solid fa-motorcycle text-rose-500"></i>
                                        ${isAr ? 'أداء المنصات الخارجية' : 'Platform Performance'}
                                    </h4>
                                    <div class="grid grid-cols-2 gap-3">
                                        ${Object.entries(d.platforms).map(([p,v]) => `
                                            <div class="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
                                                <div class="text-[8px] font-black text-indigo-400 uppercase mb-1">${p}</div>
                                                <div class="text-sm font-black text-indigo-700">${Utils.formatCurrency(v)}</div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>

                            <!-- Right Col: Categories -->
                            <div class="glass-card p-6">
                                <h4 class="text-xs font-black text-slate-800 uppercase mb-4 flex items-center gap-2">
                                    <i class="fa-solid fa-utensils text-emerald-500"></i>
                                    ${isAr ? 'كميات المبيعات حسب الفئة' : 'Sales Qty by Category'}
                                </h4>
                                <div class="space-y-1">
                                    ${Object.entries(d.categories).sort((a,b)=>b[1]-a[1]).map(([c,q]) => `
                                        <div class="flex items-center gap-4 py-2 border-b border-slate-50 last:border-0">
                                            <div class="flex-1 text-[11px] font-bold text-slate-600">${c}</div>
                                            <div class="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                                <div class="bg-indigo-500 h-full" style="width: ${Math.min(100, (q/Object.values(d.categories).reduce((a,b)=>a+b,1))*300)}%"></div>
                                            </div>
                                            <div class="text-[11px] font-black text-slate-900 w-10 text-right">${q}</div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            } else if (id === 'platform_sales') {
                const d = res.data;
                html += `
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        ${Object.entries(d).map(([p, data]) => `
                            <div class="glass-card shadow-sm border-slate-100 hover:border-indigo-400 transition-all group overflow-hidden">
                                 <div class="flex items-center gap-4 p-5 bg-slate-50/50">
                                    <div class="w-12 h-12 bg-white rounded-2xl shadow-sm text-indigo-600 flex items-center justify-center text-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        <i class="fa-solid ${p === 'Delivery' ? 'fa-motorcycle' : 'fa-globe'}"></i>
                                    </div>
                                    <div>
                                        <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest">${p} Platform</div>
                                        <div class="text-xl font-black text-slate-800">${Utils.formatCurrency(data.sales)}</div>
                                    </div>
                                 </div>
                                 <div class="p-4 bg-white border-t border-slate-50 flex justify-between items-center">
                                    <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">${isAr ? 'عدد العمليات' : 'Orders Count'}</span>
                                    <span class="text-xs font-black text-indigo-600">${data.trans}</span>
                                 </div>
                            </div>
                        `).join('')}
                    </div>

                    <!-- Summary Table for Print -->
                    <table class="w-full border-collapse bg-white rounded-2xl overflow-hidden shadow-sm">
                        <thead class="bg-slate-900 text-white">
                            <tr class="uppercase font-black text-[10px]">
                                <th class="p-4 text-left">Platform Name</th>
                                <th class="p-4 text-center">Total Transactions</th>
                                <th class="p-4 text-right">Total Sales (EGP)</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            ${Object.entries(d).map(([p, data]) => `
                                <tr class="hover:bg-slate-50 transition-all">
                                    <td class="p-4 font-black text-slate-800">${p}</td>
                                    <td class="p-4 text-center font-bold text-indigo-600">${data.trans}</td>
                                    <td class="p-4 text-right font-black text-slate-900">${Utils.formatCurrency(data.sales)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
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
                    ReportsHub.exportPDF(id, from, to, fromLoc, toLoc, res.data);
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

    exportPDF(id, from, to, fromLoc, toLoc, data) {
        const isAr = STATE.lang === 'ar';
        const content = document.getElementById('report-print-area').innerHTML;
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
            'mvmt_return': isAr ? 'تقرير المرتجعات التفصيلي' : 'Detailed Return Report',
            'mvmt_beginning': isAr ? 'تقرير أرصدة بداية المدة التفصيلي' : 'Detailed Beginning Inventory Report',
            'mvmt_onhand': isAr ? 'تقرير الجرد الفعلي التفصيلي' : 'Detailed Actual Count (On Hand) Report',
            'mvmt_corporate': isAr ? 'تقرير طلبات الشركات التفصيلي' : 'Detailed Corporate Order Report'
        };
        const title = reportNames[id] || (isAr ? 'تقرير إداري' : 'Management Report');

        const win = window.open('', '_blank', 'width=1100,height=850');
        win.document.write(`
            <html>
                <head>
                    <title>${title}</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
                    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
                    <style>
                        @page {
                            size: A3 landscape !important;
                            margin: 10mm !important;
                        }
                        body {
                            font-family: ${isAr ? "'Cairo', sans-serif" : "'Inter', sans-serif"};
                            padding: 0;
                            margin: 0;
                            background: white;
                            color: #1e293b;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                        .print-container {
                            width: 100%;
                            direction: ${isAr ? 'rtl' : 'ltr'};
                            text-align: ${isAr ? 'right' : 'left'};
                        }
                        table {
                            width: 100% !important;
                            border-collapse: collapse !important;
                            font-size: 10px !important;
                            table-layout: fixed !important;
                        }
                        th, td {
                            border: 1px solid #e2e8f0 !important;
                            padding: 6px !important;
                            word-break: break-word !important;
                            overflow-wrap: break-word !important;
                            white-space: normal !important;
                            line-height: 1.4 !important;
                        }
                        th {
                            background-color: #f8fafc !important;
                            color: #475569 !important;
                            font-weight: 900 !important;
                            text-transform: uppercase !important;
                            text-align: center !important;
                        }
                        /* Precise Column Widths for Advanced Movement Reports to ensure Fit */
                        #moves_table th:nth-child(1) { width: 3%; } /* # */
                        #moves_table th:nth-child(2) { width: 7%; } /* Date */
                        #moves_table th:nth-child(3) { width: 8%; } /* Transaction Type */
                        #moves_table th:nth-child(4) { width: 5%; } /* Code */
                        #moves_table th:nth-child(5) { width: 22%; } /* Item Name */
                        #moves_table th:nth-child(6) { width: 5%; } /* Qty */
                        #moves_table th:nth-child(7) { width: 7%; } /* Unit Cost */
                        #moves_table th:nth-child(8) { width: 8%; } /* Total Cost */
                        #moves_table th:nth-child(9) { width: 8%; } /* From */
                        #moves_table th:nth-child(10) { width: 8%; } /* To */
                        #moves_table th:nth-child(11) { width: 6%; } /* Reason */
                        #moves_table th:nth-child(12) { width: 6%; } /* Ref # */
                        #moves_table th:nth-child(13) { width: 7%; } /* Notes */

                        tr:nth-child(even) {
                            background-color: #f1f5f9 !important;
                        }

                        /* Fix for overlapping badges/text */
                        .rounded-xl, .px-3, .py-1.5 {
                            padding: 2px 4px !important;
                            border-radius: 4px !important;
                            display: inline-block !important;
                            font-size: 8px !important;
                            white-space: normal !important;
                            word-break: keep-all !important;
                        }
                        @media print {
                            .no-print { display: none !important; }
                            
                            /* Force all scrollable containers to expand */
                            div, section, main {
                                max-height: none !important;
                                height: auto !important;
                                overflow: visible !important;
                                position: static !important; /* Fix for some clipping issues */
                            }
                            
                            /* Table specific print fixes */
                            thead { display: table-header-group !important; }
                            tr { page-break-inside: avoid !important; }
                            table { page-break-after: auto !important; }
                            
                            /* Ensure text is black and high contrast for ink */
                            body { color: black !important; background: white !important; }
                        }
                        .report-header {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            border-bottom: 3px solid #6366f1;
                            padding-bottom: 20px;
                            margin-bottom: 30px;
                        }
                        .header-middle {
                            text-align: center;
                            flex: 1;
                        }
                        .header-right {
                            text-align: right;
                            min-width: 200px;
                        }
                        .report-stats {
                            display: flex;
                            justify-content: space-between;
                            gap: 15px;
                            margin-bottom: 30px;
                        }
                        .stat-card {
                            flex: 1;
                            padding: 20px;
                            border-radius: 20px;
                            color: white;
                            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                        }
                        .stat-card.indigo { background: #4f46e5; }
                        .stat-card.emerald { background: #10b981; }
                        .stat-card.rose { background: #f43f5e; }
                        .stat-card.amber { background: #f59e0b; }
                        .stat-card.slate { background: #1e293b; }
                        
                        .stat-label { font-size: 8px; font-weight: 900; text-transform: uppercase; opacity: 0.7; letter-spacing: 0.05em; margin-bottom: 8px; }
                        .stat-value { font-size: 16px; font-weight: 900; }
                    </style>
                </head>
                <body onload="setTimeout(() => { window.print(); window.close(); }, 1200)">
                    <div class="print-container">
                        <div class="report-header">
                            <div>
                            <div class="flex items-center gap-3">
                                <img src="assets/icon-192x192.png" style="height: 40px; width: 40px; border-radius: 8px;">
                                <div>
                                    <div class="text-2xl font-black text-indigo-600">EZEM <span class="text-slate-900">PRO</span></div>
                                    <div class="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Enterprise Resource Planning</div>
                                </div>
                            </div>
                            </div>
                            <div class="header-middle">
                                <h1 class="text-2xl font-black text-slate-800 uppercase tracking-tighter">${title}</h1>
                                <div class="text-[10px] font-bold text-indigo-500 uppercase mt-2 bg-indigo-50 inline-block px-4 py-1 rounded-full border border-indigo-100">
                                    ${from} &rarr; ${to}
                                </div>
                                ${ (fromLoc !== 'All' || toLoc !== 'All') ? `
                                <div class="text-[8px] font-black text-slate-400 uppercase mt-1 tracking-widest">
                                    ${fromLoc !== 'All' ? (isAr ? 'من: ' : 'From: ') + fromLoc : ''}
                                    ${toLoc !== 'All' ? (isAr ? ' إلى: ' : ' To: ') + toLoc : ''}
                                </div>
                                ` : ''}
                            </div>
                            <div class="text-right">
                                <div class="text-[9px] font-black text-slate-400 uppercase">${isAr ? 'تاريخ الطباعة' : 'Print Date'}</div>
                                <div class="text-xs font-black">${new Date().toLocaleString()}</div>
                                <div class="mt-2 text-[9px] font-black text-indigo-500 uppercase">${isAr ? 'بواسطة' : 'Reported By'}</div>
                                <div class="text-[11px] font-black text-slate-800">${STATE.user?.name || 'Administrator'}</div>
                            </div>
                        </div>

                        <div class="report-body">
                            ${content}
                        </div>

                        <div class="mt-20 pt-10 border-t-2 border-slate-100 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest no-print-footer">
                            <div>EZEM ERP SYSTEM • v3.1</div>
                            <div class="text-indigo-400 font-black">${isAr ? 'برنامج إدارة متكامل' : 'Generated by EZEM ERP Solution'}</div>
                            <div>BRANCH'S DIGITAL SOLUTIONS</div>
                        </div>
                    </div>
                </body>
            </html>
        `);
        win.document.close();
    },

    exportExcel(id, data) {
        let csvContent = "\uFEFF";
        if (id === 'platform_sales') {
            csvContent += "Platform,Total Transactions,Total Sales (EGP)\n";
            Object.entries(data).forEach(([p, d]) => {
                csvContent += `"${p}","${d.trans}","${d.sales}"\n`;
            });
        } else if (typeof data === 'object' && !Array.isArray(data)) {
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
