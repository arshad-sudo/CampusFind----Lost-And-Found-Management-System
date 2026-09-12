import React from 'react';
import { Box, Container, Grid, Typography, Link as MuiLink, IconButton } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6, mt: 'auto', borderTop: '1px solid', borderColor: 'divider' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
              CampusFind
            </Typography>
            <Typography variant="body2" color="text.secondary">
              The premier platform for finding and reporting lost items on campus. Never lose track again.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <MuiLink component={Link} to="/search" color="text.secondary" display="block">Search Items</MuiLink>
            <MuiLink component={Link} to="/report-lost" color="text.secondary" display="block">Report Lost</MuiLink>
            <MuiLink component={Link} to="/report-found" color="text.secondary" display="block">Report Found</MuiLink>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact Info
            </Typography>
            <Typography variant="body2" color="text.secondary">Email: support@campusfind.edu</Typography>
            <Typography variant="body2" color="text.secondary">Phone: (555) 123-4567</Typography>
            <Typography variant="body2" color="text.secondary">Location: Student Union Building</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Social Media
            </Typography>
            <Box>
              <IconButton aria-label="Facebook" color="inherit"><Facebook /></IconButton>
              <IconButton aria-label="Twitter" color="inherit"><Twitter /></IconButton>
              <IconButton aria-label="Instagram" color="inherit"><Instagram /></IconButton>
              <IconButton aria-label="LinkedIn" color="inherit"><LinkedIn /></IconButton>
            </Box>
          </Grid>
        </Grid>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
          {'© '}
          {new Date().getFullYear()}
          {' CampusFind. All rights reserved.'}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
