import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Transaction, DashboardStats } from '../types';
import { generateMockTransactions } from '../utils/mockData';

interface TransactionContextType {
  transactions: Transaction[];
  updateTransactionStatus: (id: string, status: Transaction['status']) => void;
  updateMultipleTransactionStatus: (ids: string[], status: Transaction['status']) => void;
  getTransactionById: (id: string) => Transaction | undefined;
  getDashboardStats: () => DashboardStats;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Initialize with mock data
    setTransactions(generateMockTransactions(35));
  }, []);

  const updateTransactionStatus = (id: string, status: Transaction['status']) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status,
              ...(status === 'under_review' && {
                reviewedBy: 'current-user@madares.com',
                reviewedAt: new Date().toISOString(),
              }),
              ...(status === 'approved' && {
                approvedBy: 'current-user@madares.com',
                approvedAt: new Date().toISOString(),
              }),
            }
          : t
      )
    );
  };

  const updateMultipleTransactionStatus = (ids: string[], status: Transaction['status']) => {
    setTransactions((prev) =>
      prev.map((t) =>
        ids.includes(t.id)
          ? {
              ...t,
              status,
              ...(status === 'under_review' && {
                reviewedBy: 'current-user@madares.com',
                reviewedAt: new Date().toISOString(),
              }),
              ...(status === 'approved' && {
                approvedBy: 'current-user@madares.com',
                approvedAt: new Date().toISOString(),
              }),
            }
          : t
      )
    );
  };

  const getTransactionById = (id: string) => {
    return transactions.find((t) => t.id === id);
  };

  const getDashboardStats = (): DashboardStats => {
    return {
      totalTransactions: transactions.length,
      pendingReview: transactions.filter((t) => t.status === 'pending_review').length,
      underReview: transactions.filter((t) => t.status === 'under_review').length,
      approved: transactions.filter((t) => t.status === 'approved').length,
      completed: transactions.filter((t) => t.status === 'completed').length,
      failed: transactions.filter((t) => t.status === 'failed').length,
      totalAmount: transactions.reduce((sum, t) => sum + t.originalAmount, 0),
      totalFees: transactions.reduce((sum, t) => sum + t.activationFee + t.transactionFee, 0),
    };
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        updateTransactionStatus,
        updateMultipleTransactionStatus,
        getTransactionById,
        getDashboardStats,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
}
