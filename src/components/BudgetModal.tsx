import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { X, Check } from 'lucide-react';
import { CategoryType } from '../types';
import { useFinanceStore } from '../store/useFinanceStore';

interface BudgetModalProps {
  open: boolean;
  onClose: () => void;
  defaultCategory?: CategoryType;
  defaultLimit?: number;
}

const CATEGORIES: CategoryType[] = [
  'Food & Dining',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Healthcare',
  'Investment',
  'Others',
];

export const BudgetModal: React.FC<BudgetModalProps> = ({
  open,
  onClose,
  defaultCategory = 'Food & Dining',
  defaultLimit = 15000,
}) => {
  const { updateBudgetLimit } = useFinanceStore();

  const [category, setCategory] = useState<CategoryType>(defaultCategory);
  const [limit, setLimit] = useState<string>(defaultLimit.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedLimit = parseFloat(limit);
    if (isNaN(parsedLimit) || parsedLimit <= 0) return;

    updateBudgetLimit(category, parsedLimit);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: '24px', p: 1 } } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Set Category Budget Limit
        </Typography>
        <IconButton onClick={onClose} size="small" aria-label="Close dialog">
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 1, pb: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            id="budget-category-select"
            select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value as CategoryType)}
            fullWidth
          >
            {CATEGORIES.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            id="budget-limit-input"
            label="Monthly Limit (₹)"
            type="number"
            required
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              },
            }}
            fullWidth
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} variant="outlined" sx={{ borderRadius: '14px' }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!limit}
            startIcon={<Check size={18} />}
            sx={{
              borderRadius: '14px',
              px: 3,
              background: 'linear-gradient(135deg, #2F66F6 0%, #00D1FF 100%)',
            }}
          >
            Save Budget
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
