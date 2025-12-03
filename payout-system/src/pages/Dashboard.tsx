import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext';
import { useLanguage } from '../context/LanguageContext';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import type { TransactionStatus } from '../types';

const Dashboard: React.FC = () => {
  const { transactions } = useTransactions();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  // Calculate statistics
  const stats = React.useMemo(() => {
    const totalTransactions = transactions.length;
    const pendingReview = transactions.filter((t) => t.status === 'Pending Review').length;
    const underReview = transactions.filter((t) => t.status === 'Under Review').length;
    const approved = transactions.filter((t) => t.status === 'Approved').length;
    const completed = transactions.filter((t) => t.status === 'Completed').length;
    const failed = transactions.filter((t) => t.status === 'Failed').length;

    const totalAmount = transactions.reduce((sum, t) => sum + t.originalAmount, 0);
    const totalDeductions = transactions.reduce((sum, t) => sum + t.totalDeductions, 0);
    const netAmount = transactions.reduce((sum, t) => sum + t.netAmount, 0);

    return {
      totalTransactions,
      pendingReview,
      underReview,
      approved,
      completed,
      failed,
      totalAmount,
      totalDeductions,
      netAmount,
    };
  }, [transactions]);

  // Prepare chart data
  const statusData = [
    { name: t('dashboard.pending'), value: stats.pendingReview, color: '#FFA726' },
    { name: t('dashboard.review'), value: stats.underReview, color: '#42A5F5' },
    { name: t('dashboard.approved'), value: stats.approved, color: '#66BB6A' },
    { name: t('dashboard.completed'), value: stats.completed, color: '#4DB6AC' },
    { name: t('dashboard.failed'), value: stats.failed, color: '#EF5350' },
  ];

  const amountData = [
    { name: t('dashboard.totalAmount'), amount: stats.totalAmount },
    { name: t('dashboard.deductions'), amount: stats.totalDeductions },
    { name: t('dashboard.netAmount'), amount: stats.netAmount },
  ];

  const recentTransactions = transactions.slice(0, 5);

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${t('common.sar')}`;
  };

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case 'Pending Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-primary-100 text-primary-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    trend?: string;
  }> = ({ title, value, icon, color, trend }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className="text-xs text-green-600 mt-1 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('dashboard.total')}
          value={stats.totalTransactions}
          icon={<TrendingUp className="w-6 h-6 text-primary-600" />}
          color="bg-primary-50"
        />
        <StatCard
          title={t('dashboard.pending')}
          value={stats.pendingReview}
          icon={<Clock className="w-6 h-6 text-yellow-600" />}
          color="bg-yellow-50"
        />
        <StatCard
          title={t('dashboard.completed')}
          value={stats.completed}
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
          color="bg-green-50"
        />
        <StatCard
          title={t('dashboard.failed')}
          value={stats.failed}
          icon={<XCircle className="w-6 h-6 text-red-600" />}
          color="bg-red-50"
        />
      </div>

      {/* Amount Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">{t('dashboard.totalAmount')}</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">{t('dashboard.deductions')}</p>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalDeductions)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">{t('dashboard.netAmount')}</p>
          <p className="text-2xl font-bold text-primary-600">{formatCurrency(stats.netAmount)}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Pie Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('dashboard.statusDistribution')}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Amount Breakdown Bar Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('dashboard.totalAmount')} vs {t('dashboard.netAmount')}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={amountData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Legend />
              <Bar dataKey="amount" fill="#4DB6AC" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{t('dashboard.recentTransactions')}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('trans.id')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('trans.school')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('trans.amount')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('trans.net')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('trans.status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('trans.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.transactionId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {language === 'ar' ? transaction.schoolNameAr : transaction.schoolName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(transaction.originalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(transaction.netAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => navigate(`/transactions/${transaction.id}`)}
                      className="text-primary-600 hover:text-primary-900 flex items-center space-x-1 rtl:space-x-reverse"
                    >
                      <Eye className="w-4 h-4" />
                      <span>{t('trans.view')}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
