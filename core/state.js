/**
 * GLOBAL STATE MANAGEMENT
 */

const STATE = {
    user: JSON.parse(localStorage.getItem('ezem_user')) || null,
    lang: localStorage.getItem('ezem_lang') || 'ar',
    db: {},
    activeView: 'dash',
    cart: [],
    
    // Updates the state and triggers UI refresh if needed
    update(key, value) {
        this[key] = value;
        console.log(`🔄 State Updated: ${key}`, value);
        // Add UI refresh logic here
    },

    isLoggedIn() {
        return this.user !== null;
    }
};
