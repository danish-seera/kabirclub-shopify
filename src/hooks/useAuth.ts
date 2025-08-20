'use client';

import { useEffect, useState } from 'react';

export interface User {
  email: string;
  name: string;
  phone?: string;
  created_at?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Ensure we're on the client side and mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuthenticated = () => {
    // Server-side safety check
    if (typeof window === 'undefined' || !mounted) {
      return false;
    }
    
    // Check both state and localStorage for immediate response
    if (user) return true;
    
    try {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      const userEmail = localStorage.getItem('userEmail');
      const userName = localStorage.getItem('userName');
      
      return isLoggedIn === 'true' && userEmail && userName;
    } catch (error) {
      console.error('localStorage access error:', error);
      return false;
    }
  };

  const login = (email: string, name: string, phone?: string) => {
    // Server-side safety check
    if (typeof window === 'undefined' || !mounted) return;
    
    try {
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
    } catch (error) {
      console.error('localStorage set error:', error);
    }
  };

  const logout = () => {
    // Server-side safety check
    if (typeof window === 'undefined' || !mounted) return;
    
    try {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      localStorage.removeItem('userPhone');
      localStorage.removeItem('userCreatedAt');
      setUser(null);
      
      // Dispatch custom event for immediate state sync
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('userLogout'));
      }
    } catch (error) {
      console.error('localStorage remove error:', error);
    }
  };

  useEffect(() => {
    // Server-side safety check
    if (typeof window === 'undefined' || !mounted) return;
    
    const checkAuthStatus = () => {
      try {
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
      } catch (error) {
        console.error('localStorage get error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
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

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('userLogout', handleLogoutEvent);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('userLogout', handleLogoutEvent);
      };
    }
  }, [mounted]);

  // Return consistent state based on mounting
  if (!mounted) {
    return {
      user: null,
      isLoading: true,
      isAuthenticated: () => false,
      login: () => {},
      logout: () => {}
    };
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout
  };
}
