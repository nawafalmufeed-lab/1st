import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Transaction, TransactionStatus } from '../types';
import { mockTransactions } from '../data/mockData';

interface TransactionContextType {
  transactions: Transaction[];
  updateTransactionStatus: (id: string, status: TransactionStatus, reviewedBy?: string, approvedBy?: string, notes?: string) => void;
  getTransactionById: (id: string) => Transaction | undefined;
  getTransactionsByStatus: (status: TransactionStatus) => Transaction[];
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);

  const updateTransactionStatus = (
    id: string,
    status: TransactionStatus,
    reviewedBy?: string,
    approvedBy?: string,
    notes?: string
  ) => {
    setTransactions((prev) =>
      prev.map((transaction) => {
        if (transaction.id === id) {
          const updated = { ...transaction, status };

          if (reviewedBy) {
            updated.reviewedBy = reviewedBy;
            updated.reviewedAt = new Date().toISOString().split('T')[0];
          }

          if (approvedBy) {
            updated.approvedBy = approvedBy;
            updated.approvedAt = new Date().toISOString().split('T')[0];
          }

          if (notes) {
            updated.notes = notes;
          }

          return updated;
        }
        return transaction;
      })
    );
  };

  const getTransactionById = (id: string) => {
    return transactions.find((t) => t.id === id);
  };

  const getTransactionsByStatus = (status: TransactionStatus) => {
    return transactions.filter((t) => t.status === status);
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        updateTransactionStatus,
        getTransactionById,
        getTransactionsByStatus,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within TransactionProvider');
  }
  return context;
};
