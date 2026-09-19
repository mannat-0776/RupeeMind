import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  Avatar,
  Button,
  Grid,
  TextField,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Paper,
  Alert,
} from '@mui/material';
import { User, LogOut, Sun, Moon, Shield, RefreshCw, Check, Sparkles, Layout } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useFinanceStore } from '../store/useFinanceStore';
import { formatCurrency } from '../utils/formatters';

interface ProfileProps {
  onViewLanding?: () => void;
  onReplayOnboarding?: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ onViewLanding, onReplayOnboarding }) => {
  const { user, updateProfile, logout, resetOnboarding } = useAuthStore();
  const { themeMode, toggleThemeMode, resetToDemoData } = useFinanceStore();

  const [name, setName] = useState(user?.name || 'Mannat Walia');
  const [email, setEmail] = useState(user?.email || 'mannat@example.com');
  const [income, setIncome] = useState((user?.monthly_income || 125000).toString());
  const [targetBudget, setTargetBudget] = useState((user?.monthly_budget_target || 75000).toString());
  const [currency, setCurrency] = useState<'₹' | '$' | '€' | '£'>(user?.currency || '₹');
  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      monthly_income: parseFloat(income) || 125000,
      monthly_budget_target: parseFloat(targetBudget) || 75000,
      currency,
    });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleReplay = () => {
    resetOnboarding();
    if (onReplayOnboarding) {
      onReplayOnboarding();
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3, pb: 10 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          User Settings & Preferences
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage user profile credentials, monthly income targets, theme mode, and startup preferences.
        </Typography>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: '16px' }}>
          Profile settings updated successfully!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* User Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              src={user?.avatar}
              alt={user?.name || 'User'}
              sx={{
                width: 96,
                height: 96,
                mx: 'auto',
                mb: 2,
                bgcolor: '#2F66F6',
                fontSize: '2rem',
                fontWeight: 800,
                boxShadow: '0 8px 24px rgba(47, 102, 246, 0.3)',
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'M'}
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              {user?.name || 'Mannat Walia'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {user?.email || 'mannat@example.com'}
            </Typography>

            <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', bgcolor: 'action.hover', mb: 3 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                MONTHLY INCOME TARGET
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#10B981' }}>
                {formatCurrency(user?.monthly_income || 125000, user?.currency || '₹')}
              </Typography>
            </Paper>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {onViewLanding && (
                <Button
                  id="view-landing-page-btn"
                  variant="outlined"
                  fullWidth
                  onClick={onViewLanding}
                  startIcon={<Layout size={18} color="#2F66F6" />}
                  sx={{ borderRadius: '14px', fontWeight: 700 }}
                >
                  View Landing Page
                </Button>
              )}

              <Button
                id="replay-onboarding-btn"
                variant="outlined"
                fullWidth
                onClick={handleReplay}
                startIcon={<Sparkles size={18} color="#00D1FF" />}
                sx={{ borderRadius: '14px', fontWeight: 700 }}
              >
                Replay Onboarding Guide
              </Button>

              <Button
                id="signout-profile-btn"
                variant="outlined"
                color="error"
                fullWidth
                onClick={logout}
                startIcon={<LogOut size={18} />}
                sx={{ borderRadius: '14px', fontWeight: 700 }}
              >
                Sign Out Account
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Profile Settings Form */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
              Profile & Financial Settings
            </Typography>

            <form onSubmit={handleSave}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    id="profile-fullname-input"
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    id="profile-email-input"
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    id="profile-income-input"
                    label="Monthly Net Income"
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    id="profile-budget-input"
                    label="Monthly Budget Target"
                    type="number"
                    value={targetBudget}
                    onChange={(e) => setTargetBudget(e.target.value)}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    id="profile-currency-input"
                    select
                    label="Preferred Currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as any)}
                    fullWidth
                  >
                    <MenuItem value="₹">₹ - Indian Rupee (INR)</MenuItem>
                    <MenuItem value="$">$ - US Dollar (USD)</MenuItem>
                    <MenuItem value="€">€ - Euro (EUR)</MenuItem>
                    <MenuItem value="£">£ - British Pound (GBP)</MenuItem>
                  </TextField>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: '14px',
                      border: '1px solid',
                      borderColor: 'divider',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      height: '100%',
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Theme ({themeMode === 'light' ? 'Light' : 'Dark'})
                    </Typography>
                    <FormControlLabel
                      control={<Switch id="profile-theme-switch" checked={themeMode === 'dark'} onChange={toggleThemeMode} />}
                      label={themeMode === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                      sx={{ mr: 0 }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Button
                    id="save-profile-btn"
                    type="submit"
                    variant="contained"
                    startIcon={<Check size={18} />}
                    sx={{
                      borderRadius: '14px',
                      px: 3,
                      py: 1.2,
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #2F66F6 0%, #00D1FF 100%)',
                    }}
                  >
                    Save Preferences
                  </Button>
                </Grid>
              </Grid>
            </form>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                  Reset Demo Ledger Data
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Restore default initial transactions, budgets, and goals
                </Typography>
              </Box>
              <Button
                id="reset-ledger-btn"
                variant="outlined"
                color="warning"
                onClick={resetToDemoData}
                startIcon={<RefreshCw size={16} />}
                sx={{ borderRadius: '12px', fontWeight: 700 }}
              >
                Reset Ledger
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};
