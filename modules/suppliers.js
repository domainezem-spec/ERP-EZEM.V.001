/**
 * SUPPLIERS MODULE (Slim & CRUD)
 */
const Suppliers = {
    render() {
        const suppliers = STATE.db.Suppliers || [];
        const isAr = STATE.lang === 'ar';
        
        document.getElementById('main-content').innerHTML = `
            <div class="space-y-6 animate-fade-in ${isAr ? 'text-right' : 'text-left'}" dir="${isAr ? 'rtl' : 'ltr'}">
                <div class="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-lg">
                            <i class="fa-solid fa-truck-fast"></i>
                        </div>
                        <div>
                            <h2 class="text-lg font-black text-slate-800 tracking-tight">${__('suppliers_dir')}</h2>
                            <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Global Vendor & Contact Management</p>
                        </div>
                    </div>
                    <button onclick="Suppliers.showAddModal()" class="btn btn-primary">
                        <i class="fa-solid fa-plus-circle"></i> ${__('add_supplier')}
                    </button>
                </div>

                <div class="table-container shadow-sm bg-white overflow-x-auto rounded-2xl border border-slate-100 overflow-hidden">
                    <table class="w-full ${isAr ? 'text-right' : 'text-left'}" id="suppliers-table">
                         <thead class="bg-slate-50">
                            <tr>
                                <th class="p-4 text-[10px] font-black text-slate-400 uppercase">${__('supplier_name')}</th>
                                <th class="p-4 text-[10px] font-black text-slate-400 uppercase">${__('contact_person')}</th>
                                <th class="p-4 text-[10px] font-black text-slate-400 uppercase text-center">${__('phone')}</th>
                                <th class="p-4 text-[10px] font-black text-slate-400 uppercase">${__('email')}</th>
                                <th class="p-4 text-[10px] font-black text-slate-400 uppercase">${__('address')}</th>
                                ${Auth.canEdit() ? `<th class="p-4 text-[10px] font-black text-slate-400 uppercase text-center">${__('actions')}</th>` : ''}
                            </tr>
                        </thead>
                        <tbody id="sup-tbody" class="divide-y divide-slate-100">
                            ${this.renderRows(suppliers)}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    renderRows(suppliers) {
        if(!suppliers.length) return `<tr><td colspan="6" class="text-center py-16 text-slate-300 italic text-xs">${__('no_trxs_found')}</td></tr>`;
        
        return suppliers.map(s => `
            <tr class="hover:bg-slate-50 transition-colors">
                <td class="p-4 font-bold text-slate-800">${s[0]}</td>
                <td class="p-4 text-slate-500 font-medium">${s[1] || '-'}</td>
                <td class="p-4 text-slate-500 font-mono text-xs text-center">${s[2] || '-'}</td>
                <td class="p-4 text-slate-400 text-xs">${s[3] || '-'}</td>
                <td class="p-4 text-slate-400 text-xs">${s[4] || '-'}</td>
                ${Auth.canEdit() ? `
                    <td class="p-4 text-center">
                        <div class="flex items-center justify-center gap-2">
                            <button onclick="Suppliers.editItem('${s[0]}')" class="action-btn edit"><i class="fa-solid fa-pen"></i></button>
                            <button onclick="Suppliers.deleteItem('${s[0]}')" class="action-btn del"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </td>
                ` : ''}
            </tr>
        `).join('');
    },

    showAddModal() {
        const isAr = STATE.lang === 'ar';
        const body = `
            <div class="space-y-4 animate-scale-in ${isAr ? 'text-right' : 'text-left'}" dir="${isAr ? 'rtl' : 'ltr'}">
                <div class="text-center">
                    <div class="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-xl mx-auto mb-3">
                        <i class="fa-solid fa-truck-field"></i>
                    </div>
                    <h3 class="text-lg font-black text-slate-800">${__('add_supplier')}</h3>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div class="col-span-2">
                        <label class="nav-label p-0 mb-1 text-[10px]">${__('supplier_name')}</label>
                        <input type="text" id="sup-name" class="input-premium" placeholder="...">
                    </div>
                    <div>
                        <label class="nav-label p-0 mb-1 text-[10px]">${__('contact_person')}</label>
                        <input type="text" id="sup-contact" class="input-premium" placeholder="...">
                    </div>
                    <div>
                        <label class="nav-label p-0 mb-1 text-[10px]">${__('phone')}</label>
                        <input type="text" id="sup-phone" class="input-premium" placeholder="...">
                    </div>
                    <div>
                        <label class="nav-label p-0 mb-1 text-[10px]">${__('email')}</label>
                        <input type="email" id="sup-email" class="input-premium" placeholder="info@example.com">
                    </div>
                    <div>
                        <label class="nav-label p-0 mb-1 text-[10px]">${__('address')}</label>
                        <input type="text" id="sup-addr" class="input-premium" placeholder="...">
                    </div>
                </div>
                <button onclick="Suppliers.save()" class="w-full btn btn-primary h-11 justify-center rounded-xl mt-4">${__('save')}</button>
            </div>
        `;
        Utils.openModal(body);
        setTimeout(() => {
            $('#sup-name, #sup-contact, #sup-phone, #sup-email, #sup-addr').on('keypress', function(e) {
                if(e.which === 13) Suppliers.save();
            });
        }, 100);
    },

    async save() {
        const data = {
            name: $('#sup-name').val(),
            phone: $('#sup-phone').val(),
            contact: $('#sup-contact').val(),
            email: $('#sup-email').val(),
            address: $('#sup-addr').val()
        };
        if(!data.name) return Swal.fire(__('warning'), 'Supplier name is required', 'warning');
        
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

    async editItem(name) {
        const s = STATE.db.Suppliers.find(x => x[0] === name);
        if(!s) return;
        const isAr = STATE.lang === 'ar';

        const body = `
            <div class="space-y-4 animate-scale-in ${isAr ? 'text-right' : 'text-left'}" dir="${isAr ? 'rtl' : 'ltr'}">
                <div class="text-center">
                    <h3 class="text-lg font-black text-slate-800">${__('edit')}</h3>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div class="col-span-2">
                        <input type="text" id="edit-sup-contact" class="input-premium" value="${s[1]}" placeholder="${__('contact_person')}">
                    </div>
                    <input type="text" id="edit-sup-phone" class="input-premium" value="${s[2]}" placeholder="${__('phone')}">
                    <input type="email" id="edit-sup-email" class="input-premium" value="${s[3]}" placeholder="${__('email')}">
                    <input type="text" id="edit-sup-addr" class="input-premium" value="${s[4] || ''}" placeholder="${__('address')}">
                </div>
                <button onclick="Suppliers.update('${name}')" class="w-full btn btn-primary h-11 justify-center rounded-xl mt-4">${__('update')}</button>
            </div>
        `;
        Utils.openModal(body);
        setTimeout(() => {
            $('#edit-sup-contact, #edit-sup-phone, #edit-sup-email, #edit-sup-addr').on('keypress', function(e) {
                if(e.which === 13) Suppliers.update(name);
            });
        }, 100);
    },

    async update(name) {
        const data = {
            sheet: 'Suppliers',
            id: name,
            idIndex: 0,
            updates: [
                { col: 1, val: $('#edit-sup-contact').val() },
                { col: 2, val: $('#edit-sup-phone').val() },
                { col: 3, val: $('#edit-sup-email').val() }
            ]
        };
        Utils.loading(true, __('processing'));
        try {
            await API.call('UPDATE_RECORD', data);
            await App.syncData();
            Utils.closeModal();
            this.render();
            Utils.toast(__('success'));
        } catch(e) { Swal.fire(__('error'), e.toString(), 'error'); }
        finally { Utils.loading(false); }
    },

    async deleteItem(name) {
        const res = await Swal.fire({ title: __('confirm'), icon: 'warning', showCancelButton: true });
        if (res.isConfirmed) {
            Utils.loading(true, __('processing'));
            try {
                await API.call('DELETE_RECORD', { sheet: 'Suppliers', id: name, idIndex: 0 });
                await App.syncData();
                this.render();
                Utils.toast(__('success'));
            } catch(e) { Swal.fire(__('error'), e.toString(), 'error'); }
            finally { Utils.loading(false); }
        }
    }
};
