'use client';

import { useEffect, useState } from 'react';

interface User {
  email: string;
  name: string;
  phone?: string;
  created_at?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Server-side safety check
    if (typeof window === 'undefined') return;
    
    const checkAuthStatus = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      const userEmail = localStorage.getItem('userEmail');
      const userName = localStorage.getItem('userName');
      const userPhone = localStorage.getItem('userPhone');
      const userCreatedAt = localStorage.getItem('userCreatedAt');

      if (isLoggedIn === 'true' && userEmail && userName) {
        setUser({ 
          email: userEmail, 
          name: userName,
          phone: userPhone || undefined,
          created_at: userCreatedAt || new Date().toISOString()
        });
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

  const login = (email: string, name: string, phone?: string) => {
    // Server-side safety check
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', name);
    if (phone) {
      localStorage.setItem('userPhone', phone);
    }
    localStorage.setItem('userCreatedAt', new Date().toISOString());
    
    setUser({ 
      email, 
      name, 
      phone: phone || undefined,
      created_at: new Date().toISOString()
    });
  };

  const logout = () => {
    // Server-side safety check
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userCreatedAt');
    setUser(null);
    
    // Dispatch custom event for immediate state sync
    window.dispatchEvent(new CustomEvent('userLogout'));
  };

  const isAuthenticated = () => {
    // Server-side safety check
    if (typeof window === 'undefined') {
      return false;
    }
    
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
