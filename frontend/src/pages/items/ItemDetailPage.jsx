import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Button, Chip, Divider, CircularProgress } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import * as lostItemApi from '../../api/lostItemApi';
import * as foundItemApi from '../../api/foundItemApi';
import { getImageUrl } from '../../utils/helpers';
import { toast } from 'react-toastify';

const ItemDetailPage = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchItemDetails = async () => {
      setLoading(true);
      try {
        let res;
        if (type === 'lost') {
          res = await lostItemApi.getLostItem(id);
        } else {
          res = await foundItemApi.getFoundItem(id);
        }
        const data = res?.data || res;
        setItem(data);
      } catch (error) {
        console.error('Error fetching item details:', error);
        toast.error('Failed to load item details');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchItemDetails();
    }
  }, [type, id]);

  const handleDelete = async () => {
    try {
      if (type === 'lost') {
        await lostItemApi.deleteLostItem(id);
      } else {
        await foundItemApi.deleteFoundItem(id);
      }
      toast.success('Item post deleted successfully');
      navigate(type === 'lost' ? '/lost-items' : '/found-items');
    } catch (error) {
      console.error('Failed to delete item:', error);
      toast.error(error?.response?.data?.message || 'Failed to delete item');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (!item) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="text.secondary">Item not found.</Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate(-1)}>Go Back</Button>
      </Box>
    );
  }

  const title = item.itemName || 'Untitled Item';
  const categoryName = typeof item.category === 'object' ? item.category?.name : item.category;
  const location = item.locationLost || item.foundLocation || item.currentStorageLocation;
  const date = item.dateLost || item.dateFound || item.createdAt;
  const reporterName = item.reportedBy ? `${item.reportedBy.firstName} ${item.reportedBy.lastName}` : 'Anonymous';
  const isOwner = user?.email && item.reportedBy?.email && user.email === item.reportedBy.email;

  const imageSource = (item.images && item.images.length > 0) ? item.images[0] : item.image;
  const imageUrl = getImageUrl(imageSource);

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={imageUrl}
              alt={title}
              sx={{ width: '100%', maxHeight: 400, borderRadius: 3, objectFit: 'cover' }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{title}</Typography>
              <Chip 
                label={item.status} 
                color={item.status === 'LOST' ? 'error' : 'success'} 
                sx={{ fontWeight: 'bold' }}
              />
            </Box>
            
            {categoryName && (
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Category: {categoryName}
              </Typography>
            )}
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="body1" paragraph>
              <strong>Description:</strong><br />
              {item.description || 'No description provided.'}
            </Typography>
            
            {location && (
              <Typography variant="body1" paragraph>
                <strong>Location:</strong> {location}
              </Typography>
            )}

            {item.currentStorageLocation && (
              <Typography variant="body1" paragraph>
                <strong>Current Storage:</strong> {item.currentStorageLocation}
              </Typography>
            )}
            
            {date && (
              <Typography variant="body1" paragraph>
                <strong>Date:</strong> {String(date).split('T')[0]}
              </Typography>
            )}

            {item.rewardAmount && (
              <Typography variant="h6" color="secondary" paragraph sx={{ fontWeight: 'bold' }}>
                Reward: ${item.rewardAmount}
              </Typography>
            )}

            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Reported by:</strong> {reporterName}
            </Typography>

            <Box sx={{ mt: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              {/* Always allow Claim button on found items or items pending verification */}
              <Button 
                variant="contained" 
                color="primary" 
                size="large" 
                fullWidth
                onClick={() => navigate(`/claim/${item.id}`)}
              >
                Claim this Item
              </Button>

              {/* Show Delete button if logged-in user is the owner */}
              {isOwner && (
                <Button
                  variant="outlined"
                  color="error"
                  size="large"
                  fullWidth
                  startIcon={<DeleteIcon />}
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Delete My Post
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <ConfirmDialog 
        open={deleteDialogOpen}
        title="Delete Post"
        message={`Are you sure you want to delete "${title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        confirmColor="error"
      />
    </Box>
  );
};

export default ItemDetailPage;
