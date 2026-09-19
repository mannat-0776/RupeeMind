import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  TextField,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Paper,
  Alert,
} from '@mui/material';
import { MessageSquareCode, Sparkles, Check, ArrowRight } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { SmsParseResult } from '../types';
import { formatCurrency } from '../utils/formatters';

const SAMPLE_SMS = [
  'HDFC Bank: Rs.2,450.00 spent at ZOMATO BANGALORE on 14-Sep-26 using Card XX5678.',
  'ICICI Bank: INR 620.00 debited for UBER RIDES INDIA on 16-Sep-26.',
  'SBI Card: Rs 125,000.00 credited to a/c XX4321 on 01-Sep-2026 by NEFT-TechCorp Payroll',
  'HDFC Bank: Rs 3,850.00 paid towards BESCOM ELECTRICITY BILL on 12-Sep-26.',
];

export const BankSms: React.FC = () => {
  const { parseSmsWithAI, addTransaction } = useFinanceStore();

  const [smsInput, setSmsInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsedResult, setParsedResult] = useState<SmsParseResult | null>(null);
  const [saved, setSaved] = useState(false);

  const handleParse = async () => {
    if (!smsInput.trim()) return;
    setLoading(true);
    setSaved(false);

    try {
      const res = await parseSmsWithAI(smsInput);
      setParsedResult(res);
    } catch (err) {
      console.error('Error parsing SMS:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!parsedResult) return;

    addTransaction({
      amount: parsedResult.amount,
      merchant: parsedResult.merchant,
      category: parsedResult.category,
      type: parsedResult.type,
      source: 'sms',
      confidence: parsedResult.confidence || 0.95,
      raw_text: smsInput,
    });

    setSaved(true);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3, pb: 10 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          Bank SMS & WhatsApp Parser
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gemini NLP extracts merchant, amount, category, and bank name from raw transaction SMS alerts.
        </Typography>
      </Box>

      {saved && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: '16px' }}>
          SMS transaction saved to your active ledger!
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              Paste SMS Alert Text
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1 }}>
                CLICK TO TEST SAMPLE SMS ALERTS:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {SAMPLE_SMS.map((sample, idx) => (
                  <Chip
                    key={idx}
                    label={`Sample Alert ${idx + 1}`}
                    size="small"
                    onClick={() => setSmsInput(sample)}
                    sx={{ cursor: 'pointer', fontWeight: 600 }}
                  />
                ))}
              </Box>
            </Box>

            <TextField
              multiline
              rows={4}
              fullWidth
              value={smsInput}
              onChange={(e) => setSmsInput(e.target.value)}
              placeholder="Paste HDFC, ICICI, SBI, Paytm, or WhatsApp payment alert text..."
              sx={{ mb: 2 }}
            />

            <Button
              variant="contained"
              fullWidth
              disabled={!smsInput.trim() || loading}
              onClick={handleParse}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Sparkles size={18} />}
              sx={{
                py: 1.5,
                borderRadius: '14px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #2F66F6 0%, #00D1FF 100%)',
              }}
            >
              {loading ? 'Analyzing with Gemini NLP...' : 'Parse SMS Alert'}
            </Button>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3, height: '100%', minHeight: 300 }}>
            {parsedResult ? (
              <Box>
                <Chip
                  label={`${parsedResult.type.toUpperCase()} • ${Math.round(parsedResult.confidence * 100)}% CONFIDENCE`}
                  color={parsedResult.type === 'income' ? 'success' : 'primary'}
                  size="small"
                  sx={{ fontWeight: 800, mb: 2 }}
                />

                <Typography variant="h3" sx={{ fontWeight: 800, color: parsedResult.type === 'income' ? '#10B981' : '#EF4444', mb: 1 }}>
                  {formatCurrency(parsedResult.amount)}
                </Typography>

                <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', mb: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Merchant Name:
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
                    {parsedResult.merchant}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Category:
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
                    {parsedResult.category}
                  </Typography>

                  {parsedResult.bankName && (
                    <>
                      <Typography variant="body2" color="text.secondary">
                        Bank / Institution:
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                        {parsedResult.bankName}
                      </Typography>
                    </>
                  )}
                </Paper>

                <Button
                  variant="contained"
                  fullWidth
                  disabled={saved}
                  onClick={handleSave}
                  startIcon={<Check size={20} />}
                  sx={{
                    py: 1.5,
                    borderRadius: '14px',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #2F66F6 0%, #00D1FF 100%)',
                  }}
                >
                  {saved ? 'Saved to Expenses' : 'Confirm & Save Transaction'}
                </Button>
              </Box>
            ) : (
              <Box sx={{ py: 8, textAlign: 'center' }}>
                <MessageSquareCode size={48} color="#64748B" />
                <Typography variant="h6" sx={{ fontWeight: 700, mt: 2 }}>
                  Ready to Parse SMS
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Paste bank alert message on the left to extract structured transaction parameters.
                </Typography>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};
