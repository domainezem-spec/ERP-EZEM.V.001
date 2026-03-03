/**
 * AUTHENTICATION & PERMISSIONS MANAGER v3.3
 */
const Auth = {
    // Current user profile from STATE
    get profile() {
        return STATE.user;
    },

    // Check if user has permission to VIEW a section
    canView(viewId) {
        if (!this.profile) return false;

        const role = this.profile.role;
        const permsStr = (this.profile.perms || '').toLowerCase().trim();

        // 1. Super Admin / ALL Access check
        if (role === 'Admin' || role === 'Group Super Admin' || permsStr === 'all' || permsStr === '*') return true;
        
        // 2. Public / Common Views
        const publicViews = ['dash', 'profile', 'notifications'];
        if (publicViews.includes(viewId)) return true;

        // 3. Strictly Granular Permissions (If perms field is not empty, it takes priority)
        if (permsStr && permsStr !== '') {
            const myPerms = permsStr.split(',').map(p => p.trim());
            return myPerms.includes(viewId.toLowerCase());
        }

        // 4. Role Defaults (Only if perms field is empty)
        const defaults = {
            'Manager': ['dash','pos','inv','trx','recipes','audit','recon','sales_log','finance','hr','suppliers','users','settings','reports_hub','kds','purchasing','reports'],
            'Cashier': ['pos','sales_log','dash','kds'],
            'Branches': ['pos','inv','trx','audit','recon','dash','sales_log'],
            'Call Center': ['pos','dash','sales_log','reports_hub'],
            'Storekeeper': ['inv','trx','audit','recon','purchasing','suppliers','dash'],
            'Chef': ['kds','recipes','dash','inv'],
            'Accountant': ['finance','reports','purchasing','suppliers','dash','reports_hub','recon','sales_log','hr']
        };

        return !!(defaults[role] && defaults[role].includes(viewId));
    },

    // Check if user has permission to EDIT/DELETE/ADD
    canEdit() {
        if (!this.profile) return false;
        // Edit privileges for Admin, Manager, and Role-specific writers
        const role = (this.profile.role || '').toLowerCase();
        return role.includes('admin') || ['manager', 'accountant'].includes(role) || this.canView('*') || (this.profile.perms || '').toLowerCase() === 'all';
    },

    // Perform Login
    async login(user, pass) {
        if (!user || !pass) {
            Swal.fire('تنبيه', 'يرجى إدخال اسم المستخدم وكلمة المرور', 'warning');
            return;
        }

        const isAr = STATE.lang === 'ar';
        Utils.loading(true, isAr ? 'جاري الاتصال بالسيرفر...' : 'Connecting to Server...', true);
        try {
            const res = await API.call('LOGIN', { user, pass });
            if (res.status === 'success') {
                STATE.user = res.profile;
                localStorage.setItem('ezem_user', JSON.stringify(res.profile));
                
                Utils.loading(false);
                Utils.toast(`أهلاً بك، ${res.profile.name}`);
                
                STATE.cart = [];
                STATE.db = {};
                
                await App.syncData();
                
                $('#login-container').fadeOut(500, () => {
                   $('#app').removeClass('hidden').addClass('animate-fade-in');
                   Sidebar.render();
                   Router.navigate('dash');
                });
            } else {
                Swal.fire('فشل الدخول', res.message, 'error');
            }
        } catch (e) {
            Swal.fire('خطأ', 'فشل الاتصال بالسيرفر، يرجى المحاولة لاحقاً', 'error');
        } finally {
            Utils.loading(false);
        }
    },

    // Logout
    logout() {
        Swal.fire({
            title: 'تسجيل الخروج؟',
            text: "سيتم إنهاء الجلسة والعودة لصفحة الدخول",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            confirmButtonText: 'نعم، خروج',
            cancelButtonText: 'تراجع',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('ezem_user');
                STATE.user = null;
                STATE.db = {};
                STATE.cart = [];
                window.location.reload();
            }
        });
    },

    // Initialize Login Page Listeners
    init() {
        // Prevent double binding by unbinding first
        $('#login-user, #login-pass').off('keypress');
        
        $('#login-user').on('keypress', function(e) {
            if (e.which === 13) {
                e.preventDefault();
                $('#login-pass').focus();
            }
        });
        
        $('#login-pass').on('keypress', function(e) {
            if (e.which === 13) {
                e.preventDefault();
                $('#login-submit-btn').click();
            }
        });
    }
};
