
import { useTranslation } from 'react-i18next';
import { useTransactions } from '../contexts/TransactionContext';
import StatsCard from '../components/shared/StatsCard';
import {
  LayoutDashboard,
  FileCheck,
  Eye,
  CheckCircle,
  CheckCircle2,
  XCircle,
  DollarSign,
  Receipt,
} from 'lucide-react';

export default function Dashboard() {
  const { t } = useTranslation();
  const { getDashboardStats } = useTransactions();
  const stats = getDashboardStats();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>
        <p className="mt-1 text-sm text-gray-600">{t('dashboard.overview')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title={t('dashboard.totalTransactions')}
          value={stats.totalTransactions}
          icon={LayoutDashboard}
          color="primary"
        />
        <StatsCard
          title={t('dashboard.pendingReview')}
          value={stats.pendingReview}
          icon={FileCheck}
          color="yellow"
        />
        <StatsCard
          title={t('dashboard.underReview')}
          value={stats.underReview}
          icon={Eye}
          color="blue"
        />
        <StatsCard
          title={t('dashboard.approved')}
          value={stats.approved}
          icon={CheckCircle}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title={t('dashboard.completed')}
          value={stats.completed}
          icon={CheckCircle2}
          color="emerald"
        />
        <StatsCard
          title={t('dashboard.failed')}
          value={stats.failed}
          icon={XCircle}
          color="red"
        />
        <StatsCard
          title={t('dashboard.totalAmount')}
          value={`${stats.totalAmount.toLocaleString()} ${t('common.sar')}`}
          icon={DollarSign}
          color="primary"
        />
        <StatsCard
          title={t('dashboard.totalFees')}
          value={`${stats.totalFees.toLocaleString()} ${t('common.sar')}`}
          icon={Receipt}
          color="blue"
        />
      </div>
    </div>
  );
}
