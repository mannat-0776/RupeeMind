import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Chip,
  IconButton,
  Paper,
} from '@mui/material';
import { PieChart, Plus, AlertTriangle, CheckCircle, Edit2 } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { formatCurrency, getCategoryColor } from '../utils/formatters';
import { BudgetModal } from '../components/BudgetModal';
import { EmptyState } from '../components/common/EmptyState';
import { CategoryType } from '../types';

export const Budgets: React.FC = () => {
  const { budgets } = useFinanceStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('Food & Dining');
  const [selectedLimit, setSelectedLimit] = useState(15000);

  const totalBudgeted = budgets.reduce((acc, b) => acc + b.limit, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0);
  const overallPercentage = totalBudgeted > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0;

  const handleEditBudget = (category: CategoryType, limit: number) => {
    setSelectedCategory(category);
    setSelectedLimit(limit);
    setModalOpen(true);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3, pb: 10 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            Budget Engine & Limits
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Set monthly category spending limits and monitor budget velocity in real time.
          </Typography>
        </Box>

        <Button
          id="set-budget-header-btn"
          variant="contained"
          onClick={() => {
            setSelectedCategory('Food & Dining');
            setSelectedLimit(15000);
            setModalOpen(true);
          }}
          startIcon={<Plus size={18} />}
          sx={{
            borderRadius: '14px',
            px: 2.5,
            py: 1,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #2F66F6 0%, #00D1FF 100%)',
          }}
        >
          Set Category Budget
        </Button>
      </Box>

      {/* Summary Banner */}
      <Card sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', color: '#FFFFFF' }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 700 }}>
              TOTAL MONTHLY BUDGET
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              {formatCurrency(totalSpent)} <Typography component="span" variant="h5" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>/ {formatCurrency(totalBudgeted)}</Typography>
            </Typography>
          </Box>
          <Chip
            label={`${overallPercentage}% Spent`}
            color={overallPercentage > 85 ? 'error' : 'success'}
            sx={{ fontWeight: 800, fontSize: '0.9rem', px: 1 }}
          />
        </Box>

        <LinearProgress
          variant="determinate"
          value={Math.min(100, overallPercentage)}
          sx={{
            height: 12,
            borderRadius: 6,
            bgcolor: 'rgba(255, 255, 255, 0.15)',
            '& .MuiLinearProgress-bar': {
              background: overallPercentage > 85 ? '#EF4444' : 'linear-gradient(90deg, #10B981 0%, #00D1FF 100%)',
            },
          }}
        />
      </Card>

      {/* Budget Category Cards or Empty State */}
      {budgets.length === 0 ? (
        <EmptyState
          icon={PieChart}
          title="No Category Budgets Configured"
          description="Create monthly limits for Food, Shopping, Transport, and Bills to get real-time overspending alerts."
          actionText="Create Category Budget"
          onAction={() => {
            setSelectedCategory('Food & Dining');
            setSelectedLimit(15000);
            setModalOpen(true);
          }}
        />
      ) : (
        <Grid container spacing={2.5}>
          {budgets.map((b) => {
            const percent = b.limit > 0 ? Math.round((b.spent / b.limit) * 100) : 0;
            const isOver = percent >= 100;
            const isWarning = percent >= 80 && percent < 100;
            const catColor = getCategoryColor(b.category);

            return (
              <Grid key={b.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card sx={{ p: 1, borderTop: `4px solid ${catColor}` }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                          {b.category}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Spent {formatCurrency(b.spent)} of {formatCurrency(b.limit)}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        aria-label={`Edit ${b.category} budget`}
                        onClick={() => handleEditBudget(b.category, b.limit)}
                      >
                        <Edit2 size={16} color="#64748B" />
                      </IconButton>
                    </Box>

                    <Box sx={{ mb: 1.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>
                          Usage
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: 800, color: isOver ? '#EF4444' : isWarning ? '#F59E0B' : '#10B981' }}
                        >
                          {percent}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(100, percent)}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: 'rgba(100, 116, 139, 0.15)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: isOver ? '#EF4444' : isWarning ? '#F59E0B' : catColor,
                          },
                        }}
                      />
                    </Box>

                    {isOver && (
                      <Chip
                        icon={<AlertTriangle size={14} color="#EF4444" />}
                        label="Over Budget!"
                        color="error"
                        size="small"
                        sx={{ fontWeight: 800 }}
                      />
                    )}
                    {isWarning && (
                      <Chip
                        icon={<AlertTriangle size={14} color="#F59E0B" />}
                        label="80%+ Budget Used"
                        color="warning"
                        size="small"
                        sx={{ fontWeight: 800 }}
                      />
                    )}
                    {!isOver && !isWarning && (
                      <Chip
                        icon={<CheckCircle size={14} color="#10B981" />}
                        label="On Track"
                        color="success"
                        size="small"
                        sx={{ fontWeight: 800 }}
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <BudgetModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultCategory={selectedCategory}
        defaultLimit={selectedLimit}
      />
    </Container>
  );
};

