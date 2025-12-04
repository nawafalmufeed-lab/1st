// ===================================
// Sample Transaction Data
// ===================================
const transactions = [
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

let allTransactions = [...transactions];
let selectedTransactions = [];

// ===================================
// Initialization
// ===================================
window.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
        return;
    }

    // Set user info
    const userName = localStorage.getItem('userName');
    const userType = localStorage.getItem('userType');
    if (userName) {
        document.getElementById('userName').textContent = userName;
        document.getElementById('userRole').textContent = userType === 'reviewer' ? 'مراجع' : 'معتمد';
    }

    // Initialize navigation
    initNavigation();

    // Render initial data
    renderTransactions(allTransactions);
    renderRecentTransactions();
});

// ===================================
// Navigation
// ===================================
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const tab = this.dataset.tab;
            showTab(tab);

            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function showTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
}

// ===================================
// Logout
// ===================================
function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userType');
    window.location.href = 'login.html';
}

// ===================================
// Dashboard - Recent Transactions
// ===================================
function renderRecentTransactions() {
    const container = document.getElementById('recentTransactionsList');
    if (!container) return;

    const recent = allTransactions.slice(0, 5);

    container.innerHTML = recent.map(transaction => `
        <div class="transaction-item" onclick="showDetails(${allTransactions.indexOf(transaction)})">
            <div>
                <div style="font-weight: 600; margin-bottom: 0.25rem;">${transaction.school}</div>
                <div style="font-size: 0.75rem; color: var(--text-secondary);">${transaction.date}</div>
            </div>
            <div style="text-align: left;">
                <div style="font-weight: 700; color: var(--primary-color); margin-bottom: 0.25rem;">
                    ${transaction.netAmount.toFixed(2)} ر.س
                </div>
                <span class="status-badge ${getStatusClass(transaction.status)}">${getStatusText(transaction.status)}</span>
            </div>
        </div>
    `).join('');
}

// ===================================
// Filter by Status
// ===================================
function filterByStatus(status) {
    showTab('transactions');

    // Update active nav
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector('[data-tab="transactions"]').classList.add('active');

    // Set filter
    document.getElementById('statusFilter').value = status;
    filterTransactions();
}

// ===================================
// Render Transactions Table
// ===================================
function renderTransactions(data) {
    const tbody = document.getElementById('transactionsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    data.forEach((transaction, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="transaction-checkbox" data-index="${allTransactions.indexOf(transaction)}" onchange="updateSelection()"></td>
            <td style="font-family: 'Courier New', monospace; font-size: 0.75rem; color: var(--text-secondary);">${transaction.id}</td>
            <td><span class="payment-badge ${transaction.paymentMethod.toLowerCase()}">${transaction.paymentMethod}</span></td>
            <td>${transaction.originalAmount.toFixed(2)} ر.س</td>
            <td>${transaction.activationFee.toFixed(2)} ر.س</td>
            <td>${transaction.transactionFee.toFixed(2)} ر.س</td>
            <td style="font-weight: 700; color: var(--primary-color);">${transaction.netAmount.toFixed(2)} ر.س</td>
            <td>${transaction.school}</td>
            <td style="font-family: 'Courier New', monospace; font-size: 0.75rem;">${transaction.iban}</td>
            <td style="font-size: 0.8125rem; color: var(--text-secondary);">${transaction.date}</td>
            <td><span class="status-badge ${getStatusClass(transaction.status)}">${getStatusText(transaction.status)}</span></td>
            <td>
                <button class="btn-icon" onclick="showDetails(${allTransactions.indexOf(transaction)})" style="padding: 0.5rem; background: transparent; border: none; cursor: pointer; font-size: 1.125rem;" title="عرض التفاصيل">👁️</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// ===================================
// Status Helper Functions
// ===================================
function getStatusClass(status) {
    const statusMap = {
        'ST-01': 'pending',
        'ST-02': 'reviewing',
        'ST-03': 'approved',
        'ST-04': 'transferred',
        'ST-05': 'failed'
    };
    return statusMap[status] || 'pending';
}

function getStatusText(status) {
    const statusMap = {
        'ST-01': 'بانتظار المراجعة',
        'ST-02': 'قيد المراجعة',
        'ST-03': 'معتمد',
        'ST-04': 'تم التحويل',
        'ST-05': 'فشل التحويل'
    };
    return statusMap[status] || status;
}

// ===================================
// Filter Transactions
// ===================================
function filterTransactions() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const paymentFilter = document.getElementById('paymentFilter').value;

    const filtered = allTransactions.filter(transaction => {
        const matchesSearch = transaction.id.toLowerCase().includes(searchTerm) ||
                            transaction.school.toLowerCase().includes(searchTerm) ||
                            transaction.iban.toLowerCase().includes(searchTerm);
        const matchesStatus = !statusFilter || transaction.status === statusFilter;
        const matchesPayment = !paymentFilter || transaction.paymentMethod === paymentFilter;

        return matchesSearch && matchesStatus && matchesPayment;
    });

    renderTransactions(filtered);
}

// ===================================
// Select All Checkbox
// ===================================
function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.transaction-checkbox');
    checkboxes.forEach(cb => cb.checked = selectAll.checked);
    updateSelection();
}

// ===================================
// Update Selection
// ===================================
function updateSelection() {
    const checkboxes = document.querySelectorAll('.transaction-checkbox:checked');
    selectedTransactions = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index));
}

// ===================================
// Review Selected
// ===================================
function reviewSelected() {
    if (selectedTransactions.length === 0) {
        alert('الرجاء تحديد معاملة واحدة على الأقل');
        return;
    }

    const confirm = window.confirm(`هل أنت متأكد من مراجعة ${selectedTransactions.length} معاملة؟\n\nسيتم تحديث الحالة من ST-01 إلى ST-02`);

    if (confirm) {
        selectedTransactions.forEach(index => {
            if (allTransactions[index].status === 'ST-01') {
                allTransactions[index].status = 'ST-02';
            }
        });

        renderTransactions(allTransactions);
        renderRecentTransactions();
        document.getElementById('selectAll').checked = false;
        selectedTransactions = [];

        alert('تمت المراجعة بنجاح! تم إرسال إشعار للمعتمد.');
    }
}

// ===================================
// Show Transaction Details
// ===================================
function showDetails(index) {
    const transaction = allTransactions[index];
    const modal = document.getElementById('detailsModal');
    const modalBody = document.getElementById('modalBody');

    modalBody.innerHTML = `
        <div style="display: grid; gap: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--bg-secondary); border-radius: 8px;">
                <label style="font-size: 0.875rem; color: var(--text-secondary);">رقم المرجعي:</label>
                <span style="font-family: 'Courier New', monospace; font-size: 0.75rem;">${transaction.id}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--bg-secondary); border-radius: 8px;">
                <label style="font-size: 0.875rem; color: var(--text-secondary);">اسم المدرسة:</label>
                <span style="font-size: 0.875rem; font-weight: 600;">${transaction.school}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--bg-secondary); border-radius: 8px;">
                <label style="font-size: 0.875rem; color: var(--text-secondary);">رقم الحساب (IBAN):</label>
                <span style="font-family: 'Courier New', monospace; font-size: 0.75rem;">${transaction.iban}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--bg-secondary); border-radius: 8px;">
                <label style="font-size: 0.875rem; color: var(--text-secondary);">المبلغ الأصلي:</label>
                <span style="font-size: 0.875rem; font-weight: 600;">${transaction.originalAmount.toFixed(2)} ر.س</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--bg-secondary); border-radius: 8px;">
                <label style="font-size: 0.875rem; color: var(--text-secondary);">رسوم التنشيط:</label>
                <span style="font-size: 0.875rem; font-weight: 600;">${transaction.activationFee.toFixed(2)} ر.س</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--bg-secondary); border-radius: 8px;">
                <label style="font-size: 0.875rem; color: var(--text-secondary);">رسوم المعاملة:</label>
                <span style="font-size: 0.875rem; font-weight: 600;">${transaction.transactionFee.toFixed(2)} ر.س</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--bg-secondary); border-radius: 8px;">
                <label style="font-size: 0.875rem; color: var(--text-secondary);">صافي المبلغ:</label>
                <span style="font-size: 1rem; font-weight: 700; color: var(--primary-color);">${transaction.netAmount.toFixed(2)} ر.س</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--bg-secondary); border-radius: 8px;">
                <label style="font-size: 0.875rem; color: var(--text-secondary);">وسيلة الدفع:</label>
                <span class="payment-badge ${transaction.paymentMethod.toLowerCase()}">${transaction.paymentMethod}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--bg-secondary); border-radius: 8px;">
                <label style="font-size: 0.875rem; color: var(--text-secondary);">تاريخ التحويل:</label>
                <span style="font-size: 0.875rem; font-weight: 600;">${transaction.date}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--bg-secondary); border-radius: 8px;">
                <label style="font-size: 0.875rem; color: var(--text-secondary);">حالة التحويل:</label>
                <span class="status-badge ${getStatusClass(transaction.status)}">${getStatusText(transaction.status)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--bg-secondary); border-radius: 8px;">
                <label style="font-size: 0.875rem; color: var(--text-secondary);">نوع العقد:</label>
                <span style="font-size: 0.875rem; font-weight: 600;">${transaction.contractType}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--bg-secondary); border-radius: 8px;">
                <label style="font-size: 0.875rem; color: var(--text-secondary);">أول دفعة:</label>
                <span style="font-size: 0.875rem; font-weight: 600;">${transaction.isFirstPayment ? 'نعم' : 'لا'}</span>
            </div>
        </div>
    `;

    modal.style.display = 'flex';
}

// ===================================
// Close Details Modal
// ===================================
function closeDetailsModal() {
    document.getElementById('detailsModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('detailsModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// ===================================
// Fee Calculator
// ===================================
function calculateFees() {
    const amount = parseFloat(document.getElementById('calcAmount').value);
    const paymentMethod = document.getElementById('calcPaymentMethod').value;
    const contractType = document.getElementById('calcContractType').value;
    const isFirstPayment = document.getElementById('calcIsFirstPayment').checked;

    if (!amount || !paymentMethod || !contractType) {
        alert('الرجاء إدخال جميع البيانات المطلوبة');
        return;
    }

    let transactionFee = 0;
    let feeRate = 0;

    // Calculate transaction fee based on payment method
    switch(paymentMethod) {
        case 'mada':
            feeRate = 0.0085;
            transactionFee = amount * 0.0085;
            break;
        case 'visa':
            feeRate = 0.0117;
            transactionFee = amount * 0.0117;
            break;
        case 'tamara':
            feeRate = 0.10;
            transactionFee = amount * 0.10;
            break;
    }

    // Calculate activation fee
    let activationFee = 0;
    if (contractType === 'executive' && isFirstPayment) {
        activationFee = 85;
    }

    // Calculate net amount
    const netAmount = amount - activationFee - transactionFee;

    // Display result
    const resultDiv = document.getElementById('calculatorResult');
    resultDiv.innerHTML = `
        <h3>نتيجة الحساب</h3>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--bg-secondary); border-radius: 8px;">
                <span>المبلغ الأصلي:</span>
                <span style="font-weight: 600;">${amount.toFixed(2)} ر.س</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--bg-secondary); border-radius: 8px; color: var(--error);">
                <span>رسوم التنشيط (BR-01):</span>
                <span style="font-weight: 600;">- ${activationFee.toFixed(2)} ر.س</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--bg-secondary); border-radius: 8px; color: var(--error);">
                <span>رسوم المعاملة (BR-02) - ${(feeRate * 100).toFixed(2)}%:</span>
                <span style="font-weight: 600;">- ${transactionFee.toFixed(2)} ر.س</span>
            </div>
            <div style="height: 1px; background: var(--border-color); margin: 0.5rem 0;"></div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--primary-color); color: white; border-radius: 8px; font-weight: 700;">
                <span>صافي المبلغ:</span>
                <span style="font-size: 1.125rem;">${netAmount.toFixed(2)} ر.س</span>
            </div>
        </div>
        <div style="margin-top: 1.5rem; padding: 1rem; background: var(--bg-secondary); border-radius: 8px;">
            <p style="margin-bottom: 0.5rem;"><strong>ملاحظات:</strong></p>
            <ul style="margin: 0.5rem 0 0 0; padding-right: 1.5rem; font-size: 0.875rem; color: var(--text-secondary);">
                ${activationFee > 0 ? '<li>تم تطبيق رسوم التنشيط لأنها أول دفعة والعقد تنفيذي</li>' : '<li>لم يتم تطبيق رسوم التنشيط</li>'}
                <li>نسبة رسوم المعاملة ${(feeRate * 100).toFixed(2)}% حسب وسيلة الدفع</li>
                <li>إجمالي الرسوم: ${(activationFee + transactionFee).toFixed(2)} ر.س</li>
            </ul>
        </div>
    `;
}

// ===================================
// Export to Excel
// ===================================
function exportToExcel() {
    if (typeof XLSX === 'undefined') {
        alert('مكتبة Excel غير محملة. يرجى التحديث والمحاولة مرة أخرى.');
        return;
    }

    // Prepare data for export
    const exportData = allTransactions.map(transaction => ({
        'رقم المرجعي': transaction.id,
        'اسم المدرسة': transaction.school,
        'رقم الحساب': transaction.iban,
        'المبلغ الأصلي': transaction.originalAmount.toFixed(2),
        'رسوم التنشيط': transaction.activationFee.toFixed(2),
        'رسوم المعاملة': transaction.transactionFee.toFixed(2),
        'صافي المبلغ': transaction.netAmount.toFixed(2),
        'وسيلة الدفع': transaction.paymentMethod,
        'تاريخ التحويل': transaction.date,
        'حالة التحويل': getStatusText(transaction.status),
        'نوع العقد': transaction.contractType,
        'أول دفعة': transaction.isFirstPayment ? 'نعم' : 'لا'
    }));

    // Create workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    const colWidths = [
        { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 15 },
        { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
        { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 10 }
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'التحويلات');

    // Generate file name with current date
    const date = new Date().toISOString().split('T')[0];
    const fileName = `تقرير_التحويلات_${date}.xlsx`;

    // Save file
    XLSX.writeFile(wb, fileName);
}
