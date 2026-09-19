import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Paper,
  Slider,
  CircularProgress,
} from '@mui/material';
import { Sparkles, Lightbulb, TrendingUp, RefreshCw, ArrowRight, ShieldCheck, DollarSign } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { formatCurrency, formatLakhs } from '../utils/formatters';
import { EmptyState } from '../components/common/EmptyState';

export const SavingsAI: React.FC = () => {
  const { insights, fetchAiInsights } = useFinanceStore();

  const [loading, setLoading] = useState(false);

  // Compound Interest Calculator State
  const [monthlySip, setMonthlySip] = useState<number>(5000);
  const [years, setYears] = useState<number>(5);
  const [returnRate, setReturnRate] = useState<number>(12); // 12% expected SIP return

  // Compound calculation: A = P * (((1 + i)^n - 1) / i) * (1 + i)
  const monthlyRate = returnRate / 100 / 12;
  const totalMonths = years * 12;
  const totalInvested = monthlySip * totalMonths;
  const futureValue =
    monthlySip * (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate));
  const totalWealthGained = Math.max(0, Math.round(futureValue - totalInvested));

  const handleRefresh = async () => {
    setLoading(true);
    await fetchAiInsights();
    setLoading(false);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3, pb: 10 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            Savings AI & Intelligence
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Personalized financial optimizations powered by Gemini AI algorithms.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          onClick={handleRefresh}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={18} /> : <RefreshCw size={18} />}
          sx={{ borderRadius: '14px', px: 2.5, fontWeight: 700 }}
        >
          {loading ? 'Analyzing Transactions...' : 'Regenerate AI Insights'}
        </Button>
      </Box>

      {/* AI Insights List or Empty State */}
      {insights.length === 0 ? (
        <Box sx={{ mb: 4 }}>
          <EmptyState
            icon={Sparkles}
            title="No AI Savings Recommendations Yet"
            description="RupeeMind analyzes your recurring expenses, high-velocity categories, and subscription patterns to find actionable savings."
            actionText="Generate AI Insights"
            onAction={handleRefresh}
          />
        </Box>
      ) : (
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          {insights.map((insight) => (
            <Grid key={insight.id} size={{ xs: 12, md: 4 }}>
              <Card sx={{ p: 1, height: '100%', borderLeft: '4px solid #2F66F6' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Chip
                      icon={<Sparkles size={14} color="#00D1FF" />}
                      label={insight.category || 'Savings Alert'}
                      size="small"
                      sx={{ fontWeight: 800, bgcolor: 'rgba(0, 209, 255, 0.1)', color: '#00A1C6' }}
                    />
                    <Chip
                      label={insight.priority.toUpperCase()}
                      size="small"
                      color={insight.priority === 'high' ? 'error' : insight.priority === 'medium' ? 'warning' : 'info'}
                      sx={{ fontWeight: 800, height: 20, fontSize: '0.65rem' }}
                    />
                  </Box>

                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, lineHeight: 1.4 }}>
                    {insight.message}
                  </Typography>

                  {insight.potential_savings && (
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: '12px',
                        bgcolor: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        mb: 2,
                      }}
                    >
                      <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 800, display: 'block' }}>
                        ESTIMATED MONTHLY SAVINGS
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: '#10B981' }}>
                        +{formatCurrency(insight.potential_savings)} / mo
                      </Typography>
                    </Box>
                  )}

                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    endIcon={<ArrowRight size={16} />}
                    sx={{ borderRadius: '12px', fontWeight: 700, mt: 'auto' }}
                  >
                    {insight.action_text || 'Take Action'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* SIP Wealth & Compound Interest Simulator */}
      <Card sx={{ p: 3, background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', color: '#FFFFFF' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <TrendingUp size={24} color="#10B981" />
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            SIP Wealth Compound Simulator
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
          See how redirecting small daily savings into a monthly SIP creates long-term wealth.
        </Typography>

        <Grid container spacing={4} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 700, mb: 1 }}>
                Monthly SIP Investment: {formatCurrency(monthlySip)}
              </Typography>
              <Slider
                value={monthlySip}
                min={500}
                max={50000}
                step={500}
                onChange={(e, val) => setMonthlySip(val as number)}
                sx={{ color: '#00D1FF' }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 700, mb: 1 }}>
                Investment Horizon: {years} Years
              </Typography>
              <Slider
                value={years}
                min={1}
                max={30}
                step={1}
                onChange={(e, val) => setYears(val as number)}
                sx={{ color: '#2F66F6' }}
              />
            </Box>

            <Box sx={{ mb: 1 }}>
              <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 700, mb: 1 }}>
                Expected Annual Return: {returnRate}%
              </Typography>
              <Slider
                value={returnRate}
                min={6}
                max={20}
                step={0.5}
                onChange={(e, val) => setReturnRate(val as number)}
                sx={{ color: '#10B981' }}
              />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '20px',
                bgcolor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
              }}
            >
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600 }}>
                    Total Investment
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {formatLakhs(totalInvested)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600 }}>
                    Wealth Growth Gained
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#34D399' }}>
                    +{formatLakhs(totalWealthGained)}
                  </Typography>
                </Grid>
              </Grid>

              <Box sx={{ pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.15)' }}>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 700 }}>
                  TOTAL PROJECTED CORPUS
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#00D1FF' }}>
                  {formatLakhs(Math.round(futureValue))}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};
