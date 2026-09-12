import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, TextField, Button, Rating } from '@mui/material';
import { toast } from 'react-toastify';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    rating: 0,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent successfully!');
    setFormData({ name: '', email: '', subject: '', message: '', rating: 0 });
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>Contact Us & Feedback</Typography>
      <Typography variant="body1" color="text.secondary" paragraph align="center">
        Have questions or feedback? We'd love to hear from you.
      </Typography>

      <Paper sx={{ p: 4, borderRadius: 3, mt: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth required label="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth required type="email" label="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth required label="Subject" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth required multiline rows={4} label="Message" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} />
            </Grid>
            <Grid item xs={12}>
              <Typography component="legend">Rate your experience</Typography>
              <Rating 
                name="rating" 
                value={formData.rating} 
                onChange={(event, newValue) => setFormData({...formData, rating: newValue})} 
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" size="large" fullWidth>
                Send Message
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default ContactPage;
