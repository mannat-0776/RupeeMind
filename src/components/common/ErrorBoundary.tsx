import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { AlertTriangle, RefreshCw, ChevronDown, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box
          role="alert"
          sx={{
            p: 4,
            minHeight: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Paper
            elevation={0}
            sx={{
              maxWidth: 580,
              width: '100%',
              p: 4,
              borderRadius: '24px',
              border: '1px solid',
              borderColor: 'divider',
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '20px',
                bgcolor: 'rgba(239, 68, 68, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <AlertTriangle size={32} color="#EF4444" />
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
              Something went wrong
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              An unexpected error occurred while rendering this section. Your transaction and budget data remain safely stored.
            </Typography>

            <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', mb: 3 }}>
              <Button
                variant="outlined"
                onClick={this.handleReset}
                startIcon={<RefreshCw size={18} />}
                sx={{ borderRadius: '14px', fontWeight: 700 }}
              >
                Try Again
              </Button>
              <Button
                variant="contained"
                onClick={this.handleReload}
                startIcon={<Home size={18} />}
                sx={{
                  borderRadius: '14px',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #2F66F6 0%, #00D1FF 100%)',
                }}
              >
                Reload App
              </Button>
            </Box>

            {this.state.error && (
              <Accordion elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '14px' }}>
                <AccordionSummary expandIcon={<ChevronDown size={18} />}>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    Technical Error Details
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ textAlign: 'left', bgcolor: 'action.hover', borderRadius: '0 0 14px 14px' }}>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace', display: 'block', wordBreak: 'break-all' }}>
                    {this.state.error.toString()}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            )}
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}
