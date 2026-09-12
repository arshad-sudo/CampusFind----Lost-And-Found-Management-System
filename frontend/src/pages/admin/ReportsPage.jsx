import React from 'react';
import { Box, Typography, Paper, Grid, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';

const ReportsPage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Reports</Typography>
      
      <Paper sx={{ p: 4, borderRadius: 3, maxWidth: 600 }}>
        <Typography variant="h6" gutterBottom>Generate Report</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Report Type</InputLabel>
              <Select defaultValue="monthly" label="Report Type">
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Format</InputLabel>
              <Select defaultValue="pdf" label="Format">
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="csv">CSV</MenuItem>
                <MenuItem value="excel">Excel</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" size="large" startIcon={<DownloadIcon />} fullWidth>
              Download Report
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ReportsPage;
