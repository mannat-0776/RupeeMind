import { describe, it, expect } from 'vitest';
import {
  calculateDailySafeSpend,
  predictMonthlySavings,
  detectSubscriptions,
  getLargestSpendingCategory,
  calculateSpendingStreak,
  analyzeWeekendVsWeekday,
  getCashFlowSummary,
} from '../utils/intelligence';
import { Transaction } from '../types';

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_1',
    user_id: 'u1',
    amount: 125000,
    merchant: 'Company Payroll',
    category: 'Salary',
    type: 'income',
    source: 'bank_sync',
    confidence: 0.99,
    created_at: '2026-09-01T10:00:00.000Z',
  },
  {
    id: 'tx_2',
    user_id: 'u1',
    amount: 15000,
    merchant: 'Zerodha Mutual Fund SIP',
    category: 'Investment',
    type: 'expense',
    source: 'bank_sync',
    confidence: 0.98,
    created_at: '2026-09-05T10:00:00.000Z',
  },
  {
    id: 'tx_3',
    user_id: 'u1',
    amount: 3200,
    merchant: 'Zomato',
    category: 'Food & Dining',
    type: 'expense',
    source: 'sms',
    confidence: 0.95,
    created_at: '2026-09-12T20:00:00.000Z', // Saturday (weekend)
  },
  {
    id: 'tx_4',
    user_id: 'u1',
    amount: 649,
    merchant: 'Netflix',
    category: 'Entertainment',
    type: 'expense',
    source: 'bank_sync',
    confidence: 0.99,
    is_recurring: true,
    created_at: '2026-09-10T08:00:00.000Z',
  },
];

describe('Financial Intelligence Calculations', () => {
  it('calculates daily safe spend correctly', () => {
    const fixedDate = new Date('2026-09-18T12:00:00.000Z');
    const result = calculateDailySafeSpend(75000, MOCK_TRANSACTIONS, fixedDate);

    expect(result.totalTargetBudget).toBe(75000);
    expect(result.daysRemaining).toBe(13); // 30 - 18 + 1
    expect(result.amount).toBeGreaterThan(0);
    expect(result.status).toBe('on_track');
  });

  it('predicts monthly savings based on run-rate model', () => {
    const fixedDate = new Date('2026-09-18T12:00:00.000Z');
    const forecast = predictMonthlySavings(125000, MOCK_TRANSACTIONS, fixedDate);

    expect(forecast.income).toBe(125000);
    expect(forecast.projectedSavings).toBeGreaterThan(0);
    expect(forecast.projectedSavingsRate).toBeGreaterThan(0);
  });

  it('detects recurring subscriptions from transaction history', () => {
    const subs = detectSubscriptions(MOCK_TRANSACTIONS);
    expect(subs.length).toBeGreaterThan(0);
    const netflix = subs.find((s) => s.merchant.toLowerCase().includes('netflix'));
    expect(netflix).toBeDefined();
    expect(netflix?.amount).toBe(649);
  });

  it('identifies the largest spending category', () => {
    const largest = getLargestSpendingCategory(MOCK_TRANSACTIONS);
    expect(largest.category).toBe('Investment');
    expect(largest.amount).toBe(15000);
    expect(largest.percentage).toBeGreaterThan(0);
  });

  it('analyzes weekend vs weekday spending difference', () => {
    const analysis = analyzeWeekendVsWeekday(MOCK_TRANSACTIONS);
    expect(analysis.weekdayDailyAvg).toBeGreaterThanOrEqual(0);
    expect(analysis.weekendDailyAvg).toBeGreaterThanOrEqual(0);
  });

  it('summarizes total cash flow correctly', () => {
    const summary = getCashFlowSummary(MOCK_TRANSACTIONS, 125000);
    expect(summary.inflow).toBe(125000);
    expect(summary.outflow).toBe(18849);
    expect(summary.netSavings).toBe(106151);
    expect(summary.savingsRate).toBe(85);
  });
});
