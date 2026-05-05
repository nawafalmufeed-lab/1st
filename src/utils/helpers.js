export const STATUS_CONFIG = {
  awaiting_review: {
    labelAr: 'في انتظار المراجعة',
    labelEn: 'Awaiting Review',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
    badge: 'amber',
  },
  under_review: {
    labelAr: 'قيد المراجعة',
    labelEn: 'Under Review',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
    badge: 'blue',
  },
  approved: {
    labelAr: 'معتمد',
    labelEn: 'Approved',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    dot: 'bg-purple-500',
    badge: 'purple',
  },
  transferred: {
    labelAr: 'تم التحويل',
    labelEn: 'Transferred',
    color: 'bg-green-100 text-green-700 border-green-200',
    dot: 'bg-green-500',
    badge: 'green',
  },
  transfer_failed: {
    labelAr: 'فشل التحويل',
    labelEn: 'Transfer Failed',
    color: 'bg-red-100 text-red-700 border-red-200',
    dot: 'bg-red-500',
    badge: 'red',
  },
  completed: {
    labelAr: 'مكتمل',
    labelEn: 'Completed',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-600',
    badge: 'emerald',
  },
}

export const formatAmount = (amount, currency = 'SAR') => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatDate = (dateStr, lang = 'ar') => {
  if (!dateStr) return '—'
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-SA' : 'en-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    calendar: 'gregory',
  }).format(new Date(dateStr))
}

export const formatDateTime = (dateStr, lang = 'ar') => {
  if (!dateStr) return '—'
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-SA' : 'en-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    calendar: 'gregory',
  }).format(new Date(dateStr))
}

export const generateBankRef = () =>
  `BNK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

export const canRetry = (txn) => {
  if (txn.retryCount >= 5) return false
  if (!txn.lastRetryDate) return true
  const cooldown = 30 * 60 * 1000 // 30 minutes in ms
  return Date.now() - new Date(txn.lastRetryDate).getTime() >= cooldown
}

export const retryTimeRemaining = (txn) => {
  if (!txn.lastRetryDate) return 0
  const cooldown = 30 * 60 * 1000
  const elapsed = Date.now() - new Date(txn.lastRetryDate).getTime()
  return Math.max(0, Math.ceil((cooldown - elapsed) / 60000))
}

export const exportToCSV = (data, filename, lang = 'ar') => {
  const headers = lang === 'ar'
    ? ['المعرف', 'اسم المدرسة', 'المبلغ', 'الرسوم البنكية', 'الرسوم التنفيذية', 'الصافي', 'رقم المرجع', 'IBAN', 'تاريخ الاستلام', 'تاريخ الإجراء', 'الحالة']
    : ['ID', 'School Name', 'Amount', 'Bank Fee', 'Executive Fee', 'Net Amount', 'Reference', 'IBAN', 'Received Date', 'Action Date', 'Status']

  const rows = data.map(t => [
    t.id,
    lang === 'ar' ? t.schoolName : t.schoolNameEn,
    t.amount,
    t.bankFee,
    t.executiveFee,
    t.netAmount,
    t.referenceNumber,
    t.iban,
    formatDate(t.receivedDate, lang),
    formatDate(t.actionDate, lang),
    lang === 'ar' ? STATUS_CONFIG[t.status]?.labelAr : STATUS_CONFIG[t.status]?.labelEn,
  ])

  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
