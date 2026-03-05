/**
 * USERS MODULE (Security & Access Control) v3.3
 */
const Users = {
    render() {
        const users = STATE.db.Users || [];
        const isAr = STATE.lang === 'ar';
        
        document.getElementById('main-content').innerHTML = `
            <div class="space-y-6 animate-fade-in ${isAr ? 'text-right' : 'text-left'}" dir="${isAr ? 'rtl' : 'ltr'}">
                <div class="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-lg">
                            <i class="fa-solid fa-user-lock"></i>
                        </div>
                        <div>
                            <h2 class="text-xl font-black text-slate-800 tracking-tight">${__('users_perms')}</h2>
                            <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Global Security & Access Control HUB</p>
                        </div>
                    </div>
                    ${Auth.canEdit() ? `
                        <button onclick="Users.showAddModal()" class="btn btn-primary">
                            <i class="fa-solid fa-user-plus"></i> ${__('add_user')}
                        </button>
                    ` : ''}
                </div>

                <div class="table-container shadow-sm bg-white overflow-x-auto rounded-2xl border border-slate-100 overflow-hidden">
                    <table class="w-full ${isAr ? 'text-right' : 'text-left'}">
                         <thead class="bg-slate-50">
                            <tr>
                                <th class="w-12 p-4 text-[10px] font-black text-slate-400 uppercase">#</th>
                                <th class="p-4 text-[10px] font-black text-slate-400 uppercase">${__('full_name')}</th>
                                <th class="p-4 text-[10px] font-black text-slate-400 uppercase">${__('username')}</th>
                                <th class="p-4 text-[10px] font-black text-slate-400 uppercase">${__('role')}</th>
                                <th class="p-4 text-[10px] font-black text-slate-400 uppercase">${__('perms_map')}</th>
                                <th class="p-4 text-[10px] font-black text-slate-400 uppercase text-center">${__('status')}</th>
                                 ${Auth.canEdit() ? `<th class="p-4 text-[10px] font-black text-slate-400 uppercase text-center">${__('actions')}</th>` : ''}
                            </tr>
                        </thead>
                        <tbody id="user-tbody" class="divide-y divide-slate-100">
                            ${this.renderRows(users)}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    renderRows(users) {
        if(!users.length) return `<tr><td colspan="7" class="text-center py-16 text-slate-300 italic text-xs">${__('no_trxs_found')}</td></tr>`;
        
        return users.map((u, idx) => {
            const id = u[0];
            const name = u[1];
            const username = u[2];
            const role = u[4];
            const perms = u[6] || '<span class="italic text-slate-300">Standard</span>';
            const status = u[5];

            return `
                <tr class="hover:bg-slate-50 transition-colors text-sm">
                    <td class="p-4 text-slate-200 font-mono text-[10px]">${idx + 1}</td>
                    <td class="p-4 font-bold text-slate-700">${name}</td>
                    <td class="p-4 text-slate-400 font-mono text-[11px] font-bold">${username}</td>
                    <td class="p-4">
                         <div class="flex items-center gap-2">
                            <span class="px-2 py-0.5 rounded bg-slate-100 text-indigo-600 text-[9px] font-black uppercase tracking-tighter">${role}</span>
                         </div>
                    </td>
                    <td class="p-4 max-w-[200px] truncate"><span class="text-[9px] text-slate-400 font-medium">${perms}</span></td>
                    <td class="p-4 text-center">
                        <span class="w-2 h-2 ${status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-slate-200'} rounded-full inline-block"></span>
                    </td>
                    ${Auth.canEdit() ? `
                        <td class="p-4 text-center">
                            <div class="flex items-center justify-center gap-2">
                                <button onclick="Users.editUser('${id}')" class="action-btn edit" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
                                <button onclick="Users.deleteUser('${id}')" class="action-btn del" title="Delete"><i class="fa-solid fa-trash-can"></i></button>
                            </div>
                        </td>
                    ` : ''}
                </tr>
            `;
        }).join('');
    },

    renderPermsHub(selected = []) {
        const isAr = STATE.lang === 'ar';
        const groups = [
            {
                label: isAr ? 'الإعدادات الأساسية' : 'Setup',
                items: [
                    { id: 'users', label: __('users') },
                    { id: 'settings', label: __('settings') },
                    { id: 'suppliers', label: __('suppliers') }
                ]
            },
            {
                label: isAr ? 'المخزن والإنتاج' : 'Inventory & Production',
                items: [
                    { id: 'inv', label: __('inv') },
                    { id: 'recipes', label: __('recipes') },
                    { id: 'trx', label: isAr ? 'حركات المخزن (مراجعة - استخراج)' : 'Stock Movements (Review/Export)' },
                    { id: 'audit', label: isAr ? 'جرد المخزون (مراجعة - تعديل)' : 'Inventory Audit (Review/Edit)' },
                    { id: 'recon', label: __('recon') }
                ]
            },
            {
                label: isAr ? 'المبيعات والتشغيل' : 'Sales & Operations',
                items: [
                    { id: 'pos', label: __('pos') },
                    { id: 'kds', label: __('kds') },
                    { id: 'reports_hub', label: isAr ? 'مركز التقارير (تحديد التقارير المتاحة)' : 'Reports Hub (Control visibility)' },
                    { id: 'sales_log', label: __('sales_log') },
                    { id: 'admin_stats', label: isAr ? 'إحصائيات الإدارة' : 'Admin Stats' },
                    { id: 'finance', label: isAr ? 'الأرباح والخسائر (P&L)' : 'Profit & Loss (P&L)' }
                ]
            },
            {
                label: isAr ? 'الموارد البشرية' : 'HR & Payroll',
                items: [
                    { id: 'hr', label: __('hr') }
                ]
            },
            {
                label: isAr ? 'لوحة التحكم' : 'Dashboard',
                items: [
                    { id: 'dash', label: __('dash') }
                ]
            }
        ];

        return `
            <div class="space-y-4 mt-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 max-h-[400px] overflow-y-auto custom-scrollbar">
                ${groups.map(group => `
                    <div class="space-y-2">
                        <div class="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-1 mb-2">${group.label}</div>
                        <div class="grid grid-cols-2 lg:grid-cols-3 gap-2">
                            ${group.items.map(s => `
                                <label class="flex items-center gap-2 p-2 hover:bg-white rounded-lg cursor-pointer transition-all border border-transparent hover:border-slate-100">
                                    <input type="checkbox" name="usr-perm" value="${s.id}" ${selected.includes(s.id) ? 'checked' : ''} class="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
                                    <span class="text-[10px] font-bold text-slate-600">${s.label}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    showAddModal() {
        const isAr = STATE.lang === 'ar';
        const body = `
            <div class="space-y-4 animate-scale-in ${isAr ? 'text-right' : 'text-left'}" dir="${isAr ? 'rtl' : 'ltr'}">
                <div class="text-center">
                    <div class="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-inner">
                        <i class="fa-solid fa-user-shield"></i>
                    </div>
                    <h3 class="text-xl font-black text-slate-800">${__('add_user')}</h3>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="col-span-2">
                        <label class="block text-[10px] font-black text-slate-400 mb-2 uppercase">${__('full_name')}</label>
                        <input type="text" id="usr-name" class="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold" placeholder="...">
                    </div>
                    <div>
                        <label class="block text-[10px] font-black text-slate-400 mb-2 uppercase">${__('username')}</label>
                        <input type="text" id="usr-user" class="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold" placeholder="login_id">
                    </div>
                    <div>
                        <label class="block text-[10px] font-black text-slate-400 mb-2 uppercase">${__('password')}</label>
                        <input type="password" id="usr-pass" class="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold">
                    </div>
                    <div class="col-span-2">
                        <label class="block text-[10px] font-black text-slate-400 mb-2 uppercase">${__('role')} / Group</label>
                        <select id="usr-role" class="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold">
                            <option value="Admin">Group Super Admin</option>
                            <option value="Branches">Branches</option>
                            <option value="Manager">Manager</option>
                            <option value="Cashier">Cashier</option>
                            <option value="Storekeeper">Storekeeper</option>
                            <option value="Accountant">Accountant</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label class="block text-[10px] font-black text-slate-400 mb-2 uppercase">${__('perms_map')}</label>
                    ${this.renderPermsHub()}
                </div>

                <button onclick="Users.save()" class="w-full h-14 bg-indigo-600 text-white rounded-2xl text-[14px] font-black shadow-xl shadow-indigo-100 hover:bg-slate-900 transition-all flex items-center justify-center gap-3 mt-4">
                    <span>${__('save')}</span>
                    <i class="fa-solid fa-check-double"></i>
                </button>
            </div>
        `;
        Utils.openModal(body);
    },

    async save() {
        const perms = [];
        $('input[name="usr-perm"]:checked').each(function() { perms.push($(this).val()); });

        const data = {
            name: $('#usr-name').val(),
            user: $('#usr-user').val(),
            pass: $('#usr-pass').val(),
            role: $('#usr-role').val(),
            perms: perms.join(',')
        };
        if(!data.name || !data.user || !data.pass) return Swal.fire(__('warning'), 'Missing fields', 'warning');
        
        Utils.loading(true, __('processing'));
        try {
            await API.call('MANAGE_USER', data);
            await App.syncData();
            Utils.closeModal();
            this.render();
            Utils.toast(__('success'));
        } catch(e) { Swal.fire(__('error'), e.toString(), 'error'); }
        finally { Utils.loading(false); }
    },

    async editUser(id) {
        const user = STATE.db.Users.find(u => u[0] === id);
        if(!user) return;
        const isAr = STATE.lang === 'ar';
        const currentPerms = (user[6] || '').split(',').map(p => p.trim());

        const body = `
            <div class="space-y-4 animate-scale-in ${isAr ? 'text-right' : 'text-left'}" dir="${isAr ? 'rtl' : 'ltr'}">
                <div class="text-center">
                    <div class="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">
                        <i class="fa-solid fa-user-gear"></i>
                    </div>
                    <h3 class="text-xl font-black text-slate-800">${__('edit')}: ${user[1]}</h3>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="col-span-2">
                        <label class="block text-[10px] font-black text-slate-400 mb-2 uppercase">${__('full_name')}</label>
                        <input type="text" id="edit-usr-name" class="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold" value="${user[1]}">
                    </div>
                    <div>
                        <label class="block text-[10px] font-black text-slate-400 mb-2 uppercase">${__('role')}</label>
                        <select id="edit-usr-role" class="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold">
                            <option value="Admin" ${user[4]=='Admin'?'selected':''}>Admin</option>
                            <option value="Manager" ${user[4]=='Manager'?'selected':''}>Manager</option>
                            <option value="Cashier" ${user[4]=='Cashier'?'selected':''}>Cashier</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-[10px] font-black text-slate-400 mb-2 uppercase">${__('status')}</label>
                        <select id="edit-usr-status" class="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold">
                            <option value="Active" ${user[5]=='Active'?'selected':''}>${__('active')}</option>
                            <option value="Inactive" ${user[5]=='Inactive'?'selected':''}>${__('inactive')}</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label class="block text-[10px] font-black text-slate-400 mb-2 uppercase">${__('perms_map')}</label>
                    ${this.renderPermsHub(currentPerms)}
                </div>

                <div class="flex gap-2 mt-6">
                     <button onclick="Utils.closeModal()" class="flex-1 h-14 border-2 border-slate-100 rounded-2xl text-[12px] font-black text-slate-400 hover:bg-slate-50 transition-all">${__('cancel')}</button>
                     <button onclick="Users.update('${id}')" class="flex-[2] h-14 bg-indigo-600 text-white rounded-2xl text-[14px] font-black shadow-xl shadow-indigo-100 hover:bg-slate-900 transition-all">${__('update')}</button>
                </div>
            </div>
        `;
        Utils.openModal(body);
    },

    async update(id) {
        const perms = [];
        $('input[name="usr-perm"]:checked').each(function() { perms.push($(this).val()); });

        const data = {
            sheet: 'Users',
            id: id,
            updates: [
                { col: 1, val: $('#edit-usr-name').val() },
                { col: 4, val: $('#edit-usr-role').val() },
                { col: 5, val: $('#edit-usr-status').val() },
                { col: 6, val: perms.join(',') }
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

    async deleteUser(id) {
        const res = await Swal.fire({
            title: __('confirm'),
            icon: 'warning',
            showCancelButton: true
        });

        if (res.isConfirmed) {
            Utils.loading(true, __('processing'));
            try {
                await API.call('DELETE_RECORD', { sheet: 'Users', id: id });
                await App.syncData();
                this.render();
                Utils.toast(__('success'));
            } catch(e) { Swal.fire(__('error'), e.toString(), 'error'); }
            finally { Utils.loading(false); }
        }
    }
};
