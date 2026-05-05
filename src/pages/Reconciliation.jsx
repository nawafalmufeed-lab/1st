import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { StatusBadge } from '../components/ui/StatusBadge'
import { formatAmount, formatDateTime } from '../utils/helpers'
import { RefreshCcw, Play, CheckCircle, Clock, ArrowRight, FileText } from 'lucide-react'

export const Reconciliation = () => {
  const { transactions, runReconciliation, reconciliationLogs, lang, t, addToast } = useApp()
  const [running, setRunning] = useState(false)
  const [lastResult, setLastResult] = useState(null)

  const transferred = transactions.filter(tx => tx.status === 'transferred')
  const completed = transactions.filter(tx => tx.status === 'completed')

  const handleRun = () => {
    setRunning(true)
    setLastResult(null)
    // Simulate a batch job with progress
    setTimeout(() => {
      const count = runReconciliation()
      setLastResult(count)
      setRunning(false)
      addToast(
        count > 0
          ? (lang === 'ar' ? `تمت التسوية: ${count} معاملة اكتملت` : `Reconciliation complete: ${count} transactions marked completed`)
          : (lang === 'ar' ? 'لا توجد معاملات جاهزة للتسوية' : 'No transactions ready for reconciliation'),
        count > 0 ? 'success' : 'info'
      )
    }, 2000)
  }

  return (
    <div className="p-6 space-y-5 animate-slide-in">
      <div>
        <h2 className="page-title">{t('التسوية اليومية', 'Daily Reconciliation')}</h2>
        <p className="page-subtitle">{t('تشغيل دفعة التسوية وتحديث حالة المعاملات', 'Run reconciliation batch and update transaction statuses')}</p>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="kpi-card bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <RefreshCcw className="w-5 h-5 text-emerald-600" />
            <span className="text-xs text-emerald-600 font-medium">{t('جاهزة للتسوية', 'Ready for reconciliation')}</span>
          </div>
          <div className="text-3xl font-bold text-emerald-700">{transferred.length}</div>
          <div className="text-sm text-emerald-600">{t('معاملة محوّلة', 'Transferred transactions')}</div>
          <div className="text-xs text-emerald-500 mt-1">
            {formatAmount(transferred.reduce((s, t) => s + t.amount, 0))}
          </div>
        </div>

        <div className="kpi-card">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-slate-400" />
            <span className="text-xs text-slate-500 font-medium">{t('مكتملة', 'Completed')}</span>
          </div>
          <div className="text-3xl font-bold text-slate-700">{completed.length}</div>
          <div className="text-sm text-slate-500">{t('معاملة مكتملة', 'Completed transactions')}</div>
          <div className="text-xs text-slate-400 mt-1">
            {formatAmount(completed.reduce((s, t) => s + t.amount, 0))}
          </div>
        </div>

        <div className="kpi-card border-blue-200 bg-blue-50/30">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-blue-600 font-medium">{t('آخر تشغيل', 'Last run')}</span>
          </div>
          <div className="text-sm font-bold text-blue-700">
            {reconciliationLogs[0]
              ? formatDateTime(reconciliationLogs[0].runTime, lang)
              : t('لم يتم التشغيل بعد', 'Not run yet')}
          </div>
          {reconciliationLogs[0] && (
            <div className="text-xs text-blue-500 mt-1">
              {reconciliationLogs[0].processed} {t('معاملة', 'transactions')} • {reconciliationLogs[0].runId}
            </div>
          )}
        </div>
      </div>

      {/* Run button */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">{t('تشغيل التسوية اليومية', 'Run Daily Reconciliation')}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('سيتم تحديث جميع المعاملات "تم التحويل" إلى حالة "مكتمل"',
                'All "Transferred" transactions will be updated to "Completed" status')}
            </p>
          </div>
          <button
            onClick={handleRun}
            disabled={running || transferred.length === 0}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {running ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {t('جارٍ التشغيل...', 'Running...')}
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                {t('تشغيل الآن', 'Run Now')}
              </>
            )}
          </button>
        </div>

        {/* Processing animation */}
        {running && (
          <div className="space-y-2 animate-slide-in">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              {t('فحص المعاملات المحوّلة...', 'Scanning transferred transactions...')}
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
          </div>
        )}

        {lastResult !== null && !running && (
          <div className={`mt-3 p-3 rounded-lg flex items-center gap-2 text-sm animate-slide-in ${lastResult > 0 ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-slate-50 border border-slate-200 text-slate-600'}`}>
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            {lastResult > 0
              ? t(`اكتملت التسوية: تم تحديث ${lastResult} معاملة`, `Reconciliation complete: ${lastResult} transactions updated`)
              : t('لا توجد معاملات تستوفي شروط التسوية', 'No transactions meet reconciliation criteria')}
          </div>
        )}

        {/* Flow diagram */}
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
          <StatusBadge status="transferred" size="sm" />
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">{t('بعد التسوية', 'After reconciliation')}</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <StatusBadge status="completed" size="sm" />
        </div>
      </div>

      {/* Run history */}
      {reconciliationLogs.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
            <FileText className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-semibold text-slate-900">{t('سجل التشغيل', 'Run History')}</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {reconciliationLogs.map((run, i) => (
              <div key={i} className="px-5 py-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-blue-600 font-bold">{run.runId}</span>
                    <span className="text-xs text-slate-500">{formatDateTime(run.runTime, lang)}</span>
                  </div>
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    {run.processed} {t('معاملة', 'txn')}
                  </span>
                </div>
                {run.logs.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                    {run.logs.slice(0, 6).map((log, j) => (
                      <div key={j} className="flex items-center gap-2 text-xs p-2 bg-slate-50 rounded-lg">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span className="text-slate-600 truncate">{log.school}</span>
                        <span className="text-slate-400 flex-shrink-0">{formatAmount(log.amount)}</span>
                      </div>
                    ))}
                    {run.logs.length > 6 && (
                      <div className="text-xs text-slate-400 p-2">
                        +{run.logs.length - 6} {t('معاملة أخرى', 'more transactions')}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
