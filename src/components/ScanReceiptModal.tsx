import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  Alert,
  Checkbox,
  FormControlLabel,
  TextField,
  MenuItem,
  Grid,
} from '@mui/material';
import { X, Upload, Sparkles, Check, FileText, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { ReceiptExtractionResult, CategoryType, PaymentMethod } from '../types';
import { formatCurrency } from '../utils/formatters';

interface ScanReceiptModalProps {
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
  'Investment',
  'Education',
  'Travel',
  'Others',
];

const PAYMENT_METHODS: PaymentMethod[] = ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash', 'Wallet', 'Other'];

export const ScanReceiptModal: React.FC<ScanReceiptModalProps> = ({ open, onClose }) => {
  const { parseReceiptWithAI, addTransaction } = useFinanceStore();

  const [loading, setLoading] = useState(false);
  const [extracted, setExtracted] = useState<ReceiptExtractionResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Editable fields for user verification
  const [merchant, setMerchant] = useState('');
  const [total, setTotal] = useState('');
  const [tax, setTax] = useState('');
  const [category, setCategory] = useState<CategoryType>('Food & Dining');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [userConfirmedLowConfidence, setUserConfirmedLowConfidence] = useState(false);

  const handleFileUpload = (file: File) => {
    if (!file) return;
    setLoading(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setPreviewUrl(base64);

      try {
        const result = await parseReceiptWithAI(base64, file.type);
        setExtracted(result);
        setMerchant(result.merchant || '');
        setTotal(String(result.total || result.amount || 0));
        setTax(String(result.tax || result.gst || 0));
        setCategory(result.category || 'Food & Dining');
        setPaymentMethod(result.paymentMethod || 'UPI');
        setUserConfirmedLowConfidence((result.confidence || 0.95) >= 0.8);
      } catch (err) {
        console.error('Error parsing receipt:', err);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const isLowConfidence = extracted ? (extracted.confidence || 0.95) < 0.8 : false;

  const handleSave = () => {
    if (!extracted) return;

    if (isLowConfidence && !userConfirmedLowConfidence) {
      return;
    }

    addTransaction({
      amount: parseFloat(total) || extracted.total || extracted.amount,
      merchant: merchant.trim() || extracted.merchant,
      category,
      type: 'expense',
      source: 'receipt',
      payment_method: paymentMethod,
      tax: parseFloat(tax) || extracted.tax,
      items: extracted.items,
      confidence: extracted.confidence || 0.95,
      raw_text: extracted.rawText,
    });

    handleReset();
    onClose();
  };

  const handleReset = () => {
    setLoading(false);
    setExtracted(null);
    setPreviewUrl(null);
    setMerchant('');
    setTotal('');
    setTax('');
    setUserConfirmedLowConfidence(false);
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
          <FileText size={22} color="#2F66F6" />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Scan Receipt & Bill OCR
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
        {!extracted && !loading && (
          <Box
            component="label"
            sx={{
              border: '2px dashed #2F66F6',
              borderRadius: '20px',
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              bgcolor: 'rgba(47, 102, 246, 0.04)',
              textAlign: 'center',
              minHeight: 220,
              transition: 'transform 0.15s ease',
              '&:hover': { transform: 'scale(1.01)', bgcolor: 'rgba(47, 102, 246, 0.08)' },
            }}
          >
            <input
              type="file"
              accept="image/*,application/pdf"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
            />
            <Upload size={38} color="#2F66F6" />
            <Typography variant="h6" sx={{ fontWeight: 700, mt: 2, mb: 0.5 }}>
              Upload Bill or Receipt
            </Typography>
            <Typography variant="body2" color="text.secondary">
              JPG, PNG, WebP, or PDF invoices (Gemini Vision 2.5 extracts GST, total & line items)
            </Typography>
          </Box>
        )}

        {loading && (
          <Box sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={44} />
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              Scanning image with Gemini 2.5 Vision OCR...
            </Typography>
          </Box>
        )}

        {extracted && (
          <Box>
            {/* Low Confidence Alert */}
            {isLowConfidence && (
              <Alert
                severity="warning"
                icon={<ShieldAlert size={20} />}
                sx={{ mb: 2, borderRadius: '16px', fontWeight: 600 }}
              >
                AI confidence is {Math.round((extracted.confidence || 0.75) * 100)}% (below 80%). Please review and confirm the extracted values below before saving.
              </Alert>
            )}

            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: '18px',
                bgcolor: 'action.hover',
                border: '1px solid',
                borderColor: isLowConfidence ? 'warning.main' : 'divider',
                mb: 2.5,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Chip
                  icon={<Sparkles size={14} />}
                  label={`OCR Confidence: ${Math.round((extracted.confidence || 0.95) * 100)}%`}
                  color={isLowConfidence ? 'warning' : 'primary'}
                  size="small"
                  sx={{ fontWeight: 800 }}
                />
                <Chip
                  label={paymentMethod}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 700 }}
                />
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Merchant / Store Name"
                    value={merchant}
                    onChange={(e) => setMerchant(e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Total Amount (INR)"
                    type="number"
                    value={total}
                    onChange={(e) => setTotal(e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="GST / Tax (INR)"
                    type="number"
                    value={tax}
                    onChange={(e) => setTax(e.target.value)}
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
              </Grid>

              {extracted.items && extracted.items.length > 0 && (
                <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 1.5, mt: 2 }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                    LINE ITEMS EXTRACTED:
                  </Typography>
                  <List dense disablePadding>
                    {extracted.items.map((item, idx) => (
                      <ListItem key={idx} sx={{ px: 0, py: 0.25 }}>
                        <ListItemText
                          primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>{item.name}</Typography>}
                          secondary={item.qty ? `Quantity: ${item.qty}` : undefined}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {formatCurrency(item.price)}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Paper>

            {/* If confidence below 80%, require explicit checkbox confirmation */}
            {isLowConfidence && (
              <FormControlLabel
                control={
                  <Checkbox
                    id="confirm-low-confidence-receipt"
                    checked={userConfirmedLowConfidence}
                    onChange={(e) => setUserConfirmedLowConfidence(e.target.checked)}
                    color="warning"
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    I have reviewed the details and confirm they are accurate.
                  </Typography>
                }
                sx={{ mb: 1 }}
              />
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        {extracted ? (
          <>
            <Button onClick={handleReset} variant="outlined" sx={{ borderRadius: '14px' }}>
              Clear
            </Button>
            <Button
              id="confirm-save-receipt-btn"
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
              Add Expense
            </Button>
          </>
        ) : (
          <Button onClick={onClose} variant="outlined" sx={{ borderRadius: '14px' }}>
            Cancel
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
