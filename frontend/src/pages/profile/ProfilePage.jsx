import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, TextField, Button, Avatar } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
  });
  const [passData, setPassData] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    toast.success('Profile updated successfully');
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    toast.success('Password changed successfully');
    setPassData({ currentPassword: '', newPassword: '' });
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>My Profile</Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ width: 120, height: 120, mb: 2, fontSize: 48 }}>
            {user?.firstName?.charAt(0) || 'U'}
          </Avatar>
          <Button variant="outlined" size="small">Change Picture</Button>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, borderRadius: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>Edit Profile</Typography>
            <form onSubmit={handleProfileUpdate}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="First Name" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Last Name" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Phone Number" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Email" value={user?.email || ''} disabled />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary">Save Changes</Button>
                </Grid>
              </Grid>
            </form>
          </Paper>

          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>Change Password</Typography>
            <form onSubmit={handlePasswordUpdate}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField fullWidth type="password" label="Current Password" value={passData.currentPassword} onChange={(e) => setPassData({...passData, currentPassword: e.target.value})} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth type="password" label="New Password" value={passData.newPassword} onChange={(e) => setPassData({...passData, newPassword: e.target.value})} />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary">Change Password</Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage;
