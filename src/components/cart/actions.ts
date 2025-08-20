'use server';

import { addToCart, removeFromCart, updateCartItem } from '@/lib/supabase/api';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function addItem(prevState: any, payload: { productId: string; quantity: number; size: string } | string) {
  console.log('addItem called with payload:', payload);
  
  let sessionId = cookies().get('sessionId')?.value;
  console.log('Current sessionId:', sessionId);
  
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15);
    cookies().set('sessionId', sessionId);
    console.log('Generated new sessionId:', sessionId);
  }

  // Handle both old string format and new object format
  let productId: string;
  let quantity: number = 1;
  let size: string = 'M';

  if (typeof payload === 'string') {
    productId = payload;
  } else {
    productId = payload.productId;
    quantity = payload.quantity;
    size = payload.size;
  }

  console.log('Processed payload:', { productId, quantity, size, sessionId });

  if (!productId) {
    console.error('Missing product ID');
    return { success: false, error: 'Missing product ID' };
  }

  try {
    console.log('Calling addToCart with:', { productId, quantity, sessionId });
    
    const result = await addToCart({
      productId,
      quantity,
      sessionId
    });
    
    console.log('addToCart result:', result);
    
    if (result) {
      // Revalidate cart-related pages
      revalidatePath('/');
      revalidatePath('/cart');
      
      return { success: true, message: 'Item added to cart successfully', data: result };
    } else {
      return { success: false, error: 'Failed to add item to cart - no result returned' };
    }
  } catch (e: any) {
    console.error('Error in addItem:', e);
    return { success: false, error: `Error adding item to cart: ${e.message || e}` };
  }
}

export async function removeItem(prevState: any, lineId: string) {
  try {
    await removeFromCart(lineId);
    
    // Revalidate cart-related pages
    revalidatePath('/');
    revalidatePath('/cart');
    
    return { success: true, message: 'Item removed from cart successfully' };
  } catch (e) {
    return { success: false, error: 'Error removing item from cart' };
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    lineId: string;
    variantId: string;
    quantity: number;
  }
) {
  const { lineId, quantity } = payload;

  try {
    if (quantity === 0) {
      await removeFromCart(lineId);
    } else {
      await updateCartItem({
        itemId: lineId,
        quantity
      });
    }
    
    // Revalidate cart-related pages
    revalidatePath('/');
    revalidatePath('/cart');
    
    return { success: true, message: 'Cart updated successfully' };
  } catch (e) {
    return { success: false, error: 'Error updating item quantity' };
  }
}
