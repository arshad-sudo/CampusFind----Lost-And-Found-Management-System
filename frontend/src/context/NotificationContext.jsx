import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import * as notificationApi from '../api/notificationApi';

const NotificationContext = createContext();

export const useNotificationContext = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated } = useAuth();

  const refreshNotifications = async () => {
    if (isAuthenticated) {
      try {
        const res = await notificationApi.getUnreadCount();
        const countVal = res?.data !== undefined ? res.data : res;
        const countNum = typeof countVal === 'number' ? countVal : 0;
        setUnreadCount(countNum);
      } catch (error) {
        console.error('Failed to fetch notifications', error);
        setUnreadCount(0);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshNotifications();
      const interval = setInterval(refreshNotifications, 30000);
      return () => clearInterval(interval);
    } else {
      setUnreadCount(0);
    }
  }, [isAuthenticated]);

  return (
    <NotificationContext.Provider value={{ unreadCount, refreshNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
