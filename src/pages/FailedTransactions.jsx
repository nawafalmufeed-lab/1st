import React, { useState, useEffect, useCallback } from 'react'
import { useApp } from '../context/AppContext'
import { StatusBadge } from '../components/ui/StatusBadge'
import { formatAmount, formatDate, formatDateTime, canRetry, retryTimeRemaining } from '../utils/helpers'
import { AlertOctagon, RefreshCw, Clock, ChevronDown, ChevronUp, History, Lock } from 'lucide-react'

const MAX_RETRIES = 5

export const FailedTransactions = () => {
  const { transactions, retryTransfer, lang, t } = useApp()
  const [expandedId, setExpandedId] = useState(null)
  const [retrying, setRetrying] = useState({})
  const [timer, setTimer] = useState(0)

  // Tick for cooldown countdown
  useEffect(() => {
    const interval = setInterval(() => setTimer(t => t + 1), 30000)
    return () => clearInterval(interval)
  }, [])

  const failed = transactions.filter(tx => tx.status === 'transfer_failed')

  const handleRetry = useCallback((id) => {
    setRetrying(s => ({ ...s, [id]: true }))
    retryTransfer(id)
    setTimeout(() => setRetrying(s => ({ ...s, [id]: false })), 2500)
  }, [retryTransfer])

  return (
    <div className="p-6 space-y-5 animate-slide-in">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="page-title">{t('التحويلات الفاشلة', 'Failed Transfers')}</h2>
          <p className="page-subtitle">{t('إدارة وإعادة محاولة التحويلات الفاشلة', 'Manage and retry failed transfers')}</p>
        </div>
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertOctagon className="w-4 h-4 text-red-600" />
          <div>
            <div className="text-lg font-bold text-red-700">{failed.length}</div>
            <div className="text-xs text-red-600">{t('تحويل فاشل', 'Failed Transfer')}</div>
          </div>
        </div>
      </div>

      {/* Retry policy info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { icon: RefreshCw, labelAr: 'الحد الأقصى للمحاولات', labelEn: 'Max Attempts', value: '5' },
          { icon: Clock, labelAr: 'وقت الانتظار بين المحاولات', labelEn: 'Cooldown Period', value: t('30 دقيقة', '30 minutes') },
          { icon: History, labelAr: 'رقم مرجعي جديد لكل محاولة', labelEn: 'New ref per retry', value: t('تلقائي', 'Auto') },
        ].map((item, i) => {
          const Icon = item.icon
          return (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center gap-3 shadow-sm">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="text-xs text-slate-500">{lang === 'ar' ? item.labelAr : item.labelEn}</div>
                <div className="text-sm font-bold text-slate-900">{item.value}</div>
              </div>
            </div>
          )
        })}
      </div>

      {failed.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-16 text-center shadow-sm">
          <RefreshCw className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-700 mb-1">{t('لا توجد تحويلات فاشلة', 'No failed transfers')}</h3>
          <p className="text-sm text-slate-400">{t('جميع التحويلات تمت بنجاح', 'All transfers completed successfully')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {failed.map(txn => {
            const eligible = canRetry(txn)
            const cooldownMins = retryTimeRemaining(txn)
            const maxed = txn.retryCount >= MAX_RETRIES
            const isExpanded = expandedId === txn.id

            return (
              <div key={txn.id} className="bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden">
                <div
                  className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-red-50/30 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : txn.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-slate-900 text-sm">
                        {lang === 'ar' ? txn.schoolName : txn.schoolNameEn}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono text-slate-500">{txn.referenceNumber}</span>
                      <span className="text-red-500">•</span>
                      <span className="text-red-600 font-medium">{txn.failReason}</span>
                    </div>
                  </div>
                  <div className="text-end flex-shrink-0">
                    <div className="font-bold text-slate-900">{formatAmount(txn.amount)}</div>
                    <div className="text-xs text-slate-400">{t('محاولة', 'Attempt')} {txn.retryCount}/{MAX_RETRIES}</div>
                  </div>

                  {/* Retry progress dots */}
                  <div className="flex gap-1 flex-shrink-0">
                    {Array.from({ length: MAX_RETRIES }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${i < txn.retryCount ? 'bg-red-400' : 'bg-slate-200'}`}
                      />
                    ))}
                  </div>

                  {/* Retry button */}
                  {maxed ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 bg-slate-100 rounded-lg border border-slate-200">
                      <Lock className="w-3.5 h-3.5" />
                      {t('استُنفدت المحاولات', 'Max retries reached')}
                    </div>
                  ) : !eligible ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 rounded-lg border border-amber-200">
                      <Clock className="w-3.5 h-3.5" />
                      {cooldownMins} {t('د', 'min')}
                    </div>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRetry(txn.id) }}
                      disabled={retrying[txn.id]}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors disabled:opacity-70 whitespace-nowrap"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${retrying[txn.id] ? 'animate-spin' : ''}`} />
                      {retrying[txn.id] ? t('جارٍ...', 'Retrying...') : t('إعادة المحاولة', 'Retry')}
                    </button>
                  )}

                  {isExpanded
                    ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                </div>

                {/* Expanded: retry history */}
                {isExpanded && (
                  <div className="border-t border-red-100 px-5 py-4 bg-red-50/20 animate-slide-in">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                      {[
                        [t('رقم IBAN', 'IBAN'), txn.iban],
                        [t('آخر محاولة', 'Last Retry'), formatDateTime(txn.lastRetryDate, lang)],
                        [t('المرجع البنكي', 'Bank Ref'), txn.bankRef || '—'],
                      ].map(([k, v]) => (
                        <div key={k} className="bg-white rounded-lg p-2.5 border border-slate-200">
                          <div className="text-xs text-slate-500 mb-0.5">{k}</div>
                          <div className="text-xs font-medium text-slate-800 font-mono truncate">{v}</div>
                        </div>
                      ))}
                    </div>

                    {txn.retryHistory?.length > 0 && (
                      <div>
                        <div className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
                          <History className="w-3.5 h-3.5" />
                          {t('سجل المحاولات', 'Retry History')}
                        </div>
                        <div className="space-y-1.5">
                          {txn.retryHistory.map((r, i) => (
                            <div key={i} className="flex items-center gap-3 text-xs p-2.5 rounded-lg bg-white border border-slate-200">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0 ${r.result === 'success' ? 'bg-emerald-100 text-emerald-700' : r.result === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                {r.attempt}
                              </span>
                              <span className="font-mono text-slate-600 flex-1">{r.ref}</span>
                              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${r.result === 'success' ? 'bg-emerald-100 text-emerald-700' : r.result === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                {r.result === 'success' ? t('نجح', 'OK') : r.result === 'pending' ? t('معلق', 'Pending') : t('فشل', 'Failed')}
                              </span>
                              <span className="text-slate-400 flex-shrink-0">{formatDate(r.date, lang)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
