// Application State
const AppState = {
    currentUser: null,
    currentLanguage: 'ar',
    transactions: [],
    filteredTransactions: [],
    currentTransactionId: null
};

// User Credentials (Demo)
const users = {
    'reviewer': { password: '123456', role: 'reviewer', nameAr: 'مراجع النظام', nameEn: 'System Reviewer' },
    'approver': { password: '123456', role: 'approver', nameAr: 'معتمد النظام', nameEn: 'System Approver' }
};

// Translation Dictionary
const translations = {
    ar: {
        reviewer: 'مراجع',
        approver: 'معتمد',
        logout: 'تسجيل الخروج',
        login: 'تسجيل الدخول',
        username: 'اسم المستخدم',
        password: 'كلمة المرور',
        dashboard: 'لوحة التحكم',
        transactions: 'المعاملات',
        notifications: 'الإشعارات',
        invalidCredentials: 'اسم المستخدم أو كلمة المرور غير صحيحة',
        loginSuccess: 'تم تسجيل الدخول بنجاح',
        logoutSuccess: 'تم تسجيل الخروج بنجاح',
        statusChanged: 'تم تغيير حالة المعاملة بنجاح',
        transactionReviewed: 'تم مراجعة المعاملة بنجاح',
        transactionApproved: 'تم اعتماد المعاملة بنجاح',
        transactionRejected: 'تم رفض المعاملة بنجاح',
        transactionRereviewed: 'تم إعادة المراجعة بنجاح',
        rejectionReasonRequired: 'يجب إدخال سبب الرفض',
        confirmApprove: 'هل أنت متأكد من اعتماد هذه المعاملة؟',
        confirmReview: 'هل أنت متأكد من مراجعة هذه المعاملة؟',
        confirmRereview: 'هل أنت متأكد من إعادة مراجعة هذه المعاملة؟',
        exportSuccess: 'تم تصدير البيانات بنجاح',
        mada: 'مدى',
        visa: 'فيزا',
        mastercard: 'ماستركارد',
        newTransaction: 'جديد',
        rejectedTransaction: 'مرفوض',
        approvedTransaction: 'معتمد'
    },
    en: {
        reviewer: 'Reviewer',
        approver: 'Approver',
        logout: 'Logout',
        login: 'Login',
        username: 'Username',
        password: 'Password',
        dashboard: 'Dashboard',
        transactions: 'Transactions',
        notifications: 'Notifications',
        invalidCredentials: 'Invalid username or password',
        loginSuccess: 'Login successful',
        logoutSuccess: 'Logout successful',
        statusChanged: 'Transaction status changed successfully',
        transactionReviewed: 'Transaction reviewed successfully',
        transactionApproved: 'Transaction approved successfully',
        transactionRejected: 'Transaction rejected successfully',
        transactionRereviewed: 'Transaction re-reviewed successfully',
        rejectionReasonRequired: 'Rejection reason is required',
        confirmApprove: 'Are you sure you want to approve this transaction?',
        confirmReview: 'Are you sure you want to review this transaction?',
        confirmRereview: 'Are you sure you want to re-review this transaction?',
        exportSuccess: 'Data exported successfully',
        mada: 'Mada',
        visa: 'Visa',
        mastercard: 'Mastercard',
        newTransaction: 'New',
        rejectedTransaction: 'Rejected',
        approvedTransaction: 'Approved'
    }
};

// Initialize mock data
function initializeMockData() {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
        AppState.transactions = JSON.parse(savedTransactions);
    } else {
        AppState.transactions = generateMockTransactions();
        saveTransactions();
    }
}

// Generate Mock Transactions
function generateMockTransactions() {
    const schools = [
        'مدرسة النور الأهلية', 'مدرسة المعرفة العالمية', 'مدرسة الرياض النموذجية',
        'مدرسة الفيصلية الأهلية', 'مدرسة دار العلوم', 'مدرسة الأندلس العالمية',
        'مدرسة الحصان النموذجية', 'مدرسة المنارات', 'مدرسة الفرسان الأهلية',
        'مدرسة الأفق العالمية', 'مدرسة المواهب الذهبية', 'مدرسة النخبة الأهلية'
    ];

    const schoolsEn = [
        'Al-Noor Private School', 'Knowledge International School', 'Riyadh Model School',
        'Al-Faisaliah Private School', 'Dar Al-Uloom School', 'Al-Andalus International School',
        'Al-Hissan Model School', 'Al-Manarat School', 'Al-Forsan Private School',
        'Horizon International School', 'Golden Talents School', 'Elite Private School'
    ];

    const statuses = ['ST-01', 'ST-02', 'ST-03', 'ST-04', 'ST-05', 'ST-06'];
    const paymentMethods = ['mada', 'visa', 'mastercard'];
    const contractTypes = ['عقد سنوي', 'عقد فصلي'];

    const transactions = [];
    const now = new Date();

    for (let i = 0; i < 50; i++) {
        const originalAmount = Math.floor(Math.random() * 50000) + 10000;
        const contractFees = Math.floor(originalAmount * 0.025); // 2.5%
        const bankFees = Math.floor(originalAmount * 0.015); // 1.5%
        const netAmount = originalAmount - contractFees - bankFees;

        const date = new Date(now);
        date.setDate(date.getDate() - Math.floor(Math.random() * 60));

        const statusIndex = Math.floor(Math.random() * statuses.length);
        const status = statuses[statusIndex];

        const schoolIndex = i % schools.length;

        transactions.push({
            id: `TXN-${String(i + 1).padStart(5, '0')}`,
            schoolName: schools[schoolIndex],
            schoolNameEn: schoolsEn[schoolIndex],
            referenceNumber: `REF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
            iban: `SA${Math.floor(Math.random() * 10000000000000000000000)}`,
            originalAmount,
            contractFees,
            bankFees,
            netAmount,
            date: date.toISOString(),
            paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
            status,
            contractType: contractTypes[Math.floor(Math.random() * contractTypes.length)],
            isFirstPayment: Math.random() > 0.5,
            history: [{
                status: 'ST-01',
                date: date.toISOString(),
                user: 'نظام',
                action: 'تم إنشاء المعاملة'
            }],
            rejectionReason: null,
            rejectedBy: null,
            rejectedAt: null,
            approvedBy: null,
            approvedAt: null,
            reviewedBy: null,
            reviewedAt: null
        });
    }

    return transactions;
}

// Save transactions to localStorage
function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(AppState.transactions));
}

// Authentication Functions
function login(username, password) {
    const user = users[username];
    if (user && user.password === password) {
        AppState.currentUser = {
            username,
            role: user.role,
            nameAr: user.nameAr,
            nameEn: user.nameEn
        };
        localStorage.setItem('currentUser', JSON.stringify(AppState.currentUser));
        return true;
    }
    return false;
}

function logout() {
    AppState.currentUser = null;
    localStorage.removeItem('currentUser');
    showPage('loginPage');
    showToast(t('logoutSuccess'), 'success');
}

function checkAuth() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        AppState.currentUser = JSON.parse(savedUser);
        return true;
    }
    return false;
}

// Translation Function
function t(key) {
    return translations[AppState.currentLanguage][key] || key;
}

// Language Management
function setLanguage(lang) {
    AppState.currentLanguage = lang;
    localStorage.setItem('language', lang);

    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';

    // Update all translated elements
    document.querySelectorAll('[data-ar]').forEach(el => {
        const text = lang === 'ar' ? el.getAttribute('data-ar') : el.getAttribute('data-en');
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = text;
        } else if (el.tagName === 'OPTION') {
            el.textContent = text;
        } else {
            el.textContent = text;
        }
    });

    // Update language toggle buttons
    document.querySelectorAll('.btn-lang, .btn-lang-app').forEach(btn => {
        btn.textContent = lang === 'ar' ? 'English' : 'العربية';
    });

    // Refresh current view
    const activePage = document.querySelector('.content-page.active');
    if (activePage) {
        const pageId = activePage.id;
        if (pageId === 'dashboardPage') {
            updateDashboard();
        } else if (pageId === 'transactionsPage') {
            renderTransactionsTable();
        } else if (pageId === 'notificationsPage') {
            renderNotifications();
        }
    }
}

// Page Navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

function showContentPage(pageId) {
    document.querySelectorAll('.content-page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');

    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-page="${pageId.replace('Page', '')}"]`)?.classList.add('active');

    // Update content based on page
    if (pageId === 'dashboardPage') {
        updateDashboard();
    } else if (pageId === 'transactionsPage') {
        applyTransactionFilters();
    } else if (pageId === 'notificationsPage') {
        renderNotifications();
    }
}

// Toast Notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Modal Management
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');

    // Clear modal content
    if (modalId === 'rejectModal') {
        document.getElementById('rejectionReason').value = '';
    }
}

// Dashboard Functions
function updateDashboard() {
    const filtered = getFilteredDashboardTransactions();

    const totalAmount = filtered.reduce((sum, t) => sum + t.originalAmount, 0);
    const contractFees = filtered.reduce((sum, t) => sum + t.contractFees, 0);
    const bankFees = filtered.reduce((sum, t) => sum + t.bankFees, 0);
    const netAmount = filtered.reduce((sum, t) => sum + t.netAmount, 0);

    document.getElementById('totalAmount').textContent = formatCurrency(totalAmount);
    document.getElementById('contractFees').textContent = formatCurrency(contractFees);
    document.getElementById('bankFees').textContent = formatCurrency(bankFees);
    document.getElementById('netAmount').textContent = formatCurrency(netAmount);
}

function getFilteredDashboardTransactions() {
    const period = document.getElementById('dashboardPeriod').value;
    const now = new Date();

    return AppState.transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);

        switch (period) {
            case 'today':
                return transactionDate.toDateString() === now.toDateString();
            case 'month':
                return transactionDate.getMonth() === now.getMonth() &&
                       transactionDate.getFullYear() === now.getFullYear();
            case 'year':
                return transactionDate.getFullYear() === now.getFullYear();
            case 'custom':
                const fromDate = document.getElementById('dashboardFromDate').value;
                const toDate = document.getElementById('dashboardToDate').value;
                if (fromDate && toDate) {
                    const from = new Date(fromDate);
                    const to = new Date(toDate);
                    to.setHours(23, 59, 59, 999);
                    return transactionDate >= from && transactionDate <= to;
                }
                return true;
            default:
                return true;
        }
    });
}

// Transaction Functions
function applyTransactionFilters() {
    const statusFilter = document.getElementById('statusFilter').value;
    const paymentMethodFilter = document.getElementById('paymentMethodFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    const searchFilter = document.getElementById('searchFilter').value.toLowerCase();

    AppState.filteredTransactions = AppState.transactions.filter(transaction => {
        let matches = true;

        if (statusFilter !== 'all' && transaction.status !== statusFilter) {
            matches = false;
        }

        if (paymentMethodFilter !== 'all' && transaction.paymentMethod !== paymentMethodFilter) {
            matches = false;
        }

        if (dateFilter) {
            const transactionDate = new Date(transaction.date).toDateString();
            const filterDate = new Date(dateFilter).toDateString();
            if (transactionDate !== filterDate) {
                matches = false;
            }
        }

        if (searchFilter) {
            const schoolName = AppState.currentLanguage === 'ar' ? transaction.schoolName : transaction.schoolNameEn;
            if (!schoolName.toLowerCase().includes(searchFilter)) {
                matches = false;
            }
        }

        return matches;
    });

    renderTransactionsTable();
}

function clearTransactionFilters() {
    document.getElementById('statusFilter').value = 'all';
    document.getElementById('paymentMethodFilter').value = 'all';
    document.getElementById('dateFilter').value = '';
    document.getElementById('searchFilter').value = '';
    applyTransactionFilters();
}

function renderTransactionsTable() {
    const tbody = document.getElementById('transactionsTableBody');
    const transactions = AppState.filteredTransactions.length > 0 ?
        AppState.filteredTransactions : AppState.transactions;

    if (transactions.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="text-center">
                    <div class="empty-state">
                        <div class="empty-state-icon">📭</div>
                        <div class="empty-state-message">${AppState.currentLanguage === 'ar' ? 'لا توجد معاملات' : 'No transactions found'}</div>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = transactions.map(transaction => {
        const schoolName = AppState.currentLanguage === 'ar' ? transaction.schoolName : transaction.schoolNameEn;
        const canReview = AppState.currentUser.role === 'reviewer' && transaction.status === 'ST-01' && !transaction.rejectionReason;

        return `
            <tr>
                <td>${schoolName}</td>
                <td>${transaction.referenceNumber}</td>
                <td class="amount">${formatCurrency(transaction.originalAmount)}</td>
                <td class="amount">${formatCurrency(transaction.contractFees)}</td>
                <td class="amount">${formatCurrency(transaction.bankFees)}</td>
                <td class="amount fw-bold">${formatCurrency(transaction.netAmount)}</td>
                <td>${formatDate(transaction.date)}</td>
                <td>${formatPaymentMethod(transaction.paymentMethod)}</td>
                <td>${getStatusBadge(transaction.status)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-primary" onclick="viewTransactionDetails('${transaction.id}')">
                            ${AppState.currentLanguage === 'ar' ? 'عرض' : 'View'}
                        </button>
                        ${canReview ? `
                            <button class="btn btn-sm btn-success" onclick="reviewTransaction('${transaction.id}')">
                                ${AppState.currentLanguage === 'ar' ? 'مراجعة' : 'Review'}
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function viewTransactionDetails(transactionId) {
    const transaction = AppState.transactions.find(t => t.id === transactionId);
    if (!transaction) return;

    const schoolName = AppState.currentLanguage === 'ar' ? transaction.schoolName : transaction.schoolNameEn;
    const lang = AppState.currentLanguage;

    const detailsHtml = `
        <div class="details-grid">
            <div class="details-section">
                <h3>${lang === 'ar' ? 'معلومات المدرسة' : 'School Information'}</h3>
                <div class="detail-row">
                    <span class="detail-label">${lang === 'ar' ? 'اسم المدرسة' : 'School Name'}:</span>
                    <span class="detail-value">${schoolName}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">${lang === 'ar' ? 'رقم الآيبان' : 'IBAN'}:</span>
                    <span class="detail-value">${transaction.iban}</span>
                </div>
            </div>

            <div class="details-section">
                <h3>${lang === 'ar' ? 'المعلومات المالية' : 'Financial Information'}</h3>
                <div class="detail-row">
                    <span class="detail-label">${lang === 'ar' ? 'المبلغ الأصلي' : 'Original Amount'}:</span>
                    <span class="detail-value amount">${formatCurrency(transaction.originalAmount)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">${lang === 'ar' ? 'رسوم العقد التنفيذي' : 'Contract Fees'}:</span>
                    <span class="detail-value amount">${formatCurrency(transaction.contractFees)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">${lang === 'ar' ? 'رسوم البنك' : 'Bank Fees'}:</span>
                    <span class="detail-value amount">${formatCurrency(transaction.bankFees)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">${lang === 'ar' ? 'صافي المبلغ' : 'Net Amount'}:</span>
                    <span class="detail-value amount highlight">${formatCurrency(transaction.netAmount)}</span>
                </div>
            </div>

            <div class="details-section">
                <h3>${lang === 'ar' ? 'تفاصيل الدفع' : 'Payment Details'}</h3>
                <div class="detail-row">
                    <span class="detail-label">${lang === 'ar' ? 'رقم المرجع' : 'Reference Number'}:</span>
                    <span class="detail-value">${transaction.referenceNumber}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">${lang === 'ar' ? 'التاريخ' : 'Date'}:</span>
                    <span class="detail-value">${formatDateTime(transaction.date)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">${lang === 'ar' ? 'طريقة الدفع' : 'Payment Method'}:</span>
                    <span class="detail-value">${formatPaymentMethod(transaction.paymentMethod)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">${lang === 'ar' ? 'نوع العقد' : 'Contract Type'}:</span>
                    <span class="detail-value">${transaction.contractType}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">${lang === 'ar' ? 'دفعة أولى' : 'First Payment'}:</span>
                    <span class="detail-value">${transaction.isFirstPayment ? (lang === 'ar' ? 'نعم' : 'Yes') : (lang === 'ar' ? 'لا' : 'No')}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">${lang === 'ar' ? 'الحالة' : 'Status'}:</span>
                    <span class="detail-value">${getStatusBadge(transaction.status)}</span>
                </div>
            </div>

            ${transaction.rejectionReason ? `
                <div class="details-section">
                    <h3>${lang === 'ar' ? 'معلومات الرفض' : 'Rejection Information'}</h3>
                    <div class="rejection-reason-box">
                        <div class="reason-header">
                            <span>📝</span>
                            <span>${lang === 'ar' ? 'سبب الرفض' : 'Rejection Reason'}</span>
                        </div>
                        <div class="reason-text">${transaction.rejectionReason}</div>
                        <div class="reason-meta">
                            ${lang === 'ar' ? 'رفض بواسطة' : 'Rejected by'}: ${transaction.rejectedBy} |
                            ${formatDateTime(transaction.rejectedAt)}
                        </div>
                    </div>
                </div>
            ` : ''}
        </div>
    `;

    document.getElementById('detailsModalBody').innerHTML = detailsHtml;
    openModal('detailsModal');
}

function reviewTransaction(transactionId) {
    const transaction = AppState.transactions.find(t => t.id === transactionId);
    if (!transaction || transaction.status !== 'ST-01' || transaction.rejectionReason) return;

    AppState.currentTransactionId = transactionId;
    document.getElementById('confirmMessage').textContent = t('confirmReview');
    openModal('confirmModal');

    document.getElementById('confirmAction').onclick = () => {
        transaction.status = 'ST-02';
        transaction.reviewedBy = AppState.currentUser.nameAr;
        transaction.reviewedAt = new Date().toISOString();
        transaction.history.push({
            status: 'ST-02',
            date: new Date().toISOString(),
            user: AppState.currentUser.nameAr,
            action: AppState.currentLanguage === 'ar' ? 'تمت المراجعة' : 'Reviewed'
        });

        saveTransactions();
        closeModal('confirmModal');
        showToast(t('transactionReviewed'), 'success');
        renderTransactionsTable();
        updateNotificationBadge();
    };
}

// Notification Functions
function renderNotifications() {
    updateNotificationBadge();

    if (AppState.currentUser.role === 'approver') {
        renderApproverNotifications();
    } else {
        renderReviewerNotifications();
    }
}

function renderApproverNotifications() {
    document.getElementById('approverNotifications').style.display = 'block';
    document.getElementById('reviewerNotifications').style.display = 'none';
    document.getElementById('approverNotificationStats').style.display = 'grid';

    const pendingTransactions = AppState.transactions.filter(t => t.status === 'ST-02');
    const today = new Date().toDateString();
    const approvedToday = AppState.transactions.filter(t =>
        t.status === 'ST-03' && t.approvedAt && new Date(t.approvedAt).toDateString() === today
    ).length;
    const rejectedToday = AppState.transactions.filter(t =>
        t.rejectionReason && new Date(t.rejectedAt).toDateString() === today
    ).length;

    document.getElementById('pendingCount').textContent = pendingTransactions.length;
    document.getElementById('approvedTodayCount').textContent = approvedToday;
    document.getElementById('rejectedTodayCount').textContent = rejectedToday;

    const pendingList = document.getElementById('pendingTransactionsList');

    if (pendingTransactions.length === 0) {
        pendingList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">✅</div>
                <div class="empty-state-message">
                    ${AppState.currentLanguage === 'ar' ? 'لا توجد معاملات في انتظار الاعتماد' : 'No pending transactions'}
                </div>
            </div>
        `;
        return;
    }

    pendingList.innerHTML = pendingTransactions.map(transaction => {
        const schoolName = AppState.currentLanguage === 'ar' ? transaction.schoolName : transaction.schoolNameEn;
        const lang = AppState.currentLanguage;

        return `
            <div class="notification-card new">
                <div class="notification-header">
                    <div class="notification-status new">🔵 ${t('newTransaction')}</div>
                </div>
                <div class="notification-title">${schoolName}</div>
                <div class="notification-details">
                    <div class="detail-row">
                        <span class="detail-label">${lang === 'ar' ? 'المبلغ الأصلي' : 'Original Amount'}:</span>
                        <span class="detail-value amount">${formatCurrency(transaction.originalAmount)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">${lang === 'ar' ? 'رسوم العقد' : 'Contract Fees'}:</span>
                        <span class="detail-value amount">${formatCurrency(transaction.contractFees)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">${lang === 'ar' ? 'رسوم البنك' : 'Bank Fees'}:</span>
                        <span class="detail-value amount">${formatCurrency(transaction.bankFees)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">${lang === 'ar' ? 'صافي المبلغ' : 'Net Amount'}:</span>
                        <span class="detail-value highlight amount">${formatCurrency(transaction.netAmount)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">${lang === 'ar' ? 'التاريخ' : 'Date'}:</span>
                        <span class="detail-value">${formatDate(transaction.date)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">${lang === 'ar' ? 'طريقة الدفع' : 'Payment Method'}:</span>
                        <span class="detail-value">${formatPaymentMethod(transaction.paymentMethod)}</span>
                    </div>
                </div>
                <div class="notification-actions">
                    <button class="btn btn-sm btn-success" onclick="approveTransaction('${transaction.id}')">
                        ✅ ${lang === 'ar' ? 'اعتماد' : 'Approve'}
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="openRejectModal('${transaction.id}')">
                        ❌ ${lang === 'ar' ? 'رفض' : 'Reject'}
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="viewTransactionDetails('${transaction.id}')">
                        👁 ${lang === 'ar' ? 'تفاصيل' : 'Details'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function renderReviewerNotifications() {
    document.getElementById('approverNotifications').style.display = 'none';
    document.getElementById('reviewerNotifications').style.display = 'block';
    document.getElementById('approverNotificationStats').style.display = 'none';

    const rejectedTransactions = AppState.transactions.filter(t => t.rejectionReason);
    const approvedTransactions = AppState.transactions.filter(t => t.status === 'ST-03');

    const rejectedList = document.getElementById('rejectedTransactionsList');
    const approvedList = document.getElementById('approvedTransactionsList');

    // Render rejected transactions
    if (rejectedTransactions.length === 0) {
        rejectedList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">✅</div>
                <div class="empty-state-message">
                    ${AppState.currentLanguage === 'ar' ? 'لا توجد معاملات مرفوضة' : 'No rejected transactions'}
                </div>
            </div>
        `;
    } else {
        rejectedList.innerHTML = rejectedTransactions.map(transaction => {
            const schoolName = AppState.currentLanguage === 'ar' ? transaction.schoolName : transaction.schoolNameEn;
            const lang = AppState.currentLanguage;

            return `
                <div class="notification-card rejected">
                    <div class="notification-header">
                        <div class="notification-status rejected">🔴 ${t('rejectedTransaction')}</div>
                    </div>
                    <div class="notification-title">${schoolName}</div>
                    <div class="notification-details">
                        <div class="detail-row">
                            <span class="detail-label">${lang === 'ar' ? 'المبلغ الأصلي' : 'Original Amount'}:</span>
                            <span class="detail-value amount">${formatCurrency(transaction.originalAmount)}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">${lang === 'ar' ? 'رسوم العقد' : 'Contract Fees'}:</span>
                            <span class="detail-value amount">${formatCurrency(transaction.contractFees)}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">${lang === 'ar' ? 'رسوم البنك' : 'Bank Fees'}:</span>
                            <span class="detail-value amount">${formatCurrency(transaction.bankFees)}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">${lang === 'ar' ? 'صافي المبلغ' : 'Net Amount'}:</span>
                            <span class="detail-value highlight amount">${formatCurrency(transaction.netAmount)}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">${lang === 'ar' ? 'التاريخ' : 'Date'}:</span>
                            <span class="detail-value">${formatDate(transaction.date)}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">${lang === 'ar' ? 'طريقة الدفع' : 'Payment Method'}:</span>
                            <span class="detail-value">${formatPaymentMethod(transaction.paymentMethod)}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">${lang === 'ar' ? 'نوع العقد' : 'Contract Type'}:</span>
                            <span class="detail-value">${transaction.contractType}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">${lang === 'ar' ? 'دفعة أولى' : 'First Payment'}:</span>
                            <span class="detail-value">${transaction.isFirstPayment ? (lang === 'ar' ? 'نعم' : 'Yes') : (lang === 'ar' ? 'لا' : 'No')}</span>
                        </div>
                    </div>
                    <div class="rejection-reason-box">
                        <div class="reason-header">
                            <span>📝</span>
                            <span>${lang === 'ar' ? 'سبب الرفض' : 'Rejection Reason'}</span>
                        </div>
                        <div class="reason-text">${transaction.rejectionReason}</div>
                        <div class="reason-meta">
                            ${lang === 'ar' ? 'رفض بواسطة' : 'Rejected by'}: ${transaction.rejectedBy} |
                            ${formatDateTime(transaction.rejectedAt)}
                        </div>
                    </div>
                    <div class="notification-actions">
                        <button class="btn btn-sm btn-warning" onclick="rereviewTransaction('${transaction.id}')">
                            🔄 ${lang === 'ar' ? 'إعادة مراجعة' : 'Re-review'}
                        </button>
                        <button class="btn btn-sm btn-primary" onclick="viewTransactionDetails('${transaction.id}')">
                            👁 ${lang === 'ar' ? 'تفاصيل' : 'Details'}
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Render approved transactions
    if (approvedTransactions.length === 0) {
        approvedList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <div class="empty-state-message">
                    ${AppState.currentLanguage === 'ar' ? 'لا توجد معاملات معتمدة' : 'No approved transactions'}
                </div>
            </div>
        `;
    } else {
        approvedList.innerHTML = approvedTransactions.slice(0, 10).map(transaction => {
            const schoolName = AppState.currentLanguage === 'ar' ? transaction.schoolName : transaction.schoolNameEn;
            const lang = AppState.currentLanguage;

            return `
                <div class="notification-card approved">
                    <div class="notification-header">
                        <div class="notification-status approved">✅ ${t('approvedTransaction')}</div>
                    </div>
                    <div class="notification-title">${schoolName}</div>
                    <div class="notification-details">
                        <div class="detail-row">
                            <span class="detail-label">${lang === 'ar' ? 'صافي المبلغ' : 'Net Amount'}:</span>
                            <span class="detail-value highlight amount">${formatCurrency(transaction.netAmount)}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">${lang === 'ar' ? 'التاريخ' : 'Date'}:</span>
                            <span class="detail-value">${formatDate(transaction.date)}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">${lang === 'ar' ? 'معتمد بواسطة' : 'Approved by'}:</span>
                            <span class="detail-value">${transaction.approvedBy || '-'}</span>
                        </div>
                    </div>
                    <div class="notification-actions">
                        <button class="btn btn-sm btn-primary" onclick="viewTransactionDetails('${transaction.id}')">
                            👁 ${lang === 'ar' ? 'تفاصيل' : 'Details'}
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
}

function approveTransaction(transactionId) {
    const transaction = AppState.transactions.find(t => t.id === transactionId);
    if (!transaction || transaction.status !== 'ST-02') return;

    AppState.currentTransactionId = transactionId;
    document.getElementById('confirmMessage').textContent = t('confirmApprove');
    openModal('confirmModal');

    document.getElementById('confirmAction').onclick = () => {
        transaction.status = 'ST-03';
        transaction.approvedBy = AppState.currentUser.nameAr;
        transaction.approvedAt = new Date().toISOString();
        transaction.history.push({
            status: 'ST-03',
            date: new Date().toISOString(),
            user: AppState.currentUser.nameAr,
            action: AppState.currentLanguage === 'ar' ? 'تم الاعتماد' : 'Approved'
        });

        saveTransactions();
        closeModal('confirmModal');
        showToast(t('transactionApproved'), 'success');
        renderNotifications();
    };
}

function openRejectModal(transactionId) {
    AppState.currentTransactionId = transactionId;
    openModal('rejectModal');
}

function rejectTransaction() {
    const reason = document.getElementById('rejectionReason').value.trim();

    if (!reason) {
        showToast(t('rejectionReasonRequired'), 'error');
        return;
    }

    const transaction = AppState.transactions.find(t => t.id === AppState.currentTransactionId);
    if (!transaction) return;

    transaction.status = 'ST-01';
    transaction.rejectionReason = reason;
    transaction.rejectedBy = AppState.currentUser.nameAr;
    transaction.rejectedAt = new Date().toISOString();
    transaction.history.push({
        status: 'ST-01',
        date: new Date().toISOString(),
        user: AppState.currentUser.nameAr,
        action: AppState.currentLanguage === 'ar' ? 'تم الرفض' : 'Rejected',
        reason: reason
    });

    saveTransactions();
    closeModal('rejectModal');
    showToast(t('transactionRejected'), 'success');
    renderNotifications();
}

function rereviewTransaction(transactionId) {
    const transaction = AppState.transactions.find(t => t.id === transactionId);
    if (!transaction || !transaction.rejectionReason) return;

    AppState.currentTransactionId = transactionId;
    document.getElementById('confirmMessage').textContent = t('confirmRereview');
    openModal('confirmModal');

    document.getElementById('confirmAction').onclick = () => {
        transaction.rejectionReason = null;
        transaction.rejectedBy = null;
        transaction.rejectedAt = null;
        transaction.history.push({
            status: 'ST-01',
            date: new Date().toISOString(),
            user: AppState.currentUser.nameAr,
            action: AppState.currentLanguage === 'ar' ? 'إعادة مراجعة' : 'Re-reviewed'
        });

        saveTransactions();
        closeModal('confirmModal');
        showToast(t('transactionRereviewed'), 'success');
        renderNotifications();
        updateNotificationBadge();
    };
}

function updateNotificationBadge() {
    const badge = document.getElementById('notificationBadge');
    let count = 0;

    if (AppState.currentUser.role === 'approver') {
        count = AppState.transactions.filter(t => t.status === 'ST-02').length;
    } else {
        count = AppState.transactions.filter(t => t.rejectionReason).length;
    }

    badge.textContent = count;
    if (count > 0) {
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
}

// Excel Export Functions
function exportToExcel(data, filename) {
    const lang = AppState.currentLanguage;

    // Create CSV content
    let csvContent = '';

    if (data.type === 'dashboard') {
        csvContent = lang === 'ar' ?
            'إجمالي المبالغ,رسوم العقد التنفيذي,رسوم المعاملات البنكية,صافي المبلغ\n' :
            'Total Amount,Contract Fees,Bank Fees,Net Amount\n';
        csvContent += `${data.totalAmount},${data.contractFees},${data.bankFees},${data.netAmount}\n`;
    } else if (data.type === 'transactions') {
        csvContent = lang === 'ar' ?
            'اسم المدرسة,رقم المرجع,المبلغ الأصلي,رسوم العقد,رسوم البنك,صافي المبلغ,التاريخ,طريقة الدفع,الحالة\n' :
            'School Name,Reference Number,Original Amount,Contract Fees,Bank Fees,Net Amount,Date,Payment Method,Status\n';

        data.transactions.forEach(t => {
            const schoolName = lang === 'ar' ? t.schoolName : t.schoolNameEn;
            csvContent += `"${schoolName}",${t.referenceNumber},${t.originalAmount},${t.contractFees},${t.bankFees},${t.netAmount},"${formatDate(t.date)}","${formatPaymentMethod(t.paymentMethod)}","${t.status}"\n`;
        });
    }

    // Create blob and download
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(t('exportSuccess'), 'success');
}

function exportDashboard() {
    const filtered = getFilteredDashboardTransactions();
    const totalAmount = filtered.reduce((sum, t) => sum + t.originalAmount, 0);
    const contractFees = filtered.reduce((sum, t) => sum + t.contractFees, 0);
    const bankFees = filtered.reduce((sum, t) => sum + t.bankFees, 0);
    const netAmount = filtered.reduce((sum, t) => sum + t.netAmount, 0);

    exportToExcel({
        type: 'dashboard',
        totalAmount,
        contractFees,
        bankFees,
        netAmount
    }, `dashboard-${new Date().toISOString().split('T')[0]}.csv`);
}

function exportTransactions() {
    const transactions = AppState.filteredTransactions.length > 0 ?
        AppState.filteredTransactions : AppState.transactions;

    exportToExcel({
        type: 'transactions',
        transactions
    }, `transactions-${new Date().toISOString().split('T')[0]}.csv`);
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat(AppState.currentLanguage === 'ar' ? 'ar-SA' : 'en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString(AppState.currentLanguage === 'ar' ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString(AppState.currentLanguage === 'ar' ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatPaymentMethod(method) {
    return t(method);
}

function getStatusBadge(status) {
    const statusTexts = {
        ar: {
            'ST-01': 'في انتظار المراجعة',
            'ST-02': 'قيد المراجعة',
            'ST-03': 'معتمد',
            'ST-04': 'تم التحويل',
            'ST-05': 'فشل التحويل',
            'ST-06': 'مكتمل'
        },
        en: {
            'ST-01': 'Awaiting Review',
            'ST-02': 'Under Review',
            'ST-03': 'Approved',
            'ST-04': 'Transferred',
            'ST-05': 'Transfer Failed',
            'ST-06': 'Completed'
        }
    };

    const text = statusTexts[AppState.currentLanguage][status] || status;
    return `<span class="status-badge status-${status}">${text}</span>`;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize app
    initializeMockData();

    // Check language preference
    const savedLanguage = localStorage.getItem('language') || 'ar';
    setLanguage(savedLanguage);

    // Check authentication
    if (checkAuth()) {
        showPage('mainApp');
        updateUserInfo();
        updateNotificationBadge();
        showContentPage('dashboardPage');
    } else {
        showPage('loginPage');
    }

    // Login form
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (login(username, password)) {
            showPage('mainApp');
            updateUserInfo();
            updateNotificationBadge();
            showContentPage('dashboardPage');
            showToast(t('loginSuccess'), 'success');
            document.getElementById('loginError').textContent = '';
        } else {
            document.getElementById('loginError').textContent = t('invalidCredentials');
        }
    });

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Language toggle buttons
    document.getElementById('langToggle').addEventListener('click', () => {
        setLanguage(AppState.currentLanguage === 'ar' ? 'en' : 'ar');
    });

    document.getElementById('langToggleApp').addEventListener('click', () => {
        setLanguage(AppState.currentLanguage === 'ar' ? 'en' : 'ar');
    });

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.getAttribute('data-page');
            showContentPage(page + 'Page');
        });
    });

    // Dashboard filters
    document.getElementById('dashboardPeriod').addEventListener('change', (e) => {
        const customRange = document.getElementById('customDateRange');
        const customRangeTo = document.getElementById('customDateRangeTo');
        if (e.target.value === 'custom') {
            customRange.style.display = 'block';
            customRangeTo.style.display = 'block';
        } else {
            customRange.style.display = 'none';
            customRangeTo.style.display = 'none';
        }
    });

    document.getElementById('applyDashboardFilter').addEventListener('click', updateDashboard);

    // Transaction filters
    document.getElementById('applyTransactionFilters').addEventListener('click', applyTransactionFilters);
    document.getElementById('clearFilters').addEventListener('click', clearTransactionFilters);

    // Export buttons
    document.getElementById('exportDashboard').addEventListener('click', exportDashboard);
    document.getElementById('exportTransactions').addEventListener('click', exportTransactions);

    // Reject modal
    document.getElementById('confirmReject').addEventListener('click', rejectTransaction);

    // Sidebar toggle for mobile
    document.getElementById('sidebarToggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('open');
    });

    // Close modals on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
});

function updateUserInfo() {
    if (AppState.currentUser) {
        const userName = AppState.currentLanguage === 'ar' ?
            AppState.currentUser.nameAr : AppState.currentUser.nameEn;
        const userRole = t(AppState.currentUser.role);

        document.getElementById('userName').textContent = userName;
        document.getElementById('userRole').textContent = userRole;
    }
}

// Make functions globally accessible
window.viewTransactionDetails = viewTransactionDetails;
window.reviewTransaction = reviewTransaction;
window.approveTransaction = approveTransaction;
window.openRejectModal = openRejectModal;
window.rereviewTransaction = rereviewTransaction;
window.closeModal = closeModal;
