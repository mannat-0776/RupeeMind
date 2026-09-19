import React, { useState } from 'react';
import {
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Fab,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import {
  LayoutDashboard,
  Receipt,
  Scan,
  PieChart,
  User,
  Plus,
  MessageSquareCode,
  Sparkles,
} from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAddTx: () => void;
  onOpenScanReceipt: () => void;
  onOpenParseSms: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddTx,
  onOpenScanReceipt,
  onOpenParseSms,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openSpeedDial = Boolean(anchorEl);

  if (!isMobile) return null;

  const handleFabClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        pb: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {/* Floating Center Action Button */}
      <Box sx={{ position: 'absolute', top: -28, left: '50%', transform: 'translateX(-50%)', zIndex: 1200 }}>
        <Fab
          id="mobile-center-fab"
          aria-label="Quick financial action menu"
          onClick={handleFabClick}
          sx={{
            width: 56,
            height: 56,
            background: 'linear-gradient(135deg, #2F66F6 0%, #00D1FF 100%)',
            color: '#FFFFFF',
            boxShadow: '0 8px 24px rgba(47, 102, 246, 0.45)',
            '&:hover': {
              background: 'linear-gradient(135deg, #2554D4 0%, #00BBE6 100%)',
            },
          }}
        >
          <Plus size={28} />
        </Fab>
      </Box>

      {/* Quick Actions Speed Dial Menu */}
      <Menu
        anchorEl={anchorEl}
        open={openSpeedDial}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: '20px',
              p: 1,
              mb: 2,
              minWidth: 220,
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            onOpenAddTx();
          }}
          sx={{ borderRadius: '12px', minHeight: 48 }}
        >
          <ListItemIcon sx={{ color: '#2F66F6', minWidth: 36 }}>
            <Plus size={20} />
          </ListItemIcon>
          <ListItemText primary={<Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>New Transaction</Typography>} />
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            onOpenScanReceipt();
          }}
          sx={{ borderRadius: '12px', minHeight: 48 }}
        >
          <ListItemIcon sx={{ color: '#00D1FF', minWidth: 36 }}>
            <Scan size={20} />
          </ListItemIcon>
          <ListItemText primary={<Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Scan Receipt (OCR)</Typography>} />
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            onOpenParseSms();
          }}
          sx={{ borderRadius: '12px', minHeight: 48 }}
        >
          <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
            <MessageSquareCode size={20} />
          </ListItemIcon>
          <ListItemText primary={<Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Bank SMS Sync</Typography>} />
        </MenuItem>
      </Menu>

      <Paper
        elevation={10}
        sx={{
          borderRadius: 0,
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <BottomNavigation
          value={activeTab}
          onChange={(_, newValue) => {
            if (newValue) setActiveTab(newValue);
          }}
          showLabels
          sx={{
            height: 64,
            backgroundColor: 'transparent',
            '& .MuiBottomNavigationAction-root': {
              minWidth: 'auto',
              minHeight: 48,
              py: 0.5,
              color: 'text.secondary',
              '&.Mui-selected': {
                color: '#2F66F6',
              },
            },
          }}
        >
          <BottomNavigationAction
            label="Home"
            value="dashboard"
            aria-label="Dashboard Tab"
            icon={<LayoutDashboard size={20} />}
          />
          <BottomNavigationAction
            label="Txns"
            value="transactions"
            aria-label="Transactions Tab"
            icon={<Receipt size={20} />}
          />
          <BottomNavigationAction
            label=""
            value=""
            disabled
            aria-label="Add Action Trigger"
            sx={{ cursor: 'default' }}
          />
          <BottomNavigationAction
            label="Budgets"
            value="budgets"
            aria-label="Budgets Tab"
            icon={<PieChart size={20} />}
          />
          <BottomNavigationAction
            label="Profile"
            value="profile"
            aria-label="Profile Tab"
            icon={<User size={20} />}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};
