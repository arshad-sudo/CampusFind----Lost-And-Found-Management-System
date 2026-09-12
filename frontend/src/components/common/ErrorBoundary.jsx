import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh" p={3}>
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center', maxWidth: 500, borderRadius: 3 }}>
            <Typography variant="h5" color="error" gutterBottom fontWeight="bold">
              Something went wrong
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {this.state.error?.message || 'An unexpected error occurred.'}
            </Typography>
            <Button variant="contained" color="primary" onClick={this.handleReload}>
              Reload Page
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
