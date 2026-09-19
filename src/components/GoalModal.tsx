import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  MenuItem,
} from '@mui/material';
import { X, Check } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';

interface GoalModalProps {
  open: boolean;
  onClose: () => void;
}

const ICONS = ['Shield', 'Laptop', 'Plane', 'Car', 'Home', 'GraduationCap', 'HeartHandshake', 'Gift'];

export const GoalModal: React.FC<GoalModalProps> = ({ open, onClose }) => {
  const { addGoal } = useFinanceStore();

  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [initialAmount, setInitialAmount] = useState('0');
  const [targetDate, setTargetDate] = useState('2026-12-31');
  const [category, setCategory] = useState<'Safety' | 'Tech' | 'Travel' | 'Retirement' | 'Real Estate' | 'Education' | 'Other'>('Safety');
  const [icon, setIcon] = useState('Shield');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedTarget = parseFloat(target);
    const parsedInitial = parseFloat(initialAmount) || 0;
    if (!title.trim() || isNaN(parsedTarget) || parsedTarget <= 0) return;

    addGoal({
      title: title.trim(),
      target: parsedTarget,
      current: parsedInitial,
      target_date: targetDate,
      category,
      icon,
    });

    setTitle('');
    setTarget('');
    setInitialAmount('0');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: '24px', p: 1 } } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Create New Savings Goal
        </Typography>
        <IconButton onClick={onClose} size="small" aria-label="Close dialog">
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 1, pb: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            id="goal-title-input"
            label="Goal Title"
            required
            placeholder="e.g. Emergency Fund, Laptop, Europe Trip"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />

          <TextField
            id="goal-target-input"
            label="Target Amount (₹)"
            type="number"
            required
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              },
            }}
            fullWidth
          />

          <TextField
            id="goal-initial-amount-input"
            label="Already Saved / Initial Amount (₹)"
            type="number"
            value={initialAmount}
            onChange={(e) => setInitialAmount(e.target.value)}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              },
            }}
            fullWidth
          />

          <TextField
            id="goal-target-date-input"
            type="date"
            label="Target Date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />

          <TextField
            id="goal-category-select"
            select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            fullWidth
          >
            <MenuItem value="Safety">Safety & Emergency</MenuItem>
            <MenuItem value="Tech">Tech & Gadgets</MenuItem>
            <MenuItem value="Travel">Travel & Vacation</MenuItem>
            <MenuItem value="RealEstate">Home & Property</MenuItem>
            <MenuItem value="Education">Education</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} variant="outlined" sx={{ borderRadius: '14px' }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!title || !target}
            startIcon={<Check size={18} />}
            sx={{
              borderRadius: '14px',
              px: 3,
              background: 'linear-gradient(135deg, #2F66F6 0%, #00D1FF 100%)',
            }}
          >
            Create Goal
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
