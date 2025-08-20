'use client';

import { useEffect, useState } from 'react';

interface User {
  email: string;
  name: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on component mount
    const checkAuthStatus = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      const userEmail = localStorage.getItem('userEmail');
      const userName = localStorage.getItem('userName');

      if (isLoggedIn === 'true' && userEmail && userName) {
        setUser({ email: userEmail, name: userName });
      } else {
        setUser(null);
      }
      
      setIsLoading(false);
    };

    checkAuthStatus();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'isLoggedIn' || e.key === 'userEmail' || e.key === 'userName') {
        checkAuthStatus();
      }
    };

    // Listen for custom logout events
    const handleLogoutEvent = () => {
      setUser(null);
      setIsLoading(false);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userLogout', handleLogoutEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLogout', handleLogoutEvent);
    };
  }, []);

  const login = (email: string, name: string) => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', name);
    setUser({ email, name });
  };

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    setUser(null);
    
    // Dispatch custom event for immediate state sync
    window.dispatchEvent(new CustomEvent('userLogout'));
  };

  const isAuthenticated = () => {
    // Check both state and localStorage for immediate response
    if (user) return true;
    
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');
    
    return isLoggedIn === 'true' && userEmail && userName;
  };

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated
  };
}
