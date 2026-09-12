import React, { useState } from 'react';
import { Box, Container, Paper, Typography, TextField, Button } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../../api/authApi';
import { toast } from 'react-toastify';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!token) {
      toast.error('Invalid token');
      return;
    }
    setLoading(true);
    try {
      await resetPassword({ token, password });
      toast.success('Password reset successful. Please login.');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper elevation={6} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
        <Typography component="h1" variant="h5" fontWeight="bold" align="center" gutterBottom>
          Reset Password
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
          <TextField required fullWidth name="password" label="New Password" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} sx={{ mb: 2 }} />
          <TextField required fullWidth name="confirmPassword" label="Confirm New Password" type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} sx={{ mb: 3 }} />
          <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ py: 1.5 }}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ResetPasswordPage;
