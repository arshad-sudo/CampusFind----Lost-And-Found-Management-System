import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, useTheme, useMediaQuery } from '@mui/material';
import { Dashboard, People, Search, FindInPage, AssuredWorkload, Assessment, Feedback } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
    { text: 'Users', icon: <People />, path: '/admin/users' },
    { text: 'Lost Items', icon: <Search />, path: '/admin/lost-items' },
    { text: 'Found Items', icon: <FindInPage />, path: '/admin/found-items' },
    { text: 'Claims', icon: <AssuredWorkload />, path: '/admin/claims' },
    { text: 'Reports', icon: <Assessment />, path: '/admin/reports' },
    { text: 'Feedback', icon: <Feedback />, path: '/admin/feedback' },
  ];

  const drawer = (
    <Box sx={{ mt: 8 }}>
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={Link} 
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': { bgcolor: 'primary.light', color: 'primary.contrastText', '& .MuiListItemIcon-root': { color: 'primary.contrastText' } }
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      {isMobile ? (
        <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}>
          {drawer}
        </Drawer>
      ) : (
        <Drawer variant="permanent" sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, zIndex: 1 } }} open>
          {drawer}
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
