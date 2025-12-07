// ============================================
// Payment System v2.0 - Modern ES6 Architecture
// ============================================

// ============================================
// Data Models
// ============================================
const SAMPLE_TRANSACTIONS = [
    {
        id: '98dd1a50e03e468aba5b4a205e64483',
        school: 'شركة مدارس الإشراق الأهلية',
        iban: 'SA8820000001782295329940',
        originalAmount: 4604.83,
        activationFee: 85.00,
        transactionFee: 39.14,
        netAmount: 4480.69,
        paymentMethod: 'Mada',
        date: '2025-12-04 10:29 ص',
        status: 'ST-01',
        isFirstPayment: true,
        contractType: 'Executive'
    },
    {
        id: '1f1eac6942ed4b409cece4d695cae037',
        school: 'شركة مدارس رياض الوادي',
        iban: 'SA2480000058060801002711',
        originalAmount: 4853.88,
        activationFee: 85.00,
        transactionFee: 41.26,
        netAmount: 4727.62,
        paymentMethod: 'Mada',
        date: '2025-12-04 09:43 ص',
        status: 'ST-01',
        isFirstPayment: true,
        contractType: 'Executive'
    },
    {
        id: '3abcba780a904e195d3463e6f525c2f',
        school: 'شركة تكوين العالمية للتعليم',
        iban: 'SA7380000049860801066011',
        originalAmount: 1953.27,
        activationFee: 0.00,
        transactionFee: 22.85,
        netAmount: 1930.42,
        paymentMethod: 'Visa',
        date: '2025-12-04 06:00 م',
        status: 'ST-02',
        isFirstPayment: false,
        contractType: 'Standard'
    },
    {
        id: '1f26f4c999cc4c559408165787eb268',
        school: 'مدرسة رياض الحكمة',
        iban: 'SA7780000020260801093150',
        originalAmount: 873.04,
        activationFee: 0.00,
        transactionFee: 7.42,
        netAmount: 865.62,
        paymentMethod: 'Mada',
        date: '2025-12-03 11:18 م',
        status: 'ST-03',
        isFirstPayment: false,
        contractType: 'Standard'
    },
    {
        id: '84ce687d0f467450c9abf191c522a1e09',
        school: 'شركة تكوين العالمية للتعليم',
        iban: 'SA7380000049860801066011',
        originalAmount: 1953.27,
        activationFee: 0.00,
        transactionFee: 16.61,
        netAmount: 1936.66,
        paymentMethod: 'Mada',
        date: '2025-12-03 04:15 م',
        status: 'ST-03',
        isFirstPayment: false,
        contractType: 'Standard'
    },
    {
        id: 'a7c3d9e8f1b2456789abcdef01234567',
        school: 'مدارس النخبة الدولية',
        iban: 'SA1234567890123456789012',
        originalAmount: 1646.25,
        activationFee: 0.00,
        transactionFee: 164.63,
        netAmount: 1481.62,
        paymentMethod: 'Tamara',
        date: '2025-12-02 02:30 م',
        status: 'ST-04',
        isFirstPayment: false,
        contractType: 'Standard'
    }
];

// ============================================
// Application State Manager
// ============================================
class AppState {
    constructor() {
        this.transactions = [...SAMPLE_TRANSACTIONS];
        this.notifications = [];
        this.currentUser = null;
        this.selectedTransactions = [];
        this.currentView = 'dashboard';
        this.currentTransaction = null;
        this.filters = {
            search: '',
            status: '',
            payment: '',
            date: '',
            dateType: ''
        };
    }

    setUser(user) {
        this.currentUser = user;
    }

    addNotification(transactionIndex, title, message) {
        this.notifications.push({
            id: Date.now(),
            transactionIndex,
            title,
            message,
            date: new Date().toLocaleDateString('ar-SA'),
            read: false
        });
    }

    markNotificationAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) notification.read = true;
    }

    markAllNotificationsAsRead() {
        this.notifications.forEach(n => n.read = true);
    }

    removeNotification(transactionIndex) {
        this.notifications = this.notifications.filter(
            n => n.transactionIndex !== transactionIndex
        );
    }

    getUnreadCount() {
        return this.notifications.filter(n => !n.read).length;
    }

    updateTransactionStatus(index, status, rejectionReason = null) {
        if (this.transactions[index]) {
            this.transactions[index].status = status;
            if (rejectionReason) {
                this.transactions[index].rejectionReason = rejectionReason;
            }
        }
    }

    getFilteredTransactions() {
        return this.transactions.filter(transaction => {
            // Search filter
            if (this.filters.search) {
                const search = this.filters.search.toLowerCase();
                if (
                    !transaction.id.toLowerCase().includes(search) &&
                    !transaction.school.toLowerCase().includes(search) &&
                    !transaction.iban.toLowerCase().includes(search)
                ) {
                    return false;
                }
            }

            // Status filter
            if (this.filters.status && transaction.status !== this.filters.status) {
                return false;
            }

            // Payment filter
            if (this.filters.payment && transaction.paymentMethod !== this.filters.payment) {
                return false;
            }

            return true;
        });
    }
}

// ============================================
// UI Manager
// ============================================
class UIManager {
    constructor(state) {
        this.state = state;
        this.statusMap = {
            'ST-01': { text: 'بانتظار المراجعة', class: 'pending', icon: '🕐' },
            'ST-02': { text: 'قيد المراجعة', class: 'reviewing', icon: '🔍' },
            'ST-03': { text: 'معتمد', class: 'approved', icon: '✅' },
            'ST-04': { text: 'تم التحويل', class: 'transferred', icon: '✈️' },
            'ST-05': { text: 'فشل التحويل', class: 'failed', icon: '❌' }
        };
    }

    getStatusInfo(status) {
        return this.statusMap[status] || this.statusMap['ST-01'];
    }

    formatCurrency(amount) {
        return `${amount.toFixed(2)} ر.س`;
    }

    formatDate(dateStr) {
        return dateStr;
    }

    renderNavigation() {
        const nav = document.getElementById('navigation');
        const items = [
            { id: 'dashboard', icon: '📊', text: 'لوحة التحكم', badge: false },
            { id: 'transactions', icon: '💳', text: 'التحويلات', badge: true },
            { id: 'calculator', icon: '🧮', text: 'حاسبة الرسوم', badge: false },
            { id: 'users', icon: '👥', text: 'المستخدمين', badge: false }
        ];

        nav.innerHTML = items.map(item => `
            <a href="#" class="nav-item${item.id === this.state.currentView ? ' active' : ''}"
               data-view="${item.id}">
                <span class="nav-icon">${item.icon}</span>
                <span class="nav-text">${item.text}</span>
                ${item.badge ? '<span class="badge-count" id="badgeCount" style="display: none;">0</span>' : ''}
            </a>
        `).join('');
    }

    renderSummaryCards() {
        const container = document.getElementById('summaryCards');
        const totals = this.calculateTotals();

        container.innerHTML = `
            <div class="summary-card">
                <div class="card-label">إجمالي المبالغ</div>
                <div class="card-value">${this.formatCurrency(totals.total)}</div>
            </div>
            <div class="summary-card">
                <div class="card-label">رسوم التنشيط</div>
                <div class="card-value">${this.formatCurrency(totals.activationFees)}</div>
            </div>
            <div class="summary-card">
                <div class="card-label">رسوم المعاملات</div>
                <div class="card-value">${this.formatCurrency(totals.transactionFees)}</div>
            </div>
            <div class="summary-card primary">
                <div class="card-label">صافي المبالغ</div>
                <div class="card-value">${this.formatCurrency(totals.net)}</div>
            </div>
        `;
    }

    calculateTotals() {
        return this.state.transactions.reduce((acc, t) => ({
            total: acc.total + t.originalAmount,
            activationFees: acc.activationFees + t.activationFee,
            transactionFees: acc.transactionFees + t.transactionFee,
            net: acc.net + t.netAmount
        }), { total: 0, activationFees: 0, transactionFees: 0, net: 0 });
    }

    renderStatusCards() {
        const container = document.getElementById('statusList');
        const statusCounts = this.getStatusCounts();

        container.innerHTML = Object.entries(this.statusMap).map(([code, info]) => `
            <div class="status-card ${info.class}" data-status="${code}">
                <div class="status-icon">${info.icon}</div>
                <div class="status-details">
                    <div class="status-label">${info.text}</div>
                    <div class="status-count">${statusCounts[code] || 0}</div>
                    <div class="status-code">${code}</div>
                </div>
            </div>
        `).join('');
    }

    getStatusCounts() {
        return this.state.transactions.reduce((acc, t) => {
            acc[t.status] = (acc[t.status] || 0) + 1;
            return acc;
        }, {});
    }

    renderRecentTransactions() {
        const container = document.getElementById('recentList');
        const recent = this.state.transactions.slice(0, 5);

        if (recent.length === 0) {
            container.innerHTML = '<p class="empty-state">لا توجد تحويلات</p>';
            return;
        }

        container.innerHTML = recent.map((t, i) => `
            <div class="recent-item" data-index="${i}">
                <div class="item-main">
                    <div class="item-school">${t.school}</div>
                    <div class="item-amount">${this.formatCurrency(t.netAmount)}</div>
                </div>
                <div class="item-meta">
                    <span class="badge badge-${this.getStatusInfo(t.status).class}">
                        ${this.getStatusInfo(t.status).text}
                    </span>
                    <span class="item-date">${t.date}</span>
                </div>
            </div>
        `).join('');
    }

    renderTransactionsTable() {
        const tbody = document.getElementById('transactionsBody');
        const filtered = this.state.getFilteredTransactions();

        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="12" class="empty-state">لا توجد تحويلات</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = filtered.map((t, i) => {
            const index = this.state.transactions.indexOf(t);
            return `
                <tr>
                    <td><input type="checkbox" class="row-checkbox" data-index="${index}"></td>
                    <td class="mono small">${t.id}</td>
                    <td><span class="badge badge-${t.paymentMethod.toLowerCase()}">${t.paymentMethod}</span></td>
                    <td>${this.formatCurrency(t.originalAmount)}</td>
                    <td>${this.formatCurrency(t.activationFee)}</td>
                    <td>${this.formatCurrency(t.transactionFee)}</td>
                    <td class="primary">${this.formatCurrency(t.netAmount)}</td>
                    <td>${t.school}</td>
                    <td class="mono small">${t.iban}</td>
                    <td class="small">${t.date}</td>
                    <td><span class="badge badge-${this.getStatusInfo(t.status).class}">${this.getStatusInfo(t.status).text}</span></td>
                    <td>
                        <button class="icon-btn" data-action="view" data-index="${index}" title="عرض التفاصيل">👁️</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    renderNotifications() {
        const container = document.getElementById('notificationsList');
        const badge = document.getElementById('badgeCount');

        if (!container) return;

        // Update badge
        const unreadCount = this.state.getUnreadCount();
        if (badge) {
            if (unreadCount > 0) {
                badge.textContent = unreadCount;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }

        // Render notifications
        if (this.state.notifications.length === 0) {
            container.innerHTML = '<p class="empty-state">لا توجد إشعارات</p>';
            return;
        }

        container.innerHTML = this.state.notifications.map(n => `
            <div class="notification-item${n.read ? ' read' : ''}" data-id="${n.id}">
                <div class="notification-content">
                    <div class="notification-title">${n.title}</div>
                    <div class="notification-meta">${n.message} • ${n.date}</div>
                </div>
                <button class="btn btn-sm" data-action="view-notification" data-index="${n.transactionIndex}">
                    عرض التفاصيل
                </button>
            </div>
        `).join('');
    }

    showTransactionDetails(index) {
        const transaction = this.state.transactions[index];
        if (!transaction) return;

        this.state.currentTransaction = index;
        const modal = document.getElementById('detailsModal');
        const modalBody = document.getElementById('modalBody');
        const modalFooter = document.getElementById('modalFooter');

        // Render details
        modalBody.innerHTML = `
            <div class="details-grid">
                <div class="detail-row">
                    <span class="detail-label">رقم المرجعي:</span>
                    <span class="detail-value mono">${transaction.id}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">اسم المدرسة:</span>
                    <span class="detail-value">${transaction.school}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">رقم الحساب (IBAN):</span>
                    <span class="detail-value mono">${transaction.iban}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">المبلغ الأصلي:</span>
                    <span class="detail-value">${this.formatCurrency(transaction.originalAmount)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">رسوم التنشيط:</span>
                    <span class="detail-value">${this.formatCurrency(transaction.activationFee)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">رسوم المعاملة:</span>
                    <span class="detail-value">${this.formatCurrency(transaction.transactionFee)}</span>
                </div>
                <div class="detail-row highlight">
                    <span class="detail-label">صافي المبلغ:</span>
                    <span class="detail-value primary">${this.formatCurrency(transaction.netAmount)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">وسيلة الدفع:</span>
                    <span class="detail-value">${transaction.paymentMethod}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">تاريخ التحويل:</span>
                    <span class="detail-value">${transaction.date}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">حالة التحويل:</span>
                    <span class="badge badge-${this.getStatusInfo(transaction.status).class}">
                        ${this.getStatusInfo(transaction.status).text}
                    </span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">نوع العقد:</span>
                    <span class="detail-value">${transaction.contractType}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">أول دفعة:</span>
                    <span class="detail-value">${transaction.isFirstPayment ? 'نعم' : 'لا'}</span>
                </div>
                ${transaction.rejectionReason ? `
                <div class="detail-row error">
                    <span class="detail-label">سبب الرفض:</span>
                    <span class="detail-value">${transaction.rejectionReason}</span>
                </div>
                ` : ''}
            </div>
        `;

        // Show approve/reject buttons for approver on ST-02
        if (this.state.currentUser?.type === 'approver' && transaction.status === 'ST-02') {
            modalFooter.style.display = 'flex';
        } else {
            modalFooter.style.display = 'none';
        }

        modal.classList.add('show');
    }

    closeModal() {
        const modal = document.getElementById('detailsModal');
        modal.classList.remove('show');
        this.state.currentTransaction = null;
    }

    switchView(viewId) {
        // Hide all views
        document.querySelectorAll('.view').forEach(v => v.style.display = 'none');

        // Show selected view
        const view = document.getElementById(`view-${viewId}`);
        if (view) view.style.display = 'block';

        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.view === viewId);
        });

        this.state.currentView = viewId;
    }

    showNotification(message, type = 'success') {
        alert(message); // Simple for now, can be improved with toast
    }
}

// ============================================
// Transaction Manager
// ============================================
class TransactionManager {
    constructor(state, ui) {
        this.state = state;
        this.ui = ui;
    }

    reviewSelected() {
        if (this.state.selectedTransactions.length === 0) {
            this.ui.showNotification('الرجاء تحديد معاملة واحدة على الأقل', 'error');
            return;
        }

        if (!confirm(`هل أنت متأكد من مراجعة ${this.state.selectedTransactions.length} معاملة؟`)) {
            return;
        }

        this.state.selectedTransactions.forEach(index => {
            const transaction = this.state.transactions[index];
            if (transaction.status === 'ST-01') {
                this.state.updateTransactionStatus(index, 'ST-02');
                this.state.addNotification(
                    index,
                    '🔔 تحويل جديد بحاجة للاعتماد',
                    `${transaction.school} - ${this.ui.formatCurrency(transaction.netAmount)}`
                );
            }
        });

        this.state.selectedTransactions = [];
        this.ui.renderTransactionsTable();
        this.ui.renderRecentTransactions();
        this.ui.renderStatusCards();
        this.ui.renderNotifications();
        this.ui.showNotification('تمت المراجعة بنجاح! تم إرسال إشعار للمعتمد.');

        // Clear checkboxes
        document.getElementById('selectAll').checked = false;
        document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = false);
    }

    approveTransaction() {
        const index = this.state.currentTransaction;
        if (index === null) return;

        const transaction = this.state.transactions[index];
        if (transaction.status !== 'ST-02') {
            this.ui.showNotification('يمكن اعتماد التحويلات في حالة "قيد المراجعة" فقط', 'error');
            return;
        }

        if (!confirm(`هل أنت متأكد من اعتماد هذا التحويل؟\n\n${transaction.school}\n${this.ui.formatCurrency(transaction.netAmount)}`)) {
            return;
        }

        this.state.updateTransactionStatus(index, 'ST-03');
        this.state.removeNotification(index);

        this.ui.renderTransactionsTable();
        this.ui.renderRecentTransactions();
        this.ui.renderStatusCards();
        this.ui.renderNotifications();
        this.ui.closeModal();
        this.ui.showNotification('✅ تم اعتماد التحويل بنجاح!');
    }

    rejectTransaction() {
        const index = this.state.currentTransaction;
        if (index === null) return;

        const transaction = this.state.transactions[index];
        if (transaction.status !== 'ST-02') {
            this.ui.showNotification('يمكن رفض التحويلات في حالة "قيد المراجعة" فقط', 'error');
            return;
        }

        const reason = prompt('الرجاء إدخال سبب الرفض:');
        if (!reason || !reason.trim()) return;

        this.state.updateTransactionStatus(index, 'ST-01', reason.trim());
        this.state.removeNotification(index);

        this.ui.renderTransactionsTable();
        this.ui.renderRecentTransactions();
        this.ui.renderStatusCards();
        this.ui.renderNotifications();
        this.ui.closeModal();
        this.ui.showNotification('❌ تم رفض التحويل. سيتم إرسال إشعار للمراجع.');
    }

    exportToExcel() {
        if (typeof XLSX === 'undefined') {
            this.ui.showNotification('مكتبة Excel غير محملة', 'error');
            return;
        }

        const filtered = this.state.getFilteredTransactions();
        const exportData = filtered.map(t => ({
            'رقم المرجعي': t.id,
            'اسم المدرسة': t.school,
            'رقم الحساب': t.iban,
            'المبلغ الأصلي': t.originalAmount.toFixed(2),
            'رسوم التنشيط': t.activationFee.toFixed(2),
            'رسوم المعاملة': t.transactionFee.toFixed(2),
            'صافي المبلغ': t.netAmount.toFixed(2),
            'وسيلة الدفع': t.paymentMethod,
            'تاريخ التحويل': t.date,
            'حالة التحويل': this.ui.getStatusInfo(t.status).text,
            'نوع العقد': t.contractType,
            'أول دفعة': t.isFirstPayment ? 'نعم' : 'لا'
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(exportData);

        const colWidths = [
            { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 15 },
            { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
            { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 10 }
        ];
        ws['!cols'] = colWidths;

        XLSX.utils.book_append_sheet(wb, ws, 'التحويلات');

        const date = new Date().toISOString().split('T')[0];
        const fileName = `تقرير_التحويلات_${date}.xlsx`;

        XLSX.writeFile(wb, fileName);
        this.ui.showNotification('تم تصدير الملف بنجاح!');
    }
}

// ============================================
// Fee Calculator
// ============================================
class FeeCalculator {
    calculate(amount, paymentMethod, contractType, isFirstPayment) {
        if (!amount || !paymentMethod || !contractType) {
            return null;
        }

        const feeRates = {
            mada: 0.0085,
            visa: 0.0117,
            tamara: 0.10
        };

        const feeRate = feeRates[paymentMethod] || 0;
        const transactionFee = amount * feeRate;
        const activationFee = (contractType === 'executive' && isFirstPayment) ? 85 : 0;
        const netAmount = amount - activationFee - transactionFee;

        return {
            amount,
            activationFee,
            transactionFee,
            netAmount,
            feeRate: feeRate * 100
        };
    }

    renderResult(result) {
        const container = document.getElementById('calculatorResult');
        if (!result) {
            container.innerHTML = '<p class="empty-state">قم بإدخال البيانات وحساب الرسوم</p>';
            return;
        }

        container.innerHTML = `
            <div class="calc-result">
                <div class="calc-row">
                    <span>المبلغ الأصلي:</span>
                    <span>${result.amount.toFixed(2)} ر.س</span>
                </div>
                <div class="calc-row deduction">
                    <span>رسوم التنشيط (BR-01):</span>
                    <span>- ${result.activationFee.toFixed(2)} ر.س</span>
                </div>
                <div class="calc-row deduction">
                    <span>رسوم المعاملة (BR-02) - ${result.feeRate.toFixed(2)}%:</span>
                    <span>- ${result.transactionFee.toFixed(2)} ر.س</span>
                </div>
                <div class="calc-divider"></div>
                <div class="calc-row total">
                    <span>صافي المبلغ:</span>
                    <span>${result.netAmount.toFixed(2)} ر.س</span>
                </div>
            </div>
            <div class="calc-notes">
                <p><strong>ملاحظات:</strong></p>
                <ul>
                    ${result.activationFee > 0 ?
                        '<li>تم تطبيق رسوم التنشيط لأنها أول دفعة والعقد تنفيذي</li>' :
                        '<li>لم يتم تطبيق رسوم التنشيط</li>'
                    }
                    <li>نسبة رسوم المعاملة ${result.feeRate.toFixed(2)}% حسب وسيلة الدفع</li>
                    <li>إجمالي الرسوم: ${(result.activationFee + result.transactionFee).toFixed(2)} ر.س</li>
                </ul>
            </div>
        `;
    }
}

// ============================================
// Application Controller
// ============================================
class App {
    constructor() {
        this.state = new AppState();
        this.ui = new UIManager(this.state);
        this.transactionManager = new TransactionManager(this.state, this.ui);
        this.calculator = new FeeCalculator();
    }

    init() {
        // Check authentication
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (!isLoggedIn && !window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
            return;
        }

        // Set user
        const userName = localStorage.getItem('userName');
        const userType = localStorage.getItem('userType');
        this.state.setUser({
            name: userName || 'مستخدم',
            type: userType || 'reviewer'
        });

        // Update UI
        this.updateUserDisplay();
        this.setupEventListeners();
        this.renderAll();

        // Show notifications panel for approver
        if (userType === 'approver') {
            const panel = document.getElementById('notificationsPanel');
            if (panel) panel.style.display = 'block';
        }
    }

    updateUserDisplay() {
        const userNameEl = document.getElementById('userName');
        const userRoleEl = document.getElementById('userRole');
        const userAvatarEl = document.getElementById('userAvatar');

        if (userNameEl) userNameEl.textContent = this.state.currentUser.name;
        if (userRoleEl) userRoleEl.textContent = this.state.currentUser.type === 'reviewer' ? 'مراجع' : 'معتمد';
        if (userAvatarEl) userAvatarEl.textContent = this.state.currentUser.name.charAt(0);
    }

    renderAll() {
        this.ui.renderNavigation();
        this.ui.renderSummaryCards();
        this.ui.renderStatusCards();
        this.ui.renderRecentTransactions();
        this.ui.renderTransactionsTable();
        this.ui.renderNotifications();
    }

    setupEventListeners() {
        // Navigation
        document.addEventListener('click', e => {
            const navItem = e.target.closest('.nav-item');
            if (navItem) {
                e.preventDefault();
                this.ui.switchView(navItem.dataset.view);
            }

            const linkBtn = e.target.closest('.link-btn');
            if (linkBtn && linkBtn.dataset.view) {
                e.preventDefault();
                this.ui.switchView(linkBtn.dataset.view);
            }
        });

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.clear();
                window.location.href = 'login.html';
            });
        }

        // Status cards click
        document.addEventListener('click', e => {
            const statusCard = e.target.closest('.status-card');
            if (statusCard) {
                const status = statusCard.dataset.status;
                this.state.filters.status = status;
                this.ui.switchView('transactions');
                document.getElementById('statusFilter').value = status;
                this.ui.renderTransactionsTable();
            }
        });

        // Recent items click
        document.addEventListener('click', e => {
            const recentItem = e.target.closest('.recent-item');
            if (recentItem) {
                const index = parseInt(recentItem.dataset.index);
                this.ui.showTransactionDetails(index);
            }
        });

        // Filters
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', e => {
                this.state.filters.search = e.target.value;
                this.ui.renderTransactionsTable();
            });
        }

        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', e => {
                this.state.filters.status = e.target.value;
                this.ui.renderTransactionsTable();
            });
        }

        const paymentFilter = document.getElementById('paymentFilter');
        if (paymentFilter) {
            paymentFilter.addEventListener('change', e => {
                this.state.filters.payment = e.target.value;
                this.ui.renderTransactionsTable();
            });
        }

        // Select all
        const selectAll = document.getElementById('selectAll');
        if (selectAll) {
            selectAll.addEventListener('change', e => {
                const checkboxes = document.querySelectorAll('.row-checkbox');
                checkboxes.forEach(cb => cb.checked = e.target.checked);
                this.updateSelectedTransactions();
            });
        }

        // Row checkboxes
        document.addEventListener('change', e => {
            if (e.target.classList.contains('row-checkbox')) {
                this.updateSelectedTransactions();
            }
        });

        // Action buttons
        document.addEventListener('click', e => {
            const action = e.target.closest('[data-action]');
            if (!action) return;

            const actionType = action.dataset.action;
            const index = parseInt(action.dataset.index);

            switch (actionType) {
                case 'view':
                    this.ui.showTransactionDetails(index);
                    break;
                case 'view-notification':
                    const notifId = parseInt(e.target.closest('.notification-item').dataset.id);
                    this.state.markNotificationAsRead(notifId);
                    this.ui.renderNotifications();
                    this.ui.showTransactionDetails(index);
                    break;
            }
        });

        // Review button
        const reviewBtn = document.getElementById('reviewBtn');
        if (reviewBtn) {
            reviewBtn.addEventListener('click', () => {
                this.transactionManager.reviewSelected();
            });
        }

        // Export button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.transactionManager.exportToExcel();
            });
        }

        // Modal close
        const closeModalBtn = document.getElementById('closeModalBtn');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                this.ui.closeModal();
            });
        }

        // Approve/Reject buttons
        const approveBtn = document.getElementById('approveBtn');
        if (approveBtn) {
            approveBtn.addEventListener('click', () => {
                this.transactionManager.approveTransaction();
            });
        }

        const rejectBtn = document.getElementById('rejectBtn');
        if (rejectBtn) {
            rejectBtn.addEventListener('click', () => {
                this.transactionManager.rejectTransaction();
            });
        }

        // Mark all as read
        const markAllReadBtn = document.getElementById('markAllReadBtn');
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', () => {
                this.state.markAllNotificationsAsRead();
                this.ui.renderNotifications();
            });
        }

        // Calculator
        const calculatorForm = document.getElementById('calculatorForm');
        if (calculatorForm) {
            calculatorForm.addEventListener('submit', e => {
                e.preventDefault();
                const amount = parseFloat(document.getElementById('calcAmount').value);
                const paymentMethod = document.getElementById('calcPaymentMethod').value;
                const contractType = document.getElementById('calcContractType').value;
                const isFirstPayment = document.getElementById('calcIsFirstPayment').checked;

                const result = this.calculator.calculate(amount, paymentMethod, contractType, isFirstPayment);
                this.calculator.renderResult(result);
            });
        }

        // Date filter
        const dateFilterType = document.getElementById('dateFilterType');
        if (dateFilterType) {
            dateFilterType.addEventListener('change', e => {
                const customDate = document.getElementById('customDate');
                if (e.target.value === 'custom') {
                    customDate.style.display = 'block';
                } else {
                    customDate.style.display = 'none';
                }
                // Apply filter logic here
            });
        }

        // Close modal on background click
        document.getElementById('detailsModal')?.addEventListener('click', e => {
            if (e.target.id === 'detailsModal') {
                this.ui.closeModal();
            }
        });
    }

    updateSelectedTransactions() {
        this.state.selectedTransactions = [];
        document.querySelectorAll('.row-checkbox:checked').forEach(cb => {
            this.state.selectedTransactions.push(parseInt(cb.dataset.index));
        });
    }
}

// ============================================
// Initialize Application
// ============================================
const app = new App();

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

// Export for debugging
window.app = app;
