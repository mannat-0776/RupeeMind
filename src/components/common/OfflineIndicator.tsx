import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { WifiOff, AlertCircle } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <Box
      id="offline-status-banner"
      sx={{
        position: 'fixed',
        bottom: { xs: 76, md: 24 },
        left: { xs: 16, sm: 24 },
        right: { xs: 16, sm: 'auto' },
        zIndex: 1300,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1,
        borderRadius: '16px',
        bgcolor: '#F59E0B',
        color: '#FFFFFF',
        boxShadow: '0 8px 24px rgba(245, 158, 11, 0.4)',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }}
    >
      <WifiOff size={18} color="#FFFFFF" />
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.2, color: '#FFFFFF' }}>
          Offline Mode Active
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600 }}>
          Transactions cached locally & will sync when reconnected.
        </Typography>
      </Box>
    </Box>
  );
};
