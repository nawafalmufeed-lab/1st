import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, CheckCircle, XCircle, Eye } from 'lucide-react';

const ApprovalPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { transactions, updateTransactionStatus } = useTransactions();
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get transactions under review (ready for approval)
  const reviewedTransactions = transactions.filter((t) => t.status === 'Under Review');

  // Auto-select transaction from URL if provided
  useEffect(() => {
    const id = searchParams.get('id');
    if (id && reviewedTransactions.find((t) => t.id === id)) {
      setSelectedTransactions(new Set([id]));
    }
  }, [searchParams]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTransactions(new Set(reviewedTransactions.map((t) => t.id)));
    } else {
      setSelectedTransactions(new Set());
    }
  };

  const handleSelectTransaction = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedTransactions);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedTransactions(newSelected);
  };

  const handleApprove = async () => {
    if (selectedTransactions.size === 0) {
      alert('Please select at least one transaction to approve');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    selectedTransactions.forEach((id) => {
      updateTransactionStatus(id, 'Approved', undefined, user?.name || 'Approver');
    });

    alert(`${t('approval.success')}: ${selectedTransactions.size} transaction(s) approved`);
    setSelectedTransactions(new Set());
    setIsSubmitting(false);
  };

  const handleReject = async (transactionId: string) => {
    if (!confirm('Are you sure you want to reject this transaction?')) {
      return;
    }

    updateTransactionStatus(transactionId, 'Failed', undefined, undefined, 'Rejected by approver');
    alert('Transaction rejected');
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${t('common.sar')}`;
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('approval.title')}</h1>
          <p className="text-gray-600 mt-1">
            {reviewedTransactions.length} {t('approval.reviewed')}
          </p>
        </div>

        {selectedTransactions.size > 0 && (
          <button
            onClick={handleApprove}
            disabled={isSubmitting}
            className="flex items-center space-x-2 rtl:space-x-reverse px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <CheckCircle className="w-5 h-5" />
            <span>
              {t('approval.submit')} ({selectedTransactions.size})
            </span>
          </button>
        )}
      </div>

      {/* Transactions to Approve */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {reviewedTransactions.length === 0 ? (
          <div className="text-center py-12">
            <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No transactions ready for approval</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        reviewedTransactions.length > 0 &&
                        selectedTransactions.size === reviewedTransactions.length
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('trans.id')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('trans.school')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('trans.student')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('detail.reviewed')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('trans.amount')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('trans.net')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('trans.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reviewedTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedTransactions.has(transaction.id)}
                        onChange={(e) => handleSelectTransaction(transaction.id, e.target.checked)}
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.transactionId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {language === 'ar' ? transaction.schoolNameAr : transaction.schoolName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {language === 'ar' ? transaction.studentNameAr : transaction.studentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <p className="font-medium">{transaction.reviewedBy}</p>
                        <p className="text-xs text-gray-500">{transaction.reviewedAt}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(transaction.originalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary-600">
                      {formatCurrency(transaction.netAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <button
                          onClick={() => navigate(`/transactions/${transaction.id}`)}
                          className="p-1 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded"
                          title={t('trans.view')}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleReject(transaction.id)}
                          className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                          title={t('approval.reject')}
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalPage;
