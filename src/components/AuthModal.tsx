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
  Box,
  Divider,
  Alert,
} from '@mui/material';
import { X, Lock, Mail, User, Chrome, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { isSupabaseConfigured } from '../lib/supabase';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ open, onClose }) => {
  const { login, signup, loginWithGoogle, isLoading, error } = useAuthStore();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);

    if (mode === 'signin') {
      const ok = await login(email, password);
      if (ok) {
        setSuccessMsg('Successfully logged in!');
        setTimeout(() => {
          onClose();
        }, 600);
      }
    } else {
      const ok = await signup(name, email, password);
      if (ok) {
        setSuccessMsg('Account created successfully!');
        setTimeout(() => {
          onClose();
        }, 600);
      }
    }
  };

  const handleGoogle = async () => {
    await loginWithGoogle();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: '24px', p: 1 } } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Sparkles size={22} color="#2F66F6" />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {mode === 'signin' ? 'Welcome Back' : 'Create RupeeMind Account'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" aria-label="Close dialog">
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1, pb: 2 }}>
        {!isSupabaseConfigured && (
          <Alert severity="info" sx={{ mb: 2, borderRadius: '12px' }}>
            Demo Mode Active: You can sign in or sign up with any email instantly.
          </Alert>
        )}

        {successMsg && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: '12px' }}>
            {successMsg}
          </Alert>
        )}

        {/* Google OAuth button */}
        <Button
          fullWidth
          variant="outlined"
          onClick={handleGoogle}
          startIcon={<Chrome size={20} color="#EA4335" />}
          sx={{
            borderRadius: '14px',
            py: 1.2,
            mb: 2,
            fontWeight: 700,
            color: 'text.primary',
            borderColor: 'divider',
          }}
        >
          Continue with Google
        </Button>

        <Divider sx={{ my: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            OR EMAIL
          </Typography>
        </Divider>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {mode === 'signup' && (
              <TextField
                label="Full Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Mannat Walia"
                fullWidth
              />
            )}

            <TextField
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mannat@example.com"
              fullWidth
            />

            <TextField
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{
                borderRadius: '14px',
                py: 1.2,
                fontWeight: 700,
                fontSize: '0.95rem',
                background: 'linear-gradient(135deg, #2F66F6 0%, #00D1FF 100%)',
              }}
            >
              {mode === 'signin' ? 'Sign In' : 'Create Free Account'}
            </Button>
          </Box>
        </form>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
            <Button
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              sx={{ fontWeight: 700, ml: 0.5, textTransform: 'none' }}
            >
              {mode === 'signin' ? 'Sign Up' : 'Sign In'}
            </Button>
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
