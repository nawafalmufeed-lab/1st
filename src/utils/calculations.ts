import { PaymentMethod, ContractType } from '../types';

export const ACTIVATION_FEE = 85; // SAR

export const TRANSACTION_FEE_RATES = {
  mada: 0.0085, // 0.85%
  visa: 0.0117, // 1.17%
  mastercard: 0.0117, // 1.17%
  tamara: 0.10, // 10%
};

export function calculateTransactionFee(
  amount: number,
  paymentMethod: PaymentMethod
): number {
  const rate = TRANSACTION_FEE_RATES[paymentMethod];
  return Number((amount * rate).toFixed(2));
}

export function calculateActivationFee(
  isFirstTransaction: boolean,
  contractType: ContractType
): number {
  return isFirstTransaction && contractType === 'executive' ? ACTIVATION_FEE : 0;
}

export function calculateNetAmount(
  originalAmount: number,
  activationFee: number,
  transactionFee: number
): number {
  return Number((originalAmount - activationFee - transactionFee).toFixed(2));
}

export function calculateTotalDeductions(
  activationFee: number,
  transactionFee: number
): number {
  return Number((activationFee + transactionFee).toFixed(2));
}
