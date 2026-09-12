import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, CircularProgress } from '@mui/material';
import * as claimApi from '../../api/claimApi';
import { toast } from 'react-toastify';

const MyClaimsPage = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const res = await claimApi.getMyClaims(0, 50);
      const data = res?.data || res;
      const list = data?.content || (Array.isArray(data) ? data : []);
      setClaims(list);
    } catch (error) {
      console.error('Failed to fetch claims:', error);
      toast.error('Failed to load claims');
      setClaims([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleCancel = async (id) => {
    try {
      await claimApi.cancelClaim(id);
      toast.success('Claim cancelled successfully');
      fetchClaims();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to cancel claim');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'error';
      case 'RETURNED': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>My Claims</Typography>
      
      {loading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                <TableCell><strong>Item Name</strong></TableCell>
                <TableCell><strong>Claim Reason</strong></TableCell>
                <TableCell><strong>Date Claimed</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {claims.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell sx={{ fontWeight: 600 }}>{claim.foundItem?.itemName || 'Found Item'}</TableCell>
                  <TableCell>{claim.reason}</TableCell>
                  <TableCell>{claim.createdAt ? String(claim.createdAt).split('T')[0] : 'N/A'}</TableCell>
                  <TableCell>
                    <Chip label={claim.status} color={getStatusColor(claim.status)} size="small" sx={{ fontWeight: 'bold' }} />
                  </TableCell>
                  <TableCell align="right">
                    {claim.status === 'PENDING' && (
                      <Button variant="outlined" color="error" size="small" onClick={() => handleCancel(claim.id)}>
                        Cancel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {claims.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    No claims submitted yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default MyClaimsPage;
