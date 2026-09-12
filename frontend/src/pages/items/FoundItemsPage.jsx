import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, TextField, Button, Pagination, Select, MenuItem, FormControl, InputLabel, CircularProgress, Paper } from '@mui/material';
import * as foundItemApi from '../../api/foundItemApi';
import api from '../../api/axiosConfig';
import ItemCard from '../../components/common/ItemCard';
import { toast } from 'react-toastify';

const FoundItemsPage = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get('/public/categories');
        const list = res?.data || res || [];
        if (Array.isArray(list)) setCategories(list);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    loadCategories();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await foundItemApi.getAllFoundItems(page - 1, 12, { query: search, category });
      const pagedData = res?.data || res;
      const contentList = pagedData?.content || (Array.isArray(pagedData) ? pagedData : []);
      
      let filtered = contentList;
      if (search) {
        filtered = filtered.filter(i => (i.itemName || '').toLowerCase().includes(search.toLowerCase()) || (i.description || '').toLowerCase().includes(search.toLowerCase()));
      }
      if (category) {
        filtered = filtered.filter(i => String(i.category?.id || i.category) === String(category) || i.category?.name === category);
      }

      setItems(filtered);
      setTotalPages(pagedData?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching found items:', error);
      toast.error('Failed to fetch found items');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [page]);

  const handleFilter = () => {
    setPage(1);
    fetchItems();
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Found Items</Typography>
      
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <TextField 
            fullWidth 
            label="Search items" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
            placeholder="Search by name or description..."
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button fullWidth variant="contained" size="large" sx={{ height: '100%' }} onClick={handleFilter}>
            Filter
          </Button>
        </Grid>
      </Grid>

      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {items.length > 0 ? (
            items.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                <ItemCard item={item} type="found" />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No found items reported yet.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  If you found an item on campus, click "Report Found Item" to help find its owner!
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}
      
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination count={totalPages} page={page} onChange={(e, v) => setPage(v)} color="primary" />
        </Box>
      )}
    </Box>
  );
};

export default FoundItemsPage;
