import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTransactions } from '../contexts/TransactionContext';
import { Eye, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function Approval() {
  const { t } = useTranslation();
  const { transactions, updateMultipleTransactionStatus } = useTransactions();
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const underReviewTransactions = useMemo(() => {
    return transactions.filter((txn) => txn.status === 'under_review');
  }, [transactions]);

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? underReviewTransactions.map((t) => t.id) : []);
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((selectedId) => selectedId !== id)
    );
  };

  const handleApprove = () => {
    if (selectedIds.length === 0) {
      alert(t('approval.noSelection'));
      return;
    }

    updateMultipleTransactionStatus(selectedIds, 'approved');
    setSelectedIds([]);
    alert(`${selectedIds.length} ${t('approval.approveSuccess')}`);
  };

  const handleReject = () => {
    if (selectedIds.length === 0) {
      alert(t('approval.noSelection'));
      return;
    }

    updateMultipleTransactionStatus(selectedIds, 'failed');
    setSelectedIds([]);
    alert(`${selectedIds.length} ${t('approval.rejectSuccess')}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('approval.title')}</h1>
        <p className="mt-1 text-sm text-gray-600">{t('approval.subtitle')}</p>
      </div>

      {selectedIds.length > 0 && (
        <div className="mb-4 p-4 bg-primary-50 rounded-lg flex items-center justify-between">
          <span className="text-sm text-primary-900">
            {selectedIds.length} {t('transactions.selected')}
          </span>
          <div className="flex gap-3">
            <button
              onClick={handleReject}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <XCircle className="w-4 h-4" />
              {t('approval.rejectSelected')}
            </button>
            <button
              onClick={handleApprove}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              {t('approval.approveSelected')}
            </button>
          </div>
        </div>
      )}

      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          {underReviewTransactions.length} {t('approval.underReviewCount')}
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      underReviewTransactions.length > 0 &&
                      selectedIds.length === underReviewTransactions.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('transactions.id')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('transactions.school')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('transactions.student')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('transactions.originalAmount')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('transactions.deductions')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('transactions.netAmount')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('transactions.paymentMethod')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('details.reviewedBy')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('transactions.date')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('transactions.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {underReviewTransactions.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-6 py-12 text-center text-gray-500">
                    {t('transactions.noTransactions')}
                  </td>
                </tr>
              ) : (
                underReviewTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(txn.id)}
                        onChange={(e) => handleSelectOne(txn.id, e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {txn.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {txn.schoolName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {txn.studentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {txn.originalAmount.toLocaleString()} {t('common.sar')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      {(txn.activationFee + txn.transactionFee).toLocaleString()} {t('common.sar')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {txn.netAmount.toLocaleString()} {t('common.sar')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {t(`paymentMethod.${txn.paymentMethod}`)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {txn.reviewedBy || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(txn.date), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => navigate(`/transactions/${txn.id}`)}
                        className="p-1 text-primary-600 hover:text-primary-900"
                        title={t('transactions.viewDetails')}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
