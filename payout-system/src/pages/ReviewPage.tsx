import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { FileSearch, CheckCircle, Eye } from 'lucide-react';

const ReviewPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { transactions, updateTransactionStatus } = useTransactions();
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set());
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get transactions pending review
  const pendingTransactions = transactions.filter((t) => t.status === 'Pending Review');

  // Auto-select transaction from URL if provided
  useEffect(() => {
    const id = searchParams.get('id');
    if (id && pendingTransactions.find((t) => t.id === id)) {
      setSelectedTransactions(new Set([id]));
    }
  }, [searchParams]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTransactions(new Set(pendingTransactions.map((t) => t.id)));
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

  const handleSubmitReview = async () => {
    if (selectedTransactions.size === 0) {
      alert('Please select at least one transaction to review');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    selectedTransactions.forEach((id) => {
      updateTransactionStatus(
        id,
        'Under Review',
        user?.name || 'Reviewer',
        undefined,
        reviewNotes[id] || undefined
      );
    });

    alert(`${t('review.success')}: ${selectedTransactions.size} transaction(s) reviewed`);
    setSelectedTransactions(new Set());
    setReviewNotes({});
    setIsSubmitting(false);
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${t('common.sar')}`;
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('review.title')}</h1>
          <p className="text-gray-600 mt-1">
            {pendingTransactions.length} {t('review.pending')}
          </p>
        </div>

        {selectedTransactions.size > 0 && (
          <button
            onClick={handleSubmitReview}
            disabled={isSubmitting}
            className="flex items-center space-x-2 rtl:space-x-reverse px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <CheckCircle className="w-5 h-5" />
            <span>
              {t('review.submit')} ({selectedTransactions.size})
            </span>
          </button>
        )}
      </div>

      {/* Transactions to Review */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {pendingTransactions.length === 0 ? (
          <div className="text-center py-12">
            <FileSearch className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No transactions pending review</p>
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
                        pendingTransactions.length > 0 &&
                        selectedTransactions.size === pendingTransactions.length
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
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
                    {t('trans.date')}
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
                {pendingTransactions.map((transaction) => (
                  <React.Fragment key={transaction.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedTransactions.has(transaction.id)}
                          onChange={(e) => handleSelectTransaction(transaction.id, e.target.checked)}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
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
                        {transaction.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(transaction.originalAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary-600">
                        {formatCurrency(transaction.netAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => navigate(`/transactions/${transaction.id}`)}
                          className="p-1 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded"
                          title={t('trans.view')}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                    {selectedTransactions.has(transaction.id) && (
                      <tr>
                        <td colSpan={8} className="px-6 py-4 bg-gray-50">
                          <div className="max-w-2xl">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t('review.notes')}
                            </label>
                            <textarea
                              value={reviewNotes[transaction.id] || ''}
                              onChange={(e) =>
                                setReviewNotes({
                                  ...reviewNotes,
                                  [transaction.id]: e.target.value,
                                })
                              }
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                              placeholder="Add any notes about this transaction..."
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewPage;
