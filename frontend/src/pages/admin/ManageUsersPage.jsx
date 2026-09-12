import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, CircularProgress, TextField } from '@mui/material';
import * as adminApi from '../../api/adminApi';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const ManageUsersPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAllUsers(0, 100, search);
      const data = res?.data || res;
      const list = data?.content || (Array.isArray(data) ? data : []);
      setUsers(list);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const handleToggleStatus = async (targetUser) => {
    if (currentUser?.email === targetUser.email) {
      toast.error("You cannot deactivate your own admin account.");
      return;
    }
    try {
      if (targetUser.active) {
        await adminApi.deactivateUser(targetUser.id);
        toast.success(`User ${targetUser.firstName} deactivated`);
      } else {
        await adminApi.activateUser(targetUser.id);
        toast.success(`User ${targetUser.firstName} activated`);
      }
      fetchUsers();
    } catch (error) {
      console.error('Failed to toggle status:', error);
      toast.error('Failed to change user status');
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Manage Users</Typography>
      
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Search by Name or Email"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Phone Number</strong></TableCell>
                <TableCell><strong>Role</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length > 0 ? (
                users.map((u) => {
                  const name = `${u.firstName} ${u.lastName}`;
                  const isSelf = currentUser?.email === u.email;
                  
                  return (
                    <TableRow key={u.id}>
                      <TableCell>{name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.phoneNumber || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={u.role} 
                          color={u.role === 'ROLE_ADMIN' ? 'secondary' : 'default'} 
                          size="small" 
                          sx={{ fontWeight: 'bold' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={u.active ? 'ACTIVE' : 'INACTIVE'} 
                          color={u.active ? 'success' : 'error'} 
                          size="small" 
                          sx={{ fontWeight: 'bold' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Button 
                          variant="outlined" 
                          size="small" 
                          color={u.active ? 'error' : 'success'} 
                          disabled={isSelf}
                          onClick={() => handleToggleStatus(u)}
                        >
                          {u.active ? 'Deactivate' : 'Activate'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">No users found.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ManageUsersPage;
