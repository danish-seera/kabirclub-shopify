'use server';

import { addToCart, removeFromCart, updateCartItem } from '@/lib/supabase/api';
import { cookies } from 'next/headers';

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
    return 'Missing product ID';
  }

  try {
    await addToCart({
      productId,
      quantity,
      sessionId
    });
  } catch (e) {
    return 'Error adding item to cart';
  }
}

export async function removeItem(prevState: any, lineId: string) {
  try {
    await removeFromCart(lineId);
  } catch (e) {
    return 'Error removing item from cart';
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
      return;
    }

    await updateCartItem({
      itemId: lineId,
      quantity
    });
  } catch (e) {
    return 'Error updating item quantity';
  }
}
