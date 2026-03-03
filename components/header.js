/**
 * HEADER COMPONENT (PREMIUM LIGHT)
 */
const Header = {
    render(title = "EZEM ULTIMATE") {
        const toggleIcon = STATE.lang === 'ar' ? 'fa-align-right' : 'fa-align-left';
        
        return `
            <div class="flex items-center gap-6">
                <button onclick="App.toggleSidebar()" class="w-10 h-10 rounded-xl hover:bg-slate-50 text-slate-400 flex items-center justify-center transition">
                    <i class="fa-solid ${toggleIcon} text-lg"></i>
                </button>
                <div>
                    <h2 class="text-lg font-black text-slate-800 tracking-tight">${title}</h2>
                    <div class="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                        <i class="fa-regular fa-calendar"></i>
                        <span>${Utils.formatDate(new Date())}</span>
                    </div>
                </div>
            </div>

            <div class="flex items-center gap-4">
                <div class="hidden md:flex items-center bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 gap-3">
                    <div class="text-[10px] font-black text-slate-400 uppercase">${STATE.lang === 'ar' ? 'حالة السيرفر' : 'Server Status'}</div>
                    <div class="flex items-center gap-1.5">
                        <span class="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span class="text-[10px] font-black text-emerald-600">LIVE</span>
                    </div>
                </div>
                
                <button onclick="App.syncData(true)" class="btn btn-outline h-10 px-4 rounded-xl border-slate-100">
                    <i class="fa-solid fa-rotate text-indigo-500"></i>
                    <span class="hidden sm:inline">${__('sync')}</span>
                </button>
                
                <div class="w-px h-8 bg-slate-100 mx-1"></div>
                
                <button onclick="Auth.logout()" class="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                    <i class="fa-solid fa-power-off"></i>
                </button>
            </div>
        `;
    }
};
