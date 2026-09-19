import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Chip,
  LinearProgress,
} from '@mui/material';
import { motion, AnimatePresence } from 'motion/react';
import {
  Receipt,
  MessageSquareCode,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  Zap,
  Target,
  FileSpreadsheet,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { useAuthStore } from '../../store/useAuthStore';

interface OnboardingProps {
  onComplete: () => void;
}

const SAMPLE_CHART_DATA = [
  { category: 'Food', amount: 8450, color: '#FF6B6B' },
  { category: 'Shopping', amount: 6200, color: '#FFB800' },
  { category: 'Transport', amount: 3100, color: '#4D96FF' },
  { category: 'Bills', amount: 5400, color: '#9B51E0' },
  { category: 'Invest', amount: 15000, color: '#10B981' },
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { completeOnboarding, user } = useAuthStore();

  const handleFinish = () => {
    completeOnboarding();
    onComplete();
  };

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Box
      id="rupeemind-onboarding-screen"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 4 },
        background: 'radial-gradient(ellipse at 50% 10%, rgba(18, 56, 255, 0.2) 0%, rgba(11, 18, 32, 0) 70%), #0B1220',
        color: '#FFFFFF',
      }}
    >
      {/* Top Header Bar with Skip */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 620,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #1238FF 0%, #00D1FF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '1rem',
            }}
          >
            ₹
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
            RupeeMind
          </Typography>
        </Box>

        <Button
          id="skip-onboarding-btn"
          variant="text"
          onClick={handleFinish}
          size="small"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '20px',
            '&:hover': { color: '#00D1FF', background: 'rgba(255, 255, 255, 0.08)' },
          }}
        >
          Skip Setup
        </Button>
      </Box>

      {/* Main Slide Card Container */}
      <Card
        sx={{
          width: '100%',
          maxWidth: 620,
          borderRadius: '32px',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(18, 56, 255, 0.2)',
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4.5 } }}>
          {/* Step Progress Pill Indicators */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
            {[0, 1, 2].map((step) => (
              <Box
                key={step}
                onClick={() => setCurrentStep(step)}
                sx={{
                  flex: 1,
                  height: 6,
                  borderRadius: '999px',
                  cursor: 'pointer',
                  background:
                    step === currentStep
                      ? 'linear-gradient(90deg, #1238FF 0%, #00D1FF 100%)'
                      : step < currentStep
                      ? '#10B981'
                      : 'rgba(255, 255, 255, 0.15)',
                  boxShadow:
                    step === currentStep
                      ? '0 0 12px rgba(0, 209, 255, 0.8)'
                      : 'none',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </Box>

          {/* Animated Slide Content */}
          <Box sx={{ minHeight: 380, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                >
                  {/* Screen 1 Visual Illustration */}
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: '24px',
                      background: 'linear-gradient(145deg, rgba(18, 56, 255, 0.15) 0%, rgba(0, 209, 255, 0.05) 100%)',
                      border: '1px solid rgba(0, 209, 255, 0.3)',
                      mb: 3.5,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Glowing Laser Scanline Animation */}
                    <motion.div
                      animate={{ y: [0, 130, 0] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'linear-gradient(90deg, transparent 0%, #00D1FF 50%, transparent 100%)',
                        boxShadow: '0 0 16px #00D1FF, 0 0 8px #1238FF',
                        zIndex: 3,
                      }}
                    />

                    {/* Receipt mockup */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Receipt size={20} color="#00D1FF" />
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#FFFFFF' }}>
                          Nature's Basket Tax Invoice
                        </Typography>
                      </Box>
                      <Chip
                        label="98% AI Confidence"
                        size="small"
                        sx={{
                          background: 'rgba(16, 185, 129, 0.2)',
                          color: '#10B981',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          border: '1px solid rgba(16, 185, 129, 0.4)',
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, borderBottom: '1px dashed rgba(255, 255, 255, 0.1)' }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          2x Almond Milk (1L)
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#FFFFFF' }}>
                          ₹840.00
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, borderBottom: '1px dashed rgba(255, 255, 255, 0.1)' }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          1x Artisanal Sourdough
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#FFFFFF' }}>
                          ₹280.00
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 0.5 }}>
                        <Typography variant="caption" sx={{ color: '#00D1FF', fontWeight: 600 }}>
                          GST (5%) Included
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#00D1FF' }}>
                          Total: ₹1,120.00
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Screen 1 Copy */}
                  <Chip
                    icon={<Sparkles size={14} color="#00D1FF" />}
                    label="NO MANUAL EXPENSE ENTRY"
                    size="small"
                    sx={{
                      mb: 1.5,
                      background: 'rgba(0, 209, 255, 0.12)',
                      color: '#00D1FF',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      letterSpacing: '0.05em',
                    }}
                  />
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                    Scan WhatsApp Receipts Instantly
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6 }}>
                    Snap a photo of supermarket invoices, restaurant bills, or forwarded WhatsApp receipts. Google Gemini 2.5 Flash Vision extracts line items, taxes, and auto-assigns categories in seconds.
                  </Typography>
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                >
                  {/* Screen 2 Visual Illustration */}
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: '24px',
                      background: 'linear-gradient(145deg, rgba(18, 56, 255, 0.15) 0%, rgba(255, 107, 107, 0.05) 100%)',
                      border: '1px solid rgba(18, 56, 255, 0.4)',
                      mb: 3.5,
                    }}
                  >
                    {/* Bank SMS Card */}
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: '16px',
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                      }}
                    >
                      <MessageSquareCode size={24} color="#4D96FF" />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="caption" sx={{ color: '#4D96FF', fontWeight: 700, display: 'block' }}>
                          HDFC BANK ALERT • CARD XX5678
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          Rs.2,450 spent at ZOMATO BANGALORE on 16-Sep. Avail Bal: Rs.48,210.
                        </Typography>
                      </Box>
                      <Chip label="₹2,450" size="small" color="error" sx={{ fontWeight: 800 }} />
                    </Box>

                    {/* Live Mini Bar Chart */}
                    <Box sx={{ height: 110, width: '100%' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={SAMPLE_CHART_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                          <XAxis dataKey="category" stroke="#94A3B8" fontSize={11} tickLine={false} />
                          <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                          <Tooltip
                            contentStyle={{ background: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                            formatter={(value: any) => [`₹${value}`, 'Spent']}
                          />
                          <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                            {SAMPLE_CHART_DATA.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </Box>

                  {/* Screen 2 Copy */}
                  <Chip
                    icon={<Zap size={14} color="#4D96FF" />}
                    label="INDIAN BANK NLP PARSER"
                    size="small"
                    sx={{
                      mb: 1.5,
                      background: 'rgba(77, 150, 255, 0.12)',
                      color: '#4D96FF',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      letterSpacing: '0.05em',
                    }}
                  />
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                    Bank SMS → AI Categorization & Live Charts
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6 }}>
                    Paste transactional SMS alerts from HDFC, SBI, ICICI, Axis, Kotak, or UPI. RupeeMind converts debit notifications into real-time visual analytics and velocity metrics.
                  </Typography>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                >
                  {/* Screen 3 Visual Illustration */}
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: '24px',
                      background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.15) 0%, rgba(18, 56, 255, 0.1) 100%)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      mb: 3.5,
                    }}
                  >
                    {/* Goal & SIP Highlights */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <Box
                        sx={{
                          flex: 1,
                          p: 1.5,
                          borderRadius: '16px',
                          background: 'rgba(0, 0, 0, 0.4)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Target size={16} color="#10B981" />
                          <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 700 }}>
                            EMERGENCY FUND
                          </Typography>
                        </Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#FFFFFF' }}>
                          ₹75,000 / ₹1,00,000
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={75}
                          sx={{
                            mt: 1,
                            height: 6,
                            borderRadius: '4px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            '& .MuiLinearProgress-bar': { background: '#10B981' },
                          }}
                        />
                      </Box>

                      <Box
                        sx={{
                          flex: 1,
                          p: 1.5,
                          borderRadius: '16px',
                          background: 'rgba(0, 0, 0, 0.4)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <TrendingUp size={16} color="#00D1FF" />
                          <Typography variant="caption" sx={{ color: '#00D1FF', fontWeight: 700 }}>
                            SIP COMPOUNDING
                          </Typography>
                        </Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#FFFFFF' }}>
                          +₹2.4 Lakhs
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                          10-Yr Projected Gain
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: '14px',
                        background: 'rgba(0, 209, 255, 0.08)',
                        border: '1px solid rgba(0, 209, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                      }}
                    >
                      <Sparkles size={18} color="#00D1FF" />
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                        "You can save ₹4,200/mo by optimizing dining out and redirecting to your index SIP."
                      </Typography>
                    </Box>
                  </Box>

                  {/* Screen 3 Copy */}
                  <Chip
                    icon={<Target size={14} color="#10B981" />}
                    label="SMART BUDGETS & WEALTH GOALS"
                    size="small"
                    sx={{
                      mb: 1.5,
                      background: 'rgba(16, 185, 129, 0.12)',
                      color: '#10B981',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      letterSpacing: '0.05em',
                    }}
                  />
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                    Smart Budgets & Savings Insights
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6 }}>
                    Track dynamic monthly budgets, set milestones for vacations or emergency reserves, and simulate compounding SIP returns tailored to your income.
                  </Typography>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>

          {/* Action Navigation Controls */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 4,
              pt: 2.5,
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <Button
              variant="text"
              onClick={handlePrev}
              disabled={currentStep === 0}
              startIcon={<ArrowLeft size={18} />}
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '12px',
                visibility: currentStep === 0 ? 'hidden' : 'visible',
                '&:hover': { color: '#FFFFFF', background: 'rgba(255, 255, 255, 0.06)' },
              }}
            >
              Back
            </Button>

            {currentStep < 2 ? (
              <Button
                id="onboarding-next-btn"
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowRight size={18} />}
                sx={{
                  px: 3.5,
                  py: 1.2,
                  borderRadius: '16px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #1238FF 0%, #00D1FF 100%)',
                  boxShadow: '0 8px 24px rgba(18, 56, 255, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0B2AC7 0%, #00B8E6 100%)',
                  },
                }}
              >
                Next
              </Button>
            ) : (
              <Button
                id="start-tracking-btn"
                variant="contained"
                onClick={handleFinish}
                startIcon={<CheckCircle size={18} />}
                sx={{
                  px: 4,
                  py: 1.4,
                  borderRadius: '16px',
                  fontWeight: 800,
                  fontSize: '1rem',
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #10B981 0%, #00D1FF 100%)',
                  boxShadow: '0 8px 24px rgba(16, 185, 129, 0.5)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #059669 0%, #00B8E6 100%)',
                  },
                }}
              >
                Start Tracking
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
