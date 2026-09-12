import React, { useState } from 'react';
import { Box, Container, Paper, Typography, TextField, Button, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../api/authApi';
import { toast } from 'react-toastify';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      setSubmitted(true);
      toast.success('Reset link sent to your email');
    } catch (error) {
      toast.error('Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper elevation={6} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5" fontWeight="bold" gutterBottom>
            Forgot Password
          </Typography>
          
          {submitted ? (
            <Box textAlign="center">
              <Typography color="textSecondary" sx={{ mt: 2, mb: 3 }}>
                If an account exists for {email}, a password reset link has been sent.
              </Typography>
              <Button component={Link} to="/login" fullWidth variant="outlined">
                Back to Login
              </Button>
            </Box>
          ) : (
            <>
              <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
                Enter your email address and we'll send you a link to reset your password.
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                <TextField required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mb: 3 }} />
                <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ py: 1.5, mb: 2 }}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
                <Box textAlign="center">
                  <MuiLink component={Link} to="/login" variant="body2">
                    Back to Login
                  </MuiLink>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ForgotPasswordPage;
