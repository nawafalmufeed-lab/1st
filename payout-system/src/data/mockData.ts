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
