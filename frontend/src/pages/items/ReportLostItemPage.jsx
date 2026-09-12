import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, Grid, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import * as lostItemApi from '../../api/lostItemApi';
import api from '../../api/axiosConfig';
import { toast } from 'react-toastify';
import ImageUpload from '../../components/common/ImageUpload';

const ReportLostItemPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    brand: '',
    color: '',
    location: '',
    date: '',
    time: '',
    reward: '',
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get('/public/categories');
        const list = res?.data || res || [];
        if (Array.isArray(list) && list.length > 0) {
          setCategories(list);
        } else {
          setCategories([
            { id: 1, name: 'Electronics' },
            { id: 2, name: 'Documents' },
            { id: 3, name: 'Clothing' },
            { id: 4, name: 'Accessories' },
            { id: 5, name: 'Keys' },
            { id: 6, name: 'Books' },
            { id: 7, name: 'Bags' },
            { id: 8, name: 'Sports Equipment' },
            { id: 9, name: 'Stationery' },
            { id: 10, name: 'Other' },
          ]);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
        setCategories([
          { id: 1, name: 'Electronics' },
          { id: 2, name: 'Documents' },
          { id: 3, name: 'Clothing' },
          { id: 4, name: 'Accessories' },
          { id: 5, name: 'Keys' },
          { id: 6, name: 'Books' },
          { id: 7, name: 'Bags' },
          { id: 8, name: 'Sports Equipment' },
          { id: 9, name: 'Stationery' },
          { id: 10, name: 'Other' },
        ]);
      }
    };
    loadCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.description || !formData.location || !formData.date) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const lostItemRequest = {
        itemName: formData.title,
        categoryId: parseInt(formData.category, 10),
        description: formData.description,
        brand: formData.brand || null,
        color: formData.color || null,
        locationLost: formData.location,
        dateLost: formData.date,
        approximateTime: formData.time || null,
        rewardAmount: formData.reward ? parseFloat(formData.reward) : null,
      };

      await lostItemApi.createLostItem(lostItemRequest, image ? [image] : []);
      toast.success('Lost item reported successfully!');
      navigate('/lost-items');
    } catch (error) {
      console.error('Error creating lost item:', error);
      toast.error(error?.response?.data?.message || 'Failed to report lost item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Report a Lost Item</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField fullWidth required label="Item Name" name="title" value={formData.title} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField select fullWidth required label="Category" name="category" value={formData.category} onChange={handleChange}>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Brand (Optional)" name="brand" value={formData.brand} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Color" name="color" value={formData.color} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Reward Amount ($)" name="reward" type="number" value={formData.reward} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth required multiline rows={4} label="Description" name="description" value={formData.description} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth required label="Location Lost" name="location" value={formData.location} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth required type="date" label="Date Lost" name="date" InputLabelProps={{ shrink: true }} value={formData.date} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Upload Image (Optional)</Typography>
              <ImageUpload onUpload={(file) => setImage(file)} />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" size="large" fullWidth disabled={loading}>
                {loading ? 'Submitting...' : 'Report Lost Item'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default ReportLostItemPage;
