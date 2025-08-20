'use client';

import { useAuth } from '@/hooks/useAuth';
import { getCart } from '@/lib/supabase/api';
import { Cart as CartType } from '@/lib/supabase/types';
import { useCallback, useEffect, useState } from 'react';
import CartModal from './modal';

export default function Cart() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [cart, setCart] = useState<CartType | null>(null);
  const [sessionId, setSessionId] = useState('');

  const fetchCart = useCallback(async (sid: string) => {
    try {
      console.log('Fetching cart for sessionId:', sid);
      const cartData = await getCart(sid);
      console.log('Cart data received:', cartData);
      setCart(cartData);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  }, []);

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
      fetchCart(currentSessionId);  // Always fetch cart if sessionId exists
    }
  }, [fetchCart]);

  // Clear cart when user logs out
  useEffect(() => {
    if (!isAuthenticated() || !user) {
      setCart(null);
      setSessionId('');
    }
  }, [isAuthenticated, user]);

  // Listen for cart updates
  useEffect(() => {
    const handleCartUpdate = () => {
      // Get current sessionId from cookies directly
      const cookies = document.cookie.split(';');
      const sessionCookie = cookies.find(cookie => cookie.trim().startsWith('sessionId='));
      const currentSessionId = sessionCookie ? sessionCookie.split('=')[1] : null;
      
      if (currentSessionId) {
        console.log('Cart update event received, fetching cart for sessionId:', currentSessionId);
        fetchCart(currentSessionId);
      } else {
        console.log('No sessionId found in cookies');
      }
    };

    // Listen for custom cart update events
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [fetchCart]); // Remove sessionId dependency

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

  // Always show cart icon, but handle authentication in the modal
  return (
    <div className="relative group">
      <CartModal cart={cart || undefined} />
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        {isAuthenticated() && user 
          ? `View Cart (${cart?.totalQuantity || 0} items)`
          : 'Login to view cart'
        }
        <div className="absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
}
