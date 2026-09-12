import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge, Menu, MenuItem, Box, Drawer, List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import { Menu as MenuIcon, Notifications, AccountCircle, Brightness4, Brightness7 } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useThemeContext } from '../../context/ThemeContext';
import { useNotificationContext } from '../../context/NotificationContext';

const Navbar = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { mode, toggleTheme } = useThemeContext();
  const { unreadCount } = useNotificationContext();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'Lost Items', path: '/lost-items' },
    { title: 'Found Items', path: '/found-items' },
    { title: 'Search', path: '/search' },
  ];

  return (
    <>
      <AppBar position="sticky" elevation={0} className="glassmorphism" sx={{ background: mode === 'light' ? 'rgba(255,255,255,0.8)' : 'rgba(17,24,39,0.8)' }}>
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'primary.main', fontWeight: 700 }}>
            CampusFind
          </Typography>
          
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
            {navLinks.map((link) => (
              <Button color="inherit" component={Link} to={link.path} key={link.title} sx={{ color: 'text.primary' }}>
                {link.title}
              </Button>
            ))}
            
            {isAdmin && (
              <Button color="secondary" component={Link} to="/admin/dashboard">
                Admin
              </Button>
            )}

            <IconButton onClick={toggleTheme} color="inherit" sx={{ color: 'text.primary' }}>
              {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            {isAuthenticated ? (
              <>
                <IconButton color="inherit" component={Link} to="/notifications" sx={{ color: 'text.primary' }}>
                  <Badge badgeContent={unreadCount} color="error">
                    <Notifications />
                  </Badge>
                </IconButton>
                <IconButton onClick={handleMenu} color="inherit" sx={{ color: 'text.primary' }}>
                  <AccountCircle />
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                  <MenuItem component={Link} to="/profile" onClick={handleClose}>Profile</MenuItem>
                  <MenuItem component={Link} to="/dashboard" onClick={handleClose}>Dashboard</MenuItem>
                  <MenuItem component={Link} to="/my-items" onClick={handleClose}>My Items</MenuItem>
                  <MenuItem component={Link} to="/my-claims" onClick={handleClose}>My Claims</MenuItem>
                  <MenuItem onClick={() => { handleClose(); logout(); navigate('/login'); }}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button color="primary" variant="outlined" component={Link} to="/login">Login</Button>
                <Button color="primary" variant="contained" component={Link} to="/register">Register</Button>
              </>
            )}
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton color="inherit" onClick={() => setMobileOpen(true)} sx={{ color: 'text.primary' }}><MenuIcon /></IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <List sx={{ width: 250 }}>
          {navLinks.map((item) => (
            <ListItem key={item.title} disablePadding>
              <ListItemButton component={Link} to={item.path} onClick={() => setMobileOpen(false)}>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;
