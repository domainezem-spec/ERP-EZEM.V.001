/**
 * UTILITIES & HELPERS
 */
const Utils = {
    formatCurrency(amount) {
        const locale = STATE.lang === 'ar' ? 'ar-EG' : 'en-US';
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: 'EGP',
        }).format(amount || 0);
    },

    formatDate(date) {
        if(!date) return '---';
        const locale = STATE.lang === 'ar' ? 'ar-EG' : 'en-US';
        const d = new Date(date);
        if (isNaN(d)) return String(date);
        const day = d.getDate();
        const year = d.getFullYear();
        const month = new Intl.DateTimeFormat(locale, { month: 'long' }).format(d);
        return `${day}/${month}/${year}`;
    },

    loadingProgress(status, msg) {
        if (status === false || status === 'close') {
            if (this._progressInterval) clearInterval(this._progressInterval);
            
            if (status === 'close') {
                Swal.close();
                return;
            }

            // Success 100%
            const isAr = STATE.lang === 'ar';
            Swal.fire({
                title: '<span class="text-emerald-500 font-black">100%</span>',
                html: `<div class="text-xs text-slate-500 mt-2">${isAr ? 'تم ترحيل البيانات بنجاح' : 'Data Processed Successfully'}</div>`,
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
                background: '#0f172a'
            });
            return;
        }

        const isAr = STATE.lang === 'ar';
        const defaultMsg = isAr ? 'جاري ترحيل البيانات...' : 'Posting Transaction...';
        
        let progress = 0;
        Swal.fire({
            title: `<span class="text-blue-500 font-black text-lg">${msg || defaultMsg}</span>`,
            html: `
                <div class="w-full bg-slate-800 rounded-full h-3 mb-2 mt-4 overflow-hidden border border-slate-700">
                    <div id="swal-progress-bar" class="bg-blue-500 h-3 rounded-full transition-all duration-300" style="width: 0%"></div>
                </div>
                <div id="swal-progress-text" class="text-xs text-slate-400 font-bold mb-2">0%</div>
            `,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            background: '#0f172a',
            color: '#fff',
            didOpen: () => {
                this._progressInterval = setInterval(() => {
                    progress += Math.floor(Math.random() * 15) + 5; // Jump by 5-20%
                    if (progress > 96) progress = 96; // Hold at 96% until done
                    
                    const bar = document.getElementById('swal-progress-bar');
                    const text = document.getElementById('swal-progress-text');
                    
                    if (bar && text) {
                        bar.style.width = progress + '%';
                        text.innerText = progress + '%';
                    }
                }, 350);
            }
        });
    },

    loading(show, msg, useProgress = false) {
        if(show) {
            if (useProgress) {
                this.loadingProgress(true, msg);
                return;
            }
            const isAr = STATE.lang === 'ar';
            const defaultMsg = isAr ? 'جاري المعالجة الذكية...' : 'Processing...';
            const secondaryMsg = isAr ? 'يرجى عدم إغلاق النافذة...' : 'Please do not close the window...';
            
            Swal.fire({
                title: `<span class="text-blue-500 font-black">${msg || defaultMsg}</span>`,
                html: `<div class="text-xs text-slate-500 mt-2">${secondaryMsg}</div>`,
                allowOutsideClick: false,
                background: '#0f172a',
                color: '#fff',
                didOpen: () => Swal.showLoading()
            });
        } else {
            this.loadingProgress(false);
            Swal.close();
        }
    },

    toast(msg, icon = 'success') {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: '#1e293b',
            color: '#fff'
        });
        Toast.fire({ icon: icon, title: msg });
    },

    openModal(body, customClass = 'max-w-4xl', isBottom = true) {
        const modalBody = document.getElementById('modal-body');
        const modalContent = document.getElementById('modal-content');
        const modalOverlay = $('#modal-overlay');

        if (modalBody) modalBody.innerHTML = body;
        if (modalContent) {
            // Reset classes to base and add custom
            modalContent.className = `glass-card w-full overflow-hidden shadow-2xl relative bg-white border-transparent ${customClass}`;
        }
        
        if(isBottom) {
            modalOverlay.addClass('modal-bottom');
        } else {
            modalOverlay.removeClass('modal-bottom');
        }

        modalOverlay.css('display', 'flex').hide().fadeIn(300, function() {
            modalOverlay.addClass('active');
        });
    },

    closeModal() {
        const modalOverlay = $('#modal-overlay');
        modalOverlay.removeClass('active');
        setTimeout(() => {
            modalOverlay.fadeOut(300);
        }, 100);
    },

    exportToCSV(tableId, filename = 'report') {
        const rows = Array.from(document.querySelectorAll(`#${tableId} tr`));
        const content = rows.map(r => Array.from(r.cells).map(c => {
            let val = '';
            const input = c.querySelector('input');
            const select = c.querySelector('select');
            
            if (input) {
                val = input.value;
            } else if (select) {
                val = select.options[select.selectedIndex]?.text || '';
            } else {
                val = c.innerText.trim();
            }
            
            // Escape for CSV if it contains commas, quotes or newlines
            if (val.includes(',') || val.includes('"') || val.includes('\n')) {
                val = '"' + val.replace(/"/g, '""') + '"';
            }
            
            return val;
        }).join(',')).join('\n');
        
        const blob = new Blob(["\uFEFF" + content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.setAttribute("href", URL.createObjectURL(blob));
        link.setAttribute("download", `${filename}_${new Date().getTime()}.csv`);
        link.click();
    },

    setupEnterNavigation() {
        $(document).on('keydown', 'input, select, textarea', function(e) {
            if (e.which === 13) {
                // Ignore if it's a button, submit, or a textarea (unless Ctrl/Cmd is pressed)
                if (this.tagName === 'TEXTAREA' && !e.ctrlKey && !e.metaKey) return;
                if (this.type === 'submit' || $(this).hasClass('btn')) return;

                e.preventDefault();
                
                // Smart navigation for tables
                const $this = $(this);
                const $tr = $this.closest('tr');
                if ($tr.length) {
                    const $nextTr = $tr.nextAll('tr:visible').first();
                    if ($nextTr.length) {
                        // Try to find input in the same column/class in next row
                        const myClass = $this.attr('class').split(' ').find(c => c.includes('input') || c.includes('qty'));
                        if (myClass) {
                            const $nextInput = $nextTr.find('.' + myClass.replace(/\./g, ''));
                            if ($nextInput.length) {
                                $nextInput.focus().select();
                                return;
                            }
                        }
                    }
                }

                // Default sequential navigation
                const container = $this.closest('.modal-content, #main-content, .space-y-6, form');
                const $fields = container.find('input, select, textarea').filter(':visible').not(':disabled, [readonly]');
                const index = $fields.index(this);
                
                if (index > -1 && index < $fields.length - 1) {
                    $fields.eq(index + 1).focus().select();
                } else if (index === $fields.length - 1) {
                    // Last field - try to find the primary action button
                    const $btn = container.find('.btn-primary, button[onclick*="save"], button[onclick*="update"]').first();
                    if ($btn.length) $btn.focus();
                }
            }
        });

        // ✨ Numeric Polish: Ensure leading zero for decimals starting with '.' or '-.'
        $(document).on('input', 'input[type="number"], .input-premium, .bulk-qty-input', function() {
            let val = $(this).val();
            if (val === '.') {
                $(this).val('0.');
            } else if (val === '-.') {
                $(this).val('-0.');
            } else if (val && typeof val === 'string') {
                if (val.startsWith('.')) {
                    $(this).val('0' + val);
                } else if (val.startsWith('-.')) {
                    $(this).val('-0' + val.substring(1));
                }
            }
        });

        // Glow effect for numerical inputs with values
        $(document).on('input', 'input[type="number"], .input-blue-soft', function() {
            const val = parseFloat($(this).val());
            if (val > 0) {
                $(this).addClass('glow-active');
            } else {
                $(this).removeClass('glow-active');
            }
        });
    },

    sortTable(tableId, colIndex, isNumeric = false) {
        const table = document.getElementById(tableId);
        if (!table || !table.tBodies || !table.tBodies[0]) return;
        const tbody = table.tBodies[0];
        const rows = Array.from(tbody.querySelectorAll("tr"));
        let asc = table.getAttribute(`data-sort-dir-${colIndex}`) === "asc";
        asc = !asc; // flip direction
        table.setAttribute(`data-sort-dir-${colIndex}`, asc ? "asc" : "desc");

        rows.sort((a, b) => {
            const v1 = a.cells[colIndex] ? a.cells[colIndex].innerText.trim() : '';
            const v2 = b.cells[colIndex] ? b.cells[colIndex].innerText.trim() : '';
            if (isNumeric) {
                const n1 = parseFloat(v1.replace(/[^0-9.-]/g, '')) || 0;
                const n2 = parseFloat(v2.replace(/[^0-9.-]/g, '')) || 0;
                return asc ? n1 - n2 : n2 - n1;
            }
            return asc ? v1.localeCompare(v2) : v2.localeCompare(v1);
        });
        
        // Remove empty placeholders if any, re-append rows
        rows.forEach(r => tbody.appendChild(r));
    },

    /**
     * Standardized Inventory Calculation Logic
     * @param {Object} data - Input fields for calculation
     */
    calculateInventory(data) {
        const {
            beginning_inventory = 0,
            received = 0,
            purchased = 0,
            transfer_in = 0,
            transfer_out = 0,
            waste = 0,
            returns = 0,
            pos_consumption = 0,
            manual_consumption = 0,
            yield_percentage = 100,
            actual_count = 0,
            item_cost = 0
        } = data;

        const total_consumption = pos_consumption + manual_consumption;

        const theoretical_stock = (beginning_inventory + received + purchased + transfer_in) 
                                - (transfer_out + waste + returns + total_consumption);

        const theoretical_stock_after_yield = theoretical_stock * (yield_percentage / 100);

        const variance = actual_count - theoretical_stock_after_yield;

        const variance_value = variance * item_cost;

        return {
            theoretical_stock,
            theoretical_stock_after_yield,
            variance,
            variance_value
        };
    }
};
