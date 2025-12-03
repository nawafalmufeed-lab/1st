export type TransactionStatus =
  | 'pending_review'
  | 'under_review'
  | 'approved'
  | 'completed'
  | 'failed';

export type PaymentMethod = 'mada' | 'visa' | 'mastercard' | 'tamara';

export type ContractType = 'executive' | 'standard';

export type UserRole = 'reviewer' | 'approver' | 'admin';

export interface Transaction {
  id: string;
  schoolName: string;
  studentName: string;
  originalAmount: number;
  activationFee: number;
  transactionFee: number;
  netAmount: number;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  date: string;
  iban: string;
  contractType: ContractType;
  isFirstTransaction: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  failureReason?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface DashboardStats {
  totalTransactions: number;
  pendingReview: number;
  underReview: number;
  approved: number;
  completed: number;
  failed: number;
  totalAmount: number;
  totalFees: number;
}
