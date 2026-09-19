import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Divider,
  Paper,
} from '@mui/material';
import { motion, AnimatePresence } from 'motion/react';
import {
  Receipt,
  MessageSquareCode,
  Sparkles,
  TrendingUp,
  Target,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Play,
  Zap,
  BarChart3,
  PieChart,
  Lock,
  Wallet,
  Check,
  Flame,
  Bot,
  Smartphone,
  ChevronRight,
  Sun,
  Moon,
  RefreshCw,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { PWAInstallButton } from '../components/common/PWAInstallButton';

interface LandingPageProps {
  onGetStarted: () => void;
  onWatchDemo?: () => void;
  themeMode?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

const MINI_CHART_DATA = [
  { day: 'Mon', spend: 1200 },
  { day: 'Tue', spend: 850 },
  { day: 'Wed', spend: 2400 },
  { day: 'Thu', spend: 1400 },
  { day: 'Fri', spend: 3200 },
  { day: 'Sat', spend: 1800 },
  { day: 'Sun', spend: 950 },
];

const FEATURES = [
  {
    icon: Receipt,
    title: 'WhatsApp Receipt Scanner',
    desc: 'Forward paper receipts or tax invoices directly from WhatsApp. Gemini Vision reads itemized lists, GST amounts, and merchants instantly.',
    tag: 'OCR Vision',
    color: '#00D1FF',
  },
  {
    icon: MessageSquareCode,
    title: 'Bank SMS Parser',
    desc: 'Seamlessly parse transactional SMS alerts from HDFC, ICICI, SBI, Axis, and UPI with zero data retention and bank-grade privacy.',
    tag: 'Indian Bank NLP',
    color: '#2F66F6',
  },
  {
    icon: Bot,
    title: 'AI Auto-Categorization',
    desc: 'Multi-layer neural tagging maps ambiguous merchants (e.g., Swiggy Instamart, Zepto, CRED Club) directly to structured spending buckets.',
    tag: 'Gemini 2.5',
    color: '#10B981',
  },
  {
    icon: Target,
    title: 'Smart Budgeting',
    desc: 'Dynamic 50-30-20 rule calibration and velocity alerts warn you before you overshoot dining, shopping, or entertainment budgets.',
    tag: 'Proactive Alert',
    color: '#F59E0B',
  },
  {
    icon: Sparkles,
    title: 'AI Savings Coach',
    desc: 'Get personalized weekly recommendations on recurring subscription bloat, food delivery habit cuts, and optimal SIP compounding.',
    tag: 'Wealth Advice',
    color: '#EC4899',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    desc: 'Interactive Recharts visuals, monthly burn breakdown, net savings velocity, and tax-ready CSV/PDF export at your fingertips.',
    tag: 'Real-Time Recharts',
    color: '#8B5CF6',
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onWatchDemo,
  themeMode = 'dark',
  onToggleTheme,
}) => {
  // Interactive Demo State
  const [demoStep, setDemoStep] = useState<'receipt' | 'processing' | 'categorized' | 'dashboard'>('receipt');
  const [demoBalance, setDemoBalance] = useState(84250);
  const [demoFoodSpend, setDemoFoodSpend] = useState(4850);

  // Auto-cycle interactive demo every few seconds if user doesn't interact
  useEffect(() => {
    const timer = setInterval(() => {
      setDemoStep((prev) => {
        if (prev === 'receipt') return 'processing';
        if (prev === 'processing') return 'categorized';
        if (prev === 'categorized') return 'dashboard';
        return 'receipt';
      });
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const triggerInteractiveDemo = () => {
    setDemoStep('processing');
    setTimeout(() => {
      setDemoStep('categorized');
      setDemoBalance(83901);
      setDemoFoodSpend(5199);
      setTimeout(() => {
        setDemoStep('dashboard');
      }, 1500);
    }, 1200);
  };

  return (
    <Box
      id="rupeemind-landing-page"
      sx={{
        minHeight: '100vh',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'radial-gradient(ellipse at 50% 0%, #162447 0%, #0B1220 50%, #060911 100%)'
            : 'radial-gradient(ellipse at 50% 0%, #E0ECFF 0%, #F4F8FF 60%, #FFFFFF 100%)',
        color: 'text.primary',
        overflowX: 'hidden',
        position: 'relative',
      }}
    >
      {/* Background Soft Ambient Blobs (2D) */}
      <Box
        sx={{
          position: 'absolute',
          top: '-15%',
          left: '10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(47, 102, 246, 0.15) 0%, rgba(0, 209, 255, 0.05) 70%, transparent 100%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '30%',
          right: '5%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(0, 209, 255, 0.04) 70%, transparent 100%)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />

      {/* TOP NAVIGATION BAR */}
      <Box
        sx={{
          py: 2.5,
          px: { xs: 2, md: 6 },
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backdropFilter: 'blur(16px)',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(11, 18, 32, 0.75)'
              : 'rgba(244, 248, 255, 0.8)',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {/* Brand Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2F66F6 0%, #00D1FF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(47, 102, 246, 0.4)',
              color: '#FFFFFF',
              fontWeight: 900,
              fontSize: '1.4rem',
            }}
          >
            ₹
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              RupeeMind
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem' }}>
              AI Wealth Engine
            </Typography>
          </Box>
        </Box>

        {/* Center Links (Desktop) */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 4 }}>
          <Button
            href="#features"
            sx={{ color: 'text.secondary', fontWeight: 600, '&:hover': { color: 'primary.main' } }}
          >
            Features
          </Button>
          <Button
            href="#demo"
            sx={{ color: 'text.secondary', fontWeight: 600, '&:hover': { color: 'primary.main' } }}
          >
            Live Demo
          </Button>
          <Button
            href="#pricing"
            sx={{ color: 'text.secondary', fontWeight: 600, '&:hover': { color: 'primary.main' } }}
          >
            Pricing
          </Button>
          <Button
            href="#security"
            sx={{ color: 'text.secondary', fontWeight: 600, '&:hover': { color: 'primary.main' } }}
          >
            Security
          </Button>
        </Box>

        {/* Right CTA */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <PWAInstallButton variant="outlined" />
          </Box>

          {onToggleTheme && (
            <IconButton onClick={onToggleTheme} size="small" sx={{ p: 1 }}>
              {themeMode === 'dark' ? <Sun size={18} color="#FFB800" /> : <Moon size={18} color="#64748B" />}
            </IconButton>
          )}

          <Button
            id="landing-signin-btn"
            variant="outlined"
            onClick={onGetStarted}
            sx={{
              borderRadius: '12px',
              fontWeight: 700,
              px: 2.2,
              display: { xs: 'none', sm: 'inline-flex' },
            }}
          >
            Sign In
          </Button>

          <Button
            id="landing-hero-cta-btn"
            variant="contained"
            onClick={onGetStarted}
            endIcon={<ArrowRight size={16} />}
            sx={{
              borderRadius: '14px',
              fontWeight: 800,
              px: 2.8,
              py: 1,
              background: 'linear-gradient(135deg, #2F66F6 0%, #00D1FF 100%)',
              boxShadow: '0 6px 20px rgba(47, 102, 246, 0.35)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1C4AD2 0%, #00B8E6 100%)',
              },
            }}
          >
            Get Started
          </Button>
        </Box>
      </Box>

      {/* ========================================================
          HERO SECTION (Material Design 3 + Revolut/CRED aesthetic)
          ======================================================== */}
      <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 10 }, pb: { xs: 8, md: 12 } }}>
        <Grid container spacing={6} sx={{ alignItems: 'center' }}>
          {/* Left Column: Headline & Action Buttons */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              {/* Badge */}
              <Box sx={{ mb: 2.5 }}>
                <Chip
                  icon={<Sparkles size={14} color="#00D1FF" />}
                  label="POWERED BY GEMINI 2.5 FLASH VISION"
                  sx={{
                    px: 1.5,
                    py: 2,
                    borderRadius: '20px',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    letterSpacing: '0.04em',
                    background: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(0, 209, 255, 0.12)'
                        : 'rgba(47, 102, 246, 0.08)',
                    color: 'secondary.main',
                    border: '1px solid',
                    borderColor: 'secondary.main',
                  }}
                />
              </Box>

              {/* Headline */}
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3.4rem', md: '3.8rem' },
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.12,
                  mb: 2.5,
                }}
              >
                Your AI Personal{' '}
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(135deg, #2F66F6 20%, #00D1FF 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline',
                  }}
                >
                  Finance Assistant
                </Box>
              </Typography>

              {/* Subtitle */}
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '1.05rem', md: '1.2rem' },
                  color: 'text.secondary',
                  lineHeight: 1.65,
                  mb: 4,
                  maxWidth: 520,
                }}
              >
                Turn WhatsApp receipts and bank SMS into smart budgets. No manual expense tracking.
              </Typography>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                <Button
                  id="hero-get-started-btn"
                  variant="contained"
                  size="large"
                  onClick={onGetStarted}
                  endIcon={<ArrowRight size={18} />}
                  sx={{
                    py: 1.6,
                    px: 3.8,
                    borderRadius: '16px',
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #2F66F6 0%, #00D1FF 100%)',
                    boxShadow: '0 8px 25px rgba(47, 102, 246, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1C4AD2 0%, #00B8E6 100%)',
                    },
                  }}
                >
                  Get Started Free
                </Button>

                <Button
                  id="hero-watch-demo-btn"
                  variant="outlined"
                  size="large"
                  onClick={onWatchDemo || onGetStarted}
                  startIcon={<Play size={18} />}
                  sx={{
                    py: 1.6,
                    px: 3,
                    borderRadius: '16px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    borderWidth: '2px',
                    borderColor: 'divider',
                    color: 'text.primary',
                    '&:hover': {
                      borderWidth: '2px',
                      borderColor: 'primary.main',
                      background: 'rgba(47, 102, 246, 0.05)',
                    },
                  }}
                >
                  Watch Demo
                </Button>
              </Box>

              {/* Mini Social Proof */}
              <Box sx={{ mt: 4.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', ml: 0.5 }}>
                  {[1, 2, 3, 4].map((i) => (
                    <Box
                      key={i}
                      component="img"
                      src={`https://images.unsplash.com/photo-${
                        i === 1
                          ? '1534528741775-53994a69daeb'
                          : i === 2
                          ? '1507003211169-0a1dd7228f2d'
                          : i === 3
                          ? '1494790108377-be9c29b29330'
                          : '1500648767791-00dcc994a43e'
                      }?auto=format&fit=crop&q=80&w=80&h=80`}
                      alt="User avatar"
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        border: '2px solid',
                        borderColor: 'background.paper',
                        marginLeft: i === 1 ? 0 : '-8px',
                      }}
                    />
                  ))}
                </Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  Loved by <strong>10,000+</strong> Indian professionals & founders
                </Typography>
              </Box>
            </motion.div>
          </Grid>

          {/* Right Column: Floating Mobile UI Mockup (Premium 2D Glassmorphism) */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: 480,
                  mx: 'auto',
                  p: { xs: 2.5, sm: 3.5 },
                  borderRadius: '32px',
                  background: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'linear-gradient(145deg, rgba(19, 26, 42, 0.9) 0%, rgba(11, 18, 32, 0.95) 100%)'
                      : 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 246, 255, 0.9) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid',
                  borderColor: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(47, 102, 246, 0.15)',
                  boxShadow: (theme) =>
                    theme.palette.mode === 'dark'
                      ? '0 30px 80px rgba(0, 0, 0, 0.7), 0 0 40px rgba(47, 102, 246, 0.15)'
                      : '0 30px 80px rgba(47, 102, 246, 0.15), 0 10px 30px rgba(0, 0, 0, 0.05)',
                }}
              >
                {/* Mockup Header: Balance Card */}
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: '24px',
                    background: 'linear-gradient(135deg, #2F66F6 0%, #1238FF 60%, #00D1FF 100%)',
                    color: '#FFFFFF',
                    mb: 2.5,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="caption" sx={{ opacity: 0.85, fontWeight: 700, letterSpacing: '0.05em' }}>
                      TOTAL NET WEALTH
                    </Typography>
                    <Chip
                      label="+14.8% this mo"
                      size="small"
                      sx={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                      }}
                    />
                  </Box>

                  <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.02em', mb: 2 }}>
                    ₹3,42,850.00
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="caption" sx={{ opacity: 0.75, display: 'block' }}>
                        Monthly Inflow
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        +₹1,25,000
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" sx={{ opacity: 0.75, display: 'block' }}>
                        Expense Burn
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#FFD2D2' }}>
                        -₹48,210
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Spending Trends Mini Area Chart */}
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '20px',
                    background: (theme) =>
                      theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid',
                    borderColor: 'divider',
                    mb: 2.5,
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                      WEEKLY SPENDING VELOCITY
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 700 }}>
                      -8.4% vs last wk
                    </Typography>
                  </Box>

                  <Box sx={{ height: 85, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={MINI_CHART_DATA} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="heroSpendGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2F66F6" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#2F66F6" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="spend"
                          stroke="#2F66F6"
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#heroSpendGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </Box>

                {/* Floating AI Insight Card */}
                <motion.div
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Box
                    sx={{
                      p: 1.8,
                      borderRadius: '18px',
                      background: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(0, 209, 255, 0.08)'
                          : 'rgba(0, 209, 255, 0.1)',
                      border: '1px solid rgba(0, 209, 255, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '10px',
                        background: '#00D1FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#0F172A',
                      }}
                    >
                      <Sparkles size={18} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: 'secondary.main', display: 'block' }}>
                        GEMINI SAVINGS TIP
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.primary', fontWeight: 600 }}>
                        "You saved ₹3,200 on grocery bulk purchases this month. Move it to Nifty 50 SIP?"
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>

                {/* Budget Progress Bar */}
                <Box
                  sx={{
                    p: 1.8,
                    borderRadius: '16px',
                    background: (theme) =>
                      theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.25)' : '#FFFFFF',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                      Monthly Budget Limit (₹75,000)
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main' }}>
                      64% Utilized
                    </Typography>
                  </Box>
                  <Box sx={{ width: '100%', height: 6, borderRadius: 4, background: 'rgba(47, 102, 246, 0.15)', overflow: 'hidden' }}>
                    <Box sx={{ width: '64%', height: '100%', background: 'linear-gradient(90deg, #2F66F6, #00D1FF)', borderRadius: 4 }} />
                  </Box>
                </Box>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* ========================================================
          TRUST SECTION (Animated Counters & Credibility Metrics)
          ======================================================== */}
      <Box
        id="security"
        sx={{
          py: 5,
          background: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
            {[
              { label: 'Receipts Parsed', value: '100K+', icon: Receipt, color: '#00D1FF' },
              { label: 'AI Accuracy', value: '98%', icon: Zap, color: '#10B981' },
              { label: 'Bank-Level Security', value: '256-bit', icon: ShieldCheck, color: '#2F66F6' },
              { label: 'AI Powered', value: 'Gemini 2.5', icon: Bot, color: '#EC4899' },
            ].map((stat, i) => (
              <Grid size={{ xs: 6, md: 3 }} key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: '14px',
                        background: `${stat.color}18`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 1.5,
                      }}
                    >
                      <stat.icon size={22} color={stat.color} />
                    </Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 900,
                        letterSpacing: '-0.02em',
                        color: 'text.primary',
                        mb: 0.2,
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ========================================================
          INTERACTIVE DEMO SECTION (WhatsApp Receipt → ₹349 → Food)
          ======================================================== */}
      <Container id="demo" maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: 'center', mb: 6, maxWidth: 680, mx: 'auto' }}>
          <Chip
            icon={<Sparkles size={14} color="#2F66F6" />}
            label="EXPERIENCE THE MAGIC"
            sx={{
              mb: 1.5,
              fontWeight: 800,
              fontSize: '0.75rem',
              letterSpacing: '0.05em',
              background: 'rgba(47, 102, 246, 0.1)',
              color: 'primary.main',
            }}
          />
          <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.02em', mb: 2 }}>
            See How RupeeMind Automates Your Finances
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Watch a raw WhatsApp invoice get parsed into line items, categorized under <strong>Food & Dining</strong>, and reflected in real-time budget balances.
          </Typography>
        </Box>

        {/* Demo Stage Container */}
        <Card
          sx={{
            maxWidth: 920,
            mx: 'auto',
            borderRadius: '28px',
            p: { xs: 2.5, md: 4 },
            background: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.85)' : '#FFFFFF',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Grid container spacing={4} sx={{ alignItems: 'center' }}>
            {/* Left: Interactive WhatsApp Receipt */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: '20px',
                  background: (theme) =>
                    theme.palette.mode === 'dark' ? '#075E5422' : '#E8F5E9',
                  border: '1px solid',
                  borderColor: (theme) =>
                    theme.palette.mode === 'dark' ? '#128C7E66' : '#A5D6A7',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: '#25D366',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                    }}
                  >
                    <Receipt size={16} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      Blue Tokai Coffee Roasters
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      WhatsApp Tax Invoice • 12:42 PM
                    </Typography>
                  </Box>
                </Box>

                {/* Receipt Line Items */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">1x Sea Salt Mocha (Cold)</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>₹290.00</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">1x Butter Croissant</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>₹140.00</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary' }}>
                    <Typography variant="caption">Discount Promo (WELCOME20)</Typography>
                    <Typography variant="caption">-₹81.00</Typography>
                  </Box>
                  <Divider sx={{ my: 0.5 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Total Paid</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main' }}>₹349.00</Typography>
                  </Box>
                </Box>

                {/* Interactive Scan Button */}
                <Button
                  id="interactive-parse-demo-btn"
                  fullWidth
                  variant="contained"
                  onClick={triggerInteractiveDemo}
                  startIcon={<Sparkles size={16} />}
                  sx={{
                    borderRadius: '12px',
                    py: 1.2,
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #10B981 0%, #00D1FF 100%)',
                  }}
                >
                  {demoStep === 'processing' ? 'Gemini AI Extracting...' : 'Click to Parse with Gemini'}
                </Button>
              </Box>
            </Grid>

            {/* Right: Real-time Live Transformation & Dashboard Impact */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Stage 1: Transformation Card */}
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '16px',
                    background: (theme) =>
                      theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(244, 248, 255, 0.9)',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 1 }}>
                    1. NEURAL CATEGORIZATION PIPELINE
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Chip label="₹349.00" color="primary" sx={{ fontWeight: 900, fontSize: '0.9rem' }} />
                    <ArrowRight size={18} color="#2F66F6" />
                    <Chip
                      icon={<Check size={14} />}
                      label="Food & Dining (Swiggy/Dineout)"
                      sx={{
                        background: 'rgba(239, 68, 68, 0.15)',
                        color: '#EF4444',
                        fontWeight: 800,
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                      }}
                    />
                  </Box>
                </Box>

                {/* Stage 2: Updated Account Balance */}
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '16px',
                    background: (theme) =>
                      theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(244, 248, 255, 0.9)',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                    2. REAL-TIME ACCOUNT BALANCE SYNC
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Available Balance:
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
                      ₹{demoBalance.toLocaleString('en-IN')}
                    </Typography>
                  </Box>
                </Box>

                {/* Stage 3: Dynamic Category Budget Progress */}
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '16px',
                    background: (theme) =>
                      theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(244, 248, 255, 0.9)',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                      Food & Dining Budget: ₹{demoFoodSpend.toLocaleString('en-IN')} / ₹12,000
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#EF4444' }}>
                      {Math.round((demoFoodSpend / 12000) * 100)}%
                    </Typography>
                  </Box>
                  <Box sx={{ width: '100%', height: 6, borderRadius: 4, background: 'rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
                    <Box
                      sx={{
                        width: `${(demoFoodSpend / 12000) * 100}%`,
                        height: '100%',
                        background: '#EF4444',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Container>

      {/* ========================================================
          FEATURES GRID SECTION (6 Cards with Hover Animations)
          ======================================================== */}
      <Container id="features" maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: 'center', mb: 7, maxWidth: 640, mx: 'auto' }}>
          <Chip
            label="MODERN FINTECH ARCHITECTURE"
            sx={{
              mb: 1.5,
              fontWeight: 800,
              fontSize: '0.75rem',
              letterSpacing: '0.05em',
              background: 'rgba(0, 209, 255, 0.1)',
              color: 'secondary.main',
            }}
          />
          <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.02em', mb: 1.5 }}>
            Everything You Need to Master Your Money
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Built specifically for India's digital economy — UPI payments, credit card statements, and GST tax receipts.
          </Typography>
        </Box>

        <Grid container spacing={3.5}>
          {FEATURES.map((feat, idx) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={idx}>
              <motion.div
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: '24px',
                    p: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: '1px solid',
                    borderColor: 'divider',
                    background: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(19, 26, 42, 0.7)'
                        : 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(16px)',
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '16px',
                          background: `${feat.color}1A`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <feat.icon size={24} color={feat.color} />
                      </Box>
                      <Chip
                        label={feat.tag}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          background: `${feat.color}15`,
                          color: feat.color,
                          border: `1px solid ${feat.color}33`,
                        }}
                      />
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.01em' }}>
                      {feat.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {feat.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ========================================================
          PRICING SECTION (Free vs Pro Cards)
          ======================================================== */}
      <Container id="pricing" maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: 'center', mb: 7, maxWidth: 640, mx: 'auto' }}>
          <Chip
            label="TRANSPARENT PRICING"
            sx={{
              mb: 1.5,
              fontWeight: 800,
              fontSize: '0.75rem',
              letterSpacing: '0.05em',
              background: 'rgba(16, 185, 129, 0.1)',
              color: 'success.main',
            }}
          />
          <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.02em', mb: 1.5 }}>
            Simple, Transparent Pricing
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Get started for free or unlock unlimited Gemini OCR vision and autonomous wealth coaching.
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ justifyContent: 'center', alignItems: 'stretch' }}>
          {/* Free Tier Card */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Card
              sx={{
                height: '100%',
                borderRadius: '28px',
                p: { xs: 3, md: 4 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid',
                borderColor: 'divider',
                background: (theme) =>
                  theme.palette.mode === 'dark' ? 'rgba(19, 26, 42, 0.6)' : '#FFFFFF',
              }}
            >
              <Box>
                <Chip label="STARTER" size="small" sx={{ fontWeight: 800, mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
                  Free Forever
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Perfect for individuals tracking daily UPI transactions and basic monthly budgets.
                </Typography>

                <Divider sx={{ my: 2.5 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {[
                    '50 WhatsApp Receipts / month',
                    'Indian Bank SMS NLP Parser',
                    'Interactive Charts & Velocity Metrics',
                    'Basic 50-30-20 Budget Planner',
                    'Offline & Supabase Cloud Sync',
                  ].map((item, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                      <CheckCircle2 size={18} color="#10B981" />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {item}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Button
                id="pricing-free-plan-btn"
                fullWidth
                variant="outlined"
                onClick={onGetStarted}
                sx={{ mt: 4, py: 1.4, borderRadius: '14px', fontWeight: 800 }}
              >
                Get Started Free
              </Button>
            </Card>
          </Grid>

          {/* Pro Tier Card (Highlighted) */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Card
              sx={{
                height: '100%',
                borderRadius: '28px',
                p: { xs: 3, md: 4 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                border: '2px solid',
                borderColor: 'primary.main',
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(145deg, rgba(47, 102, 246, 0.15) 0%, rgba(19, 26, 42, 0.95) 100%)'
                    : 'linear-gradient(145deg, rgba(235, 243, 255, 0.95) 0%, #FFFFFF 100%)',
                boxShadow: '0 20px 50px rgba(47, 102, 246, 0.25)',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  background: 'linear-gradient(135deg, #2F66F6 0%, #00D1FF 100%)',
                  color: '#FFFFFF',
                  borderRadius: '20px',
                  px: 1.5,
                  py: 0.5,
                  fontSize: '0.75rem',
                  fontWeight: 800,
                }}
              >
                MOST POPULAR
              </Box>

              <Box>
                <Chip label="PRO WEALTH" color="primary" size="small" sx={{ fontWeight: 800, mb: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
                  <Typography variant="h3" sx={{ fontWeight: 900 }}>
                    ₹299
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600 }}>
                    / month
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  For serious wealth builders looking for autonomous SIP coaching and tax insights.
                </Typography>

                <Divider sx={{ my: 2.5 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {[
                    'Unlimited WhatsApp & Invoice OCR',
                    'Gemini 2.5 Flash Autonomous Savings Coach',
                    'Multi-Bank & Credit Card Aggregation',
                    'Custom Goal SIP & Compound Simulators',
                    'Automated Tax Deduction Categorization',
                    'Priority 24/7 Concierge Support',
                  ].map((item, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                      <CheckCircle2 size={18} color="#2F66F6" />
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {item}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Button
                id="pricing-pro-plan-btn"
                fullWidth
                variant="contained"
                onClick={onGetStarted}
                sx={{
                  mt: 4,
                  py: 1.5,
                  borderRadius: '14px',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #2F66F6 0%, #00D1FF 100%)',
                  boxShadow: '0 8px 25px rgba(47, 102, 246, 0.4)',
                }}
              >
                Upgrade to Pro (30-Day Free Trial)
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* ========================================================
          FOOTER & CTA (Start Saving Smarter Today)
          ======================================================== */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          background: (theme) =>
            theme.palette.mode === 'dark' ? '#070B13' : '#E8EEF9',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          {/* Main Footer Banner */}
          <Box
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: '32px',
              background: 'linear-gradient(135deg, #2F66F6 0%, #1238FF 60%, #00D1FF 100%)',
              color: '#FFFFFF',
              textAlign: 'center',
              mb: 8,
              boxShadow: '0 25px 60px rgba(47, 102, 246, 0.4)',
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 1.5, letterSpacing: '-0.02em' }}>
              Start Saving Smarter Today
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 540, mx: 'auto', mb: 4, fontSize: '1.05rem' }}>
              Join thousands of Indian professionals turning everyday expenses into compounding wealth with RupeeMind.
            </Typography>
            <Button
              id="footer-start-saving-btn"
              variant="contained"
              size="large"
              onClick={onGetStarted}
              endIcon={<ArrowRight size={18} />}
              sx={{
                background: '#FFFFFF',
                color: '#2F66F6',
                fontWeight: 900,
                fontSize: '1rem',
                borderRadius: '16px',
                py: 1.6,
                px: 4,
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                '&:hover': {
                  background: '#F1F5F9',
                },
              }}
            >
              Get Started with RupeeMind
            </Button>
          </Box>

          {/* Footer Bottom Links & Copyright */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #2F66F6 0%, #00D1FF 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '1rem',
                  color: '#FFFFFF',
                }}
              >
                ₹
              </Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                RupeeMind • AI-Powered Finance
              </Typography>
            </Box>

            <Typography variant="caption" color="text.secondary">
              © {new Date().getFullYear()} RupeeMind Inc. Bank-Grade 256-Bit Security • Google Gemini Vision.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
