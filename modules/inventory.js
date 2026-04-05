/**
 * INVENTORY MODULE (BOH - Back of House)
 * Comprehensive Inventory Analysis Grid
 */
const Inventory = {
    viewMode: 'raw', // 'raw' or 'menu'

    render() {
        const items = (this.viewMode === 'raw' ? STATE.db.Items : STATE.db.Menu_POS) || [];
        const isAr = STATE.lang === 'ar';
        
        document.getElementById('main-content').innerHTML = `
            <div class="space-y-6 animate-fade-in ${isAr ? 'text-right' : 'text-left'}" dir="${isAr ? 'rtl' : 'ltr'}">
                <!-- Header Actions -->
                <div class="flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm transition-all">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl shadow-inner">
                            <i class="fa-solid ${this.viewMode === 'raw' ? 'fa-boxes-stacked' : 'fa-utensils'}"></i>
                        </div>
                        <div>
                            <h2 class="text-xl font-black text-slate-800 tracking-tight">${this.viewMode === 'raw' ? __('inv') : __('recipes')}</h2>
                            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">${isAr ? 'إدارة التكاليف، الرصيد، والبيانات الأساسية' : 'Manage Costs, Stock, and Master Data'}</p>
                        </div>
                    </div>

                    <div class="flex items-center gap-3">
                        <div class="relative ${isAr ? 'ml-4' : 'mr-4'}">
                            <input type="text" id="inv-search" onkeyup="Inventory.filter()" placeholder="${__('search')}" class="h-10 px-10 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all w-64 shadow-sm">
                            <i class="fa-solid fa-magnifying-glass absolute ${isAr ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-300"></i>
                        </div>
                        <div class="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner ${isAr ? 'ml-4' : 'mr-4'}">
                             <button onclick="Inventory.switchMode('raw')" class="px-4 h-9 rounded-lg text-[10px] font-black transition-all ${this.viewMode === 'raw' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}">${__('inv').toUpperCase()}</button>
                             <button onclick="Inventory.switchMode('menu')" class="px-4 h-9 rounded-lg text-[10px] font-black transition-all ${this.viewMode === 'menu' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}">${__('recipes').toUpperCase()}</button>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="Inventory.showAddModal()" class="h-10 px-6 bg-indigo-600 text-white rounded-xl text-[11px] font-black shadow-lg shadow-indigo-100 hover:bg-slate-900 transition-all flex items-center gap-2">
                                <i class="fa-solid fa-plus-circle"></i> ${__('add')}
                            </button>
                        </div>
                    </div>
                </div>

                <div class="bg-white border border-slate-100 shadow-2xl rounded-3xl overflow-hidden">
                    <div class="overflow-x-auto max-h-[650px] custom-scrollbar">
                        <table class="w-full ${isAr ? 'text-right' : 'text-left'} border-collapse" id="boh-report-table">
                             <thead class="sticky top-0 z-20 bg-slate-50 shadow-sm">
                                <tr>
                                    <th class="p-5 font-black text-[10px] text-slate-500 uppercase tracking-widest">${__('item_code')}</th>
                                    <th class="p-5 font-black text-[10px] text-slate-500 uppercase tracking-widest">${__('item_name')}</th>
                                    <th class="p-5 font-black text-[10px] text-slate-500 uppercase tracking-widest text-center">${__('category')}</th>
                                    <th class="p-5 font-black text-[10px] text-slate-500 uppercase tracking-widest text-center">${__('uom')}</th>
                                    <th class="p-5 font-black text-[10px] text-slate-500 uppercase tracking-widest text-center">${__('cost')}</th>
                                    <th class="p-5 font-black text-[10px] text-slate-500 uppercase tracking-widest text-center">${__('stock')}</th>
                                     <th class="p-5 font-black text-[10px] text-slate-500 uppercase tracking-widest text-center">${this.viewMode === 'raw' ? 'Yield %' : __('price')}</th>
                                    <th class="p-5 font-black text-[10px] text-slate-500 uppercase tracking-widest text-center">${this.viewMode === 'raw' ? 'Min' : 'Status'}</th>
                                    <th class="p-5 font-black text-[10px] text-slate-500 uppercase tracking-widest text-center">${this.viewMode === 'raw' ? 'Portion/Serving' : ''}</th>
                                    <th class="p-5 font-black text-[10px] text-slate-500 uppercase tracking-widest text-center">${__('actions')}</th>
                                </tr>
                            </thead>
                        <tbody id="boh-tbody" class="divide-y divide-slate-100">
                            ${this.renderRows(items)}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    filter() {
        const val = $('#inv-search').val().toLowerCase();
        $('#boh-tbody tr').each(function() {
            const text = $(this).text().toLowerCase();
            $(this).toggle(text.indexOf(val) > -1);
        });
    },

    switchMode(mode) { this.viewMode = mode; this.render(); },

    renderRows(items) {
        if(!items.length) return `<tr><td colspan="8" class="text-center py-32 text-slate-400 italic text-[10px] font-black uppercase tracking-widest bg-slate-50/30">Nothing to display in ${this.viewMode} mode</td></tr>`;
        
        return items.map((item, idx) => {
            // Indices updated based on new schema
            const isRaw = this.viewMode === 'raw';
            const code = item[2];
            const name = item[3];
            const cat = item[1];
            const uom = isRaw ? item[4] : 'Each';
            const cost = parseFloat(isRaw ? item[5] : item[5]) || 0;
            const stock = isRaw ? (parseFloat(item[7]) || 0) : '-';
            const yieldVal = isRaw ? (item[8] || 100) : (parseFloat(item[4]) || 0);
            const minQty = isRaw ? (item[10] || 0) : (item[8] || 'Active');

            return `
                <tr class="hover:bg-indigo-50/10 transition-all text-[12px] group">
                    <td class="p-5 font-mono text-[10px] text-slate-400 group-hover:text-indigo-600 font-bold">#${code}</td>
                    <td class="p-5">
                        <div class="flex flex-col">
                            <span class="font-black text-slate-800">${name}</span>
                            <span class="text-[8px] font-bold text-slate-400 uppercase tracking-widest">${item[0] || 'General'}</span>
                        </div>
                    </td>
                    <td class="p-5 text-center font-bold text-indigo-500">${cat}</td>
                    <td class="p-5 text-center font-black">${uom}</td>
                    <td class="p-5 text-center font-black text-slate-800">${Utils.formatCurrency(cost)}</td>
                    <td class="p-5 text-center">
                        <span class="px-2 py-1 rounded-lg bg-slate-100 font-black text-slate-600 text-[10px]">${stock}</span>
                    </td>
                    <td class="p-5 text-center font-black ${isRaw ? 'text-emerald-600' : 'text-indigo-600'}">${isRaw ? yieldVal + '%' : Utils.formatCurrency(yieldVal)}</td>
                    <td class="p-5 text-center">
                        <span class="px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-black text-[10px]">${minQty}</span>
                    </td>
                    <td class="p-5 text-center font-black text-rose-600">${isRaw ? (item[12] || 0) : ''}</td>
                    <td class="p-5">
                        <div class="flex items-center justify-center gap-2">
                             <button onclick="Inventory.editItem('${code}')" class="action-btn edit"><i class="fa-solid fa-pen"></i></button>
                             <button onclick="Inventory.deleteItem('${code}')" class="action-btn del"><i class="fa-solid fa-trash-can"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    showAddModal() {
        const isAr = STATE.lang === 'ar';
        const body = `
            <div class="space-y-6 animate-scale-in ${isAr ? 'text-right' : 'text-left'}" dir="${isAr ? 'rtl' : 'ltr'}">
                <div class="text-center">
                    <div class="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-[1.5rem] flex items-center justify-center text-2xl mx-auto mb-4 shadow-inner">
                        <i class="fa-solid fa-plus"></i>
                    </div>
                    <h3 class="text-xl font-black text-slate-800">${isAr ? 'إضافة صنف جديد' : 'Add New Item'}</h3>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="col-span-2">
                        <label class="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">${isAr ? 'نوع الإضافة' : 'Addition Type'}</label>
                        <select id="itm-type" class="input-premium font-black text-[11px] h-12">
                            <option value="raw" ${this.viewMode === 'raw' ? 'selected' : ''}>${isAr ? 'مادة خام (Items)' : 'Raw Material'}</option>
                            <option value="menu" ${this.viewMode === 'menu' ? 'selected' : ''}>${isAr ? 'صنف بيع (Menu)' : 'Sale Item'}</option>
                        </select>
                    </div>

                    <div class="col-span-2">
                        <label class="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">${isAr ? 'اسم الصنف' : 'Item Name'}</label>
                        <input type="text" id="itm-name" class="input-premium font-black text-[12px] h-12">
                    </div>

                    <div class="col-span-1">
                         <label class="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">${isAr ? 'السعر (لأصناف البيع)' : 'Price (Menu Only)'}</label>
                         <input type="number" id="itm-price" class="input-premium input-blue-soft font-black text-center h-12" value="0">
                    </div>
                    
                    <div class="col-span-1">
                         <label class="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">${isAr ? 'التكلفة (للمواد الخام)' : 'Cost (Raw Only)'}</label>
                         <input type="number" id="itm-cost" class="input-premium input-blue-soft font-black text-center h-12" value="0">
                    </div>

                    <div class="col-span-1">
                        <label class="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">${isAr ? 'المجموعة' : 'Group'}</label>
                        <input type="text" id="itm-group" class="input-premium font-black h-12" placeholder="e.g. Kitchen, Store">
                    </div>

                    <div class="col-span-1">
                        <label class="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">${__('category')}</label>
                        <input type="text" id="itm-cat" class="input-premium font-black h-12" placeholder="e.g. Meat, Vegetable">
                    </div>
                    
                    <div class="col-span-1">
                        <label class="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">${isAr ? 'وحدة القياس' : 'Unit'}</label>
                        <input type="text" id="itm-unit" class="input-premium font-black h-12" value="Each">
                    </div>

                    <div class="col-span-1">
                        <label class="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Supplier</label>
                        <input type="text" id="itm-supp" class="input-premium font-black h-12" value="-">
                    </div>
                    <div class="col-span-1">
                        <label class="block text-[10px] font-black text-emerald-600 mb-2 uppercase tracking-widest">Yield %</label>
                        <input type="number" id="itm-yield" class="input-premium input-blue-soft font-black text-center h-12 bg-emerald-50" value="100">
                    </div>
                    <div class="col-span-1">
                        <label class="block text-[10px] font-black text-blue-600 mb-2 uppercase tracking-widest">Serving/Portion</label>
                        <input type="number" id="itm-serving" class="input-premium input-blue-soft font-black text-center h-12 bg-blue-50" value="1">
                    </div>
                </div>

                <button onclick="Inventory.save()" class="w-full h-14 bg-indigo-600 text-white rounded-2xl text-[12px] font-black shadow-xl shadow-indigo-100 hover:bg-slate-900 transition-all flex items-center justify-center gap-3 mt-4 tracking-widest uppercase">
                    <span>${__('save')}</span>
                    <i class="fa-solid fa-check"></i>
                </button>
            </div>
        `;
        Utils.openModal(body);
        
        // Enter key support
        setTimeout(() => {
            $('#itm-name, #itm-price, #itm-cost, #itm-group, #itm-cat, #itm-unit, #itm-supp').on('keypress', function(e) {
                if(e.which === 13) Inventory.save();
            });
        }, 100);
    },

    async save() {
        const type = $('#itm-type').val();
        const data = {
            group: $('#itm-group').val() || 'Global',
            category: $('#itm-cat').val() || 'General',
            name: $('#itm-name').val(),
            code: 'ITM-' + Date.now().toString().slice(-4),
            price: $('#itm-price').val(),
            cost: $('#itm-cost').val(),
            unit: $('#itm-unit').val() || 'Each',
            supplier: $('#itm-supp').val() || '-',
            yield: $('#itm-yield').val() || 100,
            serving: $('#itm-serving').val() || 0,
            sheet: type === 'menu' ? 'Menu POS' : 'Items'
        };

        if(!data.name) return Swal.fire('Error', 'Name is required', 'error');
        
        Utils.loading(true);
        try {
            await API.call('ADD_PRODUCT', data);
            Utils.closeModal(); this.render();
            Utils.toast('Item added successfully');
        } catch(e) { Swal.fire('Error', e.toString(), 'error'); }
        finally { Utils.loading(false); }
    },

    async editItem(code) {
        const isRaw = this.viewMode === 'raw';
        const items = isRaw ? STATE.db.Items : STATE.db.Menu_POS;
        const item = items.find(i => String(i[2]) === String(code));
        if(!item) return;

        const isAr = STATE.lang === 'ar';
        const body = `
            <div class="space-y-6 animate-scale-in ${isAr ? 'text-right' : 'text-left'}" dir="${isAr ? 'rtl' : 'ltr'}">
                <div class="text-center">
                    <h3 class="text-xl font-black text-slate-800">${isAr ? 'تعديل الصنف' : 'Edit Item'}</h3>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="col-span-2">
                        <label class="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">${isAr ? 'اسم الصنف' : 'Item Name'}</label>
                        <input type="text" id="edit-itm-name" class="input-premium font-black text-[12px] h-12" value="${item[3]}">
                    </div>

                    ${!isRaw ? `
                    <div class="col-span-2">
                         <label class="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">${isAr ? 'السعر' : 'Price'}</label>
                         <input type="number" id="edit-itm-price" class="input-premium input-blue-soft font-black text-center h-12" value="${item[4]}">
                    </div>
                    ` : `
                    <div class="col-span-1">
                         <label class="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">${isAr ? 'التكلفة' : 'Cost'}</label>
                         <input type="number" id="edit-itm-cost" class="input-premium input-blue-soft font-black text-center h-12" value="${item[5]}">
                    </div>
                    <div class="col-span-1">
                        <label class="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">${isAr ? 'المجموعة' : 'Group'}</label>
                        <input type="text" id="edit-itm-group" class="input-premium font-black h-12" value="${item[0]}">
                    </div>
                    <div class="col-span-1">
                        <label class="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">${__('category')}</label>
                        <input type="text" id="edit-itm-cat" class="input-premium font-black h-12" value="${item[1]}">
                    </div>
                    <div class="col-span-1">
                        <label class="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">${isAr ? 'وحدة القياس' : 'Unit'}</label>
                        <input type="text" id="edit-itm-unit" class="input-premium font-black h-12" value="${item[4]}">
                    </div>
                    <div class="col-span-1">
                        <label class="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Supplier</label>
                        <input type="text" id="edit-itm-supp" class="input-premium font-black h-12" value="${item[6] || '-'}">
                    </div>
                    <div class="col-span-1">
                        <label class="block text-[10px] font-black text-emerald-600 mb-2 uppercase tracking-widest">Yield %</label>
                         <input type="number" id="edit-itm-yield" class="input-premium input-blue-soft font-black text-center h-12 bg-emerald-50" value="${item[8] || 100}">
                    </div>
                    <div class="col-span-1">
                        <label class="block text-[10px] font-black text-indigo-500 mb-2 uppercase tracking-widest">Min (Alert)</label>
                         <input type="number" id="edit-itm-min" class="input-premium input-blue-soft font-black text-center h-12 bg-indigo-50" value="${item[10] || 0}">
                    </div>
                    <div class="col-span-1">
                        <label class="block text-[10px] font-black text-blue-600 mb-2 uppercase tracking-widest">Serving/Portion</label>
                         <input type="number" id="edit-itm-serving" class="input-premium input-blue-soft font-black text-center h-12 bg-blue-50" value="${item[12] || 0}">
                    </div>
                    `}
                </div>

                <button onclick="Inventory.update('${code}')" class="w-full h-14 bg-indigo-600 text-white rounded-2xl text-[12px] font-black shadow-xl shadow-indigo-100 hover:bg-slate-900 transition-all flex items-center justify-center gap-3 mt-4 tracking-widest uppercase">
                    <span>${__('update')}</span>
                    <i class="fa-solid fa-check"></i>
                </button>
            </div>
        `;
        Utils.openModal(body);
        setTimeout(() => {
            $('#edit-itm-name, #edit-itm-price, #edit-itm-cost, #edit-itm-group, #edit-itm-cat, #edit-itm-unit, #edit-itm-supp').on('keypress', function(e) {
                if(e.which === 13) Inventory.update(code);
            });
        }, 100);
    },

    async update(code) {
        const sheet = this.viewMode === 'raw' ? 'Items' : 'Menu POS';
        const isRaw = this.viewMode === 'raw';
        
        const updates = isRaw ? [
            { col: 0, val: $('#edit-itm-group').val() },
            { col: 1, val: $('#edit-itm-cat').val() },
            { col: 3, val: $('#edit-itm-name').val() },
            { col: 4, val: $('#edit-itm-unit').val() },
            { col: 5, val: parseFloat($('#edit-itm-cost').val()) },
            { col: 6, val: $('#edit-itm-supp').val() },
            { col: 8, val: parseFloat($('#edit-itm-yield').val()) || 100 },
            { col: 10, val: parseFloat($('#edit-itm-min').val()) || 0 },
            { col: 12, val: parseFloat($('#edit-itm-serving').val()) || 0 }
        ] : [
            { col: 3, val: $('#edit-itm-name').val() },
            { col: 4, val: parseFloat($('#edit-itm-price').val()) }
        ];

        const data = {
            sheet: sheet,
            id: code,
            idIndex: 2,
            updates: updates
        };
        
        Utils.loading(true);
        try {
            await API.call('UPDATE_RECORD', data);
            await App.syncData(true);
            Utils.closeModal(); this.render();
            Utils.toast('Item updated successfully');
        } catch(e) { Swal.fire('Error', e.toString(), 'error'); }
        finally { Utils.loading(false); }
    },

    async deleteItem(code) {
        const sheet = this.viewMode === 'raw' ? 'Items' : 'Menu POS';
        const res = await Swal.fire({
            title: STATE.lang === 'ar' ? 'هل أنت متأكد؟' : 'Are you sure?',
            text: (STATE.lang === 'ar' ? 'سيتم حذف الصنف نهائياً' : 'Item will be permanently deleted'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: STATE.lang === 'ar' ? 'نعم، احذف' : 'Yes, Delete',
            cancelButtonText: STATE.lang === 'ar' ? 'تراجع' : 'Cancel'
        });

        if (res.isConfirmed) {
            Utils.loading(true);
            try {
                await API.call('DELETE_RECORD', { sheet: sheet, id: code, idIndex: 2 });
                this.render();
                Utils.toast('Item deleted successfully');
            } catch(e) { Swal.fire('Error', e.toString(), 'error'); }
            finally { Utils.loading(false); }
        }
    }
};
