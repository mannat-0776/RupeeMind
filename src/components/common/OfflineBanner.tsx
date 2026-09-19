import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Snackbar, Alert, Badge } from '@mui/material';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { OfflineSyncService } from '../../services/offlineSync';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [syncing, setSyncing] = useState(false);
  const [showReconnectedAlert, setShowReconnectedAlert] = useState(false);

  useEffect(() => {
    const updateCount = () => {
      setPendingCount(OfflineSyncService.getQueue().length);
    };

    updateCount();
    const interval = setInterval(updateCount, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOnline && pendingCount > 0) {
      handleSync();
      setShowReconnectedAlert(true);
    }
  }, [isOnline]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await OfflineSyncService.processQueue();
      setPendingCount(OfflineSyncService.getQueue().length);
    } catch (err) {
      console.error('Failed to sync offline items', err);
    } finally {
      setSyncing(false);
    }
  };

  if (isOnline && pendingCount === 0) {
    return (
      <Snackbar
        open={showReconnectedAlert}
        autoHideDuration={4000}
        onClose={() => setShowReconnectedAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" sx={{ borderRadius: '14px', fontWeight: 700 }}>
          Back online! All transactions synchronized seamlessly.
        </Alert>
      </Snackbar>
    );
  }

  if (!isOnline) {
    return (
      <Box
        id="offline-status-banner"
        role="alert"
        sx={{
          bgcolor: '#FEF3C7',
          color: '#92400E',
          px: 2,
          py: 0.8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
          borderBottom: '1px solid #FCD34D',
          fontSize: '0.85rem',
          fontWeight: 600,
        }}
      >
        <WifiOff size={16} color="#D97706" />
        <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
          Working Offline — Transactions & receipts will cache locally and sync automatically when reconnected.
        </Typography>
        {pendingCount > 0 && (
          <Badge badgeContent={pendingCount} color="warning" sx={{ ml: 1 }} />
        )}
      </Box>
    );
  }

  return null;
};
