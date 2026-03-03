/**
 * RECIPES MODULE (Manufacturing & Costing)
 * Advanced Recipe Builder with dynamic ingredients and live cost tracking
 */
const Recipes = {
    tempIngredients: [],
    activeView: 'list',

    render() {
        const recipes = STATE.db.Recipes || [];
        const isAr = STATE.lang === 'ar';
        
        document.getElementById('main-content').innerHTML = `
            <div class="space-y-6 animate-fade-in ${isAr ? 'text-right' : 'text-left'}" dir="${isAr ? 'rtl' : 'ltr'}">
                <div class="flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-lg">
                            <i class="fa-solid fa-utensils"></i>
                        </div>
                        <div>
                            <h2 class="text-lg font-black text-slate-800 tracking-tight">${__('recipes_management')}</h2>
                            <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Recipe BOM & Cost Engineering</p>
                        </div>
                    </div>
                    
                    <div class="flex gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
                        <button onclick="Recipes.setView('list')" class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${this.activeView === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}">${isAr ? 'قائمة الوصفات' : 'Recipes List'}</button>
                        <button onclick="Recipes.setView('analysis')" class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${this.activeView === 'analysis' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}">${isAr ? 'تحليل الربحية' : 'Analysis'}</button>
                    </div>

                    <button onclick="Recipes.addNew()" class="btn btn-primary shadow-sm">
                        <i class="fa-solid fa-plus-circle"></i> ${__('add_recipe')}
                    </button>
                </div>

                ${this.activeView === 'list' ? this.renderListView(recipes) : this.renderAnalysisView(recipes)}
            </div>
        `;
    },

    setView(v) {
        this.activeView = v;
        this.render();
    },

    renderListView(recipes) {
        const isAr = STATE.lang === 'ar';
        const posItems = (STATE.db.Menu_POS || []).filter(item => {
            const type = item[7]; // Index 7 is 'Type'
            return type !== 'Ready to Sell';
        });
        const subRecipes = recipes.filter(r => r[6] === 'Sub');
        
        return `
            <div class="space-y-4 animate-fade-in">
                <div class="relative max-w-md">
                    <i class="fa-solid fa-search absolute ${isAr ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-300"></i>
                    <input type="text" oninput="Recipes.filterList(this.value)" placeholder="${isAr ? 'بحث في الأصناف أو الوصفات...' : 'Search items or recipes...'}" 
                        class="w-full h-11 ${isAr ? 'pr-11 pl-4' : 'pl-11 pr-4'} bg-white border border-slate-100 rounded-xl text-xs font-bold shadow-sm outline-none focus:border-blue-400 transition-all">
                </div>

                <!-- MENU POS RECIPES -->
                <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div class="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                        <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">${isAr ? 'أصناف المنيو (Menu POS)' : 'MENU POS ITEMS'}</h3>
                        <span class="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-md text-[9px] font-black">${posItems.length} ITEMS</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full ${isAr ? 'text-right' : 'text-left'} text-[11px]" id="recipes-pos-table">
                            <thead>
                                <tr class="text-slate-400 border-b border-slate-50 uppercase font-black text-[9px] tracking-widest">
                                    <th class="p-4">${isAr ? 'الكود' : 'Code'}</th>
                                    <th class="p-4">${isAr ? 'الصنف' : 'Item'}</th>
                                    <th class="p-4 text-center">${isAr ? 'النوع' : 'Type'}</th>
                                    <th class="p-4 text-center">${isAr ? 'التكلفة' : 'Cost'}</th>
                                    <th class="p-4 text-center">${isAr ? 'السعر' : 'Price'}</th>
                                    <th class="p-4 text-center">${isAr ? 'الهامش' : 'Margin'}</th>
                                    <th class="p-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-50">
                                ${this.renderPosRecipeRows(posItems, recipes)}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- SUB-RECIPES -->
                <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div class="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                        <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">${isAr ? 'تحضيرات فرعية (Sub-Recipes)' : 'SUB-RECIPES / PREP'}</h3>
                        <span class="px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-md text-[9px] font-black">${subRecipes.length} PREPS</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full ${isAr ? 'text-right' : 'text-left'} text-[11px]" id="recipes-sub-table">
                            <thead>
                                <tr class="text-slate-400 border-b border-slate-50 uppercase font-black text-[9px] tracking-widest">
                                    <th class="p-4">${isAr ? 'الكود' : 'Code'}</th>
                                    <th class="p-4">${isAr ? 'الوصفة' : 'Recipe'}</th>
                                    <th class="p-4 text-center">${isAr ? 'تكلفة الوحدة' : 'Unit Cost'}</th>
                                    <th class="p-4 text-center">${isAr ? 'النوع' : 'Type'}</th>
                                    <th class="p-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-50">
                                ${this.renderSubRecipeRows(subRecipes)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    renderPosRecipeRows(posItems, recipes) {
        const isAr = STATE.lang === 'ar';
        if (!posItems.length) return `<tr><td colspan="7" class="p-10 text-center text-slate-400 italic">No Menu Items</td></tr>`;

        return posItems.map(item => {
            const recipeId = item[6]; // Index 6 is RecipeID
            const recipe = recipes.find(r => r[0] === recipeId || (r[6] !== 'Sub' && r[1] === item[3]));
            const cost = recipe ? (parseFloat(recipe[3]) || 0) : 0;
            const price = parseFloat(item[4]) || 0;
            const gp = price > 0 ? ((price - cost) / price * 100).toFixed(1) : 0;
            const gpColor = gp > 40 ? 'text-emerald-500' : (gp > 20 ? 'text-blue-500' : 'text-rose-500');
            const pType = item[7] || 'Recipe';
            const pTypeColor = pType === 'Manufacturing' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100';

            return `
                <tr class="hover:bg-slate-50/50 transition-all recipe-list-row" data-search="${item[3].toLowerCase()} ${item[2]}" >
                    <td class="p-4 font-mono text-[10px] text-slate-400 font-black">#${item[2]}</td>
                    <td class="p-4">
                        <div class="font-black text-slate-700">${item[3]}</div>
                        <div class="text-[9px] text-slate-400 font-bold uppercase tracking-tight">${item[1] || 'Main Menu'}</div>
                    </td>
                    <td class="p-4 text-center">
                        <span class="px-2 py-0.5 rounded-md text-[9px] font-black border ${pTypeColor}">${pType}</span>
                    </td>
                    <td class="p-4 text-center">
                        ${recipe ? `<span class="font-black text-slate-800">${Utils.formatCurrency(cost)}</span>` : `<span class="text-rose-400 italic">${isAr ? 'بدون وصفة' : 'No Recipe'}</span>`}
                    </td>
                    <td class="p-4 text-center font-black text-indigo-600">${Utils.formatCurrency(price)}</td>
                    <td class="p-4 text-center">
                        ${recipe ? `<span class="px-2 py-1 rounded-lg bg-slate-100 ${gpColor} font-black">${gp}%</span>` : '---'}
                    </td>
                    <td class="p-4 text-center">
                        <div class="flex justify-center gap-2">
                            ${recipe ? 
                                `<button onclick="Recipes.editRecipe('${recipe[0]}')" class="action-btn edit"><i class="fa-solid fa-pen"></i></button>` :
                                `<button onclick="Recipes.addNewForPos('${item[2]}')" class="h-8 px-3 rounded-lg bg-blue-600 text-white text-[9px] font-black uppercase hover:bg-blue-700 transition-all shadow-sm">${isAr ? 'إنشاء وصفة' : 'Create'}</button>`
                            }
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    renderSubRecipeRows(subRecipes) {
        const isAr = STATE.lang === 'ar';
        if (!subRecipes.length) return `<tr><td colspan="5" class="p-10 text-center text-slate-400 italic">No Sub-Recipes</td></tr>`;

        return subRecipes.map(r => `
            <tr class="hover:bg-slate-50/50 transition-all recipe-list-row" data-search="${r[1].toLowerCase()} ${r[0]}">
                <td class="p-4 font-mono text-[10px] text-indigo-400 font-black">#${r[0]}</td>
                <td class="p-4 font-black text-slate-700">${r[1]}</td>
                <td class="p-4 text-center font-black text-slate-800">${Utils.formatCurrency(r[3])}</td>
                <td class="p-4 text-center">
                    <span class="px-2 py-1 rounded-lg bg-indigo-50 text-indigo-600 font-black text-[9px] uppercase">${r[6] || 'SUB'}</span>
                </td>
                <td class="p-4 text-center">
                    <div class="flex justify-center gap-2">
                        <button onclick="Recipes.editRecipe('${r[0]}')" class="action-btn edit"><i class="fa-solid fa-pen"></i></button>
                        <button onclick="Recipes.deleteItem('${r[0]}')" class="action-btn del"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    filterList(query) {
        const q = query.toLowerCase();
        $('.recipe-list-row').each(function() {
            const txt = $(this).data('search') || '';
            $(this).toggle(txt.includes(q));
        });
    },

    addNewForPos(posCode) {
        const item = STATE.db.Menu_POS.find(i => String(i[2]) === String(posCode));
        if(!item) return;
        
        this.resetForm();
        this.showAddModal();
        
        setTimeout(() => {
            $('#rec-code').val(item[2]);
            $('#rec-name').val(item[3]);
            $('#rec-price').val(item[4]);
            $('#rec-type').val('Standard');
            if(item[7]) $('#rec-product-type').val(item[7]);
            this.toggleTitleType('Standard');
            $('#rec-pos-select').val(item[2]).trigger('change');
            this.updateTempTable();
        }, 400);
    },

    renderAnalysisView(recipes) {
        const isAr = STATE.lang === 'ar';
        if(!recipes.length) return `
            <div class="flex flex-col items-center justify-center py-20 opacity-30 italic">
                <i class="fa-solid fa-chart-pie text-5xl mb-4"></i>
                <p>${isAr ? 'لا توجد بيانات للتحليل' : 'No recipes to analyze'}</p>
            </div>
        `;

        const totalCost = recipes.reduce((s, r) => s + (parseFloat(r[3]) || 0), 0);
        const totalRev = recipes.reduce((s, r) => s + (parseFloat(r[5]) || 0), 0);
        const avgGP = totalRev > 0 ? ((totalRev - totalCost) / totalRev * 100).toFixed(1) : 0;

        // Sort by GP Margin
        const sorted = [...recipes].map(r => {
            const cost = parseFloat(r[3]) || 0;
            const price = parseFloat(r[5]) || 0;
            const gp = price > 0 ? ((price - cost) / price * 100) : 0;
            return { name: r[1], cost, price, gp };
        }).sort((a, b) => b.gp - a.gp);

        const best = sorted.slice(0, 3);
        const worst = sorted.slice(-3).reverse();

        return `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                <!-- Summary Card -->
                <div class="col-span-1 md:col-span-3 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">${isAr ? 'متوسط هامش الربح' : 'Average GP Margin'}</p>
                        <h3 class="text-3xl font-black text-slate-800">${avgGP}%</h3>
                    </div>
                    <div class="flex gap-4">
                        <div class="text-right">
                             <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">${isAr ? 'إجمالي التكلفة' : 'Total BOM Cost'}</p>
                             <p class="text-lg font-black text-slate-700">${Utils.formatCurrency(totalCost)}</p>
                        </div>
                        <div class="text-right">
                             <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">${isAr ? 'إجمالي سعر المنيو' : 'Total Menu Value'}</p>
                             <p class="text-lg font-black text-emerald-600">${Utils.formatCurrency(totalRev)}</p>
                        </div>
                    </div>
                </div>

                <!-- High Margin -->
                <div class="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100">
                    <h4 class="text-xs font-black text-emerald-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <i class="fa-solid fa-arrow-trend-up"></i> ${isAr ? 'الأعلى ربحية' : 'Top Profitable'}
                    </h4>
                    <div class="space-y-3">
                        ${best.map(r => `
                            <div class="flex justify-between items-center">
                                <span class="text-[11px] font-bold text-slate-700">${r.name}</span>
                                <span class="text-[11px] font-black text-emerald-600">${r.gp.toFixed(1)}%</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Low Margin -->
                <div class="bg-rose-50/50 p-6 rounded-3xl border border-rose-100 text-[11px]">
                    <h4 class="text-xs font-black text-rose-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <i class="fa-solid fa-triangle-exclamation"></i> ${isAr ? 'الأقل ربحية' : 'Low Margin Attention'}
                    </h4>
                    <div class="space-y-3">
                        ${worst.map(r => `
                            <div class="flex justify-between items-center">
                                <span class="font-bold text-slate-700">${r.name}</span>
                                <span class="font-black text-rose-600">${r.gp.toFixed(1)}%</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Cost Efficiency -->
                <div class="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100 text-[11px]">
                    <h4 class="text-xs font-black text-indigo-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <i class="fa-solid fa-chart-line"></i> ${isAr ? 'كفاءة التكاليف' : 'Cost Efficiency Logic'}
                    </h4>
                    <p class="text-slate-500 leading-relaxed">
                        ${isAr ? 'يتم تحليل العلاقة بين تكلفة المكونات وسعر البيع لضمان تحقيق هدف الربح (Target Food Cost 28-35%).' : 
                        'Analyzing the ratio between BOM cost and sales price to ensure target food cost (28-35%) is achieved.'}
                    </p>
                </div>
            </div>
        `;
    },

    resetForm() {
        this.tempIngredients = [];
        this.activeId = null;
    },

    addNew() {
        this.resetForm();
        this.showAddModal();
        setTimeout(() => {
            const randomId = 'R-' + Math.floor(Math.random() * 90000 + 10000);
            $('#rec-code').val(randomId);
        }, 150);
    },

    showAddModal() {
        const isAr = STATE.lang === 'ar';
        const items = STATE.db.Items || [];
        const posItems = STATE.db.Menu_POS || [];
        const subRecipes = (STATE.db.Recipes || []).filter(r => r[6] === 'Sub');
        
        const body = `
            <div class="flex flex-col h-[91vh] bg-white ${isAr ? 'text-right' : 'text-left'}" dir="${isAr ? 'rtl' : 'ltr'}">
                <!-- SLIM HEADER -->
                <div class="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0 shadow-lg border-b border-indigo-500/20">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-lg shadow-lg border border-indigo-400/20">
                            <i class="fa-solid fa-microchip"></i>
                        </div>
                        <div>
                            <h3 class="text-lg font-black tracking-tight leading-none mb-1">${isAr ? 'مهندس الوصفات EZEM' : 'EZEM Recipe Engine'}</h3>
                            <p class="text-[8px] text-slate-400 font-black uppercase tracking-[0.2em]">${isAr ? 'قائمة المكونات والتكاليف' : 'REAL-TIME BOM & COSTING'}</p>
                        </div>
                    </div>
                </div>

                <!-- SCROLLABLE CONTENT (STAKED SLIM) -->
                <div class="flex-1 overflow-y-auto p-4 pb-20 space-y-4 custom-scrollbar bg-white" id="recipe-modal-scrollable">
                    
                    <!-- 1. Primary Config (Full Width) -->
                    <div class="grid grid-cols-6 gap-3">
                        <div class="col-span-2">
                            <label class="block text-[7px] font-black text-slate-400 mb-1 uppercase tracking-widest">Type / Category</label>
                            <select id="rec-type" onchange="Recipes.toggleTitleType(this.value)" class="input-premium font-black text-[10px] h-9 bg-slate-50">
                                <option value="Standard">Standard (Menu POS Item)</option>
                                <option value="Sub">Sub-Recipe (Prep/Sauce)</option>
                                <option value="RTE">Ready to Eat (RTE)</option>
                                <option value="Packing">Packaging / Box Prep</option>
                            </select>
                        </div>
                        <div class="col-span-1">
                            <label class="block text-[7px] font-black text-slate-400 mb-1 uppercase tracking-widest">Code</label>
                            <input type="text" id="rec-code" class="input-premium font-black text-[10px] h-9 text-center" placeholder="R-001">
                        </div>
                        <div class="col-span-3">
                            <label class="block text-[7px] font-black text-slate-400 mb-1 uppercase tracking-widest">Production Title (Link to POS)</label>
                            <div id="title-input-container">
                                <select id="rec-pos-select" class="w-full input-premium h-9 font-black text-[10px]"></select>
                                <input type="text" id="rec-name" class="hidden input-premium font-black text-[10px] h-9" placeholder="Enter name...">
                            </div>
                        </div>

                        <div class="col-span-2">
                            <label class="block text-[7px] font-black text-indigo-500 mb-1 uppercase tracking-widest">Harvest Qty & Unit</label>
                            <div class="flex gap-1">
                                <input type="number" id="rec-batch" class="w-1/2 input-premium input-blue-soft font-black text-center h-9 bg-indigo-50/30" value="1" min="0.1" step="0.1" oninput="Recipes.updateTempTable()">
                                <select id="rec-unit" class="w-1/2 input-premium font-black text-[9px] h-9 bg-indigo-50/30">
                                    <option value="Each">Each</option>
                                    <option value="Pcs">Pcs</option>
                                    <option value="Kg">Kg</option>
                                    <option value="Gm">Gm</option>
                                    <option value="Liter">Liter</option>
                                    <option value="Ml">Ml</option>
                                    <option value="Portion">Portion</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-span-2">
                            <label class="block text-[7px] font-black text-slate-400 mb-1 uppercase tracking-widest">Product Nature</label>
                            <select id="rec-product-type" class="input-premium font-black text-[10px] h-9 bg-slate-50">
                                <option value="Recipe">${isAr ? 'وصفة' : 'Recipe'}</option>
                                <option value="Manufacturing">${isAr ? 'تصنيع' : 'Manufacturing'}</option>
                                <option value="Ready to Sell">${isAr ? 'منتج جاهز للبيع' : 'Ready to Sell'}</option>
                            </select>
                        </div>
                        <div class="col-span-2">
                            <label class="block text-[7px] font-black text-rose-500 mb-1 uppercase tracking-widest">Overhead $</label>
                            <input type="number" id="rec-overhead" class="input-premium input-blue-soft font-black text-center h-9 bg-rose-50/30" value="0" step="0.1" oninput="Recipes.updateTempTable()">
                        </div>
                        <div class="col-span-2">
                            <label class="block text-[7px] font-black text-emerald-500 mb-1 uppercase tracking-widest">Listing price</label>
                            <input type="number" id="rec-price" class="input-premium input-blue-soft font-black text-center h-9 bg-emerald-50/30" value="0" oninput="Recipes.updateTempTable()">
                        </div>
                    </div>

                    <!-- 2. Component Injector (Full Width Below) -->
                    <div class="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 shadow-sm">
                        <label class="block text-[8px] font-black text-indigo-500 mb-2 uppercase tracking-[0.2em] border-b border-indigo-200/50 pb-1">BOM Construction Injector</label>
                        
                        <div class="flex gap-3 items-end">
                            <div class="flex-[3]">
                                <label class="block text-[7px] font-black text-indigo-400 mb-1 uppercase tracking-widest">Material / Sub-Prep Selection</label>
                                <select id="ing-select" class="w-full input-premium h-9 text-[10px] font-bold bg-white">
                                    <optgroup label="Direct Ingredients">
                                        ${items.map(i => {
                                            const y = i[8] || 100;
                                            return `<option value="itm_${i[2]}" data-type="item" data-name="${i[3]}" data-cost="${i[5]}" data-unit="${i[4]}" data-yield="${y}">[${i[2]}] ${i[3]} (${y}%)</option>`;
                                        }).join('')}
                                    </optgroup>
                                    <optgroup label="Integrated Sub-Recipes">
                                        ${subRecipes.map(r => `<option value="rec_${r[0]}" data-type="recipe" data-name="${r[1]}" data-cost="${r[3]}" data-unit="Portion" data-yield="100">[${r[0]}] ${r[1]} (${Utils.formatCurrency(r[3])})</option>`).join('')}
                                    </optgroup>
                                    <option value="NEW_ITEM" class="font-black text-rose-600">➕ ${isAr ? 'إضافة صنف جديد (غير موجود)...' : 'ADD NEW ITEM (NOT IN LIST)...'}</option>
                                </select>
                            </div>

                            <div class="flex-1">
                                <label class="block text-[7px] font-black text-indigo-400 mb-1 uppercase tracking-widest">Batch Usage Qty</label>
                                <input type="number" id="ing-qty" class="w-full input-premium input-blue-soft h-9 text-center font-black text-[10px]" placeholder="0.00">
                            </div>
                            <div class="w-16">
                                <label class="block text-[7px] font-black text-emerald-600 mb-1 uppercase tracking-widest">Fixed Yield</label>
                                <input type="number" id="ing-yield" readonly tabindex="-1" class="w-full input-premium h-9 text-center font-black text-emerald-700 bg-emerald-50/40 border-emerald-100 opacity-80 cursor-not-allowed text-[10px]" value="100">
                            </div>
                            <button onclick="Recipes.addIngredient()" class="px-8 h-9 bg-slate-900 text-white rounded-lg hover:bg-indigo-600 transition-all font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-2">
                                <span>Add to BOM</span>
                                <i class="fa-solid fa-plus text-[8px]"></i>
                            </button>
                        </div>
                    </div>

                    <!-- BOM Table -->
                    <div class="rounded-2xl border border-slate-100 overflow-hidden shadow-premium bg-white">
                        <table class="w-full text-left text-[11px] border-collapse">
                            <thead class="bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 sticky top-0 z-10">
                                <tr>
                                    <th class="p-4">Manufacturing Component</th>
                                    <th class="p-4 text-center">Batch Qty</th>
                                    <th class="p-4 text-center">Yield %</th>
                                    <th class="p-4 text-center">Net Price</th>
                                    <th class="p-4 text-center">Sub-Total</th>
                                    <th class="p-4"></th>
                                </tr>
                            </thead>
                            <tbody id="temp-ing-body" class="divide-y divide-slate-50"></tbody>
                        </table>
                    </div>
                </div>

                <!-- SLIM FOOTER Dashboard -->
                <div class="p-5 bg-slate-50 border-t border-slate-100 shrink-0">
                    <div class="flex justify-between items-center">
                        <div class="flex gap-10">
                             <div>
                                <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Batch BOM</p>
                                <h4 id="rec-batch-cost" class="text-xl font-black text-slate-800 leading-none">0.00</h4>
                            </div>
                            <div class="px-8 border-x border-slate-200">
                                <p class="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1">Unit Cost</p>
                                <h4 id="rec-unit-cost" class="text-xl font-black text-indigo-600 leading-none underline decoration-double underline-offset-4">0.00</h4>
                            </div>
                            <div>
                                <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Profitability</p>
                                <h4 id="est-gp" class="text-xl font-black text-slate-300 leading-none">N/A</h4>
                            </div>
                        </div>
                        <button id="save-recipe-btn" onclick="Recipes.save()" class="h-12 px-10 bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase tracking-[0.15em] shadow-xl hover:bg-indigo-600 hover:scale-105 transition-all flex items-center gap-3">
                            <span>Execute Build</span>
                            <i class="fa-solid fa-bolt-lightning text-xs"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        Utils.openModal(body, 'max-w-4xl');
        
        // Listener to pull default yield from item data + Initialize Select2
        setTimeout(() => {
            const $ingSel = $('#ing-select');
            const $posSel = $('#rec-pos-select');
            
            // Fix for Select2 in Modal: dropdownParent ensures it stays inside the modal
            if($.fn.select2) {
                $ingSel.select2({
                    dropdownParent: $('#modal-content'),
                    dir: isAr ? 'rtl' : 'ltr',
                    width: '100%'
                });
                
                // Content for POS Select
                const posOptions = posItems.map(i => `<option value="${i[2]}" data-name="${i[3]}" data-price="${i[4]}">${i[3]} (#${i[2]})</option>`).join('');
                $posSel.html(`<option value="">-- ${isAr ? 'اختر من المنيو' : 'Select POS Item'} --</option>` + posOptions);
                $posSel.select2({
                    dropdownParent: $('#modal-content'),
                    dir: isAr ? 'rtl' : 'ltr',
                    width: '100%'
                });
                
                $posSel.on('change', function() {
                    const opt = this.options[this.selectedIndex];
                    if(opt && opt.value) {
                        $('#rec-code').val(opt.value).prop('disabled', true); // Disable code input when linked to POS
                        $('#rec-name').val(opt.getAttribute('data-name'));
                        $('#rec-price').val(opt.getAttribute('data-price'));
                        Recipes.updateTempTable();
                    } else {
                        $('#rec-code').val('').prop('disabled', false); // Enable if no POS item selected
                        $('#rec-name').val('');
                        $('#rec-price').val('0');
                        Recipes.updateTempTable();
                    }
                });
            }

            $ingSel.on('change', function() {
                const val = $(this).val();
                if (val === 'NEW_ITEM') {
                    Recipes.quickAddNewItem();
                    $(this).val('').trigger('change');
                    return;
                }
                const opt = this.options[this.selectedIndex];
                if(opt) {
                    const yld = opt.getAttribute('data-yield') || 100;
                    $('#ing-yield').val(yld);
                    // UX: Auto-focus Qty after selecting item
                    setTimeout(() => $('#ing-qty').focus(), 100);
                }
            });

            // Smart Lookup on Code
            $('#rec-code').on('input', function() {
                const code = $(this).val();
                if(code.length >= 3) {
                    const match = (STATE.db.Menu_POS || []).find(i => String(i[2]) === String(code));
                    if(match) {
                        $('#rec-type').val('Standard').trigger('change');
                        $('#rec-pos-select').val(match[2]).trigger('change');
                        Utils.toast(isAr ? 'تم التعرف على الصنف!' : 'Item Found!');
                    }
                }
            });

            // Enter key listener for Qty and Yield
            $('#ing-qty, #ing-yield').on('keypress', function(e) {
                if (e.which === 13) {
                    Recipes.addIngredient();
                }
            });

            // Initial call to toggleTitleType to set up the correct input field
            this.toggleTitleType($('#rec-type').val());
        }, 300);

        this.updateTempTable();
    },

    toggleTitleType(type) {
        if(type === 'Standard') {
            $('#rec-pos-select').next('.select2-container').show();
            $('#rec-name').addClass('hidden');
            $('#rec-code').prop('disabled', true); // Code is linked to POS item
            // Clear name and price if not linked to POS yet
            if(!$('#rec-pos-select').val()) {
                $('#rec-name').val('');
                $('#rec-price').val('0');
            }
        } else {
            $('#rec-pos-select').next('.select2-container').hide();
            $('#rec-name').removeClass('hidden');
            $('#rec-code').prop('disabled', false); // Code can be manually entered
            const randomCode = 'R-' + Math.floor(Math.random() * 90000 + 10000);
            $('#rec-code').val(randomCode);
            $('#rec-name').val(''); // Clear name when switching to non-standard
            $('#rec-price').val('0'); // Clear price when switching to non-standard
        }
        this.updateTempTable(); // Recalculate GP if price changed
    },

    addIngredient() {
        const sel = document.getElementById('ing-select');
        const opt = sel.options[sel.selectedIndex];
        if(!opt || !opt.value) return;
        
        const qty = parseFloat($('#ing-qty').val()) || 0;
        const yieldVal = parseFloat($('#ing-yield').val()) || 100;
        if(qty <= 0) return;

        const val = opt.value;
        const type = opt.getAttribute('data-type');
        const name = opt.getAttribute('data-name');
        const cost = parseFloat(opt.getAttribute('data-cost')) || 0;
        const unit = opt.getAttribute('data-unit');

        const existing = this.tempIngredients.find(i => i.id === val);
        if(existing) {
            existing.qty += qty;
        } else {
            this.tempIngredients.push({ id: val, type, name, qty, cost, unit, yield: yieldVal });
        }

        $('#ing-qty').val('');
        $('#ing-yield').val('100');
        this.updateTempTable();
    },

    removeIngredient(idx) {
        this.tempIngredients.splice(idx, 1);
        this.updateTempTable();
    },

    updateQty(idx, val) {
        this.tempIngredients[idx].qty = parseFloat(val) || 0;
        this.updateTempTable();
    },

    updateIngredientYield(idx, val) {
        this.tempIngredients[idx].yield = parseFloat(val) || 100;
        this.updateTempTable();
    },

    updateTempTable() {
        let totalBatch = 0;
        const batchSize = parseFloat($('#rec-batch').val()) || 1;
        const overhead = parseFloat($('#rec-overhead').val()) || 0;

        const html = this.tempIngredients.map((i, idx) => {
            // Live Update from Master DB to ensure freshest data
            const dbId = i.id.includes('_') ? i.id.split('_')[1] : i.id;
            const dbItem = i.type === 'item' ? 
                STATE.db.Items.find(x => x[2] === dbId) : 
                STATE.db.Recipes.find(x => x[0] === dbId);
            
            if(dbItem) {
                i.name = i.type === 'item' ? dbItem[3] : dbItem[1];
                i.unit = i.type === 'item' ? (dbItem[4] || 'Unit') : 'Portion';
                i.cost = parseFloat(i.type === 'item' ? dbItem[5] : dbItem[3]) || 0;
            }

            const freshCost = i.cost || 0;
            const usageYield = (i.yield || 100) / 100;
            const netPrice = freshCost / usageYield;
            const lineTotal = i.qty * netPrice;
            totalBatch += lineTotal;

            return `
                <tr class="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td class="p-4">
                        <div class="flex flex-col">
                            <span class="font-bold text-slate-700">${i.name || 'Unknown'} ${i.type === 'recipe' ? '⚡' : ''}</span>
                            <span class="text-[9px] text-slate-400 font-bold uppercase tracking-widest">${i.unit || '---'}</span>
                        </div>
                    </td>
                    <td class="p-4 text-center">
                        <input type="number" value="${i.qty}" onchange="Recipes.updateQty(${idx}, this.value)" 
                            class="w-16 h-8 bg-slate-50 border border-slate-200 rounded-lg text-center font-black text-slate-800 focus:border-indigo-500 outline-none transition-all">
                    </td>
                    <td class="p-4 text-center">
                        <div class="inline-flex items-center justify-center px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full font-black text-[10px] border border-emerald-100">
                            ${i.yield || 100}%
                        </div>
                    </td>
                    <td class="p-4 text-center">
                        <div class="flex flex-col">
                            <span class="text-slate-800 font-bold">${netPrice.toFixed(2)}</span>
                            <span class="text-[8px] text-slate-400 font-bold">Base: ${freshCost.toFixed(2)}</span>
                        </div>
                    </td>
                    <td class="p-4 text-center font-black text-slate-900">${lineTotal.toFixed(2)}</td>
                    <td class="p-4 text-center">
                        <button onclick="Recipes.removeIngredient(${idx})" class="w-7 h-7 flex items-center justify-center rounded-full bg-rose-50 text-rose-300 hover:bg-rose-500 hover:text-white transition-all"><i class="fa-solid fa-times"></i></button>
                    </td>
                </tr>
            `;
        }).join('');
        
        const totalWithOverhead = totalBatch + overhead;
        const unitCost = totalWithOverhead / batchSize;

        const body = document.getElementById('temp-ing-body');
        if(body) body.innerHTML = html || `<tr><td colspan="6" class="p-12 text-center text-slate-300 italic text-[10px] font-black uppercase tracking-widest">Construct your BOM by adding materials above</td></tr>`;
        
        $('#rec-batch-cost').text(totalWithOverhead.toFixed(2));
        $('#rec-unit-cost').text(unitCost.toFixed(2));

        // Update GP
        const price = parseFloat($('#rec-price').val()) || 0;
        if(price > 0) {
            const gp = ((price - unitCost) / price * 100).toFixed(1);
            $('#est-gp').text(gp + '%');
            $('#est-gp').removeClass('text-rose-500 text-emerald-500 text-slate-300')
                      .addClass(gp > 35 ? 'text-emerald-500' : (gp > 0 ? 'text-blue-500' : 'text-rose-500'));
        } else {
            $('#est-gp').text('N/A').removeClass('text-rose-500 text-emerald-500 text-blue-500').addClass('text-slate-300');
        }
    },

    async save() {
        const cost = parseFloat($('#rec-unit-cost').text());
        const data = {
            id: $('#rec-code').val(),
            name: $('#rec-name').val(),
            ingredients: JSON.stringify(this.tempIngredients),
            cost: cost,
            price: parseFloat($('#rec-price').val()) || 0,
            type: $('#rec-type').val(),
            productType: $('#rec-product-type').val(),
            batchSize: parseFloat($('#rec-batch').val()) || 1,
            overhead: parseFloat($('#rec-overhead').val()) || 0,
            unit: $('#rec-unit').val()
        };

        if(!data.id || !data.name) return Swal.fire('Field Missing', 'Production Name and Code are required', 'warning');

        Utils.loading(true, 'Publishing Engineering Data...');
        try {
            const existing = (STATE.db.Recipes || []).find(r => String(r[0]) === String(data.id));
            if(existing) {
                // If recipe with this ID already exists, update it instead of adding a new one
                await this.updateRecipe(data.id);
                return;
            }

            await API.call('ADD_RECORD', {
                sheet: 'Recipes',
                data: [data.id, data.name, data.ingredients, data.cost, STATE.user.name, data.price, data.type, data.productType, data.batchSize, data.overhead, data.unit]
            });
            
            // Sync to Menu POS if Standard
            if(data.type === 'Standard') {
                // Find the POS item by its code (which is also the recipe ID for standard recipes)
                const existingMenuPosItem = STATE.db.Menu_POS.find(m => String(m[2]) === String(data.id));
                if (existingMenuPosItem) {
                    // Update the existing Menu POS item to link the recipe and update cost
                    const menuData = {
                        sheet: 'Menu POS',
                        id: data.id,
                        idIndex: 2, // Search by Code (Index 2)
                        updates: [
                            { col: 5, val: data.cost }, // Set Cost at index 5
                            { col: 6, val: data.id },    // Set RecipeID at index 6
                            { col: 7, val: data.productType }
                        ]
                    };
                    await API.call('UPDATE_RECORD', menuData);
                } else {
                    // If no existing POS item, create one
                    const menuData = {
                        group: 'Main',
                        category: 'Recipe',
                        name: data.name,
                        code: data.id,
                        price: data.price,
                        cost: data.cost,
                        unit: 'Each',
                        recipeId: data.id,
                        type: data.productType,
                        sheet: 'Menu POS'
                    };
                    await API.call('ADD_PRODUCT', menuData);
                }
            }

            await App.syncData(true);
            Utils.loading(false);
            Utils.closeModal();
            this.render();
            Utils.toast('Recipe Published Successfully');
        } catch(e) { 
            Utils.loading(false);
            Swal.fire('System Failure', e.toString(), 'error'); 
        }
    },

    editRecipe(id) {
        const r = STATE.db.Recipes.find(x => String(x[0]) === String(id));
        if(!r) return;
        this.resetForm();
        this.activeId = id;
        
        try {
            this.tempIngredients = JSON.parse(r[2] || '[]');
        } catch(e) { 
            this.tempIngredients = [];
        }

        this.showAddModal();
        
        // Fill data
        setTimeout(() => {
            const type = r[6] || 'Standard';
            $('#rec-type').val(type);
            this.toggleTitleType(type);
            
            $('#rec-code').val(r[0]).prop('disabled', true);
            $('#rec-name').val(r[1]);
            
            if(type === 'Standard') {
                $('#rec-pos-select').val(r[0]).trigger('change');
            }
            
            $('#rec-price').val(r[5]);
            $('#rec-product-type').val(r[7] || 'Recipe');
            $('#rec-batch').val(r[8] || 1);
            $('#rec-overhead').val(r[9] || 0);
            $('#rec-unit').val(r[10] || 'Each');

            // Also check Menu POS type if available
            const posItem = (STATE.db.Menu_POS || []).find(p => String(p[2]) === String(r[0]));
            if(posItem && posItem[7]) {
                $('#rec-product-type').val(posItem[7]);
            }
            
            this.updateTempTable();

            const btn = document.getElementById('save-recipe-btn');
            if(btn) {
                btn.innerHTML = `<span>Update Master Snapshot</span> <i class="fa-solid fa-sync"></i>`;
                btn.setAttribute('onclick', `Recipes.updateRecipe('${id}')`);
            }
        }, 300);
    },

    async updateRecipe(id) {
        const unitCost = parseFloat($('#rec-unit-cost').text());
        const productType = $('#rec-product-type').val();
        const data = {
            sheet: 'Recipes',
            id: id,
            idIndex: 0,
            updates: [
                { col: 1, val: $('#rec-name').val() },
                { col: 2, val: JSON.stringify(this.tempIngredients) },
                { col: 3, val: unitCost },
                { col: 5, val: parseFloat($('#rec-price').val()) },
                { col: 6, val: $('#rec-type').val() },
                { col: 7, val: productType },
                { col: 8, val: parseFloat($('#rec-batch').val()) || 1 },
                { col: 9, val: parseFloat($('#rec-overhead').val()) || 0 },
                { col: 10, val: $('#rec-unit').val() }
            ]
        };
        
        Utils.loading(true, 'Synchronizing Changes...');
        try {
            await API.call('UPDATE_RECORD', data);
            
            // Sync to Menu POS if Standard
            if($('#rec-type').val() === 'Standard') {
                const existingMenu = STATE.db.Menu_POS.find(m => String(m[2]) === String(id));
                if (existingMenu) {
                    const menuData = {
                        sheet: 'Menu POS',
                        id: id,
                        idIndex: 2, 
                        updates: [
                            { col: 3, val: $('#rec-name').val() },
                            { col: 4, val: parseFloat($('#rec-price').val()) },
                            { col: 5, val: unitCost },
                            { col: 6, val: id },
                            { col: 7, val: productType }
                        ]
                    };
                    await API.call('UPDATE_RECORD', menuData);
                } else {
                    const menuData = {
                        group: 'Main',
                        category: 'Recipe',
                        name: $('#rec-name').val(),
                        code: id,
                        price: parseFloat($('#rec-price').val()),
                        cost: unitCost,
                        unit: 'Each',
                        recipeId: id,
                        type: productType,
                        sheet: 'Menu POS'
                    };
                    await API.call('ADD_PRODUCT', menuData);
                }
            }

            await App.syncData(true);
            Utils.loading(false);
            Utils.closeModal();
            this.render();
            Utils.toast('BOM Synchronized');
        } catch(e) { 
            Utils.loading(false);
            Swal.fire('Update Failed', e.toString(), 'error'); 
        }
    },

    quickAddNewItem() {
        const isAr = STATE.lang === 'ar';
        Swal.fire({
            title: isAr ? 'إضافة صنف خام جديد' : 'Add New Raw Item',
            html: `
                <div class="space-y-3 pt-4">
                    <input id="swal-item-name" class="input-premium h-11 text-xs" placeholder="${isAr ? 'اسم الصنف' : 'Item Name'}">
                    <div class="grid grid-cols-2 gap-2">
                        <input id="swal-item-code" class="input-premium h-11 text-xs" placeholder="${isAr ? 'الكود (اختياري)' : 'Code (Optional)'}">
                        <select id="swal-item-unit" class="input-premium h-11 text-[11px]">
                            <option value="Kg">Kg</option><option value="Gm">Gm</option><option value="Portion">Portion</option>
                            <option value="Liter">Liter</option><option value="Pcs">Pcs</option>
                        </select>
                    </div>
                    <input id="swal-item-cost" type="number" class="input-premium h-11 text-xs" placeholder="${isAr ? 'تكلفة الشراء' : 'Purchase Cost'}">
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: isAr ? 'حفظ وإضافة للوصفة' : 'Save & Add to BOM',
            preConfirm: () => {
                const name = $('#swal-item-name').val();
                const code = $('#swal-item-code').val() || ('RM-' + Math.floor(Math.random()*9000));
                const cost = parseFloat($('#swal-item-cost').val()) || 0;
                const unit = $('#swal-item-unit').val();
                if(!name) return Swal.showValidationMessage('Name is required');
                return { name, code, cost, unit };
            }
        }).then(async (res) => {
            if(res.isConfirmed) {
                const d = res.value;
                Utils.loading(true);
                try {
                    await API.call('ADD_RECORD', {
                        sheet: 'Items',
                        data: ['Raw', 'Recipe Entry', d.code, d.name, d.unit, d.cost, '', 0, 100, 100, 10, 'Active']
                    });
                    await App.syncData(true);
                    Utils.loading(false);
                    this.tempIngredients.push({ id: `itm_${d.code}`, type: 'item', name: d.name, qty: 0, cost: d.cost, unit: d.unit, yield: 100 });
                    this.updateTempTable();
                    this.showAddModal();
                } catch(e) { Swal.fire('Error', e.toString(), 'error'); }
            }
        });
    },

    async deleteItem(id) {
        const res = await Swal.fire({ title: __('confirm'), icon: 'warning', showCancelButton: true });
        if (res.isConfirmed) {
            Utils.loading(true, __('processing'));
            try {
                await API.call('DELETE_RECORD', { sheet: 'Recipes', id: id, idIndex: 0 });
                await API.call('DELETE_RECORD', { sheet: 'Menu POS', id: id, idIndex: 6 });
                await App.syncData();
                this.render();
                Utils.toast(__('success'));
            } catch(e) { Swal.fire(__('error'), e.toString(), 'error'); }
            finally { Utils.loading(false); }
        }
    }
};
