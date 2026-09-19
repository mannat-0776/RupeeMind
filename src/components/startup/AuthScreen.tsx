import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Divider,
  Alert,
  IconButton,
  InputAdornment,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Chip,
} from '@mui/material';
import { motion } from 'motion/react';
import { Mail, Lock, User, Eye, EyeOff, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { isSupabaseConfigured } from '../../lib/supabase';

// Official Google G Logo SVG
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

interface AuthScreenProps {
  onAuthenticated?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated }) => {
  const { login, signup, loginWithGoogle, loginAsDemo, forgotPassword, isLoading, error } = useAuthStore();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Forgot password modal
  const [openForgot, setOpenForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  // Privacy & Terms modal
  const [openTerms, setOpenTerms] = useState(false);
  const [termsType, setTermsType] = useState<'privacy' | 'terms'>('terms');

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    try {
      await loginWithGoogle();
      if (onAuthenticated) onAuthenticated();
    } catch (err: any) {
      setAuthError(err.message || 'Google sign-in failed. Please try again.');
    }
  };

  const handleDemoSignIn = () => {
    loginAsDemo();
    if (onAuthenticated) onAuthenticated();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (!email) {
      setAuthError('Please provide your email address.');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      setAuthError('Please enter your full name.');
      return;
    }

    if (!password || password.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }

    if (mode === 'signin') {
      const ok = await login(email, password);
      if (ok) {
        setAuthSuccess('Welcome back!');
        if (onAuthenticated) onAuthenticated();
      } else {
        setAuthError(error || 'Invalid credentials.');
      }
    } else {
      const ok = await signup(name, email, password);
      if (ok) {
        setAuthSuccess('Account created successfully!');
        if (onAuthenticated) onAuthenticated();
      } else {
        setAuthError(error || 'Failed to create account.');
      }
    }
  };

  const handleSendResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setIsForgotLoading(true);
    await forgotPassword(forgotEmail);
    setIsForgotLoading(false);
    setForgotSent(true);
  };

  return (
    <Box
      id="rupeemind-auth-screen"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 3 },
        background: 'radial-gradient(ellipse at 50% 20%, rgba(18, 56, 255, 0.15) 0%, rgba(11, 18, 32, 0) 70%), #0B1220',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: 440 }}
      >
        <Card
          sx={{
            borderRadius: '28px',
            background: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.85)' : '#FFFFFF',
            backdropFilter: 'blur(20px)',
            border: '1px solid',
            borderColor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(18, 56, 255, 0.15)',
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            {/* Header Emblem */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #1238FF 0%, #00D1FF 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(18, 56, 255, 0.5)',
                  mb: 2,
                }}
              >
                <Typography sx={{ fontSize: '2.2rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1 }}>
                  ₹
                </Typography>
              </Box>

              <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em', textAlign: 'center' }}>
                {mode === 'signin' ? 'Welcome to RupeeMind' : 'Join RupeeMind'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 0.5 }}>
                {mode === 'signin'
                  ? 'Sign in to access your AI wealth & budget insights'
                  : 'Start tracking expenses, receipts, and SIP goals'}
              </Typography>
            </Box>

            {/* Notifications */}
            {authError && (
              <Alert severity="error" sx={{ mb: 2.5, borderRadius: '14px', fontSize: '0.875rem' }}>
                {authError}
              </Alert>
            )}

            {authSuccess && (
              <Alert severity="success" sx={{ mb: 2.5, borderRadius: '14px', fontSize: '0.875rem' }}>
                {authSuccess}
              </Alert>
            )}

            {!isSupabaseConfigured && (
              <Box sx={{ mb: 2.5, p: 1.5, borderRadius: '14px', background: 'rgba(0, 209, 255, 0.08)', border: '1px solid rgba(0, 209, 255, 0.2)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ color: '#00D1FF', fontWeight: 700 }}>
                    ⚡ INSTANT PREVIEW MODE
                  </Typography>
                  <Chip label="Ready" size="small" color="primary" sx={{ height: 18, fontSize: '0.65rem' }} />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  You can click <strong>Continue with Google</strong> or <strong>Demo Login</strong> to enter instantly without entering passwords.
                </Typography>
              </Box>
            )}

            {/* Primary Action: Google OAuth Button */}
            <Button
              id="google-signin-btn"
              fullWidth
              variant="outlined"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              startIcon={<GoogleIcon />}
              sx={{
                py: 1.5,
                borderRadius: '16px',
                fontSize: '0.95rem',
                fontWeight: 700,
                textTransform: 'none',
                color: 'text.primary',
                borderColor: (theme) =>
                  theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)',
                background: (theme) =>
                  theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                '&:hover': {
                  borderColor: '#4285F4',
                  background: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(66, 133, 244, 0.1)' : 'rgba(66, 133, 244, 0.04)',
                },
              }}
            >
              Continue with Google
            </Button>

            {/* Divider */}
            <Divider sx={{ my: 3 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: '0.05em' }}>
                OR CONTINUE WITH EMAIL
              </Typography>
            </Divider>

            {/* Email Form */}
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {mode === 'signup' && (
                  <TextField
                    id="auth-name-input"
                    label="Full Name"
                    placeholder="Mannat Walia"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <User size={18} color="#94A3B8" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    fullWidth
                  />
                )}

                <TextField
                  id="auth-email-input"
                  label="Email Address"
                  type="email"
                  placeholder="mannat@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Mail size={18} color="#94A3B8" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  fullWidth
                />

                <TextField
                  id="auth-password-input"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock size={18} color="#94A3B8" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            size="small"
                            aria-label="Toggle password visibility"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                  fullWidth
                />

                {mode === 'signin' && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -0.5 }}>
                    <Link
                      component="button"
                      type="button"
                      variant="caption"
                      onClick={() => {
                        setForgotSent(false);
                        setForgotEmail(email);
                        setOpenForgot(true);
                      }}
                      sx={{
                        fontWeight: 600,
                        color: 'primary.main',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      Forgot password?
                    </Link>
                  </Box>
                )}

                <Button
                  id="auth-submit-btn"
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  sx={{
                    py: 1.4,
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
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : mode === 'signin' ? (
                    'Sign In'
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </Box>
            </form>

            {/* Mode Switcher */}
            <Box sx={{ textAlign: 'center', mt: 2.5 }}>
              <Typography variant="body2" color="text.secondary">
                {mode === 'signin' ? "Don't have an account yet?" : 'Already have an account?'}
                <Button
                  id="toggle-auth-mode-btn"
                  onClick={() => {
                    setMode(mode === 'signin' ? 'signup' : 'signin');
                    setAuthError(null);
                  }}
                  sx={{ fontWeight: 700, ml: 0.5, textTransform: 'none' }}
                >
                  {mode === 'signin' ? 'Create Account' : 'Sign In'}
                </Button>
              </Typography>
            </Box>

            {/* Quick Demo Access */}
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed', borderColor: 'divider', textAlign: 'center' }}>
              <Button
                id="quick-demo-login-btn"
                size="small"
                variant="text"
                onClick={handleDemoSignIn}
                startIcon={<Sparkles size={14} color="#00D1FF" />}
                sx={{
                  color: 'text.secondary',
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  borderRadius: '10px',
                  '&:hover': { color: 'primary.main', background: 'rgba(18, 56, 255, 0.08)' },
                }}
              >
                1-Click Quick Demo Login (Skip Auth)
              </Button>
            </Box>

            {/* Privacy & Terms Footer */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', lineHeight: 1.4 }}>
                By continuing, you agree to RupeeMind's{' '}
                <Link
                  component="button"
                  onClick={() => {
                    setTermsType('terms');
                    setOpenTerms(true);
                  }}
                  sx={{ fontSize: 'inherit', fontWeight: 600 }}
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  component="button"
                  onClick={() => {
                    setTermsType('privacy');
                    setOpenTerms(true);
                  }}
                  sx={{ fontSize: 'inherit', fontWeight: 600 }}
                >
                  Privacy Policy
                </Link>
                .
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Forgot Password Dialog */}
      <Dialog
        open={openForgot}
        onClose={() => setOpenForgot(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '24px', p: 1 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Reset Your Password</DialogTitle>
        <DialogContent>
          {forgotSent ? (
            <Box sx={{ py: 2, textAlign: 'center' }}>
              <CheckCircle2 size={48} color="#10B981" style={{ margin: '0 auto 16px' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Reset Link Sent!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We sent password reset instructions to <strong>{forgotEmail}</strong>.
              </Typography>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSendResetLink} sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Enter your account email and we'll send you a password recovery link.
              </Typography>
              <TextField
                label="Email Address"
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="mannat@example.com"
                fullWidth
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          {forgotSent ? (
            <Button fullWidth variant="contained" onClick={() => setOpenForgot(false)} sx={{ borderRadius: '12px' }}>
              Back to Sign In
            </Button>
          ) : (
            <>
              <Button onClick={() => setOpenForgot(false)} sx={{ borderRadius: '12px' }}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSendResetLink}
                disabled={isForgotLoading || !forgotEmail}
                sx={{ borderRadius: '12px' }}
              >
                {isForgotLoading ? <CircularProgress size={20} /> : 'Send Reset Link'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Terms and Privacy Modal */}
      <Dialog
        open={openTerms}
        onClose={() => setOpenTerms(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '24px', p: 1 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          {termsType === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
        </DialogTitle>
        <DialogContent dividers sx={{ maxHeight: 380 }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>RupeeMind</strong> is built with user privacy and bank-grade data security at its core.
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            1. <strong>Local & Encrypted Data Handling</strong>: All SMS parsing and OCR receipt vision analysis are performed via secure Google Gemini endpoints with zero persistent retention for AI model training.
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            2. <strong>Authentication Security</strong>: We utilize Supabase and Google OAuth for standardized token authentication and multi-factor safety.
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            3. <strong>Zero Advertising / Sale of Data</strong>: Your financial transactions, merchant names, and bank statements remain strictly private and belong entirely to you.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="contained" onClick={() => setOpenTerms(false)} sx={{ borderRadius: '12px' }}>
            Understood
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
