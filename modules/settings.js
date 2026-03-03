/**
 * SETTINGS MODULE (Global & Maintenance)
 * Premium Light Theme
 */
const Settings = {
    render() {
        const isAr = STATE.lang === 'ar';
        document.getElementById('main-content').innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in ${isAr ? 'text-right' : 'text-left'}" dir="${isAr ? 'rtl' : 'ltr'}">
                
                <!-- Language Settings Card -->
                <div class="glass-card">
                    <div class="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                        <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <i class="fa-solid fa-language"></i>
                        </div>
                        <h3 class="text-lg font-black text-slate-800">${__('lang_settings')}</h3>
                    </div>
                    <div class="space-y-6">
                        <p class="text-xs text-slate-500 font-medium">${__('select_lang')}</p>
                        <div class="grid grid-cols-2 gap-4">
                            <button onclick="App.setLanguage('ar')" 
                                    class="h-14 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${STATE.lang === 'ar' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600 shadow-lg shadow-indigo-100/50' : 'border-slate-100 text-slate-400 hover:border-slate-200'}">
                                <span class="text-lg font-black italic">ع</span>
                                <span class="text-[10px] font-bold uppercase tracking-widest">${__('ar_lang')}</span>
                            </button>
                            <button onclick="App.setLanguage('en')" 
                                    class="h-14 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${STATE.lang === 'en' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600 shadow-lg shadow-indigo-100/50' : 'border-slate-100 text-slate-400 hover:border-slate-200'}">
                                <span class="text-lg font-black italic">EN</span>
                                <span class="text-[10px] font-bold uppercase tracking-widest">${__('en_lang')}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- System Info Card -->
                <div class="glass-card">
                    <div class="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                        <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <i class="fa-solid fa-circle-info"></i>
                        </div>
                        <h3 class="text-lg font-black text-slate-800">${isAr ? 'معلومات المنظومة' : 'System Information'}</h3>
                    </div>
                    <div class="space-y-4">
                        <div class="flex justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                            <span class="text-xs font-black text-slate-400 uppercase tracking-widest">${isAr ? 'إصدار المحرك' : 'Core Version'}</span>
                            <span class="font-bold text-slate-800">ERP-EZEM PRO v4.5.2</span>
                        </div>
                        <div class="flex justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                            <span class="text-xs font-black text-slate-400 uppercase tracking-widest">${isAr ? 'حالة الاتصال' : 'Connection Status'}</span>
                            <span class="flex items-center gap-2 font-bold text-emerald-600">
                                <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> ${isAr ? 'متصل (LIVE)' : 'Connected (LIVE)'}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Maintenance Card -->
                <div class="glass-card">
                    <div class="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                        <div class="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                            <i class="fa-solid fa-screwdriver-wrench"></i>
                        </div>
                        <h3 class="text-lg font-black text-slate-800">${isAr ? 'الصيانة والتهيئة' : 'Maintenance & Setup'}</h3>
                    </div>
                    <p class="text-xs text-slate-500 mb-6 font-medium">${isAr ? 'استخدم هذا الخيار عند تحديث النظام لإعادة بناء هياكل الجداول في Google Sheets دون مسح بياناتك.' : 'Use this option to rebuild Google Sheets structures without deleting your data during system updates.'}</p>
                    <button onclick="Settings.runSetup()" class="w-full btn btn-primary bg-rose-500 hover:bg-rose-600 border-none h-14 rounded-2xl shadow-xl shadow-rose-100 font-black text-xs uppercase tracking-widest">
                        ${isAr ? 'تحديث هيكل قاعدة البيانات' : 'Update Database Structure'}
                    </button>
                </div>

                <!-- Telegram Integration Card -->
                <div class="glass-card">
                    <div class="flex items-center justify-between mb-6 border-b border-slate-50 pb-4">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                <i class="fa-brands fa-telegram"></i>
                            </div>
                            <h3 class="text-lg font-black text-slate-800">${isAr ? 'مركز الذكاء (Telegram)' : 'Intelligence Center (Telegram)'}</h3>
                        </div>
                        <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${STATE.db.telegram?.enabled ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}">
                            ${STATE.db.telegram?.enabled ? 'Connected' : 'Disconnected'}
                        </span>
                    </div>
                    <div class="space-y-4">
                         <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-dotted border-slate-200">
                            <div class="flex flex-col">
                                <span class="text-[10px] font-black text-slate-700 uppercase">${isAr ? 'حالة التفعيل' : 'Active Status'}</span>
                                <span class="text-[9px] text-slate-400 font-bold">${isAr ? 'تشغيل/إيقاف استقبال التنبيهات' : 'Toggle alert reception'}</span>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" id="tg-enabled" class="sr-only peer" ${STATE.db.telegram?.enabled ? 'checked' : ''}>
                                <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                         </div>
                         <div>
                            <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Bot Token</label>
                            <input type="password" id="tg-token" class="input-premium" value="${STATE.db.telegram?.token || ''}" placeholder="8751162943:AAFV...">
                         </div>
                         <div class="flex items-center gap-2">
                             <div class="flex-1">
                                <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Chat ID / Channel ID</label>
                                <input type="text" id="tg-chat" class="input-premium font-mono" value="${STATE.db.telegram?.chatId || ''}" placeholder="256726844">
                             </div>
                             <button onclick="Settings.discoverChatId()" class="mt-4 p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all shadow-sm" title="${isAr ? 'ساعدني في العثور على المعرف' : 'Help me find my ID'}">
                                <i class="fa-solid fa-magnifying-glass-chart"></i>
                             </button>
                         </div>
                         <div class="grid grid-cols-2 gap-3">
                            <button onclick="Settings.saveTelegram()" class="btn btn-primary rounded-xl h-11 text-[11px] font-black">
                                <i class="fa-solid fa-cloud-bolt"></i> ${isAr ? 'تحديث وربط' : 'Update & Link'}
                            </button>
                            <button onclick="Settings.testTelegram()" class="btn btn-outline rounded-xl h-11 border-dashed text-[11px] font-black">
                                <i class="fa-solid fa-paper-plane text-indigo-500"></i> ${isAr ? 'اختبار الإشارة' : 'Test Signal'}
                            </button>
                         </div>
                         <p class="text-[9px] text-slate-400 font-bold text-center italic">${isAr ? 'تأكد من تشغيل البوت وإرسال رسالة /start له قبل الاختبار' : 'Ensure bot is active and you sent /start before testing'}</p>
                    </div>
                </div>

                <!-- Telegram Automation Card -->
                <div class="glass-card">
                    <div class="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                        <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <i class="fa-solid fa-clock-rotate-left"></i>
                        </div>
                        <h3 class="text-lg font-black text-slate-800">${isAr ? 'جدولة التقارير التلقائية' : 'Scheduled Auto Reports'}</h3>
                    </div>
                    
                    <div class="space-y-6">
                        <div class="grid grid-cols-1 gap-4">
                            <div class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div>
                                    <h4 class="text-xs font-black text-slate-700">${isAr ? 'إجمالي المبيعات اليومية' : 'Daily Sales Summary'}</h4>
                                    <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Daily Sales Summary</p>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" id="auto-sales" class="sr-only peer" ${STATE.db.automation?.reports?.includes('sales') ? 'checked' : ''}>
                                    <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                                </label>
                            </div>

                            <div class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div>
                                    <h4 class="text-xs font-black text-slate-700">${isAr ? 'تنبيهات الأصناف المنخفضة' : 'Low Stock Alerts'}</h4>
                                    <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Low Stock Alerts</p>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" id="auto-stock" class="sr-only peer" ${STATE.db.automation?.reports?.includes('stock') ? 'checked' : ''}>
                                    <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                                </label>
                            </div>

                            <div class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div>
                                    <h4 class="text-xs font-black text-slate-700">${isAr ? 'ملخص الربح والخسارة' : 'P&L Quick Report'}</h4>
                                    <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest">P&L Quick Report</p>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" id="auto-finance" class="sr-only peer" ${STATE.db.automation?.reports?.includes('finance') ? 'checked' : ''}>
                                    <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                                </label>
                            </div>
                        </div>

                        <div class="bg-amber-50/50 p-6 rounded-3xl border border-amber-100 shadow-sm">
                            <label class="block text-[10px] font-black text-amber-600 mb-3 uppercase tracking-widest">${isAr ? 'وقت الإرسال اليومي (Hour)' : 'Daily Sending Time (Hour)'}</label>
                            <div class="flex items-center gap-4">
                                <input type="number" id="auto-hour" min="0" max="23" class="input-premium text-center font-black text-xl w-32" value="${STATE.db.automation?.hour || '22'}" placeholder="22">
                                <span class="text-xs font-bold text-amber-400 italic">24h format (e.g. 22 = 10 PM)</span>
                            </div>
                        </div>

                        <button onclick="Settings.saveAutomation()" class="w-full btn btn-primary bg-amber-600 hover:bg-slate-900 border-none h-14 rounded-2xl shadow-xl shadow-amber-100 text-[11px] font-black uppercase tracking-widest">
                            <i class="fa-solid fa-save mr-2"></i> ${isAr ? 'حفظ إعدادات الجدولة' : 'Save Schedule Settings'}
                        </button>
                    </div>
                </div>

                <!-- Locations Management -->
                <div class="glass-card lg:col-span-2">
                    <div class="flex justify-between items-center mb-6 border-b border-slate-50 pb-4">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                <i class="fa-solid fa-location-dot"></i>
                            </div>
                            <h3 class="text-lg font-black text-slate-800">${isAr ? 'إدارة المواقع والفروع (Locations)' : 'Locations & Branches Management'}</h3>
                        </div>
                        <button onclick="Settings.showLocationModal()" class="btn btn-primary px-8 rounded-xl h-11 text-[11px] font-black uppercase tracking-widest">
                            <i class="fa-solid fa-plus-circle"></i> ${isAr ? 'إضافة موقع جديد' : 'Add New Location'}
                        </button>
                    </div>
                    <div class="table-container bg-white">
                        <table class="w-full ${isAr ? 'text-right' : 'text-left'}">
                             <thead>
                                <tr>
                                    <th>${__('item_code')}</th>
                                    <th>${isAr ? 'اسم الفرع / المخزن' : 'Branch / Store Name'}</th>
                                    <th>${isAr ? 'نوع الموقع' : 'Location Type'}</th>
                                    <th>${__('notes')}</th>
                                    <th class="text-center">${isAr ? 'إجراءات' : 'Actions'}</th>
                                </tr>
                            </thead>
                            <tbody id="locations-tbody" class="divide-y divide-slate-50 text-[11px]">
                                ${this.renderLocationRows()}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- User Management Section -->
                <div class="glass-card lg:col-span-2">
                    <div class="flex justify-between items-center mb-6 border-b border-slate-50 pb-4">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <i class="fa-solid fa-user-shield"></i>
                            </div>
                            <h3 class="text-lg font-black text-slate-800">${isAr ? 'إدارة حسابات الدخول والصلاحيات' : 'User Accounts & Access Management'}</h3>
                        </div>
                        <button onclick="Settings.showUserModal()" class="btn btn-outline border-blue-100 text-blue-600 px-8 rounded-xl h-11 text-[11px] font-black uppercase tracking-widest">
                            ${isAr ? 'إضافة مستخدم' : 'Add User'}
                        </button>
                    </div>

                    <div class="table-container bg-white">
                        <table class="w-full ${isAr ? 'text-right' : 'text-left'}">
                             <thead>
                                <tr>
                                    <th>${isAr ? 'الاسم' : 'Name'}</th>
                                    <th>${isAr ? 'اسم المستخدم' : 'Username'}</th>
                                    <th>${isAr ? 'الدور' : 'Role'}</th>
                                    <th class="text-center">${isAr ? 'الحالة' : 'Status'}</th>
                                    <th class="text-center">${isAr ? 'الإجراءات' : 'Actions'}</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-50 text-[11px]">
                                ${this.renderUserRows()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    renderLocationRows() {
        const locations = STATE.db.Locations || [];
        const isAr = STATE.lang === 'ar';
        if(!locations.length) return `<tr><td colspan="5" class="text-center py-10 text-slate-400 font-bold italic">${isAr ? 'لا توجد مواقع مسجلة' : 'No registered locations'}</td></tr>`;
        
        return locations.map(l => `
            <tr>
                <td class="p-4 font-mono text-[10px] text-slate-400 font-bold">${l[0]}</td>
                <td class="p-4 font-black text-slate-700">${l[1]}</td>
                <td class="p-4"><span class="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase">${l[2]}</span></td>
                <td class="p-4 text-xs text-slate-500">${l[3] || '-'}</td>
                <td class="p-4 text-center">
                    <button class="text-slate-200 hover:text-rose-500 transition-colors"><i class="fa-solid fa-trash-can shadow-sm"></i></button>
                </td>
            </tr>
        `).join('');
    },

    renderUserRows() {
        const users = STATE.db.USERS || [];
        const isAr = STATE.lang === 'ar';
        if(!users.length) return `<tr><td colspan="5" class="text-center py-10 font-bold italic">${isAr ? 'لا توجد حسابات مسجلة' : 'No registered accounts'}</td></tr>`;
        
        return users.map(u => `
            <tr class="hover:bg-slate-50/50 transition-colors">
                <td class="p-4 font-black text-slate-800">${u[1]}</td>
                <td class="p-4 font-mono text-[10px] text-slate-400 font-bold">${u[2]}</td>
                <td class="p-4"><span class="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[9px] font-black uppercase">${u[4]}</span></td>
                <td class="p-4 text-center"><i class="fa-solid fa-circle-check text-emerald-500"></i></td>
                <td class="p-4 text-center">
                    <button class="text-slate-200 hover:text-rose-500 transition-colors"><i class="fa-solid fa-trash-can"></i></button>
                </td>
            </tr>
        `).join('');
    },

    showLocationModal() {
        const isAr = STATE.lang === 'ar';
        const body = `
            <div class="space-y-6 ${isAr ? 'text-right' : 'text-left'}" dir="${isAr ? 'rtl' : 'ltr'}">
                <div class="text-center mb-8">
                    <div class="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center text-2xl mx-auto mb-4">
                        <i class="fa-solid fa-map-location-dot"></i>
                    </div>
                    <h3 class="text-2xl font-black text-slate-800 tracking-tight">${isAr ? 'إضافة موقع / فرع جديد' : 'Add New Location/Branch'}</h3>
                </div>
                <div class="space-y-4">
                    <div>
                        <label class="nav-label p-0 mb-1 text-[10px]">${isAr ? 'اسم الموقع' : 'Location Name'}</label>
                        <input type="text" id="loc-name" class="input-premium" placeholder="${isAr ? 'مثلاً: مخزن أكتوبر' : 'e.g. October Store'}">
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="nav-label p-0 mb-1 text-[10px]">${isAr ? 'نوع الموقع' : 'Location Type'}</label>
                            <select id="loc-type" class="input-premium">
                                <option value="Store">${isAr ? 'مخزن' : 'Store'}</option>
                                <option value="Production">${isAr ? 'إنتاج/مطبخ' : 'Production'}</option>
                                <option value="Sales">${isAr ? 'نقطة بيع' : 'Sales'}</option>
                                <option value="Office">${isAr ? 'مكتب إداري' : 'Office'}</option>
                            </select>
                        </div>
                        <div>
                            <label class="nav-label p-0 mb-1 text-[10px]">${isAr ? 'الوصف المختصر' : 'Short Description'}</label>
                            <input type="text" id="loc-desc" class="input-premium" placeholder="...">
                        </div>
                    </div>
                </div>
                <button onclick="Settings.saveLocation()" class="w-full btn btn-primary h-14 rounded-2xl text-xs font-black uppercase tracking-[0.2em] mt-6 shadow-xl shadow-indigo-100">${isAr ? 'حفظ الموقع' : 'Save Location'}</button>
            </div>
        `;
        Utils.openModal(body);
    },

    async saveLocation() {
        const name = $('#loc-name').val();
        const type = $('#loc-type').val();
        const desc = $('#loc-desc').val();
        const isAr = STATE.lang === 'ar';
        if(!name) return Swal.fire(__('warning'), isAr ? 'يرجى إدخال اسم الموقع' : 'Please enter location name', 'warning');

        Utils.loading(true, __('processing'));
        try {
            await API.call('SAVE_LOCATION', { name, type, desc });
            await App.syncData();
            Utils.closeModal();
            this.render();
            Utils.loading(false);
            Utils.toast(__('success'));
        } catch(e) { Swal.fire(__('error'), e.toString(), 'error'); }
    },

    async runSetup() {
        const isAr = STATE.lang === 'ar';
        const confirm = await Swal.fire({
            title: isAr ? 'هل أنت متأكد؟' : 'Are you sure?',
            text: isAr ? "سيتم تحديث هيكل الجداول في Google Sheets، لن تفقد بياناتك ولكن سيتم تغيير الهيدر." : "This will update Google Sheets headers. No data will be lost.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: isAr ? 'نعم، ابدأ' : 'Yes, Start',
            cancelButtonText: isAr ? 'إلغاء' : 'Cancel'
        });

        if (confirm.isConfirmed) {
            Utils.loading(true, isAr ? 'جاري بناء قاعدة البيانات...' : 'Building Database...');
            try {
                const res = await API.call('SETUP_SYSTEM');
                Utils.loading(false);
                Swal.fire(isAr ? 'تمت التهيئة' : 'Initialized', res.message, 'success');
                App.syncData();
            } catch(e) { Utils.loading(false); Swal.fire(__('error'), e.toString(), 'error'); }
        }
    },

    showUserModal() {
        const isAr = STATE.lang === 'ar';
        const body = `
            <div class="space-y-6 ${isAr ? 'text-right' : 'text-left'}" dir="${isAr ? 'rtl' : 'ltr'}">
                <div class="text-center mb-8">
                    <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center text-2xl mx-auto mb-4">
                        <i class="fa-solid fa-user-plus"></i>
                    </div>
                    <h3 class="text-2xl font-black text-slate-800 tracking-tight">${isAr ? 'إنشاء حساب مستخدم' : 'Create User Account'}</h3>
                </div>
                <div class="space-y-4">
                    <input type="text" id="usr-name" class="input-premium text-[11px]" placeholder="${isAr ? 'الاسم بالكامل' : 'Full Name'}">
                    <div class="grid grid-cols-2 gap-4">
                        <input type="text" id="usr-user" class="input-premium text-[11px]" placeholder="${isAr ? 'اسم المستخدم' : 'Username'}">
                        <input type="password" id="usr-pass" class="input-premium text-[11px]" placeholder="${isAr ? 'كلمة المرور' : 'Password'}">
                    </div>
                    <select id="usr-role" class="input-premium text-[11px]">
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="POS">POS/User</option>
                    </select>
                </div>
                <button onclick="Settings.saveUser()" class="w-full btn btn-primary h-14 rounded-2xl text-xs font-black uppercase tracking-[0.2em] mt-6">${isAr ? 'حفظ بيانات المستخدم' : 'Save User Data'}</button>
            </div>
        `;
        Utils.openModal(body);
    },

    async saveUser() {
        const data = {
            name: $('#usr-name').val(),
            user: $('#usr-user').val(),
            pass: $('#usr-pass').val(),
            role: $('#usr-role').val()
        };
        if(!data.user || !data.pass) return Swal.fire(__('warning'), __('warning'), 'warning');

        Utils.loading(true, __('processing'));
        try {
            await API.call('MANAGE_USER', data);
            Utils.closeModal();
            this.render();
            Utils.toast(__('success'));
        } catch(e) { Swal.fire(__('error'), e.toString(), 'error'); }
        finally { Utils.loading(false); }
    },

    async saveTelegram() {
        const token = $('#tg-token').val();
        const chatId = $('#tg-chat').val();
        const enabled = $('#tg-enabled').is(':checked');
        
        if(!token || !chatId) return Swal.fire(__('warning'), 'Token/ChatID required', 'warning');

        Utils.loading(true, __('processing'));
        try {
            await API.call('SAVE_TELEGRAM_CONFIG', { token, chatId, enabled });
            this.render();
            Utils.toast(__('success'));
        } catch(e) { Swal.fire(__('error'), e.toString(), 'error'); }
        finally { Utils.loading(false); }
    },

    async testTelegram() {
        const isAr = STATE.lang === 'ar';
        Utils.loading(true, isAr ? 'جاري إرسال إشارة تجريبية...' : 'Sending test signal...');
        try {
            const res = await API.call('TEST_TELEGRAM');
            Utils.loading(false);
            if(res.status === 'success') {
                Swal.fire(isAr ? 'تم بنجاح' : 'Success', isAr ? 'وصلت الإشارة؟ تفحص التليجرام الخاص بك الآن.' : 'Signal sent. Check Telegram.', 'success');
            } else {
                Swal.fire(__('warning'), res.message || 'Error', 'warning');
            }
        } catch(e) { 
            Utils.loading(false);
            Swal.fire(__('error'), e.toString(), 'error'); 
        }
    },

    async saveAutomation() {
        const reports = [];
        if($('#auto-sales').is(':checked')) reports.push('sales');
        if($('#auto-stock').is(':checked')) reports.push('stock');
        if($('#auto-finance').is(':checked')) reports.push('finance');

        const hour = parseInt($('#auto-hour').val());
        if(isNaN(hour) || hour < 0 || hour > 23) return Swal.fire(__('warning'), 'Invalid Hour (0-23)', 'warning');

        Utils.loading(true, __('processing'));
        try {
            await API.call('SAVE_AUTOMATION', { reports, hour });
            this.render();
            Utils.toast(__('success'));
        } catch(e) { Swal.fire(__('error'), e.toString(), 'error'); }
        finally { Utils.loading(false); }
    },

    async discoverChatId() {
        const isAr = STATE.lang === 'ar';
        Utils.loading(true, isAr ? 'جاري البحث عن رسائل جديدة...' : 'Scanning for updates...');
        try {
            const res = await API.call('GET_TG_UPDATES');
            Utils.loading(false);
            if(res.status === 'success') {
                Swal.fire({
                    title: isAr ? 'تم العثور على المعرف!' : 'ID Discovered!',
                    html: `${isAr ? 'أهلاً' : 'Hello'} <b>${res.name}</b>, ${isAr ? 'معرفك هو' : 'your ID is'}: <br><br> <span class="text-2xl font-black text-indigo-600">${res.chatId}</span>`,
                    icon: 'success',
                    showCancelButton: true,
                    confirmButtonText: isAr ? 'استخدام هذا المعرف' : 'Use this ID'
                }).then((result) => {
                    if (result.isConfirmed) {
                        $('#tg-chat').val(res.chatId);
                        Utils.toast(isAr ? 'تم وضع المعرف في الخانة' : 'ID Inserted');
                    }
                });
            } else {
                Swal.fire(__('warning'), isAr ? 'لم نجدك! تأكد من إرسال رسالة /start للبوت' : 'Not found! Send /start to bot first.', 'warning');
            }
        } catch(e) {
            Utils.loading(false);
            Swal.fire(__('error'), e.toString(), 'error');
        }
    }
};
