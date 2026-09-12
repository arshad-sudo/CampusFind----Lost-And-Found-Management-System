import React from 'react';
import { Chip } from '@mui/material';

const StatusChip = ({ status, ...props }) => {
  let color = 'default';
  
  switch (status?.toUpperCase()) {
    case 'LOST':
      color = 'warning';
      break;
    case 'FOUND':
      color = 'info';
      break;
    case 'CLAIMED':
      color = 'secondary';
      break;
    case 'RETURNED':
      color = 'success';
      break;
    case 'PENDING':
      color = 'warning';
      break;
    case 'REJECTED':
      color = 'error';
      break;
    case 'APPROVED':
      color = 'primary';
      break;
    default:
      color = 'default';
  }

  return (
    <Chip 
      label={status || 'UNKNOWN'} 
      color={color} 
      size="small" 
      sx={{ fontWeight: 'bold' }} 
      {...props} 
    />
  );
};

export default StatusChip;
