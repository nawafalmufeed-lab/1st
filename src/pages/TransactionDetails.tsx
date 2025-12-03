import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTransactions } from '../contexts/TransactionContext';
import StatusBadge from '../components/shared/StatusBadge';
import { ArrowLeft, Building2, User, CreditCard, Calendar, Hash } from 'lucide-react';
import { format } from 'date-fns';

export default function TransactionDetails() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { getTransactionById } = useTransactions();
  const navigate = useNavigate();

  const transaction = getTransactionById(id || '');

  if (!transaction) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-500">{t('transactions.noTransactions')}</p>
          <button
            onClick={() => navigate('/transactions')}
            className="mt-4 text-primary-600 hover:text-primary-700"
          >
            {t('details.backToList')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/transactions')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('details.backToList')}
        </button>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">{t('details.title')}</h1>
          <StatusBadge status={transaction.status} />
        </div>
      </div>

      {/* Transaction Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t('details.transactionInfo')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <Hash className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">{t('transactions.id')}</p>
              <p className="font-medium text-gray-900">{transaction.id}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">{t('transactions.date')}</p>
              <p className="font-medium text-gray-900">
                {format(new Date(transaction.date), 'dd/MM/yyyy HH:mm')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">{t('transactions.school')}</p>
              <p className="font-medium text-gray-900">{transaction.schoolName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">{t('transactions.student')}</p>
              <p className="font-medium text-gray-900">{transaction.studentName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t('details.paymentInfo')}
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <span className="text-gray-600">{t('transactions.originalAmount')}</span>
            <span className="font-medium text-gray-900">
              {transaction.originalAmount.toLocaleString()} {t('common.sar')}
            </span>
          </div>

          {transaction.activationFee > 0 && (
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600">{t('details.activationFee')}</span>
              <span className="font-medium text-red-600">
                - {transaction.activationFee.toLocaleString()} {t('common.sar')}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <span className="text-gray-600">{t('details.transactionFee')}</span>
            <span className="font-medium text-red-600">
              - {transaction.transactionFee.toLocaleString()} {t('common.sar')}
            </span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <span className="text-gray-600">{t('details.totalDeductions')}</span>
            <span className="font-medium text-red-600">
              - {(transaction.activationFee + transaction.transactionFee).toLocaleString()}{' '}
              {t('common.sar')}
            </span>
          </div>

          <div className="flex items-center justify-between py-3 bg-green-50 px-4 rounded-lg">
            <span className="font-semibold text-gray-900">{t('transactions.netAmount')}</span>
            <span className="text-2xl font-bold text-green-600">
              {transaction.netAmount.toLocaleString()} {t('common.sar')}
            </span>
          </div>

          <div className="flex items-start gap-3 pt-4">
            <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-gray-600">{t('transactions.paymentMethod')}</p>
              <p className="font-medium text-gray-900">
                {t(`paymentMethod.${transaction.paymentMethod}`)}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <p className="text-sm text-gray-600">{t('transactions.iban')}</p>
            <p className="font-mono text-sm font-medium text-gray-900">{transaction.iban}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <p className="text-sm text-gray-600">{t('details.contractType')}</p>
              <p className="font-medium text-gray-900 capitalize">{transaction.contractType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('details.firstTransaction')}</p>
              <p className="font-medium text-gray-900">
                {transaction.isFirstTransaction ? t('details.yes') : t('details.no')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Info */}
      {(transaction.reviewedBy || transaction.approvedBy || transaction.failureReason) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('details.statusInfo')}
          </h2>
          <div className="space-y-4">
            {transaction.reviewedBy && (
              <>
                <div>
                  <p className="text-sm text-gray-600">{t('details.reviewedBy')}</p>
                  <p className="font-medium text-gray-900">{transaction.reviewedBy}</p>
                </div>
                {transaction.reviewedAt && (
                  <div>
                    <p className="text-sm text-gray-600">{t('details.reviewedAt')}</p>
                    <p className="font-medium text-gray-900">
                      {format(new Date(transaction.reviewedAt), 'dd/MM/yyyy HH:mm')}
                    </p>
                  </div>
                )}
              </>
            )}

            {transaction.approvedBy && (
              <>
                <div>
                  <p className="text-sm text-gray-600">{t('details.approvedBy')}</p>
                  <p className="font-medium text-gray-900">{transaction.approvedBy}</p>
                </div>
                {transaction.approvedAt && (
                  <div>
                    <p className="text-sm text-gray-600">{t('details.approvedAt')}</p>
                    <p className="font-medium text-gray-900">
                      {format(new Date(transaction.approvedAt), 'dd/MM/yyyy HH:mm')}
                    </p>
                  </div>
                )}
              </>
            )}

            {transaction.failureReason && (
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">{t('details.failureReason')}</p>
                <p className="font-medium text-red-900">{transaction.failureReason}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
