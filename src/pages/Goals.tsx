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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Target, Plus, Shield, Laptop, Plane, Trash2, CheckCircle, ArrowUpRight } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { formatCurrency, formatDate } from '../utils/formatters';
import { GoalModal } from '../components/GoalModal';
import { EmptyState } from '../components/common/EmptyState';
import { Goal } from '../types';

export const Goals: React.FC = () => {
  const { goals, contributeToGoal, deleteGoal } = useFinanceStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [contributeGoal, setContributeGoal] = useState<Goal | null>(null);
  const [depositAmount, setDepositAmount] = useState('5000');

  const handleDepositSubmit = () => {
    if (!contributeGoal) return;
    const parsed = parseFloat(depositAmount);
    if (isNaN(parsed) || parsed <= 0) return;

    contributeToGoal(contributeGoal.id, parsed);
    setContributeGoal(null);
    setDepositAmount('5000');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3, pb: 10 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            Financial Target Goals
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track emergency funds, tech purchases, and vacation funds with milestone progress bars.
          </Typography>
        </Box>

        <Button
          id="create-goal-header-btn"
          variant="contained"
          onClick={() => setModalOpen(true)}
          startIcon={<Plus size={18} />}
          sx={{
            borderRadius: '14px',
            px: 2.5,
            py: 1,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #2F66F6 0%, #00D1FF 100%)',
          }}
        >
          Create Goal
        </Button>
      </Box>

      {/* Goal Cards Grid or Empty State */}
      {goals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No Financial Goals Set Yet"
          description="Create customized target goals for emergency funds, major purchases, vacations, or SIP compounding targets."
          actionText="Create Your First Goal"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <Grid container spacing={2.5}>
          {goals.map((goal) => {
            const percent = goal.target > 0 ? Math.round((goal.current / goal.target) * 100) : 0;
            const isCompleted = percent >= 100;

            return (
              <Grid key={goal.id} size={{ xs: 12, md: 4 }}>
                <Card sx={{ p: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: '14px',
                            bgcolor: 'rgba(47, 102, 246, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Target size={22} color="#2F66F6" />
                        </Box>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 800 }}>
                            {goal.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Target Date: {goal.target_date ? formatDate(goal.target_date) : 'Ongoing'}
                          </Typography>
                        </Box>
                      </Box>

                      <IconButton size="small" aria-label="Delete goal" onClick={() => deleteGoal(goal.id)}>
                        <Trash2 size={16} color="#EF4444" />
                      </IconButton>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: '#2F66F6', mb: 0.5 }}>
                        {formatCurrency(goal.current)}{' '}
                        <Typography component="span" variant="body2" color="text.secondary">
                          / {formatCurrency(goal.target)}
                        </Typography>
                      </Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>
                          Progress
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: isCompleted ? '#10B981' : '#2F66F6' }}>
                          {percent}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(100, percent)}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          bgcolor: 'rgba(47, 102, 246, 0.15)',
                          '& .MuiLinearProgress-bar': {
                            background: isCompleted
                              ? '#10B981'
                              : 'linear-gradient(90deg, #2F66F6 0%, #00D1FF 100%)',
                          },
                        }}
                      />
                    </Box>

                    {isCompleted ? (
                      <Chip
                        icon={<CheckCircle size={14} color="#10B981" />}
                        label="Goal Completed!"
                        color="success"
                        sx={{ fontWeight: 800, width: '100%' }}
                      />
                    ) : (
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => setContributeGoal(goal)}
                        startIcon={<ArrowUpRight size={16} />}
                        sx={{ borderRadius: '12px', fontWeight: 700 }}
                      >
                        Add Progress Deposit
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Goal Creation Modal */}
      <GoalModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Deposit Dialog */}
      {contributeGoal && (
        <Dialog
          open={Boolean(contributeGoal)}
          onClose={() => setContributeGoal(null)}
          maxWidth="xs"
          fullWidth
          slotProps={{ paper: { sx: { borderRadius: '24px', p: 1 } } }}
        >
          <DialogTitle sx={{ fontWeight: 800 }}>Deposit to {contributeGoal.title}</DialogTitle>
          <DialogContent sx={{ pt: 1 }}>
            <TextField
              id="deposit-amount-input"
              label="Deposit Amount (₹)"
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                },
              }}
              fullWidth
              autoFocus
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setContributeGoal(null)} variant="outlined" sx={{ borderRadius: '14px' }}>
              Cancel
            </Button>
            <Button
              onClick={handleDepositSubmit}
              variant="contained"
              sx={{
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #2F66F6 0%, #00D1FF 100%)',
              }}
            >
              Save Deposit
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

