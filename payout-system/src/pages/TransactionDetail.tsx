import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, Building, User, Calendar, CreditCard, Receipt, CheckCircle, Clock } from 'lucide-react';
import type { TransactionStatus } from '../types';

const TransactionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getTransactionById } = useTransactions();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const transaction = getTransactionById(id || '');

  if (!transaction) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Transaction not found</p>
        <button
          onClick={() => navigate('/transactions')}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          {t('detail.back')}
        </button>
      </div>
    );
  }

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

  const InfoRow: React.FC<{ label: string; value: string | React.ReactNode; icon?: React.ReactNode }> = ({
    label,
    value,
    icon,
  }) => (
    <div className="flex items-start space-x-3 rtl:space-x-reverse py-3 border-b border-gray-100 last:border-b-0">
      {icon && <div className="text-gray-400 mt-0.5">{icon}</div>}
      <div className="flex-1">
        <p className="text-sm text-gray-600 mb-1">{label}</p>
        <p className="text-base font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <button
            onClick={() => navigate('/transactions')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('detail.title')}</h1>
            <p className="text-gray-600 mt-1">{transaction.transactionId}</p>
          </div>
        </div>

        <span
          className={`px-4 py-2 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(transaction.status)}`}
        >
          {transaction.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2 rtl:space-x-reverse">
              <Building className="w-5 h-5 text-primary-600" />
              <span>{t('detail.basic')}</span>
            </h2>
            <div className="space-y-0">
              <InfoRow
                label={t('trans.school')}
                value={language === 'ar' ? transaction.schoolNameAr : transaction.schoolName}
                icon={<Building className="w-4 h-4" />}
              />
              <InfoRow
                label={t('trans.student')}
                value={language === 'ar' ? transaction.studentNameAr : transaction.studentName}
                icon={<User className="w-4 h-4" />}
              />
              <InfoRow
                label={t('trans.date')}
                value={transaction.date}
                icon={<Calendar className="w-4 h-4" />}
              />
              <InfoRow label={t('detail.iban')} value={transaction.iban} />
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2 rtl:space-x-reverse">
              <CreditCard className="w-5 h-5 text-primary-600" />
              <span>{t('detail.payment')}</span>
            </h2>
            <div className="space-y-0">
              <InfoRow
                label={t('detail.method')}
                value={transaction.paymentMethod}
                icon={<CreditCard className="w-4 h-4" />}
              />
              <InfoRow label={t('detail.contract')} value={transaction.contractType} />
              <InfoRow
                label={t('detail.first')}
                value={transaction.isFirstPayment ? t('common.yes') : t('common.no')}
              />
            </div>
          </div>

          {/* Fees & Deductions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2 rtl:space-x-reverse">
              <Receipt className="w-5 h-5 text-primary-600" />
              <span>{t('detail.fees')}</span>
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-gray-700">{t('trans.amount')}</span>
                <span className="text-lg font-semibold text-gray-900">
                  {formatCurrency(transaction.originalAmount)}
                </span>
              </div>

              {transaction.activationFee > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{t('detail.activation')}</span>
                  <span className="text-red-600">- {formatCurrency(transaction.activationFee)}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">
                  {t('detail.transFee')} ({transaction.paymentMethod})
                </span>
                <span className="text-red-600">- {formatCurrency(transaction.transactionFee)}</span>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="text-gray-700 font-medium">{t('detail.total')}</span>
                <span className="text-red-600 font-semibold">
                  - {formatCurrency(transaction.totalDeductions)}
                </span>
              </div>

              <div className="flex justify-between items-center pt-3 border-t-2 border-gray-300">
                <span className="text-lg font-semibold text-gray-900">{t('trans.net')}</span>
                <span className="text-2xl font-bold text-primary-600">
                  {formatCurrency(transaction.netAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2 rtl:space-x-reverse">
              <Clock className="w-5 h-5 text-primary-600" />
              <span>{t('detail.timeline')}</span>
            </h2>

            <div className="space-y-4">
              {/* Transaction Created */}
              <div className="flex space-x-3 rtl:space-x-reverse">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Receipt className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Transaction Created</p>
                  <p className="text-xs text-gray-500">{transaction.date}</p>
                </div>
              </div>

              {/* Reviewed */}
              {transaction.reviewedBy && (
                <div className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t('detail.reviewed')}</p>
                    <p className="text-xs text-gray-600">{transaction.reviewedBy}</p>
                    <p className="text-xs text-gray-500">{transaction.reviewedAt}</p>
                  </div>
                </div>
              )}

              {/* Approved */}
              {transaction.approvedBy && (
                <div className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t('detail.approved')}</p>
                    <p className="text-xs text-gray-600">{transaction.approvedBy}</p>
                    <p className="text-xs text-gray-500">{transaction.approvedAt}</p>
                  </div>
                </div>
              )}

              {/* Notes */}
              {transaction.notes && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm font-medium text-yellow-900 mb-1">{t('detail.notes')}</p>
                  <p className="text-xs text-yellow-800">{transaction.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetail;
