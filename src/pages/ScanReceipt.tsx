import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Alert,
} from '@mui/material';
import { Scan, Upload, Sparkles, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { ReceiptExtractionResult } from '../types';
import { formatCurrency } from '../utils/formatters';

export const ScanReceipt: React.FC = () => {
  const { parseReceiptWithAI, addTransaction } = useFinanceStore();

  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [extracted, setExtracted] = useState<ReceiptExtractionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleFile = (file: File) => {
    if (!file) return;
    setError(null);
    setSavedSuccess(false);
    setLoading(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setPreviewUrl(base64);

      try {
        const res = await parseReceiptWithAI(base64, file.type);
        setExtracted(res);
      } catch (err) {
        setError('Failed to extract receipt data using Gemini Vision.');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveTx = () => {
    if (!extracted) return;

    addTransaction({
      amount: extracted.total || extracted.amount,
      merchant: extracted.merchant,
      category: extracted.category,
      type: 'expense',
      source: 'receipt',
      tax: extracted.tax,
      items: extracted.items,
      confidence: extracted.confidence || 0.95,
      raw_text: extracted.rawText,
    });

    setSavedSuccess(true);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3, pb: 10 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          AI Receipt & Bill OCR Scanner
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Upload any paper receipt, restaurant bill, or PDF invoice to extract items, tax, and total.
        </Typography>
      </Box>

      {savedSuccess && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: '16px' }}>
          Receipt transaction added to your active expenses!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Upload Column */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ p: 2 }}>
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
                minHeight: 280,
              }}
            >
              <input
                type="file"
                accept="image/*,application/pdf"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  bgcolor: 'rgba(47, 102, 246, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <Upload size={32} color="#2F66F6" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Choose or Drag Receipt
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upload images (JPG, PNG) or digital PDF bills
              </Typography>
            </Box>

            {previewUrl && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  Uploaded Image Preview:
                </Typography>
                <Box
                  component="img"
                  src={previewUrl}
                  alt="Receipt Preview"
                  sx={{ maxHeight: 220, borderRadius: '16px', objectFit: 'contain', border: '1px solid', borderColor: 'divider' }}
                />
              </Box>
            )}
          </Card>
        </Grid>

        {/* Results Column */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ p: 3, height: '100%', minHeight: 350 }}>
            {loading ? (
              <Box sx={{ py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <CircularProgress size={48} sx={{ color: '#2F66F6' }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Gemini 2.5 Vision Processing Document...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Running optical character recognition & structured JSON categorization
                </Typography>
              </Box>
            ) : extracted ? (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Chip
                      icon={<Sparkles size={14} color="#10B981" />}
                      label={`Confidence Score: ${Math.round((extracted.confidence || 0.95) * 100)}%`}
                      color="success"
                      size="small"
                      sx={{ fontWeight: 800, mb: 1 }}
                    />
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                      {extracted.merchant}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Category: <strong>{extracted.category}</strong>
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: '#10B981' }}>
                    {formatCurrency(extracted.total || extracted.amount)}
                  </Typography>
                </Box>

                {/* Line Items */}
                {extracted.items && extracted.items.length > 0 && (
                  <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '16px', p: 2, my: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                      Parsed Line Items
                    </Typography>
                    <List dense disablePadding>
                      {extracted.items.map((item, idx) => (
                        <ListItem key={idx} sx={{ px: 0, py: 0.5, borderBottom: '1px dashed', borderColor: 'divider' }}>
                          <ListItemText primary={item.name} secondary={item.qty ? `Qty: ${item.qty}` : undefined} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            {formatCurrency(item.price)}
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                <Button
                  variant="contained"
                  fullWidth
                  disabled={savedSuccess}
                  onClick={handleSaveTx}
                  startIcon={<CheckCircle2 size={20} />}
                  sx={{
                    py: 1.5,
                    borderRadius: '14px',
                    fontWeight: 700,
                    fontSize: '1rem',
                    background: 'linear-gradient(135deg, #2F66F6 0%, #00D1FF 100%)',
                  }}
                >
                  {savedSuccess ? 'Transaction Added' : 'Confirm & Save Expense'}
                </Button>
              </Box>
            ) : (
              <Box sx={{ py: 10, textAlign: 'center' }}>
                <Scan size={48} color="#64748B" />
                <Typography variant="h6" sx={{ fontWeight: 700, mt: 2 }}>
                  No Receipt Selected
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Upload a file on the left to extract live data instantly.
                </Typography>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};
