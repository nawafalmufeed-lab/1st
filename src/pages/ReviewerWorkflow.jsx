import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { StatusBadge } from '../components/ui/StatusBadge'
import { formatAmount, formatDate } from '../utils/helpers'
import { CheckSquare, ChevronDown, ChevronUp, ClipboardCheck, Clock, Info } from 'lucide-react'

export const ReviewerWorkflow = () => {
  const { transactions, sendToReview, lang, t, currentUser } = useApp()
  const [expandedId, setExpandedId] = useState(null)
  const [sending, setSending] = useState({})

  const awaiting = transactions.filter(tx => tx.status === 'awaiting_review')

  const handleSend = (id) => {
    setSending(s => ({ ...s, [id]: true }))
    setTimeout(() => {
      sendToReview(id)
      setSending(s => ({ ...s, [id]: false }))
    }, 600)
  }

  return (
    <div className="p-6 space-y-5 animate-slide-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="page-title">{t('سير عمل المراجع', 'Reviewer Workflow')}</h2>
          <p className="page-subtitle">{t('مراجعة وإرسال المعاملات المعلقة', 'Review and forward pending transactions')}</p>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <Clock className="w-4 h-4 text-amber-600" />
          <div>
            <div className="text-lg font-bold text-amber-700">{awaiting.length}</div>
            <div className="text-xs text-amber-600">{t('في انتظار المراجعة', 'Awaiting Review')}</div>
          </div>
        </div>
      </div>

      {/* Role info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-700">
          <strong>{lang === 'ar' ? currentUser?.nameAr : currentUser?.nameEn}</strong>
          {' '}{t('— دورك كمراجع هو إرسال المعاملات إلى مرحلة "قيد المراجعة" فقط. الموافقة النهائية تتم من قبل المعتمد.',
            '— As a reviewer, your role is to forward transactions to "Under Review". Final approval is done by the Approver.')}
        </div>
      </div>

      {awaiting.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-16 text-center shadow-sm">
          <ClipboardCheck className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-700 mb-1">{t('لا توجد معاملات معلقة', 'No pending transactions')}</h3>
          <p className="text-sm text-slate-400">{t('جميع المعاملات تمت مراجعتها', 'All transactions have been reviewed')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {awaiting.map(txn => (
            <div
              key={txn.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
            >
              {/* Main row */}
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setExpandedId(expandedId === txn.id ? null : txn.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-slate-900 text-sm">
                      {lang === 'ar' ? txn.schoolName : txn.schoolNameEn}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">{txn.region}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="font-mono">{txn.referenceNumber}</span>
                    <span>•</span>
                    <span>{formatDate(txn.receivedDate, lang)}</span>
                  </div>
                </div>
                <div className="text-end">
                  <div className="font-bold text-slate-900">{formatAmount(txn.amount)}</div>
                  <div className="text-xs text-slate-400">{t('صافي:', 'Net:')} {formatAmount(txn.netAmount)}</div>
                </div>
                <StatusBadge status={txn.status} size="sm" />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSend(txn.id)
                  }}
                  disabled={sending[txn.id]}
                  className="btn-primary text-xs py-1.5 px-3 whitespace-nowrap disabled:opacity-70"
                >
                  {sending[txn.id] ? (
                    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : <CheckSquare className="w-3.5 h-3.5" />}
                  {t('إرسال للمراجعة', 'Send to Review')}
                </button>
                {expandedId === txn.id
                  ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
              </div>

              {/* Expanded details */}
              {expandedId === txn.id && (
                <div className="border-t border-slate-100 px-5 py-4 bg-slate-50 animate-slide-in">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      [t('رقم IBAN', 'IBAN'), txn.iban],
                      [t('الرسوم البنكية', 'Bank Fee'), formatAmount(txn.bankFee)],
                      [t('الرسوم التنفيذية', 'Exec Fee'), formatAmount(txn.executiveFee)],
                      [t('المعرف', 'Transaction ID'), txn.id],
                    ].map(([k, v]) => (
                      <div key={k} className="bg-white rounded-lg p-2.5 border border-slate-200">
                        <div className="text-xs text-slate-500 mb-0.5">{k}</div>
                        <div className="text-sm font-medium text-slate-800 font-mono truncate">{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
