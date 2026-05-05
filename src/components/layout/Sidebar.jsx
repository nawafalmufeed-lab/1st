import React from 'react'
import { useApp } from '../../context/AppContext'
import {
  LayoutDashboard, ArrowLeftRight, Search, CheckSquare, BadgeCheck,
  Landmark, AlertOctagon, RefreshCcw, LogOut, Building2, ChevronRight
} from 'lucide-react'

const NAV_ITEMS = [
  { key: 'dashboard', icon: LayoutDashboard, labelAr: 'لوحة التحكم', labelEn: 'Dashboard', roles: ['reviewer', 'approver'] },
  { key: 'transactions', icon: ArrowLeftRight, labelAr: 'المعاملات', labelEn: 'Transactions', roles: ['reviewer', 'approver'] },
  { key: 'reviewer', icon: CheckSquare, labelAr: 'سير عمل المراجع', labelEn: 'Reviewer Workflow', roles: ['reviewer', 'approver'] },
  { key: 'approver', icon: BadgeCheck, labelAr: 'سير عمل المعتمد', labelEn: 'Approver Workflow', roles: ['approver'] },
  { key: 'bank', icon: Landmark, labelAr: 'محاكاة البنك', labelEn: 'Bank Simulation', roles: ['approver'] },
  { key: 'failed', icon: AlertOctagon, labelAr: 'التحويلات الفاشلة', labelEn: 'Failed Transfers', roles: ['approver', 'reviewer'] },
  { key: 'reconciliation', icon: RefreshCcw, labelAr: 'التسوية اليومية', labelEn: 'Reconciliation', roles: ['approver'] },
]

export const Sidebar = ({ activePage, onNavigate }) => {
  const { lang, currentUser, logout, t, transactions } = useApp()

  const failedCount = transactions.filter(t => t.status === 'transfer_failed').length
  const awaitingCount = transactions.filter(t => t.status === 'awaiting_review').length
  const underReviewCount = transactions.filter(t => t.status === 'under_review').length

  const getBadge = (key) => {
    if (key === 'reviewer') return awaitingCount > 0 ? awaitingCount : null
    if (key === 'approver') return underReviewCount > 0 ? underReviewCount : null
    if (key === 'failed') return failedCount > 0 ? failedCount : null
    return null
  }

  return (
    <aside className="w-64 bg-white border-e border-slate-200 flex flex-col h-screen sticky top-0 shadow-sm">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-sm">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 leading-tight">
              {t('نظام المدفوعات', 'PaySchool')}
            </div>
            <div className="text-xs text-slate-500">{t('وزارة التعليم', 'Ministry of Education')}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
          {t('القائمة الرئيسية', 'Main Menu')}
        </div>
        {NAV_ITEMS.filter(item => item.roles.includes(currentUser?.role)).map(item => {
          const Icon = item.icon
          const badge = getBadge(item.key)
          const isActive = activePage === item.key
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`w-full sidebar-item ${isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 text-start">
                {lang === 'ar' ? item.labelAr : item.labelEn}
              </span>
              {badge && (
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center leading-none ${isActive ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'}`}>
                  {badge}
                </span>
              )}
              {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-70 flex-shrink-0" />}
            </button>
          )
        })}
      </nav>

      {/* User profile */}
      <div className="px-3 py-3 border-t border-slate-100">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {currentUser?.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-slate-900 truncate">
              {lang === 'ar' ? currentUser?.nameAr : currentUser?.nameEn}
            </div>
            <div className="text-xs text-slate-500">
              {currentUser?.role === 'reviewer' ? t('مراجع', 'Reviewer') : t('معتمد', 'Approver')}
            </div>
          </div>
          <button
            onClick={logout}
            className="text-slate-400 hover:text-red-500 transition-colors p-1"
            title={t('تسجيل الخروج', 'Logout')}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
