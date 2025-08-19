'use server';

import { addToCart, getCart, removeFromCart, updateCartItem } from '@/lib/supabase/api';
import { cookies } from 'next/headers';

export async function addItem(prevState: any, selectedVariantId: string | undefined) {
  let sessionId = cookies().get('sessionId')?.value;
  
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15);
    cookies().set('sessionId', sessionId);
  }

  if (!selectedVariantId) {
    return 'Missing product variant ID';
  }

  try {
    await addToCart({
      productId: selectedVariantId,
      quantity: 1,
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
