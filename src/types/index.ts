export type TransactionType = 'expense' | 'income' | 'transfer' | 'investment';

export type CategoryType =
  | 'Food & Dining'
  | 'Transport'
  | 'Shopping'
  | 'Bills'
  | 'Entertainment'
  | 'Healthcare'
  | 'Salary'
  | 'Investment'
  | 'Education'
  | 'Travel'
  | 'Others';

export type TransactionSource = 'receipt' | 'sms' | 'manual' | 'bank_sync' | 'api_sync';

export type PaymentMethod =
  | 'UPI'
  | 'Credit Card'
  | 'Debit Card'
  | 'Net Banking'
  | 'Cash'
  | 'Wallet'
  | 'Auto-Debit'
  | 'Other';

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  merchant: string;
  category: CategoryType;
  type: TransactionType;
  source: TransactionSource;
  payment_method?: PaymentMethod;
  raw_text?: string;
  confidence: number; // 0.00 to 1.00
  created_at: string; // ISO date string
  date?: string;
  tax?: number;
  gst_number?: string;
  items?: Array<{ name: string; price: number; qty?: number }>;
  notes?: string;
  is_recurring?: boolean;
  is_subscription?: boolean;
  tags?: string[];
  account_last4?: string;
  bank_name?: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category: CategoryType;
  limit: number;
  spent: number;
  alert_threshold?: number; // e.g. 80%
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  target: number;
  current: number;
  monthly_sip?: number;
  target_date?: string;
  category?: 'Safety' | 'Tech' | 'Travel' | 'Retirement' | 'Real Estate' | 'Education' | 'Other';
  icon?: string;
  expected_return_pct?: number;
}

export interface Insight {
  id: string;
  user_id: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  category?: CategoryType;
  potential_savings?: number;
  action_text?: string;
  created_at: string;
}

export interface BankAccount {
  id: string;
  user_id: string;
  bank_name: string;
  last4: string;
  account_type?: 'savings' | 'current' | 'credit_card' | 'wallet' | 'investment';
  balance?: number;
  is_connected?: boolean;
  color?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  monthly_income: number;
  currency: '₹' | '$' | '€' | '£';
  monthly_budget_target?: number;
}

export interface ReceiptExtractionResult {
  merchant: string;
  date: string;
  amount: number;
  tax: number;
  gst?: number;
  gstin?: string;
  paymentMethod?: PaymentMethod;
  items: Array<{ name: string; price: number; qty?: number }>;
  total: number;
  category: CategoryType;
  confidence: number;
  rawText?: string;
}

export interface SmsParseResult {
  merchant: string;
  amount: number;
  category: CategoryType;
  type: TransactionType;
  bankName?: string;
  last4?: string;
  paymentMethod?: PaymentMethod;
  confidence: number;
  date?: string;
  availableBalance?: number | null;
  isRecurring?: boolean;
}

// Financial Intelligence & Analytics Types
export interface DailySafeSpend {
  amount: number;
  daysRemaining: number;
  daysInMonth: number;
  totalTargetBudget: number;
  currentExpenses: number;
  status: 'on_track' | 'tight' | 'exceeded';
}

export interface MonthlySavingsForecast {
  projectedExpense: number;
  projectedSavings: number;
  projectedSavingsRate: number;
  income: number;
  burnRatePerDay: number;
}

export interface DetectedSubscription {
  id: string;
  merchant: string;
  amount: number;
  category: CategoryType;
  frequency: 'monthly' | 'yearly';
  lastBilled: string;
  nextEstimatedBill: string;
  status: 'active' | 'review';
}

export interface SpendingStreak {
  currentStreakDays: number;
  bestStreakDays: number;
  isUnderBudgetToday: boolean;
}

export interface WeekendVsWeekdayAnalysis {
  weekdayDailyAvg: number;
  weekendDailyAvg: number;
  weekendSurgePercent: number; // e.g. +38% higher on weekends
  primaryWeekendCategory: string;
}

export interface CashFlowSummary {
  inflow: number;
  outflow: number;
  netSavings: number;
  savingsRate: number;
  expenseToIncomeRatio: number;
}
