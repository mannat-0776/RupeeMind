import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  IconButton,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { AlertTriangle, Trash2, X, AlertCircle, RefreshCw, HelpCircle } from 'lucide-react';

export type ConfirmationVariant = 'danger' | 'warning' | 'primary' | 'neutral';

export interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: React.ReactNode;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmationVariant;
  isLoading?: boolean;
  /**
   * Optional custom icon to override default variant icons
   */
  icon?: React.ReactNode;
  /**
   * Additional details box (e.g. amount, category, date summary)
   */
  details?: React.ReactNode;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
  icon,
  details,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Variant color mappings
  const variantConfig = {
    danger: {
      color: '#EF4444',
      bgLight: 'rgba(239, 68, 68, 0.12)',
      border: 'rgba(239, 68, 68, 0.25)',
      gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      shadow: '0 8px 20px rgba(239, 68, 68, 0.35)',
      defaultIcon: <Trash2 size={24} color="#EF4444" />,
    },
    warning: {
      color: '#F59E0B',
      bgLight: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.25)',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      shadow: '0 8px 20px rgba(245, 158, 11, 0.35)',
      defaultIcon: <AlertTriangle size={24} color="#F59E0B" />,
    },
    primary: {
      color: '#2F66F6',
      bgLight: 'rgba(47, 102, 246, 0.12)',
      border: 'rgba(47, 102, 246, 0.25)',
      gradient: 'linear-gradient(135deg, #2F66F6 0%, #00D1FF 100%)',
      shadow: '0 8px 20px rgba(47, 102, 246, 0.35)',
      defaultIcon: <AlertCircle size={24} color="#2F66F6" />,
    },
    neutral: {
      color: '#64748B',
      bgLight: 'rgba(100, 116, 139, 0.12)',
      border: 'rgba(100, 116, 139, 0.25)',
      gradient: 'linear-gradient(135deg, #64748B 0%, #475569 100%)',
      shadow: '0 8px 20px rgba(100, 116, 139, 0.25)',
      defaultIcon: <HelpCircle size={24} color="#64748B" />,
    },
  };

  const config = variantConfig[variant];

  const handleConfirmClick = async () => {
    await onConfirm();
  };

  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
      slotProps={{
        paper: {
          sx: {
            borderRadius: '24px',
            p: { xs: 1, sm: 1.5 },
            bgcolor: isDark ? 'background.paper' : '#FFFFFF',
            backgroundImage: 'none',
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: isDark
              ? '0 20px 48px rgba(0, 0, 0, 0.6)'
              : '0 20px 48px rgba(15, 23, 42, 0.16)',
          },
        },
      }}
    >
      <DialogTitle
        id="confirmation-dialog-title"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          pb: 1,
          pt: 1.5,
          px: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '16px',
              bgcolor: config.bgLight,
              border: `1px solid ${config.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {icon || config.defaultIcon}
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              {title}
            </Typography>
            {itemName && (
              <Typography
                variant="caption"
                sx={{
                  color: config.color,
                  fontWeight: 700,
                  display: 'inline-block',
                  mt: 0.25,
                }}
              >
                {itemName}
              </Typography>
            )}
          </Box>
        </Box>

        <IconButton
          aria-label="Close dialog"
          onClick={onClose}
          disabled={isLoading}
          size="small"
          sx={{
            color: 'text.secondary',
            borderRadius: '10px',
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 2, py: 1.5 }}>
        <Typography
          id="confirmation-dialog-description"
          variant="body2"
          color="text.secondary"
          sx={{ lineHeight: 1.6 }}
        >
          {description}
        </Typography>

        {details && (
          <Box
            sx={{
              mt: 2,
              p: 1.75,
              borderRadius: '16px',
              bgcolor: isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.75)',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            {details}
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          px: 2,
          pb: 2,
          pt: 1,
          display: 'flex',
          gap: 1.5,
          justifyContent: 'flex-end',
        }}
      >
        <Button
          id="confirm-dialog-cancel-btn"
          aria-label={cancelText}
          onClick={onClose}
          disabled={isLoading}
          variant="outlined"
          autoFocus
          sx={{
            borderRadius: '14px',
            minHeight: 44,
            px: 2.5,
            fontWeight: 700,
            textTransform: 'none',
            color: 'text.primary',
            borderColor: theme.palette.divider,
            '&:hover': {
              borderColor: 'text.secondary',
              bgcolor: 'action.hover',
            },
          }}
        >
          {cancelText}
        </Button>

        <Button
          id="confirm-dialog-confirm-btn"
          aria-label={confirmText}
          onClick={handleConfirmClick}
          disabled={isLoading}
          variant="contained"
          sx={{
            borderRadius: '14px',
            minHeight: 44,
            px: 3,
            fontWeight: 800,
            textTransform: 'none',
            background: config.gradient,
            color: '#FFFFFF',
            boxShadow: config.shadow,
            '&:hover': {
              background: config.gradient,
              filter: 'brightness(0.92)',
            },
          }}
        >
          {isLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={16} color="inherit" />
              <span>Processing...</span>
            </Box>
          ) : (
            confirmText
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
