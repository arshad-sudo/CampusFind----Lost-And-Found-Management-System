import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, CircularProgress } from '@mui/material';
import * as lostItemApi from '../../api/lostItemApi';
import * as foundItemApi from '../../api/foundItemApi';
import * as adminApi from '../../api/adminApi';
import { toast } from 'react-toastify';

const ManageItemsPage = () => {
  const [tab, setTab] = useState(0);
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    try {
      if (tab === 0) {
        const res = await lostItemApi.getAllLostItems(0, 100);
        const data = res?.data || res;
        const list = data?.content || (Array.isArray(data) ? data : []);
        setLostItems(list);
      } else {
        const res = await foundItemApi.getAllFoundItems(0, 100);
        const data = res?.data || res;
        const list = data?.content || (Array.isArray(data) ? data : []);
        setFoundItems(list);
      }
    } catch (error) {
      console.error('Failed to load items:', error);
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [tab]);

  const handleApprove = async (id) => {
    try {
      if (tab === 0) {
        await adminApi.approveLostItem(id);
      } else {
        await adminApi.approveFoundItem(id);
      }
      toast.success('Item approved successfully');
      fetchItems();
    } catch (error) {
      console.error('Error approving item:', error);
      toast.error(error?.response?.data?.message || 'Failed to approve item');
    }
  };

  const handleReject = async (id) => {
    try {
      const type = tab === 0 ? 'lost' : 'found';
      await adminApi.rejectItem(id, type);
      toast.success('Item rejected successfully');
      fetchItems();
    } catch (error) {
      console.error('Error rejecting item:', error);
      toast.error(error?.response?.data?.message || 'Failed to reject item');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item post?')) return;
    try {
      const type = tab === 0 ? 'lost' : 'found';
      await adminApi.deleteItem(id, type);
      toast.success('Item post deleted successfully');
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error(error?.response?.data?.message || 'Failed to delete item');
    }
  };

  const currentItems = tab === 0 ? lostItems : foundItems;

  const getStatusColor = (status) => {
    switch (status) {
      case 'VERIFIED':
      case 'APPROVED':
      case 'RETURNED':
        return 'success';
      case 'PENDING_VERIFICATION':
        return 'warning';
      case 'LOST':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Manage Items</Typography>
      
      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label={`Lost Items (${lostItems.length})`} />
        <Tab label={`Found Items (${foundItems.length})`} />
      </Tabs>

      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                <TableCell><strong>Title</strong></TableCell>
                <TableCell><strong>Category</strong></TableCell>
                <TableCell><strong>Location</strong></TableCell>
                <TableCell><strong>Reported By</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems.length > 0 ? (
                currentItems.map((item) => {
                  const title = item.itemName || 'Untitled Item';
                  const categoryName = typeof item.category === 'object' ? item.category?.name : item.category;
                  const location = item.locationLost || item.foundLocation || 'N/A';
                  const date = item.dateLost || item.dateFound || item.createdAt;
                  const reporter = item.reportedBy ? `${item.reportedBy.firstName} ${item.reportedBy.lastName}` : 'Anonymous';

                  return (
                    <TableRow key={item.id}>
                      <TableCell sx={{ fontWeight: 600 }}>{title}</TableCell>
                      <TableCell>{categoryName}</TableCell>
                      <TableCell>{location}</TableCell>
                      <TableCell>{reporter}</TableCell>
                      <TableCell>{date ? String(date).split('T')[0] : 'N/A'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={item.status} 
                          color={getStatusColor(item.status)} 
                          size="small" 
                          sx={{ fontWeight: 'bold' }} 
                        />
                      </TableCell>
                      <TableCell align="right">
                        {/* Show Approve/Reject for PENDING_VERIFICATION found items */}
                        {tab === 1 && item.status === 'PENDING_VERIFICATION' && (
                          <>
                            <Button 
                              variant="contained" 
                              color="success" 
                              size="small" 
                              sx={{ mr: 1 }} 
                              onClick={() => handleApprove(item.id)}
                            >
                              Approve
                            </Button>
                            <Button 
                              variant="outlined" 
                              color="warning" 
                              size="small" 
                              sx={{ mr: 1 }} 
                              onClick={() => handleReject(item.id)}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        <Button 
                          variant="outlined" 
                          color="error" 
                          size="small" 
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">No items found.</Typography>
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

export default ManageItemsPage;
