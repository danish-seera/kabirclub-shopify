'use client';

import { getCart } from '@/lib/supabase/api';
import { Cart } from '@/lib/supabase/types';
import { useEffect, useState } from 'react';
import CartModal from './modal';

export default function Cart() {
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
      if (sessionId) {
        fetchCart(sessionId);
      }
    };

    // Listen for custom cart update events
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [sessionId]);

  return <CartModal cart={cart || undefined} />;
}
