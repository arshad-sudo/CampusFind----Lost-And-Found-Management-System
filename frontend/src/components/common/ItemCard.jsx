import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Chip } from '@mui/material';
import { LocationOn, CalendarToday } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import StatusChip from './StatusChip';
import { getImageUrl } from '../../utils/helpers';

const ItemCard = ({ item, type }) => {
  const navigate = useNavigate();
  if (!item) return null;

  const title = item.itemName || item.title || 'Untitled Item';
  const categoryName = typeof item.category === 'object' ? item.category?.name : item.category;
  const location = item.locationLost || item.foundLocation || item.location || 'N/A';
  const date = item.dateLost || item.dateFound || item.date || item.createdAt;
  const reward = item.rewardAmount || item.reward;
  const itemType = type || (item.status === 'FOUND' || item.foundLocation ? 'found' : 'lost');
  
  const imageSource = (item.images && item.images.length > 0) ? item.images[0] : item.image;
  const imageUrl = getImageUrl(imageSource);

  return (
    <Card 
      onClick={() => navigate(`/items/${itemType}/${item.id}`)}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        cursor: 'pointer',
        borderRadius: 3,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        }
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={imageUrl}
        alt={title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography variant="h6" component="div" noWrap sx={{ fontWeight: 600, maxWidth: '70%' }}>
            {title}
          </Typography>
          <StatusChip status={item.status} />
        </Box>
        
        {categoryName && (
          <Chip size="small" label={categoryName} color="primary" variant="outlined" sx={{ mb: 2 }} />
        )}
        
        <Box display="flex" alignItems="center" color="text.secondary" mb={1}>
          <LocationOn fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="body2" noWrap>{location}</Typography>
        </Box>
        
        {date && (
          <Box display="flex" alignItems="center" color="text.secondary">
            <CalendarToday fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2">{String(date).split('T')[0]}</Typography>
          </Box>
        )}
        
        {reward && (
          <Typography variant="subtitle2" color="secondary" sx={{ mt: 2, fontWeight: 'bold' }}>
            Reward: ${reward}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default ItemCard;
