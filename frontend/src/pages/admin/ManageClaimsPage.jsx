import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, CircularProgress, Link, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from '@mui/material';
import * as adminApi from '../../api/adminApi';
import { toast } from 'react-toastify';
import { getImageUrl } from '../../utils/helpers';

const ManageClaimsPage = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectNotes, setRejectNotes] = useState('');
  const [selectedClaimId, setSelectedClaimId] = useState(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAllClaims(0, 100);
      const data = res?.data || res;
      const list = data?.content || (Array.isArray(data) ? data : []);
      setClaims(list);
    } catch (error) {
      console.error('Failed to load claims:', error);
      toast.error('Failed to load claims');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleApprove = async (id) => {
    try {
      await adminApi.approveClaim(id);
      toast.success('Claim approved successfully');
      fetchClaims();
    } catch (error) {
      console.error('Error approving claim:', error);
      toast.error(error?.response?.data?.message || 'Failed to approve claim');
    }
  };

  const handleRejectClick = (id) => {
    setSelectedClaimId(id);
    setRejectNotes('');
    setRejectDialogOpen(true);
  };

  const handleConfirmReject = async () => {
    try {
      await adminApi.rejectClaim(selectedClaimId, rejectNotes);
      toast.success('Claim rejected successfully');
      setRejectDialogOpen(false);
      fetchClaims();
    } catch (error) {
      console.error('Error rejecting claim:', error);
      toast.error(error?.response?.data?.message || 'Failed to reject claim');
    }
  };

  const handleMarkReturned = async (id) => {
    try {
      await adminApi.markClaimReturned(id);
      toast.success('Item marked as returned successfully');
      fetchClaims();
    } catch (error) {
      console.error('Error marking returned:', error);
      toast.error(error?.response?.data?.message || 'Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'error';
      case 'RETURNED': return 'info';
      default: return 'warning';
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Manage Claims</Typography>
      
      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                <TableCell><strong>Claimed Item</strong></TableCell>
                <TableCell><strong>Claimant Details</strong></TableCell>
                <TableCell><strong>Claim Reason & Proof</strong></TableCell>
                <TableCell><strong>Proof Image</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {claims.length > 0 ? (
                claims.map((claim) => {
                  const claimantName = claim.claimant ? `${claim.claimant.firstName} ${claim.claimant.lastName}` : 'N/A';
                  const claimantEmail = claim.claimant?.email || '';
                  const itemName = claim.foundItem?.itemName || 'Found Item';
                  
                  return (
                    <TableRow key={claim.id}>
                      <TableCell sx={{ verticalAlign: 'top' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{itemName}</Typography>
                        {claim.foundItem?.foundLocation && (
                          <Typography variant="caption" display="block" color="text.secondary">
                            Found at: {claim.foundItem.foundLocation}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'top' }}>
                        <Typography variant="body2">{claimantName}</Typography>
                        <Typography variant="caption" color="text.secondary">{claimantEmail}</Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'top', maxWidth: 300 }}>
                        <Typography variant="body2"><strong>Reason:</strong> {claim.reason}</Typography>
                        {claim.proofOfOwnership && (
                          <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                            <strong>Proof info:</strong> {claim.proofOfOwnership}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'top' }}>
                        {claim.proofImagePath ? (
                          <Link href={getImageUrl(claim.proofImagePath)} target="_blank" rel="noopener noreferrer">
                            <Box 
                              component="img" 
                              src={getImageUrl(claim.proofImagePath)} 
                              alt="Proof" 
                              sx={{ width: 60, height: 60, borderRadius: 1.5, objectFit: 'cover', border: '1px solid #ccc' }} 
                            />
                          </Link>
                        ) : (
                          <Typography variant="caption" color="text.secondary">No Image</Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'top' }}>
                        {claim.createdAt ? String(claim.createdAt).split('T')[0] : 'N/A'}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'top' }}>
                        <Chip label={claim.status} color={getStatusColor(claim.status)} size="small" sx={{ fontWeight: 'bold' }} />
                      </TableCell>
                      <TableCell align="right" sx={{ verticalAlign: 'top' }}>
                        {claim.status === 'PENDING' && (
                          <Box display="flex" justifyContent="flex-end" gap={1}>
                            <Button variant="contained" color="success" size="small" onClick={() => handleApprove(claim.id)}>
                              Approve
                            </Button>
                            <Button variant="outlined" color="error" size="small" onClick={() => handleRejectClick(claim.id)}>
                              Reject
                            </Button>
                          </Box>
                        )}
                        {claim.status === 'APPROVED' && (
                          <Button variant="contained" color="primary" size="small" onClick={() => handleMarkReturned(claim.id)}>
                            Mark Returned
                          </Button>
                        )}
                        {claim.status === 'RETURNED' && (
                          <Typography variant="caption" color="text.secondary">Item Handed Over</Typography>
                        )}
                        {claim.status === 'REJECTED' && (
                          <Typography variant="caption" color="error">Rejected</Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">No claims submitted yet.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Reject Reason Dialog */}
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)}>
        <DialogTitle>Reject Claim</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please enter notes or reasons for rejecting this claim. This will be visible to the claimant.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Rejection Notes"
            fullWidth
            multiline
            rows={3}
            value={rejectNotes}
            onChange={(e) => setRejectNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmReject} color="error" variant="contained">
            Confirm Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageClaimsPage;
