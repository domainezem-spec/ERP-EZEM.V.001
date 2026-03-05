/**
 * 🧠 INTELLIGENCE & DATA MINING HUB
 * Advanced Predictive Analytics for EZEM ERP
 */
const Intelligence = {
    async render() {
        const isAr = STATE.lang === 'ar';
        document.getElementById('main-content').innerHTML = `
            <div class="space-y-6 animate-fade-in pb-20 ${isAr ? 'text-right' : 'text-left'}" dir="${isAr ? 'rtl' : 'ltr'}">
                <!-- Premium Header -->
                <div class="relative overflow-hidden bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl">
                    <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div class="relative z-10 flex flex-wrap items-center justify-between gap-6">
                        <div class="flex items-center gap-5">
                            <div class="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl shadow-2xl border border-white/10">
                                <i class="fa-solid fa-brain text-indigo-400"></i>
                            </div>
                            <div>
                                <h2 class="text-3xl font-black tracking-tight mb-1">${isAr ? 'مركز استخبارات البيانات' : 'AI Intelligence Hub'}</h2>
                                <p class="text-[10px] text-indigo-300 font-bold uppercase tracking-[0.3em]">Predictive Mining & Risk Assessment</p>
                            </div>
                        </div>
                        <div class="flex gap-3">
                            <button onclick="Intelligence.showDSRModal()" class="h-12 px-6 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl font-black text-xs transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20">
                                <i class="fa-solid fa-cloud-upload"></i> ${isAr ? 'إضافة بيانات سابقة (DSR)' : 'Import Historical DSR'}
                            </button>
                            <button onclick="Intelligence.refresh()" class="h-12 px-6 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl font-black text-xs transition-all flex items-center gap-2 border border-white/10">
                                <i class="fa-solid fa-sync-alt"></i> ${isAr ? 'تحديث البيانات' : 'Sync Intelligence'}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Intelligence Grid -->
                <div id="intel-grid" class="grid grid-cols-1 lg:grid-cols-3 gap-6 opacity-50">
                    <!-- Skeletons -->
                    ${[1,2,3].map(() => `<div class="h-64 bg-white rounded-[2rem] animate-pulse"></div>`).join('')}
                </div>
            </div>
        `;

        this.refresh();
    },

    async showDSRModal() {
        const isAr = STATE.lang === 'ar';
        const { value: formValues } = await Swal.fire({
            title: isAr ? 'إضافة مبيعات تاريخية (DSR)' : 'Add Historical Daily Sales',
            html: `
                <div class="flex flex-col gap-4 p-4 ${isAr ? 'text-right' : 'text-left'}">
                    <div class="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 mb-2">
                        <p class="text-[10px] text-indigo-700 font-bold leading-relaxed">
                            ${isAr ? 'أدخل البيانات بناءً على تقرير DSR الخاص بك لضمان دقة تحليل الذكاء الاصطناعي.' : 'Entry data based on your DSR report for AI accuracy.'}
                        </p>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1 col-span-2">
                            <label class="text-[9px] font-black text-slate-400 uppercase">${isAr ? 'التاريخ' : 'Date'}</label>
                            <input type="date" id="dsr-date" class="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 font-black outline-none focus:border-indigo-500">
                        </div>
                        <div class="space-y-1">
                            <label class="text-[9px] font-black text-slate-400 uppercase">${isAr ? 'مبيعات الصالة / تيك أواي' : 'Direct/To-Go Sales'}</label>
                            <input type="number" id="dsr-direct" placeholder="0.00" class="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 font-black">
                        </div>
                        <div class="space-y-1">
                            <label class="text-[9px] font-black text-slate-400 uppercase">${isAr ? 'مبيعات الأونلاين (توصيل)' : 'Delivery Sales'}</label>
                            <input type="number" id="dsr-delivery" placeholder="0.00" class="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 font-black">
                        </div>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: isAr ? 'حفظ التقرير' : 'Save Report',
            cancelButtonText: isAr ? 'إلغاء' : 'Cancel',
            customClass: {
                popup: 'rounded-[2.5rem]',
                confirmButton: 'btn-premium bg-indigo-600 text-white rounded-2xl px-10 py-3 font-black',
                cancelButton: 'btn-premium bg-slate-100 text-slate-500 rounded-2xl px-10 py-3 font-black'
            },
            preConfirm: () => {
                const date = document.getElementById('dsr-date').value;
                const direct = document.getElementById('dsr-direct').value;
                const delivery = document.getElementById('dsr-delivery').value;
                if (!date || (!direct && !delivery)) {
                    Swal.showValidationMessage(isAr ? 'يرجى إدخال التاريخ والمبالغ' : 'Please enter date and amounts');
                    return false;
                }
                return { 
                    date, 
                    directAmount: parseFloat(direct || 0), 
                    deliveryAmount: parseFloat(delivery || 0) 
                };
            }
        });

        if (formValues) {
            Utils.loading(true, isAr ? 'جاري الحفظ...' : 'Saving...');
            try {
                await API.call('ADD_HISTORICAL_DSR', formValues);
                Utils.loading(false);
                Utils.toast(isAr ? 'تمت الإضافة بنجاح' : 'History added successfully');
                this.refresh();
            } catch (e) {
                Utils.loading(false);
                Swal.fire('Error', e.toString(), 'error');
            }
        }
    },

    async refresh() {
        const isAr = STATE.lang === 'ar';
        try {
            Utils.loading(true, isAr ? 'جاري تحليل الأنماط...' : 'Analyzing Patterns...');
            const res = await API.call('GET_PREDICTIVE_DATA');
            Utils.loading(false);
            
            if (res.status === 'success') {
                this.renderDashboard(res.data);
            }
        } catch (e) {
            Utils.loading(false);
            Utils.toast(e.toString(), 'error');
        }
    },

    renderDashboard(data) {
        const isAr = STATE.lang === 'ar';
        const grid = document.getElementById('intel-grid');
        grid.classList.remove('opacity-50');
        
        grid.innerHTML = `
            <!-- 1. Sales Forecast Section -->
            <div class="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h3 class="text-xl font-black text-slate-800">${isAr ? 'توقعات المبيعات (90 يوم)' : 'Sales Forecast (90 Days)'}</h3>
                        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Holt-Winters Seasonal Model</p>
                    </div>
                    <div class="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black">
                        ${isAr ? 'دقة التوقعات' : 'Confidence Score'}: ${data.forecast.confidence}%
                    </div>
                </div>
                <div class="h-[300px] relative">
                    <canvas id="forecastChart"></canvas>
                </div>
            </div>

            <!-- 2. Inventory Risk Heatmap -->
            <div class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 class="text-xl font-black text-slate-800 mb-6">${isAr ? 'مخاطر المخزون' : 'Stock-out Risks'}</h3>
                <div class="space-y-3 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
                    ${data.inventoryRisk.map(r => `
                        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:border-indigo-400 transition-all">
                            <div class="flex justify-between items-start mb-2">
                                <span class="text-xs font-black text-slate-700">${r.item}</span>
                                <span class="px-2 py-0.5 rounded-lg text-[8px] font-black ${r.status === 'CRITICAL' ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-600'}">${r.status}</span>
                            </div>
                            <div class="flex items-end justify-between">
                                <div>
                                    <div class="text-[9px] text-slate-400 font-bold uppercase">${isAr ? 'المخزون الحالي' : 'Stock'}: ${r.stock}</div>
                                    <div class="text-[14px] font-black text-slate-900">${r.daysLeft} <span class="text-[10px] text-slate-400 font-medium">${isAr ? 'أيام متبقية' : 'Days left'}</span></div>
                                </div>
                                <div class="text-right">
                                    <div class="text-[8px] text-indigo-400 font-bold uppercase mb-1">${isAr ? 'الطلب المقترح' : 'Rec. Reorder'}</div>
                                    <div class="px-3 py-1 bg-white border border-indigo-100 rounded-lg text-[10px] font-black text-indigo-600 shadow-sm">${r.reorder || r.recommendation || 0}</div>
                                </div>
                            </div>
                        </div>
                    `).join('') || `<p class="text-slate-400 text-xs text-center p-10 font-bold">No High Risks Detected</p>`}
                </div>
            </div>

            <!-- 3. Variance Anomalies -->
            <div class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center"><i class="fa-solid fa-triangle-exclamation"></i></div>
                    <div>
                        <h3 class="text-lg font-black text-slate-800">${isAr ? 'شذوذ الاستهلاك' : 'Variance Anomalies'}</h3>
                        <p class="text-[9px] text-slate-400 font-bold uppercase">Dynamic Z-Score > 2.5</p>
                    </div>
                </div>
                <div class="space-y-3">
                    ${data.varianceAnomalies.map(a => `
                        <div class="flex items-center gap-4 p-4 bg-rose-50/30 border border-rose-100 rounded-2xl">
                            <div class="w-1 h-8 bg-rose-500 rounded-full"></div>
                            <div class="flex-1">
                                <div class="text-[11px] font-black text-slate-800">${a.item}</div>
                                <div class="text-[9px] font-bold text-slate-400">${a.date} | ${a.branch}</div>
                            </div>
                            <div class="text-right text-rose-600 font-black text-[12px]">-${a.cost} EGP</div>
                        </div>
                    `).join('') || `<div class="p-10 text-center text-slate-300 text-xs font-bold">No major anomalies detected.</div>`}
                </div>
            </div>

            <!-- 4. Branch Clustering -->
            <div class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 class="text-xl font-black text-slate-800 mb-6">${isAr ? 'تصنيف الفروع' : 'Branch Performance'}</h3>
                <div class="grid grid-cols-1 gap-4">
                    ${data.branchClusters.map(b => `
                        <div class="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                           <div class="flex items-center gap-4">
                                <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm">
                                    <i class="fa-solid fa-store text-${b.color}-500"></i>
                                </div>
                                <div>
                                    <div class="text-[11px] font-black text-slate-800">${b.name}</div>
                                    <div class="px-2 py-0.5 bg-${b.color}-50 text-${b.color}-600 rounded-full text-[8px] font-black uppercase inline-block">${b.tier}</div>
                                </div>
                           </div>
                           <div class="text-right">
                                <div class="text-[12px] font-black text-slate-900">${Utils.formatCurrency(b.revenue)}</div>
                                <div class="text-[9px] text-slate-400 font-bold">${isAr ? 'معدل الهالك' : 'Waste'}: ${b.wasteRate}</div>
                           </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- 5. Top Performing Products (Stars) -->
            <div class="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                <div class="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl -mb-10 -mr-10"></div>
                <h3 class="text-xl font-black mb-6 relative z-10">${isAr ? 'النجوم: الأصناف الأكثر ربحية' : 'Star Products (Revenue)'}</h3>
                <div class="space-y-4 relative z-10">
                    ${data.topPerformers.map((p, idx) => `
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <span class="text-[10px] font-black text-indigo-400/50">${idx+1}</span>
                                <span class="text-[11px] font-bold">${p.name}</span>
                            </div>
                            <div class="text-xs font-black text-indigo-300">${Utils.formatCurrency(p.revenue)}</div>
                        </div>
                    `).join('')}
                </div>
                <div class="mt-8 pt-6 border-t border-white/10">
                    <button class="w-full py-4 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                        ${isAr ? 'عرض تحليل BCG الكامل' : 'Full Menu Analysis'}
                    </button>
                </div>
            </div>
        `;

        this.initCharts(data.forecast);
    },

    initCharts(forecast) {
        const ctx = document.getElementById('forecastChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: forecast.labels,
                datasets: [{
                    label: 'Predicted Sales (EGP)',
                    data: forecast.values,
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                    pointBackgroundColor: '#6366f1',
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: '#f1f5f9' },
                        ticks: { font: { size: 10, weight: 'bold' }, color: '#94a3b8' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { font: { size: 9, weight: 'bold' }, color: '#94a3b8' }
                    }
                }
            }
        });
    }
};
