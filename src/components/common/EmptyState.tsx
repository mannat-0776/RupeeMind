import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Sparkles, LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  id?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Sparkles,
  title,
  description,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  id = 'empty-state-card',
}) => {
  return (
    <Paper
      id={id}
      elevation={0}
      sx={{
        p: 6,
        textAlign: 'center',
        borderRadius: '24px',
        bgcolor: 'action.hover',
        border: '1px dashed',
        borderColor: 'divider',
        my: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '20px',
          bgcolor: 'rgba(47, 102, 246, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
          color: '#2F66F6',
        }}
      >
        <Icon size={32} />
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 460, mb: actionText || secondaryActionText ? 3 : 0 }}>
        {description}
      </Typography>
      {(actionText || secondaryActionText) && (
        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
          {actionText && onAction && (
            <Button
              variant="contained"
              onClick={onAction}
              sx={{
                borderRadius: '14px',
                px: 3,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #2F66F6 0%, #00D1FF 100%)',
              }}
            >
              {actionText}
            </Button>
          )}
          {secondaryActionText && onSecondaryAction && (
            <Button
              variant="outlined"
              onClick={onSecondaryAction}
              sx={{
                borderRadius: '14px',
                px: 2.5,
                fontWeight: 700,
              }}
            >
              {secondaryActionText}
            </Button>
          )}
        </Box>
      )}
    </Paper>
  );
};
