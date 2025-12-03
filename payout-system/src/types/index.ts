export type TransactionStatus =
  | 'Pending Review'
  | 'Under Review'
  | 'Approved'
  | 'Completed'
  | 'Failed';

export type PaymentMethod = 'Mada' | 'Visa' | 'Mastercard' | 'Tamara';

export type ContractType = 'Executive' | 'Standard' | 'Premium';

export type UserRole = 'Reviewer' | 'Approver' | 'Admin';

export interface Transaction {
  id: string;
  transactionId: string;
  schoolName: string;
  schoolNameAr: string;
  studentName: string;
  studentNameAr: string;
  date: string;
  iban: string;
  paymentMethod: PaymentMethod;
  contractType: ContractType;
  isFirstPayment: boolean;
  originalAmount: number;
  activationFee: number;
  transactionFee: number;
  totalDeductions: number;
  netAmount: number;
  status: TransactionStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  nameAr: string;
  role: UserRole;
  email: string;
}

export interface DashboardStats {
  totalTransactions: number;
  pendingReview: number;
  underReview: number;
  approved: number;
  completed: number;
  failed: number;
  totalAmount: number;
  totalDeductions: number;
  netAmount: number;
}
