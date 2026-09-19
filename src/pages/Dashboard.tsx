import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  Scan,
  MessageSquareCode,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Wallet,
  ShieldCheck,
  ChevronRight,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useFinanceStore } from '../store/useFinanceStore';
import { useAuthStore } from '../store/useAuthStore';
import { formatCurrency, formatLakhs, formatRelativeTime, getCategoryColor } from '../utils/formatters';
import { PullToRefresh } from '../components/common/PullToRefresh';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
  onOpenAddTx: () => void;
  onOpenScanReceipt: () => void;
  onOpenParseSms: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  setActiveTab,
  onOpenAddTx,
  onOpenScanReceipt,
  onOpenParseSms,
}) => {
  const { user } = useAuthStore();
  const { transactions, budgets, goals, insights, bankAccounts, fetchAiInsights } = useFinanceStore();

  const handleRefresh = async () => {
    try {
      await fetchAiInsights();
    } catch (err) {
      console.error('Refresh failed:', err);
    }
  };

  // Calculations
  const income = transactions.filter((t) => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expense = transactions.filter((t) => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const netSavings = income - expense;
  const savingsRate = income > 0 ? Math.round((netSavings / income) * 100) : 0;

  // Daily Safe Spend Calculation
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const daysRemaining = Math.max(1, daysInMonth - today.getDate() + 1);
  const totalTargetBudget = user?.monthly_budget_target || 75000;
  const remainingBudget = Math.max(0, totalTargetBudget - expense);
  const dailySafeSpend = Math.round(remainingBudget / daysRemaining);

  // Recharts Category Data
  const categoryMap: Record<string, number> = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

  const categoryChartData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value,
    color: getCategoryColor(name as any),
  }));

  // Recharts Monthly Spending Trend Data
  const trendData = [
    { day: 'Sep 01', income: 125000, expense: 2000 },
    { day: 'Sep 05', income: 0, expense: 4500 },
    { day: 'Sep 10', income: 0, expense: 3850 },
    { day: 'Sep 12', income: 0, expense: 6200 },
    { day: 'Sep 14', income: 0, expense: 2450 },
    { day: 'Sep 16', income: 0, expense: 4800 },
    { day: 'Sep 18', income: 0, expense: 1200 },
  ];

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <Container maxWidth="xl" sx={{ py: 3, pb: 10 }}>
      {/* Top Welcome Header */}
      <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            Welcome back, {user?.name || 'Mannat'} 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here is your AI-analyzed financial overview for September 2026.
          </Typography>
        </Box>

        {/* Quick Action Bar */}
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            onClick={onOpenParseSms}
            startIcon={<MessageSquareCode size={18} />}
            sx={{ borderRadius: '14px', px: 2, py: 1, fontWeight: 700 }}
          >
            Bank SMS Sync
          </Button>
          <Button
            variant="outlined"
            onClick={onOpenScanReceipt}
            startIcon={<Scan size={18} />}
            sx={{ borderRadius: '14px', px: 2, py: 1, fontWeight: 700 }}
          >
            Scan Receipt
          </Button>
          <Button
            variant="contained"
            onClick={onOpenAddTx}
            startIcon={<Plus size={18} />}
            sx={{
              borderRadius: '14px',
              px: 2.5,
              py: 1,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #2F66F6 0%, #00D1FF 100%)',
            }}
          >
            Add Expense
          </Button>
        </Box>
      </Box>

      {/* Main KPI Hero Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {/* Card 1: Total Balance & Income */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              p: 1,
              background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
              color: '#FFFFFF',
              boxShadow: '0 12px 30px rgba(15, 23, 42, 0.4)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>
                  TOTAL NET SAVINGS
                </Typography>
                <Chip
                  icon={<TrendingUp size={14} color="#10B981" />}
                  label={`+${savingsRate}% Savings Rate`}
                  size="small"
                  sx={{ bgcolor: 'rgba(16, 185, 129, 0.2)', color: '#34D399', fontWeight: 700 }}
                />
              </Box>

              <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
                {formatCurrency(netSavings)}
              </Typography>

              <Grid container spacing={2} sx={{ pt: 1, borderTop: '1px solid rgba(255, 255, 255, 0.15)' }}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    Total Inflow
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#34D399' }}>
                    {formatCurrency(income)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    Total Outflow
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#F87171' }}>
                    {formatCurrency(expense)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 2: Daily Safe Spend Indicator */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 1, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700 }}>
                  DAILY SAFE SPEND (AI CALC)
                </Typography>
                <Chip label={`${daysRemaining} Days Left`} size="small" color="primary" sx={{ fontWeight: 700 }} />
              </Box>

              <Typography variant="h3" sx={{ fontWeight: 800, color: '#2F66F6', mb: 1 }}>
                {formatCurrency(dailySafeSpend)} <Typography component="span" variant="body2" color="text.secondary">/ day</Typography>
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                You can safely spend up to <strong>{formatCurrency(dailySafeSpend)}</strong> daily without exceeding your monthly budget limit of {formatCurrency(totalTargetBudget)}.
              </Typography>

              <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    Spent: {formatCurrency(expense)}
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    Target: {formatCurrency(totalTargetBudget)}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, (expense / totalTargetBudget) * 100)}
                  sx={{ height: 10, borderRadius: 5, bgcolor: 'rgba(47, 102, 246, 0.15)' }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 3: Top AI Savings Recommendation */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 1, height: '100%', borderLeft: '4px solid #00D1FF' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <Sparkles size={20} color="#00D1FF" />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#00D1FF' }}>
                  AI SAVINGS ADVISOR
                </Typography>
              </Box>

              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                {insights[0]?.message || 'Cook 3 meals at home to cut Food & Dining costs.'}
              </Typography>

              {insights[0]?.potential_savings && (
                <Chip
                  label={`Potential Savings: ${formatCurrency(insights[0].potential_savings)}/mo`}
                  color="success"
                  size="small"
                  sx={{ fontWeight: 800, mb: 2 }}
                />
              )}

              <Box sx={{ mt: 'auto', textAlign: 'right' }}>
                <Button
                  size="small"
                  onClick={() => setActiveTab('savings')}
                  endIcon={<ChevronRight size={16} />}
                  sx={{ fontWeight: 700, textTransform: 'none' }}
                >
                  View All AI Insights
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={2.5}>
        {/* Left Column: Spending Chart & Recent Transactions */}
        <Grid size={{ xs: 12, lg: 8 }}>
          {/* Monthly Spending Trend Chart */}
          <Card sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Cash Flow & Spending Trend
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Track daily inflow vs outflow velocity
                </Typography>
              </Box>
              <Chip label="September 2026" size="small" variant="outlined" sx={{ fontWeight: 700 }} />
            </Box>

            <Box sx={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2F66F6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2F66F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} />
                  <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(val) => `₹${val / 1000}k`} />
                  <RechartsTooltip formatter={(value: any) => formatCurrency(Number(value))} />
                  <Area type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#incomeGrad)" name="Income" />
                  <Area type="monotone" dataKey="expense" stroke="#2F66F6" strokeWidth={2} fillOpacity={1} fill="url(#expenseGrad)" name="Expense" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Card>

          {/* Recent Transactions List */}
          <Card sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Recent Transactions
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Auto-categorized by Gemini OCR & SMS parser
                </Typography>
              </Box>
              <Button
                size="small"
                onClick={() => setActiveTab('transactions')}
                endIcon={<ChevronRight size={16} />}
                sx={{ fontWeight: 700 }}
              >
                View All
              </Button>
            </Box>

            <List disablePadding>
              {transactions.slice(0, 5).map((tx) => (
                <ListItem
                  key={tx.id}
                  sx={{
                    px: 1.5,
                    py: 1.2,
                    mb: 1,
                    borderRadius: '16px',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: `${getCategoryColor(tx.category)}18`,
                        color: getCategoryColor(tx.category),
                        fontWeight: 800,
                        fontSize: '0.9rem',
                      }}
                    >
                      {tx.merchant.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {tx.merchant}
                        </Typography>
                        <Chip
                          label={tx.source.toUpperCase()}
                          size="small"
                          sx={{ height: 18, fontSize: '0.65rem', fontWeight: 800 }}
                        />
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {tx.category} • {formatRelativeTime(tx.created_at)}
                      </Typography>
                    }
                  />
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 800,
                        color: tx.type === 'income' ? '#10B981' : 'text.primary',
                      }}
                    >
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600 }}>
                      {Math.round(tx.confidence * 100)}% AI Match
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Card>
        </Grid>

        {/* Right Column: Category Distribution & Connected Accounts */}
        <Grid size={{ xs: 12, lg: 4 }}>
          {/* Category Breakdown Pie Chart */}
          <Card sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
              Category Breakdown
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              Expenses sorted by top categories
            </Typography>

            <Box sx={{ width: '100%', height: 200, display: 'flex', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(val: any) => formatCurrency(Number(val))} />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            {/* Category Chips Legend */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {categoryChartData.map((cat) => (
                <Chip
                  key={cat.name}
                  label={`${cat.name}: ${formatCurrency(cat.value)}`}
                  size="small"
                  sx={{
                    bgcolor: `${cat.color}15`,
                    color: cat.color,
                    fontWeight: 700,
                    border: `1px solid ${cat.color}40`,
                  }}
                />
              ))}
            </Box>
          </Card>

          {/* Connected Bank Accounts */}
          <Card sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Bank Accounts & Cards
              </Typography>
              <Chip label="Auto Sync" color="success" size="small" sx={{ fontWeight: 700 }} />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {bankAccounts.map((account) => (
                <Paper
                  key={account.id}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: '16px',
                    border: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '12px',
                        bgcolor: 'rgba(47, 102, 246, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Wallet size={20} color="#2F66F6" />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {account.bank_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        •••• {account.last4}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 800,
                      color: account.balance && account.balance < 0 ? '#EF4444' : 'text.primary',
                    }}
                  >
                    {formatCurrency(account.balance || 0)}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
    </PullToRefresh>
  );
};
