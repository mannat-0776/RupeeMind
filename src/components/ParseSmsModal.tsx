import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Alert,
  Chip,
  Paper,
  Grid,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { X, MessageSquareCode, Sparkles, Check, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { SmsParseResult, CategoryType, TransactionType, PaymentMethod } from '../types';
import { formatCurrency } from '../utils/formatters';

interface ParseSmsModalProps {
  open: boolean;
  onClose: () => void;
}

const SAMPLE_BANK_SMS = [
  { bank: 'HDFC', text: 'HDFC Bank: Rs.2,450.00 spent at ZOMATO BANGALORE on 14-Sep-26 using Debit Card XX5678. Avail Bal: Rs 84,200.' },
  { bank: 'SBI', text: 'SBI Card: Rs 125,000.00 credited to account XX4321 on 01-Sep-2026 by NEFT-TechCorp Payroll. Avl Bal: INR 1,84,500.' },
  { bank: 'ICICI', text: 'ICICI Bank: INR 620.00 debited for UBER RIDES INDIA on 16-Sep-26. Avail balance: Rs 42,100.' },
  { bank: 'Axis', text: 'Axis Bank: Rs 1,499.00 spent on your Credit Card XX9012 at PVR CINEMAS BANGALORE on 15-Sep-26.' },
  { bank: 'Kotak', text: 'Kotak Bank: INR 850.00 paid to SWIGGY BANGALORE via UPI ref 498210398. Avl Bal: Rs 19,400.' },
  { bank: 'PNB', text: 'PNB: Rs 3,850.00 debited from A/c XX7890 towards BESCOM ELECTRICITY BILL on 12-Sep-26.' },
  { bank: 'Paytm', text: 'Paytm: Paid Rs 349.00 to BLUE TOKAI COFFEE ROASTERS using Paytm Wallet.' },
  { bank: 'PhonePe', text: 'PhonePe: Money transferred! Rs 1,200.00 sent to Apollo Pharmacy via UPI ID apollo@icici.' },
  { bank: 'GPay', text: 'Google Pay: You paid Rs 4,800.00 to Amazon India for Order #408-98123-11 via UPI.' },
  { bank: 'UPI', text: 'UPI Alert: Rs 15,000.00 transferred to ZERODHA BROKING LTD for Auto-SIP mutual fund.' },
];

const CATEGORIES: CategoryType[] = [
  'Food & Dining',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Healthcare',
  'Salary',
  'Investment',
  'Education',
  'Travel',
  'Others',
];

export const ParseSmsModal: React.FC<ParseSmsModalProps> = ({ open, onClose }) => {
  const { parseSmsWithAI, addTransaction } = useFinanceStore();

  const [smsText, setSmsText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SmsParseResult | null>(null);

  // Editable fields
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<CategoryType>('Food & Dining');
  const [type, setType] = useState<TransactionType>('expense');
  const [userConfirmedLowConfidence, setUserConfirmedLowConfidence] = useState(false);

  const handleParse = async () => {
    if (!smsText.trim()) return;
    setLoading(true);
    try {
      const parsed = await parseSmsWithAI(smsText);
      setResult(parsed);
      setMerchant(parsed.merchant || '');
      setAmount(String(parsed.amount || 0));
      setCategory(parsed.category || 'Food & Dining');
      setType(parsed.type || 'expense');
      setUserConfirmedLowConfidence((parsed.confidence || 0.9) >= 0.8);
    } catch (err) {
      console.error('Error parsing SMS:', err);
    } finally {
      setLoading(false);
    }
  };

  const isLowConfidence = result ? (result.confidence || 0.9) < 0.8 : false;

  const handleSave = () => {
    if (!result) return;
    if (isLowConfidence && !userConfirmedLowConfidence) return;

    addTransaction({
      amount: parseFloat(amount) || result.amount,
      merchant: merchant.trim() || result.merchant,
      category,
      type,
      source: 'sms',
      payment_method: result.paymentMethod || 'UPI',
      account_last4: result.last4,
      bank_name: result.bankName,
      confidence: result.confidence || 0.95,
      raw_text: smsText,
    });

    handleReset();
    onClose();
  };

  const handleReset = () => {
    setSmsText('');
    setResult(null);
    setMerchant('');
    setAmount('');
    setUserConfirmedLowConfidence(false);
    setLoading(false);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: '24px', p: 1 } } }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MessageSquareCode size={22} color="#00D1FF" />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Parse Bank SMS / UPI Alert
          </Typography>
        </Box>
        <IconButton
          onClick={() => {
            handleReset();
            onClose();
          }}
          size="small"
          aria-label="Close dialog"
        >
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1, pb: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Supports all Indian banks & apps: HDFC, SBI, ICICI, Axis, Kotak, PNB, UPI, Paytm, PhonePe, and GPay.
        </Typography>

        {/* Quick Bank Presets */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 1 }}>
            SAMPLE BANK ALERTS (CLICK TO TEST):
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
            {SAMPLE_BANK_SMS.map((sample, idx) => (
              <Chip
                key={idx}
                label={sample.bank}
                size="small"
                onClick={() => {
                  setSmsText(sample.text);
                  setResult(null);
                }}
                sx={{
                  cursor: 'pointer',
                  fontWeight: 700,
                  bgcolor: smsText === sample.text ? 'primary.main' : 'action.hover',
                  color: smsText === sample.text ? '#FFF' : 'text.primary',
                  '&:hover': { bgcolor: 'primary.light', color: '#FFF' },
                }}
              />
            ))}
          </Box>
        </Box>

        <TextField
          multiline
          rows={3}
          fullWidth
          value={smsText}
          onChange={(e) => setSmsText(e.target.value)}
          placeholder="Paste SMS here (e.g., HDFC Bank: Rs 2,450.00 spent at ZOMATO...)"
          sx={{ mb: 2 }}
        />

        {loading && (
          <Box sx={{ py: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={28} />
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              Gemini NLP Analyzing SMS Pattern...
            </Typography>
          </Box>
        )}

        {result && (
          <Box>
            {isLowConfidence && (
              <Alert
                severity="warning"
                icon={<ShieldAlert size={20} />}
                sx={{ mb: 2, borderRadius: '16px', fontWeight: 600 }}
              >
                AI confidence is {Math.round(result.confidence * 100)}% (below 80%). Please review the parsed fields below before confirming.
              </Alert>
            )}

            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: '16px',
                bgcolor: type === 'income' ? 'rgba(16, 185, 129, 0.08)' : 'action.hover',
                border: '1px solid',
                borderColor: isLowConfidence ? 'warning.main' : type === 'income' ? '#10B981' : 'divider',
                mb: 2,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Chip
                  label={`${type.toUpperCase()} • ${Math.round(result.confidence * 100)}% CONFIDENCE`}
                  size="small"
                  color={type === 'income' ? 'success' : isLowConfidence ? 'warning' : 'primary'}
                  sx={{ fontWeight: 800 }}
                />
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                  {result.bankName || 'Bank'} {result.last4 ? `(XX${result.last4})` : ''}
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Merchant / Receiver"
                    value={merchant}
                    onChange={(e) => setMerchant(e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Amount (INR)"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    select
                    label="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryType)}
                    fullWidth
                    size="small"
                  >
                    {CATEGORIES.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    select
                    label="Type"
                    value={type}
                    onChange={(e) => setType(e.target.value as TransactionType)}
                    fullWidth
                    size="small"
                  >
                    <MenuItem value="expense">Expense (Debit)</MenuItem>
                    <MenuItem value="income">Income (Credit)</MenuItem>
                  </TextField>
                </Grid>
              </Grid>

              {result.availableBalance && (
                <Box sx={{ mt: 1.5, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="caption" color="text.secondary">
                    Remaining Available Balance: <strong>{formatCurrency(result.availableBalance)}</strong>
                  </Typography>
                </Box>
              )}
            </Paper>

            {isLowConfidence && (
              <FormControlLabel
                control={
                  <Checkbox
                    id="confirm-low-confidence-sms"
                    checked={userConfirmedLowConfidence}
                    onChange={(e) => setUserConfirmedLowConfidence(e.target.checked)}
                    color="warning"
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    I have verified these transaction details.
                  </Typography>
                }
                sx={{ mb: 1 }}
              />
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        {result ? (
          <>
            <Button onClick={handleReset} variant="outlined" sx={{ borderRadius: '14px' }}>
              Clear
            </Button>
            <Button
              id="confirm-save-sms-btn"
              onClick={handleSave}
              variant="contained"
              disabled={isLowConfidence && !userConfirmedLowConfidence}
              startIcon={<Check size={18} />}
              sx={{
                borderRadius: '14px',
                px: 3,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #2F66F6 0%, #00D1FF 100%)',
                '&:active': { transform: 'scale(0.98)' },
              }}
            >
              Add Transaction
            </Button>
          </>
        ) : (
          <Button
            id="extract-sms-btn"
            onClick={handleParse}
            variant="contained"
            disabled={!smsText.trim() || loading}
            startIcon={<Sparkles size={18} />}
            sx={{
              borderRadius: '14px',
              px: 3,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #2F66F6 0%, #00D1FF 100%)',
              '&:active': { transform: 'scale(0.98)' },
            }}
          >
            Extract Transaction
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
