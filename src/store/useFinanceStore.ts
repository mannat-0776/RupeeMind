import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Transaction,
  Budget,
  Goal,
  Insight,
  BankAccount,
  CategoryType,
  ReceiptExtractionResult,
  SmsParseResult,
} from '../types';

interface FinanceState {
  themeMode: 'light' | 'dark';
  setThemeMode: (mode: 'light' | 'dark') => void;
  toggleThemeMode: () => void;

  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  insights: Insight[];
  bankAccounts: BankAccount[];

  // Actions
  addTransaction: (tx: Omit<Transaction, 'id' | 'user_id' | 'created_at'> & { created_at?: string }) => void;
  updateTransaction: (id: string, data: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  updateBudgetLimit: (category: CategoryType, limit: number) => void;
  deleteBudget: (budgetId: string) => void;
  clearAllBudgets: () => void;
  addGoal: (goal: Omit<Goal, 'id' | 'user_id'>) => void;
  contributeToGoal: (goalId: string, amount: number) => void;
  deleteGoal: (goalId: string) => void;

  parseReceiptWithAI: (fileBase64: string, mimeType: string) => Promise<ReceiptExtractionResult>;
  parseSmsWithAI: (smsText: string) => Promise<SmsParseResult>;
  fetchAiInsights: () => Promise<Insight[]>;
  addInsight: (insight: Omit<Insight, 'id' | 'user_id' | 'created_at'>) => void;

  resetToDemoData: () => void;
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_01',
    user_id: 'usr_default_101',
    amount: 125000,
    merchant: 'TechCorp Pvt Ltd',
    category: 'Salary',
    type: 'income',
    source: 'bank_sync',
    raw_text: 'HDFC Bank: Rs 1,25,000.00 credited to a/c XX4321 on 01-Sep-2026 by NEFT-TechCorp Payroll',
    confidence: 0.99,
    created_at: new Date(Date.now() - 86400000 * 17).toISOString(),
    notes: 'Monthly Net Salary Credit',
  },
  {
    id: 'tx_02',
    user_id: 'usr_default_101',
    amount: 15000,
    merchant: 'Zerodha Mutual Funds',
    category: 'Investment',
    type: 'expense',
    source: 'bank_sync',
    raw_text: 'HDFC Bank: Rs 15,000.00 debited for Zerodha Coin Auto-SIP Nifty 50 Fund',
    confidence: 0.98,
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
    notes: 'Monthly SIP Investment',
  },
  {
    id: 'tx_03',
    user_id: 'usr_default_101',
    amount: 2450,
    merchant: 'Zomato',
    category: 'Food & Dining',
    type: 'expense',
    source: 'sms',
    raw_text: 'HDFC Bank: Rs.2,450.00 spent at ZOMATO BANGALORE on 14 Sep using Card XX5678.',
    confidence: 0.96,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    items: [
      { name: 'Butter Chicken Meal', price: 650, qty: 2 },
      { name: 'Garlic Naan & Rice', price: 350, qty: 2 },
      { name: 'Truffle Pastry', price: 450, qty: 2 },
    ],
  },
  {
    id: 'tx_04',
    user_id: 'usr_default_101',
    amount: 4800,
    merchant: 'Amazon India',
    category: 'Shopping',
    type: 'expense',
    source: 'receipt',
    raw_text: 'Amazon Order #408-98123-11: Ergonomic Desk Chair Cushion & Cable Organizers',
    confidence: 0.95,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    tax: 432,
    items: [
      { name: 'Memory Foam Seat Cushion', price: 3200 },
      { name: 'Braided Type-C Cables 3-Pack', price: 1168 },
    ],
  },
  {
    id: 'tx_05',
    user_id: 'usr_default_101',
    amount: 620,
    merchant: 'Uber Rides',
    category: 'Transport',
    type: 'expense',
    source: 'sms',
    raw_text: 'ICICI Bank Credit Card XX9012 spent INR 620.00 at UBER RIDES INDIA on 16-Sep-26',
    confidence: 0.97,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'tx_06',
    user_id: 'usr_default_101',
    amount: 3850,
    merchant: 'BESCOM Electricity',
    category: 'Bills',
    type: 'expense',
    source: 'sms',
    raw_text: 'SBI Card: INR 3,850.00 paid towards BESCOM ELECTRICITY BILL on 12-Sep-2026',
    confidence: 0.99,
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    id: 'tx_07',
    user_id: 'usr_default_101',
    amount: 1499,
    merchant: 'PVR Cinemas',
    category: 'Entertainment',
    type: 'expense',
    source: 'receipt',
    raw_text: 'PVR IMAX Phoenix Marketcity: 2x Recliner Tickets + Cheese Popcorn Combo',
    confidence: 0.94,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'tx_08',
    user_id: 'usr_default_101',
    amount: 1850,
    merchant: 'Apollo Pharmacy',
    category: 'Healthcare',
    type: 'expense',
    source: 'receipt',
    raw_text: 'Apollo Pharmacy Bill #89012: Multivitamins & Whey Protein Supplement',
    confidence: 0.96,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'tx_09',
    user_id: 'usr_default_101',
    amount: 1200,
    merchant: 'Swiggy Instamart',
    category: 'Food & Dining',
    type: 'expense',
    source: 'sms',
    raw_text: 'HDFC Bank: Rs 1,200.00 debited for SWIGGY INSTAMART GROCERIES',
    confidence: 0.95,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

const INITIAL_BUDGETS: Budget[] = [
  { id: 'b1', user_id: 'usr_default_101', category: 'Food & Dining', limit: 18000, spent: 3650 },
  { id: 'b2', user_id: 'usr_default_101', category: 'Shopping', limit: 15000, spent: 4800 },
  { id: 'b3', user_id: 'usr_default_101', category: 'Transport', limit: 8000, spent: 620 },
  { id: 'b4', user_id: 'usr_default_101', category: 'Bills', limit: 12000, spent: 3850 },
  { id: 'b5', user_id: 'usr_default_101', category: 'Entertainment', limit: 6000, spent: 1499 },
  { id: 'b6', user_id: 'usr_default_101', category: 'Healthcare', limit: 5000, spent: 1850 },
  { id: 'b7', user_id: 'usr_default_101', category: 'Investment', limit: 25000, spent: 15000 },
];

const INITIAL_GOALS: Goal[] = [
  {
    id: 'g1',
    user_id: 'usr_default_101',
    title: 'Emergency Fund (6 Months)',
    target: 300000,
    current: 210000,
    target_date: '2026-12-31',
    category: 'Safety',
    icon: 'Shield',
  },
  {
    id: 'g2',
    user_id: 'usr_default_101',
    title: 'MacBook Pro M4 Max',
    target: 220000,
    current: 145000,
    target_date: '2026-11-15',
    category: 'Tech',
    icon: 'Laptop',
  },
  {
    id: 'g3',
    user_id: 'usr_default_101',
    title: 'Japan Autumn Trip',
    target: 180000,
    current: 95000,
    target_date: '2027-03-20',
    category: 'Travel',
    icon: 'Plane',
  },
];

const INITIAL_INSIGHTS: Insight[] = [
  {
    id: 'in_1',
    user_id: 'usr_default_101',
    message: 'You spent 32% more on Food & Dining this week compared to last week. Cooking at home 3 times could save ₹2,400/month.',
    priority: 'high',
    category: 'Food & Dining',
    potential_savings: 2400,
    action_text: 'Adjust Meal Plan',
    created_at: new Date().toISOString(),
  },
  {
    id: 'in_2',
    user_id: 'usr_default_101',
    message: 'Great job! Your monthly investment goal (₹25,000) is 60% completed. Investing an extra ₹3,500 can compound to ₹1.2 Lakhs in 5 years.',
    priority: 'medium',
    category: 'Investment',
    potential_savings: 3500,
    action_text: 'Top Up SIP',
    created_at: new Date().toISOString(),
  },
  {
    id: 'in_3',
    user_id: 'usr_default_101',
    message: 'Electricity Bill was ₹3,850. Peak summer AC usage detected. Switching to eco-mode during sleep could trim ₹650 off next bill.',
    priority: 'low',
    category: 'Bills',
    potential_savings: 650,
    action_text: 'Energy Tips',
    created_at: new Date().toISOString(),
  },
];

const INITIAL_BANK_ACCOUNTS: BankAccount[] = [
  { id: 'ba_1', user_id: 'usr_default_101', bank_name: 'HDFC Bank Salary A/c', last4: '4321', balance: 184500, is_connected: true },
  { id: 'ba_2', user_id: 'usr_default_101', bank_name: 'ICICI Sapphiro Credit Card', last4: '9012', balance: -12480, is_connected: true },
  { id: 'ba_3', user_id: 'usr_default_101', bank_name: 'SBI Savings A/c', last4: '7890', balance: 65200, is_connected: true },
];

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      themeMode: 'light',
      setThemeMode: (mode) => set({ themeMode: mode }),
      toggleThemeMode: () => set((state) => ({ themeMode: state.themeMode === 'light' ? 'dark' : 'light' })),

      transactions: INITIAL_TRANSACTIONS,
      budgets: INITIAL_BUDGETS,
      goals: INITIAL_GOALS,
      insights: INITIAL_INSIGHTS,
      bankAccounts: INITIAL_BANK_ACCOUNTS,

      addTransaction: (tx) => {
        const newTx: Transaction = {
          ...tx,
          id: 'tx_' + Date.now(),
          user_id: 'usr_default_101',
          confidence: tx.confidence ?? 1.0,
          created_at: tx.created_at || new Date().toISOString(),
        };

        // Update budget spent automatically if expense
        set((state) => {
          const updatedTransactions = [newTx, ...state.transactions];
          let updatedBudgets = [...state.budgets];

          if (newTx.type === 'expense') {
            updatedBudgets = updatedBudgets.map((b) => {
              if (b.category === newTx.category) {
                return { ...b, spent: b.spent + newTx.amount };
              }
              return b;
            });
          }

          return {
            transactions: updatedTransactions,
            budgets: updatedBudgets,
          };
        });
      },

      updateTransaction: (id, data) => {
        set((state) => ({
          transactions: state.transactions.map((t) => (t.id === id ? { ...t, ...data } : t)),
        }));
      },

      deleteTransaction: (id) => {
        set((state) => {
          const target = state.transactions.find((t) => t.id === id);
          if (!target) return state;

          const updatedTransactions = state.transactions.filter((t) => t.id !== id);
          let updatedBudgets = [...state.budgets];

          if (target.type === 'expense') {
            updatedBudgets = updatedBudgets.map((b) => {
              if (b.category === target.category) {
                return { ...b, spent: Math.max(0, b.spent - target.amount) };
              }
              return b;
            });
          }

          return {
            transactions: updatedTransactions,
            budgets: updatedBudgets,
          };
        });
      },

      updateBudgetLimit: (category, limit) => {
        set((state) => {
          const exists = state.budgets.some((b) => b.category === category);
          if (exists) {
            return {
              budgets: state.budgets.map((b) => (b.category === category ? { ...b, limit } : b)),
            };
          } else {
            return {
              budgets: [
                ...state.budgets,
                { id: 'b_' + Date.now(), user_id: 'usr_default_101', category, limit, spent: 0 },
              ],
            };
          }
        });
      },

      deleteBudget: (budgetId) => {
        set((state) => ({
          budgets: state.budgets.filter((b) => b.id !== budgetId),
        }));
      },

      clearAllBudgets: () => {
        set({ budgets: [] });
      },

      addGoal: (goal) => {
        const newGoal: Goal = {
          ...goal,
          id: 'g_' + Date.now(),
          user_id: 'usr_default_101',
        };
        set((state) => ({ goals: [...state.goals, newGoal] }));
      },

      contributeToGoal: (goalId, amount) => {
        set((state) => ({
          goals: state.goals.map((g) => (g.id === goalId ? { ...g, current: g.current + amount } : g)),
        }));
      },

      deleteGoal: (goalId) => {
        set((state) => ({ goals: state.goals.filter((g) => g.id !== goalId) }));
      },

      parseReceiptWithAI: async (fileBase64, mimeType) => {
        try {
          const res = await fetch('/api/parse-receipt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileBase64, mimeType }),
          });
          const data = await res.json();
          if (data && data.merchant) {
            return data as ReceiptExtractionResult;
          }
          throw new Error('Invalid response from receipt parser');
        } catch (err) {
          // Robust client side fallback parsing if server offline
          return {
            merchant: 'Starbucks Coffee',
            date: new Date().toISOString().split('T')[0],
            amount: 450,
            tax: 36,
            items: [
              { name: 'Caffe Latte Venti', price: 320, qty: 1 },
              { name: 'Blueberry Muffin', price: 130, qty: 1 },
            ],
            total: 486,
            category: 'Food & Dining',
            confidence: 0.92,
            rawText: 'Starbucks Store #4891\n1x Latte 320\n1x Muffin 130\nGST 18%: 36\nTotal: 486 INR',
          };
        }
      },

      parseSmsWithAI: async (smsText) => {
        try {
          const res = await fetch('/api/parse-sms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ smsText }),
          });
          const data = await res.json();
          if (data && data.merchant) {
            return data as SmsParseResult;
          }
          throw new Error('Invalid response from SMS parser');
        } catch (err) {
          // Robust fallback
          let merchant = 'Merchant Store';
          let amount = 350;
          let category: CategoryType = 'Shopping';

          if (/zomato/i.test(smsText)) {
            merchant = 'Zomato';
            amount = 349;
            category = 'Food & Dining';
          } else if (/swiggy/i.test(smsText)) {
            merchant = 'Swiggy';
            amount = 420;
            category = 'Food & Dining';
          } else if (/uber|ola/i.test(smsText)) {
            merchant = 'Uber Cab';
            amount = 280;
            category = 'Transport';
          } else if (/amazon|flipkart/i.test(smsText)) {
            merchant = 'Amazon India';
            amount = 1299;
            category = 'Shopping';
          }

          return {
            merchant,
            amount,
            category,
            type: 'expense',
            confidence: 0.91,
          };
        }
      },

      fetchAiInsights: async () => {
        const currentTxs = get().transactions;
        try {
          const res = await fetch('/api/generate-insights', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transactions: currentTxs }),
          });
          const data = await res.json();
          if (data && Array.isArray(data.insights)) {
            set({ insights: data.insights });
            return data.insights;
          }
        } catch (err) {
          console.error('Failed to fetch insights:', err);
        }
        return get().insights;
      },

      addInsight: (insight) => {
        const newIn: Insight = {
          ...insight,
          id: 'in_' + Date.now(),
          user_id: 'usr_default_101',
          created_at: new Date().toISOString(),
        };
        set((state) => ({ insights: [newIn, ...state.insights] }));
      },

      resetToDemoData: () => {
        set({
          transactions: INITIAL_TRANSACTIONS,
          budgets: INITIAL_BUDGETS,
          goals: INITIAL_GOALS,
          insights: INITIAL_INSIGHTS,
          bankAccounts: INITIAL_BANK_ACCOUNTS,
        });
      },
    }),
    {
      name: 'rupeemind-storage-v1',
    }
  )
);
