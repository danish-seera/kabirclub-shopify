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
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');

    if (isLoggedIn === 'true' && userEmail && userName) {
      setUser({ email: userEmail, name: userName });
    }
    
    setIsLoading(false);
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
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated
  };
}
