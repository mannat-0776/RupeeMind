-- RupeeMind Complete Production-Ready Supabase PostgreSQL Schema
-- Includes Users, Bank Accounts, Transactions, Budgets, Goals, Insights, and Row-Level Security (RLS)

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS PROFILE TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    avatar_url TEXT,
    monthly_income NUMERIC(14, 2) DEFAULT 125000.00,
    monthly_budget_target NUMERIC(14, 2) DEFAULT 75000.00,
    currency VARCHAR(5) DEFAULT '₹',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BANK ACCOUNTS TABLE
CREATE TABLE IF NOT EXISTS public.bank_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    bank_name TEXT NOT NULL, -- e.g. HDFC Bank, ICICI Bank, SBI, Axis Bank, UPI
    account_type TEXT NOT NULL CHECK (account_type IN ('savings', 'current', 'credit_card', 'wallet', 'investment')),
    account_number_last4 VARCHAR(8) NOT NULL,
    current_balance NUMERIC(14, 2) DEFAULT 0.00,
    credit_limit NUMERIC(14, 2) DEFAULT 0.00,
    currency VARCHAR(5) DEFAULT '₹',
    is_primary BOOLEAN DEFAULT FALSE,
    color_hex VARCHAR(10) DEFAULT '#2F66F6',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    bank_account_id UUID REFERENCES public.bank_accounts(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN ('expense', 'income', 'transfer', 'investment')),
    amount NUMERIC(14, 2) NOT NULL,
    category TEXT NOT NULL,
    merchant_name TEXT NOT NULL,
    description TEXT,
    date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source TEXT NOT NULL CHECK (source IN ('manual', 'receipt_scan', 'sms_parse', 'api_sync')),
    status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'cancelled')),
    
    -- OCR & Receipt Metadata
    receipt_image_url TEXT,
    receipt_raw_text TEXT,
    receipt_tax_amount NUMERIC(10, 2),
    receipt_confidence NUMERIC(5, 2), -- e.g. 98.5%
    
    -- Bank SMS Metadata
    raw_sms_body TEXT,
    sms_sender_header VARCHAR(20),
    
    -- AI Tagging & Tax flags
    is_recurring BOOLEAN DEFAULT FALSE,
    is_tax_deductible BOOLEAN DEFAULT FALSE,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BUDGETS TABLE
CREATE TABLE IF NOT EXISTS public.budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    allocated_amount NUMERIC(14, 2) NOT NULL,
    period TEXT DEFAULT 'monthly' CHECK (period IN ('weekly', 'monthly', 'quarterly', 'yearly')),
    alert_threshold_percent INT DEFAULT 80, -- Alert at 80% utilization
    color_hex VARCHAR(10) DEFAULT '#2F66F6',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, category, period)
);

-- 6. GOALS & SIP INVESTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('emergency_fund', 'investment', 'vacation', 'vehicle', 'real_estate', 'gadget', 'other')),
    target_amount NUMERIC(14, 2) NOT NULL,
    current_amount NUMERIC(14, 2) DEFAULT 0.00,
    monthly_sip_contribution NUMERIC(14, 2) DEFAULT 0.00,
    target_date DATE,
    expected_annual_return_pct NUMERIC(5, 2) DEFAULT 12.00, -- e.g., 12% for Index SIP
    is_completed BOOLEAN DEFAULT FALSE,
    color_hex VARCHAR(10) DEFAULT '#10B981',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. AI SAVINGS INSIGHTS TABLE
CREATE TABLE IF NOT EXISTS public.insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL, -- e.g., 'subscription_alert', 'dining_velocity', 'sip_opportunity'
    severity TEXT NOT NULL CHECK (severity IN ('tip', 'warning', 'opportunity', 'critical')),
    potential_monthly_savings NUMERIC(14, 2) DEFAULT 0.00,
    action_url TEXT,
    is_dismissed BOOLEAN DEFAULT FALSE,
    is_implemented BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON public.transactions(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON public.transactions(user_id, category);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_user ON public.bank_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_user ON public.budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_user ON public.goals(user_id);
CREATE INDEX IF NOT EXISTS idx_insights_user ON public.insights(user_id, created_at DESC);

-- 9. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insights ENABLE ROW LEVEL SECURITY;

-- Users RLS
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Bank Accounts RLS
CREATE POLICY "Users can view own bank accounts" ON public.bank_accounts
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bank accounts" ON public.bank_accounts
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bank accounts" ON public.bank_accounts
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own bank accounts" ON public.bank_accounts
    FOR DELETE USING (auth.uid() = user_id);

-- Transactions RLS
CREATE POLICY "Users can view own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON public.transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transactions" ON public.transactions
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own transactions" ON public.transactions
    FOR DELETE USING (auth.uid() = user_id);

-- Budgets RLS
CREATE POLICY "Users can view own budgets" ON public.budgets
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own budgets" ON public.budgets
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own budgets" ON public.budgets
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own budgets" ON public.budgets
    FOR DELETE USING (auth.uid() = user_id);

-- Goals RLS
CREATE POLICY "Users can view own goals" ON public.goals
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON public.goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON public.goals
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON public.goals
    FOR DELETE USING (auth.uid() = user_id);

-- Insights RLS
CREATE POLICY "Users can view own insights" ON public.insights
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own insights" ON public.insights
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own insights" ON public.insights
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 10. AUTH USER CREATION TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
