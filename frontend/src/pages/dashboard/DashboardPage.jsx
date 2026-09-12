import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Card, Avatar, CircularProgress, Button } from '@mui/material';
import { Search as SearchIcon, AddCircleOutline as AddIcon, CheckCircleOutline as CheckIcon, WarningAmber as WarningIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useThemeContext } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import * as lostItemApi from '../../api/lostItemApi';
import * as foundItemApi from '../../api/foundItemApi';
import * as claimApi from '../../api/claimApi';

const DashboardPage = () => {
  const { mode } = useThemeContext();
  const { user } = useAuth();

  const [counts, setCounts] = useState({
    lostCount: 0,
    foundCount: 0,
    claimCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardCounts = async () => {
      setLoading(true);
      try {
        const [lostRes, foundRes, claimRes] = await Promise.all([
          lostItemApi.getAllLostItems(0, 1).catch(() => null),
          foundItemApi.getAllFoundItems(0, 1).catch(() => null),
          claimApi.getMyClaims(0, 1).catch(() => null),
        ]);

        const lostTotal = lostRes?.data?.totalElements ?? lostRes?.totalElements ?? 0;
        const foundTotal = foundRes?.data?.totalElements ?? foundRes?.totalElements ?? 0;
        const claimTotal = claimRes?.data?.totalElements ?? claimRes?.totalElements ?? 0;

        setCounts({
          lostCount: lostTotal,
          foundCount: foundTotal,
          claimCount: claimTotal,
        });
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardCounts();
  }, []);

  const totalItems = counts.lostCount + counts.foundCount;

  const stats = [
    { title: 'Total Items Listed', value: totalItems, icon: <SearchIcon />, color: '#1976d2' },
    { title: 'Lost Items', value: counts.lostCount, icon: <WarningIcon />, color: '#d32f2f' },
    { title: 'Found Items', value: counts.foundCount, icon: <CheckIcon />, color: '#2e7d32' },
    { title: 'My Claims', value: counts.claimCount, icon: <AddIcon />, color: '#ed6c02' },
  ];

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Welcome back, {user?.firstName || 'User'}!
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Overview of campus lost & found activity.
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                p: 3, 
                background: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                borderRadius: 4,
              }}>
                <Avatar sx={{ bgcolor: stat.color, mr: 2, width: 56, height: 56 }}>
                  {stat.icon}
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{stat.value}</Typography>
                  <Typography variant="body2" color="text.secondary">{stat.title}</Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Quick Actions</Typography>
        <Paper sx={{ 
          p: 4, 
          background: mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#ffffff',
          borderRadius: 4,
        }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button fullWidth variant="contained" color="error" size="large" component={Link} to="/report-lost" sx={{ py: 1.5, borderRadius: 3 }}>
                Report Lost Item
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button fullWidth variant="contained" color="success" size="large" component={Link} to="/report-found" sx={{ py: 1.5, borderRadius: 3 }}>
                Report Found Item
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button fullWidth variant="outlined" color="primary" size="large" component={Link} to="/lost-items" sx={{ py: 1.5, borderRadius: 3 }}>
                Browse Lost Items
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button fullWidth variant="outlined" color="primary" size="large" component={Link} to="/found-items" sx={{ py: 1.5, borderRadius: 3 }}>
                Browse Found Items
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default DashboardPage;
