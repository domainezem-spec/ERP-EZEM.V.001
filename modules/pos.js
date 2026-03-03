/**
 * POS MODULE (ULTIMATE DIRAC EDITION) v4.5
 * Features: High-Density "Tap" Navigation, Ultra-Slim Buttons, Multi-Gateway Payment, 
 * Secure Admin Refund System, Professional Thermal Receipt Printing, Customer CRM.
 */
const POS = {
    level: 0, // 0: Categories (Groups), 1: SubCategories (Categories), 2: Items
    currentGroup: null,
    currentCategory: null,
    orderType: 'Walk-in',
    customerName: '',
    searchQuery: '',
    
    getAllProducts() {
        // POS primarily sells items from Menu_POS
        const menu = (STATE.db.Menu_POS || []).filter(i => (i[3] && i[3].trim() !== '')); 
        return menu;
    },
    
    paymentMethods: [
        { id: 'Cash', label: STATE.lang === 'ar' ? 'Cash (نقدي)' : 'Cash', icon: 'fa-money-bill-1', color: '#10b981' },
        { id: 'Bank', label: STATE.lang === 'ar' ? 'Bank (تحويل)' : 'Bank/Card', icon: 'fa-building-columns', color: '#3b82f6' },
        { id: 'Talabat', label: STATE.lang === 'ar' ? 'Talabat (طلبات)' : 'Talabat', icon: 'fa-motorcycle', color: '#ff5a00' },
        { id: 'Etisalat', label: STATE.lang === 'ar' ? 'Etisalat (اتصالات)' : 'Etisalat', icon: 'fa-mobile-screen', color: '#00a300' }
    ],

    cardColors: [
        '#5865F2', // Blurple
        '#57F287', // Green
        '#FEE75C', // Yellow
        '#EB459E', // Fuchsia
        '#ED4245', // Red
        '#FFFFFF', // White
        '#000000'  // Black
    ],

    render() {
        if(!STATE.db.activeShift) return this.renderShiftOpen();

        const items = this.getAllProducts();
        const isAr = STATE.lang === 'ar';
        document.getElementById('main-content').innerHTML = `
            <div class="pos-container flex flex-col lg:flex-row gap-2 h-[calc(100vh-80px)] animate-fade-in ${isAr ? 'text-right' : 'text-left'} font-sans" dir="${isAr ? 'rtl' : 'ltr'}">
                
                <!-- Main Catalog & Navigation Area (Left/Center) -->
                <div class="flex-1 flex flex-col gap-3 overflow-hidden bg-slate-50/50 p-3 rounded-2xl border border-slate-100/50">
                    
                    <!-- Integrated Header & Control Bar -->
                    <div class="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm border border-slate-100 shrink-0">
                         <div class="${isAr ? 'ml-auto' : 'mr-auto'} flex items-center gap-2" dir="${isAr ? 'rtl' : 'ltr'}">
                             <div class="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">${STATE.user.name[0]}</div>
                             <div class="flex flex-col">
                                <span class="text-[9px] font-black text-slate-700">${STATE.user.name}</span>
                                <span class="text-[7px] text-slate-300 font-bold">TERMINAL 01</span>
                             </div>
                        </div>

                        <!-- Breadcrumbs or Status -->
                        <div class="hidden md:flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-300 overflow-hidden">
                            <span class="${this.level >= 0 ? 'text-indigo-600' : ''}">${isAr ? 'الأصناف' : 'CATEGORIES'}</span>
                            ${this.level >= 1 ? `<i class="fa-solid fa-chevron-right text-[8px] mx-1"></i><span class="text-indigo-600">${this.currentGroup}</span>` : ''}
                            ${this.level >= 2 ? `<i class="fa-solid fa-chevron-right text-[8px] mx-1"></i><span class="text-indigo-600">${this.currentCategory}</span>` : ''}
                        </div>

                        <div class="flex bg-slate-100 p-0.5 rounded-lg ${isAr ? 'mr-auto' : 'ml-auto'}" dir="ltr">
                            ${['Walk-in', 'Drive-thru', 'Delivery'].map(t => `<button onclick="POS.setOrderType('${t}')" class="px-3 h-6 rounded-md text-[8px] font-black ${this.orderType === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}">${__(t).toUpperCase()}</button>`).join('')}
                        </div>
                    </div>

                    <!-- Grid Controls -->
                    <div class="flex items-center gap-2 shrink-0 px-1">
                         ${this.level > 0 ? `<button onclick="POS.goBack()" class="h-8 px-3 bg-white border border-slate-200 rounded-lg text-[9px] font-black text-indigo-500 shadow-sm"> <i class="fa-solid ${isAr ? 'fa-arrow-right' : 'fa-arrow-left'}"></i> ${isAr ? 'الرجوع' : 'Back'}</button>` : ''}
                         <div class="relative flex-1">
                            <i class="fa-solid fa-search absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-300 text-[10px]"></i>
                            <input type="text" onkeyup="POS.handleSearch(this.value)" placeholder="${isAr ? 'بحث سريع...' : 'Quick search...'}" class="w-full h-8 ${isAr ? 'pr-9 pl-3' : 'pl-9 pr-3'} bg-white border border-slate-100 rounded-lg text-[10px] font-bold outline-none">
                         </div>
                    </div>

                    <!-- Grid Content -->
                    <div class="flex-1 overflow-y-auto custom-scrollbar px-1">
                        <div id="pos-grid" class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-10">
                            ${this.renderGridContent(items)}
                        </div>
                    </div>
                </div>

                <!-- RIGHT SIDEBAR: Checkout & Cart -->
                <div class="w-full lg:w-[350px] flex flex-col bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden shrink-0">
                    
                    <!-- Customer Context -->
                    <div class="p-4 bg-slate-50/80 border-b border-slate-100">
                         <div class="relative group">
                            <i class="fa-solid fa-user-tag absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-300 text-[10px] group-focus-within:text-indigo-500 transition-colors"></i>
                            <input type="text" id="cust-name-input" placeholder="${isAr ? 'اسم العميل (اختياري)...' : 'Customer Name (Optional)...'}" 
                                value="${this.customerName}" onkeyup="POS.customerName = this.value"
                                class="w-full h-10 ${isAr ? 'pr-9 pl-4' : 'pl-9 pr-4'} bg-white border border-slate-200 rounded-xl text-[11px] font-bold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50/50 transition-all">
                         </div>
                    </div>

                    <!-- Live Order Feed -->
                    <div id="pos-cart" class="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar bg-white/50">
                         <!-- Items injected here -->
                    </div>

                    <!-- Summary & Final Action -->
                    <div class="p-5 bg-white border-t border-slate-100 space-y-4">
                        <div class="flex items-center gap-2 p-1 bg-slate-50 rounded-xl border border-slate-100">
                             <div class="flex-1 px-3">
                                <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">${isAr ? 'خصم مخصص' : 'Custom Discount'}</span>
                                <div class="flex items-center gap-2">
                                    <input type="number" id="pos-discount" class="bg-transparent border-none text-[12px] font-black text-rose-500 outline-none w-10 p-0" value="0" onchange="POS.updateCart()">
                                    <span class="text-[9px] font-black text-slate-300">%</span>
                                </div>
                             </div>
                             <button onclick="POS.customerName=prompt('Note:', POS.customerName || '')" class="w-10 h-10 rounded-lg bg-white shadow-sm border border-slate-200 text-slate-400 hover:text-indigo-600 transition-all flex items-center justify-center">
                                <i class="fa-solid fa-note-sticky text-[10px]"></i>
                             </button>
                        </div>

                        <div class="flex justify-between items-end px-1">
                            <div class="flex flex-col">
                                <span class="text-[9px] font-black text-rose-400 uppercase leading-none mb-1" id="pos-discount-label">Discount: 0.00</span>
                                <span class="text-4xl font-black text-slate-900 tracking-tight" id="pos-total-display">0.00</span>
                            </div>
                            <span class="text-[12px] font-black text-slate-300 mb-1 ml-1">EGP</span>
                        </div>

                        <button onclick="POS.showPaymentOptions()" 
                            class="w-full h-16 bg-indigo-600 hover:bg-slate-900 text-white rounded-2xl text-[14px] font-black shadow-[0_8px_20px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center gap-4">
                            <span>${isAr ? 'إتمام العملية' : 'DUE CHECKOUT'}</span>
                            <i class="fa-solid ${isAr ? 'fa-arrow-left' : 'fa-arrow-right'} text-xs"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        this.updateCart();
    },

    setOrderType(t) { this.orderType = t; this.render(); },
    selectGroup(g) { 
        console.log("📂 Selecting Group:", g);
        this.currentGroup = g; 
        this.level = 1; 
        this.currentCategory = null; 
        this.render(); 
    },
    selectCategory(c) { 
        console.log("📁 Selecting Category:", c);
        this.currentCategory = c; 
        this.level = 2; 
        this.render(); 
    },
    goBack() {
        if(this.level === 1) { this.level = 0; this.currentGroup = null; }
        else if(this.level === 2) { this.level = 1; this.currentCategory = null; }
        this.render();
    },
    handleSearch(q) { 
        this.searchQuery = q; 
        if(q) this.level = 2; // Jump to items on search
        else if(this.currentCategory) this.level = 2;
        else if(this.currentGroup) this.level = 1;
        else this.level = 0;
        this.render(); 
    },

    renderGridContent(items) {
        if (this.searchQuery) {
            const filtered = items.filter(i => {
                const name = i[3]?.toLowerCase() || ''; // Name at index 3
                return name.includes(this.searchQuery.toLowerCase());
            });
            return this.renderItemButtons(filtered);
        }

        const isAr = STATE.lang === 'ar';
        
        if (this.level === 0) {
            // Level 0: Show Categories (Groups)
            const groups = [];
            items.forEach(i => { if (i[0] && !groups.includes(i[0])) groups.push(i[0]); });
            
            return groups.map((g, idx) => {
                const bgColor = this.cardColors[idx % this.cardColors.length];
                const isLight = ['#FEE75C', '#57F287', '#FFFFFF'].includes(bgColor);
                const textColor = isLight ? 'text-slate-900' : 'text-white';
                
                // Escape quotes for HTML attribute safely
                const safeG = g.replace(/'/g, "\\'").replace(/"/g, '&quot;');
                
                return `
                <div onclick="POS.selectGroup('${safeG}')" 
                    class="aspect-[4/3] rounded-3xl flex flex-col p-6 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg animate-scale-in border-2 border-black/5 relative overflow-hidden"
                    style="background-color: ${bgColor}">
                    
                    <div class="text-[18px] md:text-[22px] font-black leading-tight select-none z-10 ${textColor} self-start mt-2">${g}</div>
                    
                    <!-- Decor -->
                    <div class="absolute bottom-6 right-6 opacity-20 ${textColor} text-[10px] font-black uppercase tracking-widest">
                        ${isAr ? 'عرض الفئة' : 'View Group'}
                    </div>
                </div>`;
            }).join('');
        }

        if (this.level === 1) {
            // Level 1: Show SubCategories (Categories)
            const cats = [];
            items.filter(i => i[0] === this.currentGroup).forEach(i => { 
                if (i[1] && !cats.includes(i[1])) cats.push(i[1]);
            });
            
            if(!cats.length) return this.renderItemButtons(items.filter(i => i[0] === this.currentGroup));

            return cats.map((c, idx) => {
                const bgColor = this.cardColors[(idx + 2) % this.cardColors.length];
                const isLight = ['#FEE75C', '#57F287', '#FFFFFF'].includes(bgColor);
                const textColor = isLight ? 'text-slate-900' : 'text-white';

                const safeC = c.replace(/'/g, "\\'").replace(/"/g, '&quot;');

                return `
                <div onclick="POS.selectCategory('${safeC}')" 
                    class="aspect-[4/3] rounded-3xl flex flex-col p-6 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg animate-scale-in border-2 border-black/5 relative overflow-hidden"
                    style="background-color: ${bgColor}">
                    
                    <div class="text-[16px] md:text-[20px] font-black leading-tight select-none z-10 ${textColor} self-start mt-2">${c}</div>
                    
                    <!-- Decor -->
                    <div class="absolute bottom-6 right-6 opacity-20 ${textColor} text-[10px] font-black uppercase tracking-widest">
                        ${this.currentGroup}
                    </div>
                </div>`;
            }).join('');
        }

        // Level 2: Show Items
        const itemsToRender = items.filter(i => i[0] === this.currentGroup && i[1] === this.currentCategory);
        return this.renderItemButtons(itemsToRender);
    },

    getProductImage(name) {
        const images = {
            'Zero Added Sugar Greek Yogurt Strawberries 0% Fat 150gm': 'https://www.lycheeegypt.com/cdn/shop/files/GreekYogurtZeroStrawberry-Front.jpg',
            'Zero Added Sugar Greek Yogurt Vanilla 0% Fat 150gm': 'https://www.lycheeegypt.com/cdn/shop/files/GreekYogurtZeroVanilla-Front.jpg',
            'Greek Yogurt Blueberries 0% Fat 150gm': 'https://www.lycheeegypt.com/cdn/shop/files/GreekYogurtBlueberry-Front.jpg',
            'Greek Yogurt Strawberries 0% Fat 150gm': 'https://www.lycheeegypt.com/cdn/shop/files/GreekYogurtStrawberry-Front.jpg',
            'Power Up': 'https://www.lycheeegypt.com/cdn/shop/files/Powerup.jpg',
            'Real Orange Juice with Pulp 350ml': 'https://www.lycheeegypt.com/cdn/shop/files/OrangeWithPulp-Front.jpg',
            'Real Orange Juice no Pulp 350ml': 'https://www.lycheeegypt.com/cdn/shop/files/OrangeWithoutPulp-Front.jpg',
            'Real Pink Lemonade 340ml': 'https://www.lycheeegypt.com/cdn/shop/files/PinkLemonade-Front.jpg',
            'Real Cranberry Cocktail 350ml': 'https://www.lycheeegypt.com/cdn/shop/files/Cranberry-Front.jpg'
        };
        
        // Find match (case insensitive)
        const key = Object.keys(images).find(k => name.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(name.toLowerCase()));
        return images[key] || 'https://via.placeholder.com/150?text=' + encodeURIComponent(name);
    },

    renderItemButtons(products) {
        if (!products.length) return `<div class="col-span-full py-16 text-center opacity-20"><i class="fa-solid fa-ghost text-4xl mb-3"></i><div class="text-[10px] font-black">NO ITEMS FOUND</div></div>`;

        const isAr = STATE.lang === 'ar';
        return products.map(i => {
            const price = parseFloat(i[4]) || 0; // Price at index 4
            const name = i[3]; // Name at index 3
            const imgUrl = this.getProductImage(name);
            const isBYO = name.toUpperCase().includes('BYO');
            const action = isBYO ? `POS.openBYOModal({id: '${i[2]}', name: '${name.replace(/'/g, "\\'")}', price: ${price}})` : `POS.addToCart({id: '${i[2]}', name: '${name.replace(/'/g, "\\'")}', price: ${price}})`;
            
            return `
                <div onclick="${action}" 
                    class="aspect-[4/5] rounded-[1.5rem] flex flex-col items-center p-0 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all animate-scale-in border border-slate-100 overflow-hidden group">
                    
                    <!-- Image Area -->
                    <div class="w-full h-[60%] bg-slate-50 relative overflow-hidden">
                        <img src="${imgUrl}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onerror="this.src='https://via.placeholder.com/150?text=Image'">
                        ${isBYO ? `<div class="absolute top-3 left-3 px-2 py-0.5 rounded-lg bg-indigo-600/90 text-[7px] text-white font-black uppercase">Customizable</div>` : ''}
                    </div>

                    <!-- Details Area -->
                    <div class="w-full flex-1 p-3 flex flex-col justify-between text-center">
                        <div class="text-[11px] font-black leading-tight text-slate-800 line-clamp-2 mt-1 px-1">${name}</div>
                        <div class="flex flex-col items-center gap-0.5 mb-1">
                             <div class="text-[12px] font-black text-indigo-600">${Utils.formatCurrency(price)}</div>
                             <div class="w-6 h-1 rounded-full bg-slate-100 group-hover:bg-indigo-300 transition-colors"></div>
                        </div>
                    </div>
                </div>`;
        }).join('');
    },

    addToCart(item) {
        const existing = STATE.cart.find(i => i.id === item.id);
        if(existing) existing.qty++; else STATE.cart.push({ ...item, qty: 1 });
        this.updateCart();
    },

    updateCart() {
        const cartDiv = document.getElementById('pos-cart');
        if(!cartDiv) return;
        if(!STATE.cart.length) {
            cartDiv.innerHTML = `<div class="h-full flex flex-col items-center justify-center opacity-10 font-black text-[10px] select-none"><i class="fa-solid fa-cart-arrow-down text-4xl mb-4"></i>${STATE.lang === 'ar' ? 'بانتظار الطلبات' : 'AWAITING ORDER'}</div>`;
            document.getElementById('pos-total-display').innerText = '0.00';
            document.getElementById('pos-item-count').innerText = '0';
            return;
        }

        let subtotal = 0; let count = 0;
        cartDiv.innerHTML = STATE.cart.map((item, idx) => {
            subtotal += (item.price * item.qty); count += item.qty;
            return `
                <div class="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-100 transition-colors animate-fade-in group">
                    <div class="flex-1">
                        <div class="text-[10px] font-black text-slate-800 mb-0.5">${item.name}</div>
                        <div class="text-[9px] text-indigo-500 font-black">${Utils.formatCurrency(item.price)} <span class="text-slate-300 font-bold mx-1">/</span> <span class="text-slate-400 font-bold">${Utils.formatCurrency(item.price * item.qty)}</span></div>
                    </div>
                    <div class="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                         <button onclick="POS.changeQty(${idx}, -1)" class="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"><i class="fa-solid fa-minus text-[8px]"></i></button>
                         <span class="text-[11px] font-black w-4 text-center text-slate-700">${item.qty}</span>
                         <button onclick="POS.changeQty(${idx}, 1)" class="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all"><i class="fa-solid fa-plus text-[8px]"></i></button>
                    </div>
                </div>`;
        }).join('');

        const discountPct = parseFloat(document.getElementById('pos-discount')?.value) || 0;
        const discountAmt = subtotal * (discountPct / 100);
        const finalTotal = subtotal - discountAmt;

        document.getElementById('pos-total-display').innerText = finalTotal.toLocaleString('en-US', {minimumFractionDigits: 2});
        document.getElementById('pos-discount-label').innerText = `${STATE.lang === 'ar' ? 'الخصم' : 'Discount'}: ${discountAmt.toFixed(2)}`;
    },

    changeQty(i, d) { STATE.cart[i].qty += d; if(STATE.cart[i].qty <= 0) STATE.cart.splice(i, 1); this.updateCart(); },

    showPaymentOptions() {
        if(!STATE.cart.length) return;
        const total = STATE.cart.reduce((s, i) => s + (i.price * i.qty), 0);
        
        const html = `
            <div class="grid grid-cols-2 gap-3 mt-4 text-right">
                ${this.paymentMethods.map(m => `
                    <button onclick="POS.processSale('${m.id}')" 
                        class="h-20 rounded-2xl border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all flex flex-col items-center justify-center gap-2 group">
                        <i class="fa-solid ${m.icon} text-lg" style="color: ${m.color}"></i>
                        <span class="text-[11px] font-black text-slate-700 uppercase tracking-tighter">${m.label}</span>
                    </button>
                `).join('')}
                <button onclick="POS.showMixedPaymentModal()" class="col-span-2 h-14 rounded-2xl bg-slate-900 text-white hover:bg-black transition-all flex items-center justify-center gap-3">
                    <div class="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center"><i class="fa-solid fa-shuffle text-[10px]"></i></div>
                    <span class="text-xs font-black tracking-widest">${STATE.lang === 'ar' ? 'دفع مختلط' : 'MIXED PAYMENT'}</span>
                </button>
            </div>`;

        Swal.fire({ title: STATE.lang === 'ar' ? 'اختر طريقة الدفع' : 'Select Payment Method', html: html, showConfirmButton: false, customClass: { popup: 'rounded-3xl' } });
    },

    async processSale(method, mixedDetails = null) {
        const subtotal = STATE.cart.reduce((s, i) => s + (i.price * i.qty), 0);
        const discountPct = parseFloat(document.getElementById('pos-discount')?.value) || 0;
        const discountAmt = subtotal * (discountPct / 100);
        const finalTotal = subtotal - discountAmt;
        const payments = mixedDetails || { [method]: finalTotal };
        
        Utils.loading(true, 'Finishing Order...');
        try {
            const res = await API.call('PROCESS_SALE', { 
                cart: STATE.cart, 
                total: finalTotal, 
                discount: discountAmt,
                payments: payments, 
                mode: this.orderType, 
                shiftId: STATE.db.activeShift.id,
                customer: this.customerName,
                orderType: this.orderType
            });
            
            this.printReceipt(res, payments);

            STATE.cart = []; this.customerName = ''; this.level = 1; this.currentCategory = null; 
            Utils.loading(false);
            Swal.fire({ title: STATE.lang === 'ar' ? 'تم الطلب' : 'Order Complete', text: `Txn: ${res.txnId}`, icon: 'success', timer: 1500, showConfirmButton: false });
            this.render();
        } catch(e) { Utils.loading(false); Swal.fire('Checkout Error', e.toString(), 'error'); }
    },

    printReceipt(res, payments) {
        const cartCopy = [...STATE.cart];
        const subtotal = cartCopy.reduce((s, i) => s + (i.price * i.qty), 0);
        const discountPct = parseFloat(document.getElementById('pos-discount')?.value) || 0;
        const discountAmt = subtotal * (discountPct / 100);
        const finalTotal = subtotal - discountAmt;
        const date = res.date || new Date().toLocaleString();
        
        const win = window.open('', '_blank', 'width=380,height=600');
        win.document.write(`
            <html>
            <head>
                <style>
                    body { font-family: 'Courier New', monospace; width: 72mm; padding: 2mm; text-align: center; color: #000; font-size: 11px; margin: 0; }
                    .brand { font-size: 20px; font-weight: 900; margin-bottom: 2px; text-transform: uppercase; }
                    .info { margin-bottom: 10px; font-size: 9px; line-height: 1.2; border-bottom: 1px dashed #000; padding-bottom: 5px; }
                    .table { width: 100%; margin-bottom: 10px; }
                    .tr { display: flex; justify-content: space-between; margin-bottom: 3px; }
                    .total { border-top: 2px solid #000; margin-top: 10px; padding-top: 5px; font-size: 14px; font-weight: 900; }
                    .footer { margin-top: 20px; font-size: 8px; border-top: 1px dashed #ccc; padding-top: 10px; }
                    .payments { font-size: 10px; text-align: right; margin-top: 5px; }
                    @media print { @page { margin: 0; } }
                </style>
            </head>
            <body onload="window.print(); setTimeout(() => window.close(), 500);">
                <div class="brand">ERP-EZEM</div>
                <div class="info">
                    Terminal: 01 | ID: ${res.txnId}<br>
                    Date: ${date}<br>
                    Type: ${this.orderType} | Cust: ${this.customerName || 'Walk-in'}
                </div>
                <div class="table">
                    ${cartCopy.map(i => `
                        <div class="tr">
                            <span style="flex:1; text-align:left;">${i.qty}x ${i.name.slice(0,25)}</span>
                            <span style="width:50px; text-align:right;">${(i.price * i.qty).toFixed(2)}</span>
                        </div>`).join('')}
                </div>
                ${discountAmt > 0 ? `
                <div class="tr" style="font-size: 9px; color: #666;">
                    <span>SUBTOTAL</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div class="tr" style="font-size: 9px; color: #666;">
                    <span>DISCOUNT (${discountPct}%)</span>
                    <span>-${discountAmt.toFixed(2)}</span>
                </div>` : ''}
                <div class="total tr">
                    <span>GRAND TOTAL</span>
                    <span>${finalTotal.toFixed(2)} EGP</span>
                </div>
                <div class="payments">
                    ${Object.entries(payments).filter(([k,v])=>v>0).map(([k,v])=>`<div>${k}: ${v.toFixed(2)}</div>`).join('')}
                </div>
                <div class="footer">
                    Powered by ERP-EZEM<br>
                    Thank you / شكراً لزيارتكم<br>
                    *************************
                </div>
            </body>
            </html>
        `);
        win.document.close();
    },

    async showMixedPaymentModal() {
        const total = STATE.cart.reduce((s, i) => s + (i.price * i.qty), 0);
        const isAr = STATE.lang === 'ar';
        const { value: formValues } = await Swal.fire({
            title: isAr ? 'تفاصيل الدفع المختلط' : 'Mixed Payment Breakdown',
            html: `
                <div class="space-y-4 ${isAr ? 'text-right' : 'text-left'} p-2">
                    ${this.paymentMethods.map(m => `
                        <div class="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-3">
                            <i class="fa-solid ${m.icon} text-slate-300 w-5"></i>
                            <div class="flex-1 text-[10px] font-black text-slate-500 uppercase">${m.label}</div>
                            <input type="number" id="mix-${m.id}" class="w-24 h-8 bg-white border border-slate-200 rounded-lg text-center font-black outline-none focus:border-indigo-400" value="0" step="0.01">
                        </div>`).join('')}
                    <div class="pt-4 border-t border-slate-200 flex justify-between items-center px-2">
                        <span class="text-[10px] font-black text-slate-400">ORDER TOTAL</span>
                        <span class="text-lg font-black text-indigo-600">${total.toFixed(2)}</span>
                    </div>
                </div>`,
            preConfirm: () => {
                const results = {}; let sum = 0;
                this.paymentMethods.forEach(m => {
                    const val = parseFloat(document.getElementById(`mix-${m.id}`).value) || 0;
                    results[m.id] = val; sum += val;
                });
                if(Math.abs(sum - total) > 0.05) { Swal.showValidationMessage(`Total mismatch: Found ${sum.toFixed(2)}, Need ${total.toFixed(2)}`); return false; }
                return results;
            }
        });
        if(formValues) this.processSale('Mixed', formValues);
    },

    renderShiftOpen() {
        const isAr = STATE.lang === 'ar';
        document.getElementById('main-content').innerHTML = `
            <div class="flex items-center justify-center h-full bg-slate-50/30">
                <div class="bg-white p-12 rounded-[3rem] shadow-2xl text-center max-w-sm w-full animate-scale-in border border-white">
                    <div class="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center text-3xl mx-auto mb-8 shadow-inner ring-4 ring-indigo-50/50">
                        <i class="fa-solid fa-key"></i>
                    </div>
                    <h3 class="text-2xl font-black text-slate-800 mb-2">${isAr ? 'المحطة مغلقة' : 'POS Station Locked'}</h3>
                    <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-10">${isAr ? 'يرجى فتح الوردية للبدء' : 'Please open shift to proceed'}</p>
                    
                    <div class="mb-8">
                        <label class="block text-[9px] font-black text-slate-400 ${isAr ? 'text-right mr-2' : 'text-left ml-2'} mb-2 uppercase tracking-tighter">${isAr ? 'رصيد الافتتاح النقدي' : 'Opening Cash Balance'}</label>
                        <input type="number" id="open-amount" class="w-full h-16 text-center text-3xl font-black text-indigo-600 bg-slate-50 border-none rounded-3xl outline-none ring-2 ring-transparent focus:ring-indigo-100 transition-all font-mono" value="0">
                    </div>

                    <button onclick="POS.openShift()" 
                        class="w-full h-16 bg-indigo-600 text-white rounded-3xl text-sm font-black shadow-xl shadow-indigo-100 hover:bg-slate-900 transition-all flex items-center justify-center gap-3">
                        <span>${isAr ? 'فتح المحطة' : 'OPEN TERMINAL'}</span>
                        <i class="fa-solid fa-unlock text-[10px] opacity-50"></i>
                    </button>
                    <div class="mt-6 text-[9px] font-black text-slate-300 uppercase tracking-tighter italic">EZEM ERP • MULTI-LANG ENGINE v4.5</div>
                </div>
            </div>`;
    },

    async openShift() {
        const val = parseFloat($('#open-amount').val()) || 0;
        Utils.loading(true, 'Initializing Station...');
        try {
            await API.call('OPEN_SHIFT', { amount: val });
            this.render();
        } catch(e) { Swal.fire('System Error', e.toString(), 'error'); }
        finally { Utils.loading(false); }
    },

    // --- BYO CUSTOMIZATION ENGINE ---
    byoData: { current: null, selections: {}, step: 0 },
    byoSteps: [
        { id: 'choose', label: 'Choose', category: 'BYO_SIZE', limit: 1 },
        { id: 'base', label: 'Base', category: 'Base', limit: 2 },
        { id: 'premium', label: 'Premium', category: 'Premiums', limit: 1 },
        { id: 'protein', label: 'Protein', category: 'Protein', limit: 1 },
        { id: 'modify', label: 'Modify & Extra', category: 'Modify&Extra', limit: 5 },
        { id: 'essential', label: 'Essential', category: 'Essentials', limit: 4 }
    ],

    openBYOModal(product) {
        this.byoData = { current: product, selections: {}, step: 0 };
        this.byoSteps.forEach(s => this.byoData.selections[s.id] = []);
        
        const isAr = STATE.lang === 'ar';
        const body = `
            <div id="byo-modal-container" class="flex flex-col h-[85vh] bg-white rounded-3xl overflow-hidden shadow-2xl ${isAr ? 'text-right' : 'text-left'}" dir="${isAr ? 'rtl' : 'ltr'}">
                <div class="p-6 bg-slate-900 text-white flex justify-between items-center shadow-lg shrink-0">
                    <div class="flex flex-col">
                        <span class="text-[10px] font-black opacity-50 uppercase tracking-widest">${isAr ? 'تخصيص الطلب' : 'BUILD YOUR OWN'}</span>
                        <h2 class="text-xl font-black">${product.name}</h2>
                    </div>
                    <button onclick="Swal.close()" class="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"><i class="fa-solid fa-times"></i></button>
                </div>

                <div class="flex-1 flex overflow-hidden">
                    <!-- Steps Sidebar -->
                    <div class="w-48 bg-slate-50 border-r border-slate-100 flex flex-col p-3 gap-2 overflow-y-auto shrink-0">
                        ${this.byoSteps.map((s, idx) => `
                            <div id="byo-step-btn-${idx}" onclick="POS.renderBYOStep(${idx})" 
                                class="p-4 rounded-2xl cursor-pointer transition-all border-2 flex flex-col gap-1
                                ${this.byoData.step === idx ? 'bg-indigo-600 text-white border-indigo-700 shadow-md' : 'bg-white text-slate-400 border-white hover:border-slate-100'}">
                                <span class="text-[8px] font-black opacity-50 uppercase">${idx + 1}. ${isAr ? 'خطوة' : 'STEP'}</span>
                                <span class="text-[11px] font-black leading-tight">${__(s.label)}</span>
                                <div class="flex gap-1 mt-1" id="byo-step-summary-${idx}">
                                    ${this.renderBYOSummary(idx)}
                                </div>
                            </div>`).join('')}
                    </div>

                    <!-- Step Content -->
                    <div class="flex-1 flex flex-col bg-white overflow-hidden p-6 relative">
                        <div id="byo-step-content" class="flex-1 overflow-y-auto custom-scrollbar">
                            ${this.renderBYOStepContent(0)}
                        </div>

                        <!-- Footer Actions -->
                        <div class="h-20 border-t border-slate-50 flex items-center justify-between px-2 shrink-0">
                            <div class="flex flex-col">
                                <span class="text-[10px] font-black text-slate-300 uppercase">${isAr ? 'الإجمالي الحالي' : 'CURRENT TOTAL'}</span>
                                <span class="text-2xl font-black text-slate-800" id="byo-price-display">${Utils.formatCurrency(product.price)}</span>
                            </div>
                            <div class="flex gap-3">
                                <button id="byo-prev-btn" onclick="POS.renderBYOStep(Math.max(0, POS.byoData.step - 1))" class="h-12 px-6 rounded-2xl bg-slate-100 text-slate-400 font-black text-xs hover:bg-slate-200 transition-all opacity-0 pointer-events-none">BACK</button>
                                <button id="byo-next-btn" onclick="POS.completeBYO()" class="h-12 px-10 rounded-2xl bg-indigo-600 text-white font-black text-xs shadow-lg shadow-indigo-100 hover:bg-slate-900 transition-all">FINISH ORDER</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

        Swal.fire({
            html: body,
            width: '1000px',
            padding: 0,
            showConfirmButton: false,
            background: 'transparent',
            customClass: { popup: 'rounded-3xl border-none shadow-none' }
        });

        this.renderBYOStep(0);
    },

    renderBYOStep(idx) {
        this.byoData.step = idx;
        const step = this.byoSteps[idx];
        const isAr = STATE.lang === 'ar';

        // Update Button States
        this.byoSteps.forEach((s, i) => {
            const btn = document.getElementById(`byo-step-btn-${i}`);
            if(btn) btn.className = `p-4 rounded-2xl cursor-pointer transition-all border-2 flex flex-col gap-1 ${idx === i ? 'bg-indigo-600 text-white border-indigo-700 shadow-md' : 'bg-white text-slate-400 border-white hover:border-slate-100'}`;
        });

        document.getElementById('byo-step-content').innerHTML = this.renderBYOStepContent(idx);
        
        const prevBtn = document.getElementById('byo-prev-btn');
        if(prevBtn) {
            if(idx === 0) { prevBtn.classList.add('opacity-0', 'pointer-events-none'); }
            else { prevBtn.classList.remove('opacity-0', 'pointer-events-none'); }
        }

        const nextBtn = document.getElementById('byo-next-btn');
        if(nextBtn) {
            if(idx === this.byoSteps.length - 1) { nextBtn.innerText = isAr ? 'إضافة للطلب' : 'ADD TO CART'; }
            else { nextBtn.innerText = isAr ? 'الخطوة التالية' : 'NEXT STEP'; nextBtn.onclick = () => POS.renderBYOStep(idx + 1); }
        }
    },

    renderBYOStepContent(idx) {
        const step = this.byoSteps[idx];
        const isAr = STATE.lang === 'ar';
        
        // Fetch items for this category (item[1] is Category)
        const items = (STATE.db.Menu_POS || []).filter(item => item[1] === step.category);
        
        if(!items.length && idx !== 0) return `<div class="flex flex-col items-center justify-center h-full opacity-20"><i class="fa-solid fa-ghost text-4xl mb-4"></i><span class="font-black text-xs uppercase">No items found for ${step.label}</span></div>`;

        // Special handling for step 0 (Size/Type) if needed, or just categories
        let html = `
            <div class="mb-6">
                <h3 class="text-2xl font-black text-slate-800">${__(step.label)}</h3>
                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                    ${isAr ? `اختر حتى ${step.limit} أصناف` : `Choose up to ${step.limit} items`}
                </p>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
        `;

        // If step 0 and no items, show default sizes
        const displayItems = items.length ? items : (idx === 0 ? [['', 'BYO_SIZE', 'M', 'Medium', 0], ['', 'BYO_SIZE', 'L', 'Large', 0], ['', 'BYO_SIZE', 'W', 'Warm Bowl', 0], ['', 'BYO_SIZE', 'WR', 'Wrap', 0]] : []);

        html += displayItems.map(i => {
            const code = i[2];
            const name = i[3];
            const extraPrice = parseFloat(i[4]) || 0;
            const isSelected = this.byoData.selections[step.id].some(s => s.code === code);
            
            return `
                <div onclick="POS.toggleBYOSelection('${step.id}', {code: '${code}', name: '${name.replace(/'/g, "\\'")}', price: ${extraPrice}})" 
                    class="p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col gap-1 relative overflow-hidden group
                    ${isSelected ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-100 bg-white hover:border-indigo-200'}">
                    <div class="flex justify-between items-start">
                        <span class="text-[11px] font-black text-slate-700 leading-tight">${name}</span>
                        ${isSelected ? '<i class="fa-solid fa-circle-check text-indigo-500 text-xs animate-scale-in"></i>' : ''}
                    </div>
                    ${extraPrice > 0 ? `<span class="text-[9px] font-black text-emerald-500">+${Utils.formatCurrency(extraPrice)}</span>` : '<span class="text-[9px] font-bold text-slate-300">Free</span>'}
                </div>`;
        }).join('');

        html += `</div>`;
        return html;
    },

    toggleBYOSelection(stepId, item) {
        const step = this.byoSteps.find(s => s.id === stepId);
        const current = this.byoData.selections[stepId];
        const idx = current.findIndex(s => s.code === item.code);

        if(idx > -1) {
            current.splice(idx, 1);
        } else {
            if(step.limit === 1) {
                this.byoData.selections[stepId] = [item];
            } else {
                if(current.length >= step.limit) {
                    Utils.toast(`Max ${step.limit} items allowed`, 'warning');
                    return;
                }
                current.push(item);
            }
        }

        // Update UI
        document.getElementById('byo-step-content').innerHTML = this.renderBYOStepContent(this.byoData.step);
        document.getElementById(`byo-step-summary-${this.byoData.step}`).innerHTML = this.renderBYOSummary(this.byoData.step);
        
        // Update Total Price
        let extraTotal = 0;
        Object.values(this.byoData.selections).forEach(arr => {
            arr.forEach(i => extraTotal += i.price);
        });
        const finalTotal = this.byoData.current.price + extraTotal;
        document.getElementById('byo-price-display').innerText = Utils.formatCurrency(finalTotal);
    },

    renderBYOSummary(idx) {
        const stepId = this.byoSteps[idx].id;
        const count = this.byoData.selections[stepId].length;
        if(count === 0) return '';
        return this.byoData.selections[stepId].map(s => `<div class="w-2 h-2 rounded-full bg-indigo-400"></div>`).join('');
    },

    completeBYO() {
        const name = `${this.byoData.current.name} (${Object.values(this.byoData.selections).flat().map(s => s.name).join(', ')})`;
        let extraTotal = 0;
        Object.values(this.byoData.selections).forEach(arr => {
            arr.forEach(i => extraTotal += i.price);
        });
        
        this.addToCart({
            id: 'CUSTOM-' + Date.now(),
            name: name,
            price: this.byoData.current.price + extraTotal,
            byo: true,
            details: this.byoData.selections
        });
        
        Swal.close();
    }
};
