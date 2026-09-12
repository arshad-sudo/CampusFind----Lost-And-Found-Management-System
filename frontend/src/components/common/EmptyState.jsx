import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { SearchOff } from '@mui/icons-material';

const EmptyState = ({ title = 'No data found', description, actionText, onAction, icon }) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={8} textAlign="center">
      {icon || <SearchOff sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />}
      <Typography variant="h5" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      {description && (
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
          {description}
        </Typography>
      )}
      {actionText && onAction && (
        <Button variant="contained" color="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
