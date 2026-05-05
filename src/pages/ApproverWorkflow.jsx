import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { StatusBadge } from '../components/ui/StatusBadge'
import { Modal } from '../components/ui/Modal'
import { formatAmount, formatDate } from '../utils/helpers'
import { BadgeCheck, AlertTriangle, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react'

export const ApproverWorkflow = () => {
  const { transactions, approveTransaction, lang, t, currentUser } = useApp()
  const [confirmId, setConfirmId] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [approving, setApproving] = useState({})

  const underReview = transactions.filter(tx => tx.status === 'under_review')
  const confirmTxn = transactions.find(tx => tx.id === confirmId)

  const handleApprove = () => {
    if (!confirmId) return
    setApproving(s => ({ ...s, [confirmId]: true }))
    setTimeout(() => {
      approveTransaction(confirmId)
      setApproving(s => ({ ...s, [confirmId]: false }))
      setConfirmId(null)
    }, 500)
  }

  return (
    <div className="p-6 space-y-5 animate-slide-in">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="page-title">{t('سير عمل المعتمد', 'Approver Workflow')}</h2>
          <p className="page-subtitle">{t('الموافقة النهائية وإرسال المعاملات للبنك', 'Final approval and bank transfer initiation')}</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
          <BadgeCheck className="w-4 h-4 text-blue-600" />
          <div>
            <div className="text-lg font-bold text-blue-700">{underReview.length}</div>
            <div className="text-xs text-blue-600">{t('قيد المراجعة', 'Under Review')}</div>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-amber-700">
          {t('بالموافقة على المعاملة سيتم إرسالها مباشرةً للبنك. هذا الإجراء لا يمكن التراجع عنه.',
            'Approving a transaction will immediately send it to the bank. This action cannot be undone.')}
        </p>
      </div>

      {underReview.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-16 text-center shadow-sm">
          <ShieldCheck className="w-12 h-12 text-blue-400 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-700 mb-1">{t('لا توجد معاملات للاعتماد', 'No transactions to approve')}</h3>
          <p className="text-sm text-slate-400">{t('جميع المعاملات تمت معالجتها', 'All transactions have been processed')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {underReview.map(txn => (
            <div key={txn.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
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
                    <span>{t('المراجع:', 'Reviewer:')} {txn.reviewerName || '—'}</span>
                    <span>•</span>
                    <span>{formatDate(txn.actionDate, lang)}</span>
                  </div>
                </div>
                <div className="text-end">
                  <div className="font-bold text-slate-900">{formatAmount(txn.amount)}</div>
                  <div className="text-xs text-slate-400">{t('صافي:', 'Net:')} {formatAmount(txn.netAmount)}</div>
                </div>
                <StatusBadge status={txn.status} size="sm" />
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmId(txn.id) }}
                  className="btn-success text-xs py-1.5 px-3 whitespace-nowrap"
                >
                  <BadgeCheck className="w-3.5 h-3.5" />
                  {t('اعتماد', 'Approve')}
                </button>
                {expandedId === txn.id
                  ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
              </div>

              {expandedId === txn.id && (
                <div className="border-t border-slate-100 px-5 py-4 bg-slate-50 animate-slide-in">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      [t('رقم IBAN', 'IBAN'), txn.iban],
                      [t('الرسوم البنكية', 'Bank Fee'), formatAmount(txn.bankFee)],
                      [t('الرسوم التنفيذية', 'Exec Fee'), formatAmount(txn.executiveFee)],
                      [t('تاريخ الاستلام', 'Received'), formatDate(txn.receivedDate, lang)],
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

      {/* Confirm Modal */}
      <Modal
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        title={t('تأكيد الاعتماد', 'Confirm Approval')}
        size="sm"
      >
        {confirmTxn && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700">
                {t('هل أنت متأكد من اعتماد هذه المعاملة؟ سيتم إرسالها للبنك فوراً.',
                  'Are you sure you want to approve this transaction? It will be sent to the bank immediately.')}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">{t('المدرسة:', 'School:')}</span>
                <span className="font-medium text-slate-900">
                  {lang === 'ar' ? confirmTxn.schoolName : confirmTxn.schoolNameEn}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">{t('المبلغ:', 'Amount:')}</span>
                <span className="font-bold text-slate-900">{formatAmount(confirmTxn.amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">{t('رقم IBAN:', 'IBAN:')}</span>
                <span className="font-mono text-xs text-slate-700">{confirmTxn.iban}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">{t('المرجع:', 'Reference:')}</span>
                <span className="font-mono text-xs text-slate-700">{confirmTxn.referenceNumber}</span>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setConfirmId(null)}
                className="btn-secondary flex-1 justify-center"
              >
                {t('إلغاء', 'Cancel')}
              </button>
              <button
                onClick={handleApprove}
                disabled={approving[confirmId]}
                className="btn-success flex-1 justify-center disabled:opacity-70"
              >
                {approving[confirmId] ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : <BadgeCheck className="w-4 h-4" />}
                {t('نعم، اعتماد', 'Yes, Approve')}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
