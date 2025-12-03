# ============================================================================
# PAYOUT MANAGEMENT SYSTEM - COMPLETE SOURCE CODE
# All files consolidated into one document
# ============================================================================

# ============================================================================
# FILE: src/types/index.ts
# ============================================================================

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

# ============================================================================
# FILE: src/data/mockData.ts
# ============================================================================

import type { Transaction, User, PaymentMethod, ContractType, TransactionStatus } from '../types';

// Mock users
export const mockUsers: User[] = [
  {
    id: 'U001',
    username: 'reviewer1',
    name: 'Ahmed Al-Rashid',
    nameAr: 'أحمد الراشد',
    role: 'Reviewer',
    email: 'ahmed.rashid@madares.sa',
  },
  {
    id: 'U002',
    username: 'approver1',
    name: 'Fatima Al-Harbi',
    nameAr: 'فاطمة الحربي',
    role: 'Approver',
    email: 'fatima.harbi@madares.sa',
  },
  {
    id: 'U003',
    username: 'admin1',
    name: 'Mohammed Al-Otaibi',
    nameAr: 'محمد العتيبي',
    role: 'Admin',
    email: 'mohammed.otaibi@madares.sa',
  },
];

// Helper function to calculate transaction fees
export const calculateFees = (
  amount: number,
  paymentMethod: PaymentMethod,
  isFirstPayment: boolean,
  contractType: ContractType
): {
  activationFee: number;
  transactionFee: number;
  totalDeductions: number;
  netAmount: number;
} => {
  const activationFee = isFirstPayment && contractType === 'Executive' ? 85 : 0;

  let feePercentage = 0;
  switch (paymentMethod) {
    case 'Mada':
      feePercentage = 0.0085; // 0.85%
      break;
    case 'Visa':
    case 'Mastercard':
      feePercentage = 0.0117; // 1.17%
      break;
    case 'Tamara':
      feePercentage = 0.10; // 10%
      break;
  }

  const transactionFee = amount * feePercentage;
  const totalDeductions = activationFee + transactionFee;
  const netAmount = amount - totalDeductions;

  return {
    activationFee,
    transactionFee,
    totalDeductions,
    netAmount,
  };
};

// School names
const schools = [
  { name: 'Al-Majd International School', nameAr: 'مدرسة المجد العالمية' },
  { name: 'Al-Noor Academy', nameAr: 'أكاديمية النور' },
  { name: 'Riyadh International School', nameAr: 'مدرسة الرياض العالمية' },
  { name: 'Al-Faisal Educational Complex', nameAr: 'مجمع الفيصل التعليمي' },
  { name: 'Al-Khozama School', nameAr: 'مدرسة الخزامى' },
  { name: 'Al-Yamamah School', nameAr: 'مدرسة اليمامة' },
  { name: 'Kingdom Schools', nameAr: 'مدارس المملكة' },
  { name: 'Al-Nahda National School', nameAr: 'مدرسة النهضة الأهلية' },
  { name: 'Dar Al-Fikr Schools', nameAr: 'مدارس دار الفكر' },
  { name: 'Al-Rowad International School', nameAr: 'مدرسة الرواد العالمية' },
];

// Student names
const students = [
  { name: 'Ali Mohammed Al-Ghamdi', nameAr: 'علي محمد الغامدي' },
  { name: 'Sarah Ahmed Al-Zahrani', nameAr: 'سارة أحمد الزهراني' },
  { name: 'Omar Abdullah Al-Qahtani', nameAr: 'عمر عبدالله القحطاني' },
  { name: 'Layla Hassan Al-Mutairi', nameAr: 'ليلى حسن المطيري' },
  { name: 'Khalid Fahad Al-Dosari', nameAr: 'خالد فهد الدوسري' },
  { name: 'Noura Saad Al-Shammari', nameAr: 'نورة سعد الشمري' },
  { name: 'Youssef Ibrahim Al-Maliki', nameAr: 'يوسف ابراهيم المالكي' },
  { name: 'Maha Faisal Al-Otaibi', nameAr: 'مها فيصل العتيبي' },
  { name: 'Turki Nasser Al-Subai', nameAr: 'تركي ناصر السبيعي' },
  { name: 'Huda Khalid Al-Harbi', nameAr: 'هدى خالد الحربي' },
  { name: 'Abdulrahman Salem Al-Anzi', nameAr: 'عبدالرحمن سالم العنزي' },
  { name: 'Lama Mohammed Al-Rashid', nameAr: 'لمى محمد الراشد' },
  { name: 'Faisal Ahmad Al-Juhani', nameAr: 'فيصل أحمد الجهني' },
  { name: 'Reem Abdullah Al-Shehri', nameAr: 'ريم عبدالله الشهري' },
  { name: 'Saad Yousef Al-Tamimi', nameAr: 'سعد يوسف التميمي' },
];

// Generate IBANs
const generateIBAN = (index: number): string => {
  const accountNumber = String(index).padStart(18, '0');
  return `SA${accountNumber}`;
};

// Generate dates
const generateDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

// Generate mock transactions
export const generateMockTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const paymentMethods: PaymentMethod[] = ['Mada', 'Visa', 'Mastercard', 'Tamara'];
  const contractTypes: ContractType[] = ['Executive', 'Standard', 'Premium'];

  // Generate 35 transactions
  for (let i = 0; i < 35; i++) {
    const school = schools[i % schools.length];
    const student = students[i % students.length];
    const paymentMethod = paymentMethods[i % paymentMethods.length];
    const contractType = contractTypes[i % contractTypes.length];
    const isFirstPayment = i % 4 === 0; // Every 4th transaction is a first payment
    const originalAmount = Math.floor(Math.random() * 10000) + 1000; // Between 1000 and 11000 SAR

    const fees = calculateFees(originalAmount, paymentMethod, isFirstPayment, contractType);

    // Distribute statuses
    let status: TransactionStatus;
    if (i < 8) {
      status = 'Pending Review';
    } else if (i < 14) {
      status = 'Under Review';
    } else if (i < 20) {
      status = 'Approved';
    } else if (i < 30) {
      status = 'Completed';
    } else {
      status = 'Failed';
    }

    const daysAgo = Math.floor(Math.random() * 30);
    const transactionDate = generateDate(daysAgo);

    const transaction: Transaction = {
      id: `T${String(i + 1).padStart(4, '0')}`,
      transactionId: `TXN${String(i + 1000).padStart(6, '0')}`,
      schoolName: school.name,
      schoolNameAr: school.nameAr,
      studentName: student.name,
      studentNameAr: student.nameAr,
      date: transactionDate,
      iban: generateIBAN(i + 1),
      paymentMethod,
      contractType,
      isFirstPayment,
      originalAmount,
      activationFee: fees.activationFee,
      transactionFee: fees.transactionFee,
      totalDeductions: fees.totalDeductions,
      netAmount: fees.netAmount,
      status,
    };

    // Add review/approval info for processed transactions
    if (status !== 'Pending Review') {
      transaction.reviewedBy = mockUsers[0].name;
      transaction.reviewedAt = generateDate(daysAgo - 1);
    }

    if (status === 'Approved' || status === 'Completed') {
      transaction.approvedBy = mockUsers[1].name;
      transaction.approvedAt = generateDate(daysAgo - 2);
    }

    if (status === 'Failed') {
      transaction.notes = 'Transaction failed due to insufficient funds';
    }

    transactions.push(transaction);
  }

  return transactions;
};

export const mockTransactions = generateMockTransactions();

# ============================================================================
# FILE: src/context/AuthContext.tsx
# ============================================================================

import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string): boolean => {
    // Simple mock authentication
    const foundUser = mockUsers.find((u) => u.username === username);
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Check for stored user on mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

# ============================================================================
# FILE: src/context/LanguageContext.tsx
# ============================================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.transactions': 'Transactions',
    'nav.review': 'Review',
    'nav.approval': 'Approval',
    'nav.logout': 'Logout',

    // Login
    'login.title': 'Payout Management System',
    'login.subtitle': 'Sign in to your account',
    'login.username': 'Username',
    'login.password': 'Password',
    'login.signin': 'Sign In',
    'login.error': 'Invalid username or password',
    'login.reviewer': 'Reviewer Account',
    'login.approver': 'Approver Account',

    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.total': 'Total Transactions',
    'dashboard.pending': 'Pending Review',
    'dashboard.review': 'Under Review',
    'dashboard.approved': 'Approved',
    'dashboard.completed': 'Completed',
    'dashboard.failed': 'Failed',
    'dashboard.totalAmount': 'Total Amount',
    'dashboard.deductions': 'Total Deductions',
    'dashboard.netAmount': 'Net Amount',
    'dashboard.recentTransactions': 'Recent Transactions',
    'dashboard.statusDistribution': 'Status Distribution',

    // Transactions
    'trans.list': 'Transactions List',
    'trans.search': 'Search by Transaction ID, School, Student, IBAN...',
    'trans.filter': 'Filter by Status',
    'trans.all': 'All Statuses',
    'trans.id': 'Transaction ID',
    'trans.school': 'School',
    'trans.student': 'Student',
    'trans.date': 'Date',
    'trans.amount': 'Original Amount',
    'trans.deductions': 'Deductions',
    'trans.net': 'Net Amount',
    'trans.status': 'Status',
    'trans.actions': 'Actions',
    'trans.view': 'View',
    'trans.review': 'Review',
    'trans.approve': 'Approve',
    'trans.download': 'Download',

    // Transaction Details
    'detail.title': 'Transaction Details',
    'detail.basic': 'Basic Information',
    'detail.payment': 'Payment Information',
    'detail.fees': 'Fees & Deductions',
    'detail.timeline': 'Transaction Timeline',
    'detail.iban': 'IBAN',
    'detail.method': 'Payment Method',
    'detail.contract': 'Contract Type',
    'detail.first': 'First Payment',
    'detail.activation': 'Activation Fee',
    'detail.transFee': 'Transaction Fee',
    'detail.total': 'Total Deductions',
    'detail.reviewed': 'Reviewed By',
    'detail.approved': 'Approved By',
    'detail.notes': 'Notes',
    'detail.back': 'Back',

    // Review Page
    'review.title': 'Review Transactions',
    'review.pending': 'Pending Review',
    'review.submit': 'Submit Review',
    'review.notes': 'Review Notes (Optional)',
    'review.success': 'Transaction reviewed successfully',

    // Approval Page
    'approval.title': 'Approve Transactions',
    'approval.reviewed': 'Reviewed Transactions',
    'approval.submit': 'Approve Selected',
    'approval.reject': 'Reject',
    'approval.success': 'Transaction approved successfully',

    // Common
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.sar': 'SAR',
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.select': 'Select',
    'common.selected': 'Selected',
  },
  ar: {
    // Navigation
    'nav.dashboard': 'لوحة التحكم',
    'nav.transactions': 'المعاملات',
    'nav.review': 'المراجعة',
    'nav.approval': 'الموافقة',
    'nav.logout': 'تسجيل الخروج',

    // Login
    'login.title': 'نظام إدارة المدفوعات',
    'login.subtitle': 'تسجيل الدخول إلى حسابك',
    'login.username': 'اسم المستخدم',
    'login.password': 'كلمة المرور',
    'login.signin': 'تسجيل الدخول',
    'login.error': 'اسم المستخدم أو كلمة المرور غير صحيحة',
    'login.reviewer': 'حساب المراجع',
    'login.approver': 'حساب الموافق',

    // Dashboard
    'dashboard.title': 'لوحة التحكم',
    'dashboard.total': 'إجمالي المعاملات',
    'dashboard.pending': 'قيد المراجعة',
    'dashboard.review': 'تحت المراجعة',
    'dashboard.approved': 'موافق عليها',
    'dashboard.completed': 'مكتملة',
    'dashboard.failed': 'فاشلة',
    'dashboard.totalAmount': 'المبلغ الإجمالي',
    'dashboard.deductions': 'إجمالي الخصومات',
    'dashboard.netAmount': 'صافي المبلغ',
    'dashboard.recentTransactions': 'المعاملات الأخيرة',
    'dashboard.statusDistribution': 'توزيع الحالات',

    // Transactions
    'trans.list': 'قائمة المعاملات',
    'trans.search': 'البحث برقم المعاملة، المدرسة، الطالب، الآيبان...',
    'trans.filter': 'تصفية حسب الحالة',
    'trans.all': 'جميع الحالات',
    'trans.id': 'رقم المعاملة',
    'trans.school': 'المدرسة',
    'trans.student': 'الطالب',
    'trans.date': 'التاريخ',
    'trans.amount': 'المبلغ الأصلي',
    'trans.deductions': 'الخصومات',
    'trans.net': 'صافي المبلغ',
    'trans.status': 'الحالة',
    'trans.actions': 'الإجراءات',
    'trans.view': 'عرض',
    'trans.review': 'مراجعة',
    'trans.approve': 'موافقة',
    'trans.download': 'تحميل',

    // Transaction Details
    'detail.title': 'تفاصيل المعاملة',
    'detail.basic': 'المعلومات الأساسية',
    'detail.payment': 'معلومات الدفع',
    'detail.fees': 'الرسوم والخصومات',
    'detail.timeline': 'الجدول الزمني',
    'detail.iban': 'رقم الآيبان',
    'detail.method': 'طريقة الدفع',
    'detail.contract': 'نوع العقد',
    'detail.first': 'الدفعة الأولى',
    'detail.activation': 'رسوم التفعيل',
    'detail.transFee': 'رسوم المعاملة',
    'detail.total': 'إجمالي الخصومات',
    'detail.reviewed': 'تمت المراجعة بواسطة',
    'detail.approved': 'تمت الموافقة بواسطة',
    'detail.notes': 'ملاحظات',
    'detail.back': 'رجوع',

    // Review Page
    'review.title': 'مراجعة المعاملات',
    'review.pending': 'قيد المراجعة',
    'review.submit': 'إرسال المراجعة',
    'review.notes': 'ملاحظات المراجعة (اختياري)',
    'review.success': 'تمت مراجعة المعاملة بنجاح',

    // Approval Page
    'approval.title': 'الموافقة على المعاملات',
    'approval.reviewed': 'المعاملات المراجعة',
    'approval.submit': 'الموافقة على المحدد',
    'approval.reject': 'رفض',
    'approval.success': 'تمت الموافقة على المعاملة بنجاح',

    // Common
    'common.yes': 'نعم',
    'common.no': 'لا',
    'common.sar': 'ريال',
    'common.loading': 'جاري التحميل...',
    'common.error': 'حدث خطأ',
    'common.success': 'نجح',
    'common.cancel': 'إلغاء',
    'common.confirm': 'تأكيد',
    'common.select': 'اختر',
    'common.selected': 'المحدد',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const stored = localStorage.getItem('language') as Language;
    if (stored && (stored === 'en' || stored === 'ar')) {
      setLanguage(stored);
    }

    // Update document direction
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

# ============================================================================
# FILE: src/context/TransactionContext.tsx
# ============================================================================

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

# ============================================================================
# FILE: src/App.tsx
# ============================================================================

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { TransactionProvider } from './context/TransactionContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TransactionsList from './pages/TransactionsList';
import TransactionDetail from './pages/TransactionDetail';
import ReviewPage from './pages/ReviewPage';
import ApprovalPage from './pages/ApprovalPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Layout wrapper for protected pages
const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedLayout>
            <Dashboard />
          </ProtectedLayout>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedLayout>
            <TransactionsList />
          </ProtectedLayout>
        }
      />
      <Route
        path="/transactions/:id"
        element={
          <ProtectedLayout>
            <TransactionDetail />
          </ProtectedLayout>
        }
      />
      <Route
        path="/review"
        element={
          <ProtectedLayout>
            <ReviewPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/approval"
        element={
          <ProtectedLayout>
            <ApprovalPage />
          </ProtectedLayout>
        }
      />

      {/* Catch all - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <TransactionProvider>
            <AppRoutes />
          </TransactionProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

# ============================================================================
# END OF CONSOLIDATED SOURCE CODE
# ============================================================================
