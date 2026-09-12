import React from 'react';
import { Box, Typography, Button, Container, Grid, Paper, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import { Search, AddCircleOutline, CheckCircleOutline, NotificationsActive, Lock, ImageSearch } from '@mui/icons-material';

const LandingPage = () => {
  return (
    <Box sx={{ overflowX: 'hidden' }}>
      {/* Hero Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
        color: 'white', py: { xs: 10, md: 20 }, textAlign: 'center', position: 'relative'
      }}>
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
          <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom sx={{ animation: 'slideDown 1s ease' }}>
            Never Lose Track Again
          </Typography>
          <Typography variant="h5" sx={{ mb: 6, opacity: 0.9, animation: 'fadeIn 2s ease' }}>
            The smartest way to recover your lost items on campus. Join our community to make lost and found simple.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="contained" color="secondary" size="large" component={Link} to="/report-lost" sx={{ borderRadius: 8, px: 4, py: 1.5 }}>
              Report Lost Item
            </Button>
            <Button variant="outlined" size="large" component={Link} to="/report-found" sx={{ borderRadius: 8, px: 4, py: 1.5, color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white', background: 'rgba(255,255,255,0.1)' } }}>
              Report Found Item
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ mt: -5, position: 'relative', zIndex: 3, mb: 10 }}>
        <Grid container spacing={3}>
          {[
            { label: 'Items Recovered', value: '1,200+' },
            { label: 'Active Users', value: '5,000+' },
            { label: 'Items Listed', value: '800+' },
            { label: 'Success Rate', value: '92%' }
          ].map((stat, idx) => (
            <Grid item xs={6} md={3} key={idx}>
              <Paper elevation={4} sx={{ p: 3, textAlign: 'center', borderRadius: 4, animation: `slideUp ${0.5 + idx * 0.2}s ease` }}>
                <Typography variant="h4" color="primary" fontWeight="bold">{stat.value}</Typography>
                <Typography variant="body2" color="textSecondary">{stat.label}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works */}
      <Box sx={{ py: 10, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" fontWeight="bold" gutterBottom>How It Works</Typography>
          <Typography variant="h6" align="center" color="textSecondary" sx={{ mb: 8 }}>Three simple steps to connect lost items with their owners</Typography>
          <Grid container spacing={4}>
            {[
              { title: 'Report', desc: 'Easily list a lost or found item with details and images.', icon: <AddCircleOutline fontSize="large" color="primary" /> },
              { title: 'Search', desc: 'Browse through categories or search with smart filters.', icon: <Search fontSize="large" color="primary" /> },
              { title: 'Claim', desc: 'Verify ownership and arrange a secure return.', icon: <CheckCircleOutline fontSize="large" color="primary" /> }
            ].map((step, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Card elevation={0} sx={{ height: '100%', textAlign: 'center', p: 4, bgcolor: 'transparent' }}>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ p: 2, borderRadius: '50%', bgcolor: 'primary.light', display: 'inline-flex' }}>{step.icon}</Box>
                  </Box>
                  <Typography variant="h5" gutterBottom fontWeight="bold">{step.title}</Typography>
                  <Typography color="textSecondary">{step.desc}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" fontWeight="bold" gutterBottom>Platform Features</Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {[
              { title: 'Real-time Updates', desc: 'Get instantly notified when a matching item is found.', icon: <NotificationsActive /> },
              { title: 'Secure Claims', desc: 'Rigorous verification process to prevent false claims.', icon: <Lock /> },
              { title: 'Image Upload', desc: 'Upload multiple images for better item identification.', icon: <ImageSearch /> },
              { title: 'Smart Search', desc: 'Advanced filtering by category, date, and location.', icon: <Search /> }
            ].map((feature, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Card sx={{ p: 2, height: '100%', textAlign: 'center', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
                  <CardContent>
                    <Box sx={{ color: 'secondary.main', mb: 2 }}>{feature.icon}</Box>
                    <Typography variant="h6" gutterBottom>{feature.title}</Typography>
                    <Typography variant="body2" color="textSecondary">{feature.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
