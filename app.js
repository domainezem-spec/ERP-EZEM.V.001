/**
 * ERP-EZEM Main Application Controller
 */

const App = {
    async init() {
        console.log("🚀 Initializing Core Systems...");
        
        try {
            this.updateBootProgress(20, 'Loading Modules...');
            
            // Check if user is logged in
            if (!STATE.user) {
                this.updateBootProgress(60, 'Security Handshake...');
                setTimeout(() => this.showLogin(), 800);
                return;
            }

            // 1. Initial Data Sync
            this.updateBootProgress(40, 'Fetching Enterprise Data...');
            await this.syncData();
            this.updateBootProgress(80, 'Assembling UI Components...');

            // 2. Setup Initial UI
            this.applyLanguage();
            Sidebar.render();
            AIAdvisor.init();
            Router.navigate(STATE.activeView);
            Utils.setupEnterNavigation();
            this.updateBootProgress(100, 'System Ready');

            // 3. Remove Loader
            setTimeout(() => {
                $('#loader').fadeOut(500, () => {
                    $('#app').removeClass('hidden').addClass('animate-fade-in');
                });
            }, 500);

            console.log("✅ System Ready.");
        } catch (error) {
            console.error("❌ Initialization Failed:", error);
            Swal.fire('خطأ في النظام', 'فشل تحميل البيانات الأساسية، يرجى إعادة المحاولة أو تسجيل الدخول مرة أخرى.', 'error')
                .then(() => Auth.logout());
        }
    },

    updateBootProgress(percent, status) {
        $('#boot-progress').css('width', percent + '%');
        $('#boot-status').text(percent + '% ' + status);
    },

    showLogin() {
        $('#loader').fadeOut(500, () => {
            $('#login-container').removeClass('hidden').addClass('animate-fade-in');
            Auth.init();
        });
    },

    async syncData(manual = false, navigate = true) {
        if (manual) {
            const isAr = STATE.lang === 'ar';
            Utils.loading(true, isAr ? 'جاري مزامنة البيانات من السيرفر...' : 'Syncing Enterprise Data...', true);
        }
        
        // --- TURBO SYNC BYPASS (Halves Save Time) ---
        if (Date.now() - (STATE.lastTurboSync || 0) < 5000) {
            console.log("⚡ Turbo Sync Bypass: DB is already fresh");
            if (manual) {
                Utils.loading(false);
                Utils.toast(STATE.lang === 'ar' ? 'تم تحديث البيانات' : 'Data Updated');
                if (navigate && STATE.activeView) setTimeout(() => Router.navigate(STATE.activeView), 50);
            }
            return true;
        }

        console.log("📡 Syncing with Server...");
        try {
            const response = await API.call('INIT_DATA');
            if(response.status === 'success') {
                STATE.db = response.db;
                if (manual) {
                    Utils.loading(false);
                    Utils.toast(STATE.lang === 'ar' ? 'تمت المزامنة بنجاح' : 'Sync Successful');
                    if (navigate && STATE.activeView) Router.navigate(STATE.activeView);
                }
                return true;
            }
            throw new Error(response.message);
        } catch (error) {
            if (manual) {
                Utils.loading(false);
                Swal.fire(STATE.lang === 'ar' ? 'خطأ' : 'Error', (STATE.lang === 'ar' ? 'فشل المزامنة: ' : 'Sync failed: ') + error.message, 'error');
            } else {
                console.error("Sync failed", error);
            }
            throw error;
        }
    },

    applyLanguage() {
        const lang = STATE.lang || 'ar';
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        
        // Toggle Sidebar Position via CSS class on body
        if (lang === 'en') {
            $('body').addClass('ltr-mode').removeClass('rtl-mode');
        } else {
            $('body').addClass('rtl-mode').removeClass('ltr-mode');
        }
    },

    setLanguage(lang) {
        STATE.lang = lang;
        localStorage.setItem('ezem_lang', lang);
        this.applyLanguage();
        Sidebar.render();
        Header.render();
        Router.navigate(STATE.activeView);
    },

    toggleSidebar() {
        $('#sidebar-container').toggleClass('collapsed');
    }
};

// Start the APP
document.addEventListener('DOMContentLoaded', () => App.init());
