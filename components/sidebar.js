/**
 * SIDEBAR COMPONENT (PREMIUM SLIM)
 */
const Sidebar = {
    render() {
        const isAr = STATE.lang === 'ar';
        const menuConfig = [
            { label: __('setup'), items: [
                { id: 'users', icon: 'fa-user-lock', label: __('users') },
                { id: 'settings', icon: 'fa-gears', label: __('settings') },
                { id: 'suppliers', icon: 'fa-truck-fast', label: __('suppliers') }
            ]},
            { label: __('inventory_production'), items: [
                { id: 'inv', icon: 'fa-boxes-stacked', label: __('inv') },
                { id: 'recipes', icon: 'fa-utensils', label: __('recipes') },
                { id: 'trx', icon: 'fa-right-left', label: __('trx') },
                { id: 'audit', icon: 'fa-clipboard-check', label: __('audit') },
                { id: 'recon', icon: 'fa-scale-balanced', label: __('recon') }
            ]},
            { label: __('sales_ops'), items: [
                { id: 'pos', icon: 'fa-cash-register', label: __('pos') },
                { id: 'kds', icon: 'fa-fire-burner', label: __('kds') },
                { id: 'reports_hub', icon: 'fa-chart-pie', label: __('reports_hub') },
                { id: 'sales_log', icon: 'fa-clock-rotate-left', label: __('sales_log') },
                { id: 'finance', icon: 'fa-file-invoice-dollar', label: __('finance') }
            ]},
            { label: __('hr_payroll'), items: [
                { id: 'hr', icon: 'fa-users-gear', label: __('hr') }
            ]},
            { label: isAr ? 'الذكاء والبيانات' : 'AI & Data Mining', items: [
                { id: 'dsr', label: isAr ? 'إدخالات DSR اليدوية' : 'Manual DSR Entries', icon: 'fa-keyboard', perm: 'sales_log' },
                { id: 'dsr_auto', label: isAr ? 'تقرير DSR التلقائي' : 'Auto DSR Report', icon: 'fa-wand-magic-sparkles', perm: 'reports' },
                { id: 'intelligence', icon: 'fa-brain', label: isAr ? 'استخبارات الأعمال' : 'Business Intelligence', perm: 'reports' }
            ]},
            { label: __('dashboard'), items: [
                { id: 'dash', icon: 'fa-chart-line', label: __('dash') }
            ]}
        ];

        let html = `
            <div class="logo-section">
                <div class="logo-icon" style="background: transparent; box-shadow: none; padding: 2px;">
                    <img src="assets/icon-192x192.png" alt="Logo" class="w-full h-full object-contain drop-shadow-sm rounded-lg" />
                </div>
                <div class="logo-text">EZEM <span class="text-indigo-600">PRO</span></div>
            </div>
            <div class="flex-1 overflow-y-auto py-2 custom-scrollbar">
        `;

        menuConfig.forEach(group => {
            html += `<div class="nav-label">${group.label}</div>`;
            group.items.forEach(item => {
                // Check permissions
                if (!Auth.canView(item.id)) return;

                // The provided snippet seems to be routing logic, which typically belongs in a Router.navigate function.
                // Since the instruction is to add it to the sidebar and router, and the sidebar already calls Router.navigate,
                // this implies the Router.navigate function itself needs to be updated to handle 'dsr_auto'.
                // As this file is only the Sidebar component, I will assume the Router.navigate function exists elsewhere
                // and will need to be updated with the logic:
                // case 'dsr': DSR.render(); break;
                // case 'dsr_auto': ReportsHub.openReport('dsr_report'); break;
                // case 'intelligence': Intelligence.render(); break;

                const active = STATE.activeView === item.id ? 'active' : '';
                const alertCount = (item.id === 'inv' && STATE.db?.lowStock?.length > 0) ? STATE.db.lowStock.length : 0;
                
                html += `
                    <div onclick="Router.navigate('${item.id}')" 
                         class="nav-item ${active}" 
                         data-label="${item.label}">
                        <i class="fa-solid ${item.icon}"></i>
                        <span class="nav-text">${item.label}</span>
                        ${alertCount > 0 ? `
                            <span class="absolute ${STATE.lang === 'ar' ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 w-4 h-4 bg-amber-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border border-white">
                                ${alertCount}
                            </span>
                        ` : ''}
                    </div>
                `;
            });
        });

        html += `
            </div>
            <!-- User Profile Card -->
            <div class="sidebar-user">
                <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    ${STATE.user?.name?.charAt(0) || 'A'}
                </div>
                <div class="sidebar-user-info">
                    <div class="text-slate-800 text-[10px] font-black truncate">${STATE.user?.name || 'Admin'}</div>
                    <div class="text-[8px] text-emerald-500 font-bold flex items-center gap-1 uppercase tracking-tight">
                        <span class="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span> ${__('online')}
                    </div>
                </div>
            </div>
        `;

        const container = document.getElementById('sidebar-container');
        if (container) container.innerHTML = html;
    }
};
