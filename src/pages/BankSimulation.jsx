import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { StatusBadge } from '../components/ui/StatusBadge'
import { formatAmount, formatDate, generateBankRef } from '../utils/helpers'
import { Landmark, Zap, CheckCircle, XCircle, Clock, ArrowRight, Activity } from 'lucide-react'

const OUTCOMES = [
  { id: 'success', labelAr: 'نجاح التحويل', labelEn: 'Transfer Success', icon: CheckCircle, color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { id: 'timeout', labelAr: 'انتهت المهلة', labelEn: 'Timeout', icon: Clock, color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { id: 'invalid_iban', labelAr: 'IBAN غير صحيح', labelEn: 'Invalid IBAN', icon: XCircle, color: 'bg-red-100 text-red-700 border-red-200' },
  { id: 'insufficient', labelAr: 'رصيد غير كافٍ', labelEn: 'Insufficient Funds', icon: XCircle, color: 'bg-red-100 text-red-700 border-red-200' },
]

export const BankSimulation = () => {
  const { transactions, updateTransaction, lang, t, addToast } = useApp()
  const [simulating, setSimulating] = useState({})
  const [logs, setLogs] = useState([])

  const approved = transactions.filter(tx => tx.status === 'approved')

  const simulate = (txn, outcomeId) => {
    const ref = generateBankRef()
    setSimulating(s => ({ ...s, [txn.id]: true }))
    addToast(
      lang === 'ar' ? `جارٍ إرسال ${txn.referenceNumber} للبنك...` : `Sending ${txn.referenceNumber} to bank…`,
      'info'
    )
    setTimeout(() => {
      const success = outcomeId === 'success'
      const failReason = {
        timeout: lang === 'ar' ? 'انتهت مهلة الاتصال' : 'Connection timeout',
        invalid_iban: lang === 'ar' ? 'رقم IBAN غير صحيح' : 'Invalid IBAN number',
        insufficient: lang === 'ar' ? 'رصيد غير كافٍ' : 'Insufficient funds',
      }[outcomeId]

      updateTransaction(txn.id, {
        status: success ? 'transferred' : 'transfer_failed',
        bankRef: ref,
        failReason: failReason || null,
        lastRetryDate: success ? null : new Date().toISOString(),
      })

      setLogs(prev => [{
        id: txn.id,
        ref,
        school: lang === 'ar' ? txn.schoolName : txn.schoolNameEn,
        amount: txn.amount,
        outcome: outcomeId,
        time: new Date().toISOString(),
        txnRef: txn.referenceNumber,
      }, ...prev].slice(0, 20))

      setSimulating(s => ({ ...s, [txn.id]: false }))

      addToast(
        success
          ? (lang === 'ar' ? `✓ تم تحويل ${txn.referenceNumber} بنجاح` : `✓ ${txn.referenceNumber} transferred successfully`)
          : (lang === 'ar' ? `✗ فشل تحويل ${txn.referenceNumber}: ${failReason}` : `✗ ${txn.referenceNumber} failed: ${failReason}`),
        success ? 'success' : 'error'
      )
    }, 1500)
  }

  return (
    <div className="p-6 space-y-5 animate-slide-in">
      <div>
        <h2 className="page-title">{t('محاكاة التحويل البنكي', 'Bank Transfer Simulation')}</h2>
        <p className="page-subtitle">{t('محاكاة استجابة البنك للمعاملات المعتمدة', 'Simulate bank responses for approved transactions')}</p>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {OUTCOMES.map(o => {
          const Icon = o.icon
          return (
            <div key={o.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium ${o.color}`}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              {lang === 'ar' ? o.labelAr : o.labelEn}
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Approved transactions */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-semibold text-slate-700">
              {t('المعاملات المعتمدة جاهزة للإرسال', 'Approved transactions ready to send')}
              <span className="ms-2 bg-purple-100 text-purple-700 text-xs font-bold px-1.5 py-0.5 rounded-full">{approved.length}</span>
            </h3>
          </div>

          {approved.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
              <Zap className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-400">{t('لا توجد معاملات معتمدة في انتظار الإرسال', 'No approved transactions awaiting transfer')}</p>
            </div>
          ) : (
            approved.map(txn => (
              <div key={txn.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">
                      {lang === 'ar' ? txn.schoolName : txn.schoolNameEn}
                    </div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">{txn.referenceNumber}</div>
                  </div>
                  <div className="text-end">
                    <div className="font-bold text-slate-900">{formatAmount(txn.amount)}</div>
                    <StatusBadge status={txn.status} size="sm" />
                  </div>
                </div>

                <div className="text-xs text-slate-500 mb-3 font-mono bg-slate-50 px-2.5 py-1.5 rounded-lg">
                  IBAN: {txn.iban}
                </div>

                {/* Simulate buttons */}
                <div className="flex flex-wrap gap-2">
                  {simulating[txn.id] ? (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {t('جارٍ الإرسال للبنك...', 'Sending to bank...')}
                    </div>
                  ) : OUTCOMES.map(o => {
                    const Icon = o.icon
                    return (
                      <button
                        key={o.id}
                        onClick={() => simulate(txn, o.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all hover:shadow-sm ${o.color}`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {lang === 'ar' ? o.labelAr : o.labelEn}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Activity log */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-semibold text-slate-700">{t('سجل النشاط', 'Activity Log')}</h3>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {logs.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                {t('لا يوجد نشاط بعد', 'No activity yet')}
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                {logs.map((log, i) => (
                  <div key={i} className="px-4 py-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${log.outcome === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {log.outcome === 'success' ? (lang === 'ar' ? 'نجح' : 'SUCCESS') : (lang === 'ar' ? 'فشل' : 'FAILED')}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(log.time).toLocaleTimeString(lang === 'ar' ? 'ar-SA' : 'en-US')}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-slate-800 truncate">{log.school}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{log.ref}</div>
                    <div className="text-[10px] text-slate-400">{formatAmount(log.amount)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
