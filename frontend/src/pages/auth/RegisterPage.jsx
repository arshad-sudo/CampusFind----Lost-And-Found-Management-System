import React, { useState } from 'react';
import { Box, Grid, Paper, Typography, TextField, Button, Link as MuiLink, IconButton, InputAdornment, LinearProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { getPasswordStrength } from '../../utils/validators';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phoneNumber: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register(formData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(formData.password);
  const strengthColor = strength === 'weak' ? 'error' : strength === 'medium' ? 'warning' : 'success';

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square sx={{ display: 'flex', alignItems: 'center', mx: 'auto' }}>
        <Box sx={{ my: 4, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <Typography component="h1" variant="h4" fontWeight="bold" color="primary" gutterBottom>
            Create an Account
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
            Join CampusFind to start reporting and finding items
          </Typography>
          
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField required fullWidth id="firstName" label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField required fullWidth id="lastName" label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField required fullWidth id="email" label="Email Address" name="email" value={formData.email} onChange={handleChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth id="phoneNumber" label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required fullWidth name="password" label="Password" type={showPassword ? 'text' : 'password'} id="password"
                  value={formData.password} onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                {formData.password && (
                  <Box sx={{ mt: 1 }}>
                    <LinearProgress variant="determinate" value={strength === 'weak' ? 33 : strength === 'medium' ? 66 : 100} color={strengthColor} />
                    <Typography variant="caption" color={`${strengthColor}.main`}>Password strength: {strength}</Typography>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField required fullWidth name="confirmPassword" label="Confirm Password" type={showPassword ? 'text' : 'password'} id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
              </Grid>
            </Grid>
            
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, py: 1.5 }} disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
            
            <Grid container justifyContent="center">
              <Grid item>
                <Typography variant="body2" color="textSecondary">
                  Already have an account?{' '}
                  <MuiLink component={Link} to="/login" variant="body2" fontWeight="bold">
                    Log In
                  </MuiLink>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default RegisterPage;
