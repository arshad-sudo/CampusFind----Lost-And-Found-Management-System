import React, { useState } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Button } from '@mui/material';
import { Delete as DeleteIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([
    { id: '1', message: 'Your claim for "MacBook Charger" has been approved.', date: '2023-10-10 14:00', read: false },
    { id: '2', message: 'A new item matching your lost item "Black Wallet" has been found.', date: '2023-10-09 09:30', read: true },
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Notifications</Typography>
        <Button variant="outlined" color="error" onClick={clearAll} disabled={notifications.length === 0}>
          Clear All
        </Button>
      </Box>

      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <List sx={{ p: 0 }}>
          {notifications.map((notif, index) => (
            <React.Fragment key={notif.id}>
              <ListItem 
                sx={{ 
                  bgcolor: notif.read ? 'transparent' : 'rgba(25, 118, 210, 0.08)',
                  borderBottom: index < notifications.length - 1 ? '1px solid rgba(0,0,0,0.08)' : 'none'
                }}
              >
                <ListItemText 
                  primary={notif.message} 
                  secondary={notif.date}
                  primaryTypographyProps={{ fontWeight: notif.read ? 'normal' : 'bold' }}
                />
                {!notif.read && (
                  <ListItemSecondaryAction>
                    <IconButton edge="end" color="primary" onClick={() => markAsRead(notif.id)}>
                      <CheckCircleIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            </React.Fragment>
          ))}
          {notifications.length === 0 && (
            <ListItem>
              <ListItemText primary="No notifications." sx={{ textAlign: 'center' }} />
            </ListItem>
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default NotificationsPage;
