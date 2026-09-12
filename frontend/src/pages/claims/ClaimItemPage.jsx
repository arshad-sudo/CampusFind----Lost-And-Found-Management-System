import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, Grid, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import * as claimApi from '../../api/claimApi';
import * as foundItemApi from '../../api/foundItemApi';
import { toast } from 'react-toastify';
import ImageUpload from '../../components/common/ImageUpload';

const ClaimItemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    reason: '',
    proofDescription: '',
    additionalNotes: '',
  });
  const [proofImage, setProofImage] = useState(null);

  useEffect(() => {
    const loadItem = async () => {
      try {
        const res = await foundItemApi.getFoundItem(id);
        const data = res?.data || res;
        setItem(data);
      } catch (err) {
        console.error('Failed to load item info:', err);
      } finally {
        setInitialLoading(false);
      }
    };
    if (id) {
      loadItem();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.reason.trim()) {
      toast.error('Please enter the reason for claiming this item');
      return;
    }

    setLoading(true);
    try {
      const claimPayload = {
        foundItemId: parseInt(id, 10),
        reason: formData.reason,
        proofOfOwnership: formData.proofDescription || '',
        additionalDescription: formData.additionalNotes || '',
      };

      await claimApi.submitClaim(claimPayload, proofImage);
      toast.success('Claim submitted successfully!');
      navigate('/my-claims');
    } catch (error) {
      console.error('Error submitting claim:', error);
      toast.error(error?.response?.data?.message || 'Failed to submit claim. You may have already claimed this item.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Claim Item {item ? `"${item.itemName}"` : ''}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Please provide details and proof of ownership to claim this found item.
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                required 
                multiline 
                rows={3} 
                label="Why is this item yours? (Reason)" 
                name="reason" 
                placeholder="e.g. I lost my black Vega helmet yesterday at the parking lot"
                value={formData.reason} 
                onChange={handleChange} 
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                multiline 
                rows={3} 
                label="Proof of Ownership (e.g. Serial number, scratch marks, unique stickers, passwords)" 
                name="proofDescription" 
                value={formData.proofDescription} 
                onChange={handleChange} 
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                multiline 
                rows={2} 
                label="Additional Notes (Optional)" 
                name="additionalNotes" 
                value={formData.additionalNotes} 
                onChange={handleChange} 
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Upload Proof Image (Receipt, original purchase photo, etc.)</Typography>
              <ImageUpload onUpload={(file) => setProofImage(file)} />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" size="large" fullWidth disabled={loading}>
                {loading ? 'Submitting Claim...' : 'Submit Claim'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default ClaimItemPage;
