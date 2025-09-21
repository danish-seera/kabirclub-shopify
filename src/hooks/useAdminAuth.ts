'use client';

import { useAuth } from './useAuth';

// Admin emails - yahan aap apne admin emails add kar sakte hain
const ADMIN_EMAILS = [
  'admin@kabirclub.com',
  'mohd.danish@kabirclub.com',
  'owner@kabirclub.com'
];

export function useAdminAuth() {
  const { user, isLoading, isAuthenticated, login, logout, refreshAuth } = useAuth();

  const isAdmin = () => {
    if (!user || !user.email) return false;
    return ADMIN_EMAILS.includes(user.email.toLowerCase());
  };

  const requireAdmin = () => {
    if (!isAuthenticated()) {
      throw new Error('Authentication required');
    }
    if (!isAdmin()) {
      throw new Error('Admin access required');
    }
    return true;
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    requireAdmin,
    login,
    logout,
    refreshAuth
  };
}
