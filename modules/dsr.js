const DSR = {
    async render() {
        const isAr = STATE.lang === 'ar';
        document.getElementById('main-content').innerHTML = `
            <div class="space-y-6 fade-up pb-20 ${isAr ? 'text-right' : 'text-left'}" dir="${isAr ? 'rtl' : 'ltr'}">
                <!-- Header Section -->
                <div class="glass-card p-8 rounded-[2.5rem] border border-white/40 shadow-xl flex flex-wrap items-center justify-between gap-6">
                    <div class="flex items-center gap-6">
                        <div class="w-16 h-16 bg-black text-white rounded-3xl flex items-center justify-center text-3xl shadow-2xl rotate-3">
                            <i class="fa-solid fa-file-invoice-dollar"></i>
                        </div>
                        <div>
                            <h2 class="text-3xl font-black text-slate-900 tracking-tight">${isAr ? 'تقرير المبيعات اليومي' : 'Daily Sales Report'}</h2>
                            <p class="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-1 opacity-70">${isAr ? 'تحليلات المبيعات والعمليات الذكية' : 'Smart sales & operations analytics'}</p>
                        </div>
                    </div>
                    <button onclick="DSR.openEntryModal()" class="btn-primary h-14 px-10 rounded-2xl font-black text-sm flex items-center gap-3 active:scale-95 transition-all shadow-xl shadow-indigo-500/20">
                        <i class="fa-solid fa-plus-circle text-lg"></i> ${isAr ? 'إضافة تقرير جديد' : 'New DSR Entry'}
                    </button>
                </div>

                <!-- Strategic Stats -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div class="premium-card p-6 bg-white relative overflow-hidden group">
                        <div class="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150"></div>
                        <span class="relative z-10 text-[10px] font-black text-slate-400 uppercase tracking-tighter">${isAr ? 'متوسط المبيعات' : 'Average Sales'}</span>
                        <div id="dsr-avg-sales" class="relative z-10 text-2xl font-black text-slate-900 mt-2 premium-num">0.00</div>
                    </div>
                    <div class="premium-card p-6 bg-white">
                        <span class="text-[10px] font-black text-slate-400 uppercase tracking-tighter">${isAr ? 'إجمالي العمليات' : 'Total Trans'}</span>
                        <div id="dsr-total-trans" class="text-2xl font-black text-slate-900 mt-2 premium-num">0</div>
                    </div>
                    <div class="premium-card p-6 border-l-4 border-l-indigo-500">
                        <span class="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">${isAr ? 'حصة التوصيل' : 'Delivery Share'}</span>
                        <div id="dsr-delivery-share" class="text-2xl font-black text-indigo-600 mt-2 premium-num">0%</div>
                    </div>
                    <div class="premium-card p-6 border-l-4 border-l-emerald-500">
                        <span class="text-[10px] font-black text-emerald-400 uppercase tracking-tighter">${isAr ? 'كفاءة التشغيل' : 'Ops Efficiency'}</span>
                        <div id="dsr-achievement" class="text-2xl font-black text-emerald-600 mt-2 premium-num">94%</div>
                    </div>
                </div>

                <!-- Main Data Asset -->
                <div class="premium-card bg-white overflow-hidden border-none shadow-2xl">
                    <div class="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                        <h3 class="font-black text-slate-800 text-lg flex items-center gap-2">
                            <span class="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                            ${isAr ? 'سجل البيانات التفصيلي' : 'Detailed Data Log'}
                        </h3>
                        <div class="flex gap-4">
                            <input type="month" id="dsr-month-filter" class="h-12 px-6 bg-white border border-slate-200 rounded-xl text-xs font-black outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all" onchange="DSR.refresh()">
                        </div>
                    </div>
                    <div class="overflow-x-auto custom-scrollbar">
                        <table class="w-full">
                            <thead class="table-header-soft">
                                <tr>
                                    <th class="px-8 py-5">${isAr ? 'التاريخ' : 'Date'}</th>
                                    <th class="px-8 py-5">${isAr ? 'اليوم' : 'Day'}</th>
                                    <th class="px-8 py-5">${isAr ? 'فترة الصباح' : 'Morning'}</th>
                                    <th class="px-8 py-5">${isAr ? 'فترة المساء' : 'Night'}</th>
                                    <th class="px-8 py-5">${isAr ? 'المنصات' : 'Platforms'}</th>
                                    <th class="px-8 py-5">${isAr ? 'صافي اليوم' : 'Net Total'}</th>
                                    <th class="px-8 py-5">${isAr ? 'العمليات' : 'Trx'}</th>
                                    <th class="px-8 py-5 text-center">${isAr ? 'خيارات' : 'Options'}</th>
                                </tr>
                            </thead>
                            <tbody id="dsr-table-body" class="divide-y divide-slate-50"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        
        const now = new Date();
        document.getElementById('dsr-month-filter').value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        this.refresh();
    },

    async openEntryModal() {
        const isAr = STATE.lang === 'ar';
        const { value: formValues } = await Swal.fire({
            title: isAr ? 'إدخال تقرير مبيعات يومي' : 'Daily Sales Entry',
            width: '900px',
            html: `
                <div class="p-6 space-y-6 ${isAr ? 'text-right' : 'text-left'}" dir="${isAr ? 'rtl' : 'ltr'}">
                    <!-- Basic Info -->
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1">
                            <label class="text-[11px] font-black text-slate-600 uppercase tracking-wide">${isAr ? 'تاريخ التقرير' : 'Report Date'}</label>
                            <input type="date" id="m-dsr-date" class="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 font-black text-slate-900" value="${new Date().toISOString().split('T')[0]}">
                        </div>
                        <div class="space-y-1">
                            <label class="text-[11px] font-black text-slate-600 uppercase tracking-wide">${isAr ? 'اسم الفرع' : 'Branch Name'}</label>
                            <select id="m-dsr-branch" class="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 font-black text-slate-900 focus:border-indigo-500 outline-none transition-all">
                                <option value="">${isAr ? 'اختر الفرع...' : 'Select Branch...'}</option>
                                ${STATE.db.Locations ? STATE.db.Locations.map(l => `<option value="${l[1]}">${l[1]}</option>`).join('') : ''}
                            </select>
                        </div>
                    </div>

                    <!-- Breakdown Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <!-- Direct Sales -->
                        <div class="space-y-4 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                            <h4 class="font-black text-emerald-700 border-b border-emerald-100 pb-2 flex items-center gap-2">
                                <i class="fa-solid fa-store text-xs opacity-50"></i>
                                ${isAr ? 'المبيعات المباشرة' : 'Direct Sales'}
                            </h4>
                            <div class="grid grid-cols-2 gap-4">
                                <div class="space-y-1">
                                    <label class="text-[10px] font-black text-slate-600 uppercase">${isAr ? 'مبيعات الصباح' : 'Morning Sales'}</label>
                                    <input type="number" id="m-dsr-morning" placeholder="0.00" class="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 font-black text-slate-900 focus:border-emerald-500 outline-none transition-all">
                                </div>
                                <div class="space-y-1">
                                    <label class="text-[10px] font-black text-slate-600 uppercase">${isAr ? 'عدد العمليات' : 'Morning Trans'}</label>
                                    <input type="number" id="m-dsr-morning-count" placeholder="0" class="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 font-black text-slate-900 focus:border-emerald-500 outline-none transition-all">
                                </div>
                                <div class="space-y-1">
                                    <label class="text-[10px] font-black text-slate-600 uppercase">${isAr ? 'مبيعات المساء' : 'Night Sales'}</label>
                                    <input type="number" id="m-dsr-night" placeholder="0.00" class="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 font-black text-slate-900 focus:border-emerald-500 outline-none transition-all">
                                </div>
                                <div class="space-y-1">
                                    <label class="text-[10px] font-black text-slate-600 uppercase">${isAr ? 'عدد العمليات' : 'Night Trans'}</label>
                                    <input type="number" id="m-dsr-night-count" placeholder="0" class="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 font-black text-slate-900 focus:border-emerald-500 outline-none transition-all">
                                </div>
                            </div>
                        </div>

                        <!-- Platform Sales -->
                        <div class="space-y-4 bg-indigo-50/30 p-6 rounded-[2rem] border border-indigo-100 shadow-sm">
                            <h4 class="font-black text-indigo-700 border-b border-indigo-100 pb-2 flex items-center gap-2">
                                <i class="fa-solid fa-truck-fast text-xs opacity-50"></i>
                                ${isAr ? 'مبيعات المنصات' : 'Platform Sales'}
                            </h4>
                            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <div class="col-span-2 space-y-1">
                                    <label class="text-[10px] font-black text-slate-600 uppercase">${isAr ? 'مبيعات التوصيل' : 'Delivery Sales'}</label>
                                    <input type="number" id="m-dsr-delivery" placeholder="0.00" class="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 font-black text-slate-900 focus:border-indigo-500 outline-none transition-all">
                                </div>
                                <div class="col-span-2 space-y-1">
                                    <label class="text-[10px] font-black text-slate-600 uppercase">${isAr ? 'عدد العمليات' : 'Delivery Trans'}</label>
                                    <input type="number" id="m-dsr-delivery-count" placeholder="0" class="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 font-black text-slate-900 focus:border-indigo-500 outline-none transition-all">
                                </div>
                                
                                <div class="space-y-1 border-t border-indigo-50 pt-2">
                                    <label class="text-[10px] font-black text-slate-500 uppercase">Talabat</label>
                                    <input type="number" id="m-dsr-talabat" placeholder="Sales" class="w-full h-10 bg-white border border-slate-100 rounded-lg px-3 font-black text-slate-900 text-xs shadow-sm">
                                </div>
                                <div class="space-y-1 border-t border-indigo-50 pt-2">
                                    <label class="text-[10px] font-black text-slate-500 uppercase">Talabat #</label>
                                    <input type="number" id="m-dsr-talabat-count" placeholder="Trx" class="w-full h-10 bg-white border border-slate-100 rounded-lg px-3 font-black text-slate-900 text-xs shadow-sm">
                                </div>

                                <div class="space-y-1 border-t border-indigo-50 pt-2">
                                    <label class="text-[10px] font-black text-slate-500 uppercase">Menus</label>
                                    <input type="number" id="m-dsr-menus" placeholder="Sales" class="w-full h-10 bg-white border border-slate-100 rounded-lg px-3 font-black text-slate-900 text-xs shadow-sm">
                                </div>
                                <div class="space-y-1 border-t border-indigo-50 pt-2">
                                    <label class="text-[10px] font-black text-slate-500 uppercase">Menus #</label>
                                    <input type="number" id="m-dsr-menus-count" placeholder="Trx" class="w-full h-10 bg-white border border-slate-100 rounded-lg px-3 font-black text-slate-900 text-xs shadow-sm">
                                </div>

                                <div class="space-y-1 border-t border-indigo-50 pt-2">
                                    <label class="text-[10px] font-black text-slate-500 uppercase">Etisalat</label>
                                    <input type="number" id="m-dsr-etisalat" placeholder="Sales" class="w-full h-10 bg-white border border-slate-100 rounded-lg px-3 font-black text-slate-900 text-xs shadow-sm">
                                </div>
                                <div class="space-y-1 border-t border-indigo-50 pt-2">
                                    <label class="text-[10px] font-black text-slate-500 uppercase">Etisalat #</label>
                                    <input type="number" id="m-dsr-etisalat-count" placeholder="Trx" class="w-full h-10 bg-white border border-slate-100 rounded-lg px-3 font-black text-slate-900 text-xs shadow-sm">
                                </div>

                                <div class="space-y-1 border-t border-indigo-50 pt-2">
                                    <label class="text-[10px] font-black text-slate-500 uppercase">Insta</label>
                                    <input type="number" id="m-dsr-insta" placeholder="Sales" class="w-full h-10 bg-white border border-slate-100 rounded-lg px-3 font-black text-slate-900 text-xs shadow-sm">
                                </div>
                                <div class="space-y-1 border-t border-indigo-50 pt-2">
                                    <label class="text-[10px] font-black text-slate-500 uppercase">Insta #</label>
                                    <input type="number" id="m-dsr-insta-count" placeholder="Trx" class="w-full h-10 bg-white border border-slate-100 rounded-lg px-3 font-black text-slate-900 text-xs shadow-sm">
                                </div>

                                <div class="space-y-1 border-t border-indigo-50 pt-2">
                                    <label class="text-[10px] font-black text-slate-500 uppercase">Breadfast</label>
                                    <input type="number" id="m-dsr-breadfast" placeholder="Sales" class="w-full h-10 bg-white border border-slate-100 rounded-lg px-3 font-black text-slate-900 text-xs shadow-sm">
                                </div>
                                <div class="space-y-1 border-t border-indigo-50 pt-2">
                                    <label class="text-[10px] font-black text-slate-500 uppercase">Breadfast #</label>
                                    <input type="number" id="m-dsr-breadfast-count" placeholder="Trx" class="w-full h-10 bg-white border border-slate-100 rounded-lg px-3 font-black text-slate-900 text-xs shadow-sm">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            confirmButtonText: isAr ? 'حفظ وإرسال لتقرير' : 'Save DSR Report',
            showCancelButton: true,
            cancelButtonText: isAr ? 'تراجع' : 'Cancel',
            customClass: { popup: 'rounded-[3rem]', confirmButton: 'bg-emerald-600 text-white rounded-2xl px-8 py-3 font-black' },
            preConfirm: () => {
                const data = {
                    date: document.getElementById('m-dsr-date').value,
                    branch: document.getElementById('m-dsr-branch').value,
                    morningSales: parseFloat(document.getElementById('m-dsr-morning').value || 0),
                    morningCount: parseInt(document.getElementById('m-dsr-morning-count').value || 0),
                    nightSales: parseFloat(document.getElementById('m-dsr-night').value || 0),
                    nightCount: parseInt(document.getElementById('m-dsr-night-count').value || 0),
                    deliverySales: parseFloat(document.getElementById('m-dsr-delivery').value || 0),
                    deliveryCount: parseInt(document.getElementById('m-dsr-delivery-count').value || 0),
                    talabatSales: parseFloat(document.getElementById('m-dsr-talabat').value || 0),
                    talabatCount: parseInt(document.getElementById('m-dsr-talabat-count').value || 0),
                    menusSales: parseFloat(document.getElementById('m-dsr-menus').value || 0),
                    menusCount: parseInt(document.getElementById('m-dsr-menus-count').value || 0),
                    etisalatSales: parseFloat(document.getElementById('m-dsr-etisalat').value || 0),
                    etisalatCount: parseInt(document.getElementById('m-dsr-etisalat-count').value || 0),
                    instaSales: parseFloat(document.getElementById('m-dsr-insta').value || 0),
                    instaCount: parseInt(document.getElementById('m-dsr-insta-count').value || 0),
                    breadfastSales: parseFloat(document.getElementById('m-dsr-breadfast').value || 0),
                    breadfastCount: parseInt(document.getElementById('m-dsr-breadfast-count').value || 0)
                };
                if(!data.date) { Swal.showValidationMessage('Date is required'); return false; }
                return data;
            }
        });

        if (formValues) {
            Utils.loading(true, isAr ? 'جاري الحفظ...' : 'Saving DSR...');
            try {
                await API.call('SAVE_DSR_ENTRY', formValues);
                Utils.loading(false);
                Utils.toast(isAr ? 'تم حفظ التقرير بنجاح' : 'DSR Saved Successfully', 'success');
                this.refresh();
            } catch (e) { Utils.loading(false); Swal.fire('Error', e.toString(), 'error'); }
        }
    },

    async refresh() {
        const isAr = STATE.lang === 'ar';
        const month = document.getElementById('dsr-month-filter').value;
        
        try {
            Utils.loading(true, isAr ? 'جاري جلب البيانات...' : 'Fetching DSR Data...');
            const res = await API.call('GET_DSR_LOGS', { month });
            Utils.loading(false);

            if (res.status === 'success') {
                this.renderTable(res.data);
                this.updateSummaries(res.data);
            }
        } catch (e) {
            Utils.loading(false);
            Utils.toast(e.toString(), 'error');
        }
    },

    renderTable(data) {
        const isAr = STATE.lang === 'ar';
        const tbody = document.getElementById('dsr-table-body');
        if(!data.length) {
            tbody.innerHTML = `<tr><td colspan="8" class="px-6 py-20 text-center text-slate-300 font-black uppercase text-xs">${isAr ? 'لا توجد بيانات لهذا الشهر' : 'No DSR records found for this month'}</td></tr>`;
            return;
        }

        tbody.innerHTML = data.map(r => `
            <tr class="hover:bg-slate-50/50 transition-colors border-b border-black/5">
                <td class="px-6 py-4 font-black text-black premium-num">${r.date}</td>
                <td class="px-6 py-4 text-xs font-bold text-black uppercase">${r.day}</td>
                <td class="px-6 py-4">
                    <div class="text-black font-black premium-num">${Utils.formatCurrency(r.morningSales)}</div>
                    <div class="text-[9px] text-black font-bold uppercase">${r.morningCount} Trx</div>
                </td>
                <td class="px-6 py-4">
                    <div class="text-black font-black premium-num">${Utils.formatCurrency(r.nightSales)}</div>
                    <div class="text-[9px] text-black font-bold uppercase">${r.nightCount} Trx</div>
                </td>
                <td class="px-6 py-4 text-black font-black premium-num">${Utils.formatCurrency(r.deliveryTotal)}</td>
                <td class="px-6 py-4">
                    <div class="px-4 py-2 bg-black/5 text-black rounded-xl text-center font-black premium-num border border-black/10">
                        ${Utils.formatCurrency(r.totalSales)}
                    </div>
                </td>
                <td class="px-6 py-4 font-black premium-num text-black">${r.totalCount}</td>
                <td class="px-6 py-4">
                    <button onclick="DSR.viewEntryDetails('${r.id}')" class="w-8 h-8 rounded-lg bg-black/5 text-black hover:bg-black hover:text-white transition-all"><i class="fa-solid fa-eye text-[10px]"></i></button>
                </td>
            </tr>
        `).join('');
    },

    updateSummaries(data) {
        if(!data.length) return;
        const totalSales = data.reduce((s, r) => s + r.totalSales, 0);
        const totalTrans = data.reduce((s, r) => s + r.totalCount, 0);
        const deliveryTotal = data.reduce((s, r) => s + r.deliveryTotal, 0);
        
        document.getElementById('dsr-avg-sales').innerText = Utils.formatCurrency(totalSales / data.length);
        document.getElementById('dsr-total-trans').innerText = totalTrans.toLocaleString();
        document.getElementById('dsr-delivery-share').innerText = ((deliveryTotal / totalSales) * 100).toFixed(1) + '%';
        document.getElementById('dsr-achievement').innerText = '94%'; // Mocked for now
    }
};
