import React, { useState } from 'react';
import {
  Button,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Download, Smartphone, X, Check, Share, PlusSquare, Monitor, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}> = ({ variant = 'outlined', size = 'small', fullWidth = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  // If already running as standalone installed app, do not show button
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (!outcome) {
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      <Tooltip title="Install RupeeMind on your phone, tablet, or desktop">
        <Button
          id="pwa-install-btn"
          aria-label="Install App"
          variant={variant}
          size={size}
          fullWidth={fullWidth}
          onClick={handleClick}
          startIcon={<Download size={16} />}
          sx={{
            borderRadius: '12px',
            fontWeight: 700,
            textTransform: 'none',
            minHeight: 40,
            ...(variant === 'contained' && {
              background: 'linear-gradient(135deg, #2F66F6 0%, #00D1FF 100%)',
              color: '#FFFFFF',
              boxShadow: '0 4px 14px rgba(47, 102, 246, 0.35)',
            }),
          }}
        >
          Install App
        </Button>
      </Tooltip>

      {/* Cross-Platform Installation Guide Dialog */}
      <Dialog
        open={showGuideModal}
        onClose={() => setShowGuideModal(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: '24px',
              p: 1,
            },
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #2F66F6 0%, #00D1FF 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Smartphone size={20} color="#FFFFFF" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Install RupeeMind
            </Typography>
          </Box>
          <IconButton onClick={() => setShowGuideModal(false)} size="small" aria-label="Close dialog">
            <X size={20} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Install RupeeMind for instant offline access, receipt scanning, and bank SMS parsing directly on your home screen.
          </Typography>

          {isIOS ? (
            <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, color: '#2F66F6' }}>
                On iPhone & iPad (Safari):
              </Typography>
              <List dense disablePadding>
                <ListItem sx={{ px: 0, py: 0.75 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Share size={18} color="#2F66F6" />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>1. Tap the Share button in Safari</Typography>}
                    secondary="Located in the bottom menu bar of your screen"
                  />
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.75 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <PlusSquare size={18} color="#2F66F6" />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>2. Tap 'Add to Home Screen'</Typography>}
                    secondary="Scroll down in the share sheet and select the plus icon"
                  />
                </ListItem>
              </List>
            </Box>
          ) : (
            <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, color: '#2F66F6' }}>
                On Android, Chrome, Edge & Desktop:
              </Typography>
              <List dense disablePadding>
                <ListItem sx={{ px: 0, py: 0.75 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Download size={18} color="#2F66F6" />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>1. Click the Install Icon in address bar</Typography>}
                    secondary="Or open browser menu (⋮) and choose 'Install RupeeMind'"
                  />
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.75 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Check size={18} color="#10B981" />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>2. Confirm 'Install'</Typography>}
                    secondary="RupeeMind will launch as a standalone desktop/mobile app"
                  />
                </ListItem>
              </List>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setShowGuideModal(false)}
            variant="contained"
            fullWidth
            sx={{
              borderRadius: '14px',
              py: 1,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #2F66F6 0%, #00D1FF 100%)',
            }}
          >
            Got It
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
