import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import * as adminApi from '../../api/adminApi';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [statsRes, categoryRes, monthlyRes] = await Promise.all([
          adminApi.getDashboardStats().catch(() => null),
          adminApi.getCategoryStats().catch(() => null),
          adminApi.getMonthlyStats().catch(() => null),
        ]);

        const rawStats = statsRes?.data || statsRes || {};
        setStats([
          { title: 'Total Users', value: rawStats.totalUsers || 0 },
          { title: 'Lost Items', value: rawStats.totalLostItems || 0 },
          { title: 'Found Items', value: rawStats.totalFoundItems || 0 },
          { title: 'Pending Claims', value: rawStats.pendingClaims || 0 },
        ]);

        const categories = categoryRes?.data || categoryRes || [];
        setCategoryData(categories);

        const monthly = monthlyRes?.data || monthlyRes || [];
        setMonthlyData(monthly);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF19A3'];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Admin Dashboard</Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center', boxShadow: 2 }}>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>{stat.value}</Typography>
              <Typography variant="subtitle1" color="text.secondary">{stat.title}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 3, height: 400, boxShadow: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Monthly Reports</Typography>
            <ResponsiveContainer width="100%" height="90%">
              {monthlyData.length > 0 ? (
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="lost" fill="#d32f2f" name="Lost Items" />
                  <Bar dataKey="found" fill="#2e7d32" name="Found Items" />
                </BarChart>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <Typography color="text.secondary">No monthly data available</Typography>
                </Box>
              )}
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, height: 400, boxShadow: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Category Distribution</Typography>
            <ResponsiveContainer width="100%" height="90%">
              {categoryData.length > 0 ? (
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <Typography color="text.secondary">No category data available</Typography>
                </Box>
              )}
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboardPage;
