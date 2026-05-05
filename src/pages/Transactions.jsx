import React, { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { StatusBadge } from '../components/ui/StatusBadge'
import { Modal } from '../components/ui/Modal'
import { formatAmount, formatDate, STATUS_CONFIG, exportToCSV } from '../utils/helpers'
import { Search, Filter, Download, X, ChevronLeft, ChevronRight, Eye, Calendar } from 'lucide-react'

const STATUSES = Object.keys(STATUS_CONFIG)
const PAGE_SIZE = 10

export const Transactions = () => {
  const { transactions, lang, t } = useApp()
  const [search, setSearch] = useState('')
  const [ibanSearch, setIbanSearch] = useState('')
  const [refSearch, setRefSearch] = useState('')
  const [selectedStatuses, setSelectedStatuses] = useState([])
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)
  const [selectedTxn, setSelectedTxn] = useState(null)

  const filtered = useMemo(() => {
    return transactions.filter(txn => {
      const name = lang === 'ar' ? txn.schoolName : txn.schoolNameEn
      if (search && !name.toLowerCase().includes(search.toLowerCase())) return false
      if (ibanSearch && !txn.iban.includes(ibanSearch)) return false
      if (refSearch && !txn.referenceNumber.toLowerCase().includes(refSearch.toLowerCase())) return false
      if (selectedStatuses.length && !selectedStatuses.includes(txn.status)) return false
      if (dateFrom && new Date(txn.receivedDate) < new Date(dateFrom)) return false
      if (dateTo && new Date(txn.receivedDate) > new Date(dateTo + 'T23:59:59')) return false
      return true
    })
  }, [transactions, search, ibanSearch, refSearch, selectedStatuses, dateFrom, dateTo, lang])

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, page])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)

  const toggleStatus = (s) => {
    setSelectedStatuses(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
    setPage(1)
  }

  const clearFilters = () => {
    setSearch(''); setIbanSearch(''); setRefSearch('')
    setSelectedStatuses([]); setDateFrom(''); setDateTo('')
    setPage(1)
  }

  const activeFilterCount = [
    search, ibanSearch, refSearch,
    selectedStatuses.length > 0,
    dateFrom, dateTo
  ].filter(Boolean).length

  return (
    <div className="p-6 space-y-4 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="page-title">{t('المعاملات المالية', 'Financial Transactions')}</h2>
          <p className="page-subtitle">{filtered.length} {t('معاملة', 'transactions')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportToCSV(filtered, 'transactions-export', lang)}
            className="btn-secondary text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            {t('تصدير', 'Export')}
          </button>
          <button
            onClick={() => setShowFilters(s => !s)}
            className={`btn-secondary text-xs relative ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : ''}`}
          >
            <Filter className="w-3.5 h-3.5" />
            {t('تصفية', 'Filter')}
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -end-1.5 w-4 h-4 bg-blue-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm animate-slide-in">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-700">{t('خيارات التصفية', 'Filter Options')}</span>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                <X className="w-3 h-3" />
                {t('مسح الكل', 'Clear All')}
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            <div className="relative">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                placeholder={t('اسم المدرسة...', 'School name...')}
                className="input-field text-xs ps-8"
              />
            </div>
            <div className="relative">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={refSearch}
                onChange={e => { setRefSearch(e.target.value); setPage(1) }}
                placeholder={t('رقم المرجع...', 'Reference number...')}
                className="input-field text-xs ps-8"
              />
            </div>
            <div className="relative">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={ibanSearch}
                onChange={e => { setIbanSearch(e.target.value); setPage(1) }}
                placeholder={t('رقم IBAN...', 'IBAN...')}
                className="input-field text-xs ps-8"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Calendar className="absolute start-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                <input
                  type="date"
                  value={dateFrom}
                  onChange={e => { setDateFrom(e.target.value); setPage(1) }}
                  className="input-field text-xs ps-8"
                />
              </div>
              <div className="relative flex-1">
                <input
                  type="date"
                  value={dateTo}
                  onChange={e => { setDateTo(e.target.value); setPage(1) }}
                  className="input-field text-xs"
                />
              </div>
            </div>
          </div>
          {/* Status chips */}
          <div className="flex flex-wrap gap-2">
            {STATUSES.map(s => {
              const cfg = STATUS_CONFIG[s]
              const active = selectedStatuses.includes(s)
              return (
                <button
                  key={s}
                  onClick={() => toggleStatus(s)}
                  className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-all ${active ? cfg.color + ' shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
                >
                  {lang === 'ar' ? cfg.labelAr : cfg.labelEn}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('المدرسة', 'School')}</th>
                <th>{t('المبلغ', 'Amount')}</th>
                <th>{t('الصافي', 'Net')}</th>
                <th>{t('رقم المرجع', 'Reference')}</th>
                <th>{t('رقم IBAN', 'IBAN')}</th>
                <th>{t('تاريخ الاستلام', 'Received')}</th>
                <th>{t('تاريخ الإجراء', 'Action Date')}</th>
                <th>{t('الحالة', 'Status')}</th>
                <th>{t('تفاصيل', 'Details')}</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-slate-400">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <div>{t('لا توجد نتائج', 'No results found')}</div>
                  </td>
                </tr>
              ) : paginated.map(txn => (
                <tr key={txn.id}>
                  <td>
                    <div className="font-medium text-slate-900 text-xs">
                      {lang === 'ar' ? txn.schoolName : txn.schoolNameEn}
                    </div>
                    <div className="text-slate-400 text-xs">{txn.region}</div>
                  </td>
                  <td>
                    <div className="font-semibold text-slate-900 text-xs">{formatAmount(txn.amount)}</div>
                    <div className="text-slate-400 text-[10px]">{t('رسوم:', 'Fee:')} {formatAmount(txn.bankFee)}</div>
                  </td>
                  <td className="font-semibold text-emerald-700 text-xs">{formatAmount(txn.netAmount)}</td>
                  <td className="font-mono text-xs text-slate-500">{txn.referenceNumber}</td>
                  <td className="font-mono text-xs text-slate-500 max-w-[120px] truncate">{txn.iban}</td>
                  <td className="text-xs text-slate-500">{formatDate(txn.receivedDate, lang)}</td>
                  <td className="text-xs text-slate-500">{formatDate(txn.actionDate, lang)}</td>
                  <td><StatusBadge status={txn.status} size="sm" /></td>
                  <td>
                    <button
                      onClick={() => setSelectedTxn(txn)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              {t(`عرض ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} من ${filtered.length}`,
                `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length}`)}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {lang === 'ar' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-7 h-7 text-xs rounded-lg font-medium transition-colors ${p === page ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    {p}
                  </button>
                )
              })}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {lang === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        open={!!selectedTxn}
        onClose={() => setSelectedTxn(null)}
        title={t('تفاصيل المعاملة', 'Transaction Details')}
        size="lg"
      >
        {selectedTxn && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <div className="font-semibold text-slate-900">
                  {lang === 'ar' ? selectedTxn.schoolName : selectedTxn.schoolNameEn}
                </div>
                <div className="text-sm text-slate-500">{selectedTxn.region}</div>
              </div>
              <StatusBadge status={selectedTxn.status} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                [t('المعرف', 'ID'), selectedTxn.id],
                [t('رقم المرجع', 'Reference'), selectedTxn.referenceNumber],
                [t('المبلغ الإجمالي', 'Total Amount'), formatAmount(selectedTxn.amount)],
                [t('الصافي', 'Net Amount'), formatAmount(selectedTxn.netAmount)],
                [t('الرسوم البنكية', 'Bank Fee'), formatAmount(selectedTxn.bankFee)],
                [t('الرسوم التنفيذية', 'Exec Fee'), formatAmount(selectedTxn.executiveFee)],
                [t('رقم IBAN', 'IBAN'), selectedTxn.iban],
                [t('المرجع البنكي', 'Bank Ref'), selectedTxn.bankRef || '—'],
                [t('تاريخ الاستلام', 'Received'), formatDate(selectedTxn.receivedDate, lang)],
                [t('تاريخ الإجراء', 'Action Date'), formatDate(selectedTxn.actionDate, lang)],
                [t('المراجع', 'Reviewer'), selectedTxn.reviewerName || '—'],
                [t('المعتمد', 'Approver'), selectedTxn.approverName || '—'],
              ].map(([k, v]) => (
                <div key={k} className="bg-slate-50 rounded-lg p-2.5">
                  <div className="text-xs text-slate-500 mb-0.5">{k}</div>
                  <div className="text-sm font-medium text-slate-800 font-mono">{v}</div>
                </div>
              ))}
            </div>
            {selectedTxn.failReason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="text-xs font-semibold text-red-700 mb-1">{t('سبب الفشل', 'Failure Reason')}</div>
                <div className="text-sm text-red-600">{selectedTxn.failReason}</div>
              </div>
            )}
            {selectedTxn.retryHistory?.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-slate-700 mb-2">{t('سجل إعادة المحاولات', 'Retry History')}</div>
                <div className="space-y-2">
                  {selectedTxn.retryHistory.map((r, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs p-2 rounded-lg bg-slate-50">
                      <span className="font-mono text-slate-400">#{r.attempt}</span>
                      <span className="font-mono text-slate-600">{r.ref}</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${r.result === 'success' ? 'bg-emerald-100 text-emerald-700' : r.result === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                        {r.result === 'success' ? t('نجح', 'Success') : r.result === 'pending' ? t('معلق', 'Pending') : t('فشل', 'Failed')}
                      </span>
                      <span className="text-slate-400">{formatDate(r.date, lang)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
