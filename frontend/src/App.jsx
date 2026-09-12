import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CssBaseline } from '@mui/material';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import ErrorBoundary from './components/common/ErrorBoundary';

import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';
import PublicRoute from './routes/PublicRoute';

import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

import DashboardPage from './pages/dashboard/DashboardPage';
import LostItemsPage from './pages/items/LostItemsPage';
import FoundItemsPage from './pages/items/FoundItemsPage';
import ReportLostItemPage from './pages/items/ReportLostItemPage';
import ReportFoundItemPage from './pages/items/ReportFoundItemPage';
import ItemDetailPage from './pages/items/ItemDetailPage';
import ClaimItemPage from './pages/claims/ClaimItemPage';
import MyClaimsPage from './pages/claims/MyClaimsPage';
import MyItemsPage from './pages/profile/MyItemsPage';
import NotificationsPage from './pages/profile/NotificationsPage';
import ProfilePage from './pages/profile/ProfilePage';
import ContactPage from './pages/contact/ContactPage';

import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import ManageItemsPage from './pages/admin/ManageItemsPage';
import ManageClaimsPage from './pages/admin/ManageClaimsPage';
import ReportsPage from './pages/admin/ReportsPage';

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <NotificationProvider>
            <CssBaseline />
            <BrowserRouter>
              <Routes>
                {/* Public Auth Routes */}
                <Route element={<Layout><PublicRoute /></Layout>}>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                </Route>

                {/* Public Routes with Layout */}
                <Route path="/" element={<Layout><LandingPage /></Layout>} />
                <Route path="/lost-items" element={<Layout><LostItemsPage /></Layout>} />
                <Route path="/found-items" element={<Layout><FoundItemsPage /></Layout>} />
                <Route path="/search" element={<Layout><LostItemsPage /></Layout>} />
                <Route path="/items/:type/:id" element={<Layout><ItemDetailPage /></Layout>} />
                <Route path="/contact" element={<Layout><ContactPage /></Layout>} />

                {/* Private User Routes */}
                <Route element={<PrivateRoute />}>
                  <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
                  <Route path="/report-lost" element={<Layout><ReportLostItemPage /></Layout>} />
                  <Route path="/report-found" element={<Layout><ReportFoundItemPage /></Layout>} />
                  <Route path="/claim/:id" element={<Layout><ClaimItemPage /></Layout>} />
                  <Route path="/my-claims" element={<Layout><MyClaimsPage /></Layout>} />
                  <Route path="/my-items" element={<Layout><MyItemsPage /></Layout>} />
                  <Route path="/notifications" element={<Layout><NotificationsPage /></Layout>} />
                  <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminRoute />}>
                  <Route path="dashboard" element={<AdminLayout><AdminDashboardPage /></AdminLayout>} />
                  <Route path="users" element={<AdminLayout><ManageUsersPage /></AdminLayout>} />
                  <Route path="lost-items" element={<AdminLayout><ManageItemsPage type="LOST" /></AdminLayout>} />
                  <Route path="found-items" element={<AdminLayout><ManageItemsPage type="FOUND" /></AdminLayout>} />
                  <Route path="claims" element={<AdminLayout><ManageClaimsPage /></AdminLayout>} />
                  <Route path="reports" element={<AdminLayout><ReportsPage /></AdminLayout>} />
                </Route>
              </Routes>
            </BrowserRouter>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="colored" />
          </NotificationProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
