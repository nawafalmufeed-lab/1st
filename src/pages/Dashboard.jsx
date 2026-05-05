import React, { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { StatusBadge } from '../components/ui/StatusBadge'
import { formatAmount, formatDate, STATUS_CONFIG, exportToCSV } from '../utils/helpers'
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import {
  TrendingUp, Clock, DollarSign, Landmark, Award,
  Download, ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react'

const KPICard = ({ icon: Icon, label, value, sub, color, trend }) => (
  <div className="kpi-card">
    <div className="flex items-start justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      {trend !== undefined && (
        <span className={`text-xs font-medium flex items-center gap-0.5 ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          {trend >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <div className="text-2xl font-bold text-slate-900 mb-0.5">{value}</div>
    <div className="text-xs font-medium text-slate-500">{label}</div>
    {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
  </div>
)

const STATUS_COLORS_CHART = {
  awaiting_review: '#f59e0b',
  under_review: '#3b82f6',
  approved: '#8b5cf6',
  transferred: '#10b981',
  transfer_failed: '#ef4444',
  completed: '#059669',
}

export const Dashboard = ({ onNavigate }) => {
  const { stats, transactions, lang, t } = useApp()

  const recentTxns = useMemo(() => [...transactions]
    .sort((a, b) => new Date(b.receivedDate) - new Date(a.receivedDate))
    .slice(0, 8), [transactions])

  const pieData = useMemo(() =>
    Object.entries(stats.byStatus).map(([status, count]) => ({
      name: lang === 'ar' ? STATUS_CONFIG[status]?.labelAr : STATUS_CONFIG[status]?.labelEn,
      value: count,
      status,
    })), [stats.byStatus, lang])

  const barData = useMemo(() => {
    const byRegion = {}
    transactions.forEach(tx => {
      if (!byRegion[tx.region]) byRegion[tx.region] = { region: tx.region, amount: 0, count: 0 }
      byRegion[tx.region].amount += tx.amount
      byRegion[tx.region].count += 1
    })
    return Object.values(byRegion).sort((a, b) => b.amount - a.amount).slice(0, 6)
  }, [transactions])

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2 text-xs">
        <div className="font-semibold text-slate-800">{payload[0]?.payload?.region || payload[0]?.name}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color }}>
            {p.name === 'amount' ? formatAmount(p.value) : `${p.value} ${t('معاملة', 'txn')}`}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 animate-slide-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          icon={TrendingUp}
          label={t('إجمالي المدفوعات', 'Total Payments')}
          value={formatAmount(stats.total)}
          sub={`${stats.count} ${t('معاملة', 'transactions')}`}
          color="bg-blue-100 text-blue-600"
          trend={12.4}
        />
        <KPICard
          icon={Clock}
          label={t('المبالغ المعلقة', 'Pending Amount')}
          value={formatAmount(stats.pending)}
          sub={`${(stats.byStatus.awaiting_review || 0) + (stats.byStatus.under_review || 0) + (stats.byStatus.approved || 0)} ${t('معاملة', 'txn')}`}
          color="bg-amber-100 text-amber-600"
          trend={-3.1}
        />
        <KPICard
          icon={DollarSign}
          label={t('الصافي', 'Net Amount')}
          value={formatAmount(stats.net)}
          color="bg-emerald-100 text-emerald-600"
          trend={8.7}
        />
        <KPICard
          icon={Landmark}
          label={t('رسوم بنكية', 'Bank Fees')}
          value={formatAmount(stats.bankFees)}
          color="bg-purple-100 text-purple-600"
        />
        <KPICard
          icon={Award}
          label={t('رسوم تنفيذية', 'Executive Fees')}
          value={formatAmount(stats.execFees)}
          color="bg-rose-100 text-rose-600"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Status distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">{t('توزيع الحالات', 'Status Distribution')}</h3>
              <p className="text-xs text-slate-500">{t('جميع المعاملات', 'All transactions')}</p>
            </div>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={STATUS_COLORS_CHART[entry.status]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span className="text-xs text-slate-600">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart by region */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">{t('المدفوعات حسب المنطقة', 'Payments by Region')}</h3>
              <p className="text-xs text-slate-500">{t('إجمالي المبالغ', 'Total amounts')}</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} barSize={20}>
              <XAxis dataKey="region" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" name={t('المبلغ', 'Amount')} fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status summary pills */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {Object.entries(STATUS_CONFIG).map(([status, cfg]) => (
          <button
            key={status}
            onClick={() => onNavigate('transactions')}
            className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl border ${cfg.color} hover:opacity-80 transition-opacity`}
          >
            <span className="text-lg font-bold">{stats.byStatus[status] || 0}</span>
            <span className="text-[10px] font-medium text-center leading-tight">
              {lang === 'ar' ? cfg.labelAr : cfg.labelEn}
            </span>
          </button>
        ))}
      </div>

      {/* Recent transactions */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">{t('أحدث المعاملات', 'Recent Transactions')}</h3>
            <p className="text-xs text-slate-500">{t('آخر 8 معاملات', 'Last 8 transactions')}</p>
          </div>
          <button
            onClick={() => exportToCSV(transactions, 'transactions', lang)}
            className="btn-secondary text-xs py-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            {t('تصدير Excel', 'Export CSV')}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('اسم المدرسة', 'School Name')}</th>
                <th>{t('المبلغ', 'Amount')}</th>
                <th>{t('رقم المرجع', 'Reference')}</th>
                <th>{t('تاريخ الاستلام', 'Received')}</th>
                <th>{t('الحالة', 'Status')}</th>
              </tr>
            </thead>
            <tbody>
              {recentTxns.map(txn => (
                <tr key={txn.id}>
                  <td>
                    <div className="font-medium text-slate-800 text-xs">
                      {lang === 'ar' ? txn.schoolName : txn.schoolNameEn}
                    </div>
                    <div className="text-slate-400 text-xs">{txn.region}</div>
                  </td>
                  <td className="font-semibold text-slate-900 text-xs">{formatAmount(txn.amount)}</td>
                  <td className="font-mono text-xs text-slate-500">{txn.referenceNumber}</td>
                  <td className="text-xs text-slate-500">{formatDate(txn.receivedDate, lang)}</td>
                  <td><StatusBadge status={txn.status} size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
