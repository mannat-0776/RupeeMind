import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Avatar,
  Container,
  Chip,
  Tooltip,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Wallet,
  LayoutDashboard,
  Receipt,
  MessageSquareCode,
  PieChart,
  Lightbulb,
  Target,
  User,
  Sun,
  Moon,
  Plus,
  Scan,
  Menu,
  X,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { useAuthStore } from '../store/useAuthStore';
import { PWAInstallButton } from './common/PWAInstallButton';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAddTx: () => void;
  onOpenScanReceipt: () => void;
  onOpenParseSms: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddTx,
  onOpenScanReceipt,
  onOpenParseSms,
  onOpenAuth,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { themeMode, toggleThemeMode } = useFinanceStore();
  const { user, isAuthenticated } = useAuthStore();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'receipts', label: 'Scan Receipt', icon: Scan },
    { id: 'sms', label: 'Bank SMS', icon: MessageSquareCode },
    { id: 'budgets', label: 'Budgets', icon: PieChart },
    { id: 'savings', label: 'Savings AI', icon: Lightbulb },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'profile', label: 'Profile & Settings', icon: User },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileDrawerOpen(false);
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(9, 13, 22, 0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.primary,
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 60, md: 70 }, justifyContent: 'space-between', px: { xs: 1, sm: 2 } }}>
            {/* Left Section: Mobile Drawer Toggle & Brand Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
              {isMobile && (
                <IconButton
                  id="mobile-drawer-toggle-btn"
                  aria-label="Open navigation menu"
                  onClick={() => setMobileDrawerOpen(true)}
                  sx={{
                    width: 48,
                    height: 48,
                    color: 'text.primary',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '12px',
                  }}
                >
                  <Menu size={22} />
                </IconButton>
              )}

              {/* Brand Name */}
              <Box
                id="navbar-brand-logo"
                onClick={() => handleNavClick('dashboard')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.25,
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <Box
                  sx={{
                    width: { xs: 36, sm: 42 },
                    height: { xs: 36, sm: 42 },
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #2F66F6 0%, #00D1FF 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 6px 16px rgba(47, 102, 246, 0.3)',
                    flexShrink: 0,
                  }}
                >
                  <Wallet size={isMobile ? 20 : 24} color="#FFFFFF" />
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #2F66F6 0%, #00D1FF 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      lineHeight: 1.1,
                      fontSize: { xs: '1.1rem', sm: '1.25rem' },
                    }}
                  >
                    RupeeMind
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      fontWeight: 600,
                      display: { xs: 'none', sm: 'block' },
                      lineHeight: 1,
                    }}
                  >
                    AI Personal Finance
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Desktop Navigation Links */}
            {!isMobile && (
              <Box
                sx={{
                  display: 'flex',
                  gap: 0.5,
                  backgroundColor: theme.palette.mode === 'light' ? 'rgba(241, 245, 249, 0.7)' : 'rgba(30, 41, 59, 0.4)',
                  p: 0.5,
                  borderRadius: '16px',
                }}
              >
                {navItems.slice(0, 7).map((item) => {
                  const IconComponent = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <Button
                      key={item.id}
                      id={`nav-link-${item.id}`}
                      aria-label={`Navigate to ${item.label}`}
                      onClick={() => setActiveTab(item.id)}
                      startIcon={<IconComponent size={18} />}
                      sx={{
                        borderRadius: '12px',
                        px: { md: 1.5, lg: 2 },
                        py: 1,
                        fontSize: '0.85rem',
                        fontWeight: isActive ? 700 : 600,
                        color: isActive ? '#FFFFFF' : 'text.secondary',
                        backgroundColor: isActive ? '#2F66F6' : 'transparent',
                        boxShadow: isActive ? '0 4px 14px rgba(47, 102, 246, 0.35)' : 'none',
                        '&:hover': {
                          backgroundColor: isActive
                            ? '#2F66F6'
                            : theme.palette.mode === 'light'
                            ? 'rgba(226, 232, 240, 0.6)'
                            : 'rgba(51, 65, 85, 0.5)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </Box>
            )}

            {/* Action Buttons & Profile Controls */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.75, sm: 1 } }}>
              {/* PWA Install Button (Desktop & Tablet) */}
              {!isMobile && <PWAInstallButton variant="outlined" />}

              {/* Quick Actions (Desktop only) */}
              {!isMobile && (
                <>
                  <Button
                    id="nav-scan-receipt-btn"
                    aria-label="Scan Receipt"
                    variant="outlined"
                    size="small"
                    onClick={onOpenScanReceipt}
                    startIcon={<Scan size={16} />}
                    sx={{
                      borderRadius: '12px',
                      borderColor: 'rgba(47, 102, 246, 0.4)',
                      color: 'primary.main',
                      fontWeight: 700,
                      textTransform: 'none',
                    }}
                  >
                    Scan
                  </Button>
                  <Button
                    id="nav-add-tx-btn"
                    aria-label="Add Transaction"
                    variant="contained"
                    size="small"
                    onClick={onOpenAddTx}
                    startIcon={<Plus size={16} />}
                    sx={{
                      borderRadius: '12px',
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #2F66F6 0%, #00D1FF 100%)',
                    }}
                  >
                    Add Tx
                  </Button>
                </>
              )}

              {/* Dark/Light Mode Toggle */}
              <Tooltip title={`Switch to ${themeMode === 'light' ? 'Dark' : 'Light'} Mode`}>
                <IconButton
                  id="theme-toggle-btn"
                  aria-label={`Switch to ${themeMode === 'light' ? 'Dark' : 'Light'} Mode`}
                  onClick={toggleThemeMode}
                  sx={{
                    width: 48,
                    height: 48,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: '12px',
                  }}
                >
                  {themeMode === 'light' ? <Moon size={20} color="#64748B" /> : <Sun size={20} color="#FBBF24" />}
                </IconButton>
              </Tooltip>

              {/* Profile Avatar / Auth Trigger */}
              <Tooltip title={isAuthenticated ? user?.name || 'User Profile' : 'Sign In'}>
                <IconButton
                  id="user-profile-btn"
                  aria-label={isAuthenticated ? user?.name || 'User Profile' : 'Sign In'}
                  onClick={() => {
                    if (isAuthenticated) {
                      setActiveTab('profile');
                    } else {
                      onOpenAuth();
                    }
                  }}
                  sx={{
                    width: 48,
                    height: 48,
                    p: 0.5,
                    border: `2px solid ${activeTab === 'profile' ? '#2F66F6' : 'transparent'}`,
                    borderRadius: '50%',
                  }}
                >
                  <Avatar
                    src={user?.avatar}
                    alt={user?.name || 'User'}
                    sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '0.9rem', fontWeight: 700 }}
                  >
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'M'}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 300,
              maxWidth: '85vw',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              bgcolor: 'background.paper',
            },
          },
        }}
      >
        <Box>
          {/* Header of Drawer */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #2F66F6 0%, #00D1FF 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Wallet size={20} color="#FFFFFF" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                RupeeMind
              </Typography>
            </Box>
            <IconButton
              aria-label="Close navigation drawer"
              onClick={() => setMobileDrawerOpen(false)}
              sx={{ width: 44, height: 44 }}
            >
              <X size={20} />
            </IconButton>
          </Box>

          {/* User Quick Info */}
          <Box
            sx={{
              p: 1.5,
              mb: 2,
              borderRadius: '14px',
              bgcolor: 'action.hover',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Avatar src={user?.avatar} sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'M'}
            </Avatar>
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }} noWrap>
                {user?.name || 'Mannat Sharma'}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                {user?.email || 'mannat@example.com'}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Navigation Link Items */}
          <List dense disablePadding>
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              return (
                <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    aria-label={`Open ${item.label}`}
                    onClick={() => handleNavClick(item.id)}
                    sx={{
                      borderRadius: '12px',
                      minHeight: 48,
                      bgcolor: isActive ? 'rgba(47, 102, 246, 0.12)' : 'transparent',
                      color: isActive ? '#2F66F6' : 'text.primary',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40, color: isActive ? '#2F66F6' : 'inherit' }}>
                      <IconComponent size={20} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography sx={{ fontWeight: isActive ? 800 : 600, fontSize: '0.95rem' }}>
                          {item.label}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>

        {/* Bottom Section: Quick Actions & PWA Install in Drawer */}
        <Box sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1.5 }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<Plus size={18} />}
              onClick={() => {
                setMobileDrawerOpen(false);
                onOpenAddTx();
              }}
              sx={{
                minHeight: 48,
                borderRadius: '14px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #2F66F6 0%, #00D1FF 100%)',
              }}
            >
              Add Transaction
            </Button>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Scan size={18} />}
              onClick={() => {
                setMobileDrawerOpen(false);
                onOpenScanReceipt();
              }}
              sx={{
                minHeight: 48,
                borderRadius: '14px',
                fontWeight: 700,
              }}
            >
              Scan Receipt OCR
            </Button>
          </Box>

          <PWAInstallButton variant="outlined" fullWidth size="medium" />
        </Box>
      </Drawer>
    </>
  );
};
