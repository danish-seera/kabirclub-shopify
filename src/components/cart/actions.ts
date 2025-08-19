'use server';

import { addToCart, removeFromCart, updateCartItem } from '@/lib/supabase/api';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function addItem(prevState: any, payload: { productId: string; quantity: number; size: string } | string) {
  let sessionId = cookies().get('sessionId')?.value;
  
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15);
    cookies().set('sessionId', sessionId);
  }

  // Handle both old string format and new object format
  let productId: string;
  let quantity: number = 1;

  if (typeof payload === 'string') {
    productId = payload;
  } else {
    productId = payload.productId;
    quantity = payload.quantity;
  }

  if (!productId) {
    return { success: false, error: 'Missing product ID' };
  }

  try {
    await addToCart({
      productId,
      quantity,
      sessionId
    });
    
    // Revalidate cart-related pages
    revalidatePath('/');
    revalidatePath('/cart');
    
    return { success: true, message: 'Item added to cart successfully' };
  } catch (e) {
    return { success: false, error: 'Error adding item to cart' };
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
