/**
 * CLIENT-SIDE ROUTER (v3.1)
 * Supporting all modules with Slim Design and Renamed Sections
 */
const Router = {
    dashboardMonth: new Date().toISOString().slice(0, 7),

    navigate(viewId) {
        console.log(`📍 Navigating to: ${viewId}`);
        
        // Permission Check BEFORE navigation
        if (!Auth.canView(viewId)) {
            Swal.fire(STATE.lang === 'ar' ? 'غير مصرح' : 'Unauthorized', STATE.lang === 'ar' ? 'ليس لديك صلاحية للدخول لهذا القسم' : 'You do not have permission to access this section', 'error');
            return;
        }

        STATE.activeView = viewId;
        Sidebar.render();
        
        const isAr = STATE.lang === 'ar';
        const titles = {
            'dash': isAr ? 'لوحة التحكم التنفيذية' : 'Executive Dashboard',
            'pos': isAr ? 'نقطة البيع (POS)' : 'POS Terminal',
            'inv': isAr ? 'المكونات الخام (BOH)' : 'Inventory Master',
            'menu': isAr ? 'أصناف البيع (Menu)' : 'Menu Items',
            'recipes': isAr ? 'تكاليف الوصفات' : 'Recipe Costing',
            'kds': isAr ? 'شاشة المطبخ (KDS)' : 'Kitchen Display',
            'trx': isAr ? 'حركات المخزن' : 'Movements',
            'audit': isAr ? 'جرد المخزون' : 'Physical Audit',
            'finance': isAr ? 'الحسابات (P&L)' : 'Finance & P&L',
            'hr': isAr ? 'الموارد البشرية' : 'Human Resources',
            'settings': isAr ? 'إعدادات النظام' : 'System Settings',
            'suppliers': isAr ? 'دليل الموردين' : 'Suppliers Directory',
            'users': isAr ? 'الصلاحيات والمستخدمين' : 'Users & Access',
            'sales_log': isAr ? 'سجل العمليات' : 'Operations Log',
            'reports_hub': isAr ? 'مركز التقارير المتقدمة' : 'Advanced Reports',
            'recon': isAr ? 'مطابقة وتحليل المخزون' : 'Stock Reconciliation',
            'intelligence': isAr ? 'استخبارات البيانات' : 'Data Intelligence'
        };
        
        const headerContainer = document.getElementById('header-container');
        if(headerContainer) headerContainer.innerHTML = Header.render(titles[viewId] || 'EZEM PRO');

        // Render Module
        try {
            console.log(`🚀 Rendering View: ${viewId}`);
            switch(viewId) {
                case 'dash': this.renderDashboard(); break;
                case 'pos': POS.render(); break;
                case 'inv': Inventory.render(); break;
                case 'recipes': Recipes.render(); break;
                case 'kds': KDS.render(); break;
                case 'finance': Finance.render(); break;
                case 'hr': HR.render(); break;
                case 'settings': Settings.render(); break;
                case 'suppliers': Suppliers.render(); break;
                case 'users': Users.render(); break;
                case 'trx': Movements.render(); break;
                case 'audit': Audit.render(); break;
                case 'recon': Reconciliation.render(); break;
                case 'sales_log': Reports.render('ops'); break;
                case 'reports_hub': ReportsHub.render(); break;
                case 'dsr': DSR.render(); break;
                case 'dsr_auto': ReportsHub.openReport('dsr_report'); break;
                case 'intelligence': Intelligence.render(); break;
            }
        } catch (e) {
            console.error(`❌ Module [${viewId}] Render Crash:`, e);
            Swal.fire(
                isAr ? 'خطأ في فتح القسم' : 'Section Load Error',
                (isAr ? 'فشل تحميل هذا القسم بسبب خطأ تقني: ' : 'Failed to load this section: ') + e.message,
                'error'
            );
        }
    },

    renderDashboard() {
        const isAr = STATE.lang === 'ar';
        const selectedMonth = this.dashboardMonth;
        const sales = STATE.db.Sales || [];
        const exp = STATE.db.Fin_Trx || [];
        const items = STATE.db.Items || [];

        const filteredSales = sales.filter(s => s[1].includes(selectedMonth));
        const filteredExp = exp.filter(e => e[0].includes(selectedMonth));

        const totalSales = filteredSales.reduce((sum, s) => sum + (parseFloat(s[2]) || 0), 0);
        const totalExp = filteredExp.filter(e => e[2] === 'Expense').reduce((sum, e) => sum + (parseFloat(e[5]) || 0), 0);
        const totalInvCost = (STATE.db.Movements || []).filter(m => m[0].includes(selectedMonth) && m[1] === 'Purchasing').reduce((sum, m) => sum + (parseFloat(m[12]) || 0), 0);
        const wasteCost = (STATE.db.Movements || []).filter(m => m[0].includes(selectedMonth) && m[1] === 'Waste').reduce((sum, m) => sum + (parseFloat(m[12]) || 0), 0);
        const wastePct = totalSales > 0 ? ((wasteCost / totalSales) * 100).toFixed(1) : 0;

        document.getElementById('main-content').innerHTML = `
            <div class="space-y-6 animate-fade-in ${isAr ? 'text-right' : 'text-left'}" dir="${isAr ? 'rtl' : 'ltr'}">
                <!-- SLIM WELCOME SECTION -->
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-xl shadow-inner">
                            <i class="fa-solid fa-gauge-high"></i>
                        </div>
                        <div>
                            <h1 class="text-xl font-black text-slate-800 tracking-tight mb-0.5">${__('dash')}</h1>
                            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">${isAr ? 'تحليل أداء شهر: ' : 'Performance Analysis for: '} ${selectedMonth}</p>
                        </div>
                    </div>
                    
                    <div class="flex gap-2 items-center">
                        <input type="month" value="${selectedMonth}" onchange="Router.dashboardMonth=this.value; Router.renderDashboard()" class="h-10 px-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black outline-none focus:bg-white transition-all">
                        <button onclick="Router.navigate('pos')" class="h-10 px-6 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-100 hover:bg-slate-900 transition-all flex items-center gap-2">
                            <i class="fa-solid fa-plus-circle"></i> ${isAr ? 'طلب جديد (POS)' : 'New Sale (POS)'}
                        </button>
                    </div>
                </div>

                <!-- KPI GRID -->
                ${Auth.canView('admin_stats') ? `
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    ${this.kpiCard(isAr ? 'إجمالي الإيرادات' : 'Total Revenue', Utils.formatCurrency(totalSales), 'fa-chart-line', 'indigo')}
                    ${this.kpiCard(isAr ? 'صافي الربح التقديري' : 'Estimated Net Profit', Utils.formatCurrency(totalSales - totalExp - wasteCost), 'fa-sack-dollar', 'emerald')}
                    ${this.kpiCard(isAr ? 'تكلفة الهالك (Waste)' : 'Waste Cost', `${Utils.formatCurrency(wasteCost)} (${wastePct}%)`, 'fa-trash-can', 'rose')}
                    ${this.kpiCard(isAr ? 'تكلفة المشتريات' : 'Purchasing Cost', Utils.formatCurrency(totalInvCost), 'fa-truck-ramp-box', 'blue')}
                </div>
                ` : `
                <div class="bg-indigo-50 border border-indigo-100 p-8 rounded-3xl text-center">
                    <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm mx-auto mb-4">
                        <i class="fa-solid fa-lock text-2xl"></i>
                    </div>
                    <h3 class="text-lg font-black text-slate-800 mb-2">${isAr ? 'الإحصائيات التحليلية غير متاحة' : 'Analytical Stats Locked'}</h3>
                    <p class="text-xs text-slate-500 font-bold">${isAr ? 'تحتاج إلى صلاحية "إحصائيات الإدارة" لرؤية البيانات المالية.' : 'You need "Admin Stats" permission to view financial data.'}</p>
                </div>
                `}

                <!-- ANALYTICS GRID -->
                ${Auth.canView('admin_stats') ? `
                <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div class="xl:col-span-2 space-y-6">
                        <div class="glass-card !p-0 overflow-hidden">
                            <div class="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                                <h3 class="text-[10px] font-black text-slate-700 uppercase tracking-widest ${isAr ? 'text-right' : 'text-left'} w-full">${isAr ? 'تطور المبيعات اليومي (Weekly Sales)' : 'Weekly Sales Trend'}</h3>
                            </div>
                            <div class="p-6 h-[250px]">
                                <canvas id="salesChart"></canvas>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div class="glass-card !p-0 overflow-hidden">
                                <div class="p-4 border-b border-slate-50">
                                    <h3 class="text-[10px] font-black text-slate-700 uppercase tracking-widest ${isAr ? 'text-right' : 'text-left'} w-full">${isAr ? 'توزيع المبيعات حسب النوع' : 'Sales by Order Type'}</h3>
                                </div>
                                <div class="p-6 h-[200px] flex items-center justify-center">
                                    <canvas id="typeChart"></canvas>
                                </div>
                             </div>
                             <div class="glass-container bg-white p-6 rounded-2xl border border-slate-100 h-full">
                                <h3 class="text-[10px] font-black text-slate-700 uppercase tracking-widest mb-4 ${isAr ? 'text-right' : 'text-left'} w-full">${isAr ? 'تنبيهات الاستخبارات' : 'System Intelligence'}</h3>
                                <div class="space-y-2">
                                    ${this.renderAlerts()}
                                </div>
                             </div>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <div class="glass-card">
                            <h3 class="text-[10px] font-black text-slate-700 uppercase tracking-widest mb-4 ${isAr ? 'text-right' : 'text-left'} w-full">${isAr ? 'آخر العمليات المالية' : 'Recent Transactions'}</h3>
                            <div class="space-y-3">
                                ${filteredSales.slice(-5).reverse().map(s => `
                                    <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100/50">
                                        <div class="flex items-center gap-3">
                                            <div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-xs text-indigo-500 shadow-sm"><i class="fa-solid fa-receipt"></i></div>
                                            <div>
                                                <div class="text-[10px] font-black text-slate-800">#${s[0].slice(-6)}</div>
                                                <div class="text-[8px] text-slate-400 font-bold">${s[1]}</div>
                                            </div>
                                        </div>
                                        <div class="${isAr ? 'text-right' : 'text-left'}">
                                            <div class="text-[10px] font-black text-slate-900">${Utils.formatCurrency(s[2])}</div>
                                            <div class="text-[8px] font-black text-emerald-500 bg-emerald-50 px-1.5 rounded uppercase">${isAr ? 'مدفوع' : 'Paid'}</div>
                                        </div>
                                    </div>
                                `).join('')}
                                ${filteredSales.length === 0 ? `<div class="text-center py-10 text-slate-300 italic text-[10px]">${isAr ? 'لا توجد مبيعات في هذا الشهر' : 'No sales this month'}</div>` : ''}
                            </div>
                            <button onclick="Router.navigate('sales_log')" class="w-full mt-4 py-2 text-[9px] font-black text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">${isAr ? 'عرض السجلات الكاملة' : 'View All Logs'}</button>
                        </div>
                    </div>
                </div>
                ` : `
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="glass-container bg-white p-6 rounded-2xl border border-slate-100 min-h-[300px]">
                        <h3 class="text-[10px] font-black text-slate-700 uppercase tracking-widest mb-4 ${isAr ? 'text-right' : 'text-left'} w-full">${isAr ? 'نظام تنبيهات EZEM' : 'EZEM Alert System'}</h3>
                        <div class="space-y-2">
                            ${this.renderAlerts()}
                        </div>
                    </div>
                    <div class="bg-slate-900 text-white p-8 rounded-3xl flex flex-col justify-center items-center text-center">
                        <div class="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6">
                            <i class="fa-solid fa-user-shield text-3xl"></i>
                        </div>
                        <h3 class="text-xl font-black mb-2">${isAr ? 'تراخيص الوصول' : 'Access Permissions'}</h3>
                        <p class="text-xs text-slate-400 leading-relaxed">${isAr ? 'هذه اللوحة مخصصة للإدارة فقط. يمكنك الانتقال إلى الأقسام المصرح لك بها من خلال القائمة الجانبية.' : 'This dashboard is for administration. Use the sidebar to navigate to authorized sections.'}</p>
                    </div>
                </div>
                `}
            </div>
        `;

        
        setTimeout(() => this.initCharts(), 100);
    },

    kpiCard(label, val, icon, color) {
        const theme = {
            indigo: 'text-indigo-600 bg-indigo-50 ring-indigo-100',
            rose: 'text-rose-600 bg-rose-50 ring-rose-100',
            emerald: 'text-emerald-600 bg-emerald-50 ring-emerald-100',
            blue: 'text-blue-600 bg-blue-50 ring-blue-100'
        }[color];

        const isAr = STATE.lang === 'ar';
        return `
            <div class="glass-card !mb-0 group hover:border-indigo-100 transition-all cursor-default relative overflow-hidden ring-1 ring-slate-100">
                <div class="flex justify-between items-start mb-3 relative z-10">
                    <div class="w-10 h-10 rounded-2xl ${theme} flex items-center justify-center text-lg shadow-sm ring-4 ring-white">
                        <i class="fa-solid ${icon}"></i>
                    </div>
                </div>
                <div class="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] mb-1 relative z-10">${label}</div>
                <div class="text-2xl font-black text-slate-900 tracking-tight relative z-10">${val}</div>
                <i class="fa-solid ${icon} absolute ${isAr ? '-left-3' : '-right-3'} -bottom-3 text-6xl opacity-[0.03] group-hover:opacity-[0.08] transition-all rotate-12"></i>
            </div>
        `;
    },

    renderAlerts() {
        const alerts = [];
        const lowStock = STATE.db.lowStock || [];
        const activeShift = STATE.db.activeShift;
        const isAr = STATE.lang === 'ar';

        if(!activeShift) alerts.push({ text: isAr ? 'لا توجد وردية مفتوحة حالياً.' : 'Terminal currently locked.', type: 'danger', icon: 'fa-lock' });
        if(lowStock.length > 0) alerts.push({ text: isAr ? `${lowStock.length} أصناف أوشكت على النفاذ.` : `${lowStock.length} items low on stock.`, type: 'warning', icon: 'fa-triangle-exclamation' });
        
        if(!alerts.length) return `<div class="text-center py-10 text-slate-300 italic text-[10px]">${isAr ? 'كل النظم تعمل بكفاءة' : 'All systems operational'}</div>`;

        return alerts.map(a => `
            <div class="flex gap-3 p-3 rounded-xl bg-white border border-slate-50 items-center shadow-sm hover:border-indigo-100 transition-all">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${a.type === 'danger' ? 'bg-rose-50 text-rose-500' : a.type === 'warning' ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-500'}">
                    <i class="fa-solid ${a.icon || 'fa-bell'} text-[10px]"></i>
                </div>
                <div class="text-[10px] font-black text-slate-800">${a.text}</div>
            </div>
        `).join('');
    },

    initCharts() {
        const sCtx = document.getElementById('salesChart')?.getContext('2d');
        const tCtx = document.getElementById('typeChart')?.getContext('2d');
        if(!sCtx) return;

        const sales = STATE.db.Sales || [];
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date(); d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        const dailyTotals = last7Days.map(date => {
            return sales.filter(s => s[1].includes(date)).reduce((sum, s) => sum + (parseFloat(s[2]) || 0), 0);
        });

        new Chart(sCtx, {
            type: 'line',
            data: {
                labels: last7Days,
                datasets: [{
                    label: 'Daily Revenue',
                    data: dailyTotals,
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79, 70, 229, 0.05)',
                    borderWidth: 3, fill: true, tension: 0.4,
                    pointRadius: 4, pointBackgroundColor: '#fff', pointBorderColor: '#4f46e5'
                }]
            },
            options: { 
                responsive: true, maintainAspectRatio: false, 
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { font: { size: 9, weight: 'bold' } } },
                    x: { grid: { display: false }, ticks: { font: { size: 9, weight: 'bold' } } }
                }
            }
        });

        if(tCtx) {
            const types = { 'Walk-in': 0, 'Drive-thru': 0, 'Delivery': 0 };
            sales.forEach(s => { if(types.hasOwnProperty(s[9])) types[s[9]]++; });

            new Chart(tCtx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(types),
                    datasets: [{
                        data: Object.values(types),
                        backgroundColor: ['#6366f1', '#f59e0b', '#10b981'],
                        borderWidth: 0, hoverOffset: 10
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    cutout: '75%',
                    plugins: { legend: { position: 'bottom', labels: { boxWidth: 8, font: { size: 9, weight: 'bold' } } } }
                }
            });
        }
    }
};
