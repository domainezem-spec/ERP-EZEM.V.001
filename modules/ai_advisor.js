/**
 * AI STRATEGIC ADVISOR
 * Premium AI interface for business insights
 */
const AIAdvisor = {
    isOpen: false,

    init() {
        this.renderFloatingButton();
    },

    renderFloatingButton() {
        const id = 'ai-floating-trigger';
        if (document.getElementById(id)) return;

        const btn = document.createElement('div');
        btn.id = id;
        btn.className = 'fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 active:scale-95 transition-all z-[9999] group animate-bounce-slow';
        btn.innerHTML = `
            <div class="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
            <i class="fa-solid fa-brain text-xl group-hover:rotate-12 transition-transform"></i>
            <div class="absolute right-full mr-4 bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest">
                ${STATE.lang === 'ar' ? 'اسأل مساعد الذكاء الاصطناعي' : 'Ask AI Advisor'}
            </div>
        `;
        btn.onclick = () => this.toggleChat();
        document.body.appendChild(btn);
    },

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    },

    openChat() {
        const isAr = STATE.lang === 'ar';
        this.isOpen = true;
        
        const chatHtml = `
            <div id="ai-chat-window" class="fixed bottom-24 right-6 w-[350px] max-w-[90vw] h-[500px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden z-[9998] animate-slide-up">
                <!-- Header -->
                <div class="p-6 bg-slate-900 text-white flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <i class="fa-solid fa-robot text-lg"></i>
                        </div>
                        <div>
                            <div class="text-[11px] font-black uppercase tracking-widest leading-none mb-1">EZEM Intelligence</div>
                            <div class="text-[9px] text-emerald-400 font-bold uppercase tracking-tight flex items-center gap-1">
                                <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                ${isAr ? 'متصل وحاضر' : 'Online & Ready'}
                            </div>
                        </div>
                    </div>
                    <button onclick="AIAdvisor.closeChat()" class="w-8 h-8 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <!-- Messages area -->
                <div id="ai-messages" class="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-50/50">
                    <div class="ai-msg bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm text-[11px] font-bold text-slate-700 leading-relaxed max-w-[85%]">
                        ${isAr ? `مرحباً ${STATE.user.name}، أنا مستشارك الذكي. كيف يمكنني مساعدتك اليوم في تتبع مبيعاتك أو مخزونك؟` : `Hello ${STATE.user.name}, I am your Strategic AI Advisor. How can I help you analyze your performance today?`}
                    </div>
                </div>

                <!-- Input area -->
                <div class="p-4 bg-white border-t border-slate-100">
                    <div class="relative">
                        <input type="text" id="ai-input" placeholder="${isAr ? 'اطرح سؤالك هنا...' : 'Ask something...'}" 
                            class="w-full h-12 ${isAr ? 'pr-4 pl-12 text-right' : 'pl-4 pr-12 text-left'} bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-black outline-none focus:border-indigo-500 transition-all">
                        <button onclick="AIAdvisor.sendMessage()" class="absolute ${isAr ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center hover:bg-indigo-700 transition-all active:scale-90">
                            <i class="fa-solid fa-paper-plane text-[10px]"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        const div = document.createElement('div');
        div.id = 'ai-chat-wrapper';
        div.innerHTML = chatHtml;
        document.body.appendChild(div);

        // Enter listener
        document.getElementById('ai-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    },

    closeChat() {
        const win = document.getElementById('ai-chat-window');
        if (win) {
            win.classList.remove('animate-slide-up');
            win.classList.add('animate-slide-down');
            setTimeout(() => {
                const wrapper = document.getElementById('ai-chat-wrapper');
                if (wrapper) wrapper.remove();
                this.isOpen = false;
            }, 300);
        }
    },

    async sendMessage() {
        const input = document.getElementById('ai-input');
        const text = input.value.trim();
        if (!text) return;

        const isAr = STATE.lang === 'ar';
        const msgArea = document.getElementById('ai-messages');

        // Add user message
        const userMsg = document.createElement('div');
        userMsg.className = 'user-msg ml-auto bg-indigo-600 text-white p-4 rounded-2xl rounded-tr-none text-[11px] font-bold leading-relaxed max-w-[85%] text-right';
        userMsg.innerText = text;
        msgArea.appendChild(userMsg);
        
        input.value = '';
        msgArea.scrollTop = msgArea.scrollHeight;

        // Add thinking indicator
        const typing = document.createElement('div');
        typing.className = 'ai-msg bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm text-[11px] font-black text-slate-400 flex items-center gap-2 max-w-[40%]';
        typing.innerHTML = `<span class="animate-bounce">.</span><span class="animate-bounce" style="animation-delay: 0.2s">.</span><span class="animate-bounce" style="animation-delay: 0.4s">.</span>`;
        msgArea.appendChild(typing);
        msgArea.scrollTop = msgArea.scrollHeight;

        try {
            const res = await API.call('ASK_AI', { prompt: text });
            typing.remove();

            const aiMsg = document.createElement('div');
            aiMsg.className = 'ai-msg bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm text-[11px] font-bold text-slate-700 leading-relaxed max-w-[85%] animate-fade-in';
            aiMsg.innerText = res.response;
            msgArea.appendChild(aiMsg);
            
        } catch (error) {
            typing.remove();
            const errImg = document.createElement('div');
            errImg.className = 'ai-msg bg-rose-50 text-rose-500 p-4 rounded-2xl text-[10px] font-bold border border-rose-100';
            errImg.innerText = isAr ? 'عذراً، فشلت في التحدث إلى مساعد الذكاء الاصطناعي. تأكد من إعداد مفتاح API الخاص بـ Gemini.' : 'Error: Could not connect to the AI brain. Ensure Gemini API key is configured.';
            msgArea.appendChild(errImg);
        }

        msgArea.scrollTop = msgArea.scrollHeight;
    }
};
