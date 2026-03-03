/**
 * KDS MODULE (Kitchen Display v3.0)
 * 5-Column Display matching NEW.25-1.html
 */
const KDS = {
    render() {
        const isAr = STATE.lang === 'ar';
        const isEn = STATE.lang === 'en';

        document.getElementById('main-content').innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 h-[calc(100vh-140px)] animate-fade-in ${isAr ? 'text-right' : 'text-left'}" dir="${isAr ? 'rtl' : 'ltr'}">
                <!-- Under Preparation -->
                <div class="kds-column border-cyan-100 border">
                    <div class="kds-header bg-cyan-50 text-cyan-800">
                        <span>${__('under_preparation')}</span>
                        <span id="count-prep" class="bg-cyan-200 px-2 py-0.5 rounded-md text-[10px]">0</span>
                    </div>
                    <div id="kds-preparing" class="kds-body"></div>
                </div>

                <!-- Pending Orders -->
                <div class="kds-column border-blue-100 border">
                    <div class="kds-header bg-blue-50 text-blue-800">
                        <span>${__('pending')}</span>
                        <span id="count-pending" class="bg-blue-200 px-2 py-0.5 rounded-md text-[10px]">0</span>
                    </div>
                    <div id="kds-pending" class="kds-body"></div>
                </div>

                <!-- Ready for Pickup -->
                <div class="kds-column border-emerald-100 border">
                    <div class="kds-header bg-emerald-50 text-emerald-800">
                        <span>${__('ready')}</span>
                        <span id="count-ready" class="bg-emerald-200 px-2 py-0.5 rounded-md text-[10px]">0</span>
                    </div>
                    <div id="kds-ready" class="kds-body"></div>
                </div>

                <!-- On The Way -->
                <div class="kds-column border-indigo-100 border">
                    <div class="kds-header bg-indigo-50 text-indigo-800">
                        <span>${__('on_the_way')}</span>
                        <span id="count-way" class="bg-indigo-200 px-2 py-0.5 rounded-md text-[10px]">0</span>
                    </div>
                    <div id="kds-way" class="kds-body"></div>
                </div>

                <!-- Completed -->
                <div class="kds-column border-slate-100 border">
                    <div class="kds-header bg-slate-50 text-slate-800">
                        <span>${__('fulfilled')}</span>
                        <span id="count-done" class="bg-slate-200 px-2 py-0.5 rounded-md text-[10px]">0</span>
                    </div>
                    <div id="kds-fulfilled" class="kds-body"></div>
                </div>
            </div>
        `;
        this.loadOrders();
    },

    loadOrders() {
        const orders = STATE.db.Orders || [];
        const groups = {
            'preparing': [],
            'pending': [],
            'ready': [],
            'way': [],
            'fulfilled': []
        };

        orders.forEach(o => {
            const status = (o[9] || 'pending').toLowerCase(); // Index 9 is Status
            if(status === 'working') groups.preparing.push(o);
            else if(status === 'ready') groups.ready.push(o);
            else if(status === 'way' || status === 'on-the-way') groups.way.push(o);
            else if(status === 'done' || status === 'fulfilled') groups.fulfilled.push(o);
            else groups.pending.push(o);
        });

        Object.keys(groups).forEach(key => {
            const container = document.getElementById(`kds-${key}`);
            const countSpan = document.getElementById(`count-${key === 'preparing' ? 'prep' : key === 'way' ? 'way' : key === 'fulfilled' ? 'done' : key}`);
            if(container) {
                container.innerHTML = groups[key].map(o => this.orderCard(o)).join('');
                if(countSpan) countSpan.innerText = groups[key].length;
            }
        });
    },

    orderCard(o) {
        return `
            <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer" onclick="KDS.showDetails('${o[0]}')">
                <div class="flex justify-between items-start mb-2">
                    <span class="font-black text-slate-800">#${o[0]}</span>
                    <span class="text-[9px] text-slate-400 font-bold">${o[2]}</span>
                </div>
                <div class="text-[11px] text-slate-600 mb-3 line-clamp-2">${o[5]}</div>
                <div class="flex gap-2">
                    ${this.actionButtons(o[9], o[0])}
                </div>
            </div>
        `;
    },

    actionButtons(status, id) {
        status = (status || 'pending').toLowerCase();
        if(status === 'pending') return `<button onclick="event.stopPropagation(); KDS.update('${id}', 'working')" class="btn-premium flex-1 bg-blue-100 text-blue-600 text-[10px] py-1.5 rounded-lg font-bold">START</button>`;
        if(status === 'working') return `<button onclick="event.stopPropagation(); KDS.update('${id}', 'ready')" class="btn-premium flex-1 bg-emerald-100 text-emerald-600 text-[10px] py-1.5 rounded-lg font-bold">READY</button>`;
        if(status === 'ready') return `<button onclick="event.stopPropagation(); KDS.update('${id}', 'way')" class="btn-premium flex-1 bg-indigo-100 text-indigo-600 text-[10px] py-1.5 rounded-lg font-bold">DELIVER</button>`;
        if(status === 'way' || status === 'on-the-way') return `<button onclick="event.stopPropagation(); KDS.update('${id}', 'done')" class="btn-premium flex-1 bg-slate-100 text-slate-600 text-[10px] py-1.5 rounded-lg font-bold">FINISH</button>`;
        return `<span class="text-emerald-500 font-bold text-[10px]"><i class="fa-solid fa-check-double"></i> DONE</span>`;
    },

    async update(orderId, status) {
        Utils.loading(true, __('processing'));
        try {
            await API.call('UPDATE_ORDER_STATUS', { orderId, status });
            await App.syncData();
            this.render();
            Utils.loading(false);
            Utils.toast(__('success'));
        } catch(e) { Swal.fire(__('error'), e.toString(), 'error'); }
    },

    showDetails(id) {
        const order = STATE.db.Orders.find(o => o[0] == id);
        if(!order) return;
        const isAr = STATE.lang === 'ar';
        
        const body = `
            <div class="space-y-6 animate-scale-in ${isAr ? 'text-right' : 'text-left'}" dir="${isAr ? 'rtl' : 'ltr'}">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-black text-slate-800">Order #${order[0]}</h2>
                    <span class="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-xs font-bold uppercase">${order[9]}</span>
                </div>
                
                <div class="bg-slate-50 p-6 rounded-2xl space-y-4">
                    <div class="flex justify-between border-b border-slate-200 pb-2">
                        <span class="text-slate-400 font-black uppercase text-[9px]">Time</span>
                        <span class="font-bold text-slate-700">${order[2]}</span>
                    </div>
                    <div class="flex justify-between border-b border-slate-200 pb-2">
                        <span class="text-slate-400 font-black uppercase text-[9px]">Source</span>
                        <span class="font-bold text-slate-700">${order[11] || 'POS'}</span>
                    </div>
                    <div class="flex justify-between border-b border-slate-200 pb-2">
                        <span class="text-slate-400 font-black uppercase text-[9px]">Method</span>
                        <span class="font-bold text-slate-700">${order[12]}</span>
                    </div>
                    <div class="flex justify-between pt-2">
                        <span class="text-slate-800 font-black uppercase text-xs">${__('total')}</span>
                        <span class="font-black text-blue-600 text-xl">${Utils.formatCurrency(order[8])}</span>
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="nav-label p-0">${__('order_details')}</label>
                    <div class="bg-white border-2 border-slate-50 rounded-xl p-4 text-sm font-bold text-slate-700 leading-relaxed whitespace-pre-wrap">
                        ${order[5] || 'No items listed'}
                    </div>
                </div>

                <button onclick="Utils.closeModal()" class="w-full btn btn-outline py-4 rounded-xl font-black uppercase tracking-widest text-[11px]">${isAr ? 'إغلاق' : 'Close'}</button>
            </div>
        `;
        Utils.openModal(body);
    }
};
