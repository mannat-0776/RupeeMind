import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { X, Check, DollarSign } from 'lucide-react';
import { CategoryType, TransactionType, TransactionSource } from '../types';
import { useFinanceStore } from '../store/useFinanceStore';

interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
}

const CATEGORIES: CategoryType[] = [
  'Food & Dining',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Healthcare',
  'Salary',
  'Investment',
  'Others',
];

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ open, onClose }) => {
  const { addTransaction } = useFinanceStore();

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<string>('');
  const [merchant, setMerchant] = useState<string>('');
  const [category, setCategory] = useState<CategoryType>('Food & Dining');
  const [notes, setNotes] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;
    if (!merchant.trim()) return;

    addTransaction({
      amount: parsedAmount,
      merchant: merchant.trim(),
      category,
      type,
      source: 'manual',
      confidence: 1.0,
      notes: notes.trim(),
      created_at: new Date(date).toISOString(),
    });

    // Reset
    setAmount('');
    setMerchant('');
    setNotes('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: '24px', p: 1 } } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Add Transaction
        </Typography>
        <IconButton onClick={onClose} size="small" aria-label="Close dialog">
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 1, pb: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Income vs Expense Switch */}
          <ToggleButtonGroup
            value={type}
            exclusive
            onChange={(e, val) => val && setType(val)}
            fullWidth
            aria-label="Transaction type"
            sx={{
              '& .MuiToggleButton-root': {
                borderRadius: '14px',
                py: 1,
                fontWeight: 700,
                textTransform: 'none',
              },
            }}
          >
            <ToggleButton value="expense" color="error">
              Expense
            </ToggleButton>
            <ToggleButton value="income" color="success">
              Income
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Amount Field */}
          <TextField
            id="tx-amount-input"
            label="Amount (₹)"
            type="number"
            required
            autoFocus
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              },
            }}
            fullWidth
          />

          {/* Merchant / Store */}
          <TextField
            id="tx-merchant-input"
            label="Merchant / Payer Name"
            required
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            placeholder="e.g. Zomato, Starbucks, Salary"
            fullWidth
          />

          {/* Category Dropdown */}
          <TextField
            id="tx-category-select"
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

          {/* Date Picker */}
          <TextField
            id="tx-date-input"
            type="date"
            label="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />

          {/* Optional Notes */}
          <TextField
            id="tx-notes-input"
            label="Notes (Optional)"
            multiline
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any extra detail..."
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
            disabled={!amount || !merchant}
            startIcon={<Check size={18} />}
            sx={{
              borderRadius: '14px',
              px: 3,
              background: 'linear-gradient(135deg, #2F66F6 0%, #00D1FF 100%)',
            }}
          >
            Save Transaction
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
