import { createTheme, responsiveFontSizes, Theme } from '@mui/material/styles';

export const getRupeeMindTheme = (mode: 'light' | 'dark'): Theme => {
  const isLight = mode === 'light';

  let theme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#2F66F6',
        light: '#5B87F9',
        dark: '#1C4AD2',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#00D1FF',
        light: '#4CE1FF',
        dark: '#00A1C6',
        contrastText: '#0F172A',
      },
      success: {
        main: '#10B981',
        light: '#34D399',
        dark: '#059669',
      },
      error: {
        main: '#EF4444',
        light: '#F87171',
        dark: '#DC2626',
      },
      warning: {
        main: '#F59E0B',
        light: '#FBBF24',
        dark: '#D97706',
      },
      info: {
        main: '#3B82F6',
      },
      background: {
        default: isLight ? '#F4F8FF' : '#090D16',
        paper: isLight ? '#FFFFFF' : '#131A2A',
      },
      text: {
        primary: isLight ? '#0F172A' : '#F1F5F9',
        secondary: isLight ? '#64748B' : '#94A3B8',
      },
      divider: isLight ? 'rgba(203, 213, 225, 0.5)' : 'rgba(30, 41, 59, 0.7)',
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
      },
    },
    typography: {
      fontFamily: ['"Plus Jakarta Sans"', 'sans-serif'].join(','),
      h1: { fontWeight: 800, letterSpacing: '-0.025em' },
      h2: { fontWeight: 800, letterSpacing: '-0.02em' },
      h3: { fontWeight: 700, letterSpacing: '-0.02em' },
      h4: { fontWeight: 700, letterSpacing: '-0.015em' },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 600 },
      subtitle1: { fontWeight: 600 },
      subtitle2: { fontWeight: 500 },
      button: { fontWeight: 700, textTransform: 'none' },
    },
    shape: {
      borderRadius: 20,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isLight ? '#F4F8FF' : '#090D16',
            color: isLight ? '#0F172A' : '#F1F5F9',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            transition: 'background-color 0.3s ease, color 0.3s ease',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            backdropFilter: 'blur(12px)',
            backgroundColor: isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(19, 26, 42, 0.85)',
            backgroundImage: 'none',
            border: `1px solid ${isLight ? 'rgba(226, 232, 240, 0.8)' : 'rgba(30, 41, 59, 0.8)'}`,
            boxShadow: isLight
              ? '0 10px 30px -5px rgba(47, 102, 246, 0.05), 0 4px 12px 0 rgba(0, 0, 0, 0.03)'
              : '0 10px 30px -5px rgba(0, 0, 0, 0.5), 0 4px 12px 0 rgba(0, 0, 0, 0.3)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
            '&:hover': {
              boxShadow: isLight
                ? '0 15px 35px -5px rgba(47, 102, 246, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.04)'
                : '0 15px 35px -5px rgba(0, 0, 0, 0.7), 0 6px 16px 0 rgba(0, 0, 0, 0.4)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            backgroundImage: 'none',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            padding: '10px 22px',
            fontSize: '0.875rem',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(47, 102, 246, 0.25)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 14,
              backgroundColor: isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(15, 23, 42, 0.6)',
              '& fieldset': {
                borderColor: isLight ? '#E2E8F0' : '#1E293B',
              },
              '&:hover fieldset': {
                borderColor: '#2F66F6',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#2F66F6',
                borderWidth: '2px',
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            fontWeight: 600,
          },
        },
      },
    },
  });

  return responsiveFontSizes(theme);
};
