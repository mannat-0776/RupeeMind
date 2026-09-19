import { describe, it, expect, beforeEach } from 'vitest';
import { useFinanceStore } from '../store/useFinanceStore';
import { Transaction } from '../types';

describe('Finance Store (Zustand) Test Suite', () => {
  beforeEach(() => {
    // Reset state to default test values
    useFinanceStore.setState({
      transactions: [],
      budgets: [
        { id: 'b1', user_id: 'u1', category: 'Food & Dining', limit: 12000, spent: 0 },
      ],
      goals: [
        { id: 'g1', user_id: 'u1', title: 'Emergency Fund', target: 100000, current: 25000, target_date: '2026-12-31' },
      ],
      themeMode: 'dark',
    });
  });

  it('adds a new transaction and increments transaction list count', async () => {
    const newTx: Omit<Transaction, 'id' | 'user_id' | 'created_at'> = {
      amount: 850,
      type: 'expense',
      category: 'Food & Dining',
      merchant: 'Swiggy Gourmet',
      source: 'manual',
      confidence: 1.0,
      notes: 'Weekend dinner',
    };

    await useFinanceStore.getState().addTransaction(newTx);

    const state = useFinanceStore.getState();
    expect(state.transactions.length).toBe(1);
    expect(state.transactions[0].amount).toBe(850);
    expect(state.transactions[0].merchant).toBe('Swiggy Gourmet');
  });

  it('updates an existing transaction properly', async () => {
    const newTx: Omit<Transaction, 'id' | 'user_id' | 'created_at'> = {
      amount: 500,
      type: 'expense',
      category: 'Transport',
      merchant: 'Uber Ride',
      source: 'manual',
      confidence: 1.0,
    };

    await useFinanceStore.getState().addTransaction(newTx);
    const addedId = useFinanceStore.getState().transactions[0].id;
    await useFinanceStore.getState().updateTransaction(addedId, { amount: 650, notes: 'Surge pricing' });

    const state = useFinanceStore.getState();
    const updated = state.transactions.find((t) => t.id === addedId);
    expect(updated?.amount).toBe(650);
    expect(updated?.notes).toBe('Surge pricing');
  });

  it('deletes a transaction from state', async () => {
    await useFinanceStore.getState().addTransaction({
      amount: 1200,
      type: 'expense',
      category: 'Shopping',
      merchant: 'Amazon India',
      source: 'manual',
      confidence: 1.0,
    });

    expect(useFinanceStore.getState().transactions.length).toBe(1);
    const addedId = useFinanceStore.getState().transactions[0].id;

    await useFinanceStore.getState().deleteTransaction(addedId);
    expect(useFinanceStore.getState().transactions.length).toBe(0);
  });

  it('contributes to an active financial goal', async () => {
    const initialGoal = useFinanceStore.getState().goals[0];
    expect(initialGoal.current).toBe(25000);

    await useFinanceStore.getState().contributeToGoal('g1', 5000);

    const updatedGoal = useFinanceStore.getState().goals.find((g) => g.id === 'g1');
    expect(updatedGoal?.current).toBe(30000);
  });

  it('toggles theme mode between light and dark', () => {
    expect(useFinanceStore.getState().themeMode).toBe('dark');
    useFinanceStore.getState().toggleThemeMode();
    expect(useFinanceStore.getState().themeMode).toBe('light');
    useFinanceStore.getState().toggleThemeMode();
    expect(useFinanceStore.getState().themeMode).toBe('dark');
  });
});
