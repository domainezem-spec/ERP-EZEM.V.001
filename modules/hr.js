/**
 * HR MODULE (Staff & Payroll)
 * Light-themed matching NEW.25-1.html
 */
const HR = {
    render() {
        const staff = STATE.db.STAFF || [];
        const isAr = STATE.lang === 'ar';
        
        document.getElementById('main-content').innerHTML = `
            <div class="space-y-8 animate-fade-in ${isAr ? 'text-right' : 'text-left'}" dir="${isAr ? 'rtl' : 'ltr'}">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-black text-slate-800 flex items-center gap-3">
                        <i class="fa-solid fa-users-gear text-blue-500"></i> ${__('hr_management')}
                    </h2>
                    <button onclick="HR.showAddStaff()" class="btn btn-primary px-8 shadow-lg">
                        <i class="fa-solid fa-user-plus"></i> ${__('add_staff')}
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${this.renderStaffCards(staff)}
                </div>

                <div class="glass-card">
                    <h3 class="section-title">${__('attendance_log')} (Live)</h3>
                    <div class="table-container shadow-sm bg-white overflow-hidden rounded-2xl border border-slate-100">
                        <table class="w-full ${isAr ? 'text-right' : 'text-left'}">
                             <thead>
                                <tr class="bg-slate-50">
                                    <th class="p-4 text-[10px] font-black text-slate-400 uppercase">${__('staff_name')}</th>
                                    <th class="p-4 text-[10px] font-black text-slate-400 uppercase">${isAr ? 'التاريخ' : 'Date'}</th>
                                    <th class="p-4 text-[10px] font-black text-slate-400 uppercase">${__('clock_in')}</th>
                                    <th class="p-4 text-[10px] font-black text-slate-400 uppercase">${__('clock_out')}</th>
                                    <th class="p-4 text-[10px] font-black text-slate-400 uppercase text-center">${__('status')}</th>
                                </tr>
                            </thead>
                            <tbody id="attendance-tbody" class="divide-y divide-slate-100">
                                <tr><td colspan="5" class="text-center py-10 text-slate-400">No attendance records today</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    renderStaffCards(staff) {
        if(!staff.length) return `<div class="col-span-full text-center py-20 opacity-20">No staff registered</div>`;
        
        return staff.map(s => `
            <div class="glass-card flex flex-col items-center text-center group hover:border-blue-200 transition-all relative">
                <div class="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="HR.editStaff('${s[0]}')" class="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all"><i class="fa-solid fa-pen text-[9px]"></i></button>
                    <button onclick="HR.deleteStaff('${s[0]}')" class="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all"><i class="fa-solid fa-trash text-[9px]"></i></button>
                </div>
                <div class="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-2xl text-slate-400 font-bold mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    ${s[1]?.charAt(0) || 'E'}
                </div>
                <h4 class="font-black text-slate-800">${s[1]}</h4>
                <div class="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">${s[2]}</div>
                <div class="mt-4 pt-4 border-t border-slate-50 w-full">
                    <div class="flex justify-between text-xs mb-2">
                        <span class="text-slate-400">${__('base_salary')}</span>
                        <span class="font-bold text-blue-600">${Utils.formatCurrency(s[4] || 0)}</span>
                    </div>
                    <div class="grid grid-cols-2 gap-2 mt-4">
                        <button onclick="HR.logAttendance('${s[0]}', 'IN')" class="bg-emerald-50 text-emerald-600 py-2 rounded-xl text-[10px] font-black hover:bg-emerald-600 hover:text-white transition-all">${__('clock_in')}</button>
                        <button onclick="HR.logAttendance('${s[0]}', 'OUT')" class="bg-rose-50 text-rose-600 py-2 rounded-xl text-[10px] font-black hover:bg-rose-600 hover:text-white transition-all">${__('clock_out')}</button>
                    </div>
                </div>
            </div>
        `).join('');
    },

    showAddStaff() {
        const isAr = STATE.lang === 'ar';
        const body = `
            <div class="space-y-6 animate-scale-in ${isAr ? 'text-right' : 'text-left'}" dir="${isAr ? 'rtl' : 'ltr'}">
                <div class="text-center">
                    <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
                        <i class="fa-solid fa-user-tie"></i>
                    </div>
                    <h3 class="text-xl font-black">${__('add_staff')}</h3>
                </div>
                
                <div class="space-y-4">
                    <div>
                        <label class="nav-label p-0 mb-1">${__('staff_name')}</label>
                        <input type="text" id="stf-name" class="input-premium" placeholder="...">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="nav-label p-0 mb-1">${__('role')}</label>
                            <input type="text" id="stf-role" class="input-premium" placeholder="...">
                        </div>
                        <div>
                            <label class="nav-label p-0 mb-1">${__('base_salary')}</label>
                            <input type="number" id="stf-salary" class="input-premium" placeholder="0.00">
                        </div>
                    </div>
                </div>
                
                <button onclick="HR.saveStaff()" class="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all mt-4">${__('save')}</button>
            </div>
        `;
        Utils.openModal(body);
        setTimeout(() => {
            $('#stf-name, #stf-role, #stf-salary').on('keypress', function(e) {
                if(e.which === 13) HR.saveStaff();
            });
        }, 100);
    },

    async saveStaff() {
        const data = {
            id: 'STF-' + Date.now().toString().slice(-4),
            name: $('#stf-name').val(),
            role: $('#stf-role').val(),
            salary: $('#stf-salary').val(),
            joinDate: new Date().toISOString().split('T')[0]
        };
        
        if(!data.name || !data.role) return Swal.fire(__('warning'), 'Missing fields', 'warning');

        Utils.loading(true, __('processing'));
        try {
            await API.call('SAVE_STAFF', data);
            await App.syncData();
            Utils.closeModal();
            this.render();
            Utils.toast(__('success'));
        } catch(e) { Swal.fire(__('error'), e.toString(), 'error'); }
        finally { Utils.loading(false); }
    },

    async editStaff(id) {
        const s = STATE.db.STAFF.find(x => x[0] === id);
        if(!s) return;
        const isAr = STATE.lang === 'ar';

        const body = `
            <div class="space-y-6 animate-scale-in ${isAr ? 'text-right' : 'text-left'}" dir="${isAr ? 'rtl' : 'ltr'}">
                <div class="text-center">
                    <h3 class="text-xl font-black">${isAr ? 'تعديل بيانات الموظف' : 'Edit Staff'}</h3>
                </div>
                <div class="space-y-4">
                    <input type="text" id="edit-stf-name" class="input-premium" value="${s[1]}" placeholder="${__('staff_name')}">
                    <div class="grid grid-cols-2 gap-4">
                        <input type="text" id="edit-stf-role" class="input-premium" value="${s[2]}" placeholder="${__('role')}">
                        <input type="number" id="edit-stf-salary" class="input-premium" value="${s[4]}" placeholder="${__('base_salary')}">
                    </div>
                </div>
                <button onclick="HR.updateStaff('${id}')" class="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-900 transition-all mt-4">${__('update')}</button>
            </div>
        `;
        Utils.openModal(body);
        setTimeout(() => {
            $('#edit-stf-name, #edit-stf-role, #edit-stf-salary').on('keypress', function(e) {
                if(e.which === 13) HR.updateStaff(id);
            });
        }, 100);
    },

    async updateStaff(id) {
        const data = {
            sheet: 'Staff',
            id: id,
            idIndex: 0,
            updates: [
                { col: 1, val: $('#edit-stf-name').val() },
                { col: 2, val: $('#edit-stf-role').val() },
                { col: 4, val: parseFloat($('#edit-stf-salary').val()) }
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

    async deleteStaff(id) {
        const res = await Swal.fire({ title: __('confirm'), icon: 'warning', showCancelButton: true });
        if (res.isConfirmed) {
            Utils.loading(true, __('processing'));
            try {
                await API.call('DELETE_RECORD', { sheet: 'Staff', id: id, idIndex: 0 });
                await App.syncData();
                this.render();
                Utils.toast(__('success'));
            } catch(e) { Swal.fire(__('error'), e.toString(), 'error'); }
            finally { Utils.loading(false); }
        }
    },

    async logAttendance(id, type) {
        const s = STATE.db.STAFF.find(x => x[0] === id);
        Utils.loading(true, __('processing'));
        try {
            await API.call('LOG_ATTENDANCE', { staffId: id, staffName: s ? s[1] : id, type });
            Utils.loading(false);
            Utils.toast(__('success'));
        } catch(e) { Swal.fire(__('error'), e.toString(), 'error'); }
    }
};
