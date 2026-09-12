import { createTheme } from '@mui/material/styles';

export const createAppTheme = (mode) => {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#6366f1',
      },
      secondary: {
        main: '#ec4899',
      },
      background: {
        default: mode === 'light' ? '#f3f4f6' : '#111827',
        paper: mode === 'light' ? '#ffffff' : '#1f2937',
      },
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      button: {
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: mode === 'light' ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : '0 4px 6px -1px rgb(0 0 0 / 0.5)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
    },
  });
};
