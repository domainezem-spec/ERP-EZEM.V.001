/**
 * API SERVICE v3.0
 * محرك التواصل المزدوج (Hybrid Connection)
 */

const API_CONFIG = {
    // الرابط الذي زودتني به للربط الخارجي
    URL: "https://script.google.com/macros/s/AKfycbw8jJtbPDQpS4tkVQAaaF3hHy5vjtTSoKQTDPsMPD84MeLILWQrwqEmbeoG5mwWXZU/exec"
};

const API = {
    async call(action, data = {}) {
        const payload = { 
            action, 
            data, 
            user: STATE.user,
            v: "4.0" 
        };

        let res;
        // 1. إذا كان النظام يعمل داخل بيئة Google Script
        if (typeof google !== 'undefined' && google.script && google.script.run) {
            res = await new Promise((resolve, reject) => {
                google.script.run
                    .withSuccessHandler(res => (res.status === 'success' ? resolve(res) : reject(res.message)))
                    .withFailureHandler(err => reject(err))
                    .doPost({ postData: { contents: JSON.stringify(payload) } });
            });
        } else {
            // 2. إذا كان النظام يعمل بشكل مستقل (Standalone/PWA) يستخدم Fetch
            try {
                res = await this.fallbackAjax(payload);
            } catch (e) {
                throw e;
            }
        }

        // --- TURBO SYNC ENGINE ---
        // If the server returned an updated DB, sync it immediately to the local state
        if (res && res.db) {
            STATE.db = res.db;
            STATE.lastTurboSync = Date.now();
            console.log(`⚡ Turbo Sync: DB Refreshed for [${action}]`);
        }

        return res;
    },

    async fallbackAjax(payload) {
        try {
            const response = await fetch(API_CONFIG.URL, {
                method: 'POST',
                mode: 'cors', // Ensure CORS mode
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8', // Use text/plain to avoid preflight
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const res = await response.json();
            if (res.status === 'success') {
                return res;
            } else {
                throw new Error(res.message || 'Server returned error status');
            }
        } catch (error) {
            console.error("🌐 API Connection Error:", error);
            throw new Error(STATE.lang === 'ar' 
                ? "فشل الاتصال بالسيرفر. تأكد من نشر المشروع كـ Web App وتعيين الوصول لـ 'Anyone'." 
                : "Server connection failed. Ensure Web App is deployed to 'Anyone'.");
        }
    }
};
