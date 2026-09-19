# RupeeMind — Database Schema & Architecture

RupeeMind utilizes **Supabase (PostgreSQL 15+)** with strict **Row Level Security (RLS)**, automatic audit triggers, and real-time synchronization.

---

## Entity Relationship Summary

```
auth.users (Supabase Auth)
  │
  ├── profiles (1:1) [PK: id -> auth.users.id]
  ├── transactions (1:N) [FK: user_id]
  ├── budgets (1:N) [FK: user_id]
  ├── goals (1:N) [FK: user_id]
  ├── bank_accounts (1:N) [FK: user_id]
  ├── ai_insights (1:N) [FK: user_id]
  └── recurring_subscriptions (1:N) [FK: user_id]
```

---

## Tables & Schemas

### 1. `profiles`
Stores user settings, monthly income, currency preference, and budget targets.
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  monthly_income NUMERIC(12, 2) DEFAULT 125000.00,
  monthly_budget_target NUMERIC(12, 2) DEFAULT 75000.00,
  currency TEXT DEFAULT '₹',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. `transactions`
Unified ledger for all income, expense, transfer, and investment items.
```sql
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL,
  merchant TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'transfer', 'investment')),
  source TEXT NOT NULL CHECK (source IN ('receipt', 'sms', 'manual', 'bank_sync', 'api_sync')),
  payment_method TEXT DEFAULT 'UPI',
  raw_text TEXT,
  confidence NUMERIC(3, 2) DEFAULT 0.95,
  tax NUMERIC(10, 2) DEFAULT 0.00,
  gst_number TEXT,
  items JSONB DEFAULT '[]'::jsonb,
  is_recurring BOOLEAN DEFAULT false,
  is_subscription BOOLEAN DEFAULT false,
  account_last4 TEXT,
  bank_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. `budgets`
Category-specific limits and alert thresholds.
```sql
CREATE TABLE public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  limit_amount NUMERIC(12, 2) NOT NULL,
  alert_threshold NUMERIC(3, 2) DEFAULT 0.80,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, category)
);
```

### 4. `goals`
Financial milestones, savings targets, and SIP tracking.
```sql
CREATE TABLE public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target NUMERIC(12, 2) NOT NULL,
  current NUMERIC(12, 2) DEFAULT 0.00,
  monthly_sip NUMERIC(12, 2) DEFAULT 0.00,
  target_date DATE,
  category TEXT DEFAULT 'Other',
  icon TEXT DEFAULT 'Target',
  expected_return_pct NUMERIC(4, 2) DEFAULT 12.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Row Level Security (RLS) Policies

All tables have RLS enabled. Users can only perform CRUD operations on rows where `user_id = auth.uid()`.

Example:
```sql
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own transactions"
ON public.transactions
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```
