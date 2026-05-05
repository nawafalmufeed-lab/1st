import React from 'react'
import { useApp } from '../../context/AppContext'
import { Bell, Globe, Search } from 'lucide-react'

const PAGE_TITLES = {
  dashboard: { ar: 'لوحة التحكم', en: 'Dashboard' },
  transactions: { ar: 'المعاملات المالية', en: 'Transactions' },
  reviewer: { ar: 'سير عمل المراجع', en: 'Reviewer Workflow' },
  approver: { ar: 'سير عمل المعتمد', en: 'Approver Workflow' },
  bank: { ar: 'محاكاة التحويل البنكي', en: 'Bank Transfer Simulation' },
  failed: { ar: 'التحويلات الفاشلة', en: 'Failed Transfers' },
  reconciliation: { ar: 'التسوية اليومية', en: 'Daily Reconciliation' },
}

export const Header = ({ activePage }) => {
  const { lang, setLang, t, transactions } = useApp()
  const title = PAGE_TITLES[activePage]
  const pendingNotifs = transactions.filter(t => t.status === 'transfer_failed').length

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h1 className="text-base font-bold text-slate-900">
          {lang === 'ar' ? title?.ar : title?.en}
        </h1>
        <p className="text-xs text-slate-500">
          {new Intl.DateTimeFormat(lang === 'ar' ? 'ar-SA' : 'en-SA', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', calendar: 'gregory'
          }).format(new Date())}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* Language toggle */}
        <button
          onClick={() => setLang(l => l === 'ar' ? 'en' : 'ar')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <Globe className="w-3.5 h-3.5" />
          {lang === 'ar' ? 'English' : 'عربي'}
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell className="w-4.5 h-4.5 w-[18px] h-[18px]" />
          {pendingNotifs > 0 && (
            <span className="absolute top-1 end-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {pendingNotifs > 9 ? '9+' : pendingNotifs}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
