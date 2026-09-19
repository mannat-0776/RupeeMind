-- RupeeMind Demo Seed Script for Testing & Staging Environments

-- Insert Default Demo User Profile
INSERT INTO public.profiles (id, name, email, avatar_url, monthly_income, monthly_budget_target, currency)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Mannat Sharma',
  'mannat.sharma@example.com',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  125000.00,
  75000.00,
  '₹'
)
ON CONFLICT (id) DO NOTHING;

-- Insert Bank Accounts
INSERT INTO public.bank_accounts (id, user_id, bank_name, last4, account_type, balance, is_connected, color)
VALUES
  ('ba_1', '00000000-0000-0000-0000-000000000001', 'HDFC Bank', '5678', 'savings', 84200.00, true, '#004C8F'),
  ('ba_2', '00000000-0000-0000-0000-000000000001', 'ICICI Bank', '4321', 'savings', 42100.00, true, '#F37024'),
  ('ba_3', '00000000-0000-0000-0000-000000000001', 'SBI Card', '9012', 'credit_card', 150000.00, true, '#280071')
ON CONFLICT DO NOTHING;

-- Insert Category Budgets
INSERT INTO public.budgets (id, user_id, category, limit_amount, alert_threshold)
VALUES
  ('b_1', '00000000-0000-0000-0000-000000000001', 'Food & Dining', 15000.00, 0.80),
  ('b_2', '00000000-0000-0000-0000-000000000001', 'Shopping', 12000.00, 0.80),
  ('b_3', '00000000-0000-0000-0000-000000000001', 'Transport', 6000.00, 0.80),
  ('b_4', '00000000-0000-0000-0000-000000000001', 'Bills', 8000.00, 0.80),
  ('b_5', '00000000-0000-0000-0000-000000000001', 'Entertainment', 5000.00, 0.80)
ON CONFLICT DO NOTHING;

-- Insert Financial Goals
INSERT INTO public.goals (id, user_id, title, target, current, monthly_sip, target_date, category, icon, expected_return_pct)
VALUES
  ('g_1', '00000000-0000-0000-0000-000000000001', 'Emergency Safety Fund (6 Mo)', 300000.00, 185000.00, 15000.00, '2027-03-31', 'Safety', 'Shield', 7.5),
  ('g_2', '00000000-0000-0000-0000-000000000001', 'MacBook Pro M4 Pro Fund', 180000.00, 120000.00, 10000.00, '2026-12-31', 'Tech', 'Laptop', 12.0),
  ('g_3', '00000000-0000-0000-0000-000000000001', 'Japan Cherry Blossom Trip', 250000.00, 85000.00, 12000.00, '2027-04-15', 'Travel', 'Plane', 10.0)
ON CONFLICT DO NOTHING;
