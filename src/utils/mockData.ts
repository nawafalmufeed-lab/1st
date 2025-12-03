import { Transaction, TransactionStatus, PaymentMethod, ContractType } from '../types';
import {
  calculateTransactionFee,
  calculateActivationFee,
  calculateNetAmount
} from './calculations';

const schools = [
  'Al-Majd International School',
  'Al-Noor Academy',
  'Green Valley School',
  'Future Leaders School',
  'Al-Reef International School',
  'Bright Minds Academy',
  'Al-Faisal School',
  'Knowledge Tree School',
  'Al-Khaleej International School',
  'Pioneer Academy',
];

const studentNames = [
  'Ahmed Al-Salem',
  'Fatima Al-Rashid',
  'Mohammed Al-Mutairi',
  'Sara Al-Dosari',
  'Abdullah Al-Qahtani',
  'Noura Al-Harbi',
  'Khalid Al-Shammari',
  'Maha Al-Zahrani',
  'Omar Al-Otaibi',
  'Layla Al-Maliki',
  'Yousef Al-Ghamdi',
  'Hind Al-Ahmadi',
  'Faisal Al-Anzi',
  'Reem Al-Juhani',
  'Sultan Al-Subai',
];

const paymentMethods: PaymentMethod[] = ['mada', 'visa', 'mastercard', 'tamara'];
const statuses: TransactionStatus[] = [
  'pending_review',
  'under_review',
  'approved',
  'completed',
  'failed',
];

const contractTypes: ContractType[] = ['executive', 'standard'];

function generateIBAN(): string {
  const randomDigits = Math.floor(Math.random() * 1000000000000000000).toString().padStart(18, '0');
  return `SA${randomDigits}`;
}

function generateTransactionId(): string {
  return `TXN${Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0')}`;
}

function getRandomDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString();
}

export function generateMockTransactions(count: number = 35): Transaction[] {
  const transactions: Transaction[] = [];

  for (let i = 0; i < count; i++) {
    const schoolName = schools[Math.floor(Math.random() * schools.length)];
    const studentName = studentNames[Math.floor(Math.random() * studentNames.length)];
    const originalAmount = Number((Math.random() * 9000 + 1000).toFixed(2));
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    const contractType = contractTypes[Math.floor(Math.random() * contractTypes.length)];
    const isFirstTransaction = Math.random() > 0.7; // 30% chance of being first transaction
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const transactionFee = calculateTransactionFee(originalAmount, paymentMethod);
    const activationFee = calculateActivationFee(isFirstTransaction, contractType);
    const netAmount = calculateNetAmount(originalAmount, activationFee, transactionFee);

    const transaction: Transaction = {
      id: generateTransactionId(),
      schoolName,
      studentName,
      originalAmount,
      activationFee,
      transactionFee,
      netAmount,
      paymentMethod,
      status,
      date: getRandomDate(60),
      iban: generateIBAN(),
      contractType,
      isFirstTransaction,
    };

    // Add review/approval metadata based on status
    if (status === 'under_review' || status === 'approved' || status === 'completed') {
      transaction.reviewedBy = 'reviewer@madares.com';
      transaction.reviewedAt = getRandomDate(30);
    }

    if (status === 'approved' || status === 'completed') {
      transaction.approvedBy = 'approver@madares.com';
      transaction.approvedAt = getRandomDate(20);
    }

    if (status === 'failed') {
      transaction.failureReason = 'Invalid IBAN or bank rejected the transaction';
    }

    transactions.push(transaction);
  }

  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
