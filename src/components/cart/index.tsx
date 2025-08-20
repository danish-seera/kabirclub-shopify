'use client';

import { useAuth } from '@/hooks/useAuth';
import { getCart } from '@/lib/supabase/api';
import { Cart } from '@/lib/supabase/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CartModal from './modal';

export default function Cart() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    // Get sessionId from cookies
    const getSessionId = () => {
      const cookies = document.cookie.split(';');
      const sessionCookie = cookies.find(cookie => cookie.trim().startsWith('sessionId='));
      if (sessionCookie) {
        return sessionCookie.split('=')[1];
      }
      return null;
    };

    const currentSessionId = getSessionId();
    setSessionId(currentSessionId || '');

    if (currentSessionId) {
      fetchCart(currentSessionId);
    }
  }, []);

  // Clear cart when user logs out
  useEffect(() => {
    if (!isAuthenticated() || !user) {
      setCart(null);
      setSessionId('');
    }
  }, [isAuthenticated, user]);

  const fetchCart = async (sid: string) => {
    try {
      const cartData = await getCart(sid);
      setCart(cartData);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  // Listen for cart updates
  useEffect(() => {
    const handleCartUpdate = () => {
      if (sessionId && isAuthenticated()) {
        fetchCart(sessionId);
      }
    };

    // Listen for custom cart update events
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [sessionId, isAuthenticated]);

  // Listen for logout events to immediately clear cart
  useEffect(() => {
    const handleUserLogout = () => {
      setCart(null);
      setSessionId('');
    };

    window.addEventListener('userLogout', handleUserLogout);
    
    return () => {
      window.removeEventListener('userLogout', handleUserLogout);
    };
  }, []);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="w-6 h-6 md:w-6 md:h-6 bg-gray-800 rounded animate-pulse"></div>
    );
  }

  // Don't show cart icon for non-authenticated users
  if (!isAuthenticated() || !user) {
    return null;
  }

  return (
    <div className="relative group">
      <CartModal cart={cart || undefined} />
      {/* Tooltip for authenticated users */}
      <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        View Cart ({cart?.totalQuantity || 0} items)
        <div className="absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
}
