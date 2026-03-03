/**
 * PURCHASING MODULE (PO)
 * Handling Suppliers and Purchase Orders
 */
const Purchasing = {
    render() {
        const suppliers = STATE.db.SUPPLIERS || [];
        const isAr = STATE.lang === 'ar';
        
        document.getElementById('main-content').innerHTML = `
            <div class="space-y-8 animate-fade-in ${isAr ? 'text-right' : 'text-left'}" dir="${isAr ? 'rtl' : 'ltr'}">
                <div class="flex flex-wrap justify-between items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div class="flex items-center gap-4">
                        <div class="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                            <i class="fa-solid fa-truck-ramp-box"></i>
                        </div>
                        <div>
                            <h2 class="text-2xl font-black text-slate-800 tracking-tight">${isAr ? 'أوامر الشراء والمشتريات (PO)' : 'Purchase Orders (PO)'}</h2>
                            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Supplier Orders & Procurement</p>
                        </div>
                    </div>
                    <button onclick="Purchasing.showAddSupplier()" class="h-12 px-6 bg-slate-900 text-white rounded-xl text-xs font-black shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2">
                        <i class="fa-solid fa-user-plus"></i> ${isAr ? 'إضافة مورد جديد' : 'Add New Supplier'}
                    </button>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <!-- PO Form -->
                    <div class="lg:col-span-4 glass-card h-fit">
                        <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">${isAr ? 'إنشاء طلب توريد' : 'Create Purchase Order'}</h3>
                        <div class="space-y-4">
                            <div>
                                <label class="nav-label p-0 mb-1 text-[10px]">${isAr ? 'المورد' : 'Supplier'}</label>
                                <select id="po-supplier" class="input-premium">
                                    <option value="">${isAr ? 'اختر المورد...' : 'Select Supplier...'}</option>
                                    ${suppliers.map(s => `<option value="${s[1]}">${s[1]}</option>`).join('')}
                                </select>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="nav-label p-0 mb-1 text-[10px]">${isAr ? 'تاريخ الطلب' : 'Order Date'}</label>
                                    <input type="date" id="po-date" class="input-premium" value="${new Date().toISOString().split('T')[0]}">
                                </div>
                                <div>
                                    <label class="nav-label p-0 mb-1 text-[10px]">${isAr ? 'الحالة' : 'Status'}</label>
                                    <select id="po-status" class="input-premium text-amber-600 font-bold">
                                        <option value="Draft">${isAr ? 'مسودة' : 'Draft'}</option>
                                        <option value="Ordered">${isAr ? 'تم الطلب' : 'Ordered'}</option>
                                    </select>
                                </div>
                            </div>
                            <button onclick="Purchasing.savePO()" class="w-full btn-premium bg-blue-600 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest mt-4 shadow-lg hover:bg-slate-900 transition-all">
                                ${isAr ? 'حفظ الطلب' : 'Save Order'}
                            </button>
                        </div>
                    </div>

                    <!-- PO History / List -->
                    <div class="lg:col-span-8 glass-card">
                        <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">${isAr ? 'أوامر الشراء الحالية' : 'Active Purchase Orders'}</h3>
                        <div class="table-container bg-white border-slate-100">
                            <table class="w-full ${isAr ? 'text-right' : 'text-left'}">
                                <thead>
                                    <tr>
                                        <th>${isAr ? 'رقم الطلب' : 'PO Number'}</th>
                                        <th>${isAr ? 'المورد' : 'Supplier'}</th>
                                        <th>${isAr ? 'التاريخ' : 'Date'}</th>
                                        <th class="text-center">${isAr ? 'الحالة' : 'Status'}</th>
                                        <th class="text-center">${isAr ? 'إجراء' : 'Action'}</th>
                                    </tr>
                                </thead>
                                <tbody id="po-history-body" class="divide-y divide-slate-100 text-xs">
                                    <tr><td colspan="5" class="text-center py-10 text-slate-400 italic font-bold">${isAr ? 'لا توجد طلبات جارية' : 'No active orders'}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    showAddSupplier() {
        const isAr = STATE.lang === 'ar';
        const body = `
            <div class="space-y-6 ${isAr ? 'text-right' : 'text-left'}" dir="${isAr ? 'rtl' : 'ltr'}">
                <div class="text-center">
                    <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
                        <i class="fa-solid fa-handshake"></i>
                    </div>
                    <h3 class="text-xl font-black">${isAr ? 'إضافة مورد جديد' : 'Add New Supplier'}</h3>
                </div>
                <div class="space-y-4">
                    <input type="text" id="sup-name" class="input-premium" placeholder="${isAr ? 'اسم المورد / الشركة' : 'Supplier / Company Name'}">
                    <input type="text" id="sup-phone" class="input-premium" placeholder="${isAr ? 'رقم الهاتف' : 'Phone Number'}">
                    <input type="text" id="sup-type" class="input-premium" placeholder="${isAr ? 'نوع البضاعة' : 'Goods Type'}">
                </div>
                <button onclick="Purchasing.saveSupplier()" class="w-full bg-blue-600 text-white font-black py-4 rounded-xl shadow-lg mt-4 text-xs uppercase tracking-widest hover:bg-slate-900 transition-all">
                    ${isAr ? 'حفظ بيانات المورد' : 'Save Supplier Data'}
                </button>
            </div>
        `;
        Utils.openModal(body);
    },

    async saveSupplier() {
        const data = {
            name: $('#sup-name').val(),
            phone: $('#sup-phone').val(),
            type: $('#sup-type').val()
        };
        const isAr = STATE.lang === 'ar';
        if(!data.name) return Swal.fire(__('warning'), isAr ? 'يرجى إدخال اسم المورد' : 'Please enter supplier name', 'warning');

        Utils.loading(true, __('processing'));
        try {
            await API.call('SAVE_SUPPLIER', data);
            await App.syncData();
            Utils.closeModal();
            this.render();
            Utils.toast(__('success'));
        } catch(e) { Swal.fire(__('error'), e.toString(), 'error'); }
        finally { Utils.loading(false); }
    },

    async savePO() {
        const isAr = STATE.lang === 'ar';
        Swal.fire('PO Service', isAr ? 'جاري تطوير ربط طلبات الشراء بالمخازن تلقائياً...' : 'PO to Store integration coming soon...', 'info');
    }
};
