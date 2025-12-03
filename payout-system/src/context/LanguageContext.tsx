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
