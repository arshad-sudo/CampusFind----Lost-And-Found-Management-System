import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
  CircularProgress,
  Paper,
  Button,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { DeleteOutline as DeleteOutlineIcon, LocationOn as LocationOnIcon, CalendarToday as CalendarTodayIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import * as lostItemApi from '../../api/lostItemApi';
import * as foundItemApi from '../../api/foundItemApi';
import { getImageUrl } from '../../utils/helpers';
import { toast } from 'react-toastify';

const MyItemCard = ({ item, type, onDeleteClick }) => {
  const navigate = useNavigate();
  if (!item) return null;

  const title = item.itemName || item.title || 'Untitled Item';
  const categoryName = typeof item.category === 'object' ? item.category?.name : item.category;
  const location = item.locationLost || item.foundLocation || item.location || 'N/A';
  const date = item.dateLost || item.dateFound || item.date || item.createdAt;

  const imageSource = (item.images && item.images.length > 0) ? item.images[0] : item.image;
  const imageUrl = getImageUrl(imageSource);

  const statusColor = item.status === 'LOST' ? 'error' : 'success';

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: 2,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        }
      }}
    >
      <Box
        sx={{ cursor: 'pointer' }}
        onClick={() => navigate(`/items/${type}/${item.id}`)}
      >
        <CardMedia
          component="img"
          height="180"
          image={imageUrl}
          alt={title}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
            <Typography variant="h6" noWrap sx={{ fontWeight: 600, maxWidth: '70%' }}>
              {title}
            </Typography>
            <Chip label={item.status || 'UNKNOWN'} color={statusColor} size="small" sx={{ fontWeight: 'bold' }} />
          </Box>

          {categoryName && (
            <Chip size="small" label={categoryName} color="primary" variant="outlined" sx={{ mb: 1.5 }} />
          )}

          <Box display="flex" alignItems="center" color="text.secondary" mb={0.5}>
            <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2" noWrap>{location}</Typography>
          </Box>

          {date && (
            <Box display="flex" alignItems="center" color="text.secondary">
              <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2">{String(date).split('T')[0]}</Typography>
            </Box>
          )}
        </CardContent>
      </Box>

      <Box sx={{ px: 2, pb: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          size="small"
          startIcon={<DeleteOutlineIcon />}
          onClick={(e) => {
            e.stopPropagation();
            onDeleteClick(item);
          }}
        >
          Delete Post
        </Button>
      </Box>
    </Card>
  );
};

const MyItemsPage = () => {
  const [tab, setTab] = useState(0);
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchMyItems = async () => {
    setLoading(true);
    try {
      const [lostRes, foundRes] = await Promise.all([
        lostItemApi.getMyLostItems(0, 50).catch(() => null),
        foundItemApi.getMyFoundItems(0, 50).catch(() => null),
      ]);

      const lostData = lostRes?.data || lostRes;
      const lostContent = lostData?.content || (Array.isArray(lostData) ? lostData : []);
      setLostItems(lostContent);

      const foundData = foundRes?.data || foundRes;
      const foundContent = foundData?.content || (Array.isArray(foundData) ? foundData : []);
      setFoundItems(foundContent);
    } catch (err) {
      console.error('Failed to fetch my items:', err);
      toast.error('Failed to load your items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyItems();
  }, []);

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      if (tab === 0) {
        await lostItemApi.deleteLostItem(itemToDelete.id);
      } else {
        await foundItemApi.deleteFoundItem(itemToDelete.id);
      }
      toast.success('Item deleted successfully');
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      fetchMyItems();
    } catch (error) {
      console.error('Failed to delete item:', error);
      toast.error(error?.response?.data?.message || 'Failed to delete item');
    }
  };

  const currentItems = tab === 0 ? lostItems : foundItems;

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        My Items
      </Typography>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label={`My Lost Items (${lostItems.length})`} />
        <Tab label={`My Found Items (${foundItems.length})`} />
      </Tabs>

      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {currentItems.length > 0 ? (
            currentItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                <MyItemCard
                  item={item}
                  type={tab === 0 ? 'lost' : 'found'}
                  onDeleteClick={handleDeleteClick}
                />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
                <Typography color="text.secondary" variant="h6">
                  {tab === 0
                    ? 'You have not reported any lost items yet.'
                    : 'You have not reported any found items yet.'}
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{' '}
            <strong>"{itemToDelete?.itemName || itemToDelete?.title || 'this item'}"</strong>?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setDeleteDialogOpen(false); setItemToDelete(null); }} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyItemsPage;
